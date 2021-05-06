import React from "react";
import { Line } from "react-chartjs-2";
import getColours, {
  ChartContainer,
  Title,
} from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";
import Lozenge from "@atlaskit/lozenge";

type Props = {
  title: string;
  description?: string;
  data: {
    datasets: number[][];
    label: string[] | number[];
    datasetNames: string[];
  };
  disabled?: boolean;
  maxValue?: number;
};

export default function LineChart(props: Props) {
  return (
    <ChartContainer>
      <Title>{props.title}</Title>
      {props.description && <Tooltip description={props.description} />}
      {props.disabled  && <span style={{marginLeft: "10px"}}><Lozenge isBold>Is disabled</Lozenge></span>}
      <Line
        data={{
          labels: props.data.label,
          datasets: props.data.datasets.map((set, index) => ({
            label: props.data.datasetNames[index],
            fill: false,
            borderColor: getColours(
              "#004da3",
              props.data.datasets[0].length,
              index
            ),
            data: set,
          })),
        }}
        options={{
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                display: true,
                ticks: {
                  suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                  suggestedMax: props.maxValue ? props.maxValue : null,
                },
              },
            ],
          },
        }}
      />
    </ChartContainer>
  );
}
