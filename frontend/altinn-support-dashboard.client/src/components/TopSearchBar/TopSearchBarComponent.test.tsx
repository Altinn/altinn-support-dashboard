// src/components/TopSearchBar/TopSearchBarComponent.test.tsx

import React from 'react'; // Added this line
import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SearchComponent from './TopSearchBarComponent';

describe('SearchComponent', () => {
    it('renders the search input and label', () => {
        renderSearchComponent();

        expect(screen.getByLabelText('Mobilnummer / E-post / Organisasjonsnummer:')).toBeInTheDocument();
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('calls setQuery when input value changes', async () => {
        const mockHandleSearch = vi.fn();
        const mockSetQuery = vi.fn();

        renderSearchComponent({ handleSearch: mockHandleSearch, mockSetQuery });

        const input = screen.getByRole('searchbox');
        await userEvent.type(input, 'test query');

        expect(mockSetQuery).toHaveBeenLastCalledWith('test query');
    });
});

const renderSearchComponent = ({
    handleSearch = vi.fn(),
    mockSetQuery = vi.fn(),
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
                isDarkMode={false} // Added isDarkMode prop
            />
        );
    };

    render(<Wrapper />);
};
