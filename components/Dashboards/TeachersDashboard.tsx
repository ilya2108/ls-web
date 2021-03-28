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


type Props = {
    userData: any;
}

export default function TeachersDashboard(props: Props) {

    const [filter, setFilter] = useState('All students');
    const parallels= (props.userData.isSuperuser ?                      // todo fetch parallels which teacher teaches, supersuer can see all of them
        ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"] :
        props.userData.parallels.results.name);
    const assignments=["awk", "sed", "grep"];                           // todo fetch all assignments
    const [data, setData] = useState(                                   // todo fetch data without filtering
        {'All students': {
            median: "all data",
            maxScore: "all data",
            minScore: "all data",
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

    const fetchData = (value) => {
        // fetch data if not cached already
        if (!data.hasOwnProperty(value)) {
            if(value.substr(0,4) === "p:--") {                  // todo fetch data - filtered parallel
                data[value] = {
                    median: "parallel " + value + " data",
                    maxScore: "parallel " + value + " data",
                    minScore: "parallel " + value + " data",
                }
            }
            else if (value.substr(0,4) === "a:--") {            // todo fetch data - filtered assignment
                data[value] = {
                    median: "assignment " + value + " data",
                    maxScore: "assignment " + value + " data",
                    minScore: "assignment " + value + " data",
                }
            }
            else {                                                          // todo fetch data - filtered score
                data[value] = {
                    median: "custom " + value + " data",
                    maxScore: "custom " + value + " data",
                    minScore: "custom " + value + " data",
                }
            }
        }
        setFilter(value);
    }

    const validateInput = (inputValue: string) => {
        const input = inputValue.trim().split(' ');

        if (!(input.length >= 3 &&
            input[0] === "SCORE" &&
            (input[1] === "<" || input[1] === ">") &&
            parseInt(input[2])
        ))
            return false;

        if (input.length === 3)
            return true

        if (!(input.length === 7 &&
            input[3] === "AND" &&
            input[4] === "SCORE" &&
            (input[5] === "<" || input[5] === ">") &&
            input[5] !== input[1] &&
            parseInt(input[6])
        ))
            return false
        return true;
    }

    const handleCreate = (inputValue: any) => {
        if (!validateInput(inputValue))
            return

        const newOption = {
            label: inputValue,
            value: "c:--" + inputValue
        }

        options[3].options.push(newOption);
        setOptions(options);
        fetchData(inputValue)
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
                onChange={value => fetchData(value.value)}
                onCreateOption={handleCreate}
                options={options}
                placeholder="Filter students"
                />
            </span>
            </div>
        <Dashboard style={{paddingTop: "25px"}}>
            <InfoBannersContainer>
                <InfoBanner text={"Median:"} value={data[filter].median} />
                <InfoBanner text={"Max Score:"} value={data[filter].maxScore} />
                <InfoBanner text={"Min Score:"} value={data[filter].minScore} />
                <InfoBanner text={"# of students:"} value={data[filter].minScore} />
            </InfoBannersContainer>
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
                description={"Chart shows history of median of students score and compares it to last year's data"}
                data={{
                    datasets: [
                        [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
                        [12, 56, 89, 57, 47, 69, 69, 48, 37, 63, 59, 67, 88],
                        [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55],
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
                            rows: [
                                ["awk1", 0, 10, 4],
                                ["awk2", 2, 15, 4],
                                ["sed DU", 1, 23, 4],
                                ["grep", 0, 30, 4],
                                ["grep DU", 2, 37, 4],
                                ["awk1", 0, 10, 4],
                                ["awk2", 2, 15, 4],
                                ["sed DU", 1, 23, 4],
                                ["grep", 0, 30, 4],
                                ["grep DU", 2, 37, 4],
                            ]
                        }}
                        defaultSortKey={"Median percentage"}
                        defaultSortOrder={"ASC"}
            />
            }
        </Dashboard>

            {props.userData.isSuperuser && (
                <>
                    <h3>Teacher's Performance</h3>
                    <Dashboard>
                    </Dashboard>
                    <h3>Student's Dashboard Settings</h3>
                </>
            )
            }

    </>
    )
}