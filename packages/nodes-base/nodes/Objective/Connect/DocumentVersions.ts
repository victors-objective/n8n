import {IExecuteFunctions, INodeProperties} from "n8n-workflow";

export const DOCUMENT_VERSIONS_PROPERTIES: INodeProperties[] = [
	{
		displayOptions: {
			show: {
				resource: [
					'documentVersions',
				],
			},
		},
		displayName: 'Action',
		name: 'documentVersionAction',
		type: "options",
		options: [
			{
				name: 'Get Document Versions',
				value: 'getDocumentVersions',
				description: "Get a list of all document versions"
			},
		],
		default: 'getDocumentVersions',
		description: 'Actions to do with Document Versions',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'documentVersions'
				],
				documentVersionAction: [
					'getDocumentVersions'
				]
			},
		},
		displayName: 'Document UUID',
		name: 'docUuid',
		type: 'string',
		default: '',
		description: 'Document UUID',
	},
];


export function docVersionPreRequestLogic(node: IExecuteFunctions, itemIndex: number, action: String): { url: string, method: string, query: any, body: any, headers: any, options: any } {

	switch (action) {
		case "getDocumentVersion":
			return getDocumentVersion(node, itemIndex);
		case "uploadDocumentVersion":
			return uploadDocumentVersion(node);
		case "downloadDocumentVersion":
			return downloadDocumentVersion(node);
		default:
			return getDocumentVersion(node, itemIndex);
	}
}


function getDocumentVersion(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const uuid = node.getNodeParameter('docUuid', itemIndex) as string;

	return {
		url: "/documentversions",
		method: "GET",
		query: {"documentUuid": uuid},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}


function uploadDocumentVersion(node: IExecuteFunctions) {
	//TODO
	return {body: undefined, headers: undefined, method: "", options: undefined, query: undefined, url: ""};
}

function downloadDocumentVersion(node: IExecuteFunctions) {
	//TODO
	return {body: undefined, headers: undefined, method: "", options: undefined, query: undefined, url: ""};
}

