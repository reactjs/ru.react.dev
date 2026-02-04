---
title: 'Жизненный цикл реактивных эффектов'
---

<Intro>

Эффекты имеют другой жизненный цикл по сравнению с компонентами. Компоненты могут монтироваться, обновляться или размонтироваться. Эффект может делать только две вещи: начать синхронизацию чего-либо и позже прекратить её. Этот цикл может повторяться несколько раз, если ваш эффект зависит от пропсов и состояния, которые меняются со временем. React предоставляет правило линтера для проверки правильности указания зависимостей вашего эффекта. Это гарантирует синхронизацию вашего эффекта с последними пропсами и состоянием.

</Intro>

<YouWillLearn>

- Чем жизненный цикл эффекта отличается от жизненного цикла компонента
- Как рассматривать каждый отдельный эффект в изоляции
- Когда вашему эффекту нужно повторно синхронизироваться и почему
- Как определяются зависимости вашего эффекта
- Что означает реактивность значения
- Что означает пустой массив зависимостей
- Как React проверяет правильность ваших зависимостей с помощью линтера
- Что делать, если вы не согласны с линтером

</YouWillLearn>

## Жизненный цикл эффекта {/*the-lifecycle-of-an-effect*/}

Каждый компонент React проходит через один и тот же жизненный цикл:

- Компонент _монтируется_, когда он добавляется на экран.
- Компонент _обновляется_, когда он получает новые пропсы или состояние, обычно в ответ на взаимодействие.
- Компонент _размонтируется_, когда он удаляется с экрана.

**Это хороший способ думать о компонентах, но _не_ об эффектах.** Вместо этого старайтесь думать о каждом эффекте независимо от жизненного цикла вашего компонента. Эффект описывает, как [синхронизировать внешнюю систему](/learn/synchronizing-with-effects) с текущими пропсами и состоянием. По мере изменения вашего кода синхронизация будет происходить чаще или реже.

Чтобы проиллюстрировать это, рассмотрим эффект, подключающий ваш компонент к чат-серверу:

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

Тело вашего эффекта определяет, как **начать синхронизацию:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Функция очистки, возвращаемая вашим эффектом, определяет, как **прекратить синхронизацию:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Интуитивно вы можете подумать, что React будет **начинать синхронизацию**, когда ваш компонент монтируется, и **прекращать синхронизацию**, когда ваш компонент размонтируется. Однако это еще не все! Иногда может потребоваться **начинать и прекращать синхронизацию несколько раз**, пока компонент остается смонтированным.

Давайте посмотрим, _почему_ это необходимо, _когда_ это происходит и _как_ вы можете контролировать это поведение.

<Note>

Некоторые эффекты вообще не возвращают функцию очистки. [Чаще всего](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) вы захотите ее вернуть — но если нет, React будет вести себя так, как будто вы вернули пустую функцию очистки.

</Note>

### Почему синхронизация может потребоваться более одного раза {/*why-synchronization-may-need-to-happen-more-than-once*/}

