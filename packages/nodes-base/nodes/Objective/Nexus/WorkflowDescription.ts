import {INodeProperties} from 'n8n-workflow';

export const workflowOperations = [

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

] as INodeProperties[];

export const workflowFields = [
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


] as INodeProperties[];
