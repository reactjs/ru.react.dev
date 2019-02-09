---
id: state-and-lifecycle
title: Состояние и жизненный цикл
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

На этой странице представлена концепция "состояния" (state) и "жизненного цикла" (lifecycle) компонентов React. Подробная [документация API компонента доступна по ссылке](/docs/react-component.html) .

В качестве примера рассмотрим бегущие часы из [предыдущего раздела](/docs/rendering-elements.html#updating-the-rendered-element). В разделе [Рендeринг элементов](/docs/rendering-elements.html#rendering-an-element-into-the-dom) мы изучили лишь один способ обновления UI - вызвать `ReactDOM.render()` для изменения результата отрисовки (рендеринга):

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Попробовать на CodePen**](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

В этом разделе мы узнаем, как инкаспулировать и обеспечить многократное использование компонента `Clock`. Компонент будет самостоятельно инициировать свой собственный таймер и будет самообновляться раз в секунду.

Начнем с инкапсуляции кода ответственного за вывод строки с текущим временем в функциональный компонент `Clock`:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Попробовать на CodePen**](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Обратите внимание, что инциирование таймера и ежесекундное обновление интерфейса не является внутренней деталью реализации компонента `Clock`, а это одно из ключевых требований.

В идеале мы бы хотели имплементировать `Clock` таким образом, чтобы компонент сам себя обновлял:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Для этого добавим так называемое "состояние" (state) в компонент `Clock`.

"Состояние" очень похоже на уже знакомые нам пропс (props), отличие в том, что состояние контролируется и доступно только конкретному компоненту.

Мы [уже упоминали](/docs/components-and-props.html#functional-and-class-components), что класс-компоненты обладают дополнительными свойствами. Локальное "состояние" — это одно из таких свойств, которое доступно только класс-компнентам.

## Преобразование функции в класс {#converting-a-function-to-a-class}

Давайте преобразуем функциональный компонент `Clock` в класс-компонент в 5 этапов:

1. Создаем [ES6-класс](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes) с таким же именем, указываем `React.Component` в качестве родительского класса

2. Добавим в класс пустой метод `render()`

3. Перенесем тело функции в метод `render()`

4. Заменим `props` на `this.props` в теле `render()`

5. Удалим оставшееся пустое объявление функции


```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Попробовать на CodePen**](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` теперь определён как класс, а не функция.


Метод `render` будет вызываться каждый раз, когда происходит обновление. Так как мы отрисовываем `<Clock />` в один и тот же DOM-контейнер, мы используем единственный экземпляр класса `Clock` - поэтому мы можем задействовать внутреннее состояние и хуки жизненного цикла.

## Добавление локального состояния в класс {#adding-local-state-to-a-class}

Переместим `date` из пропс в состояние в три этапа:

1) Заменим `this.props.date` на `this.state.date` в методе `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Добавим [конструктор класса](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes#Constructor), в котором укажем начальное состояние в переменной `this.state`:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Обратите внимание, что мы передаём `props` базовому (родительскому) конструктору:


```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Класс-компоненты всегда должны вызывать базовый конструктор с передачей ему `props`.

3) Удалим проп `date` из элемента `<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Позже мы вернем код таймера обратно в компонент.

Результат выглядит следующим образом:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Попробовать на CodePen**](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Следущий этап - добавить в `Clock` инициализацию собственного таймера с обновлением каждую секунду.

## Добавление методов жизненного цикла в класс {#adding-lifecycle-methods-to-a-class}

В приложениях с множеством компонентов очень важно освобождать используемые системные ресурсы при удалении компонентов.

Мы называем "монтированием" (установкой) первоначальный рендеринг `Clock` в DOM. Наша цель - [инициировать таймер](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) всякий раз, когда это происходит.

Каждый раз когда DOM-узел, созданный `Clock`, удаляется, просходит то, что мы называем "размонтирование". Учитывая важность сохранения ресурсов, мы [сбросим таймер](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) при каждой "размонтировке".

Давайте объявим специальные методы которые вызываются когда компонент устанавливается (монтируется) или удаляется (размонтируется):

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Эти методы называются "хуками (методами) жизненного цикла" (lifecycle methods).

Хук `componentDidMount()` запускается после того, как компонент отрендерился в DOM - это подходящее место для инициализирования таймера:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Обратите внимание, что мы сохраняем ID таймера в `this`.

В класс-компонентах `this.props` инициализируется самим React, так же как и `this.state` - у этих полей особое назначение. Однако, если вам нужно сохранить информацию, которая не является частью процесса обработки данных React, можно вручную добавить дополнительные поля в класс (например, ID таймера).

Удалим таймер в хуке жизненного цикла `componentWillUnmount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Наконец, реализуем метод `tick()` - он запускается таймером каждую секунду и использует `this.setState()`, который планирует обновление внутреннего состояния компонента:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Попробовать на CodePen**](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

Результат - часы обновляются каждую секунду.

Давайте рассмотрим наше решение и разберем порядок, в котором вызываются методы:

1) Когда мы передаём `<Clock />` в `ReactDOM.render()`, React вызывает конструктор компонента. `Clock` должен отображать текущее время, поэтому мы задаем начальное состояние `this.state` объектом, включающим текущее время.

