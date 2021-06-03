import {INodeProperties} from 'n8n-workflow';

export const documentOperations = [

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
				name: 'Upload From AWS S3',
				value: 'uploadFromAWS',
				description: 'Upload a document using pre-signed AWS S3 URL',
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

] as INodeProperties[];

export const documentFields = [

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
					'upload',
					'uploadFromAWS'
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
					'upload',
					'uploadFromAWS'
				],
				resource: [
					'document',
				],
			},
		},
		placeholder: 'New document',
		description: 'Text to set as a document name.',
	},
	{
		displayName: 'Object Type Id',
		name: 'definitionId',
		type: 'string',
		default: 'dotdA9',
		required: false,
		displayOptions: {
			show: {
				operation: [
					'upload',
					'uploadFromAWS'
				],
				resource: [
					'document',
				],
			},
		},
		placeholder: 'Object Type for a new document',
		description: 'Object Type Id',
	},



// Upload FROM AWS S3


	{
		displayName: 'URL',
		name: 's3url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'uploadFromAWS'
				],
				resource: [
					'document',
				],
			},
		},
		placeholder: 'https://pre-signed.aws.url',
		description: 'URL with the document content.',
	},
	{
		displayName: 'Temporary directory path',
		name: 'tempDirPath',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'uploadFromAWS'
				],
				resource: [
					'document',
				],
			},
		},
		placeholder: '/data/example/temp',
		description: 'Full path to temporary directory',
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		type: 'number',
		default: '',
		required: false,
		displayOptions: {
			show: {
				operation: [
					'uploadFromAWS'
				],
				resource: [
					'document',
				],
			},
		},
		placeholder: 'Timeout in milliseconds.',
		description: 'Timeout in milliseconds. 0 - no timeout.',
	},

] as INodeProperties[];
