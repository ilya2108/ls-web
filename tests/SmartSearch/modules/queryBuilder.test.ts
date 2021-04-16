import {assignmentDocument, examDocument, submissionDocument, userDocument} from "../../../modules/SmartSearch/documents";
import {buildGraphQlQuery} from "../../../modules/SmartSearch/searchQuery";


describe('Test buildGraphQlQuery function', () => {
    test.each([
        [
            [examDocument],
            `query searchByGivenQuery($query: String!) {
        examIndex(query: $query) {
            templateId
            name
        }
    }`,
            [],
            `query searchByGivenQuery($query: String!) {
    }`,
        ]
    ])('Empty filter lists to test allSelectOption is used', (allSelectOption, expectedGraphQlQuery) => {
        const query = buildGraphQlQuery([], allSelectOption);
        expect(query).toBe(expectedGraphQlQuery);
    });

    test.each([
        [
            [examDocument],
            `query searchByGivenQuery($query: String!) {
        examIndex(query: $query) {
            templateId
            name
        }
    }`,
            [examDocument, submissionDocument],
            `query searchByGivenQuery($query: String!) {
        examIndex(query: $query) {
            templateId
            name
        }           
        submissionIndex(query: $query){
            id
            submittedScript
            generatedAssignmentId
            submitterUsername
            assignmentName
            correction {
                id
                score
            }
        }    
    }`,
            [examDocument, submissionDocument, userDocument],
            `query searchByGivenQuery($query: String!) {
        examIndex(query: $query) {
            templateId
            name
        }           
        submissionIndex(query: $query){
            id
            submittedScript
            generatedAssignmentId
            submitterUsername
            assignmentName
            correction {
                id
                score
            }
        userIndex(query: $query) {
            username
            firstName
            lastName
            email
            ipAddress
            isStaff
            id         
        }              
    }`,
            [examDocument, submissionDocument, userDocument, assignmentDocument],
            `query searchByGivenQuery($query: String!) {
        examIndex(query: $query) {
            templateId
            name
        }           
        submissionIndex(query: $query){
            id
            submittedScript
            generatedAssignmentId
            submitterUsername
            assignmentName
            correction {
                id
                score
            }
        userIndex(query: $query) {
            username
            firstName
            lastName
            email
            ipAddress
            isStaff
            id         
        }
        assignmentIndex(query: $query){
            id
            name
            description
        }            
    }`,
        ]
    ])('Non-empty filter list', (filterList, expectedGraphQlQuery) => {
        const query = buildGraphQlQuery(filterList, []);
        expect(query).toBe(expectedGraphQlQuery);
    });
})

export {}