---
title: <StrictMode>
---


<Intro>

`<StrictMode>` позволяет вам обнаружить распространенные баги в ваших компонентах на ранних этапах разработки.


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

Используйте `StrictMode` для активации дополнительных проверок и предупреждений для вложенного дерева компонентов:

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

[Больше примеров использования ниже.](#usage)

Строгий режим активирует следующие варианты поведения в режиме разработки:

- Ваши компоненты будут [рендерится повторно](#fixing-bugs-found-by-double-rendering-in-development), чтобы можно было найти баги, вызванные нечистым рендерингом.
- Ваши компоненты будут [повторно запускать эффекты](#fixing-bugs-found-by-re-running-effects-in-development), чтобы можно было найти баги, возникающие из-за отсутствия сброса эффекта.
- Ваши компоненты будут [повторно запускать реф-колбэки](#fixing-bugs-found-by-re-running-ref-callbacks-in-development), чтобы найти баги, вызванные пропущенной очисткой рефов.
- Ваши компоненты будут [проверяться на использование устаревших API.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Пропсы {/*props*/}

`StrictMode` не принимает никаких пропсов.

#### Предостережения {/*caveats*/}

* Если вы используете `<StrictMode>`, то не сможете отключить его для части дерева. Это гарантирует, что все компоненты внутри `<StrictMode>` проходят проверки. Если две команды, работающие над продуктом, не могут прийти к соглашению, нужны ли им эти проверки, то они должны либо достичь компромисса, либо переместить `<StrictMode>` ниже по дереву. 

---

## Применение {/*usage*/}

### Как включить строгий режим для всего приложения {/*enabling-strict-mode-for-entire-app*/}

Строгий режим включает дополнительные проверки для всего дерева компонентов внутри `<StrictMode>` в режиме разработки. Эти проверки позволяют находить распространенные баги в компонентах на ранней стадии разработки.


Чтобы включить строгий режим для всего приложения, оберните ваш корень вашего приложения в `<StrictMode>` при рендеринге:

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

- Ваши компоненты будут [рендерится повторно](#fixing-bugs-found-by-double-rendering-in-development), чтобы можно было найти баги, вызванные нечистым рендерингом.
- Ваши компоненты будут [повторно запускать эффекты](#fixing-bugs-found-by-re-running-effects-in-development), чтобы можно было найти баги, возникающие из-за отсутствия сброса эффекта.
- Ваши компоненты будут [повторно запускать реф-колбэки](#fixing-bugs-found-by-re-running-ref-callbacks-in-development), чтобы найти баги, вызванные пропущенной очисткой рефов.
- Ваши компоненты будут [проверяться на использование устаревших API.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Все эти проверки работают только в режиме разработки и не оказывают никакого эффекта в продакшен-сборке.**

</Note>

---

### Активация строгого режима для части приложения {/*enabling-strict-mode-for-a-part-of-the-app*/}

Вы можете активировать строгий режим для любой части вашего приложения:

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

В этом примере проверки строгого режима не будут выполняться для компонентов `Header` и `Footer`. Однако, они будут выполняться для `Sidebar` и `Content`, а также для всех компонентов внутри них, независимо от глубины вложенности.

<Note>

Когда `StrictMode` включен только для части приложения, React включит только то, что может быть использовано в продакшене. Например, если `<StrictMode>` не включен в корне приложения, он не будет [перезапускать эффекты повторно](#fixing-bugs-found-by-re-running-effects-in-development) при начальном монтировании, так как это вызвало бы повторное срабатывание дочерних эффектов без родительских, что не может произойти в продакшене.

</Note>

---

### Исправление багов, найденных повторным рендерингом в режиме разработки {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React предполагает, что каждый компонент является чистой функцией.](/learn/keeping-components-pure) Это значит, что React-компоненты, которые вы создаёте, должны всегда возвращать тот же JSX при одинаковых параметрах (пропсах, состоянии и контексте).

Компоненты, которые нарушают это правило, работают непостоянно и приводят к ошибкам. Чтобы помочь вам обнаружить случайно нечистый код, строгий режим запускает некоторые из ваших функций (только те, которые должны быть чистыми) **два раза в режиме разработки.** Это касается:

- Тело функции компонента (только логика верхнего уровня, без учета кода внутри обработчиков событий)
- Функции, которые передаются в функции [`useState`](/reference/react/useState), [`set` функции](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), или [`useReducer`](/reference/react/useReducer)
- Некоторые методы классовых компонентов, такие как [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([полный список](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Если функция является чистой, то её повторный запуск не меняет её поведения, потому что чистая функция всегда даёт одинаковый результат. Но если функция является нечистой (например, мутирует получаемые данные), то её повторный запуск обычно заметен (это и делает её нечистой!). Это помогает вам быстрее находить и исправлять баг.

**Вот пример, который показывает, как повторный рендеринг в строгом режиме помогает вам находить баги на ранней стадии.**

Компонент `StoryTray` принимает массив `stories` и добавляет в конец этого массива один элемент "Create Story":

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
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

```js src/StoryTray.js active
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
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

В коде выше закралась ошибка. Но её не так просто заметить, потому что на первый взгляд всё выглядит правильно.

<<<<<<< HEAD
Ошибка станет более заметной, если компонент `StoryTray` будет отрендерен несколько раз. Например, давайте сделаем так, чтобы `StoryTray` рендерился с другим цветом фона каждый раз, когда вы наводите на него курсор: 
=======
This mistake will become more noticeable if the `StoryTray` component re-renders multiple times. For example, let's make the `StoryTray` re-render with a different background color whenever you hover over it:
>>>>>>> d34c6a2c6fa49fc6f64b07aa4fa979d86d41c4e8

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
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

```js src/StoryTray.js active
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
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Заметьте, как каждый раз, когда вы наводите курсор мыши на компонент `StoryTray`, "Create Story" снова добавляется в массив еще раз. Целью кода было добавить его лишь один раз в конец. Но `StoryTray` напрямую изменяет массив `stories` из пропсов. Каждый раз, когда `StoryTray` рендерится, элемент "Create Story" снова добавляется в конец того же самого массива. Другими словами, `StoryTray` не является чистой функцией -- её многократный запуск приводит к разным результатам.

Чтобы исправить эту проблему, вы можете создать копию массива и изменять её вместо оригинального массива:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Клонируем массив
  // ✅ Хорошо: Добавляем элемент в новый массив
  items.push({ id: 'create', label: 'Create Story' });
```

Это бы [сделало функцию `StoryTray` чистой.](/learn/keeping-components-pure) Каждый раз, когда она вызывается, она бы только изменяла новую копию массива и не влияла бы на какие-либо внешние объекты или переменные. Это решает проблему, но вам пришлось заставить компонент рендериться чаще, прежде чем стало очевидно, что его поведение некорректное.

**В оригинальном примере ошибка не была очевидной. Теперь давайте обернем исходный (с ошибкой) код в `<StrictMode>`:**

<Sandpack>

```js src/index.js
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

```js src/App.js
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

```js src/StoryTray.js active
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
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Строгий режим *всегда* вызывает функцию рендеринга дважды, поэтому вы сразу же можете увидеть ошибку** ("Create Story" появляется дважды). Это позволяет замечать такие ошибки на ранней стадии разработки. Когда вы заставляете ваш компонент работать в строгом режиме, вы *также* устраняете множество потенциальных багов в продакшене, таких, как поведение при наведении мыши из предыдущего примера:

<Sandpack>

```js src/index.js
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

```js src/App.js
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

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Клонируем массив
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
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Без строгого режима было легко пропустить ошибку, пока вы не добавили больше ре-рендеров. Строгий режим выявил эту ошибку сразу. Строгий режим спасает вас от ошибок, которые могут испортить работу вашей команды и вызывать проблемы у ваших пользователей.

[Подробнее о том, как сохранять компоненты чистыми.](/learn/keeping-components-pure)

<Note>

Если у вас установлены [React DevTools](/learn/react-developer-tools), любые вызовы `console.log` во время повторного рендеринга будут выглядеть менее ярко. React DevTools также имеет настройку (выключена по умолчанию) для их полного отключения.

</Note>

---

### Исправление багов, найденных при повторном запуске эффектов в режиме разработки {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Строгий режим также помогает находить ошибки в [эффектах.](/learn/synchronizing-with-effects)

Каждый эффект имеет свой код установки и, возможно, код для сброса. Обычно React вызывает код установки, при *монтировании* компонента (его добавлении на экран) и вызывает сброс при *размонтировании* компонента (его удалении с экрана). Если зависимости эффекта изменилис с момента последнего рендера, React вызывает сброс и установку заново.

Когда строгий режим включен, React будет запускать **один дополнительный цикл установки и сброса для каждого эффекта в режиме разработки.** Это может быть неожиданным, но это помогает находить баги, которые сложно отловить вручную.

**Вот пример, иллюстрирующий то, как повторный запуск эффектов в строгом режиме помогает вам находить баги на ранней стадии.**

Рассмотрим пример, в котором компонент подключается к чату:

<Sandpack>

```js src/index.js
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

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Настоящий код, который действительно подключается к серверу
  return {
    connect() {
      console.log('✅ Подключение к комнате "' + roomId + '" по адресу ' + serverUrl + '...');
      connections++;
      console.log('Активных подключений: ' + connections);
    },
    disconnect() {
      console.log('❌ Отключение от комнаты "' + roomId + '" по адресу ' + serverUrl);
      connections--;
      console.log('Активных подключений: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

В коде есть проблема, но, возможно, это не сразу очевидно.

Для того чтобы проблема стала более очевидной, давайте добавим новую функциональность. В примере ниже, `roomId` не зашит в коде, а пользователь может выбрать `roomId`, к которому он хочет подключиться, из выпадающего списка. Нажмите на "Open chat" и выберите разные чаты один за другим. Следите за количеством активных подключений в консоли:

<Sandpack>

```js src/index.js
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

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Настоящий код, который действительно подключается к серверу
  return {
    connect() {
      console.log('✅ Подключение к комнате "' + roomId + '" по адресу ' + serverUrl + '...');
      connections++;
      console.log('Активных подключений: ' + connections);
    },
    disconnect() {
      console.log('❌ Отключение от комнаты "' + roomId + '" по адресу ' + serverUrl);
      connections--;
      console.log('Активных подключений: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Вы заметите, что число открытых подключений продолжает расти. В реальном приложении это может вызывать проблемы с сетью и производительностью. Проблема заключается в том, что [ваш эффект не содержит функцию сброса:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Теперь, когда ваш эффект "убирает" за собой устаревшие подключения, утечка устранена. Обратите внимание, что проблема не стала заметной, пока вы не добавили больше функциональности (выпадающий список).

**В исходном примере баг не был очевидным. Теперь давайте обернём исходный код (с багом) в `<StrictMode>`:**

<Sandpack>

```js src/index.js
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

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Настоящий код, который действительно подключается к серверу
  return {
    connect() {
      console.log('✅ Подключение к комнате "' + roomId + '" по адресу ' + serverUrl + '...');
      connections++;
      console.log('Активных подключений: ' + connections);
    },
    disconnect() {
      console.log('❌ Отключение от комнаты "' + roomId + '" по адресу ' + serverUrl);
      connections--;
      console.log('Активных подключений: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Благодаря строгому режиму вы сразу видите проблему** (количество активных подключений увеличивается до 2). Строгий режим запускает дополнительный цикл установки и сброса для каждого эффекта. У этого эффекта отсутствует логика сброса, поэтому он создаёт дополнительное подключение и не удаляет его. Это подсказка, что в эффекте отсутствует функция сброса.

Строгий режим позволяет вам заметить подобные ошибки на ранней стадии разработки. Когда вы поправите ваш эффект, добавляя сбрасывающую функцию сброса в строгом режиме, вы *также* поправите множество потенциальных багов продакшена, например, как с выпадающим списком, который мы рассматривали ранее:

<Sandpack>

```js src/index.js
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

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Настоящий код, который действительно подключается к серверу
  return {
    connect() {
      console.log('✅ Подключение к комнате "' + roomId + '" по адресу ' + serverUrl + '...');
      connections++;
      console.log('Активных подключений: ' + connections);
    },
    disconnect() {
      console.log('❌ Отключение от комнаты "' + roomId + '" по адресу ' + serverUrl);
      connections--;
      console.log('Активных подключений: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Обратите внимание, что количество активных подключений в консоли больше не растёт.

Без строгого режима было легко пропустить, что у вашего эффекта отсутствует функция сброса. Благодаря вызову *установка → сброс → установка* вместо *установка* для вашего эффекта в режиме разработки, строгий режим сделал отсутствие функции сброса более заметным.

[Узнать больше о функции сброса эффекта.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---
### Fixing bugs found by re-running ref callbacks in development {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

Strict Mode can also help find bugs in [callbacks refs.](/learn/manipulating-the-dom-with-refs)

Every callback `ref` has some setup code and may have some cleanup code. Normally, React calls setup when the element is *created* (is added to the DOM) and calls cleanup when the element is *removed* (is removed from the DOM).

When Strict Mode is on, React will also run **one extra setup+cleanup cycle in development for every callback `ref`.** This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.

Consider this example, which allows you to select an animal and then scroll to one of them. Notice when you switch from "Cats" to "Dogs", the console logs show that the number of animals in the list keeps growing, and the "Scroll to" buttons stop working:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>


**This is a production bug!** Since the ref callback doesn't remove animals from the list in the cleanup, the list of animals keeps growing. This is a memory leak that can cause performance problems in a real app, and breaks the behavior of the app.

The issue is the ref callback doesn't cleanup after itself:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

Now let's wrap the original (buggy) code in `<StrictMode>`:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**With Strict Mode, you immediately see that there is a problem**. Strict Mode runs an extra setup+cleanup cycle for every callback ref. This callback ref has no cleanup logic, so it adds refs but doesn't remove them. This is a hint that you're missing a cleanup function.

Strict Mode lets you eagerly find mistakes in callback refs. When you fix your callback by adding a cleanup function in Strict Mode, you *also* fix many possible future production bugs like the "Scroll to" bug from before:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  list.splice(list.indexOf(item));
                  console.log(`❌ Removing cat from the map. Total cats: ${itemsRef.current.length}`);
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Now on inital mount in StrictMode, the ref callbacks are all setup, cleaned up, and setup again:

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**This is expected.** Strict Mode confirms that the ref callbacks are cleaned up correctly, so the size never grows above the expected amount. After the fix, there are no memory leaks, and all the features work as expected.

Without Strict Mode, it was easy to miss the bug until you clicked around to app to notice broken features. Strict Mode made the bugs appear right away, before you push them to production.

<<<<<<< HEAD
--- 
### Исправление предупреждений об устаревших методах в строгом режиме {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}
=======
---
### Fixing deprecation warnings enabled by Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}
>>>>>>> d34c6a2c6fa49fc6f64b07aa4fa979d86d41c4e8

React предупреждает, если какой-либо компонент внутри дерева `<StrictMode>` использует одно из следующих устаревших API:

* `UNSAFE_` методы жизненного цикла классового компонента, такие как [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Изучите альтернативы.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)

Эти API в основном используются в старых [классовых компонентах](/reference/react/Component), поэтому они редко встречаются в современных приложениях.
