import {IExecuteFunctions, INodeProperties} from "n8n-workflow";

export const DOCUMENTS_PROPERTIES: INodeProperties[] = [
	{
		displayOptions: {
			show: {
				resource: [
					'documents',
				],
			},
		},
		displayName: 'Action',
		name: 'documentAction',
		type: "options",
		options: [
			{
				name: 'Create a document',
				value: 'createDocument',
				description: "Create a document"
			},
			{
				name: 'Lock or unlock a document',
				value: 'lockDocument',
				description: "Lock or unlock a document"
			},
			{
				name: 'Update a document',
				value: 'updateDocument',
				description: "Upload a new document version"
			},
			{
				name: 'Download a document',
				value: 'downloadDocument',
				description: "Download a document"
			},

		],
		default: 'createDocument',
		description: 'Actions to do with Documents',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'documents'
				],
				documentAction: [
					'lockDocument',
					'downloadDocument',
				]
			},
		},
		displayName: 'Document UUID',
		name: 'documentUuid',
		type: 'string',
		default: '',
		description: 'Document UUID',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'documents'
				],
				documentAction: [
					'createDocument'
				]
			},
		},
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Create document',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'documents'
				],
				documentAction: [
					'lockDocument'
				]
			},
		},
		displayName: 'Locked',
		name: 'locked',
		type: 'boolean',
		default: 'true',
		description: 'Locked or unlocked document status',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'documents'
				],
				documentAction: [
					'downloadDocument'
				]
			},
		},
		displayName: 'Binary property name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		description: 'Binary property name for document content',
	},
];


export function documentsPreRequestLogic(node: IExecuteFunctions, itemIndex: number, action: String): { url: string, method: string, query: any, body: any, headers: any, options: any } {

	switch (action) {
		case "createDocument":
			return createDocument(node);
		case "lockDocument":
			return lockDocument(node, itemIndex)
		case "downloadDocument":
			return downloadDocument(node, itemIndex);
		case "updateDocument":
			return updateDocument(node);
		default:
			return createDocument(node);
	}
}

function lockDocument(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const uuid = node.getNodeParameter('documentUuid', itemIndex) as string;
	const locked = node.getNodeParameter('locked', itemIndex) as string;

	const body = {
		"locked": locked,
	};
	return {
		url: "/documents/" + uuid + "/lock",
		method: "PUT",
		query: {},
		body: body,
		headers: {Accept: "*/*", "Content-Type": "application/json"},
		options: {}
	}
}

function downloadDocument(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const uuid = node.getNodeParameter('documentUuid', itemIndex) as string;

	return {
		url: "/documents/" + uuid + "/download",
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "*/*"},
		options: {encoding: null}
	}
}

function updateDocument(node: IExecuteFunctions) {
	//TODO
	return {body: undefined, headers: undefined, method: "", options: undefined, query: undefined, url: ""};
}

function createDocument(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	//TODO
	return {
		url: "/me",
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}




