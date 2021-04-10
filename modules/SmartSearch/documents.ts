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
}

export type {UserDocument, AssignmentDocument, ExamDocument, SubmissionDocument};
