export function ensure(...v) {
    return new Ensurable(v);
}
class EnsuranceContext {
    values;
    args;
    negated;
    constructor(values, args, negated) {
        this.values = values;
        this.args = args;
        this.negated = negated;
    }
    get not() {
        return this.negated ? 'not ' : '';
    }
    get each() {
        return this.values.length > 1 ? 'each one of ' : '';
    }
}
class Ensurance {
    predicate;
    message;
    constructor({ predicate, message }) {
        this.predicate = predicate;
        this.message = message;
    }
}
class Ensurable {
    #values;
    constructor(values) {
        this.#values = values;
    }
    static ENSURANCES = {
        SINGLE: {
            true: new Ensurance({
                predicate: (_, v) => v === true,
                message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be true.`
            }),
            false: new Ensurance({
                predicate: (_, v) => v === false,
                message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be false.`
            }),
            equalTo: new Ensurance({
                predicate: (_, v, o) => v === o,
                message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be equal to <${ctx.args.at(0)}>.`
            }),
            inRange: new Ensurance({
                predicate: (_, v, a, b) => v >= a && v <= b,
                message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be in [${ctx.args.at(0)}, ${ctx.args.at(1)}].`
            }),
            defined: new Ensurance({
                predicate: (_, v) => v !== undefined && v !== null,
                message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be defined.`
            }),
        },
        MULTIPLE: {
            equal: new Ensurance({
                predicate: ctx => ctx.values.every(v => v === ctx.values[0]),
                message: ctx => `Expected <${ctx.values}> to ${ctx.not}be equal.`
            }),
            different: new Ensurance({
                predicate: ctx => new Set(ctx.values).size === ctx.values.length,
                message: ctx => `Expected <${ctx.values}> to ${ctx.not}be different.`
            })
        }
    };
    /**
     * Used for multiple values
     */
    get are() {
        return {
            ...this.#are(false),
            not: {
                ...this.#are(true)
            }
        };
    }
    #are(negated) {
        const that = this;
        const ensurances = {
            ...Ensurable.ENSURANCES.SINGLE,
            ...Ensurable.ENSURANCES.MULTIPLE
        };
        const entries = Object.entries(ensurances).map(([name, ensurance]) => {
            return [name, function (...args) {
                    const ctx = new EnsuranceContext(that.#values, args, negated);
                    const valid = (() => {
                        if (name in Ensurable.ENSURANCES.MULTIPLE) {
                            return negated !== ensurance.predicate(ctx, ...args);
                        }
                        else {
                            return that.#values.every(v => negated !== ensurance.predicate(ctx, v, ...args));
                        }
                    })();
                    if (!valid) {
                        throw new Error(ensurance.message(ctx));
                    }
                }];
        });
        return Object.fromEntries(entries);
    }
    /**
     * Used for a single value
     */
    get is() {
        return {
            ...this.#is(false),
            not: {
                ...this.#is(true)
            }
        };
    }
    #is(negated) {
        const that = this;
        const ensurances = Ensurable.ENSURANCES.SINGLE;
        const entries = Object.entries(ensurances).map(([name, ensurance]) => {
            return [name, function (...args) {
                    const ctx = new EnsuranceContext([that.#values[0]], args, negated);
                    const valid = ensurance.predicate(ctx, that.#values[0], ...args);
                    if (!valid !== negated) {
                        throw new Error(ensurance.message(ctx));
                    }
                }];
        });
        return Object.fromEntries(entries);
    }
    and(...other) {
        return new Ensurable([...this.#values, ...other]);
    }
}
//# sourceMappingURL=index.js.map