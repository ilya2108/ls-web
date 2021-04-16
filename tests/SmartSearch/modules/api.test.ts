import {searchFetcher} from "../../../modules/SmartSearch/api";
import * as graphql from 'graphql-request';

jest.mock('graphql-request')


describe('Test GraphQL api fetcher function', () => {
    test('Fetcher calls GraphQL client with correct parameters.', async () => {
        const mockedGraphQlClientClass = (graphql.GraphQLClient as jest.Mock);
        const query = 'graphqlquery';
        const queryVariables = {};
        await searchFetcher(query, queryVariables)
        expect(mockedGraphQlClientClass.mock.instances[0].request.mock.calls[0][0]).toBe(query)
        expect(mockedGraphQlClientClass.mock.instances[0].request.mock.calls[0][1]).toBe(queryVariables)
    })
})

export {}