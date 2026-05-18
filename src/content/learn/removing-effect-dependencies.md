---
title: 'Removing Effect Dependencies'
---

<Intro>

Когда вы пишете Effect, линтер проверяет, включили ли вы все реактивные значения (например, пропсы и состояние), которые Effect читает, в список зависимостей вашего Effect. Это гарантирует, что ваш Effect остается синхронизированным с последними пропсами и состоянием вашего компонента. Ненужные зависимости могут привести к тому, что ваш Effect будет выполняться слишком часто или даже создаст бесконечный цикл. Следуйте этому руководству, чтобы просмотреть и удалить ненужные зависимости из ваших Effects.

</Intro>

<YouWillLearn>

- Как исправить бесконечные циклы зависимостей Effect
- Что делать, когда вы хотите удалить зависимость
- Как читать значение из вашего Effect, не "реагируя" на него
- Как и почему следует избегать объектных и функциональных зависимостей
- Почему подавление линтера зависимостей опасно и что делать вместо этого

</YouWillLearn>

## Зависимости должны соответствовать коду {/*dependencies-should-match-the-code*/}

Когда вы пишете Effect, вы сначала определяете, как [начать и остановить](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) выполнение того, что вы хотите, чтобы ваш Effect делал:

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

[Effects "реагируют" на реактивные значения.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Поскольку `roomId` является реактивным значением (оно может изменяться из-за повторного рендеринга), линтер проверяет, указали ли вы его в качестве зависимости. Если `roomId` получит другое значение, React повторно синхронизирует ваш Effect. Это гарантирует, что чат останется подключенным к выбранной комнате и будет "реагировать" на выпадающий список:

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

Обратите внимание, что вы не можете "выбирать" зависимости вашего Effect. Каждое <CodeStep step={2}>реактивное значение</CodeStep>, используемое кодом вашего Effect, должно быть объявлено в вашем списке зависимостей. Список зависимостей определяется окружающим кодом:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Это реактивное значение
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Этот Effect читает это реактивное значение
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Поэтому вы должны указать это реактивное значение как зависимость вашего Effect
  // ...
}
```

[Реактивные значения](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) включают пропсы и все переменные и функции, объявленные непосредственно внутри вашего компонента. Поскольку `roomId` является реактивным значением, вы не можете удалить его из списка зависимостей. Линтер не позволит этого:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect имеет отсутствующую зависимость: 'roomId'
  // ...
}
```

И линтер будет прав! Поскольку `roomId` может меняться со временем, это приведет к ошибке в вашем коде.

**Чтобы удалить зависимость, "докажите" линтеру, что она *не нуждается* в том, чтобы быть зависимостью.** Например, вы можете вынести `roomId` из вашего компонента, чтобы доказать, что он не реактивный и не изменится при повторных рендерингах:

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

Теперь, поскольку `roomId` не является реактивным значением (и не может измениться при повторном рендеринге), оно не нуждается в том, чтобы быть зависимостью:

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

Вот почему вы теперь можете указать [пустой (`[]`) список зависимостей.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) Ваш Effect *действительно* не зависит ни от одного реактивного значения, поэтому он *действительно* не нуждается в повторном запуске при изменении любого из пропсов или состояния компонента.

### Чтобы изменить зависимости, измените код {/*to-change-the-dependencies-change-the-code*/}

Вы могли заметить закономерность в своем рабочем процессе:

1. Сначала вы **изменяете код** вашего Effect или способ объявления ваших реактивных значений.
2. Затем вы следуете за линтером и корректируете зависимости, чтобы они **соответствовали измененному вами коду.**
3. Если вас не устраивает список зависимостей, вы **возвращаетесь к первому шагу** (и снова изменяете код).

