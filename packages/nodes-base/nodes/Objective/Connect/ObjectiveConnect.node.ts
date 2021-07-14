import {IExecuteFunctions} from 'n8n-core';
import {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {workspacesPreRequestLogic, WORKSPACES_PROPERTIES} from './Workspaces';
import {connectApiRequest} from './GenericFunctions';
import {usersPreRequestLogic, USERS_PROPERTIES} from "./Users";
import {assetsPreRequestLogic, ASSETS_PROPERTIES} from "./Assets";
import {DOCUMENTS_PROPERTIES, documentsPreRequestLogic} from "./Documents";
import {FOLDERS_PROPERTIES, foldersPreRequestLogic} from "./Folders";
import {DOCUMENT_VERSIONS_PROPERTIES, docVersionPreRequestLogic} from "./DocumentVersions";
import {WORKGROUPS_PROPERTIES, workgroupsPreRequestLogic} from "./Workgroups";

const GENERIC_PROPERTIES: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'Basic Auth',
				value: 'basicAuth'
			},
			{
				name: 'API Key',
				value: 'connectApiKey'
			}
		],
		default: 'basicAuth',
		description: 'Means of authenticating with the service.',
	},
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		options: [
			{
				name: 'Workspaces',
				value: 'workspaces',
			},
			{
				name: 'Users',
				value: 'users',
			},
			{
				name: 'Assets',
				value: 'assets',
			},
			{
				name: 'Documents',
				value: 'documents',
			},
			{
				name: 'Folders',
				value: 'folders',
			},
			{
				name: 'Document Versions',
				value: 'documentVersions',
			},
			{
				name: 'Workgroups',
				value: 'workgroups'
			}
		],
		default: 'workspaces',
		description: 'The resource to operate on.',
	}
];

export class ObjectiveConnect implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Objective Connect',
		name: 'objectiveConnect',
		icon: 'file:connect.svg',
		group: ['transform'],
		version: 1,
		description: 'Objective Content Sharing Platform',
		defaults: {
			name: 'Objective Connect',
			color: '#6abf70',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			...GENERIC_PROPERTIES,
			...WORKSPACES_PROPERTIES,
			...USERS_PROPERTIES,
			...ASSETS_PROPERTIES,
			...DOCUMENTS_PROPERTIES,
			...FOLDERS_PROPERTIES,
			...DOCUMENT_VERSIONS_PROPERTIES,
			...WORKGROUPS_PROPERTIES
		],
		credentials: [
			{
				name: 'objectiveBasic',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'basicAuth',
						],
					},
				},
			},
			{
				name: 'connectApiKey',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'connectApiKey'
						],
					},
				},
			}
		]
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as "workspaces" | "users" | "assets" | "documents" | "documentVersions" | "folders" | "workgroups";

		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		let url = "";
		let method = "GET";
		let query = {};
		let body = {};
		let headers = {};
		let options = {};
		let action = "";

		for (let i = 0; i < items.length; i++) {
			// Pre-request
			switch (resource) {
				case "workspaces":
					action = this.getNodeParameter('workspaceAction', 0) as "getMy" | "create" | "getByID" | "delete" | "getAuditEvents" | "getParticipants" | "addParticipants";
					({url, method, query, body, headers, options} = workspacesPreRequestLogic(this, i, action));
					break;
				case "users":
					action = this.getNodeParameter('userAction', 0) as "getMe" | "create" | "getByID" | "getMyContacts";
					({url, method, query, body, headers, options} = usersPreRequestLogic(this, i, action));
					break;
				case "assets":
					action = this.getNodeParameter('assetAction', 0) as "createFolder" | "getAssets" | "getAssetByUUID" | "deleteAssetByUUID" | "updateRestrictions" | "updateName";
					({url, method, query, body, headers, options} = assetsPreRequestLogic(this, i, action));
					break;
				case "documentVersions":
					action = this.getNodeParameter('documentVersionAction', 0) as "getDocumentVersion" | "uploadDocumentVersion" | "downloadDocumentVersion";
					({url, method, query, body, headers, options} = docVersionPreRequestLogic(this, i, action));
					break;
				case "documents":
					action = this.getNodeParameter('documentAction', 0) as "createDocument" | "lockDocument" | "updateDocument" | "downloadDocument";
					({url, method, query, body, headers, options} = documentsPreRequestLogic(this, i, action));
					break;
				case "folders":
					action = this.getNodeParameter('folderAction', 0) as "createFolder";
					({url, method, query, body, headers, options} = foldersPreRequestLogic(this, i, action));
					break;
				case "workgroups":
					action = this.getNodeParameter('workgroupAction', 0) as "addUserToWorkgroup" | "getWorkgroups" | "getAuditEvents" | "updateStatus" | "getWorkgroup";
					({url, method, query, body, headers, options} = workgroupsPreRequestLogic(this, i, action));
					break;
			}

			console.log("url", url);
			console.log("method", method);
			console.log("query", query);
			console.log("body", body);
			console.log("headers", headers);
			console.log("options", options);

			// Request
			const responseData = await connectApiRequest.call(this, method, url, body, query, headers, options);


			if (['documents'].includes(resource) && ['downloadDocument'].includes(action)) {
				const newItem: INodeExecutionData = {
					json: items[i].json,
					binary: {},
				};

				if (items[i].binary !== undefined) {
					Object.assign(newItem.binary, items[i].binary);
				}
				items[i] = newItem;
				const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i) as string;
				const documentID = this.getNodeParameter('documentUuid', i) as string;
				items[i].binary![dataPropertyNameDownload] = await this.helpers.prepareBinaryData(Buffer.from(responseData), documentID);
			} else {
				returnData.push(responseData as IDataObject);
			}
		}


		if (['documents'].includes(resource) && ['downloadDocument'].includes(action)) {
			// For document downloads the documents get attached to the existing items
			return this.prepareOutputData(items);
		} else {
			// For all other ones does the output items get replaced
			return [this.helpers.returnJsonArray(returnData)];
		}


	}
}
