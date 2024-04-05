import { describe, it, expect } from 'vitest';

import factory from '../index';

import Stripe from 'stripe';

const {
    createWebhook,
    createEvent
} = factory({
    stripe: new Stripe(''),
    webhookSecret: 'sk_webhook',
})

describe('Stripe create webhook tests', () => {
    it('Should create the webhook handler', () => {
        const handler = createWebhook({
            events: [
                {
                    type: 'account.updated',
                    handler: async (event) => {
                        console.log(event);
                    }
                }
            ]
        });

        expect(handler).toBeTypeOf('function');
    });

    it('Should correctly type the customer.created event', () => {
        const handler = createEvent({
            type: 'customer.created',
            handler: async (event) => {

            }
        });

        expect(handler.type).toBe('customer.created');
    });
})