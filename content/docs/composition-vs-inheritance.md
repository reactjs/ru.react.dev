---
id: composition-vs-inheritance
title: Композиция против наследования
permalink: docs/composition-vs-inheritance.html
redirect_from:
  - "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React имеет мощную модель композиции, поэтому для повторного использования кода между компонентами мы рекомендуем использовать композицию вместо наследования.

В этой главе мы рассмотрим несколько проблем, которые новички в React решают наследованием и попробуем решить их с помощью композиции.

## Вставка {#containment}

Некоторые компоненты не знают своих потомков заранее. Это особенно характерно для таких компонентов, как `Sidebar` или `Dialog`, которые представляют из себя как бы «коробку», в которую можно что-то положить.

Для таких компонентов мы рекомендуем использовать специальный проп `children`, который передаст дочерние элементы сразу на вывод:

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

Это позволит передать компоненту произвольные дочерние элементы, вложив их в JSX:

```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Добро пожаловать
      </h1>
      <p className="Dialog-message">
        Спасибо, что посетили наш космический корабль!
      </p>
    </FancyBorder>
  );
}
```

**[Посмотреть на CodePen](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)**

Всё, что находится внутри JSX-тега `<FancyBorder>`, передаётся в компонент `FancyBorder` через проп `children`. Поскольку `FancyBorder` рендерит `{props.children}` внутри `<div>`, все переданные элементы отображаются в конечном выводе.

Иногда в компоненте необходимо иметь несколько мест для вставки. В таком случае можно придумать свой формат, а не использовать `children`:

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

Такие React-элементы, как `<Contacts />` и `<Chat />` являются просто объектами, поэтому их можно передать в виде пропсов, как и любые другие данные. Этот подход может напоминать понятие «слотов» в других библиотеках, однако, в React нет никаких ограничений на то, что можно передать в качестве пропсов.

## Специализация {#specialization}

Некоторые компоненты можно рассматривать как «частные случаи» других компонентов. Например, `WelcomeDialog` может быть частным случаем `Dialog`.

В React это можно сделать через композицию, где «частный» вариант компонента рендерит более «общий» и настраивает его с помощью пропсов:

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Добро пожаловать"
      message="Спасибо, что посетили наш космический корабль!" />
  );
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Композиция хорошо работает и для компонентов, определённых через классы:

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Программа исследования Марса"
              message="Как к вам обращаться?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Запишите меня!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Добро пожаловать на борт, ${this.state.login}!`);
  }
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## Так что насчёт наследования? {#so-what-about-inheritance}

В Facebook мы используем React в тысячах компонентов, и не находили случаев, когда бы рекомендовали создавать иерархии наследования компонентов.

Пропсы и композиция дают вам всю гибкость, необходимую для настройки внешнего вида и поведения компонента явным и безопасным способом. Помните, что компоненты могут принимать произвольные пропсы, включая примитивные значения, React-элементы или функции.

<<<<<<< HEAD
Если вы хотите повторно использовать не связанную с внешним видом функциональность между компонентами, извлеките её в отдельный JavaScript-модуль. Импортируйте его в компонент и используйте эту функцию, объект или класс, не расширяя их.
=======
If you want to reuse non-UI functionality between components, we suggest extracting it into a separate JavaScript module. The components may import it and use that function, object, or class, without extending it.
>>>>>>> 822330c3dfa686dbb3424886abce116f20ed20e6
