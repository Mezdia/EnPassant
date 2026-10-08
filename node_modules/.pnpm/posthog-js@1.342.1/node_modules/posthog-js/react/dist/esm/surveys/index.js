import { createContext, useContext, useState, useMemo, useRef, useCallback } from 'react';
import posthogJs, { SurveyPosition, DisplaySurveyType } from 'posthog-js';

var PostHogContext = createContext({
    client: posthogJs,
    bootstrap: undefined,
});

var usePostHog = function () {
    var client = useContext(PostHogContext).client;
    return client;
};

var TRIGGER_ATTR = 'data-ph-thumb-survey-trigger';
function useThumbSurvey(_a) {
    var surveyId = _a.surveyId, _b = _a.displayPosition, displayPosition = _b === void 0 ? SurveyPosition.NextToTrigger : _b, properties = _a.properties, onResponse = _a.onResponse;
    var posthog = usePostHog();
    var _c = useState(null), responded = _c[0], setResponded = _c[1];
    var instanceId = useState(function () { return Math.random().toString(36).slice(2, 9); })[0];
    var triggerValue = useMemo(function () { return "".concat(surveyId, "-").concat(instanceId); }, [surveyId, instanceId]);
    var elementRef = useRef(null);
    var triggerRef = useCallback(function (el) {
        if (elementRef.current) {
            elementRef.current.removeAttribute(TRIGGER_ATTR);
        }
        elementRef.current = el;
        if (el) {
            el.setAttribute(TRIGGER_ATTR, triggerValue);
        }
    }, [triggerValue]);
    var respond = useCallback(function (value) {
        if (!(posthog === null || posthog === void 0 ? void 0 : posthog.surveys) || responded)
            return;
        setResponded(value);
        onResponse === null || onResponse === void 0 ? void 0 : onResponse(value);
        posthog.surveys.displaySurvey(surveyId, {
            displayType: DisplaySurveyType.Popover,
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

export { useThumbSurvey };
//# sourceMappingURL=index.js.map
