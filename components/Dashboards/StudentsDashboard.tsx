import BarChart from "./charts/BarChart";
import {
  Dashboard,
  InfoBannersContainer,
} from "../../pages-styles/UserPage/UserPage.styles";
import InfoBanner from "./banners/InfoBanner";
import LineChart from "./charts/LineChart";
import EnumBanner from "./banners/EnumBanner";
import React from "react";
import PieChart from "./charts/PieChart";
import dataGlobalPerformance from "./__fixtures__/globalPerformance.json";
import useSWR from "swr";
import { gql } from "graphql-request";
import { fetcher } from "../../modules/api";
import Error from "../Error";
import HugeSpinner from "../HugeSpinner/HugeSpinner";
import settings from "./__settings__/settings.json";
import Toggle from "@atlaskit/toggle";
import Tooltip from "./Tooltip";

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

  const { data: studentDashboardData, error: errorStudentData } = useSWR(
    gql`
            query getStudentDashboardData{
                UserList(id: ${props.profile ? id : props.userId}) {
                    results {
                        username                # self explanatory
                        userstat {
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
                }
            }
        `,
    fetcher
  );

  const roundUp = (num, precision) => {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
  };

  if (studentDashboardData) {
    studentDashboardData.UserList.results[0].userstat.percentileHistory = studentDashboardData.UserList.results[0].userstat.percentileHistory.map(
      (item) => roundUp(item, 2)
    );
    studentDashboardData.UserList.results[0].userstat.userAssignmentStat.results = studentDashboardData.UserList.results[0].userstat.userAssignmentStat.results.map(
      (item) => {
        item.percentile = roundUp(item.percentile, 2);
        return item;
      }
    );

    let prev = 0;
    studentDashboardData.UserList.results[0].userstat.scoreHistory = studentDashboardData.UserList.results[0].userstat.scoreHistory.map(
      (val) => {
        if (val !== 0) prev = val;
        return prev;
      }
    );
  }

  const { data: histogramData, error: errorHistogram } = useSWR(
    gql`
      query courseHistogram {
        CourseStatList(courseId: 1) {
          results {
            course {
              kosTag
            }
            scoreHistogram {
              results {
                score
                frequency
              }
            }
          }
        }
      }
    `,
    fetcher
  );

  if (histogramData) {
    histogramData.CourseStatList.results[0].scoreHistogram.results = histogramData.CourseStatList.results[0].scoreHistogram.results.sort(
      (a, b) => {
        if (a.score < b.score) {
          return -1;
        }
        if (a.score > b.score) {
          return 1;
        }
        // a must be equal to b
        return 0;
      }
    );
  }

  const { data: medianData, error: errorMedian } = useSWR(
    gql`
      query courseStats {
        CourseStatList {
          results {
            course {
              name
              kosTag
            }
            median # median of all students score in given course at time of call
            medianHistory # median calculated from all users scoreHistories
          }
        }
      }
    `,
    fetcher
  );

  if (medianData) {
    let prev = 0;
    medianData.CourseStatList.results[0].medianHistory = medianData.CourseStatList.results[0].medianHistory.map(
      (val) => {
        if (val !== 0) prev = val;
        return prev;
      }
    );
  }

  // TODO load real data
  const globalPerformance: GlobalPerformance = dataGlobalPerformance;

  const error = errorStudentData || errorHistogram || errorMedian;
  const renderSpinner =
    !error && (!studentDashboardData || !histogramData || !medianData);

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
              defaultChecked={
                settings.studentDashboardIdleToggle.enabledByDefaultFromWeek
                  ? settings.studentDashboardIdleToggle
                      .enabledByDefaultFromWeek <=
                    studentDashboardData.UserList.results[0].userstat
                      .percentileHistory.length
                  : false
              }
              onChange={() => {}}
            />
          </div>
          <Dashboard>
            <InfoBannersContainer>
              {checkVisibility("score") && (
                <InfoBanner
                  text={"My Score:"}
                  value={
                    studentDashboardData.UserList.results[0].userstat.score
                  }
                  disabled={checkDisabled("score")}
                />
              )}
              {checkVisibility("percentile") && (
                <InfoBanner
                  text={"Percentile:"}
                  value={
                    studentDashboardData.UserList.results[0].userstat
                      .percentileHistory[
                      studentDashboardData.UserList.results[0].userstat
                        .percentileHistory.length - 1
                    ]
                  }
                  disabled={checkDisabled("percentile")}
                />
              )}
              {checkVisibility("median") && (
                <InfoBanner
                  text={"Median:"}
                  value={medianData.CourseStatList.results[0].median}
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
                    histogramData.CourseStatList.results[0].scoreHistogram.results.map(
                      (item) => item.frequency
                    ),
                  ],
                  label: histogramData.CourseStatList.results[0].scoreHistogram.results.map(
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
                    studentDashboardData.UserList.results[0].userstat
                      .scoreHistory,
                    medianData.CourseStatList.results[0].medianHistory,
                  ],
                  label: Array(
                    studentDashboardData.UserList.results[0].userstat
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
                    studentDashboardData.UserList.results[0].userstat
                      .percentileHistory,
                  ],
                  label: Array(
                    studentDashboardData.UserList.results[0].userstat
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
                    globalPerformance.global[0].finalGrades.map(
                      (grade) => grade.percentage
                    ),
                  ],
                  label: globalPerformance.global[0].finalGrades.map(
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
                  rows: studentDashboardData.UserList.results[0].userstat.userAssignmentStat.results.map(
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
                  isStaff
                    ? null
                    : {
                        urlPrefix: "/assignments/edit/",
                        nameId: studentDashboardData.UserList.results[0].userstat.userAssignmentStat.results.map(
                          (item) => item.assignment.id
                        ),
                      }
                }
                disabled={checkDisabled("assignments")}
              />
            )}
          </Dashboard>
        </>
      )}

      <>
        <h3>Course Performance</h3>
        <Dashboard>
          <InfoBannersContainer>
            {checkVisibility("throughput") && (
              <InfoBanner
                text={"Throughput " + globalPerformance.global[0].year + ":"}
                value={globalPerformance.global[0].throughput}
                disabled={checkDisabled("throughput")}
              />
            )}
          </InfoBannersContainer>
          {checkVisibility("grades") && (
            <PieChart
              title={"Students grades " + globalPerformance.global[0].year}
              data={{
                datasets: [
                  globalPerformance.global[0].finalGrades.map(
                    (grade) => grade.percentage
                  ),
                ],
                label: globalPerformance.global[0].finalGrades.map(
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
                datasets: globalPerformance.global.map((y) =>
                  y.finalGrades.map((grade) => grade.percentage)
                ),
                label: globalPerformance.global[0].finalGrades.map(
                  (grade) => grade.name
                ),
                datasetNames: globalPerformance.global.map((y) => y.year),
              }}
              id={"gradesByYear"}
              disabled={checkDisabled("gradesByYear")}
            />
          )}
        </Dashboard>
      </>
    </>
  );
}
