export declare function ensure(...v: any[]): Ensurable;
declare class EnsuranceContext {
    values: any[];
    args: [];
    negated: boolean;
    constructor(values: any[], args: any, negated: boolean);
    get not(): "not " | "";
    get each(): "" | "each one of ";
}
declare class Ensurance {
    predicate: (ctx: EnsuranceContext, ...v: any[]) => boolean;
    message: (ctx: EnsuranceContext) => string;
    constructor({ predicate, message }: {
        predicate: (ctx: EnsuranceContext, ...v: any[]) => boolean;
        message: (ctx: EnsuranceContext) => string;
    });
}
declare class Ensurable {
    #private;
    constructor(values: any[]);
    static ENSURANCES: {
        SINGLE: {
            true: Ensurance;
            false: Ensurance;
            equalTo: Ensurance;
            inRange: Ensurance;
            defined: Ensurance;
        };
        MULTIPLE: {
            equal: Ensurance;
            different: Ensurance;
        };
    };
    /**
     * Used for multiple values
     */
    get are(): {
        not: {
            equal: (...args: any[]) => void;
            different: (...args: any[]) => void;
            true: (...args: any[]) => void;
            false: (...args: any[]) => void;
            equalTo: (...args: any[]) => void;
            inRange: (...args: any[]) => void;
            defined: (...args: any[]) => void;
        };
        equal: (...args: any[]) => void;
        different: (...args: any[]) => void;
        true: (...args: any[]) => void;
        false: (...args: any[]) => void;
        equalTo: (...args: any[]) => void;
        inRange: (...args: any[]) => void;
        defined: (...args: any[]) => void;
    };
    /**
     * Used for a single value
     */
    get is(): {
        not: {
            true: (...args: any[]) => void;
            false: (...args: any[]) => void;
            equalTo: (...args: any[]) => void;
            inRange: (...args: any[]) => void;
            defined: (...args: any[]) => void;
        };
        true: (...args: any[]) => void;
        false: (...args: any[]) => void;
        equalTo: (...args: any[]) => void;
        inRange: (...args: any[]) => void;
        defined: (...args: any[]) => void;
    };
    and(...other: any[]): Ensurable;
}
export {};
//# sourceMappingURL=index.d.ts.map