---
id: shallow-renderer
title: Поверхностный рендерер
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Импорт**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 с npm
```

## Обзор {#overview}

Поверхностный рендеринг может быть полезным при модульном тестировании компонентов React. Он позволяет отрендерить компонент «на один уровень глубины», а затем проверить утверждения о том, что возвращает метод рендеринга. В этом случае вам не нужно волноваться о поведении дочерних компонентов, потому что они не инстанциируются и не рендерятся. Этот процесс не требует DOM.

Возьмём к примеру, следующий компонент:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Заглавие</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Тогда вы можете утверждать:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// в вашем тесте:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Заглавие</span>,
  <Subcomponent foo="bar" />
]);
```

Поверхностное тестирование в настоящее время имеет некоторые ограничения — оно не поддерживает рефы.

> Замечание:
>
> Мы также советуем посмотреть API поверхностного рендеринга Enzyme [Shallow Rendering API](https://airbnb.io/enzyme/docs/api/shallow.html). Он предоставляет более удобный API высокого уровня для достижения той же функциональности.

## Справка {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Вы можете думать о shallowRenderer как о «месте» в которое рендерится тестируемый компонент, и из которого вы можете извлечь результат вывода этого компонента.

<<<<<<< HEAD
`shallowRenderer.render()` схож с [`ReactDOM.render()`](/docs/react-dom.html#render), но не требует DOM и рендерит всего один уровень глубины. Это означает что вы можете тестировать компоненты независимо от того, как реализованы их дочерние компоненты.
=======
`shallowRenderer.render()` is similar to [`root.render()`](/docs/react-dom-client.html#createroot) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

После того как был вызван `shallowRenderer.render()`, вы можете извлечь поверхностно отрисованный результат с помощью `shallowRenderer.getRenderOutput()`.

После этого можно начинать проверку утверждений о выводе.
