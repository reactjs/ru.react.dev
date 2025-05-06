---
title: 'Вынесение событий из Эффектов'
---

<Intro>

Обработчики событий перезапускаются только при повторении одного и того же взаимодействия. В отличие от обработчиков событий, Эффекты перезапускаются, если одно из считываемых значений, например, проп или состояние, изменилось во время рендера. Но иногда вам нужно объединить оба поведения так, чтобы эффект перезапускался при изменении одних значений и игнорировал изменения других. На этой странице вы узнаете, как это сделать.

</Intro>

<YouWillLearn>

- В каких случаях использовать обработчики событий, а в каких — Эффекты
- Почему Эффекты реактивны, а обработчики событий — нет
- Что делать, если вы хотите, чтобы части кода вашего Эффекта не были реактивными
- Что такое События эффектов, и как вынести их из Эффектов
- Как считывать последние пропсы и состояния из Эффектов, используя События эффектов.

</YouWillLearn>

## Выбор между обработчиками событий и Эффектами {/*choosing-between-event-handlers-and-effects*/}

Для начала, вспомним различия между обработчиками событий и Эффектами.

Представим, что вы разрабатываете компонент чата, который должен удовлетворять следующим требованиям:

1. Компонент должен автоматически подключаться к выбранному чату.
2. При клике на кнопку "Отправить" должно отправляться сообщение в чат.

