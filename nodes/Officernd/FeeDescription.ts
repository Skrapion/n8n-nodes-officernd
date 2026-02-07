import type { INodeProperties } from 'n8n-workflow';

export const feeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['fee'],
      },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a fee',
				description: 'Get the data of a single fee',
				routing: {
					request: {
						method: 'GET',
					},
				},
      },
      {
				name: 'Get Many',
				value: 'getAll',
				action: 'Get fees',
				description: 'Get the data of many fees',
				routing: {
					request: {
						method: 'GET',
			      url: '/fees',
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

export const feeFields: INodeProperties[] = [
	{
		displayName: 'Fee ID',
		name: 'feeId',
		type: 'string',
    required: true,
		displayOptions: { 
      show: {
        operation: ['get'],
        resource: ['fee'],
      } 
    },
    routing: {
      request: {
        url: '=/fees/{{ $value }}'
      },
    },
		default: '',
		description: "The ID of the fee"
  },
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['fee'],
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
		description: "Filter by member ID of the fee"
  },
  {
    displayName: 'Company ID',
    name: 'companyId',
    type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['fee'],
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
    description: 'Filter by the company ID of the fee',
  },
  {
    displayName: 'Plan ID',
    name: 'planId',
    type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['fee'],
      } 
    },
    routing: {
      send: {
        type: 'query',
        property: 'plan',
        value: '={{ $value ? $value : undefined }}',
      },
    },
    default: '',
    description: 'Filter by the plan ID of the fee',
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
        resource: ['fee'],
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
            displayName: 'Issued After',
            name: 'issuedAtGt',
            type: 'dateTime',
            default: '',
            description: 'If no timezone is specified, the workflow timezone will be used',
            routing: {
              send: {
                type: 'query',
                property: 'issueDate[$gt]',
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
                property: 'issueDate[$gte]',
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
                property: 'issueDate[$lt]',
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
                property: 'issueDate[$lte]',
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
        description: 'Filter by issue/modified date',
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
    ],
  },
];
