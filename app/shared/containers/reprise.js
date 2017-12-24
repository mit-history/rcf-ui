import { connect } from 'react-redux';

import connectDataFetchers from '..';
import { actionTypes } from '../actions';
import {
    RepriseList as BaseRepriseList,
} from '../components/reprise';

function repriseListMSTP(state) {
    return { reprises: state.reprises };
}

export const RepriseList = connect(repriseListMSTP)(
    connectDataFetchers(BaseRepriseList, {
        fetcher: 'fetchAllReprises',
        success: actionTypes.ALL_REPRISES_FETCHED,
    }),
);
