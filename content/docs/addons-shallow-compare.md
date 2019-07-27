---
id: shallow-compare
title: Поверхностное сравнение
permalink: docs/shallow-compare.html
layout: docs
category: Reference
---

> Примечание:
>
> `shallowCompare` устарел. Используйте вместо этого [`React.memo`](/docs/react-api.html#reactmemo) или [`React.PureComponent`](/docs/react-api.html#reactpurecomponent).

**Импортирование**

```javascript
import shallowCompare from 'react-addons-shallow-compare'; // ES6
var shallowCompare = require('react-addons-shallow-compare'); // ES5 with npm
```

## Обзор {#overview}

Перед появленияем [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) `shallowCompare` использовался для того же, что и [`PureRenderMixin`](pure-render-mixin.html) при использовании ES6-классов с React.

Если функция рендера React-компонента является «чистой» (возвращается тот же результат при таких же пропсах и состоянии), вы можете в некоторых случаях использовать эту функцию для повышения производительности.

Пример:

```js
export class SampleComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return <div className={this.props.className}>foo</div>;
  }
}
```

`shallowCompare` поверхностно сравнивает объекты текущих `props` и `state` с будущими `nextProps` и `nextState`. 
При переборе ключей сравниваемых объектов возвращается `true`, если значения ключа в каждом объекте имеют нестрогое равенство.

`shallowCompare` возвращает `true`, если поверхностное сравнение пропсов или состояния находит разницу. В таком случае компонент обновится. 
`shallowCompare` возвращает `false`, если поверхностное сравнении пропсов и состояния не находит разницу. Компонент не нуждается в обновлении.
