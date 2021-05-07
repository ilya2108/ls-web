import React from "react";
import { Line } from "react-chartjs-2";
import getColours, {
  ChartContainer,
  Title,
} from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";
import Lozenge from "@atlaskit/lozenge";
import {getRegression} from "../../../utils/dashboard-utils";

type Props = {
  title: string;
  description?: string;
  data: {
    datasets: number[][];
    label: string[];
    datasetNames: string[];
  };
  disabled?: boolean;
  maxValue?: number;
  regression?: boolean[]
};

export default function LineChart(props: Props) {
  const lines = props.data.datasets.length;
  // console.log("FIRST")
  // console.log(props)
  // console.log(lines)

  const addRegression = () => {
    props.regression.map((e, i) => {
      if (e) {
        props.data.datasets.push(getRegression(props.data.datasets[i]))
        props.data.datasetNames.push("Regression of " + props.data.datasetNames[i])
      }
    })
  }

  if (props.regression)
    addRegression()
  // console.log("SECOND")
  // console.log(props)
  // console.log(lines)

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
            borderColor: index < lines ?
                getColours(
              "#004da3",
              props.data.datasets[0]?.length || 0,
              index
            ) :
            "#a8aabc",
            data: set,
          }))
        }}
        options={{
          // legend: {
          //   display: false,
          // },
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
