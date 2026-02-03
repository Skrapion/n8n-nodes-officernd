import type { INodeProperties } from 'n8n-workflow';

export const checkinOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
        resource: ['checkin'],
      },
		},
		options: [
			{
				name: 'Check In a Member',
				value: 'checkin',
				action: 'Check in a member',
				routing: {
					request: {
						method: 'POST',
					},
				},
      },
		],
		default: 'checkin',
	},
];

export const checkinFields: INodeProperties[] = [
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
    required: true,
		displayOptions: { 
      show: {
        operation: ['checkin'],
        resource: ['checkin'],
      } 
    },
    routing: {
      request: {
        url: '=/checkins/{{ $value }}',
      },
    },
		default: '',
		description: "The ID of the member"
  },
  {
    displayName: 'Location Name or ID',
    name: 'locationId',
    type: 'options',
    required: true,
    default: '',
		displayOptions: { 
      show: {
        operation: ['checkin'],
        resource: ['checkin'],
      } 
    },
    routing: {
      send: {
        type: 'body',
        property: 'location',
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
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    default: '',
    required: true,
		displayOptions: { 
      show: {
        operation: ['checkin'],
        resource: ['checkin'],
      } 
    },
    routing: {
      send: {
        type: 'body',
        property: 'start',
        value: '={{ DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() }}',
      },
    },
    description: "The start date of the check-in. If no timezone is specified, the current workflow's timezone is used.",
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    default: '',
		displayOptions: { 
      show: {
        operation: ['checkin'],
        resource: ['checkin'],
      } 
    },
    routing: {
      send: {
        type: 'body',
        property: 'end',
        value: '={{ $value ? DateTime.fromISO($value).setZone($workflow.timezone, { keepLocalTime: true }).toISO() : undefined }}',
      },
    },
    description: "The end date of the check-in. If no timezone is specified, the current workflow's timezone is used.",
  },
];
