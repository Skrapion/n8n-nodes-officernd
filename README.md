# n8n-nodes-officernd

This is an n8n community node. It lets you use _OfficeRnD_ in your n8n workflows.

_OfficeRnD_ is a cloud platform for managing coworking spaces, offices, and memberships. This node allows you to fetch members, memberships, plans, fees, and passes, as well as update and check in members.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Triggers](#triggers)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The node supports the following operations:

* Members
  * Get Member
  * Get All Members
  * Update Member
* Memberships
  * Get Membership
  * Get All Memberships
* Plans
  * Get Plan
  * Get All Plans
* Passes
  * Get All Sets of Daypasses
  * Get a Set of Daypasses
* Checkins
  * Check in a member

## Triggers
* Company
  * Created
  * Updated
  * Removed
* Company Payment Details
  * Created
* Removed
* Member
  * Created
  * Updated
* Removed
* Member Payment Details
  * Created
  * Removed
* Invoice
  * Created
  * Updated
  * Removed
* Invoice Charge
  * Created
  * Updated
  * Removed
* Invoice Allocation
  * Created
  * Removed
* Fee
  * Created
  * Updated
  * Removed
* Membership
  * Created
  * Updated
  * Removed
* Booking
  * Created
  * Updated
  * Removed
* Contract
  * Created
  * Updated
  * Removed
* Ticket
  * Created
  * Updated
  * Removed
* Integration
  * Removed
* Pass
  * Created
  * Updated
* Occupancy Slot
  * Created
  * Removed

## Credentials

To use this node, you must authenticate with OfficeRnD via an API token:

Sign in to your OfficeRnD account.

Navigate to Settings->Data & Accessibility->Developer Tools->Applications and add an application.

To use all the features of this node, you'll need the following permissions:

* flex.billing.plans.read
* flex.community.members.read
* flex.community.members.update
* flex.community.checkins.create
* flex.community.memberships.read
* flex.space.locations.read
* flex.space.passes.read
* flex.settings.webhooks.read
* flex.settings.webhooks.create
* flex.settings.webhooks.delete
* flex.settings.customProperties.read

Once created, you can click the cog icon next to the application and choose 'View' to get your Client ID and Client Secret for your n8n credentials.

You'll also need to set your Organization Slug. You can find this in the location bar when logged in to OfficeRnD:

https://app.officernd.com/admin/<YOUR ORG SLUG>

## Compatibility

Tested against n8n 2.4.8 and the OfficeRnD v2 API.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [OfficeRnD API Documentation](https://developer.officernd.com/reference)
