import {BINARY_ENCODING, IExecuteFunctions} from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import {
	nexusApiRequest
} from './GenericFunctions';

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
				name: 'nexusBasic',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'basicAuth',
						],
					},
				},
			}
		],
		properties: [
			{
				displayName: 'Server',
				name: 'serverUrl',
				type: 'string',
				default: 'https://server.com:0000',
				required: true,
				placeholder: 'schema://server_name:port_number',
				description: 'Full server root url',
			},
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
						name: 'OAuth2',
						value: 'oAuth2',
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
			//DOCUMENT
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'document',
						],
					},
				},
				options: [
					{
						name: 'Copy',
						value: 'copy',
						description: 'Copy a document',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a document',
					},
					{
						name: 'Download',
						value: 'download',
						description: 'Download a document',
					},
					{
						name: 'Move',
						value: 'move',
						description: 'Move a document',
					},
					{
						name: 'Upload',
						value: 'upload',
						description: 'Upload a document',
					},
					{
						name: 'Get metadata',
						value: 'getMetadata',
						description: 'Get document metadata',
					},
					{
						name: 'Update comment',
						value: 'updateComment',
						description: 'Update document description',
					},
					{
						name: 'Get catalogues',
						value: 'getCatalogues',
						description: 'Get document catalogues',
					},
					{
						name: 'Update catalogues',
						value: 'updateCatalogues',
						description: 'Update document catalogue fields',
					},
					{
						name: 'Rename',
						value: 'rename',
						description: 'Update document name',
					},
					{
						name: 'Update Corporate Value',
						value: 'updateCorporateValue',
						description: 'Update Corporate Value',
					},
					{
						name: 'Release',
						value: 'release',
						description: 'Update Corporate Value',
					},
				],
				default: 'upload',
				description: 'The operation to perform.',
			},

			//DOCUMENT VERSION

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'documentversion',
						],
					},
				},
				options: [
					{
						name: 'Get document versions',
						value: 'getDocumentVersions',
						description: 'Get document versions',
					},
					{
						name: 'Create Document Version',
						value: 'create',
						description: 'Create Document Version',
					},
					{
						name: 'Get Content',
						value: 'getContent',
						description: 'Get Document Version Content',
					},
					{
						name: 'Update Corporate Value',
						value: 'updateCorporateValue',
						description: 'Move a document',
					},

				],
				default: 'upload',
				description: 'The operation to perform.',
			},
			//FOLDER
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'folder',
						],
					},
				},
				options: [
					{
						name: 'Copy',
						value: 'copy',
						description: 'Copy a folder',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a folder',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a folder',
					},
					{
						name: 'List',
						value: 'list',
						description: 'Return the documents and folders in a given folder',
					},
					{
						name: 'Move',
						value: 'move',
						description: 'Move a folder',
					},
					{
						name: 'Get metadata',
						value: 'getMetadata',
						description: 'Get folder metadata',
					},
					{
						name: 'Update comment',
						value: 'updateComment',
						description: 'Update folder description',
					},
					{
						name: 'Get catalogues',
						value: 'getCatalogues',
						description: 'Get folder catalogues',
					},
					{
						name: 'Update catalogues',
						value: 'updateCatalogues',
						description: 'Update folder catalogue fields',
					},
					{
						name: 'Rename',
						value: 'rename',
						description: 'Update folder name',
					},
				],
				default: 'create',
				description: 'The operation to perform.',
			},
			//WORKFLOW
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'workflow',
						],
					},
				},
				options: [
					{
						name: 'Start workflow',
						value: 'startWorkflow',
						description: 'Creates a new slip.',
					},

				],
				default: 'startWorkflow',
				description: 'The operation to perform.',
			},
			//CATALOGUE
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'catalogue',
						],
					},
				},
				options: [
					{
						name: 'Get all user catalogues',
						value: 'getUserCatalogues',
						description: 'Get all user catalogues',
					},
					{
						name: 'Get user catalogues by type',
						value: 'getCataloguesByType',
						description: 'Get user catalogues by type',
					},
					{
						name: 'Get field definition',
						value: 'getCatalogueFieldDefinitions',
						description: 'Get field definition',
					},


				],
				default: 'getUserCatalogues',
				description: 'The operation to perform.',
			},
			//FILE
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'file',
						],
					},
				},
				options: [

					{
						name: 'Create',
						value: 'create',
						description: 'Create a file',
					},

					{
						name: 'List',
						value: 'list',
						description: 'Return the documents in a given file',
					},
					{
						name: 'Move',
						value: 'move',
						description: 'Move a file',
					},
					{
						name: 'Get metadata',
						value: 'getMetadata',
						description: 'Get file metadata',
					},
					{
						name: 'Update comment',
						value: 'updateComment',
						description: 'Update file description',
					},
					{
						name: 'Get catalogues',
						value: 'getCatalogues',
						description: 'Get file catalogues',
					},
					{
						name: 'Update catalogues',
						value: 'updateCatalogues',
						description: 'Update file catalogue fields',
					},
					{
						name: 'Rename',
						value: 'rename',
						description: 'Update file name',
					},
					{
						name: 'Get file parts',
						value: 'getFileParts',
						description: 'Get file parts',
					},
				],
				default: 'create',
				description: 'The operation to perform.',
			},

			// ----------------------------------
			//         document
			// ----------------------------------
			// ----------------------------------
			//         document:download
			// ----------------------------------
			{
				displayName: 'Document id',
				name: 'documentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'download'
						],
						resource: [
							'document',
						],
					},
				},
				placeholder: 'A101',
				description: 'The document id to download.',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				default: 'data',
				displayOptions: {
					show: {
						operation: [
							'download'
						],
						resource: [
							'document',
						],
					},
				},
				description: 'Name of the binary property to which to<br />write the data of the read file.',

			},

			// ----------------------------------
			//         document:release
			// ----------------------------------
			{
				displayName: 'Document id',
				name: 'documentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'release'
						],
						resource: [
							'document',
						],
					},
				},
				placeholder: 'A383',
				description: 'Document id which to release.',
			},

			// ----------------------------------
			//         document:upload
			// ----------------------------------

			{
				displayName: 'Container id',
				name: 'containerId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'upload'
						],
						resource: [
							'document',
						],
					},
				},
				placeholder: 'fA0',
				description: 'Folder id where file get uploaded.',
			},
			{
				displayName: 'Binary Data',
				name: 'binaryData',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: [
							'upload',
							'release'
						],
						resource: [
							'document',
						],
					},
				},
				description: 'If the data to upload should be taken from binary field.',
			},
			{
				displayName: 'File Content',
				name: 'fileContent',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'upload',
							'release'
						],
						resource: [
							'document',
						],
						binaryData: [
							false
						],
					},

				},
				placeholder: '',
				description: 'The text content of the file to upload.',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'upload',
							'release'
						],
						resource: [
							'document',
						],
						binaryData: [
							true
						],
					},

				},
				placeholder: '',
				description: 'Name of the binary property which contains<br />the data for the file to be uploaded.',
			},
			{
				displayName: 'Document name',
				name: 'documentName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'upload'
						],
						resource: [
							'document',
						],
					},
				},
				placeholder: 'New document',
				description: 'Text to set as a document name.',
			},

			// ----------------------------------
			//         document/folder:move, copy, delete etc
			// ----------------------------------
			{
				displayName: 'Object Id',
				name: 'sourceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'move',
							'copy',
							'updateComment',
							'getMetadata',
							'getCatalogues',
							'rename',
							'updateCatalogues',
							'delete',
							'updateCorporateValue',
						],
						resource: [
							'document',
							'folder',
						],
					},
				},
				placeholder: 'A106',
				description: 'Id of document or folder to move.',
			},
			{
				displayName: 'Object Id',
				name: 'sourceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'move',
							'updateComment',
							'getMetadata',
							'getCatalogues',
							'rename',
							'updateCatalogues',
						],
						resource: [
							'file'
						],
					},
				},
				placeholder: 'A106',
				description: 'Id of document or folder to move.',
			},
			{
				displayName: 'New Parent Id',
				name: 'targetId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'move',
							'copy'
						],
						resource: [
							'document',
							'folder',
							'file'
						],
					},
				},
				placeholder: 'fA0',
				description: 'The new parent id of document or folder.',
			},
			// ----------------------------------
			//         document/folder:update comment
			// ----------------------------------
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'updateComment'
						],
						resource: [
							'document',
							'folder',
							'file'
						],
					},
				},
				placeholder: 'New comment',
				description: 'Text to set as a comment on object.',
			},

			// ----------------------------------
			//         document/version:update CV
			// ----------------------------------
			{
				displayName: 'Document Version Id',
				name: 'sourceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'updateCorporateValue',
						],
						resource: [
							'documentversion'
						],
					},
				},
				placeholder: 'vA106',
				description: 'Id of the document version to update.',
			},
			{
				displayName: 'Corporate Value',
				name: 'corporateValue',
				type: 'boolean',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'updateCorporateValue'
						],
						resource: [
							'document',
							'documentversion',
						],
					},
				},
				placeholder: '',
				description: 'New corporate value',
			},

			// ----------------------------------
			//         document/folder:update name
			// ----------------------------------
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'rename'
						],
						resource: [
							'document',
							'folder',
							'file',
						],
					},
				},
				placeholder: 'New name',
				description: 'Text to set as a new name on object.',
			},
			// ----------------------------------
			//         document/folder:update catalogue
			// ----------------------------------
			{
				displayName: 'Catalogues fields json',
				name: 'catalogues',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'updateCatalogues'
						],
						resource: [
							'document',
							'folder',
							'file',
						],
					},
				},
				placeholder: '[json]',
				description: 'New values for catalogue fields',
			},

			// ----------------------------------
			//         folder
			// ----------------------------------

			// ----------------------------------
			//         folder:create
			// ----------------------------------
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create'
						],
						resource: [
							'folder',
						],
					},
				},
				placeholder: 'New Folder',
				description: 'New folder name',
			},
			{
				displayName: 'Parent Id',
				name: 'parentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create'
						],
						resource: [
							'folder',
						],
					},
				},
				placeholder: 'fA0',
				description: 'The folder to create. The parent folder has to exist.',
			},
			{
				displayName: 'Folder Object Type',
				name: 'objectType',
				type: 'string',
				default: 'dotdA12',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create'
						],
						resource: [
							'folder',
						],
					},
				},
				placeholder: 'dotdA12',
				description: 'The folder to create. The parent folder has to exist.',
			},

			// ----------------------------------
			//         folder:list
			// ----------------------------------

			{
				displayName: 'Folder Id',
				name: 'folderId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'list',
						],
						resource: [
							'folder',
						],
					},
				},
				placeholder: 'fA0',
				description: 'The folder of which to list the content.',
			},
			// ----------------------------------
			//         workflow: create slip
			// ----------------------------------

			{
				displayName: 'Workflow Id',
				name: 'workflowId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'startWorkflow'
						],
						resource: [
							'workflow',
						],
					},
				},
				placeholder: 'dwflA411',
				description: 'Workflow id',
			},
			{
				displayName: 'Name',
				name: 'workflowName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						operation: [
							'startWorkflow'
						],
						resource: [
							'workflow',
						],
					},
				},
				placeholder: 'Slip name',
				description: 'Slip name',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						operation: [
							'startWorkflow'
						],
						resource: [
							'workflow',
						],
					},
				},
				placeholder: 'Comment',
				description: 'Comment',
			},
			{
				displayName: 'Owner Id',
				name: 'ownerId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						operation: [
							'startWorkflow'
						],
						resource: [
							'workflow',
						],
					},
				},
				placeholder: 'uA1 ',
				description: 'Owner',
			},
			// ----------------------------------
			//         Catalogue: get all user catalogues
			// ----------------------------------

			{
				displayName: 'Name filter',
				name: 'catalogueName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						operation: [
							'getUserCatalogues'
						],
						resource: [
							'catalogue',
						],
					},
				},
				placeholder: 'Name filter',
				description: 'Workflow id',
			},
			{
				displayName: 'Object type',
				name: 'objectTypeId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'getCataloguesByType',
							'getCatalogueFieldDefinitions'
						],
						resource: [
							'catalogue',
						],
					},
				},
				placeholder: 'dotdA9',
				description: 'Type id',
			},


			// ----------------------------------
			//         file
			// ----------------------------------

			// ----------------------------------
			//         file:create
			// ----------------------------------
			{
				displayName: 'Type',
				name: 'fileType',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create'
						],
						resource: [
							'file',
						],
					},
				},
				options: [
					{
						name: 'Physical File',
						value: 'PHYSICAL',
						description: 'Create physical file',
					},
				],
				default: 'PHYSICAL',
				placeholder: 'New File',
				description: 'New file name',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create'
						],
						resource: [
							'file',
						],
					},
				},
				placeholder: 'New File',
				description: 'New file name',
			},
			{
				displayName: 'Parent Id',
				name: 'parentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create'
						],
						resource: [
							'file',
						],
					},
				},
				placeholder: 'fA0',
				description: 'The folder to create. The parent folder has to exist.',
			},
			{
				displayName: 'Home Location Id',
				name: 'homeLocationId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create'
						],
						resource: [
							'file',
						],
					},
				},
				placeholder: 'rA1',
				description: 'File repository.',
			},
			{
				displayName: 'File Type',
				name: 'objectType',
				type: 'string',
				default: 'dotdA11',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create'
						],
						resource: [
							'file',
						],
					},
				},
				placeholder: 'dotdA11',
				description: 'The file type to create.',
			},

			// ----------------------------------
			//         file:list, get file parts
			// ----------------------------------

			{
				displayName: 'File Id',
				name: 'fileId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'list',
							'getFileParts',
						],
						resource: [
							'file',
						],
					},
				},
				placeholder: 'qA1',
				description: 'The file of which to list the content.',
			},


			// ----------------------------------
			//         document version
			// ----------------------------------


			// ----------------------------------
			//         document version:list, create
			// ----------------------------------

			{
				displayName: 'Document Id',
				name: 'documentId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'getDocumentVersions',
							'create',


						],
						resource: [
							'documentversion',
						],
					},
				},
				placeholder: 'A347',
				description: 'The document of which to list the versions.',
			},
