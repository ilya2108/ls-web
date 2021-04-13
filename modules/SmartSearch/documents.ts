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

const assignmentDocument = {label: 'Assignment', value: 'assignmentIndex'}
const examDocument = {label: 'Exam', value: 'examIndex'}
const submissionDocument = {label: 'Submission', value: 'submissionIndex'}
const userDocument = {label: 'User', value: 'userIndex'}
const allDocumentTypes = [assignmentDocument, examDocument, submissionDocument, userDocument] as const;

export type {UserDocument, AssignmentDocument, ExamDocument, SubmissionDocument};
export {allDocumentTypes, userDocument, assignmentDocument, examDocument, submissionDocument}
