import { useSession, signIn } from 'next-auth/client';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    // Check if user is logged in
    const [session] = useSession();

    const handleSubscribe = () => {
        if (!session) {
            signIn('github');
            return;
        }

        // Create checkout session
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
