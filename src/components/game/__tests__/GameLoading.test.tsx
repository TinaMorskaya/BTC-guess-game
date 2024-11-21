import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameLoading, GameLoadingProps } from '../GameLoading.tsx';

describe('GameLoading', () => {
    const renderComponent = (props?: Partial<GameLoadingProps>) =>
        render(
            <GameLoading status='' {...props}/>
        );

    it('should render loading message and NO status, when status is empty sting', () => {
        renderComponent();
        expect(screen.getByText('Loading bitcoin price...')).toBeVisible();
        expect(screen.queryByText('Status:')).not.toBeInTheDocument()
    });

    it('should render loading message and status, when status string is provided', () => {
        renderComponent({status: 'test'});
        expect(screen.getByText('Loading bitcoin price...')).toBeVisible();
        expect(screen.getByText('Status: test')).toBeVisible();
    });
});