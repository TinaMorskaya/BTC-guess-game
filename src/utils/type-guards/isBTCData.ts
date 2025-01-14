import { BTCData } from '../../types/types.ts';
import { isObjectOfType, TypeChecks } from './isObjectOfType.ts';

const typeChecks = {
    e: 'string',
    E: 'number',
    s: 'string',
    p: 'string',
    q: 'string',
    t: 'number',
    m: 'boolean',
    M: 'boolean',
    T: 'number'
} satisfies TypeChecks<BTCData>;


export const isBTCData = (data: unknown): data is BTCData =>
    isObjectOfType(data, typeChecks);
