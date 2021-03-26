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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" style={{ width: 20, cursor: "pointer" }}><defs><clipPath><path fill="#f2f2f2" d="m7 1023.36h1v1h-1z"/></clipPath><clipPath><path fill="#f2f2f2" d="m7 1023.36h1v1h-1z"/></clipPath><clipPath><path d="m22.2 686.12h1447.73v-667.19h-1447.73v667.19"/></clipPath><clipPath><path d="m0 706.47h1490.93v-706.47h-1490.93v706.47"/></clipPath><clipPath><path fill="#aade87" fillOpacity=".472" d="m-6 1028.36h32v32h-32z"/></clipPath><clipPath><path fill="#00f" fillOpacity=".514" d="m-7 1024.36h34v34h-34z"/></clipPath><clipPath><path fill="#f2f2f2" d="m7 1023.36h1v1h-1z"/></clipPath><clipPath><path fill="#f2f2f2" d="m7 1023.36h1v1h-1z"/></clipPath><clipPath><path fill="#f2f2f2" d="m7 1023.36h1v1h-1z"/></clipPath></defs><path d="M11 3A8 8 0 0 0 3 11 8 8 0 0 0 11 19 8 8 0 0 0 19 11 8 8 0 0 0 11 3M10.800781 6.5A1 1 0 0 1 11.800781 7.5 1 1 0 0 1 10.800781 8.5 1 1 0 0 1 9.800781 7.5 1 1 0 0 1 10.800781 6.5M10.693 9.5H10.906C11.262 9.5 11.551 9.786 11.551 10.143V14.857C11.551 15.214 11.262 15.5 10.906 15.5H10.693C10.337 15.5 10.05 15.214 10.05 14.857V10.143C10.05 9.786 10.337 9.5 10.693 9.5" transform="translate(0-.004)" fill="#4d4d4d" fillRule="evenodd"/></svg>
      <InfoTooltip hovered={hovered}>{props.description}</InfoTooltip>
    </div>
  );
}
