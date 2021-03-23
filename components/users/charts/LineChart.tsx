import React from "react";
import { Line } from "react-chartjs-2";
import GetColours, {
  ChartContainer,
  Title,
} from "../../../pages-styles/UserPage/UserPage.styles";

type Props = {
  title: string;
  data: {
    datasets: any;
    label: any;
  };
};

export default function LineChart(props: Props) {
  return (
    <ChartContainer>
      <Title>{props.title}</Title>
      <img src={"info.svg"} alt={"info"} style={{ width: 20 }} />
      <Line
        data={{
          labels: props.data.label,
          datasets: props.data.datasets.map((set, index) => ({
            label: "dd",
            fill: false,
            borderColor: GetColours(
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
                  suggestedMax: 100,
                },
              },
            ],
          },
        }}
      />
    </ChartContainer>
  );
}
