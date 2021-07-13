import {IExecuteFunctions, INodeProperties} from "n8n-workflow";

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

];

export function workgroupsPreRequestLogic(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const action = node.getNodeParameter('workgroupAction', 0) as "addUserToWorkgroup";

	switch (action) {

		case "addUserToWorkgroup":
			return addUserToWorkgroup(node);

		default:
			return addUserToWorkgroup(node);
	}
}


function addUserToWorkgroup(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const workgroupUuid = node.getNodeParameter('workgroupUUID', 0) as string;
	const userUUID = node.getNodeParameter('userUUID', 0) as string;
	const message = node.getNodeParameter('message', 0) as string;
	const preaccept = node.getNodeParameter('preaccept', 0) as string;


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
