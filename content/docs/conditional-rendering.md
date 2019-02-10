---
id: conditional-rendering
title: Условный рендеринг
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

С React можно создать разные компоненты, инкапсулирующие поведение. Затем вы можете решить рендерить только некоторые из них по своему усмотрению в зависимости от состояния приложения.

Условный рендеринг в React работает так же, как условные выражения работают в JavaScript. Чтобы создать элементы отражающие текущее состояние и позволить React обновить UI в соответствии с ними, используйте [условный оператор](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/%D0%A3%D1%81%D0%BB%D0%BE%D0%B2%D0%BD%D1%8B%D0%B9_%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80) JavaScript или выражения подобные [`if`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/if...else).

Рассмотрим два компонента:

```js
function UserGreeting(props) {
  return <h1>С возвращением!</h1>;
}

function GuestGreeting(props) {
  return <h1>Залогиньтесь, пожалуйста.</h1>;
}
```

Можно создать компонент `Greeting`, который отражает один из вышеуказанных компонентов в зависимости от того, залогинен пользователь или нет:

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Попробуйте заменить на isLoggedIn={true} и посмотрите на эффект.
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

В этом примере рендерится различное приветствие в зависимости от значания пропа `isLoggedIn`.

### Переменные-элементы {#element-variables}

Элементы React можно сохранять в переменных. Это может быть удобно, когда какое-то условие определяет, надо ли рендерить одну часть компонента или нет, тогда как другая часть компонента остаётся неизменной.

Рассмотрим ещё два компонента, представляющих кнопки Залогиниться (Login) и Выйти (Logout).

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Залогиниться
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Выйти
    </button>
  );
}
```

В следующем примере мы создадим [компонент с состоянием](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) и назовём его `LoginControl`.

Он будет рендерить либо `<LoginButton />`, либо `<LogoutButton />`, в зависимости от текущего состояния. А также он будет всегда рендерить `<Greeting />` из предыдущего примера.

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

И хотя объявление переменной и использование её в `if`-выражении это вполне рабочий вариант условного рендеринга, иногда вы можете предпочесть синтаксис покороче. Ниже объяснены несколько других способов встроить условия в JSX.

### Условное (if) встраивание с помощью логического оператора && {#inline-if-with-logical--operator}

Вы можете [внедрить любое выражение в JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx), просто заключив его в фигурные скобки. Это правило распространяется и на логический оператор `&&` языка JavaScript, который может оказаться удобным для условной вставки элемента:

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Здравствуйте!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          У вас {unreadMessages.length} непрочитанных сообщений.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Приведённый выше вариант работает корректно, потому что в JavaScript, выражение `true && expression` всегда вычисляется как `expression`, а выражение `false && expression` — как `false`.

То есть, если условие истинно (`true`), то элемент, идущий непосредственно за `&&` будет передан на вывод. Если же оно ложно (`false`), то React проигнорирует и пропустит его.

### Условное (if-else) встраивание с помощью тернарного оператора {#inline-if-else-with-conditional-operator}

Есть ещё один метод встраивания условного рендеринга элементов. В нём используется тернарный условный оператор JavaScript [`condition ? true : false`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/%D0%A3%D1%81%D0%BB%D0%BE%D0%B2%D0%BD%D1%8B%D0%B9_%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80).

Вот как этот метод можно использовать, чтобы отрендерить кусочек текста.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      Пользователь <b>{isLoggedIn ? 'сейчас' : 'не'}</b> залогинен.
    </div>
  );
}
```

Этот метод можно использовать и с выражениями покрупнее, но это может сделать код менее очевидным:

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Как в JavaScript, так и в React выбор уместного стиля — личное дело вас или вашей команды, в котором важны взгляды на то, какой стиль читается лучше. Не забывайте, что если какое-то условие выглядят очень сложным, возможно пришло время [извлечь часть кода в отдельный компонент](/docs/components-and-props.html#extracting-components).

### Предотвращение рендеринга компонента {#preventing-component-from-rendering}

В редких случаях может потребоваться позволить компоненту спрятать себя, хотя он уже и отрендерен другим компонентом. Чтобы этого добиться, просто верните `null` вместо того, что обычно возвращается на рендеринг.

Например, будет ли содержимое `<WarningBanner />` отрендерено, зависит от значения пропа под именем `warn`. Если значение `false`, компонент ничего не рендерит:

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Предупреждение!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Спрятать' : 'Показать'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Сам факт возврата `null` из метода `render` компонента никак не влияет на срабатывание методов жизненного цикла компонента. Например, `componentDidUpdate` будет всё равно вызван.
