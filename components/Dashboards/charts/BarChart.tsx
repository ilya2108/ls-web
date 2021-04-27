import React, {useState} from "react";
import { Bar } from "react-chartjs-2";
import getColours, {
  ChartContainer, Title,
} from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";
import Toggle from "@atlaskit/toggle"
import settings from "../__settings__/settings.json";

type Props = {
  title: string;
  description?: string;
  data: {
    datasets: number[][];
    label: string[] | number[];
    datasetNames: string[];
  };
  id?: string;
};

export default function BarChart(props: Props) {
  // const visibilityOfComponent = settings;
  // const [isChecked, setIsChecked] = useState(false);
  // // const fs = require('fs');
  //
  // const writeChange = () => {
  //   console.log(visibilityOfComponent);
  //   //fs.writeFile("../__settings__/settings.json", JSON.stringify(visibilityOfComponent), err => {})
  // }
  // if (props.id && !visibilityOfComponent["components"][props.id]){
  //   setIsChecked(true);
  //   writeChange();
  // }
  // else if (props.id)
  //   setIsChecked(visibilityOfComponent["components"][props.id]);
  //
  // visibilityOfComponent["components"][props.id] = isChecked;

  return (
    <ChartContainer>
      <Title>{props.title}</Title>
      {props.description && <Tooltip description={props.description} />}
      {/*{props.id &&*/}
      {/*  <Toggle*/}
      {/*      defaultChecked={visibilityOfComponent["components"][props.id]}*/}
      {/*      onChange={() => {*/}
      {/*        setIsChecked(!isChecked);*/}
      {/*        writeChange();*/}
      {/*      }}*/}
      {/*  />*/}
      {/*}*/}
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
