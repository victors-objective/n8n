import {INodeProperties} from 'n8n-workflow';

export const catalogueOperations = [

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

] as INodeProperties[];

export const catalogueFields = [
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


] as INodeProperties[];


