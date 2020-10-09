import drawerActionTypes from "./drawer.types";
import INITIAL_STATE from "./drawer.state";

const drawerReducer = (state = INITIAL_STATE, { type }) => {
  switch (type) {
    case drawerActionTypes.OPEN_SEARCH_DRAWER:
      return {
        ...state,
        searchDrawer: true
      }
    case drawerActionTypes.CLOSE_SEARCH_DRAWER:
      return {
        ...state,
        searchDrawer: false
      };
    default:
      return state;
  }
};

export default drawerReducer;