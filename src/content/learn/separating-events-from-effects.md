---
title: 'Разделение событий и эффектов'
---
```html
<Intro>

Обработчики событий перезапускаются только при повторном выполнении того же взаимодействия. В отличие от обработчиков событий, эффекты повторно синхронизируются, если какое-либо значение, которое они считывают, например пропсы или переменная состояния, отличается от того, что было во время последнего рендера. Иногда вам также требуется сочетание обоих типов поведения: эффект, который перезапускается в ответ на некоторые значения, но не на другие. На этой странице вы узнаете, как это сделать.

</Intro>

<YouWillLearn>

- Как выбирать между обработчиком событий и эффектом
- Почему эффекты реактивны, а обработчики событий — нет
- Что делать, если вы хотите, чтобы часть кода вашего эффекта не была реактивной
- Что такое события эффектов и как извлекать их из ваших эффектов
- Как считывать последние пропсы и состояние из эффектов с помощью событий эффектов

</YouWillLearn>

## Выбор между обработчиками событий и эффектами {/*choosing-between-event-handlers-and-effects*/}

Сначала давайте вспомним разницу между обработчиками событий и эффектами.

Представьте, что вы реализуете компонент комнаты чата. Ваши требования выглядят следующим образом:

1. Ваш компонент должен автоматически подключаться к выбранной комнате чата.
1. Когда вы нажимаете кнопку «Отправить», он должен отправлять сообщение в чат.

Предположим, вы уже реализовали код для них, но не уверены, куда его поместить. Следует ли использовать обработчики событий или эффекты? Каждый раз, когда вам нужно ответить на этот вопрос, подумайте о том, [*почему* код должен запускаться.](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### Обработчики событий запускаются в ответ на определенные взаимодействия {/*event-handlers-run-in-response-to-specific-interactions*/}

С точки зрения пользователя, отправка сообщения должна происходить *потому, что* была нажата конкретная кнопка «Отправить». Пользователь будет довольно расстроен, если вы отправите его сообщение в любое другое время или по любой другой причине. Вот почему отправка сообщения должна быть обработчиком событий. Обработчики событий позволяют обрабатывать определенные взаимодействия:

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

С помощью обработчика событий вы можете быть уверены, что `sendMessage(message)` будет запускаться *только* при нажатии пользователем кнопки.

### Эффекты запускаются всякий раз, когда требуется синхронизация {/*effects-run-whenever-synchronization-is-needed*/}

Помните, что вам также нужно поддерживать подключение компонента к комнате чата. Куда поместить этот код?

*Причина* запуска этого кода — не какое-то конкретное взаимодействие. Неважно, почему и как пользователь перешел на экран комнаты чата. Теперь, когда он смотрит на него и может взаимодействовать с ним, компонент должен оставаться подключенным к выбранному серверу чата. Даже если компонент комнаты чата был начальным экраном вашего приложения, и пользователь вообще не выполнял никаких взаимодействий, вам *все равно* нужно будет подключиться. Вот почему это эффект:

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

С помощью этого кода вы можете быть уверены, что всегда есть активное подключение к выбранному в данный момент серверу чата, *независимо* от конкретных взаимодействий, выполняемых пользователем. Независимо от того, открыл ли пользователь только ваше приложение, выбрал другую комнату или перешел на другой экран и вернулся обратно, ваш эффект гарантирует, что компонент *останется синхронизированным* с выбранной в данный момент комнатой и будет [повторно подключаться всякий раз, когда это необходимо.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

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

Интуитивно можно сказать, что обработчики событий всегда запускаются «вручную», например, нажатием кнопки. Эффекты, с другой стороны, «автоматические»: они запускаются и перезапускаются так часто, как это необходимо для поддержания синхронизации.

Есть более точный способ думать об этом.

Пропсы, состояние и переменные, объявленные внутри тела вашего компонента, называются <CodeStep step={2}>реактивными значениями</CodeStep>. В этом примере `serverUrl` не является реактивным значением, но `roomId` и `message` — да. Они участвуют в потоке данных рендеринга:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Реактивные значения, подобные этим, могут изменяться из-за повторного рендеринга. Например, пользователь может отредактировать `message` или выбрать другой `roomId` в раскрывающемся списке. Обработчики событий и эффекты реагируют на изменения по-разному:

- **Логика внутри обработчиков событий *не реактивна.*** Она не будет запускаться снова, если пользователь не выполнит то же взаимодействие (например, щелчок) снова. Обработчики событий могут считывать реактивные значения, не «реагируя» на их изменения.
- **Логика внутри эффектов *реактивна.*** Если ваш эффект считывает реактивное значение, [вы должны указать его в качестве зависимости.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Затем, если повторный рендеринг приводит к изменению этого значения, React повторно запустит логику вашего эффекта с новым значением.

Давайте вернемся к предыдущему примеру, чтобы проиллюстрировать эту разницу.

### Логика внутри обработчиков событий не реактивна {/*logic-inside-event-handlers-is-not-reactive*/}

Посмотрите на эту строку кода. Должна ли эта логика быть реактивной или нет?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

С точки зрения пользователя, **изменение `message` _не_ означает, что он хочет отправить сообщение.** Это только означает, что пользователь печатает. Другими словами, логика, которая отправляет сообщение, не должна быть реактивной. Она не должна запускаться снова только потому, что <CodeStep step={2}>реактивное значение</CodeStep> изменилось. Вот почему она находится в обработчике событий:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Обработчики событий не реактивны, поэтому `sendMessage(message)` будет запускаться только при нажатии пользователем кнопки «Отправить».

### Логика внутри эффектов реактивна {/*logic-inside-effects-is-reactive*/}

Теперь вернемся к этим строкам:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

С точки зрения пользователя, **изменение `roomId` *означает*, что он хочет подключиться к другой комнате.** Другими словами, логика подключения к комнате должна быть реактивной. Вы *хотите*, чтобы эти строки кода «успевали» за <CodeStep step={2}>реактивным значением</CodeStep> и запускались снова, если это значение отличается. Вот почему это находится в эффекте:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Эффекты реактивны, поэтому `createConnection(serverUrl, roomId)` и `connection.connect()` будут запускаться для каждого отдельного значения `roomId`. Ваш эффект поддерживает синхронизацию подключения к чату с выбранной в данный момент комнатой.

## Извлечение нереактивной логики из эффектов {/*extracting-non-reactive-logic-out-of-effects*/}

Ситуация становится сложнее, когда вы хотите смешать реактивную логику с нереактивной логикой.

Например, представьте, что вы хотите отображать уведомление при подключении пользователя к чату. Вы считываете текущую тему (темную или светлую) из пропсов, чтобы отобразить уведомление в правильном цвете:

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

Однако `theme` — это реактивное значение (оно может измениться в результате повторного рендеринга), и [каждое реактивное значение, считываемое эффектом, должно быть объявлено в качестве его зависимости.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Теперь вам нужно указать `theme` в качестве зависимости вашего эффекта:

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

Поиграйте с этим примером и посмотрите, сможете ли вы обнаружить проблему с этим пользовательским интерфейсом:

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

Когда `roomId` изменяется, чат переподключается, как и ожидалось. Но поскольку `theme` также является зависимостью, чат *также* переподключается каждый раз, когда вы переключаетесь между темной и светлой темой. Это не очень хорошо!

Другими словами, вы *не* хотите, чтобы эта строка была реактивной, хотя она находится внутри эффекта (который реактивен):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Вам нужен способ отделить эту нереактивную логику от реактивного эффекта вокруг нее.

### Объявление события эффекта {/*declaring-an-effect-event*/}

<Wip>

В этом разделе описывается **экспериментальный API, который еще не был выпущен** в стабильной версии React.

</Wip>

Используйте специальный хук под названием [`useEffectEvent`](/reference/react/experimental_useEffectEvent), чтобы извлечь эту нереактивную логику из вашего эффекта:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

Здесь `onConnected` называется *событием эффекта*. Это часть логики вашего эффекта, но она ведет себя гораздо больше как обработчик событий. Логика внутри него не реактивна, и он всегда «видит» последние значения ваших пропсов и состояния.

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

Это решает проблему. Обратите внимание, что вам пришлось *удалить* `theme` из списка зависимостей вашего эффекта, потому что он больше не используется в эффекте. Вам также не нужно *добавлять* `onConnected` к нему, потому что **события эффектов не реактивны и должны быть опущены из зависимостей.**

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

Вы можете думать о событиях эффектов как об очень похожих на обработчики событий. Основное различие состоит в том, что обработчики событий запускаются в ответ на взаимодействия с пользователем, тогда как события эффектов запускаются вами из эффектов. События эффектов позволяют вам «разорвать цепь» между реактивностью эффектов и кодом, который не должен быть реактивным.

### Чтение последних пропсов и состояния с помощью событий эффектов {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

В этом разделе описывается **экспериментальный API, который еще не был выпущен** в стабильной версии React.

</Wip>

События эффектов позволяют вам исправить многие шаблоны, в которых вы можете быть склонны подавлять линтер зависимостей.

Например, предположим, у вас есть эффект для регистрации посещений страницы:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Позже вы добавляете несколько маршрутов на свой сайт. Теперь ваш компонент `Page` получает пропс `url` с текущим путем. Вы хотите передать `url` как часть вашего вызова `logVisit`, но линтер зависимостей жалуется:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Подумайте о том, что вы хотите, чтобы делал код. Вы *хотите* регистрировать отдельное посещение для разных URL-адресов, поскольку каждый URL-адрес представляет собой другую страницу. Другими словами, этот вызов `logVisit` *должен* быть реактивным по отношению к `url`. Вот почему в этом случае имеет смысл следовать линтеру зависимостей и добавить `url` в качестве зависимости:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Все зависимости объявлены
  // ...
}
```

