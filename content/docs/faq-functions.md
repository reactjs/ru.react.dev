---
id: faq-functions
title: Передача функций в компоненты
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### Как передать обработчик события (например, onClick) компоненту? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

Передавайте обработчики событий и другие функции через пропсы дочерним компонентам:

```jsx
<button onClick={this.handleClick}>
```

Если вы хотите иметь доступ к компоненту-родителю через обработчик, вам нужно привязать функцию к экземпляру компонента (см. ниже).  

### Как привязать функцию к экземпляру компонента? {#how-do-i-bind-a-function-to-a-component-instance}

В зависимости от того, какой синтаксис и подход к созданию компонентов вы используете, существует несколько способов удостовериться, что функции имеют доступ к таким атрибутам компонента, как `this.props` и `this.state`.

#### Привязка в конструкторе (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### Привязка в свойствах класса (Этап 3: кандидаты) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Примечание: данный синтаксис находится на стадии разработки и еще не стандартизирован.
  handleClick = () => {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### Привязка в методе render() {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>;
  }
}
```

>**Примечание:**
>
>Использование `Function.prototype.bind` в render() создаёт новую функцию при каждой отрисовке компонента, что может повлиять на производительность (см. ниже).

#### Стрелочная функция в render() {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Click Me</button>;
  }
}
```

>**Примечание:**
>
>Использование стрелочной функции в render() создаёт новую функцию при каждой отрисовке компонента, что может повлиять на производительность (см. ниже).

### Можно ли использовать стрелочные функции в методе render()? {#is-it-ok-to-use-arrow-functions-in-render-methods}

В целом, да. Зачастую это самый простой способ передать параметры через колбэки.

Если же у вас возникли проблемы с производительностью — оптимизируйте! 

### Зачем вообще нужна привязка? {#why-is-binding-necessary-at-all}

В JavaScript эти два фрагмента кода **не** равнозначны:

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Привязка гарантирует, что второй фрагмент будет работать так же, как и первый. 

В React, как правило, привязывать нужно только те методы, которые вы *хотите передать* другим компонентам. Например, `<button onClick={this.handleClick}>` передаёт `this.handleClick`, поэтому его нужно привязать. Впрочем, метод `render` и методы жизненного цикла привязывать не обязательно, так как мы не передаём их в другие компоненты.

[Ознакомьтесь со статьей Йехуды Катц](http://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), которая более подробно объясняет, что такое привязка, и как работают функции в JavaScript.

### Почему моя функция вызывается каждый раз при отрисовке компонента? {#why-is-my-function-being-called-every-time-the-component-renders}

Убедитесь, что вы не _вызываете функцию_, когда передаёте ее компоненту:

```jsx
render() {
  // Неправильно: вместо ссылки, функция handleClick была вызвана!
  return <button onClick={this.handleClick()}>Click Me</button>
}
```

Вместо этого, *просто передайте функцию* (без скобок):

```jsx
render() {
  // Правильно: handleClick передаётся как ссылка!
  return <button onClick={this.handleClick}>Click Me</button>
}
```

### Как передать параметры обработчику событий или колбэку? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Чтобы передать параметры обработчику событий, оберните его в стрелочную функцию:

```jsx
<button onClick={() => this.handleClick(id)} />
```

Это действие равно использованию `.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Пример: Передача параметров с использованием стрелочных функций {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // ASCII код символа

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Пример: Передача параметров с использованием атрибутов данных {#example-passing-params-using-data-attributes}

В качестве альтернативного подхода вы можете использовать DOM API, чтобы хранить необходимые для обработчиков событий данные. Рассмотрите этот подход, если вам нужно оптимизировать большое количество элементов или использовать дерево визуализации, полагающееся на компонент React.PureComponent для проверки на равенство.

```jsx
const A = 65 // ASCII-код символа

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### Как предотвратить слишком быстрый или слишком частый вызов функции? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

Если вы используете обработчики событий, такие как `onClick`  или `onScroll`, и хотите предотвратить быстрое срабатывание колбэков, вы можете ограничить скорость выполнения колбэка. Для этого вы можете использовать: 

- **throttling**: выборочные изменения, зависимые от частоты, основанной на времени (напр. [`_.throttle`](https://lodash.com/docs#throttle))
- **debouncing**: изменения, задействованные после некого периода бездействия (напр. [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame` throttling**: выборочные изменения, основанные на [`requestAnimationFrame`](https://developer.mozilla.org/ru/docs/DOM/window.requestAnimationFrame) (напр. [`raf-schd`](https://github.com/alexreardon/raf-schd))

Взгляните на [данную визуализацию](http://demo.nimius.net/debounce_throttle/), где сравниваются функции `throttle` и `debounce`.

> Примечание:
>
> `_.debounce`, `_.throttle` и `raf-schd` предусматривают метод `cancel` для отмены отложенных колбэков. Вы должны либо вызвать этот метод из componentWillUnmount, _либо_ удостоверится, что компонент все еще встроен в пределах отложенной функции.

#### Throttle {#throttle}

Тротлинг предотвращает повторный вызов функции в заданный период времени. Этот метод был задействован в примере ниже, чтобы не допустить вызов обработчика "click" чаще чем раз в секунду.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

Дебаунсинг гарантирует, что функция не будет выполняться до тех пор, пока не пройдёт определённое количество времени с момента её последнего вызова. Этот метод пригодится, если вам нужно провести ресурсоёмкий расчёт в ответ на событие, которое может быстро повториться (например, прокрутка страницы или нажатие клавиш). В примере ниже для ввода текста используется задержка в 250 мс.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    // React помещает события в пул, поэтому значение считывается перед debounce.
    // В качестве альтернативы мы могли бы вызвать `event.persist()` и передать событие целиком.
    // Более подробно тема рассматривается здесь: reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/ru/docs/DOM/window.requestAnimationFrame) — это способ организации очереди функции, которая будет выполнена в браузере за оптимальное время для производительности отрисовки. Функция, поставленная в очередь с помощью `requestAnimationFrame`, запустится в следующем кадре. Браузер приложит все усилия, чтобы обеспечить 60 кадров в секунду (60 fps — frames per second). Однако, если браузер не в состоянии справиться с этой задачей, он естественным образом *ограничит* количество кадров в секунду. Например, если ваше устройство поддерживает только 30 fps, то и получите вы только 30 кадров. Использование `requestAnimationFrame` для тротлинга является очень полезным методом, так как помогает предотвратить выполнение более 60 обновлений в секунду. Если вы выполняете 100 обновлений в секунду, это создает лишнюю работу для браузера, которую пользователь все равно не заметит. 

>**Примечание:**
>
>Использование этой техники захватит только последнее опубликованное значение в кадре. Пример работы данной оптимизации вы можете увидеть на [`MDN`](https://developer.mozilla.org/ru/docs/Web/Events/scroll)

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Создаем новую функцию для планирования обновлений.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // Планируем обновление при активизации события прокрутки.
    // Если в рамках кадра мы получаем много обновлений, публикуем только последнее значение.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Отменяем любые ожидающие обновления, так как компонент будет демонтирован.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Тестирование ограничения скорости {#testing-your-rate-limiting}

Когда тестирование вашего кода ограничения скорости работает правильно, было бы полезно иметь возможность прокрутить время. Если вы используете [`jest`](https://facebook.github.io/jest/), то для этого вам может пригодиться [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html). Если вы используете `requestAnimationFrame`, то [`raf-stub`](https://github.com/alexreardon/raf-stub) может оказаться полезным инструментом для управления смены кадров анимации.
