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
import studentData from './__fixtures__/studentData-SD.json'

type Props = {
  userData: any;
};

type  StudentData = {
    overallPercentileHistory: number[];
    overallMedianHistory: number[];
    scoreHistory: number[];
    scoreHistogram: {
        label: string[];
        frequency: number[];
    }
    assignments: {
        assignmentName: string[];
        assignmentScore: number[];
        assignmentPercentile: number[];
        assignmentMedian: number[];
        assignmentMaxScore: number[];
    };
    numberOfWeeks: number
}

export default function StudentsDashboard(props: Props) {
    const { assignments } = props.userData

    // representative data - TODO fetch data here
    const data: StudentData = studentData

  return (
    <Dashboard>
      <InfoBannersContainer>
        <InfoBanner text={"Score:"} value={calculateSemesterScore(assignments)} />
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
