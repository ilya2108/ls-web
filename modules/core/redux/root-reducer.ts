import { combineReducers } from 'redux';
import bannerReducer from './banner/banner.reducer';

const rootReducer = combineReducers({
  banner: bannerReducer
});

export default rootReducer;