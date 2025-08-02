export declare function ensure(...v: any[]): Ensurable;
declare class Ensurable {
    #private;
    constructor(values: any[]);
    /**
     * Root property ensuring **some** values
     */
    get some(): {
        are: {
            true(): void;
            false(): void;
            equalTo(other: any): void;
            inRange(a: number, b: number): void;
            different(): void;
        };
    };
    /**
     * Root property ensuring **all** values
     */
    get all(): {
        are: {
            true(): void;
            false(): void;
            equalTo(other: any): void;
            inRange(a: number, b: number): void;
            equal(): void;
        };
    };
    /**
     * Shorthands
     */
    get are(): {
        equal(): void;
        different(): void;
    };
    /**
     * Conceptually the same as some (or all),
     * but used for a single value
     */
    get is(): {
        true(): void;
        false(): void;
        equalTo(other: any): void;
        inRange(a: number, b: number): void;
        different(): void;
    };
    and(...other: any[]): Ensurable;
}
export {};
//# sourceMappingURL=index.d.ts.map