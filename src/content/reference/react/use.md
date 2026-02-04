---
title: use
---

<Intro>

`use` — это API React, который позволяет считывать значение ресурса, такого как [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) или [контекст](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `use(resource)` {/*use*/}

Вызовите `use` в вашем компоненте, чтобы считать значение ресурса, такого как [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) или [контекст](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

В отличие от React Hooks, `use` можно вызывать внутри циклов и условных операторов, таких как `if`. Как и React Hooks, функция, вызывающая `use`, должна быть Компонентом или Хуком.

При вызове с Promise, API `use` интегрируется с [`Suspense`](/reference/react/Suspense) и [предохранителями ошибок](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Компонент, вызывающий `use`, *приостанавливается* (suspends), пока Promise, переданный в `use`, находится в ожидании. Если компонент, вызывающий `use`, обёрнут в границу Suspense, будет отображаться резервный вариант (fallback). Как только Promise будет разрешён, резервный вариант Suspense будет заменён отрендеренными компонентами, использующими данные, возвращённые API `use`. Если Promise, переданный в `use`, будет отклонён, будет отображён резервный вариант ближайшего Предохранителя ошибок.

[См. примеры ниже.](#usage)

#### Параметры {/*parameters*/}

* `resource`: это источник данных, из которых вы хотите считать значение. Ресурсом может быть [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) или [контекст](/learn/passing-data-deeply-with-context).

#### Возвращает {/*returns*/}

API `use` возвращает значение, считанное из ресурса, такое как разрешённое значение [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) или [контекст](/learn/passing-data-deeply-with-context).

#### Ограничения {/*caveats*/}

* API `use` должен быть вызван внутри Компонента или Хука.
* При получении данных в [Серверном Компоненте](/reference/rsc/server-components) отдавайте предпочтение `async` и `await` перед `use`. `async` и `await` возобновляют рендеринг с точки, где был вызван `await`, тогда как `use` повторно рендерит компонент после разрешения данных.
* Предпочитайте создание Promise в [Серверных Компонентах](/reference/rsc/server-components) и передачу их в [Клиентские Компоненты](/reference/rsc/use-client) вместо создания Promise в Клиентских Компонентах. Promise, созданные в Клиентских Компонентах, воссоздаются при каждом рендеринге. Promise, переданные из Серверного Компонента в Клиентский Компонент, стабильны при повторных рендерингах. [См. этот пример](#streaming-data-from-server-to-client).

---

## Использование {/*usage*/}

### Чтение контекста с помощью `use` {/*reading-context-with-use*/}

Когда [контекст](/learn/passing-data-deeply-with-context) передается в `use`, он работает аналогично [`useContext`](/reference/react/useContext). В то время как `useContext` должен вызываться на верхнем уровне вашего компонента, `use` может быть вызван внутри условных операторов, таких как `if`, и циклов, таких как `for`. `use` предпочтительнее `useContext`, потому что он более гибок.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use` возвращает <CodeStep step={2}>значение контекста</CodeStep> для <CodeStep step={1}>контекста</CodeStep>, который вы передали. Чтобы определить значение контекста, React ищет в дереве компонентов и находит **ближайший вышестоящий провайдер контекста** для данного конкретного контекста.

Чтобы передать контекст в `Button`, оберните его или один из его родительских компонентов в соответствующий провайдер контекста.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... рендерит кнопки внутри ...
}
```

Не имеет значения, сколько слоев компонентов находится между провайдером и `Button`. Когда `Button`, находящийся *где угодно* внутри `Form`, вызывает `use(ThemeContext)`, он получит `"dark"` в качестве значения.

В отличие от [`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> может быть вызван в условных операторах и циклах, таких как <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> вызывается изнутри оператора <CodeStep step={1}>`if`</CodeStep>, что позволяет вам условно считывать значения из контекста.

<Pitfall>

Как и `useContext`, `use(context)` всегда ищет ближайший провайдер контекста *выше* компонента, который его вызывает. Он ищет вверх и **не** учитывает провайдеры контекста в компоненте, из которого вы вызываете `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### Потоковая передача данных с сервера на клиент {/*streaming-data-from-server-to-client*/}

Данные могут передаваться потоком с сервера на клиент путем передачи Promise в качестве пропса из [серверного компонента](/reference/react/components#server-components) в [клиентский компонент](/reference/react/components#client-components).

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

[Клиентский компонент](/reference/react/components#client-components) затем берет <CodeStep step={4}>Promise, который он получил как пропс</CodeStep>, и передает его в API <CodeStep step={5}>`use`</CodeStep>. Это позволяет [клиентскому компоненту](/reference/react/components#client-components) считывать значение из <CodeStep step={4}>Promise</CodeStep>, который изначально был создан серверным компонентом.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
Поскольку <CodeStep step={2}>`Message`</CodeStep> обернут в <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, будет отображаться резервный вариант, пока Promise не будет разрешен. Когда Promise будет разрешен, значение будет прочитано API <CodeStep step={5}>`use`</CodeStep>, и компонент <CodeStep step={2}>`Message`</CodeStep> заменит резервный вариант Suspense.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<Note>

При передаче Promise из серверного компонента в клиентский, его разрешенное значение должно быть сериализуемым для передачи между сервером и клиентом. Типы данных, такие как функции, не сериализуемы и не могут быть разрешенным значением такого Promise.

</Note>


<DeepDive>

#### Следует ли разрешать Promise в серверном или клиентском компоненте? {/*resolve-promise-in-server-or-client-component*/}

Promise может быть передан из серверного компонента в клиентский и разрешен в клиентском компоненте с помощью API `use`. Вы также можете разрешить Promise в серверном компоненте с помощью `await` и передать необходимые данные в клиентский компонент в качестве пропса.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

Но использование `await` в [серверном компоненте](/reference/react/components#server-components) заблокирует его рендеринг до завершения оператора `await`. Передача Promise из серверного компонента в клиентский предотвращает блокировку рендеринга серверного компонента Promise.

</DeepDive>

### Обработка отклоненных Promise {/*dealing-with-rejected-promises*/}

В некоторых случаях Promise, переданный в `use`, может быть отклонен. Вы можете обрабатывать отклоненные Promise одним из следующих способов:

1. [Отображение ошибки пользователям с помощью предохранителя ошибок.](#displaying-an-error-to-users-with-error-boundary)
2. [Предоставление альтернативного значения с помощью `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use` не может быть вызван в блоке try-catch. Вместо блока try-catch [оберните ваш компонент в предохранитель ошибок](#displaying-an-error-to-users-with-error-boundary) или [предоставьте альтернативное значение для использования с методом `.catch` Promise](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Отображение ошибки пользователям с помощью предохранителя ошибок {/*displaying-an-error-to-users-with-error-boundary*/}

Если вы хотите отобразить ошибку пользователям при отклонении Promise, вы можете использовать [предохранитель ошибок](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Чтобы использовать предохранитель ошибок, оберните компонент, в котором вы вызываете API `use`, в предохранитель ошибок. Если Promise, переданный в `use`, будет отклонен, будет отображен резервный вариант для предохранителя ошибок.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### Предоставление альтернативного значения с помощью `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

Если вы хотите предоставить альтернативное значение при отклонении Promise, переданного в `use`, вы можете использовать метод Promise <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep>.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Чтобы использовать метод <CodeStep step={1}>`catch`</CodeStep> Promise, вызовите <CodeStep step={1}>`catch`</CodeStep> для объекта Promise. <CodeStep step={1}>`catch`</CodeStep> принимает один аргумент: функцию, которая принимает сообщение об ошибке в качестве аргумента. Все, что <CodeStep step={2}>возвращается</CodeStep> функцией, переданной в <CodeStep step={1}>`catch`</CodeStep>, будет использоваться в качестве разрешенного значения Promise.

---

## Устранение неполадок {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

Вы либо вызываете `use` вне компонента React или функции хука, либо вызываете `use` в блоке try-catch. Если вы вызываете `use` внутри блока try-catch, оберните ваш компонент в предохранитель ошибок или вызовите `catch` Promise, чтобы перехватить ошибку и разрешить Promise другим значением. [См. эти примеры](#dealing-with-rejected-promises).

Если вы вызываете `use` вне компонента React или функции хука, переместите вызов `use` в компонент React или функцию хука.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ функция, вызывающая `use`, не является компонентом или хуком
    const message = use(messagePromise);
    // ...
```

Вместо этого вызывайте `use` вне любых замыканий компонентов, где функция, вызывающая `use`, является компонентом или хуком.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` вызывается из компонента. 
  const message = use(messagePromise);
  // ...
```