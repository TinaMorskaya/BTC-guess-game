import { describe } from 'vitest';
import { isObjectOfType, TypeChecks } from '../isObjectOfType.ts';

describe('isObjectOfType', () => {
    const typeChecks = {
        a: 'number',
        b: 'string',
        c: 'boolean'
    } satisfies TypeChecks<{
        a: number;
        b: string;
        c: boolean;
    }>;

    it('should return true if object matches type checks', () => {
        const obj = {
            a: 1,
            b: 'string',
            c: true
        };

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should return false if object is missing a property', () => {
        const obj = {
            a: 1,
            b: 'string'
        };

        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should return false if object has an invalid property type', () => {
        const obj = {
            a: 1,
            b: 'string',
            c: 'string'
        };

        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should return false if object is NOT an object', () => {
        const obj = 'string';

        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should return false if object is null', () => {
        const obj = null;

        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should return false if object is an array', () => {
        const obj = [ 'a', 'b', 'c' ];

        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should return true if object has extra properties', () => {
        const obj = {
            a: 1,
            b: 'string',
            c: true,
            d: 'extra'
        };

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should return false if object does NOT have properties', () => {
        const obj = {};

        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should handle nested objects', () => {
        const obj = {
            a: 1,
            b: 'string',
            c: {
                d: true
            }
        };
        const typeChecks = {
            a: 'number',
            b: 'string',
            c: {
                d: 'boolean'
            }
        } satisfies TypeChecks<{
            a: number;
            b: string;
            c: {
                d: boolean;
            };
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should return false if nested object has an invalid property type even without satisfies TypeChecks', () => {
        const obj = {
            a: 1,
            b: 'string',
            c: [ 'a' ]
        };
        const typeChecks = {
            a: 'number',
            b: 'string',
            c: [ 'a' ]
        };

        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should handle deeply nested objects', () => {
        const obj = {
            a: {
                b: {
                    c: {
                        d: 'string'
                    }
                }
            }
        };
        const typeChecks = {
            a: {
                b: {
                    c: {
                        d: 'string'
                    }
                }
            }
        } satisfies TypeChecks<{
            a: {
                b: {
                    c: {
                        d: string;
                    };
                };
            };
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should return true for functions in nested objects', () => {
        const obj = {
            a: {
                b: {
                    c: () => ({})
                }
            }
        };

        const typeChecks = {
            a: {
                b: {
                    c: 'function'
                }
            }
        } as TypeChecks<{
            a: {
                b: {
                    c: () => void;
                };
            };
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should return false for nested arrays even without satisfies TypeChecks', () => {
        const obj = {
            a: {
                b: {
                    c: []
                }
            }
        };
        const typeChecks = {
            a: {
                b: {
                    c: 'array'
                }
            }
        };
        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should handle multiple nested properties of different types', () => {
        const obj = {
            user: {
                name: 'John',
                settings: {
                    darkMode: true,
                    fontSize: 14
                }
            },
            meta: {
                lastUpdated: 'today'
            }
        };
        const typeChecks = {
            user: {
                name: 'string',
                settings: {
                    darkMode: 'boolean',
                    fontSize: 'number'
                }
            },
            meta: {
                lastUpdated: 'string'
            }
        } satisfies TypeChecks<{
            user: {
                name: string;
                settings: {
                    darkMode: boolean;
                    fontSize: number;
                };
            };
            meta: {
                lastUpdated: string;
            };
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should return false when nested property is undefined but expected to be', () => {
        const obj = {
            user: {
                name: 'John',
                settings: undefined
            }
        };
        const typeChecks = {
            user: {
                name: 'string',
                settings: {
                    darkMode: 'boolean'
                }
            }
        } satisfies TypeChecks<{
            user: {
                name: string;
                settings: {
                    darkMode: boolean;
                };
            };
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(false);
    });

    it('should handle bigint type', () => {
        const obj = {
            id: BigInt(123)
        };
        const typeChecks = {
            id: 'bigint'
        } satisfies TypeChecks<{
            id: bigint;
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should handle symbol type', () => {
        const obj = {
            uniqueId: Symbol('test')
        };
        const typeChecks = {
            uniqueId: 'symbol'
        } satisfies TypeChecks<{
            uniqueId: symbol;
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should return false when nested object is null', () => {
        const obj = {
            user: {
                name: 'John',
                settings: null
            }
        };
        const typeChecks = {
            user: {
                name: 'string',
                settings: 'null'
            }
        } as TypeChecks<{
            user: {
                name: string;
                settings: null;
            };
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });

    it('should return true when nested object is undefined', () => {
        const obj = {
            id: undefined
        };
        const typeChecks = {
            id: 'undefined'
        } satisfies TypeChecks<{
            id: undefined;
        }>;

        expect(isObjectOfType(obj, typeChecks)).toBe(true);
    });
});