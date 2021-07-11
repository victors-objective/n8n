import {IExecuteFunctions, INodeProperties} from "n8n-workflow";
import {isEmpty} from 'lodash';

export const ASSETS_PROPERTIES: INodeProperties[] = [
	{
		displayOptions: {
			show: {
				resource: [
					'assets',
				],
			},
		},
		displayName: 'Action',
		name: 'assetAction',
		type: "options",
		options: [
			{
				name: "Get Assets",
				value: "getAssets",
				description: "Get a page of Assets with the provided filters"
			},
			{
				name: "Get Asset by UUID",
				value: "getAssetByUUID",
				description: "Get an Asset by its uuid"
			},
			{
				name: "Delete Asset by UUID",
				value: "deleteAssetByUUID",
				description: "Delete an Asset by its uuid"
			},
			{
				name: "Update Restrictions",
				value: "updateRestrictions",
				description: "Update an Asset restrictions by its unique identifier. Only machine users can do this"
			},
			{
				name: "Update Name",
				value: "updateName",
				description: "Update an Asset name by its unique identifier"
			},
		],
		default: 'getAssets',
		description: 'Actions to do with Assets',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'assets'
				],
				assetAction: [
					'getAssetByUUID',
					'deleteAssetByUUID',
					'updateRestrictions',
					'updateName'
				]
			},
		},
		displayName: 'UUID',
		name: 'assetUuid',
		type: 'string',
		default: '',
		description: 'The UUID of the Asset	',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'assets'
				],
				assetAction: [
					'getAssets',
					'updateName'
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
					'assets'
				],
				assetAction: [
					'getAssets'
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
					'assets'
				],
				assetAction: [
					'getAssets'
				]
			},
		},
		displayName: 'Workspace UUID',
		name: 'workspaceUuid',
		type: 'string',
		default: '',
		description: 'Workspace UUID',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'assets'
				],
				assetAction: [
					'getAssets'
				]
			},
		},
		displayName: 'Ancestor UUID',
		name: 'ancestorUuid',
		type: 'string',
		default: '',
		description: 'Filter to include Assets that are children of any depth of the Asset with uuid specified. Requires workspaceUuid to also be provided',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'assets'
				],
				assetAction: [
					'updateRestrictions'
				]
			},
		},
		displayName: 'Allow New Document',
		name: 'allowNewDocument',
		type: 'boolean',
		default: 'false',
		description: 'Allow Document creation',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'assets'
				],
				assetAction: [
					'updateRestrictions'
				]
			},
		},
		displayName: 'Allow New Folder',
		name: 'allowNewFolder',
		type: 'boolean',
		default: 'false',
		description: 'Allow Folder creation',
	},
	{
		displayOptions: {
			show: {
				resource: [
					'assets'
				],
				assetAction: [
					'updateRestrictions'
				]
			},
		},
		displayName: 'Allow Edit',
		name: 'allowEdit',
		type: 'boolean',
		default: 'false',
		description: 'Allow edit',
	},
];

export function assetsPreRequestLogic(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const action = node.getNodeParameter('assetAction', 0) as "createFolder" | "createDocument" | "getAssets" | "getAssetByUUID" | "deleteAssetByUUID" | "updateRestrictions" | "updateName";

	switch (action) {
		case "getAssetByUUID":
			return getAssetByUUID(node);
		case "deleteAssetByUUID":
			return deleteAssetByUUID(node);
		case "updateRestrictions":
			return updateRestriction(node);
		case "updateName":
			return updateName(node);
		case "getAssets":
		default:
			return getAssetByUUID(node);
	}
}

function updateName(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const uuid = node.getNodeParameter('assetUuid', 0) as string;
	const name = node.getNodeParameter('name', 0) as string;

	const body = {
		"name": name,
	};

	return {
		url: "/assets/" + uuid + "/name",
		method: "PUT",
		query: {},
		body: body,
		headers: {Accept: "*/*", "Content-Type": "application/json"},
		options: {}
	}

}

function updateRestriction(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const uuid = node.getNodeParameter('assetUuid', 0) as string;
	const allowNewDocument = node.getNodeParameter('allowNewDocument', 0) as string;
	const allowNewFolder = node.getNodeParameter('allowNewFolder', 0) as string;
	const allowEdit = node.getNodeParameter('allowEdit', 0) as string;

	const body = {
		"allowNewDocument": allowNewDocument,
		"allowNewFolder": allowNewFolder,
		"allowEdit": allowEdit,
	};

	return {
		url: "/assets/" + uuid + "/restrictions",
		method: "PUT",
		query: {},
		body: body,
		headers: {Accept: "*/*", "Content-Type": "application/json"},
		options: {}
	}
}


function deleteAssetByUUID(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const UUID = node.getNodeParameter('assetUuid', 0) as string;

	return {
		url: "/assets/" + UUID,
		method: "DELETE",
		query: {},
		body: {},
		headers: {Accept: "*/*", "Content-Type": "application/json"},
		options: {}
	}

}

function getAssetByUUID(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const UUID = node.getNodeParameter('assetUuid', 0) as string;

	return {
		url: "/assets/" + UUID,
		method: "GET",
		query: {},
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}


function getAssets(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
	const name = node.getNodeParameter('name', 0) as string;
	const parentUuid = node.getNodeParameter('parentUuid', 0) as string;
	const workspaceUuid = node.getNodeParameter('workspaceUuid', 0) as string;
	const ancestorUuid = node.getNodeParameter('ancestorUuid', 0) as string;

	const query: any = {};

	if (!isEmpty(name)) {
		query.name = name;
	}
	if (!isEmpty(parentUuid)) {
		query.parentUuid = parentUuid;
	}
	if (!isEmpty(workspaceUuid)) {
		query.workspaceUuid = workspaceUuid;
	}
	if (!isEmpty(ancestorUuid)) {
		query.ancestorUuid = ancestorUuid;
	}

	return {
		url: "/assets",
		method: "GET",
		query: query,
		body: {},
		headers: {Accept: "application/json"},
		options: {}
	}
}



