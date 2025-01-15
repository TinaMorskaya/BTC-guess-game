export type TypeChecks<T> = T extends unknown[] ? never
    : T extends object ? {
        [K in keyof T]: T[K] extends string ? 'string'
            : T[K] extends number ? 'number'
                : T[K] extends boolean ? 'boolean'
                    : T[K] extends bigint ? 'bigint'
                        : T[K] extends symbol ? 'symbol'
                            : T[K] extends undefined ? 'undefined'
                                : T[K] extends null ? 'null'
                                    : T[K] extends (...args: unknown[]) => unknown ? 'function'
                                        : T[K] extends object ? TypeChecks<T[K]>
                                            : T[K] extends unknown[] ? never
                                                : never
    } : never;

export const isObjectOfType = <T extends object>(obj: unknown, typeChecks: TypeChecks<T>): obj is T => {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return false;

    const record = obj as Record<string, unknown>;

    return Object.entries(typeChecks).every(([ key, expectedType ]) => {
            if (typeof expectedType === 'object' && expectedType !== null) {
                return isObjectOfType(record[key], expectedType);
            }
            if (expectedType === 'null') {
                return record[key] === null;
            }

            return typeof record[key] === expectedType
        }
    );
}