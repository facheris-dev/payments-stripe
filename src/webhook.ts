import { Stripe } from 'stripe';

import { verifyWebhookSignature } from "./signature";

type EventType =
    Stripe.Event.Type;

type Handler<T extends Stripe.Event.Type> =
    (event: Extract<Stripe.Event, { type: T }>) => Promise<void>;

type Event<T extends EventType> = {
    type: T;
    handler: Handler<T>;
};

type CreateWebhook =
    <T extends EventType>(args: {
        events: Event<T>[];
    }) => (req: Request) => Promise<Response>;

export const createEvent = <T extends EventType>({
    type,
    handler
}: Event<T>) => {
    return {
        type,
        handler
    };
};

export const createWebhook: (stripe: Stripe, secret: string) => CreateWebhook = (stripe: Stripe, secret: string) => {
    return ({ events }) => {
        return async (req: Request) => {
            const signature =
                req.headers.get('stripe-signature') as string;

            const payload =
                await req.text();

            try {
                const event =
                    await verifyWebhookSignature({
                        payload: payload,
                        signature: signature,
                        stripe: stripe,
                        secret: secret
                    });

                const handler =
                    events.find(e => e.type === event.type);

                if (handler) {
                    //@ts-ignore
                    await handler.handler(event);
                }
            } catch (error: unknown) {
                if (error instanceof Stripe.errors.StripeError) {
                    return new Response(error.message, {
                        status: error.statusCode
                    });
                }

                return new Response('Unkown error', {
                    status: 400
                });
            }

            return new Response('', {
                status: 200
            });
        };
    }
}