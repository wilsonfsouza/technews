import { render } from '@testing-library/react';
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
        const { getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        );

        expect(getByText('Home')).toBeInTheDocument();
    });

    it('should render active link with active class when asPath and href match', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        );

        expect(getByText('Home')).toHaveClass('active');
    });

    it('should render active link without active class when asPath and href are different', () => {
        const { getByText } = render(
            <ActiveLink href="/dashboard" activeClassName="active">
                <a>Dashboard</a>
            </ActiveLink>
        );

        expect(getByText('Dashboard')).not.toHaveClass('active');
    });
})
