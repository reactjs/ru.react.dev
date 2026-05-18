---
title: Лазейки
---
<Intro>

Некоторые ваши компоненты могут нуждаться в управлении и синхронизации с системами вне React. Например, вам может понадобиться сфокусировать поле ввода с помощью API браузера, воспроизвести и поставить на паузу видеоплеер, реализованный без React, или подключиться к удаленному серверу и слушать его сообщения. В этой главе вы узнаете об "обходных путях", которые позволяют вам "выйти" из React и подключиться к внешним системам. Большая часть вашей логики приложения и потока данных не должна полагаться на эти возможности.

</Intro>

<YouWillLearn isChapter={true}>

* [Как "запоминать" информацию без повторного рендеринга](/learn/referencing-values-with-refs)
* [Как получать доступ к DOM-элементам, управляемым React](/learn/manipulating-the-dom-with-refs)
* [Как синхронизировать компоненты с внешними системами](/learn/synchronizing-with-effects)
* [Как удалить ненужные эффекты из ваших компонентов](/learn/you-might-not-need-an-effect)
* [Чем жизненный цикл эффекта отличается от жизненного цикла компонента](/learn/lifecycle-of-reactive-effects)
* [Как предотвратить повторное срабатывание эффектов из-за некоторых значений](/learn/separating-events-from-effects)
* [Как сделать так, чтобы ваш эффект срабатывал реже](/learn/removing-effect-dependencies)
* [Как совместно использовать логику между компонентами](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Referencing values with refs {/*referencing-values-with-refs*/}

Когда вы хотите, чтобы компонент "запоминал" какую-то информацию, но не хотите, чтобы эта информация [вызывала новые рендеры](/learn/render-and-commit), вы можете использовать *ref*:

```js
const ref = useRef(0);
```

Как и состояние, refs сохраняются React между рендерами. Однако изменение состояния вызывает повторный рендер компонента. Изменение ref — нет! Вы можете получить доступ к текущему значению этого ref через свойство `ref.current`.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

Ref — это как секретный карман вашего компонента, который React не отслеживает. Например, вы можете использовать refs для хранения [идентификаторов таймеров](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM-элементов](https://developer.mozilla.org/en-US/docs/Web/API/Element) и других объектов, которые не влияют на вывод рендеринга компонента.

<LearnMore path="/learn/referencing-values-with-refs">

Прочтите **[Referencing Values with Refs](/learn/referencing-values-with-refs)**, чтобы узнать, как использовать refs для запоминания информации.

</LearnMore>

## Manipulating the DOM with refs {/*manipulating-the-dom-with-refs*/}

React автоматически обновляет DOM, чтобы он соответствовал результату вашего рендеринга, поэтому вашим компонентам редко потребуется его изменять. Однако иногда вам может понадобиться доступ к DOM-элементам, управляемым React — например, чтобы сфокусировать узел, прокрутить его или измерить его размер и положение. В React нет встроенного способа сделать это, поэтому вам понадобится ref для DOM-узла. Например, нажатие на кнопку сфокусирует поле ввода с помощью ref:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Прочтите **[Manipulating the DOM with Refs](/learn/manipulating-the-dom-with-refs)**, чтобы узнать, как получать доступ к DOM-элементам, управляемым React.

</LearnMore>

## Synchronizing with Effects {/*synchronizing-with-effects*/}

Некоторым компонентам требуется синхронизация с внешними системами. Например, вы можете захотеть управлять компонентом, не являющимся React-компонентом, на основе состояния React, настроить соединение с сервером или отправить аналитический лог при появлении компонента на экране. В отличие от обработчиков событий, которые позволяют обрабатывать конкретные события, *эффекты* позволяют выполнять некоторый код после рендеринга. Используйте их для синхронизации вашего компонента с системой вне React.

Нажмите "Play/Pause" несколько раз и посмотрите, как видеоплеер остается синхронизированным со значением пропа `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Многие эффекты также "очищают" за собой. Например, эффект, который устанавливает соединение с чат-сервером, должен возвращать *функцию очистки*, которая сообщает React, как отключить ваш компонент от этого сервера:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

В режиме разработки React немедленно запустит и очистит ваш эффект один раз дополнительно. Именно поэтому вы видите вывод `"✅ Connecting..."` дважды. Это гарантирует, что вы не забудете реализовать функцию очистки.

<LearnMore path="/learn/synchronizing-with-effects">

Прочтите **[Synchronizing with Effects](/learn/synchronizing-with-effects)**, чтобы узнать, как синхронизировать компоненты с внешними системами.

</LearnMore>

## You Might Not Need An Effect {/*you-might-not-need-an-effect*/}

Эффекты — это "обходной путь" из парадигмы React. Они позволяют вам "выйти" из React и синхронизировать ваши компоненты с некоторой внешней системой. Если внешняя система не задействована (например, если вы хотите обновить состояние компонента при изменении некоторых пропсов или состояния), вам не нужен эффект. Удаление ненужных эффектов сделает ваш код проще для понимания, быстрее для выполнения и менее подверженным ошибкам.

Существует два распространенных случая, когда вам не нужны эффекты:
- **Вам не нужны эффекты для преобразования данных для рендеринга.**
- **Вам не нужны эффекты для обработки событий пользователя.**

Например, вам не нужен эффект для корректировки некоторого состояния на основе другого состояния:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Избегайте: избыточного состояния и ненужного эффекта
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Вместо этого вычисляйте как можно больше во время рендеринга:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Хорошо: вычислено во время рендеринга
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Однако вам *нужны* эффекты для синхронизации с внешними системами.

<LearnMore path="/learn/you-might-not-need-an-effect">

Прочтите **[You Might Not Need an Effect](/learn/you-might-not-need-an-effect)**, чтобы узнать, как удалять ненужные эффекты.

</LearnMore>

## Lifecycle of reactive effects {/*lifecycle-of-reactive-effects*/}

Эффекты имеют другой жизненный цикл, чем компоненты. Компоненты могут монтироваться, обновляться или размонтироваться. Эффект может делать только две вещи: начать синхронизацию чего-либо и позже прекратить ее. Этот цикл может происходить несколько раз, если ваш эффект зависит от пропсов и состояния, которые меняются со временем.

Этот эффект зависит от значения пропа `roomId`. Пропсы — это *реактивные значения*, что означает, что они могут изменяться при повторном рендеринге. Обратите внимание, что эффект *пересинхронизируется* (и переподключается к серверу), если `roomId` изменится:

<Sandpack>

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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React предоставляет правило линтера для проверки того, правильно ли вы указали зависимости вашего эффекта. Если вы забудете указать `roomId` в списке зависимостей в приведенном выше примере, линтер автоматически найдет эту ошибку.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Прочтите **[Lifecycle of Reactive Events](/learn/lifecycle-of-reactive-effects)**, чтобы узнать, чем жизненный цикл эффекта отличается от жизненного цикла компонента.

</LearnMore>

## Separating events from Effects {/*separating-events-from-effects*/}

<Wip>

Этот раздел описывает **экспериментальный API, который еще не был выпущен** в стабильной версии React.

</Wip>

Обработчики событий повторно запускаются только при повторном выполнении того же взаимодействия. В отличие от обработчиков событий, эффекты повторно синхронизируются, если какие-либо из значений, которые они читают, например пропсы или состояние, отличаются от значений во время последнего рендеринга. Иногда вам нужно сочетание обоих поведений: эффект, который повторно запускается в ответ на одни значения, но не на другие.

Весь код внутри эффектов является *реактивным*. Он снова выполнится, если какое-либо реактивное значение, которое он читает, изменится из-за повторного рендеринга. Например, этот эффект переподключится к чату, если изменится `roomId` или `theme`:

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

Это не идеально. Вы хотите переподключаться к чату только в том случае, если изменился `roomId`. Смена `theme` не должна вызывать переподключение к чату! Перенесите код, читающий `theme`, из вашего эффекта в *Effect Event*:

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

Код внутри Effect Events не является реактивным, поэтому изменение `theme` больше не вызывает переподключение вашего эффекта.

<LearnMore path="/learn/separating-events-from-effects">

Прочтите **[Separating Events from Effects](/learn/separating-events-from-effects)**, чтобы узнать, как предотвратить повторное срабатывание эффектов из-за некоторых значений.

</LearnMore>

## Removing Effect dependencies {/*removing-effect-dependencies*/}

Когда вы пишете эффект, линтер проверяет, включили ли вы все реактивные значения (например, пропсы и состояние), которые эффект читает, в список зависимостей вашего эффекта. Это гарантирует, что ваш эффект остается синхронизированным с последними пропсами и состоянием вашего компонента. Ненужные зависимости могут привести к тому, что ваш эффект будет выполняться слишком часто или даже создаст бесконечный цикл. Способ их удаления зависит от случая.

Например, этот эффект зависит от объекта `options`, который пересоздается каждый раз, когда вы редактируете ввод:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Вы не хотите, чтобы чат переподключался каждый раз, когда вы начинаете вводить сообщение в этом чате. Чтобы решить эту проблему, переместите создание объекта `options` внутрь эффекта, чтобы эффект зависел только от строки `roomId`:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Обратите внимание, что вы не начали с редактирования списка зависимостей, чтобы удалить зависимость `options`. Это было бы неправильно. Вместо этого вы изменили окружающий код так, чтобы зависимость стала *ненужной*. Думайте о списке зависимостей как о списке всех реактивных значений, используемых кодом вашего эффекта. Вы не выбираете намеренно, что поместить в этот список. Список описывает ваш код. Чтобы изменить список зависимостей, измените код.

<LearnMore path="/learn/removing-effect-dependencies">

Прочтите **[Removing Effect Dependencies](/learn/removing-effect-dependencies)**, чтобы узнать, как сделать так, чтобы ваш эффект срабатывал реже.

</LearnMore>

## Reusing logic with custom Hooks {/*reusing-logic-with-custom-hooks*/}

React поставляется со встроенными хуками, такими как `useState`, `useContext` и `useEffect`. Иногда вам будет хотеться, чтобы существовал хук для более конкретной цели: например, для получения данных, отслеживания того, находится ли пользователь в сети, или для подключения к чат-комнате. Для этого вы можете создавать свои собственные хуки для нужд вашего приложения.

В этом примере пользовательский хук `usePointerPosition` отслеживает положение курсора, а пользовательский хук `useDelayedValue` возвращает значение, которое "отстает" от переданного значения на определенное количество миллисекунд. Переместите курсор над областью предварительного просмотра песочницы, чтобы увидеть движущийся след точек, следующих за курсором:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Вы можете создавать пользовательские хуки, комбинировать их, передавать между ними данные и совместно использовать их между компонентами. По мере роста вашего приложения вы будете писать меньше эффектов вручную, потому что сможете повторно использовать уже написанные пользовательские хуки. Существует также множество отличных пользовательских хуков, поддерживаемых сообществом React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Прочтите **[Reusing Logic with Custom Hooks](/learn/reusing-logic-with-custom-hooks)**, чтобы узнать, как совместно использовать логику между компонентами.

</LearnMore>

## What's next? {/*whats-next*/}

Перейдите к [Referencing Values with Refs](/learn/referencing-values-with-refs), чтобы начать читать эту главу страница за страницей!