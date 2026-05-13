---
title: 'Жизненный цикл реактивных эффектов'
---

<Intro>

Эффекты имеют жизненный цикл, отличный от жизненного цикла компонентов. Компоненты могут смонтироваться, обновиться или размонтироваться. Эффект может делать только две вещи: начать что-то синхронизировать, а затем остановить это. Этот цикл может происходить несколько раз, если ваш эффект зависит от пропсов и состояния, которые со временем меняются. React предоставляет правило линтера, чтобы проверить, правильно ли вы указали зависимости вашего эффекта. Это позволяет вашему эффекту синхронизироваться с последними пропсами и состоянием.

</Intro>

<YouWillLearn>

- Чем жизненный цикл эффекта отличается от жизненного цикла компонента
- Как думать о каждом отдельном эффекте в изоляции
- Когда вашему эффекту нужно повторно синхронизироваться и почему
- Как определяются зависимости вашего эффекта
- Что значит, когда значение реактивное
- Что означает пустой массив зависимостей
- Как React проверяет правильность ваших зависимостей с помощью линтера
- Что делать, если вы не согласны с линтером

</YouWillLearn>


## Жизненный цикл Effect {/*the-lifecycle-of-an-effect*/}

Каждый React-компонент проходит через один и тот же жизненный цикл:

- Компонент _монтируется_, когда он добавляется на экран.
- Компонент _обновляется_, когда он получает новые пропсы или состояние, обычно в ответ на взаимодействие.
- Компонент _размонтируется_, когда он удаляется с экрана.

**Это хороший способ думать о компонентах, но _не_ об Effects.** Вместо этого попробуйте думать о каждом Effect независимо от жизненного цикла вашего компонента. Effect описывает, как [синхронизировать внешнюю систему](/learn/synchronizing-with-effects) с текущими пропсами и состоянием. По мере изменения вашего кода синхронизация должна будет происходить чаще или реже.

Чтобы проиллюстрировать это, рассмотрим этот Effect, соединяющий ваш компонент с сервером чата:

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

Тело вашего Effect указывает, как **начать синхронизацию**:

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Функция очистки, возвращаемая вашим Effect, указывает, как **остановить синхронизацию**:

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Интуитивно вы можете подумать, что React будет **начинать синхронизацию**, когда ваш компонент монтируется, и **останавливать синхронизацию**, когда ваш компонент размонтируется. Однако это еще не конец истории! Иногда может также потребоваться **запускать и останавливать синхронизацию несколько раз**, пока компонент остается смонтированным.

Давайте посмотрим, _почему_ это необходимо, _когда_ это происходит и _как_ вы можете управлять этим поведением.

<Note>

Некоторые Effects вообще не возвращают функцию очистки. [Чаще всего](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development), вам захочется вернуть ее, но если вы этого не сделаете, React будет вести себя так, как если бы вы вернули пустую функцию очистки.

</Note>

### Почему синхронизация может потребоваться более одного раза {/*why-synchronization-may-need-to-happen-more-than-once*/}

Представьте, что этот компонент `ChatRoom` получает пропс `roomId`, который пользователь выбирает в выпадающем списке. Допустим, изначально пользователь выбирает комнату `"general"` в качестве `roomId`. Ваше приложение отображает комнату чата `"general"`:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

После отображения пользовательского интерфейса React запустит ваш Effect, чтобы **начать синхронизацию**. Он подключается к комнате `"general"`:

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

Подумайте о том, что должно произойти дальше. Пользователь видит, что `"travel"` — это выбранная комната чата в пользовательском интерфейсе. Однако Effect, который работал в прошлый раз, все еще подключен к комнате `"general"`. **Пропс `roomId` изменился, поэтому то, что сделал ваш Effect тогда (подключение к комнате `"general"`), больше не соответствует пользовательскому интерфейсу.**

В этот момент вы хотите, чтобы React сделал две вещи:

1. Остановить синхронизацию со старым `roomId` (отключиться от комнаты `"general"`)
2. Начать синхронизацию с новым `roomId` (подключиться к комнате `"travel"`)

**К счастью, вы уже научили React делать и то, и другое!** Тело вашего Effect указывает, как начать синхронизацию, а функция очистки указывает, как остановить синхронизацию. Все, что нужно сделать React, — это вызвать их в правильном порядке и с правильными пропсами и состоянием. Давайте посмотрим, как именно это происходит.

