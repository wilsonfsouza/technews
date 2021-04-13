import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function streamBuffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed'
]);

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST')
        response.status(405).end('Method not allowed')
        return;
    }

    const buffer = await streamBuffer(request);

    const secret = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buffer, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return response.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
        try {
            switch (type) {
                case 'checkout.session.completed':

                    const checkoutSession = event.data.object as Stripe.Checkout.Session;

                    await saveSubscription(
                        checkoutSession.subscription.toString(),
                        checkoutSession.customer.toString()
                    );

                    break;
                default:
                    throw new Error('Unhandled event.')
            }
        } catch (err) {
            // TODO - use sentry to notify unhandled development error - do not pass status of error to avoid stripe to keep trying to resend it
            return response.json({ error: 'Webhook handler failed.' })
        }
    }

    response.json({ received: true });
}


// watch events in stripe (streaming format) - buffer will have all data of our request
// By default, next understands that all requests are coming as JSON, but in this case the request is a stream
// So I need to disable the default behavior of next.js for this request with `bodyParser`
// webhook is like an endpoint in our app that can be accessed externally
// it's common to have a code for a 3rd party to connect with our webhook endpoint for security