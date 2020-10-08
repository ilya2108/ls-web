import { combineReducers } from 'redux';
import flagReducer from './flag/flag.reducer';

const rootReducer = combineReducers({
  flagGroup: flagReducer
});

export default rootReducer;