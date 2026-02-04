import type { 
  ICredentialType, 
  INodeProperties,
  Icon,
} from 'n8n-workflow';

export class OfficerndOAuth2Api implements ICredentialType {
	name = 'officerndOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'OfficeRnD OAuth2 API';

	documentationUrl = 'https://github.com/Skrapion/n8n-nodes-officernd';

  icon: Icon = {
    light: 'file:../nodes/Officernd/officernd.svg',
    dark: 'file:../nodes/Officernd/officernd.dark.svg',
  };
  
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'clientCredentials',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://identity.officernd.com/oauth/token',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'flex.community.members.read flex.community.members.update flex.community.checkins.create flex.community.memberships.read flex.space.locations.read flex.space.passes.read flex.billing.plans.read flex.settings.webhooks.read flex.settings.webhooks.create flex.settings.webhooks.delete flex.settings.customProperties.read',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
    {
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
    {
      displayName: 'Organization Slug',
      name: 'orgSlug',
      type: 'string',
      description: 'The organization slug; you can find this in the URL of your OfficeRnD login: https://app.officernd.com/admin/<YOUR ORG SLUG>',
      default: '',
    },
	];
}
