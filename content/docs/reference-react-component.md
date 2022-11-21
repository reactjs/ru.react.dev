---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

Эта страница содержит подробный справочник API для определения классового компонента React. Предполагается, что вы знакомы с такими концепциями React, как [компоненты и пропсы](/docs/components-and-props.html), а также [состояние и жизненный цикл](/docs/state-and-lifecycle.html). Прочитайте про них, если вы этого не сделали.

## Обзор {#overview}

React позволяет определять компоненты как классы или функции. В настоящее время классовые компоненты имеют больше возможностей. Они разобраны на этой странице. Чтобы определить такой компонент, необходимо отнаследоваться от `React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Привет, {this.props.name}</h1>;
  }
}
```

Единственный *обязательный* метод в подклассе `React.Component` – [`render()`](#render). Все остальные методы, описанные ниже, являются необязательными.

**Мы рекомендуем не создавать собственные классы базовых компонентов.** В компонентах React повторное использование кода обычно достигается за счёт [композиции, а не наследования](/docs/composition-vs-inheritance.html).

> Примечание:
>
>React не заставляет вас использовать синтаксис классов из ES6. Вместо этого вы можете использовать модуль `create-react-class` или его аналоги. Посмотрите раздел [Использование React без ES6](/docs/react-without-es6.html), чтобы узнать больше.

### Жизненный цикл компонента {#the-component-lifecycle}

Каждый компонент имеет несколько «методов жизненного цикла». Переопределение такого метода позволяет выполнять код на конкретном этапе этого процесса. **Вы можете использовать [эту диаграмму жизненного цикла](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) как шпаргалку.** Далее на странице **полужирным шрифтом** выделены самые распространённые методы жизненного цикла.

#### Монтирование {#mounting}

При создании экземпляра компонента и его вставке в DOM, следующие методы вызываются в установленном порядке:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

> Примечание:
>
<<<<<<< HEAD
> Этот метод устарел. [Не используйте его](/blog/2018/03/27/update-on-async-rendering.html) в новом коде.
=======
>This method is considered legacy and you should [avoid it](/blog/2018/03/27/update-on-async-rendering.html) in new code:
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Обновление {#updating}

Обновление происходит при изменении пропсов или состояния. Следующие методы вызываются в установленном порядке при повторном рендере компонента:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

> Примечание:
>
> Эти методы устарели. [Не используйте их](/blog/2018/03/27/update-on-async-rendering.html) в новом коде.
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Размонтирование {#unmounting}

Этот метод вызывается при удалении компонента из DOM:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Обработка ошибок {#error-handling}

Следующие методы вызываются, если произошла ошибка в процессе рендеринга, методе жизненного цикла или конструкторе любого дочернего компонента.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Другие методы API {#other-apis}

В каждом компоненте доступны методы API:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Свойства класса {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Свойства экземпляра {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Справочник {#reference}

### Распространённые методы жизненного цикла {#commonly-used-lifecycle-methods}

Методы в этом разделе охватывают большинство задач, с которыми вы столкнётесь при использовании React-компонентов. **Для визуального представления вы можете использовать [эту диаграмму жизненного цикла](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

`render()` – единственный обязательный метод в классовом компоненте.

При вызове он проверяет `this.props` и `this.state` и возвращает один из следующих вариантов:

<<<<<<< HEAD
- **Элемент React.** Обычно создаётся с помощью [JSX](/docs/introducing-jsx.html). Указывает React, что рендерить: DOM-узел или пользовательский компонент. Например, `<div />` или `<MyComponent />`.
- **Массивы и фрагменты.** Возвращает несколько элементов из `render()`. Подробнее про [фрагменты](/docs/fragments.html).
- **Порталы**. Рендерит несколько дочерних элементов в другое поддерево DOM. Подробнее про [порталы](/docs/portals.html).
- **Строки и числа.** Рендерит текстовые DOM-узлы.
- **Booleans или `null`**. Ничего не рендерит. (Обычно необходим для поддержки паттерна `return test && <Child />`, где `test` – логическое значение.)
=======
- **React elements.** Typically created via [JSX](/docs/introducing-jsx.html). For example, `<div />` and `<MyComponent />` are React elements that instruct React to render a DOM node, or another user-defined component, respectively.
- **Arrays and fragments.** Let you return multiple elements from render. See the documentation on [fragments](/docs/fragments.html) for more details.
- **Portals**. Let you render children into a different DOM subtree. See the documentation on [portals](/docs/portals.html) for more details.
- **String and numbers.** These are rendered as text nodes in the DOM.
- **Booleans or `null` or `undefined`**. Render nothing. (Mostly exists to support `return test && <Child />` pattern, where `test` is boolean).
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30

Функция `render()` должна быть *чистой*. Это означает, что она не изменяет состояние компонента, всегда возвращает один и тот же результат, не взаимодействует напрямую с браузером.

Взаимодействовать с браузером необходимо в `componentDidMount()` или других методах жизненного цикла. *Чистый* `render()` делает компонент понятным.

> Примечание:
>
> `render()` не вызывается, если [`shouldComponentUpdate()`](#shouldcomponentupdate) возвращает `false`.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**Вы можете не использовать конструктор в React-компоненте, если вы не определяете состояние или не привязываете методы.**

Конструктор компонента React вызывается до того, как компонент будет примонтирован. В начале конструктора необходимо вызывать `super(props)`. Если это не сделать, `this.props` не будет определён. Это может привести к багам.

Конструкторы в React обычно используют для двух целей:

* Инициализация [внутреннего состояния](/docs/state-and-lifecycle.html) через присвоение объекта `this.state`.
* Привязка [обработчиков событий](/docs/handling-events.html) к экземпляру.

Вы **не должны вызывать `setState()`** в `constructor()`. Если вам нужно внутреннее состояние, **присвойте начальное состояние `this.state`** прямо в конструкторе.

```js
constructor(props) {
  super(props);
  // Не вызывайте здесь this.setState()!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

Конструктор — единственное место, где можно напрямую изменять `this.state`. В остальных методах необходимо использовать `this.setState()`.

Не используйте побочные эффекты или подписки в конструкторе. Вместо этого используйте `componentDidMount()`.

> Примечание:
>
>**Не копируйте пропсы в состояние! Это распространённая ошибка:**
>
>```js
>constructor(props) {
>  super(props);
>  // Не делайте этого!
>  this.state = { color: props.color };
>}
>```
>
>Проблема в том, что это излишне и приводит к багам (обновления в пропе `color` не будут зафиксированы в состоянии). Вместо этого используйте `this.props.color`.
>
> **Используйте данный подход, если вы намеренно хотите игнорировать обновления пропсов.** В таком случае лучше переименовать проп в `initialColor` или `defaultColor`. После этого вы сможете заставить компонент «сбросить» своё внутреннее состояние, [изменив свой ключ](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key), когда это будет необходимо.
>
>Прочитайте нашу статью в блоге про [отсутствие необходимости в производном состоянии](/blog/2018/06/07/you-probably-dont-need-derived-state.html). Она описывает случаи, в которых вам необходимо состояние, зависящее от пропсов.

* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` вызывается сразу после монтирования (то есть, вставки компонента в DOM). В этом методе должны происходить действия, которые требуют наличия DOM-узлов. Это хорошее место для создания сетевых запросов.

Этот метод подходит для настройки подписок. Но не забудьте отписаться от них в `componentWillUnmount()`.

Вы **можете сразу вызвать setState()** в `componentDidMount()`. Это вызовет дополнительный рендер перед тем, как браузер обновит экран. Гарантируется, что пользователь не увидит промежуточное состояние, даже если `render()` будет вызываться дважды. Используйте этот подход с осторожностью, он может вызвать проблемы с производительностью. В большинстве случаев начальное состояние лучше объявить в `constructor()`. Однако, это может быть необходимо для случаев, когда нужно измерить размер или положение DOM-узла, на основе которого происходит рендер. Например, для модальных окон или всплывающих подсказок.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` вызывается сразу после обновления. Не вызывается при первом рендере.

Метод позволяет работать с DOM при обновлении компонента. Также он подходит для выполнения таких сетевых запросов, которые выполняются на основании результата сравнения текущих пропсов с предыдущими. Если пропсы не изменились, новый запрос может и не требоваться.

```js
componentDidUpdate(prevProps) {
  // Популярный пример (не забудьте сравнить пропсы):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

В `componentDidUpdate()` **можно вызывать `setState()`**, однако его **необходимо обернуть в условие**, как в примере выше, чтобы не возник бесконечный цикл.
Вызов `setState()` влечет за собой дополнительный рендер, который незаметен для пользователя, но может повлиять на производительность компонента. Вместо «отражения» пропсов в состоянии рекомендуется использовать пропсы напрямую. Подробнее о том, [почему копирование пропсов в состояние вызывает баги](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

В тех редких случаях когда реализован метод жизненного цикла `getSnapshotBeforeUpdate()`, его результат передаётся `componentDidUpdate()` в качестве третьего параметра `snapshot`.

> Примечание:
>
> `componentDidUpdate()` не вызывается, если [`shouldComponentUpdate()`](#shouldcomponentupdate) возвращает `false`.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` вызывается непосредственно перед размонтированием и удалением компонента. В этом методе выполняется необходимый сброс: отмена таймеров, сетевых запросов и подписок, созданных в `componentDidMount()`.

**Не используйте setState()** в `componentWillUnmount()`, так как компонент никогда не рендерится повторно. После того, как экземпляр компонента будет размонтирован, он никогда не будет примонтирован снова.

* * *

### Редко используемые методы жизненного цикла {#rarely-used-lifecycle-methods}

Методы из этого раздела используются редко. В большинстве компонентов они не нужны, хотя иногда бывают полезны. **Вы можете увидеть большинство приведённых ниже методов на [этой диаграмме жизненного цикла](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/), если наверху страницы нажмёте на чекбокс «Показать менее популярные методы жизненного цикла».**

### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Используйте `shouldComponentUpdate()`, чтобы указать необходимость следующего рендера на основе изменений состояния и пропсов. По умолчанию происходит повторный рендер при любом изменении состояния. В большинстве случаев вы должны полагаться на это поведение.

`shouldComponentUpdate()` вызывается перед рендером, когда получает новые пропсы или состояние. Значение по умолчанию равно `true`. Этот метод не вызывается при первом рендере или когда используется `forceUpdate()`.

Этот метод нужен только для **[повышения производительности](/docs/optimizing-performance.html).** Но не опирайтесь на его возможность «предотвратить» рендер, это может привести к багам. Вместо этого **используйте [`PureComponent`](/docs/react-api.html#reactpurecomponent)**, который позволяет не описывать поведение `shouldComponentUpdate()` вручную. `PureComponent` поверхностно сравнивает пропсы и состояние и позволяет не пропустить необходимое обновление.

Если вы уверены, что хотите написать его вручную, вы можете сравнить `this.props` с `nextProps`, а `this.state` с `nextState`. Верните `false` чтобы пропустить обновление React. Возврат `false` не предотвращает повторный рендер дочерних компонентов при изменении *их* состояния.

Мы не рекомендуем делать глубокое сравнение или использовать `JSON.stringify()` в `shouldComponentUpdate()`. Это неэффективно и плохо влияет на производительность.

В настоящее время, если `shouldComponentUpdate()` возвращает `false`, то [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render) и [`componentDidUpdate()`](#componentdidupdate) не будут вызваны. В будущем React может рассматривать `shouldComponentUpdate()` как подсказку, а не строгое указание. В таком случае возврат `false` сможет привести к повторному рендеру компонента.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` вызывается непосредственно перед вызовом метода `render`, как при начальном монтировании, так и при последующих обновлениях. Он должен вернуть объект для обновления состояния или `null`, чтобы ничего не обновлять.

Этот метод существует для [редких случаев](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state), когда состояние зависит от изменений в пропсах. Например, это подойдёт для реализации компонента `<Transition>`, который сравнивает свои предыдущие и следующие дочерние компоненты, чтобы решить, какой из них нужно анимировать.

Производное состояние приводит к сложному коду и делает ваши компоненты сложными для понимания. Убедитесь, что вы знакомы с [простыми альтернативами:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* Чтобы **выполнить побочный эффект при изменении пропсов** (например, сетевой запрос или анимацию) используйте [`componentDidUpdate`](#componentdidupdate).

* Чтобы **повторно вычислить данные при изменении пропсов**, используйте [функцию мемоизации](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* Чтобы **«сбросить» некоторое состояние при изменении пропсов**, используйте [управляемые компоненты](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) или [неуправляемые компоненты с ключом](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

Этот метод не имеет доступа к экземпляру компонента. Чтобы использовать пропсы, состояние и методы класса в `getDerivedStateFromProps()`, их нужно вынести за пределы класса в виде чистых функций.

Если вы хотите повторно использовать код между `getDerivedStateFromProps()` и другими методами класса, извлеките чистые функции пропсов и состояния компонента и поместите их вне определения класса.

Обратите внимание, что этот метод запускается при каждом рендере, независимо от причины. Это отличается от метода `UNSAFE_componentWillReceiveProps`, который запускается только при повторном рендере родительского компонента, а не в результате вызова `setState`.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` вызывается прямо перед этапом «фиксирования» (например, перед добавлением в DOM). Он позволяет вашему компоненту брать некоторую информацию из DOM (например, положение прокрутки) перед её возможным изменением. Любое значение, возвращаемое этим методом жизненного цикла, будет передано как параметр `componentDidUpdate()`.

Это применяется редко, но может быть полезно в таких интерфейсах, как цепочка сообщений в чатах, в которых позиция прокрутки обрабатывается особым образом.

Значение снимка (или `null`) должно быть возвращено.

Например:

`embed:react-component-reference/get-snapshot-before-update.js`

В примерах выше важно получить значение свойства `scrollHeight` в `getSnapshotBeforeUpdate` из-за того, что могут возникать задержки между этапами жизненного цикла «рендер» (например, `render`) и «фиксирование» (например, `getSnapshotBeforeUpdate` и `componentDidUpdate`).

* * *

### Предохранители {#error-boundaries}

[Предохранители](/docs/error-boundaries.html) – это React-компоненты, которые перехватывают JavaScript-ошибки в любом месте их дочернего дерева компонентов. Затем логируют эти ошибки и отображают запасной интерфейс вместо "поломанного" дерева компонентов. Предохранители отлавливают ошибки при рендере, в методах жизненного цикла и в конструкторах всего дерева под ними.

Классовый компонент становится предохранителем, если в нём используются методы жизненного цикла `static getDerivedStateFromError()` и (или) `componentDidCatch()`. Обновление состояния в этом методе жизненного цикла позволяет перехватить необработанную JavaScript-ошибку в дереве ниже и отобразить запасной интерфейс.

Используйте предохранители только для обработки неожиданных исключений, **не используйте их для управления потоком исполнения в вашем приложении.**

Подробнее в разделе [*Предохранители в React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> Примечание:
>
> Предохранители перехватывают ошибки в компонентах **ниже** по дереву. Предохранители не могут поймать ошибку внутри себя.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

Этот метод жизненного цикла вызывается после возникновения ошибки у компонента-потомка. Он получает ошибку в качестве параметра и возвращает значение для обновления состояния.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновите состояние так, чтобы следующий рендер показал запасной интерфейс.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Здесь можно рендерить запасной интерфейс
      return <h1>Что-то пошло не так.</h1>;
    }

    return this.props.children;
  }
}
```

> Примечание:
>
> `getDerivedStateFromError()` вызывается во время этапа "рендера". Поэтому здесь запрещены любые побочные эффекты, но их можно использовать в `componentDidCatch()`.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

Этот метод жизненного цикла вызывается после возникновения ошибки у компонента-потомка. Он получает два параметра:

1. `error` - перехваченная ошибка
2. `info` - объект с ключом `componentStack`, содержащий [информацию о компоненте, в котором произошла ошибка](/docs/error-boundaries.html#component-stack-traces).

`componentDidCatch()` вызывается во время этапа "фиксации", поэтому здесь можно использовать побочные эффекты. Метод можно использовать для логирования ошибок.

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновите состояние так, чтобы следующий рендер показал запасной интерфейс.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Пример "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Здесь можно рендерить запасной интерфейс
      return <h1>Что-то пошло не так.</h1>;
    }

    return this.props.children;
  }
}
```

Обработка ошибок в методе `componentDidCatch()` отличается между React-сборками для продакшена и разработки. 

В процессе разработки ошибки будут подниматься (всплывать) наверх до объекта `window`, поэтому любой вызов `window.onerror` или `window.addEventListener('error', callback)` перехватит ошибки, которые были обработаны `componentDidCatch()`.

На продакшене, напротив, ошибки не всплывают, поэтому родительский обработчик ошибок перехватит только те ошибки, которые не были обработаны `componentDidCatch()`.

> Примечание:
>
>В случае ошибки вы можете рендерить запасной интерфейс с помощью `componentDidCatch()`, вызвав `setState`. Однако, этот способ скоро будет считаться устаревшим.
> Используйте `static getDerivedStateFromError()` для рендера резервного интерфейса.

* * *

### Устаревшие методы жизненного цикла {#legacy-lifecycle-methods}

Приведённые ниже методы жизненного цикла устарели. Их не рекомендуется использовать в новом коде, хотя они продолжают работать. Вы можете узнать больше о переходе с устаревших методов жизненного цикла в [блоге](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Примечание:
>
> Этот метод жизненного цикла раньше назывался `componentWillMount`. По этому названию он будет доступен до 17 версии. Чтобы автоматически обновить компоненты, используйте [`rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles).

`UNSAFE_componentWillMount()` вызывается непосредственно перед монтированием. Он вызывается перед `render()`, поэтому синхронный вызов `setState()` в этом методе не вызовет дополнительный рендер. Для инициализации состояния мы рекомендуем использовать `constructor()`.

Избегайте добавления каких-либо побочных эффектов или подписок в этом методе. Вместо этого используйте `componentDidMount()`.

Это единственный метод жизненного цикла, вызываемый при серверном рендеринге.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Примечание:
>
> Этот метод жизненного цикла раньше назывался `componentWillReceiveProps`. По этому названию он будет доступен до 17 версии. Чтобы автоматически обновить компоненты, используйте [`rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles).

> Примечание:
>
> Использование этого метода жизненного цикла часто приводило к багам
>
> * Чтобы **выполнить побочный эффект при изменении пропсов** (например, сетевой запрос или анимацию) используйте [`componentDidUpdate`](#componentdidupdate).
> * Чтобы **повторно вычислить данные при изменении пропсов** вместо `componentWillReceiveProps` используйте [функцию мемоизации](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * Чтобы **«сбросить» некоторое состояние при изменении пропсов** вместо `componentWillReceiveProps` используйте [управляемые компоненты](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) или [неуправляемые компоненты с ключом](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).
>
> Другие рекомендации можно посмотреть [в статье про производное состояние](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` вызывается до того, как смонтированный компонент получит новые пропсы. Чтобы обновить состояние в ответ на изменение пропсов (например, для его сброса), можно сравнить `this.props` с `nextProps` и обновить состояние в этом методе с помощью `this.setState()`.

Обратите внимание, если родительский компонент заставляет ваш компонент повторно рендериться, метод будет вызываться, даже если пропсы не изменились. Убедитесь, что сравниваете текущие и следующие значения, если вы хотите обрабатывать изменения.

Во время [монтирования](#mounting) React не вызывает `UNSAFE_componentWillReceiveProps()` с начальными значениями пропсов. Этот метод вызывается, если некоторые пропсы компонента могут обновиться. Вызов `this.setState()` обычно не вызывает `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Примечание:
>
> Этот метод жизненного цикла раньше назывался `componentWillUpdate`. По этому названию он будет доступен до 17 версии. Чтобы автоматически обновить компоненты, используйте [`rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles).

`UNSAFE_componentWillUpdate()` вызывается непосредственно перед рендером при получении новых пропсов или состояния. В этом методе можно выполнить некоторую подготовку перед обновлением. Этот метод не вызывается при первом рендере.

Внутри этого метода нельзя вызвать `this.setState()`, а также делать какие-либо действия, которые влияют на обновление компонента перед возвратом `UNSAFE_componentWillUpdate()` (например, отправка действия Redux).

Обычно этот метод можно заменить на `componentDidUpdate()`. Вы можете использовать `getSnapshotBeforeUpdate()` для работы с DOM (например, запоминать положение прокрутки страницы).

> Примечание:
>
> `UNSAFE_componentWillUpdate()` не вызывается, если [`shouldComponentUpdate()`](#shouldcomponentupdate) возвращает `false`.

* * *

## Другие методы API {#other-apis-1}

В отличие от методов жизненного цикла, представленных выше (React вызывает их сам), методы, приведённые ниже, можно вызывать из компонентов.

Их всего два: `setState()` и `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` добавляет в очередь изменения в состоянии компонента. Также он указывает React, что компонент и его дочерние элементы должны быть повторно отрендерены с обновлённым состоянием. Этот метод используется для обновления интерфейса в ответ на обработчики событий и ответы сервера.

Думайте о `setState()`, как о *запросе*, а не как о команде немедленного обновления компонента. Для увеличения производительности React может задержать его выполнение, а затем обновить несколько компонентов за один проход. In the rare case that you need to force the DOM update to be applied synchronously, you may wrap it in [`flushSync`](/docs/react-dom.html#flushsync), but this may hurt performance.

Метод `setState()` не всегда обновляет компонент сразу. Он может группировать или откладывать обновление до следующего раза. Это делает чтение `this.state` сразу после вызова `setState()` потенциальной ловушкой. Вместо этого используйте `componentDidUpdate()` или колбэк `setState()` (`setState(updater, callback)`), каждый из которых гарантированно вызывается после того как было применено обновление. Если вам нужно обновить состояние на основе предыдущего, используйте аргумент `updater`, описанный ниже.

`setState()` всегда приводит к повторному рендеру, если только `shouldComponentUpdate()` не возвращает `false`. Если используются мутабельные объекты, и условие рендеринга не может быть реализовано в `shouldComponentUpdate()`, вызывайте `setState()` только при разнице следующего и предыдущего состояния. Это предотвратит ненужные повторные рендеры.

Первым аргументом передаётся функция `updater`, которая имеет следующий вид:

```javascript
(state, props) => stateChange
```

`state` – ссылка на состояние компонента при изменении. Объект состояния не должен мутировать. Изменения должны проявляться в виде нового объекта на основе входных данных из `state` и `props`. Предположим, что мы хотели бы увеличить значение состояния с помощью `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Как `state`, так и `props`, полученные функцией обновления, гарантированно будут обновлены. Результат функции поверхностно объединяется с `state`.

Второй параметр в `setState()` - необязательный колбэк, вызываемый после выполнения `setState` и повторного рендера компонента. Вместо этого в большинстве случаев для такой логики мы рекомендуем использовать `componentDidUpdate()`.

В качестве первого аргумента `setState()`, вместо функции, вы можете передать объект:

```javascript
setState(stateChange[, callback])
```

В нём образуется новое состояние после поверхностного объединения с `stateChange`. Например, установим количество товаров в корзине:

```javascript
this.setState({quantity: 2})
```

Эта форма записи `setState()` также асинхронна, и несколько вызовов в течение одного цикла могут быть объединены вместе. Например, вам нужно увеличить количество элементов несколько раз в одном цикле. Результат этого можно представить так:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Последующие вызовы будут переопределять значения из предыдущих вызовов того же цикла. Из-за этого количество увеличится только один раз. В случае, если следующее состояние зависит от текущего, мы рекомендуем использовать форму функции обновления:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

Для более подробной информации смотрите:

* [Руководство по состоянию и жизненному циклу](/docs/state-and-lifecycle.html)
* [Продвинутый уровень: когда и почему группируются вызовы `setState()`?](https://stackoverflow.com/a/48610973/458193)
* [Продвинутый уровень: почему `this.state` не обновляется сразу?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

По умолчанию при изменении состояния компонента или пропсов, происходит повторный рендер. Если ваш метод `render()` зависит от некоторых других данных, вы можете указать React необходимость в повторном рендере, вызвав `forceUpdate()`.

Вызов `forceUpdate()` приведёт к выполнению метода `render()` в компоненте, пропуская `shouldComponentUpdate()`. Это вызовет обычные методы жизненного цикла для дочерних компонентов, включая `shouldComponentUpdate()` каждого дочернего компонента. React по-прежнему будет обновлять DOM только в случае изменения разметки.

Чаще всего, `forceUpdate()` не используется. Вместо этого используются в `render()` данные из `this.props` и `this.state`.

* * *

## Свойства класса {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` можно определить как свойство самого класса компонента, которое позволяет установить пропсы класса по умолчанию. Это используется для неопределённых (`undefined`) пропсов, но не для пропсов со значением `null`. Например:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'синий'
};
```

Если `props.color` не передаётся, по умолчанию установится `'синий'`:

```js
  render() {
    return <CustomButton /> ; // props.color будет установлен в 'синий'
  }
```

Если `props.color` имеет значение `null`, оно останется `null`:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color останется null
  }
```

* * *

### `displayName` {#displayname}

Строка `displayName` используется в сообщениях для отладки. Обычно вам не нужно её явно указывать. По умолчанию используется имя функции или класса, указанное при определении компонента. Если вам нужно установить его явно, например, для отладки или создания компонента высшего порядка, посмотрите раздел [Обёртка отображаемого имени для простой отладки](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging).

* * *

## Свойства экземпляра {#instance-properties-1}

### `props` {#props}

`this.props` содержит свойства, которые были определены тем, кто вызывает этот компонент. Подробнее об этом можно узнать в разделе [Компоненты и пропсы](/docs/components-and-props.html)

Существует специальный проп `this.props.children`, который обычно определяется дочерними тегами в JSX-выражении, а не в самом теге.

### `state` {#state}

Состояние содержит данные, специфичные для этого компонента. Они могут измениться со временем. Состояние определяется пользователем и должно быть простым объектом JavaScript.

Вам не нужно вставлять в состояние значение, если оно не используется для рендера или потока данных (например, идентификатор таймера). Такие значения можно определить как поля экземпляра компонента.

Дополнительную информацию можно найти в разделе [Состояние и жизненный цикл](/docs/state-and-lifecycle.html).

Никогда не мутируйте `this.state` напрямую, так как более поздний вызов `setState()` может перезаписать эту мутацию. Относитесь к `this.state` как к иммутабельному объекту.
