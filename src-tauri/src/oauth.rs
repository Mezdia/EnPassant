//! Lichess OAuth (authorization code + PKCE).
//!
//! The two platform families differ only in how the provider gets the
//! authorization code back to us:
//!
//! * **Desktop** redirects to `http://127.0.0.1:<port>/callback`, served by a
//!   throwaway axum server started when the flow begins.
//! * **Mobile** has no loopback address an external browser can hand control
//!   back through, so it redirects to `enpassant://oauth/callback` and the
//!   deep-link plugin delivers the URL as a VIEW intent.
//!
//! Both paths funnel into [`exchange_code`], which verifies the CSRF state,
//! swaps the code for a token and emits the same `access_token` event.

#[cfg(desktop)]
use axum::{extract::Query, response::IntoResponse, routing::get, Extension, Router};
use log::info;
use oauth2::{
    basic::BasicClient, reqwest::async_http_client, AuthUrl, AuthorizationCode, ClientId,
    CsrfToken, PkceCodeChallenge, PkceCodeVerifier, RedirectUrl, Scope, TokenResponse, TokenUrl,
};
#[cfg(desktop)]
use serde::Deserialize;
#[cfg(desktop)]
use std::net::{SocketAddr, TcpListener};
use std::sync::Arc;
use tauri::{Emitter, Manager};
use tauri_plugin_opener::OpenerExt;

use crate::{error::Error, AppState};

/// Custom URI scheme registered for the app; also the deep-link scheme declared
/// in `tauri.conf.json` under `plugins.deep-link.mobile`.
#[cfg(mobile)]
pub const OAUTH_SCHEME: &str = "enpassant";

fn create_client(redirect_url: RedirectUrl) -> BasicClient {
    let client_id = ClientId::new("ir.enpassant.app".to_string());
    let auth_url = AuthUrl::new("https://lichess.org/oauth".to_string());
    let token_url = TokenUrl::new("https://lichess.org/api/token".to_string());

    BasicClient::new(client_id, None, auth_url.unwrap(), token_url.ok())
        .set_redirect_uri(redirect_url)
}

#[cfg(desktop)]
fn get_available_addr() -> SocketAddr {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let addr = listener.local_addr().unwrap();
    drop(listener);

    addr
}

#[derive(Clone)]
pub struct AuthState {
    pub csrf_token: CsrfToken,
    pub pkce: Arc<(PkceCodeChallenge, String)>,
    pub client: Arc<BasicClient>,
    #[cfg(desktop)]
    pub socket_addr: SocketAddr,
}

