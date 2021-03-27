import React, {useState} from "react";
import { ChartContainer } from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";
import DynamicTable from "@atlaskit/dynamic-table";
import Textfield from "@atlaskit/textfield";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";
import {SearchWrapper} from "../../../pages-styles/UsersPage/UsersPage.styles";
import debounce from "lodash/debounce";

type Props = {
  title: string;
  description?: string;
  data: {
    headers: any;
    rows: any;
  };
  defaultSortKey: string;
  defaultSortOrder: any;
};

export default function EnumBanner(props: Props) {

    const [inputVal, setInputVal] = useState("");

    const setInputValDebounced = debounce(setInputVal, 300)

    const handleSearchEvent = (event) => {
        const { value } = event.target;
        setInputValDebounced(value)
    };

    const mappedTableHead = props.data.headers.map((headerNames, i) => ({
        key: headerNames,
        isSortable: true,
        shouldTruncate: false,
        content: headerNames,
    }));

    const tableHeadRow = {
        cells: mappedTableHead,
    };

    const numberOfRowsPerPage = () => {
        if(typeof document !== 'undefined' || typeof window !== 'undefined') {
            const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

            return Math.ceil((vh - 312)/43);
        }
        return 24;
    }

    const filterAssignment = (rows) => {
        return rows.filter((row) => {
            return (
                row[0].toLowerCase().includes(inputVal.toLowerCase())
            )
        });
    };

    const tableRows = filterAssignment(props.data.rows).map(
        (row, i) => {
            return {
                cells: row.map((rowItem) => (
                    {
                        key: rowItem + i,
                        content: (
                            <span>{rowItem}</span>
                        ),
                    }
                )),

                key: row[0] + i,
            }
        }
    );

    return (
    <ChartContainer normalWidth>
      <span style={{ fontSize: 19, fontWeight: 500 }}>{props.title}</span>
      {props.description && <Tooltip description={props.description} />}
        <SearchWrapper style={{paddingTop: "10px"}}>
            <Textfield
                name="basic"
                isCompact
                placeholder="Search assignment"
                elemAfterInput={<EditorSearchIcon label="" />}
                onChange={(event) => handleSearchEvent(event)}
            />
        </SearchWrapper>
        <DynamicTable
            head={tableHeadRow}
            rows={props.data ? tableRows : null}
            loadingSpinnerSize="large"
            isLoading={!props.data}
            isFixedSize
            defaultSortKey={props.defaultSortKey}
            defaultSortOrder={props.defaultSortOrder}
            rowsPerPage={numberOfRowsPerPage()}             // numberOfRowsPerPage() TODO?
        />
    </ChartContainer>
  );
}