2) React вызывает метод `render()` компонента `Clock`. Таким образом React узнаёт, что отобразить на экране. Далее, React обновляет DOM так, чтобы он соответствовал выводу ренедера `Clock`.

3) Как только вывод рендера `Clock` вставлен в DOM, React вызывает хук жизненного цикла `componentDidMount()`. Внутри него компонент `Clock` указывает браузеру инициализировать таймер, который будет вызывать метод компонента `tick()` раз в секунду.

4) Таймер вызывает метод `tick()` ежесекундно. Часть метода - вызов `setState()` с объектом, содержащим текущее время в качестве аргумента - таким образом компонент `Clock` планирует обновление UI. Благодаря вызову `setState()` React знает, что состояние изменилось, и снова вызывает метод `render()`, чтобы узнать, что должно отображаться на экране. На этот раз `this.state.date` в методе `render()` будет другим, и поэтому вывод отрисованного компонента будет включать обновлённое время и React соответственно обновит DOM.

5) Если компонент `Clock` когда-либо удаляется из DOM, React вызывает хук жизненного цикла `componentWillUnmount()`, таким образом таймер будет остановлен и удален.

## Правильное использование состояния {#using-state-correctly}

Важно знать три детали о правильно применении `setState()`.

### Не изменяйте состояние напрямую {#do-not-modify-state-directly}

В следующем примере повторной отрисовки компонента не происходит:

```js
// Неправильно
this.state.comment = 'Hello';
```

Вместо этого используйте `setState()`:

```js
// Правильно
this.setState({comment: 'Hello'});
```

Конструктор — это единственное место, где вы можете присвоить значение `this.state` напрямую.

### Обновления состояния могут быть асинхронными {#state-updates-may-be-asynchronous}

React может произвольно решить сгруппировать несколько вызовов `setState()` в одно обновление для улучшения производительности.

Поскольку `this.props` и `this.state` могут обновляться асинхронно, вы не должны полагаться на их текущее значение для вычисления следующего состояния.

Например, следующий код может не обновить счётчик:

```js
// Неправильно
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Правильно будет использовать второй вариант вызова `setState()`, который принимает функцию, а не объект. Эта функция получит предыдущее состояние в качестве первого аргумента и значения пропс непосредственно во время обновления в качестве второго аргумента:

```js
// Правильно
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

В данном примере мы использовали [стрелочную функцию](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions), но можно использовать и обычные функции:

```js
// Правильно
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Обновления состояния объединяются {#state-updates-are-merged}

Когда мы вызываем `setState()`, React объеденит аргумент (новое состояние), c текущим состоянием.

Например, состояние может состоять из нескольких независимых полей:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Можете их независимо обновлять с помощью отдельных вызовов `setState()`:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

Слияние состояния - поверхностное, поэтому вызов `this.setState({comments})` оставляет `this.state.posts` нетронутым, но полностью заменяет `this.state.comments`.

## Однонаправленный поток данных {#the-data-flows-down}

В иерархии компонентов, ни родительский, ни дочерние компоненты не знают задано (stateful) или нет (stateless) состояние определенного компонента. Так же им не важно, как был создан определенный компонент - с помощью функцим или класса. В связи с этим, состояние часто называют "локальным", "внутренним" или инкапсулированным. Оно недоступно для любого другого компонента, за исключением того, который им владеет и устанавливает его.

Компонент может передать своё состояние вниз по дереву компонентов в виде пропс для его дочерних компонентов:

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

Это также верно для пользовательских компонентов:

```js
<FormattedDate date={this.state.date} />
```

Компонент `FormattedDate` получает `date` через пропс но не знает, является ли первоисточником состояние `Clock`, пропс `Clock` или оно было передано напрямую:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Попробовать на CodePen**](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

Этот процесс называется "сверху вниз" ("top-down") потоком данных или "однонаправленным" ("unidirectional") потоком данных. Состояние всегда принадлежит определённому компоненту, а любые производные этого состояния могут влиять только на компоненты, находящиеся «ниже» в дереве компонентов.

Если представить иерархию компонентов как водопад пропс, то состояние каждого компонента похоже на дополнительный источник, который сливается с водопадом в произвольной точке, но также течёт вниз.

Чтобы показать, что все компоненты действительно изолированы, создадим компонент `App`, который отрисовывает три компонента `<Clock>`:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Попробовать на CodePen**](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

У каждого компонента `Clock` есть собственное состояние таймера, которое обновляется независимо от других компонентов.

В React-приложениях, имеет ли компонент состояние или нет — это внутренняя деталь реализации компонента, которая может меняться со временем. Можно использовать компоненты без состояния в компонентах с состоянием, и наоборот.