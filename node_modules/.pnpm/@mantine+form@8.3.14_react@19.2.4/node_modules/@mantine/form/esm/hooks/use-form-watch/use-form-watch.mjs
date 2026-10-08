'use client';
import { useRef, useCallback, useEffect } from 'react';
import { getPath } from '../../paths/get-path.mjs';
import 'klona/full';

function useFormWatch({
  $status,
  cascadeUpdates
}) {
  const subscribers = useRef(
    {}
  );
  const watch = useCallback((path, callback) => {
    useEffect(() => {
      subscribers.current[path] = subscribers.current[path] || [];
      subscribers.current[path].push(callback);
      return () => {
        subscribers.current[path] = subscribers.current[path].filter((cb) => cb !== callback);
      };
    }, [callback]);
  }, []);
  const getFieldSubscribers = useCallback((path) => {
    const result = subscribers.current[path]?.map(
      (callback) => (input) => callback({
        previousValue: getPath(path, input.previousValues),
        value: getPath(path, input.updatedValues),
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
                previousValue: getPath(subscriptionKey, input.previousValues),
                value: getPath(subscriptionKey, input.updatedValues),
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

export { useFormWatch };
//# sourceMappingURL=use-form-watch.mjs.map
