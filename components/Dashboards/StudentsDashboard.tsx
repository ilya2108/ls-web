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

    // representative data - TODO fetch data here
    const data = {
        overallPercentileHistory: [14, 35, 66, 54, 68, 73, 72, 65, 71, 78, 81, 82, 85],
        overallMedianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
        scoreHistory: [12, 56, 89, 57, 47, 69, 69, 48, 37, 63, 59, 67, 88],
        scoreHistogram: {
            label: ["0", "3", "5", "7", "7.5", "8", "11", "14", "19", "24", "25", "26", "27", "28", "28", "34",
                    "35", "36", "39", "41", "42", "44", "45.5", "46", "48", "50", "51", "53", "54", "55", "68",
                    "75", "77", "81", "85", "91"],
            frequency: [12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55,
                        201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37]
        },
        assignments: {
            assignmentName: ["awk1", "awk2", "sed DU", "grep", "grep DU"],
            assignmentScore: [0, 2, 1, 0, 2],
            assignmentPercentile: [10, 15, 23, 30, 37],
            assignmentMedian: [4, 3, 2, 4, 6],
            assignmentMaxScore: [5, 4, 4, 6, 8]
        },
        numberOfWeeks: 13
    }

  return (
    <Dashboard>
      <InfoBannersContainer>
        <InfoBanner text={"Score:"} value={score} />
        <InfoBanner text={"Percentile:"} value={data.overallPercentileHistory[data.overallPercentileHistory.length - 1]} />
        <InfoBanner text={"Median:"} value={data.overallMedianHistory[data.overallMedianHistory.length - 1]} />
      </InfoBannersContainer>
      <BarChart
        title={"Students' Score Histogram"}
        description={"Histogram of students score"}
        data={{
          datasets: [data.scoreHistogram.frequency],
          label: data.scoreHistogram.label,
          datasetNames: [""]
        }}
      />
      <LineChart
        title={"History of Median"}
        description={"Chart shows history of median of all students score and compares it to my score"}
        data={{
          datasets: [data.scoreHistory, data.overallMedianHistory],
          label: Array(data.numberOfWeeks).fill(null).map((_, i) => ("week " + (i + 1))),
          datasetNames: ["My score", "Students overall median"]
        }}
      />
      <LineChart
        title={"History of Percentile"}
        description={"Chart shows history of my percentile"}
        data={{
          datasets: [data.overallPercentileHistory],
          label: Array(data.numberOfWeeks).fill(null).map((_, i) => ("week " + (i + 1))),
          datasetNames: ["Percentile history"]
        }}
      />
      <EnumBanner title={"Assignments"}
        data={{
          headers: ["Assignment name", "My Score", "Percentile", "Median", "Max Score"],
          rows:
            data.assignments.assignmentName.map((item, i) => [
                data.assignments.assignmentName[i],
                data.assignments.assignmentScore[i],
                data.assignments.assignmentPercentile[i],
                data.assignments.assignmentMedian[i],
                data.assignments.assignmentMaxScore[i]])
        }}
        defaultSortKey={"Percentile"}
        defaultSortOrder={"ASC"}
      />
    </Dashboard>
  );
}
