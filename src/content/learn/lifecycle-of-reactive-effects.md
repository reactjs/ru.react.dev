---
title: 'Жизненный цикл реактивных эффектов'
---
<Intro>

Эффекты имеют другой жизненный цикл по сравнению с компонентами. Компоненты могут монтироваться, обновляться или размонтироваться. Эффект может только выполнять две вещи: начать синхронизацию чего-либо и позже прекратить её. Этот цикл может повторяться несколько раз, если ваш Эффект зависит от пропсов и состояния, которые меняются со временем. React предоставляет правило линтера для проверки правильности указания зависимостей вашего Эффекта. Это гарантирует, что ваш Эффект синхронизирован с последними пропсами и состоянием.

</Intro>

<YouWillLearn>

- Чем жизненный цикл Эффекта отличается от жизненного цикла компонента
- Как рассматривать каждый отдельный Эффект в изоляции
- Когда ваш Эффект должен повторно синхронизироваться и почему
- Как определяются зависимости вашего Эффекта
- Что означает реактивность значения
- Что означает пустой массив зависимостей
- Как React проверяет правильность ваших зависимостей с помощью линтера
- Что делать, если вы не согласны с линтером

</YouWillLearn>

## Жизненный цикл Эффекта {/*the-lifecycle-of-an-effect*/}

Каждый компонент React проходит через один и тот же жизненный цикл:

- Компонент _монтируется_, когда он добавляется на экран.
- Компонент _обновляется_, когда он получает новые пропсы или состояние, обычно в ответ на взаимодействие.
- Компонент _размонтируется_, когда он удаляется с экрана.

**Это хороший способ думать о компонентах, но _не_ об Эффектах.** Вместо этого, старайтесь думать о каждом Эффекте независимо от жизненного цикла вашего компонента. Эффект описывает, как [синхронизировать внешнюю систему](/learn/synchronizing-with-effects) с текущими пропсами и состоянием. По мере изменения вашего кода, синхронизация будет требоваться чаще или реже.

Чтобы проиллюстрировать это, рассмотрим Эффект, который подключает ваш компонент к серверу чата:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Тело вашего Эффекта определяет, как **начать синхронизацию:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Функция очистки, возвращаемая вашим Эффектом, определяет, как **прекратить синхронизацию:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Интуитивно вы можете подумать, что React будет **начинать синхронизацию**, когда компонент монтируется, и **прекращать синхронизацию**, когда компонент размонтируется. Однако, это ещё не всё! Иногда может потребоваться **начать и прекратить синхронизацию несколько раз**, пока компонент остаётся смонтированным.

Давайте разберёмся, _почему_ это необходимо, _когда_ это происходит и _как_ вы можете контролировать это поведение.

<Note>

Некоторые Эффекты вообще не возвращают функцию очистки. [Чаще всего](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) вы захотите её вернуть — но если нет, React будет вести себя так, как будто вы вернули пустую функцию очистки.

</Note>

### Почему синхронизация может потребоваться более одного раза {/*why-synchronization-may-need-to-happen-more-than-once*/}

Представьте, что компонент `ChatRoom` получает пропс `roomId`, который пользователь выбирает из выпадающего списка. Допустим, изначально пользователь выбирает комнату `"general"` в качестве `roomId`. Ваше приложение отображает чат комнаты `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

После отображения UI, React запустит ваш Эффект для **начала синхронизации.** Он подключается к комнате `"general"`:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Подключается к комнате "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Отключается от комнаты "general"
    };
  }, [roomId]);
  // ...
```

Пока всё хорошо.

Позже пользователь выбирает другую комнату в выпадающем списке (например, `"travel"`). Сначала React обновит UI:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Подумайте, что должно произойти дальше. Пользователь видит, что `"travel"` — это выбранная комната чата в UI. Однако, Эффект, который был запущен в прошлый раз, всё ещё подключён к комнате `"general"`. **Пропс `roomId` изменился, поэтому то, что ваш Эффект сделал тогда (подключение к комнате `"general"`), больше не соответствует UI.**

В этот момент вы хотите, чтобы React сделал две вещи:

1. Прекратить синхронизацию с старым `roomId` (отключиться от комнаты `"general"`)
2. Начать синхронизацию с новым `roomId` (подключиться к комнате `"travel"`)

