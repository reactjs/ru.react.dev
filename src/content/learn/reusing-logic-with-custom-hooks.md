---
title: 'Повторное использование логики с помощью пользовательских хуков'
---

<Intro>

React предоставляет встроенные хуки, такие как `useState`, `useContext`, и `useEffect`. Иногда могут понадобиться хуки, решающие более частные задачи: получать данные, отслеживать, подключён ли пользователь к сети, или устанавливать соединение с чатом. Встроенных решений для этого в React нет, но вы всегда можете написать собственные хуки под задачи вашего приложения.

</Intro>

<YouWillLearn>

- Что такое пользовательские хуки, и как их создавать
- Как повторно использовать логику между компонентами
- Как выбрать имя и структуру пользовательских хуков
- Когда и зачем выносить логику в пользовательские хуки

</YouWillLearn>

## Пользовательские хуки: Повторное использование логики между компонентами {/*custom-hooks-sharing-logic-between-components*/}

Представьте, что вы разрабатываете приложение, тесно связанное с использованием сети (как большинство приложений). Вы хотите предупредить пользователя, что сетевое соединение было случайно разорвано во время использования приложения. Как вы это сделаете? Скорее всего, вам нужны две вещи в компоненте:

1. Состояние, обозначающее, подключен ли пользователь к сети.
2. Эффект, который подписывается на глобальные события [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) и [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event), и обновляет это состояние.

Так компонент будет [синхронизирован](/learn/synchronizing-with-effects) с текущим состоянием сети. Вы можете начать с чего-то подобного:

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

  return <h1>{isOnline ? '✅ В сети' : '❌ Не в сети'}</h1>;
}
```

</Sandpack>

Попробуйте отключить сеть, и вы увидите, как `StatusBar` обновляется в ответ.

Теперь представьте, что вы хотите использовать эту логику *ещё* в одном компоненте. Вы хотите добавить кнопку "Сохранить", которая станет неактивной при отсутствии подключения к сети и будет отображать надпись "Подключение..." вместо "Сохранить".

Мы можем просто скопировать состояние `isOnline` и эффект в `SaveButton`:

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
    console.log('✅ Сохранено!');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Сохранить' : 'Подключение...'}
    </button>
  );
}
```

</Sandpack>

Попробуйте отключить сеть — кнопка должна изменить своё состояние.

Оба компонента работают корректно, но повторение одного и того же кода в нескольких местах — не лучшая практика.
Даже если компоненты выглядят по-разному, общая логика может быть вынесена в одно место.

### Извлекаем пользовательский хук из компонента {/*extracting-your-own-custom-hook-from-a-component*/}

