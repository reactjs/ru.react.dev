---
id: test-utils
title: ReactTestUtils
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Импортирование**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 с npm
```

## Обзор {#overview}

`ReactTestUtils` позволяет легко тестировать React-компоненты в любом тестовом фреймворке на ваш выбор. В Facebook мы используем [Jest](https://facebook.github.io/jest/) для безболезненного тестирования JavaScript. Если хотите обучится Jest, это можно сделать на соответствующей странице [Руководство по React](http://facebook.github.io/jest/docs/en/tutorial-react.html#content).

> Примечание:
>
> Мы рекомендуем использовать [`react-testing-library`](https://git.io/react-testing-library) которая разработана для того чтобы включать и поощерять написание тестов которые использует ваши компоненты так же как будут делать конечные пользователи.
>
> В качестве альтернативы, Airbnb выпустил утилиту тестирования [Enzyme](http://airbnb.io/enzyme/), которая легко позволяет утверждать, манипулировать, и просматривать выходные данные React компонентов.

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Справочник {#reference}

### `act()` {#act}

Чтобы подготовить компонент для тестирования, оберните код с рендерингом и выполнением обновлений внутри функции `act()`. Это сделает код теста для компонентов React более близким к тому, как он рендерится в браузере.

>Примечание:
>
>Если вы используете пакет `react-test-renderer`, то он также предоставляет функцию `act`, которая ведет себя также.

Допустим, у нас есть компонент `Counter`:

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `Ты нажал на кнопку ${this.state.count} раз`;
  }
  componentDidUpdate() {
    document.title = `Ты нажал на кнопку ${this.state.count} раз`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>Ты нажал на кнопку {this.state.count} раз</p>
        <button onClick={this.handleClick}>
          Нажми на меня
        </button>
      </div>
    );
  }
}
```

Теперь напишем тест для этого примера:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('рендер и обновление счетчика', () => {
  // Тестируем первый рендер и метод componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Ты нажал на кнопку 0 раз');
  expect(document.title).toBe('Ты нажал на кнопку 0 раз');

  // Тестируем второй рендер и метод componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Ты нажал на кнопку 1 раз');
  expect(document.title).toBe('Ты нажал на кнопку 1 раз');
});
```

Не забывайте что отправка DOM-событий работает только, когда DOM-контейнер добавлен в `document`. Можно использовать вспомогательную библиотеку [`react-testing-library`](https://github.com/kentcdodds/react-testing-library), чтобы уменьшить количество шаблонного кода.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Передаёт фиктивный модуль компонента этому методу, чтобы дополнить его полезными методами, которые позволяют использовать его в качестве фиктивного компонента React. Вместо того чтобы рендерить как обычно, компонент становится простым `<div>` (или другим тегом `mockTagName` если указан) содержащий любые предоставленные дочерние элементы.

> Примечание:
>
> API-метод `mockComponent()` объявлен устаревшим. Поэтому вместо него рекомендуется использоваться [поверхностный рендеринг](/docs/shallow-renderer.html) или [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Возвращает `true`, если `element` любой React-элемент.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Возвращает `true`, если `element` является элементом React, тип которого имеет тип React `componentClass`.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Возвращает `true`, если `instance` является DOM-компонентом (таким как `<div>` или `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Returns `true` if `instance` is a user-defined component, such as a class or a function.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Возвращает `true` если `instance` является компонентом, тип которого React `componentClass`.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Проходит по всем компонентам в `tree` и собирает все компоненты где условие `test(component)` является `true`. Сам по себе он не так полезен, но используется как примитив для других тестовых утилит.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Находит все DOM-элементы компонентов в отображаемом дереве, которые являются DOM-компонентами с сопоставлением имен классов `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Подобно [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) но ожидает, что будет один результат, и возвращает этот один результат, или выдает исключение, если есть любое другое число совпадений, кроме одного.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Находит все DOM-элементы компонентов в дереве рендера, которые являются DOM-компонентами с соответствием имени тега `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Также как [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) но ожидает, что будет один результат, и возвращает этот один результат, или выдает исключение, если есть любое другое число совпадений, кроме одного.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Находит все объекты компонента с указаным типа класса  `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Работает так же как [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) но ожидает, что будет один результат, и возвращает этот один результат, или выдает исключение, если есть любое другое число совпадений, кроме одного..

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Рендер React элемента в отдельно взятом DOM-ноде в документе. **Этой функции нужен DOM.** Это фактически эквивалентно:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Примечание:
>
> `window`, `window.document` и `window.document.createElement` должны быть доступными **перед** тем как вы импортируете `React`. В противном случае React будет думать что не может получить доступ к DOM, и такие методы как `setState` не будут работать.

* * *

## Другие утилиты {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Симулировать отправку события сработавшего на DOM-узле с дополнительным объектом `eventData`.

`Simulate` имеет метод для [каждого события, которое React может понимать](/docs/events.html#supported-events).

**Кликать на элемент**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Меняет значение в поле ввода и затем симулирует нажатие кнопки ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'жираф';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Примечание:
>
> Вам нужно будет предоставить все свойства события, которое вы используете в своем компоненте (например, keyCode, which и так далее), поскольку React не создаёт ничего из этого.

* * *