Допустим, вы уже реализовали логику компонента, но не уверены, куда его поместить. Использовать обработчики событий или Эффекты? Перед тем, как ответить на этот вопрос, подумайте, [в чём *предназначение* этого кода.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Обработчики событий выполняются в ответ на определённые взаимодействия {/*event-handlers-run-in-response-to-specific-interactions*/}

С точки зрения пользователя, отправка сообщения должна произойти *потому*, что была нажата конкретная кнопка "Отправить". Пользователь будет растерян, если вы отправите его сообщение в неожиданное для него время или по любой другой причине. Вот почему отправка сообщения должна быть обработчиком событий. Обработчики событий позволяют вам обрабатывать определённые взаимодействия:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

Используя обработчик событий, вы можете быть уверены, что `sendMessage(message)` будет выполнен, *только* если пользователь нажмёт на кнопку.

### Эффекты запускаются всякий раз, когда необходима синхронизация. {/*effects-run-whenever-synchronization-is-needed*/}

Помните, что вам также нужно поддерживать компонент подключенным к чату. Где запускать этот код?

Этот код *не предназначен* для обработки взаимодействия. Неважно, почему или как пользователь перешёл на экран чата. Теперь, когда он смотрит на него и может взаимодействовать с ним, компонент должен оставаться подключенным к выбранному серверу чата. Даже если пользователь только открыл чат и вообще не выполнял никаких взаимодействий, вам *всё равно* нужно будет подключиться. Вот почему это Эффект:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

С этим кодом вы можете быть уверены, что чат всегда подключен к выбранному серверу, *независимо* от действий пользователя. Независимо от того, открыл ли пользователь только ваше приложение, выбрал другой чат или перешёл на другой экран и обратно, ваш эффект гарантирует, что компонент *останется синхронизированным* с выбранным в данный момент чатом и [повторно подключится, когда это необходимо.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
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
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // Логика подключения к серверу
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Реактивные значения и реактивная логика {/*reactive-values-and-reactive-logic*/}

Интуитивно мы понимаем, что обработчики событий всегда запускаются "вручную", например, при нажатии на кнопку. Эффекты же запускаются и перезапускаются "автоматически" так часто, как это необходимо, чтобы поддерживать компонент синхронизированным.

Есть более точное понимание этого вопроса.

Пропсы, состояние и переменные, объявленные внутри тела компонента, называются <CodeStep step={2}>реактивными значениями</CodeStep>. В этом примере `serverUrl` не является реактивным значением, а `roomId` и `message` являются. Они участвуют в потоке данных рендера:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Подобные реактивные значения могут измениться при повторном рендере. Например, пользователь может отредактировать `message` или выбрать другой `roomId` в раскрывающемся списке. Обработчики событий и Эффекты реагируют на изменения по-разному:

- **Логика внутри обработчиков событий *не* является *реактивной.*** Код не перезапуститься пока пользователь не выполнит то же самое взаимодействие (т.е. клик) по кнопке. Обработчики событий считывают реактивные значения не "реагируя" на их изменения.
- **Логика внутри Эффектов *реактивна.*** Если ваш Эффект считывает реактивное значение, [то нужно добавить его в качестве зависимости.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Тогда, если повторный рендер изменит это значение, то React перезапустит логику Эффекта с этим новым значением.

Вернёмся к предыдущему примеру, чтобы показать эту разницу.

### Логика внутри обработчиков событий не является реактивной {/*logic-inside-event-handlers-is-not-reactive*/}

Взгляните на эту строку кода. Должна ли эта логика быть реактивной?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

С точки зрения пользователя, **изменение `message` _не_ означает, что он хочет отправить сообщение.** Это означает только то, что пользователь печатает. Другими словами, логика, которая отправляет сообщение, не должна быть реактивной. Она не должна запускаться снова только потому, что <CodeStep step={2}>реактивное значение</CodeStep> изменилось. Вот почему она находится внутри обработчика событий:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Обработчики событий не являются реактивными, поэтому `sendMessage(message)` будет выполнен только при клике на кнопку "Отправить".

### Логика внутри Эффектов реактивна {/*logic-inside-effects-is-reactive*/}

Теперь взглянем на эти строки:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

С точки зрения пользователя, **изменение `roomId` *означает*, что он хочет подключиться к другому чату.** Другими словами, логика подключения к чату должна быть реактивной. Вы *хотите*, чтобы этот код "не отставал" от <CodeStep step={2}>реактивного значения</CodeStep> и перезапускался при изменении этого значения. Поэтому он относится к Эффекту:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Эффекты являются реактивными, поэтому `createConnection(serverUrl, roomId)` и `connection.connect()` будут запускаться для каждого нового значения `roomId`. Ваш Эффект синхронизирует соединение с выбранным в данный момент чатом.

## Извлечение нереактивной логики из Эффектов {/*extracting-non-reactive-logic-out-of-effects*/}

Все становится сложнее, когда вы хотите смешать реактивную логику с нереактивной логикой.

Например, представьте, что вы хотите показать уведомление, когда пользователь подключается к чату. Вы считываете текущую тему (тёмную или светлую) из пропсов, чтобы показать уведомление в правильном цвете:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

Однако `theme` — это реактивное значение (оно может измениться в результате повторного рендера), поэтому [каждое реактивное значение внутри Эффекта нужно добавить в зависимости.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Теперь придётся добавить `theme` в массив зависимостей Эффекта:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Все зависимости добавлены
  // ...
```

Попробуйте найти проблему с пользовательским опытом в приведённом ниже примере:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Логика подключения к серверу
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Когда `roomId` меняется, чат переподключается, как и ожидалось. Но поскольку `theme` также является зависимостью, то при изменении темы чат *также* переподключается. Это не очень хорошо!

Иначе говоря, вы *не* хотите, чтобы эта часть кода внутри Эффекта была реактивной:

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Вам нужен способ вынести эту нереактивную логику из реактивного Эффекта.

### Объявление События эффекта {/*declaring-an-effect-event*/}

<Wip>

Этот раздел описывает **экспериментальный API, который ещё не был выпущен** в стабильной версии React.

</Wip>

Используйте специальный хук [`useEffectEvent`](/reference/react/experimental_useEffectEvent), чтобы извлечь эту нереактивную логику из вашего Эффекта:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

`onConnected` называется *Событием эффекта.* Это часть логики вашего Эффекта, но она ведёт себя скорее как обработчик событий. Логика внутри неё не реактивна, и она всегда «видит» последние значения ваших пропсов и состояния.

Теперь можно вызвать Событие эффекта `onConnected` внутри вашего Эффекта:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Все зависимости добавлены
  // ...
```

Это решает проблему. Обратите внимание, что вам пришлось *удалить* `onConnected` из списка зависимостей вашего эффекта. **События эффекта не являются реактивными и должны быть исключены из зависимостей.**

Убедитесь, что теперь всё работает так, как вы ожидаете:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Логика подключения к серверу
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Вы можете думать о Событиях эффектов как о чём-то очень похожем на обработчики событий. Главное отличие в том, что обработчики событий запускаются в ответ на взаимодействие с пользователем, тогда как События эффектов запускаются вами из Эффектов. События эффектов "разрывают связь" между реактивностью эффектов и кодом, который не должен быть реактивным.

### Чтение последних пропсов и состояния с помощью Событий эффектов {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Этот раздел описывает **экспериментальный API, который ещё не был выпущен** в стабильной версии React.

</Wip>

События эффектов позволяют исправить множество паттернов, в которых может возникнуть соблазн отключить линтер зависимостей.

Например, у вас есть Эффект, чтобы логировать страницу посещений:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Далее вы добавляете для вашего сайта многостраничность. Теперь ваш компонент `Page` получает проп `url` с текущим путём. Если вы хотите использовать `url` при вызове функции `logVisit`, то линтер зависимостей выдаст предупреждение:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 В зависимостях React-хука useEffect отсутствует: 'url'
  // ...
}
```

Подумайте, что вы хотите от вашего кода. Вы *хотите* логировать посещения для разных URL, поскольку каждый URL представляет собой отдельную страницу. Другими словами, вызов `logVisit` *должен* быть реактивным по отношению к `url`. Вот почему в этом случае следует прислушаться к линтеру и добавить `url` в качестве зависимости:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Все зависимости добавлены
  // ...
}
```

Теперь предположим, что вы хотите включать в логи количество товаров в корзине:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 В зависимостях React-хука useEffect отсутствует: 'numberOfItems'
  // ...
}
```

Вы использовали `numberOfItems` внутри Эффекта, поэтому линтер просит добавить его как зависимость. Однако вы *не* хотите, чтобы вызов `logVisit` был реактивным по отношению к `numberOfItems`. Если пользователь кладёт что-то в корзину, и `numberOfItems` изменяется, это *не значит*, что пользователь снова посетил страницу. Другими словами, *посещение страницы* является, в некотором смысле, «событием». Оно происходит в определённый момент времени.

Разделим код на две части:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Все зависимости добавлены
  // ...
}
```

Здесь `onVisit` — это Событие эффекта. Код внутри него нереактивный. Вот почему вы можете использовать `numberOfItems` (или любое другое реактивное значение!), не беспокоясь о том, что это приведёт к повторному выполнению внешнего кода при изменениях.

С другой стороны, Эффект остаётся реактивным. Код внутри Эффекта использует свойство `url`, поэтому Эффект будет перезапускаться при изменении `url`. Это, в свою очередь, вызовет Событие эффекта `onVisit`.

В результате вы будете вызывать `logVisit` при каждом изменении `url` и всегда иметь актуальное `numberOfItems`. Однако, если `numberOfItems` изменится сам по себе, это не приведёт к повторному запуску кода.

<Note>

Возможно, вы зададитесь вопросом, можно ли вызвать `onVisit()` без аргументов и считать `url` внутри него:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Это сработает, но лучше передать этот `url` в Событие эффекта явно. **Передавая `url` в качестве аргумента в событие эффекта, вы говорите, что посещение страницы с другим `url` представляет собой отдельное «событие» с точки зрения пользователя.** `visitedUrl` является *частью* произошедшего «события»:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Поскольку Событие эффекта явно «запрашивает» `visitedUrl`, теперь вы не можете случайно удалить `url` из зависимостей эффекта. Если вы удалите зависимость `url` (что приведёт к тому, что отдельные посещения страницы будут засчитаны как одно), линтер предупредит вас об этом. Вам нужно, чтобы `onVisit` был реактивным по отношению к `url`, поэтому вместо того, чтобы читать `url` внутри (где он не будет реактивным), вы передаёте его *из* вашего Эффекта.

Это особенно важно, если внутри Эффекта есть асинхронная логика:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Задержка при логировании посещений
  }, [url]);
