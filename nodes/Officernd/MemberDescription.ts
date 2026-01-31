import type { INodeProperties } from 'n8n-workflow';

export const memberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['member'],
      },
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a member',
				description: 'Get the data of a single member',
				routing: {
					request: {
						method: 'GET',
					},
				},
			},
		],
		default: 'get',
	},
];

export const memberFields: INodeProperties[] = [
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
    required: true,
		displayOptions: { 
      show: {
        operation: ['get'],
        resource: ['member'],
      } 
    },
    routing: {
		  request: {
			  url: '=/members/{{$value}}',
		  },
	  },
		default: '',
		description: "The member's ID to retrieve",
	},
];
