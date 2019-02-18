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

React-компоненты позволяют разделить пользовательский интерфейс на независимые, повторно используемые части и думать о них по отдельности. React-компоненты могут быть обявлены путем создания подклассов `React.Component` или `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

Если вы не используете классы ES6, вместо них вы можете использовать модуль `create-react-class`. Чтобы узнать подробнее см. [Использование React без ES6](/docs/react-without-es6.html).

React-компоненты также могут быть обявлены как функции, которые могут быть обернуты:

- [`React.memo`](#reactmemo)

### Создание элементов React {#creating-react-elements}

Мы рекомендуем [использовать JSX](/docs/introducing-jsx.html), чтобы описать то, как должен выглядеть ваш UI. Каждый элемент JSX это просто синтаксический сахар для вызова [`React.createElement()`](#createelement). Обычно вам не нужно вызывать следующие методы напрямую, если вы используете JSX.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

См. [Использование React без JSX](/docs/react-without-jsx.html) чтобы узнать подробнее.

### Трансформация элементов {#transforming-elements}

`React` предоставляет несколько API-методов для управления элементами:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Фрагменты {#fragments}

`React` также предоставляет компонент для рендера нескольких элементов без обертки.

- [`React.Fragment`](#reactfragment)

### Рефы {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Задержка (Suspense) {#suspense}

Задержка дает возможность компонентам «подождать» что-то перед рендером. Пока что задержку можно использовать только для [динамической загрузки компонентов с помощью `React.lazy`](/docs/code-splitting.html#reactlazy). В будущем будут поддерживаться и другие варианты использования, такие как получение данных с API.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

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

`React.PureComponent` похож на [`React.Component`](#reactcomponent). Отличие заключается в том, что [`React.Component`](#reactcomponent) не реализует [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), а `React.PureComponent` реализует его с поверхностным сравнением пропсов и состояния.

Если метод `render()` вашего React-компонента рендерит один и тот же результат с одинаковыми пропсами и состоянием, для повышения производительности в некоторых случаях вы можете использовать `React.PureComponent`.

> Примечание
>
> Метод `shouldComponentUpdate()` базового класа `React.PureComponent` делает только поверхностное сравнение объектов. Если они содержат сложные структуры данных, это может привести к неправильной работе для более глубоких различий. Наследуйтесь от `PureComponent` только тогда, когда вы ожидаете использовать простые пропсы и состояние, или используйте [`forceUpdate()`](/docs/react-component.html#forceupdate), когда вы знаете, что вложенные структуры данных изменились. Также подумайте об использовании [неизменяемых объектов](https://facebook.github.io/immutable-js/) чтобы упростить процесс сравнения вложенных данных.
>
>
>
> Кроме того, метод `shouldComponentUpdate()` базового класа `React.PureComponent` пропускает обновление пропсов для всего поддерева компонентов. Убедитесь, что все дочерние компоненты также являются «чистыми».

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* рендер с использованием пропсов */
});
```

