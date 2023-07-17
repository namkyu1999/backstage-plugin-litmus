import { gql } from '@apollo/client';
import { jsonToProject, Project } from '../model/project';

export const getOwnerProjects = async (
    baseURL: string,
    token: string
): Promise<[string, Error]> => {
    return fetch(`${baseURL}/auth/get_owner_projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.data) {
                return [data.data[0], null];
            }
            return [null, new Error('owner projects not found')];
        })
        .catch((err) => {
            return [null, err];
        });
};

export const getProjectList = async (
    baseURL: string,
    token: string
): Promise<[Project[], Error]> => {
    return fetch(`${baseURL}/auth/list_projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.data) {
                const projectList = data.data.map((jsonData) =>
                    jsonToProject(jsonData)
                );
                return [projectList, null];
            }
            return [null, new Error('owner projects not found')];
        })
        .catch((err) => {
            return [null, err];
        });
};

// ListWorkflow
export const GET_WORKFLOW_DETAILS = gql`
    query listWorkflows($request: ListWorkflowsRequest!) {
        listWorkflows(request: $request) {
            workflows {
                workflowID
                cronSyntax
                clusterName
                workflowName
                updatedAt
            }
        }
    }
`;

export const WORKFLOW_DETAILS = gql`
    query listWorkflowRuns($request: ListWorkflowRunsRequest!) {
        listWorkflowRuns(request: $request) {
            workflowRuns {
                workflowRunID
                workflowID
                phase
                lastUpdated
            }
        }
    }
`;
