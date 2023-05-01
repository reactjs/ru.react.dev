---
title: <StrictMode>
---


<Intro>

`<StrictMode>` позволяет находить распространенные баги в компонентах на ранней стадии разработки.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Используйте `StrictMode`, чтобы включить дополнительные проверки и предупреждения для потомков дерева компонентов:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Больше примеров использования.](#usage)

Строгий режим активирует следующее поведение в режиме разработки:

- Ваши компоненты будут [рендерится повторно](#fixing-bugs-found-by-double-rendering-in-development) чтобы можно было найти баги, вызванные нечистым рендерингом.
- Ваши компоненты будут [повторно запускать эффекты](#fixing-bugs-found-by-re-running-effects-in-development), чтобы можно было найти баги возникающие из-за отсутствия сбрасывающей функции в эффекте.
- Ваши компоненты будут [проверяться на использование устаревших API.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Пропсы {/*props*/}

`StrictMode` не принимает никаких пропсов.

#### Предостережения {/*caveats*/}

* Если ваше дерево обернуто в `<StrictMode>`, то сделать исключение из строгого режима невозможно. Это дает вам уверенность, что все компоненты внутри `<StrictMode>` будут проверены. Если две команды работают над одним продуктом и не могут прийти к соглашению, нужны ли им эти проверки, то нужно или достичь компромисса, или переместить `<StrictMode>` ниже по дереву. 

---

## Применение {/*usage*/}

### Как включить строгий режим для всего приложения {/*enabling-strict-mode-for-entire-app*/}

Strict Mode включает дополнительные проверки для всего дерева компонентов внутри `<StrictMode>` в режиме разработки. Эти проверки позволяют находить распространенные баги в компонентах на ранней стадии разработки.


Чтобы включить Strict Mode для всего приложения, оберните ваш корень вашего приложения в `<StrictMode>` при рендеринге:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Мы рекомендуем целиком оборачивать ваше приложение (особенно, если оно новое) в строгий режим. Если вы используете фреймворк, который вызывает за вас [`createRoot`](/reference/react-dom/client/createRoot), посмотрите как включить строгий режим в его документации.

Несмотря на то, что проверки строгого режима **выполняются только в режиме разработки,** они помогают вам находить ошибки, которые уже существуют в вашем коде, и их может быть сложно стабильно воспроизвести в продакшене. Строгий режим позволяет исправлять такие ошибки до того, как ваши пользователи сообщат о них.

<Note>

Строгий режим включает следующие дополнительные проверки в режиме разработки:

- Ваши компоненты будут [рендерится повторно](#fixing-bugs-found-by-double-rendering-in-development) чтобы можно было найти баги, вызванные нечистым рендерингом.
- Ваши компоненты будут [повторно запускать эффекты](#fixing-bugs-found-by-re-running-effects-in-development) чтобы можно было найти баги возникающие из-за отсутствия сбрасывающей функции в эффекте.
- Ваши компоненты будут [проверяться на использование устаревших APIs.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Все эти проверки работают только в режиме разработки и не оказывают никакого эффекта в продакшен-сборке.**

</Note>

---

### Как включить строгий режим для части приложения {/*enabling-strict-mode-for-a-part-of-the-app*/}

Строгий режим может быть включён для любой части вашего приложения:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

В этом примере проверки строгого режима не будут выполняться для компонентов `Header` и `Footer`. Однако, они будут выполняться для `Sidebar` и `Content`, так же как и для всех компонентов внутри них, независимо от глубины вложенности.

---

### Исправление багов, найденных повторным рендерингом в режиме разработки {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React предполагает, что каждый компонент является чистой функцией.](/learn/keeping-components-pure) Это значит, что React-компоненты, которые вы пишете, должны всегда возвращать одинаковый JSX при тех же входных данных (пропсах, состоянии и контексте).

Компоненты, которые нарушают это правило, ведут себя непредсказуемо и вызывают ошибки. Чтобы помочь вам найти случайный нечистый код, строгий режим вызывает некоторые ваши функции (только те, которые должны быть чистыми) **дважды в режиме разработки.** Это включает:

- Тело компонента (только высокоуровневая логика, без учета кода внутри обработчиков событий)
- Функции, которые передаются в функции или хуки [`useState`](/reference/react/useState), [`set`](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), или [`useReducer`](/reference/react/useReducer)
- Некоторые методы классовых компонентов, такие как [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([полный список](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Если функция является чистой, то ее двойной вызов не будет менять ее поведение, так как чистая функция выдает один и тот же результат каждый раз. Однако, если функция не является чистой (например, мутирует получаемые данные), ее двойной вызов будет заметным (именно это и делает ее нечистой!). Это поможет вам заметить и поправить баг заранее.

**Вот пример, который иллюстрирует, как повторный рендеринг в строгом режиме помогает вам находить баги на ранней стадии.**

Компонент `StoryTray` принимает массив `stories` и добавляет в конец этого массива один элемент "Create Story":

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

В коде выше есть ошибка. Однако ее легко пропустить, так как изначальный вывод выглядит правильным.

Ошибка будет более заметна, если компонент `StoryTray` будет отрендерен несколько раз. Например, давайте сделаем повторный рендеринг компонента `StoryTray` с другим цветом фона, когда наводим мышью: 

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Обратите внимание, что каждый раз, когда мы наводим мышь на компонент `StoryTray`, "Create Story" добавляется в массив еще раз. Изначально требовалось добавить его лишь один раз в конец массива, но `StoryTray` напрямую мутирует массив `stories` из пропсов. Каждый раз, когда `StoryTray` рендерится, элемент "Create Story" опять добавляется в конец того же самого массива. Другими словами, `StoryTray` не является чистой функцией--при повторном рендеринге она возвращает разные результаты.

Чтобы исправить эту проблему, нужно сделать копию массива и изменять ее, а не оригинальный массив:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Клонируем массив
  // ✅ Хорошо: Добавляем элемент в новый массив
  items.push({ id: 'create', label: 'Create Story' });
```

Так [компонент `StoryTray` станет чистым.](/learn/keeping-components-pure) Каждый раз, когда он вызывается, он будет только изменять новую копию массива и не будет влиять на внешние объекты или переменные. Это решает проблему, но вам нужно было сделать так, чтобы компонент чаще ре-рендерился, прежде чем стало очевидно, что его поведение некорректное.

**В оригинальном примере ошибка не была очевидной. Теперь давайте обернем исходный (с ошибкой) код в `<StrictMode>`:**

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Строгий режим *всегда* вызывает рендеринг дважды, чтобы вы могли сразу увидеть ошибку** ("Create Story" появляется дважды). Это позволяет замечать такие ошибки на ранней стадии разработки. Когда вы заставляете ваш компонент рендерится в Strict Mode, вы *также* правите множество потенциальных багов продакшен-сборки, как например функциональность наведения мыши ниже:

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Без строгого режима было легко пропустить ошибку, пока вы не добавили больше ре-рендеров. Строгий режим сразу показал ошибку. Он помогает вам находить баги перед тем, как вы отправите их вашей команде или пользователям.

[Как сохранять компоненты чистыми.](/learn/keeping-components-pure)

<Note>

Если у вас установлены [React DevTools](/learn/react-developer-tools), любые вызовы `console.log` во время повторного рендеринга будут выглядеть немного приглушенными. React DevTools также имеет настройку (выключена по умолчанию) для их полного отключения.

</Note>

---

### Исправление багов, найденных повторным вызовом эффекта в режиме разработки {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode также может помогать находить ошибки в [эффектах.](/learn/synchronizing-with-effects)

Каждый эффект имеет код установки и может иметь код для сброса эффекта. Обычно React вызывает код установки, когда компонент *монтируется* (добавляется на экран) и вызывает код сброса, когда компонент *размонтируется* (удаляется с экрана). React затем вызывает сбрасывающую и установку заново, если зависимости эффекта были изменены с момента последнего рендера.

Когда строгий режим включен, React также вызовет **один дополнительный цикл установки и сброса для каждого эффекта в режиме разработки.** Это может быть неожиданным, но это помогает находить ошибки, которые сложно отловить вручную.

**Вот пример, иллюстрирующий то, как повторный вызов эффектов в строгом режиме помогает вам найти ошибки на ранней стадии.**

Рассмотрим пример, который подключает компонент к чату:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

В коде допущена ошибка, но это может быть неочевидно.

Чтобы сделать проблему более явной, давайте добавим новую функциональность. В примере ниже, `roomId` не указана хардкодом. Вместо этого пользователь может выбрать `roomId`, к которому он хочет подключиться через выпадающее меню. Нажмите на "Open chat" и выберите разные чат-комнаты одну за одной. Обратите внимание на количество активных подключений в консоли:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Вы заметите, что число открытых подключений постоянно возрастает. В настоящем приложении это может вызывать проблемы с сетью и производительностью. Корень проблемы в том, что [в эффекте отсутствует сбрасывающая функция:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Теперь, когда ваш эффект "очищается" и удаляет ненужные подключения, утечка устранена. Обратите внимание, что проблема не стала явной, пока вы не добавили больше функциональности (выпадающее меню).

**В исходном примере ошибка не была очевидной. Теперь давайте обернем исходный код (с ошибкой) в `<StrictMode>`:**

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Благодаря строгому режиму вы сразу видите, что есть проблема** (количество активных подключений возрастает до 2). Строгий режим вызывает дополнительный цикл установки и сброса для каждого эффекта. У этого эффекта отсутствует логика сброса, поэтому он создает дополнительное подключение и не удаляет его. Это подсказка, что в эффекте отсутствует сбрасывающая функция.

Строгий режим позволяет вам замечать подобные ошибки на ранней стадии разработки. Когда вы поправите ваш эффект, добавив сбрасывающую функцию в строгом режиме, вы *также* поправите множество потенциальных багов продакшена, например, как выпадающее меню, которое мы рассматривали ранее:

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Обратите внимание, как количество активных подключений в консоли больше не растет.

Без строгого режима было легко пропустить, что у вашего эффекта отсутствует сбрасывающая функция. Благодаря вызову *установки → сброса → установки* вместо *установки* для вашего эффекта в режиме разработки, строгий режим сделал отсутствие сбрасывающей функции более заметной.

[Узнать больше о сбрасывающей функции в эффекте.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Исправление предупреждений об устаревших методах в строгом режиме {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React предупреждает, если какой-либо компонент внутри дерева `<StrictMode>` использует какое-либо из следующих устаревших API:

* [`findDOMNode`](/reference/react-dom/findDOMNode). [Смотреть альтернативные решения.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* `UNSAFE_` классовые методы жизненного цикла, такие как [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Смотреть альтернативные решения.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 
* Устаревший контекст ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), и[`getChildContext`](/reference/react/Component#getchildcontext)). [Смотреть альтернативные решения.](/reference/react/createContext)
* Устаревшие строковые рефы ([`this.refs`](/reference/react/Component#refs)). [Смотреть альтернативные решения.](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

Эти API в основном используются в старых [классовых компонентах](/reference/react/Component), поэтому они редко встречаются в современных приложениях.
