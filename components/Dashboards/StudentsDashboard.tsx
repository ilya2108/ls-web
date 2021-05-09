import BarChart from "./charts/BarChart";
import {
  Dashboard,
  InfoBannersContainer,
} from "../../pages-styles/UserPage/UserPage.styles";
import InfoBanner from "./banners/InfoBanner";
import LineChart from "./charts/LineChart";
import EnumBanner from "./banners/EnumBanner";
import React, { useState } from "react";
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
import {getGrade, getSemesterWeek, roundUp} from "../../utils/dashboard-utils";
import Select from "@atlaskit/select";
import { StudentData } from "./Dashboard.types";

type Props = {
  userData: any; // id of user that will be page about
  userId: string; // id of user logged in
  profile: boolean; // will it be rendered on profile page
  courses: {
    // courses that student attend
    results: {
      id: number;
      kosTag: string;
      kosSemester: string;
    }[];
    totalCount: number;
  };
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
  const { id } = props.userData || [];

  const createCourseValue = (value) => `${value.kosTag} (${value.kosSemester})`;
  const getFromCourseIdLabel = (courseId) =>
    createCourseValue(
      props.courses.results.filter((i) => i.id === courseId)[0]
    );

  const [courseId, setCourseId] = useState(props.courses.results[0].id);

  const [data, setData] = useState({
    studentData: null,
    globalPerformanceData: null,
  });

  let error = false;
  let renderSpinner = true;

  const fetchStudentDashboardData = () => {
    const startPart = props.profile
      ? `{ UserMyself `
      : `{ UserList(id: ${props.profile ? id : props.userId}) { results `;
    const endPart = props.profile ? `}` : `} }`;

    const { data: studentDashboardData, error: errorStudentData } = useSWR(
      gql`
        ${startPart}
        {
          username # self explanatory
          userStats {
            results(ordering: "course_id") {
              course {
                id
              }
              finalScorePrediction
              score # users overall score
              scoreHistory # history of weekly score
              percentileHistory # percentile based on other users score histories
              percentileHistoryIdle
              userAssignmentStat {
                results {
                  assignment {
                    # assignment data, all self explanatory
                    id
                    name
                    median # median of score
                    maxScore # max possible score of assignment
                    weekOfSemester # the week of semester the assignment was assigned
                  }
                  score # users score from this assignment
                  percentile # users percentile from this assignment
                }
              }
            }
          }
          coursesAsStudent {
            totalCount
            results(ordering: "id") {
              name
              id
              kosTag
              coursestat {
                median
                medianHistory # history of median of score calculated with students that have score > 5
                medianHistoryIdle # ... calculated with students that have score
                scoreHistogram {
                  results(ordering: "score") {
                    score
                    frequency
                  }
                }
              }
            }
          }
        }
        ${endPart}
      `,
      fetcher
    );

    // data in unified format
    const studentData: StudentData = studentDashboardData
      ? props.profile
        ? studentDashboardData.UserMyself
        : studentDashboardData.UserList.results[0]
      : null;

    // adjusting loaded data
    if (studentData) {
      // rounding up floats
      studentData.userStats.results[0].percentileHistory = studentData.userStats.results[0].percentileHistory.map(
        (item) => roundUp(item, 2)
      );
      studentData.userStats.results[0].percentileHistoryIdle = studentData.userStats.results[0].percentileHistoryIdle.map(
        (item) => roundUp(item, 2)
      );
      studentData.userStats.results[0].userAssignmentStat.results = studentData.userStats.results[0].userAssignmentStat.results.map(
        (item) => {
          item.percentile = roundUp(item.percentile, 2);
          return item;
        }
      );
    }

    // fixtures -- TODO load real data when available
    const globalPerformanceData: GlobalPerformance = dataGlobalPerformance;

    data.studentData = studentData ? studentData : null;
    data.globalPerformanceData = globalPerformanceData
      ? globalPerformanceData
      : null;

    error = errorStudentData;
    renderSpinner = !error && !studentData;
  };

  fetchStudentDashboardData();

  const defaultToggle =
    data.studentData && data.globalPerformanceData
      ? settings.studentDashboardIdleToggle.enabledByDefaultFromWeek
        ? settings.studentDashboardIdleToggle.enabledByDefaultFromWeek <=
          data.studentData.userStats.results[0].percentileHistory.length
        : false
      : null;
  const [filter, setFilter] = useState(defaultToggle);

  if (error) {
    return <Error />;
  }

  const checkComponentVisibility = (item) =>
    !props.profile || settings.studentDashboardComponents[item];
  const checkComponentDisability = (item) =>
    !settings.studentDashboardComponents[item];

  const courseIndex = props.courses.results.map((i) => i.id).indexOf(courseId);

  // filtering histogram - Should be done in BE! TODO
  const filterHistogram = (histogram) => {
    return filter ? histogram?.filter((val) => val.score >= 5) : histogram;
  }

  return (
    <>
      {renderSpinner ? (
        <HugeSpinner />
      ) : error ? null : (
        <>
          <div
            style={{
              width: "400px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "20px",
            }}
          >
            <strong>Choose course:</strong>
            <div style={{ width: "200px" }}>
              <Select
                className="semester-select-SD"
                options={props.courses.results.map((item) => ({
                  label: createCourseValue(item),
                  value: item.id,
                }))}
                onChange={(val) => {
                  setCourseId(val.value);
                }}
                value={{
                  label: getFromCourseIdLabel(courseId),
                  value: courseId,
                }}
              />
            </div>
          </div>
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
                Idle students filtering:
              </strong>
              <Tooltip
                description={
                  "When enabled, shows stats of non idle students (students with higher score than particular value)"
                }
              />
            </span>
            <Toggle
              id="toggle-large"
              size="large"
              defaultChecked={defaultToggle}
              onChange={() => {
                setFilter((prevState) => !prevState);
              }}
            />
          </div>
          <Dashboard>
            <InfoBannersContainer>
              {checkComponentVisibility("score") && (
                <InfoBanner
                  text={"My Score:"}
                  value={data.studentData.userStats.results[courseIndex].score}
                  disabled={checkComponentDisability("score")}
                />
              )}
              {checkComponentVisibility("percentile") && (
                <InfoBanner
                  text={"Percentile:"}
                  value={
                    filter
                      ? data.studentData.userStats.results[courseIndex]
                          .percentileHistory[
                          data.studentData.userStats.results[courseIndex]
                            .percentileHistory.length - 1
                        ]
                      : data.studentData.userStats.results[courseIndex]
                          .percentileHistoryIdle[
                          data.studentData.userStats.results[courseIndex]
                            .percentileHistoryIdle.length - 1
                        ]
                  }
                  disabled={checkComponentDisability("percentile")}
                />
              )}
              {checkComponentVisibility("median") && (
                <InfoBanner
                  text={"Median:"}
                  value={
                    filter
                      ? data.studentData.coursesAsStudent.results[courseIndex]
                          ?.coursestat?.medianHistory[
                          data.studentData.coursesAsStudent.results[courseIndex]
                            ?.coursestat?.medianHistory.length - 1
                        ]
                      : data.studentData.coursesAsStudent.results[courseIndex]
                          ?.coursestat?.medianHistoryIdle[
                          data.studentData.coursesAsStudent.results[courseIndex]
                            ?.coursestat?.medianHistoryIdle.length - 1
                        ]
                  }
                  disabled={checkComponentDisability("median")}
                />
              )}
            </InfoBannersContainer>
            <InfoBannersContainer>
              {checkComponentVisibility("finalScorePrediction") && (
                  <InfoBanner
                      text={"Final Score Prediction:"}
                      description={"Averages score of last semester students that had same score in same week"}
                      value={
                          data.studentData.userStats.results[courseIndex]?.finalScorePrediction
                      }
                      disabled={checkComponentDisability("finalScorePrediction")}
                  />
              )}
              {checkComponentVisibility("semesterWeek") && (
                  <InfoBanner
                      text={"Semester week:"}
                      value={
                        getSemesterWeek(settings.courseSettings.semesterStart)
                      }
                      disabled={checkComponentDisability("semesterWeek")}
                  />
              )}
              {checkComponentVisibility("grade") &&
              settings.courseSettings.standardCTUGrading && (
                  <InfoBanner
                      text={"My Grade:"}
                      value={getGrade(
                          data.studentData.userStats.results[courseIndex]?.score
                      )}
                      disabled={checkComponentDisability("grade")}
                  />
              )}
            </InfoBannersContainer>
            {checkComponentVisibility("scoreHistogram") && (
              <BarChart
                title={"Students' Score Histogram"}
                description={
                  "Graph shows the distribution of the student score"
                }
                data={{
                  datasets: [
                    filterHistogram(data.studentData.coursesAsStudent.results[
                      courseIndex
                    ].coursestat?.scoreHistogram.results)?.map(
                      (item) => item.frequency
                    ),
                  ],
                  label: filterHistogram(data.studentData.coursesAsStudent.results[
                    courseIndex
                  ].coursestat?.scoreHistogram.results)?.map((item) => [
                    item.score,
                  ]),
                  datasetNames: [""],
                }}
                disabled={checkComponentDisability("scoreHistogram")}
              />
            )}
            {checkComponentVisibility("medianHistory") && (
              <LineChart
                title={"History of Median and Score"}
                description={
                  "Graph shows history of overall median of score and compares it to my score"
                }
                data={{
                  datasets: [
                    data.studentData.userStats.results[courseIndex]
                      .scoreHistory,
                    filter
                      ? data.studentData.coursesAsStudent.results[courseIndex]
                          .coursestat?.medianHistory
                      : data.studentData.coursesAsStudent.results[courseIndex]
                          .coursestat?.medianHistoryIdle,
                  ],
                  label: Array(settings.courseSettings.numberOfWeeks)
                    .fill(null)
                    .map((_, i) => "week " + (i + 1)),
                  datasetNames: ["My score", "Students overall median"],
                }}
                disabled={checkComponentDisability("medianHistory")}
                regression={[true, false]}
              />
            )}
            {checkComponentVisibility("percentileHistory") && (
              <LineChart
                title={"History of Percentile"}
                description={"Graph shows history of my percentile"}
                data={{
                  datasets: [
                    filter
                      ? data.studentData.userStats.results[courseIndex]
                          .percentileHistory
                      : data.studentData.userStats.results[courseIndex]
                          .percentileHistoryIdle,
                  ],
                  label: Array(settings.courseSettings.numberOfWeeks)
                    .fill(null)
                    .map((_, i) => "week " + (i + 1)),
                  datasetNames: ["Percentile history"],
                }}
                disabled={checkComponentDisability("percentileHistory")}
                maxValue={0}
              />
            )}
            {checkComponentVisibility("performancePrediction") && (
              <PieChart
                title={"Performance prediction"}
                description={
                  "Graph shows final grades ratio of last year students matched with my score and week"
                }
                data={{
                  datasets: [
                    data.globalPerformanceData.global[0].finalGrades.map(
                      (grade) => grade.percentage
                    ),
                  ],
                  label: data.globalPerformanceData.global[0].finalGrades.map(
                    (grade) => grade.name
                  ),
                }}
                disabled={checkComponentDisability("performancePrediction")}
              />
            )}
            {checkComponentVisibility("assignments") && (
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
                  rows: data.studentData.userStats.results[
                    courseIndex
                  ].userAssignmentStat?.results.map((item) => [
                    item.assignment.name,
                    item.score,
                    item.percentile,
                    item.assignment.median,
                    item.assignment.maxScore,
                    item.assignment.weekOfSemester,
                  ]),
                }}
                defaultSortKey={"Percentile"}
                defaultSortOrder={"ASC"}
                links={
                  props.profile
                    ? null
                    : {
                        urlPrefix: "/assignments/edit/",
                        nameId: data.studentData.userStats.results[0].userAssignmentStat.results.map(
                          (item) => item.assignment.id
                        ),
                      }
                }
                disabled={checkComponentDisability("assignments")}
              />
            )}
          </Dashboard>
          <h3>Course Performance</h3>
          <Dashboard>
            <InfoBannersContainer>
              {checkComponentVisibility("throughput") && (
                <InfoBanner
                  text={
                    "Throughput " +
                    data.globalPerformanceData.global[courseIndex].year +
                    ":"
                  }
                  value={
                    data.globalPerformanceData.global[courseIndex].throughput
                  }
                  disabled={checkComponentDisability("throughput")}
                />
              )}
            </InfoBannersContainer>
            {checkComponentVisibility("grades") && (
              <PieChart
                title={
                  "Students grades " +
                  data.globalPerformanceData.global[courseIndex].year
                }
                data={{
                  datasets: [
                    data.globalPerformanceData.global[
                      courseIndex
                    ].finalGrades.map((grade) => grade.numberOfStudents),
                  ],
                  label: data.globalPerformanceData.global[
                    courseIndex
                  ].finalGrades.map((grade) => grade.name),
                }}
                disabled={checkComponentDisability("grades")}
              />
            )}
            {checkComponentVisibility("gradesByYear") && (
              <BarChart
                title={"Grades comparison by year"}
                data={{
                  datasets: data.globalPerformanceData.global.map((y) =>
                    y.finalGrades.map((grade) => grade.percentage)
                  ),
                  label: data.globalPerformanceData.global[
                    courseIndex
                  ].finalGrades.map((grade) => grade.name),
                  datasetNames: data.globalPerformanceData.global.map(
                    (y) => y.year
                  ),
                }}
                disabled={checkComponentDisability("gradesByYear")}
              />
            )}
          </Dashboard>
        </>
      )}
    </>
  );
}
