import {searchFetcher} from "../api";
import {gql} from "graphql-request";

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
    'examIndex': `examIndex(query: $query) {
            templateId
            name
        }`,
}

const allDocumentTypes = [{label: 'Assignment', value: 'assignmentIndex'}, {label: 'Exam', value: 'examIndex'}, {
    label: 'Submission',
    value: 'submissionIndex'
}, {label: 'User', value: 'userIndex'}];

async function handleQuery(searchQuery: string, filterList) {
    const graphQlQuery = buildGraphQlQuery(filterList);
    const searchQueryResult = await searchFetcher(graphQlQuery, {'query': searchQuery});
    return searchQueryResult;
}

function buildGraphQlQuery(filterList) {
    if (filterList.length === 0) {
        filterList = allDocumentTypes;
    }
    const innerQueries = filterList.map((docType) => documentTypeQueryMapping[docType.value]).join('')
    const query = gql`query searchByGivenQuery($query: String!) {
        ${innerQueries}
    }`
    return query;
}

export {handleQuery, allDocumentTypes}