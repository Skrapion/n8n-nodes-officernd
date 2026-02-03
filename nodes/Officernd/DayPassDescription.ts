import type { INodeProperties } from 'n8n-workflow';

export const dayPassOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['dayPass'],
      },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a set of day passes',
				description: 'Get a single set of day passes',
				routing: {
					request: {
						method: 'GET',
					},
				},
      },
      {
				name: 'Get Many',
				value: 'getAll',
				action: 'Get sets of day passes',
				description: 'Get many sets of day passes',
				routing: {
					request: {
						method: 'GET',
			      url: '/passes',
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

export const dayPassFields: INodeProperties[] = [
	{
		displayName: 'Passes ID',
		name: 'passesId',
		type: 'string',
    required: true,
		displayOptions: { 
      show: {
        operation: ['get'],
        resource: ['dayPass'],
      } 
    },
    routing: {
      request: {
        url: '=/passes/{{ $value }}'
      },
    },
		default: '',
		description: "The ID of the set of passes to fetch"
  },
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['dayPass'],
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
		description: 'Filter by the company ID of the passes',
  },
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['dayPass'],
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
		description: 'Filter by the member ID of the passes',
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
        resource: ['dayPass'],
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