Последняя часть важна. **Если вы хотите изменить зависимости, сначала измените окружающий код.** Вы можете рассматривать список зависимостей как [список всех реактивных значений, используемых кодом вашего Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Вы не *выбираете*, что поместить в этот список. Список *описывает* ваш код. Чтобы изменить список зависимостей, измените код.

Это может показаться решением уравнения. Вы можете начать с цели (например, удалить зависимость), и вам нужно будет "найти" код, соответствующий этой цели. Не всем нравится решать уравнения, и то же самое можно сказать о написании Effects! К счастью, ниже приведен список распространенных рецептов, которые вы можете попробовать.

<Pitfall>

Если у вас есть существующая кодовая база, у вас могут быть некоторые Effects, которые подавляют линтер следующим образом:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Избегайте подавления линтера таким образом:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Когда зависимости не соответствуют коду, существует очень высокий риск внесения ошибок.** Подавляя линтер, вы "лжете" React о значениях, от которых зависит ваш Effect.

Вместо этого используйте приведенные ниже методы.

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

Допустим, вы хотели запустить Effect "только при монтировании". Вы прочитали, что [пустые зависимости (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) делают это, поэтому вы решили проигнорировать линтер и принудительно указали `[]` в качестве зависимостей.

Этот счетчик должен был увеличиваться каждую секунду на величину, настраиваемую двумя кнопками. Однако, поскольку вы "солгал" React, что этот Effect ни от чего не зависит, React навсегда сохраняет использование функции `onTick` из первоначального рендеринга. [Во время этого рендеринга,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` был `0`, а `increment` был `1`. Вот почему `onTick` из этого рендеринга каждую секунду вызывает `setCount(0 + 1)`, и вы всегда видите `1`. Ошибки, подобные этой, труднее исправить, когда они распределены по нескольким компонентам.

Всегда есть лучшее решение, чем игнорировать линтер! Чтобы исправить этот код, вам нужно добавить `onTick` в список зависимостей. (Чтобы гарантировать, что интервал будет установлен только один раз, [сделайте `onTick` событием Effect.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**Мы рекомендуем относиться к ошибке линтера зависимостей как к ошибке компиляции. Если вы не будете ее подавлять, вы никогда не увидите подобных ошибок.** Остальная часть этой страницы документирует альтернативы для этого и других случаев.

</DeepDive>

## Удаление ненужных зависимостей {/*removing-unnecessary-dependencies*/}

Каждый раз, когда вы корректируете зависимости Effect, чтобы они отражали код, взгляните на список зависимостей. Имеет ли смысл повторное выполнение Effect при изменении любой из этих зависимостей? Иногда ответ — «нет»:

* Вы можете захотеть повторно выполнить *различные части* вашего Effect при разных условиях.
* Вы можете захотеть только прочитать *последнее значение* некоторой зависимости, вместо того чтобы «реагировать» на её изменения.
* Зависимость может меняться слишком часто *непреднамеренно*, потому что это объект или функция.

Чтобы найти правильное решение, вам нужно будет ответить на несколько вопросов о вашем Effect. Давайте пройдемся по ним.

### Следует ли переместить этот код в обработчик события? {/*should-this-code-move-to-an-event-handler*/}

Первое, о чем следует подумать, — это должен ли этот код вообще быть Effect.

Представьте форму. При отправке вы устанавливаете переменную состояния `submitted` в `true`. Вам нужно отправить POST-запрос и показать уведомление. Вы поместили эту логику внутрь Effect, который «реагирует» на `submitted` равное `true`:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Избегайте: Логика, специфичная для события, внутри Effect
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

Позже вы хотите стилизовать сообщение уведомления в соответствии с текущей темой, поэтому вы читаете текущую тему. Поскольку `theme` объявлена в теле компонента, это реактивное значение, поэтому вы добавляете ее в зависимости:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Избегайте: Логика, специфичная для события, внутри Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ Все зависимости объявлены

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

Сделав это, вы внесли ошибку. Представьте, что вы сначала отправляете форму, а затем переключаетесь между темными и светлыми темами. `theme` изменится, Effect повторно выполнится, и поэтому он снова отобразит то же уведомление!

**Проблема здесь в том, что это вообще не должно быть Effect.** Вы хотите отправить этот POST-запрос и показать уведомление в ответ на *отправку формы*, что является конкретным взаимодействием. Чтобы выполнить какой-либо код в ответ на конкретное взаимодействие, поместите эту логику непосредственно в соответствующий обработчик события:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Хорошо: Логика, специфичная для события, вызывается из обработчиков событий
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

Теперь, когда код находится в обработчике события, он не является реактивным — он будет выполняться только тогда, когда пользователь отправляет форму. Читайте больше о [выборе между обработчиками событий и Effects](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) и о [том, как удалить ненужные Effects.](/learn/you-might-not-need-an-effect)

### Ваш Effect выполняет несколько несвязанных действий? {/*is-your-effect-doing-several-unrelated-things*/}

Следующий вопрос, который вы должны себе задать, — выполняет ли ваш Effect несколько несвязанных действий.

Представьте, что вы создаете форму доставки, где пользователю нужно выбрать город и район. Вы получаете список `cities` с сервера в соответствии с выбранной `country`, чтобы показать их в выпадающем списке:

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
  }, [country]); // ✅ Все зависимости объявлены

  // ...
```

Это хороший пример [получения данных в Effect.](/learn/you-might-not-need-an-effect#fetching-data) Вы синхронизируете состояние `cities` с сетью в соответствии с пропом `country`. Вы не можете сделать это в обработчике события, потому что вам нужно получать данные, как только `ShippingForm` отобразится, и всякий раз, когда `country` изменится (независимо от того, какое взаимодействие это вызвало).

Теперь предположим, вы добавляете второй выпадающий список для районов города, который должен получать `areas` для текущего выбранного `city`. Вы можете начать с добавления второго вызова `fetch` для списка районов в тот же Effect:

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
    // 🔴 Избегайте: Единый Effect синхронизирует два независимых процесса
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
  }, [country, city]); // ✅ Все зависимости объявлены

  // ...
```

Однако, поскольку Effect теперь использует переменную состояния `city`, вам пришлось добавить `city` в список зависимостей. Это, в свою очередь, привело к проблеме: когда пользователь выбирает другой город, Effect повторно выполнится и вызовет `fetchCities(country)`. В результате вы будете ненужно много раз перезапрашивать список городов.

**Проблема этого кода в том, что вы синхронизируете две разные несвязанные вещи:**

1. Вы хотите синхронизировать состояние `cities` с сетью на основе пропа `country`.
1. Вы хотите синхронизировать состояние `areas` с сетью на основе состояния `city`.

Разделите логику на два Effect, каждый из которых реагирует на проп, с которым он должен синхронизироваться:

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
  }, [country]); // ✅ Все зависимости объявлены

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
  }, [city]); // ✅ Все зависимости объявлены

  // ...
```

Теперь первый Effect повторно выполняется только в том случае, если `country` изменится, а второй Effect повторно выполняется при изменении `city`. Вы разделили их по назначению: две разные вещи синхронизируются двумя отдельными Effect. Два отдельных Effect имеют два отдельных списка зависимостей, поэтому они не будут непреднамеренно вызывать друг друга.

Итоговый код длиннее исходного, но разделение этих Effect все равно является правильным. [Каждый Effect должен представлять собой независимый процесс синхронизации.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) В этом примере удаление одного Effect не нарушает логику другого Effect. Это означает, что они *синхронизируют разные вещи*, и их хорошо разделить. Если вас беспокоит дублирование, вы можете улучшить этот код, [извлекши повторяющуюся логику в пользовательский хук.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

### Вы читаете некоторое состояние для вычисления следующего состояния? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Этот Effect обновляет переменную состояния `messages` новым созданным массивом каждый раз, когда приходит новое сообщение:

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

Он использует переменную `messages` для [создания нового массива](/learn/updating-arrays-in-state), начиная со всех существующих сообщений и добавляя новое сообщение в конец. Однако, поскольку `messages` является реактивным значением, считываемым Effect, оно должно быть зависимостью:

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
  }, [roomId, messages]); // ✅ Все зависимости объявлены
  // ...
```

И добавление `messages` в зависимости создает проблему.

Каждый раз, когда вы получаете сообщение, `setMessages()` вызывает повторный рендеринг компонента с новым массивом `messages`, который включает полученное сообщение. Однако, поскольку этот Effect теперь зависит от `messages`, это *также* повторно синхронизирует Effect. Таким образом, каждое новое сообщение приведет к повторному подключению чата. Пользователю это не понравится!

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
  }, [roomId]); // ✅ Все зависимости объявлены
  // ...
```

**Обратите внимание, что ваш Effect теперь вообще не читает переменную `messages`.** Вам нужно только передать функцию обновления, такую как `msgs => [...msgs, receivedMessage]`. React [помещает вашу функцию обновления в очередь](/learn/queueing-a-series-of-state-updates) и предоставит ей аргумент `msgs` во время следующего рендеринга. Вот почему сам Effect больше не должен зависеть от `messages`. В результате этого исправления получение сообщения чата больше не приведет к повторному подключению чата.

### Вы хотите прочитать значение, не «реагируя» на его изменения? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Этот раздел описывает **экспериментальный API, который еще не был выпущен** в стабильной версии React.

</Wip>

Предположим, вы хотите воспроизвести звук при получении пользователем нового сообщения, если только `isMuted` не равно `true`:

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

Поскольку ваш Effect теперь использует `isMuted` в своем коде, вам придется добавить его в зависимости:

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
  }, [roomId, isMuted]); // ✅ Все зависимости объявлены
  // ...
