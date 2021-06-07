import { IExecuteFunctions, ILoadOptionsFunctions, INodeProperties, INodePropertyOptions } from "n8n-workflow";
import { regWorksApiRequest } from "./GenericFunctions";


export const WORKFLOW_PROPERTIES: INodeProperties[] = [
    {
        displayOptions: {
            show: {
                resource: [
                    'workflow',
                ],
            },
        },
        displayName: 'Action',
        name: 'workflowAction',
        type: "options",
        options: [
            {
                name: 'List actions',
                value: 'list',
                description: "List workflow actions for the given domain code"
            },
            {
                name: 'Perform action',
                value: 'perform',
                description: "Performs a workflow action"
            }
        ],
        default: 'perform'
    },
    {
        displayOptions: {
            show: {
                resource: [
                    'workflow'
                ],
                workflowAction: [
                    "list",
                    "perform"
                ]
            },
        },
        displayName: 'Domain Code',
        name: 'workflowDomainCode',
        type: 'string',
        default: 'AAA-111',
        description: 'Domain code to perform or list workflows on.',
    },
    {
        typeOptions: {
            loadOptionsMethod: 'getWorkflowOptions',
        },
        displayOptions: {
            show: {
                resource: [
                    'workflow'
                ],
                workflowAction: [
                    "perform"
                ]
            },
        },
        displayName: 'Workflow ID',
        name: 'workflowId',
        type: 'options',
        default: '',
        description: 'The Workflow action to perform',
    }
];


export function workflowPreRequestLogic(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
    const action = node.getNodeParameter('workflowAction', 0) as "list" | "perform";

    switch (action) {
        case "perform":
            return performWorkflow(node);
        case "list":
        default:
            return listWorkflows(node);
    }
}

function listWorkflows(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
    const domainCode = node.getNodeParameter('workflowDomainCode', 0) as string;
    return listWorkflowsCommon(domainCode);
}

function listWorkflowsCommon(domainCode: string): { url: string, method: string, query: any, body: any, headers: any, options: any } {

    return {
        url: "/api/v1/domains/" + encodeURIComponent(domainCode) + "/workflows",
        method: "GET",
        query: { pageSize: 100 },
        body: {},
        headers: {},
        options: {}
    }
}


export async function getWorkflowOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const serverUrl = this.getNodeParameter('serverUrl', 0) as string;
    const domainCode = this.getNodeParameter('workflowDomainCode', 0) as string;

    const request = listWorkflowsCommon(domainCode);
    const response = await regWorksApiRequest.call(this, request.method, serverUrl + request.url, {}, request.query, {});

    const options: INodePropertyOptions[] = [];
    for (let action of response.results.filter((wf: any) => wf.actionType == "SIMPLE")) {
        options.push({
            name: action.name,
            value: action.id,
            description: "Transitions to " + action.targetStatus,
        });
    }

    return options.sort((a, b) => a.name.localeCompare(b.name));
}


function performWorkflow(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
    const domainCode = node.getNodeParameter('workflowDomainCode', 0) as string;
    const workflowId = node.getNodeParameter('workflowId', 0) as string;

    return {
        url: "/api/v1/domains/" + encodeURIComponent(domainCode) + "/workflows/" + encodeURIComponent(workflowId),
        method: "POST",
        query: { ignoreWarnings: false },
        body: {},
        headers: {},
        options: {}
    }
}