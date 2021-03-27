import {Dashboard, InfoBannersContainer} from "../../pages-styles/UserPage/UserPage.styles";
import InfoBanner from "./banners/InfoBanner";
import React from "react";
import BarChart from "./charts/BarChart";
import LineChart from "./charts/LineChart";
import EnumBanner from "./banners/EnumBanner";


type Props = {
    userData: any;
}

export default function TeachersDashboard(props: Props) {
    return (
        <>
        <Dashboard>
            <InfoBannersContainer>
                <InfoBanner text={"Median:"} value={"hardcoded"} />
                <InfoBanner text={"Max Score:"} value={"hardcoded"} />
                <InfoBanner text={"Min Score:"} value={"hardcoded"} />
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
                <EnumBanner title={"Least successful assignment"}
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