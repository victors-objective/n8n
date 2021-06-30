import {IExecuteFunctions} from 'n8n-core';
import {
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {workspacesPreRequestLogic, WORKSPACES_PROPERTIES} from './Workspaces';
import {connectApiRequest} from './GenericFunctions';
import {usersPreRequestLogic, USERS_PROPERTIES} from "./Users";
import {assetsPreRequestLogic, ASSETS_PROPERTIES} from "./Assets";

const GENERIC_PROPERTIES: INodeProperties[] = [
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
				name: 'API Key',
				value: 'connectApiKey'
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
				name: 'Workspaces',
				value: 'workspaces',
			},
			{
				name: 'Users',
				value: 'users',
			},
			{
				name: 'Assets',
				value: 'assets',
			}
		],
		default: 'workspaces',
		description: 'The resource to operate on.',
	}
];

export class ObjectiveConnect implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Objective Connect',
		name: 'objectiveConnect',
		icon: 'file:connect.svg',
		group: ['transform'],
		version: 1,
		description: 'Objective Content Sharing Platform',
		defaults: {
			name: 'Objective Connect',
			color: '#6abf70',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			...GENERIC_PROPERTIES,
			...WORKSPACES_PROPERTIES,
			...USERS_PROPERTIES,
			...ASSETS_PROPERTIES
		],
		credentials: [
			{
				name: 'objectiveBasic',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'basicAuth',
						],
					},
				},
			},
			{
				name: 'connectApiKey',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'connectApiKey'
						],
					},
				},
			}
		]
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as "workspaces" | "users" | "assets";

		let url = "";
		let method = "GET";
		let query = {};
		let body = {};
		let headers = {};
		let options = {};

		// Pre-request
		switch (resource) {
			case "workspaces":
				({url, method, query, body, headers, options} = workspacesPreRequestLogic(this));
				break;
			case "users":
				({url, method, query, body, headers, options} = usersPreRequestLogic(this));
				break;
			case "assets":
				({url, method, query, body, headers, options} = assetsPreRequestLogic(this));
				break;
		}

		console.log("url", url);
		console.log("method", method);
		console.log("query", query);
		console.log("body", body);
		console.log("headers", headers);
		console.log("options", options);

		// Request
		const response = await connectApiRequest.call(this, method, url, body, query, headers, options);

		// Post-request logic
		// TODO
		const items = [
			{
				json: response
			}
		]

		return this.prepareOutputData(items);

	}
}