### Как React повторно синхронизирует ваш Effect {/*how-react-re-synchronizes-your-effect*/}

Вспомните, что ваш компонент `ChatRoom` получил новое значение для своего пропса `roomId`. Раньше это было `"general"`, а теперь это `"travel"`. React необходимо повторно синхронизировать ваш Effect, чтобы повторно подключить вас к другой комнате.

Чтобы **остановить синхронизацию**, React вызовет функцию очистки, которую ваш Effect вернул после подключения к комнате `"general"`. Поскольку `roomId` был равен `"general"`, функция очистки отключается от комнаты `"general"`:

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

Затем React запустит Effect, который вы предоставили во время этого рендера. На этот раз `roomId` равен `"travel"`, поэтому он **начнет синхронизацию** с комнатой чата `"travel"` (до тех пор, пока в конечном итоге не будет вызвана и его функция очистки):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Подключается к комнате "travel"
    connection.connect();
    // ...
```

Благодаря этому вы теперь подключены к той же комнате, которую пользователь выбрал в пользовательском интерфейсе. Катастрофы удалось избежать!

Каждый раз после того, как ваш компонент перерендеривается с другим `roomId`, ваш Effect будет повторно синхронизироваться. Например, допустим, пользователь меняет `roomId` с `"travel"` на `"music"`. React снова **остановит синхронизацию** вашего Effect, вызвав его функцию очистки (отключив вас от комнаты `"travel"`). Затем он **начнет синхронизацию** снова, запустив его тело с новым пропсом `roomId` (подключив вас к комнате `"music"`).

Наконец, когда пользователь переходит на другой экран, `ChatRoom` размонтируется. Теперь вообще нет необходимости оставаться подключенным. React **остановит синхронизацию** вашего Effect в последний раз и отключит вас от комнаты чата `"music"`.

### Размышления с точки зрения Effect {/*thinking-from-the-effects-perspective*/}

Давайте подведем итоги всего, что произошло с точки зрения компонента `ChatRoom`:

1. `ChatRoom` смонтировался с `roomId`, установленным в `"general"`
1. `ChatRoom` обновился с `roomId`, установленным в `"travel"`
1. `ChatRoom` обновился с `roomId`, установленным в `"music"`
1. `ChatRoom` размонтировался

В течение каждого из этих моментов жизненного цикла компонента ваш Effect делал разные вещи:

1. Ваш Effect подключился к комнате `"general"`
1. Ваш Effect отключился от комнаты `"general"` и подключился к комнате `"travel"`
1. Ваш Effect отключился от комнаты `"travel"` и подключился к комнате `"music"`
1. Ваш Effect отключился от комнаты `"music"`

Теперь давайте подумаем о том, что произошло с точки зрения самого Effect:

```js
  useEffect(() => {
    // Ваш Effect подключился к комнате, указанной с помощью roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...пока он не отключился
      connection.disconnect();
    };
  }, [roomId]);
