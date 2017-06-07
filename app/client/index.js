import {createElement as ce} from 'react';
import {render} from 'react-dom';

import Router from "react-router/es/Router";
import { match, browserHistory } from 'react-router';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import routes from '../shared/routes';
import createStore from '../shared/store';
import {fetchingData} from '../shared/actions';
import middlewareFactory from '../shared/middlewares';
import {fetchers as clientFetchers} from './fetchers';

const clientMiddleware = middlewareFactory(clientFetchers);

const store = createStore(window.__INITIAL_STATE__, thunk, clientMiddleware);

browserHistory.listen(() => {
    // trigger the "FETCHING_DATA" action when the URL changes to ensure
    // ``state.loading`` is correctly set
    if (!window.__INITIAL_RENDERING__) {
        store.dispatch(fetchingData());
    }
});

const renderApp = () => {
    // Sync routes both on client and server
    match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
        render(
            ce(Provider, {store}, ce(Router, renderProps, routes)),
            document.querySelector("main"),
        );
    });
};

renderApp();