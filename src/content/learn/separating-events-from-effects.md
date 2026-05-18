---
title: 'Separating Events from Effects'
---

<Intro>

Обработчики событий повторно запускаются только тогда, когда вы выполняете то же самое взаимодействие снова. В отличие от обработчиков событий, эффекты повторно синхронизируются, если какое-либо значение, которое они считывают, например проп или переменная состояния, отличается от того, что было во время последнего рендеринга. Иногда вам также требуется сочетание обоих поведений: эффект, который повторно запускается в ответ на одни значения, но не на другие. Эта страница научит вас, как это сделать.

</Intro>

<YouWillLearn>

- Как выбрать между обработчиком событий и эффектом
- Почему эффекты реактивны, а обработчики событий — нет
- Что делать, когда вы хотите, чтобы часть кода вашего эффекта не была реактивной
- Что такое События Эффектов (Effect Events) и как их извлекать из ваших эффектов
- Как считывать последние пропсы и состояние из эффектов с помощью Событий Эффектов

</YouWillLearn>

## Выбор между обработчиками событий и эффектами {/*choosing-between-event-handlers-and-effects*/}

Сначала давайте вспомним разницу между обработчиками событий и эффектами.

Представьте, что вы реализуете компонент чат-комнаты. Ваши требования выглядят так:

1. Ваш компонент должен автоматически подключаться к выбранной чат-комнате.
1. Когда вы нажимаете кнопку "Отправить", она должна отправлять сообщение в чат.