Представьте, что компонент `ChatRoom` получает пропс `roomId`, который пользователь выбирает в выпадающем списке. Допустим, изначально пользователь выбирает комнату `"general"` в качестве `roomId`. Ваше приложение отображает чат-комнату `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

После отображения пользовательского интерфейса React запустит ваш эффект для **начала синхронизации.** Он подключается к комнате `"general"`:

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

Пока все хорошо.

Позже пользователь выбирает другую комнату в выпадающем списке (например, `"travel"`). Сначала React обновит пользовательский интерфейс:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Подумайте, что должно произойти дальше. Пользователь видит, что `"travel"` — это выбранная комната чата в пользовательском интерфейсе. Однако эффект, который был запущен в прошлый раз, все еще подключен к комнате `"general"`. **Пропс `roomId` изменился, поэтому то, что ваш эффект сделал тогда (подключение к комнате `"general"`), больше не соответствует пользовательскому интерфейсу.**

В этот момент вы хотите, чтобы React сделал две вещи:

1. Прекратить синхронизацию со старым `roomId` (отключиться от комнаты `"general"`)
2. Начать синхронизацию с новым `roomId` (подключиться к комнате `"travel"`)

**К счастью, вы уже научили React делать обе эти вещи!** Тело вашего эффекта определяет, как начать синхронизацию, а ваша функция очистки определяет, как прекратить синхронизацию. Все, что нужно сделать React, — это вызвать их в правильном порядке и с правильными пропсами и состоянием. Давайте посмотрим, как именно это происходит.

### Как React повторно синхронизирует ваш эффект {/*how-react-re-synchronizes-your-effect*/}

Помните, что ваш компонент `ChatRoom` получил новое значение для своего пропса `roomId`. Раньше это было `"general"`, а теперь `"travel"`. React необходимо повторно синхронизировать ваш эффект, чтобы переподключить вас к другой комнате.

Чтобы **прекратить синхронизацию,** React вызовет функцию очистки, которую ваш эффект вернул после подключения к комнате `"general"`. Поскольку `roomId` был `"general"`, функция очистки отключается от комнаты `"general"`:

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

Затем React запустит эффект, который вы предоставили во время этого рендеринга. На этот раз `roomId` будет `"travel"`, поэтому он **начнет синхронизацию** с чат-комнатой `"travel"` (до тех пор, пока его функция очистки не будет вызвана снова).

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Подключается к комнате "travel"
    connection.connect();
    // ...
```

Благодаря этому вы теперь подключены к той же комнате, которую выбрал пользователь в пользовательском интерфейсе. Катастрофа предотвращена!

Каждый раз после повторного рендеринга вашего компонента с измененным `roomId` ваш эффект будет повторно синхронизироваться. Например, скажем, пользователь изменяет `roomId` с `"travel"` на `"music"`. React снова **прекратит синхронизацию** вашего эффекта, вызвав его функцию очистки (отключив вас от комнаты `"travel"`). Затем он снова **начнет синхронизацию**, запустив тело эффекта с новым пропсом `roomId` (подключив вас к комнате `"music"`).

Наконец, когда пользователь переходит на другой экран, `ChatRoom` размонтируется. Теперь нет необходимости оставаться подключенным. React **прекратит синхронизацию** вашего эффекта в последний раз и отключит вас от чат-комнаты `"music"`.

### Мышление с точки зрения эффекта {/*thinking-from-the-effects-perspective*/}

Подведем итог всему, что произошло с точки зрения компонента `ChatRoom`:

1. `ChatRoom` смонтировался с `roomId`, установленным в `"general"`
1. `ChatRoom` обновился с `roomId`, установленным в `"travel"`
1. `ChatRoom` обновился с `roomId`, установленным в `"music"`
1. `ChatRoom` размонтировался

Во время каждой из этих точек жизненного цикла вашего компонента ваш эффект делал разные вещи:

1. Ваш эффект подключился к комнате `"general"`
1. Ваш эффект отключился от комнаты `"general"` и подключился к комнате `"travel"`
1. Ваш эффект отключился от комнаты `"travel"` и подключился к комнате `"music"`
1. Ваш эффект отключился от комнаты `"music"`

Теперь давайте подумаем о том, что произошло с точки зрения самого эффекта:

```js
  useEffect(() => {
    // Ваш эффект подключился к комнате, указанной в roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...пока не отключился
      connection.disconnect();
    };
  }, [roomId]);
```

Структура этого кода может вдохновить вас увидеть, что произошло, как последовательность перекрывающихся периодов времени:

1. Ваш эффект подключился к комнате `"general"` (пока не отключился)
1. Ваш эффект подключился к комнате `"travel"` (пока не отключился)
1. Ваш эффект подключился к комнате `"music"` (пока не отключился)

