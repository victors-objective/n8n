import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';


export class ObjectiveNexusDirectGrant implements ICredentialType {
	name = 'nexusDirectGrant';
	displayName = 'Direct Access Grant';
	properties = [
		{
			displayName: 'User',
			name: 'user',
			type: 'string' as NodePropertyTypes,
			default: '',

		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string' as NodePropertyTypes,
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Client Id',
			name: 'clientId',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'Server',
			name: 'serverUrl',
			type: 'string' as NodePropertyTypes,
			default: '',
			required: true,
			placeholder: 'https://server.url',
			description: 'Full server root url',
		},
	];
}
