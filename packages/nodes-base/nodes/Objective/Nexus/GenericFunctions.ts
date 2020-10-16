import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';

import {
	OptionsWithUri,
} from 'request';

import {
	IDataObject,
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

	const options: OptionsWithUri = {
		headers,
		method,
		qs: query,
		body,
		uri: endpoint,
		json: true,
		strictSSL:false,
	};

	if (!Object.keys(body).length) {
		delete options.body;
	}

	Object.assign(options, option);

	const authenticationMethod = this.getNodeParameter('authentication', 0) as string;

	try {
		if (authenticationMethod === 'basicAuth') {

			const credentials = this.getCredentials('nexusBasic');

			if (credentials === undefined) {
				throw new Error('No credentials got returned!');
			}

			const base64Credentials = Buffer.from(`${credentials.user}:${credentials.password}`).toString('base64');

			options.headers!['Authorization'] = `Basic ${base64Credentials}`;

			return await this.helpers.request(options);
		} else {
			return await this.helpers.requestOAuth2.call(this, 'informOAuth2Api', options);
		}
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
