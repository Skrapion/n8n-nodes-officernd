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
      {
				name: 'Get Many',
				value: 'getAll',
				action: 'Get members',
				description: 'Get the data of many members',
				routing: {
					request: {
						method: 'GET',
			      url: '/members',
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
			{
				name: 'Update',
				value: 'update',
				action: 'Update a member',
				description: 'Update a member',
				routing: {
					request: {
						method: 'PUT',
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
        operation: ['get', 'update'],
        resource: ['member'],
      } 
    },
    routing: {
      request: {
        url: '=/members/{{ $value }}'
      },
    },
		default: '',
		description: "The ID of the member"
  },
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['member'],
      } 
    },
    routing: {
      send: {
        type: 'query',
        property: 'name',
        value: '={{ $value ? $value : undefined }}',
      },
    },
		default: '',
		description: "Filter by the name of the member. This returns a result only if the name is an exact match.",
  },
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
    placeholder: 'name@email.com',
		displayOptions: { 
      show: {
        operation: ['getAll'],
        resource: ['member'],
      } 
    },
    routing: {
      send: {
        type: 'query',
        property: 'email',
        value: '={{ $value ? $value : undefined }}',
      },
    },
		default: '',
		description: "Filter by the email of the member. This returns a result only if the email is an exact match.",
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
        resource: ['member'],
      } 
    },
    options: [
      {
        displayName: 'Company ID',
        name: 'companyId',
        type: 'string',
        routing: {
          send: {
            type: 'query',
            property: 'company',
            value: '={{ $value ? $value : undefined }}',
          },
        },
        default: '',
        description: 'Filter by the company ID of the member',
      },
      {
        displayName: 'Custom Properties',
        name: 'properties',
        type: 'fixedCollection',
        placeholder: 'Add Property',
        default: [],
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: 'Property',
            name: 'property',
            values: [
              {
                displayName: 'Property Name or ID',
                name: 'propertyId',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                type: 'options',
                default: '',
                required: true,
                typeOptions: {
                  loadOptions: {
                    routing: {
                      request: {
                        method: 'GET',
                        url: '/custom-properties?$select=title,key,targets',
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
                            type: 'filter',
                            properties: {
                              pass: '={{ $responseItem.targets.includes("member") }}',
                            },
                          },
                          {
                            type: 'setKeyValue',
                            properties: {
                              name: '={{$responseItem.title}}',
                              value: '={{$responseItem.key}}',
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
              },
              {
                displayName: 'Property Value',
                name: 'propertyValue',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
        routing: {
          send: {
            type: 'query',
            property: 'properties',
            value: `={{ $value.property.reduce((acc, cur) => { acc[cur.propertyId] = cur.propertyValue; return acc; }, {}) }}`,
          },
        },
        description: 'Filter by custom properties',
      },
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
        description: 'Filter by created/modified date',
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
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        default: [],
        options: [
          {
            name: 'Active',
            value: 'active',
          },
          {
            name: 'Contact',
            value: 'contact',
          },
          {
            name: 'Drop-In',
            value: 'drop-in',
          },
          {
            name: 'Former',
            value: 'former',
          },
          {
            name: 'Lead',
            value: 'lead',
          },
          {
            name: 'Not Approved',
            value: 'not_approved',
          },
          {
            name: 'Pending',
            value: 'pending',
          },
        ],
        routing: {
          send: {
            type: 'query',
            property: 'status[$in]',
            value: '={{ $value.length > 0 ? $value.join(",") : undefined }}',
          },
        },
        description: 'Filter by the status of the member'
      },
    ],
  },
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: { 
      show: {
        operation: ['update'],
        resource: ['member'],
      } 
    },
    routing: {
      send: {
        type: 'body',
        property: 'name',
        value: '={{ $value ? $value : undefined }}',
      },
    },
		default: '',
		description: "The new name of the member",
  },
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
    placeholder: 'name@email.com',
		displayOptions: { 
      show: {
        operation: ['update'],
        resource: ['member'],
      } 
    },
    routing: {
      send: {
        type: 'body',
        property: 'email',
        value: '={{ $value ? $value : undefined }}',
      },
    },
		default: '',
		description: 'The new email of the member',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
		displayOptions: { 
      show: {
        operation: ['update'],
        resource: ['member'],
      } 
    },
    options: [
      {
        displayName: 'Address',
        name: 'address',
        type: 'collection',
        placeholder: 'Add Address Item',
        default: {},
        // eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
        options: [
          {
            displayName: 'Country',
            name: 'country',
            type: 'string',
            default: '',
          },
          {
            displayName: 'State',
            name: 'state',
            type: 'string',
            default: '',
          },
          {
            displayName: 'City',
            name: 'city',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Street',
            name: 'street',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Zip Code',
            name: 'zip',
            type: 'string',
            default: '',
          },
        ],
        routing: {
          send: {
            type: 'body',
            property: 'address',
            value: '={{ $value }}',
          },
        },
      },
      {
        displayName: 'Billing Details',
        name: 'billingDetails',
        type: 'collection',
        placeholder: 'Add Billing Detail',
        default: {},
        // eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
        options: [
          {
            displayName: 'Billing Name',
            name: 'billingName',
            type: 'string',
            default: '',
          },
          {
            displayName: 'VAT Number',
            name: 'vatNumber',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Registration Number',
            name: 'registrationNumber',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Payment Method',
            name: 'paymentMethod',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Billing Address',
            name: 'billingAddress',
            type: 'collection',
            placeholder: 'Add Address Item',
            default: {},
            // eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
            options: [
              {
                displayName: 'Country',
                name: 'country',
                type: 'string',
                default: '',
              },
              {
                displayName: 'State',
                name: 'state',
                type: 'string',
                default: '',
              },
              {
                displayName: 'City',
                name: 'city',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Street',
                name: 'street',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Zip Code',
                name: 'zip',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
        routing: {
          send: {
            type: 'body',
            property: 'billingDetails',
            value: '={{ $value }}',
          },
        },
      },
      {
        displayName: 'Custom Properties',
        name: 'properties',
        type: 'fixedCollection',
        placeholder: 'Add Property',
        default: [],
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            displayName: 'Property',
            name: 'property',
            values: [
              {
                displayName: 'Property Name or ID',
                name: 'propertyId',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                type: 'options',
                default: '',
                required: true,
                typeOptions: {
                  loadOptions: {
                    routing: {
                      request: {
                        method: 'GET',
                        url: '/custom-properties?$select=title,key,targets',
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
                            type: 'filter',
                            properties: {
                              pass: '={{ $responseItem.targets.includes("member") }}',
                            },
                          },
                          {
                            type: 'setKeyValue',
                            properties: {
                              name: '={{$responseItem.title}}',
                              value: '={{$responseItem.key}}',
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
              },
              {
                displayName: 'Property Value',
                name: 'propertyValue',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
        routing: {
          send: {
            type: 'body',
            property: 'properties',
            value: `={{ $value.property.reduce((acc, cur) => { acc[cur.propertyId] = cur.propertyValue; return acc; }, {}) }}`,
          },
        },
        description: 'Custom properties to update'
      },
      {
        displayName: 'Is Billing Person?',
        name: 'isBillingPerson',
        type: 'boolean',
        default: false,
        routing: {
          send: {
            type: 'body',
            property: 'isBillingPerson',
            value: '={{ $value }}',
          },
        },
        description: 'Whether this member is a billing person',
      },
      {
        displayName: 'Is Contact Person?',
        name: 'isContactPerson',
        type: 'boolean',
        default: false,
        routing: {
          send: {
            type: 'body',
            property: 'isContactPerson',
            value: '={{ $value }}',
          },
        },
        description: 'Whether this member is a contact person',
      },
      {
        displayName: 'Portal Privacy',
        name: 'portalPrivacy',
        type: 'collection',
        placeholder: 'Add Portal Privacy Info',
        default: {},
        options: [
          {
            displayName: 'Is Visible?',
            name: 'isVisible',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Show Contact Details?',
            name: 'showContactDetails',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Show Social Profiles?',
            name: 'showSocialProfiles',
            type: 'boolean',
            default: false,
          },
        ],
        routing: {
          send: {
            type: 'body',
            property: 'portalPrivacy',
            value: '={{ $value }}',
          },
        },
      },
      {
        displayName: 'Social Profiles',
        name: 'socialProfiles',
        type: 'collection',
        placeholder: 'Add Social Profile',
        default: {},
        options: [
          {
            displayName: 'Linked In',
            name: 'linkedin',
            type: 'string',
            default: '',
            placeholder: 'https://linkedin.com/in/johndoe',
          },
          {
            displayName: 'Twitter',
            name: 'twitter',
            type: 'string',
            default: '',
            placeholder: 'https://twitter.com/johndoe',
          },
          {
            displayName: 'Instagram',
            name: 'instagram',
            type: 'string',
            default: '',
            placeholder: 'https://instagram.com/johndoe',
          },
          {
            displayName: 'Facebook',
            name: 'facebook',
            type: 'string',
            default: '',
            placeholder: 'https://facebook.com/johndoe',
          },
        ],
        routing: {
          send: {
            type: 'body',
            property: 'socialProfiles',
            value: '={{ $value }}',
          },
        },
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        routing: {
          send: {
            type: 'body',
            property: 'startDate',
            value: '={{ $value }}',
          },
        },
        default: '',
        description: 'The new starting date of the member',
      },
    ],
  },
];
