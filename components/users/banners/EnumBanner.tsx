import React from "react";
import { ChartContainer } from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";

type Props = {
  title: string;
  description?: string;
  data: any;
};

export default function EnumBanner(props: Props) {
  return (
    // TODO
    <ChartContainer>
      <span style={{ fontSize: 19, fontWeight: 500 }}>{props.title}</span>
        {props.description && <Tooltip description={props.description} />}
    </ChartContainer>
  );
}
