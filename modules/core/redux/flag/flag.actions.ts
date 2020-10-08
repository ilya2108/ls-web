import FlagActionTypes from "./flag.types";

export const dismissFlag = () => ({
    type: FlagActionTypes.DISMISS_FLAG
})

export const addFlag = (flag) => ({
    type: FlagActionTypes.ADD_FLAG,
    payload: flag
});