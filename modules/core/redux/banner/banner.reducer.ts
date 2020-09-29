import BannerActionTypes from "./banner.types";
import INITIAL_STATE from "./banner.state";

const bannerReducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case BannerActionTypes.PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        showBanner: payload.showBanner,
        type: payload.type,
        content: payload.content
      };
    case BannerActionTypes.PASSWORD_CHANGE_ERROR:
      return {
        ...state,
        error: payload,
      };
    case BannerActionTypes.CLOSE_BANNER:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};

export default bannerReducer;