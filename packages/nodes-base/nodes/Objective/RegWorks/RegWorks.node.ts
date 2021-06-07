import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { domainPreRequestLogic, listDomainTypes, DOMAIN_PROPERTIES } from './DomainLogic';
import { regWorksApiRequest } from './GenericFunctions';
import { searchPreRequestLogic, getSavedSearches, SEARCH_PROPERTIES } from './SearchLogic';
import { workflowPreRequestLogic, getWorkflowOptions, WORKFLOW_PROPERTIES } from './WorkflowLogic';

const GENERIC_PROPERTIES: INodeProperties[] = [
	{
		displayName: 'Server',
		name: 'serverUrl',
		type: 'string',
		default: 'https://server.com:0000/root',
		required: true,
		placeholder: 'schema://server_name:port_number',
		description: 'Full server root url',
	},
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [ // TODO add API keys and such
			{
				name: 'Basic Auth',
				value: 'basicAuth'
			},
			{
				name: 'API Key',
				value: 'regWorksApiKey'
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
				name: 'Domain',
				value: 'domain',
			},
			{
				name: 'Workflow Action',
				value: 'workflow',
			},
			{
				name: 'Saved Search',
				value: 'search',
			}
		],
		default: 'document',
		description: 'The resource to operate on.',
	}
];

export class RegWorks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Objective RegWorks',
		name: 'regWorks',
		icon: 'file:RegWorks.png',
		group: ['transform'],
		version: 1,
		description: 'Regulation, compliance & enforcement management',
		defaults: {
			name: 'RegWorks',
			color: '#9ab559',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			...GENERIC_PROPERTIES,
			...DOMAIN_PROPERTIES,
			...SEARCH_PROPERTIES,
			...WORKFLOW_PROPERTIES
		],
		credentials: [
			{
				name: 'httpBasicAuth',
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
				name: 'regWorksApiKey',
				required: true,
				displayOptions: {
					show: {
						authentication: [
							'regWorksApiKey'
						],
					},
				},
			}
		]
	};

	methods = {
		loadOptions: {
			getSavedSearches,
			listDomainTypes,
			getWorkflowOptions
		}
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const serverUrl = this.getNodeParameter('serverUrl', 0) as string;
		const resource = this.getNodeParameter('resource', 0) as "search" | "domain" | "workflow";

		let url = "";
		let method = "GET";
		let query = {};
		let body = {};
		let headers = {};
		let options = {};

		// Pre-request
		switch (resource) {
			case "search":
				({ url, method, query, body, headers, options } = searchPreRequestLogic(this));
				break;
			case "domain":
				({ url, method, query, body, headers, options } = domainPreRequestLogic(this));
				break;
			case "workflow":
				({ url, method, query, body, headers, options } = workflowPreRequestLogic(this));
				break;
		}

		console.log("url", url);
		console.log("method", method);
		console.log("query", query);
		console.log("body", body);
		console.log("headers", headers);
		console.log("options", options);

		// Request
		const response = await regWorksApiRequest.call(this, method, serverUrl + url, body, query, headers, options);

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
