(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('posthog-js')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'posthog-js'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PosthogReactSurveys = {}, global.React, global.posthog));
})(this, (function (exports, React, posthogJs) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var posthogJs__default = /*#__PURE__*/_interopDefaultLegacy(posthogJs);

    var PostHogContext = React.createContext({
        client: posthogJs__default["default"],
        bootstrap: undefined,
    });

    var usePostHog = function () {
        var client = React.useContext(PostHogContext).client;
        return client;
    };

    var TRIGGER_ATTR = 'data-ph-thumb-survey-trigger';
    function useThumbSurvey(_a) {
        var surveyId = _a.surveyId, _b = _a.displayPosition, displayPosition = _b === void 0 ? posthogJs.SurveyPosition.NextToTrigger : _b, properties = _a.properties, onResponse = _a.onResponse;
        var posthog = usePostHog();
        var _c = React.useState(null), responded = _c[0], setResponded = _c[1];
        var instanceId = React.useState(function () { return Math.random().toString(36).slice(2, 9); })[0];
        var triggerValue = React.useMemo(function () { return "".concat(surveyId, "-").concat(instanceId); }, [surveyId, instanceId]);
        var elementRef = React.useRef(null);
        var triggerRef = React.useCallback(function (el) {
            if (elementRef.current) {
                elementRef.current.removeAttribute(TRIGGER_ATTR);
            }
            elementRef.current = el;
            if (el) {
                el.setAttribute(TRIGGER_ATTR, triggerValue);
            }
        }, [triggerValue]);
        var respond = React.useCallback(function (value) {
            if (!(posthog === null || posthog === void 0 ? void 0 : posthog.surveys) || responded)
                return;
            setResponded(value);
            onResponse === null || onResponse === void 0 ? void 0 : onResponse(value);
            posthog.surveys.displaySurvey(surveyId, {
                displayType: posthogJs.DisplaySurveyType.Popover,
                ignoreConditions: true,
                ignoreDelay: true,
                properties: properties,
                initialResponses: { 0: value === 'up' ? 1 : 2 },
                position: displayPosition,
                selector: "[".concat(TRIGGER_ATTR, "=\"").concat(triggerValue, "\"]"),
            });
        }, [posthog, surveyId, displayPosition, properties, responded, onResponse, triggerValue]);
        return { respond: respond, response: responded, triggerRef: triggerRef };
    }

    exports.useThumbSurvey = useThumbSurvey;

}));
//# sourceMappingURL=index.js.map
