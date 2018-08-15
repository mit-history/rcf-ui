import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

import rootReducer from './reducers';

const defaultMiddlewares = [];

require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
    defaultMiddlewares.push(createLogger({ collapsed: true }));
}

export const DEFAULT_INITIAL_STATE = {
    authors: [],
    plays: [],
    seasons: [],
    home: [],
    genres: [],
    loading: false,
};

export default (initialState = DEFAULT_INITIAL_STATE, ...middlewares) =>
    createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middlewares, ...defaultMiddlewares),
    );
