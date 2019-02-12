---
id: state-and-lifecycle
title: Состояние и жизненный цикл
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

На этой странице представлены понятия «состояние» (state) и «жизненный цикл» (lifecycle) React-компонентов. Подробный [справочник API компонентов находится по этой ссылке](/docs/react-component.html).

В качестве примера рассмотрим идущие часы из [предыдущего раздела](/docs/rendering-elements.html#updating-the-rendered-element). В главе [Рендeринг элементов](/docs/rendering-elements.html#rendering-an-element-into-the-dom) мы научились обновлять UI только одним способом — вызовом `ReactDOM.render()`:

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Привет, мир!</h1>
      <h2>Сейчас {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

В этой главе мы узнаем, как инкапсулировать и обеспечить многократное использование компонента `Clock`. Компонент самостоятельно установит свой собственный таймер и будет обновляться раз в секунду.

Для начала, извлечём компонент, показывающий время:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Привет, мир!</h1>
      <h2>Сейчас {props.date.toLocaleTimeString()}.</h2>
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

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Проблема в том, что компонент `Clock` не обновляет себя каждую секунду автоматически. Хотелось бы спрятать логику, управляющую таймером, внутри самого компонента `Clock`.

В идеале мы бы хотели реализовать `Clock` таким образом, чтобы компонент сам себя обновлял:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Для этого добавим так называемое «состояние» (state) в компонент `Clock`.

«Состояние» очень похоже на уже знакомые нам пропсы, отличие в том, что состояние контролируется и доступно только конкретному компоненту.

Мы [уже упоминали](/docs/components-and-props.html#functional-and-class-components), что классовые компоненты обладают дополнительными способностями. Локальное «состояние» — одна из таких способностей, которое доступно только классовым компнентам.

## Преобразование функции в класс {#converting-a-function-to-a-class}

Давайте преобразуем функциональный компонент `Clock` в классовый компонент за 5 шагов:

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
        <h1>Привет, мир!</h1>
        <h2>Сейчас {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

Теперь `Clock` определён как класс, а не функция.

Метод `render` будет вызываться каждый раз, когда происходит обновление. Так как мы рендерим `<Clock />` в один и тот же DOM-контейнер, мы используем единственный экземпляр класса `Clock` — поэтому мы можем задействовать внутреннее состояние и методы жизненного цикла.

## Добавим локальное состояния в класс {#adding-local-state-to-a-class}

Переместим `date` из пропсов в состояние в три этапа:

1) Заменим `this.props.date` на `this.state.date` в методе `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Привет, мир!</h1>
        <h2>Сейчас {this.state.date.toLocaleTimeString()}.</h2>
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
        <h1>Привет, мир!</h1>
        <h2>Сейчас {this.state.date.toLocaleTimeString()}.</h2>
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

Классовые компоненты всегда должны вызывать базовый конструктор с агрументом `props`.

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
        <h1>Привет, мир!</h1>
        <h2>Сейчас {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Теперь осталось только установить собственный таймер внутри `Clock` и обновлять компонент каждую секунду.

## Добавим методы жизненного цикла в класс {#adding-lifecycle-methods-to-a-class}

В приложениях с множеством компонентов очень важно освобождать используемые системные ресурсы когда компоненты удаляются.

Первоначальный рендеринг компонента в DOM называется «монтирование» (mounting). Нам нужно [устанавливать таймер](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) всякий раз, когда это происходит.

Каждый раз когда DOM-узел, созданный компонентом, удаляется, просходит «размонтирование» (unmounting). Чтобы избежать утечки ресурсов, мы будем [сбрасывать таймер](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) при каждом «размонтировании».

Объявим специальные методы, которые компонент будет вызывать при монтировании и размонтировании:

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
        <h1>Привет, мир!</h1>
        <h2>Сейчас {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Эти методы называются «методами жизненного цикла» (lifecycle methods).

Метод `componentDidMount()` запускается после того, как компонент отрендерился в DOM — здесь мы и установим таймер:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Обратите внимание, что мы сохраняем ID таймера в `this`.

Поля `this.props` и `this.state` в классах особенные, и их устанавливает сам React. Вы можете вручную добавить новые поля, если компоненту нужно хранить дополнительную информацию (например, ID таймера).

Теперь нам осталось сбросить таймер в методе жизненного цикла `componentWillUnmount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Наконец, реализуем метод `tick()`. Он запускается таймером каждую секунду и вызывает `this.setState()`.

`this.setState()` планирует обновление внутреннего состояния компонента:

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
        <h1>Привет, мир!</h1>
        <h2>Сейчас {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

Теперь часы обновляются каждую секунду.

Давайте рассмотрим наше решение и разберём порядок, в котором вызываются методы:

1) Когда мы передаём `<Clock />` в `ReactDOM.render()`, React вызывает конструктор компонента. `Clock` должен отображать текущее время, поэтому мы задаем начальное состояние `this.state` объектом с текущим временем.

2) React вызывает метод `render()` компонента `Clock`. Таким образом React узнаёт, что отобразить на экране. Далее, React обновляет DOM так, чтобы он соответствовал выводу рендера `Clock`.

3) Как только вывод рендера `Clock` вставлен в DOM, React вызывает метод жизненного цикла `componentDidMount()`. Внутри него компонент `Clock` указывает браузеру установить таймер, который будет вызывать `tick()` раз в секунду.

4) Таймер вызывает `tick()` ежесекундно. Внутри `tick()` мы просим React обновить состояние компонента, вызывая `setState()` с текущим временем. React реагирует на изменение состояния и снова запускает `render()`. На этот раз `this.state.date` в методе `render()` содержит новое значение, поэтому React заменит DOM. Таким образом компонент `Clock` каждую секунду обновляет UI.

