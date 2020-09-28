import UserActionTypes from "./user.types";
import INITIAL_STATE from "./user.state";

const userReducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case UserActionTypes.PASSWORD_CHANGE_SUCCESS:
    case UserActionTypes.PASSWORD_CHANGE_FAILURE:
      return {
        ...state,
        banner: payload.banner,
        passwordChange: payload.passwordChange
      };
    case UserActionTypes.PASSWORD_CHANGE_ERROR:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
};

export default userReducer;