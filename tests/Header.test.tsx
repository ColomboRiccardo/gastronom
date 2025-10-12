// Header.test.tsx
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/custom/Header';

describe('Header Component', () => {
    it('renders the header element', () => {
        render(<Header/>);
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
    });

    it('contains a link with "Gastronom" as text', () => {
        render(<Header/>);
        const link = screen.getByRole('link', {name: /gastronom/i});
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
    });

    it('renders a navigation list with three items', () => {
        render(<Header/>);
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
        expect(listItems[0]).toHaveTextContent('Shop');
        expect(listItems[1]).toHaveTextContent('Blog');
        expect(listItems[2]).toHaveTextContent('Contatti');
    });

    it('renders the Input with expected className', () => {
        render(<Header/>);
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('bg-popover', 'max-w-1/2');
    });

    it('renders two buttons with "Cart" and "Profile" labels', () => {
        render(<Header/>);
        const cartButton = screen.getByRole('button', {name: /cart/i});
        const profileButton = screen.getByRole('button', {name: /profile/i});

        expect(cartButton).toBeInTheDocument();
        expect(profileButton).toBeInTheDocument();
    });

    it('applies the correct className to the header', () => {
        render(<Header/>);
        const header = screen.getByRole('banner');
        expect(header).toHaveClass('w-full', 'flex', 'justify-between', 'items-center', 'gap-10', 'py-3', 'px-5', 'bg-secondary');
    });
});