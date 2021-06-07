import { IExecuteFunctions, ILoadOptionsFunctions, INodeProperties, INodePropertyOptions } from "n8n-workflow";
import { regWorksApiRequest } from "./GenericFunctions";

export const SEARCH_PROPERTIES: INodeProperties[] = [
    {
		displayOptions: {
			show: {
				resource: [
					'search',
				],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getSavedSearches',
		},
		displayName: 'Search ID',
		name: 'searchId',
		type: 'options',
		default: '',
		description: 'The saved search ID.',
    },
    {
		displayOptions: {
			show: {
				resource: [
					'search',
				],
			},
		},
		displayName: 'Search Term',
		name: 'searchTerm',
		type: 'string',
		default: 'Port Botany',
		description: 'An optional search term.',
	}	,
    {
		displayOptions: {
			show: {
				resource: [
					'search',
				],
			},
		},
		displayName: 'Page Size',
		name: 'searchPageSize',
		type: 'number',
		default: '1',
		description: 'Number of records to include in each page.',
	}	
];

export function searchPreRequestLogic(node: IExecuteFunctions): { url: string, method: string, query: any, body: any, headers: any, options: any } {
    const searchId = node.getNodeParameter('searchId', 0) as string;
    const searchTerm = node.getNodeParameter('searchTerm', 0) as string;
    const pageSize = node.getNodeParameter('searchPageSize', 0) as number;

    const body = {
        searchTerms: searchTerm,
        pageOffset: 0,
        pageSize: pageSize
        // filtersValueMap
    };

    return {
        url: "/api/v1/search/" + encodeURIComponent(searchId),
        method: "POST",
        query: {},
        body: body,
        headers: {},
        options: {}
    }
}


export async  function getSavedSearches(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const options: INodePropertyOptions[] = [];

	const serverUrl = this.getNodeParameter('serverUrl', 0) as string;
	const response = await regWorksApiRequest.call(this, "GET", serverUrl + "/api/v1/searches", {}, {pageSize:100}, {});

	for(let result of response.results){
		options.push({
			name: result.name,
			value: result.id,
			description: "Saved search " + result.id,
		});
	}

	return options;
}