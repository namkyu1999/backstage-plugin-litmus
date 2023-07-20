import {
    ErrorBoundary,
    InfoCard,
    Table,
    TableColumn,
} from '@backstage/core-components';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import parser from 'cron-parser';
import {
    Button,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import {
    GET_WORKFLOW_DETAILS,
    getOwnerProject,
    getProjectList,
    WORKFLOW_DETAILS,
} from '../api';
import {
    GetWorkflowsRequest,
    ScheduledWorkflows,
    Workflow,
    WorkflowDataRequest,
} from '../model/graphql/workflowListData';
import createApolloClient from '../utils/createApolloClient';
import timeDifferenceForDate from '../utils/datesModifier';
import useStyles from './styles';
import { Project } from '../model/project';
import { dataToScenario, Scenario } from '../model/scenario';
import { getUsernameFromJWT } from '../utils/auth';

const OverviewTable = ({
    scenarios,
    currentProject,
}: {
    scenarios: Scenario[];
    currentProject: Project;
}) => {
    const configApi = useApi(configApiRef);
    const baseURL = configApi.getOptionalString('litmus.baseURL');
    const getVariant = (variant: string | undefined) => {
        switch (variant.toLowerCase()) {
            case 'succeeded':
                return 'succeeded';
            case 'failed':
                return 'failed';
            case 'running':
                return 'running';
            default:
                return 'pending';
        }
    };
    const getButtonColor = (variant: string) => {
        switch (variant) {
            case 'succeeded':
                return 'success';
            case 'failed':
                return 'error';
            case 'running':
                return 'info';
            default:
                return 'warning';
        }
    };
    const columns: TableColumn[] = [
        {
            title: 'Scenario Name',
            field: 'workflowName',
            highlight: true,
        },
        {
            title: 'Delegate',
            field: 'clusterName',
        },
        {
            title: 'Next Run',
            render: (row: any): React.ReactNode => (
                <div>
                    {row.cronSyntax === ''
                        ? ' Non Cron Chaos Scenario'
                        : parser
                              .parseExpression(row.cronSyntax)
                              .next()
                              .toString()}
                </div>
            ),
        },
        {
            title: 'Updated At',
            render: (row: any): React.ReactNode => (
                <div>{timeDifferenceForDate(row.updatedAt)}</div>
            ),
        },
        {
            title: 'Recent Run',
            render: (row: any): React.ReactNode =>
                row.workflowRunID === undefined ? (
                    <div>Not yet executed</div>
                ) : (
                    <Button
                        href={`${baseURL}/scenarios/${row.workflowRunID}?projectID=${currentProject.id}&projectRole=${currentProject.role}`}
                        color={getButtonColor(
                            getVariant(row.workflowRunStatus)
                        )}
                        variant="outlined"
                    >
                        {getVariant(row.workflowRunStatus)}
                    </Button>
                ),
        },
    ];
    return (
        <Table
            title="Chaos Scenarios"
            options={{
                paging: true,
                search: true,
                draggable: false,
                padding: 'dense',
            }}
            data={scenarios}
            columns={columns}
        />
    );
};

const LitmusOverview = ({
    currentProject,
    projectList,
    updateProject,
}: {
    currentProject: Project;
    projectList: Project[];
    updateProject: (updatedProject: Project) => void;
}) => {
    const classes = useStyles();

    const workflowsQuery = useQuery<ScheduledWorkflows, GetWorkflowsRequest>(
        GET_WORKFLOW_DETAILS,
        {
            variables: {
                request: {
                    projectID: currentProject.id,
                    sort: {
                        field: 'TIME',
                        descending: true,
                    },
                },
            },
            fetchPolicy: 'cache-and-network',
        }
    );

    const workflowRunsQuery = useQuery<Workflow, WorkflowDataRequest>(
        WORKFLOW_DETAILS,
        {
            variables: {
                request: {
                    projectID: currentProject.id,
                },
            },
            fetchPolicy: 'cache-and-network',
        }
    );

    if (workflowsQuery.loading || workflowRunsQuery.loading) {
        return (
            <InfoCard title="Litmus Overview">
                <LinearProgress />
            </InfoCard>
        );
    }
    if (workflowsQuery.error || workflowRunsQuery.error) {
        return (
            <InfoCard title="Litmus Overview">
                Error occurred while fetching data.
                {`${workflowsQuery.error.message}\n${workflowRunsQuery.error}`}
            </InfoCard>
        );
    }

    if (workflowsQuery.data && workflowRunsQuery.data) {
        const { workflows } = workflowsQuery.data.listWorkflows;
        // get latest workflowRun per WorkflowID
        const workflowRuns = Object.values(
            workflowRunsQuery.data.listWorkflowRuns.workflowRuns.reduce(
                (r, e) => {
                    const temp = r;
                    if (!temp[e.workflowID]) {
                        temp[e.workflowID] = e;
                    } else if (e.lastUpdated > temp[e.workflowID].lastUpdated) {
                        temp[e.workflowID] = e;
                    }
                    return temp;
                },
                []
            )
        );
        const scenarios = dataToScenario(workflows, workflowRuns);

        return (
            <InfoCard
                title={
                    <div className={classes.header}>
                        <Typography variant="h3">Litmus Overview</Typography>
                        <FormControl
                            variant="outlined"
                            className={classes.formControl}
                        >
                            <InputLabel className={classes.selectText}>
                                Select Project
                            </InputLabel>
                            <Select
                                defaultValue={currentProject.id}
                                onChange={(event) =>
                                    updateProject(
                                        projectList.find(
                                            (x) =>
                                                x.id ===
                                                (event.target.value as string)
                                        )
                                    )
                                }
                                label="Schedule Type"
                                className={classes.selectText}
                            >
                                {projectList.map((value) => (
                                    <MenuItem value={value.id} key={value.id}>
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                }
            >
                <OverviewTable
                    scenarios={scenarios}
                    currentProject={currentProject}
                />
            </InfoCard>
        );
    }

    return null;
};

export const LitmusOverviewCard = () => {
    const configApi = useApi(configApiRef);
    const baseURL = configApi.getOptionalString('litmus.baseURL');
    const apiToken = configApi.getOptionalString('litmus.apiToken');
    const client = createApolloClient(
        `${baseURL}/api/query`,
        `${baseURL}/ws/query`,
        apiToken
    );
    const [currentProject, setCurrentProject] = useState<Project>(null);
    const [projectList, setProjectList] = useState<Project[]>(null);
    const updateProject = (updatedProject: Project) => {
        setCurrentProject(updatedProject);
    };
    const username = getUsernameFromJWT(apiToken);

    useEffect(() => {
        getOwnerProject(`${baseURL}`, apiToken).then(([ownerProject, err]) => {
            if (err === null) {
                setCurrentProject(ownerProject);
            }
        });
    }, []);

    useEffect(() => {
        getProjectList(`${baseURL}`, apiToken, username).then(
            ([currentProjectList, err]) => {
                if (err === null) {
                    setProjectList(currentProjectList);
                }
            }
        );
    }, []);

    return (
        <ErrorBoundary>
            <ApolloProvider client={client}>
                {currentProject === null || projectList === null ? (
                    <InfoCard title="Litmus Overview">
                        <LinearProgress />
                    </InfoCard>
                ) : (
                    <LitmusOverview
                        currentProject={currentProject}
                        projectList={projectList}
                        updateProject={updateProject}
                    />
                )}
            </ApolloProvider>
        </ErrorBoundary>
    );
};
