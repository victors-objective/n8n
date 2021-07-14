import {IExecuteFunctions, INodeProperties} from "n8n-workflow";

export const FOLDERS_PROPERTIES: INodeProperties[] = [
	{
		displayOptions: {
			show: {
				resource: [
					'folders',
				],
			},
		},
		displayName: 'Action',
		name: 'folderAction',
		type: "options",
		options: [

			{
				name: 'Create Folder',
				value: 'createFolder',
				description: "Create a Folder"
			},

		],
		default: 'createFolder',
		description: 'Actions to do with Folders',
	},

	{
		displayOptions: {
			show: {
				resource: [
					'folders'
				],
				folderAction: [
					'createFolder',

				]
			},
		},
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'folders'
				],
				folderAction: [
					'createFolder',

				]
			},
		},
		displayName: 'Parent UUID',
		name: 'parentUuid',
		type: 'string',
		default: '',
		description: 'Parent UUID',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'folders'
				],
				folderAction: [
					'createFolder',

				]
			},
		},
		displayName: 'Workspace UUID',
		name: 'workspaceUuid',
		type: 'string',
		default: '',
		description: 'Workspace UUID',
	},


];

export function foldersPreRequestLogic(node: IExecuteFunctions, itemIndex: number, action: String): { url: string, method: string, query: any, body: any, headers: any, options: any } {

	switch (action) {

		case "createFolder":
			return createFolder(node, itemIndex);

		default:
			return createFolder(node, itemIndex);
	}
}


function createFolder(node: IExecuteFunctions, itemIndex: number): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const name = node.getNodeParameter('name', itemIndex) as string;
	const parentUuid = node.getNodeParameter('parentUuid', itemIndex) as string;
	const workspaceUuid = node.getNodeParameter('workspaceUuid', itemIndex) as string;


	const body = {
		"name": name,
		"parentUuid": parentUuid,
		"workspaceUuid": workspaceUuid,
	};


	return {
		url: "/folders",
		method: "POST",
		query: {},
		body: body,
		headers: {Accept: "application/json", "Content-Type": "application/json"},
		options: {}
	}
}





