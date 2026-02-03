import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { LoggerProxy } from 'n8n-workflow';

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
        LoggerProxy.info("checkExists");
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					// No webhook id is set so no webhook can exist
          LoggerProxy.info("No webhook ID");
					return false;
				}

        try {
				  await officerndApiRequest.call(this, 'GET', `/webhooks/${webhookData.webhookId}`, {});
        } catch {
          LoggerProxy.info("Webhook does not exist");
          return false;
        }

        LoggerProxy.info("Webhook exists");
        return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
        LoggerProxy.info("create");
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

				webhookData.webhookId = responseData._id as string;
				webhookData.webhookEvents = responseData.eventTypes as string[];
				webhookData.webhookSecret = responseData.secret as string;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
        LoggerProxy.info("delete");
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
    LoggerProxy.info("webhook request: " + this.getRequestObject().getAllHeaders())

		const bodyData = this.getBodyData();

		const returnData: IDataObject[] = [];

		returnData.push(bodyData);

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
