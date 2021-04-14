// Typescript interfaces for searchable documents returned from GraphQL API.

interface UserDocument {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    ipAddress: string;
    isStaff: boolean;
}

interface ExamDocument {
    templateId: number;
    name: string;
}

interface AssignmentDocument {
    id: number;
    name: string;
    description: string;
}

interface SubmissionDocument {
    id: number;
    generatedAssignmentId: number;
    submittedScript: string;
    submitterUsername: string;
    assignmentName: string;
    correction: Correction | null;
}

interface Correction {
    id: number;
    score: number
}

/**
 * Typescript interface of a search result.
 */
interface SearchResult {
    userIndex?: UserDocument[];
    assignmentIndex?: AssignmentDocument[];
    examIndex?: ExamDocument[];
    submissionIndex?: SubmissionDocument[];
}

/**
 * Typescript interface representing select option of CheckboxSelect component.
 */
interface DocumentSelectOption {
    value: string,
    label: string
}


// Label is intended for users to be seen, whereas value is used internally only.
const assignmentDocument = {label: 'Assignment', value: 'assignmentIndex'}
const examDocument = {label: 'Exam', value: 'examIndex'}
const submissionDocument = {label: 'Submission', value: 'submissionIndex'}
const userDocument = {label: 'User', value: 'userIndex'}
const allDocumentTypes = [assignmentDocument, examDocument, submissionDocument, userDocument] as const;

export type {UserDocument, AssignmentDocument, ExamDocument, SubmissionDocument, SearchResult, DocumentSelectOption};
export {allDocumentTypes, userDocument, assignmentDocument, examDocument, submissionDocument}
