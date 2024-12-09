import { PlayerProvider } from '../../contexts/PlayerContext.tsx';
import { usePlayerContext } from '../usePlayerContext.tsx';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { expect } from 'vitest';

describe('usePlayerContext', () => {
    it('returns context values when used within GameProvider', () => {
        const wrapper = ({children}: { children: ReactNode }) =>
            <PlayerProvider>{children}</PlayerProvider>;
        const {result} = renderHook(() => usePlayerContext(), {wrapper});

        const {score, increaseScore, decreaseScore, playerId} = result.current;
        expect(score).toBe(0);
        expect(increaseScore).toBeDefined();
        expect(decreaseScore).toBeDefined();
        expect(typeof playerId).toBe('string');
        expect(playerId).toHaveLength(36);
    });

    it('throws error when used outside of GameProvider', () => {
        renderHook(() => {
            try {
                usePlayerContext()
            } catch (error) {
                expect(error).toEqual(Error('usePlayerContext must be used within a PlayerProvider'));
            }
        });
    });
});