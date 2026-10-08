"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const reactDom = require("react-dom");
const routerCore = require("@tanstack/router-core");
const isServer = require("@tanstack/router-core/isServer");
const useRouterState = require("./useRouterState.cjs");
const useRouter = require("./useRouter.cjs");
const utils = require("./utils.cjs");
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
function useLinkProps(options, forwardedRef) {
  const router = useRouter.useRouter();
  const innerRef = utils.useForwardedRef(forwardedRef);
  const _isServer = isServer.isServer ?? router.isServer;
  const {
    // custom props
    activeProps,
    inactiveProps,
    activeOptions,
    to,
    preload: userPreload,
    preloadDelay: userPreloadDelay,
    hashScrollIntoView,
    replace,
    startTransition,
    resetScroll,
    viewTransition,
    // element props
    children,
    target,
    disabled,
    style,
    className,
    onClick,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    ignoreBlocker,
    // prevent these from being returned
    params: _params,
    search: _search,
    hash: _hash,
    state: _state,
    mask: _mask,
    reloadDocument: _reloadDocument,
    unsafeRelative: _unsafeRelative,
    from: _from,
    _fromLocation,
    ...propsSafeToSpread
  } = options;
  if (_isServer) {
    const safeInternal = isSafeInternal(to);
    if (typeof to === "string" && !safeInternal && // Quick checks to avoid `new URL` in common internal-like cases
    to.indexOf(":") > -1) {
      try {
        new URL(to);
        if (routerCore.isDangerousProtocol(to, router.protocolAllowlist)) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`Blocked Link with dangerous protocol: ${to}`);
          }
          return {
            ...propsSafeToSpread,
            ref: innerRef,
            href: void 0,
            ...children && { children },
            ...target && { target },
            ...disabled && { disabled },
            ...style && { style },
            ...className && { className }
          };
        }
        return {
          ...propsSafeToSpread,
          ref: innerRef,
          href: to,
          ...children && { children },
          ...target && { target },
          ...disabled && { disabled },
          ...style && { style },
          ...className && { className }
        };
      } catch {
      }
    }
    const next2 = router.buildLocation({ ...options, from: options.from });
    const hrefOptionPublicHref2 = next2.maskedLocation ? next2.maskedLocation.publicHref : next2.publicHref;
    const hrefOptionExternal2 = next2.maskedLocation ? next2.maskedLocation.external : next2.external;
    const hrefOption2 = getHrefOption(
      hrefOptionPublicHref2,
      hrefOptionExternal2,
      router.history,
      disabled
    );
    const externalLink2 = (() => {
      if (hrefOption2?.external) {
        if (routerCore.isDangerousProtocol(hrefOption2.href, router.protocolAllowlist)) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `Blocked Link with dangerous protocol: ${hrefOption2.href}`
            );
          }
          return void 0;
        }
        return hrefOption2.href;
      }
      if (safeInternal) return void 0;
      if (typeof to === "string" && to.indexOf(":") > -1) {
        try {
          new URL(to);
          if (routerCore.isDangerousProtocol(to, router.protocolAllowlist)) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(`Blocked Link with dangerous protocol: ${to}`);
            }
            return void 0;
          }
          return to;
        } catch {
        }
      }
      return void 0;
    })();
    const isActive2 = (() => {
      if (externalLink2) return false;
      const currentLocation = router.state.location;
      const exact = activeOptions?.exact ?? false;
      if (exact) {
        const testExact = routerCore.exactPathTest(
          currentLocation.pathname,
          next2.pathname,
          router.basepath
        );
        if (!testExact) {
          return false;
        }
      } else {
        const currentPathSplit = routerCore.removeTrailingSlash(
          currentLocation.pathname,
          router.basepath
        );
        const nextPathSplit = routerCore.removeTrailingSlash(
          next2.pathname,
          router.basepath
        );
        const pathIsFuzzyEqual = currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/");
        if (!pathIsFuzzyEqual) {
          return false;
        }
      }
      const includeSearch = activeOptions?.includeSearch ?? true;
      if (includeSearch) {
        if (currentLocation.search !== next2.search) {
          const currentSearchEmpty = !currentLocation.search || typeof currentLocation.search === "object" && Object.keys(currentLocation.search).length === 0;
          const nextSearchEmpty = !next2.search || typeof next2.search === "object" && Object.keys(next2.search).length === 0;
          if (!(currentSearchEmpty && nextSearchEmpty)) {
            const searchTest = routerCore.deepEqual(currentLocation.search, next2.search, {
              partial: !exact,
              ignoreUndefined: !activeOptions?.explicitUndefined
            });
            if (!searchTest) {
              return false;
            }
          }
        }
      }
      if (activeOptions?.includeHash) {
        return false;
      }
      return true;
    })();
    if (externalLink2) {
      return {
        ...propsSafeToSpread,
        ref: innerRef,
        href: externalLink2,
        ...children && { children },
        ...target && { target },
        ...disabled && { disabled },
        ...style && { style },
        ...className && { className }
      };
    }
    const resolvedActiveProps2 = isActive2 ? routerCore.functionalUpdate(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
    const resolvedInactiveProps2 = isActive2 ? STATIC_EMPTY_OBJECT : routerCore.functionalUpdate(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
    const resolvedStyle2 = (() => {
      const baseStyle = style;
      const activeStyle = resolvedActiveProps2.style;
      const inactiveStyle = resolvedInactiveProps2.style;
      if (!baseStyle && !activeStyle && !inactiveStyle) {
        return void 0;
      }
      if (baseStyle && !activeStyle && !inactiveStyle) {
        return baseStyle;
      }
      if (!baseStyle && activeStyle && !inactiveStyle) {
        return activeStyle;
      }
      if (!baseStyle && !activeStyle && inactiveStyle) {
        return inactiveStyle;
      }
      return {
        ...baseStyle,
        ...activeStyle,
        ...inactiveStyle
      };
    })();
    const resolvedClassName2 = (() => {
      const baseClassName = className;
      const activeClassName = resolvedActiveProps2.className;
      const inactiveClassName = resolvedInactiveProps2.className;
      if (!baseClassName && !activeClassName && !inactiveClassName) {
        return "";
      }
      let out = "";
      if (baseClassName) {
        out = baseClassName;
      }
      if (activeClassName) {
        out = out ? `${out} ${activeClassName}` : activeClassName;
      }
      if (inactiveClassName) {
        out = out ? `${out} ${inactiveClassName}` : inactiveClassName;
      }
      return out;
    })();
    return {
      ...propsSafeToSpread,
      ...resolvedActiveProps2,
      ...resolvedInactiveProps2,
      href: hrefOption2?.href,
      ref: innerRef,
      disabled: !!disabled,
      target,
      ...resolvedStyle2 && { style: resolvedStyle2 },
      ...resolvedClassName2 && { className: resolvedClassName2 },
      ...disabled && STATIC_DISABLED_PROPS,
      ...isActive2 && STATIC_ACTIVE_PROPS
    };
  }
  const isHydrated = ClientOnly.useHydrated();
  const currentLocationState = useRouterState.useRouterState({
    select: (s) => {
      const leaf = s.matches[s.matches.length - 1];
      return {
        search: leaf?.search,
        hash: s.location.hash,
        path: leaf?.pathname
        // path + params
      };
    },
    structuralSharing: true
  });
  const from = options.from;
  const _options = React__namespace.useMemo(
    () => {
      return { ...options, from };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      router,
      currentLocationState,
      from,
      options._fromLocation,
      options.hash,
      options.to,
      options.search,
      options.params,
      options.state,
      options.mask,
      options.unsafeRelative
    ]
  );
  const next = React__namespace.useMemo(
    () => router.buildLocation({ ..._options }),
    [router, _options]
  );
  const hrefOptionPublicHref = next.maskedLocation ? next.maskedLocation.publicHref : next.publicHref;
  const hrefOptionExternal = next.maskedLocation ? next.maskedLocation.external : next.external;
  const hrefOption = React__namespace.useMemo(
    () => getHrefOption(
      hrefOptionPublicHref,
      hrefOptionExternal,
      router.history,
      disabled
    ),
    [disabled, hrefOptionExternal, hrefOptionPublicHref, router.history]
  );
  const externalLink = React__namespace.useMemo(() => {
    if (hrefOption?.external) {
      if (routerCore.isDangerousProtocol(hrefOption.href, router.protocolAllowlist)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `Blocked Link with dangerous protocol: ${hrefOption.href}`
          );
        }
        return void 0;
      }
      return hrefOption.href;
    }
    const safeInternal = isSafeInternal(to);
    if (safeInternal) return void 0;
    if (typeof to !== "string" || to.indexOf(":") === -1) return void 0;
    try {
      new URL(to);
      if (routerCore.isDangerousProtocol(to, router.protocolAllowlist)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Blocked Link with dangerous protocol: ${to}`);
        }
        return void 0;
      }
      return to;
    } catch {
    }
    return void 0;
  }, [to, hrefOption, router.protocolAllowlist]);
  const isActive = useRouterState.useRouterState({
    select: (s) => {
      if (externalLink) return false;
      if (activeOptions?.exact) {
        const testExact = routerCore.exactPathTest(
          s.location.pathname,
          next.pathname,
          router.basepath
        );
        if (!testExact) {
          return false;
        }
      } else {
        const currentPathSplit = routerCore.removeTrailingSlash(
          s.location.pathname,
          router.basepath
        );
        const nextPathSplit = routerCore.removeTrailingSlash(
          next.pathname,
          router.basepath
        );
        const pathIsFuzzyEqual = currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/");
        if (!pathIsFuzzyEqual) {
          return false;
        }
      }
      if (activeOptions?.includeSearch ?? true) {
        const searchTest = routerCore.deepEqual(s.location.search, next.search, {
          partial: !activeOptions?.exact,
          ignoreUndefined: !activeOptions?.explicitUndefined
        });
        if (!searchTest) {
          return false;
        }
      }
      if (activeOptions?.includeHash) {
        return isHydrated && s.location.hash === next.hash;
      }
      return true;
    }
  });
  const resolvedActiveProps = isActive ? routerCore.functionalUpdate(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
  const resolvedInactiveProps = isActive ? STATIC_EMPTY_OBJECT : routerCore.functionalUpdate(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
  const resolvedClassName = [
    className,
    resolvedActiveProps.className,
    resolvedInactiveProps.className
  ].filter(Boolean).join(" ");
  const resolvedStyle = (style || resolvedActiveProps.style || resolvedInactiveProps.style) && {
    ...style,
    ...resolvedActiveProps.style,
    ...resolvedInactiveProps.style
  };
  const [isTransitioning, setIsTransitioning] = React__namespace.useState(false);
  const hasRenderFetched = React__namespace.useRef(false);
  const preload = options.reloadDocument || externalLink ? false : userPreload ?? router.options.defaultPreload;
  const preloadDelay = userPreloadDelay ?? router.options.defaultPreloadDelay ?? 0;
  const doPreload = React__namespace.useCallback(() => {
    router.preloadRoute({ ..._options, _builtLocation: next }).catch((err) => {
      console.warn(err);
      console.warn(routerCore.preloadWarning);
    });
  }, [router, _options, next]);
  const preloadViewportIoCallback = React__namespace.useCallback(
    (entry) => {
      if (entry?.isIntersecting) {
        doPreload();
      }
    },
    [doPreload]
  );
  utils.useIntersectionObserver(
    innerRef,
    preloadViewportIoCallback,
    intersectionObserverOptions,
    { disabled: !!disabled || !(preload === "viewport") }
  );
  React__namespace.useEffect(() => {
    if (hasRenderFetched.current) {
      return;
    }
    if (!disabled && preload === "render") {
      doPreload();
      hasRenderFetched.current = true;
    }
  }, [disabled, doPreload, preload]);
  const handleClick = (e) => {
    const elementTarget = e.currentTarget.getAttribute("target");
    const effectiveTarget = target !== void 0 ? target : elementTarget;
    if (!disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!effectiveTarget || effectiveTarget === "_self") && e.button === 0) {
      e.preventDefault();
      reactDom.flushSync(() => {
        setIsTransitioning(true);
      });
      const unsub = router.subscribe("onResolved", () => {
        unsub();
        setIsTransitioning(false);
      });
      router.navigate({
        ..._options,
        replace,
        resetScroll,
        hashScrollIntoView,
        startTransition,
        viewTransition,
        ignoreBlocker
      });
    }
  };
  if (externalLink) {
    return {
      ...propsSafeToSpread,
      ref: innerRef,
      href: externalLink,
      ...children && { children },
      ...target && { target },
      ...disabled && { disabled },
      ...style && { style },
      ...className && { className },
      ...onClick && { onClick },
      ...onFocus && { onFocus },
      ...onMouseEnter && { onMouseEnter },
      ...onMouseLeave && { onMouseLeave },
      ...onTouchStart && { onTouchStart }
    };
  }
  const handleFocus = (_) => {
    if (disabled) return;
    if (preload) {
      doPreload();
    }
  };
  const handleTouchStart = handleFocus;
  const handleEnter = (e) => {
    if (disabled || !preload) return;
    if (!preloadDelay) {
      doPreload();
    } else {
      const eventTarget = e.target;
      if (timeoutMap.has(eventTarget)) {
        return;
      }
      const id = setTimeout(() => {
        timeoutMap.delete(eventTarget);
        doPreload();
      }, preloadDelay);
      timeoutMap.set(eventTarget, id);
    }
  };
  const handleLeave = (e) => {
    if (disabled || !preload || !preloadDelay) return;
    const eventTarget = e.target;
    const id = timeoutMap.get(eventTarget);
    if (id) {
      clearTimeout(id);
      timeoutMap.delete(eventTarget);
    }
  };
  return {
    ...propsSafeToSpread,
    ...resolvedActiveProps,
    ...resolvedInactiveProps,
    href: hrefOption?.href,
    ref: innerRef,
    onClick: composeHandlers([onClick, handleClick]),
    onFocus: composeHandlers([onFocus, handleFocus]),
    onMouseEnter: composeHandlers([onMouseEnter, handleEnter]),
    onMouseLeave: composeHandlers([onMouseLeave, handleLeave]),
    onTouchStart: composeHandlers([onTouchStart, handleTouchStart]),
    disabled: !!disabled,
    target,
    ...resolvedStyle && { style: resolvedStyle },
    ...resolvedClassName && { className: resolvedClassName },
    ...disabled && STATIC_DISABLED_PROPS,
    ...isActive && STATIC_ACTIVE_PROPS,
    ...isHydrated && isTransitioning && STATIC_TRANSITIONING_PROPS
  };
}
const STATIC_EMPTY_OBJECT = {};
const STATIC_ACTIVE_OBJECT = { className: "active" };
const STATIC_DISABLED_PROPS = { role: "link", "aria-disabled": true };
const STATIC_ACTIVE_PROPS = { "data-status": "active", "aria-current": "page" };
const STATIC_TRANSITIONING_PROPS = { "data-transitioning": "transitioning" };
const timeoutMap = /* @__PURE__ */ new WeakMap();
const intersectionObserverOptions = {
  rootMargin: "100px"
};
const composeHandlers = (handlers) => (e) => {
  for (const handler of handlers) {
    if (!handler) continue;
    if (e.defaultPrevented) return;
    handler(e);
  }
};
function getHrefOption(publicHref, external, history, disabled) {
  if (disabled) return void 0;
  if (external) {
    return { href: publicHref, external: true };
  }
  return {
    href: history.createHref(publicHref) || "/",
    external: false
  };
}
function isSafeInternal(to) {
  if (typeof to !== "string") return false;
  const zero = to.charCodeAt(0);
  if (zero === 47) return to.charCodeAt(1) !== 47;
  return zero === 46;
}
function createLink(Comp) {
  return React__namespace.forwardRef(function CreatedLink(props, ref) {
    return /* @__PURE__ */ jsxRuntime.jsx(Link, { ...props, _asChild: Comp, ref });
  });
}
const Link = React__namespace.forwardRef(
  (props, ref) => {
    const { _asChild, ...rest } = props;
    const { type: _type, ...linkProps } = useLinkProps(rest, ref);
    const children = typeof rest.children === "function" ? rest.children({
      isActive: linkProps["data-status"] === "active"
    }) : rest.children;
    if (!_asChild) {
      const { disabled: _, ...rest2 } = linkProps;
      return React__namespace.createElement("a", rest2, children);
    }
    return React__namespace.createElement(_asChild, linkProps, children);
  }
);
function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
const linkOptions = (options) => {
  return options;
};
exports.Link = Link;
exports.createLink = createLink;
exports.linkOptions = linkOptions;
exports.useLinkProps = useLinkProps;
//# sourceMappingURL=link.cjs.map
