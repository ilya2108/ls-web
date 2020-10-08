import React, { ReactElement } from "react";
import SuccessIcon from "@atlaskit/icon/glyph/check-circle";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import { G400, R400 } from "@atlaskit/theme/colors";

type action = {
  content: string,
  onClick: Function
}

type flagData = {
  created: number,
  appearance?: string,
  description?: string,
  icon: ReactElement,
  title: string,
  actions?: Array<action>
};

export const PasswordChangeSuccessFlag = (dismissFlag: Function): flagData => ({
  created: Date.now(),
  appearance: "success",
  icon: <SuccessIcon label="Success" secondaryColor={G400} />,
  title: "Password changed 👌",
  actions: [
    {
      content: "Thanks!",
      onClick: dismissFlag
    }
  ]
});

export const PasswordChangeErrorFlag = (e: any, dismissFlag: Function): flagData => ({
  created: Date.now(),
  appearance: "error",
  icon: <ErrorIcon label="Error" secondaryColor={R400} />,
  title: "Something went wrong while changing password 😞",
  description: `Error: ${e}`,
  actions: [
    {
      content: "Ok",
      onClick: dismissFlag
    }
  ]
});