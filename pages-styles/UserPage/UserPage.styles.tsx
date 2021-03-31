import styled from "styled-components";

export const Table = styled.section`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 10px;
`;

export const Header = styled.article`
  margin-bottom: 30px;

  grid-column: 1 / -1;
`;

export const HTag = styled.span`
  margin-right: 10px;
`;

export const HRow = styled.div`
  margin-bottom: 5px;
`;

export const Row = styled.article`
  padding: 10px 0 10px 0;

  grid-column: 1 / -1;

  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-gap: 10px;
`;

export const LeftCell = styled.div`
  text-align: left;

  grid-column: 1;
`;

export const RightCell = styled.div`
  text-align: left;

  grid-column: 2;
`;

export const ButtonCell = styled.div`
  grid-column: 3;
`;

export const BorderCell = styled.div`
  border-radius: 5px;
  margin-top: 10px;
  padding: 10px;
  border: 2px solid #dfe1e6;
`;

export const CodeCell = styled.pre`
  background-color: #f6f6f6;
  border-radius: 5px;
  overflow: auto;
  padding: 10px;
`;

export const Tab = styled.button`
  margin-bottom: -2px;
  font-size: 20px;
  padding: 10px 60px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 0;
  outline: 0;
  ${({ hovered, active }) =>
    hovered &&
    !active &&
    `
    opacity: 0.3;
    `}
  ${({ active }) =>
    active &&
    `
    border-bottom: 2px solid #0747A6;
    opacity: 1;
  `}
`;

export const TabGroup = styled.div`
  margin-bottom: 30px;
  border-bottom: 2px solid #dfe1e6;
`;

export const TabContent = styled.div`
  padding: 15px;
`;

export const Dashboard = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

export const ChartContainer = styled.div`
  ${({ normalWidth }) =>
      !normalWidth &&
      ` width: 500px; `}
  background: #f4f5f7;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
`;

export const InfoBannersContainer = styled.div`
  width: 400px;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
`;

export const InfoBannerContent = styled.div`
  background: #f4f5f7;
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  display: flex;
  justify-content: space-around;
  font-weight: 500;
  font-size: 18px;
`;

export const Title = styled.span`
  font-size: 19px;
  font-weight: 500;
`;

function LightenDarkenColor(col, amt) {
  const usePound = col[0] == "#";

  if (col[0] == "#")
    col = col.slice(1);

  const num = parseInt(col, 16);

  const rShift = ((num >> 16) + amt);
  const r = rShift > 255 ? 255 : (rShift < 0 ? 0 : rShift);

  const bShift = ((num >> 8) & 0x00ff) + amt;
  const b = bShift > 255 ? 255 : (bShift < 0 ? 0 : bShift);

  const gShift = (num & 0x0000ff) + amt;
  const g = gShift > 255 ? 255 : (gShift < 0 ? 0 : gShift);

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

export default function getColours(colour: string, range: number, i = -1) {
  if (range > 15) return colour;

  const res = Array(range)
    .fill("")
    .map((col, index) =>
      index === 0
        ? colour
        : LightenDarkenColor(colour, 20 + ((index - 1) * 80) / range)
    );

  return i === -1 ? res : res[i];
}

export const InfoTooltip = styled.span`
  ${({ hovered }) =>
    !hovered &&
    `visibility: hidden;`
  }
  
  border-radius: 6px;
  padding: 5px 0;
  width: 180px;
  background-color: #4d4d4d;
  color: white;
  text-align: center;
  position: absolute;
  z-index: 1;
  top: -5px;
  left: 105%;
`;
