import React from "react";
import { InfoBannerContent } from "../../../pages-styles/UserPage/UserPage.styles";

type Props = {
  text: string;
  value: any;
};

export default function InfoBanner(props: Props) {
  return (
    <InfoBannerContent>
      <span>{props.text}</span>
      <span>{props.value}</span>
    </InfoBannerContent>
  );
}