Теперь давайте предположим, что вы хотите включить количество элементов в корзине вместе с каждым посещением страницы:

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

Вы использовали `numberOfItems` внутри эффекта, поэтому линтер просит вас добавить его в качестве зависимости. Однако вы *не* хотите, чтобы вызов `logVisit` был реактивным по отношению к `numberOfItems`. Если пользователь что-то положит в корзину, и `numberOfItems` изменится, это *не означает*, что пользователь снова посетил страницу. Другими словами, *посещение страницы* в некотором смысле является «событием». Это происходит в определенный момент времени.

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

Здесь `onVisit` — это событие эффекта. Код внутри него не реактивен. Вот почему вы можете использовать `numberOfItems` (или любое другое реактивное значение!) не беспокоясь о том, что это приведет к повторному выполнению окружающего кода при изменениях.

С другой стороны, сам эффект остается реактивным. Код внутри эффекта использует пропс `url`, поэтому эффект будет перезапускаться после каждого повторного рендеринга с другим `url`. Это, в свою очередь, вызовет событие эффекта `onVisit`.

В результате вы будете вызывать `logVisit` для каждого изменения `url` и всегда считывать последние `numberOfItems`. Однако, если `numberOfItems` изменится сам по себе, это не приведет к повторному запуску какого-либо кода.

