import { Stripe } from 'stripe';

type Payload =
    | string
    | Buffer;

type VerifyParameters = {
    payload: Payload;
    signature: string;
    secret: string,
    stripe: Stripe;
};

export const verifyWebhookSignature = async ({
    payload,
    signature,
    secret,
    stripe,
}: VerifyParameters): Promise<Stripe.Event> => {
    const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        secret
    ) as Stripe.Event;

    return event;
};