impl Default for AuthState {
    fn default() -> Self {
        let (pkce_code_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();
        #[cfg(desktop)]
        let socket_addr = get_available_addr();
        #[cfg(desktop)]
        let redirect_url = format!("http://{socket_addr}/callback");
        #[cfg(mobile)]
        let redirect_url = format!("{OAUTH_SCHEME}://oauth/callback");
        AuthState {
            csrf_token: CsrfToken::new_random(),
            pkce: Arc::new((
                pkce_code_challenge,
                PkceCodeVerifier::secret(&pkce_code_verifier).to_string(),
            )),
            client: Arc::new(create_client(RedirectUrl::new(redirect_url).unwrap())),
            #[cfg(desktop)]
            socket_addr,
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn authenticate(
    username: String,
    state: tauri::State<'_, AppState>,
    app: tauri::AppHandle,
) -> Result<(), Error> {
    info!("Authenticating user {}", username);
    let (auth_url, _) = state
        .auth
        .client
        .authorize_url(|| state.auth.csrf_token.clone())
        .add_scope(Scope::new("preference:read".to_string()))
        .add_extra_param("username", username)
        .set_pkce_challenge(state.auth.pkce.0.clone())
        .url();
    app.opener().open_url(auth_url.as_str(), None::<&str>)?;
    // Mobile waits for the deep link instead (see `complete_from_deep_link`).
    #[cfg(desktop)]
    let _server_handle = tauri::async_runtime::spawn(async move { run_server(app).await });
    Ok(())
}

/// Verifies the callback, exchanges the code and hands the token to the webview.
async fn exchange_code(app: &tauri::AppHandle, code: String, state: String) -> Result<(), Error> {
    let (client, pkce_verifier, csrf_token) = {
        let app_state = app.state::<AppState>();
        let auth = &app_state.auth;
        (
            auth.client.clone(),
            auth.pkce.1.clone(),
            auth.csrf_token.secret().clone(),
        )
    };

    // Anything that did not come from the URL we opened — a forged intent, a
    // stray command line argument — cannot know this session's state value.
    if state != csrf_token {
        info!("Suspected Man in the Middle attack!");
        return Ok(());
    }

    let token = client
        .exchange_code(AuthorizationCode::new(code))
        .set_pkce_verifier(PkceCodeVerifier::new(pkce_verifier))
        .request_async(async_http_client)
        .await
        .map_err(|e| Error::OAuth(e.to_string()))?;

    app.emit("access_token", token.access_token().secret())?;
    Ok(())
}

/// Handles a deep link, or holds it back until the webview can receive the token.
///
/// Nothing listens for the `access_token` event until the frontend has mounted,
/// so a link that arrives with the launch itself waits for [`webview_ready`].
#[cfg(mobile)]
pub fn on_deep_link(app: tauri::AppHandle, url: url::Url) {
    if WEBVIEW_READY.load(std::sync::atomic::Ordering::SeqCst) {
        complete_from_deep_link(app, url);
    } else {
        PENDING_LINKS
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .push(url);
    }
}

/// Releases the links held back so far; called once the frontend is listening.
#[cfg(mobile)]
pub fn webview_ready(app: &tauri::AppHandle) {
    WEBVIEW_READY.store(true, std::sync::atomic::Ordering::SeqCst);
    let queued = std::mem::take(&mut *PENDING_LINKS.lock().unwrap_or_else(|e| e.into_inner()));
    for url in queued {
        complete_from_deep_link(app.clone(), url);
    }
}

/// Completes the flow from an `enpassant://oauth/callback?code=…&state=…` URL.
///
/// Called for every deep link the app receives, so anything that is not an
/// OAuth callback is ignored.
#[cfg(mobile)]
fn complete_from_deep_link(app: tauri::AppHandle, url: url::Url) {
    if url.scheme() != OAUTH_SCHEME {
        return;
    }

    let mut code = None;
    let mut state = None;
    for (key, value) in url.query_pairs() {
        match key.as_ref() {
            "code" => code = Some(value.into_owned()),
            "state" => state = Some(value.into_owned()),
            _ => {}
        }
    }
    let (Some(code), Some(state)) = (code, state) else {
        info!("Ignoring deep link without OAuth callback parameters");
        return;
    };

    // A cold start can surface the same URL through both `get_current()` and the
    // `on_open_url` event, and Android may redeliver the intent; exchanging the
    // same code twice would fail on the provider side.
    {
        let mut last = LAST_HANDLED_CODE.lock().unwrap_or_else(|e| e.into_inner());
        if last.as_deref() == Some(code.as_str()) {
            return;
        }
        *last = Some(code.clone());
    }

    tauri::async_runtime::spawn(async move {
        if let Err(e) = exchange_code(&app, code, state).await {
            log::error!("Failed to complete the OAuth flow: {e}");
        }
    });
}

#[cfg(mobile)]
static LAST_HANDLED_CODE: std::sync::Mutex<Option<String>> = std::sync::Mutex::new(None);

/// Whether the frontend has started, and can therefore be handed a token.
#[cfg(mobile)]
static WEBVIEW_READY: std::sync::atomic::AtomicBool = std::sync::atomic::AtomicBool::new(false);

/// Deep links received before the frontend was listening for the token.
#[cfg(mobile)]
static PENDING_LINKS: std::sync::Mutex<Vec<url::Url>> = std::sync::Mutex::new(Vec::new());

#[cfg(desktop)]
#[derive(Deserialize)]
struct CallbackQuery {
    code: String,
    state: String,
}

#[cfg(desktop)]
async fn authorize(
    Extension(app): Extension<tauri::AppHandle>,
    Query(CallbackQuery { code, state }): Query<CallbackQuery>,
) -> impl IntoResponse {
    if let Err(e) = exchange_code(&app, code, state).await {
        log::error!("Failed to complete the OAuth flow: {e}");
    }

    "authorized".to_string() // never let them know your next move
}

#[cfg(desktop)]
async fn run_server(handle: tauri::AppHandle) -> Result<(), axum::Error> {
    let app = Router::new()
        .route("/callback", get(authorize))
        .layer(Extension(handle.clone()));

    let addr = handle.state::<AppState>().auth.socket_addr;
    let _ = axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await;

    Ok(())
}
