---
id: react-without-es6
title: React без ES6
permalink: docs/react-without-es6.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.

</div>

Обычно компонент React определяется как простой JavaScript-класс:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Привет, {this.props.name}</h1>;
  }
}
```

Если вы ещё не работаете с ES6, то можете использовать модуль `create-react-class`:

```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Привет, {this.props.name}</h1>;
  }
});
```

API ES6-классов похож на `createReactClass()` за некоторыми исключениями.

## Объявление пропсов по умолчанию {#declaring-default-props}

С помощью функций и классов ES6 `defaultProps` определяется как свойство самого компонента:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Василиса'
};
```

При использовании `createReactClass()` вам нужно определить метод `getDefaultProps()` в переданном объекте:

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Василиса'
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
    this.state = {message: 'Привет!'};
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
        Поздороваться
      </button>
    );
  }
}
```

Если вы используете `createReactClass()`, то это необязательно, так как все методы будут связаны:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Привет!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Поздороваться
      </button>
    );
  }
});
```

Это означает, что ES6-классы пишутся с чуть большим количеством однообразного кода для обработчиков событий, зато производительность громоздких приложений немного возрастает.

Если универсальный код для вас слишком неприглядный, вы можете использовать [свойства классов из ES2022](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes/Public_class_fields#%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B5_%D0%BF%D0%BE%D0%BB%D1%8F_%D1%8D%D0%BA%D0%B7%D0%B5%D0%BC%D0%BF%D0%BB%D1%8F%D1%80%D0%B0) syntax:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Привет!'};
  }
  // Здесь стрелочная функция выполняет привязку:
  handleClick = () => {
    alert(this.state.message);
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Поздороваться
      </button>
    );
  }
}
```

Существует несколько других вариантов:

* привязывайте методы в конструкторе.
* используйте стрелочные функции, например, `onClick={(e) => this.handleClick(e)}`.
* продолжайте использовать `createReactClass`;

## Примеси {#mixins}

>**Примечание:**
>
>ES6 запущен без поддержки примесей. Поэтому React не поддерживает примеси с классами ES6.
>
>**Кроме того, мы нашли множество проблем в кодовых базах, используя примеси, [и не рекомендуем использовать их в коде](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Этот раздел существует только для справки.

Иногда очень разные компоненты могут иметь общую функциональность. Иногда это называют [сквозной функциональностью](https://en.wikipedia.org/wiki/Cross-cutting_concern). `createReactClass` позволяет использовать для этого устаревшую систему `mixins`.

Одним из распространённых вариантов использования — когда вы собираетесь обновлять компонент через какой-то промежуток времени. Можно просто использовать `setInterval()`, но важно отменить процесс, когда он больше не нужен, чтобы сэкономить память. React предоставляет [методы жизненного цикла](/docs/react-component.html#the-component-lifecycle), которые позволяют узнать, когда компонент будет создан или уничтожен. Давайте применим эти методы и создадим небольшую примесь, которая предоставляет функцию `setInterval()` и автоматически очищает мусор, когда компонент уничтожается.

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
        React был выполнен за {this.state.seconds} секунд.
      </p>
    );
  }
});

const root = ReactDOM.createRoot(document.getElementById('example'));
root.render(<TickTock />);
```

Если компонент использует несколько примесей и они определяют один и тот же метод жизненного цикла (т.е. хотят выполнить некоторую очистку при уничтожении компонента), все методы жизненного цикла гарантированно будут вызваны. Методы, определённые на примесях, запускаются в том порядке, в котором они перечислены, а затем вызывается метод самого компонента.