```

Проблема в том, что каждый раз, когда `isMuted` изменяется (например, когда пользователь нажимает переключатель «Отключить звук»), Effect будет повторно синхронизироваться и переподключаться к чату. Это нежелательный пользовательский опыт! (В этом примере даже отключение линтера не помогло бы — если вы это сделаете, `isMuted` «застрянет» со своим старым значением.)

Чтобы решить эту проблему, вам нужно извлечь логику, которая не должна быть реактивной, из Effect. Вы не хотите, чтобы этот Effect «реагировал» на изменения `isMuted`. [Переместите эту нереактивную часть логики в событие Effect:](/learn/separating-events-from-effects#declaring-an-effect-event)

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
  }, [roomId]); // ✅ Все зависимости объявлены
  // ...
```

События Effect позволяют разделить Effect на реактивные части (которые должны «реагировать» на реактивные значения, такие как `roomId`, и их изменения) и нереактивные части (которые только считывают свои последние значения, такие как `onMessage` считывает `isMuted`). **Теперь, когда вы считываете `isMuted` внутри события Effect, оно не должно быть зависимостью вашего Effect.** В результате чат не будет переподключаться при включении и выключении настройки «Отключить звук», решая исходную проблему!

#### Обертывание обработчика события из пропсов {/*wrapping-an-event-handler-from-the-props*/}

