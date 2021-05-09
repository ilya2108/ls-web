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
import { getGrade, roundUp } from "../../utils/dashboard-utils";
import Select from "@atlaskit/select";

type Props = {
  userData: any; // id of user that will be page about
  userId: string; // id of user logged in
  profile: boolean; // will it be rendered on profile page
    courses: {  // courses that student attend
        results: {
            id: number;
            kosTag: string;
            kosSemester: string;
        }[]
        totalCount: number
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

  const createCourseValue = (value) => `${value.kosTag} (${value.kosSemester})`;
  const getFromCourseIdLabel = (courseId) =>
    createCourseValue(props.courses.results.filter((i) => i.id === courseId)[0]);

  const [courseId, setCourseId] = useState(props.courses.results[0].id);

  const [data, setData] = useState({
    all: null,
    filter: null,
  });

  let error = false;
  let renderSpinner = true;

  const fetchStudentDashboardData = () => {
    {
      // fixtures -- TODO load real data when available
      const studentData = filterStudentData;
      const errorStudentData = false;
      const globalPerformanceData: GlobalPerformance = dataGlobalPerformance;

      data["filter"] =
        studentData && globalPerformanceData
          ? {
              studentData: studentData,
              globalPerformanceData: globalPerformanceData,
            }
          : null;

      error = errorStudentData;

      renderSpinner = !error && !studentData;
    }

    const startPart = props.profile
      ? `{
                          UserMyself
                      `
      : `{
                          UserList(id: ${props.profile ? id : props.userId}) {
                            results `;

    const endPart = props.profile ? `}` : `} }`;

    {
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
                score # users overall score
                scoreHistory # history of weekly score
                percentileHistory # percentile based on other users score histories
                userAssignmentStat {
                  results {
                    assignment {
                      # assignment data, all self explanatory
                      id
                      name
                      median
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
                  medianHistory
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

      // data in one format
      const studentData = studentDashboardData
        ? props.profile
          ? studentDashboardData.UserMyself
          : studentDashboardData.UserList.results[0]
        : null;

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
      }

      // fixtures -- TODO load real data when available
      const globalPerformanceData: GlobalPerformance = dataGlobalPerformance;

      data["all"] =
        studentData && globalPerformanceData
          ? {
              studentData: studentData,
              globalPerformanceData: globalPerformanceData,
            }
          : null;
      error = errorStudentData;
      renderSpinner = !error && !studentData;
    }
  };

  fetchStudentDashboardData();

  const defaultToggle = data["all"]
    ? settings.studentDashboardIdleToggle.enabledByDefaultFromWeek
      ? settings.studentDashboardIdleToggle.enabledByDefaultFromWeek <=
        data["all"].studentData.userStats.results[0].percentileHistory.length
      : false
    : null;
  const [filter, setFilter] = useState(defaultToggle ? "filter" : "all");

  if (error) {
    return <Error />;
  }

  const checkVisibility = (item) =>
    !props.profile || settings.studentDashboardComponents[item];
  const checkDisabled = (item) => !settings.studentDashboardComponents[item];

  const courseIndex = props.courses.results.map((i) => i.id).indexOf(courseId);

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
              onChange={() => {
                setFilter((prevState) =>
                  prevState === "all" ? "filter" : "all"
                );
              }}
            />
          </div>
          <Dashboard>
            <InfoBannersContainer>
              {checkVisibility("score") && (
                <InfoBanner
                  text={"My Score:"}
                  value={
                    data[filter].studentData.userStats.results[courseIndex]
                      .score
                  }
                  disabled={checkDisabled("score")}
                />
              )}
              {checkVisibility("percentile") && (
                <InfoBanner
                  text={"Percentile:"}
                  value={
                    data[filter].studentData.userStats.results[courseIndex]
                      .percentileHistory[
                      data[filter].studentData.userStats.results[courseIndex]
                        .percentileHistory.length - 1
                    ]
                  }
                  disabled={checkDisabled("percentile")}
                />
              )}
              {checkVisibility("median") && (
                <InfoBanner
                  text={"Median:"}
                  value={
                    data[filter].studentData.coursesAsStudent.results[
                      courseIndex
                    ]?.coursestat?.median
                  }
                  disabled={checkDisabled("median")}
                />
              )}
              {checkVisibility("grade") &&
                settings.courseSettings.standardCTUGrading && (
                  <InfoBanner
                    text={"My Grade:"}
                    value={getGrade(
                      data[filter].studentData.userStats.results[courseIndex]
                        ?.score
                    )}
                    disabled={checkDisabled("grade")}
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
                    data[filter].studentData.coursesAsStudent.results[
                      courseIndex
                    ].coursestat?.scoreHistogram.results.map(
                      (item) => item.frequency
                    ),
                  ],
                  label: data[filter].studentData.coursesAsStudent.results[
                    courseIndex
                  ].coursestat?.scoreHistogram.results.map((item) => [
                    item.score,
                  ]),
                  datasetNames: [""],
                }}
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
                    data[filter].studentData.userStats.results[courseIndex]
                      .scoreHistory,
                    data[filter].studentData.coursesAsStudent.results[
                      courseIndex
                    ].coursestat?.medianHistory,
                  ],
                  label: Array(settings.courseSettings.numberOfWeeks)
                    .fill(null)
                    .map((_, i) => "week " + (i + 1)),
                  datasetNames: ["My score", "Students overall median"],
                }}
                disabled={checkDisabled("medianHistory")}
                regression={[true, false]}
              />
            )}
            {checkVisibility("percentileHistory") && (
              <LineChart
                title={"History of Percentile"}
                description={"Graph shows history of my percentile"}
                data={{
                  datasets: [
                    data[filter].studentData.userStats.results[courseIndex]
                      .percentileHistory,
                  ],
                  label: Array(settings.courseSettings.numberOfWeeks)
                    .fill(null)
                    .map((_, i) => "week " + (i + 1)),
                  datasetNames: ["Percentile history"],
                }}
                disabled={checkDisabled("percentileHistory")}
                maxValue={0}
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
                    data[
                      filter
                    ].globalPerformanceData.global[0].finalGrades.map(
                      (grade) => grade.percentage
                    ),
                  ],
                  label: data[
                    filter
                  ].globalPerformanceData.global[0].finalGrades.map(
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
                  rows: data[filter].studentData.userStats.results[
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
                        nameId: data[
                          filter
                        ].studentData.userStats.results[0].userAssignmentStat.results.map(
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
                  text={
                    "Throughput " +
                    data[filter].globalPerformanceData.global[courseIndex]
                      .year +
                    ":"
                  }
                  value={
                    data[filter].globalPerformanceData.global[courseIndex]
                      .throughput
                  }
                  disabled={checkDisabled("throughput")}
                />
              )}
            </InfoBannersContainer>
            {checkVisibility("grades") && (
              <PieChart
                title={
                  "Students grades " +
                  data[filter].globalPerformanceData.global[courseIndex].year
                }
                data={{
                  datasets: [
                    data[filter].globalPerformanceData.global[
                      courseIndex
                    ].finalGrades.map((grade) => grade.numberOfStudents),
                  ],
                  label: data[filter].globalPerformanceData.global[
                    courseIndex
                  ].finalGrades.map((grade) => grade.name),
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
                  label: data[filter].globalPerformanceData.global[
                    courseIndex
                  ].finalGrades.map((grade) => grade.name),
                  datasetNames: data[filter].globalPerformanceData.global.map(
                    (y) => y.year
                  ),
                }}
                disabled={checkDisabled("gradesByYear")}
              />
            )}
          </Dashboard>
        </>
      )}
    </>
  );
}
