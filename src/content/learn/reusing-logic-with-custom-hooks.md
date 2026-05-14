---
title: 'Повторное использование логики с пользовательскими хуками'
---
```html
<Intro>

React предоставляет несколько встроенных хуков, таких как `useState`, `useContext` и `useEffect`. Иногда вам захочется, чтобы был хук для какой-то более конкретной цели: например, для получения данных, для отслеживания того, находится ли пользователь в сети, или для подключения к чат-комнате. Вы можете не найти эти хуки в React, но вы можете создать свои собственные хуки для нужд вашего приложения.

</Intro>

<YouWillLearn>

- Что такое пользовательские хуки и как писать свои собственные
- Как повторно использовать логику между компонентами
- Как называть и структурировать свои пользовательские хуки
- Когда и почему следует извлекать пользовательские хуки

</YouWillLearn>

## Пользовательские хуки: совместное использование логики между компонентами {/*custom-hooks-sharing-logic-between-components*/}

Представьте, что вы разрабатываете приложение, которое сильно зависит от сети (как и большинство приложений). Вы хотите предупредить пользователя, если его сетевое соединение случайно отключилось во время использования вашего приложения. Как бы вы это сделали? Кажется, вам понадобятся две вещи в вашем компоненте:

1.  Часть состояния, которая отслеживает, находится ли сеть в сети.
2.  Эффект, который подписывается на глобальные события [`online`](https://developer.mozilla.org/ru/docs/Web/API/Window/online_event) и [`offline`](https://developer.mozilla.org/ru/docs/Web/API/Window/offline_event) и обновляет это состояние.

Это будет держать ваш компонент [синхронизированным](/learn/synchronizing-with-effects) со статусом сети. Вы можете начать с чего-то вроде этого:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

Попробуйте включать и выключать сеть и обратите внимание, как этот `StatusBar` обновляется в ответ на ваши действия.

Теперь представьте, что вы *также* хотите использовать ту же логику в другом компоненте. Вы хотите реализовать кнопку «Сохранить», которая будет отключаться и отображать «Переподключение...» вместо «Сохранить», пока сеть отключена.

Для начала вы можете скопировать и вставить состояние `isOnline` и эффект в `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

Убедитесь, что при отключении сети кнопка изменит свой внешний вид.

Эти два компонента работают нормально, но дублирование логики между ними вызывает сожаление. Кажется, что, хотя у них разный *внешний вид*, вы хотите повторно использовать логику между ними.

### Извлечение собственного пользовательского хука из компонента {/*extracting-your-own-custom-hook-from-a-component*/}

Представьте себе на мгновение, что, аналогично [`useState`](/reference/react/useState) и [`useEffect`](/reference/react/useEffect), существует встроенный хук `useOnlineStatus`. Тогда оба этих компонента можно было бы упростить, и вы могли бы удалить дублирование между ними:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

Хотя такого встроенного хука нет, вы можете написать его сами. Объявите функцию с именем `useOnlineStatus` и переместите в нее весь дублирующийся код из компонентов, которые вы написали ранее:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

В конце функции верните `isOnline`. Это позволяет вашим компонентам читать это значение:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Убедитесь, что включение и выключение сети обновляет оба компонента.

Теперь в ваших компонентах не так много повторяющейся логики. **Что еще важнее, код внутри них описывает *что они хотят сделать* (использовать статус сети!), а не *как это сделать* (подписавшись на события браузера).**

Когда вы извлекаете логику в пользовательские хуки, вы можете скрыть неприятные детали того, как вы имеете дело с какой-либо внешней системой или API браузера. Код ваших компонентов выражает ваше намерение, а не реализацию.

### Имена хуков всегда начинаются с `use` {/*hook-names-always-start-with-use*/}

Приложения React состоят из компонентов. Компоненты состоят из хуков, будь то встроенные или пользовательские. Вы, вероятно, часто будете использовать пользовательские хуки, созданные другими, но иногда вы можете написать один сами!

Вы должны следовать этим соглашениям об именах:

