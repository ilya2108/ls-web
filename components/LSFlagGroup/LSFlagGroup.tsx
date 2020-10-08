import React, { ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Flag, { AutoDismissFlag, FlagGroup } from "@atlaskit/flag";
import { dismissFlag } from "../../modules/core/redux/flag/flag.actions";

const LSFlagGroup = () => {
  const { flags } = useSelector((state) => state.flagGroup);
  const dispatch = useDispatch();
  const dispatchDismissFlag = () => dispatch(dismissFlag());

  return (
    <FlagGroup onDismissed={dispatchDismissFlag}>
      {flags.map((flag) =>
        flag.appearance ? <AutoDismissFlag {...flag} /> : <Flag {...flag} />
      )}
    </FlagGroup>
  );
};

export default LSFlagGroup;