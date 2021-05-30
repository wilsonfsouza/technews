import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
});

describe('ActiveLink component', () => {
    it('should render active link correctly', () => {
        render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should render active link with active class when asPath and href match', () => {
        render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        );

        expect(screen.getByText('Home')).toHaveClass('active');
    });

    it('should render active link without active class when asPath and href are different', () => {
        render(
            <ActiveLink href="/dashboard" activeClassName="active">
                <a>Dashboard</a>
            </ActiveLink>
        );

        expect(screen.getByText('Dashboard')).not.toHaveClass('active');
    });
})
