---
title: createRoot
---
<Intro>

`createRoot` позволяет создать корневой узел для отображения React-компонентов внутри узла DOM браузера.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Вызовите `createRoot`, чтобы создать корневой узел React для отображения контента внутри элемента DOM браузера.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React создаст корневой узел для `domNode` и возьмёт на себя управление DOM внутри него. После создания корневого узла вам нужно будет вызвать [`root.render`](#root-render), чтобы отобразить React-компонент внутри него:

```js
root.render(<App />);
```

Приложение, полностью построенное на React, обычно имеет только один вызов `createRoot` для своего корневого компонента. Страница, использующая React "точечно" для некоторых частей, может иметь столько отдельных корневых узлов, сколько необходимо.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `domNode`: [DOM-элемент.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React создаст корневой узел для этого DOM-элемента и позволит вам вызывать функции для корневого узла, такие как `render`, для отображения отрендеренного React-контента.

* **необязательный** `options`: Объект с параметрами для этого корневого узла React.

  * **необязательный** `onCaughtError`: Функция обратного вызова, вызываемая, когда React перехватывает ошибку в Error Boundary. Вызывается с `error`, перехваченной Error Boundary, и объектом `errorInfo`, содержащим `componentStack`.
  * **необязательный** `onUncaughtError`: Функция обратного вызова, вызываемая, когда выбрасывается ошибка, не перехваченная Error Boundary. Вызывается с `error`, которая была выброшена, и объектом `errorInfo`, содержащим `componentStack`.
  * **необязательный** `onRecoverableError`: Функция обратного вызова, вызываемая, когда React автоматически восстанавливается после ошибок. Вызывается с `error`, которую выбрасывает React, и объектом `errorInfo`, содержащим `componentStack`. Некоторые восстанавливаемые ошибки могут включать исходную причину ошибки как `error.cause`.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для идентификаторов, сгенерированных [`useId`.](/reference/react/useId) Полезно для избежания конфликтов при использовании нескольких корневых узлов на одной странице.

#### Возвращает {/*returns*/}

`createRoot` возвращает объект с двумя методами: [`render`](#root-render) и [`unmount`.](#root-unmount)

#### Ограничения {/*caveats*/}
* Если ваше приложение рендерится на сервере, использование `createRoot()` не поддерживается. Вместо этого используйте [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* Скорее всего, в вашем приложении будет только один вызов `createRoot`. Если вы используете фреймворк, он может сделать этот вызов за вас.
* Когда вы хотите отобразить фрагмент JSX в другой части дерева DOM, которая не является дочерним элементом вашего компонента (например, модальное окно или всплывающая подсказка), используйте [`createPortal`](/reference/react-dom/createPortal) вместо `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Вызовите `root.render`, чтобы отобразить фрагмент [JSX](/learn/writing-markup-with-jsx) ("React-узел") в узле DOM корневого узла React.

```js
root.render(<App />);
```

React отобразит `<App />` в `root` и возьмёт на себя управление DOM внутри него.

[См. больше примеров ниже.](#usage)

#### Параметры {/*root-render-parameters*/}

* `reactNode`: *React-узел*, который вы хотите отобразить. Обычно это фрагмент JSX, такой как `<App />`, но вы также можете передать React-элемент, созданный с помощью [`createElement()`](/reference/react/createElement), строку, число, `null` или `undefined`.


#### Возвращает {/*root-render-returns*/}

`root.render` возвращает `undefined`.

#### Ограничения {/*root-render-caveats*/}

* При первом вызове `root.render` React очистит всё существующее HTML-содержимое внутри корневого узла React перед рендерингом React-компонента.

* Если DOM-узел вашего корневого узла содержит HTML, сгенерированный React на сервере или во время сборки, используйте вместо этого [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot), который подключает обработчики событий к существующему HTML.

* Если вы вызовете `render` для того же корневого узла более одного раза, React внесёт необходимые изменения в DOM, чтобы отразить последний переданный JSX. React решит, какие части DOM можно повторно использовать, а какие нужно пересоздать, ["сопоставив их"](/learn/preserving-and-resetting-state) с ранее отрендеренным деревом. Повторный вызов `render` для того же корневого узла аналогичен вызову [функции `set`](/reference/react/useState#setstate) для корневого компонента: React избегает ненужных обновлений DOM.

* Хотя рендеринг синхронен после его начала, `root.render(...)` таковым не является. Это означает, что код после `root.render()` может выполниться до того, как будут вызваны какие-либо эффекты (`useLayoutEffect`, `useEffect`) этого конкретного рендеринга. Обычно это нормально и редко требует корректировки. В редких случаях, когда важна синхронизация эффектов, вы можете обернуть `root.render(...)` в [`flushSync`](https://react.dev/reference/react-dom/client/flushSync), чтобы гарантировать полное синхронное выполнение начального рендеринга.
  
  ```js
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
  // 🚩 HTML ещё не будет включать отрендеренный <App />:
  console.log(document.body.innerHTML);
  ```

---

### `root.unmount()` {/*root-unmount*/}

Вызовите `root.unmount`, чтобы удалить отрисованное дерево внутри корневого узла React.

```js
root.unmount();
```

Приложение, полностью построенное на React, обычно не имеет вызовов `root.unmount`.

Это в основном полезно, если DOM-узел вашего корневого узла (или любой из его предков) может быть удалён из DOM другим кодом. Например, представьте себе панель вкладок jQuery, которая удаляет неактивные вкладки из DOM. Если вкладка удаляется, всё внутри неё (включая корневые узлы React) также будет удалено из DOM. В этом случае вам нужно сообщить React, чтобы он "перестал" управлять содержимым удалённого корневого узла, вызвав `root.unmount`. В противном случае компоненты внутри удалённого корневого узла не узнают о необходимости очистки и освобождения глобальных ресурсов, таких как подписки.

Вызов `root.unmount` размонтирует все компоненты в корневом узле и "отсоединит" React от корневого DOM-узла, включая удаление всех обработчиков событий или состояния в дереве.


#### Параметры {/*root-unmount-parameters*/}

`root.unmount` не принимает никаких параметров.


#### Возвращает {/*root-unmount-returns*/}

`root.unmount` возвращает `undefined`.

#### Ограничения {/*root-unmount-caveats*/}

* Вызов `root.unmount` размонтирует все компоненты в дереве и "отсоединит" React от корневого DOM-узла.

* После вызова `root.unmount` вы больше не сможете вызвать `root.render` для того же корневого узла. Попытка вызвать `root.render` для размонтированного корневого узла приведёт к ошибке "Cannot update an unmounted root". Однако вы можете создать новый корневой узел для того же DOM-узла после того, как предыдущий корневой узел для этого узла был размонтирован.

---

## Использование {/*usage*/}

### Рендеринг приложения, полностью построенного на React {/*rendering-an-app-fully-built-with-react*/}

Если ваше приложение полностью построено на React, создайте один корневой узел для всего вашего приложения.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Обычно этот код нужно выполнить только один раз при запуске. Он:

1. Находит <CodeStep step={1}>DOM-узел браузера</CodeStep>, определённый в вашем HTML.
2. Отображает <CodeStep step={2}>React-компонент</CodeStep> вашего приложения внутри него.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Это DOM-узел -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
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

**Если ваше приложение полностью построено на React, вам не нужно создавать больше корневых узлов или снова вызывать [`root.render`](#root-render).** 

С этого момента React будет управлять DOM всего вашего приложения. Чтобы добавить больше компонентов, [вложите их внутрь компонента `App`.](/learn/importing-and-exporting-components) Когда вам нужно будет обновить пользовательский интерфейс, каждый из ваших компонентов сможет сделать это [используя состояние.](/reference/react/useState) Когда вам нужно будет отобразить дополнительный контент, такой как модальное окно или всплывающая подсказка, за пределами DOM-узла, [отрендерите его с помощью портала.](/reference/react-dom/createPortal)

<Note>

Когда ваш HTML пуст, пользователь видит пустую страницу до тех пор, пока код JavaScript приложения не загрузится и не выполнится:

```html
<div id="root"></div>
```

Это может ощущаться как очень медленная загрузка! Чтобы решить эту проблему, вы можете сгенерировать начальный HTML из ваших компонентов [на сервере или во время сборки.](/reference/react-dom/server) Тогда ваши посетители смогут читать текст, видеть изображения и нажимать на ссылки до загрузки всего JavaScript-кода. Мы рекомендуем [использовать фреймворк](/learn/start-a-new-react-project#production-grade-react-frameworks), который оптимизирует это "из коробки". В зависимости от того, когда он выполняется, это называется *серверный рендеринг (SSR)* или *генерация статических сайтов (SSG)*.

</Note>

<Pitfall>

**Приложения, использующие серверный рендеринг или генерацию статических сайтов, должны вызывать [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) вместо `createRoot`.** React затем *гидрирует* (повторно использует) DOM-узлы из вашего HTML вместо их удаления и повторного создания.

</Pitfall>

---

### Рендеринг страницы, частично построенной на React {/*rendering-a-page-partially-built-with-react*/}

Если ваша страница [не полностью построена на React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), вы можете вызывать `createRoot` несколько раз, чтобы создать корневой узел для каждой верхней части пользовательского интерфейса, управляемой React. Вы можете отображать разный контент в каждом корневом узле, вызывая [`root.render`.](#root-render)

Здесь два разных React-компонента рендерятся в два DOM-узла, определённых в файле `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>Этот параграф не рендерится React (проверьте index.html).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Вы также можете создать новый DOM-узел с помощью [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) и добавить его в документ вручную.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // Вы можете добавить его в любое место документа
```

Чтобы удалить дерево React из DOM-узла и очистить все используемые им ресурсы, вызовите [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Это в основном полезно, если ваши React-компоненты находятся внутри приложения, написанного на другом фреймворке.

---

### Обновление корневого компонента {/*updating-a-root-component*/}

Вы можете вызывать `render` несколько раз для одного и того же корневого узла. Пока структура дерева компонентов совпадает с ранее отрисованной, React [сохранит состояние.](/learn/preserving-and-resetting-state) Обратите внимание, что вы можете вводить текст в поле ввода, что означает, что обновления от повторных вызовов `render` каждую секунду в этом примере не являются разрушительными:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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

Вызывать `render` несколько раз — это нетипично. Обычно ваши компоненты вместо этого [обновляют состояние](/reference/react/useState).

### Логирование ошибок в продакшене {/*error-logging-in-production*/}

По умолчанию React будет записывать все ошибки в консоль. Чтобы реализовать собственную отчётность об ошибках, вы можете предоставить необязательные обработчики ошибок в параметрах корневого узла: `onUncaughtError`, `onCaughtError` и `onRecoverableError`:

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack", 15]]
import { createRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
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

Вместе с `onUncaughtError` и `onRecoverableError` вы можете реализовать собственную систему отчётности об ошибках:

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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  // Имейте в виду, что в режиме разработки следует удалить эти параметры,
  // чтобы использовать стандартные обработчики React или реализовать свой оверлей.
  // Обработчики указаны здесь безусловно только для демонстрационных целей.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
root.render(<App />);
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

</Sandpack>

## Устранение неполадок {/*troubleshooting*/}

### Я создал корневой узел, но ничего не отображается {/*ive-created-a-root-but-nothing-is-displayed*/}

Убедитесь, что вы не забыли фактически *отрендерить* ваше приложение в корневом узле:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

До тех пор, пока вы этого не сделаете, ничего не будет отображаться.

---

### Я получаю ошибку: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Распространённая ошибка — передача параметров для `createRoot` в `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

Чтобы исправить это, передайте параметры корневого узла в `createRoot(...)`, а не в `root.render(...)`:
```js {2,5}
// 🚩 Неправильно: root.render принимает только один аргумент.
root.render(App, {onUncaughtError});

// ✅ Правильно: передайте параметры в createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### Я получаю ошибку: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Эта ошибка означает, что то, что вы передаёте в `createRoot`, не является DOM-узлом.

Если вы не уверены, что происходит, попробуйте вывести это в консоль:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Например, если `domNode` равен `null`, это означает, что [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) вернул `null`. Это произойдёт, если в документе нет узла с указанным ID в момент вашего вызова. Этому может быть несколько причин:

1. Искомый ID может отличаться от ID, использованного в HTML-файле. Проверьте наличие опечаток!
2. Тег `<script>` вашего бандла не может "видеть" DOM-узлы, которые появляются *после* него в HTML.

Другой распространённый способ получить эту ошибку — написать `createRoot(<App />)` вместо `createRoot(domNode)`.

---

### Я получаю ошибку: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Эта ошибка означает, что то, что вы передаёте в `root.render`, не является React-компонентом.

Это может произойти, если вы вызовете `root.render` с `Component` вместо `<Component />`:

```js {2,5}
// 🚩 Неправильно: App — это функция, а не компонент.
root.render(App);

// ✅ Правильно: <App /> — это компонент.
root.render(<App />);
```

Или если вы передаёте функцию в `root.render` вместо результата её вызова:

```js {2,5}
// 🚩 Неправильно: createApp — это функция, а не компонент.
root.render(createApp);

// ✅ Правильно: вызовите createApp, чтобы вернуть компонент.
root.render(createApp());
```

---

### Мой HTML, отрендеренный на сервере, пересоздаётся с нуля {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Если ваше приложение рендерится на сервере и включает начальный HTML, сгенерированный React, вы можете заметить, что создание корневого узла и вызов `root.render` удаляют весь этот HTML, а затем заново создают все DOM-узлы с нуля. Это может быть медленнее, сбрасывать фокус и позицию прокрутки, а также приводить к потере другого пользовательского ввода.

Приложения с серверным рендерингом должны использовать [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) вместо `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Обратите внимание, что его API отличается. В частности, обычно больше не будет вызова `root.render`.