import { BTCData } from '../../types/types.ts';

export const isBTCData = (data: unknown): data is BTCData => {
    const record = data as Record<string, unknown>;
    if (!data || typeof data !== 'object') return false;

    return (
        typeof record.e === 'string' &&
        typeof record.E === 'number' &&
        typeof record.s === 'string' &&
        typeof record.p === 'string' &&
        typeof record.q === 'string' &&
        typeof record.t === 'number' &&
        typeof record.m === 'boolean' &&
        typeof record.M === 'boolean' &&
        typeof record.T === 'number'
    );
}

