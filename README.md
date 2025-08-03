# Ensure
A JavaScript/TypeScript prose assertion library.

## Examples
```js

const x = 1;
const y = 2;
const z = 3;
const t = z;

ensure(x).is.defined();
ensure(x).and(y).are.defined();

ensure(x).and(y).are.different();
ensure(z).and(t).are.equal();

ensure(x).is.equalTo(1);
ensure(z, t).are.equalTo(3);

ensure(x).and(y).and(z).are.inRange(1, 3);

ensure(x === 1).is.true();

ensure(x === 2).is.false();

```

## Missing features
- Negation, for example as follows:
  ```ts
  ensure(x).is.not.defined();
  ensure(x).and(y).are.not.inRange(1, 10);
  ```
- 