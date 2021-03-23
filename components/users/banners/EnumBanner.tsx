import React from "react";
import { ChartContainer } from "../../../pages-styles/UserPage/UserPage.styles";

type Props = {
  title: string;
  data: any;
};

export default function EnumBanner(props: Props) {
  return (
    // TODO
    <ChartContainer>
      <span style={{ fontSize: 19, fontWeight: 500 }}>{props.title}</span>
      <img src={"info.svg"} alt={"info"} style={{ width: 20 }} />
    </ChartContainer>
  );
}
