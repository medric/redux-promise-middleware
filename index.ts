/**
 * Resolve a promise and dispatch the result
 */
const promiseMiddleware
    = (store: Redux.Store<any>) => (next: any) => (action: any) => {
        let promise = action.promise || action;

        if (typeof promise.then !== 'function') {
            return next(action);
        }

        // Define next action to dispatch after promise is resolved
        let nextAction = action.next || ((data: any) => {
            return {
                type: 'PROMISE_RESOLVED',
                data: data
            }
        });

        // Let action go
        next(action);

        promise.then(
            (result: any) => {
                if (typeof nextAction === 'function'){
                    store.dispatch(nextAction(result));
                } else {
                    store.dispatch(nextAction);
                }
            }, (error: any) => {
                store.dispatch(error);
                throw error;
            }
        )
    }

export default promiseMiddleware;
