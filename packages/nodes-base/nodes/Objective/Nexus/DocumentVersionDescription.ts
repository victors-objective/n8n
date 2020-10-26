import {INodeProperties} from 'n8n-workflow';

export const documentVersionOperations = [


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

] as INodeProperties[];

export const documentVersionFields = [
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

] as INodeProperties[];
