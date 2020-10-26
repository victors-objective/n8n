import {INodeProperties} from 'n8n-workflow';

export const commonOperations = [] as INodeProperties[];

export const commonFields = [

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

] as INodeProperties[];
