import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SearchComponent from './TopSearchBarComponent';

describe('SearchComponent', () => {
    it('renders the search input and label', () => {
        renderSearchComponent();

        // We use getByPlaceholderText since our TextField has a placeholder.
        expect(screen.getByPlaceholderText('Mobilnummer / E-post / Organisasjonsnummer')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls setQuery when input value changes', async () => {
        const mockHandleSearch = vi.fn();
        const mockSetQuery = vi.fn();

        renderSearchComponent({ handleSearch: mockHandleSearch, mockSetQuery });

        const input = screen.getByRole('textbox');
        await userEvent.type(input, 'test query');

        expect(mockSetQuery).toHaveBeenLastCalledWith('test query');
    });
});

const renderSearchComponent = ({
    handleSearch = vi.fn(),
    mockSetQuery = vi.fn(),
    handleClearSearch = vi.fn(),
    hasSearched = false,
} = {}) => {
    const Wrapper: React.FC = () => {
        const [query, setQuery] = React.useState('');

        const handleSetQuery = (newQuery: string) => {
            setQuery(newQuery);
            mockSetQuery(newQuery);
        };

        return (
            <SearchComponent
                query={query}
                setQuery={handleSetQuery}
                handleSearch={handleSearch}
                handleClearSearch={handleClearSearch}
                hasSearched={hasSearched}
                isDarkMode={false}
            />
        );
    };

    render(<Wrapper />);
};

