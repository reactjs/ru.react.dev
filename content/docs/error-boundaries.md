---
id: error-boundaries
title: Error Boundaries
permalink: docs/error-boundaries.html
---

В прошлом, ошибки JavaScript внутри компонентов портили внутреннуу состояние React и заставляли его [выдавать](https://github.com/facebook/react/issues/4026) [таинственные](https://github.com/facebook/react/issues/6895) [сообщения об ошибках](https://github.com/facebook/react/issues/8579) во время следующего рендера. Эти сообщения всегда вызывались ошибками, расположенными где-то выше в коде приложения, но React не предоставлял способа адекватно обрабатывать их в компонентах и не мог обработать их самостоятельно.


## Представляем Error Boundaries {#introducing-error-boundaries}

Ошибка JavaScript где-то в коде UI не должна рушить всё приложение. Чтобы реализовать это утверждение для пользователей React, React 16 водит концепцию "рубеж ошибок"("error boundary").

Error boundaries это компоненты React, которые **отлавливают ошибки JavaScript в любом месте дерева их дочерних компонентов, сохраняют их в журнал и выводят запасной UI** вместо рухнувшего дерева компонентов. Error boundaries ловят ошибки при рендеринге, в методах жизненного цикла и в конструкторах дерева компонентов, расположенного под ними.

> Замечание
>
> Error boundaries **не** поймают ошибки в:
>
> * Обработчиках событий ([подробнее](#how-about-event-handlers))
> * Асинхронном коде (напр. колбэки из `setTimeout` или `requestAnimationFrame`)
> * Серверсайд рендеринге
> * Самом компоненте error boundary (а не в его дочерних компонентах)

Классовый компонент является error boundary если он включает любой из двух (или оба) методов жизненного цикла [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) или [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). Пользуйтесь `static getDerivedStateFromError()` при рендеринге запасного UI в случае отлова ошибки. Используйте `componentDidCatch()` при написании кода для журналирования информации об отловленной ощибке.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Можно так же сохранить информацию об ошибке в соответствующую службу журнала ошибок
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // В качестве запасного можно отрендерить UI произвольного вида
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

И можно дальше им пользоваться, как обыконовенным компонентом:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

Error boundaries работают как `catch {}` блоки JavaScript, только для компонентов. Только классовые компоненты могут выступать в роли error boundaries. На практике, чаще всего целесообразным будет один раз описать компонент error boundary и использовать его по всему приложению.

Стоит обратить внимание, что **error boundaries отлавливают ошибки исключительно в своих дочерних компонентах**. Error boundary не сможет отловить ошибку внутри самого себя. Если error boundary не удается отрендерить сообщение об ощибке, то ошибка всплывает до ближайшего error boundary, расположенного над ним в дереве компонентов. В этом тоже ситуация напоминает то, как работают блоки `catch {}` в JavaScript.

## Работающая демонстрация {#live-demo}

См. [пример объявления и использования error boundary](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) в [React 16](/blog/2017/09/26/react-v16.0.html).


## Где располагать Error Boundaries {#where-to-place-error-boundaries}

Гранулярность error boundaries оставляется на ваше усмотрение. Например вы можете охватить им навигационные (route) компоненты верхнего уровня, чтобы выводить пользователю сообщение "Что-то пошло не так", как часто делают при обработке ошибок серверные фреймворки. Также вы можете охватить error boundary отдельные виджеты, чтобы помешать им обрушить всё приложение.


## Новое поведение при обработке неотловленных ошибок {#new-behavior-for-uncaught-errors}

Это изменение влечёт за собой существенное последствие. **Начиная с React 16, ошибки, не отловленные ни одним из error boundary будут приводить к размонтированию всего дерева компонентов React.**

We debated this decision, but in our experience it is worse to leave corrupted UI in place than to completely remove it. For example, in a product like Messenger leaving the broken UI visible could lead to somebody sending a message to the wrong person. Similarly, it is worse for a payments app to display a wrong amount than to render nothing.

This change means that as you migrate to React 16, you will likely uncover existing crashes in your application that have been unnoticed before. Adding error boundaries lets you provide better user experience when something goes wrong.

For example, Facebook Messenger wraps content of the sidebar, the info panel, the conversation log, and the message input into separate error boundaries. If some component in one of these UI areas crashes, the rest of them remain interactive.

We also encourage you to use JS error reporting services (or build your own) so that you can learn about unhandled exceptions as they happen in production, and fix them.


## Component Stack Traces {#component-stack-traces}

React 16 prints all errors that occurred during rendering to the console in development, even if the application accidentally swallows them. In addition to the error message and the JavaScript stack, it also provides component stack traces. Now you can see where exactly in the component tree the failure has happened:

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Error caught by Error Boundary component">

You can also see the filenames and line numbers in the component stack trace. This works by default in [Create React App](https://github.com/facebookincubator/create-react-app) projects:

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

If you don’t use Create React App, you can add [this plugin](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manually to your Babel configuration. Note that it’s intended only for development and **must be disabled in production**.

> Note
>
> Component names displayed in the stack traces depend on the [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) property. If you support older browsers and devices which may not yet provide this natively (e.g. IE 11), consider including a `Function.name` polyfill in your bundled application, such as [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). Alternatively, you may explicitly set the [`displayName`](/docs/react-component.html#displayname) property on all your components.


## How About try/catch? {#how-about-trycatch}

`try` / `catch` is great but it only works for imperative code:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

However, React components are declarative and specify *what* should be rendered:

```js
<Button />
```

Error boundaries preserve the declarative nature of React, and behave as you would expect. For example, even if an error occurs in a `componentDidUpdate` method caused by a `setState` somewhere deep in the tree, it will still correctly propagate to the closest error boundary.

## How About Event Handlers? {#how-about-event-handlers}

Error boundaries **do not** catch errors inside event handlers.

React doesn't need error boundaries to recover from errors in event handlers. Unlike the render method and lifecycle methods, the event handlers don't happen during rendering. So if they throw, React still knows what to display on the screen.

If you need to catch an error inside event handler, use the regular JavaScript `try` / `catch` statement:

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <div onClick={this.handleClick}>Click Me</div>
  }
}
```

Note that the above example is demonstrating regular JavaScript behavior and doesn't use error boundaries.

## Naming Changes from React 15 {#naming-changes-from-react-15}

React 15 included a very limited support for error boundaries under a different method name: `unstable_handleError`. This method no longer works, and you will need to change it to `componentDidCatch` in your code starting from the first 16 beta release.

For this change, we’ve provided a [codemod](https://github.com/reactjs/react-codemod#error-boundaries) to automatically migrate your code.
