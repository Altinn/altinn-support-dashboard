import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SearchComponent from './TopSearchBarComponent';

type SearchComponentProps = {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: () => void;
};

describe('SearchComponent', () => {
    it('renders the search input and label', () => {
        renderSearchComponent();

        expect(screen.getByLabelText('Mobilnummer / E-post / Organisasjonsnummer:')).toBeInTheDocument();
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('calls setQuery when input value changes', async () => {
        const mockSetQuery = vi.fn();
        renderSearchComponent({ setQuery: mockSetQuery });

        const input = screen.getByRole('searchbox');
        await userEvent.type(input, 'test query'); // Use userEvent for typing

        expect(mockSetQuery).toHaveBeenCalledWith('test query');
    });
});

const defaultProps: SearchComponentProps = {
    query: "",
    setQuery: vi.fn(),
    handleSearch: vi.fn(),
};

const renderSearchComponent = (modifiedProps: Partial<SearchComponentProps> = {}) => {
    render(<SearchComponent {...defaultProps} {...modifiedProps} />);
};