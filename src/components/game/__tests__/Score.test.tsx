import { afterEach, describe, Mock, vi } from 'vitest';
import { Score } from '../Score.tsx';
import { render, screen } from '@testing-library/react';
import { usePlayerContext } from '../../../hooks/usePlayerContext.tsx';

vi.mock('../../../hooks/usePlayerContext.tsx');

describe('Score', () => {
    const mockUsePlayerContext = usePlayerContext as Mock;

    beforeEach(() => {
        mockUsePlayerContext.mockReturnValue({score: 1});
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    const renderComponent = () => {
        return render(
            <Score/>
        );
    }

    it('should render default score equal to 0', () => {
        renderComponent();
        expect(screen.getByText('Your score:')).toBeVisible();
        expect(screen.getByText('1')).toBeVisible();
    });
});