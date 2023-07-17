import { ScheduledWorkflow, WorkflowRun } from './graphql/workflowListData';

export class Scenario {
    clusterName: string;
    workflowName: string;
    workflowID: string;
    cronSyntax: string;
    updatedAt: string;
    workflowRunID: string;
    workflowRunStatus: string;
}

export function dataToScenario(
    workflows: ScheduledWorkflow[],
    workflowRuns: WorkflowRun[]
): Scenario[] {
    return workflows.map((wf) => {
        const workflowRun = workflowRuns.find(
            (r) => r.workflowID === wf.workflowID
        );
        return {
            clusterName: wf.clusterName,
            workflowName: wf.workflowName,
            workflowID: wf.workflowID,
            cronSyntax: wf.cronSyntax,
            updatedAt: wf.updatedAt,
            workflowRunID: workflowRun.workflowRunID,
            workflowRunStatus: workflowRun.phase,
        };
    });
}