```

Здесь `url` внутри `onVisit` соответствует *последнему* значению `url` (которое уже могло измениться), а `visitedUrl` соответствует `url`, который изначально вызвал этот Эффект (и вызвал `onVisit`).

</Note>

<DeepDive>

#### Можно ли вместо этого игнорировать линтер зависимостей? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

В коде вы иногда можете увидеть игнорирование правил линтера:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Избегайте подобного игнорирования правил линтера:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

После того как `useEffectEvent` станет стабильной частью React, мы рекомендуем **никогда не подавлять линтер**.

Первый недостаток при отключении этого правила заключается в том, что React перестанет предупреждать, чтобы вы добавили зависимости в свой Эффект при использовании новых реактивных значений. В предыдущем примере вы добавили `url` к зависимостям, *потому что* React напомнил вам сделать это. Вы больше не будете получать такие напоминания при редактировании этого Эффекта, если вы отключите линтер. Это ведёт к ошибкам.

Вот пример запутанной ошибки, вызванной отключением линтера. В примере функция `handleMove` должна считывать текущее значение переменной состояния `canMove`, чтобы решить, должна ли точка следовать за курсором. Однако `canMove` всегда остаётся равной `true` внутри `handleMove`.

Можете сказать почему?

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


Проблема заключается в отключении линтера зависимостей. Если вы включите линтер, то увидите, что этот Эффект должен зависеть от функции `handleMove`. Это имеет смысл: `handleMove` объявлен внутри тела компонента, что делает его реактивным значением. Каждое реактивное значение должно быть включено в зависимость, иначе оно может устареть!

Автор исходного кода «солгал» React, сказав, что Эффект не зависит (`[]`) от каких-либо реактивных значений. Вот почему React не перезапустил Эффект после изменения `canMove` (и `handleMove` вместе с ним). Поскольку React не перезапустил Эффект, `handleMove`, присоединённый в качестве слушателя, является функцией `handleMove`, созданной во время первого рендера. Во время первого рендера `canMove` был `true`, поэтому `handleMove` из первого рендера всегда будет видеть это значение.

**Если вы никогда не отключаете линтер, вы никогда не увидите проблем с устаревшими значениями.**

При использовании `useEffectEvent` нет необходимости «лгать» линтеру, и код будет работать так, как ожидалось:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Это вовсе не значит, что `useEffectEvent` — это *всегда* правильное решение. Вы должны применять его только к тому коду, который не должен быть реактивным. В примере выше вы не хотели, чтобы код Эффекта был реактивным по отношению к `canMove`. Вот почему имело смысл вынести Событие Эффекта.

Почитайте об [удалении зависимостей Эффекта](/learn/removing-effect-dependencies), чтобы узнать о других альтернативах отключению линтера.

</DeepDive>

### Ограничения при использовании Эффектов событий {/*limitations-of-effect-events*/}

<Wip>

Этот раздел описывает **экспериментальный API, который ещё не был выпущен** в стабильной версии React.

</Wip>

Использование Эффектов событий накладывает ряд ограничений:

* **Вызывайте их только внутри Эффектов.**
* **Никогда не передавайте их в другие компоненты или хуки.**

Например, не объявляйте и не передавайте Событие эффекта следующим образом:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Избегайте передачи Эффекта событий

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Необходимо указать "callback" в качестве зависимости
}
```

