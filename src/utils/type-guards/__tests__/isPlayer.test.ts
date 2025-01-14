import { describe } from 'vitest';
import { isPlayer } from '../isPlayer.ts';

describe('isPlayer', () => {
    it('should return true if object matches Player type', () => {
        const player = {
            playerId: 'string',
            score: 1
        };
        expect(isPlayer(player)).toBe(true);
    });

    it('should return false if object is missing a property', () => {
        const player = {
            playerId: 'string'
        };
        expect(isPlayer(player)).toBe(false);
    });

    it('should return false if object has an invalid property type', () => {
        const player = {
            playerId: 'string',
            score: 'string'
        };
        expect(isPlayer(player)).toBe(false);
    });

    it('should return false if object is NOT an object', () => {
        const player = 'string';
        expect(isPlayer(player)).toBe(false);
    });

    it('should return false if object is null', () => {
        const player = null;
        expect(isPlayer(player)).toBe(false);
    });
});