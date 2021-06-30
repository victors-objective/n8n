import {IExecuteFunctions, INodeProperties} from "n8n-workflow";

export const WORKSPACES_PROPERTIES: INodeProperties[] = [
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces',
				],
			},
		},
		displayName: 'Action',
		name: 'workspaceAction',
		type: "options",
		options: [
			{
				name: 'Get all my Workspaces',
				value: 'getMy',
				description: "Get the Workspaces for the current User"
			},
			{
				name: 'Create',
				value: 'create',
				description: "Create a new Workspace"
			},
			{
				name: "Get by ID",
				value: "getByID",
				description: "Get Workspace by its unique identifier"
			},
			{
				name: 'Delete',
				value: 'delete',
				description: "Delete Workspace"
			},
			{
				name: 'Get Audit Events',
				value: 'getAuditEvents',
				description: "Get AuditEvents for a Workspace by its uuid"
			},
		],
		default: 'getMy',
		description: 'Actions to do with Workspaces',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'getByID',
					'delete',
					'getAuditEvents'
				]
			},
		},
		displayName: 'UUID',
		name: 'uuid',
		type: 'string',
		default: '',
		placeholder: 'xxxx-xxxx-xxxx-xxxx',
		description: 'UUID of the Workspace',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'create'
				]
			},
		},
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Workspace name',
	}
];

function deleteWorkspace(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const UUID = node.getNodeParameter('uuid', 0) as string;

	return {
		url: "/workspaces/" + UUID,
		method: "DELETE",
		query: {},
		body: {},
		headers: {"Accept": "*/*", "Content-Type": "application/json"},
		options: {}
	}
}

function getAuditEvents(node: IExecuteFunctions) {
	const UUID = node.getNodeParameter('uuid', 0) as string;

	return {
		url: "/workspaces/" + UUID + "/auditevents",
		method: "GET",
		query: {},
		body: {},
		headers: {"Accept": "application/json"},
		options: {}
	}

}

export function workspacesPreRequestLogic(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const action = node.getNodeParameter('workspaceAction', 0) as "getMy" | "create" | "getByID" | "delete" | "getAuditEvents";

	switch (action) {
		case "getAuditEvents":
			return getAuditEvents(node);
		case "delete":
			return deleteWorkspace(node);
		case "create":
			return createWorkspace(node);
		case "getByID":
			return getWorkspaceById(node);
		case "getMy":
		default:
			return getMyWorkspaces(node);
	}
}

function getMyWorkspaces(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	return {
		url: "/myworkspaces",
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function createWorkspace(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const name = node.getNodeParameter('name', 0) as string; //TODO

	return {
		url: "/workspaces/",
		method: "POST",
		query: {},
		body: {name: name},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function getWorkspaceById(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const UUID = node.getNodeParameter('uuid', 0) as string;

	return {
		url: "/workspaces/" + UUID,
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}



