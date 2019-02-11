---
id: handling-events
title: Обработка событий
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

Обработка событий в React-элементах очень похожа на обработку событий в DOM-элементах. Но есть несколько синтаксических отличий:

* События в React именуются в стиле camelCase вместо нижнего регистра.
* С JSX вы передаёте функцию как обработчик события вместо строки.

Например, в HTML:

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

В React немного иначе:

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

Еще одно отличие — в React нельзя отменить событие, вернув `false`. Нужно явно вызвать `preventDefault`. Например, в обычном HTML, чтобы отменить событие у ссылки, которое открывает новую страницу, можно написать:

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

В React это будет выглядеть так:

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

Здесь `e` — это синтетическое событие. React определяет синтетические события в соответствии со [спецификацией W3C](https://www.w3.org/TR/DOM-Level-3-Events/), поэтому не волнуйтесь о кроссбраузерности. Посмотрите руководство о [`SyntheticEvent`](/docs/events.html), чтобы узнать о них больше.

При использовании React обычно нет необходимости вызывать `addEventListener`, чтобы добавить обработчики в DOM-элемент после его создания. Вместо этого просто добавьте обработчик сразу после того, как он отрендерился.

Когда вы определяете компонент, используя [ES6-класс](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes), есть общий паттерн, согласно которому обработчик события должен быть методом. Например, этот компонент `Toggle` рендерит кнопку, которая позволяет пользователю переключать состояния между «ON» и «OFF»:

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Эта привязка обязательна для работы `this` в колбэке.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

Будьте внимательны со значением `this` в JSX-колбэках. В JavaScript методы класса не [привязаны](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) по умолчанию. Если вы забудете привязать метод `this.handleClick` и передать его в `onClick`,  `this` будет `undefined` при фактическом вызове функции.

Дело не в работе React, это часть того, [как работают функции в JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). Обычно, если ссылаться на метод без `()` после него, например, `onClick={this.handleClick}`, этот метод нужно привязать.

Если вам не по душе `bind`, существует 2 способа, как сделать это иначе. Если вы пользуетесь экспериментальным [синтаксисом полей общедоступных классов](https://babeljs.io/docs/plugins/transform-class-properties/), вы можете использовать его, чтобы правильно привязать колбэки:

```js{2-6}
class LoggingButton extends React.Component {
  // Такой синтаксис гарантирует, что `this` привязан к handleClick.
  // Предупреждение: это экспериментальный синтаксис
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

Такой синтаксис доступен в [Create React App](https://github.com/facebookincubator/create-react-app) по умолчанию.

Если вы не пользуетесь синтаксисом полей, можете попробовать [стрелочные функции](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions) в колбэке:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // Такой синтаксис гарантирует, что `this` привязан к handleClick.
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

Проблема этого синтаксиса в том, что при каждом рендере `LoggingButton` создается новый колбэк. Чаще всего это не страшно. Однако, если этот колбэк попадает как проп в дочерние компоненты, эти компоненты могут быть отрендерены снова. Мы рекомендуем делать привязку в конструкторе или использовать синтаксис полей классов, чтобы избежать проблем с производительностью.

## Передача аргументов в обработчики событий {#passing-arguments-to-event-handlers}

Внутри цикла часто нужно передать дополнительный аргумент в обработчик события. Например, если `id` — это идентификатор строки, можно использовать следующие варианты:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

Две строки выше — эквивалентны, и используют [стрелочные функции](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions) и [`Function.prototype.bind`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) соответственно.

В обоих случаях аргумент `e`, представляющий событие React, будет передан как второй аргумент после ID. Используя стрелочную функцию, необходимо передавать аргумент явно, но с `bind` любые последующие аргументы передаются автоматически.
