import { fetchingData } from './actions';

export default fetchers => store => next => action => {
    if (action.type !== 'FETCH' || !fetchers[action.fetcher]) {
        return next(action);
    }

    store.dispatch(fetchingData());
    return fetchers[action.fetcher](action.params).then(state => {
        return store.dispatch({ type: action.success, payload: state });
    });
};