Вместо этого всегда объявляйте События эффектов рядом с Эффектами, которые их используют:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Принято: вызывается локально только внутри эффекта
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Не нужно определять "onTick" (Событине эффекта) в качестве зависимости
}
```

События эффекта — это нереактивные «части» кода вашего Эффекта. Они должны быть рядом с Эффектом, который их использует.

<Recap>

- Обработчики событий запускаются в результате определённых взаимодействий.
- Эффекты запускаются всякий раз, когда требуется синхронизация.
- Логика внутри обработчиков событий не является реактивной.
- Логика внутри Эффектов является реактивной.
- Вы можете вынести нереактивную логику из Эффектов в События эффектов.
- Вызывайте События эффектов только внутри Эффектов.
- Не передавайте События эффектов другим компонентам или хукам.

</Recap>

<Challenges>

#### Исправьте переменную, которая не обновляется {/*fix-a-variable-that-doesnt-update*/}

В компоненте `Timer` задано состояние `count`, которое увеличивается каждую секунду. Значение, на которое она увеличивается, хранится в переменной состояния `increment`. Вы можете управлять переменной `increment` с помощью кнопок плюс и минус.

Однако, сколько бы раз вы ни нажимали кнопку «плюс», счётчик всё равно увеличивается на единицу каждую секунду. Что не так с этим кодом? Почему `increment` всегда равен `1` внутри Эффекта? Найдите ошибку и исправьте её.

<Hint>

Чтобы исправить этот код, достаточно следовать правилам.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Как обычно, при поиске ошибок в Эффектах начните с поиска отключений линтера.

Если вы удалите комментарий, отключающий линтер, React скажет вам, что Эффект зависит от `increment`, но вы «солгали» React, заявив, что этот Эффект не зависит ни от одного реактивного значения (`[]`). Добавьте `increment` в массив зависимостей:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Теперь, когда `increment` изменится, React обновит ваш Эффект, что перезапустит интервал.

</Solution>

#### Исправьте залипающий счётчик {/*fix-a-freezing-counter*/}

В компоненте `Timer` задано состояние `count`, которое увеличивается каждую секунду. Значение, на которое она увеличивается, хранится в переменной состояния `increment`. Вы можете управлять переменной `increment` с помощью кнопок «плюс» и «минус». Например, попробуйте нажать на кнопку «плюс» девять раз и обратите внимание, что `count` теперь увеличивается каждую секунду на десять, а не на один.

Но сейчас есть небольшая проблема. Вы могли заметить, что если вы нажмёте на кнопки «плюс» или «минус» больше одного раза в секунду, сам таймер, кажется, останавливается. Он возобновляется только через секунду с момента последнего нажатия на любую из кнопок. Найдите причину и устраните проблему, чтобы таймер тикал *каждую* секунду без перерывов.

<Hint>

Похоже, что Эффект, который устанавливает таймер, «реагирует» на значение `increment`. Действительно ли строка, которая использует текущее значение `increment` для вызова `setCount`, должна быть реактивной?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Проблема в том, что код внутри Эффекта использует переменную состояния `increment`. Поскольку это зависимость вашего Эффекта, каждое изменение `increment` приводит к повторной синхронизации Эффекта, что приводит к очистке интервала. Если вы будете продолжать очищать интервал каждый раз, прежде чем он успеет сработать, это будет выглядеть так, как будто таймер остановился.

Чтобы решить эту проблему, нужно отделить Событие эффекта `onTick` от Эффекта:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Поскольку `onTick` является Событием эффекта, то код внутри него не является реактивным. Изменение `increment` не вызывает перезапуска Эффекта.

</Solution>

#### Исправьте неуправляемую задержку {/*fix-a-non-adjustable-delay*/}

В этом примере вы можете настраивать время задержки. Оно хранится в переменной состояния `delay`, которая обновляется двумя кнопками. Однако, даже если вы нажмёте кнопку «плюс 100 мс», пока `delay` не станет 1000 миллисекунд (то есть секунда), вы заметите, что таймер всё равно увеличивается очень быстро (каждые 100 мс). То есть ваши изменения `delay` игнорируются. Найдите и исправьте ошибку.

<Hint>

Код внутри Событий эффектов не является реактивным. Возможно есть ли случаи, при которых вы бы _хотели_ повторного запуска вызова `setInterval`?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Проблема заключается в том, что при вынесении События эффекта с именем `onMount` мы не учли, что должен делать код. События эффектов следует выносить только в том случае, если вы хотите сделать часть своего кода нереактивной. Однако вызов `setInterval` *должен* быть реактивным по отношению к переменной состояния `delay`. Если `delay` изменится, вам нужно сбросить интервал! Чтобы исправить этот код, верните весь реактивный код обратно в Эффект:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

В целом, следует с подозрением относиться к функциям вроде `onMount`, которые фокусируются на *времени*, а не на *предназначении* написанного кода. Сначала это могло казаться «более информативным», но это исказит ваши намерения. Как правило, События эффекта должны соответствовать чему-то, что происходит с точки зрения *пользователя*. Например, `onMessage`, `onTick`, `onVisit` или `onConnected` — хорошие имена Событий эффекта. Код внутри них, скорее всего, не должен быть реактивным. С другой стороны, `onMount`, `onUpdate`, `onUnmount` или `onAfterRender` настолько общие, что в них легко случайно поместить код, который *должен* быть реактивным. Вот почему вы должны называть свои События эффекта в честь *того, что, по мнению пользователя, произошло*, а не того, в какой момент код был запущен.

</Solution>

#### Исправьте задержку уведомления {/*fix-a-delayed-notification*/}

Когда вы подключаетесь к чату, компонент показывает уведомление. Однако уведомление не появляется сразу. Вместо этого уведомление искусственно задерживается на две секунды, чтобы пользователь познакомился с интерфейсом.

Казалось бы, что это работает, но есть ошибка. Попробуйте в выпадающем списке быстро изменить поля с «general» на «travel», а затем на «music». Если сделать это достаточно быстро, вы увидите два уведомления (как и ожидалось!), но в *обоих* будет показано «Welcome to music».

Исправьте это так, чтобы при очень быстром переключении с «general» на «travel», а затем на «music» вы видели два уведомления: первое — «Welcome to travel», а второе — «Welcome to music». (В качестве дополнительной задачи, *после* исправления уведомлений, измените код так, чтобы отображалось только последнее уведомление.)

<Hint>

Ваш Эффект знает, к какому чату он подключен. Может быть есть какая-либо информация, которую вы хотели бы передать в Событие эффекта?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Логика подключения к серверу
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution>

Внутри События эффекта значение `roomId` считывается *в момент вызова События эффекта.*

Событие эффекта вызывается с двухсекундной задержкой. Если вы быстро переключаетесь между чатами «travel» и «music», к тому времени, как отобразится уведомление для «travel», `roomId` уже будет `"music"`. Вот почему в обоих уведомлениях написано «Welcome to music».

Чтобы исправить проблему, вместо чтения *последнего* значения `roomId` внутри События эффекта, сделайте его параметром вашего События эффекта, например `connectedRoomId`. Затем передайте `roomId` из вашего эффекта, вызвав `onConnected(roomId)`:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Логика подключения к серверу
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Эффект, у которого `roomId` равен `"travel"` (при подключении к чату `"travel"`), покажет уведомление для `"travel"`. Эффект, у которого `roomId` равен `"music"` (при подключении к чату `"music"`), покажет уведомление для `"music"`. Другими словами, `connectedRoomId` исходит из вашего Эффекта (который является реактивным), в то время как `theme` всегда использует последнее значение.

Чтобы решить дополнительную задачу, сохраните идентификатор таймера для уведомления и очистите его в функции очистки Эффекта:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Логика подключения к серверу
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Это гарантирует, что запланированные (но ещё не отображённые) уведомления будут отменены при переключении чата.

</Solution>

</Challenges>
