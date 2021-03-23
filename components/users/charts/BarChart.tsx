import React from "react";
import { Bar } from "react-chartjs-2";
import GetColours, {
  ChartContainer, Title,
} from "../../../pages-styles/UserPage/UserPage.styles";

type Props = {
  title: string;
  data: {
    datasets: any;
    label: any;
  };
};

export default function BarChart(props: Props) {
  return (
    <ChartContainer>
      <Title>{props.title}</Title>
      <img src={"info.svg"} alt={"info"} style={{ width: 20 }} />
      <Bar
        data={{
          labels: props.data.label,
          datasets: props.data.datasets.map((set, index) => ({
            label: "TODO",
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
