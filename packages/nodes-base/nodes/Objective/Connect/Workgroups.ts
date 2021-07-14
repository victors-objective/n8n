import {IExecuteFunctions, INodeProperties} from "n8n-workflow";
import {isEmpty} from "lodash";

export const WORKGROUPS_PROPERTIES: INodeProperties[] = [
	{
		displayOptions: {
			show: {
				resource: [
					'workgroups',
				],
			},
		},
		displayName: 'Action',
		name: 'workgroupAction',
		type: "options",
		options: [

			{
				name: 'Add User to a Workgroup',
				value: 'addUserToWorkgroup',
				description: "Add User (Member) to a Workgroup"
			},
			{
				name: 'Get All Workgroups',
				value: 'getWorkgroups',
				description: "Get a page of Workgroups with the provided filters"
			},
			{
				name: 'Get Audit Events',
				value: 'getAuditEvents',
				description: "Get a page of AuditEvents occurred within a Workgroup by its unique identifier"
			},
			{
				name: 'Update status',
				value: 'updateStatus',
				description: "Update hidden status for a Workgroup by its unique identifier"
			},
			{
				name: 'Get Workgroup by UUID',
				value: 'getWorkgroup',
				description: "Get Workgroup by its unique identifier"
			},


		],
		default: 'addUserToWorkgroup',
		description: 'Actions to do with Workgroups',
	},

	{
		displayOptions: {
			show: {
				resource: [
					'workgroups'
				],
				workgroupAction: [
					'addUserToWorkgroup',
					'getAuditEvents',
					'updateStatus',
					'getWorkgroup',
				]
			},
		},
		displayName: 'Workgroup UUID',
		name: 'workgroupUUID',
		type: 'string',
		default: '',
		description: 'Workgroup UUID',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workgroups'
				],
				workgroupAction: [
					'addUserToWorkgroup',

				]
			},
		},
		displayName: 'User UUID',
		name: 'userUUID',
		type: 'string',
		default: '',
		description: 'User UUID',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workgroups'
				],
				workgroupAction: [
					'addUserToWorkgroup',

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
					'workgroups'
				],
				workgroupAction: [
					'addUserToWorkgroup',

				]
			},
		},
		displayName: 'Pre-accept',
		name: 'preaccept',
		type: 'boolean',
		default: 'false',
		description: 'Pre-accept',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workgroups'
				],
				workgroupAction: [
					'getWorkgroups',

				]
			},
		},
		displayName: 'Account UUID',
		name: 'accountUuid',
		type: 'string',
		default: '',
		description: 'Account UUID',
	},

	{
		displayOptions: {
			show: {
				resource: [
					'workgroups'
				],
				workgroupAction: [
					'updateSupportedActions',

				]
			},
		},
		displayName: 'Account UUID',
		name: 'accountUuid',
		type: 'string',
		default: '',
		description: 'Account UUID',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'workgroups'
				],
				workgroupAction: [
					'updateStatus',

				]
			},
		},
		displayName: 'Hidden',
		name: 'hidden',
		type: 'boolean',
		default: 'false',
		description: 'Hidden status',
	},

];

export function workgroupsPreRequestLogic(node: IExecuteFunctions, itemIndex: number, action: String): { url: string, method: string, query: any, body: any, headers: any, options: any } {

	switch (action) {
		case "addUserToWorkgroup":
			return addUserToWorkgroup(node, itemIndex);
		case "getWorkgroups":
			return getWorkgroups(node, itemIndex);
		case "getAuditEvents":
			return getAuditEvents(node, itemIndex);
		case "updateStatus":
			return updateStatus(node, itemIndex);
		case "getWorkgroup":
			return getWorkgroup(node, itemIndex);
		default:
			return addUserToWorkgroup(node, itemIndex);
	}
}


function addUserToWorkgroup(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const workgroupUuid = node.getNodeParameter('workgroupUUID', itemIndex) as string;
	const userUUID = node.getNodeParameter('userUUID', itemIndex) as string;
	const message = node.getNodeParameter('message', itemIndex) as string;
	const preaccept = node.getNodeParameter('preaccept', itemIndex) as string;


	const body = {
		"workgroupUuid": workgroupUuid,
		"userUuid": userUUID,
		"message": message,
		"preaccept": preaccept
	};


	return {
		url: "/memberships",
		method: "POST",
		query: {},
		body: body,
		headers: {Accept: "application/json", "Content-Type": "application/json"},
		options: {}
	}
}

function getWorkgroups(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const accountUuid = node.getNodeParameter('accountUuid', itemIndex) as string;
	const query: any = {};

	if (!isEmpty(accountUuid)) {
		query.accountUuid = accountUuid;
	}

	return {
		url: "/workgroups",
		method: "GET",
		query: query,
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function getAuditEvents(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const workgroupUuid = node.getNodeParameter('workgroupUUID', itemIndex) as string;


	return {
		url: "/workgroups/" + workgroupUuid + "/auditevents",
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function updateStatus(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const workgroupUuid = node.getNodeParameter('workgroupUUID', itemIndex) as string;
	const hidden = node.getNodeParameter('hidden', itemIndex) as boolean;

	const body = {
		"hidden": hidden
	};

	return {
		url: "/workgroups/" + workgroupUuid + "/hidden",
		method: "PUT",
		query: {},
		body: body,
		headers: {Accept: "*/*", "Content-Type": "application/json"},
		options: {}
	}
}

function getWorkgroup(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const workgroupUuid = node.getNodeParameter('workgroupUUID', itemIndex) as string;

	return {
		url: "/workgroups/" + workgroupUuid,
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}
