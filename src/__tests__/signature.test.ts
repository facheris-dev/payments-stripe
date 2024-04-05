import { Stripe } from 'stripe';
import { describe, it, expect } from 'vitest';
import { verifyWebhookSignature } from '../signature';

const PAYLOAD_OBJECT = {
    id: 'evt_test_webhook',
    object: 'event',
};

describe('Stripe webhook header signatures', () => {
    const stripe = new Stripe('sk_test');

    let payload: string | Buffer = '';
    let validHeader: string = '';
    let invalidHeader: string = ''

    payload =
        JSON.stringify(PAYLOAD_OBJECT, null, 2);

    validHeader = Stripe.webhooks.generateTestHeaderString({
        payload: payload,
        secret: 'valid_header',
    });

    invalidHeader = Stripe.webhooks.generateTestHeaderString({
        payload: payload,
        secret: 'invalid_header',
    });

    it('Should fail to validate the signature', async () => {
        expect(
            verifyWebhookSignature({
                payload: payload,
                signature: invalidHeader,
                stripe: stripe,
                secret: 'valid_header'
            })
        ).rejects.toThrow();
    });

    it('Should pass to validate the signature', async () => {
        const event = await verifyWebhookSignature({
            payload: payload,
            signature: validHeader,
            stripe: stripe,
            secret: 'valid_header'
        });

        expect(event.id).to.equal(PAYLOAD_OBJECT.id);
    });
});