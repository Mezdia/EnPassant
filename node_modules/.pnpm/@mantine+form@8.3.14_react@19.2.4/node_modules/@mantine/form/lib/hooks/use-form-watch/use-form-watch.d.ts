import { LooseKeys } from '../../paths.types';
import { FormFieldSubscriber, Watch } from '../../types';
import { $FormStatus } from '../use-form-status/use-form-status';
import { SetValuesSubscriberPayload } from '../use-form-values/use-form-values';
interface UseFormWatchInput<Values extends Record<string, any>> {
    $status: $FormStatus<Values>;
    cascadeUpdates?: boolean;
}
export declare function useFormWatch<Values extends Record<string, any>>({ $status, cascadeUpdates, }: UseFormWatchInput<Values>): {
    subscribers: import("react").RefObject<Record<LooseKeys<Values>, FormFieldSubscriber<Values, any>[]>>;
    watch: Watch<Values>;
    getFieldSubscribers: (path: LooseKeys<Values>) => ((input: SetValuesSubscriberPayload<Values>) => void)[];
};
export {};
