---
title: 'Удаление зависимостей эффектов'
---

<Intro>

Когда вы пишете Effect, линтер проверит, что вы включили каждое реактивное значение (например, пропсы и состояние), которое Effect считывает, в список зависимостей вашего Effect. Это гарантирует, что ваш Effect остается синхронизированным с последними пропсами и состоянием вашего компонента. Необязательные зависимости могут привести к тому, что ваш Effect будет запускаться слишком часто или даже создаст бесконечный цикл. Следуйте этому руководству, чтобы просмотреть и удалить ненужные зависимости из ваших Effects.

</Intro>

<YouWillLearn>

- Как исправить бесконечные циклы зависимостей Effect
- Что делать, когда вы хотите удалить зависимость
- Как прочитать значение из вашего Effect, не «реагируя» на него
- Как и почему следует избегать зависимостей от объектов и функций
- Почему подавление линтера зависимостей опасно и что делать вместо этого

</YouWillLearn>

## Зависимости должны соответствовать коду {/*dependencies-should-match-the-code*/}

Когда вы пишете Effect, вы сначала указываете, как [запустить и остановить](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) все, что вы хотите, чтобы ваш Effect делал:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Затем, если вы оставите зависимости Effect пустыми (`[]`), линтер предложит правильные зависимости:

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
  }, []); // <-- Исправьте ошибку здесь!
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

Заполните их в соответствии с тем, что говорит линтер:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Все зависимости объявлены
  // ...
}
```

[Effects «реагируют» на реактивные значения.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Поскольку `roomId` является реактивным значением (оно может измениться из-за повторного рендеринга), линтер проверяет, что вы указали его в качестве зависимости. Если `roomId` получает другое значение, React повторно синхронизирует ваш Effect. Это гарантирует, что чат остается подключенным к выбранной комнате и «реагирует» на раскрывающийся список:

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

### Чтобы удалить зависимость, докажите, что она не является зависимостью {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Обратите внимание, что вы не можете «выбрать» зависимости вашего Effect. Каждое <CodeStep step={2}>реактивное значение</CodeStep>, используемое кодом вашего Effect, должно быть объявлено в списке ваших зависимостей. Список зависимостей определяется окружающим кодом:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Это реактивное значение
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Этот Effect считывает это реактивное значение
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Поэтому вы должны указать это реактивное значение в качестве зависимости вашего Effect
  // ...
}
```

[Реактивные значения](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) включают пропсы и все переменные и функции, объявленные непосредственно внутри вашего компонента. Поскольку `roomId` является реактивным значением, вы не можете удалить его из списка зависимостей. Линтер этого не позволит:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

И линтер будет прав! Поскольку `roomId` может меняться со временем, это приведет к ошибке в вашем коде.

