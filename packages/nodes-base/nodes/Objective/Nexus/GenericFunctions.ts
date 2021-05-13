import {
	IExecuteFunctions, IExecuteSingleFunctions,
	IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions,
} from 'n8n-core';

import {
	OptionsWithUri,
} from 'request';

import {
	IDataObject, NodeOperationError,
} from 'n8n-workflow';

/**
 * Make an API request to Objective Inform
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function nexusApiRequest(this: IHookFunctions | IExecuteFunctions, method: string, endpoint: string, body: object, query: IDataObject = {}, headers?: object, option: IDataObject = {}): Promise<any> {// tslint:disable-line:no-any
	const credentials = this.getCredentials('nexusDirectGrant');
	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}
	const options: OptionsWithUri = {
		headers,
		method,
		qs: query,
		body,
		uri: credentials.serverUrl + endpoint,
		json: true,
		strictSSL:false,
	};

	if (!Object.keys(body).length) {
		delete options.body;
	}

	Object.assign(options, option);

	try {

		const tokenInfo = await getAccessToken.call(this);

		options.headers!['Authorization'] = `Bearer ${tokenInfo.access_token}`;

		return await this.helpers.request(options);
	} catch (error) {
		if (error.statusCode === 401) {
			// Return a clear error
			throw new Error('The Objective Inform credentials are not valid!');
		}

		if (error.error && error.error.error_summary) {
			// Try to return the error prettier
			throw new Error(
				`Objective Inform error response [${error.statusCode}]: ${error.error.error_summary}`
			);
		}

		// If that data does not exist for some reason return the actual error
		throw error;
	}
}

async function getAccessToken(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IWebhookFunctions): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('nexusDirectGrant');
	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	const headerForm = Object.assign({},{ 'Content-Type': 'application/x-www-form-urlencoded' });
	const options: OptionsWithUri = {
		headers: headerForm,
		method: 'POST',
		form: {
			grant_type: 'password',
			client_id:`${credentials.clientId}`,
			username:`${credentials.user}`,
			password:`${credentials.password}`
		},
		uri: `${credentials.serverUrl}/auth/realms/ecm/protocol/openid-connect/token`,
		json: true,
		strictSSL:false,
	};
	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), error);
	}
}
