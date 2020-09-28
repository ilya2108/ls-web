import UserActionTypes from "./user.types";

export const passwordChangeSuccess = () => ({
  type: UserActionTypes.PASSWORD_CHANGE_SUCCESS,
  payload: {
    banner: true,
    passwordChange: 'success'
  }
});

export const passwordChangeFailure = () => ({
  type: UserActionTypes.PASSWORD_CHANGE_FAILURE,
  payload: {
    banner: true,
    passwordChange: 'failure'
  }
});

export const passwordChangeError = (error) => ({
  type: UserActionTypes.PASSWORD_CHANGE_ERROR,
  payload: error
});