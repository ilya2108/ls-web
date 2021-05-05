import BarChart from "./charts/BarChart";
import {
  Dashboard,
  InfoBannersContainer,
} from "../../pages-styles/UserPage/UserPage.styles";
import InfoBanner from "./banners/InfoBanner";
import LineChart from "./charts/LineChart";
import EnumBanner from "./banners/EnumBanner";
import React, {useState} from "react";
import PieChart from "./charts/PieChart";
import dataGlobalPerformance from "./__fixtures__/globalPerformance.json";
import filterStudentData from "./__fixtures__/filterStudentData-SD.json";
import useSWR from "swr";
import { gql } from "graphql-request";
import { fetcher } from "../../modules/api";
import Error from "../Error";
import HugeSpinner from "../HugeSpinner/HugeSpinner";
import settings from "./__settings__/settings.json";
import Toggle from "@atlaskit/toggle";
import Tooltip from "./Tooltip";
import {roundUp} from "../../utils/dashboard-utils"

type Props = {
  userData: any;
  settings: boolean;
  userId: string;
  profile: boolean;
};

type GlobalPerformance = {
  global: {
    year: string;
    throughput: number;
    finalGrades: {
      name: string;
      numberOfStudents: number;
      percentage: number;
    }[];
  }[];
};

export default function StudentsDashboard(props: Props) {
  const {
    firstName,
    lastName,
    email,
    assignments,
    dateJoined,
    isActive,
    isStaff,
    isSuperuser,
    username,
    courses,
    parallels,
    id,
  } = props.userData || [];

    const [data, setData] = useState({
        "all": null,
        "filter": null,
    })

    let error = false ;
    let renderSpinner = true;

  const fetchStudentDashboardData = () => {
      {
          // fixtures -- TODO load real data when available
          const studentData = filterStudentData
          const errorStudentData = false
          const globalPerformanceData: GlobalPerformance = dataGlobalPerformance;

          data["filter"] = (studentData && globalPerformanceData ? {
              studentData: studentData,
              globalPerformanceData: globalPerformanceData
          } : null)

          error = errorStudentData

          renderSpinner =
              !error && (!studentData)
      }
      {
          const {data: studentDashboardData, error: errorStudentData} = props.profile ? useSWR(
              gql`
                  {
                      UserMyself {
                          username
                          userStats {
                              results {
                                  score
                                  scoreHistory
                                  percentileHistory
                                  userAssignmentStat {
                                      results {
                                          assignment {
                                              id
                                              name
                                              median
                                              maxScore
                                              weekOfSemester
                                          }
                                          score
                                          percentile
                                      }
                                  }
                              }
                          }
                          coursesAsStudent {
                              totalCount
                              results {
                                  name
                                  kosTag
                                  coursestat {
                                      median
                                      medianHistory
                                      scoreHistogram {
                                          results {
                                              score
                                              frequency
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              `,
              fetcher
          ) : useSWR(
              gql`
                  {
                      UserList(id: ${props.profile ? id : props.userId}) {
                          results {
                              username                # self explanatory
                              userStats {
                                  results {
                                      score                # users overall score
                                      scoreHistory            # history of weekly score
                                      percentileHistory          # percentile based on other users score histories
                                      userAssignmentStat {
                                          results {
                                              assignment {          # assignment data, all self explanatory
                                                  id
                                                  name
                                                  median
                                                  maxScore            # max possible score of assignment
                                                  weekOfSemester          # the week of semester the assignment was assigned
                                              }
                                              score              # users score from this assignment
                                              percentile            # users percentile from this assignment
                                          }
                                      }
                                  }
                              }
                              coursesAsStudent {
                                  totalCount
                                  results {
                                      name
                                      kosTag
                                      coursestat {
                                          median
                                          medianHistory
                                          scoreHistogram {
                                              results {
                                                  score
                                                  frequency
                                              }
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              `,
              fetcher
          );

          const studentData = (studentDashboardData ?
              (props.profile ? studentDashboardData.UserMyself : studentDashboardData.UserList.results[0]) :
              null);

          // adjusting loaded data
          if (studentData) {
              studentData.userStats.results[0].percentileHistory = studentData.userStats.results[0].percentileHistory.map(
                  (item) => roundUp(item, 2)
              );
              studentData.userStats.results[0].userAssignmentStat.results = studentData.userStats.results[0].userAssignmentStat.results.map(
                  (item) => {
                      item.percentile = roundUp(item.percentile, 2);
                      return item;
                  }
              );

              studentData.coursesAsStudent.results[0].coursestat.scoreHistogram.results = studentData.coursesAsStudent.results[0].coursestat.scoreHistogram.results.sort(
                  (a, b) => {
                      if (a.score < b.score)
                          return -1;
                      if (a.score > b.score)
                          return 1;
                      return 0;
                  }
              );
          }

          // fixtures -- TODO load real data when available
          const globalPerformanceData: GlobalPerformance = dataGlobalPerformance;

          data["all"] = (studentData && globalPerformanceData ? {
              studentData: studentData,
              globalPerformanceData: globalPerformanceData
          } : null)
          error = errorStudentData
          renderSpinner = !error && (!studentData)
      }
  }

  fetchStudentDashboardData()

    const defaultToggle = data["all"] ?
        (settings.studentDashboardIdleToggle.enabledByDefaultFromWeek
        ? settings.studentDashboardIdleToggle
            .enabledByDefaultFromWeek <=
        data["all"].studentData.userStats.results[0]
            .percentileHistory.length
        : false) :
        null
    const [filter, setFilter] = useState(defaultToggle ? "filter" : "all")
  if (error) {
    return <Error />;
  }

  const checkVisibility = (item) =>
    !props.profile || settings.studentDashboardComponents[item];
  const checkDisabled = (item) => !settings.studentDashboardComponents[item];

  return (
    <>
      {renderSpinner ? (
        <HugeSpinner />
      ) : error ? null : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "250px",
              paddingBottom: "20px",
            }}
          >
            <span>
              <strong
                style={{
                  textAlign: "center",
                  display: "inline-block",
                  marginTop: "4px",
                  textSizeAdjust: "16px",
                }}
              >
                Enable idle students:
              </strong>
              <Tooltip
                description={
                  "Shows stats of non idle students (students with higher score than particular value)"
                }
              />
            </span>
            <Toggle
              id="toggle-large"
              size="large"
              defaultChecked={defaultToggle}
              onChange={() => {setFilter(prevState => prevState === "all" ? "filter" : "all")}}
            />
          </div>
          <Dashboard>
            <InfoBannersContainer>
              {checkVisibility("score") && (
                <InfoBanner
                  text={"My Score:"}
                  value={
                      data[filter].studentData.userStats.results[0].score
                  }
                  disabled={checkDisabled("score")}
                />
              )}
              {checkVisibility("percentile") && (
                <InfoBanner
                  text={"Percentile:"}
                  value={
                      data[filter].studentData.userStats.results[0]
                      .percentileHistory[
                      data[filter].studentData.userStats.results[0]
                        .percentileHistory.length - 1
                    ]
                  }
                  disabled={checkDisabled("percentile")}
                />
              )}
              {checkVisibility("median") && (
                <InfoBanner
                  text={"Median:"}
                  value={data[filter].studentData.coursesAsStudent.results[0].coursestat.median}
                  disabled={checkDisabled("median")}
                />
              )}
            </InfoBannersContainer>
            {checkVisibility("scoreHistogram") && (
              <BarChart
                title={"Students' Score Histogram"}
                description={
                  "Graph shows the distribution of the student score"
                }
                data={{
                  datasets: [
                      data[filter].studentData.coursesAsStudent.results[0].coursestat.scoreHistogram.results.map(
                      (item) => item.frequency
                    ),
                  ],
                  label: data[filter].studentData.coursesAsStudent.results[0].coursestat.scoreHistogram.results.map(
                    (item) => [item.score]
                  ),
                  datasetNames: [""],
                }}
                id={"scoreHistogram"}
                disabled={checkDisabled("scoreHistogram")}
              />
            )}
            {checkVisibility("medianHistory") && (
              <LineChart
                title={"History of Median"}
                description={
                  "Graph shows history of overall median of score and compares it to my score"
                }
                data={{
                  datasets: [
                      data[filter].studentData.userStats.results[0]
                      .scoreHistory,
                      data[filter].studentData.coursesAsStudent.results[0].coursestat.medianHistory,
                  ],
                  label: Array(
                      data[filter].studentData.userStats.results[0]
                      .scoreHistory.length
                  )
                    .fill(null)
                    .map((_, i) => "week " + (i + 1)),
                  datasetNames: ["My score", "Students overall median"],
                }}
                disabled={checkDisabled("medianHistory")}
              />
            )}
            {checkVisibility("percentileHistory") && (
              <LineChart
                title={"History of Percentile"}
                description={"Graph shows history of my percentile"}
                data={{
                  datasets: [
                      data[filter].studentData.userStats.results[0]
                      .percentileHistory,
                  ],
                  label: Array(
                      data[filter].studentData.userStats.results[0]
                      .percentileHistory.length
                  )
                    .fill(null)
                    .map((_, i) => "week " + (i + 1)),
                  datasetNames: ["Percentile history"],
                }}
                disabled={checkDisabled("percentileHistory")}
              />
            )}
            {checkVisibility("performancePrediction") && (
              <PieChart
                title={"Performance prediction"}
                description={
                  "Graph shows final grades ratio of last year students matched with my score and week"
                }
                data={{
                  datasets: [
                      data[filter].globalPerformanceData.global[0].finalGrades.map(
                      (grade) => grade.percentage
                    ),
                  ],
                  label: data[filter].globalPerformanceData.global[0].finalGrades.map(
                    (grade) => grade.name
                  ),
                }}
                disabled={checkDisabled("performancePrediction")}
              />
            )}
            {checkVisibility("assignments") && (
              <EnumBanner
                title={"Assignments"}
                data={{
                  headers: [
                    "Assignment name",
                    "My Score",
                    "Percentile",
                    "Median",
                    "Max Score",
                    "Assigned in week",
                  ],
                  rows: data[filter].studentData.userStats.results[0].userAssignmentStat.results.map(
                    (item) => [
                      item.assignment.name,
                      item.score,
                      item.percentile,
                      item.assignment.median,
                      item.assignment.maxScore,
                      item.assignment.weekOfSemester,
                    ]
                  ),
                }}
                defaultSortKey={"Percentile"}
                defaultSortOrder={"ASC"}
                links={
                  props.profile
                    ? null
                    : {
                        urlPrefix: "/assignments/edit/",
                        nameId: data[filter].studentData.userStats.results[0].userAssignmentStat.results.map(
                          (item) => item.assignment.id
                        ),
                      }
                }
                disabled={checkDisabled("assignments")}
              />
            )}
          </Dashboard>
        <h3>Course Performance</h3>
        <Dashboard>
          <InfoBannersContainer>
            {checkVisibility("throughput") && (
              <InfoBanner
                text={"Throughput " + data[filter].globalPerformanceData.global[0].year + ":"}
                value={data[filter].globalPerformanceData.global[0].throughput}
                disabled={checkDisabled("throughput")}
              />
            )}
          </InfoBannersContainer>
          {checkVisibility("grades") && (
            <PieChart
              title={"Students grades " + data[filter].globalPerformanceData.global[0].year}
              data={{
                datasets: [
                    data[filter].globalPerformanceData.global[0].finalGrades.map(
                    (grade) => grade.percentage
                  ),
                ],
                label: data[filter].globalPerformanceData.global[0].finalGrades.map(
                  (grade) => grade.name
                ),
              }}
              disabled={checkDisabled("grades")}
            />
          )}
          {checkVisibility("gradesByYear") && (
            <BarChart
              title={"Grades comparison by year"}
              data={{
                datasets: data[filter].globalPerformanceData.global.map((y) =>
                  y.finalGrades.map((grade) => grade.percentage)
                ),
                label: data[filter].globalPerformanceData.global[0].finalGrades.map(
                  (grade) => grade.name
                ),
                datasetNames: data[filter].globalPerformanceData.global.map((y) => y.year),
              }}
              id={"gradesByYear"}
              disabled={checkDisabled("gradesByYear")}
            />
          )}
        </Dashboard>
      </>
          )}
    </>
  );
}
