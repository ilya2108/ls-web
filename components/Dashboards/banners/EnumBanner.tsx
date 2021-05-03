import React, {useState} from "react";
import { ChartContainer } from "../../../pages-styles/UserPage/UserPage.styles";
import Tooltip from "../Tooltip";
import DynamicTable from "@atlaskit/dynamic-table";
import Textfield from "@atlaskit/textfield";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";
import {SearchWrapper} from "../../../pages-styles/UsersPage/UsersPage.styles";
import debounce from "lodash/debounce";
import DownloadIcon from '@atlaskit/icon/glyph/download';
import {CSVLink} from "react-csv";
import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  data: {
    headers: string[];
    rows: any[][];
  };
  defaultSortKey: string;
  defaultSortOrder: any;
  links?: {
      nameId: any[];
      urlPrefix: string;
  }
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

    const filterRows = (rows) => {
        return rows.filter((row) => {
            return ( inputVal.match(/( *\[.*?] *)+/g) ?
                inputVal.match(/\[(.*?)]/g).every(tag => row[0].toLowerCase().includes(tag.toLowerCase())) :
                row[0].toLowerCase().includes(inputVal.toLowerCase())
            )
        });
    };

    const tableRows = filterRows(props.data.rows).map(
        (row, i) => {
            return {
                cells: row.map((rowItem,index) => (
                    {
                        key: rowItem + "-" + i + "-" + index,
                        content: index === 0 && props.links ?
                            (
                                <Link href={props.links.urlPrefix + `${encodeURIComponent(props.links.nameId[i])}`}>
                                    <a>
                                        {rowItem}
                                    </a>
                                </Link>
                            ) : (
                            <span>{rowItem}</span>
                        ),
                    }
                )),

                key: "id-row-" + i,
            }
        }
    );

    return (
    <ChartContainer normalWidth>
      <span style={{ fontSize: 19, fontWeight: 500 }}>{props.title}</span>
      {props.description && <Tooltip description={props.description} />}

      <span style={{paddingLeft: "10px"}}>
          <CSVLink
            headers={props.data.headers}
            data={props.data.rows}
            filename={"lsData.csv"}
            separator={";"}
        >
            <DownloadIcon size={"medium"} label={"download"} />
        </CSVLink>
      </span>

        <SearchWrapper style={{paddingTop: "10px"}}>
            <Textfield
                name="basic"
                isCompact
                placeholder={"Search " + props.title}
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
            rowsPerPage={numberOfRowsPerPage()}
        />
    </ChartContainer>
  );
}
