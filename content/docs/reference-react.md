---
id: react-api
title: React API верхнего уровня
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React` — это точка входа в библиотеку React. Если вы подключаете React при помощи тега `<script>`, API верхнего уровня доступны в глобальном объекте `React`. Если вы используете ES6 и npm, вы можете написать `import React from 'react'`. Если вы используете ES5 и npm, вы можете написать `var React = require('react')`.

## Обзор {#overview}

### Компоненты {#components}

React-компоненты позволяют разделить пользовательский интерфейс на независимые, повторно используемые части и думать о них по отдельности. React-компоненты могут быть объявлены путём создания подклассов `React.Component` или `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

Если вы не используете классы ES6, вместо них вы можете использовать модуль `create-react-class`. Читайте [Использование React без ES6](/docs/react-without-es6.html), чтобы получить подробную информацию.

React-компоненты также могут быть объявлены как функции, которые могут быть обёрнуты:

- [`React.memo`](#reactmemo)

### Создание элементов React {#creating-react-elements}

Мы рекомендуем [использовать JSX](/docs/introducing-jsx.html), чтобы описать то, как должен выглядеть ваш UI. Каждый элемент JSX это просто синтаксический сахар для вызова [`React.createElement()`](#createelement). Обычно вам не нужно вызывать следующие методы напрямую, если вы используете JSX.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

Читайте [Использование React без JSX](/docs/react-without-jsx.html), чтобы получить подробную информацию.

### Трансформация элементов {#transforming-elements}

`React` предоставляет несколько API-методов для управления элементами:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Фрагменты {#fragments}

`React` также предоставляет компонент для рендера нескольких элементов без обёртки.

- [`React.Fragment`](#reactfragment)

### Рефы {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Задержка (Suspense) {#suspense}

Задержка даёт возможность компонентам «дождаться» чего-то перед рендером. Пока что задержку можно использовать только для [динамической загрузки компонентов с помощью `React.lazy`](/docs/code-splitting.html#reactlazy). В будущем будут поддерживаться и другие варианты использования, такие как получение данных от API.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Transitions {#transitions}

*Transitions* are a new concurrent feature introduced in React 18. They allow you to mark updates as transitions, which tells React that they can be interrupted and avoid going back to Suspense fallbacks for already visible content.

- [`React.startTransition`](#starttransition)
- [`React.useTransition`](/docs/hooks-reference.html#usetransition)

### Хуки {#hooks}

*Хуки* — это новое дополнение в React 16.8. Они позволяют вам использовать состояние и другие функции React без написания класса. У хуков есть [свой раздел документации](/docs/hooks-intro.html) и отдельный API-справочник:

- [Основные хуки](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [Дополнительные хуки](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)
  - [`useDeferredValue`](/docs/hooks-reference.html#usedeferredvalue)
  - [`useTransition`](/docs/hooks-reference.html#usetransition)
  - [`useId`](/docs/hooks-reference.html#useid)
- [Library Hooks](/docs/hooks-reference.html#library-hooks)
  - [`useSyncExternalStore`](/docs/hooks-reference.html#usesyncexternalstore)
  - [`useInsertionEffect`](/docs/hooks-reference.html#useinsertioneffect)

* * *

## Справочник {#reference}

### `React.Component` {#reactcomponent}

`React.Component` — это базовый класс для компонентов React, объявленных как [ES6-классы](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes):

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Привет, {this.props.name}</h1>;
  }
}
```

Со списком методов и свойств базового класса `React.Component` можно ознакомиться в [API-справочнике по `React.Component`](/docs/react-component.html).

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` похож на [`React.Component`](#reactcomponent). Отличие заключается в том, что [`React.Component`](#reactcomponent) не реализует [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), а `React.PureComponent` реализует его поверхностным сравнением пропсов и состояния.

Если метод `render()` вашего React-компонента всегда рендерит одинаковый результат при одних и тех же пропсах и состояниях, для повышения производительности в некоторых случаях вы можете использовать `React.PureComponent`.

> Примечание
>
<<<<<<< HEAD
> Метод `shouldComponentUpdate()` базового класса `React.PureComponent` делает только поверхностное сравнение объектов. Если они содержат сложные структуры данных, это может привести к неправильной работе для более глубоких различий (то есть, различий, не выраженных на поверхности структуры). Наследуйте класс `PureComponent` только тогда, когда вы ожидаете использовать простые пропсы и состояние, или используйте [`forceUpdate()`](/docs/react-component.html#forceupdate), когда знаете, что вложенные структуры данных изменились. Также подумайте об использовании [иммутабельных объектов](https://facebook.github.io/immutable-js/), чтобы упростить процесс сравнения вложенных данных.
=======
> `React.PureComponent`'s `shouldComponentUpdate()` only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences. Only extend `PureComponent` when you expect to have simple props and state, or use [`forceUpdate()`](/docs/react-component.html#forceupdate) when you know deep data structures have changed. Or, consider using [immutable objects](https://immutable-js.com/) to facilitate fast comparisons of nested data.
>>>>>>> c883f623d597852b49f9314bb8133442ef9d3298
>
> Кроме того, метод `shouldComponentUpdate()` базового класса `React.PureComponent` пропускает обновление пропсов для всего поддерева компонентов. Убедитесь, что все дочерние компоненты также являются «чистыми».

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* рендер с использованием пропсов */
});
```

`React.memo` — это [компонент высшего порядка](/docs/higher-order-components.html).

Если ваш компонент всегда рендерит одно и то же при неменяющихся пропсах, вы можете обернуть его в вызов `React.memo` для повышения производительности в некоторых случаях, мемоизируя тем самым результат. Это значит, что React будет использовать результат последнего рендера, избегая повторного рендеринга.

`React.memo` затрагивает только изменения пропсов. Если функциональный компонент обёрнут в `React.memo` и использует [`useState`](/docs/hooks-state.html), [`useReducer`](/docs/hooks-reference.html#usereducer) или [`useContext`](/docs/hooks-reference.html#usecontext), он будет повторно рендериться при изменении состояния или контекста.

По умолчанию он поверхностно сравнивает вложенные объекты в объекте `props`. Если вы хотите контролировать сравнение, вы можете передать свою функцию сравнения в качестве второго аргумента.

```javascript
function MyComponent(props) {
  /* рендер с использованием пропсов */
}
function areEqual(prevProps, nextProps) {
  /*
  возвращает true, если nextProps рендерит
  тот же результат что и prevProps,
  иначе возвращает false
  */
}
export default React.memo(MyComponent, areEqual);
```

Этот метод предназначен только для **[оптимизации производительности](/docs/optimizing-performance.html).** Не полагайтесь на него, чтобы «предотвратить» рендер, так как это может привести к ошибкам.

> Примечание
>
> В отличие от метода [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) для классовых компонентов, функция `areEqual` возвращает `true`, если пропсы равны, и значение `false`, если пропсы не равны. Это обратные значения для `shouldComponentUpdate`.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Создаёт и возвращает новый [React-элемент](/docs/rendering-elements.html) определённого типа. Аргументом `type` может быть строка, содержащая имя тега (например, `'div'` или `'span'`), React-компонент (класс или функция) или [React-фрагмент](#reactfragment).

Код, написанный с использованием JSX, будет преобразован в `React.createElement()`. Обычно вы не будете вызывать `React.createElement()` напрямую, если вы используете JSX. Смотрите [React без JSX](/docs/react-without-jsx.html), чтобы получить подробную информацию.

* * *

### `cloneElement()` {#cloneelement}

```js
React.cloneElement(
  element,
  [config],
  [...children]
)
```

Клонирует и возвращает новый React-элемент, используя элемент в качестве отправной точки. `config` должен содержать все новые пропсы, `key`, а также `ref` Полученный элемент будет иметь пропсы исходного элемента, а новые пропсы будут поверхностно слиты воедино. Новые дочерние элементы заменят существующие. `key` и `ref` из исходного элемента будут сохранены, если в `config` не было передано `key` и `ref`.

`React.cloneElement()` почти эквивалентен:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Тем не менее, в этом случае также сохранятся `ref`. Это означает если вы получите ребёнка с `ref` на нём, вы случайно не украдёте его у родителя. Вы получите тот же `ref`, прикреплённый к вашему новому элементу. Новые `ref` или `key` заменяет существующие (если они есть). 

Этот API был представлен как замена устаревшего `React.addons.cloneWithProps()`.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Возвращает функцию, которая создаёт элементы React заданного типа. Как и [`React.createElement()`](#createelement), аргументом `type` может быть строка содержащая имя тега (например, `'div'` или `'span'`), React-компонент (класс или функция) или [React-фрагмент](#reactfragment).

Этот вспомогательный метод считается устаревшим, и мы рекомендуем использовать либо JSX, либо напрямую `React.createElement()`.

Обычно вы не будете вызывать `React.createFactory()` напрямую, если вы используете JSX. Смотрите [React без JSX](/docs/react-without-jsx.html), чтобы узнать больше.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Проверяет, что объект является элементом React. Возвращает `true` или `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` предоставляет функции для работы с непрозрачной структурой данных `this.props.children`.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Вызывает функцию для каждого непосредственного потомка, содержащегося в `children` передавая их по очереди в `thisArg`. Если `children` — это массив, он будет пройден, и функция будет вызвана для каждого потомка в массиве. Если `children` равен `null` или `undefined`, этот метод вернёт `null` или `undefined`, а не массив.

> Примечание
>
> Если `children` — это `Fragment`, он будет рассматриваться как целый потомок, а элементы внутри не будут пройдены.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Похож на [`React.Children.map()`](#reactchildrenmap), но не возвращает массив.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Возвращает общее количество компонентов в `children`, равное числу раз которое будет вызван обратный вызов, переданный в `map` или `forEach`.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Проверяет, что у `children` есть только один потомок (React-элемент), и возвращает его. Иначе этот метод выдаёт ошибку.

> Примечание:
>
> `React.Children.only()` не принимает возвращаемое значение [`React.Children.map()`](#reactchildrenmap), потому что это массив, а не React-элемент.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Возвращает непрозрачную структуру данных `children` в виде плоского массива с ключами, заданные каждому дочернему элементу. Полезно, если вы хотите манипулировать коллекциями потомков в ваших методах рендера, особенно если вы хотите отсортировать или извлечь часть `this.props.children` перед её передачей куда-либо.

> Примечание:
>
> `React.Children.toArray()` изменяет ключи, чтобы сохранить семантику вложенных массивов, когда делает плоским список дочерних элементов. То есть `toArray` ставит префикс перед каждым ключом в возвращаемом массиве, так что ключ каждого элемента находится в области входного массива, содержащего его.

* * *

### `React.Fragment` {#reactfragment}

Компонент `React.Fragment` позволяет возвращать несколько элементов в методе `render()` без создания дополнительного элемента DOM:

```javascript
render() {
  return (
    <React.Fragment>
      Какой-то текст.
      <h2>Заголовок</h2>
    </React.Fragment>
  );
}
```

Вы также можете использовать его сокращённый синтаксис `<></>`. Чтобы узнать подробнее см. [React v16.2.0: Улучшенная поддержка фрагментов](/blog/2017/11/28/react-v16.2.0-fragment-support.html).

### `React.createRef` {#reactcreateref}

`React.createRef` создаёт [реф](/docs/refs-and-the-dom.html), который можно прикрепить к React-элементам через атрибут ref.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` создаёт React-компонент, который перенаправляет атрибут [ref](/docs/refs-and-the-dom.html), что он получает, другому компоненту ниже в дереве.
Этот метод не очень распространён, но особенно полезен в двух сценариях:

* [Перенаправление рефов в DOM-компоненты](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Перенаправление рефов в компонентах высшего порядка](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` принимает функцию рендера в качестве аргумента. React будет вызывать эту функцию с пропсами и рефом в качестве двух аргументов. Эта функция должна возвращать узел React.

`embed:reference-react-forward-ref.js`

В приведённом выше примере React обнаруживает `ref`, переданный элементу `<FancyButton ref={ref}>`, и передаёт его через второй аргумент в функцию рендера внутри вызова `React.forwardRef`. В свою очередь, функция рендера передаёт `ref` в элемент `<button ref={ref}>`.

В результате, после того как React добавит реф, `ref.current` будет указывать непосредственно на экземпляр `<button>` элемента DOM.

Читайте [Перенаправление рефов](/docs/forwarding-refs.html), чтобы получить подробную информацию.

### `React.lazy` {#reactlazy}

`React.lazy()` позволяет вам определять компонент, который загружается динамически. Это помогает уменьшить размер сборки, откладывая загрузку компонентов, которые не используются во время первоначального рендера.

Вы можете узнать, как этим пользоваться из нашей [документации по разделению кода](/docs/code-splitting.html#reactlazy). Вы также можете посмотреть [эту статью](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) с объяснением, как использовать этот метод более подробно.

```js
// Этот компонент загружается динамически
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Обратите внимание, для рендера `lazy` компонентов требуется чтобы выше в дереве находился компонент `<React.Suspense>`. Это позволит вам отображать индикатор загрузки.

### `React.Suspense` {#reactsuspense}

`React.Suspense` позволяет показать индикатор загрузки в случае, если некоторые компоненты в дереве под ним ещё не готовы к рендеру. В будущем мы планируем позволить `Suspense` обрабатывать больше сценариев, таких как получение данных от API. Вы можете прочитать об этом в [нашей дорожной карте](/blog/2018/11/27/react-16-roadmap.html).

Сегодня ленивая загрузка компонентов — это **единственный** вариант использования, поддерживаемый `<React.Suspense>`:

```js
// Этот компонент загружается динамически
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Отобразится <Spinner> до тех пор, пока не загрузится <OtherComponent />
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Это задокументировано в нашем руководстве по [разделению кода](/docs/code-splitting.html#reactlazy). Обратите внимание, что `lazy` компоненты могут быть глубоко внутри дерева `Suspense` -- не нужно оборачивать каждый из них. Считается хорошей практикой использовать `<Suspense>` для индикации загрузки, а `lazy()` -- для разделения кода. 

> Примечание
>
> For content that is already shown to the user, switching back to a loading indicator can be disorienting. It is sometimes better to show the "old" UI while the new UI is being prepared. To do this, you can use the new transition APIs [`startTransition`](#starttransition) and [`useTransition`](/docs/hooks-reference.html#usetransition) to mark updates as transitions and avoid unexpected fallbacks.

#### `React.Suspense` in Server Side Rendering {#reactsuspense-in-server-side-rendering}
During server side rendering Suspense Boundaries allow you to flush your application in smaller chunks by suspending.
When a component suspends we schedule a low priority task to render the closest Suspense boundary's fallback. If the component unsuspends before we flush the fallback then we send down the actual content and throw away the fallback.

#### `React.Suspense` during hydration {#reactsuspense-during-hydration}
Suspense boundaries depend on their parent boundaries being hydrated before they can hydrate, but they can hydrate independently from sibling boundaries. Events on a boundary before it is hydrated will cause the boundary to hydrate at a higher priority than neighboring boundaries. [Read more](https://github.com/reactwg/react-18/discussions/130)

### `React.startTransition` {#starttransition}

```js
React.startTransition(callback)
```
`React.startTransition` lets you mark updates inside the provided callback as transitions. This method is designed to be used when [`React.useTransition`](/docs/hooks-reference.html#usetransition) is not available.

> Примечание:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transition will not show a fallback for re-suspended content, allowing the user to continue interacting while rendering the update.
>
> `React.startTransition` does not provide an `isPending` flag. To track the pending status of a transition see [`React.useTransition`](/docs/hooks-reference.html#usetransition).
