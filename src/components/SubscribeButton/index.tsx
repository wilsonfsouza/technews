import { useSession, signIn } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [session] = useSession();

    const handleSubscribe = async () => {
        if (!session) {
            signIn('github');
            return;
        }

        try {
            const response = await api.post('/checkout')

            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId });

        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}

// Next public keys NEXT_PUBLIC_...
// We don't want the stripe API key to be public, so we cannot create the checkout session directly in the component
// 3 places to use SECRET API keys safely

// getServerSideProps() -> when page is being rendered
// getStaticProps() -> when page is being rendered
// API routing -> action triggered by user (after render)
// Create a user for the client in the stripe panel
// I cannot get the user from useSession hook because this is not a React component

// Get user info from same-site cookies
// request.cookies returns the saved token, but I want the user info
// use next-auth method getSession

// Save stripe customer id with fauna db user information

// Webhook is a pattern to integrate 3rd party services that some event happened
// they use this concept to warn our application about a problem that might have happened on their end
// Ex: Stripe
// App -> user register -> stripe creates customer and recurring subscription
// User card expires - we need to cancel user subscription, but how can our app get that info? Stripe has a webhook for that
// It usually notifies by a http endpoint that we provide (ex: denied card)
// Stripe dashboard -> settings -> checkout settings -> configure webhook
// add endpoint for website in production
// use stripe cli for website in development/testing that will watch requests and responses from our webhooks

// Listen webhooks
// bash: stripe listen --forward-to localhost:3000/api/webhooks

// stripe fake card for test: #: 4242 4242 4242 4242 with any expiration, security code, and other info