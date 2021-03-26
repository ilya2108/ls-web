import {Dashboard, InfoBannersContainer} from "../../pages-styles/UserPage/UserPage.styles";
import InfoBanner from "./banners/InfoBanner";
import React from "react";
import BarChart from "./charts/BarChart";


type Props = {
    userData: any;
}

export default function TeachersDashboard(props: Props) {
    return (
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
        </Dashboard>
    )
}