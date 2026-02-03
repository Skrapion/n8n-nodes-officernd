import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { eventOptions } from './EventOptions';
import { officerndApiRequest } from './OfficerndTriggerHelpers';

export class OfficerndTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OfficeRnD Trigger',
		name: 'officerndTrigger',
		icon: { light: 'file:officernd.svg', dark: 'file:officernd.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle:
			'={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when OfficeRnD events occur',
		defaults: {
			name: 'OfficeRnD Trigger',
		},
		usableAsTool: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'officerndOAuth2Api', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [...eventOptions],
				required: true,
				default: [],
				description: 'The events to listen to',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
					return false;
				}

        try {
				  await officerndApiRequest.call(this, 'GET', `/webhooks/${webhookData.webhookId}`, {});
        } catch {
          return false;
        }

        return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (webhookUrl.includes('//localhost')) {
					throw new NodeOperationError(
						this.getNode(),
						'The Webhook can not work on "localhost". Please setup n8n on a custom domain.',
					);
				}

				const events = this.getNodeParameter('events', []);

				const body = {
          url: webhookUrl,
          eventTypes: events,
          description: 'n8n Trigger (automatically created by n8n workflow)',
        };

				const webhookData = this.getWorkflowStaticData('node');

				const responseData = await officerndApiRequest.call(this, 'POST', '/webhooks', body);

				webhookData.webhookId = responseData[0]._id as string;
				webhookData.webhookEvents = responseData[0].eventTypes as string[];
				webhookData.webhookSecret = responseData[0].secret as string;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					await officerndApiRequest.call(this, 'DELETE', `/webhooks/${webhookData.webhookId}`, {});

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
					delete webhookData.webhookSecret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    //verifySignature.call(this);

		const bodyData = this.getBodyData();

		const returnData: IDataObject[] = [];

		returnData.push(bodyData);

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
