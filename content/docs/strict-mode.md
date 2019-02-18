---
id: strict-mode
title: Строгий режим
permalink: docs/strict-mode.html
---

`StrictMode` – инструмент для обнаружения потенциальных проблем в приложении. Как и `Fragment`, `StrictMode` не рендерит никакого видимого UI. Этот режим активирует дополнительные проверки и предупреждения для своих потомков.

> Примечание:
>
> Проверки строгого режима работают только в режиме разработки; _они не оказывают никакого эффекта в продакшен сборке_.

Строгий режим может быть включён для любой части приложения. Например:
`embed:strict-mode/enabling-strict-mode.js`

В примере выше проверки строгого режима *не* будут выполняться для компонентов `Header` и `Footer`. Однако эти проверки будут выполнены для `ComponentOne` и `ComponentTwo`, а также для всех их потомков.

На данный момент `StrictMode` помогает с:
* [Обнаружением компонентов с небезопасными методами жизненного цикла](#identifying-unsafe-lifecycles)
* [Предепреждением об использовании устаревшего строкового API для реф](#warning-about-legacy-string-ref-api-usage)
* [Предупреждением об использовании устаревшего метода findDOMNode](#warning-about-deprecated-finddomnode-usage)
* [Обраружением неожиданных побочных эффектов](#detecting-unexpected-side-effects)
* [Обнаружением устаревшего API контекста](#detecting-legacy-context-api)

Дополнительные проверки будут добавлены в будущих релизах React.

### Обнаружение компонентов с небезопасными методами жизненного цикла {#identifying-unsafe-lifecycles}

As explained [in this blog post](/blog/2018/03/27/update-on-async-rendering.html), certain legacy lifecycle methods are unsafe for use in async React applications. However, if your application uses third party libraries, it can be difficult to ensure that these lifecycles aren't being used. Fortunately, strict mode can help with this!

When strict mode is enabled, React compiles a list of all class components using the unsafe lifecycles, and logs a warning message with information about these components, like so:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Addressing the issues identified by strict mode _now_ will make it easier for you to take advantage of async rendering in future releases of React.

### Предепреждение об использовании устаревшего строкового API для реф {#warning-about-legacy-string-ref-api-usage}

Previously, React provided two ways for managing refs: the legacy string ref API and the callback API. Although the string ref API was the more convenient of the two, it had [several downsides](https://github.com/facebook/react/issues/1373) and so our official recommendation was to [use the callback form instead](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React 16.3 added a third option that offers the convenience of a string ref without any of the downsides:
`embed:16-3-release-blog-post/create-ref-example.js`

Since object refs were largely added as a replacement for string refs, strict mode now warns about usage of string refs.

> **Примечание:**
>
> Callback refs will continue to be supported in addition to the new `createRef` API.
>
> You don't need to replace callback refs in your components. They are slightly more flexible, so they will remain as an advanced feature.

[Ознакомьтесь с новым API `createRef` здесь.](/docs/refs-and-the-dom.html)

### Предупреждение об использовании устаревшего метода findDOMNode {#warning-about-deprecated-finddomnode-usage}

React used to support `findDOMNode` to search the tree for a DOM node given a class instance. Normally you don't need this because you can [attach a ref directly to a DOM node](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` can also be used on class components but this was breaking abstraction levels by allowing a parent to demand that certain children was rendered. It creates a refactoring hazard where you can't change the implementation details of a component because a parent might be reaching into its DOM node. `findDOMNode` only returns the first child, but with the use of Fragments, it is possible for a component to render multiple DOM nodes. `findDOMNode` is a one time read API. It only gave you an answer when you asked for it. If a child component renders a different node, there is no way to handle this change. Therefore `findDOMNode` only worked if components always return a single DOM node that never changes.

You can instead make this explicit by passing a ref to your custom component and pass that along to the DOM using [ref forwarding](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

You can also add a wrapper DOM node in your component and attach a ref directly to it.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> Примечание:
>
> В CSS атрибту [`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) может использоваться, чтобы узел не был частью раскладки.

### Обраружение неожиданных побочных эффектов {#detecting-unexpected-side-effects}

Концептуально, React работает в две фазы:
* **Фаза рендера (render phase)** определяет какие изменения необходимо произвести в, например, DOM. В течении данной фазы, React вызывает `render`, затем сравнивает полученный результат с результатом предыдущего рендера.
* **Фаза фиксации (commit phase)** – в ней React применяет любые изменения. (В случае React DOM – это фаза, когда React вставляет, обновляет и удаляет DOM-узлы.) В течении этой фазы React вызывает методы жизненного цикла `componentDidMount` и `componentDidUpdate`.

Фаза фиксации обычно проходит быстро, однако фаза рендера может быть медленной. По этой причине, готовящийся асинхронный режим (который ещё не включён по умолчанию) делит работу рендера на части, останавливает и возобновляет работу для избежания блокировки браузера. Это означает, что React может выполнить фазу рендера lifecycles более, чем один раз перед фиксацией или может вызвать без фиксации совсем (по причине возникновения ошибки или более приоритетного прерывания).

Фаза рендера включает в себя следующие методы жизненного цикла:
* `constructor`
* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` функция обновления (первый аргумент)

Поскольку вышеупомянутые методы могут быть вызваны более одного раза, важно, чтобы они не содержали каких-либо побочных эффектов. Игнорирование этого правила может привести к множеству проблем, включая утечки памяти и некорректное состояние приложения. К сожалению, бывает довольно трудно обнаружить эти проблемы, поскльку они часто могу быть [недетерминированными](https://ru.wikipedia.org/wiki/%D0%94%D0%B5%D1%82%D0%B5%D1%80%D0%BC%D0%B8%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC).

Строгий режим не может автоматически обнаружить побочные эффекты за нас, но помогает обнаружить их, сделав их немного более детерминированными. Это достигается путим преднамеренного двойного вызовва следующих методов:

* метод `constructor` классового компонента
* метод `render`
* `setState` функция обновления (первый аргумент)
* статически метод `getDerivedStateFromProps`

> Примечание:
>
> Это применимо только в режиме разработки. _Методы жизненного цикла не вызываются дважды в продакшен режиме._

К примеру, рассмотрим следующий код:
`embed:strict-mode/side-effects-in-constructor.js`

На первый взгляд данный пример может не показаться проблемным. Но если метод `SharedApplicationState.recordEvent` не является [идемпотентным](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning), тогда при создании этого компонента несколько раз может привести к недопустимому состоянию приложения. Такой вид ошибок может не проявляться во время разработки, или она может быть непоследовательное и поэтому может быть проигнорирована.

Решение преднамеренно производить двойной вызов таких методов, как конструктор компонента, строгий режим облегчает поиск такого вида ошибок.

### Обнаружение устаревшего API контекста {#detecting-legacy-context-api}

Устаревший (API) контекст подвержен ошибкам и будет удалён в будущей мажорной версии. Он ещё доступен во всех релизах 16.x, но в строгом режиме будет выведено следующее предупреждение:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Ознакомьтесь с [документацией нового API контекста](/docs/context.html) для миграции на новую версию.
