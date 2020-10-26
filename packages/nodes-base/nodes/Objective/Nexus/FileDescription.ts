import {INodeProperties} from 'n8n-workflow';

export const fileOperations = [


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
] as INodeProperties[];

export const fileFields = [

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

] as INodeProperties[];
