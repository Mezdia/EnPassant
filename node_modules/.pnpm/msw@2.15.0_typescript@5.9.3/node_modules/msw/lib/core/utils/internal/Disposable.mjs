import { devUtils } from './devUtils.mjs';
class Disposable {
  subscriptions = [];
  dispose() {
    let subscription;
    const errors = [];
    while (subscription = this.subscriptions.shift()) {
      try {
        subscription();
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error);
        }
      }
    }
    if (errors.length > 0) {
      console.error(
        new AggregateError(
          errors,
          devUtils.formatMessage(
            "Failed to dispose of some side effects. This is likely an issue with MSW, please report it on GitHub: https://github.com/mswjs/msw/issues"
          )
        )
      );
    }
  }
}
export {
  Disposable
};
//# sourceMappingURL=Disposable.mjs.map