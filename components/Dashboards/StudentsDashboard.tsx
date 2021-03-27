import PieChart from "./charts/PieChart";
import BarChart from "./charts/BarChart";
import {
  Dashboard,
  InfoBannersContainer,
} from "../../pages-styles/UserPage/UserPage.styles";
import InfoBanner from "./banners/InfoBanner";
import LineChart from "./charts/LineChart";
import EnumBanner from "./banners/EnumBanner";
import {calculateSemesterScore} from "../../utils/score-utils";
import React from "react";

type Props = {
  userData: any;
};

export default function StudentsDashboard(props: Props) {
    const score = calculateSemesterScore(props.userData.assignments);

  return (
    <Dashboard>
      <InfoBannersContainer>
        <InfoBanner text={"Score:"} value={score} />
        <InfoBanner text={"Percentil:"} value={"hardcoded"} />
        <InfoBanner text={"Median:"} value={"hardcoded"} />
        <InfoBanner text={"Grade:"} value={"hardcoded"} />
      </InfoBannersContainer>
      <PieChart
        title={"Last year's students result"}
        data={{
          datasets: [[12, 19, 30, 55, 201, 37]],
          label: ["A", "B", "C", "D", "E", "F"],
        }}
        description={"Chart shows final grades of last course students with similar score in the same time"}
      />
      <BarChart
        title={"Students' Score Histogram"}
        description={"Histogram of students score"}
        data={{
          datasets: [
            [
              12,
              19,
              30,
              55,
              201,
              37,
              12,
              19,
              30,
              55,
              201,
              37,
              12,
              19,
              30,
              55,
              201,
              37,
              12,
              19,
              30,
              55,
              201,
              37,
              12,
              19,
              30,
              55,
              201,
              37,
              12,
              19,
              30,
              55,
              201,
              37,
            ],
          ],
          label: [
            "0",
            "3",
            "5",
            "7",
            "7.5",
            "8",
            "11",
            "14",
            "19",
            "24",
            "25",
            "26",
            "27",
            "28",
            "28",
            "34",
            "35",
            "36",
            "39",
            "41",
            "42",
            "44",
            "45.5",
            "46",
            "48",
            "50",
            "51",
            "53",
            "54",
            "55",
            "68",
            "75",
            "77",
            "81",
            "85",
            "91",
          ],
          datasetNames: [""]
        }}
      />
      <LineChart
        title={"History of Median"}
        description={"Chart shows history of median of all students score and compares it to my score"}
        data={{
          datasets: [
            [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
            [12, 56, 89, 57, 47, 69, 69, 48, 37, 63, 59, 67, 88],
          ],
          label: [
            "week 1",
            "week 2",
            "week 3",
            "week 4",
            "week 5",
            "week 6",
            "week 7",
            "week 8",
            "week 9",
            "week 10",
            "week 11",
            "week 12",
            "week 13",
          ],
          datasetNames: ["My score", "Students overall median"]
        }}
      />
      <LineChart
        title={"History of Percentil"}
        description={"Chart shows history of my percentil"}
        data={{
          datasets: [[14, 35, 66, 54, 68, 73, 72, 65, 71, 78, 81, 82, 85]],
          label: [
            "week 1",
            "week 2",
            "week 3",
            "week 4",
            "week 5",
            "week 6",
            "week 7",
            "week 8",
            "week 9",
            "week 10",
            "week 11",
            "week 12",
            "week 13",
          ],
          datasetNames: ["Percentil history"]
        }}
      />
      <EnumBanner title={"Least successful assignment"}
        data={{
          headers: ["Assignment name", "My Score", "Percentil", "Median"],
          rows: [
              ["awk1", 0, 10, 4],
              ["awk2", 2, 15, 4],
              ["sed DU", 1, 23, 4],
              ["grep", 0, 30, 4],
              ["grep DU", 2, 37, 4]
          ]
        }}
        defaultSortKey={"Percentil"}
        defaultSortOrder={"ASC"}
      />
    </Dashboard>
  );
}