**Чтобы удалить зависимость, «докажите» линтеру, что она *не нуждается* в том, чтобы быть зависимостью.** Например, вы можете переместить `roomId` за пределы вашего компонента, чтобы доказать, что он не является реактивным и не изменится при повторном рендеринге:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Больше не реактивное значение

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Все зависимости объявлены
  // ...
}
```

Теперь, когда `roomId` не является реактивным значением (и не может измениться при повторном рендеринге), ему не нужно быть зависимостью:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

Вот почему теперь вы можете указать [пустой (`[]`) список зависимостей.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Ваш Effect *действительно не* зависит больше ни от какого реактивного значения, поэтому ему *действительно не нужно* перезапускаться, когда изменяются какие-либо пропсы или состояние компонента.

### Чтобы изменить зависимости, сначала измените код {/*to-change-the-dependencies-change-the-code*/}

Вы могли заметить закономерность в вашем рабочем процессе:

1. Сначала вы **изменяете код** вашего Effect или то, как объявляются ваши реактивные значения.
2. Затем вы следуете линтеру и настраиваете зависимости, чтобы **соответствовать коду, который вы изменили.**
3. Если вы не довольны списком зависимостей, вы **возвращаетесь к первому шагу** (и снова меняете код).

Последняя часть важна. **Если вы хотите изменить зависимости, сначала измените окружающий код.** Вы можете думать о списке зависимостей как [о списке всех реактивных значений, используемых кодом вашего Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Вы не *выбираете*, что поместить в этот список. Список *описывает* ваш код. Чтобы изменить список зависимостей, измените код.

Это может показаться решением уравнения. Вы можете начать с цели (например, удалить зависимость), и вам нужно «найти» код, соответствующий этой цели. Не всем нравится решать уравнения, и то же самое можно сказать о написании Effects! К счастью, ниже приведен список распространенных рецептов, которые вы можете попробовать.

<Pitfall>

Если у вас есть существующая кодовая база, у вас могут быть некоторые Effects, которые подавляют линтер, например:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Избегайте подавления линтера таким образом:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Когда зависимости не соответствуют коду, существует очень высокий риск внесения ошибок.** Подавляя линтер, вы «лжете» React о значениях, от которых зависит ваш Effect.

Вместо этого используйте методы, описанные ниже.

</Pitfall>

<DeepDive>

#### Почему подавление линтера зависимостей так опасно? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Подавление линтера приводит к очень неинтуитивным ошибкам, которые трудно найти и исправить. Вот один пример:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

Предположим, вы хотите запустить Effect «только при монтировании». Вы прочитали, что [пустые (`[]`) зависимости](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) делают это, поэтому вы решили игнорировать линтер и принудительно указали `[]` в качестве зависимостей.

Этот счетчик должен был увеличиваться каждую секунду на величину, настраиваемую с помощью двух кнопок. Однако, поскольку вы «солгали» React, что этот Effect ни от чего не зависит, React навсегда продолжает использовать функцию `onTick` из начального рендеринга. [Во время этого рендеринга,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` было `0`, а `increment` было `1`. Вот почему `onTick` из этого рендеринга всегда вызывает `setCount(0 + 1)` каждую секунду, и вы всегда видите `1`. Ошибки, подобные этой, труднее исправить, когда они разбросаны по нескольким компонентам.

