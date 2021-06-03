"use strict";
import {IExecuteFunctions} from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject, NodeOperationError,
} from 'n8n-workflow';

import {
	nexusApiRequest
} from './GenericFunctions';

import {
	folderFields,
	folderOperations,
} from './FolderDescription';
import {
	documentFields,
	documentOperations,
} from './DocumentDescription';
import {
	catalogueFields,
	catalogueOperations,
} from './CatalogueDescription';
import {
	commonFields,
} from './CommonDescription';
import {
	fileFields,
	fileOperations,
} from './FileDescription';
import {
	documentVersionFields,
	documentVersionOperations,
} from './DocumentVersionDescription';
import {
	workflowFields,
	workflowOperations,
} from './WorkflowDescription';

import { v1 as uuidv1 } from 'uuid';
import {PlatformPath} from "path";
import ErrnoException = NodeJS.ErrnoException;
// import * as winston from 'winston'

const BINARY_ENCODING = 'base64';

// temporary commented out due to compatibility issue with 'standalone custom' deployment
// const logger = winston.createLogger({
// 	level: 'info',
// 	format: winston.format.combine(
// 		winston.format.timestamp(),
// 		winston.format.splat(),
// 		winston.format.simple(),
// 		winston.format.prettyPrint(),
// 	),
// 	defaultMeta: {service: 'user-service'},
// 	transports: [
// 		new winston.transports.File({filename: 'combined.log'}),
// 		new winston.transports.Console()
// 	],
// });

async function createTempFile(fs: any, filePath: string, url: string, timeout: number) {
	return new Promise<string>(resolve => {
		let writeStream = fs.createWriteStream(filePath);
		const {pipeline} = require('stream');
		let https = require('follow-redirects').https;
		let req = https.get(url, function (res: any) {
			pipeline(res, writeStream, (err: any) => {
				if (err) {
					console.error('Pipeline failed.', err);
					resolve('error: ' + err);
				} else {
					resolve('success');
				}
			});
		});
		req.on("error", function (e: any) {
			console.error("Request Error : " + JSON.stringify(e));
			resolve('error: ' + e);
		});
		if (timeout > 0) {
			req.setTimeout(timeout, function () {
				console.error("Server connection timeout (after 1 second)");
				req.abort();
				resolve('timeout');
			});
		}

		req.end();
	})
}

