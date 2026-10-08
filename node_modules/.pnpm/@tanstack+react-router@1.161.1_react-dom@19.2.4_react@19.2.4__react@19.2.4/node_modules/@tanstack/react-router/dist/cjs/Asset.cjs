"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const isServer = require("@tanstack/router-core/isServer");
const useRouter = require("./useRouter.cjs");
const ClientOnly = require("./ClientOnly.cjs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React);
function Asset({
  tag,
  attrs,
  children,
  nonce
}) {
  switch (tag) {
    case "title":
      return /* @__PURE__ */ jsxRuntime.jsx("title", { ...attrs, suppressHydrationWarning: true, children });
    case "meta":
      return /* @__PURE__ */ jsxRuntime.jsx("meta", { ...attrs, suppressHydrationWarning: true });
    case "link":
      return /* @__PURE__ */ jsxRuntime.jsx("link", { ...attrs, nonce, suppressHydrationWarning: true });
    case "style":
      return /* @__PURE__ */ jsxRuntime.jsx(
        "style",
        {
          ...attrs,
          dangerouslySetInnerHTML: { __html: children },
          nonce
        }
      );
    case "script":
      return /* @__PURE__ */ jsxRuntime.jsx(Script, { attrs, children });
    default:
      return null;
  }
}
function Script({
  attrs,
  children
}) {
  const router = useRouter.useRouter();
  const hydrated = ClientOnly.useHydrated();
  const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
  if (process.env.NODE_ENV !== "production" && attrs?.src && typeof children === "string" && children.trim().length) {
    console.warn(
      "[TanStack Router] <Script> received both `src` and `children`. The `children` content will be ignored. Remove `children` or remove `src`."
    );
  }
  React__namespace.useEffect(() => {
    if (dataScript) return;
    if (attrs?.src) {
      const normSrc = (() => {
        try {
          const base = document.baseURI || window.location.href;
          return new URL(attrs.src, base).href;
        } catch {
          return attrs.src;
        }
      })();
      const existingScript = Array.from(
        document.querySelectorAll("script[src]")
      ).find((el) => el.src === normSrc);
      if (existingScript) {
        return;
      }
      const script = document.createElement("script");
      for (const [key, value] of Object.entries(attrs)) {
        if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) {
          script.setAttribute(
            key,
            typeof value === "boolean" ? "" : String(value)
          );
        }
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
    if (typeof children === "string") {
      const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
      const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
      const existingScript = Array.from(
        document.querySelectorAll("script:not([src])")
      ).find((el) => {
        if (!(el instanceof HTMLScriptElement)) return false;
        const sType = el.getAttribute("type") ?? "text/javascript";
        const sNonce = el.getAttribute("nonce") ?? void 0;
        return el.textContent === children && sType === typeAttr && sNonce === nonceAttr;
      });
      if (existingScript) {
        return;
      }
      const script = document.createElement("script");
      script.textContent = children;
      if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
          if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) {
            script.setAttribute(
              key,
              typeof value === "boolean" ? "" : String(value)
            );
          }
        }
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
    return void 0;
  }, [attrs, children, dataScript]);
  if (isServer.isServer ?? router.isServer) {
    if (attrs?.src) {
      return /* @__PURE__ */ jsxRuntime.jsx("script", { ...attrs, suppressHydrationWarning: true });
    }
    if (typeof children === "string") {
      return /* @__PURE__ */ jsxRuntime.jsx(
        "script",
        {
          ...attrs,
          dangerouslySetInnerHTML: { __html: children },
          suppressHydrationWarning: true
        }
      );
    }
    return null;
  }
  if (dataScript && typeof children === "string") {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "script",
      {
        ...attrs,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: children }
      }
    );
  }
  if (!hydrated) {
    if (attrs?.src) {
      return /* @__PURE__ */ jsxRuntime.jsx("script", { ...attrs, suppressHydrationWarning: true });
    }
    if (typeof children === "string") {
      return /* @__PURE__ */ jsxRuntime.jsx(
        "script",
        {
          ...attrs,
          dangerouslySetInnerHTML: { __html: children },
          suppressHydrationWarning: true
        }
      );
    }
  }
  return null;
}
exports.Asset = Asset;
//# sourceMappingURL=Asset.cjs.map