Всегда есть лучшее решение, чем игнорирование линтера! Чтобы исправить этот код, вам нужно добавить `onTick` в список зависимостей. (Чтобы убедиться, что интервал настроен только один раз, [сделайте `onTick` событием Effect.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Мы рекомендуем относиться к ошибке линта зависимостей как к ошибке компиляции. Если вы не подавите ее, вы никогда не увидите таких ошибок.** Остальная часть этой страницы документирует альтернативы для этого и других случаев.

</DeepDive>


## Удаление ненужных зависимостей {/*removing-unnecessary-dependencies*/}

Каждый раз, когда вы настраиваете зависимости Effect в соответствии с кодом, смотрите на список зависимостей. Имеет ли смысл, чтобы Effect перезапускался при изменении любой из этих зависимостей? Иногда ответ — «нет»:

* Возможно, вы захотите повторно выполнить *разные части* вашего Effect при разных условиях.
* Возможно, вы захотите только прочитать *последнее значение* какой-либо зависимости, а не «реагировать» на ее изменения.
* Зависимость может меняться слишком часто *непреднамеренно*, потому что это объект или функция.

Чтобы найти правильное решение, вам нужно будет ответить на несколько вопросов о вашем Effect. Давайте рассмотрим их.

### Должен ли этот код переместиться в обработчик событий? {/*should-this-code-move-to-an-event-handler*/}

Первое, о чем вы должны подумать, — это должен ли этот код вообще быть Effect.

Представьте себе форму. При отправке вы устанавливаете переменную состояния `submitted` в `true`. Вам нужно отправить POST-запрос и показать уведомление. Вы поместили эту логику внутрь Effect, который «реагирует» на то, что `submitted` равно `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Избегайте: логика, специфичная для события, внутри Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Позже вы хотите стилизовать сообщение уведомления в соответствии с текущей темой, поэтому вы читаете текущую тему. Поскольку `theme` объявлена в теле компонента, это реактивное значение, поэтому вы добавляете его в качестве зависимости:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Избегайте: логика, специфичная для события, внутри Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ Объявлены все зависимости

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Сделав это, вы внесли ошибку. Представьте, что вы сначала отправляете форму, а затем переключаетесь между темной и светлой темами. `theme` изменится, Effect перезапустится, и поэтому он снова отобразит то же уведомление!

**Проблема здесь в том, что это вообще не должно быть Effect.** Вы хотите отправить этот POST-запрос и показать уведомление в ответ на *отправку формы*, что является конкретным взаимодействием. Чтобы запустить какой-то код в ответ на конкретное взаимодействие, поместите эту логику непосредственно в соответствующий обработчик событий:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Хорошо: логика, специфичная для события, вызывается из обработчиков событий
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

Теперь, когда код находится в обработчике событий, он не является реактивным, поэтому он будет выполняться только тогда, когда пользователь отправляет форму. Узнайте больше о [выборе между обработчиками событий и Effects](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) и [о том, как удалить ненужные Effects.](/learn/you-might-not-need-an-effect)

### Выполняет ли ваш Effect несколько несвязанных действий? {/*is-your-effect-doing-several-unrelated-things*/}

Следующий вопрос, который вы должны себе задать, — выполняет ли ваш Effect несколько несвязанных действий.

Представьте, что вы создаете форму доставки, где пользователю нужно выбрать свой город и область. Вы получаете список `cities` с сервера в соответствии с выбранной `country`, чтобы отобразить их в раскрывающемся списке:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ Объявлены все зависимости

  // ...
```

Это хороший пример [получения данных в Effect.](/learn/you-might-not-need-an-effect#fetching-data) Вы синхронизируете состояние `cities` с сетью в соответствии с пропсом `country`. Вы не можете сделать это в обработчике событий, потому что вам нужно получить данные, как только отобразится `ShippingForm`, и всякий раз, когда изменяется `country` (независимо от того, какое взаимодействие вызывает это).

Теперь давайте предположим, что вы добавляете второй раскрывающийся список для областей города, который должен получать `areas` для выбранного в данный момент `city`. Вы можете начать с добавления второго вызова `fetch` для списка областей внутри того же Effect:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Избегайте: один Effect синхронизирует два независимых процесса
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ Объявлены все зависимости

  // ...
```

Однако, поскольку Effect теперь использует переменную состояния `city`, вам пришлось добавить `city` в список зависимостей. Это, в свою очередь, привело к проблеме: когда пользователь выбирает другой город, Effect перезапустится и вызовет `fetchCities(country)`. В результате вы будете ненужно повторно получать список городов много раз.

**Проблема с этим кодом в том, что вы синхронизируете две разные несвязанные вещи:**

1. Вы хотите синхронизировать состояние `cities` с сетью на основе пропса `country`.
1. Вы хотите синхронизировать состояние `areas` с сетью на основе состояния `city`.

Разделите логику на два Effects, каждый из которых реагирует на пропс, который ему необходимо синхронизировать:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ Объявлены все зависимости

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ Объявлены все зависимости

  // ...
```

Теперь первый Effect перезапускается только в том случае, если изменяется `country`, в то время как второй Effect перезапускается, когда изменяется `city`. Вы разделили их по назначению: два разных действия синхронизируются двумя отдельными Effects. Два отдельных Effects имеют два отдельных списка зависимостей, поэтому они не будут непреднамеренно запускать друг друга.

Окончательный код длиннее исходного, но разделение этих Effects все равно правильно. [Каждый Effect должен представлять собой независимый процесс синхронизации.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) В этом примере удаление одного Effect не нарушает логику другого Effect. Это означает, что они *синхронизируют разные вещи*, и их хорошо разделить. Если вы беспокоитесь о дублировании, вы можете улучшить этот код, [извлекая повторяющуюся логику в пользовательский Hook.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Вы читаете какое-то состояние, чтобы вычислить следующее состояние? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Этот Effect обновляет переменную состояния `messages` с помощью вновь созданного массива каждый раз, когда приходит новое сообщение:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Он использует переменную `messages`, чтобы [создать новый массив](/learn/updating-arrays-in-state), начиная со всех существующих сообщений и добавляя новое сообщение в конец. Однако, поскольку `messages` — это реактивное значение, считываемое Effect, оно должно быть зависимостью:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ Объявлены все зависимости
  // ...
```

И добавление `messages` в качестве зависимости создает проблему.

Каждый раз, когда вы получаете сообщение, `setMessages()` заставляет компонент перерендериваться с новым массивом `messages`, который включает полученное сообщение. Однако, поскольку этот Effect теперь зависит от `messages`, это *также* повторно синхронизирует Effect. Таким образом, каждое новое сообщение заставит чат переподключиться. Пользователю это не понравится!

Чтобы исправить проблему, не читайте `messages` внутри Effect. Вместо этого передайте [функцию обновления](/reference/react/useState#updating-state-based-on-the-previous-state) в `setMessages`:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Объявлены все зависимости
  // ...
```

**Обратите внимание, как ваш Effect вообще не читает переменную `messages`.** Вам нужно только передать функцию обновления, например `msgs => [...msgs, receivedMessage]`. React [помещает вашу функцию обновления в очередь](/learn/queueing-a-series-of-state-updates) и предоставит ей аргумент `msgs` во время следующего рендеринга. Вот почему сам Effect больше не должен зависеть от `messages`. В результате этого исправления получение сообщения чата больше не будет приводить к повторному подключению чата.


### Хотите прочитать значение, не «реагируя» на его изменения? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Этот раздел описывает **экспериментальный API, который ещё не был выпущен** в стабильной версии React.

</Wip>

Предположим, вы хотите воспроизводить звук, когда пользователь получает новое сообщение, если только `isMuted` не равно `true`:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Поскольку ваш Effect теперь использует `isMuted` в своем коде, вам нужно добавить его в зависимости:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ Объявлены все зависимости
  // ...
```

Проблема в том, что каждый раз, когда `isMuted` меняется (например, когда пользователь нажимает переключатель «Muted»), Effect будет повторно синхронизироваться и переподключаться к чату. Это не желаемый пользовательский опыт! (В этом примере даже отключение линтера не сработает — если вы это сделаете, `isMuted` «застрянет» со своим старым значением.)

Чтобы решить эту проблему, вам нужно извлечь логику, которая не должна быть реактивной, из Effect. Вы не хотите, чтобы этот Effect «реагировал» на изменения в `isMuted`. [Переместите эту нереактивную часть логики в Effect Event:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Объявлены все зависимости
  // ...
```

Effect Events позволяют разделить Effect на реактивные части (которые должны «реагировать» на реактивные значения, такие как `roomId`, и их изменения) и нереактивные части (которые только читают свои последние значения, например, `onMessage` читает `isMuted`). **Теперь, когда вы читаете `isMuted` внутри Effect Event, ему не нужно быть зависимостью вашего Effect.** В результате чат не будет переподключаться при включении и выключении настройки «Muted», что решает исходную проблему!

#### Оборачивание обработчика событий из пропсов {/*wrapping-an-event-handler-from-the-props*/}

Вы можете столкнуться с аналогичной проблемой, когда ваш компонент получает обработчик событий в качестве пропа:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ Объявлены все зависимости
  // ...
```

Предположим, что родительский компонент передаёт *другую* функцию `onReceiveMessage` при каждом рендере:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Поскольку `onReceiveMessage` является зависимостью, это приведёт к повторной синхронизации Effect после каждого повторного рендеринга родителя. Это заставит его переподключиться к чату. Чтобы решить эту проблему, оберните вызов в Effect Event:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Объявлены все зависимости
  // ...
```

Effect Events не являются реактивными, поэтому вам не нужно указывать их в качестве зависимостей. В результате чат больше не будет переподключаться, даже если родительский компонент передаёт функцию, которая отличается при каждом повторном рендеринге.

#### Разделение реактивного и нереактивного кода {/*separating-reactive-and-non-reactive-code*/}

В этом примере вы хотите регистрировать посещение каждый раз, когда `roomId` меняется. Вы хотите включить текущий `notificationCount` с каждой записью, но вы *не* хотите, чтобы изменение `notificationCount` вызывало событие регистрации.

Решение состоит в том, чтобы снова разделить нереактивный код на Effect Event:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Объявлены все зависимости
  // ...
}
```

Вы хотите, чтобы ваша логика была реактивной по отношению к `roomId`, поэтому вы читаете `roomId` внутри вашего Effect. Однако вы не хотите, чтобы изменение `notificationCount` регистрировало дополнительное посещение, поэтому вы читаете `notificationCount` внутри Effect Event. [Узнайте больше о чтении последних пропсов и состояния из Effects с помощью Effect Events.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


### Непреднамеренное изменение реактивного значения? {/*does-some-reactive-value-change-unintentionally*/}

Иногда вы *действительно* хотите, чтобы ваш Effect «реагировал» на определенное значение, но это значение меняется чаще, чем вам хотелось бы, и может не отражать никаких фактических изменений с точки зрения пользователя. Например, предположим, что вы создаете объект `options` в теле вашего компонента, а затем считываете этот объект изнутри вашего Effect:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Этот объект объявлен в теле компонента, поэтому он является [реактивным значением.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Когда вы считываете реактивное значение, подобное этому, внутри Effect, вы объявляете его в качестве зависимости. Это гарантирует, что ваш Effect «реагирует» на его изменения:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Объявлены все зависимости
  // ...
```

Важно объявить его в качестве зависимости! Это гарантирует, например, что если `roomId` изменится, ваш Effect повторно подключится к чату с новыми `options`. Однако с приведенным выше кодом также есть проблема. Чтобы увидеть ее, попробуйте что-нибудь напечатать в поле ввода в песочнице ниже и посмотрите, что произойдет в консоли:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Временно отключите линтер, чтобы продемонстрировать проблему
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

В приведенной выше песочнице поле ввода обновляет только переменную состояния `message`. С точки зрения пользователя это не должно влиять на подключение к чату. Однако каждый раз, когда вы обновляете `message`, ваш компонент перерендеривается. Когда ваш компонент перерендеривается, код внутри него запускается снова с нуля.

Новый объект `options` создается с нуля при каждом перерендеринге компонента `ChatRoom`. React видит, что объект `options` — это *другой объект*, чем объект `options`, созданный во время последнего рендеринга. Вот почему он повторно синхронизирует ваш Effect (который зависит от `options`), и чат переподключается по мере ввода текста.

**Эта проблема затрагивает только объекты и функции. В JavaScript каждый вновь созданный объект и функция считаются отличными от всех остальных. Не имеет значения, что содержимое внутри них может быть одинаковым!**

```js {7-8}
// Во время первого рендеринга
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Во время следующего рендеринга
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Это два разных объекта!
console.log(Object.is(options1, options2)); // false
```

**Зависимости от объектов и функций могут приводить к повторной синхронизации вашего Effect чаще, чем вам нужно.**

Вот почему, когда это возможно, следует стараться избегать объектов и функций в качестве зависимостей вашего Effect. Вместо этого попробуйте переместить их за пределы компонента, внутрь Effect или извлечь из них примитивные значения.

#### Переместите статические объекты и функции за пределы вашего компонента {/*move-static-objects-and-functions-outside-your-component*/}

Если объект не зависит от каких-либо пропсов и состояния, вы можете переместить этот объект за пределы вашего компонента:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Объявлены все зависимости
  // ...
```

Таким образом, вы *доказываете* линтеру, что он не реактивный. Он не может измениться в результате перерендеринга, поэтому он не должен быть зависимостью. Теперь перерендеринг `ChatRoom` не приведет к повторной синхронизации вашего Effect.

Это работает и для функций:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Объявлены все зависимости
  // ...
```

Поскольку `createOptions` объявлена за пределами вашего компонента, она не является реактивным значением. Вот почему ее не нужно указывать в зависимостях вашего Effect, и почему она никогда не приведет к повторной синхронизации вашего Effect.

#### Переместите динамические объекты и функции внутрь вашего Effect {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Если ваш объект зависит от какого-либо реактивного значения, которое может измениться в результате перерендеринга, например, пропса `roomId`, вы не можете вынести его *за пределы* вашего компонента. Однако вы можете переместить его создание *внутрь* кода вашего Effect:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ Объявлены все зависимости
  // ...
```

Теперь, когда `options` объявлен внутри вашего Effect, он больше не является зависимостью вашего Effect. Вместо этого единственным реактивным значением, используемым вашим Effect, является `roomId`. Поскольку `roomId` не является объектом или функцией, вы можете быть уверены, что он не будет *непреднамеренно* другим. В JavaScript числа и строки сравниваются по их содержимому:

```js {7-8}
// Во время первого рендеринга
const roomId1 = 'music';

// Во время следующего рендеринга
const roomId2 = 'music';

// Эти две строки одинаковы!
console.log(Object.is(roomId1, roomId2)); // true
```

Благодаря этому исправлению чат больше не переподключается, если вы редактируете поле ввода:

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

Однако он *действительно* переподключается, когда вы меняете выпадающий список `roomId`, как и ожидалось.

Это работает и для функций:

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Объявлены все зависимости
  // ...
```

Вы можете написать свои собственные функции для группировки частей логики внутри вашего Effect. Пока вы также объявляете их *внутри* вашего Effect, они не являются реактивными значениями, поэтому они не должны быть зависимостями вашего Effect.

#### Считывайте примитивные значения из объектов {/*read-primitive-values-from-objects*/}

Иногда вы можете получать объект из пропсов:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Объявлены все зависимости
  // ...
```

Риск здесь заключается в том, что родительский компонент будет создавать объект во время рендеринга:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Это привело бы к повторному подключению вашего Effect каждый раз, когда родительский компонент перерендеривается. Чтобы исправить это, считывайте информацию из объекта *за пределами* Effect и избегайте зависимостей от объектов и функций:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Объявлены все зависимости
  // ...
```

Логика становится немного повторяющейся (вы считываете некоторые значения из объекта за пределами Effect, а затем создаете объект с теми же значениями внутри Effect). Но это делает очень явным, от какой информации *фактически* зависит ваш Effect. Если объект непреднамеренно пересоздается родительским компонентом, чат не будет переподключаться. Однако, если `options.roomId` или `options.serverUrl` действительно отличаются, чат переподключится.

#### Вычисляйте примитивные значения из функций {/*calculate-primitive-values-from-functions*/}

Тот же подход может работать и для функций. Например, предположим, что родительский компонент передает функцию:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Чтобы избежать превращения ее в зависимость (и вызывать повторное подключение при перерендеринге), вызовите ее за пределами Effect. Это даст вам значения `roomId` и `serverUrl`, которые не являются объектами и которые вы можете считывать изнутри вашего Effect:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Объявлены все зависимости
  // ...
```

Это работает только для [чистых](/learn/keeping-components-pure) функций, потому что их безопасно вызывать во время рендеринга. Если ваша функция является обработчиком событий, но вы не хотите, чтобы ее изменения повторно синхронизировали ваш Effect, [оберните ее вместо этого в Effect Event.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Зависимости всегда должны соответствовать коду.
- Когда вы недовольны своими зависимостями, вам нужно отредактировать код.
- Подавление линтера приводит к очень запутанным ошибкам, и вам всегда следует избегать этого.
- Чтобы удалить зависимость, вам нужно «доказать» линтеру, что она не нужна.
- Если какой-то код должен выполняться в ответ на определенное взаимодействие, переместите этот код в обработчик событий.
- Если разные части вашего Effect должны перезапускаться по разным причинам, разделите его на несколько Effects.
- Если вы хотите обновить какое-либо состояние на основе предыдущего состояния, передайте функцию обновления.
- Если вы хотите прочитать последнее значение, не «реагируя» на него, извлеките Effect Event из вашего Effect.
- В JavaScript объекты и функции считаются разными, если они были созданы в разное время.
- Старайтесь избегать зависимостей от объектов и функций. Переместите их за пределы компонента или внутрь Effect.

</Recap>

<Challenges>


#### Исправьте сбрасывающийся интервал {/*fix-a-resetting-interval*/}

Этот эффект настраивает интервал, который срабатывает каждую секунду. Вы заметили странную вещь: кажется, что интервал уничтожается и пересоздается каждый раз, когда срабатывает. Исправьте код, чтобы интервал не пересоздавался постоянно.

<Hint>

Кажется, что код этого эффекта зависит от `count`. Есть ли способ обойтись без этой зависимости? Должен быть способ обновить состояние `count` на основе его предыдущего значения, не добавляя зависимость от этого значения.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Создание интервала');
    const id = setInterval(() => {
      console.log('⏰ Тик интервала');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Очистка интервала');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Счётчик: {count}</h1>
}
```

</Sandpack>

<Solution>

Вы хотите обновить состояние `count`, чтобы оно было `count + 1` изнутри эффекта. Однако это делает ваш эффект зависимым от `count`, который изменяется с каждым тиком, и поэтому ваш интервал пересоздается при каждом тике.

Чтобы решить эту проблему, используйте [функцию обновления](/reference/react/useState#updating-state-based-on-the-previous-state) и напишите `setCount(c => c + 1)` вместо `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Создание интервала');
    const id = setInterval(() => {
      console.log('⏰ Тик интервала');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Очистка интервала');
      clearInterval(id);
    };
  }, []);

  return <h1>Счётчик: {count}</h1>
}
```

</Sandpack>

Вместо чтения `count` внутри эффекта, вы передаете инструкцию `c => c + 1` («увеличить это число!») в React. React применит ее при следующем рендере. И поскольку вам больше не нужно читать значение `count` внутри вашего эффекта, вы можете оставить зависимости вашего эффекта пустыми (`[]`). Это предотвращает пересоздание интервала вашим эффектом при каждом тике.

</Solution>

#### Исправьте повторное срабатывание анимации {/*fix-a-retriggering-animation*/}

В этом примере, когда вы нажимаете «Показать», появляется приветственное сообщение. Анимация занимает секунду. Когда вы нажимаете «Удалить», приветственное сообщение сразу исчезает. Логика анимации появления реализована в файле `animation.js` в виде простого JavaScript [цикла анимации.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) Вам не нужно изменять эту логику. Вы можете рассматривать ее как стороннюю библиотеку. Ваш эффект создает экземпляр `FadeInAnimation` для узла DOM, а затем вызывает `start(duration)` или `stop()` для управления анимацией. `duration` управляется ползунком. Настройте ползунок и посмотрите, как меняется анимация.

Этот код уже работает, но есть кое-что, что вы хотите изменить. В настоящее время, когда вы перемещаете ползунок, который управляет переменной состояния `duration`, это повторно запускает анимацию. Измените поведение так, чтобы эффект не «реагировал» на переменную `duration`. Когда вы нажимаете «Показать», эффект должен использовать текущее значение `duration` на ползунке. Однако перемещение самого ползунка не должно само по себе повторно запускать анимацию.

<Hint>

Есть ли строка кода внутри эффекта, которая не должна быть реактивной? Как можно переместить нереактивный код из эффекта?

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
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
```

</Sandpack>

<Solution>

Вашему эффекту необходимо прочитать последнее значение `duration`, но вы не хотите, чтобы он «реагировал» на изменения в `duration`. Вы используете `duration`, чтобы запустить анимацию, но запуск анимации не является реактивным. Извлеките нереактивную строку кода в событие эффекта и вызовите эту функцию из вашего эффекта.

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
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
    if (progress < 1) {
      // We still have more frames to paint
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
```

</Sandpack>

События эффекта, такие как `onAppear`, не являются реактивными, поэтому вы можете прочитать `duration` внутри, не перезапуская анимацию.

</Solution>


#### Исправьте переподключение чата {/*fix-a-reconnecting-chat*/}

В этом примере каждый раз, когда вы нажимаете «Toggle theme», чат переподключается. Почему это происходит? Исправьте ошибку, чтобы чат переподключался только при изменении URL-адреса сервера или выборе другой комнаты чата.

Рассматривайте `chat.js` как внешнюю стороннюю библиотеку: вы можете обращаться к ней, чтобы проверить ее API, но не редактируйте ее.

<Hint>

Есть несколько способов исправить это, но в конечном итоге вам нужно избегать использования объекта в качестве зависимости.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Ваш Effect перезапускается, потому что он зависит от объекта `options`. Объекты могут быть непреднамеренно пересозданы, поэтому вам следует избегать их использования в качестве зависимостей ваших Effects, когда это возможно.

Наименее инвазивное исправление — прочитать `roomId` и `serverUrl` прямо за пределами Effect, а затем сделать Effect зависимым от этих примитивных значений (которые не могут измениться непреднамеренно). Внутри Effect создайте объект и передайте его в `createConnection`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Еще лучше заменить проп `options` объекта на более конкретные пропсы `roomId` и `serverUrl`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Придерживаясь примитивных пропсов, где это возможно, упрощается оптимизация ваших компонентов в дальнейшем.

</Solution>

#### Исправьте повторное подключение к чату, снова {/*fix-a-reconnecting-chat-again*/}

Этот пример подключается к чату с шифрованием или без него. Переключите флажок и обратите внимание на разные сообщения в консоли, когда шифрование включено и выключено. Попробуйте сменить комнату. Затем попробуйте переключить тему. Когда вы подключены к чат-комнате, вы будете получать новые сообщения каждые несколько секунд. Убедитесь, что их цвет соответствует выбранной вами теме.

В этом примере чат переподключается каждый раз, когда вы пытаетесь изменить тему. Исправьте это. После исправления изменение темы не должно приводить к повторному подключению чата, но переключение настроек шифрования или изменение комнаты должно приводить к повторному подключению.

Не изменяйте код в `chat.js`. В остальном вы можете изменить любой код, если это приводит к тому же поведению. Например, вам может быть полезно изменить, какие пропсы передаются вниз.

<Hint>

Вы передаете две функции: `onMessage` и `createConnection`. Обе они создаются с нуля каждый раз, когда `App` перерендеривается. Они считаются новыми значениями каждый раз, поэтому они повторно запускают ваш Effect.

Одна из этих функций является обработчиком событий. Знаете ли вы какой-нибудь способ вызвать обработчик событий в Effect, не «реагируя» на новые значения функции обработчика событий? Это пригодится!

Другая из этих функций существует только для передачи некоторого состояния в импортированный метод API. Действительно ли эта функция необходима? Какая существенная информация передается вниз? Возможно, вам потребуется переместить некоторые импорты из `App.js` в `ChatRoom.js`.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Существует более одного правильного способа решения этой задачи, но вот одно из возможных решений.

В исходном примере переключение темы приводило к созданию и передаче разных функций `onMessage` и `createConnection`. Поскольку Effect зависел от этих функций, чат переподключался каждый раз, когда вы переключали тему.

Чтобы исправить проблему с `onMessage`, вам нужно было обернуть его в Effect Event:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

В отличие от пропса `onMessage`, Effect Event `onReceiveMessage` не является реактивным. Вот почему он не должен быть зависимостью вашего Effect. В результате изменения `onMessage` не приведут к повторному подключению чата.

Вы не можете сделать то же самое с `createConnection`, потому что он *должен* быть реактивным. Вы *хотите*, чтобы Effect перезапускался, если пользователь переключается между зашифрованным и незашифрованным подключением, или если пользователь переключает текущую комнату. Однако, поскольку `createConnection` является функцией, вы не можете проверить, *действительно* ли изменилась информация, которую она считывает, или нет. Чтобы решить эту проблему, вместо передачи `createConnection` из компонента `App`, передайте необработанные значения `roomId` и `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Теперь вы можете переместить функцию `createConnection` *внутрь* Effect, а не передавать ее из `App`:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

После этих двух изменений ваш Effect больше не зависит от каких-либо значений функций:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

В результате чат переподключается только тогда, когда что-то значимое (`roomId` или `isEncrypted`) меняется:

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

</Sandpack>

```
```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Реальная реализация на самом деле подключится к серверу
  if (typeof serverUrl !== 'string') {
    throw Error('Ожидалось, что serverUrl будет строкой. Получено: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Ожидалось, что roomId будет строкой. Получено: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Подключение к комнате "' + roomId + '"... (зашифровано)');
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
      console.log('❌ 🔐 Отключение от комнаты "' + roomId + '" (зашифровано)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Нельзя добавить обработчик дважды.');
      }
      if (event !== 'message') {
        throw Error('Поддерживается только событие "message".');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Реальная реализация на самом деле подключится к серверу
  if (typeof serverUrl !== 'string') {
    throw Error('Ожидалось, что serverUrl будет строкой. Получено: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Ожидалось, что roomId будет строкой. Получено: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Подключение к комнате "' + roomId + '" (незашифровано)...');
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
      console.log('❌ Отключение от комнаты "' + roomId + '" (незашифровано)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Нельзя добавить обработчик дважды.');
      }
      if (event !== 'message') {
        throw Error('Поддерживается только событие "message".');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
```