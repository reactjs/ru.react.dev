---
id: strict-mode
title: Строгий режим
permalink: docs/strict-mode.html
---

`StrictMode` – инструмент для обнаружения потенциальных проблем в приложении. Также как и `Fragment`, `StrictMode` не рендерит видимого UI. Строгий режим активирует дополнительные проверки и предупреждения для своих потомков.

> Примечание:
>
> Проверки строгого режима работают только в режиме разработки; _они не оказывают никакого эффекта в продакшен-сборке_.

Строгий режим может быть включён для любой части приложения. Например:
`embed:strict-mode/enabling-strict-mode.js`

В примере выше проверки строгого режима *не* будут выполняться для компонентов `Header` и `Footer`. Однако будут выполнены для `ComponentOne` и `ComponentTwo`, а также для всех их потомков.

<<<<<<< HEAD
На данный момент `StrictMode` помогает в:
* [Обнаружении небезопасных методов жизненного цикла](#identifying-unsafe-lifecycles)
* [Предупреждении об использовании устаревшего API строковых реф](#warning-about-legacy-string-ref-api-usage)
* [Предупреждении об использовании устаревшего метода findDOMNode](#warning-about-deprecated-finddomnode-usage)
* [Обнаружении неожиданных побочных эффектов](#detecting-unexpected-side-effects)
* [Обнаружении устаревшего API контекста](#detecting-legacy-context-api)
=======
`StrictMode` currently helps with:
* [Identifying components with unsafe lifecycles](#identifying-unsafe-lifecycles)
* [Warning about legacy string ref API usage](#warning-about-legacy-string-ref-api-usage)
* [Warning about deprecated findDOMNode usage](#warning-about-deprecated-finddomnode-usage)
* [Detecting unexpected side effects](#detecting-unexpected-side-effects)
* [Detecting legacy context API](#detecting-legacy-context-api)
* [Ensuring reusable state](#ensuring-reusable-state)
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e

Дополнительные проверки будут включены в будущих релизах React.

### Обнаружение небезопасных методов жизненного цикла {#identifying-unsafe-lifecycles}

[В этой статье](/blog/2018/03/27/update-on-async-rendering.html) рассматриваются причины, почему некоторые методы жизненного цикла небезопасно использовать в асинхронных React-приложениях. Если в приложении подключены сторонние библиотеки, то отследить использование таких методов довольно тяжело. К счастью, тут может помочь строгий режим!

Когда строгий режим включён, React составляет список всех классовых компонентов, которые используют небезопасные методы жизненного цикла, и отображает информацию о них таким образом:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Если избавиться от проблем, выявленных в строгом режиме, _уже сегодня_, то это позволит получить все преимущества конкурентного рендеринга в будущих релизах React.

### Предупреждение об использовании устаревшего API строковых реф {#warning-about-legacy-string-ref-api-usage}

Ранее React предоставлял два способа управления рефами: устаревшие строковые рефы и колбэк API. Хотя строковые рефы и были более удобным способом, они имели [несколько недостатков](https://github.com/facebook/react/issues/1373). Поэтому мы рекомендовали [использовать колбэки вместо них](/docs/refs-and-the-dom.html#legacy-api-string-refs).

В React 16.3 добавлен третий способ, который предлагает удобство строковых рефов и лишён каких-либо недостатков:
`embed:16-3-release-blog-post/create-ref-example.js`

Поскольку объекты-рефы стали заменой строковых реф, строгий режим теперь предупреждает об использовании строковых реф.

> **Примечание:**
>
> Колбэк-рефы по-прежнему поддерживаются вместе с новым API-методом `createRef`.
>
> Вам не обязательно заменять колбэк-рефы в ваших компонентах. Их использование более гибкое, поэтому они считаются продвинутой возможностью.

[Ознакомьтесь с новым API-методом `createRef` здесь.](/docs/refs-and-the-dom.html)

### Предупреждение об использовании устаревшего метода findDOMNode {#warning-about-deprecated-finddomnode-usage}

Ранее React использовал `findDOMNode` для поиска DOM-узла в дереве по указанному экземпляру класса. В большинстве случаев этот метод не используется, поскольку можно [привязать реф непосредственно к DOM-узлу](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` может использоваться для классовых компонентов, однако это нарушает уровни абстракции, позволяя родительскому компоненту требовать, чтобы происходил рендер определённых дочерних элементов. Это приводит к проблемам при рефакторинге, когда не удаётся изменить детали реализации компонента, так как родитель может использовать DOM-узел этого компонента. `findDOMNode` возвращает только первый дочерний элемент, но с использованием фрагментов компонент может рендерить несколько DOM-узлов. `findDOMNode` выполняет поиск только один раз. Затем метод возвращает ранее полученный результат при вызове. Если дочерний компонент рендерит другой узел, то это изменение никак не отследить. Поэтому `findDOMNode` работает, только когда компоненты возвращают единственный и неизменяемый DOM-узел.

Вместо этого, можно передать реф в компонент и передать его далее в DOM используя [перенаправление рефов](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Также можно добавить компоненту DOM-узел как обёртку и прикрепить реф непосредственно к этой обёртке.

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
> CSS-выражение [`display: contents`](https://developer.mozilla.org/ru/docs/Web/CSS/display#display_contents) может применяться для исключения узла из макета (layout).

### Обнаружение неожиданных побочных эффектов {#detecting-unexpected-side-effects}

React работает в два этапа:
* **Этап рендеринга (render phase)** определяет, какие изменения необходимо произвести, например, в DOM. В течение этого этапа React вызывает `render`, а затем сравнивает полученный результат с результатом предыдущего рендера.
* **Этап фиксации (commit phase)** – в нём React применяет любые изменения. В случае React DOM – это этап, когда React вставляет, обновляет и удаляет DOM-узлы. В течение этого этапа React вызывает методы жизненного цикла `componentDidMount` и `componentDidUpdate`.

Этап фиксации обычно не занимает много времени, что нельзя сказать про этап рендеринга. По этой причине, готовящийся конкурентный режим (который по умолчанию ещё не включён) делит работу на части, периодически останавливает и возобновляет работу, чтобы избежать блокировки браузера. Это означает, что на этапе рендеринга React может вызвать методы жизненного цикла более чем один раз перед фиксацией, либо вызвать их без фиксации (из-за возникновения ошибки или прерывания с большим приоритетом).

Этап рендеринга включает в себя следующие методы жизненного цикла:
* `constructor`
* `componentWillMount` (или `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (или `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (или `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* Функции обновления `setState` (первый аргумент)

Поскольку вышеупомянутые методы могут быть вызваны более одного раза, важно, чтобы они не приводили к каким-либо побочным эффектам. Игнорирование этого правила может привести к множеству проблем, включая утечки памяти и недопустимое состояние приложения. К сожалению, такие проблемы тяжело обнаружить из-за их [недетерминированности](https://ru.wikipedia.org/wiki/%D0%94%D0%B5%D1%82%D0%B5%D1%80%D0%BC%D0%B8%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B0%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC).

Строгий режим не способен автоматически обнаруживать побочные эффекты, но помогает их отследить, сделав более детерминированными. Такое поведение достигается путём двойного вызова следующих методов:

* Методы `constructor`, `render`, и `shouldComponentUpdate` классового компонента
* Статический метод классового компонента `getDerivedStateFromProps`
* Тело функционального компонента
* Функции обновления (первый аргумент `setState`)
* Функции, переданные в `useState`, `useMemo`, или `useReducer`

> Примечание:
>
> Это применимо только в режиме разработки. _Методы жизненного цикла не вызываются дважды в продакшен-режиме._

Рассмотрим следующий пример:
`embed:strict-mode/side-effects-in-constructor.js`

На первый взгляд данный пример не кажется проблемным. Но если метод `SharedApplicationState.recordEvent` не является [идемпотентным](https://ru.wikipedia.org/wiki/%D0%98%D0%B4%D0%B5%D0%BC%D0%BF%D0%BE%D1%82%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C#%D0%92_%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B5), тогда создание этого компонента несколько раз может привести к недопустимому состоянию приложения. Такие труднонаходимые ошибки могут никак не проявить себя во время разработки или быть настолько редкими, что останутся незамеченными.

Двойной вызов таких методов, как конструктор компонента, позволяет строгому режиму легко обнаружить подобные проблемы.

> Примечание:
>
<<<<<<< HEAD
> Начиная с 17 версии, React автоматически модифицирует методы для работы с консолью (например, `console.log()`), чтобы предотвратить запись в консоль при втором вызове функций жизненного цикла. Однако в некоторых ситуациях это может привести к нежелательному поведению, в таких случаях можно воспользоваться [обходным решением](https://github.com/facebook/react/issues/20090#issuecomment-715927125).
=======
> In React 17, React automatically modifies the console methods like `console.log()` to silence the logs in the second call to lifecycle functions. However, it may cause undesired behavior in certain cases where [a workaround can be used](https://github.com/facebook/react/issues/20090#issuecomment-715927125).
>
> Starting from React 18, React does not suppress any logs. However, if you have React DevTools installed, the logs from the second call will appear slightly dimmed. React DevTools also offers a setting (off by default) to suppress them completely.
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e

### Обнаружение устаревшего API контекста {#detecting-legacy-context-api}

Использование устаревшего API контекста очень часто приводило к ошибкам и поэтому он будет удалён в будущей мажорной версии. Пока что этот API доступен во всех релизах 16.x, но в строгом режиме будет выведено следующее предупреждение:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

<<<<<<< HEAD
Ознакомьтесь с [документацией нового API контекста](/docs/context.html), чтобы упростить переход на новую версию.
=======
Read the [new context API documentation](/docs/context.html) to help migrate to the new version.


### Ensuring reusable state {#ensuring-reusable-state}

In the future, we’d like to add a feature that allows React to add and remove sections of the UI while preserving state. For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen. To do this, React support remounting trees using the same component state used before unmounting.

This feature will give React better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times. Most effects will work without any changes, but some effects do not properly clean up subscriptions in the destroy callback, or implicitly assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode. This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

To demonstrate the development behavior you'll see in Strict Mode with this feature, consider what happens when React mounts a new component. Without this change, when a component mounts, React creates the effects:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```

With Strict Mode starting in React 18, whenever a component mounts in development, React will simulate immediately unmounting and remounting the component:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates effects being destroyed on a mounted component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates effects being re-created on a mounted component.
    * Layout effects are created
    * Effect setup code runs
```

On the second mount, React will restore the state from the first mount. This feature simulates user behavior such as a user tabbing away from a screen and back, ensuring that code will properly handle state restoration.

When the component unmounts, effects are destroyed as normal:

```
* React unmounts the component.
  * Layout effects are destroyed.
  * Effect effects are destroyed.
```

Unmounting and remounting includes:

- `componentDidMount`
- `componentWillUnmount`
- `useEffect`
- `useLayoutEffect`
- `useInsertionEffect`

> Note:
>
> This only applies to development mode, _production behavior is unchanged_.

For help supporting common issues, see:
  - [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18)
>>>>>>> 9a5bf3e1f1c151720b3ce383fdd9743d4038b71e
