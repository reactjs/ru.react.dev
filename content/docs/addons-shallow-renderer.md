---
id: shallow-renderer
title: Поверхностный рендеринг
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

Поверхностный рендеринг может быть полезным при модульном тестировании компонентов React. Поверхностный рендеринг позволяет вам отрендерить компонент «на один уровень глубины» и утверждать факты о том что возвращает рендер-метод. В этом случае вам не надо волноваться о поведении дочерних компонентов, потому что они не инстанциируются и не рендерятся. Этот процесс не требует DOM.

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
> Мы также советуем посмотреть API поверхностного рендеринга Enzyme [Shallow Rendering API](http://airbnb.io/enzyme/docs/api/shallow.html). Он предоставляет более удобный API высокого уровня для достижения той же функциональности.

## Справка {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Вы можете думать о shallowRenderer как о «месте» в которое рендерится тестируемый компонент, и из которого вы можете извлечь результат вывода этого компонента.

`shallowRenderer.render()` схож с [`ReactDOM.render()`](/docs/react-dom.html#render), но не требует DOM и рендерит всего один уровень глубины. Это означает что вы можете тестировать компоненты независимо от того, как реализованы их дочерние компоненты.

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

После того как был вызван `shallowRenderer.render()`, вы можете извлечь поверхностно отрисованный результат с помощью `shallowRenderer.getRenderOutput()`.

После этого можно начинать утверждать факты о выводе.