export class ObjectiveNexus implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Objective Nexus',
		name: 'objectiveNexus',
		icon: 'file:Nexus.png',
		group: ['transform'],
		version: 1,
		description: 'Objective Content Management System',
		defaults: {
			name: 'Objective Nexus',
			color: '#007fd4',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'nexusDirectGrant',
				required: true,
			}
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Document version',
						value: 'documentversion',
					},
					{
						name: 'Folder',
						value: 'folder',
					},
					{
						name: 'Workflow',
						value: 'workflow',
					},
					{
						name: 'Catalogue',
						value: 'catalogue',
					},
					{
						name: 'File',
						value: 'file',
					},
				],
				default: 'document',
				description: 'The resource to operate on.',
			},
			// ----------------------------------
			//         operations
			// ----------------------------------
			...documentOperations,
			...documentVersionOperations,
			...folderOperations,
			...workflowOperations,
			...catalogueOperations,
			...fileOperations,
			// ----------------------------------
			//         fields
			// ----------------------------------
			...documentFields,
			...commonFields,
			...folderFields,
			...workflowFields,
			...catalogueFields,
			...fileFields,
			...documentVersionFields,
		]
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		// logger.debug(">>>Start Nexus execute");
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// logger.debug('items with o: %o', items);
		// logger.debug('resource: %s, operation: %s', resource, operation);

		let endpoint = '';
		let requestMethod = '';
		let body: IDataObject | Buffer;
		let options;
		let query: IDataObject = {};
		let filePath : string = '';
		const headers: IDataObject = {};
		let fs = require('fs');

		for (let i = 0; i < items.length; i++) {
			body = {};
			if (resource === 'document') {
				if (operation === 'download') {
					// ----------------------------------
					//         download
					// ----------------------------------

					requestMethod = 'GET';
					headers['Content-Type'] = 'application/json';
					headers['Accept'] = '*/*';
					headers['Accept-Encoding'] = 'gzip, deflate, br';
					const documentId = this.getNodeParameter('documentId', i) as string;
					endpoint = `/api/resources/documents/${documentId}/content`;
				} else if (operation === 'upload') {
					// ----------------------------------
					//         upload
					// ----------------------------------
					requestMethod = 'POST';
					headers['Content-Type'] = 'multipart-form-data';
					endpoint = '/api/resources/documents';

					if (this.getNodeParameter('binaryData', i) === true) {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						if (items[i].binary === undefined
							//@ts-ignore
							|| items[i].binary[binaryPropertyName] === undefined) {
							throw new Error(`No binary data property "${binaryPropertyName}" does not exists on item!`);
						}
						body.definitionId = this.getNodeParameter('definitionId', i) as string;
						body.parentId = this.getNodeParameter('containerId', i) as string;
						body.name = this.getNodeParameter('documentName', i) as string;
						body.content = {
							//@ts-ignore
							value: Buffer.from(items[i].binary[binaryPropertyName].data, BINARY_ENCODING),
							options: {
								//@ts-ignore
								filename: items[i].binary[binaryPropertyName].fileName,
								//@ts-ignore
								contentType: items[i].binary[binaryPropertyName].mimeType,
							}
						};
						options = {formData: body};
						body = {};

					} else {
						// Is text file
						body = Buffer.from(this.getNodeParameter('fileContent', i) as string, 'utf8');
					}
				} else if (operation === 'release') {
					// ----------------------------------
					//         release
					// ----------------------------------
					requestMethod = 'POST';
					headers['Content-Type'] = 'multipart-form-data';
					const documentId = this.getNodeParameter('documentId', i) as string;
					endpoint = `/api/resources/documents/${documentId}/content`;

					if (this.getNodeParameter('binaryData', i) === true) {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						if (items[i].binary === undefined
							//@ts-ignore
							|| items[i].binary[binaryPropertyName] === undefined) {
							throw new Error(`No binary data property "${binaryPropertyName}" does not exists on item!`);
						}

						body.content = {
							//@ts-ignore
							value: Buffer.from(items[i].binary[binaryPropertyName].data, BINARY_ENCODING),
							options: {
								//@ts-ignore
								filename: items[i].binary[binaryPropertyName].fileName,
								//@ts-ignore
								contentType: items[i].binary[binaryPropertyName].mimeType,
							}
						};
						options = {formData: body};
						body = {};

					} else {
						// Is text file
						body = Buffer.from(this.getNodeParameter('fileContent', i) as string, 'utf8');
					}
				} else if (operation === 'uploadFromAWS') {

					// get file from S3
					const s3URL = this.getNodeParameter('s3url', i) as string;
					const tempDirPath = this.getNodeParameter('tempDirPath', i) as string;
					const timeout = this.getNodeParameter('timeout', i, 0) as number;

					let path : PlatformPath = require('path');
					filePath = path.join(tempDirPath, uuidv1() + '.temp');

					let reqResp = await createTempFile(fs, filePath, s3URL, timeout);
					console.log(reqResp)
					if ('timeout' === reqResp) {
						throw new NodeOperationError(this.getNode(), `Server connection timeout. Temp file creation failed.`);
					} else if ('success' !== reqResp) {
						throw new NodeOperationError(this.getNode(), ` Temp file creation failed. ` + reqResp);
					}
					//         upload

					requestMethod = 'POST';
					headers['Content-Type'] = 'multipart-form-data';
					endpoint = '/api/resources/documents';


					body.parentId = this.getNodeParameter('containerId', i) as string;
					body.definitionId = this.getNodeParameter('definitionId', i) as string;
					let fileName = this.getNodeParameter('documentName', i) as string;
					body.name = fileName.split('.').slice(0, -1).join('.');// filename without extension
					body.content = {
						//@ts-ignore
						value: fs.createReadStream(filePath),
						options: {
							//@ts-ignore
							filename: fileName,
							contentType: 'application/octet-stream',
						}
					};
					options = {formData: body};
					body = {};
				}
			} else if (resource === 'folder') {
				if (operation === 'create') {
					// ----------------------------------
					//         create
					// ----------------------------------

					requestMethod = 'POST';
					headers['Content-Type'] = 'application/json';
					body = {
						name: this.getNodeParameter('name', i) as string,
						parentId: this.getNodeParameter('parentId', i) as string,
						objectType: this.getNodeParameter('objectType', i, 'dotdA12') as string,
					};

					endpoint = '/api/resources/folders';

				} else if (operation === 'list') {

					// ----------------------------------
					//         list
					// ----------------------------------

					requestMethod = 'GET';
					//const folderId = this.getNodeParameter('folderId', 0) as string;
					query = {
						parentId: this.getNodeParameter('folderId', i) as string,
						containersFirst: true
					};
					endpoint = '/api/resources';

				}

			} else if (resource === 'documentversion') {
				if (operation === 'create') {
					// ----------------------------------
					//         create
					// ----------------------------------

					requestMethod = 'POST';
					headers['Content-Type'] = 'application/json';
					body = {
						documentId: this.getNodeParameter('documentId', i) as string,
					};

					endpoint = '/api/resources/documentversions';

				} else if (operation === 'getDocumentVersions') {

					// ----------------------------------
					//         list
					// ----------------------------------

					requestMethod = 'GET';
					headers['Content-Type'] = 'application/json';
					query = {
						documentId: this.getNodeParameter('documentId', i) as string,
					};
					endpoint = '/api/resources/documentversions';
				}
				if (operation === 'getContent') {
					// ----------------------------------
					//         download
					// ----------------------------------

					requestMethod = 'GET';
					headers['Content-Type'] = 'application/json';
					headers['Accept'] = '*/*';
					headers['Accept-Encoding'] = 'gzip, deflate, br';
					const documentId = this.getNodeParameter('documentId', i) as string;
					endpoint = `/api/resources/documentversions/${documentId}/content`;
				}
			} else if (resource === 'file') {
				if (operation === 'create') {
					// ----------------------------------
					//         create
					// ----------------------------------

					requestMethod = 'POST';
					headers['Content-Type'] = 'application/json';
					body = {
						creationState: this.getNodeParameter('fileType', i) as string,
						name: this.getNodeParameter('name', i) as string,
						parentId: this.getNodeParameter('parentId', i) as string,
						objectType: this.getNodeParameter('objectType', i, 'dotdA11') as string,
						homeLocation: this.getNodeParameter('homeLocationId', i) as string,
					};
					endpoint = '/api/resources/files';

				} else if (operation === 'list') {

					// ----------------------------------
					//         list
					// ----------------------------------

					requestMethod = 'GET';
					const fileId = this.getNodeParameter('fileId', 0) as string;
					endpoint = `/api/resources/files/${fileId}/children`;

				} else if (operation === 'getFileParts') {

					// ----------------------------------
					//         get file parts
					// ----------------------------------

					requestMethod = 'GET';
					const fileId = this.getNodeParameter('fileId', 0) as string;
					endpoint = `/api/resources/files/${fileId}/fileparts`;
				}

			} else if (resource === 'workflow') {
				if (operation === 'startWorkflow') {
					// ----------------------------------
					//         start workflow
					// ----------------------------------

					requestMethod = 'POST';
					headers['Content-Type'] = 'application/json';
					headers['Accept'] = 'application/json';
					body = {
						workflowId: this.getNodeParameter('workflowId', i) as string,
						name: this.getNodeParameter('workflowName', i) as string,
						comment: this.getNodeParameter('comment', i) as string,
						ownerId: this.getNodeParameter('ownerId', i) as string,
					};

					endpoint = '/api/resources/workflow/slips';

				}
			} else if (resource === 'catalogue') {
				if (operation === 'getUserCatalogues') {
					// ----------------------------------
					//         get user catalogues
					// ----------------------------------

					requestMethod = 'GET';
					headers['Content-Type'] = 'application/json';
					body = {};
					query = {
						name: this.getNodeParameter('catalogueName', i) as string,
					};
					endpoint = '/api/resources/catalogues';
				} else if (operation === 'getCataloguesByType') {
					// ----------------------------------
					//         get user catalogues by type
					// ----------------------------------

					requestMethod = 'GET';
					headers['Content-Type'] = 'application/json';
					body = {};
					const objectTypeId = this.getNodeParameter('objectTypeId', 0) as string;
					endpoint = `/api/resources/definitions/${objectTypeId}/availablecatalogues`;
				} else if (operation === 'getCatalogueFieldDefinitions') {
					// ----------------------------------
					//         get user catalogues by type
					// ----------------------------------

					requestMethod = 'GET';
					headers['Content-Type'] = 'application/json';
					body = {};
					query = {
						applicableTo: this.getNodeParameter('objectTypeId', i) as string,
					};

					endpoint = `/api/resources/fields`;
				}
			}

			if (['document', 'folder', 'folder', 'workflow', 'catalogue', 'file', 'documentversion'].includes(resource)) {
				if (operation === 'copy') {
					// ----------------------------------
					//       document/folder:  copy
					// ----------------------------------

					requestMethod = 'POST';
					body = {
						source: this.getNodeParameter('sourceId', i) as string,
						target: this.getNodeParameter('targetId', i) as string,
					};

					endpoint = '/api/resources/duplications';

				} else if (operation === 'move') {
					// ----------------------------------
					//       document/folder  move
					// ----------------------------------

					requestMethod = 'PUT';
					headers['Content-Type'] = 'application/json';
					body = {
						parentId: this.getNodeParameter('targetId', i) as string,
					};
					const sourceId = this.getNodeParameter('sourceId', 0) as string;
					endpoint = '/api/resources/' + resource + 's/' + sourceId + '/parent';
				} else if (operation === 'updateComment') {
					// ----------------------------------
					//       document/folder  update comment
					// ----------------------------------

					requestMethod = 'PUT';
					headers['Content-Type'] = 'application/json';
					body = {
						comment: this.getNodeParameter('comment', i) as string,
					};
					const objectId = this.getNodeParameter('sourceId', 0) as string;
					endpoint = '/api/resources/' + resource + 's/' + objectId + '/comment';
				} else if (operation === 'getCatalogues') {
					// ----------------------------------
					//       document/folder  get catalogues
					// ----------------------------------

					requestMethod = 'GET';
					headers['Content-Type'] = 'application/json';
					const objectId = this.getNodeParameter('sourceId', 0) as string;
					endpoint = '/api/resources/' + resource + 's/' + objectId + '/fields';
				} else if (operation === 'updateCatalogues') {
					// ----------------------------------
					//       document/folder  update catalogues
					// ----------------------------------

					requestMethod = 'PUT';
					headers['Content-Type'] = 'application/json';
					const catalogues = this.getNodeParameter('catalogues', 0) as string;
					body = JSON.parse(catalogues);
					const objectId = this.getNodeParameter('sourceId', 0) as string;
					endpoint = '/api/resources/' + resource + 's/' + objectId + '/fields?retainExistingValues=true';
				} else if (operation === 'rename') {
					// ----------------------------------
					//       document/folder  get catalogues
					// ----------------------------------

					requestMethod = 'PUT';
					headers['Content-Type'] = 'application/json';
					body = {
						name: this.getNodeParameter('name', i) as string,
					};
					const objectId = this.getNodeParameter('sourceId', 0) as string;
					endpoint = '/api/resources/' + resource + 's/' + objectId + '/name';
				} else if (operation === 'delete') {
					// ----------------------------------
					//         delete
					// ----------------------------------

					requestMethod = 'DELETE';
					const objectId = this.getNodeParameter('sourceId', 0) as string;
					endpoint = '/api/resources/' + resource + 's/' + objectId;
				} else if (operation === 'getMetadata') {

					// ----------------------------------
					//         getMetadata
					// ----------------------------------

					requestMethod = 'GET';
					const objectId = this.getNodeParameter('sourceId', 0) as string;
					endpoint = '/api/resources/' + resource + 's/' + objectId;

				} else if (operation === 'updateCorporateValue') {
					// ----------------------------------
					//       document/doc version  update CV
					// ----------------------------------

					requestMethod = 'PUT';
					headers['Content-Type'] = 'application/json';
					body = {
						corporateValue: this.getNodeParameter('corporateValue', i) as string,
					};
					const objectId = this.getNodeParameter('sourceId', 0) as string;
					endpoint = '/api/resources/' + resource + 's/' + objectId + '/corporatevalue';
				}

			} else {
				throw new Error(`The resource "${resource}" is not known!`);
			}

			if (resource === 'document' && operation === 'download') {
				// Return the data as a buffer
				options = {encoding: null};
			}

			// @ts-ignore
			// logger.debug('%s %s %o %o %o %o', requestMethod, endpoint, body, options, query, headers);

			let responseData = await nexusApiRequest.call(this, requestMethod, endpoint, body, query, headers, options);

			if (Boolean(filePath)) {
				// if temp file was created delete it
				fs.unlink(filePath, (err: ErrnoException | null) => {
					if (err) {
						console.error(err);
					}
				})
			}
			if (['document', 'documentversion'].includes(resource) && ['download', 'getContent'].includes(operation)) {
				const newItem: INodeExecutionData = {
					json: items[i].json,
					binary: {},
				};

				if (items[i].binary !== undefined) {
					Object.assign(newItem.binary, items[i].binary);
				}

				items[i] = newItem;

				const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i) as string;
				const documentId = this.getNodeParameter('documentId', i) as string;
				items[i].binary![dataPropertyNameDownload] = await this.helpers.prepareBinaryData(Buffer.from(responseData), documentId);


			} else if (['folder', 'file', 'documentversion'].includes(resource) && ['list', 'getFileParts', 'getDocumentVersions'].includes(operation)) {

				const propNames: { [key: string]: string } = {
					'id': 'id',
					'name': 'name',
					'dateCreated': 'dateCreated',
					'dateUpdated': 'dateUpdated',
					'currentVersionNumber': 'version',
					'fileSize': 'contentSize',
					'type': 'type',
					'$etag': 'etag',
					'extension': 'ext',
					'state': 'state',
					'revision': 'revision',
					'versionLabel': 'versionLabel',
					'corporateValue': 'corporateValue',
					'docVersionName': 'docVersionName',
				};

				for (const item of responseData) {
					const newItem: IDataObject = {};

					// Get the props and save them under a proper name
					for (const propName of Object.keys(propNames)) {
						if (item[propName] !== undefined) {
							newItem[propNames[propName]] = item[propName];
						}
					}

					returnData.push(newItem);
				}
			} else {
				returnData.push(responseData as IDataObject);
			}
		}


		if (['document', 'documentversion'].includes(resource) && ['download', 'getContent'].includes(operation)) {
			// For document downloads the documents get attached to the existing items
			return this.prepareOutputData(items);
		} else {
			// For all other ones does the output items get replaced
			return [this.helpers.returnJsonArray(returnData)];
		}

	}
}
