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
            submitterUsername
            assignmentName
            correction {
                id
                score
            }
        }`,
    'examIndex': `examIndex(query: $query) {
            templateId
            name
        }`,
}

async function handleQuery(searchQuery: string, filterList, allSelectOptions) {
    const graphQlQuery = buildGraphQlQuery(filterList, allSelectOptions);
    const searchQueryResult = await searchFetcher(graphQlQuery, {'query': searchQuery});
    return searchQueryResult;
}

function buildGraphQlQuery(filterList, allSelectOptions) {
    if (filterList.length === 0) {
        filterList = allSelectOptions;
    }
    const innerQueries = filterList.map((docType) => documentTypeQueryMapping[docType.value]).join('');
    const query = gql`query searchByGivenQuery($query: String!) {
        ${innerQueries}
    }`
    return query;
}

export {handleQuery};