**К счастью, вы уже научили React делать обе эти вещи!** Тело вашего Эффекта определяет, как начать синхронизацию, а ваша функция очистки определяет, как её прекратить. Всё, что нужно сделать React — это вызвать их в правильном порядке и с правильными пропсами и состоянием. Давайте посмотрим, как именно это происходит.

### Как React повторно синхронизирует ваш Эффект {/*how-react-re-synchronizes-your-effect*/}

Вспомните, что ваш компонент `ChatRoom` получил новое значение для своего пропса `roomId`. Раньше это было `"general"`, а теперь `"travel"`. React должен повторно синхронизировать ваш Эффект, чтобы переподключить вас к другой комнате.

Чтобы **прекратить синхронизацию,** React вызовет функцию очистки, которую ваш Эффект вернул после подключения к комнате `"general"`. Поскольку `roomId` был `"general"`, функция очистки отключается от комнаты `"general"`:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Подключается к комнате "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Отключается от комнаты "general"
    };
    // ...
```

Затем React запустит Эффект, который вы предоставили во время этого рендера. На этот раз `roomId` будет `"travel"`, поэтому он **начнёт синхронизацию** с комнатой `"travel"` (до тех пор, пока его функция очистки не будет вызвана).

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Подключается к комнате "travel"
    connection.connect();
    // ...
```

Благодаря этому вы теперь подключены к той же комнате, которую выбрал пользователь в UI. Катастрофа предотвращена!

Каждый раз после повторного рендера вашего компонента с изменённым `roomId`, ваш Эффект будет повторно синхронизироваться. Например, скажем, пользователь меняет `roomId` с `"travel"` на `"music"`. React снова **прекратит синхронизацию** вашего Эффекта, вызвав его функцию очистки (отключив вас от комнаты `"travel"`). Затем он снова **начнёт синхронизацию**, запустив тело Эффекта с новым пропсом `roomId` (подключив вас к комнате `"music"`).

Наконец, когда пользователь переходит на другой экран, `ChatRoom` размонтируется. Теперь нет необходимости оставаться подключённым. React **прекратит синхронизацию** вашего Эффекта в последний раз и отключит вас от комнаты `"music"`.

### Мышление с точки зрения Эффекта {/*thinking-from-the-effects-perspective*/}

Подведём итог всему, что произошло с точки зрения компонента `ChatRoom`:

1. `ChatRoom` смонтировался с `roomId`, установленным в `"general"`
1. `ChatRoom` обновился с `roomId`, установленным в `"travel"`
1. `ChatRoom` обновился с `roomId`, установленным в `"music"`
1. `ChatRoom` размонтировался

В каждый из этих моментов жизненного цикла компонента ваш Эффект делал разные вещи:

1. Ваш Эффект подключился к комнате `"general"`
1. Ваш Эффект отключился от комнаты `"general"` и подключился к комнате `"travel"`
1. Ваш Эффект отключился от комнаты `"travel"` и подключился к комнате `"music"`
1. Ваш Эффект отключился от комнаты `"music"`

Теперь давайте подумаем о том, что произошло с точки зрения самого Эффекта:

```js
  useEffect(() => {
    // Ваш Эффект подключился к комнате, указанной в roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...до тех пор, пока не отключился
      connection.disconnect();
    };
  }, [roomId]);
```

Структура этого кода может вдохновить вас увидеть, что произошло, как последовательность непересекающихся временных периодов:

1. Ваш Эффект подключился к комнате `"general"` (до отключения)
1. Ваш Эффект подключился к комнате `"travel"` (до отключения)
1. Ваш Эффект подключился к комнате `"music"` (до отключения)

Раньше вы думали с точки зрения компонента. Когда вы смотрели с точки зрения компонента, было заманчиво думать об Эффектах как о "колбэках" или "событиях жизненного цикла", которые срабатывают в определённое время, например, "после рендера" или "перед размонтированием". Такой способ мышления очень быстро усложняется, поэтому его лучше избегать.

**Вместо этого, всегда фокусируйтесь на одном цикле запуска/остановки за раз. Не должно иметь значения, монтируется ли компонент, обновляется или размонтируется. Всё, что вам нужно сделать, это описать, как начать синхронизацию и как её прекратить. Если вы сделаете это хорошо, ваш Эффект будет устойчив к запуску и остановке столько раз, сколько потребуется.**

Это может напомнить вам, как вы не задумываетесь, монтируется или обновляется компонент, когда пишете логику рендеринга, создающую JSX. Вы описываете, что должно быть на экране, а React [сам всё выясняет.](/learn/reacting-to-input-with-state)

