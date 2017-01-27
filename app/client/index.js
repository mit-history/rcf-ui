import {createElement as ce} from 'react';
import {render} from 'react-dom';

import Router from 'react-router/lib/Router';
import history from 'react-router/lib/browserHistory';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import routes from '../shared/routes';
import createStore from '../shared/store';
import {fetchingData} from '../shared/actions';
import middlewareFactory from '../shared/middlewares';
import {fetchers as clientFetchers} from './fetchers';


const clientMiddleware = middlewareFactory(clientFetchers);

const store = createStore(window.__INITIAL_STATE__, thunk, clientMiddleware);

history.listen(() => {
    // trigger the "FETCHING_DATA" action when the URL changes to ensure
    // ``state.loading`` is correctly set
    if (!window.__INITIAL_RENDERING__) {
        store.dispatch(fetchingData());
    }
});

render(ce(Provider, {store},
          ce(Router, {history}, routes)),
       document.querySelector('main'));
