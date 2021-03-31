import React, { useState } from "react";
import { InfoTooltip } from "../../pages-styles/UserPage/UserPage.styles";
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';

type Props = {
  description: string;
};

export default function Tooltip(props: Props) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "inline-block", cursor: "pointer" }}
    >
      <EditorPanelIcon label={"information"} size={"medium"}/>
      <InfoTooltip hovered={hovered}>{props.description}</InfoTooltip>
    </div>
  );
}
