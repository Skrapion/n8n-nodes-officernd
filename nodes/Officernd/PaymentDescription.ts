import type { INodeProperties } from 'n8n-workflow';

export const paymentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['payment'],
      },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a payment',
				description: 'Get the data of a single payment',
				routing: {
					request: {
						method: 'GET',
					},
				},
      },
      {
				name: 'Get Many',
				value: 'getAll',
				action: 'Get payments',
				description: 'Get the data of many payments',
				routing: {
					request: {
						method: 'GET',
			      url: '/payments',
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
            ],
          },
				},
			},
		],
		default: 'get',
	},
];

export const paymentFields: INodeProperties[] = [
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
    required: true,
		displayOptions: { 
      show: {
        operation: ['get'],
        resource: ['payment'],
      } 
    },
    routing: {
      request: {
        url: '=/payments/{{ $value }}'
      },
    },
		default: '',
		description: "The ID of the payment"
  },
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['payment'],
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
		description: "Filter by member ID of the payment"
  },
  {
    displayName: 'Company ID',
    name: 'companyId',
    type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['payment'],
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
    description: 'Filter by the company ID of the payment',
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
        resource: ['payment'],
      } 
    },
    options: [
      {
        displayName: 'Date Filters',
        name: 'dateFilters',
        type: 'collection',
        placeholder: 'Add Date Filter',
        default: {},
        options: [
          {
            displayName: 'Created After',
            name: 'createdAtGt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'createdAt[$gt]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Created After or On',
            name: 'createdAtGte',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'createdAt[$gte]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Created Before',
            name: 'createdAtLt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'createdAt[$lt]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Created Before or On',
            name: 'createdAtLte',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'createdAt[$lte]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Due After',
            name: 'dueAtGt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'dueDate[$gt]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Due After or On',
            name: 'dueAtGte',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'dueDate[$gte]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Due Before',
            name: 'dueAtLt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'dueDate[$lt]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Due Before or On',
            name: 'dueAtLte',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'dueDate[$lte]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Issued After',
            name: 'issuedAtGt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'date[$gt]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Issued After or On',
            name: 'issuedAtGte',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'date[$gte]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Issued Before',
            name: 'issuedAtLt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'date[$lt]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Issued Before or On',
            name: 'issuedAtLte',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'date[$lte]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Modified After',
            name: 'modifiedAtGt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'modifiedAt[$gt]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Modified After or On',
            name: 'modifiedAtGte',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'modifiedAt[$gte]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Modified Before',
            name: 'modifiedAtLt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'modifiedAt[$lt]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
          {
            displayName: 'Modified Before or On',
            name: 'modifiedAtLte',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'modifiedAt[$lte]',
                value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
              },
            },
          },
        ],
        description: 'Filter by issue/due/created/modified date',
      },
      {
        displayName: 'Document Type',
        name: 'documentType',
        type: 'options',
        default: 'invoice',
        options: [
          {
            name: 'Credit Note',
            value: 'creditNote',
          },
          {
            name: 'Invoice',
            value: 'invoice',
          },
          {
            name: 'Overpayment',
            value: 'overpayment',
          },
          {
            name: 'Payment Charge',
            value: 'paymentCharge',
          },
        ],
        routing: {
          send: {
            type: 'query',
            property: 'documentType',
            value: '={{ $value.length > 0 ? $value.join(",") : undefined }}',
          },
        },
        description: 'Filter by the status of the payment'
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        required: true,
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
      {
        displayName: 'Location Name or ID',
        name: 'locationId',
        type: 'options',
        default: '',
        routing: {
          send: {
            type: 'query',
            property: 'location',
            value: '={{ $value ? $value : undefined }}',
          },
        },
        typeOptions: {
          loadOptions: {
            routing: {
              request: {
                method: 'GET',
                url: '/locations?$select=name,_id',
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
                      name: '={{$responseItem.name}}',
                      value: '={{$responseItem._id}}',
                    },
                  },
                  {
                    type: 'sort',
                    properties: {
                      key: 'name',
                    },
                  },
                ],
              },
            },
          },
        },
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
      },
      {
        displayName: 'Number',
        name: 'number',
        type: 'string',
        default: '',
        routing: {
          send: {
            type: 'query',
            property: 'number',
            value: '={{ $value ? $value : undefined }}',
          },
        },
        description: 'Dilter by the document number for the payment',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        default: [],
        options: [
          {
            name: 'Awaiting Payment',
            value: 'awaiting_payment',
          },
          {
            name: 'Draft',
            value: 'draft',
          },
          {
            name: 'Failed',
            value: 'failed',
          },
          {
            name: 'Paid',
            value: 'paid',
          },
          {
            name: 'Partially Paid',
            value: 'partially_paid',
          },
          {
            name: 'Pending',
            value: 'pending',
          },
          {
            name: 'Refunded',
            value: 'refunded',
          },
          {
            name: 'Voided',
            value: 'voided',
          },
        ],
        routing: {
          send: {
            type: 'query',
            property: 'status[$in]',
            value: '={{ $value.length > 0 ? $value.join(",") : undefined }}',
          },
        },
        description: 'Filter by the status of the payment'
      },
    ],
  },
];
