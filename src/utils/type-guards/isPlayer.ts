import { Player } from '../../types/types.ts';
import { isObjectOfType, TypeChecks } from './isObjectOfType.ts';

const typeChecks = {
    playerId: 'string',
    score: 'number',
} satisfies TypeChecks<Player>;

export const isPlayer = (obj: unknown): obj is Player =>
    isObjectOfType(obj, typeChecks);