// ----------------------------------
			//         document version: get content
			// ----------------------------------

			{
				displayName: 'Document version Id',
				name: 'documentId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'getContent',
						],
						resource: [
							'documentversion',
						],
					},
				},
				placeholder: 'vA347',
				description: 'The version of document from which to get the content.',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				default: 'data',
				displayOptions: {
					show: {
						operation: [
							'getContent'
						],
						resource: [
							'documentversion',
						],
					},
				},
				description: 'Name of the binary property to which to<br />write the data of the read file.',
			},
		]
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const serverUrl = this.getNodeParameter('serverUrl', 0) as string;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let endpoint = '';
		let requestMethod = '';
		let body: IDataObject | Buffer;
		let options;
		let query: IDataObject = {};

		const headers: IDataObject = {};

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
						//TODO
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
						//TODO
						body = Buffer.from(this.getNodeParameter('fileContent', i) as string, 'utf8');
					}
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

			let responseData = await nexusApiRequest.call(this, requestMethod, serverUrl + endpoint, body, query, headers, options);

			if (['document', 'documentversion'].includes(resource) && ['download', 'getContent'].includes(operation)) {
				const newItem: INodeExecutionData = {
					json: items[i].json,
					binary: {},
				};
				//TODO
				if (items[i].binary !== undefined) {
					// Create a shallow copy of the binary data so that the old
					// data references which do not get changed still stay behind
					// but the incoming data does not get changed.
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