Представьте, что в React, кроме [`useState`](/reference/react/useState) и [`useEffect`](/reference/react/useEffect), есть встроенный хук `useOnlineStatus`. Тогда мы могли бы использовать его в обоих компонентах и убрать повторяющийся код:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ В сети' : '❌ Не в сети'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Сохранено!');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Сохранить' : 'Подключение...'}
    </button>
  );
}
```

Пусть такого хука и нет в React, ничто не мешает нам написать его самостоятельно. Создайте функцию `useOnlineStatus` и перенесите туда повторяющийся код из компонентов:

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

В конце функции верните `isOnline` — это значение будет доступно компонентам.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ В сети' : '❌ Не в сети'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Сохранено!');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Сохранить' : 'Подключение...'}
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

Проверьте, что при отключении сети обновляются **оба** компонента.

Отлично! Теперь в компонентах стало меньше дублирующегося кода. **Более того, теперь их код описывает *что они делают* (используют состояние сети!), а не *как именно они это делают* (подпиской на события браузера).**

При извлечении логики в пользовательские хуки, вы прячете ненужные для компонента глубокие детали взаимодействия с браузерными API или внешними сервисами. Код компонента отражает само намерение, а не способ его реализации.

### Имя хуков должны начинаться с `use` {/*hook-names-always-start-with-use*/}

Приложения React состоят из компонентов. Компоненты создаются с помощью хуков, встроенных или пользовательских. Наверное, вы часто используете хуки, написанные другими, но, возможно, вы захотите написать собственный?

Для этого нужно соблюдать соглашения имён:

1. **Имя React компонента должно начинаться с заглавной буквы,** вроде `StatusBar` или `SaveButton`. React компонент должен вернуть что либо, что React сможет отобразить, например JSX элемент.
2. **Имя хуков должно начинаться с `use` после которго следует заглавная буква,** вроде [`useState`](/reference/react/useState) (встроенный хук) или `useOnlineStatus` (пользовательский, как мы делали выше). Хуки могут возвращать любые значения.

Это соглашение помогает сразу увидеть, где в компоненте используются состояние, эффекты и другие функции React. Когда вы видите функцию`getColor()` в вашем компоненте, вы можете быть уверены, что она не использует функции React, вроде `useState`, так как имя функции не начинается с `use`. А вот вызов функции `useOnlineStatus()` скорее всего будет использовать хуки или другие функции React.

<Note>

Если ваш линтер [настроен для React,](/learn/editor-setup#linting), он будет применять эти правила к именам. Поднимитесь выше и переименуйте `useOnlineStatus` в `getOnlineStatus`. Теперь линтер не даст использовать `useState` или `useEffect` внутри этой функции. Только хуки и компоненты имеют право вызывать другие хуки!

</Note>

<DeepDive>

#### Все функции, используемые при рендере должны начинаться с use? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Нет. Функции, которые не *используют* хуки не должны *быть* хуками.

Если ваша функция не использует хуки, не используйте приставку `use`. Сделайте её обычной функцией *без* приставки `use`. Например, функция `useSorted` в примере ниже не использует хуки, так что её стоит переменовать в `getSorted`:

```js
// 🔴 Нельзя: Хук, не использующий другие хуки
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Отлично: Обычная функция, не использующая хуки
function getSorted(items) {
  return items.slice().sort();
}
```

Это гарантирует, что React сможет вызывать её, в том числе внутри if:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ Мы можем вызвать getSorted внутри if, потому что это обычная функция.
    displayedItems = getSorted(items);
  }
  // ...
}
```

Нужно добавлять приставку `use` к функции (тем самым превращая её в хук) если она содержит в себе хотя бы один хук:

```js
// ✅ Хорошо: Хук, использующий другие хуки
function useAuth() {
  return useContext(Auth);
}
```

Вы даже можете сделать хук, который не использует другие хуки. Технически, React не ограничивает вас в этом. Но такой подход сбивает с толку, поэтому советуем избегать его, кроме редких случаев, где это может принести пользу. Например, если прямо сейчас ваша функция не использует хуки, но в будущем вы собираетесь добавить их. Тогда есть смысл использовать приставку `use`:

```js {3-4}
// ✅ Хорошо: Хук, не использующий другие хуки, но собирающийся использовать их в будущем
function useAuth() {
  // TODO: заменить строку ниже после реализации аутентификации
  // return useContext(Auth);
  return TEST_USER;
}
```

В таком случае компоненты не смогут вызывать его внутри блока `if`. Это станет важным, когда вы добавите вызовы хуков. Если вы не планируете добавлять вызовы хуков — не делайте вашу функцию хуком.

</DeepDive>

### Пользовательские хуки позволяют повторно использовать логику состояния, но не само состояние {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Ранее, когда мы меняли состояние сети, оба компонента обновлялись одновременно. Но неправильно думать, что между ними используется одна и та же переменная состояния isOnline. Обратите внимание на код ниже:

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

Это работает как и раньше, до вынесения повторяющегося кода

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

Это две совершенно независимые переменные состояния и эффекта! И они имеют одинаковое значение, только потому, что мы привязали их к внешнему значению (есть ли подключение к интернету).

Чтобы лучше понять, нам нужен другой пример. Рассмотрим компонент `Form`:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Владимир');
  const [lastName, setLastName] = useState('Маяковский');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        Имя:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Фамилия:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Доброе утро, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Здесь мы имеем повторяющуюся логику для каждого поля ввода:

