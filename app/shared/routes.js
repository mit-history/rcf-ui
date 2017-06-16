import AppComponent from './components';
import { HomeView } from './containers/home';
import { buildURL } from './urls';

function loadRoute(cb, name = 'default') {
    return module => cb(null, module[name]);
}

function errorLoading(err) {
    console.error('error while loading', err);
}

export default {
    component: AppComponent,
    path: buildURL('/'),
    indexRoute: { component: HomeView },
    childRoutes: [
        {
            path: 'authors',
            getComponent(location, cb) {
                System.import('./containers/author')
                    .then(loadRoute(cb, 'AuthorList'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'author/:id',
            getComponent(location, cb) {
                System.import('./containers/author')
                    .then(loadRoute(cb, 'AuthorPrimaryView'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'plays',
            getComponent(location, cb) {
                System.import('./containers/play')
                    .then(loadRoute(cb, 'PlayList'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'play/:id',
            getComponent(location, cb) {
                System.import('./containers/play')
                    .then(loadRoute(cb, 'PlayPrimaryView'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'play/:play/reprises',
            getComponent(location, cb) {
                System.import('./containers/play')
                    .then(loadRoute(cb, 'RepriseList'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'seasons',
            getComponent(location, cb) {
                System.import('./containers/season')
                    .then(loadRoute(cb, 'SeasonList'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'season/:id',
            getComponent(location, cb) {
                System.import('./containers/season')
                    .then(loadRoute(cb, 'SeasonPrimaryView'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'genres',
            getComponent(location, cb) {
                System.import('./containers/genre')
                    .then(loadRoute(cb, 'GenreList'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'genre/:id',
            getComponent(location, cb) {
                System.import('./containers/genre')
                    .then(loadRoute(cb, 'GenrePrimaryView'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'aseason/:authorid/:season',
            getComponent(location, cb) {
                System.import('./containers/season')
                    .then(loadRoute(cb, 'ASeasonPrimaryView'))
                    .catch(errorLoading);
            },
        },
        {
            path: 'register/:id',
            getComponent(location, cb) {
                System.import('./containers/register')
                    .then(loadRoute(cb, 'RegisterPrimaryView'))
                    .catch(errorLoading);
            },
        },
    ],
};