### Как React проверяет, что ваш Эффект может повторно синхронизироваться {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Вот живой пример, с которым вы можете поэкспериментировать. Нажмите "Open chat", чтобы смонтировать компонент `ChatRoom`:

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

Обратите внимание, что при первом монтировании компонента вы увидите три лога:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(только в режиме разработки)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(только в режиме разработки)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

Первые два лога — это только для режима разработки. В режиме разработки React всегда повторно монтирует каждый компонент один раз.

**React проверяет, что ваш Эффект может повторно синхронизироваться, заставляя его сделать это немедленно в режиме разработки.** Это может напомнить вам, как вы открываете и закрываете дверь лишний раз, чтобы проверить, работает ли замок. React запускает и останавливает ваш Эффект один раз дополнительно в режиме разработки, чтобы проверить, [хорошо ли вы реализовали его очистку.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Основная причина, по которой ваш Эффект будет повторно синхронизироваться на практике, заключается в изменении каких-либо данных, которые он использует. В песочнице выше измените выбранную комнату чата. Обратите внимание, как при изменении `roomId` ваш Эффект повторно синхронизируется.

Однако существуют и более редкие случаи, когда повторная синхронизация необходима. Например, попробуйте отредактировать `serverUrl` в песочнице выше, пока чат открыт. Обратите внимание, как Эффект повторно синхронизируется в ответ на ваши правки кода. В будущем React может добавить новые функции, которые полагаются на повторную синхронизацию.

### Как React узнаёт, что нужно повторно синхронизировать Эффект {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Вы можете задаться вопросом, как React узнал, что ваш Эффект нуждается в повторной синхронизации после изменения `roomId`. Это потому, что *вы сказали React*, что его код зависит от `roomId`, включив его в [список зависимостей:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // Пропс roomId может меняться со временем
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Этот Эффект читает roomId 
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Поэтому вы говорите React, что этот Эффект "зависит от" roomId
  // ...
```

Вот как это работает:

1. Вы знали, что `roomId` — это пропс, что означает, что он может меняться со временем.
2. Вы знали, что ваш Эффект читает `roomId` (следовательно, его логика зависит от значения, которое может измениться позже).
3. Вот почему вы указали его как зависимость вашего Эффекта (чтобы он повторно синхронизировался при изменении `roomId`).

Каждый раз после повторного рендера вашего компонента React будет смотреть на массив зависимостей, который вы передали. Если какое-либо из значений в массиве отличается от значения в том же месте, которое вы передали во время предыдущего рендера, React повторно синхронизирует ваш Эффект.

Например, если вы передали `["general"]` во время начального рендера, а позже передали `["travel"]` во время следующего рендера, React сравнит `"general"` и `"travel"`. Это разные значения (сравнение происходит с помощью [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), поэтому React повторно синхронизирует ваш Эффект. С другой стороны, если ваш компонент повторно рендерится, но `roomId` не изменился, ваш Эффект останется подключённым к той же комнате.

### Каждый Эффект представляет отдельный процесс синхронизации {/*each-effect-represents-a-separate-synchronization-process*/}

Воздержитесь от добавления несвязанной логики в ваш Эффект только потому, что эта логика должна выполняться одновременно с уже написанным вами Эффектом. Например, скажем, вы хотите отправлять аналитическое событие при посещении пользователем комнаты. У вас уже есть Эффект, зависящий от `roomId`, поэтому вы можете почувствовать искушение добавить туда вызов аналитики:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Но представьте, что позже вы добавите другую зависимость к этому Эффекту, которая потребует переустановки соединения. Если этот Эффект повторно синхронизируется, он также вызовет `logVisit(roomId)` для той же комнаты, чего вы не предполагали. Логирование посещения — это **отдельный процесс** от подключения. Напишите их как два отдельных Эффекта:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Каждый Эффект в вашем коде должен представлять отдельный и независимый процесс синхронизации.**

В приведённом выше примере удаление одного Эффекта не нарушит логику другого. Это хороший признак того, что они синхронизируют разные вещи, и поэтому имело смысл их разделить. С другой стороны, если вы разделите связный фрагмент логики на отдельные Эффекты, код может выглядеть "чище", но будет [сложнее в поддержке.](/learn/you-might-not-need-an-effect#chains-of-computations) Вот почему вы должны думать, являются ли процессы одинаковыми или разными, а не о том, выглядит ли код чище.

## Эффекты "реагируют" на реактивные значения {/*effects-react-to-reactive-values*/}

Ваш эффект считывает две переменные (`serverUrl` и `roomId`), но вы указали `roomId` в качестве зависимости:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Почему `serverUrl` не нужно указывать в зависимостях?

Это связано с тем, что `serverUrl` никогда не меняется из-за повторного рендеринга. Он всегда одинаков, независимо от того, сколько раз компонент повторно рендерится и почему. Поскольку `serverUrl` никогда не меняется, указывать его в качестве зависимости не имеет смысла. В конце концов, зависимости делают что-то только тогда, когда они меняются со временем!

С другой стороны, `roomId` может быть разным при повторном рендеринге. **Пропсы, состояние и другие значения, объявленные внутри компонента, являются _реактивными_, потому что они вычисляются во время рендеринга и участвуют в потоке данных React.**

Если бы `serverUrl` был переменной состояния, он был бы реактивным. Реактивные значения должны быть включены в зависимости:

```js {2,5,10}
function ChatRoom({ roomId }) { // roomId может меняться со временем
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl может меняться со временем

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Ваш эффект считывает пропсы и состояние
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Поэтому вы сообщаете React, что этот эффект "зависит" от пропсов и состояния
  // ...
}
```

Включив `serverUrl` в зависимости, вы гарантируете, что эффект будет повторно синхронизироваться после его изменения.

Попробуйте изменить выбранную комнату чата или отредактировать URL сервера в этой песочнице:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

Всякий раз, когда вы изменяете реактивное значение, такое как `roomId` или `serverUrl`, эффект переподключается к серверу чата.

### Что означает эффект с пустыми зависимостями {/*what-an-effect-with-empty-dependencies-means*/}

Что произойдет, если вы вынесете `serverUrl` и `roomId` за пределы компонента?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Все зависимости объявлены
  // ...
}
```

Теперь код вашего эффекта не использует *никаких* реактивных значений, поэтому его зависимости могут быть пустыми (`[]`).

С точки зрения компонента, пустой массив зависимостей `[]` означает, что эффект подключается к комнате чата только при монтировании компонента и отключается только при размонтировании компонента. (Имейте в виду, что React все равно [повторно синхронизирует его один раз дополнительно](#how-react-verifies-that-your-effect-can-re-synchronize) в режиме разработки, чтобы протестировать вашу логику.)


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

Однако, если вы [думаете с точки зрения эффекта](#thinking-from-the-effects-perspective), вам вообще не нужно думать о монтировании и размонтировании. Важно то, что вы указали, как ваш эффект начинает и прекращает синхронизацию. Сегодня у него нет реактивных зависимостей. Но если вы когда-нибудь захотите, чтобы пользователь со временем изменял `roomId` или `serverUrl` (и они станут реактивными), код вашего эффекта не изменится. Вам нужно будет только добавить их в зависимости.

### Все переменные, объявленные в теле компонента, реактивны {/*all-variables-declared-in-the-component-body-are-reactive*/}

Пропсы и состояние — это не единственные реактивные значения. Значения, которые вы вычисляете из них, также реактивны. Если пропсы или состояние изменяются, ваш компонент будет повторно рендериться, и значения, вычисленные из них, также изменятся. Вот почему все переменные из тела компонента, используемые эффектом, должны быть в списке зависимостей эффекта.

Допустим, пользователь может выбрать сервер чата в выпадающем списке, но также может настроить сервер по умолчанию в настройках. Предположим, вы уже поместили состояние настроек в [контекст](/learn/scaling-up-with-reducer-and-context), поэтому вы считываете `settings` из этого контекста. Теперь вы вычисляете `serverUrl` на основе выбранного сервера из пропсов и сервера по умолчанию:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId реактивен
  const settings = useContext(SettingsContext); // settings реактивен
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl реактивен
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Ваш эффект считывает roomId и serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Поэтому ему нужно повторно синхронизироваться, когда любое из них изменится!
  // ...
}
```

В этом примере `serverUrl` не является пропсом или переменной состояния. Это обычная переменная, которую вы вычисляете во время рендеринга. Но она вычисляется во время рендеринга, поэтому может измениться из-за повторного рендеринга. Вот почему она реактивна.

**Все значения внутри компонента (включая пропсы, состояние и переменные в теле вашего компонента) являются реактивными. Любое реактивное значение может измениться при повторном рендеринге, поэтому вам нужно включать реактивные значения в качестве зависимостей эффекта.**

Другими словами, эффекты "реагируют" на все значения из тела компонента.

<DeepDive>

#### Могут ли глобальные или изменяемые значения быть зависимостями? {/*can-global-or-mutable-values-be-dependencies*/}

Изменяемые значения (включая глобальные переменные) не являются реактивными.

**Изменяемое значение, такое как [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname), не может быть зависимостью.** Оно изменяемо, поэтому может измениться в любой момент совершенно вне потока данных рендеринга React. Его изменение не вызовет повторный рендеринг вашего компонента. Следовательно, даже если вы укажете его в зависимостях, React *не узнает*, что нужно повторно синхронизировать эффект при его изменении. Это также нарушает правила React, потому что чтение изменяемых данных во время рендеринга (когда вы вычисляете зависимости) нарушает [чистоту рендеринга.](/learn/keeping-components-pure) Вместо этого вам следует считывать и подписываться на внешний изменяемый объект с помощью [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Изменяемое значение, такое как [`ref.current`](/reference/react/useRef#reference) или то, что вы из него считываете, также не может быть зависимостью.** Сам объект ref, возвращаемый `useRef`, может быть зависимостью, но его свойство `current` намеренно изменяемо. Оно позволяет вам [отслеживать что-то, не вызывая повторный рендеринг.](/learn/referencing-values-with-refs) Но поскольку его изменение не вызывает повторный рендеринг, это не реактивное значение, и React не узнает, когда нужно повторно запустить ваш эффект при его изменении.

Как вы узнаете ниже на этой странице, линтер автоматически проверит эти проблемы.

</DeepDive>

### React проверяет, что вы указали каждую реактивную переменную в качестве зависимости {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Если ваш линтер [настроен для React,](/learn/editor-setup#linting) он проверит, что каждое реактивное значение, используемое кодом вашего эффекта, объявлено в качестве его зависимости. Например, это ошибка линтинга, потому что и `roomId`, и `serverUrl` реактивны:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId реактивен
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl реактивен

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Здесь что-то не так!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

Это может выглядеть как ошибка React, но на самом деле React указывает на ошибку в вашем коде. И `roomId`, и `serverUrl` могут меняться со временем, но вы забыли повторно синхронизировать ваш эффект при их изменении. Вы останетесь подключены к исходным `roomId` и `serverUrl` даже после того, как пользователь выберет другие значения в пользовательском интерфейсе.

Чтобы исправить ошибку, следуйте предложению линтера указать `roomId` и `serverUrl` в качестве зависимостей вашего эффекта:

```js {9}
function ChatRoom({ roomId }) { // roomId реактивен
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl реактивен
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ Все зависимости объявлены
  // ...
}
```

Попробуйте это исправление в песочнице выше. Убедитесь, что ошибка линтера исчезла, и чат переподключается при необходимости.

<Note>

В некоторых случаях React *знает*, что значение никогда не меняется, даже если оно объявлено внутри компонента. Например, функция [`set`](/reference/react/useState#setstate), возвращаемая из `useState`, и объект ref, возвращаемый [`useRef`](/reference/react/useRef), являются *стабильными* — гарантируется, что они не изменятся при повторном рендеринге. Стабильные значения не являются реактивными, поэтому вы можете опустить их из списка. Включение их разрешено: они не изменятся, так что это не имеет значения.

</Note>

### Что делать, если вы не хотите повторно синхронизировать {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

В предыдущем примере вы исправили ошибку линтера, указав `roomId` и `serverUrl` в качестве зависимостей.

**Однако вы можете "доказать" линтеру, что эти значения не являются реактивными,** то есть они *не могут* измениться в результате повторного рендеринга. Например, если `serverUrl` и `roomId` не зависят от рендеринга и всегда имеют одинаковые значения, вы можете вынести их за пределы компонента. Теперь они не нуждаются в указании в качестве зависимостей:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl не является реактивным
const roomId = 'general'; // roomId не является реактивным

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Все зависимости объявлены
  // ...
}
```

Вы также можете вынести их *внутрь эффекта*. Они не вычисляются во время рендеринга, поэтому не являются реактивными:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl не является реактивным
    const roomId = 'general'; // roomId не является реактивным
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Все зависимости объявлены
  // ...
}
```

**Эффекты — это реактивные блоки кода.** Они повторно синхронизируются при изменении значений, которые вы читаете внутри них. В отличие от обработчиков событий, которые выполняются только один раз за взаимодействие, эффекты выполняются всякий раз, когда требуется синхронизация.

**Вы не можете "выбирать" свои зависимости.** Ваши зависимости должны включать каждое [реактивное значение](#all-variables-declared-in-the-component-body-are-reactive), которое вы читаете в эффекте. Линтер обеспечивает это. Иногда это может привести к проблемам, таким как бесконечные циклы и слишком частая повторная синхронизация эффекта. Не исправляйте эти проблемы, подавляя линтер! Вот что стоит попробовать вместо этого:

* **Проверьте, представляет ли ваш эффект независимый процесс синхронизации.** Если ваш эффект ничего не синхронизирует, [он может быть ненужным.](/learn/you-might-not-need-an-effect) Если он синхронизирует несколько независимых вещей, [разделите его.](#each-effect-represents-a-separate-synchronization-process)

* **Если вы хотите прочитать последнее значение пропсов или состояния, не "реагируя" на него и не повторно синхронизируя эффект,** вы можете разделить эффект на реактивную часть (которую вы оставите в эффекте) и нереактивную часть (которую вы вынесете во что-то под названием _Событие эффекта_). [Читайте о разделении событий и эффектов.](/learn/separating-events-from-effects)

* **Избегайте использования объектов и функций в качестве зависимостей.** Если вы создаете объекты и функции во время рендеринга, а затем читаете их из эффекта, они будут отличаться при каждом рендеринге. Это приведет к повторной синхронизации эффекта каждый раз. [Читайте подробнее об удалении ненужных зависимостей из эффектов.](/learn/removing-effect-dependencies)

<Pitfall>

Линтер — ваш друг, но его возможности ограничены. Линтер знает только, когда зависимости *неправильны*. Он не знает *лучшего* способа решения каждого случая. Если линтер предлагает зависимость, но ее добавление вызывает цикл, это не значит, что линтер следует игнорировать. Вам нужно изменить код внутри (или вне) эффекта так, чтобы это значение не было реактивным и *не нуждалось* быть зависимостью.

Если у вас есть существующая кодовая база, у вас могут быть эффекты, которые подавляют линтер следующим образом:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Избегайте подавления линтера таким образом:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

На [следующих](/learn/separating-events-from-effects) [страницах](/learn/removing-effect-dependencies) вы узнаете, как исправить этот код, не нарушая правил. Всегда стоит это исправлять!

</Pitfall>

<Recap>

- Компоненты могут монтироваться, обновляться и размонтироваться.
- Каждый эффект имеет отдельный жизненный цикл от окружающего компонента.
- Каждый эффект описывает отдельный процесс синхронизации, который может *начинаться* и *останавливаться*.
- При написании и чтении эффектов думайте с точки зрения каждого отдельного эффекта (как начать и остановить синхронизацию), а не с точки зрения компонента (как он монтируется, обновляется или размонтируется).
- Значения, объявленные внутри тела компонента, являются "реактивными".
- Реактивные значения должны повторно синхронизировать эффект, поскольку они могут меняться со временем.
- Линтер проверяет, что все реактивные значения, используемые внутри эффекта, указаны в качестве зависимостей.
- Все ошибки, отмеченные линтером, являются обоснованными. Всегда есть способ исправить код, чтобы не нарушать правила.

</Recap>

<Challenges>

#### Исправить повторное подключение при каждом нажатии клавиши {/*fix-reconnecting-on-every-keystroke*/}

В этом примере компонент `ChatRoom` подключается к чату при монтировании компонента, отключается при размонтировании и переподключается при выборе другой комнаты чата. Это поведение корректно, поэтому вам нужно сохранить его работоспособность.

Однако есть проблема. Каждый раз, когда вы вводите текст в поле ввода сообщения внизу, `ChatRoom` *также* переподключается к чату. (Вы можете заметить это, очистив консоль и введя текст в поле ввода.) Исправьте проблему, чтобы этого не происходило.

<Hint>

Возможно, вам потребуется добавить массив зависимостей для этого эффекта. Какие зависимости там должны быть?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

У этого эффекта вообще не было массива зависимостей, поэтому он повторно синхронизировался после каждого рендеринга. Сначала добавьте массив зависимостей. Затем убедитесь, что каждое реактивное значение, используемое эффектом, указано в массиве. Например, `roomId` является реактивным (поскольку это пропс), поэтому он должен быть включен в массив. Это гарантирует, что при выборе пользователем другой комнаты чат переподключится. С другой стороны, `serverUrl` определен вне компонента. Поэтому его не нужно включать в массив.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### Включение и выключение синхронизации {/*switch-synchronization-on-and-off*/}

В этом примере эффект подписывается на событие `pointermove` окна [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) для перемещения розовой точки на экране. Попробуйте навести курсор на область предварительного просмотра (или прикоснуться к экрану, если вы на мобильном устройстве), и вы увидите, как розовая точка следует за вашим движением.

Также есть флажок. Установка флажка переключает переменную состояния `canMove`, но эта переменная состояния нигде не используется в коде. Ваша задача — изменить код так, чтобы при `canMove` равном `false` (флажок снят) точка переставала двигаться. После того как вы снова установите флажок (и установите `canMove` в `true`), точка снова будет следовать за движением. Другими словами, возможность перемещения точки должна оставаться синхронизированной с тем, отмечен ли флажок.

<Hint>

Вы не можете объявлять эффект условно. Однако код внутри эффекта может использовать условия!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

Одно из решений — обернуть вызов `setPosition` в условие `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Альтернативно, вы можете обернуть логику *подписки на событие* в условие `if (canMove) { ... }`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

В обоих этих случаях `canMove` является реактивной переменной, которую вы читаете внутри эффекта. Поэтому она должна быть указана в списке зависимостей эффекта. Это гарантирует, что эффект повторно синхронизируется после каждого изменения ее значения.

</Solution>

#### Исследовать ошибку устаревшего значения {/*investigate-a-stale-value-bug*/}

В этом примере розовая точка должна двигаться, когда флажок установлен, и переставать двигаться, когда флажок снят. Логика для этого уже реализована: обработчик события `handleMove` проверяет переменную состояния `canMove`.

Однако по какой-то причине переменная состояния `canMove` внутри `handleMove` кажется "устаревшей": она всегда равна `true`, даже после снятия флажка. Как это возможно? Найдите ошибку в коде и исправьте ее.

<Hint>

Если вы видите подавление правила линтера, удалите его! Обычно ошибки кроются именно там.

</Hint>

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

<Solution>

Проблема исходного кода заключалась в подавлении линтера зависимостей. Если удалить подавление, вы увидите, что этот эффект зависит от функции `handleMove`. Это имеет смысл: `handleMove` объявлена внутри тела компонента, что делает ее реактивным значением. Каждое реактивное значение должно быть указано как зависимость, иначе оно потенциально может устареть со временем!

Автор исходного кода "солгал" React, сказав, что эффект не зависит (`[]`) от каких-либо реактивных значений. Поэтому React не повторно синхронизировал эффект после изменения `canMove` (и вместе с ним `handleMove`). Поскольку React не повторно синхронизировал эффект, `handleMove`, прикрепленный как слушатель, является функцией `handleMove`, созданной во время первоначального рендеринга. Во время первоначального рендеринга `canMove` было `true`, поэтому `handleMove` из первоначального рендеринга навсегда увидит это значение.

**Если вы никогда не подавляете линтер, вы никогда не столкнетесь с проблемами устаревших значений.** Существует несколько способов решить эту ошибку, но вы всегда должны начинать с удаления подавления линтера. Затем измените код, чтобы исправить ошибку линтера.

Вы можете изменить зависимости эффекта на `[handleMove]`, но поскольку это будет новая функция для каждого рендеринга, вы можете вообще убрать массив зависимостей. Тогда эффект *будет* повторно синхронизироваться после каждого рендеринга:

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
  });

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