Вы можете столкнуться с похожей проблемой, когда ваш компонент получает обработчик события в виде пропа:

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
  }, [roomId, onReceiveMessage]); // ✅ Все зависимости объявлены
  // ...
```

Предположим, родительский компонент передает *разную* функцию `onReceiveMessage` при каждом рендеринге:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Поскольку `onReceiveMessage` является зависимостью, это вызовет повторную синхронизацию Effect после каждого рендеринга родителя. Это приведет к повторному подключению к чату. Чтобы решить эту проблему, оберните вызов в событие Effect:

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
  }, [roomId]); // ✅ Все зависимости объявлены
  // ...
```

События Effect не являются реактивными, поэтому вам не нужно указывать их как зависимости. В результате чат больше не будет переподключаться, даже если родительский компонент передает функцию, которая отличается при каждом повторном рендеринге.

#### Разделение реактивного и нереактивного кода {/*separating-reactive-and-non-reactive-code*/}

В этом примере вы хотите регистрировать посещение каждый раз, когда `roomId` изменяется. Вы хотите включить текущее значение `notificationCount` в каждый лог, но вы *не* хотите, чтобы изменение `notificationCount` вызывало событие лога.

Решение снова заключается в том, чтобы выделить нереактивный код в событие Effect:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Все зависимости объявлены
  // ...
}
```

Вы хотите, чтобы ваша логика была реактивной по отношению к `roomId`, поэтому вы считываете `roomId` внутри вашего Effect. Однако вы не хотите, чтобы изменение `notificationCount` регистрировало дополнительное посещение, поэтому вы считываете `notificationCount` внутри события Effect. [Узнайте больше о чтении последних пропсов и состояния из Effects с помощью событий Effect.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Непреднамеренное изменение реактивного значения? {/*does-some-reactive-value-change-unintentionally*/}

Иногда вы *хотите*, чтобы ваш эффект «реагировал» на определённое значение, но это значение меняется чаще, чем вам хотелось бы, и может не отражать реальных изменений с точки зрения пользователя. Например, предположим, вы создаёте объект `options` в теле вашего компонента, а затем читаете этот объект внутри вашего эффекта:

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

Этот объект объявлен в теле компонента, поэтому он является [реактивным значением.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Когда вы читаете реактивное значение таким образом внутри эффекта, вы объявляете его как зависимость. Это гарантирует, что ваш эффект будет «реагировать» на его изменения:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Все зависимости объявлены
  // ...
```

