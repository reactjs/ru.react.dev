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

Вызовите `createRoot`, чтобы создать React-корень для отображения контента внутри DOM-элемента браузера.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React создаст корень для `domNode` и возьмёт на себя управление DOM внутри него. После создания корня вам нужно вызвать [`root.render`](#root-render), чтобы отобразить React-компонент внутри него:

```js
root.render(<App />);
```

Приложение, полностью построенное на React, обычно имеет только один вызов `createRoot` для своего корневого компонента. Страница, использующая React "точечно" для отдельных частей, может иметь столько отдельных корней, сколько необходимо.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `domNode`: [DOM-элемент.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React создаст корень для этого DOM-элемента и позволит вам вызывать функции для этого корня, такие как `render`, для отображения отрендеренного React-контента.

* **необязательный** `options`: Объект с опциями для этого React-корня.

  * **необязательный** `onCaughtError`: Функция обратного вызова, вызываемая, когда React перехватывает ошибку в Error Boundary. Вызывается с ошибкой `error`, пойманной Error Boundary, и объектом `errorInfo`, содержащим `componentStack`.
  * **необязательный** `onUncaughtError`: Функция обратного вызова, вызываемая, когда выбрасывается ошибка, не перехваченная Error Boundary. Вызывается с ошибкой `error`, которая была выброшена, и объектом `errorInfo`, содержащим `componentStack`. Некоторые восстанавливаемые ошибки могут включать исходную причину ошибки как `error.cause`.
  * **необязательный** `onRecoverableError`: Функция обратного вызова, вызываемая, когда React автоматически восстанавливается после ошибок. Вызывается с ошибкой `error`, которую выбрасывает React, и объектом `errorInfo`, содержащим `componentStack`. Некоторые восстанавливаемые ошибки могут включать исходную причину ошибки как `error.cause`.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для идентификаторов, сгенерированных [`useId`.](/reference/react/useId) Полезно для предотвращения конфликтов при использовании нескольких корней на одной странице.

#### Возвращает {/*returns*/}

`createRoot` возвращает объект с двумя методами: [`render`](#root-render) и [`unmount`.](#root-unmount)

#### Предостережения {/*caveats*/}
* Если ваше приложение рендерится на сервере, использование `createRoot()` не поддерживается. Вместо этого используйте [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* Вероятно, в вашем приложении будет только один вызов `createRoot`. Если вы используете фреймворк, он может сделать этот вызов за вас.
* Когда вы хотите отобразить фрагмент JSX в другой части дерева DOM, которая не является дочерним элементом вашего компонента (например, модальное окно или всплывающая подсказка), используйте [`createPortal`](/reference/react-dom/createPortal) вместо `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Вызовите `root.render`, чтобы отобразить фрагмент [JSX](/learn/writing-markup-with-jsx) ("React-узел") в DOM-узле React-корня.

```js
root.render(<App />);
```

React отобразит `<App />` в `root` и возьмёт на себя управление DOM внутри него.

[См. больше примеров ниже.](#usage)

#### Параметры {/*root-render-parameters*/}

* `reactNode`: *React-узел*, который вы хотите отобразить. Обычно это фрагмент JSX, такой как `<App />`, но вы также можете передать React-элемент, созданный с помощью [`createElement()`](/reference/react/createElement), строку, число, `null` или `undefined`.


#### Возвращает {/*root-render-returns*/}

`root.render` возвращает `undefined`.

#### Предостережения {/*root-render-caveats*/}

* При первом вызове `root.render` React очистит всё существующее HTML-содержимое внутри React-корня перед рендерингом React-компонента.

* Если DOM-узел вашего корня содержит HTML, сгенерированный React на сервере или во время сборки, вместо этого используйте [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot), который подключает обработчики событий к существующему HTML.

* Если вы вызовете `render` для одного и того же корня более одного раза, React внесёт необходимые изменения в DOM, чтобы отразить последний переданный вами JSX. React решит, какие части DOM можно повторно использовать, а какие нужно пересоздать, ["сопоставив их"](/learn/preserving-and-resetting-state) с ранее отрендеренным деревом. Повторный вызов `render` для того же корня аналогичен вызову [`set` функции](/reference/react/useState#setstate) для корневого компонента: React избегает ненужных обновлений DOM.

* Хотя рендеринг синхронен после его начала, `root.render(...)` таковым не является. Это означает, что код после `root.render()` может выполниться до того, как будут вызваны какие-либо эффекты (`useLayoutEffect`, `useEffect`) этого конкретного рендеринга. Обычно это нормально и редко требует корректировки. В редких случаях, когда важна синхронизация эффектов, вы можете обернуть `root.render(...)` в [`flushSync`](https://react.dev/reference/react-dom/client/flushSync), чтобы гарантировать полное синхронное выполнение начального рендеринга.
  
  ```js
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
  // 🚩 HTML ещё не будет включать отрендеренный <App />:
  console.log(document.body.innerHTML);
  ```

---

### `root.unmount()` {/*root-unmount*/}

Вызовите `root.unmount`, чтобы уничтожить отрендеренное дерево внутри React-корня.

```js
root.unmount();
```

Приложение, полностью построенное на React, обычно не имеет вызовов `root.unmount`.

Это в основном полезно, если DOM-узел вашего React-корня (или любой из его предков) может быть удалён из DOM другим кодом. Например, представьте себе панель вкладок jQuery, которая удаляет неактивные вкладки из DOM. Если вкладка удаляется, всё внутри неё (включая React-корни внутри) также будет удалено из DOM. В этом случае вам нужно сообщить React, чтобы он "перестал" управлять содержимым удалённого корня, вызвав `root.unmount`. В противном случае компоненты внутри удалённого корня не узнают о необходимости очистки и освобождения глобальных ресурсов, таких как подписки.

Вызов `root.unmount` размонтирует все компоненты в корне и "отсоединит" React от корневого DOM-узла, включая удаление всех обработчиков событий или состояния в дереве.


#### Параметры {/*root-unmount-parameters*/}

`root.unmount` не принимает никаких параметров.


#### Возвращает {/*root-unmount-returns*/}

`root.unmount` возвращает `undefined`.

#### Предостережения {/*root-unmount-caveats*/}

* Вызов `root.unmount` размонтирует все компоненты в дереве и "отсоединит" React от корневого DOM-узла.

* После вызова `root.unmount` вы не сможете снова вызвать `root.render` для того же корня. Попытка вызвать `root.render` для размонтированного корня приведёт к ошибке "Cannot update an unmounted root". Однако вы можете создать новый корень для того же DOM-узла после того, как предыдущий корень для этого узла был размонтирован.

---

## Использование {/*usage*/}

### Рендеринг приложения, полностью созданного с помощью React {/*rendering-an-app-fully-built-with-react*/}

Если ваше приложение полностью создано с помощью React, создайте один корневой элемент для всего приложения.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Обычно этот код нужно выполнить один раз при запуске. Он:

1. Найдёт <CodeStep step={1}>DOM-узел браузера</CodeStep>, определённый в вашем HTML.
2. Отобразит <CodeStep step={2}>React-компонент</CodeStep> вашего приложения внутри него.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
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

**Если ваше приложение полностью создано с помощью React, вам больше не нужно создавать новые корневые элементы или вызывать [`root.render`](#root-render) повторно.**

С этого момента React будет управлять DOM всего вашего приложения. Чтобы добавить больше компонентов, [вложите их внутрь компонента `App`](/learn/importing-and-exporting-components). Когда вам нужно будет обновить UI, каждый из ваших компонентов сможет сделать это [с помощью состояния](/reference/react/useState). Если вам нужно отобразить дополнительный контент, такой как модальное окно или всплывающая подсказка, вне DOM-узла, [отрендерите его с помощью портала](/reference/react-dom/createPortal).

<Note>

Когда ваш HTML пуст, пользователь видит пустую страницу до тех пор, пока JavaScript-код приложения не загрузится и не выполнится:

```html
<div id="root"></div>
```

Это может ощущаться как очень медленная загрузка! Чтобы решить эту проблему, вы можете генерировать начальный HTML из ваших компонентов [на сервере или во время сборки](/reference/react-dom/server). Тогда ваши посетители смогут читать текст, видеть изображения и кликать по ссылкам до загрузки всего JavaScript-кода. Мы рекомендуем [использовать фреймворк](/learn/start-a-new-react-project#production-grade-react-frameworks), который автоматически оптимизирует это. В зависимости от того, когда он выполняется, это называется *серверным рендерингом (SSR)* или *генерацией статических сайтов (SSG)*.

</Note>

<Pitfall>

**Приложения, использующие серверный рендеринг или генерацию статических сайтов, должны вызывать [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) вместо `createRoot`.** React затем *гидрирует* (переиспользует) DOM-узлы из вашего HTML вместо их удаления и повторного создания.

</Pitfall>

---

### Рендеринг страницы, частично созданной с помощью React {/*rendering-a-page-partially-built-with-react*/}

Если ваша страница [не полностью создана с помощью React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), вы можете вызывать `createRoot` несколько раз, чтобы создать корневой элемент для каждой верхней части UI, управляемой React. Вы можете отображать разный контент в каждом корневом элементе, вызывая [`root.render`.](#root-render)

Здесь два разных React-компонента рендерятся в два DOM-узла, определённых в файле `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
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

Чтобы удалить React-дерево из DOM-узла и освободить все используемые им ресурсы, вызовите [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Это в основном полезно, если ваши React-компоненты находятся внутри приложения, написанного на другом фреймворке.

---

### Обновление корневого компонента {/*updating-a-root-component*/}

Вы можете вызывать `render` несколько раз для одного и того же корневого элемента. Пока структура дерева компонентов совпадает с ранее отрендеренной, React [сохранит состояние.](/learn/preserving-and-resetting-state) Обратите внимание, что вы можете вводить текст в поле ввода, что означает, что обновления от повторных вызовов `render` каждую секунду в этом примере не являются деструктивными:

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

По умолчанию React будет логировать все ошибки в консоль. Чтобы реализовать собственную систему отчётности об ошибках, вы можете предоставить необязательные параметры корневого элемента для обработчиков ошибок: `onUncaughtError`, `onCaughtError` и `onRecoverableError`:

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

Опция <CodeStep step={1}>onCaughtError</CodeStep> — это функция, вызываемая с двумя аргументами:

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
  // Имейте в виду, что в режиме разработки следует удалить эти опции,
  // чтобы использовать стандартные обработчики React или реализовать свой оверлей.
  // Обработчики здесь указаны безусловно только в демонстрационных целях.
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

### Я создал корневой элемент, но ничего не отображается {/*ive-created-a-root-but-nothing-is-displayed*/}

Убедитесь, что вы не забыли *отрендерить* ваше приложение в корневой элемент:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

До тех пор, пока вы этого не сделаете, ничего отображаться не будет.

---

### Я получаю ошибку: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Распространённая ошибка — передать опции для `createRoot` в `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

Чтобы исправить это, передайте опции корневого элемента в `createRoot(...)`, а не в `root.render(...)`:
```js {2,5}
// 🚩 Неправильно: root.render принимает только один аргумент.
root.render(App, {onUncaughtError});

// ✅ Правильно: передайте опции в createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### Я получаю ошибку: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Эта ошибка означает, что то, что вы передаёте в `createRoot`, не является DOM-узлом.

Если вы не уверены, что происходит, попробуйте вывести это в лог:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Например, если `domNode` равен `null`, это означает, что [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) вернул `null`. Это произойдёт, если в документе нет узла с указанным ID на момент вызова. Этому может быть несколько причин:

1. Искомый ID может отличаться от ID, использованного в HTML-файле. Проверьте наличие опечаток!
2. Тег `<script>` вашего бандла не может "видеть" DOM-узлы, которые появляются *после* него в HTML.

Другой распространённый способ получить эту ошибку — написать `createRoot(<App />)` вместо `createRoot(domNode)`.

---

### Я получаю ошибку: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Эта ошибка означает, что то, что вы передаёте в `root.render`, не является React-компонентом.

Это может произойти, если вы вызываете `root.render` с `Component` вместо `<Component />`:

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

// ✅ Правильно: вызовите createApp, чтобы получить компонент.
root.render(createApp());
```

---

### Мой HTML, отрендеренный на сервере, пересоздаётся с нуля {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Если ваше приложение рендерится на сервере и включает начальный HTML, сгенерированный React, вы можете заметить, что создание корневого элемента и вызов `root.render` удаляют весь этот HTML, а затем заново создают все DOM-узлы с нуля. Это может быть медленнее, сбрасывать фокус и положение прокрутки, а также приводить к потере других пользовательских вводов.

Приложения с серверным рендерингом должны использовать [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) вместо `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Обратите внимание, что его API отличается. В частности, обычно не будет дальнейших вызовов `root.render`.