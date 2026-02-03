import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { memberOperations, memberFields } from './MemberDescription';
import { membershipOperations, membershipFields } from './MembershipDescription';
import { dayPassOperations, dayPassFields } from './DayPassDescription';
import { planOperations, planFields } from './PlanDescription';

export class Officernd implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OfficeRnD',
		name: 'officernd',
		icon: { light: 'file:officernd.svg', dark: 'file:officernd.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Officernd API',
		defaults: {
			name: 'OfficeRnD',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'officerndOAuth2Api', required: true }],
		requestDefaults: {
			baseURL: '={{ "https://app.officernd.com/api/v2/organizations/" + $credentials.orgSlug }}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Member',
						value: 'member',
					},
					{
						name: 'Membership',
						value: 'membership',
					},
					{
						name: 'Plan',
						value: 'plan',
					},
					{
						name: 'Day Pass',
						value: 'dayPass',
					},
				],
				default: 'member',
			},
			...memberOperations,
      ...memberFields,
			...membershipOperations,
      ...membershipFields,
      ...dayPassOperations,
      ...dayPassFields,
      ...planOperations,
      ...planFields,
		],
	};
}