```

Структура этого кода может вдохновить вас увидеть произошедшее как последовательность неперекрывающихся периодов времени:

1. Ваш Effect подключился к комнате `"general"` (пока не отключился)
1. Ваш Effect подключился к комнате `"travel"` (пока не отключился)
1. Ваш Effect подключился к комнате `"music"` (пока не отключился)

Раньше вы думали с точки зрения компонента. Когда вы смотрели с точки зрения компонента, было заманчиво думать об Effects как о «обратных вызовах» или «событиях жизненного цикла», которые срабатывают в определенное время, например «после рендера» или «перед размонтированием». Этот способ мышления очень быстро усложняется, поэтому его лучше избегать.

**Вместо этого всегда сосредотачивайтесь на одном цикле запуска/остановки за раз. Не должно иметь значения, монтируется, обновляется или размонтируется компонент. Все, что вам нужно сделать, — это описать, как начать синхронизацию и как ее остановить. Если вы сделаете это хорошо, ваш Effect будет устойчив к запуску и остановке столько раз, сколько потребуется.**

Это может напомнить вам, как вы не думаете о том, монтируется или обновляется компонент, когда вы пишете логику рендеринга, которая создает JSX. Вы описываете, что должно быть на экране, а React [выясняет остальное.](/learn/reacting-to-input-with-state)

### Как React проверяет, что ваш Effect может повторно синхронизироваться {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Вот живой пример, с которым вы можете поиграть. Нажмите «Открыть чат», чтобы смонтировать компонент `ChatRoom`:

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
  // Реальная реализация на самом деле подключится к серверу
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

Обратите внимание, что когда компонент монтируется в первый раз, вы видите три журнала:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(только для разработки)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(только для разработки)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

Первые два журнала предназначены только для разработки. При разработке React всегда переустанавливает каждый компонент один раз.

**React проверяет, что ваш Effect может повторно синхронизироваться, заставляя его делать это немедленно при разработке.** Это может напомнить вам, как вы открываете дверь и закрываете ее лишний раз, чтобы проверить, работает ли дверной замок. React запускает и останавливает ваш Effect один дополнительный раз при разработке, чтобы проверить, [вы хорошо реализовали его очистку.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Основная причина, по которой ваш Effect будет повторно синхронизироваться на практике, заключается в том, что некоторые данные, которые он использует, изменились. В песочнице выше измените выбранную комнату чата. Обратите внимание, как при изменении `roomId` ваш Effect повторно синхронизируется.

Однако есть и более необычные случаи, когда повторная синхронизация необходима. Например, попробуйте отредактировать `serverUrl` в песочнице выше, пока чат открыт. Обратите внимание, как Effect повторно синхронизируется в ответ на ваши изменения в коде. В будущем React может добавить больше функций, которые полагаются на повторную синхронизацию.

### Как React узнает, что ему нужно повторно синхронизировать Effect {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Возможно, вам интересно, как React узнал, что вашему Effect необходимо повторно синхронизироваться после изменения `roomId`. Это потому, что *вы сказали React*, что его код зависит от `roomId`, включив его в [список зависимостей:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)

```js {1,3,8}
function ChatRoom({ roomId }) { // Пропс roomId может меняться со временем
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Этот Effect читает roomId 
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Поэтому вы говорите React, что этот Effect «зависит от» roomId
  // ...
```

Вот как это работает:

1. Вы знали, что `roomId` — это пропс, а это значит, что он может меняться со временем.
2. Вы знали, что ваш Effect читает `roomId` (поэтому его логика зависит от значения, которое может измениться позже).
3. Вот почему вы указали его в качестве зависимости вашего Effect (чтобы он повторно синхронизировался при изменении `roomId`).

Каждый раз после того, как ваш компонент перерендеривается, React будет смотреть на массив зависимостей, который вы передали. Если какое-либо из значений в массиве отличается от значения в том же месте, которое вы передали во время предыдущего рендера, React повторно синхронизирует ваш Effect.

Например, если вы передали `["general"]` во время начального рендера, а позже вы передали `["travel"]` во время следующего рендера, React сравнит `"general"` и `"travel"`. Это разные значения (по сравнению с [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), поэтому React повторно синхронизирует ваш Effect. С другой стороны, если ваш компонент перерендеривается, но `roomId` не изменился, ваш Effect останется подключенным к той же комнате.


### Каждый эффект представляет собой отдельный процесс синхронизации {/*each-effect-represents-a-separate-synchronization-process*/}

Не добавляйте не связанную логику в ваш Effect только потому, что эта логика должна выполняться одновременно с Effect, который вы уже написали. Например, предположим, вы хотите отправить событие аналитики, когда пользователь посещает комнату. У вас уже есть Effect, который зависит от `roomId`, поэтому у вас может возникнуть соблазн добавить вызов аналитики туда:

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

Но представьте, что позже вы добавите еще одну зависимость к этому Effect, которой необходимо восстановить соединение. Если этот Effect повторно синхронизируется, он также вызовет `logVisit(roomId)` для той же комнаты, что вы не планировали. Логирование посещения **— это отдельный процесс** от подключения. Напишите их как два отдельных Effect:

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

**Каждый Effect в вашем коде должен представлять собой отдельный и независимый процесс синхронизации.**

В приведенном выше примере удаление одного Effect не сломает логику другого Effect. Это хороший признак того, что они синхронизируют разные вещи, и поэтому имело смысл разделить их. С другой стороны, если вы разделите целостный фрагмент логики на отдельные Effects, код может выглядеть «чище», но его будет [сложнее поддерживать.](/learn/you-might-not-need-an-effect#chains-of-computations) Вот почему вы должны подумать, являются ли процессы одинаковыми или отдельными, а не о том, выглядит ли код чище.


## Эффекты «реагируют» на реактивные значения {/*effects-react-to-reactive-values*/}

Ваш Effect считывает две переменные (`serverUrl` и `roomId`), но вы указали только `roomId` в качестве зависимости:

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

Почему `serverUrl` не нужно указывать в качестве зависимости?

Это потому, что `serverUrl` никогда не меняется из-за повторного рендеринга. Он всегда один и тот же, независимо от того, сколько раз компонент перерендеривается и почему. Поскольку `serverUrl` никогда не меняется, не имело бы смысла указывать его в качестве зависимости. В конце концов, зависимости делают что-то только тогда, когда они меняются со временем!

С другой стороны, `roomId` может быть другим при повторном рендеринге. **Пропсы, state и другие значения, объявленные внутри компонента, являются _реактивными_, потому что они вычисляются во время рендеринга и участвуют в потоке данных React.**

Если бы `serverUrl` был переменной state, он был бы реактивным. Реактивные значения должны быть включены в зависимости:

```js {2,5,10}
function ChatRoom({ roomId }) { // Пропсы меняются со временем
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State может меняться со временем

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Ваш Effect считывает пропсы и state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Поэтому вы говорите React, что этот Effect «зависит от» пропсов и state
  // ...
}
```

Включив `serverUrl` в качестве зависимости, вы гарантируете, что Effect повторно синхронизируется после его изменения.

Попробуйте изменить выбранную комнату чата или отредактировать URL-адрес сервера в этой песочнице:

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

Всякий раз, когда вы меняете реактивное значение, такое как `roomId` или `serverUrl`, Effect повторно подключается к серверу чата.

### Что означает Effect с пустыми зависимостями {/*what-an-effect-with-empty-dependencies-means*/}

Что произойдет, если вы переместите и `serverUrl`, и `roomId` за пределы компонента?

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

Теперь код вашего Effect не использует *никаких* реактивных значений, поэтому его зависимости могут быть пустыми (`[]`).

Если смотреть с точки зрения компонента, пустой массив зависимостей `[]` означает, что этот Effect подключается к комнате чата только при монтировании компонента и отключается только при размонтировании компонента. (Имейте в виду, что React все равно [повторно синхронизирует его дополнительное время](#how-react-verifies-that-your-effect-can-re-synchronize) в процессе разработки, чтобы проверить вашу логику.)

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

Однако, если вы [подумаете с точки зрения Effect,](#thinking-from-the-effects-perspective) вам вообще не нужно думать о монтировании и размонтировании. Важно то, что вы указали, что ваш Effect делает для запуска и остановки синхронизации. Сегодня у него нет реактивных зависимостей. Но если вы когда-нибудь захотите, чтобы пользователь менял `roomId` или `serverUrl` со временем (и они станут реактивными), код вашего Effect не изменится. Вам нужно будет только добавить их в зависимости.

### Все переменные, объявленные в теле компонента, являются реактивными {/*all-variables-declared-in-the-component-body-are-reactive*/}

Пропсы и state — не единственные реактивные значения. Значения, которые вы вычисляете из них, также являются реактивными. Если пропсы или state меняются, ваш компонент перерендерится, и значения, вычисленные из них, также изменятся. Вот почему все переменные из тела компонента, используемые Effect, должны быть в списке зависимостей Effect.

Предположим, что пользователь может выбрать сервер чата в раскрывающемся списке, но он также может настроить сервер по умолчанию в настройках. Предположим, вы уже поместили state настроек в [контекст](/learn/scaling-up-with-reducer-and-context), поэтому вы считываете `settings` из этого контекста. Теперь вы вычисляете `serverUrl` на основе выбранного сервера из пропсов и сервера по умолчанию:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId is reactive
  const settings = useContext(SettingsContext); // settings is reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Ваш Effect считывает roomId и serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Поэтому ему нужно повторно синхронизироваться, когда что-либо из них меняется!
  // ...
}
```

В этом примере `serverUrl` не является пропсом или переменной state. Это обычная переменная, которую вы вычисляете во время рендеринга. Но она вычисляется во время рендеринга, поэтому она может измениться из-за повторного рендеринга. Вот почему она реактивная.

**Все значения внутри компонента (включая пропсы, state и переменные в теле вашего компонента) являются реактивными. Любое реактивное значение может измениться при повторном рендеринге, поэтому вам нужно включить реактивные значения в качестве зависимостей Effect.**

Другими словами, Effects «реагируют» на все значения из тела компонента.

<DeepDive>

#### Могут ли глобальные или изменяемые значения быть зависимостями? {/*can-global-or-mutable-values-be-dependencies*/}

Изменяемые значения (включая глобальные переменные) не являются реактивными.

**Изменяемое значение, такое как [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname), не может быть зависимостью.** Оно изменяемое, поэтому может измениться в любое время полностью за пределами потока данных рендеринга React. Изменение его не вызовет повторный рендеринг вашего компонента. Поэтому, даже если вы указали его в зависимостях, React *не будет знать*, чтобы повторно синхронизировать Effect при его изменении. Это также нарушает правила React, потому что чтение изменяемых данных во время рендеринга (когда вы вычисляете зависимости) нарушает [чистоту рендеринга.](/learn/keeping-components-pure) Вместо этого вы должны считывать и подписываться на внешнее изменяемое значение с помощью [`useSyncExternalStore`.](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)

**Изменяемое значение, такое как [`ref.current`](/reference/react/useRef#reference) или вещи, которые вы считываете из него, также не может быть зависимостью.** Объект ref, возвращаемый `useRef`, сам по себе может быть зависимостью, но его свойство `current` намеренно изменяемое. Это позволяет вам [отслеживать что-то, не вызывая повторный рендеринг.](/learn/referencing-values-with-refs) Но поскольку его изменение не вызывает повторный рендеринг, это не реактивное значение, и React не будет знать, чтобы повторно запустить ваш Effect при его изменении.

Как вы узнаете ниже на этой странице, линтер будет проверять эти проблемы автоматически.

</DeepDive>

### React проверяет, что вы указали каждое реактивное значение в качестве зависимости {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Если ваш линтер [настроен для React,](/learn/editor-setup#linting) он проверит, что каждое реактивное значение, используемое кодом вашего Effect, объявлено в качестве его зависимости. Например, это ошибка линтинга, потому что и `roomId`, и `serverUrl` являются реактивными:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Что-то здесь не так!

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

Это может выглядеть как ошибка React, но на самом деле React указывает на ошибку в вашем коде. И `roomId`, и `serverUrl` могут меняться со временем, но вы забываете повторно синхронизировать свой Effect при их изменении. Вы останетесь подключенными к исходному `roomId` и `serverUrl` даже после того, как пользователь выберет другие значения в пользовательском интерфейсе.

Чтобы исправить ошибку, следуйте предложению линтера и укажите `roomId` и `serverUrl` в качестве зависимостей вашего Effect:

```js {9}
function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
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

В некоторых случаях React *знает*, что значение никогда не меняется, даже если оно объявлено внутри компонента. Например, функция [`set`](/reference/react/useState#setstate), возвращаемая из `useState`, и объект ref, возвращаемый из [`useRef`](/reference/react/useRef), являются *стабильными* — гарантируется, что они не изменятся при повторном рендеринге. Стабильные значения не являются реактивными, поэтому вы можете опустить их из списка. Их включение разрешено: они не изменятся, поэтому это не имеет значения.

</Note>


### Что делать, когда вы не хотите повторной синхронизации {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

В предыдущем примере вы исправили ошибку линтера, перечислив `roomId` и `serverUrl` в качестве зависимостей.

**Однако вместо этого вы можете «доказать» линтеру, что эти значения не являются реактивными,** то есть что они *не могут* измениться в результате повторного рендеринга. Например, если `serverUrl` и `roomId` не зависят от рендеринга и всегда имеют одни и те же значения, вы можете переместить их за пределы компонента. Теперь они не должны быть зависимостями:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

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

Вы также можете переместить их *внутри Effect.* Они не вычисляются во время рендеринга, поэтому они не являются реактивными:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Все зависимости объявлены
  // ...
}
```

**Эффекты — это реактивные блоки кода.** Они повторно синхронизируются, когда изменяются значения, которые вы читаете внутри них. В отличие от обработчиков событий, которые запускаются только один раз за взаимодействие, Эффекты запускаются всякий раз, когда необходима синхронизация.

**Вы не можете «выбрать» свои зависимости.** Ваши зависимости должны включать все [реактивные значения](#all-variables-declared-in-the-component-body-are-reactive), которые вы читаете в Effect. Линтер обеспечивает это. Иногда это может приводить к проблемам, таким как бесконечные циклы, и к тому, что ваш Effect слишком часто повторно синхронизируется. Не исправляйте эти проблемы, подавляя линтер! Вместо этого попробуйте следующее:

* **Убедитесь, что ваш Effect представляет собой независимый процесс синхронизации.** Если ваш Effect ничего не синхронизирует, [он может быть ненужным.](/learn/you-might-not-need-an-effect) Если он синхронизирует несколько независимых вещей, [разделите его.](#each-effect-represents-a-separate-synchronization-process)

* **Если вы хотите прочитать последнее значение пропсов или состояния, не «реагируя» на него и не повторно синхронизируя Effect,** вы можете разделить свой Effect на реактивную часть (которую вы сохраните в Effect) и нереактивную часть (которую вы извлечете в то, что называется _Effect Event_). [Прочтите о разделении событий и эффектов.](/learn/separating-events-from-effects)

* **Избегайте полагаться на объекты и функции в качестве зависимостей.** Если вы создаете объекты и функции во время рендеринга, а затем читаете их из Effect, они будут разными при каждом рендеринге. Это приведет к повторной синхронизации вашего Effect каждый раз. [Прочтите больше об удалении ненужных зависимостей из Effects.](/learn/removing-effect-dependencies)

<Pitfall>

Линтер — ваш друг, но его возможности ограничены. Линтер знает только, когда зависимости *неправильные*. Он не знает *лучшего* способа решить каждый случай. Если линтер предлагает зависимость, но ее добавление вызывает цикл, это не означает, что линтером следует пренебречь. Вам нужно изменить код внутри (или за пределами) Effect, чтобы это значение не было реактивным и не *должно* было быть зависимостью.

Если у вас есть существующая кодовая база, у вас могут быть некоторые Effects, которые подавляют линтер следующим образом:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Избегайте подавления линтера таким образом:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

На [следующих](/learn/separating-events-from-effects) [страницах](/learn/removing-effect-dependencies) вы узнаете, как исправить этот код, не нарушая правил. Это всегда стоит исправить!

</Pitfall>

<Recap>

- Компоненты могут монтироваться, обновляться и размонтироваться.
- Каждый Effect имеет отдельный жизненный цикл от окружающего компонента.
- Каждый Effect описывает отдельный процесс синхронизации, который может *запускаться* и *останавливаться*.
- Когда вы пишете и читаете Effects, думайте с точки зрения каждого отдельного Effect (как начать и остановить синхронизацию), а не с точки зрения компонента (как он монтируется, обновляется или размонтируется).
- Значения, объявленные внутри тела компонента, являются «реактивными».
- Реактивные значения должны повторно синхронизировать Effect, потому что они могут меняться со временем.
- Линтер проверяет, что все реактивные значения, используемые внутри Effect, указаны в качестве зависимостей.
- Все ошибки, отмеченные линтером, являются законными. Всегда есть способ исправить код, чтобы не нарушать правила.

</Recap>

<Challenges>

#### Исправьте повторное подключение при каждом нажатии клавиши {/*fix-reconnecting-on-every-keystroke*/}

В этом примере компонент `ChatRoom` подключается к чат-комнате при монтировании компонента, отключается при размонтировании и повторно подключается при выборе другой чат-комнаты. Это поведение корректно, поэтому вам нужно сохранить его работоспособность.

Однако есть проблема. Всякий раз, когда вы вводите текст в поле ввода сообщений внизу, `ChatRoom` *также* повторно подключается к чату. (Вы можете заметить это, очистив консоль и набрав текст в поле ввода.) Исправьте проблему, чтобы этого не происходило.

<Hint>

Возможно, вам потребуется добавить массив зависимостей для этого Effect. Какие зависимости должны быть там?

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

У этого Effect вообще не было массива зависимостей, поэтому он повторно синхронизировался после каждого повторного рендеринга. Сначала добавьте массив зависимостей. Затем убедитесь, что каждое реактивное значение, используемое Effect, указано в массиве. Например, `roomId` является реактивным (потому что это пропс), поэтому его следует включить в массив. Это гарантирует, что при выборе пользователем другой комнаты чат переподключится. С другой стороны, `serverUrl` определяется за пределами компонента. Вот почему его не нужно включать в массив.

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

В этом примере Effect подписывается на событие [`pointermove`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointermove_event) окна, чтобы переместить розовую точку на экране. Попробуйте навести курсор на область предварительного просмотра (или коснуться экрана, если вы используете мобильное устройство) и посмотрите, как розовая точка следует за вашим движением.

Также есть флажок. Установка флажка переключает переменную состояния `canMove`, но эта переменная состояния нигде не используется в коде. Ваша задача — изменить код так, чтобы, когда `canMove` имеет значение `false` (флажок снят), точка перестала двигаться. После того, как вы снова включите флажок (и установите для `canMove` значение `true`), поле снова должно следовать за движением. Другими словами, будет ли точка двигаться или нет, должно оставаться синхронизированным с тем, установлен ли флажок.

<Hint>

Вы не можете объявить Effect условно. Однако код внутри Effect может использовать условия!

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

В качестве альтернативы вы можете обернуть логику *подписки на события* в условие `if (canMove) { ... }`:

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

В обоих этих случаях `canMove` является реактивной переменной, которую вы читаете внутри Effect. Вот почему ее необходимо указать в списке зависимостей Effect. Это гарантирует, что Effect повторно синхронизируется после каждого изменения ее значения.

</Solution>


#### Исследуйте ошибку с устаревшим значением {/*investigate-a-stale-value-bug*/}

В этом примере розовая точка должна двигаться, когда установлен флажок, и должна перестать двигаться, когда флажок снят. Логика для этого уже реализована: обработчик события `handleMove` проверяет переменную состояния `canMove`.

Однако по какой-то причине переменная состояния `canMove` внутри `handleMove` выглядит «устаревшей»: она всегда `true`, даже после того, как вы снимете флажок. Как это возможно? Найдите ошибку в коде и исправьте ее.

<Hint>

Если вы видите, что правило линтера подавлено, удалите подавление! Именно там обычно и находятся ошибки.

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

Проблема с исходным кодом заключалась в подавлении линтера зависимостей. Если вы удалите подавление, вы увидите, что этот эффект зависит от функции `handleMove`. Это имеет смысл: `handleMove` объявляется внутри тела компонента, что делает его реактивным значением. Каждое реактивное значение должно быть указано в качестве зависимости, иначе оно со временем может устареть!

Автор исходного кода «обманул» React, заявив, что эффект не зависит (`[]`) от каких-либо реактивных значений. Вот почему React не пересинхронизировал эффект после изменения `canMove` (и `handleMove` вместе с ним). Поскольку React не пересинхронизировал эффект, `handleMove`, прикрепленный в качестве слушателя, является функцией `handleMove`, созданной во время начального рендеринга. Во время начального рендеринга `canMove` было равно `true`, поэтому `handleMove` из начального рендеринга навсегда будет видеть это значение.

**Если вы никогда не подавляете линтер, вы никогда не увидите проблем с устаревшими значениями.** Есть несколько способов решить эту ошибку, но всегда следует начинать с удаления подавления линтера. Затем измените код, чтобы исправить ошибку линтинга.

Вы можете изменить зависимости эффекта на `[handleMove]`, но поскольку это будет вновь определенная функция для каждого рендеринга, вы можете просто удалить массив зависимостей вообще. Тогда эффект *будет* пересинхронизироваться после каждого повторного рендеринга:

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

Это решение работает, но оно не идеально. Если вы поместите `console.log('Resubscribing')` внутри эффекта, вы заметите, что он переподписывается после каждого повторного рендеринга. Переподписка происходит быстро, но все равно было бы неплохо избежать этого так часто.

Лучшим решением было бы переместить функцию `handleMove` *внутрь* эффекта. Тогда `handleMove` не будет реактивным значением, и ваш эффект не будет зависеть от функции. Вместо этого ему нужно будет зависеть от `canMove`, которое ваш код теперь считывает внутри эффекта. Это соответствует желаемому поведению, поскольку ваш эффект теперь будет оставаться синхронизированным со значением `canMove`:

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

Попробуйте добавить `console.log('Resubscribing')` внутри тела эффекта и заметьте, что теперь он переподписывается только при переключении флажка (изменение `canMove`) или редактировании кода. Это делает его лучше, чем предыдущий подход, который всегда переподписывался.

Вы узнаете более общий подход к этому типу проблем в [Разделение событий и эффектов.](/learn/separating-events-from-effects)
</Solution>


#### Исправьте переключение соединения {/*fix-a-connection-switch*/}

В этом примере служба чата в `chat.js` предоставляет два разных API: `createEncryptedConnection` и `createUnencryptedConnection`. Корневой компонент `App` позволяет пользователю выбрать, использовать ли шифрование или нет, а затем передает соответствующий метод API дочернему компоненту `ChatRoom` в качестве пропса `createConnection`.

Обратите внимание, что изначально в консоли отображается сообщение о том, что соединение не зашифровано. Попробуйте переключить флажок: ничего не произойдет. Однако, если после этого вы измените выбранную комнату, чат переподключится *и* включит шифрование (как вы увидите из сообщений в консоли). Это баг. Исправьте баг, чтобы переключение флажка *также* приводило к переподключению чата.

<Hint>

Подавление линтера всегда подозрительно. Может ли это быть багом?

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
        Выберите комнату чата:{' '}
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
        Включить шифрование
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

Если вы удалите подавление линтера, вы увидите ошибку линтинга. Проблема в том, что `createConnection` — это пропс, поэтому это реактивное значение. Оно может меняться со временем! (И действительно, должно — когда пользователь ставит галочку, родительский компонент передает другое значение пропса `createConnection`.) Вот почему он должен быть зависимостью. Включите его в список, чтобы исправить баг:

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
        Выберите комнату чата:{' '}
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
        Включить шифрование
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

Правильно, что `createConnection` является зависимостью. Однако этот код немного хрупкий, потому что кто-то может отредактировать компонент `App`, чтобы передать встроенную функцию в качестве значения этого пропса. В этом случае его значение будет разным каждый раз, когда компонент `App` перерендеривается, поэтому эффект может пересинхронизироваться слишком часто. Чтобы избежать этого, вы можете передать `isEncrypted`:

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
        Выберите комнату чата:{' '}
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
        Включить шифрование
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

В этой версии компонент `App` передает логический пропс вместо функции. Внутри Effect вы решаете, какую функцию использовать. Поскольку и `createEncryptedConnection`, и `createUnencryptedConnection` объявлены за пределами компонента, они не являются реактивными и не нуждаются в зависимостях. Вы узнаете больше об этом в [Удаление зависимостей Effect.](/learn/removing-effect-dependencies)

</Solution>


#### Заполнение цепочки выпадающих списков {/*populate-a-chain-of-select-boxes*/}

В этом примере есть два выпадающих списка. Один выпадающий список позволяет пользователю выбрать планету. Другой выпадающий список позволяет пользователю выбрать место _на этой планете_. Второй список пока не работает. Ваша задача — сделать так, чтобы он отображал места на выбранной планете.

Посмотрите, как работает первый выпадающий список. Он заполняет состояние `planetList` результатом вызова API `"/planets"`. ID выбранной в данный момент планеты хранится в переменной состояния `planetId`. Вам нужно найти, куда добавить дополнительный код, чтобы переменная состояния `placeList` заполнялась результатом вызова API `"/planets/" + planetId + "/places"`.

Если вы реализуете это правильно, выбор планеты должен заполнять список мест. Изменение планеты должно изменять список мест.

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
        Выберите планету:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Выберите место:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Вы собираетесь: {placeId || '???'} на {planetId || '???'} </p>
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

Есть два независимых процесса синхронизации:

- Первый выпадающий список синхронизирован с удаленным списком планет.
- Второй выпадающий список синхронизирован с удаленным списком мест для текущего `planetId`.

Вот почему имеет смысл описывать их как два отдельных эффекта. Вот пример того, как вы можете это сделать:

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
        Выберите планету:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Выберите место:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Вы собираетесь: {placeId || '???'} на {planetId || '???'} </p>
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

Этот код немного повторяющийся. Однако это не является веской причиной для объединения его в один эффект! Если бы вы это сделали, вам пришлось бы объединить зависимости обоих эффектов в один список, и тогда изменение планеты привело бы к повторной выборке списка всех планет. Эффекты — это не инструмент для повторного использования кода.

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
        Выберите планету:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Выберите место:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Вы собираетесь: {placeId || '...'} на {planetId || '...'} </p>
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

Проверьте вкладку `useSelectOptions.js` в песочнице, чтобы увидеть, как это работает. В идеале, большинство эффектов в вашем приложении должны в конечном итоге быть заменены пользовательскими хуками, будь то написанными вами или сообществом. Пользовательские хуки скрывают логику синхронизации, поэтому вызывающий компонент не знает об эффекте. По мере продолжения работы над своим приложением вы разработаете палитру хуков на выбор, и в конечном итоге вам не придется очень часто писать эффекты в своих компонентах.

</Solution>

</Challenges>