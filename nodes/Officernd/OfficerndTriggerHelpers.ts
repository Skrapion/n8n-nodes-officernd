import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { LoggerProxy, NodeApiError } from 'n8n-workflow';

import { createHmac, timingSafeEqual } from 'crypto';

export async function officerndApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: IDataObject | IDataObject[] = {},
	qs: IDataObject = {},
	option: IDataObject = {},
): Promise<IDataObject[]> {
	const options: IHttpRequestOptions = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'User-Agent': 'n8n',
		},
		method,
		qs,
		body,
		url: '',
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	try {
		const credentialType = 'officerndOAuth2Api';
    const credentials = await this.getCredentials(credentialType);

    const baseUrl = `https://app.officernd.com/api/v2/organizations/${credentials.orgSlug}`;
    options.url = `${baseUrl}${endpoint}`;

    LoggerProxy.info(`Url: ${options.url}`);
    LoggerProxy.info('Body: ' + JSON.stringify(options.body));
    LoggerProxy.info("Method: " + options.method);
    LoggerProxy.info("qs: " + JSON.stringify(options.qs));

		const result = await this.helpers.httpRequestWithAuthentication.call(this, credentialType, options);
    
    LoggerProxy.info("Result: " + JSON.stringify(result));

    return result;
	} catch (error) {
    LoggerProxy.info("Error: " + JSON.stringify(error));
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Verifies the OfficeRnD webhook signature using HMAC-SHA256.
 *
 * GitHub sends a signature in the `X-Hub-Signature-256` header in the format:
 * `sha256=<HMAC hex digest>`
 *
 * This function computes the expected signature using the stored webhook secret
 * and compares it with the provided signature using a constant-time comparison.
 *
 * @returns true if signature is valid or no secret is configured, false otherwise
 */
export function verifySignature(this: IWebhookFunctions): boolean {
	// Get the secret from workflow static data (set during webhook creation)
	const webhookData = this.getWorkflowStaticData('node');
	const webhookSecret = webhookData.webhookSecret as string | undefined;

	// If no secret is configured, skip verification (backwards compatibility)
	if (!webhookSecret) {
		return true;
	}

	const req = this.getRequestObject();

	// Get the signature from GitHub's header
	const signature = req.header('x-hub-signature-256');
	if (!signature) {
		return false;
	}

	// Validate signature format (must start with "sha256=")
	if (!signature.startsWith('sha256=')) {
		return false;
	}

	// Extract just the hex digest part
	const providedSignature = signature.substring(7);

	try {
		// Get the raw request body
		if (!req.rawBody) {
			return false;
		}

		// Compute HMAC-SHA256 of the raw body using our secret
		const hmac = createHmac('sha256', webhookSecret);

		if (Buffer.isBuffer(req.rawBody)) {
			hmac.update(req.rawBody);
		} else {
			const rawBodyString =
				typeof req.rawBody === 'string' ? req.rawBody : JSON.stringify(req.rawBody);
			hmac.update(rawBodyString);
		}

		const computedSignature = hmac.digest('hex');

		const computedBuffer = Buffer.from(computedSignature, 'utf8');
		const providedBuffer = Buffer.from(providedSignature, 'utf8');

		// Buffers must be same length for timingSafeEqual
		if (computedBuffer.length !== providedBuffer.length) {
			return false;
		}

		return timingSafeEqual(computedBuffer, providedBuffer);
	} catch {
		return false;
	}
}
