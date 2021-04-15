
import {gql} from "graphql-request";
import { searchFetcher } from "./api";
import {DocumentSelectOption, SearchResult} from "./documents";

// Maps document type to its corresponding GraphQL API query.
// Query variable is string representing search query.
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

/**
 * Asynchronous entrypoint function which coordinates building GraphQL query from and fetching data using GraphQL API.
 * @param searchQuery - String representing search query.
 * @param filterList - Array of DocumentSelectOption objects to specify which document types to search.
 * @param allSelectOptions - If filterList is empty, allSelectOptions is used.
 * @return searchQueryResult - Promise of SearchResult object.
 */
async function handleQuery(searchQuery: string, filterList: Array<DocumentSelectOption>, allSelectOptions: Array<DocumentSelectOption>): Promise<SearchResult> {
    const graphQlQuery = buildGraphQlQuery(filterList, allSelectOptions);
    const searchQueryResult = await searchFetcher(graphQlQuery, {'query': searchQuery});
    return searchQueryResult;
}

/**
 * Builds GraphQL API query based on filterList.
 * @param filterList - Array of DocumentSelectOption objects. Each member of the array will be mapped to its corresponding GraphQL query.
 * @param allSelectOptions - If filterList is empty, allSelectOptions is used.
 * @return query - String representing document types to be searched in GraphQL query language.
 */
function buildGraphQlQuery(filterList: Array<DocumentSelectOption>, allSelectOptions: Array<DocumentSelectOption>): string {
    if (filterList.length === 0) {
        filterList = allSelectOptions;
    }
    const innerQueries = filterList.map((docType) => documentTypeQueryMapping[docType.value]).join('');
    const query = gql`query searchByGivenQuery($query: String!) {
        ${innerQueries}
    }`
    return query;
}

export {handleQuery, buildGraphQlQuery};