Допустим, вы уже реализовали код для них, но не уверены, куда его поместить. Следует ли использовать обработчики событий или эффекты? Каждый раз, когда вам нужно ответить на этот вопрос, подумайте, [*почему* код должен выполниться.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Обработчики событий запускаются в ответ на конкретные взаимодействия {/*event-handlers-run-in-response-to-specific-interactions*/}

С точки зрения пользователя, отправка сообщения должна происходить *потому что* была нажата конкретная кнопка "Отправить". Пользователь будет весьма недоволен, если вы отправите его сообщение в любое другое время или по любой другой причине. Вот почему отправка сообщения должна быть обработчиком событий. Обработчики событий позволяют вам обрабатывать конкретные взаимодействия:

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

С помощью обработчика событий вы можете быть уверены, что `sendMessage(message)` выполнится *только* если пользователь нажмет кнопку.

### Эффекты запускаются всякий раз, когда требуется синхронизация {/*effects-run-whenever-synchronization-is-needed*/}

Помните, что вам также нужно оставаться подключенным к чат-комнате. Куда поместить этот код?

*Причина* выполнения этого кода — не какое-то конкретное взаимодействие. Неважно, почему или как пользователь перешел на экран чат-комнаты. Теперь, когда они смотрят на него и могут с ним взаимодействовать, компонент должен оставаться подключенным к выбранному серверу чата. Даже если чат-комната была начальным экраном вашего приложения, и пользователь вообще не выполнял никаких взаимодействий, вам *все равно* нужно было бы подключиться. Вот почему это эффект:

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

С помощью этого кода вы можете быть уверены, что всегда есть активное соединение с текущим выбранным сервером чата, *независимо* от конкретных взаимодействий, выполненных пользователем. Независимо от того, открыл ли пользователь только ваше приложение, выбрал другую комнату или перешел на другой экран и обратно, ваш эффект гарантирует, что компонент будет *оставаться синхронизированным* с текущей выбранной комнатой и будет [переподключаться всякий раз, когда это необходимо.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

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
  // A real implementation would actually connect to the server
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

Интуитивно можно сказать, что обработчики событий всегда запускаются "вручную", например, при нажатии кнопки. Эффекты, с другой стороны, "автоматические": они запускаются и перезапускаются столько раз, сколько необходимо для поддержания синхронизации.

Есть более точный способ осмыслить это.

Пропсы, состояние и переменные, объявленные внутри тела вашего компонента, называются <CodeStep step={2}>реактивными значениями</CodeStep>. В этом примере `serverUrl` не является реактивным значением, но `roomId` и `message` являются. Они участвуют в потоке данных рендеринга:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Реактивные значения, такие как эти, могут изменяться из-за повторного рендеринга. Например, пользователь может отредактировать `message` или выбрать другой `roomId` в выпадающем списке. Обработчики событий и эффекты по-разному реагируют на изменения:

- **Логика внутри обработчиков событий *не реактивна*.** Она не будет выполняться снова, если пользователь не выполнит то же взаимодействие (например, клик) еще раз. Обработчики событий могут считывать реактивные значения, не "реагируя" на их изменения.
- **Логика внутри эффектов *реактивна*.** Если ваш эффект считывает реактивное значение, [вам нужно указать его как зависимость.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Затем, если повторный рендеринг приводит к изменению этого значения, React повторно выполнит логику вашего эффекта с новым значением.

Давайте вернемся к предыдущему примеру, чтобы проиллюстрировать эту разницу.

### Логика внутри обработчиков событий не реактивна {/*logic-inside-event-handlers-is-not-reactive*/}

Взгляните на эту строку кода. Должна ли эта логика быть реактивной или нет?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

С точки зрения пользователя, **изменение `message` *не означает*, что он хочет отправить сообщение.** Это лишь означает, что пользователь печатает. Другими словами, логика, отправляющая сообщение, не должна быть реактивной. Она не должна выполняться снова только потому, что <CodeStep step={2}>реактивное значение</CodeStep> изменилось. Вот почему оно принадлежит обработчику событий:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Обработчики событий не реактивны, поэтому `sendMessage(message)` будет выполняться только тогда, когда пользователь нажмет кнопку "Отправить".

### Логика внутри эффектов реактивна {/*logic-inside-effects-is-reactive*/}

Теперь вернемся к этим строкам:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

С точки зрения пользователя, **изменение `roomId` *означает*, что он хочет подключиться к другой комнате.** Другими словами, логика подключения к комнате должна быть реактивной. Вы *хотите*, чтобы эти строки кода "поспевали" за <CodeStep step={2}>реактивным значением</CodeStep> и выполнялись снова, если это значение отличается. Вот почему оно принадлежит эффекту:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Эффекты реактивны, поэтому `createConnection(serverUrl, roomId)` и `connection.connect()` будут выполняться для каждого уникального значения `roomId`. Ваш эффект поддерживает соединение чата синхронизированным с текущей выбранной комнатой.

## Извлечение нереактивной логики из эффектов {/*extracting-non-reactive-logic-out-of-effects*/}

Ситуация усложняется, когда вы хотите смешать реактивную логику с нереактивной.

Например, представьте, что вы хотите показать уведомление, когда пользователь подключается к чату. Вы читаете текущую тему (тёмную или светлую) из пропсов, чтобы показать уведомление в правильном цвете:

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

Однако `theme` — это реактивное значение (оно может измениться в результате повторного рендеринга), и [каждое реактивное значение, прочитанное эффектом, должно быть объявлено как его зависимость.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Теперь вам придётся указать `theme` как зависимость вашего эффекта:

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
  }, [roomId, theme]); // ✅ Все зависимости объявлены
  // ...
```

Поиграйте с этим примером и посмотрите, сможете ли вы заметить проблему с пользовательским опытом:

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
  // A real implementation would actually connect to the server
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

Когда `roomId` меняется, чат переподключается, как и ожидалось. Но поскольку `theme` также является зависимостью, чат *также* переподключается каждый раз, когда вы переключаетесь между тёмной и светлой темой. Это не очень хорошо!

Другими словами, вы *не хотите*, чтобы эта строка была реактивной, хотя она находится внутри эффекта (который реактивен):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Вам нужен способ отделить эту нереактивную логику от реактивного эффекта вокруг неё.

### Объявление события эффекта {/*declaring-an-effect-event*/}

<Wip>

Этот раздел описывает **экспериментальный API, который ещё не был выпущен** в стабильной версии React.

</Wip>

Используйте специальный хук [`useEffectEvent`](/reference/react/experimental_useEffectEvent), чтобы извлечь эту нереактивную логику из вашего эффекта:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Здесь `onConnected` называется *событием эффекта*. Это часть логики вашего эффекта, но она ведёт себя гораздо больше как обработчик событий. Логика внутри неё не реактивна, и она всегда "видит" последние значения ваших пропсов и состояния.

Теперь вы можете вызвать событие эффекта `onConnected` изнутри вашего эффекта:

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
  }, [roomId]); // ✅ Все зависимости объявлены
  // ...
```

Это решает проблему. Обратите внимание, что вам пришлось *удалить* `theme` из списка зависимостей вашего эффекта, поскольку он больше не используется в эффекте. Вам также не нужно *добавлять* `onConnected` в него, потому что **события эффектов не реактивны и должны быть исключены из зависимостей.**

Убедитесь, что новое поведение работает так, как вы ожидаете:

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
  // A real implementation would actually connect to the server
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

Вы можете думать о событиях эффектов как об очень похожих на обработчики событий. Основное отличие в том, что обработчики событий выполняются в ответ на взаимодействие пользователя, тогда как события эффектов запускаются вами из эффектов. События эффектов позволяют вам "разорвать цепочку" между реактивностью эффектов и кодом, который не должен быть реактивным.

### Чтение последних пропсов и состояния с помощью событий эффектов {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Этот раздел описывает **экспериментальный API, который ещё не был выпущен** в стабильной версии React.

</Wip>

События эффектов позволяют исправить многие шаблоны, где вы можете быть склонны подавлять линтер зависимостей.

Например, скажем, у вас есть эффект для логирования посещений страницы:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Позже вы добавляете несколько маршрутов на свой сайт. Теперь ваш компонент `Page` получает пропс `url` с текущим путём. Вы хотите передать `url` как часть вашего вызова `logVisit`, но линтер зависимостей выдаёт ошибку:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Подумайте о том, что вы хотите, чтобы код делал. Вы *хотите* логировать отдельное посещение для разных URL, поскольку каждый URL представляет собой отдельную страницу. Другими словами, этот вызов `logVisit` *должен* быть реактивным по отношению к `url`. Вот почему в этом случае имеет смысл следовать линтеру зависимостей и добавить `url` в качестве зависимости:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Все зависимости объявлены
  // ...
}
```

Теперь предположим, вы хотите включить количество товаров в корзине вместе с каждым посещением страницы:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Вы использовали `numberOfItems` внутри эффекта, поэтому линтер просит вас добавить его в зависимости. Однако вы *не хотите*, чтобы вызов `logVisit` был реактивным по отношению к `numberOfItems`. Если пользователь кладёт что-то в корзину, и `numberOfItems` меняется, это *не означает*, что пользователь снова посетил страницу. Другими словами, *посещение страницы* — это, в некотором смысле, "событие". Оно происходит в определённый момент времени.

Разделите код на две части:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Все зависимости объявлены
  // ...
}
```

Здесь `onVisit` — это событие эффекта. Код внутри него не реактивен. Вот почему вы можете использовать `numberOfItems` (или любое другое реактивное значение!) без беспокойства о том, что это вызовет повторное выполнение окружающего кода при изменениях.

С другой стороны, сам эффект остаётся реактивным. Код внутри эффекта использует пропс `url`, поэтому эффект будет повторно запускаться после каждого повторного рендеринга с другим `url`. Это, в свою очередь, вызовет событие эффекта `onVisit`.

В результате вы будете вызывать `logVisit` при каждом изменении `url` и всегда читать последние `numberOfItems`. Однако, если `numberOfItems` изменится сам по себе, это не вызовет повторного выполнения какого-либо кода.

<Note>

Вы можете задаться вопросом, нельзя ли было вызвать `onVisit()` без аргументов и прочитать `url` внутри него:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Это сработало бы, но лучше передавать этот `url` в событие эффекта явно. **Передавая `url` в качестве аргумента вашему событию эффекта, вы говорите, что посещение страницы с другим `url` представляет собой отдельное "событие" с точки зрения пользователя.** `visitedUrl` является *частью* произошедшего "события":

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Поскольку ваше событие эффекта явно "запрашивает" `visitedUrl`, теперь вы не можете случайно удалить `url` из зависимостей эффекта. Если вы удалите зависимость `url` (что приведёт к тому, что отдельные посещения страницы будут считаться одним), линтер предупредит вас об этом. Вы хотите, чтобы `onVisit` был реактивным по отношению к `url`, поэтому вместо чтения `url` внутри (где он не был бы реактивным) вы передаёте его *из* вашего эффекта.

Это становится особенно важным, если внутри эффекта есть какая-то асинхронная логика:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Задержка логирования посещений
  }, [url]);
