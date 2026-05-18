---
title: hydrateRoot
---
<Intro>

`hydrateRoot` позволяет отображать компоненты React внутри узла DOM браузера, HTML-содержимое которого было ранее сгенерировано [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Вызовите `hydrateRoot`, чтобы «прикрепить» React к существующему HTML, который уже был отрисован React на сервере.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React прикрепится к HTML, который существует внутри `domNode`, и возьмёт на себя управление DOM внутри него. Приложение, полностью построенное с использованием React, обычно будет иметь только один вызов `hydrateRoot` с его корневым компонентом.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `domNode`: [DOM-элемент](https://developer.mozilla.org/en-US/docs/Web/API/Element), который был отрисован как корневой элемент на сервере.

* `reactNode`: «React-узел», использованный для отрисовки существующего HTML. Обычно это фрагмент JSX, такой как `<App />`, который был отрисован с помощью метода `ReactDOM Server`, например `renderToPipeableStream(<App />)`.

* **необязательный** `options`: Объект с параметрами для этого корневого узла React.

  * **необязательный** `onCaughtError`: Функция обратного вызова, вызываемая, когда React перехватывает ошибку в Error Boundary. Вызывается с ошибкой `error`, перехваченной Error Boundary, и объектом `errorInfo`, содержащим `componentStack`.
  * **необязательный** `onUncaughtError`: Функция обратного вызова, вызываемая, когда выбрасывается ошибка, не перехваченная Error Boundary. Вызывается с ошибкой `error`, которая была выброшена, и объектом `errorInfo`, содержащим `componentStack`.
  * **необязательный** `onRecoverableError`: Функция обратного вызова, вызываемая, когда React автоматически восстанавливается после ошибок. Вызывается с ошибкой `error`, которую выбрасывает React, и объектом `errorInfo`, содержащим `componentStack`. Некоторые восстанавливаемые ошибки могут включать исходную причину ошибки как `error.cause`.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для идентификаторов, сгенерированных [`useId`.](/reference/react/useId) Полезен для предотвращения конфликтов при использовании нескольких корневых узлов на одной странице. Должен быть тем же префиксом, что и использованный на сервере.


#### Возвращает {/*returns*/}

`hydrateRoot` возвращает объект с двумя методами: [`render`](#root-render) и [`unmount`.](#root-unmount)

#### Ограничения {/*caveats*/}

* `hydrateRoot()` ожидает, что отрисованное содержимое будет идентично содержимому, отрисованному на сервере. Расхождения следует рассматривать как ошибки и исправлять их.
* В режиме разработки React предупреждает о расхождениях во время гидратации. Нет никаких гарантий, что различия в атрибутах будут исправлены в случае расхождений. Это важно по соображениям производительности, поскольку в большинстве приложений расхождения редки, и проверка всего разметки была бы непомерно дорогой.
* Вероятно, в вашем приложении будет только один вызов `hydrateRoot`. Если вы используете фреймворк, он может выполнить этот вызов за вас.
* Если ваше приложение отрисовывается на клиенте без предварительно отрисованного HTML, использование `hydrateRoot()` не поддерживается. Вместо этого используйте [`createRoot()`](/reference/react-dom/client/createRoot).

---

### `root.render(reactNode)` {/*root-render*/}

Вызовите `root.render`, чтобы обновить компонент React внутри гидрированного корневого узла React для браузерного DOM-элемента.

```js
root.render(<App />);
```

React обновит `<App />` в гидрированном `root`.

[См. больше примеров ниже.](#usage)

#### Параметры {/*root-render-parameters*/}

* `reactNode`: «React-узел», который вы хотите обновить. Обычно это фрагмент JSX, такой как `<App />`, но вы также можете передать React-элемент, созданный с помощью [`createElement()`](/reference/react/createElement), строку, число, `null` или `undefined`.


#### Возвращает {/*root-render-returns*/}

`root.render` возвращает `undefined`.

#### Ограничения {/*root-render-caveats*/}

* Если вы вызовете `root.render` до того, как корневой узел закончит гидратацию, React очистит существующее содержимое HTML, отрисованное на сервере, и переключит весь корневой узел на рендеринг на клиенте.

---

### `root.unmount()` {/*root-unmount*/}

Вызовите `root.unmount`, чтобы уничтожить отрисованное дерево внутри корневого узла React.

```js
root.unmount();
```

Приложение, полностью построенное с использованием React, обычно не будет иметь вызовов `root.unmount`.

Это в основном полезно, если DOM-узел вашего корневого узла React (или любой из его предков) может быть удален из DOM каким-либо другим кодом. Например, представьте себе панель вкладок jQuery, которая удаляет неактивные вкладки из DOM. Если вкладка удаляется, все внутри нее (включая корневые узлы React) также будет удалено из DOM. Вам нужно сообщить React, чтобы он «прекратил» управление содержимым удаленного корневого узла, вызвав `root.unmount`. В противном случае компоненты внутри удаленного корневого узла не будут очищены и не освободят ресурсы, такие как подписки.

Вызов `root.unmount` размонтирует все компоненты в корневом узле и «отсоединит» React от корневого DOM-узла, включая удаление любых обработчиков событий или состояния в дереве.


#### Параметры {/*root-unmount-parameters*/}

`root.unmount` не принимает никаких параметров.


#### Возвращает {/*root-unmount-returns*/}

`root.unmount` возвращает `undefined`.

#### Ограничения {/*root-unmount-caveats*/}

* Вызов `root.unmount` размонтирует все компоненты в дереве и «отсоединит» React от корневого DOM-узла.

* После вызова `root.unmount` вы больше не сможете вызывать `root.render` для этого корневого узла. Попытка вызвать `root.render` для размонтированного корневого узла приведет к ошибке "Cannot update an unmounted root".

---

## Использование {/*usage*/}

### Гидратация HTML, отрисованного на сервере {/*hydrating-server-rendered-html*/}

Если HTML вашего приложения был сгенерирован [`react-dom/server`](/reference/react-dom/client/createRoot), вам нужно *гидрировать* его на клиенте.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Это гидрирует HTML сервера внутри <CodeStep step={1}>DOM-узла браузера</CodeStep> с помощью <CodeStep step={2}>компонента React</CodeStep> вашего приложения. Обычно вы делаете это один раз при запуске. Если вы используете фреймворк, он может сделать это за вас в фоновом режиме.

Чтобы гидрировать ваше приложение, React «прикрепит» логику ваших компонентов к начальному HTML, сгенерированному сервером. Гидратация превращает начальный снимок HTML с сервера в полностью интерактивное приложение, которое работает в браузере.

<Sandpack>

```html public/index.html
<!--
  HTML-содержимое внутри <div id="root">...</div>
  было сгенерировано из App с помощью react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

Вам не нужно будет снова вызывать `hydrateRoot` или вызывать его в других местах. С этого момента React будет управлять DOM вашего приложения. Чтобы обновлять UI, ваши компоненты будут использовать [состояние](/reference/react/useState) вместо этого.

<Pitfall>

React-дерево, которое вы передаете в `hydrateRoot`, должно производить **тот же вывод**, что и на сервере.

Это важно для пользовательского опыта. Пользователь будет некоторое время смотреть на HTML, сгенерированный сервером, до того, как ваш JavaScript-код загрузится. Серверный рендеринг создает иллюзию более быстрой загрузки приложения, показывая снимок его вывода в виде HTML. Внезапное отображение другого содержимого нарушает эту иллюзию. Именно поэтому вывод серверного рендеринга должен совпадать с выводом начального рендеринга на клиенте.

Наиболее распространенные причины ошибок гидратации включают:

* Дополнительные пробелы (например, переносы строк) вокруг HTML, сгенерированного React, внутри корневого узла.
* Использование проверок, таких как `typeof window !== 'undefined'` в вашей логике рендеринга.
* Использование API, доступных только в браузере, таких как [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) в вашей логике рендеринга.
* Рендеринг различных данных на сервере и клиенте.

React восстанавливается после некоторых ошибок гидратации, но **вы должны исправлять их, как и другие ошибки.** В лучшем случае они приведут к замедлению работы; в худшем случае обработчики событий могут быть прикреплены к неправильным элементам.

</Pitfall>

---

### Гидратация всего документа {/*hydrating-an-entire-document*/}

Приложения, полностью построенные с использованием React, могут отрисовывать весь документ как JSX, включая тег [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html):

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

Чтобы гидрировать весь документ, передайте глобальный объект [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) в качестве первого аргумента `hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### Подавление неизбежных ошибок расхождения при гидратации {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Если атрибут или текстовое содержимое одного элемента неизбежно отличается между сервером и клиентом (например, временная метка), вы можете подавить предупреждение о расхождении при гидратации.

Чтобы подавить предупреждения гидратации для элемента, добавьте `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML-содержимое внутри <div id="root">...</div>
  было сгенерировано из App с помощью react-dom/server.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Это работает только на одном уровне вложенности и предназначено для использования в крайних случаях. Не злоупотребляйте этим. React **не** будет пытаться исправить несовпадающее текстовое содержимое.

---

### Обработка различного содержимого клиента и сервера {/*handling-different-client-and-server-content*/}

Если вам намеренно нужно отрисовать что-то разное на сервере и клиенте, вы можете выполнить рендеринг в два прохода. Компоненты, которые отрисовывают что-то разное на клиенте, могут считывать [переменную состояния](/reference/react/useState), такую как `isClient`, которую вы можете установить в `true` в [Effect](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  HTML-содержимое внутри <div id="root">...</div>
  было сгенерировано из App с помощью react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

Таким образом, первый проход рендеринга отрисует то же содержимое, что и сервер, избегая расхождений, но дополнительный проход будет выполнен синхронно сразу после гидратации.

<Pitfall>

Этот подход замедляет гидратацию, поскольку ваши компоненты должны рендериться дважды. Помните о пользовательском опыте при медленных соединениях. Код JavaScript может загрузиться значительно позже начального рендеринга HTML, поэтому рендеринг другого UI сразу после гидратации также может показаться пользователю резким.

</Pitfall>

---

### Обновление гидрированного корневого компонента {/*updating-a-hydrated-root-component*/}

После того как корневой узел закончит гидратацию, вы можете вызвать [`root.render`](#root-render) для обновления корневого компонента React. **В отличие от [`createRoot`](/reference/react-dom/client/createRoot), вам обычно не нужно делать это, поскольку начальное содержимое уже было отрисовано как HTML.**

Если вы вызовете `root.render` в какой-то момент после гидратации, и структура дерева компонентов совпадет с ранее отрисованной, React [сохранит состояние.](/learn/preserving-and-resetting-state) Обратите внимание, как вы можете вводить текст в поле ввода, что означает, что обновления от повторяющихся вызовов `render` каждую секунду в этом примере не являются разрушительными:

<Sandpack>

```html public/index.html
<!--
  Все HTML-содержимое внутри <div id="root">...</div> было
  сгенерировано путем рендеринга <App /> с помощью react-dom/server.
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

Вызывать [`root.render`](#root-render) для гидрированного корневого узла нечасто. Обычно вы будете [обновлять состояние](/reference/react/useState) внутри одного из компонентов вместо этого.

### Логирование ошибок в продакшене {/*error-logging-in-production*/}

По умолчанию React будет записывать все ошибки в консоль. Чтобы реализовать собственную отчетность об ошибках, вы можете предоставить необязательные параметры корневого узла для обработки ошибок: `onUncaughtError`, `onCaughtError` и `onRecoverableError`:

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack", 15]]
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

Параметр <CodeStep step={1}>onCaughtError</CodeStep> — это функция, вызываемая с двумя аргументами:

1. <CodeStep step={2}>Ошибка</CodeStep>, которая была выброшена.
2. Объект <CodeStep step={3}>errorInfo</CodeStep>, который содержит <CodeStep step={4}>componentStack</CodeStep> ошибки.

Вместе с `onUncaughtError` и `onRecoverableError` вы можете реализовать собственную систему отчетности об ошибках:

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // Конкретная реализация зависит от вас.
  // `console.error()` используется только в демонстрационных целях.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // Имейте в виду, что в режиме разработки следует удалить эти параметры,
  // чтобы использовать стандартные обработчики React или реализовать свой собственный оверлей для разработки.
  // Обработчики указаны здесь безусловно только в демонстрационных целях.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        Trigger uncaught error
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Trigger caught error
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Намеренно используем HTML-содержимое, отличающееся от отрисованного на сервере, чтобы вызвать восстанавливаемые ошибки.
-->
<div id="root">Server content before hydration.</div>
</body>
</html>
```
</Sandpack>

## Устранение неполадок {/*troubleshooting*/}


### Я получаю ошибку: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Распространенная ошибка — передача параметров для `hydrateRoot` в `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

Чтобы исправить это, передайте параметры корневого узла в `hydrateRoot(...)`, а не в `root.render(...)`:
```js {2,5}
// 🚩 Неправильно: root.render принимает только один аргумент.
root.render(App, {onUncaughtError});

// ✅ Правильно: передайте параметры в createRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```