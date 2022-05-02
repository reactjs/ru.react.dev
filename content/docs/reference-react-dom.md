---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
Когда вы загружаете React с помощью тега `<script>`, глобальный `ReactDOM` предоставляет вам доступ к высокоуровневым API-методам. Если вы используете ES6 с npm, можете написать `import ReactDOM from 'react-dom'`, а в случае ES5 с npm — `var ReactDOM = require('react-dom')`.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

## Обзор {#overview}

<<<<<<< HEAD
Пакет `react-dom` предоставляет специфические для DOM методы, которые могут быть использованы на верхнем уровне вашего приложения. Кроме этого, эти методы можно использовать в качестве лазейки, чтобы выйти из модели React, если вам будет это нужно. Поэтому большинство из ваших компонентов не должны использовать этот модуль.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### Поддержка браузерами {#browser-support}

<<<<<<< HEAD
React поддерживает все популярные браузеры, включая Internet Explorer 9 и выше, хотя [понадобятся полифилы](/docs/javascript-environment-requirements.html) для более старых браузеров, например, IE 9 или IE 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

> Примечание
>
<<<<<<< HEAD
> Мы не поддерживаем старые браузеры, в которых отсутствуют ES5-методы. Возможно, вам удастся обойти эту проблему старых браузеров, если вы подключите шимы [es5-shim и es5-sham](https://github.com/es-shims/es5-shim). Пожалуйста учтите, что этот путь официально не поддерживается и вы принимаете решение на свой страх и риск.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

## Справочник {#browser-support}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
Рендерит React-элемент в DOM-элемент, переданный в аргумент `container` и возвращает [ссылку](/docs/more-about-refs.html) на компонент (или возвращает `null` для [компонентов без состояния](/docs/components-and-props.html#function-and-class-components)).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Note:
> 
> `flushSync` can significantly hurt performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

Если React-элемент уже был ранее отрендерен в `container`, то повторный вызов произведёт его обновление и изменит соответствующую часть DOM, чтобы она содержала последние изменения.

Если дополнительно был предоставлен колбэк, он будет вызван после того, как компонент отрендерится или обновится.

> Примечание:
>
<<<<<<< HEAD
> `ReactDOM.render()` управляет содержимым передаваемого вами узла контейнера. Любые существующие элементы DOM внутри заменяются при первом вызове. Более поздние вызовы используют алгоритм отслеживания изменений React DOM для эффективного обновления.
>
> `ReactDOM.render()` не изменяет узел контейнера (изменяет только дочерние элементы контейнера). Если нужно, можно вставить компонент в существующий узел DOM без перезаписи существующих дочерних элементов.
>
> `ReactDOM.render()` в настоящее время возвращает ссылку на корневой экземпляр `ReactComponent`. Однако использование этого возвращаемого значения является устаревшим
> и этого следует избегать, потому что в будущих версиях React-компоненты могут отображаться асинхронно в некоторых случаях. Если вам нужна ссылка на корневой экземпляр `ReactComponent`, предпочтительным решением является прикрепить
> [реф (ref) на колбэк](/docs/refs-and-the-dom.html#callback-refs) к корневому элементу.
>
> Использование `ReactDOM.render()` для гидратации контейнера, отрендеренного на сервере, объявлено устаревшим и будет удалено в React 17. Вместо этого используйте метод [`hydrate()`](#hydrate).
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
То же, что и [`render()`](#render), но используется для гидратации контейнера, HTML-содержимое которого было отрендерено с помощью [`ReactDOMServer`](/docs/react-dom-server.html). React попытается присоединить обработчики событий к уже существующей разметке.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

React ожидает, что отрендеренное содержимое идентично на сервере, и на клиенте. Текстовые различия в контенте могут быть переписаны поверх, но вам следует рассматривать такие нестыковки как ошибки и исправлять их. В режиме разработки React предупреждает о несоответствиях во время гидратации. Нет никаких гарантий, что различия атрибутов будут исправлены в случае несовпадений. Это важно по соображениям производительности, поскольку в большинстве приложений несоответствия встречаются редко, и поэтому проверка всей разметки будет непомерно дорогой.

Если атрибут отдельного элемента или текстовое содержимое неизбежно отличается на сервере и клиенте (например, отметка времени), вы можете отключить предупреждение, добавив к элементу `suppressHydrationWarning={true}`. Он работает только на один уровень в глубину, и задумана как лазейка. Не злоупотребляйте ею. Если это не текстовый контент, React по-прежнему не будет пытаться его исправить, поэтому он может оставаться несовместимым c обновлённым в будущем вариантом.

Если вам нужно намеренно отрендерить что-то другое на сервере и клиенте, вы можете выполнить двухпроходный рендеринг. Компоненты, которые рендерят что-то другое на клиенте, могут читать переменную состояния, такую как `this.state.isClient`, которую вы можете установить в `true` в `componentDidMount()`. Таким образом, начальный этап рендеринга будет отображать тот же контент, что и сервер, избегая несовпадений, но дополнительный этап будет происходить синхронно сразу после гидратации. Обратите внимание, что этот подход замедлит ваши компоненты, потому что они должны рендерится дважды, поэтому используйте его с осторожностью.

Не забывайте про работу с вашим приложением при медленных соединениях. JavaScript-код может загружаться значительно позже исходного HTML-рендеринга, поэтому, если вы рендерите что-то другое только для клиента, переход может вызвать раздражение. Тем не менее, при правильном выполнении может оказаться полезным отобразить «оболочку» приложения на сервере и показать только некоторые дополнительные виджеты на клиенте. Чтобы узнать, как это сделать без проблем с разметкой, обратитесь к объяснению в предыдущем абзаце.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
Удаляет смонтированный компонент React из DOM и очищает его обработчики событий и состояние. Если в контейнер не было смонтировано ни одного компонента, вызов этой функции ничего не делает. Возвращает `true`, если компонент был размонтирован, и `false` если нет компонента для размонтирования.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

* * *

### `findDOMNode()` {#finddomnode}

> Примечание:
>
> `findDOMNode` — это лазейка, используемая для доступа к базовому узлу DOM. В большинстве случаев использование этого метода не рекомендуется, поскольку он нарушает абстракцию компонента. [Метод устарел в `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```

Если этот компонент был смонтирован в DOM, он возвращает соответствующий DOM-элемент браузера. Этот метод полезен для чтения напрямую из DOM (например, чтение значений полей формы) или произведения измерений DOM. **В большинстве случаев, вы можете присоединить реф к узлу DOM и полностью избежать использования `findDOMNode`.** 

Когда компонент рендерится в `null` или `false`, `findDOMNode` возвращает `null`. Когда компонент рендерится в строку, `findDOMNode` возвращает текстовый узел DOM, содержащий это значение. Начиная с React 16, компонент может возвращать фрагмент с несколькими дочерними элементами, и в этом случае `findDOMNode` возвращает DOM-узел, соответствующий первому непустому дочернему элементу.

> Примечание:
>
> `findDOMNode` работает только с смонтированными компонентами (то есть компонентами, которые были размещены в DOM). Если вы попытаетесь вызвать этот метод для компонента, который ещё не был смонтирован (например, вызовете `findDOMNode()` в методе `render()` для компонента, который ещё не был создан), будет сгенерировано исключение.
>
> `findDOMNode` не может быть использован с функциональными компонентами.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Создаёт портал. Порталы предоставляют способ [отрендерить дочерние элементы в узле DOM, который существует вне иерархии DOM-компонента](/docs/portals.html).
=======
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
