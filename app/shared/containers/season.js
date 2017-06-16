import { connect } from 'react-redux';

import connectDataFetchers from '..';
import { actionTypes } from '../actions';
import {
    SeasonList as BaseSeasonList,
    SeasonPrimaryView as BaseSeasonPrimaryView,
    ASeasonPrimaryView as BaseASeasonPrimaryView,
} from '../components/season';

function seasonListMSTP(state) {
    return { seasons: state.seasons };
}

export const SeasonList = connect(seasonListMSTP)(
    connectDataFetchers(BaseSeasonList, {
        fetcher: 'fetchSeasons',
        success: actionTypes.SEASONS_FETCHED,
    }),
);

function seasonMSTP(state) {
    return { mainentity: state.mainentity, loading: state.loading };
}

export const SeasonPrimaryView = connect(seasonMSTP)(
    connectDataFetchers(BaseSeasonPrimaryView, {
        fetcher: 'fetchSeason',
        success: actionTypes.SEASON_FETCHED,
    }),
);

function aSeasonMSTP(state) {
    return {
        mainentity: state.mainentity,
        loading: state.loading,
    };
}

export const ASeasonPrimaryView = connect(aSeasonMSTP)(
    connectDataFetchers(BaseASeasonPrimaryView, {
        fetcher: 'fetchASeason',
        success: actionTypes.ASEASON_FETCHED,
    }),
);