`React.memo` — это [компонент высшего порядка](/docs/higher-order-components.html). Он похож на [`React.PureComponent`](#reactpurecomponent), но предназначен для функциональных компонентов.

Если ваш функциональный компонент рендерит один и тот же результат с теми же пропсами, вы можете обернуть его в вызов `React.memo` для повышения производительности в некоторых случаях, мемоизируя результат. Это значит, что React будет использовать последний результат рендера, избегая повторной отрисовки.

По умолчанию он поверхностно сравнивает вложенные объекты в объекте `props`. Если вы хотите контролировать сравнение, вы можете предать свою функцию сравнения в качестве второго аргумента.

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

Создаёт и возвращает новый [React-элемент](/docs/rendering-elements.html) определенного типа. Аргументом `type` может быть строка, содержащая имя тега (например, `'div'` или `'span'`), React-компонент (класс или функция) или [React-фрагмент](#reactfragment).

Код написанный с использованием JSX, будет преобразован в `React.createElement()`. Обычно вы не будете вызывать `React.createElement()` напрямую, если вы используете JSX. Смотрите [React без JSX](/docs/react-without-jsx.html), чтобы узнать больше.

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

Клонирует и возвращает новый React элемент, используя элемент в качестве отправной точки. Полученный элемент будет иметь пропсы исходного элемента, а новые пропсы будут поверхностно объединены. Новые дочерние элементы заменят существующие. `key` и `ref` из исходного элемента будут сохранены.

`React.cloneElement()` почти эквивалентен:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Однако, в этом случае, сохранятся `ref`. Это означает если вы получите ребенка с `ref` на нем, вы случайно не украдете его у родителя. Вы получите тот же `ref`, прикрепленный к вашему новому элементу.

Этот API был представлен как замена устаревшего `React.addons.cloneWithProps()`.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Возвращает функцию, которая создавёт элементы React заданного типа. Как и [`React.createElement()`](#createElement), аргументом `type` может быть строка содержащая имя тега (например, `'div'` или `'span'`), React-компонент (класс или функция) или [React-фрагмент](#reactfragment).

Этот помощник считается устаревшим, и мы рекомендуем вам либо использовать JSX, либо напрямую использовать `React.createElement()`.

Обычно вы не будете вызывать `React.createFactory()` напрямую, если вы используете JSX. Смотрите [React без JSX](/docs/react-without-jsx.html), чтобы узнать больше.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Проверяет, что объект является элементом React. Возвращает `true` или `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` предоставляет утилиты для работы с непрозрачной структурой данных `this.props.children`.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Вызывает функцию для каждого непосредственного потомка, содержащегося в `children` передавая их по очереде в `thisArg`. Если `children` — это массив, он будет пройден, и функция будет вызвана для каждого потомка в массиве. Если `children` равен `null` или `undefined`, этот метод вернет `null` или `undefined`, а не массив.

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

Проверяет, что у `children` есть только один потомок (React элемент), и возвращает его. Иначе этот метод выдает ошибку.

> Примечание:
>
> `React.Children.only()` не принимает возвращаемое значение [`React.Children.map()`](#reactchildrenmap), потому что это массив, а не React элемент.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Возвращает непрозрачную структуру данных `children` в виде плоского массива с ключами, заданые каждому дочернему элементу. Полезно, если вы хотите манипулировать коллекциями потомков в ваших методах рендера, особенно если вы хотите отсортировать или срезать `this.props.children` перед передачей вниз.

> Примечание:
>
> `React.Children.toArray()` изменяет ключи, чтобы сохранить семантику вложенных массивов, когда делает плоским списков дочерних элементов. То есть `toArray` ставит префикс перед каждым ключом в возвращаемом массиве, так что ключ каждого элемента находится в области входного массива, содержащего его.

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

Вы также можете использовать его сокращенный синтаксис `<></>`. Чтобы узнать подробнее см. [React v16.2.0: Улучшенная поддержка фрагментов](/blog/2017/11/28/react-v16.2.0-fragment-support.html).

### `React.createRef` {#reactcreateref}

`React.createRef` создаёт [реф](/docs/refs-and-the-dom.html), который можно прикрепить к React элементам через атрибут ref.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` создаёт React компонент, который перенаправляет атрибут [ref](/docs/refs-and-the-dom.html), что он получает, другому компоненту ниже в дереве.
Этот метод не очень распространен, но особенно полезен в двух сценариях:

* [Пересылка рефов на компоненты DOM](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Пересылка рефов на компоненты высшего порядка](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` принимает функцию рендера в качестве аргумента. React будет вызывать эту функцию с пропсами и рефом в качестве двух аргументов. Эта функция должна возвращать узел React.

`embed:reference-react-forward-ref.js`

В приведенном выше примере React передает `ref`, переданный элементу `<FancyButton ref={ref}>` в качестве второго аргумента функции рендера внутри вызова `React.forwardRef`. Функция рендера передает `ref` в элемент `<button ref={ref}>`.

В результате после того как React добавит реф, `ref.current` будет указывать непосредственно на экземпляр `<button>` элемента DOM.

Чтобы узнать подробнее см. [Переадресация рефов](/docs/forwarding-refs.html).

### `React.lazy` {#reactlazy}

`React.lazy()` позволяет вам определять компонент, который загружается динамически. Это помогает уменьшить размер сборки, откладывая загрузку компонентов, которые не используются во время первоначального рендера.

Вы можете узнать, как пользоватся этим из нашей [документации по разделению кода](/docs/code-splitting.html#reactlazy). Вы также можете посмотреть [эту статью](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) с объяснением, как использовать этот метод более подробно.

```js
// Этот компонент загружается динамически
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Обратите внимание, для рендера `lazy` компонентов требуется чтобы выше в дереве находился компонент `<React.Suspense>`. Это позволит вам отображать индикатор загрузки.

> **Примечание**
>
> Использование `React.lazy` с динамическим импортом требует доступности Promises в среде JS. Для IE11 и ниже необходим полифил.

### `React.Suspense` {#reactsuspense}

`React.Suspense` позволяет показать индикатор загрузки в случае если некоторые компоненты в дереве под ним еще не готовы к рендеру. Сегодня ленивая загрузка компонентов — это **единственный** вариант использования поддерживаемый `<React.Suspense>`:

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

Это задокументировано в нашем руководстве по [разделению кода](/docs/code-splitting.html#reactlazy). Обратите внимание, что `lazy` компоненты могут быть глубоко внутри дерева `Suspense` -- не нужно оборачивать каждый из них. Лучшая практика, размещать `<Suspense>` там где вы хотите видеть индикатор загрузки, но использовать `lazy()` везде, где вы хотите разделить код. 

Хотя это не поддерживается сегодня, в будущем мы планируем позволить `Suspense` обрабатывать больше сценариев, таких как получение данных с API. Вы можете прочитать об этом в [нашей дорожной карте](/blog/2018/11/27/react-16-roadmap.html).

>Примечание:
>
> `React.lazy()` и `<React.Suspense>` еще не поддерживаются `ReactDOMServer`. Это известное ограничение, которое будет устранено в будущем.
