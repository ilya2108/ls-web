import React from "react";
import { Pie } from "react-chartjs-2";
import getColours, {
    ChartContainer,
    Title
} from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";

type Props = {
  title: string;
  description?: string;
  data: {
      datasets: number[][];
      label: string[] | number[];
  };
};

export default function PieChart(props: Props) {
  return (
    <ChartContainer>
      <Title>{props.title}</Title>
        {props.description && <Tooltip description={props.description} />}
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