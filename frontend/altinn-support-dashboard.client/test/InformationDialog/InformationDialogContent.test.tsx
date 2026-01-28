import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import InformationDialogContent from "../../src/components/InformationDialog/InformationDialogContent";


//Mocking designsystemet components used in InformationDialogContent, so the test works
vi.mock('@digdir/designsystemet-react', () => {
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    return {
        Dialog: {
            Block: (props: unknown) => {
                const propsTyped = props as {children?: React.ReactNode};
                return React.createElement('div', { 'data-testid': 'dialog-block' }, propsTyped.children);
            }
        },
        Paragraph: (props: unknown) => {
            const propsTyped = props as {children?: React.ReactNode; className?: string};
            return React.createElement('p', { className: propsTyped.className }, propsTyped.children);
        },
        List: {
            Unordered: (props: unknown) => {
                const propsTyped = props as {children?: React.ReactNode};
                return React.createElement('ul', {}, propsTyped.children);
            },
            Item: (props: unknown) => {
                const propsTyped = props as {children?: React.ReactNode; className?: string};
                return React.createElement('li', { className: propsTyped.className }, propsTyped.children);
            }
        }
    };
});

describe('InformationDialogContent', () => {
    
    it('should render correct paragraph text', () => {
        render(<InformationDialogContent />);

        expect(screen.getByText(/Dette betyr at det er kunden som oppgir informasjon/i)).toBeInTheDocument();
    });

    it('should render correct example with checkmark', () => {
        render(<InformationDialogContent />);

        expect(screen.getByText(/Kunden sier adressen og du bekrefter eller avkrefter at den er riktig/i)).toBeInTheDocument();
        expect(screen.getByTitle('Riktig ikon')).toBeInTheDocument();
    });

    it('should render incorrect example with xmark', () => {
        render(<InformationDialogContent />);

        expect(screen.getByText(/Kunden spør og du leser opp adressen/i)).toBeInTheDocument();
        expect(screen.getByTitle('Feil ikon')).toBeInTheDocument();
    });

    it('should render 2 list items', () => {
        render(<InformationDialogContent />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(2);
    });
})