<Note>

Вам может быть интересно, можно ли вызвать `onVisit()` без аргументов и прочитать `url` внутри него:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Это будет работать, но лучше передать этот `url` в событие эффекта явным образом. **Передавая `url` в качестве аргумента вашему событию эффекта, вы говорите, что посещение страницы с другим `url` представляет собой отдельное «событие» с точки зрения пользователя.** `visitedUrl` является *частью* «события», которое произошло:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Поскольку ваше событие эффекта явно «запрашивает» `visitedUrl`, теперь вы не можете случайно удалить `url` из зависимостей эффекта. Если вы удалите зависимость `url` (в результате чего отдельные посещения страницы будут подсчитываться как одно), линтер предупредит вас об этом. Вы хотите, чтобы `onVisit` был реактивным по отношению к `url`, поэтому вместо того, чтобы считывать `url` внутри (где он не был бы реактивным), вы передаете его *из* вашего эффекта.

Это становится особенно важным, если внутри эффекта есть какая-либо асинхронная логика:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

Здесь `url` внутри `onVisit` соответствует *последнему* `url` (который, возможно, уже изменился), но `visitedUrl` соответствует `url`, который изначально вызвал этот эффект (и этот вызов `onVisit`) для запуска.

</Note>

<DeepDive>

#### Можно ли вместо этого подавить линтер зависимостей? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

В существующих кодовых базах вы иногда можете увидеть, что правило линта подавляется следующим образом:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

После того, как `useEffectEvent` станет стабильной частью React, мы рекомендуем **никогда не подавлять линтер**.

Первым недостатком подавления правила является то, что React больше не будет предупреждать вас, когда ваш эффект должен «реагировать» на новую реактивную зависимость, которую вы внесли в свой код. В предыдущем примере вы добавили `url` в зависимости *потому, что* React напомнил вам об этом. Вы больше не будете получать такие напоминания для каких-либо будущих изменений этого эффекта, если вы отключите линтер. Это приводит к ошибкам.

Вот пример запутанной ошибки, вызванной подавлением линтера. В этом примере функция `handleMove` должна считывать текущее значение переменной состояния `canMove`, чтобы решить, должна ли точка следовать за курсором. Однако `canMove` всегда равно `true` внутри `handleMove`.

Видите, почему?

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

Проблема с этим кодом заключается в подавлении линтера зависимостей. Если вы удалите подавление, вы увидите, что этот эффект должен зависеть от функции `handleMove`. Это имеет смысл: `handleMove` объявляется внутри тела компонента, что делает его реактивным значением. Каждое реактивное значение должно быть указано в качестве зависимости, иначе оно может со временем устареть!

Автор исходного кода «соврал» React, заявив, что эффект не зависит (`[]`) от каких-либо реактивных значений. Вот почему React не повторно синхронизировал эффект после изменения `canMove` (и `handleMove` вместе с ним). Поскольку React не повторно синхронизировал эффект, `handleMove`, прикрепленный в качестве слушателя, является функцией `handleMove`, созданной во время начального рендеринга. Во время начального рендеринга `canMove` было равно `true`, поэтому `handleMove` из начального рендеринга навсегда будет видеть это значение.

**Если вы никогда не подавляете линтер, вы никогда не увидите проблем со старыми значениями.**

С помощью `useEffectEvent` нет необходимости «лгать» линтеру, и код работает так, как вы ожидаете:

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