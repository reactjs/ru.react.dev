---
id: test-utils
title: Утилиты для тестирования
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Импортирование**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 с npm
```

## Беглый обзор {#overview}

`ReactTestUtils` позволяет легко тестировать Реакт компоненты в любом тестовом фреймворке на ваш выбор. В Фейсбуке мы используем [Джест](https://facebook.github.io/jest/) для безболезненного тестирования Джаваскрипта. Если хотите обучится Джесту это можно сделать на сайте Джеста на странице [Руководство по Реакту](http://facebook.github.io/jest/docs/en/tutorial-react.html#content).

> На заметку:
>
> Мы рекомендуем использовать [`react-testing-library`](https://git.io/react-testing-library) которая разработана для того чтобы включать и поощерять написание тестов которые использует ваши компоненты так же как будут делать конечные пользователи.
>
> В качестве альтернативы, Эйр-би-энд-би выпустили утилиту для тестирования называющейся [Энзайм](http://airbnb.io/enzyme/), которая легко позволяет утверждать, манипулировать, и просматривать выходные данные Реакт компонентов.

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

## Справка {#reference}

### `act()` {#act}

Готовя компонент для тестирования, оберните код для рендера и выполняйте обновления внутри функции `act()`. Это сделает ваш код Реакта наиболее достоверным к тому как он работает в браузере.

>На заметку
>
>Если вы используете `react-test-renderer`, этот модуль предоставляет экспортировать `act` функцию который будет вести также.

Допустим у нас есть `Counter` компонент:

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

Теперь посмотрим как мы напишем тест для этого примера:

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

Не забывайте что отправка DOM-событий работает только когда DOM-контейнер добавлен в `document`. Можно использовать хелпер [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) чтобы разбавить шаблонный код.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Pass a mocked component module to this method to augment it with useful methods that allow it to be used as a dummy React component. Instead of rendering as usual, the component will become a simple `<div>` (or other tag if `mockTagName` is provided) containing any provided children.

> Note:
>
> `mockComponent()` is a legacy API. We recommend using [shallow rendering](/docs/test-utils.html#shallow-rendering) or [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) instead.

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Returns `true` if `element` is any React element.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Returns `true` if `element` is a React element whose type is of a React `componentClass`.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Returns `true` if `instance` is a DOM component (such as a `<div>` or `<span>`).

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

Returns `true` if `instance` is a component whose type is of a React `componentClass`.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Traverse all components in `tree` and accumulate all components where `test(component)` is `true`. This is not that useful on its own, but it's used as a primitive for other test utils.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Finds all DOM elements of components in the rendered tree that are DOM components with the class name matching `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Like [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) but expects there to be one result, and returns that one result, or throws exception if there is any other number of matches besides one.

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

Рендер Реакт элемента в отдельно взятом DOM-ноде в документе. **Этой функции нужен DOM.** Это фактически эквивалентно:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> На заметку:
>
> Вам нужно будет иметь глобально доступные переменные `window`, `window.document` и `window.document.createElement` **перед** тем как вы импортируете `React`. В противном случае React будет думать что не может иметь доступ DOM и такие методы как `setState` не будут работать.

* * *

## Другие утилиты {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Симулировать отправку события на DOM-ноде с допольнительным объектом `eventData`.

`Simulate` имеет методы для [каждого события который Реакт может понимать](/docs/events.html#supported-events).

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

> На заметку
>
> Вам нужно будет предоставить соответсвующие свойства события, которое вы используете в своем компоненте (например, keyCode, which и так далее), поскольку React не создает ничего из этого.

* * *
