import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/client');

jest.mock('next/router');

describe('SubscribeButton component', () => {
    it('should render correctly', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(
            <SubscribeButton />
        );

        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('should redirect user to sign in when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        const signInMocked = mocked(signIn);

        render(
            <SubscribeButton />
        );

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);


        expect(signInMocked).toHaveBeenCalled();
    });

    it('should redirect user to posts page if user is authenticated and has an active subscription', () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);

        const pushMocked = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            {
                user: { name: 'Jane Doe', email: 'janedoe@example.com' },
                expires: 'fake-expires',
                activeSubscription: true,
            }
            , false]);

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked,
        } as any)

        render(
            <SubscribeButton />
        );

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);


        expect(pushMocked).toHaveBeenCalledWith('/posts');
    });
})
