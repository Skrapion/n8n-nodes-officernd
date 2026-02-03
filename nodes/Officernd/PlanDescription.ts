import type { INodeProperties } from 'n8n-workflow';

export const planOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['plan'],
      },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a plan',
				description: 'Get a single plan',
				routing: {
					request: {
						method: 'GET',
					},
				},
      },
      {
				name: 'Get Many',
				value: 'getAll',
				action: 'Get plans',
				description: 'Get many plans',
				routing: {
					request: {
						method: 'GET',
			      url: '/plans',
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

export const planFields: INodeProperties[] = [
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
    required: true,
		displayOptions: { 
      show: {
        operation: ['get'],
        resource: ['plan'],
      } 
    },
    routing: {
      request: {
        url: '=/plans/{{ $value }}'
      },
    },
		default: '',
		description: "The ID of the plan to fetch"
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
        resource: ['plan'],
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
