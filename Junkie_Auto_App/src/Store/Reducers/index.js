import {
    combineReducers
} from 'redux';
import { UserReducer } from './UserReducer';
import { SpinnerReducer } from './SpinnerReducer';
import { LangReducer } from './LangReducer';
import { DashboardReducer } from './DashboardReducer';


export default combineReducers({
    UserReducer,
    SpinnerReducer,
    LangReducer,
    DashboardReducer
})