import type { INodePropertyOptions } from 'n8n-workflow';

export const eventOptions: INodePropertyOptions[] = [
  {
    name: 'Company Created',
    value: 'company.created',
    description: 'Occurs when a company is created',
  },
  {
    name: 'Company Updated',
    value: 'company.updated',
    description: 'Occurs when a company is updated',
  },
  {
    name: 'Company Removed',
    value: 'company.removed',
    description: 'Occurs when a company is removed',
  },
  {
    name: 'Company Payment Details Created',
    value: 'company.paymentdetails.created',
    description: 'Occurs when payment details are created for a company',
  },
  {
    name: 'Company Payment Details Removed',
    value: 'company.paymentdetails.removed',
    description: 'Occurs when payment details are removed for a company',
  },
  {
    name: 'Member Created',
    value: 'member.created',
    description: 'Occurs when a member is created',
  },
  {
    name: 'Member Updated',
    value: 'member.updated',
    description: 'Occurs when a member is updated',
  },
  {
    name: 'Member Removed',
    value: 'member.removed',
    description: 'Occurs when a member is removed',
  },
  {
    name: 'Member Payment Details Created',
    value: 'member.paymentdetails.created',
    description: 'Occurs when payment details are created for a member',
  },
  {
    name: 'Member Payment Details Removed',
    value: 'member.paymentdetails.removed',
    description: 'Occurs when payment details are removed for a member',
  },
  {
    name: 'Invoice Created',
    value: 'invoice.created',
    description: 'Occurs when an invoice, credit note, or overpayment is created',
  },
  {
    name: 'Invoice Updated',
    value: 'invoice.updated',
    description: 'Occurs when an invoice, credit note, or overpayment is updated',
  },
  {
    name: 'Invoice Removed',
    value: 'invoice.removed',
    description: 'Occurs when an invoice, credit note, or overpayment is removed',
  },
  {
    name: 'Invoice Charge Created',
    value: 'invoice.charge.created',
    description: 'Occurs when an invoice received a payment',
  },
  {
    name: 'Invoice Charge Updated',
    value: 'invoice.charge.updated',
    description: 'Occurs when an invoice payment status is updated',
  },
  {
    name: 'Invoice Charge Removed',
    value: 'invoice.charge.removed',
    description: 'Occurs when an invoice payment is manually removed',
  },
  {
    name: 'Invoice Allocation Created',
    value: 'invoice.allocation.created',
    description: 'Occurs when an invoice is allocated a credit',
  },
  {
    name: 'Invoice Allocation Removed',
    value: 'invoice.allocation.removed',
    description: 'Occurs when an invoice allocation is manually removed',
  },
  {
    name: 'Fee Created',
    value: 'fee.created',
    description: 'Occurs when a fee is created',
  },
  {
    name: 'Fee Updated',
    value: 'fee.updated',
    description: 'Occurs when a fee is updated',
  },
  {
    name: 'Fee Removed',
    value: 'fee.removed',
    description: 'Occurs when a fee is removed',
  },
  {
    name: 'Membership Created',
    value: 'membership.created',
    description: 'Occurs when a membership is created',
  },
  {
    name: 'Membership Updated',
    value: 'membership.updated',
    description: 'Occurs when a membership is updated',
  },
  {
    name: 'Membership Removed',
    value: 'membership.removed',
    description: 'Occurs when a membership is removed',
  },
  {
    name: 'Booking Created',
    value: 'booking.created',
    description: 'Occurs when a booking is created',
  },
  {
    name: 'Booking Updated',
    value: 'booking.updated',
    description: 'Occurs when a booking is updated',
  },
  {
    name: 'Booking Removed',
    value: 'booking.removed',
    description: 'Occurs when a booking is removed',
  },
  {
    name: 'Contract Created',
    value: 'contract.created',
    description: 'Occurs when a contract is created',
  },
  {
    name: 'Contract Updated',
    value: 'contract.updated',
    description: 'Occurs when a contract is updated',
  },
  {
    name: 'Contract Removed',
    value: 'contract.removed',
    description: 'Occurs when a contract is removed',
  },
  {
    name: 'Ticket Created',
    value: 'ticket.created',
    description: 'Occurs when an issue is created',
  },
  {
    name: 'Ticket Updated',
    value: 'ticket.updated',
    description: 'Occurs when an issue is updated',
  },
  {
    name: 'Ticket Removed',
    value: 'ticket.removed',
    description: 'Occurs when an issue is removed',
  },
  {
    name: 'Integration Removed',
    value: 'integration.removed',
    description: 'Occurs when an integration is disconnected from the OfficeRnD organization',
  },
  {
    name: 'Pass Created',
    value: 'pass.created',
    description: 'Occurs when a day pass is created for a company/member',
  },
  {
    name: 'Pass Updated',
    value: 'pass.updated',
    description: 'Occurs when a day pass is updated for a company/member',
  },
  {
    name: 'Occupancy Slot Created',
    value: 'occupancyslot.created',
    description: 'Occurs when a booking is created to show its occurrences',
  },
  {
    name: 'Occupancy Slot Removed',
    value: 'occupancyslot.removed',
    description: 'Occurs when a booking is removed to show its occurrences',
  },
];
