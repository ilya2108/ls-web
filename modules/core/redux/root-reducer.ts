import { combineReducers } from 'redux';
import flagReducer from './flag/flag.reducer';
import drawerReducer from "./drawer/drawer.reducer"

const rootReducer = combineReducers({
  flagGroup: flagReducer,
  drawers: drawerReducer
});

export default rootReducer;