import { createStore } from 'redux';
import { combineReducers } from 'redux';
import reducers from './reducers';
import {state} from './persistor'

var combinedReducer = combineReducers(reducers);
const store = createStore(combinedReducer, state, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;