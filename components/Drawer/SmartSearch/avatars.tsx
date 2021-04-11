import Avatar from "@atlaskit/avatar";
import {assignmentIcon, examIcon, submissionIcon, userIcon} from "../../../modules/SmartSearch/icons";
import React from "react";

const examAvatar = (
    <Avatar
        src={examIcon}
        appearance="square"
        size="large"
    />
);

const userAvatar = (
    <Avatar
        src={userIcon}
        appearance="circle"
        size="large"
    />
);

const assignmentAvatar = (
    <Avatar
        src={assignmentIcon}
        appearance="square"
        size="large"
    />
);

const submissionAvatar = (correctionScore: Number | undefined | null) => (
    <Avatar
        src={submissionIcon}
        appearance="square"
        size="large"
        status={correctionScore > 0 ? "approved" : "declined"}
    />
);

export {examAvatar, submissionAvatar, assignmentAvatar, userAvatar};