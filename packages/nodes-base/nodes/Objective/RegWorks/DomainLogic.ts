import { IExecuteFunctions, ILoadOptionsFunctions, INodeProperties, INodePropertyOptions } from "n8n-workflow";
import { regWorksApiRequest } from "./GenericFunctions";

export const DOMAIN_PROPERTIES: INodeProperties[] = [
    {
        displayOptions: {
            show: {
                resource: [
                    'domain',
                ],
            },
        },
        displayName: 'Action',
        name: 'domainAction',
        type: "options",
        options: [
            {
                name: 'Get Domain',
                value: 'get',
                description: "Gets a domain by its code"
            },
            {
                name: 'Create Domain',
                value: 'create',
                description: "Creates a domain of a set type, using items[0]"
            },
            {
                name: "Update Domain",
                value: "update",
                description: "Complete or partial update of a domain, identified by code, using items[0]"
            }
        ],
        default: 'get',
        description: 'Domain code to get/update.',
    },
    {
        displayOptions: {
            show: {
                resource: [
                    'domain'
                ],
                domainAction: [
                    "get",
                    "update"
                ]
            },
        },
        displayName: 'Domain Code',
        name: 'domainCode',
        type: 'string',
        default: 'AAA-111',
        description: 'Domain code to get/update.',
    },
    {
        displayOptions: {
            show: {
                resource: [
                    'domain'
                ],
                domainAction: [
                    "create"
                ]
            },
        },
        typeOptions: {
            loadOptionsMethod: 'listDomainTypes',
        },
        displayName: 'Domain Type ID',
        name: 'domainTypeId',
        type: 'options',
        default: '',
        description: 'The Domain Type ID for the type to create.',
    }
];

export function domainPreRequestLogic(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
    const action = node.getNodeParameter('domainAction', 0) as "get" | "create" | "update";

    switch (action) {
        case "create":
            return createDomain(node);
        case "update":
            return updateDomain(node);
        case "get":
        default:
            return getDomain(node);
    }
}

function getDomain(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
    const domainCode = node.getNodeParameter('domainCode', 0) as string;

    return {
        url: "/api/v1/domains",
        method: "GET",
        query: { code: domainCode },
        body: {},
        headers: {},
        options: {}
    }
}

function createDomain(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
    const domainTypeId = node.getNodeParameter('domainTypeId', 0) as string;

    return {
        url: "/api/v1/domains",
        method: "POST",
        query: { type_id: domainTypeId },
        body: node.getInputData()[0].json,
        headers: { Prefer: "return=minimal" },
        options: {}
    }
}

function updateDomain(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
    const domainCode = node.getNodeParameter('domainCode', 0) as string;

    return {
        url: "/api/v1/domains",
        method: "PUT",
        query: { code: domainCode },
        body: node.getInputData()[0].json,
        headers: { Prefer: "return=minimal" },
        options: {}
    }
}

type DomainTypeListItem = {
    id: string,
    name: string,
    domainCategoryId: string
}

export async function listDomainTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const options: INodePropertyOptions[] = [];

    const serverUrl = this.getNodeParameter('serverUrl', 0) as string;
    const response = await regWorksApiRequest.call(this, "GET", serverUrl + "/api/v1/domainTypes", {}, { pageSize: 200 }, {});

    const results = response.results as DomainTypeListItem[];

    // Sort by category, and then name
    results.sort((a, b) => a.domainCategoryId == b.domainCategoryId ? a.name.localeCompare(b.name) : a.domainCategoryId.localeCompare(b.domainCategoryId))

    for (let result of results) {
        options.push({
            name: result.domainCategoryId + ": " + result.name,
            value: result.id,
        });
    }

    return options;
}