import { Stripe } from 'stripe';

import {
    createWebhook,
    createEvent
} from './webhook';

import {
    createEndpointFactory
} from './endpoint'

type Params = {
    stripe: Stripe,
    webhookSecret: string;
};

export default ({
    stripe,
    webhookSecret
}: Params) => {
    const {
        createEndpoint
    } = createEndpointFactory({
        stripe: stripe
    });

    return {
        createEndpoint: createEndpoint,
        createEvent: createEvent,
        createWebhook: createWebhook(stripe, webhookSecret),
    }
};