```

Здесь `url` внутри `onVisit` соответствует *последнему* `url` (который мог уже измениться), но `visitedUrl` соответствует `url`, который изначально вызвал этот эффект (и этот вызов `onVisit`).

</Note>

<DeepDive>

#### Можно ли вместо этого подавить линтер зависимостей? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

В существующих кодовых базах вы иногда можете увидеть подавление правила линтера вот так:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Избегайте подавления линтера таким образом:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

После того как `useEffectEvent` станет стабильной частью React, мы рекомендуем **никогда не подавлять линтер**.

Первый недостаток подавления правила заключается в том, что React больше не будет предупреждать вас, когда ваш эффект должен "реагировать" на новую реактивную зависимость, которую вы добавили в свой код. В предыдущем примере вы добавили `url` в зависимости *потому*, что React напомнил вам об этом. Вы больше не будете получать таких напоминаний для любых будущих правок этого эффекта, если отключите линтер. Это приводит к ошибкам.

Вот пример запутанной ошибки, вызванной подавлением линтера. В этом примере функция `handleMove` должна считывать текущее значение переменной состояния `canMove`, чтобы решить, будет ли точка следовать за курсором. Однако `canMove` всегда `true` внутри `handleMove`.

Видите почему?

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


Проблема этого кода заключается в подавлении линтера зависимостей. Если вы уберёте подавление, вы увидите, что этот эффект должен зависеть от функции `handleMove`. Это имеет смысл: `handleMove` объявлена внутри тела компонента, что делает её реактивным значением. Каждое реактивное значение должно быть указано как зависимость, иначе оно может устареть со временем!

Автор исходного кода "обманул" React, сказав, что эффект не зависит (`[]`) от каких-либо реактивных значений. Вот почему React не синхронизировал эффект заново после изменения `canMove` (и вместе с ним `handleMove`). Поскольку React не синхронизировал эффект заново, `handleMove`, прикреплённый как слушатель, является функцией `handleMove`, созданной во время первоначального рендеринга. Во время первоначального рендеринга `canMove` был `true`, поэтому `handleMove` из первоначального рендеринга навсегда увидит это значение.

**Если вы никогда не подавляете линтер, вы никогда не столкнётесь с проблемами устаревших значений.**

С `useEffectEvent` нет необходимости "лгать" линтеру, и код работает так, как вы ожидаете:

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

Это не означает, что `useEffectEvent` — это *всегда* правильное решение. Его следует применять только к тем строкам кода, которые вы не хотите делать реактивными. В приведенном выше песочнице вы не хотели, чтобы код эффекта был реактивным по отношению к `canMove`. Вот почему имело смысл извлечь событие эффекта.

Прочтите [Удаление зависимостей эффектов](/learn/removing-effect-dependencies) для других правильных альтернатив подавлению линтера.

</DeepDive>

### Ограничения событий эффектов {/*limitations-of-effect-events*/}

<Wip>

Этот раздел описывает **экспериментальный API, который ещё не был выпущен** в стабильной версии React.

</Wip>

События эффектов (Effect Events) очень ограничены в использовании:

*   **Вызывайте их только внутри эффектов.**
*   **Никогда не передавайте их другим компонентам или хукам.**

Например, не объявляйте и не передавайте событие эффекта таким образом:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Избегайте: передача событий эффектов

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
  }, [delay, callback]); // Необходимо указать "callback" в зависимостях
}
```

