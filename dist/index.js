export function ensure(...v) {
    return new Ensurable(v);
}
class Ensurable {
    #values;
    constructor(values) {
        this.#values = values;
    }
    /**
     * Root property ensuring **some** values
     */
    get some() {
        const that = this;
        return {
            are: {
                true() {
                    that.#areSomeTrue();
                },
                false() {
                    that.#areSomeFalse();
                },
                equalTo(other) {
                    that.#areSome(other);
                },
                inRange(a, b) {
                    that.#areSomeInRange(a, b);
                },
                different() {
                    that.#someDifferent();
                }
            }
        };
    }
    /**
     * Root property ensuring **all** values
     */
    get all() {
        const that = this;
        return {
            are: {
                true() {
                    that.#areAllTrue();
                },
                false() {
                    that.#areAllFalse();
                },
                equalTo(other) {
                    that.#areAll(other);
                },
                inRange(a, b) {
                    that.#areAllInRange(a, b);
                },
                equal() {
                    that.#allEqual();
                },
            }
        };
    }
    /**
     * Shorthands
     */
    get are() {
        const that = this;
        return {
            equal() {
                return that.all.are.equal();
            },
            different() {
                return that.some.are.different();
            }
        };
    }
    /**
     * Conceptually the same as some (or all),
     * but used for a single value
     */
    get is() {
        return this.some.are;
    }
    #areAllTrue() {
        if (!this.#values.every(v => v === true)) {
            throw new Error(`Expected all values of '${this.#values}' to be 'true'.`);
        }
    }
    #areSomeTrue() {
        if (!this.#values.some(v => v === true)) {
            throw new Error(`Expected some values of '${this.#values}' to be 'true'.`);
        }
    }
    #areAllFalse() {
        if (!this.#values.every(v => v === false)) {
            throw new Error(`Expected all values of '${this.#values}' to be 'false'.`);
        }
    }
    #areSomeFalse() {
        if (!this.#values.some(v => v === false)) {
            throw new Error(`Expected some values of '${this.#values}' to be 'false'.`);
        }
    }
    #areAll(other) {
        if (!this.#values.every(v => v === other)) {
            throw new Error(`Expected all values of '${this.#values}' to be '${other}'.`);
        }
    }
    #areSome(other) {
        if (!this.#values.some(v => v === other)) {
            throw new Error(`Expected some values of '${this.#values}' to be '${other}'.`);
        }
    }
    #areAllInRange(a, b) {
        if (this.#values.some(v => typeof v !== 'number')) {
            throw new Error(`Expected all values of '${this.#values}' to be numbers.`);
        }
        if (!this.#values.every(v => v >= a && v <= b)) {
            throw new Error(`Expected all values of '${this.#values}' to be in [${a}, ${b}].`);
        }
    }
    #areSomeInRange(a, b) {
        if (this.#values.some(v => typeof v !== 'number')) {
            throw new Error(`Expected all values of '${this.#values}' to be numbers.`);
        }
        if (!this.#values.some(v => v >= a && v <= b)) {
            throw new Error(`Expected some values of '${this.#values}' to be in [${a}, ${b}].`);
        }
    }
    #allEqual() {
        if (!this.#values.every(v => v === this.#values[0])) {
            throw new Error(`Expected all values of '${this.#values}' to be equal.`);
        }
    }
    #someDifferent() {
        if (new Set(this.#values).size !== this.#values.length) {
            throw new Error(`Expected all values of '${this.#values}' to be different.`);
        }
    }
    and(...other) {
        return new Ensurable([...this.#values, ...other]);
    }
}
//# sourceMappingURL=index.js.map