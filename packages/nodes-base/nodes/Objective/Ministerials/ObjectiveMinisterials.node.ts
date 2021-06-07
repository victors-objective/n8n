import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


export class ObjectiveMinisterials implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Objective Ministerials',
		name: 'objectiveMinisterials',
		group: ['transform'],
		version: 1,
		icon: 'file:ministerials.svg',
		description: 'Ministerial Correspondence Process Management',
		defaults: {
			name: 'Objective Ministerials',
			color: '#bd2031',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'My String',
				name: 'myString',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			}
		]
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const items = this.getInputData();

		let item: INodeExecutionData;
		let myString: string;

		// Itterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			myString = this.getNodeParameter('myString', itemIndex, '') as string;
			item = items[itemIndex];

			item.json['myString'] = myString;
		}

		return this.prepareOutputData(items);

	}
}