Это решение работает, но оно не идеально. Если вы добавите `console.log('Resubscribing')` внутрь эффекта, вы заметите, что он повторно подписывается после каждого повторного рендеринга. Повторная подписка происходит быстро, но все же было бы неплохо избежать этого так часто.

Лучшим решением будет вынести функцию `handleMove` *внутрь* эффекта. Тогда `handleMove` не будет реактивным значением, и поэтому ваш эффект не будет зависеть от функции. Вместо этого ему потребуется зависеть от `canMove`, который ваш код теперь читает изнутри эффекта. Это соответствует желаемому поведению, поскольку ваш эффект теперь будет оставаться синхронизированным со значением `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Попробуйте добавить `console.log('Resubscribing')` внутрь тела эффекта и заметьте, что теперь он повторно подписывается только при переключении флажка (`canMove` изменяется) или при редактировании кода. Это лучше, чем предыдущий подход, который всегда повторно подписывался.

Вы узнаете более общий подход к этому типу проблем в разделе [Separating Events from Effects.](/learn/separating-events-from-effects)

</Solution>

#### Исправьте переключение соединения {/*fix-a-connection-switch*/}

В этом примере сервис чата в `chat.js` предоставляет два разных API: `createEncryptedConnection` и `createUnencryptedConnection`. Корневой компонент `App` позволяет пользователю выбрать, использовать ли шифрование, а затем передает соответствующий метод API дочернему компоненту `ChatRoom` в качестве пропса `createConnection`.

Обратите внимание, что изначально в консоли отображаются сообщения о том, что соединение не зашифровано. Попробуйте установить флажок: ничего не произойдет. Однако, если вы после этого смените выбранную комнату, чат переподключится *и* включит шифрование (как вы увидите из сообщений в консоли). Это ошибка. Исправьте ошибку так, чтобы установка флажка *также* приводила к переподключению чата.

<Hint>

Подавление линтера всегда подозрительно. Может ли это быть ошибкой?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

If you remove the linter suppression, you will see a lint error. The problem is that `createConnection` is a prop, so it's a reactive value. It can change over time! (And indeed, it should--when the user ticks the checkbox, the parent component passes a different value of the `createConnection` prop.) This is why it should be a dependency. Include it in the list to fix the bug:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

It is correct that `createConnection` is a dependency. However, this code is a bit fragile because someone could edit the `App` component to pass an inline function as the value of this prop. In that case, its value would be different every time the `App` component re-renders, so the Effect might re-synchronize too often. To avoid this, you can pass `isEncrypted` down instead:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

It is correct that `createConnection` is a dependency. However, this code is a bit fragile because someone could edit the `App` component to pass an inline function as the value of this prop. In that case, its value would be different every time the `App` component re-renders, so the Effect might re-synchronize too often. To avoid this, you can pass `isEncrypted` down instead:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

In this version, the `App` component passes a boolean prop instead of a function. Inside the Effect, you decide which function to use. Since both `createEncryptedConnection` and `createUnencryptedConnection` are declared outside the component, they aren't reactive, and don't need to be dependencies. You'll learn more about this in [Removing Effect Dependencies.](/learn/removing-effect-dependencies)

</Solution>

#### Заполните цепочку выпадающих списков {/*populate-a-chain-of-select-boxes*/}

В этом примере есть два выпадающих списка. Один позволяет пользователю выбрать планету. Другой позволяет пользователю выбрать место *на этой планете*. Второй список пока не работает. Ваша задача — сделать так, чтобы он отображал места на выбранной планете.

Посмотрите, как работает первый выпадающий список. Он заполняет состояние `planetList` результатом вызова API `"/planets"`. Идентификатор выбранной планеты хранится в переменной состояния `planetId`. Вам нужно найти, куда добавить дополнительный код, чтобы переменная состояния `placeList` была заполнена результатом вызова API `"/planets/" + planetId + "/places"`.

Если вы реализуете это правильно, выбор планеты должен заполнить список мест. Изменение планеты должно изменить список мест.

<Hint>

Если у вас есть два независимых процесса синхронизации, вам нужно написать два отдельных эффекта.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

There are two independent synchronization processes:

- The first select box is synchronized to the remote list of planets.
- The second select box is synchronized to the remote list of places for the current `planetId`.

This is why it makes sense to describe them as two separate Effects. Here's an example of how you could do this:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

This code is a bit repetitive. However, that's not a good reason to combine it into a single Effect! If you did this, you'd have to combine both Effect's dependencies into one list, and then changing the planet would refetch the list of all planets. Effects are not a tool for code reuse.

Instead, to reduce repetition, you can extract some logic into a custom Hook like `useSelectOptions` below:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Check the `useSelectOptions.js` tab in the sandbox to see how it works. Ideally, most Effects in your application should eventually be replaced by custom Hooks, whether written by you or by the community. Custom Hooks hide the synchronization logic, so the calling component doesn't know about the Effect. As you keep working on your app, you'll develop a palette of Hooks to choose from, and eventually you won't need to write Effects in your components very often.

</Solution>

</Challenges>