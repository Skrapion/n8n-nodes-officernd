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
import { NodeApiError } from 'n8n-workflow';
// import { LoggerProxy } from 'n8n-workflow';

import { createHmac, timingSafeEqual } from 'crypto';

export async function officerndApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: IDataObject | IDataObject[] = {},
	qs: IDataObject = {},
	option: IDataObject = {},
): Promise<IDataObject> {
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

    /*
    LoggerProxy.info(`Url: ${options.url}`);
    LoggerProxy.info('Body: ' + JSON.stringify(options.body));
    LoggerProxy.info("Method: " + options.method);
    LoggerProxy.info("qs: " + JSON.stringify(options.qs));
    */

		const result = await this.helpers.httpRequestWithAuthentication.call(this, credentialType, options);
    
    //LoggerProxy.info("Result: " + JSON.stringify(result));

    return result;
	} catch (error) {
    //LoggerProxy.info("Error: " + JSON.stringify(error));
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Verifies the OfficeRnD webhook signature using HMAC-SHA256.
 *
 * OfficeRnD sends a signature in the `officernd-signature` header in the format:
 * `t=<timestamp>,v1=<HMAC hex digest>`
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

	// If no secret is configured, fail
	if (!webhookSecret) {
		return false;
	}

	const req = this.getRequestObject();

	// Get the signature from OfficeRnD's header
	const signature = req.header('officernd-signature');
	if (!signature) {
		return false;
	}

	// Validate signature format
  const parts = Object.fromEntries(
    signature.split(',').map((kv: string) => {
      const [k, v] = kv.split('=');
      return [k.trim(), v.trim()];
    }),
  );

	if (!parts.t || !parts.v1) {
		return false;
	}

  // Timestamp tolerance check
  const now = Math.floor(Date.now() / 1000);
  const t = Number(parts.t);
  if (!Number.isFinite(t) || Math.abs(now - t) > 300) {
    return false;
  }

	try {
		// Get the raw request body
		if (!req.rawBody) {
			return false;
		}

	  const signedPayload = `${parts.t}.${req.rawBody}`


    const hmac = createHmac('sha256', webhookSecret);
    hmac.update(signedPayload, 'utf8');
    const computedSignature = hmac.digest('hex');

    const computedBuffer = Buffer.from(computedSignature, 'utf8');
    const providedBuffer = Buffer.from(parts.v1, 'utf8');

    // Buffers must be same length for timingSafeEqual
		if (computedBuffer.length !== providedBuffer.length) {
			return false;
		}

		return timingSafeEqual(computedBuffer, providedBuffer);
	} catch {
		return false;
	}
}
