import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';


export class RegWorksApiKey implements ICredentialType {
	name = 'regWorksApiKey';
	displayName = 'RegWorks API Key';
	documentationUrl = 'httpRequest';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
