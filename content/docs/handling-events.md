---
id: handling-events
title: Обработка событий
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

<<<<<<< HEAD
Обработка событий в React-элементах очень похожа на обработку событий в DOM-элементах. Но есть несколько синтаксических отличий:
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Responding to Events](https://beta.reactjs.org/learn/responding-to-events)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


Handling events with React elements is very similar to handling events on DOM elements. There are some syntax differences:
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

* События в React именуются в стиле camelCase вместо нижнего регистра.
* С JSX вы передаёте функцию как обработчик события вместо строки.

Например, в HTML:

```html
<button onclick="activateLasers()">
  Активировать лазеры
</button>
```

В React немного иначе:

```js{1}
<button onClick={activateLasers}>
  Активировать лазеры
</button>
```

Ещё одно отличие — в React нельзя предотвратить обработчик события по умолчанию, вернув `false`. Нужно явно вызвать `preventDefault`. Например, в обычном HTML для отмены отправки формы (действие по умолчанию) можно написать:

```html
<form onsubmit="console.log('Отправлена форма.'); return false">
  <button type="submit">Отправить</button>
</form>
```

В React это будет выглядеть так:

```js{3}
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('Отправлена форма.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Отправить</button>
    </form>
  );
}
```

В приведённом выше коде `e` — это синтетическое событие. React определяет синтетические события в соответствии со [спецификацией W3C](https://www.w3.org/TR/DOM-Level-3-Events/), поэтому не волнуйтесь о кроссбраузерности. События React работают не совсем как нативные. Изучите [руководство о `SyntheticEvent`](/docs/events.html), чтобы узнать о них больше.

При использовании React обычно не нужно вызывать `addEventListener`, чтобы добавить обработчики в DOM-элемент после его создания. Вместо этого добавьте обработчик сразу после того, как элемент отрендерился.

В компоненте, определённом с помощью [ES6-класса](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes), в качестве обработчика события обычно выступает один из методов класса. Например, этот компонент `Toggle` рендерит кнопку, которая позволяет пользователю переключать состояния между «Включено» и «Выключено»:

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Эта привязка обязательна для работы `this` в колбэке.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'Включено' : 'Выключено'}
      </button>
    );
  }
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

При обращении к `this` в JSX-колбэках необходимо учитывать, что методы класса в JavaScript по умолчанию не [привязаны](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) к контексту. Если вы забудете привязать метод `this.handleClick` и передать его в `onClick`, значение `this` будет `undefined` в момент вызова функции.

Дело не в работе React, это часть того, [как работают функции в JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). Обычно, если ссылаться на метод без `()` после него, например, `onClick={this.handleClick}`, этот метод нужно привязать.


Если вам не по душе `bind`, существует два других способа. Вы можете использовать [синтаксис публичных полей класса](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes/Public_class_fields#%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B5_%D0%BF%D0%BE%D0%BB%D1%8F_%D1%8D%D0%BA%D0%B7%D0%B5%D0%BC%D0%BF%D0%BB%D1%8F%D1%80%D0%B0) чтобы правильно привязать колбэки:
```js{2-6}
class LoggingButton extends React.Component {
   // Такой синтаксис гарантирует, что `this` привязан к handleClick.
  handleClick = () => {
    console.log('значение this:', this);
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Нажми на меня
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
    console.log('значение this:', this);
  }

  render() {
    // Такой синтаксис гарантирует, что `this` привязан к handleClick.
    return (
      <button onClick={() => this.handleClick()}>
        Нажми на меня
      </button>
    );
  }
}
```

Проблема этого синтаксиса в том, что при каждом рендере `LoggingButton` создаётся новый колбэк. Чаще всего это не страшно. Однако, если этот колбэк попадает как проп в дочерние компоненты, эти компоненты могут быть отрендерены снова. Мы рекомендуем делать привязку в конструкторе или использовать синтаксис полей классов, чтобы избежать проблем с производительностью.

## Передача аргументов в обработчики событий {#passing-arguments-to-event-handlers}

Внутри цикла часто нужно передать дополнительный аргумент в обработчик события. Например, если `id` — это идентификатор строки, можно использовать следующие варианты:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Удалить строку</button>
<button onClick={this.deleteRow.bind(this, id)}>Удалить строку</button>
```

Две строки выше — эквивалентны, и используют [стрелочные функции](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions) и [`Function.prototype.bind`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) соответственно.

В обоих случаях аргумент `e`, представляющий событие React, будет передан как второй аргумент после идентификатора. Используя стрелочную функцию, необходимо передавать аргумент явно, но с `bind` любые последующие аргументы передаются автоматически.