Ранее вы думали с точки зрения компонента. Когда вы смотрели с точки зрения компонента, было заманчиво думать об эффектах как о "колбэках" или "событиях жизненного цикла", которые срабатывают в определенное время, например "после рендеринга" или "перед размонтированием". Такой способ мышления очень быстро усложняется, поэтому его лучше избегать.

**Вместо этого всегда фокусируйтесь на одном цикле запуска/остановки за раз. Не должно иметь значения, монтируется, обновляется или размонтируется компонент. Все, что вам нужно сделать, — это описать, как начать синхронизацию и как ее прекратить. Если вы сделаете это хорошо, ваш эффект будет устойчив к запуску и остановке столько раз, сколько потребуется.**

Это может напомнить вам, как вы не задумываетесь, монтируется или обновляется компонент, когда пишете логику рендеринга, создающую JSX. Вы описываете, что должно быть на экране, а React [сам все выясняет.](/learn/reacting-to-input-with-state)

### Как React проверяет, что ваш эффект может повторно синхронизироваться {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

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

**React проверяет, что ваш эффект может повторно синхронизироваться, заставляя его сделать это немедленно в режиме разработки.** Это может напомнить вам, как вы открываете дверь и закрываете ее еще раз, чтобы проверить, работает ли замок. React запускает и останавливает ваш эффект один раз дополнительно в режиме разработки, чтобы проверить, [хорошо ли вы реализовали его очистку.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Основная причина, по которой ваш эффект будет повторно синхронизироваться на практике, заключается в изменении некоторых используемых им данных. В песочнице выше измените выбранную комнату чата. Обратите внимание, как при изменении `roomId` ваш эффект повторно синхронизируется.

Однако существуют и более необычные случаи, когда повторная синхронизация необходима. Например, попробуйте отредактировать `serverUrl` в песочнице выше, пока чат открыт. Обратите внимание, как эффект повторно синхронизируется в ответ на ваши правки кода. В будущем React может добавить новые функции, которые полагаются на повторную синхронизацию.

### Как React узнает, что эффект нужно повторно синхронизировать {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Возможно, вы задаетесь вопросом, как React узнал, что ваш эффект нуждается в повторной синхронизации после изменения `roomId`. Это потому, что *вы сказали React*, что его код зависит от `roomId`, включив его в [список зависимостей:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // Пропс roomId может меняться со временем
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Этот эффект читает roomId 
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Поэтому вы говорите React, что этот эффект "зависит от" roomId
  // ...
```

Вот как это работает:

1. Вы знали, что `roomId` — это пропс, что означает, что он может меняться со временем.
2. Вы знали, что ваш эффект читает `roomId` (следовательно, его логика зависит от значения, которое может измениться позже).
3. Вот почему вы указали его как зависимость вашего эффекта (чтобы он повторно синхронизировался при изменении `roomId`).

Каждый раз после повторного рендеринга вашего компонента React будет смотреть на массив зависимостей, который вы передали. Если какое-либо из значений в массиве отличается от значения в том же месте, которое вы передали во время предыдущего рендеринга, React повторно синхронизирует ваш эффект.

Например, если вы передали `["general"]` во время начального рендеринга, а затем позже передали `["travel"]` во время следующего рендеринга, React сравнит `"general"` и `"travel"`. Это разные значения (сравненные с помощью [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), поэтому React повторно синхронизирует ваш эффект. С другой стороны, если ваш компонент повторно рендерится, но `roomId` не изменился, ваш эффект останется подключенным к той же комнате.

### Каждый эффект представляет отдельный процесс синхронизации {/*each-effect-represents-a-separate-synchronization-process*/}

Старайтесь не добавлять в ваш эффект несвязанную логику только потому, что эта логика должна выполняться одновременно с уже написанным вами эффектом. Например, предположим, вы хотите отправить событие аналитики, когда пользователь посещает комнату. У вас уже есть эффект, зависящий от `roomId`, поэтому вы можете почувствовать искушение добавить туда вызов аналитики:

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

Но представьте, что позже вы добавите другую зависимость к этому эффекту, которая потребует переустановки соединения. Если этот эффект будет повторно синхронизироваться, он также вызовет `logVisit(roomId)` для той же комнаты, чего вы не предполагали. Логирование посещения — это **отдельный процесс** от подключения. Напишите их как два отдельных эффекта:

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

**Каждый эффект в вашем коде должен представлять отдельный и независимый процесс синхронизации.**

В приведенном выше примере удаление одного эффекта не нарушит логику другого. Это хороший признак того, что они синхронизируют разные вещи, и поэтому их имело смысл разделить. С другой стороны, если вы разделите единый блок логики на отдельные эффекты, код может выглядеть «чище», но его будет [сложнее поддерживать.](/learn/you-might-not-need-an-effect#chains-of-computations) Вот почему вы должны думать, являются ли процессы одинаковыми или отдельными, а не о том, выглядит ли код чище.

## Эффекты "реагируют" на реактивные значения {/*effects-react-to-reactive-values*/}

Ваш эффект читает две переменные (`serverUrl` и `roomId`), но вы указали только `roomId` в качестве зависимости:

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

Почему `serverUrl` не нужно указывать как зависимость?

Это связано с тем, что `serverUrl` никогда не меняется из-за повторного рендеринга. Он всегда одинаков, независимо от того, сколько раз компонент перерисовывается и почему. Поскольку `serverUrl` никогда не меняется, указывать его как зависимость не имеет смысла. В конце концов, зависимости делают что-то только тогда, когда они меняются со временем!

С другой стороны, `roomId` может быть другим при повторном рендеринге. **Пропсы, состояние и другие значения, объявленные внутри компонента, являются _реактивными_, потому что они вычисляются во время рендеринга и участвуют в потоке данных React.**

Если бы `serverUrl` был переменной состояния, он был бы реактивным. Реактивные значения должны быть включены в зависимости:

```js {2,5,10}
function ChatRoom({ roomId }) { // Пропсы меняются со временем
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Состояние может меняться со временем

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Ваш эффект читает пропсы и состояние
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Поэтому вы сообщаете React, что этот эффект "зависит от" пропсов и состояния
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

Однако, если вы [думаете с точки зрения эффекта](#thinking-from-the-effects-perspective), вам вообще не нужно думать о монтировании и размонтировании. Важно то, что вы указали, что делает ваш эффект для начала и прекращения синхронизации. Сегодня у него нет реактивных зависимостей. Но если вы когда-нибудь захотите, чтобы пользователь со временем изменял `roomId` или `serverUrl` (и они станут реактивными), код вашего эффекта не изменится. Вам нужно будет только добавить их в зависимости.

### Все переменные, объявленные в теле компонента, реактивны {/*all-variables-declared-in-the-component-body-are-reactive*/}

Пропсы и состояние — это не единственные реактивные значения. Значения, которые вы вычисляете из них, также реактивны. Если пропсы или состояние изменятся, ваш компонент перерисуется, и значения, вычисленные из них, также изменятся. Вот почему все переменные из тела компонента, используемые эффектом, должны быть в списке зависимостей эффекта.

Допустим, пользователь может выбрать сервер чата в выпадающем списке, но также может настроить сервер по умолчанию в настройках. Предположим, вы уже поместили состояние настроек в [контекст](/learn/scaling-up-with-reducer-and-context), поэтому вы читаете `settings` из этого контекста. Теперь вы вычисляете `serverUrl` на основе выбранного сервера из пропсов и сервера по умолчанию:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId реактивен
  const settings = useContext(SettingsContext); // settings реактивен
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl реактивен
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Ваш эффект читает roomId и serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Поэтому ему нужно повторно синхронизироваться при изменении любого из них!
  // ...
}
```

В этом примере `serverUrl` не является пропсом или переменной состояния. Это обычная переменная, которую вы вычисляете во время рендеринга. Но она вычисляется во время рендеринга, поэтому может измениться из-за повторного рендеринга. Вот почему она реактивна.

**Все значения внутри компонента (включая пропсы, состояние и переменные в теле вашего компонента) реактивны. Любое реактивное значение может измениться при повторном рендеринге, поэтому вам нужно включить реактивные значения в качестве зависимостей эффекта.**

Другими словами, эффекты "реагируют" на все значения из тела компонента.

<DeepDive>

#### Могут ли глобальные или изменяемые значения быть зависимостями? {/*can-global-or-mutable-values-be-dependencies*/}

Изменяемые значения (включая глобальные переменные) не реактивны.

**Изменяемое значение, такое как [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname), не может быть зависимостью.** Оно изменяемо, поэтому может измениться в любой момент совершенно вне потока данных рендеринга React. Его изменение не вызовет повторный рендеринг вашего компонента. Следовательно, даже если вы укажете его в зависимостях, React *не узнает*, чтобы повторно синхронизировать эффект при его изменении. Это также нарушает правила React, потому что чтение изменяемых данных во время рендеринга (когда вы вычисляете зависимости) нарушает [чистоту рендеринга.](/learn/keeping-components-pure) Вместо этого вы должны читать и подписываться на внешний изменяемый объект с помощью [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Изменяемое значение, такое как [`ref.current`](/reference/react/useRef#reference) или то, что вы из него читаете, также не может быть зависимостью.** Сам объект ref, возвращаемый `useRef`, может быть зависимостью, но его свойство `current` намеренно изменяемо. Оно позволяет вам [отслеживать что-то, не вызывая повторный рендеринг.](/learn/referencing-values-with-refs) Но поскольку его изменение не вызывает повторный рендеринг, это не реактивное значение, и React не узнает, чтобы повторно запустить ваш эффект при его изменении.

Как вы узнаете ниже на этой странице, линтер автоматически проверит эти проблемы.

</DeepDive>

### React проверяет, что вы указали каждую реактивную переменную в качестве зависимости {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Если ваш линтер [настроен для React,](/learn/editor-setup#linting) он проверит, что каждое реактивное значение, используемое кодом вашего эффекта, объявлено как его зависимость. Например, это ошибка линтера, потому что и `roomId`, и `serverUrl` реактивны:

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

Это может выглядеть как ошибка React, но на самом деле React указывает на ошибку в вашем коде. И `roomId`, и `serverUrl` могут меняться со временем, но вы забыли повторно синхронизировать ваш эффект при их изменении. Вы останетесь подключены к начальным `roomId` и `serverUrl` даже после того, как пользователь выберет другие значения в пользовательском интерфейсе.

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

В некоторых случаях React *знает*, что значение никогда не меняется, даже если оно объявлено внутри компонента. Например, функция [`set` (установки)](/reference/react/useState#setstate), возвращаемая из `useState`, и объект ref, возвращаемый [`useRef`](/reference/react/useRef), являются *стабильными* — гарантируется, что они не изменятся при повторном рендеринге. Стабильные значения не реактивны, поэтому вы можете опустить их из списка. Включение их разрешено: они не изменятся, так что это не имеет значения.

</Note>

### Что делать, если вы не хотите повторно синхронизировать {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

В предыдущем примере вы исправили ошибку линтера, перечислив `roomId` и `serverUrl` в качестве зависимостей.

**Однако вы могли бы вместо этого «доказать» линтеру, что эти значения не являются реактивными,** то есть они *не могут* измениться в результате повторного рендеринга. Например, если `serverUrl` и `roomId` не зависят от рендеринга и всегда имеют одинаковые значения, вы можете вынести их за пределы компонента. Теперь они не нуждаются в зависимостях:

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

**Вы не можете «выбирать» свои зависимости.** Ваши зависимости должны включать каждое [реактивное значение](#all-variables-declared-in-the-component-body-are-reactive), которое вы читаете в эффекте. Линтер обеспечивает это. Иногда это может привести к проблемам, таким как бесконечные циклы, и к тому, что ваш эффект будет повторно синхронизироваться слишком часто. Не исправляйте эти проблемы, подавляя линтер! Вот что стоит попробовать вместо этого:

* **Проверьте, представляет ли ваш эффект независимый процесс синхронизации.** Если ваш эффект ничего не синхронизирует, [он может быть ненужным.](/learn/you-might-not-need-an-effect) Если он синхронизирует несколько независимых вещей, [разделите его.](#each-effect-represents-a-separate-synchronization-process)

* **Если вы хотите прочитать последнее значение пропсов или состояния, не «реагируя» на него и не повторно синхронизируя эффект,** вы можете разделить ваш эффект на реактивную часть (которую вы оставите в эффекте) и нереактивную часть (которую вы вынесете во что-то под названием _Событие эффекта_). [Читайте о разделении событий и эффектов.](/learn/separating-events-from-effects)

* **Избегайте использования объектов и функций в качестве зависимостей.** Если вы создаете объекты и функции во время рендеринга, а затем читаете их из эффекта, они будут отличаться при каждом рендеринге. Это приведет к повторной синхронизации эффекта каждый раз. [Узнайте больше об удалении ненужных зависимостей из эффектов.](/learn/removing-effect-dependencies)

<Pitfall>

Линтер — ваш друг, но его возможности ограничены. Линтер знает только, когда зависимости *неправильные*. Он не знает *лучшего* способа решения каждого случая. Если линтер предлагает зависимость, но ее добавление вызывает цикл, это не значит, что линтер следует игнорировать. Вам нужно изменить код внутри (или вне) эффекта так, чтобы это значение не было реактивным и не *требовало* быть зависимостью.

Если у вас есть существующая кодовая база, у вас могут быть эффекты, которые подавляют линтер, например:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Избегайте подавления линтера таким образом:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

На [следующих](/learn/separating-events-from-effects) [страницах](/learn/removing-effect-dependencies) вы узнаете, как исправить этот код, не нарушая правил. Всегда стоит исправлять!

</Pitfall>

<Recap>

- Компоненты могут монтироваться, обновляться и размонтироваться.
- Каждый эффект имеет отдельный жизненный цикл от окружающего компонента.
- Каждый эффект описывает отдельный процесс синхронизации, который может *начинаться* и *заканчиваться*.
- При написании и чтении эффектов думайте с точки зрения каждого отдельного эффекта (как начать и остановить синхронизацию), а не с точки зрения компонента (как он монтируется, обновляется или размонтируется).
- Значения, объявленные внутри тела компонента, являются «реактивными».
- Реактивные значения должны повторно синхронизировать эффект, поскольку они могут меняться со временем.
- Линтер проверяет, что все реактивные значения, используемые внутри эффекта, указаны в качестве зависимостей.
- Все ошибки, отмеченные линтером, являются обоснованными. Всегда есть способ исправить код, чтобы не нарушать правила.

</Recap>

<Challenges>

#### Исправить повторное подключение при каждом нажатии клавиши {/*fix-reconnecting-on-every-keystroke*/}

В этом примере компонент `ChatRoom` подключается к чат-комнате при монтировании компонента, отключается при размонтировании и переподключается при выборе другой чат-комнаты. Это поведение корректно, поэтому вам нужно сохранить его работоспособность.

Однако есть проблема. Каждый раз, когда вы печатаете в поле ввода сообщения внизу, `ChatRoom` *также* переподключается к чату. (Вы можете заметить это, очистив консоль и напечатав что-нибудь во входном поле.) Исправьте проблему так, чтобы этого не происходило.

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

В этом примере эффект подписывается на событие `pointermove` окна, чтобы перемещать розовую точку на экране. Попробуйте навести курсор на область предварительного просмотра (или прикоснуться к экрану, если вы находитесь на мобильном устройстве) и посмотрите, как розовая точка следует за вашим движением.

Также есть флажок. Установка флажка переключает переменную состояния `canMove`, но эта переменная состояния нигде в коде не используется. Ваша задача — изменить код так, чтобы при `canMove` равном `false` (флажок снят) точка переставала двигаться. После того как вы снова установите флажок (и установите `canMove` в `true`), точка снова начнет следовать за движением. Другими словами, возможность перемещения точки должна синхронизироваться с тем, отмечен ли флажок.

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

В обоих этих случаях `canMove` является реактивной переменной, которую вы читаете внутри эффекта. Поэтому ее необходимо указать в списке зависимостей эффекта. Это гарантирует, что эффект повторно синхронизируется после каждого изменения ее значения.

</Solution>

#### Исследуем проблему устаревшего значения {/*investigate-a-stale-value-bug*/}

В этом примере розовая точка должна двигаться при включенном флажке и останавливаться при выключенном. Логика для этого уже реализована: обработчик события `handleMove` проверяет переменную состояния `canMove`.

Однако по какой-то причине переменная состояния `canMove` внутри `handleMove` оказывается «устаревшей»: она всегда равна `true`, даже после снятия флажка. Как это возможно? Найдите ошибку в коде и исправьте её.

<Hint>

Если вы видите подавленное правило линтера, удалите подавление! Обычно ошибки скрываются именно там.

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
        Разрешить точке двигаться
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

Проблема исходного кода заключалась в подавлении линтера зависимостей. Если убрать подавление, вы увидите, что этот эффект зависит от функции `handleMove`. Это имеет смысл: `handleMove` объявлена внутри тела компонента, что делает её реактивным значением. Каждое реактивное значение должно быть указано как зависимость, иначе оно может устареть со временем!

Автор исходного кода «обманул» React, сказав, что эффект не зависит (`[]`) ни от каких реактивных значений. Именно поэтому React не пересинхронизировал эффект после изменения `canMove` (и вместе с ним `handleMove`). Поскольку React не пересинхронизировал эффект, `handleMove`, добавленный как слушатель, является функцией `handleMove`, созданной во время начального рендеринга. Во время начального рендеринга `canMove` был `true`, поэтому `handleMove` из начального рендеринга навсегда увидит это значение.

**Если вы никогда не будете подавлять линтер, вы никогда не столкнётесь с проблемами устаревших значений.** Существует несколько способов решить эту проблему, но всегда начинайте с удаления подавления линтера. Затем измените код, чтобы исправить ошибку линтера.

Вы можете изменить зависимости эффекта на `[handleMove]`, но поскольку это будет новая функция для каждого рендеринга, вы можете просто убрать массив зависимостей. Тогда эффект *будет* пересинхронизироваться после каждого повторного рендеринга:

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
        Разрешить точке двигаться
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

Это решение работает, но оно не идеально. Если вы добавите `console.log('Resubscribing')` внутрь эффекта, вы заметите, что он повторно подписывается после каждого повторного рендеринга. Повторная подписка — это быстро, но всё же было бы неплохо избегать этого так часто.

Лучшим решением будет переместить функцию `handleMove` *внутрь* эффекта. Тогда `handleMove` не будет реактивным значением, и ваш эффект не будет зависеть от функции. Вместо этого он будет зависеть от `canMove`, которое ваш код теперь считывает изнутри эффекта. Это соответствует желаемому поведению, поскольку ваш эффект теперь будет синхронизироваться со значением `canMove`:

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
        Разрешить точке двигаться
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

Попробуйте добавить `console.log('Resubscribing')` внутрь тела эффекта и заметьте, что теперь он повторно подписывается только при переключении флажка (`canMove` изменяется) или при редактировании кода. Это делает его лучше предыдущего подхода, который всегда повторно подписывался.

Вы узнаете более общий подход к этому типу проблем в разделе [Разделение событий и эффектов.](/learn/separating-events-from-effects)

</Solution>

#### Исправление переключателя соединения {/*fix-a-connection-switch*/}

В этом примере сервис чата в `chat.js` предоставляет два разных API: `createEncryptedConnection` и `createUnencryptedConnection`. Корневой компонент `App` позволяет пользователю выбрать, использовать ли шифрование, а затем передает соответствующий метод API дочернему компоненту `ChatRoom` в виде пропса `createConnection`.

Обратите внимание, что изначально в консоли отображаются сообщения о том, что соединение не зашифровано. Попробуйте включить флажок: ничего не произойдет. Однако, если после этого вы смените выбранную комнату, чат переподключится *и* включит шифрование (как вы увидите из сообщений в консоли). Это ошибка. Исправьте ошибку так, чтобы переключение флажка *также* вызывало переподключение чата.

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
          createUnconventionalConnection
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

Если вы уберете подавление линтера, вы увидите ошибку линтера. Проблема в том, что `createConnection` — это пропс, то есть реактивное значение. Оно может меняться со временем! (И действительно, должно — когда пользователь ставит галочку, родительский компонент передает другое значение пропса `createConnection`.) Поэтому оно должно быть зависимостью. Включите его в список, чтобы исправить ошибку:

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

То, что `createConnection` является зависимостью, верно. Однако этот код немного хрупкий, поскольку кто-то может отредактировать компонент `App`, чтобы передать в качестве значения этого пропса инлайн-функцию. В этом случае ее значение будет отличаться при каждом перерисовке компонента `App`, поэтому эффект может слишком часто пересинхронизироваться. Чтобы избежать этого, вы можете передать вместо этого `isEncrypted`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

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

В этой версии компонент `App` передает булев пропс вместо функции. Внутри эффекта вы решаете, какую функцию использовать. Поскольку `createEncryptedConnection` и `createUnencryptedConnection` объявлены вне компонента, они не являются реактивными и не нуждаются в зависимостях. Вы узнаете больше об этом в разделе [Удаление зависимостей эффекта.](/learn/removing-effect-dependencies)

</Solution>

#### Заполнение цепочки выпадающих списков {/*populate-a-chain-of-select-boxes*/}

В этом примере есть два выпадающих списка. Один позволяет пользователю выбрать планету. Другой позволяет пользователю выбрать место *на этой планете*. Второй список пока не работает. Ваша задача — добавить код, который будет заполнять его местами на выбранной планете.

Посмотрите, как работает первый выпадающий список. Он заполняет состояние `planetList` результатом вызова API `"/planets"`. Идентификатор выбранной планеты хранится в переменной состояния `planetId`. Вам нужно найти место, куда добавить дополнительный код, чтобы переменная состояния `placeList` заполнялась результатом вызова API `"/planets/" + planetId + "/places"`.

Если вы сделаете это правильно, выбор планеты должен заполнить список мест. Изменение планеты должно изменить список мест.

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

Существует два независимых процесса синхронизации:

- Первый выпадающий список синхронизирован с удаленным списком планет.
- Второй выпадающий список синхронизирован с удаленным списком мест для текущего `planetId`.

Поэтому имеет смысл описывать их как два отдельных эффекта. Вот пример того, как вы можете это сделать:

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
      // Пока ничего не выбрано в первом списке
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

Этот код немного повторяется. Однако это не лучшая причина для объединения его в один эффект! Если бы вы это сделали, вам пришлось бы объединить обе зависимости эффекта в один список, и тогда изменение планеты привело бы к повторному получению списка всех планет. Эффекты — это не инструмент для повторного использования кода.

Вместо этого, чтобы уменьшить повторение, вы можете извлечь некоторую логику в пользовательский хук, такой как `useSelectOptions` ниже:

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

Проверьте вкладку `useSelectOptions.js` в песочнице, чтобы увидеть, как это работает. В идеале, большинство эффектов в вашем приложении в конечном итоге должны быть заменены пользовательскими хуками, написанными вами или сообществом. Пользовательские хуки скрывают логику синхронизации, поэтому вызывающий компонент не знает об эффекте. По мере продолжения работы над приложением вы будете разрабатывать набор хуков на выбор, и в конечном итоге вам не придется часто писать эффекты в своих компонентах.

</Solution>

</Challenges>