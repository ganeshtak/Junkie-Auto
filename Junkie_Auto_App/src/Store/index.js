import {
    applyMiddleware,
    createStore,
} from 'redux';
import thunk from 'redux-thunk';
import Reducer from './Reducers';



export const Store = createStore(Reducer, applyMiddleware(thunk));
