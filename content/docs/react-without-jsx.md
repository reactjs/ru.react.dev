---
id: react-without-jsx
title: React без JSX
permalink: docs/react-without-jsx.html
---

JSX не является обязательным при работе с React. Использование React без JSX особенно удобно, когда вы не хотите настраивать транспиляцию в процессе сборки.

Каждый JSX элемент -- это просто синтаксический сахар для вызова  `React.createElement(component, props, ...children)`. Так что все, что вы можете сделать при помощи JSX, так же может быть сделано на чистом JavaScript.

Для примера -- этот кода написаный на JSX:


```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

может быть превращен в следующий код, который не использует JSX:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Если вас интересуют другие примеры того, как JSX превращается в JavaScript, вы можете попробовать [онлайн транспилятор Babel](babel://jsx-simple-example).

Компонент может быть представлен в виде строки, класса-наследника от `React.Component` или обычной функции для простых компонентов (без состояния).

Если вас сильно утомляет печатать `React.createElement`, то типовым подходом является создание сокращения для этого:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

Если вы используете эту сокращенную форму для `React.createElement`, то использование React без JSX станет почти таким же удобным, как вы привыкли.

Кроме того, вы можете посмотреть на такие открытые проекты как [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) и [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers), которые предлагают более краткий синтаксис.
