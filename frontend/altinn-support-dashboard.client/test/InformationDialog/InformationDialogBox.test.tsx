import { expect, it, vi } from 'vitest';
import InformationDialogBox from '../../src/components/InformationDialog/InformationDialogBox';
import { render, screen } from '@testing-library/react';
import React from 'react';


vi.mock('../../src/components/InformationDialog/InformationDialogContent', () => ({
    default: () => {
        //eslint-disable-next-line @typescript-eslint/no-var-requires
        const React = require('react');
        return React.createElement('div', { 'data-testid': 'information-dialog-content' }, 'Mocked InformationDialogContent');
    },
}));

vi.mock('@digdir/designsystemet-react', () => {
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    return {
        Dialog: React.forwardRef((props: unknown, ref: unknown) => {
            const propsTyped = props as {
                className?: string;
                closedby?: string;
                children?: React.ReactNode;
            };
            return React.createElement('dialog', {
                ref,
                className: propsTyped.className,
                'data-closedby': propsTyped.closedby
            }, propsTyped.children)
        }),
        Heading: (props: unknown) => {
            const propsTyped = props as {
                children?: React.ReactNode;
            };
            return React.createElement('h1', {}, propsTyped.children);
        }
    }
});

const dialogRef = React.createRef<HTMLDialogElement>();

describe('InformationDialogBox', () => {

    it('should render dialog with correct heading', () => {
        render(<InformationDialogBox dialogRef={dialogRef} />);

        expect(screen.getByText(/Dette verktøyet skal kun brukes til å bekrefte informasjon/i
        )).toBeInTheDocument();
    });

    it('should render InformationDialogContent', () => {
        render(<InformationDialogBox dialogRef={dialogRef} />);

        expect(screen.getByTestId('information-dialog-content')).toBeInTheDocument();
    });

    it('should pass dialogRef to Dialog component', () => {
        render(<InformationDialogBox dialogRef={dialogRef} />);

        expect(dialogRef.current).toBeInstanceOf(HTMLDialogElement);
    });

    it('should apply custom css class', () => {
        render(<InformationDialogBox dialogRef={dialogRef} />);

        const dialogElement = dialogRef.current;
        expect(dialogElement?.className).toContain('dialogBox');
    });

    it('should have closedby attribute set to "any"', () => {
        render(<InformationDialogBox dialogRef={dialogRef} />);

        const dialogElement = dialogRef.current;
        expect(dialogElement?.getAttribute('data-closedby')).toBe('any');
    });
});