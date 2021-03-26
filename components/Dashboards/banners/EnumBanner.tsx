import React from "react";
import { ChartContainer } from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";

type Props = {
  title: string;
  description?: string;
  data: {
    headers: any;
    rows: any;
  };
};

export default function EnumBanner(props: Props) {
  return (
    <ChartContainer>
      <span style={{ fontSize: 19, fontWeight: 500 }}>{props.title}</span>
      {props.description && <Tooltip description={props.description} />}
      <div
        style={{
          display: "grid",
          gridTemplate:
            "repeat(" +
            (props.data.rows.length + 1) +
            ",1fr) / 2fr repeat(" +
            (props.data.headers.length - 1) +
            ",1fr)",
        }}
      >
        {props.data.headers.map((header) => (
          <span
            style={{
              color: "#004da3",
              paddingBottom: "5px",
              paddingTop: "5px",
            }}
          >
            <strong>{header}</strong>
          </span>
        ))}
        {props.data.rows.map((set) =>
          set.map((item) => <span>{item}</span>)
        )}
      </div>
    </ChartContainer>
  );
}
