import {SearchResult} from "./documents";
import {GraphQLClient} from "graphql-request";

/**
 * Asynchronous GraphQL search API entrypoint.
 * @param query - String representing GraphQL query.
 * @param variables - Object whose fields will be passed as variables to the GraphQL query.
 * @return data - Promise of SearchResult object.
 */
export async function searchFetcher(query: string, variables: Object = {}): Promise<SearchResult> {
    try {
        const endpoint = 'http://localhost:8000/graphql_search/';
        const client = new GraphQLClient(endpoint, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return await client.request(query, variables);
    } catch (e) {
        if (e?.response?.data) {
            return e.response.data
        }
        throw e
    }
}