import { afterEach, describe, Mock, vi } from 'vitest';
import { Score } from '../Score.tsx';
import { render } from '@testing-library/react';
import { usePlayerContext } from '../../../hooks/usePlayerContext.tsx';

vi.mock('../../../hooks/usePlayerContext.tsx');

describe('Score', () => {
    const mockUsePlayerContext = usePlayerContext as Mock;

    beforeEach(() => {
        mockUsePlayerContext.mockReturnValue({score: 1, increaseScore: vi.fn()});
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
        const {getByText} = renderComponent();
        expect(getByText('Your score:')).toBeVisible();
        expect(getByText('1')).toBeVisible();
    });
});