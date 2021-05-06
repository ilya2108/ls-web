import React from "react";
import { Pie } from "react-chartjs-2";
import getColours, {
    ChartContainer,
    Title
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
            tooltips: {
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
            }
        }}
      />
    </ChartContainer>
  );
}