5) Если компонент `Clock` когда-либо удалится из DOM, React вызовет метод жизненного цикла `componentWillUnmount()` и сбросит таймер.

## Как правильно использовать состояние {#using-state-correctly}

Важно знать три детали о правильном применении `setState()`.

### Не изменяйте состояние напрямую {#do-not-modify-state-directly}

В следующем примере повторного рендера не происходит:

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

React может сгруппировать несколько вызовов `setState()` в одно обновление для улучшения производительности.

Поскольку `this.props` и `this.state` могут обновляться асинхронно, вы не должны полагаться на их текущее значение для вычисления следующего состояния.

Например, следующий код может не обновить счётчик:

```js
// Неправильно
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Правильно будет использовать второй вариант вызова `setState()`, который принимает функцию, а не объект. Эта функция получит предыдущее состояние в качестве первого аргумента и значения пропсов непосредственно во время обновления в качестве второго аргумента:

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

Когда мы вызываем `setState()`, React объединит аргумент (новое состояние) c текущим состоянием.

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

Их можно обновлять по отдельности с помощью отдельных вызовов `setState()`:

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

Состояния объединяются поверхностно, поэтому вызов `this.setState({comments})` оставляет `this.state.posts` нетронутым, но полностью заменяет `this.state.comments`.

## Однонаправленный поток данных {#the-data-flows-down}

В иерархии компонентов, ни родительский, ни дочерние компоненты не знают, задано ли состояние другого компонента. Также не важно, как был создан определенный компонент — с помощью функции или класса. 

Состояние часто называют «локальным», «внутренним» или инкапсулированным. Оно доступно только для самого компонента и скрыто от других.

Компонент может передать своё состояние вниз по дереву в виде пропсов дочерних компонентов:

```js
<h2>Сейчас {this.state.date.toLocaleTimeString()}.</h2>
```

Своё состояние можно передать и другому пользовательскому компоненту:

```js
<FormattedDate date={this.state.date} />
```

Компонент `FormattedDate` получает `date` через пропсы, но он не знает, откуда они взялись изначально — из состояния `Clock`, пропсов `Clock` или просто JavaScript-выражения:

```js
function FormattedDate(props) {
  return <h2>Сейчас {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

Этот процесс называется «нисходящим» ("top-down") или «однонаправленным» ("unidirectional") потоком данных. Состояние всегда принадлежит определённому компоненту, а любые производные этого состояния могут влиять только на компоненты, находящиеся «ниже» в дереве компонентов.

Если представить иерархию компонентов как водопад пропсов, то состояние каждого компонента похоже на дополнительный источник, который сливается с водопадом в произвольной точке, но также течёт вниз.

Чтобы показать, что все компоненты действительно изолированы, создадим компонент `App`, который рендерит три компонента `<Clock>`:

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

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

У каждого компонента `Clock` есть собственное состояние таймера, которое обновляется независимо от других компонентов.

В React-приложениях, имеет ли компонент состояние или нет — это внутренняя деталь реализации компонента, которая может меняться со временем. Можно использовать компоненты без состояния в компонентах с состоянием, и наоборот.
