# Ensure
A JavaScript/TypeScript prose assertion library.

## Examples
```js

const x = 10;
const y = 20;
const z = 20;

ensure(x).is.equalTo(10);

ensure(x).and(y).are.different();
ensure(y).and(z).are.equal();

ensure(x).and(y).some.are.inRange(5,15);

ensure(x, y, z).all.are.inRange(10, 20)


```