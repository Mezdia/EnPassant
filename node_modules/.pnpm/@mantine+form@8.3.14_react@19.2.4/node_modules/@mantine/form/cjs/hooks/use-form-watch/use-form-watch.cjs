'use client';
'use strict';

var react = require('react');
var getPath = require('../../paths/get-path.cjs');
require('klona/full');

function useFormWatch({
  $status,
  cascadeUpdates
}) {
  const subscribers = react.useRef(
    {}
  );
  const watch = react.useCallback((path, callback) => {
    react.useEffect(() => {
      subscribers.current[path] = subscribers.current[path] || [];
      subscribers.current[path].push(callback);
      return () => {
        subscribers.current[path] = subscribers.current[path].filter((cb) => cb !== callback);
      };
    }, [callback]);
  }, []);
  const getFieldSubscribers = react.useCallback((path) => {
    const result = subscribers.current[path]?.map(
      (callback) => (input) => callback({
        previousValue: getPath.getPath(path, input.previousValues),
        value: getPath.getPath(path, input.updatedValues),
        touched: $status.isTouched(path),
        dirty: $status.isDirty(path)
      })
    ) ?? [];
    if (cascadeUpdates) {
      for (const subscriptionKey in subscribers.current) {
        if (subscriptionKey.startsWith(`${path}.`) || path.startsWith(`${subscriptionKey}.`)) {
          result.push(
            ...subscribers.current[subscriptionKey].map(
              (cb) => (input) => cb({
                previousValue: getPath.getPath(subscriptionKey, input.previousValues),
                value: getPath.getPath(subscriptionKey, input.updatedValues),
                touched: $status.isTouched(subscriptionKey),
                dirty: $status.isDirty(subscriptionKey)
              })
            )
          );
        }
      }
    }
    return result;
  }, []);
  return {
    subscribers,
    watch,
    getFieldSubscribers
  };
}

exports.useFormWatch = useFormWatch;
//# sourceMappingURL=use-form-watch.cjs.map
