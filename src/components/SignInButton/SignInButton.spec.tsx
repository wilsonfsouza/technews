import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('SignInButton component', () => {
    it('should render correctly when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(
            <SignInButton />
        );

        expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
    });

    it('should render correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([
            {
                user: { name: 'Jane Doe', email: 'janedoe@example.com' },
                expires: 'fake-expires',
                activeSubscription: false,
            }
            , false]);

        render(
            <SignInButton />
        );

        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
})