1. Часть состояния (`firstName` and `lastName`).
1. Функции для изменения состояния (`handleFirstNameChange` and `handleLastNameChange`).
1. А также JSX, определяющий атрибуты `value` и `onChange`.

Можно извлечь повторяющуюся логику в пользовательский хук `useFormInput`:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Владимир');
  const lastNameProps = useFormInput('Маяковский');

  return (
    <>
      <label>
        Имя:
        <input {...firstNameProps} />
      </label>
      <label>
        Фамилия:
        <input {...lastNameProps} />
      </label>
      <p><b>Доброе утро, {firstNameProps.value} {lastNameProps.value}.</b></p>
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

Обратите внимание: переменная состояния `value` здесь только  *одна*.

Однако, компонент `Form` вызывает `useFormInput` *дважды*

```js
function Form() {
  const firstNameProps = useFormInput('Владимир');
  const lastNameProps = useFormInput('Маяковский');
  // ...
```

Вот почему это работает как объявление двух отдельных переменных состояния!

**Пользовательские хуки позволяют поделиться *логикой состояния* но не *самим состоянием.* Каждый вызов хука абсолютно независим от других вызовов этого же хука.** Вот почему примеры выше полностью одинаково работают. Если хотите, можете подняться выше, и проверить это. Поведение и результат до и после извлечения пользовательского хука одинаковы.

Если вы хотите поделиться именно переменной состояния между компонентами, используйте [поднятие состояния и её передачу вниз](/learn/sharing-state-between-components).

## Передача реактивных значений между хуками {/*passing-reactive-values-between-hooks*/}

Код пользовательского хука выполняется заново при каждом рендере компонента. Поэтому, как и компоненты, ваши хуки [должны быть чистыми функциями.](/learn/keeping-components-pure). Лучше воспринимать их как часть компонента, а не как отдельные функции.

Поскольку хуки повторно рендерятся вместе с компонентом, они всегда получают актуальные пропсы и состояние. Чтобы убедиться в этом, посмотрите на пример чат-комнаты ниже. Измените URL сервера или комнату в чате:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('Прочее');
  return (
    <>
      <label>
        Выберите чат-комнату:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">Прочее</option>
          <option value="travel">Путешествия</option>
          <option value="music">Музыка</option>
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
      showNotification('Новое сообщение: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
          URL сервера:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Добро пожаловать в комнату {roomId}!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Настоящая реализация с подключением к серверу
  if (typeof serverUrl !== 'string') {
    throw Error('Ожидаемый serverUrl должен быть строкой! Получено: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Ожидаемый roomId должен быть строкой! Получено: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Подключение к комнате "' + roomId + '" по адресу ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('Привет!')
          } else {
            messageCallback('Как дела?')
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Отключение от комнаты "' + roomId + '" по адресу ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Невозможно дважды навесить слушатель события.');
      }
      if (event !== 'message') {
        throw Error('Поддерживается только тип события "message".');
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

Когда вы изменяете `serverUrl` или `roomId`, эффект ["реагирует" на эти изменения](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) и заново синхронизируется. Вы можете выводить в консоль сообщения о повторном присоединении к чату при изменении зависимостей вашего эффекта.

Вынесем код эффекта в пользовательский хук:

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
      showNotification('Новое сообщение: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Это позволяет компоненту `ChatRoom` использовать хук, не вникая в его внутреннюю реализацию:

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
        URL сервера:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Добро пожаловать в комнату {roomId}!</h1>
    </>
  );
}
```

Теперь это выглядит куда проще! (Пускай и работает точно так же.)

Заметьте, что логика *всё ещё реагирует* на изменения пропсов и состояния. Попробуйте изменить URL сервера или выбранную комнату:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('Прочее');
  return (
    <>
      <label>
        Выберите комнату чата: {' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">Прочее</option>
          <option value="travel">Путешествия</option>
          <option value="music">Музыка</option>
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
          URL сервера:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Добро пожаловать в комнату {roomId}!</h1>
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
      showNotification('Новое сообщение: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
    // Настоящая реализация с подключением к серверу
  if (typeof serverUrl !== 'string') {
    throw Error('Ожидаемый serverUrl должен быть строкой! Получено: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Ожидаемый roomId должен быть строкой! Получено: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Подключение к комнате "' + roomId + '" по адресу ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('Привет!')
          } else {
            messageCallback('Как дела?');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Отключение от комнаты "' + roomId + '" по адресу ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Невозможно дважды навесить слушатель события.');
      }
      if (event !== 'message') {
        throw Error('Поддерживается только тип события "message".');
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

Обратите внимание, как мы берём возвращаемое значение из одного хука:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

И передаём их как параметры другому хуку:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

При повторном рендере компонента `ChatRoom`, он передаёт актуальные `roomId` и `serverUrl` вашему хуку. Вот почему эффект снова подключается к чату даже если значения меняются после повторного рендера. (Если вы когда-либо работали с программами для обработки видео или звука, цепочки хуков вроде этой могут напомнить вам цепочки аудио или визуальных эффектов. Это похоже на то, что выходные параметры `useState` "скармливаются" на вход `useChatRoom`.)

### Передача слушателей событий пользовательским хукам {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

Этот раздел описывает **экспериментальные API, которые не были выпущены** в стабильной версии React.

</Wip>

Когда вы начнёте использовать `useChatRoom` в большем количестве компонентов, вы, возможно, захотите изменять их поведение. Например, сейчас логика того, что происходит после получения нового сообщения, зафиксирована в коде внутри хука:

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
      showNotification('Новое сообщение: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Допустим, вы хотите перенести эту логику обратно в компонент:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Новое сообщение:' + msg);
    }
  });
  // ...
```

Чтобы это работало, измените добавьте `onReceiveMessage` во входные параметры:

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
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ Все зависимости указаны
}
```

Это будет работать, однако есть ещё одно улучшение, которое можно сделать для того, чтобы ваш хук принимал на вход обработчики событий.

Если добавить onReceiveMessage в зависимости, хук будет переподключать чат при каждом рендере — это неэффективно. [Оберните этот обработчик события в События эффектов, чтобы убрать его из списка зависимостей:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

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
  }, [roomId, serverUrl]); // ✅ Все зависимости указаны
}
```

Теперь подключение к чату не будет происходить заново при каждом рендере ChatRoom. Ниже представлен полностью рабочий пример передачи обработчика события пользовательскому хуку. Попробуйте его!

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
          Выберите чат-комнату:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
            <option value="general">Прочее</option>
            <option value="travel">Путешествия</option>
            <option value="music">Музыка</option>
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
      showNotification('Новое сообщение: ' + msg);
    }
  });

  return (
    <>
      <label>
          URL сервера:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Добро пожаловать в комнату {roomId}!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

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
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
    // Настоящая реализация с подключением к серверу
    if (typeof serverUrl !== 'string') {
        throw Error('Ожидаемый serverUrl должен быть строкой! Получено: ' + serverUrl);
    }
    if (typeof roomId !== 'string') {
        throw Error('Ожидаемый roomId должен быть строкой! Получено: ' + roomId);
    }
  let intervalId;
  let messageCallback;
  return {
    connect() {
        console.log('✅ Подключение к комнате "' + roomId + '" по адресу ' + serverUrl + '...');
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (messageCallback) {
                if (Math.random() > 0.5) {
                    messageCallback('Привет!')
                } else {
                    messageCallback('Как дела?')
                }
            }
        }, 3000);
    },
      disconnect() {
          clearInterval(intervalId);
          messageCallback = null;
          console.log('❌ Отключение от комнаты "' + roomId + '" по адресу ' + serverUrl + '');
      },
      on(event, callback) {
          if (messageCallback) {
              throw Error('Невозможно дважды навесить слушатель события.');
          }
          if (event !== 'message') {
              throw Error('Поддерживается только тип события "message".');
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Обратите внимание: теперь вам не нужно знать, *как* работает `useChatRoom`, чтобы его использовать. Его можно использовать в любом компоненте: передайте параметры — и он будет вести себя так же, как раньше. В этом и заключается сила пользовательских хуков.

## Когда использовать пользовательские хуки {/*when-to-use-custom-hooks*/}

Не стоит создавать пользовательские хуки для каждого небольшого кусочка повторяющейся логики. Небольшое повторение кода — не проблема. Например, вынос хука `useFormInput` для создания обёртки над одним вызовом `useState`, как в примере выше, может быть излишним.

Везде и всегда, создавая эффекты, создавайте их более чистыми для дальнейшего оборачивания в пользовательские хуки. [Не используйте эффекты слишком часто,](/learn/you-might-not-need-an-effect) но если вы создаёте эффект, это значит, что вам нужно "выйти за пределы React" чтобы синхронизироваться с какой-либо сторонней системой или сделать что-то, что React не пользоваляет сделать с помощью встроенных API. Оборачивание в пользовательский хук помогает точнее выразить намерения компонента и связь данных с этими намерениями.

Для примера возьмём компонент `ShippingForm`, который использует два выпадающих списка: в одном список городов, в другом список районов внутри города. Для начала хватит кода ниже:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // Эффект, запрашивающий список городов
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // Эффект, запрашивающий список районов в городе
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Пускай здесь есть небольшое повторение кода, [правильно разделять эффекты друг от друга.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Они синхронизированы с двумя разными сущностями, так что не стоит объединять их в один эффект. Вместо этого, можно упростить `ShippingForm`, вынеся общую логику в пользовательский хук `useData`:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Теперь оба эффекта в `ShippingForm` можно заменить вызовами хука `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Вынос пользовательской логики в хук делает поток данных более явным. Вы передаёте `url` — и получаете `data`. "Скрывая" эффект внутри хука `useData`, вы также защищаете компонент `ShippingForm` от добавления [ненужных зависимостей](/learn/removing-effect-dependencies) внутрь него. Чем дольше развивается проект, тем больше эффектов вашего приложения будут вынесены в пользовательские хуки.

<DeepDive>

#### Пользовательские хуки должны выполнять конкретные, высокоуровневые задачи {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Начните с выбора названия вашего хука. Если вам сложно выбрать подходящее имя, это может сигнализировать о том, что ваш эффект слишком связан с остальной логикой компонента и пока не готов быть вынесенным.

В идеале, имя вашего хука должно быть понятно даже человеку с небольшим опытом программирования, что он принимает, что он делает, и что возвращает:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Если вы используете стороннюю систему, вы можете использовать технический жаргон, применимый к этой системе. Это сразу даст понять о чём идёт речь тем, кто знаком с этой системой:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Пользовательские хуки должны выполнять конкретные, высокоуровневые задачи** Избегайте создания и использования пользовательских хуков "жизненного цикла", которые пытаются переопределить логику работы API `useEffect`:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Например, хук `useMount` ниже пытается вызвать код "только при монтировании":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Избегайте: использования пользовательских хуков "жизненного цикла"
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Избегайте: создания пользовательских хуков "жизненного цикла"
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**Пользовательские хуки "жизненного цикла" вроде `useMount` не встраиваются в парадигму React.** Этот код содержит ошибку (не реагирует на изменения `roomId` или `serverUrl`), но линтер не среагирует на это, так как проверяет только прямые вызовы `useEffect`. Он не будет знать про ваш хук.

Если вы пишете эффект — используйте React API напрямую:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Хорошо: два разных эффекта, разделённых по назначению

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Далее, вы можете (но не должны) извлечь два пользовательских хука для высокоуровневого взаимодействия:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Супер: названия пользовательских хуков отражают их назначение
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Хорошие пользовательские хуки вызывают код более декларативно и сковывают его в действиях.** К примеру, `useChatRoom(options)` сможет только присоединиться к чат-комнате `useImpressionLog(eventName, extraData)` сможет только отправить логи. Если API вашего пользовательского хука слишком абстрактен и не ограничивает использование, он может создать больше проблем, чем решить.

</DeepDive>

### Пользовательские хуки помогают улучшить подходы к написанию кода {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Эффекты — это ["лазейка"](/learn/escape-hatches): вы используете их только для того, чтобы "выйти за пределы React" и когда нет более хорошего встроенного средства для решения вашей проблемы. В дальнейшем, целью команды React будет сокращение количества эффектов, которые вы будете использовать в приложении, путём предоставления более узконаправленных инструментов для решения более узконаправленных проблем. Оборачивание эффектов в пользовательские хуки поможет легче адаптироваться к будущим изменениям в React.

Давайте вернёмся к нашему примеру:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ В сети' : '❌ Не в сети'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Сохранено');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Сохранить' : 'Подключение...'}
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

```js src/useOnlineStatus.js active
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

В примере выше, `useOnlineStatus` был создан с помощью пары [`useState`](/reference/react/useState) и [`useEffect`.](/reference/react/useEffect) На деле это не самое надёжное решение: оно не учитывает некоторые пограничные случаи. Оно предполагает, что `isOnline` уже `true`, но это может не сработать, если пользователь изначально не в сети. Можно использовать браузерное API [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) для проверки, но прямое использование не позволит серверу отрендерить начальную HTML-разметку. Вкратце, мы можем улучшить этот код.

Как раз для нашего случая, в React 18 был представлен хук [`useSyncExternalStore`](/reference/react/useSyncExternalStore) который берёт на себя ответственность за решение этих проблем за вас. Вот как хук `useOnlineStatus`, может быть переписан, используя новый API:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ В сети' : '❌ Не в сети'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Сохранено');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Сохранить' : 'Подключение...'}
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

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // Как получить значение на клиенте
    () => true // Как получить значение на сервере
  );
}

