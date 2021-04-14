import React, {useState} from "react";
import {
    ObjectResult,
    ResultItemGroup,
    QuickSearch,
} from "@atlaskit/quick-search";


import router from "next/router"
import {CheckboxSelect} from "@atlaskit/select";
import {assignmentAvatar, examAvatar, submissionAvatar, userAvatar} from "./avatars";
import {handleQuery} from "../../../modules/SmartSearch/queryBuilder";
import {
    allDocumentTypes,
    DocumentSelectOption,
    SearchResult,
    submissionDocument,
} from "../../../modules/SmartSearch/documents";
import Tooltip from "@atlaskit/tooltip";
import {SearchResultToolTip} from "./Tooltip.styles";
import {CodeBlock} from "@atlaskit/code";


/**
 * React stateful function component SearchDrawer, uses hooks.
 * @param props - Object of properties passed to the component. Must include admin: bool field.
 * @return React.Component - Returns component which represent SmartSearch searching entrypoint.
 */
export default function SearchDrawer(props: { admin: boolean }) {
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<SearchResult>({});
    const [filterList, setFilterList] = useState<Array<DocumentSelectOption>>([]);
    const allSelectOptions = (props.admin ? allDocumentTypes : [submissionDocument]) as Array<DocumentSelectOption>

    /**
     * Asynchronous function called whenever the search box value is changed.
     * @param searchQuery - String representing search query.
     */
    const search = async (searchQuery: string = "") => {
        setQuery(searchQuery);
        if (searchQuery == "") {
            setResult({});
            return;
        }
        setIsLoading(true);
        const data = await handleQuery(searchQuery, filterList, allSelectOptions);
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

    // Generates ObjectResult components for each document.

    const users = isDocumentTypeToggled('userIndex') ? result.userIndex?.map((el) => {
        return <ObjectResult key={el.id} onClick={() => router.push(`/users/${el.id}`)} resultId={el.id} name={el.username}
                             avatar={userAvatar} containerName="user" caption={el.email}/>
    }) ?? [] : [];

    const assignments = isDocumentTypeToggled('assignmentIndex') ? result.assignmentIndex?.map((el) => {
        return <Tooltip key={el.id} component={SearchResultToolTip} content={el.description}>
            <ObjectResult key={el.id} onClick={() => router.push(`/assignments/edit/${el.id}`)} resultId={el.id} name={el.name}
                          avatar={assignmentAvatar} containerName="assignment" caption={el.description}/>
        </Tooltip>
    }) ?? [] : [];

    const submissions = isDocumentTypeToggled('submissionIndex') ? result.submissionIndex?.map((el) => {
            return <Tooltip key={el.id} component={SearchResultToolTip}
                            content={<CodeBlock language="shell" text={el.submittedScript}>el.submittedScript</CodeBlock>}><ObjectResult
                key={el.id} onClick={() => router.push(`/assignments/${el.generatedAssignmentId}`)} resultId={el.id}
                name={`${el.assignmentName} (${el.submitterUsername})`}
                avatar={submissionAvatar(el.correction?.score)} containerName="submission" caption={el.submittedScript}/>
            </Tooltip>
        }
    ) ?? [] : [];

    const exams = isDocumentTypeToggled('examIndex') ? result.examIndex?.map((el) => {
            return <ObjectResult key={el.templateId} onClick={() => alert('to be done')} resultId={el.templateId} name={el.name}
                                 avatar={examAvatar} containerName="exam"/>
        }
    ) ?? [] : [];

    return (
        // Atlassian search component which provides search box and styling.
        <QuickSearch
            isLoading={isLoading}
            onSearchInput={({target}) => {
                // @ts-ignore
                search(target.value);
            }}
            value={query}
        >
            {   // Checkbox select component for filtering document types to be searched.
                props.admin && <CheckboxSelect
                className="checkbox-select"
                classNamePrefix="select"
                options={allSelectOptions}
                placeholder={'Searching for...'}
                value={filterList}
                onChange={handleCheckBoxSelect}
                isSearchable={false}

            />}
            {
                // Result group for each document type
                // Displayed only if at least one result exists
            }
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
