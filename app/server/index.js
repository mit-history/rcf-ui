import { createElement as ce } from 'react';
import { renderToString } from 'react-dom/server';

import { match, RouterContext } from 'react-router';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import routes from '../shared/routes';
import createStore from '../shared/store';
import middlewareFactory from '../shared/middlewares';
import { fetchers as serverFetchers } from './fetchers';

const serverMiddleware = middlewareFactory(serverFetchers);

export default (req, res, next, template) => {
    match(
        { routes, location: req.url },
        (error, redirectLocation, renderProps) => {
            if (error) {
                res.status(500).send(error.message);
            } else if (redirectLocation) {
                res.redirect(
                    302,
                    redirectLocation.pathname + redirectLocation.search,
                );
            } else if (renderProps) {
                const store = createStore(undefined, thunk, serverMiddleware);
                Promise.all(
                    renderProps.components.filter(c => c.fetchData).map(c =>
                        c.fetchData({
                            dispatch: store.dispatch,
                            params: renderProps.params,
                        }),
                    ),
                )
                    .then(() => {
                        const reactComp = ce(
                            Provider,
                            { store },
                            ce(RouterContext, renderProps),
                        );
                        const response = template
                            .replace(
                                '<!-- react-entry-point -->',
                                renderToString(reactComp),
                            )
                            .replace(
                                '{/* react-initial-state */}',
                                JSON.stringify(store.getState()),
                            );
                        res.send(response);
                    })
                    .catch(next);
            } else {
                res.status(404).send('Not found');
            }
        },
    );
};