Важно объявить его как зависимость! Это гарантирует, например, что если `roomId` изменится, ваш эффект переподключится к чату с новыми `options`. Однако в приведённом выше коде есть и проблема. Чтобы увидеть её, попробуйте ввести текст в поле ввода в песочнице ниже и посмотрите, что происходит в консоли:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Временно отключим линтер, чтобы продемонстрировать проблему
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
  // Реальная реализация действительно подключится к серверу
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

В песочнице выше поле ввода обновляет только переменную состояния `message`. С точки зрения пользователя, это не должно влиять на подключение к чату. Однако каждый раз, когда вы обновляете `message`, ваш компонент перерисовывается. Когда ваш компонент перерисовывается, код внутри него выполняется снова с самого начала.

При каждом повторном рендеринге компонента `ChatRoom` заново создаётся новый объект `options`. React видит, что объект `options` — это *другой объект*, отличный от объекта `options`, созданного во время последнего рендеринга. Именно поэтому он повторно синхронизирует ваш эффект (который зависит от `options`), и чат переподключается по мере ввода текста.

**Эта проблема затрагивает только объекты и функции. В JavaScript каждый вновь созданный объект и функция считаются отличными от всех остальных. Неважно, что их содержимое может быть одинаковым!**

```js {7-8}
// Во время первого рендеринга
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Во время следующего рендеринга
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Это два разных объекта!
console.log(Object.is(options1, options2)); // false
```

**Зависимости объектов и функций могут заставлять ваш эффект повторно синхронизироваться чаще, чем вам нужно.**

Вот почему, когда это возможно, вам следует избегать объектов и функций в качестве зависимостей вашего эффекта. Вместо этого попробуйте вынести их за пределы компонента, внутрь эффекта или извлечь из них примитивные значения.

#### Вынести статические объекты и функции за пределы компонента {/*move-static-objects-and-functions-outside-your-component*/}

Если объект не зависит от каких-либо пропсов и состояния, вы можете вынести этот объект за пределы вашего компонента:

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
  }, []); // ✅ Все зависимости объявлены
  // ...
```

Таким образом, вы *доказываете* линтеру, что это не реактивное значение. Оно не может измениться в результате повторного рендеринга, поэтому ему не нужно быть зависимостью. Теперь повторный рендеринг `ChatRoom` не вызовет повторную синхронизацию вашего эффекта.

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
  }, []); // ✅ Все зависимости объявлены
  // ...
```

