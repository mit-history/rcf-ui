import { connect } from 'react-redux';

import connectDataFetchers from '..';
import { actionTypes } from '../actions';
import { RegisterPrimaryView as BaseRegisterPrimaryView } from '../components/register';

function registerMSTP(state) {
    return { mainentity: state.mainentity, loading: state.loading };
}

export const RegisterPrimaryView = connect(registerMSTP)(
    connectDataFetchers(BaseRegisterPrimaryView, {
        fetcher: 'fetchRegister',
        success: actionTypes.REGISTER_FETCHED,
    }),
);
