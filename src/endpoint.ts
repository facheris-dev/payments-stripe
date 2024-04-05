import Stripe from "stripe";

type Event =
    Stripe.WebhookEndpointCreateParams.EnabledEvent

type CreditEvent = Extract<Event,
    'checkout.session.completed'
>;

type SubscriptionEvent = Extract<Event,
    | 'customer.updated'
    | 'customer.created'
>;

type StripeCreateParams = Omit<Stripe.WebhookEndpointCreateParams,
    | 'url'
    | 'enabled_events'
>;

type BaseParams = {
    additionalParams?: StripeCreateParams,
    url: string,
};

type CreateParams = ({
    type?: 'Subscription',
    events: SubscriptionEvent[]
} | {
    type: 'Credit',
    events: CreditEvent[]
} | {
    type: 'Custom',
    events: Event[]
}) & BaseParams;

type CreateEnpoint =
    (args: CreateParams) => Promise<Stripe.Response<Stripe.WebhookEndpoint>>;

type EndpointFactoryParams = {
    stripe: Stripe;
};

type EndpointFactory =
    (args: EndpointFactoryParams) => {
        createEndpoint: CreateEnpoint;
    };

export const createEndpointFactory: EndpointFactory = ({ stripe }) => {
    return {
        createEndpoint: async ({
            additionalParams,
            events,
            url,
            type = 'Subscription',
        }: CreateParams) => {
            const result =
                await stripe.webhookEndpoints.create({
                    url: url,
                    enabled_events: events,
                    ...additionalParams
                });

            return result;
        }
    };
};