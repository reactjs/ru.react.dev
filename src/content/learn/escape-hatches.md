---
title: Лазейки
---

<Intro>

Некоторые ваши компоненты могут нуждаться в управлении и синхронизации с системами вне React. Например, вам может понадобиться сфокусироваться на поле ввода с помощью API браузера, воспроизвести и поставить на паузу видеоплеер, реализованный без React, или подключиться и слушать сообщения от удалённого сервера. В этой главе вы узнаете о лазейках, которые позволяют вам «выйти» из React и подключиться к внешним системам. Большая часть вашей логики приложения и потока данных не должна полагаться на эти возможности.

</Intro>

<YouWillLearn isChapter={true}>

* [Как «запоминать» информацию без повторного рендеринга](/learn/referencing-values-with-refs)
* [Как получать доступ к DOM-элементам, управляемым React](/learn/manipulating-the-dom-with-refs)
* [Как синхронизировать компоненты с внешними системами](/learn/synchronizing-with-effects)
* [Как удалять ненужные эффекты из ваших компонентов](/learn/you-might-not-need-an-effect)
* [Чем жизненный цикл эффекта отличается от жизненного цикла компонента](/learn/lifecycle-of-reactive-effects)
* [Как предотвратить повторное срабатывание эффектов для некоторых значений](/learn/separating-events-from-effects)
* [Как сделать так, чтобы эффект срабатывал реже](/learn/removing-effect-dependencies)
* [Как разделять логику между компонентами](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Обращение к значениям с помощью рефов {/*referencing-values-with-refs*/}

Когда вы хотите, чтобы компонент «запоминал» какую-то информацию, но не хотите, чтобы эта информация [вызывала новые рендеры](/learn/render-and-commit), вы можете использовать *реф*:

```js
const ref = useRef(0);
```

Как и состояние, рефы сохраняются React между рендерами. Однако изменение состояния вызывает повторный рендер компонента. Изменение рефа — нет! Вы можете получить доступ к текущему значению этого рефа через свойство `ref.current`.

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

Реф — это как секретный карман вашего компонента, который React не отслеживает. Например, вы можете использовать рефы для хранения [идентификаторов таймеров](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM-элементов](https://developer.mozilla.org/en-US/docs/Web/API/Element) и других объектов, которые не влияют на вывод рендера компонента.

<LearnMore path="/learn/referencing-values-with-refs">

Прочтите **[Обращение к значениям с помощью рефов](/learn/referencing-values-with-refs)**, чтобы узнать, как использовать рефы для запоминания информации.

</LearnMore>

## Манипулирование DOM с помощью рефов {/*manipulating-the-dom-with-refs*/}

React автоматически обновляет DOM, чтобы он соответствовал результату вашего рендера, поэтому вашим компонентам редко придётся им манипулировать. Однако иногда вам может понадобиться доступ к DOM-элементам, управляемым React — например, чтобы сфокусироваться на узле, прокрутить его или измерить его размер и положение. В React нет встроенного способа сделать это, поэтому вам понадобится реф на DOM-узел. Например, нажатие на кнопку сфокусируется на поле ввода с помощью рефа:

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

Прочтите **[Манипулирование DOM с помощью рефов](/learn/manipulating-the-dom-with-refs)**, чтобы узнать, как получать доступ к DOM-элементам, управляемым React.

</LearnMore>

## Синхронизация с эффектами {/*synchronizing-with-effects*/}

Некоторым компонентам требуется синхронизация с внешними системами. Например, вы можете захотеть управлять не-React компонентом на основе состояния React, настроить серверное соединение или отправить аналитический лог при появлении компонента на экране. В отличие от обработчиков событий, которые позволяют обрабатывать конкретные события, *эффекты* позволяют выполнять некоторый код после рендеринга. Используйте их для синхронизации вашего компонента с системой вне React.

Нажмите Play/Pause несколько раз и посмотрите, как видеоплеер остаётся синхронизированным со значением пропса `isPlaying`:

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

Многие эффекты также «очищают» за собой. Например, эффект, который устанавливает соединение с чат-сервером, должен возвращать *функцию очистки*, которая говорит React, как отключить ваш компонент от этого сервера:

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

В режиме разработки React немедленно выполнит и очистит ваш эффект один дополнительный раз. Вот почему вы видите `"✅ Connecting..."` дважды. Это гарантирует, что вы не забудете реализовать функцию очистки.

<LearnMore path="/learn/synchronizing-with-effects">

Прочтите **[Синхронизация с эффектами](/learn/synchronizing-with-effects)**, чтобы узнать, как синхронизировать компоненты с внешними системами.

</LearnMore>

## Возможно, вам не нужен эффект {/*you-might-not-need-an-effect*/}

Эффекты — это лазейка из парадигмы React. Они позволяют вам «выйти» из React и синхронизировать ваши компоненты с некоторой внешней системой. Если внешняя система не задействована (например, если вы хотите обновить состояние компонента при изменении некоторых пропсов или состояния), вам не нужен эффект. Удаление ненужных эффектов сделает ваш код проще для понимания, быстрее в выполнении и менее подверженным ошибкам.

Есть два распространённых случая, когда вам не нужны эффекты:
- **Вам не нужны эффекты для преобразования данных для рендеринга.**
- **Вам не нужны эффекты для обработки событий пользователя.**

Например, вам не нужен эффект для корректировки некоторого состояния на основе другого состояния:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Избегайте: избыточное состояние и ненужный эффект
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

Прочтите **[Возможно, вам не нужен эффект](/learn/you-might-not-need-an-effect)**, чтобы узнать, как удалять ненужные эффекты.

</LearnMore>

## Жизненный цикл реактивных эффектов {/*lifecycle-of-reactive-effects*/}

Эффекты имеют другой жизненный цикл, чем компоненты. Компоненты могут монтироваться, обновляться или размонтироваться. Эффект может делать только две вещи: начать синхронизацию чего-либо и позже прекратить её. Этот цикл может происходить несколько раз, если ваш эффект зависит от пропсов и состояния, которые меняются со временем.

Этот эффект зависит от значения пропса `roomId`. Пропсы — это *реактивные значения*, что означает, что они могут изменяться при повторном рендеринге. Обратите внимание, что эффект *пересинхронизируется* (и переподключается к серверу), если `roomId` изменяется:

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

React предоставляет правило линтера для проверки правильности указания зависимостей вашего эффекта. Если вы забудете указать `roomId` в списке зависимостей в приведенном выше примере, линтер автоматически найдёт эту ошибку.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Прочтите **[Жизненный цикл реактивных эффектов](/learn/lifecycle-of-reactive-effects)**, чтобы узнать, чем жизненный цикл эффекта отличается от жизненного цикла компонента.

</LearnMore>

## Разделение событий и эффектов {/*separating-events-from-effects*/}

<Wip>

Этот раздел описывает **экспериментальный API, который ещё не был выпущен** в стабильной версии React.

</Wip>

Обработчики событий повторно запускаются только при повторном выполнении того же взаимодействия. В отличие от обработчиков событий, эффекты повторно синхронизируются, если какие-либо из значений, которые они считывают (например, пропсы или состояние), отличаются от тех, что были во время последнего рендеринга. Иногда вам нужно сочетание обоих поведений: эффект, который повторно запускается в ответ на одни значения, но не на другие.

Весь код внутри эффектов является *реактивным*. Он будет запущен снова, если какое-либо реактивное значение, которое он считывает, изменилось из-за повторного рендеринга. Например, этот эффект повторно подключится к чату, если изменится либо `roomId`, либо `theme`:

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

Это не идеально. Вы хотите повторно подключаться к чату только в том случае, если изменился `roomId`. Переключение `theme` не должно приводить к повторному подключению к чату! Перенесите код, считывающий `theme`, из вашего эффекта в *Effect Event*:

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

Код внутри Effect Events не является реактивным, поэтому изменение `theme` больше не вызывает повторное подключение вашего эффекта.

<LearnMore path="/learn/separating-events-from-effects">

Прочтите **[Разделение событий и эффектов](/learn/separating-events-from-effects)**, чтобы узнать, как предотвратить повторное срабатывание эффектов из-за некоторых значений.

</LearnMore>

## Удаление зависимостей эффекта {/*removing-effect-dependencies*/}

Когда вы пишете эффект, линтер проверяет, включили ли вы каждое реактивное значение (например, пропсы и состояние), которое эффект считывает, в список зависимостей вашего эффекта. Это гарантирует, что ваш эффект остаётся синхронизированным с последними пропсами и состоянием вашего компонента. Ненужные зависимости могут привести к тому, что ваш эффект будет выполняться слишком часто или даже создаст бесконечный цикл. Способ их удаления зависит от случая.

Например, этот эффект зависит от объекта `options`, который пересо

## Повторное использование логики с помощью пользовательских хуков {/*reusing-logic-with-custom-hooks*/}

React поставляется со встроенными хуками, такими как `useState`, `useContext` и `useEffect`. Иногда вам может захотеться, чтобы существовал хук для более конкретной цели: например, для получения данных, отслеживания состояния подключения пользователя к сети или для подключения к чату. Для этого вы можете создавать собственные хуки для нужд вашего приложения.

В этом примере пользовательский хук `usePointerPosition` отслеживает положение курсора, а пользовательский хук `useDelayedValue` возвращает значение, которое «отстает» от переданного значения на определенное количество миллисекунд. Переместите курсор над областью предварительного просмотра песочницы, чтобы увидеть движущийся след точек, следующих за курсором:

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

Вы можете создавать пользовательские хуки, комбинировать их, передавать между ними данные и повторно использовать их в разных компонентах. По мере роста вашего приложения вы будете писать меньше эффектов вручную, поскольку сможете повторно использовать уже написанные пользовательские хуки. Существует также множество отличных пользовательских хуков, поддерживаемых сообществом React.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Прочтите **[Повторное использование логики с помощью пользовательских хуков](/learn/reusing-logic-with-custom-hooks)**, чтобы узнать, как делиться логикой между компонентами.

</LearnMore>

## Что дальше? {/*whats-next*/}

Перейдите к [Ссылки на значения с помощью Refs](/learn/referencing-values-with-refs), чтобы начать читать эту главу страница за страницей!