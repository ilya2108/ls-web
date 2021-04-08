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
import {searchFetcher} from "../../../modules/api";
import {gql} from "graphql-request";
import router from "next/router"
import {CheckboxSelect} from "@atlaskit/select";
import {assignmentIcon, examIcon, submissionIcon, userIcon} from "../../../modules/SmartSearch/icons";
import {assignmentAvatar, examAvatar, submissionAvatar, userAvatar} from "./avatars";
import {allDocumentTypes, handleQuery} from "../../../modules/SmartSearch/queryBuilder";
import {AssignmentDocument, ExamDocument, SubmissionDocument, UserDocument} from "../../../modules/SmartSearch/documents";


export default function SearchDrawer() {
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<{
        userIndex?: UserDocument[];
        assignmentIndex?: AssignmentDocument[];
        examIndex?: ExamDocument[];
        submissionIndex?: SubmissionDocument[];
    }>({});
    const [filterList, setFilterList] = useState<
        {value: string; label:string}[]
        >([]);

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
    }) ?? [] : [];
    const exams = isDocumentTypeToggled('examIndex') ? result.examIndex?.map((el) => {
        return <ObjectResult key={el.templateId} onClick={() => alert('to be done')} resultId={el.templateId} name={el.name}
                             avatar={examAvatar} containerName="exams"/>
    }) ?? [] : [];

    return (
        <QuickSearch
            isLoading={isLoading}
            onSearchInput={({target}) => {
                // @ts-ignore
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

            {submissions.length > 0 && <ResultItemGroup title="xSubmissions">
                {submissions}
            </ResultItemGroup>}

            {exams.length > 0 && <ResultItemGroup title="xExams">
                {exams}
            </ResultItemGroup>}
        </QuickSearch>
    );
}
