
export function ensure(...v: any[]) {
  return new Ensurable(v);
}

class EnsuranceContext {
  values: any[];
  args: [];

  constructor(values: any[], args: any) {
    this.values = values;
    this.args = args;
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
    true: new Ensurance({
      predicate: (_, v) => v === true,
      message: ctx => `Expected <${ctx.values}> to be true.`
    }),
    false: new Ensurance({
      predicate: (_, v) => v === false,
      message: ctx => `Expected <${ctx.values}> to be false.`
    }),
    equalTo: new Ensurance({
      predicate: (_, v, o) => v === o,
      message: ctx => `Expected <${ctx.values}> to be equal to <${ctx.args.at(0)}>.`
    }),
    inRange: new Ensurance({
      predicate: (_, v, a, b) => v >= a && v <= b,
      message: ctx => `Expected <${ctx.values}> to be in [${ctx.args.at(0)}, ${ctx.args.at(1)}].`
    }),
    defined: new Ensurance({
      predicate: (_, v) => v !== undefined && v !== null,
      message: ctx => `Expected <${ctx.values}> to be defined.`
    }),
    equal: new Ensurance({
      predicate: (ctx, v) => v === ctx.values[0],
      message: ctx => `Expected <${ctx.values}> to be equal.`
    }),
    different: new Ensurance({
      predicate: (ctx, v) => new Set(ctx.values).size === ctx.values.length,
      message: ctx => `Expected <${ctx.values}> to be different.`
    })
  }

  static ENSURANCE_MAP = {
    SINGLE: {
      true: this.ENSURANCES.true,
      false: this.ENSURANCES.false,
      equalTo: this.ENSURANCES.equalTo,
      inRange: this.ENSURANCES.inRange,
      defined: this.ENSURANCES.defined
    },
    MULTIPLE: {
      true: this.ENSURANCES.true,
      false: this.ENSURANCES.false,
      equalTo: this.ENSURANCES.equalTo,
      inRange: this.ENSURANCES.inRange,
      defined: this.ENSURANCES.defined,
      equal: this.ENSURANCES.equal,
      different: this.ENSURANCES.different
    }
  }

  /**
   * Used for multiple values
   */
  get are() {
    const that = this;
    const ensurances = Ensurable.ENSURANCE_MAP.MULTIPLE;

    const entries = Object.entries(ensurances).map(([name, ensurance]) => {
      return [name, function(...args: any[]) {

        const ctx = new EnsuranceContext(that.#values, args);
        if (!that.#values.every(v => ensurance.predicate(ctx, v, ...args))) {
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
    const that = this;
    const ensurances = Ensurable.ENSURANCE_MAP.SINGLE;

    const entries = Object.entries(ensurances).map(([name, ensurance]) => {
      return [name, function(...args: any[]) {
        const ctx = new EnsuranceContext([that.#values[0]], args);
        if (!ensurance.predicate(ctx, that.#values[0], ...args)) {
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
