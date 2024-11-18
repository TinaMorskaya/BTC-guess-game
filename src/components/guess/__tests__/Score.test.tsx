import { describe } from 'vitest';
import { Score, ScoreProps } from '../../game/Score.tsx';
import { render } from '@testing-library/react';

describe('Score', () => {
    const renderComponent = (props?: ScoreProps) => {
        return render(
            <Score {...props}/>
        );
    }

    it('should render default score equal to 0', () => {
        const {getByText} = renderComponent();
        expect(getByText('Score: 0')).toBeVisible();
    });

    it('should render score when provided', () => {
        const {getByText} = renderComponent({score: 1});
        expect(getByText('Score: 1')).toBeVisible();
    });
});