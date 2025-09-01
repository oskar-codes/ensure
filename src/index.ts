
export function ensure(...v: any[]) {
  return new Ensurable(v);
}

class EnsuranceContext {
  values: any[];
  args: [];
  negated: boolean;

  constructor(values: any[], args: any, negated: boolean) {
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
  predicate: (ctx: EnsuranceContext, ...v: any[]) => boolean
  message: (ctx: EnsuranceContext) => string

  constructor({
    predicate,
    message
  }: {
    predicate: (ctx: EnsuranceContext, ...v: any[]) => boolean,
    message: (ctx: EnsuranceContext) => string
  }) {
    this.predicate = predicate;
    this.message = message;
  }
}

class Ensurable {
  #values: any[];
  
  constructor(values: any[]) {
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
      greaterThan: new Ensurance({
        predicate: (_, v, o) => v >= o,
        message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be greater than or equal to <${ctx.args.at(0)}>.`
      }),
      strictlyGreaterThan: new Ensurance({
        predicate: (_, v, o) => v > o,
        message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be strictly greater than <${ctx.args.at(0)}>.`
      }),
      lessThan: new Ensurance({
        predicate: (_, v, o) => v <= o,
        message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be less than or equal to <${ctx.args.at(0)}>.`
      }),
      strictlyLessThan: new Ensurance({
        predicate: (_, v, o) => v < o,
        message: ctx => `Expected ${ctx.each}<${ctx.values}> to ${ctx.not}be strictly less than <${ctx.args.at(0)}>.`
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
  }

  /**
   * Used for multiple values
   */
  get are() {
    return {
      ...this.#are(false),
      not: {
        ...this.#are(true)
      }
    }
  }

  #are(negated: boolean) {
    const that = this;
    const ensurances = {
      ...Ensurable.ENSURANCES.SINGLE,
      ...Ensurable.ENSURANCES.MULTIPLE
    }

    const entries = Object.entries(ensurances).map(([name, ensurance]) => {
      return [name, function(...args: any[]) {
        const ctx = new EnsuranceContext(that.#values, args, negated);

        const valid = (() => {
          if (name in Ensurable.ENSURANCES.MULTIPLE) {
            return negated !== ensurance.predicate(ctx, ...args);
          } else {
            return that.#values.every(v => negated !== ensurance.predicate(ctx, v, ...args));
          }
        })();

        if (!valid) {
          throw new Error(ensurance.message(ctx))
        }

      }];
    });

    return Object.fromEntries(entries) as {
      [K in keyof typeof ensurances]: (...args: any[]) => void;
    }
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
    }
  }

  #is(negated: boolean) {
    const that = this;
    const ensurances = Ensurable.ENSURANCES.SINGLE;

    const entries = Object.entries(ensurances).map(([name, ensurance]) => {
      return [name, function(...args: any[]) {
        const ctx = new EnsuranceContext([that.#values[0]], args, negated);

        const valid = ensurance.predicate(ctx, that.#values[0], ...args);
        if (!valid !== negated) {
          throw new Error(ensurance.message(ctx))
        }
      }];
    });

    return Object.fromEntries(entries) as {
      [K in keyof typeof ensurances]: (...args: any[]) => void;
    }
  }
  
  and(...other: any[]) {
    return new Ensurable([...this.#values, ...other]);
  }
}
