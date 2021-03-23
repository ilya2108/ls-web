import PieChart from "./charts/PieChart";
import BarChart from "./charts/BarChart";
import {
  Dashboard,
  InfoBannersContainer,
} from "../../pages-styles/UserPage/UserPage.styles";
import InfoBanner from "./banners/InfoBanner";
import LineChart from "./charts/LineChart";
import EnumBanner from "./banners/EnumBanner";

type Props = {
  userData: any;
};

export default function StudentsDashboard(props: Props) {
  return (
    <Dashboard>
      <InfoBannersContainer>
        <InfoBanner text={"Score:"} value={"14"} />
        <InfoBanner text={"Percentil:"} value={"85"} />
        <InfoBanner text={"Median:"} value={"8"} />
        <InfoBanner text={"Grade:"} value={"F"} />
      </InfoBannersContainer>
      <PieChart
        title={"Last year's students result"}
        data={{
          datasets: [[12, 19, 30, 55, 201, 37]],
          label: ["A", "B", "C", "D", "E", "F"],
        }}
      />
      <BarChart
        title={"Students' Score Histogram"}
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
        }}
      />
      <LineChart
        title={"History of Median"}
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
        }}
      />
      <LineChart
        title={"History of Percentil"}
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
        }}
      />
      <EnumBanner title={"Least successful assignment"} data={{}} />
    </Dashboard>
  );
}
