---
id: react-without-es6
title: React без ES6
permalink: docs/react-without-es6.html
---

Обычно компонент React определяется как простой JavaScript-класс:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Если вы ещё не работаете с ES6, то можете использовать модуль `create-react-class`:

```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

API ES6-классов похож на `createReactClass()` за некоторыми исключениями.

## Объявление свойств компонента {#declaring-default-props}

С помощью функций и классов ES6 `defaultProps` определяется как свойство самого компонента:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

При использовании `createReactClass()` вам нужно определить метод `getDefaultProps()` в переданном объекте:

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## Установка начального состояния {#setting-the-initial-state}

В ES6-классах вы можете определять начальное состояние через `this.state` в конструкторе:

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

При использовании `createReactClass()` вам придётся отдельно реализовать метод `getInitialState`, который возвращает начальное состояние:

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Автоматическая привязка {#autobinding}

В компонентах React, объявленных как классы ES6, методы следуют той же семантике, что и обычные классы ES6. Это означает, что они сами по себе не связывают `this` с экземпляром. Вам придётся явно использовать `.bind(this)` в конструкторе:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // Эта строка важна!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Мы можем использовать `this.handleClick` как обработчик событий, потому что он привязан
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Если вы используете `createReactClass()`, то это необязательно, так как все методы будут связаны:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

Это означает, что классы ES6 пишутся с чуть более универсальным кодом для обработчиков событий, при этом производительность громоздких приложений немного выше.

Если универсальный код для вас слишком неприглядный, вы можете включить **экспериментальный** [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/) синтаксис от Babel:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // ВНИМАНИЕ! Этот синтаксис экспериментальный!
  // Здесь стрелочная функция выполняет привязку:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

Обратите внимание, что приведённый выше синтаксис является **экспериментальным** и может измениться, возможно это предложение не станет стандартом.

Если вы предпочитаете безопасный вариант, у вас их несколько:

* Привязывайте методы в конструкторе.
* Используйте стрелочные функции, напр. `onClick={(e) => this.handleClick(e)}`.
* Продолжайте использовать `createReactClass`.

## Примеси {#mixins}

>**Примечание:**
>
>ES6 запущен без поддержки примесей. Поэтому нет никакой поддержки примесей когда вы используете React с классами ES6.
>
>**Кроме того, мы нашли множество проблем в кодовых базах, используя примеси, [и не рекомендуем использовать их в коде](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Этот раздел существует только для справки.

Иногда очень разные компоненты могут иметь общую функциональность. Иногда это называют [cквозной функциональностью](https://en.wikipedia.org/wiki/Cross-cutting_concern). `createReactClass` позволяет использовать для этого устаревшую систему `mixins`.

Одним из распространенных вариантов использования — когда вы собираетесь обновлять компонент через какой-то промежуток времени. Можно просто использовать `setInterval()`, но важно отменить процесс, когда он больше не нужен, для экономии памяти. React предоставляет [методы жизненного цикла](/docs/react-component.html#the-component-lifecycle), которые позволяют узнать, когда компонент будет создан или уничтожен. Давайте создадим простую примесь, которое использует эти методы, для простой функции `setInterval()`, чтобы автоматически очищать мусор при удалении вашего компонента.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Использовать примесь
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Вызвать метод на примеси
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

Если компонент использует несколько примесей и они определяют один и тот же метод жизненного цикла (т.е. хотят выполнить некоторую очистку при уничтожении компонента), все методы жизненного цикла гарантированно будут вызваны. Методы, определённые на примесях, запускаются по порядку, после вызова метода на компоненте.
