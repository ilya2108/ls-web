import React from "react";
import { Bar } from "react-chartjs-2";
import getColours, {
  ChartContainer, Title,
} from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";
import Lozenge from "@atlaskit/lozenge";
import {getPercentageRatio} from "../../../utils/dashboard-utils";

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

export default function BarChart(props: Props) {
  return (
    <ChartContainer>
      <Title>{props.title}</Title>
      {props.description && <Tooltip description={props.description} />}
      {props.disabled  && <span style={{marginLeft: "10px"}}><Lozenge isBold>Is disabled</Lozenge></span>}
      <Bar
        data={{
          labels: props.data.label,
          datasets: props.data.datasets.map((set, index) => ({
            label: props.data.datasetNames[index],
            data: set,
            backgroundColor: getColours(
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
            callbacks: {
              label: function(tooltipItem, data) {
                const dataset = data.datasets[tooltipItem.datasetIndex].data;
                const ratios = getPercentageRatio(dataset);

                return dataset[tooltipItem.index] + ' (' + ratios[tooltipItem.index] + '%)';
              },
              title: function(tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
              }
            }
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
              },
            ],
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
