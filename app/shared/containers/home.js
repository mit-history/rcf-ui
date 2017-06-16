import { connect } from 'react-redux';

import connectDataFetchers from '..';
import { actionTypes } from '../actions';
import { Home as BaseHome } from '../components/home';

function homeMSTP(state) {
    return { mainentity: state.mainentity, loading: state.loading };
}

export const HomeView = connect(homeMSTP)(
    connectDataFetchers(BaseHome, {
        fetcher: 'fetchHome',
        success: actionTypes.HOME_FETCHED,
    }),
);
