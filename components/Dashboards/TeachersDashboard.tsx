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
import {validateInput} from "../../utils/dashboard-utils";


type Props = {
    userData: any;
}

export default function TeachersDashboard(props: Props) {

    const [filter, setFilter] = useState('All students');
    const parallels= ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"]              // todo fetch all parallels
    const assignments=["awk", "sed", "grep"];                                      // todo fetch all assignments

    // representative data - todo fetch data without filtering
    const [data, setData] = useState(
        {'All students': {
            median: "all data",
            maxScore: "all data",
            minScore: "all data",
            studentsNumber: 105,
            overallMedianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
            medianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
            lastYearOverallMedian: [12, 56, 89, 57, 47, 69, 69, 48, 37, 63, 59, 67, 88],
            scoreHistogram: {
                label: ["0", "3", "5", "7", "7.5", "8", "11", "14", "19", "24", "25", "26", "27", "28", "28", "34",
                    "35", "36", "39", "41", "42", "44", "45.5", "46", "48", "50", "51", "53", "54", "55", "68",
                    "75", "77", "81", "85", "91"],
                frequency: [12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55,
                    201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37]
            },
            assignments: {
                assignmentName: ["awk1", "awk2", "sed DU", "grep", "grep DU"],
                assignmentMedianPercentage: [10, 15, 23, 30, 37],
                assignmentMedian: [4, 3, 2, 4, 6],
                assignmentMaxScore: [5, 4, 4, 6, 8]
            }
        }})

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
            options: [{label: "SCORE > 5", value: "c:--SCORE > 5"}]
        }
    ]

    const [options, setOptions] = useState(createDefaultOptions)
    const [validation, setValidation] = useState("default")

    const fetchData = (value) => {
        // fetch data if not cached already
        if (!data.hasOwnProperty(value)) {
            // todo fetch data - filtered parallel with id
            if(value.substr(0,4) === "p:--") {
                data[value] = {
                    median: "parallel data",
                    maxScore: "parallel data",
                    minScore: "parallel data",
                    studentsNumber: 105,
                    overallMedianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
                    medianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
                    lastYearOverallMedian: [12, 56, 89, 57, 47, 69, 69, 48, 37, 63, 59, 67, 88],
                    scoreHistogram: {
                        label: ["0", "3", "5", "7", "7.5", "8", "11", "14", "19", "24", "25", "26", "27", "28", "28", "34",
                            "35", "36", "39", "41", "42", "44", "45.5", "46", "48", "50", "51", "53", "54", "55", "68",
                            "75", "77", "81", "85", "91"],
                        frequency: [12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55,
                            201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37]
                    },
                    assignments: {
                        assignmentName: ["awk1", "awk2", "sed DU", "grep", "grep DU"],
                        assignmentMedianPercentage: [10, 15, 23, 30, 37],
                        assignmentMedian: [4, 3, 2, 4, 6],
                        assignmentMaxScore: [5, 4, 4, 6, 8]
                    }
                }
            }
            // todo fetch data - filtered assignment with id
            else if (value.substr(0,4) === "a:--") {
                data[value] = {
                    median: "assignment data",
                    maxScore: "assignment data",
                    minScore: "assignment data",
                    studentsNumber: 105,
                    overallMedianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
                    medianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
                    lastYearOverallMedian: [12, 56, 89, 57, 47, 69, 69, 48, 37, 63, 59, 67, 88],
                    scoreHistogram: {
                        label: ["0", "3", "5", "7", "7.5", "8", "11", "14", "19", "24", "25", "26", "27", "28", "28", "34",
                            "35", "36", "39", "41", "42", "44", "45.5", "46", "48", "50", "51", "53", "54", "55", "68",
                            "75", "77", "81", "85", "91"],
                        frequency: [12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55,
                            201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37]
                    },
                    assignments: {
                        assignmentName: ["awk1", "awk2", "sed DU", "grep", "grep DU"],
                        assignmentMedianPercentage: [10, 15, 23, 30, 37],
                        assignmentMedian: [4, 3, 2, 4, 6],
                        assignmentMaxScore: [5, 4, 4, 6, 8]
                    }
                }
            }
            // custom data - todo fetch data
            else {
                // filtering items
                const [sgt, slt, pgt, plt, wgt, wlt] = value.substr(4).split("|")
                data[value] = {
                    median: "custom data",
                    maxScore: value.substr(4),
                    minScore: "custom data",
                    studentsNumber: 105,
                    overallMedianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
                    medianHistory: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
                    lastYearOverallMedian: [12, 56, 89, 57, 47, 69, 69, 48, 37, 63, 59, 67, 88],
                    scoreHistogram: {
                        label: ["0", "3", "5", "7", "7.5", "8", "11", "14", "19", "24", "25", "26", "27", "28", "28", "34",
                            "35", "36", "39", "41", "42", "44", "45.5", "46", "48", "50", "51", "53", "54", "55", "68",
                            "75", "77", "81", "85", "91"],
                        frequency: [12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55,
                            201, 37, 12, 19, 30, 55, 201, 37, 12, 19, 30, 55, 201, 37]
                    },
                    assignments: {
                        assignmentName: ["awk1", "awk2", "sed DU", "grep", "grep DU"],
                        assignmentMedianPercentage: [10, 15, 23, 30, 37],
                        assignmentMedian: [4, 3, 2, 4, 6],
                        assignmentMaxScore: [5, 4, 4, 6, 8]
                    }
                }
            }
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
                onChange={value => {setValidation("default");fetchData(value.value)}}
                onCreateOption={handleCreate}
                options={options}
                placeholder="Filter students"
                validationState={validation}
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
        </Dashboard>
        <hr style={{ height: "2px", borderWidth: 0, color: "#42526e", backgroundColor: "#42526e", margin: "10px"}} />
        <>
            <h3>Teacher's Performance</h3>
            <Dashboard>
                {/*TODO*/}
            </Dashboard>
        </>
    </>
    )
}