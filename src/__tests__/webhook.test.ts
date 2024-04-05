import { describe, it, expect } from 'vitest';

import factory from '../index';

const {
    createWebhook,
    createEvent
} = factory({
    webhookSecret: 'sk_webhook',
    apiKey: 'sk_test'
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