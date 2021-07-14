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
			{
				name: 'Get Workspace Participants',
				value: 'getParticipants',
				description: "Get a page of Participants for a specified Workspace"
			},
			{
				name: 'Add Participant to Workspace',
				value: 'addParticipants',
				description: "Adds Participants to a Workspace using email addresses"
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
					'getAuditEvents',
					'getParticipants',
					'addParticipants'
				]
			},
		},
		displayName: 'Workspace UUID',
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
	},
	//Add Participant
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		description: 'Email',
	},

	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		description: 'Message',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Type',
		name: 'type',
		type: 'string',
		default: 'STANDARD',
		description: 'Type',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Is silent',
		name: 'isSilent',
		type: 'boolean',
		default: 'false',
		description: 'Is silent',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Download',
		name: 'hasDownload',
		type: 'boolean',
		default: 'false',
		description: 'Has Download',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Create Document',
		name: 'hasCreateDocument',
		type: 'boolean',
		default: 'false',
		description: 'Has Create Document',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Create Folder',
		name: 'hasCreateFolder',
		type: 'boolean',
		default: 'false',
		description: 'Has Create Folder',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Edit',
		name: 'hasEdit',
		type: 'boolean',
		default: 'false',
		description: 'Has Edit',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Delete',
		name: 'hasDelete',
		type: 'boolean',
		default: 'false',
		description: 'Has Delete',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Edit Online',
		name: 'hasEditOnline',
		type: 'boolean',
		default: 'false',
		description: 'Has Edit Online',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Invited',
		name: 'hasInvited',
		type: 'boolean',
		default: 'false',
		description: 'Has Invited',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Commented',
		name: 'hasCommented',
		type: 'boolean',
		default: 'false',
		description: 'Has Commented',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workspaces'
				],
				workspaceAction: [
					'addParticipants'
				]
			},
		},
		displayName: 'Has Manage Workspace',
		name: 'hasManageWorkspace',
		type: 'boolean',
		default: 'false',
		description: 'Has Manage Workspace',
	}
];

function deleteWorkspace(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const UUID = node.getNodeParameter('uuid', itemIndex) as string;

	return {
		url: "/workspaces/" + UUID,
		method: "DELETE",
		query: {},
		body: {},
		headers: {"Accept": "*/*", "Content-Type": "application/json"},
		options: {}
	}
}

function getAuditEvents(node: IExecuteFunctions, itemIndex: number) {
	const UUID = node.getNodeParameter('uuid', itemIndex) as string;

	return {
		url: "/workspaces/" + UUID + "/auditevents",
		method: "GET",
		query: {},
		body: {},
		headers: {"Accept": "application/json"},
		options: {}
	}

}

export function workspacesPreRequestLogic(node: IExecuteFunctions, itemIndex: number, action: String): { url: string, method: string, query: any, body: any, headers: any, options: any } {


	switch (action) {
		case "getAuditEvents":
			return getAuditEvents(node, itemIndex);
		case "delete":
			return deleteWorkspace(node, itemIndex);
		case "create":
			return createWorkspace(node, itemIndex);
		case "getByID":
			return getWorkspaceById(node, itemIndex);
		case "getParticipants":
			return getParticipants(node, itemIndex);
		case "addParticipants":
			return addParticipants(node, itemIndex);
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

function createWorkspace(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const name = node.getNodeParameter('name', itemIndex) as string; //TODO

	return {
		url: "/workspaces/",
		method: "POST",
		query: {},
		body: {name: name},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function getWorkspaceById(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const UUID = node.getNodeParameter('uuid', itemIndex) as string;

	return {
		url: "/workspaces/" + UUID,
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function getParticipants(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const UUID = node.getNodeParameter('uuid', itemIndex) as string;

	return {
		url: "/participants",
		method: "GET",
		query: {"workspaceUuid": UUID},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function addParticipants(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const uuid = node.getNodeParameter('uuid', itemIndex) as string;
	const email = node.getNodeParameter('email', itemIndex) as string;
	const message = node.getNodeParameter('message', itemIndex) as string;
	const type = node.getNodeParameter('type', itemIndex) as string;
	const isSilent = node.getNodeParameter('isSilent', itemIndex) as string;
	const hasDownload = node.getNodeParameter('hasDownload', itemIndex) as string;
	const hasCreateDocument = node.getNodeParameter('hasCreateDocument', itemIndex) as string;
	const hasCreateFolder = node.getNodeParameter('hasCreateFolder', itemIndex) as string;
	const hasEdit = node.getNodeParameter('hasEdit', itemIndex) as string;
	const hasDelete = node.getNodeParameter('hasDelete', itemIndex) as string;
	const hasEditOnline = node.getNodeParameter('hasEditOnline', itemIndex) as string;
	const hasInvited = node.getNodeParameter('hasInvited', itemIndex) as string;
	const hasCommented = node.getNodeParameter('hasCommented', itemIndex) as string;
	const hasManageWorkspace = node.getNodeParameter('hasManageWorkspace', itemIndex) as string;

	const body = {
		"workspaceUuid": uuid,
		"emails": [
			email
		],
		"message": message,
		"type": type,
		"isSilent": isSilent,
		"hasDownload": hasDownload,
		"hasCreateDocument": hasCreateDocument,
		"hasCreateFolder": hasCreateFolder,
		"hasEdit": hasEdit,
		"hasDelete": hasDelete,
		"hasEditOnline": hasEditOnline,
		"hasInvited": hasInvited,
		"hasCommented": hasCommented,
		"hasManageWorkspace": hasManageWorkspace,

	};

	return {
		url: "/participants",
		method: "POST",
		query: {},
		body: body,
		headers: {Accept: "application/json", "Content-Type": "application/json"},
		options: {}
	}
}
