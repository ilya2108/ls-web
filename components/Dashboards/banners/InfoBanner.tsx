import React from "react";
import {
  ChartContainer,
  InfoBannerContent,
} from "../../../pages-styles/UserPage/UserPage.styles";
import Lozenge from "@atlaskit/lozenge";
import Tooltip from "../Tooltip";

type Props = {
  text: string;
  value: any;
  disabled?: boolean;
  description?: string;
};

export default function InfoBanner(props: Props) {
  return (
    <InfoBannerContent>
      <span><span style={{ fontWeight: 500, fontSize: "18px" }}>{props.text}</span>
        {props.description && <Tooltip description={props.description} />}</span>
      <span style={{ fontWeight: 500, fontSize: "18px" }}>{props.value}</span>
      {props.disabled && (
        <span style={{ marginLeft: "10px" }}>
          <Lozenge isBold>Is disabled</Lozenge>
        </span>
      )}
    </InfoBannerContent>
  );
}
