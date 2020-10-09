import { useState } from "react";
import { default as AKDrawer } from "@atlaskit/drawer";
import { useSelector, useDispatch } from "react-redux";
import { closeSearchDrawer } from "../../modules/core/redux/drawer/drawer.actions";
import {
  QuickSearch,
  ObjectResult,
  PersonResult,
  ResultItemGroup,
} from "@atlaskit/quick-search";
import Page24Icon from "@atlaskit/icon-object/glyph/page/24";
import Issue24Icon from "@atlaskit/icon-object/glyph/issue/24";

const result = [
  <ResultItemGroup title="Tasks" key="Tasks">
    <ObjectResult
      key="task1"
      resultId="JRA-123"
      name="Fix this and that"
      objectKey="JRA-123"
      avatar={<Page24Icon label="Task1" />}
    />
    <ObjectResult
      key="task2"
      resultId="JRA-124"
      name="More stuff"
      objectKey="JRA-124"
      avatar={<Page24Icon label="Task2" />}
    />
  </ResultItemGroup>,
  <ResultItemGroup title="Exams" key="Exams">
    <ObjectResult
      key="exam1"
      resultId="Exam 1"
      name="Exam 1"
      objectKey="Exam 1"
      avatar={<Issue24Icon label="Exam1" />}
    />
    <ObjectResult
      key="exam2"
      resultId="Exam 2"
      name="Exam 2"
      objectKey="Exam 2"
      avatar={<Issue24Icon label="Exam2" />}
    />
  </ResultItemGroup>,
  <ResultItemGroup title="Users" key="Users">
    <PersonResult
      resultId="User1"
      mentionPrefix="#"
      name="David Soundararaj"
      presenceMessage="@dteen"
    />
    <PersonResult
      resultId="User2"
      mentionPrefix="#"
      name="David Soundararaj"
      presenceMessage="@dteen"
    />
  </ResultItemGroup>,
];

const SearchDrawer = () => {
  const [searchInput, setSearchInput] = useState();
  const { searchDrawer } = useSelector((state) => state.drawers);
  const dispatch = useDispatch();
  const dispatchCloseSearchDrawer = () => dispatch(closeSearchDrawer());

  return (
    <AKDrawer
      onClose={dispatchCloseSearchDrawer}
      isOpen={searchDrawer}
      width="medium"
    >
      <QuickSearch
        isLoading={false}
        // @ts-ignore
        onSearchInput={({ target }) => setSearchInput((value) => target.value)}
        value={searchInput}
      >
        <div css={{marginLeft: "12px"}}>
        {result}
        </div>
      </QuickSearch>
    </AKDrawer>
  );
};

export default SearchDrawer;