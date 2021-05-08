import React from "react";
import {
  ChartContainer,
  InfoBannerContent,
} from "../../../pages-styles/UserPage/UserPage.styles";
import Lozenge from "@atlaskit/lozenge";

type Props = {
  text: string;
  value: any;
  disabled?: boolean;
};

export default function InfoBanner(props: Props) {
  return (
    <InfoBannerContent>
      <span>{props.text}</span>
      <span>{props.value}</span>
      {props.disabled && (
        <span style={{ marginLeft: "10px" }}>
          <Lozenge isBold>Is disabled</Lozenge>
        </span>
      )}
    </InfoBannerContent>
  );
}
