import type { INodeProperties } from 'n8n-workflow';

export const membershipOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['membership'],
      },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a membership',
				description: 'Get the data of a single membership',
				routing: {
					request: {
						method: 'GET',
					},
				},
      },
      {
				name: 'Get Many',
				value: 'getAll',
				action: 'Get memberships',
				description: 'Get the data of many memberships',
				routing: {
					request: {
						method: 'GET',
			      url: '/memberships',
					},
          send: {
            paginate: true,
          },
          operations: {
            pagination: {
              type: 'generic',
              properties: {
                continue: `={{ ($parameter.additionalOptions.limit == undefined || $response.body.rangeEnd < $parameter.additionalOptions.limit) && !!$response.body?.cursorNext }}`,
                request: {
                  qs: '={{ Object.assign({}, $request.qs, { "$cursorNext": $response.body?.cursorNext }) }}' as unknown as Record<string, string>,
                },
              },
            },
          },
          output: {
            postReceive: [
              {
                type: 'rootProperty',
                properties: {
                  property: 'results',
                },
              },
              {
                type: 'setKeyValue',

                properties: {
                  properties: '={{ $responseItem.properties ? $responseItem.properties : undefined }}',
                  _id: '={{ $responseItem._id }}',
                  name: '={{ $responseItem.name }}',
                  isPersonal: '={{ $responseItem.isPersonal }}',
                  status: '={{ $responseItem.status }}',
                  calculatedStatus: '={{ $responseItem.calculatedStatus }}',
                  type: '={{ $responseItem.type }}',
                  location: '={{ $responseItem.location }}',
                  plan: '={{ $responseItem.plan }}',
                  company: '={{ $responseItem.company }}',
                  member: '={{ $responseItem.member }}',
                  // Remove the timestamps from these. The API always returns T00:00:00Z,
                  // regardless of your timezone settings. OfficeRnD has confirmed that
                  // you should ignore the timestamp portion.
                  startDate: '={{ $responseItem.startDate.slice(0,10) }}',
                  endDate: '={{ $responseItem.endDate.slice(0,10) }}',
                  intervalCount: '={{ $responseItem.intervalCount }}',
                  isLocked: '={{ $responseItem.isLocked }}',
                  price: '={{ $responseItem.price }}',
                  deposit: '={{ $responseItem.deposit }}',
                  discount: '={{ $responseItem.discount }}',
                  discountAmount: '={{ $responseItem.discountAmount }}',
                  calculatedDiscountAmount: '={{ $responseItem.calculatedDiscountAmount }}',
                  discountedPrice: '={{ $responseItem.discountedPrice }}',
                  contract: '={{ $responseItem.contract }}',
                  source: '={{ $responseItem.source }}',
                  // For consistency, specify createdAt/modifiedAt in workflow time.
                  createdAt: '={{ DateTime.fromISO($responseItem.createdAt).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
                  createdBy: '={{ $responseItem.createdBy }}',
                  modifiedAt: '={{ DateTime.fromISO($responseItem.modifiedAt).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
                  modifiedBy: '={{ $responseItem.modifiedBy }}',
                },
              },
            ],
          },
				},
			},
		],
		default: 'get',
	},
];

export const membershipFields: INodeProperties[] = [
	{
		displayName: 'Membership ID',
		name: 'membershipId',
		type: 'string',
    required: true,
		displayOptions: { 
      show: {
        operation: ['get'],
        resource: ['membership'],
      } 
    },
    routing: {
      request: {
        url: '=/membership/{{ $value }}'
      },
    },
		default: '',
		description: "The ID of the membership to fetch"
  },
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['membership'],
      } 
    },
    routing: {
      send: {
        type: 'query',
        property: 'company',
        value: '={{ $value ? $value : undefined }}',
      },
    },
		default: '',
		description: 'Filter by the company ID of the membership',
  },
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['membership'],
      } 
    },
    routing: {
      send: {
        type: 'query',
        property: 'member',
        value: '={{ $value ? $value : undefined }}',
      },
    },
		default: '',
		description: 'Filter by the member ID of the membership',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['membership'],
      } 
    },
    options: [
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: {
          minValue: 1,
          step: 1,
        },
        description: "Max number of results to return",
        routing: {
          output: {
            maxResults: '={{ $value }}',
          },
        },
      },
    ],
  },
];
