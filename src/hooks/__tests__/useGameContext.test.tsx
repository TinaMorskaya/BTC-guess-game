import { PlayerProvider } from '../../context/GameProvider.tsx';
import { usePlayerContext } from '../usePlayerContext.tsx';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

describe('useGameContext', () => {
    it('returns context when used within GameProvider', () => {
        const wrapper = ({children}: { children: ReactNode }) => <PlayerProvider>{children}</PlayerProvider>;
        const {result} = renderHook(() => usePlayerContext(), {wrapper});

        expect(result.current).toBeDefined();
        expect(result.current.score).toBe(0);
        expect(result.current.increaseScore).toBeDefined();
        expect(typeof result.current.playerId).toBe('string');
    });

    it('throws error when used outside of GameProvider', () => {
        renderHook(() => {
            try {
                usePlayerContext()
            } catch (error) {
                expect(error).toEqual(Error('useGameContext must be used within a GameProvider'))
            }
        });
    });
});