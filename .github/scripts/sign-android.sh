#!/usr/bin/env bash
# Aligns and signs the release APK/AAB produced by `tauri android build`, then
# stages them under `android-artifacts/` with release-ready file names.
#
# Signing happens here rather than through Gradle so that no keystore secret has
# to be written into `src-tauri/gen/android/`, which CI regenerates every run.
# Without a keystore secret the artifacts are still staged, unsigned, so forks
# and dry runs get something to inspect.
set -euo pipefail

outputs="src-tauri/gen/android/app/build/outputs"
staging="android-artifacts"
app="$(jq -r .productName src-tauri/tauri.conf.json)"
version="$(jq -r .version package.json)"
tmp="${RUNNER_TEMP:-/tmp}"
mkdir -p "$staging"

keystore=""
if [ -n "${ANDROID_KEYSTORE_BASE64:-}" ]; then
    keystore="$tmp/android-keystore.jks"
    printf '%s' "$ANDROID_KEYSTORE_BASE64" | base64 -d >"$keystore"
else
    echo "::warning::ANDROID_KEYSTORE_BASE64 is not set; Android artifacts will be unsigned."
fi

# Gradle lays the ABI flavour out as `apk/<flavour>/release/…` for APKs and
# `bundle/<flavour>Release/…` for bundles.
flavour_of() {
    local flavour
    flavour="$(basename "$(dirname "$1")")"
    flavour="${flavour%Release}"
    if [ "$flavour" = "release" ]; then
        flavour="$(basename "$(dirname "$(dirname "$1")")")"
    fi
    printf '%s' "$flavour"
}

if [ -d "$outputs/apk" ]; then
    while IFS= read -r -d '' apk; do
        target="$staging/${app}_${version}_$(flavour_of "$apk").apk"
        if [ -n "$keystore" ]; then
            aligned="$tmp/$(basename "$apk" .apk)-aligned.apk"
            zipalign -p -f 4 "$apk" "$aligned"
            args=(--ks "$keystore" --ks-pass "env:ANDROID_KEYSTORE_PASSWORD")
            if [ -n "${ANDROID_KEY_PASSWORD:-}" ]; then
                args+=(--key-pass "env:ANDROID_KEY_PASSWORD")
            fi
            if [ -n "${ANDROID_KEY_ALIAS:-}" ]; then
                args+=(--ks-key-alias "$ANDROID_KEY_ALIAS")
            fi
            apksigner sign "${args[@]}" --out "$target" "$aligned"
            apksigner verify "$target"
        else
            cp "$apk" "$target"
        fi
        echo "Staged $target"
    done < <(find "$outputs/apk" -name '*.apk' -print0)
fi

if [ -d "$outputs/bundle" ]; then
    while IFS= read -r -d '' aab; do
        target="$staging/${app}_${version}_$(flavour_of "$aab").aab"
        # `jarsigner` needs an explicit alias, unlike `apksigner`.
        if [ -n "$keystore" ] && [ -n "${ANDROID_KEY_ALIAS:-}" ]; then
            args=(-keystore "$keystore" -storepass:env ANDROID_KEYSTORE_PASSWORD)
            if [ -n "${ANDROID_KEY_PASSWORD:-}" ]; then
                args+=(-keypass:env ANDROID_KEY_PASSWORD)
            fi
            jarsigner "${args[@]}" -signedjar "$target" "$aab" "$ANDROID_KEY_ALIAS"
        else
            if [ -n "$keystore" ]; then
                echo "::warning::ANDROID_KEY_ALIAS is not set; the AAB will be unsigned."
            fi
            cp "$aab" "$target"
        fi
        echo "Staged $target"
    done < <(find "$outputs/bundle" -name '*.aab' -print0)
fi

if [ -z "$(ls -A "$staging")" ]; then
    echo "::error::No Android artifacts were found under $outputs"
    exit 1
fi
