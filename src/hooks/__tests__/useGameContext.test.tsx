import { GameProvider } from '../../context/GameContext';
import { useGameContext } from '../useGameContext';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

describe('useGameContext', () => {
    it('returns context when used within GameProvider', () => {
        const wrapper = ({children}: { children: ReactNode }) => <GameProvider>{children}</GameProvider>;
        const {result} = renderHook(() => useGameContext(), {wrapper});

        expect(result.current).toBeDefined();
        expect(result.current.score).toBe(0);
        expect(result.current.increaseScore).toBeDefined();
        expect(typeof result.current.playerId).toBe('string');
    });

    it('throws error when used outside of GameProvider', () => {
        renderHook(() => {
            try {
                useGameContext()
            } catch (error) {
                expect(error).toEqual(Error('useGameContext must be used within a GameProvider'))
            }
        });
    });
});