---
id: react-without-jsx
title: React без JSX
permalink: docs/react-without-jsx.html
---

JSX не является обязательным для работы с React. React можно использовать без JSX. Это особенно удобно, когда вы не хотите настраивать транспиляцию в процессе сборки.

Каждый JSX-элемент -- это просто синтаксический сахар для вызова `React.createElement(component, props, ...children)`. Так что всё, что вы можете сделать при помощи JSX, может быть сделано на чистом JavaScript.

Например, вот код с JSX:


```js
class Hello extends React.Component {
  render() {
    return <div>Привет, {this.props.toWhat}</div>;
  }
}

<<<<<<< HEAD
ReactDOM.render(
  <Hello toWhat="мир" />,
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />);
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e
```

Он может быть превращён в код без JSX:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Привет, ${this.props.toWhat}`);
  }
}

<<<<<<< HEAD
ReactDOM.render(
  React.createElement(Hello, {toWhat: 'мир'}, null),
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Hello, {toWhat: 'World'}, null));
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e
```

Если вас интересуют другие примеры того, как JSX превращается в JavaScript, вы можете попробовать [онлайн-компилятор Babel](babel://jsx-simple-example).

Компонент может быть представлен в виде строки, класса-наследника от `React.Component` или обычной функции.

Если вас утомляет печатать `React.createElement`, то распространённой практикой является создать сокращение:

```js
const e = React.createElement;

<<<<<<< HEAD
ReactDOM.render(
  e('div', null, 'Привет, мир!'),
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e
```

Если вы примените эту сокращённую форму для `React.createElement`, то использование React без JSX станет почти таким же удобным, как вы привыкли.

Кроме того, вы можете посмотреть на такие проекты как [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) и [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers), которые предлагают короткий синтаксис.
