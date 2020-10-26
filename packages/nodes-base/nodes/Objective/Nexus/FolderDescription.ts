import {INodeProperties} from 'n8n-workflow';

export const folderOperations = [
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
] as INodeProperties[];

export const folderFields = [


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
] as INodeProperties[];
