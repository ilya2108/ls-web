import React from "react";
import { Bar } from "react-chartjs-2";
import GetColours, {
  ChartContainer, Title,
} from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";

type Props = {
  title: string;
  description?: string;
  data: {
    datasets: any;
    label: any;
    datasetNames: any
  };
};

export default function BarChart(props: Props) {
  return (
    <ChartContainer>
      <Title>{props.title}</Title>
      {props.description && <Tooltip description={props.description} />}
      <Bar
        data={{
          labels: props.data.label,
          datasets: props.data.datasets.map((set, index) => ({
            label: props.data.datasetNames[index],
            data: set,
            backgroundColor: GetColours(
              "#004da3",
              props.data.datasets[0].length,
              index
            ),
          })),
        }}
        options={{
          legend: {
            display: false,
          },
          tooltips: {
            enabled: true,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
              },
            ],
          },
        }}
      />
    </ChartContainer>
  );
}
