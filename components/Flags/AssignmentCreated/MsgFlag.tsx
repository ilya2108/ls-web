import React from "react";
import { useDispatch } from "react-redux";

import { AutoDismissFlag, FlagProps, ActionsType } from "@atlaskit/flag";
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';

import { dismissFlag } from "../../../modules/core/redux/flag/flag.actions";

const AssignmentCreatedMsgFlag = (props: any) => {
  const dispatch = useDispatch();
  const dispatchDismissFlag = () => dispatch(dismissFlag());

  const Props: FlagProps = {
    id: props.id,
    icon: <SuccessIcon label="Success" secondaryColor={G300} />,
    title: props.title,
    description: props.description
  };

  const Actions: ActionsType= [
    {
      content: "Okay!",
      onClick: dispatchDismissFlag,
    },
  ];

  // return <AutoDismissFlag actions={Actions} {...Props} />;
  return (
    <div className='flag-container' onClick={dispatchDismissFlag}>
      {props.title}
    </div>
  )
};

export default AssignmentCreatedMsgFlag;
