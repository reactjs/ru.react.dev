---
title: captureOwnerStack
---
<Intro>

`captureOwnerStack` считывает текущий стек владельцев (Owner Stack) в режиме разработки и возвращает его в виде строки, если он доступен.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

Вызовите `captureOwnerStack`, чтобы получить текущий стек владельцев.

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Параметры {/*parameters*/}

`captureOwnerStack` не принимает никаких параметров.

#### Возвращает {/*returns*/}

`captureOwnerStack` возвращает `string | null`.

Стеки владельцев доступны в:
- Рендере компонента
- Эффектах (например, `useEffect`)
- Обработчиках событий React (например, `<button onClick={...} />`)
- Обработчиках ошибок React ([параметры React Root](/reference/react-dom/client/createRoot#parameters) `onCaughtError`, `onRecoverableError` и `onUncaughtError`)

Если стек владельцев недоступен, возвращается `null` (см. [Устранение неполадок: Стек владельцев равен `null`](#the-owner-stack-is-null)).

#### Ограничения {/*caveats*/}

- Стеки владельцев доступны только в режиме разработки. `captureOwnerStack` всегда будет возвращать `null` вне режима разработки.

<DeepDive>

#### Стек владельцев против стека компонентов {/*owner-stack-vs-component-stack*/}

Стек владельцев отличается от стека компонентов, доступного в обработчиках ошибок React, таких как [`errorInfo.componentStack` в `onUncaughtError`](/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors).

Рассмотрим следующий код:

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // Стеки выводятся в лог вместо прямого отображения в UI, чтобы
    // подчеркнуть, что браузеры применяют sourcemaps к логгируемым стекам.
    // Обратите внимание, что sourcemapping применяется только в реальной консоли браузера, а не
    // в поддельной, отображаемой на этой странице.
    // Нажмите "fork", чтобы иметь возможность просмотреть стек с применением sourcemap в реальной консоли.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` вызовет ошибку.
Стек компонентов этой ошибки будет выглядеть так:

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

Однако стек владельцев будет содержать только:

```
at Component
```

Ни `App`, ни DOM-компоненты (например, `fieldset`) не считаются владельцами в этом стеке, поскольку они не способствовали "созданию" узла, содержащего `SubComponent`. `App` и DOM-компоненты только перенаправляли узел. `App` просто отрендерил узел `children`, в отличие от `Component`, который создал узел, содержащий `SubComponent`, через `<SubComponent />`.

Ни `Navigation`, ни `legend` вообще не присутствуют в стеке, поскольку они являются лишь соседями узла, содержащего `<SubComponent />`.

`SubComponent` пропущен, потому что он уже является частью стека вызовов.

</DeepDive>

## Использование {/*usage*/}

### Улучшение пользовательского оверлея ошибок {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Имейте в виду, что в реальном приложении console.error может быть
    // вызван с несколькими аргументами, которые следует учитывать.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

Если вы перехватываете вызовы <CodeStep step={1}>`console.error`</CodeStep>, чтобы выделить их в оверлее ошибок, вы можете вызвать <CodeStep step={2}>`captureOwnerStack`</CodeStep>, чтобы включить стек владельцев.

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
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
  Диалог ошибок в сыром HTML,
  поскольку ошибка в приложении React может привести к сбою.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red">Ошибка</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Стек владельцев:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Закрыть
  </button>
</div>
<!-- Это DOM-узел -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Отображение сообщения console.error()
  errorBody.innerText = consoleMessage;

  // Отображение стека владельцев
  errorOwnerStack.innerText = ownerStack;

  // Показать диалог
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Имейте в виду, что в реальном приложении console.error может быть
    // вызван с несколькими аргументами, которые следует учитывать.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Trigger console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## Устранение неполадок {/*troubleshooting*/}

### Стек владельцев равен `null` {/*the-owner-stack-is-null*/}

Вызов `captureOwnerStack` произошел вне функции, управляемой React, например, в колбэке `setTimeout`, после вызова `fetch` или в пользовательском обработчике событий DOM. Во время рендеринга, эффектов, обработчиков событий React и обработчиков ошибок React (например, `hydrateRoot#options.onCaughtError`) стеки владельцев должны быть доступны.

В приведенном ниже примере нажатие на кнопку приведет к выводу пустого стека владельцев, поскольку `captureOwnerStack` был вызван во время пользовательского обработчика событий DOM. Стек владельцев должен быть захвачен раньше, например, путем перемещения вызова `captureOwnerStack` в тело эффекта.
<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Следует вызвать `captureOwnerStack` здесь.
    function handleEvent() {
      // Вызов в пользовательском обработчике событий DOM слишком поздний.
      // Стек владельцев к этому моменту будет равен `null`.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Нажмите меня, чтобы увидеть, что стеки владельцев недоступны в пользовательских обработчиках событий DOM</button>;
}
```

</Sandpack>

### `captureOwnerStack` недоступен {/*captureownerstack-is-not-available*/}

`captureOwnerStack` экспортируется только в сборках для разработки. В продакшен-сборках он будет равен `undefined`. Если `captureOwnerStack` используется в файлах, которые собираются как для продакшена, так и для разработки, следует получать к нему доступ условно из импорта пространства имен.

```js
// Не используйте именованные импорты `captureOwnerStack` в файлах, которые собираются для разработки и продакшена.
import {captureOwnerStack} from 'react';
// Вместо этого используйте импорт пространства имен и обращайтесь к `captureOwnerStack` условно.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```