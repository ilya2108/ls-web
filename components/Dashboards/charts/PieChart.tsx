import React from "react";
import { Pie } from "react-chartjs-2";
import getColours, {
    ChartContainer,
    Title
} from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";
import Lozenge from "@atlaskit/lozenge";

type Props = {
  title: string;
  description?: string;
  data: {
      datasets: number[][];
      label: string[] | number[];
  };
  disabled?: boolean;
};

export default function PieChart(props: Props) {
  return (
    <ChartContainer>
      <Title>{props.title}</Title>
        {props.description && <Tooltip description={props.description} />}
        {props.disabled  && <span style={{marginLeft: "10px"}}><Lozenge isBold>Is disabled</Lozenge></span>}
      <Pie
        data={{
          labels: props.data.label,
          datasets: props.data.datasets.map((set) => ({
            data: set,
            backgroundColor: getColours(
              "#004da3",
              props.data.datasets[0].length
            ),
          })),
        }}
        options={{
          legend: {
            display: true,
            position: "right",
          },
        }}
      />
    </ChartContainer>
  );
}