```

</Sandpack>

Заметьте, как вам **не нужно менять свой компонент** чтобы мигрировать на новое API:

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

Есть дополнительные выигрыши при оборачивании эффектов в пользовательские хуки:

1. Вы делаете поток данных от и к вашему компоненту наиболее явным.
2. Центром логики вашего компонента становится его намерение, и они не перегружаются логикой имплементации эффектов.
3. При добавлении новых функций в React, вам не придётся изменять код компонентов.

Также, как и в [дизайн системах,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) может быть полезно начать извлекать часто встречающиеся идиомы в пользовательские хуки. Это позволит компонентам сфокусироваться на намерениях, и позволит реже использовать эффекты. Множество замечательных пользовательских хуков создаются и поддерживаются сообществом React.

<DeepDive>

#### Будет ли React предоставлять встроенное решение для загрузки данных? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Мы продолжаем рассуждать над деталями, и мы ожидаем, что в будущем вы будете загружать данные примерно так:

```js {1,4,6}
import { use } from 'react'; // Ещё не доступно!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```
Если ваши пользовательские хуки похожи на `useData`, в будущем они потребуют небольших изменений для миграции на окончательно одобренный подход загрузки данных вместо создания эффектов в каждом компоненте вручную. Классический подход с эффектами по-прежнему актуален, и вы можете спокойно продолжать его использовать.

