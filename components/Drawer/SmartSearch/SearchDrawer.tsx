// documentation
// Drawer: https://atlaskit.atlassian.com/packages/design-system/drawer
// Quick search: https://atlaskit.atlassian.com/packages/search/quick-search

import React, {useState} from "react";
import {
    ObjectResult,
    ResultItemGroup,
    QuickSearch, ContainerResult,
} from "@atlaskit/quick-search";

import Avatar from "@atlaskit/avatar";
import ContainerNavigation from "../../ContainerNavigation/ContainerNavigation";
import {searchFetcher} from "../../../modules/api";
import {gql} from "graphql-request";
import router from "next/router"
import {CheckboxSelect} from "@atlaskit/select";
import {func, string} from "prop-types";

const dummyAvatarComponent = (
    <Avatar
        src="https://hello.atlassian.net/secure/projectavatar?pid=30630"
        appearance="square"
    />
);

const avatarUrl = "https://hello.atlassian.net/secure/projectavatar?pid=30630";

// Free icons from flation.com
const examAvatar = (
    <Avatar
        src="https://www.flaticon.com/svg/vstatic/svg/1945/1945985.svg?token=exp=1617625492~hmac=f4343d8ae8e4cda7c26d9222779754ce"
        appearance="square"
        size="large"
        />
);

const userAvatar = (
    <Avatar
        src="https://www.flaticon.com/svg/vstatic/svg/2948/2948035.svg?token=exp=1617625966~hmac=af4f601f5e794e6f3926b6166453b526"
        appearance="square"
        size="large"
    />
);

const assignmentAvatar = (
    <Avatar
        src="https://www.flaticon.com/svg/vstatic/svg/1975/1975283.svg?token=exp=1617626152~hmac=f93c0803bf2e22eaa71923983a7b7c9e"
        appearance="square"
        size="large"
    />
);

const submissionAvatar = (
    <Avatar
        src="https://www.flaticon.com/svg/vstatic/svg/2681/2681062.svg?token=exp=1617626509~hmac=264ca8c6b29d2347c17b9fbd76fe26a9"
        appearance="square"
        size="large"
    />
);

interface UserDocument {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    ipAddress: string;
    isStaff: boolean;
    id: number;
}

const allDocumentTypes = [{label: 'Assignment', value: 'assignmentIndex'}, {label: 'Exam', value: 'examIndex'}, {
    label: 'Submission',
    value: 'submissionIndex'
}, {label: 'User', value: 'userIndex'}];

export default function SearchDrawer() {
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [result, setResult] = useState({});
    const [filterList, setFilterList] = useState([]);

    const search = async (searchQuery: string = "") => {
        if (searchQuery == "") {
            setResult({});
            return;
        }

        setQuery(searchQuery);
        setIsLoading(true);

        const data = await handleQuery(searchQuery, filterList);
        // console.log(data);

        setResult(data);
        setIsLoading(false);
    }

    const handleCheckBoxSelect = (event: []) => {
        event ??= []
        const filterList = event.map((el: { label: string, value: string }) => el);
        setFilterList(filterList);
        search(query);
    }

    const isDocumentTypeToggled = (docType: string): boolean => {
        return filterList.length === 0 || filterList.map(el => el.value).includes(docType);
    }

    const users = isDocumentTypeToggled('userIndex') ? result.userIndex?.map((el: UserDocument) => {
        return <ObjectResult key={el.id} onClick={() => router.push(`/users/${el.id}`)} resultId={el.id} name={el.username}
                             avatar={userAvatar} containerName="users" caption={el.email}/>
    }) ?? [] : [];
    const assignments = isDocumentTypeToggled('assignmentIndex') ? result.assignmentIndex?.map((el) => {
        return <ObjectResult key={el.id} onClick={() => router.push(`/assignments/edit/${el.id}`)} resultId={el.id} name={el.name}
                             avatar={assignmentAvatar} containerName="assignments" caption={el.description}/>
    }) ?? [] : [];
    // Todo: add assignment template name and move submitted_code to caption
    const submissions = isDocumentTypeToggled('submissionIndex') ? result.submissionIndex?.map((el) => {
        return <ObjectResult key={el.id} onClick={() => router.push(`/assignments/${el.generatedAssignmentId}`)} resultId={el.id}
                             name={el.submittedScript}
                             avatar={submissionAvatar} containerName="submissions" caption="Caption test..."/>
    }) ?? []: [];
    const exams = isDocumentTypeToggled('examIndex') ? result.examIndex?.map((el) => {
        return <ObjectResult key={el.templateId} onClick={() => alert('to be done')} resultId={el.templateId} name={el.name}
                             avatar={examAvatar} containerName="exams"/>
    }) ?? []: [];

    return (
        <QuickSearch
            isLoading={isLoading}
            onSearchInput={({target}) => {
                search(target.value);
            }}
            value={query}
        >
            <CheckboxSelect
                className="checkbox-select"
                classNamePrefix="select"
                options={allDocumentTypes}
                placeholder={'Searching for...'}
                value={filterList}
                onChange={handleCheckBoxSelect}
            >

            </CheckboxSelect>

            {users.length > 0 && <ResultItemGroup title="xUsers">
                {users}
            </ResultItemGroup>}

            {assignments.length > 0 && <ResultItemGroup title="xAssignments">
                {assignments}
            </ResultItemGroup>}

            {submissions.length > 0 &&  <ResultItemGroup title="xSubmissions">
                {submissions}
            </ResultItemGroup>}

            {exams.length > 0 && <ResultItemGroup title="xExams">
                {exams}
            </ResultItemGroup>}
        </QuickSearch>
    );
}

async function handleQuery(searchQuery: string, filterList: []) {

    const graphQlQuery = buildGraphQlQuery(filterList);
    // console.log(graphQlQuery)
    const searchQueryResult = await searchFetcher(graphQlQuery, {'query': searchQuery});
    return searchQueryResult;
}


const documentTypeQueryMapping = {
    'userIndex': `userIndex(query: $query) {
            username
            firstName
            lastName
            email
            ipAddress
            isStaff
            id
        }`,
    'assignmentIndex': `assignmentIndex(query: $query){
            id
            name
            description
        }`,
    'submissionIndex': `submissionIndex(query: $query){
            id
            submittedScript
            generatedAssignmentId
        }`,
    'examIndex': ` examIndex(query: $query) {
            templateId
            name
        }`,
}

function buildGraphQlQuery(filterList: []) {
    if (filterList.length === 0) {
        filterList = allDocumentTypes;
    }
    const innerQueries = filterList.map((docType) => documentTypeQueryMapping[docType.value]).join('')
    const query = gql`query searchByGivenQuery($query: String!) {
        ${innerQueries}
    }`
    return query;
}
