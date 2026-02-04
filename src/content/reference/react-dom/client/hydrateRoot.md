---
title: hydrateRoot
---

<Intro>

`hydrateRoot` позволяет отображать React-компоненты внутри узла DOM браузера, HTML-содержимое которого было ранее сгенерировано [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Вызовите `hydrateRoot`, чтобы «прикрепить» React к существующему HTML, который уже был отрендерен React на серверной стороне.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React прикрепится к HTML, который существует внутри `domNode`, и возьмёт на себя управление DOM внутри него. Приложение, полностью построенное на React, обычно будет иметь только один вызов `hydrateRoot` с его корневым компонентом.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `domNode`: [DOM-элемент](https://developer.mozilla.org/en-US/docs/Web/API/Element), который был отрендерен как корневой элемент на сервере.

* `reactNode`: «React-узел», использованный для рендеринга существующего HTML. Обычно это JSX-фрагмент вроде `<App />`, который был отрендерен с помощью метода `ReactDOM Server`, такого как `renderToPipeableStream(<App />)`.

* **необязательный** `options`: Объект с опциями для этого React-корня.

  * **необязательный** `onCaughtError`: Коллбэк, вызываемый, когда React перехватывает ошибку в Error Boundary. Вызывается с `error`, перехваченной Error Boundary, и объектом `errorInfo`, содержащим `componentStack`.
  * **необязательный** `onUncaughtError`: Коллбэк, вызываемый, когда выбрасывается ошибка, не перехваченная Error Boundary. Вызывается с `error`, которая была выброшена, и объектом `errorInfo`, содержащим `componentStack`. Некоторые восстанавливаемые ошибки могут включать исходную причину ошибки как `error.cause`.
  * **необязательный** `onRecoverableError`: Коллбэк, вызываемый, когда React автоматически восстанавливается после ошибок. Вызывается с `error`, которую выбрасывает React, и объектом `errorInfo`, содержащим `componentStack`. Некоторые восстанавливаемые ошибки могут включать исходную причину ошибки как `error.cause`.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для идентификаторов, сгенерированных [`useId`.](/reference/react/useId) Полезен для избежания конфликтов при использовании нескольких корней на одной странице. Должен быть тем же префиксом, что использовался на сервере.


#### Возвращает {/*returns*/}

`hydrateRoot` возвращает объект с двумя методами: [`render`](#root-render) и [`unmount`.](#root-unmount)

#### Ограничения {/*caveats*/}

* `hydrateRoot()` ожидает, что отрендеренное содержимое будет идентично содержимому, отрендеренному на сервере. Расхождения следует рассматривать как ошибки и исправлять их.
* В режиме разработки React выдаёт предупреждения о расхождениях во время гидратации. Нет никаких гарантий, что различия в атрибутах будут исправлены в случае расхождений. Это важно по соображениям производительности, поскольку в большинстве приложений расхождения редки, и проверка всей разметки была бы непомерно дорогой.
* Скорее всего, в вашем приложении будет только один вызов `hydrateRoot`. Если вы используете фреймворк, он может выполнить этот вызов за вас.
* Если ваше приложение рендерится на клиенте без предварительно отрендеренного HTML, использование `hydrateRoot()` не поддерживается. Вместо этого используйте [`createRoot()`](/reference/react-dom/client/createRoot).

---

### `root.render(reactNode)` {/*root-render*/}

Вызовите `root.render`, чтобы обновить React-компонент внутри гидрированного React-корня для DOM-элемента браузера.

```js
root.render(<App />);
```

React обновит `<App />` в гидрированном `root`.

[См. больше примеров ниже.](#usage)

#### Параметры {/*root-render-parameters*/}

* `reactNode`: «React-узел», который вы хотите обновить. Обычно это JSX-фрагмент вроде `<App />`, но вы также можете передать React-элемент, созданный с помощью [`createElement()`](/reference/react/createElement), строку, число, `null` или `undefined`.


#### Возвращает {/*root-render-returns*/}

`root.render` возвращает `undefined`.

#### Ограничения {/*root-render-caveats*/}

* Если вы вызовете `root.render` до того, как корень завершит гидратацию, React очистит существующее HTML-содержимое, отрендеренное на сервере, и переключит весь корень на клиентский рендеринг.

---

### `root.unmount()` {/*root-unmount*/}

Вызовите `root.unmount`, чтобы уничтожить отрендеренное дерево внутри React-корня.

```js
root.unmount();
```

Приложение, полностью построенное на React, обычно не будет иметь вызовов `root.unmount`.

Это в основном полезно, если DOM-узел React-корня (или любой из его предков) может быть удалён из DOM каким-либо другим кодом. Например, представьте себе панель вкладок jQuery, которая удаляет неактивные вкладки из DOM. Если вкладка удаляется, всё внутри неё (включая React-корни внутри) также будет удалено из DOM. Вам нужно сообщить React, чтобы он «остановил» управление содержимым удалённого корня, вызвав `root.unmount`. В противном случае компоненты внутри удалённого корня не будут очищены и не освободят ресурсы, такие как подписки.

Вызов `root.unmount` размонтирует все компоненты в корне и «отсоединит» React от корневого DOM-узла, включая удаление любых обработчиков событий или состояния в дереве.


#### Параметры {/*root-unmount-parameters*/}

`root.unmount` не принимает никаких параметров.


#### Возвращает {/*root-unmount-returns*/}

`root.unmount` возвращает `undefined`.

#### Ограничения {/*root-unmount-caveats*/}

* Вызов `root.unmount` размонтирует все компоненты в дереве и «отсоединит» React от корневого DOM-узла.

* После вызова `root.unmount` вы больше не сможете вызвать `root.render` для этого корня. Попытка вызвать `root.render` для размонтированного корня приведёт к ошибке "Cannot update an unmounted root".

---

## Гидратация {/*usage*/}

### Гидратация HTML, сгенерированного сервером {/*hydrating-server-rendered-html*/}

Если HTML вашего приложения был сгенерирован [`react-dom/server`](/reference/react-dom/client/createRoot), вам нужно *гидрировать* его на клиенте.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Это гидрирует HTML сервера внутри <CodeStep step={1}>DOM-узла браузера</CodeStep> с помощью <CodeStep step={2}>компонента React</CodeStep> вашего приложения. Обычно это делается один раз при запуске. Если вы используете фреймворк, он может делать это за вас "под капотом".

Чтобы гидрировать ваше приложение, React "прикрепит" логику ваших компонентов к первоначальному HTML, сгенерированному сервером. Гидратация превращает первоначальный снимок HTML с сервера в полностью интерактивное приложение, работающее в браузере.

<Sandpack>

```html public/index.html
<!--
  HTML-контент внутри <div id="root">...</div>
  был сгенерирован из App с помощью react-dom/server.
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

Вам не нужно будет вызывать `hydrateRoot` снова или вызывать его в других местах. С этого момента React будет управлять DOM вашего приложения. Для обновления UI ваши компоненты будут использовать [состояние](/reference/react/useState) вместо этого.

<Pitfall>

Дерево React, которое вы передаёте в `hydrateRoot`, должно производить **тот же вывод**, что и на сервере.

Это важно для пользовательского опыта. Пользователь будет некоторое время смотреть на HTML, сгенерированный сервером, прежде чем ваш JavaScript-код загрузится. Серверный рендеринг создает иллюзию более быстрой загрузки приложения, показывая снимок его вывода. Внезапное отображение другого контента нарушает эту иллюзию. Вот почему вывод серверного рендеринга должен совпадать с выводом первоначального рендеринга на клиенте.

Наиболее частые причины ошибок гидратации включают:

* Дополнительные пробелы (например, переносы строк) вокруг HTML, сгенерированного React, внутри корневого узла.
* Использование проверок типа `typeof window !== 'undefined'` в вашей логике рендеринга.
* Использование браузерных API, таких как [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) в вашей логике рендеринга.
* Рендеринг разных данных на сервере и клиенте.

React восстанавливается после некоторых ошибок гидратации, но **вы должны исправлять их, как и другие ошибки.** В лучшем случае они приведут к замедлению работы; в худшем случае обработчики событий могут быть прикреплены к неправильным элементам.

</Pitfall>

---

### Гидратация всего документа {/*hydrating-an-entire-document*/}

Приложения, полностью построенные на React, могут рендерить весь документ как JSX, включая тег [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html):

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

### Подавление неизбежных ошибок несоответствия при гидратации {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Если атрибут или текстовое содержимое отдельного элемента неизбежно отличается между сервером и клиентом (например, временная метка), вы можете подавить предупреждение о несоответствии при гидратации.

Чтобы подавить предупреждения гидратации для элемента, добавьте `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML-контент внутри <div id="root">...</div>
  был сгенерирован из App с помощью react-dom/server.
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

Это работает только на одном уровне вложенности и предназначено для использования в крайних случаях. Не злоупотребляйте этим. React **не** будет пытаться исправить несоответствующий текстовый контент.

---

### Обработка различного контента клиента и сервера {/*handling-different-client-and-server-content*/}

Если вы намеренно хотите рендерить что-то разное на сервере и клиенте, вы можете использовать двухпроходный рендеринг. Компоненты, которые рендерят что-то разное на клиенте, могут читать [переменную состояния](/reference/react/useState) вроде `isClient`, которую вы можете установить в `true` в [эффекте](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  HTML-контент внутри <div id="root">...</div>
  был сгенерирован из App с помощью react-dom/server.
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

Таким образом, первый проход рендеринга будет рендерить тот же контент, что и сервер, избегая несоответствий, но сразу после гидратации будет выполнен дополнительный синхронный проход.

<Pitfall>

Этот подход замедляет гидратацию, потому что ваши компоненты должны рендериться дважды. Помните о пользовательском опыте при медленных соединениях. JavaScript-код может загрузиться значительно позже первоначального рендеринга HTML, поэтому рендеринг другого UI сразу после гидратации также может показаться пользователю резким.

</Pitfall>

---

### Обновление гидрированного корневого компонента {/*updating-a-hydrated-root-component*/}

После завершения гидратации корневого узла вы можете вызвать [`root.render`](#root-render) для обновления корневого компонента React. **В отличие от [`createRoot`](/reference/react-dom/client/createRoot), вам обычно не нужно делать это, поскольку первоначальный контент уже был отрендерен как HTML.**

Если вы вызовете `root.render` в какой-то момент после гидратации, и структура дерева компонентов совпадет с ранее отрендеренной, React [сохранит состояние.](/learn/preserving-and-resetting-state) Обратите внимание, что вы можете вводить текст в поле ввода, что означает, что обновления от повторных вызовов `render` каждую секунду в этом примере не являются деструктивными:

<Sandpack>

```html public/index.html
<!--
  Весь HTML-контент внутри <div id="root">...</div> был
  сгенерирован рендерингом <App /> с помощью react-dom/server.
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

Вызывать [`root.render`](#root-render) для гидрированного корневого узла нечасто. Обычно вы будете [обновлять состояние](/reference/react/useState) внутри одного из компонентов.

### Логирование ошибок в продакшене {/*error-logging-in-production*/}

По умолчанию React будет логировать все ошибки в консоль. Чтобы реализовать собственную систему отчетов об ошибках, вы можете предоставить необязательные параметры корневого узла для обработчиков ошибок: `onUncaughtError`, `onCaughtError` и `onRecoverableError`:

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
2. Объект <CodeStep step={3}>errorInfo</CodeStep>, содержащий <CodeStep step={4}>componentStack</CodeStep> ошибки.

Вместе с `onUncaughtError` и `onRecoverableError` вы можете реализовать свою собственную систему отчетности об ошибках:

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
  // чтобы использовать стандартные обработчики React или реализовать свой
  // оверлей для разработки.
  // Обработчики здесь указаны безусловно только для демонстрационных целей.
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
  Намеренно используется HTML-контент, отличающийся от контента,
  сгенерированного сервером, чтобы вызвать восстанавливаемые ошибки.
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