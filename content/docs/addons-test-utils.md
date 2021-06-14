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

## Обзор {#overview}

`ReactTestUtils` позволяет легко тестировать React-компоненты в любом тестовом фреймворке на ваш выбор. В Facebook мы используем [Jest](https://facebook.github.io/jest/) для гладкого тестирования JavaScript-кода. Если хотите обучиться Jest, ознакомьтесь с [руководством по React](https://jestjs.io/docs/en/tutorial-react).

> Примечание:
>
<<<<<<< HEAD
> Мы рекомендуем использовать библиотеку [React Testing Library](https://testing-library.com/react), которая значительно облегчает написание тестов, имитируя поведение пользователей вашего приложения в браузере, и просто побуждает к хорошим практикам в тестировании.
>
> В качестве альтернативы, Airbnb выпустил утилиту тестирования [Enzyme](https://airbnb.io/enzyme/), которая легко позволяет делать проверки, управлять, а также просматривать выходные данные React-компонентов.
=======
> We recommend using [React Testing Library](https://testing-library.com/react) which is designed to enable and encourage writing tests that use your components as the end users do.
> 
> For React versions <= 16, the [Enzyme](https://airbnb.io/enzyme/) library makes it easy to assert, manipulate, and traverse your React Components' output.


>>>>>>> f3baa6d075c8de475b688abf035d7054bc8a9606

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
>Если вы используете пакет `react-test-renderer`, то он также предоставляет функцию `act`, которая работает аналогичным образом.

Допустим, у нас есть компонент `Counter`:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `Вы нажали на кнопку ${this.state.count} раз`;
  }
  componentDidUpdate() {
    document.title = `Вы нажали на кнопку ${this.state.count} раз`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>Вы нажали на кнопку {this.state.count} раз</p>
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

it('рендер и обновление счётчика', () => {
  // Тестируем первый рендер и метод componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Вы нажали на кнопку 0 раз');
  expect(document.title).toBe('Вы нажали на кнопку 0 раз');

  // Тестируем второй рендер и метод componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Вы нажали на кнопку 1 раз');
  expect(document.title).toBe('Вы нажали на кнопку 1 раз');
});
```

- Не забывайте, что отправка DOM-событий работает только если DOM-контейнер добавлен в `document`. Можно использовать вспомогательную библиотеку [React Testing Library](https://testing-library.com/react), чтобы уменьшить количество шаблонного кода.

- В ["рецептах"](/docs/testing-recipes.html) содержится больше примеров и деталей о том, как работает `act()`.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Передайте фиктивный модуль компонента этому методу, чтобы дополнить его полезными методами, которые позволяют использовать его в качестве фиктивного компонента React. Вместо того чтобы рендерить как обычно, компонент становится простым элементом `<div>` (или другим тегом `mockTagName`, если указан), содержащий любые предоставленные дочерние элементы.

> Примечание:
>
> API-метод `mockComponent()` объявлен устаревшим. Поэтому вместо него рекомендуется использовать [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

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

Возвращает `true`, если `instance` является пользовательским компонентом, определённым как класс или функция.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Возвращает `true`, если `instance` является компонентом, который имеет тип React `componentClass`.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Находит все компоненты в дереве `tree`, для которых `test(component)` возвращает `true`. Сам по себе он не так полезен, но используется как примитив для других тестовых утилит.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Находит все DOM-элементы компонентов в отображаемом дереве, которые являются DOM-компонентами с сопоставлением имён классов `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Работает как [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass), но ожидает, что найдётся ровно один результат, который и будет возвращён. Если ничего не будет найдено или найдётся больше одного результата, генерирует исключение.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Ищет все DOM-элементы компонентов в отображённом дереве, которые являются DOM-компонентами, и имя которых соответствует `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Также как [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) но ожидает, что найдётся ровно один результат, который и будет возвращён. Если ничего не будет найдено или найдётся больше одного результата, генерирует исключение.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Находит все экземпляры компонента, тип которых равен `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Работает так же как [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype), но ожидает, что найдётся ровно один результат, который и будет возвращён. Если ничего не будет найдено или найдётся больше одного результата, генерирует исключение.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Отображает React элемент в отдельно взятом DOM-узле документа. **Этой функции нужен DOM.** Это фактически эквивалентно:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Примечание:
>
> `window`, `window.document` и `window.document.createElement` должны быть доступными **перед** тем как вы импортируете `React`. В противном случае React будет думать что не может получить доступ к DOM и такие методы как `setState` не будут работать.

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

**Кликнуть на элемент**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Изменить значение в поле ввода, а затем эмулировать нажатие кнопки ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'жираф';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Примечание:
>
> Вам нужно будет предоставить все свойства события, которое вы используете в своём компоненте (например, keyCode, which и т.д.), поскольку React не создаёт ничего из этого.

* * *