Поскольку `createOptions` объявлена вне вашего компонента, это не реактивное значение. Вот почему его не нужно указывать в зависимостях вашего эффекта, и почему оно никогда не вызовет повторную синхронизацию вашего эффекта.

#### Перенести динамические объекты и функции внутрь вашего эффекта {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Если ваш объект зависит от какого-либо реактивного значения, которое может измениться в результате повторного рендеринга, например, проп `roomId`, вы не можете вынести его *за пределы* вашего компонента. Однако вы можете переместить его создание *внутрь* кода вашего эффекта:

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
  }, [roomId]); // ✅ Все зависимости объявлены
  // ...
```

Теперь, когда `options` объявлен внутри вашего эффекта, он больше не является зависимостью вашего эффекта. Вместо этого единственным реактивным значением, используемым вашим эффектом, является `roomId`. Поскольку `roomId` не является объектом или функцией, вы можете быть уверены, что он не будет *непреднамеренно* отличаться. В JavaScript числа и строки сравниваются по их содержимому:

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
  // Реальная реализация действительно подключится к серверу
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

Однако он *переподключается*, когда вы меняете выпадающий список `roomId`, как и ожидалось.

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
  }, [roomId]); // ✅ Все зависимости объявлены
  // ...
```

Вы можете писать свои собственные функции для группировки фрагментов логики внутри вашего эффекта. Пока вы также объявляете их *внутри* вашего эффекта, они не являются реактивными значениями, и поэтому им не нужно быть зависимостями вашего эффекта.

#### Чтение примитивных значений из объектов {/*read-primitive-values-from-objects*/}

Иногда вы можете получать объект из пропсов:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Все зависимости объявлены
  // ...
```

Риск здесь в том, что родительский компонент будет создавать объект во время рендеринга:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Это приведёт к тому, что ваш эффект будет переподключаться при каждом повторном рендеринге родительского компонента. Чтобы исправить это, читайте информацию из объекта *вне* эффекта и избегайте зависимостей объектов и функций:

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
  }, [roomId, serverUrl]); // ✅ Все зависимости объявлены
  // ...
```

Логика становится немного повторяющейся (вы читаете некоторые значения из объекта вне эффекта, а затем создаёте объект с теми же значениями внутри эффекта). Но это делает очень явным, от какой информации ваш эффект *действительно* зависит. Если объект непреднамеренно воссоздаётся родительским компонентом, чат не будет переподключаться. Однако, если `options.roomId` или `options.serverUrl` действительно отличаются, чат переподключится.

#### Вычисление примитивных значений из функций {/*calculate-primitive-values-from-functions*/}

Тот же подход может работать и для функций. Например, предположим, родительский компонент передаёт функцию:

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

Чтобы избежать её включения в зависимости (и, следовательно, повторных переподключений при рендерингах), вызовите её вне эффекта. Это даст вам значения `roomId` и `serverUrl`, которые не являются объектами и которые вы можете читать внутри вашего эффекта:

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
  }, [roomId, serverUrl]); // ✅ Все зависимости объявлены
  // ...
