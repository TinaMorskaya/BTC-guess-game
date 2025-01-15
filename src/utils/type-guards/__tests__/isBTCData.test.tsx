import { describe } from 'vitest';
import { isBTCData } from '../isBTCData.ts';
import { BTCData } from '../../../types/types.ts';

describe('isBTCData', () => {
    it('should return true if data is BTCData', () => {
        const data: BTCData = {
            e: 'e',
            E: 1,
            s: 's',
            p: 'p',
            q: 'q',
            t: 1,
            m: true,
            M: true,
            T: 1
        };
        expect(isBTCData(data)).toBe(true);
    });

    it('should return false if data is missing a property', () => {
        const data: Partial<BTCData> = {
            e: 'e',
            E: 1,
            s: 's',
            p: 'p',
            q: 'q',
            t: 1,
            m: true,
            M: true,
        };
        expect(isBTCData(data)).toBe(false);
    });

    it('should return false if data has an invalid property type', () => {
        const data = {
            e: 'e',
            E: 1,
            s: 's',
            p: 'p',
            q: 'q',
            t: 1,
            m: true,
            M: true,
            T: 'string'
        };
        expect(isBTCData(data)).toBe(false);
    });

    it('should return false if data is not an object', () => {
        const data = 'string';
        expect(isBTCData(data)).toBe(false);
    });

    it('should return false if data is null', () => {
        const data = null;
        expect(isBTCData(data)).toBe(false);
    });
});