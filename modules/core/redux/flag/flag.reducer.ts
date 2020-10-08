import FlagActionTypes from "./flag.types";
import { addFlagToFlagGroup, removeFlagFromFlagGroup } from "./flag.utils"
import INITIAL_STATE from "./flag.state";

const flagReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FlagActionTypes.DISMISS_FLAG:
      return {
        ...state,
        flags: removeFlagFromFlagGroup(state.flags)
      }
    case FlagActionTypes.ADD_FLAG:
      return {
        ...state,
        flags: addFlagToFlagGroup(state.flags, payload)
      };
    default:
      return state;
  }
};

export default flagReducer;