</DeepDive>

### Есть больше одного способа реализации {/*there-is-more-than-one-way-to-do-it*/}

Допустим, вы хотите создать анимацию появления с помощью браузерного API [`requestAnimationFrame`](https://developer.mozilla.org/ru/docs/Web/API/Window/requestAnimationFrame). Можно начать с эффекта, создающего зацикленную анимацию. Во время каждого кадра, вы можете изменять прозрачность DOM-элемента, который [передан в ref](/learn/manipulating-the-dom-with-refs), пока прозрачность не станет равна `1`. Начнём:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Запрашиваем новый кадр
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Удалить' : 'Показать'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Чтобы сделать код более читаемым, можно извлечь логику в пользовательский хук `useFadeIn`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Привет!
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Удалить' : 'Показать'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Запрашиваем новый кадр
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Можно оставить код `useFadeIn` как есть, но вы можете ещё доработать его. Можно вынести код инициализации анимации из `useFadeIn` в другой пользовательский хук `useAnimationLoop`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Привет!
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

Однако совсем не обязательно было делать именно так. Как и в случае с обычными функциями, только вам решать, где проводить границы между частями вашего кода. Можно было бы подойти к задаче совершенно иначе: вместо того чтобы оставлять логику внутри эффекта, вы могли бы перенести основную императивную логику в [классы:](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Привет!
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Удалить' : 'Показать'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // Запрашиваем новый кадр
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Эффекты позволяют связывать React с внешними системами. Чем больше необходимо связи между эффектами (может, чтобы делать цепочку анимаций), тем больше смысла *полностью* вынести логику в пользовательские хуки, как в примерах выше. После этого вынесенный код *становится* "внешней системой". Это позволяет эффектам оставаться простыми и читаемыми, поскольку теперь они занимаются только общением с той самой "внешней системой".

Пример выше предполагает, что анимация будет написана на Javascript. Однако простые анимации вроде появления или исчезания легче делать с помощью [CSS анимаций:](https://developer.mozilla.org/ru/docs/Web/CSS/CSS_animations/Using_CSS_animations)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Привет!
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Удалить' : 'Показать'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Иногда хуки вообще не нужны!

<Recap>

- Пользовательские хуки позволяют делиться логикой между компонентами.
- Имена пользовательских хуков должны начинаться с `use`, после которого следует заглавная буква.
- Пользовательские хуки позволяют делиться логикой состояния, но не самим состоянием.
- Вы можете передавать реактивные значения между хуками, и эти значения будут оставаться актуальными.
- Все хуки выполняются заново при каждом рендере компонента, использующего их.
- Код внутри хуков должен быть чистым, как и код компонентов.
- Обработчики событий, полученные от пользовательских хуков, нужно оборачивать в События эффектов.
- Не создавайте и не используйте хуки вроде `useMount`. Ваши хуки должны выполнять конкретные задачи.
- Где провести границы между частями кода — решаете вы.

</Recap>

<Challenges>

#### Вынесите логику в хук `useCounter` {/*extract-a-usecounter-hook*/}

Компонент использует состояние и эффект, чтобы отображать счётчик, увеличивающийся каждую секунду.
Вынесите эту логику в хук `useCounter`. Ваша задача — чтобы компонент `Counter` выглядел именно так:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Секунд прошло: {count}</h1>;
}
```

Вынесите логику в файл `useCounter.js` и подключите его в `App.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Секунд прошло: {count}</h1>;
}
```

```js src/useCounter.js
// Пишите ваш хук прямо здесь!
```

</Sandpack>

<Solution>

Ваш код должен выглядеть примерно так:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Секунд прошло: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Обратите внимание, что `App.js` больше не должен импортировать `useState` или `useEffect`.

</Solution>

#### Сделайте настраиваемый интервал счётчика {/*make-the-counter-delay-configurable*/}

В этой задаче есть переменная состояния `delay`, управляемая ползунком, но она пока никак не используется. Передайте `delay` в хук `useCounter`, и измените `useCounter` так, чтобы он использовал `delay` вместо фиксированных в коде `1000` мс.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Интервал: {delay} мс
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Срабатываний: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Передавайте `delay` вашему хуку: `useCounter(delay)`. Затем, внутри хука, используйте `delay` вместо фиксированных `1000` миллисекунд. Не забудьте добавить `delay` в список зависимостей эффекта. Это будет гарантировать, что изменение `delay` сбросит счётчик.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
          Интервал: : {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Срабатываний: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Вынесите `useInterval` из `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Сейчас хук `useCounter` делает сразу две вещи: устанавливает интервал и увеличивает значение счётчика при каждом его срабатывании. Попробуйте вынести логику установки интервала в пользовательский хук `useInterval`. Он должен принимать два аргумента: колбэк `onTick` и `delay` (задержку между срабатываниями). После этого ваш `useCounter` должен выглядеть так:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Напишите `useInterval` в файле `useInterval.js` и импортируйте его в `useCounter.js`.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Секунд прошло: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Пишите ваш хук прямо здесь!
```

</Sandpack>

<Solution>

Логика внутри `useInterval` должна устанавливать и сбрасывать интервальный таймер. И ничего более.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Секунд прошло: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Однако в этом коде есть одна небольшая проблема — мы разберёмся с ней в следующей задаче.

</Solution>

#### Почините сброс интервального таймера {/*fix-a-resetting-interval*/}

В данном примере используются *два* отдельных интервала.

Компонент `App` вызывает `useCounter`, который вызывает `useInterval` для ежесекундного обновления счётчика. Но здесь компонент `App` *также* вызывает `useInterval` чтобы устанавливать случайный цвет фона страницы каждые две секунды.

По непонятной (пока что) причине, цвет фона не меняется, как ожидалось. Добавьте пару логов в `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Установка интервального таймера с интервалом ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Сброс интервального таймера с интервалом ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Отражают ли эти логи то, что вы ожидали? Если вам кажется, что некоторые Эффекты повторно обновляются без надобности, можно ли найти ту зависимость, что вызывает это? Есть ли способ [удалить эту зависимость](/learn/removing-effect-dependencies) из вашего эффекта?

После исправления цвет фона должен начать меняться каждые две секунды.

<Hint>

Похоже, хук useInterval принимает обработчик события в качестве аргумента. Можете ли вы найти способ обернуть этот обработчик так, чтобы не приходилось указывать её в зависимостях эффекта?

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Секунд прошло: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Это позволит убрать `onTick` из массива зависимостей эффекта.  
Теперь эффект не будет перезапускаться при каждом рендере, поэтому интервал, меняющий цвет фона страницы, не будет сбрасываться каждую секунду — раньше, чем успеет сработать.

После этого оба интервала работают так, как и ожидалось, и не мешают друг другу:

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Секунд прошло: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Реализуйте ступенчатое движение {/*implement-a-staggering-movement*/}

В этом примере хук `usePointerPosition()` отслеживает текущую позицию курсора.  
Попробуйте переместить курсор мыши или палец — вы увидите, как красная точка следует за вашим движением. Координаты сохраняются в переменной `pos1`.

На самом деле отрисовывается пять (!) красных точек. Сейчас вы их не видите, потому что все они рисуются в одной и той же позиции — это и предстоит исправить.

Ваша задача — реализовать "ступенчатое" движение: каждая точка должна повторять путь предыдущей с небольшой задержкой. Например, если вы быстро переместите курсор, первая точка будет следовать за ним сразу, вторая — за первой, третья — за второй и так далее.

Для этого нужно реализовать пользовательский хук `useDelayedValue`. Сейчас он просто возвращает `value`. Вместо этого хук должен возвращать значение, которым `value` было `delay` миллисекунд назад. Для этого понадобятся `useState` и `useEffect`.

После реализации `useDelayedValue` вы увидите, как точки движутся одна за другой.

<Hint>

Хук должен хранить отложенное значение `delayedValue` в состоянии.
Когда `value` обновляется, запускайте `setTimeout`, который через `delay` обновит `delayedValue`.

Нужна ли этому эффекту функция очистки? Почему да или почему нет?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Реализуйте этот хук
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Хук хранит значение `delayedValue` в состоянии.
Когда `value` обновляется, эффект ставит `setTimeout`, который спустя задержку меняет `delayedValue`. Поэтому `delayedValue` всегда "отстаёт" от фактического значения.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

Обратите внимание, что этому эффекту *не нужна* очистка.  
Если бы вы вызывали `clearTimeout` в функции очистки, то при каждом изменении `value` таймаут сбрасывался бы. Чтобы движение оставалось плавным, все запланированные таймауты должны выполниться. Это тот редкий случай, когда отсутствие очистки — правильный выбор.

</Solution>

</Challenges>
