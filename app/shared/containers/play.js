import { connect } from 'react-redux';

import connectDataFetchers from '..';
import { actionTypes } from '../actions';
import {
    PlayList as BasePlayList,
    PlayPrimaryView as BasePlayPrimaryView,
    repriseList,
} from '../components/play';

function playListMSTP(state) {
    return { plays: state.plays };
}

export const PlayList = connect(playListMSTP)(
    connectDataFetchers(BasePlayList, {
        fetcher: 'fetchPlays',
        success: actionTypes.PLAYS_FETCHED,
    }),
);

function playMSTP(state) {
    return { mainentity: state.mainentity, loading: state.loading };
}

export const PlayPrimaryView = connect(playMSTP)(
    connectDataFetchers(BasePlayPrimaryView, {
        fetcher: 'fetchPlay',
        success: actionTypes.PLAY_FETCHED,
    }),
);

function repriseListMSTP(state) {
    return { reprises: state.reprises, loading: state.loading };
}

export const RepriseList = connect(repriseListMSTP)(
    connectDataFetchers(repriseList, {
        fetcher: 'fetchReprises',
        success: actionTypes.REPRISES_FETCHED,
    }),
);
