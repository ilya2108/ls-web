import {Dashboard, InfoBannersContainer} from "../../pages-styles/UserPage/UserPage.styles";
import InfoBanner from "./banners/InfoBanner";
import React, {useState} from "react";
import BarChart from "./charts/BarChart";
import LineChart from "./charts/LineChart";
import EnumBanner from "./banners/EnumBanner";
import {CreatableSelect} from "@atlaskit/select";
import Tooltip from "./Tooltip";
import useSWR from "swr";
import {gql} from "graphql-request";
import {fetcher} from "../../modules/api";
import {createParametersToQuery, validateInput} from "../../utils/dashboard-utils";
import allStudentsData from'./__fixtures__/allStudentsData-TD.json'
import dataForFiltering from './__fixtures__/dataForFiltering-TD.json'
import _ from "lodash"  // just for fixtures

type Props = {
    userData: any;
}

export default function TeachersDashboard(props: Props) {

    const [filter, setFilter] = useState('All students');
    const parallels=dataForFiltering.parallels                                     // todo fetch all parallels
    const assignments=dataForFiltering.assignments                                 // todo fetch all assignments

    // representative data - todo fetch data without filtering
    const [data, setData] = useState(allStudentsData)
    const [filterCurrentValue, setFilterCurrentValue] = useState(undefined)

    const createDefaultOptions = [
        {
            options: [
                {label: 'All students', value: 'All students'}
            ],
        },
        {
            label: 'Parallels',
            options: parallels.map((parallel) => (
                {label: parallel, value: "p:--" + parallel}
            ))
        },
        {
            label: 'Assignments',
            options: assignments.map((assignment) => (
                {label: assignment, value: "a:--" + assignment}
            ))
        },
        {
            label: 'Score filtering',
            options: [{label: "SCORE > 5", value: "c:--" + validateInput("SCORE > 5")}]
        }
    ]

    const [options, setOptions] = useState(createDefaultOptions)
    const [validation, setValidation] = useState("default")

    const fetchData = (value) => {
        // fetch data if not cached already
        if (!data.hasOwnProperty(value)) {
            const filteringParameters = {
                "assignment": "",
                "parallel": "",
                "customCommand": ""
            }

            if (value.substr(0,4) === "p:--")
                filteringParameters.parallel = value.substr(4)
            else if (value.substr(0,4) === "a:--")
                filteringParameters.assignment = value.substr(4)
            else if (value.substr(0,4) === "c:--")
                filteringParameters.customCommand = value.substr(4).split("|")

            const queryParameters = createParametersToQuery(filteringParameters)

            data[value] = _.clone(allStudentsData["All students"])
            data[value]["maxScore"] = queryParameters
        }
        setFilter(value);
    }

    const handleCreate = (inputValue: any) => {
        const value = validateInput(inputValue);
        if (value === "") {
            setValidation("error")
            return
        }

        const newOption = {
            label: inputValue,
            value: "c:--" + value
        }

        options[3].options.push(newOption);
        setFilterCurrentValue(newOption)
        setOptions(options);
        setValidation("success")
        fetchData("c:--" + value)
    };

    return (
        <>
            <div style={{display: "flex", justifyContent: "center"}}>
            <span style={{width: "50%"}}>
                <span style={{fontWeight: 500, fontSize: "18px"}}>Filter</span>
                <Tooltip description={"Filter students by parallels, assignments and score\n\n" +
                "Create score filtering with commands: 'SCORE > 5', 'SCORE > 5 AND SCORE < 20'"} />
            <CreatableSelect
                className="single-select"
                classNamePrefix="react-select"
                onChange={value => {
                    setValidation("default");
                    setFilterCurrentValue(value)
                    fetchData(value.value);
                }}
                onCreateOption={handleCreate}
                options={options}
                placeholder={"Filter Students"}
                validationState={validation}
                value={filterCurrentValue}
                />
            </span>
            </div>
        <Dashboard style={{paddingTop: "25px"}}>
            <InfoBannersContainer>
                <InfoBanner text={"Median:"} value={data[filter].medianHistory[data[filter].medianHistory.length - 1]}/>
                <InfoBanner text={"Max Score:"} value={data[filter].maxScore} />
                <InfoBanner text={"Min Score:"} value={data[filter].minScore} />
                <InfoBanner text={"# of students:"} value={data[filter].studentsNumber} />
            </InfoBannersContainer>
            {filter.substr(0, 4) === "a:--" &&
            <InfoBannersContainer>
                <InfoBanner text={"Median Percentage:"} value={data[filter].assignments.assignmentMedianPercentage[0]}/>
                <InfoBanner text={"Max possible Score:"} value={data[filter].assignments.assignmentMaxScore[0]}/>
            </InfoBannersContainer>
            }
            {filter.substr(0, 4) === "p:--" &&
            <InfoBannersContainer>
                <InfoBanner text={"Teacher:"} value={data[filter].parallels.teacher[0]}/>
                <InfoBanner text={"Percentile Average:"} value={data[filter].parallels.percentileAverage[0]}/>
            </InfoBannersContainer>
            }
            <BarChart
                title={"Students' Score Histogram"}
                description={"Histogram of students score"}
                data={{
                    datasets: [data[filter].scoreHistogram.frequency],
                    label: data[filter].scoreHistogram.label,
                    datasetNames: [""]
                }}
            />
            <LineChart
                title={"History of Median"}
                description={"Chart shows history of median of students score and compares it to last year's data"}
                data={{
                    datasets: [
                        data[filter].medianHistory,
                        data[filter].overallMedianHistory,
                        data[filter].lastYearOverallMedian,
                    ],
                    label: Array(data[filter].numberOfWeeks).fill(null).map((_, i) => ("week " + (i + 1))),
                    datasetNames: ["Median", "Students overall median", "Last year overall median"]
                }}
                />
            {filter.substr(0, 4) !== "a:--" &&
            <EnumBanner title={"Assignments"}
                        data={{
                            headers: ["Assignment name", "Median", "Median percentage", "Max possible Score"],
                            rows: data[filter].assignments.assignmentName.map((item, i) => [
                                data[filter].assignments.assignmentName[i],
                                data[filter].assignments.assignmentMedian[i],
                                data[filter].assignments.assignmentMedianPercentage[i],
                                data[filter].assignments.assignmentMaxScore[i]])
                        }}
                        defaultSortKey={"Median percentage"}
                        defaultSortOrder={"ASC"}
            />
            }
            {filter.substr(0, 4) !== "p:--" &&
            <EnumBanner title={"Parallels"}
                        data={{
                            headers: ["Parallel", "Teacher", "# of students", "Median", "Percentile average"],
                            rows: data[filter].parallels.teacher.map((_, i) => [
                                data[filter].parallels.name[i],
                                data[filter].parallels.teacher[i],
                                data[filter].parallels["numOfStudents"][i],
                                data[filter].parallels.median[i],
                                data[filter].parallels.percentileAverage[i]])
                        }}
                        defaultSortKey={"Median"}
                        defaultSortOrder={"ASC"}
            />
            }
            <EnumBanner title={"Students"}
                        data={{
                            headers: ["Name", "Username", "Parallel", "Score", "Percentile"],
                            rows: data[filter].students.name.map((_, i) => [
                                data[filter].students.name[i],
                                data[filter].students.username[i],
                                data[filter].students.parallel[i],
                                data[filter].students.score[i],
                                data[filter].students.percentile[i]])
                        }}
                        defaultSortKey={"Percentile"}
                        defaultSortOrder={"ASC"}
            />
        </Dashboard>
        <hr style={{ height: "2px", borderWidth: 0, color: "#42526e", backgroundColor: "#42526e", margin: "40px"}} />
        <>
            <h3>Global Performance</h3>
            <Dashboard>
                {/*TODO Znamky studentu z kosu z minulych let? Pruchodnost z minula?*/}
            </Dashboard>
        </>
    </>
    )
}