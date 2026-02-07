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
			type: 'string',
      required: true,
			default: 
        'flex.billing.payments.read ' +
        'flex.billing.plans.read ' +
        'flex.community.members.read ' +
        'flex.community.members.update ' +
        'flex.community.checkins.create ' +
        'flex.community.memberships.read ' +
        'flex.space.locations.read ' +
        'flex.space.passes.read ' +
        'flex.settings.webhooks.read ' +
        'flex.settings.webhooks.create ' +
        'flex.settings.webhooks.delete ' +
        'flex.settings.customProperties.read',
      description: "Make sure that all the scopes listed here are also listed in your permission in your application settings. The default is the scopes required for all the features in this node. You can choose fewer nodes if you don't need all the features, or more scopes if you're using the HTTP Request operation to use endpoints that are not yet exposed by this node.",
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
      required: true,
      description: 'The organization slug; you can find this in the URL of your OfficeRnD login: https://app.officernd.com/admin/<YOUR ORG SLUG>',
      default: '',
    },
	];
}
