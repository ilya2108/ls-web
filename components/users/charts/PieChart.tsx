import React from "react";
import { Pie } from "react-chartjs-2";
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

export default function PieChart(props: Props) {
  return (
    <ChartContainer>
      <Title>{props.title}</Title>
      <img src={"info.svg"} alt={"info"} style={{ width: 20 }} />
      <Pie
        data={{
          labels: props.data.label,
          datasets: props.data.datasets.map((set) => ({
            data: set,
            backgroundColor: GetColours(
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