1.  **Имена компонентов React должны начинаться с заглавной буквы,** например, `StatusBar` и `SaveButton`. Компоненты React также должны возвращать что-то, что React умеет отображать, например, фрагмент JSX.
2.  **Имена хуков должны начинаться с `use`, за которым следует заглавная буква,** например, [`useState`](/reference/react/useState) (встроенный) или `useOnlineStatus` (пользовательский, как ранее на странице). Хуки могут возвращать произвольные значения.

Это соглашение гарантирует, что вы всегда можете посмотреть на компонент и узнать, где могут «скрываться» его состояние, эффекты и другие функции React. Например, если вы видите вызов функции `getColor()` внутри вашего компонента, вы можете быть уверены, что она никак не может содержать состояние React, потому что ее имя не начинается с `use`. Однако вызов функции, такой как `useOnlineStatus()`, скорее всего, будет содержать вызовы других хуков внутри!

<Note>

Если ваш линтер [настроен для React,](/learn/editor-setup#linting) он будет применять это соглашение об именах. Прокрутите вверх к песочнице выше и переименуйте `useOnlineStatus` в `getOnlineStatus`. Обратите внимание, что линтер больше не позволит вам вызывать `useState` или `useEffect` внутри него. Только хуки и компоненты могут вызывать другие хуки!

</Note>

<DeepDive>

#### Должны ли все функции, вызываемые во время рендеринга, начинаться с префикса use? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Нет. Функции, которые не *вызывают* хуки, не должны *быть* хуками.

Если ваша функция не вызывает никаких хуков, избегайте префикса `use`. Вместо этого напишите ее как обычную функцию *без* префикса `use`. Например, `useSorted` ниже не вызывает хуки, поэтому вместо этого вызовите ее `getSorted`:

```js
// 🔴 Избегайте: хук, который не использует хуки
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Хорошо: обычная функция, которая не использует хуки
function getSorted(items) {
  return items.slice().sort();
}
```

Это гарантирует, что ваш код может вызывать эту обычную функцию в любом месте, включая условия:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ Можно условно вызывать getSorted(), потому что это не хук
    displayedItems = getSorted(items);
  }
  // ...
}
```

Вы должны дать префикс `use` функции (и, таким образом, сделать ее хуком), если она использует хотя бы один хук внутри себя:

```js
// ✅ Хорошо: хук, который использует другие хуки
function useAuth() {
  return useContext(Auth);
}
```

Технически, это не применяется React. В принципе, вы можете сделать хук, который не вызывает другие хуки. Это часто сбивает с толку и ограничивает, поэтому лучше избегать этого шаблона. Однако могут быть редкие случаи, когда это полезно. Например, возможно, ваша функция сейчас не использует никаких хуков, но вы планируете добавить в нее какие-то вызовы хуков в будущем. Тогда имеет смысл назвать ее с префиксом `use`:

```js {3-4}
// ✅ Хорошо: хук, который, вероятно, будет использовать какие-то другие хуки позже
function useAuth() {
  // TODO: Замените этой строкой, когда будет реализована аутентификация:
  // return useContext(Auth);
  return TEST_USER;
}
```

Тогда компоненты не смогут вызывать его условно. Это станет важным, когда вы на самом деле добавите вызовы хуков внутрь. Если вы не планируете использовать хуки внутри (сейчас или позже), не делайте его хуком.

</DeepDive>

### Пользовательские хуки позволяют совместно использовать логику с состоянием, а не само состояние {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

В предыдущем примере, когда вы включали и выключали сеть, оба компонента обновлялись вместе. Однако неправильно думать, что между ними совместно используется одна переменная состояния `isOnline`. Посмотрите на этот код:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Он работает так же, как и до того, как вы извлекли дублирование:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Это две совершенно независимые переменные состояния и эффекты! Они оказались одного и того же значения в одно и то же время, потому что вы синхронизировали их с одним и тем же внешним значением (находится ли сеть в сети).

Чтобы лучше проиллюстрировать это, нам понадобится другой пример. Рассмотрим этот компонент `Form`:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Существует некоторая повторяющаяся логика для каждого поля формы:

1.  Существует часть состояния (`firstName` и `lastName`).
2.  Существует обработчик изменений (`handleFirstNameChange` и `handleLastNameChange`).
3.  Существует часть JSX, которая указывает атрибуты `value` и `onChange` для этого ввода.

Вы можете извлечь повторяющуюся логику в этот пользовательский хук `useFormInput`:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Обратите внимание, что он объявляет только *одну* переменную состояния с именем `value`.

Однако компонент `Form` вызывает `useFormInput` *дважды:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

Вот почему это работает как объявление двух отдельных переменных состояния!

**Пользовательские хуки позволяют совместно использовать *логику с состоянием*, но не *само состояние*. Каждый вызов хука полностью независим от каждого другого вызова того же хука.** Вот почему две песочницы выше полностью эквивалентны. Если хотите, прокрутитесь назад и сравните их. Поведение до и после извлечения пользовательского хука идентично.

Когда вам нужно совместно использовать само состояние между несколькими компонентами, [поднимите его и передайте вниз](/learn/sharing-state-between-components) вместо этого.

## Передача реактивных значений между хуками {/*passing-reactive-values-between-hooks*/}

Код внутри ваших пользовательских хуков будет перезапускаться во время каждого повторного рендеринга вашего компонента. Вот почему, как и компоненты, пользовательские хуки [должны быть чистыми.](/learn/keeping-components-pure) Думайте о коде пользовательских хуков как о части тела вашего компонента!

Поскольку пользовательские хуки перерисовываются вместе с вашим компонентом, они всегда получают последние пропсы и состояние. Чтобы увидеть, что это значит, рассмотрим этот пример чат-комнаты. Измените URL-адрес сервера или чат-комнату:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Когда вы изменяете `serverUrl` или `roomId`, эффект ["реагирует" на ваши изменения](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) и повторно синхронизируется. Вы можете сказать по сообщениям в консоли, что чат переподключается каждый раз, когда вы изменяете зависимости вашего эффекта.

Теперь переместите код эффекта в пользовательский хук:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Это позволяет вашему компоненту `ChatRoom` вызывать ваш пользовательский хук, не беспокоясь о том, как он работает внутри:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

Это выглядит намного проще! (Но делает то же самое.)

Обратите внимание, что логика *по-прежнему реагирует* на изменения пропсов и состояния. Попробуйте отредактировать URL-адрес сервера или выбранную комнату:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Обратите внимание, как вы берете возвращаемое значение одного хука:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

и передаете его в качестве входных данных другому хуку:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Каждый раз, когда ваш компонент `ChatRoom` перерисовывается, он передает последние `roomId` и `serverUrl` вашему хуку. Вот почему ваш эффект переподключается к чату всякий раз, когда их значения отличаются после перерисовки. (Если вы когда-либо работали с программным обеспечением для обработки аудио или видео, объединение хуков подобным образом может напомнить вам о цепочке визуальных или звуковых эффектов. Как будто выход `useState` «поступает» во вход `useChatRoom`.)

### Передача обработчиков событий в пользовательские хуки {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

В этом разделе описывается **экспериментальный API, который еще не был выпущен** в стабильной версии React.

</Wip>

Когда вы начнете использовать `useChatRoom` в большем количестве компонентов, вы можете захотеть, чтобы компоненты настраивали его поведение. Например, в настоящее время логика того, что делать при поступлении сообщения, жестко закодирована внутри хука:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Допустим, вы хотите переместить эту логику обратно в свой компонент:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

Чтобы это работало, измените свой пользовательский хук, чтобы он принимал `onReceiveMessage` в качестве одного из его именованных параметров:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
}
```

Это будет работать, но есть еще одно улучшение, которое вы можете сделать, когда ваш пользовательский хук принимает обработчики событий.

Добавление зависимости от `onReceiveMessage` не идеально, потому что это приведет к повторному подключению чата каждый раз, когда компонент перерисовывается. [Оберните этот обработчик событий в Effect Event, чтобы удалить его из зависимостей:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
}
```

Теперь чат не будет переподключаться каждый раз, когда компонент `ChatRoom` перерисовывается. Вот полностью рабочий пример передачи обработчика событий в пользовательский хук, с которым вы можете поиграть:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);