```

Это работает только для [чистых](/learn/keeping-components-pure) функций, поскольку их безопасно вызывать во время рендеринга. Если ваша функция является обработчиком событий, но вы не хотите, чтобы её изменения повторно синхронизировали ваш эффект, [вместо этого оберните её в Effect Event.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Зависимости всегда должны соответствовать коду.
- Когда вы недовольны своими зависимостями, вам нужно редактировать код.
- Подавление линтера приводит к очень запутанным ошибкам, и вам всегда следует его избегать.
- Чтобы удалить зависимость, вам нужно «доказать» линтеру, что она не нужна.
- Если какой-то код должен выполняться в ответ на определённое взаимодействие, переместите этот код в обработчик событий.
- Если разные части вашего эффекта должны перезапускаться по разным причинам, разделите его на несколько эффектов.
- Если вы хотите обновить какое-то состояние на основе предыдущего состояния, передайте функцию-обновитель.
- Если вы хотите прочитать последнее значение, не «реагируя» на него, извлеките Effect Event из вашего эффекта.
- В JavaScript объекты и функции считаются разными, если они были созданы в разное время.
- Старайтесь избегать зависимостей объектов и функций. Переместите их за пределы компонента или внутрь эффекта.

</Recap>

<Challenges>

#### Исправить сбрасываемый интервал {/*fix-a-resetting-interval*/}

Этот эффект настраивает интервал, который срабатывает каждую секунду. Вы заметили что-то странное: кажется, что интервал уничтожается и воссоздаётся каждый раз, когда срабатывает. Исправьте код так, чтобы интервал не воссоздавался постоянно.

<Hint>

Кажется, что код этого эффекта зависит от `count`. Есть ли способ не нуждаться в этой зависимости? Должен быть способ обновить состояние `count` на основе его предыдущего значения, не добавляя зависимость от этого значения.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

Вы хотите обновить состояние `count` до `count + 1` изнутри эффекта. Однако это делает ваш эффект зависимым от `count`, который меняется с каждым тиком, и именно поэтому ваш интервал воссоздаётся при каждом тике.

Чтобы решить эту проблему, используйте [функцию-обновитель](/reference/react/useState#updating-state-based-on-the-previous-state) и напишите `setCount(c => c + 1)` вместо `setCount(count + 1)`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Вместо чтения `count` внутри эффекта вы передаёте инструкцию `c => c + 1` («увеличить это число!») React. React применит её при следующем рендеринге. И поскольку вам больше не нужно читать значение `count` внутри вашего эффекта, вы можете оставить зависимости вашего эффекта пустыми (`[]`). Это предотвращает воссоздание интервала вашим эффектом при каждом тике.

</Solution>

#### Исправить повторно запускаемую анимацию {/*fix-a-retriggering-animation*/}

В этом примере при нажатии «Show» появляется приветственное сообщение, которое плавно появляется в течение секунды. При нажатии «Remove» приветственное сообщение немедленно исчезает. Логика анимации появления реализована в файле `animation.js` как обычный JavaScript [цикл анимации.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) Вам не нужно менять эту логику. Вы можете рассматривать её как стороннюю библиотеку. Ваш эффект создаёт экземпляр `FadeInAnimation` для DOM-узла, а затем вызывает `start(duration)` или `stop()` для управления анимацией. `duration` контролируется ползунком. Настройте ползунок и посмотрите, как меняется анимация.

Этот код уже работает, но есть кое-что, что вы хотите изменить. В настоящее время при перемещении ползунка, который управляет переменной состояния `duration`, анимация запускается повторно. Измените поведение так, чтобы эффект не «реагировал» на переменную `duration`. При нажатии «Show» эффект должен использовать текущее значение `duration` на ползунке. Однако само перемещение ползунка не должно запускать анимацию повторно.

<Hint>

Есть ли строка кода внутри эффекта, которая не должна быть реактивной? Как вы можете вынести нереактивный код из эффекта?

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

Вашему эффекту необходимо считывать последнее значение `duration`, но вы не хотите, чтобы он «реагировал» на изменения `duration`. Вы используете `duration` для запуска анимации, но запуск анимации не является реактивным. Вынесите нереактивную строку кода в Effect Event и вызовите эту функцию из вашего эффекта.

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

Effect Events, такие как `onAppear`, не являются реактивными, поэтому вы можете читать `duration` внутри них, не вызывая повторный запуск анимации.

</Solution>

#### Исправьте переподключающийся чат {/*fix-a-reconnecting-chat*/}

В этом примере чат переподключается каждый раз, когда вы нажимаете «Переключить тему». Почему это происходит? Исправьте ошибку так, чтобы чат переподключался только при изменении URL сервера или выборе другой комнаты чата.

Считайте `chat.js` внешней сторонней библиотекой: вы можете обращаться к ней для проверки её API, но не редактируйте её.

<Hint>

Существует несколько способов исправить это, но в конечном итоге вам следует избегать использования объекта в качестве зависимости.

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

Ваш Effect перезапускается, потому что он зависит от объекта `options`. Объекты могут быть созданы заново непреднамеренно, поэтому вам следует избегать их в качестве зависимостей ваших Effects, когда это возможно.

Наименее инвазивное исправление — это извлечь `roomId` и `serverUrl` непосредственно перед Effect и сделать Effect зависимым от этих примитивных значений (которые не могут быть изменены непреднамеренно). Внутри Effect создайте объект и передайте его в `createConnection`:

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

Было бы еще лучше заменить объект `options` на более конкретные пропсы `roomId` и `serverUrl`:

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

Использование примитивных пропсов, где это возможно, упрощает последующую оптимизацию компонентов.

</Solution>

#### Снова исправьте переподключающийся чат {/*fix-a-reconnecting-chat-again*/}

Этот пример подключается к чату с шифрованием или без него. Переключите флажок и обратите внимание на разные сообщения в консоли при включенном и выключенном шифровании. Попробуйте сменить комнату. Затем попробуйте переключить тему. Когда вы подключены к комнате чата, вы будете получать новые сообщения каждые несколько секунд. Убедитесь, что их цвет соответствует выбранной вами теме.

В этом примере чат переподключается каждый раз, когда вы пытаетесь сменить тему. Исправьте это. После исправления смена темы не должна вызывать переподключение чата, но переключение настроек шифрования или смена комнаты должны вызывать переподключение.

Не меняйте код в `chat.js`. В остальном вы можете менять любой код, если это приведет к такому же поведению. Например, вам может быть полезно изменить передаваемые пропсы.

<Hint>

Вы передаете две функции: `onMessage` и `createConnection`. Обе они создаются заново при каждом рендере `App`. Они считаются новыми значениями каждый раз, поэтому они повторно запускают ваш Effect.

Одну из этих функций можно обработать с помощью `useEffectEvent`. Есть ли способ вызвать обработчик событий в Effect без "реакции" на новые значения функции обработчика? Это было бы полезно!

Другая из этих функций существует только для передачи некоторой информации в метод импортируемого API. Действительно ли эта функция необходима? Какая основная информация передается? Возможно, вам придется переместить некоторые импорты из `App.js` в `ChatRoom.js`.

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

Существует несколько правильных способов решения этой проблемы, но вот один из возможных.

В исходном примере переключение темы приводило к созданию и передаче разных функций `onMessage` и `createConnection`. Поскольку Effect зависел от этих функций, чат переподключался каждый раз при переключении темы.

Чтобы исправить проблему с `onMessage`, вам нужно было обернуть ее в Effect Event:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

В отличие от пропса `onMessage`, Effect Event `onReceiveMessage` не является реактивным. Поэтому он не должен быть зависимостью вашего Effect. В результате изменения `onMessage` не вызовут переподключение чата.

Вы не можете сделать то же самое с `createConnection`, потому что он *должен* быть реактивным. Вы *хотите*, чтобы Effect перезапускался, если пользователь переключается между зашифрованным и незашифрованным соединением, или если пользователь меняет текущую комнату. Однако, поскольку `createConnection` является функцией, вы не можете проверить, изменилась ли информация, которую она читает, *фактически*. Чтобы решить эту проблему, вместо передачи `createConnection` из компонента `App`, передайте необработанные значения `roomId` и `isEncrypted`:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Теперь вы можете переместить функцию `createConnection` *внутрь* Effect вместо передачи ее из компонента `App`:

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

После этих двух изменений ваш Effect больше не зависит от значений функций:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Реактивные значения
  const onReceiveMessage = useEffectEvent(onMessage); // Не реактивное

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Чтение реактивного значения
      };
      if (isEncrypted) { // Чтение реактивного значения
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ Все зависимости объявлены
```

В результате чат переподключается только тогда, когда изменяется что-то значимое (`roomId` или `isEncrypted`):

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

</Solution>

</Challenges>
