import {IExecuteFunctions, INodeProperties} from "n8n-workflow";

export const USERS_PROPERTIES: INodeProperties[] = [
	{
		displayOptions: {
			show: {
				resource: [
					'users',
				],
			},
		},
		displayName: 'Action',
		name: 'userAction',
		type: "options",
		options: [
			{
				name: 'Get current User',
				value: 'getMe',
				description: "Get current User"
			},
			{
				name: 'Create',
				value: 'create',
				description: "Create a User"
			},
			{
				name: "Get by ID or email",
				value: "getByID",
				description: "Get user by UUID or email"
			},
			{
				name: "Get My Contacts",
				value: "getMyContacts",
				description: "Get Contacts for the current User"
			},

		],
		default: 'getMe',
		description: 'Actions to do with Users',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'users'
				],
				userAction: [
					'getByID',
				]
			},
		},
		displayName: 'UUID or email',
		name: 'uuid',
		type: 'string',
		default: '',
		placeholder: 'xxxx-xxxx-xxxx-xxxx or email@mail.com',
		description: 'UUID or email',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'users'
				],
				userAction: [
					'create'
				]
			},
		},
		displayName: 'Given Name',
		name: 'givenName',
		type: 'string',
		default: '',
		description: 'Given Name',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'users'
				],
				userAction: [
					'create'
				]
			},
		},
		displayName: 'Family Name',
		name: 'familyName',
		type: 'string',
		default: '',
		description: 'Family Name',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'users'
				],
				userAction: [
					'create'
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
					'users'
				],
				userAction: [
					'create'
				]
			},
		},
		displayName: 'Work group UUID',
		name: 'workGroupID',
		type: 'string',
		default: '',
		description: 'Work group UUID',
	},
];


export function usersPreRequestLogic(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const action = node.getNodeParameter('userAction', 0) as "getMe" | "create" | "getByID" | "getMyContacts";

	switch (action) {

		case "create":
			return createUser(node);
		case "getByID":
			return getUserById(node);
		case "getMyContacts":
			return getMyContacts(node);
		case "getMe":
		default:
			return getCurrentUser(node);
	}
}

function getMyContacts(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	return {
		url: "/mycontacts",
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function getCurrentUser(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	return {
		url: "/me",
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}

function createUser(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const givenName = node.getNodeParameter('givenName', 0) as string;
	const familyName = node.getNodeParameter('familyName', 0) as string;
	const email = node.getNodeParameter('email', 0) as string;
	const workGroupID = node.getNodeParameter('workGroupID', 0) as string;

	const body = {
		"email": email,
		"givenName": givenName,
		"familyName": familyName,
		"workgroupUuid": workGroupID
	};


	return {
		url: "/users",
		method: "POST",
		query: {},
		body: body,
		headers: {Accept: "application/json", "Content-Type": "application/json"},
		options: {}
	}
}

function getUserById(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const ID = node.getNodeParameter('uuid', 0) as string;

	return {
		url: "/users/" + ID,
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}



