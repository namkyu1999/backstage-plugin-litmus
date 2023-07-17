export interface ScheduledWorkflow {
    workflowID: string;
    cronSyntax: string;
    clusterName: string;
    workflowName: string;
    updatedAt: string;
}

export interface GetWorkflowsResponse {
    workflows: ScheduledWorkflow[];
}

export interface ScheduledWorkflows {
    listWorkflows: GetWorkflowsResponse;
}

export interface Pagination {
    page: number;
    limit: number;
}

export interface SortRequest {
    field: 'NAME' | 'TIME';
    descending?: Boolean;
}

export interface WorkflowFilterRequest {
    workflowName?: string;
    clusterName?: string;
}

export interface GetWorkflowsRequest {
    request: {
        projectID: string;
        workflowIDs?: string[];
        pagination?: Pagination;
        sort?: SortRequest;
        filter?: WorkflowFilterRequest;
    };
}

export interface WorkflowRun {
    workflowRunID: string;
    workflowID: string;
    phase: string;
    lastUpdated: number;
}

interface GetWorkflowRunsResponse {
    workflowRuns: WorkflowRun[];
}

export interface Workflow {
    listWorkflowRuns: GetWorkflowRunsResponse;
}

export interface WorkflowDataRequest {
    request: {
        projectID: string;
        workflowRunIDs?: string[];
        workflowIDs?: string[];
        pagination?: Pagination;
        sort?: SortRequest;
        filter?: WorkflowFilterRequest;
    };
}
