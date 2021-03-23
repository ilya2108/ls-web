import React, { useState } from "react";
import { InfoTooltip } from "../../pages-styles/UserPage/UserPage.styles";

type Props = {
  description: string;
};

export default function Tooltip(props: Props) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "inline-block" }}
    >
      <img
        src={"info.svg"}
        alt={"info"}
        style={{ width: 20, cursor: "pointer" }}
      />
      <InfoTooltip hovered={hovered}>{props.description}</InfoTooltip>
    </div>
  );
}