Вместо этого всегда объявляйте события эффектов непосредственно рядом с эффектами, которые их используют:

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
      onTick(); // ✅ Хорошо: вызывается только локально внутри эффекта
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Нет необходимости указывать "onTick" (событие эффекта) в качестве зависимости
}
```

События эффектов — это нереактивные «части» вашего кода эффекта. Они должны находиться рядом с эффектом, который их использует.

<Recap>

*   Обработчики событий выполняются в ответ на конкретные взаимодействия.
*   Эффекты выполняются всякий раз, когда требуется синхронизация.
*   Логика внутри обработчиков событий не является реактивной.
*   Логика внутри эффектов является реактивной.
*   Вы можете переместить нереактивную логику из эффектов в события эффектов.
*   Вызывайте события эффектов только внутри эффектов.
*   Не передавайте события эффектов другим компонентам или хукам.

</Recap>

<Challenges>

#### Исправьте переменную, которая не обновляется {/*fix-a-variable-that-doesnt-update*/}

Этот компонент `Timer` хранит переменную состояния `count`, которая увеличивается каждую секунду. Значение, на которое она увеличивается, хранится в переменной состояния `increment`. Вы можете управлять переменной `increment` с помощью кнопок плюс и минус.

Однако, сколько бы раз вы ни нажимали кнопку плюс, счётчик всё равно увеличивается на единицу каждую секунду. Что не так с этим кодом? Почему `increment` всегда равен `1` внутри кода эффекта? Найдите ошибку и исправьте её.

<Hint>

Чтобы исправить этот код, достаточно следовать правилам.

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

Как обычно, когда вы ищете ошибки в эффектах, начните с поиска подавлений линтера.

Если вы удалите комментарий подавления, React сообщит вам, что код этого эффекта зависит от `increment`, но вы «обманули» React, заявив, что этот эффект не зависит ни от каких реактивных значений (`[]`). Добавьте `increment` в массив зависимостей:

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

Теперь, когда `increment` изменится, React повторно синхронизирует ваш эффект, что перезапустит интервал.

</Solution>

#### Исправьте зависший счётчик {/*fix-a-freezing-counter*/}

Этот компонент `Timer` хранит переменную состояния `count`, которая увеличивается каждую секунду. Значение, на которое она увеличивается, хранится в переменной состояния `increment`, которой вы можете управлять с помощью кнопок плюс и минус. Например, попробуйте нажать кнопку плюс девять раз, и вы заметите, что `count` теперь увеличивается каждую секунду на десять, а не на единицу.

Есть небольшая проблема с этим пользовательским интерфейсом. Вы можете заметить, что если вы продолжаете нажимать кнопки плюс или минус быстрее, чем раз в секунду, таймер как бы приостанавливается. Он возобновляется только через секунду после последнего нажатия любой из кнопок. Найдите причину этого и исправьте проблему, чтобы таймер тикал *каждую* секунду без перебоев.

<Hint>

Похоже, что эффект, который настраивает таймер, «реагирует» на значение `increment`. Действительно ли строка, использующая текущее значение `increment` для вызова `setCount`, должна быть реактивной?

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

Проблема в том, что код внутри эффекта использует переменную состояния `increment`. Поскольку это зависимость вашего эффекта, каждое изменение `increment` вызывает повторную синхронизацию эффекта, что приводит к очистке интервала. Если вы постоянно очищаете интервал до того, как он успеет сработать, будет казаться, что таймер завис.

Чтобы решить проблему, выделите событие эффекта `onTick` из эффекта:

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

Поскольку `onTick` является событием эффекта, код внутри него не является реактивным. Изменение `increment` не вызывает никаких эффектов.

</Solution>

#### Исправьте нерегулируемую задержку {/*fix-a-non-adjustable-delay*/}

В этом примере вы можете настроить задержку интервала. Она хранится в переменной состояния `delay`, которая обновляется двумя кнопками. Однако, даже если вы нажмете кнопку «плюс 100 мс» до тех пор, пока `delay` не станет 1000 миллисекунд (то есть, одна секунда), вы заметите, что таймер по-прежнему увеличивается очень быстро (каждые 100 мс). Как будто ваши изменения `delay` игнорируются. Найдите и исправьте ошибку.

<Hint>

Код внутри событий эффектов не является реактивным. Есть ли случаи, когда вы _хотели бы_, чтобы вызов `setInterval` перезапускался?

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

Проблема с приведенным выше примером заключается в том, что он выделил событие эффекта под названием `onMount`, не учитывая, что на самом деле должен делать код. Вы должны извлекать события эффектов только по конкретной причине: когда вы хотите сделать часть вашего кода нереактивной. Однако вызов `setInterval` *должен* быть реактивным по отношению к переменной состояния `delay`. Если `delay` изменится, вы захотите настроить интервал с нуля! Чтобы исправить этот код, верните весь реактивный код обратно в эффект:

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

В целом, следует с подозрением относиться к функциям вроде `onMount`, которые фокусируются на *времени*, а не на *цели* фрагмента кода. Сначала это может показаться «более описательным», но это скрывает ваше намерение. Как правило, события эффектов должны соответствовать тому, что происходит с точки зрения *пользователя*. Например, `onMessage`, `onTick`, `onVisit` или `onConnected` — хорошие имена для событий эффектов. Код внутри них, вероятно, не будет нуждаться в реактивности. С другой стороны, `onMount`, `onUpdate`, `onUnmount` или `onAfterRender` настолько общие, что легко случайно поместить в них код, который *должен* быть реактивным. Вот почему вы должны называть свои события эффектов по тому, *что, по мнению пользователя, произошло*, а не когда какой-то код случайно выполнился.

</Solution>

#### Исправление отложенного уведомления {/*fix-a-delayed-notification*/}

При входе в чат-комнату этот компонент отображает уведомление. Однако уведомление появляется не сразу, а с искусственной задержкой в две секунды, чтобы пользователь мог осмотреться в интерфейсе.

Это почти работает, но есть ошибка. Попробуйте быстро переключить выпадающий список с «general» на «travel», а затем на «music». Если сделать это достаточно быстро, вы увидите два уведомления (как и ожидалось!), но оба будут гласить «Welcome to music».

Исправьте код так, чтобы при быстром переключении с «general» на «travel», а затем на «music» появлялись два уведомления: первое — «Welcome to travel», а второе — «Welcome to music». (Для дополнительного усложнения, если вы *уже* добились правильного отображения комнат в уведомлениях, измените код так, чтобы отображалось только последнее уведомление.)

<Hint>

Ваш `useEffect` знает, к какой комнате он подключился. Есть ли какая-то информация, которую вы могли бы передать в ваш `useEffectEvent`?

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
  // A real implementation would actually connect to the server
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

Внутри вашего `useEffectEvent` значение `roomId` — это значение *на момент вызова `useEffectEvent`*.

Ваш `useEffectEvent` вызывается с двухсекундной задержкой. Если вы быстро переключаетесь из комнаты travel в комнату music, к моменту отображения уведомления из комнаты travel, `roomId` уже будет `"music"`. Именно поэтому оба уведомления будут гласить «Welcome to music».

Чтобы исправить эту проблему, вместо чтения *последнего* значения `roomId` внутри `useEffectEvent`, сделайте его параметром вашего `useEffectEvent`, например `connectedRoomId` ниже. Затем передайте `roomId` из вашего `useEffect`, вызвав `onConnected(roomId)`:

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
  // A real implementation would actually connect to the server
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

Эффект, у которого `roomId` был установлен в `"travel"` (поэтому он подключился к комнате `"travel"`), покажет уведомление для `"travel"`. Эффект, у которого `roomId` был установлен в `"music"` (поэтому он подключился к комнате `"music"`), покажет уведомление для `"music"`. Другими словами, `connectedRoomId` берется из вашего `useEffect` (который реактивен), в то время как `theme` всегда использует последнее значение.

Чтобы решить дополнительную задачу, сохраните идентификатор таймера уведомления и очистите его в функции очистки вашего `useEffect`:

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
  // A real implementation would actually connect to the server
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

Это гарантирует, что уже запланированные (но еще не отображенные) уведомления будут отменены при смене комнаты.

</Solution>

</Challenges>
