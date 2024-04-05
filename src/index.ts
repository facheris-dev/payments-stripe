import { Stripe } from 'stripe';

import {
    createWebhook,
    createEvent
} from './webhook';

type Params = {
    webhookSecret: string,
    apiKey: string,
    config?: Stripe.StripeConfig
}

export default ({
    webhookSecret,
    apiKey,
    config
}: Params) => {
    const stripe =
        new Stripe(
            apiKey,
            config
        );

    return {
        createEvent: createEvent,
        createWebhook: createWebhook(stripe, webhookSecret)
    }
};