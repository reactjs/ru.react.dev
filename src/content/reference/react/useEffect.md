---
title: useEffect
---

<Intro>

Хук `useEffect` позволяет компонентам [синхронизироваться с системами вне React.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Чтобы создать *эффект*, вызовите `useEffect` на верхнем уровне своего компонента.

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[См. другие примеры ниже.](#usage)

#### Параметры {/*parameters*/}

* `setup`: Функция *установки*, содержащая логику вашего эффекта. Если нужно, из функции можно вернуть функцию *сброса*. Когда компонент добавится в DOM, React вызовет функцию установки. После каждого рендеринга, в котором изменились зависимости, React сначала вызовет функцию сброса со старыми зависимостями (если такая была), и затем функцию установки с новыми зависимостями. Когда компонент удалится из DOM, React вызовет последнюю полученную функцию сброса.
 
* **необязательный** `dependencies`: Список всех реактивных значений, от которых зависит функция `setup`: пропсы, состояние, переменные и функции, объявленные непосредственно в теле вашего компонента. Если вы [настроите свой линтер под React](/learn/editor-setup#linting), то он сможет автоматически следить, чтобы все нужные реактивные значения были указаны в зависимостях. Количество зависимостей должно быть всегда одинаковое, а сам список нужно указать прямо в месте передачи параметра как `[dep1, dep2, dep3]`. React будет сравнивать старые и новые значения зависимостей через [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Если не указать зависимости совсем, то эффект будет запускаться после каждого рендеринга. [Важно понимать, как будет отличаться поведение, если передать список с зависимостями, пустой список, или не передать ничего.](#examples-dependencies)

#### Возвращаемое значение {/*returns*/}

`useEffect` ничего не возвращает.

#### Замечания {/*caveats*/}

* `useEffect` -- это хук, поэтому его нужно вызывать **только на верхнем уровне ваших компонентов** или хуков. Его нельзя вызывать внутри циклов и условий. Если это всё же для чего-то нужно, выделите этот вызов в отдельный компонент, который затем можно рендерить по условию или в цикле.

* Если ваша цель **не в том, чтобы синхронизировать компонент с некой внешней системой,** то [возможно, вам и не нужен Эффект.](/learn/you-might-not-need-an-effect)

* В Строгом режиме (Strict Mode) после первого рендеринга React **вызовет `setup` дважды**: один раз вызовет `setup` и сразу его сброс, и затем вызовет `setup` как обычно. Это будет происходить только в режиме разработки. Такой тест помогает убедиться, что сброс эффекта "обратен" его установке: он отменяет и откатывает всю ту работу, которую проделала функция `setup`. Если у вас нет функции сброса, а тест приводит к неправильной работе -- значит [вам нужна функция сброса](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development).

* Если эффект зависит от объектов или функций, которые создаются в компоненте, есть риск, что **эффект будет запускаться слишком часто**. Такие лишние зависимости можно убрать, переместив создание [объекта](#removing-unnecessary-object-dependencies) или [функции](#removing-unnecessary-function-dependencies) внутрь эффекта. Кроме того, можно [убрать зависимость от состояния, если эффект просто его обновляет](#updating-state-based-on-previous-state-from-an-effect). А [не реактивную логику](#reading-the-latest-props-and-state-from-an-effect) можно вынести за пределы эффекта.

* Перед тем, как запустить эффект, React обычно сначала **даёт браузеру возможность отрисовать последние изменения на экране, а потом запускает ваш эффект.** Поэтому если ваш эффект после рендеринга делает ещё какие-то визуальные изменения (например, поправляет положение отрендеренной всплывающей подсказки), то эти изменения могут появиться с задержкой (подсказка на мгновение всплывёт в неправильном месте, и сразу переместится в правильное). Если эта задержка слишком заметна, попробуйте заменить `useEffect` на [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Если эффект запускается в ответ на действия пользователя (например, по клику), то React **может запустить эффект перед тем, как дать браузеру отрисовать экран.** Это нужно для того, чтобы событийной системе браузера стало известно о результатах работы эффекта. Обычно так и должно быть. Но если всё же нужно отложить какие-либо действия до момента, пока не отрисуется экран (например, показать `alert()`), то можно, например, использовать `setTimeout`. Детальнее можно почитать в [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128).

* Если ваш эффект меняет состояние -- даже в ответ на действия пользователя (например, состояние должно измениться по клику), -- React **может всё же сначала дать браузеру обновить экран, и только потом учесть изменения состояния, которые сделал эффект**. Обычно это ожидаемое поведение. Но если вам всё же важно обновить состояние до отрисовки браузером, то `useEffect` стоит заменить на [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Эффекты **запускаются только на клиенте**. Они не запускаются во время серверного рендеринга.

---

## Применение {/*usage*/}

### Подключение к внешней системе {/*connecting-to-an-external-system*/}

Иногда в компоненте нужно установить сетевое соединение, подключиться к браузерному API или сторонней библиотеке, и поддерживать подключение или подписку, пока компонент показан на странице. React не управляет этими системами, они не являются его частью -- такие системы называются *внешними.*

Чтобы [подключить свой компонент к внешней системе,](/learn/synchronizing-with-effects) вызовите `useEffect` на верхнем уровне своего компонента:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

В `useEffect` нужно передать два аргумента:

1. *Функцию установки*, которая <CodeStep step={1}>устанавливает эффект,</CodeStep> подключаясь к внешней системе.
   - Установка должна вернуть *функцию сброса*, которая <CodeStep step={2}>сбрасывает эффект</CodeStep>, отключаясь от внешней системы.
2. <CodeStep step={3}>Список зависимостей</CodeStep> этих функций, где перечислены все нужные им значения в компоненте.

**По мере необходимости React вызовет функции установки и сброса несколько раз:**

1. Когда ваш компонент появится на странице *(монтируется)*, выполнится <CodeStep step={1}>код установки.</CodeStep>
2. После каждого рендеринга, в котором изменились <CodeStep step={3}>зависимости:</CodeStep>
   - Сначала запустится <CodeStep step={2}>код сброса</CodeStep> со старыми пропсами и состоянием.
   - Затем запустится <CodeStep step={1}>код установки</CodeStep> с новыми пропсами и состоянием.
3. В конце, когда ваш компонент будет удалён со страницы *(размонтируется)*, выполнится <CodeStep step={2}>код сброса</CodeStep>.

**Разберём эту последовательность на примере кода выше.**  

Когда в примере выше компонент `ChatRoom` добавится на страницу, эффектом добавления станет подключение к чату, используя начальные значения `roomId` и `serverUrl`. Если в процессе рендеринга `serverUrl` или `roomId` изменятся (например, пользователь выберет в выпадающем меню другой чат), эффект *отключится от предыдущего чата, и подключится к новому чату.* А когда компонент будет удалён со страницы, эффект закроет последнее подключение.

**В режиме разработки [для выявления дефектов](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) React будет запускать один предварительный цикл <CodeStep step={1}>установки</CodeStep> и <CodeStep step={2}>сброса</CodeStep> перед тем, как начинать <CodeStep step={1}>установку</CodeStep> как обычно.** Это такой стресс-тест, проверяющий, что логика вашего эффекта реализована правильно. Если вы видите, что тест создаёт проблемы -- значит у вас в логике сброса чего-то не хватает. Код сброса должен отменять и откатывать всю ту работу, которую проделал код установки. Эмпирическое правило такое: пользователь не должен замечать разницы, вызвалась установка один раз (как в продакшене) или последовательностью *установка* → *сброс* → *установка* (как в режиме разработки). [См. решения для типичных ситуаций.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**Старайтесь [описывать каждый эффект, как отдельный процесс,](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) а также [рассматривать каждую установку вместе с её сбросом, как одно целое.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** Монтируется компонент, обновляется, или размонтируется -- не должно играть роли. Если правильно реализовать сброс -- как "зеркальное отражение" установки, -- то ваш эффект сможет без последствий устанавливаться и сбрасываться настолько часто, насколько потребуется.

<Note>

Эффект позволяет [компоненту быть всегда синхронизированным](/learn/synchronizing-with-effects) с внешней системой (например, с сервисом чата). Под *внешней системой* здесь подразумевается в принципе любой код, которым не управляет React, как например:

* Таймер, управляемый через <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/ru/docs/Web/API/setInterval)</CodeStep> и <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* Подписка на событие, контролируемая через <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener)</CodeStep> и <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Стороння библиотека для анимаций с API наподобие <CodeStep step={1}>`animation.start()`</CodeStep> и <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Если вы в компоненте не подключаетесь к какой-либо внешней системе, то [скорее всего вам и не нужен эффект.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Примеры подключения к внешним системам" titleId="examples-connecting">

#### Подключение к чат-серверу {/*connecting-to-a-chat-server*/}

В этом примере компонент `ChatRoom` с помощью эффекта создаёт и поддерживает подключение к внешней системе: чат-серверу, описанному в `chat.js`. Нажмите "Открыть чат" -- появится компонент `ChatRoom`. Т.к. песочница здесь работает в режиме разработки, то будет дополнительный цикл подключения и отключения -- [о чём подробнее рассказано здесь.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Обратите внимание, как эффект переподключается к чату, если в выпадающем списке выбрать другой `roomId` или в поле ввода изменить `serverUrl`. Нажмите "Закрыть чат" -- и эффект отключится от чата.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Адрес сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Добро пожаловать в {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Выберите чат:{' '}
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
        {show ? 'Закрыть чат' : 'Открыть чат'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // В реальной реализации здесь было бы настоящее подключение к серверу
  return {
    connect() {
      console.log('✅ Подключение к чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Отключение от чата "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Отслеживание глобальных событий в браузере {/*listening-to-a-global-browser-event*/}

В этом примере внешней системой является браузерный DOM. Обычно, чтобы подписаться на событие, можно указать обработчик события в JSX. Но на события в глобальном объекте [`window`](https://developer.mozilla.org/ru/docs/Web/API/Window) так подписаться нельзя. В примере эффект позволяет "подключиться" к объекту `window`, чтобы слушать события в нём, и через событие `pointermove` отслеживать положение курсора, чтобы двигать за ним красный маркер.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
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
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Запуск анимации {/*triggering-an-animation*/}

В этом примере внешняя система -- это библиотека анимаций, описанная в `animation.js`. Библиотека реализует класс `FadeInAnimation`, который принимает на вход DOM-узел и позволяет методами `start()` и `stop()` управлять его анимацией. Компонент `Welcome` получает доступ к нужному DOM-узлу [с помощью рефа](/learn/manipulating-the-dom-with-refs). А эффект забирает узел из рефа и запускает на нём анимацию, когда компонент добавляется на экран.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
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
      Привет!
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Спрятать' : 'Показать'}
      </button>
      <hr />
      {show && <Welcome />}
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
      // Идём сразу в конец анимации
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Начинаем анимацию
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Отрисовали ещё не все фреймы
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

<Solution />

#### Управление модальным диалогом {/*controlling-a-modal-dialog*/}

В этом примере внешней системой является браузерный DOM. Компонент `ModalDialog` рендерит элемент [`<dialog>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/dialog). А с помощью эффекта и методов [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) и [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) синхронизирует показ диалога со значением пропа `isOpen`.

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Открыть диалог
      </button>
      <ModalDialog isOpen={show}>
        Привет!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Закрыть</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Отслеживание видимости элемента {/*tracking-element-visibility*/}

В этом примере внешней системой также является браузерный DOM. Компонент `App` показывает сначала длинный список, потом компонент `Box`, и затем ещё один длинный список. Прокрутите этот список -- обратите внимание, что фон чернеет, когда компонент `Box` становится целиком видимым. Компонент `Box` отслеживает свою видимость с помощью эффекта, который создаёт и управляет объектом [`IntersectionObserver`](https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API) -- браузерное API, оповещающее, когда элемент DOM появляется во вьюпорте.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Элемент #{i} (прокрутите дальше)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Оборачивание эффекта в пользовательский хук {/*wrapping-effects-in-custom-hooks*/}

Эффекты – это ["лазейка":](/learn/escape-hatches) они нужны, чтобы "выйти за рамки React", или когда для задачи нет встроенного решения. Если вам постоянно приходится писать собственные эффекты, то возможно ваши эффекты реализуют повторяющуюся логику, которую можно вынести в отдельный [пользовательский хук](/learn/reusing-logic-with-custom-hooks).

Например, вот пользовательский хук `useChatRoom`, который "скрывает" логику эффекта за декларативным API:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

И вот так им можно пользоваться в разных компонентах:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

В экосистеме React можно найти много других замечательных примеров пользовательских хуков на все случаи жизни.

[Подробнее о том, как завернуть эффект в пользовательский хук.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Примеры оборачивания эффекта в пользовательский хук" titleId="examples-custom-hooks">

#### Пользовательский хук `useChatRoom` {/*custom-usechatroom-hook*/}

Это повторение одного из [предыдущих примеров](#examples-connecting), но логика здесь вынесена в пользовательский хук.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Адрес сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Добро пожаловать в {roomId}!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Выберите чат:{' '}
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
        {show ? 'Закрыть чат' : 'Открыть чат'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // В реальной реализации здесь было бы настоящее подключение к серверу
  return {
    connect() {
      console.log('✅ Подключение к чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Отключение от чата "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Пользовательский хук `useWindowListener` {/*custom-usewindowlistener-hook*/}

Это повторение одного из [предыдущих примеров](#examples-connecting), но логика здесь вынесена в пользовательский хук.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
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
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Пользовательский хук `useIntersectionObserver` {/*custom-useintersectionobserver-hook*/}

Это повторение одного из [предыдущих примеров](#examples-connecting), но логика здесь частично вынесена в пользовательский хук.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Элемент #{i} (прокрутите дальше)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Управление виджетом, написанным не на React {/*controlling-a-non-react-widget*/}

Иногда, когда изменяются пропсы или состояние вашего компонента, то нужно, чтобы эти изменения синхронизировались и во внешние системы.

Например, когда у вас есть написанный без React сторонний виджет карты или видео проигрыватель, то в эффекте можно, вызывая их методы, транслировать в них изменения состояния вашего компонента. В данном случае эффект создаёт объект класса `MapWidget`, который описан в `map-widget.js`. Когда у компонента `Map` изменяется проп `zoomLevel`, эффект вызывает у объекта `setZoom()`, чтобы соответствующим образом обновилось и состояние виджета:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
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
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Масштаб: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

Функция сброса эффекта в данном случае не нужна, т.к. `MapWidget` просто держит ссылку на узел в DOM и больше никак ресурсами не управляет. А значит и `MapWidget`, и DOM-узел будут просто автоматически удалены сборщиком мусора JavaScript, когда компонент `Map` будет удалён из дерева.

---

### Получение данных в эффекте {/*fetching-data-with-effects*/}

<<<<<<< HEAD
В эффекте можно запрашивать для компонента данные. [Если вы используете фреймворк,](/learn/start-a-new-react-project#production-grade-react-frameworks) то будет эффективнее воспользоваться встроенным в ваш фреймворк механизмом получения данных, чем вручную писать собственные эффекты.
=======
You can use an Effect to fetch data for your component. Note that [if you use a framework,](/learn/start-a-new-react-project#full-stack-frameworks) using your framework's data fetching mechanism will be a lot more efficient than writing Effects manually.
>>>>>>> 366b5fbdadefecbbf9f6ef36c0342c083248c691

Если вы всё же хотите вручную в эффекте запрашивать данные, то можно написать, например, такой код:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Обратите внимание на переменную `ignore`: она изначально содержит `false`, а при сбросе эффекта изменяется на `true`. Этим гарантируется, что [в коде не будет "гонки"](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) из-за того, что ответы на сетевые запросы могут приходить не в том порядке, в котором были посланы запросы.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Алиса');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Алиса">Алиса</option>
        <option value="Боб">Боб</option>
        <option value="Тэйлор">Тэйлор</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Загрузка...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Боб' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Тут ' + person + ' рассказывает свою биографию');
    }, delay);
  })
}
```

</Sandpack>

Получение данных можно переписать на [`async` / `await`,](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/async_function) но функция сброса всё равно будет нужна:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Алиса');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Алиса">Алиса</option>
        <option value="Боб">Боб</option>
        <option value="Тэйлор">Тэйлор</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Загрузка...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Боб' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Тут ' + person + ' рассказывает свою биографию');
    }, delay);
  })
}
```

</Sandpack>

Чтобы регулярно делать запросы прямо в эффектах, придётся каждый раз писать много повторяющегося кода. Из-за чего в будущем будет сложнее добавить туда оптимизации вроде кэширования или серверного рендеринга. [Поэтому проще делать запросы через специальный хук -- написать собственный, либо найти готовый, поддерживаемый сообществом.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Какие есть альтернативы получению данных в эффекте? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Вызывать `fetch` в эффекте -- это [распространённый способ получать данные](https://www.robinwieruch.de/react-hooks-fetch-data/). Особенно в полностью клиентских приложениях. Однако у этого весьма "наколеночного" подхода есть недостатки:

- **На сервере эффекты не запускаются.** Это значит, что в полученном серверным рендерингом HTML будет только состояние загрузки без данных. Клиентское устройство скачает весь ваш JavaScript, отрендерит приложение, и обнаружит, что теперь нужно ещё и данные загрузить. Это не самый эффективный подход.
- **Запрашивая данные прямо в эффектах, легко создать "водопад загрузки".** Сначала рендерится родительский компонент, получает данные, рендерит дочерние компоненты, которые затем начинают запрашивать свои данные. Если сетевое соединение не быстрое, то такой процесс будет сильно медленнее, чем загружать все данные параллельно.
- **Получение данных прямо в эффекте обычно не предполагает предзагрузку или кэширование.** Если, например, компонент размонтировался и потом снова монтируется, то ему нужно будет заново загрузить данные.
- **Это неудобно.** Если не хочется столкнуться с багами вроде [гонок](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect), то каждый раз придётся писать некоторое количество весьма шаблонного кода.

Эти недостатки не являются какой-то особенностью именно React. Такие же проблемы получения данных при монтировании будут и с любой другой библиотекой. Как и маршрутизацию, нельзя просто взять и правильно реализовать получение данных -- поэтому мы рекомендуем следующие подходы:

<<<<<<< HEAD
- **Если вы используете [фреймворк](/learn/start-a-new-react-project#production-grade-react-frameworks), то возьмите встроенный в него механизм получения данных.** В современные React-фреймворки уже встроены эффективные механизмы получения данных без перечисленных недостатков.
- **Если нет, то попробуйте написать или использовать готовый клиентский кэш.** [React Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), и [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) -- примеры популярных готовых решений с открытым исходным кодом. Создать собственное решение тоже можно: под капотом будут эффекты, но также и логика для дедупликации запросов, кэширования ответов и предотвращения водопадов (через предзагрузку или через перенос на уровень маршрутов требований, какие данные будут нужны).
=======
- **If you use a [framework](/learn/start-a-new-react-project#full-stack-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [React Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood but also add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).
>>>>>>> 366b5fbdadefecbbf9f6ef36c0342c083248c691

Получать данные прямо в эффекте -- всё ещё вполне приемлемый вариант, если ничто из перечисленного вам не подходит.

</DeepDive>

---

### Указание реактивных зависимостей {/*specifying-reactive-dependencies*/}

**Обратите внимание, что "выбрать" зависимости эффекта нельзя.** В зависимостях эффекта должно быть указано каждое <CodeStep step={2}>реактивное значение</CodeStep>, которое в нём используется. Список зависимостей эффекта можно определить по окружающему коду:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // Это реактивное значение
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // И это реактивное значение

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Эффект их читает
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ И поэтому они должны быть указаны в его зависимостях
  // ...
}
```

Когда `serverUrl` или `roomId` будут изменяться, эффект будет переподключаться к чату с новыми значениями.

**[Реактивными значениями](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) считаются пропсы, переменные и функции, объявленные непосредственно в теле вашего компонента.** Т.к. значения `roomId` и `serverUrl` оба являются реактивными, то их нельзя опустить в списке зависимостей. Если их не указать, то [правильно настроенный под React линтер](/learn/editor-setup#linting) укажет на это, как на ошибку, которую нужно поправить:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**Чтобы удалить зависимость из списка, нужно ["доказать" линтеру, что она *не обязана* там быть.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** Например, можно вынести `serverUrl` из компонента, чтобы показать, что это значение не реактивно и не изменяется во время рендеринга:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Значение больше не реактивное

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Все зависимости указаны
  // ...
}
```

Т.к. теперь значение `serverUrl` не реактивное (и не может изменяться во время рендеринга), то его не нужно указывать как зависимость. **Если ваш эффект не пользуется никакими реактивными значениями, то его список зависимостей должен быть пустым (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Значение больше не реактивное
const roomId = 'music'; // Значение больше не реактивное

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Все зависимости указаны
  // ...
}
```

Изменения пропсов или состояния компонента не будут перезапускать [эффект, у которого список зависимостей пуст.](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)

<Pitfall>

Возможно в вашей существующей кодовой базе в некоторых эффектах есть вот такое отключение линтера:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Не отключайте так линтер:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Когда список зависимостей не соответствует коду, велик шанс появления багов.** Отключая линтер, вы "обманываете" React о том, от каких значений зависит эффект. [Лучше покажите, что они не нужны.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Примеры указания реактивных зависимостей" titleId="examples-dependencies">

#### Передача массива с зависимостями {/*passing-a-dependency-array*/}

Если указать какие-то зависимости, то эффект будет запускаться **после первого рендеринга, _а также_ после каждого рендеринга, в котором зависимости изменились.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Перезапустится, если a или b изменились
```

В примере ниже значения `serverUrl` и `roomId` [реактивны,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) и поэтому должны быть указаны в зависимостях. В результате чего, если в выпадающем меню выбрать другой чат, либо ввести другой адрес сервера, то компонент переподключится к чату. А вот сообщение `message` в эффекте не используется (и соответственно зависимостью не является), и поэтому редактирование сообщения не приводит к переподключению к чату.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Адрес сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Добро пожаловать в {roomId}!</h1>
      <label>
        Ваше сообщение:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Выберите чат:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Закрыть чат' : 'Открыть чат'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // В реальной реализации здесь было бы настоящее подключение к серверу
  return {
    connect() {
      console.log('✅ Подключение к чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Отключение от чата "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Передача пустого массива зависимостей {/*passing-an-empty-dependency-array*/}

Если эффект действительно не пользуется никакими реактивными значениями, то он будет запускаться **только после первого рендеринга.**

```js {3}
useEffect(() => {
  // ...
}, []); // Второго запуска не будет (кроме дополнительного в режиме разработки)
```

**В режиме разработки даже с пустым списком зависимостей эффект [запустится и сбросится один дополнительный раз,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) чтобы помочь выявить дефекты.**


В примере ниже значения для `serverUrl` и `roomId` зафиксированы в коде. Они не считаются реактивными, т.к. объявлены снаружи компонента -- а значит не считаются и зависимостями. В итоге список зависимостей пустой, и поэтому эффект не будет перезапускаться при последующем повторном рендеринге.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Добро пожаловать в {roomId}!</h1>
      <label>
        Ваше сообщение:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Закрыть чат' : 'Открыть чат'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // В реальной реализации здесь было бы настоящее подключение к серверу
  return {
    connect() {
      console.log('✅ Подключение к чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Отключение от чата "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### Отсутствие массива зависимостей вообще {/*passing-no-dependency-array-at-all*/}

Если не указать собственно сам массив зависимостей, то эффект будет срабатывать **после каждого рендеринга компонента (включая повторные).**

```js {3}
useEffect(() => {
  // ...
}); // Срабатывает каждый раз
```

В этом примере эффект срабатывает каждый раз, когда изменяется `serverUrl` и `roomId` -- что ожидаемо. Однако он также срабатывает и когда изменяется `message` -- что уже кажется странным. Поэтому на практике вы как правило будете указывать какой-либо массив.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // Никакого массива зависимостей

  return (
    <>
      <label>
        Адрес сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Добро пожаловать в {roomId}!</h1>
      <label>
        Ваше сообщение:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Выберите чат:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Закрыть чат' : 'Открыть чат'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // В реальной реализации здесь было бы настоящее подключение к серверу
  return {
    connect() {
      console.log('✅ Подключение к чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Отключение от чата "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Обновление в эффекте состояния на основе предыдущего состояния {/*updating-state-based-on-previous-state-from-an-effect*/}

Если вы захотите обновлять в эффекте состояние на основе его предыдущего значения, то можете наткнуться на проблему:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Хотим увеличивать `count` каждую секунду...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... но из-за того, что `count` в зависимостях, интервал постоянно перезапускается.
  // ...
}
```

Т.к. `count` -- это реактивное значение, то оно должно быть указано в списке зависимостей. Но из-за этого эффекту приходится сбрасываться и запускаться заново каждый раз, когда `count` обновляется. Выглядит не идеально.

Можно сделать лучше, если передавать в `setCount` [функцию обновления состояния `c => c + 1`:](/reference/react/useState#updating-state-based-on-the-previous-state)

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Передаём функцию обновления
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Теперь `count` нет в зависимостях.

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Поскольку вместо `count + 1` теперь передаётся `c => c + 1`, то [больше нет нужды указывать `count` в зависимостях эффекта.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) А значит эффекту больше не приходится сбрасывать и заново устанавливать интервал каждый раз, когда изменяется `count`.

---


### Устранение лишних зависимостей от объектов {/*removing-unnecessary-object-dependencies*/}

Если ваш эффект зависит от объекта или функции, которые создаются во время рендеринга, то возможно **ваш эффект срабатывает слишком часто**. Например, вот этот эффект делает переподключение на каждый рендеринг, т.к. объект `options` [каждый раз новый:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Этот объект пересоздаётся при каждом рендеринге
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // И используется в эффекте
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 В результате при каждом рендеринге изменяются зависимости
  // ...
```

Постарайтесь не делать созданный во время рендеринга объект зависимостью. Лучше создавайте нужный объект внутри эффекта:

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
      <h1>Добро пожаловать в {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Выберите чат:{' '}
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
  // В реальной реализации здесь было бы настоящее подключение к серверу
  return {
    connect() {
      console.log('✅ Подключение к чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Отключение от чата "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Т.к. теперь объект `options` создаётся внутри эффекта, то сам эффект теперь зависит только от строки `roomId`.

Благодаря этой правке, больше не происходит переподключение к чату, когда пользователь печатает в поле ввода. В отличие от пересоздаваемых объектов, строки вроде `roomId` не будут считаться изменившимися, пока не изменятся по значению. [Подробнее об устранении зависимостей.](/learn/removing-effect-dependencies)

---

### Устранение лишних зависимостей от функций {/*removing-unnecessary-function-dependencies*/}

Если ваш эффект зависит от объекта или функции, которые создаются во время рендеринга, то возможно **ваш эффект срабатывает слишком часто**. Например, вот этот эффект делает переподключение на каждый рендеринг, т.к. функция `createOptions` [каждый раз новая:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Эта функция пересоздаётся при каждом рендеринге
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // И используется в эффекте
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 В результате при каждом рендеринге изменяются зависимости
  // ...
```

В самом по себе создании функции при каждом рендеринге нет ничего плохого -- это не требует оптимизации. Однако если такая функция будет зависимостью эффекта, то эффект будет срабатывать при каждом рендеринге.

Постарайтесь не делать созданную во время рендеринга функцию зависимостью. Лучше объявите нужную функцию внутри эффекта:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

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
  }, [roomId]);

  return (
    <>
      <h1>Добро пожаловать в {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Выберите чат:{' '}
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
  // В реальной реализации здесь было бы настоящее подключение к серверу
  return {
    connect() {
      console.log('✅ Подключение к чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Отключение от чата "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Т.к. теперь функция `createOptions` определена внутри эффекта, то сам эффект теперь зависит только от строки `roomId`. Благодаря этой правке, больше не происходит переподключение к чату, когда пользователь печатает в поле ввода. В отличие от пересоздаваемых функций, строки вроде `roomId` не будут считаться изменившимися, пока не изменятся по значению. [Подробнее об устранении зависимостей.](/learn/removing-effect-dependencies)

---

### Чтение в эффекте актуальных пропсов и состояния {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

Здесь описано **экспериментальное API, которое ещё не опубликовано** в стабильном релизе React.

</Wip>

По умолчанию если в эффекте читается реактивное значение, то его нужно указать в зависимостях. Благодаря этому эффект будет "реагировать" на каждое изменение значения. И для большинства зависимостей как раз такое поведение вам и нужно.

**Но иногда вам может понадобиться читать в эффекте реактивное значение, но не "реагировать" на него.** Например, представьте себе, что нужно при каждом посещении страницы записывать в лог текущее количество товаров в корзине:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Все зависимости указаны
  // ...
}
```

**Что если запись в лог нужно делать только при изменении `url`, а при изменении `shoppingCart` -- не нужно?** Убрать `shoppingCart` из зависимостей так, чтобы не сломать [правила реактивности,](#specifying-reactive-dependencies) нельзя. Зато можно для некоторого куска кода обозначить, что он не должен "реагировать" на изменения, даже когда вызывается в эффекте. Для этого вы можете с помощью хука [`useEffectEvent`](/reference/react/experimental_useEffectEvent) объявить [*Событие эффекта*](/learn/separating-events-from-effects#declaring-an-effect-event), и поместить в него код, читающий `shoppingCart`:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Все зависимости указаны
  // ...
}
```

**Событие эффекта -- это не реактивное значение, и поэтому не должно указываться в зависимостях эффекта.** Благодаря этому в событие можно помещать нереактивный код (где можно читать последние значения пропсов и состояния). Поскольку чтение `shoppingCart` теперь происходит внутри `onVisit`, то изменение `shoppingCart` не будет перезапускать эффект.

[Подробнее о том, как события эффектов позволяют отделить нереактивный код от реактивного.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Отображение разного содержимого на сервере и на клиенте {/*displaying-different-content-on-the-server-and-the-client*/}

<<<<<<< HEAD
Если в вашем приложении есть серверный рендеринг ([ручной](/reference/react-dom/server) или через [фреймворк](/learn/start-a-new-react-project#production-grade-react-frameworks)), то ваши компоненты будут рендериться в двух разных окружениях. Один рендеринг на сервере создаст первоначальный HTML, и один рендеринг на клиенте к этому HTML подключит обработчики событий. Поэтому для правильной работы [гидратации](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) первоначальный рендеринг на сервере и на клиенте должны давать одинаковый результат.
=======
If your app uses server rendering (either [directly](/reference/react-dom/server) or via a [framework](/learn/start-a-new-react-project#full-stack-frameworks)), your component will render in two different environments. On the server, it will render to produce the initial HTML. On the client, React will run the rendering code again so that it can attach your event handlers to that HTML. This is why, for [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) to work, your initial render output must be identical on the client and the server.
>>>>>>> 366b5fbdadefecbbf9f6ef36c0342c083248c691

При этом изредка вам может понадобиться отобразить на клиенте другое содержимое. Например, если ваше приложение читает данные из [`localStorage`](https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage) -- что в принципе невозможно делать на сервере. В таком случае разное отображение можно реализовать вот так:


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... возвращаем особый клиентский JSX ...
  }  else {
    // ... возвращаем первоначальный JSX ...
  }
}
```

Пока приложение загружается, пользователю будут показываться результаты первоначального рендеринга. После загрузки и гидратации сработает эффект, и `didMount` выставится в `true`, из-за чего запустится повторный рендеринг. Так первоначальное содержимое сменится на особое клиентское. На сервере эффекты не срабатывают -- поэтому при первоначальном рендеринге на сервере `didMount` оставался `false`.

Не стоит злоупотреблять этим паттерном. Учтите, что пользователи с медленным соединением могут довольно долго наблюдать первоначальное содержимое -- может даже несколько секунд. В такой момент нежелательно делать заметные дёрганные изменения во внешнем виде компонентов. Часто избежать резких переходов можно, отдельно стилизовав первоначальное содержимое под такую ситуацию.

---

## Устранение неполадок {/*troubleshooting*/}

### Мой эффект запускается дважды, когда компонент монтируется {/*my-effect-runs-twice-when-the-component-mounts*/}

В строгом режиме во время разработки React запускает один предварительный цикл установки и сброса перед тем, как запустить установку как обычно.

Это такой стресс-тест, проверяющий, что логика вашего эффекта реализована правильно. Если вы видите, что тест создаёт проблемы -- значит у вас в логике сброса чего-то не хватает. Код сброса должен отменять и откатывать всю ту работу, которую проделал код установки. Эмпирическое правило такое: пользователь не должен замечать разницы, вызвалась установка один раз (как в продакшене) или последовательностью *установка* → *сброс* → *установка* (как во время разработки).

Изучите подробнее, [как этот тест помогает выявлять дефекты,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) и [как исправить логику эффекта.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Мой эффект запускается при каждом рендеринге {/*my-effect-runs-after-every-re-render*/}

Для начала убедитесь, что не забыли указать массив зависимостей:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 Нет массива зависимостей: эффект срабатывает при каждом рендеринге!
```

Если вы указали массив зависимостей, но эффект всё равно постоянно перезапускается -- значит при каждом рендеринге изменяется какая-то из зависимостей.

Чтобы отладить проблему, выведите массив зависимостей в консоль:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Затем выберите в консоли два массива из двух разных проходов рендеринга, по каждому кликните правой кнопкой мыши и выберите в меню "Сохранить как глобальную переменную" ("Store as a global variable"). Если, допустим, первый массив сохранился в переменную `temp1`, а второй -- в `temp2`, то теперь можно в консоли браузера вот так проверить на равенство каждую отдельную зависимость:

```js
Object.is(temp1[0], temp2[0]); // Совпадает ли в массивах первая зависимость?
Object.is(temp1[1], temp2[1]); // Совпадает ли в массивах вторая зависимость?
Object.is(temp1[2], temp2[2]); // ... и так для каждой зависимости ...
```

Так вы найдёте, какая зависимость изменяется при каждом рендеринге. Поправить её обычно можно одним из следующих способов:

- [Обновлять в эффекте состояние на основе предыдущего состояния.](#updating-state-based-on-previous-state-from-an-effect)
- [Устранить лишнюю зависимость от объекта.](#removing-unnecessary-object-dependencies)
- [Устранить лишнюю зависимость от функции.](#removing-unnecessary-function-dependencies)
- [Читать в эффекте актуальные пропсы или состояние.](#reading-the-latest-props-and-state-from-an-effect)

В крайнем случае (если ни один из способов выше не подошёл) можно обернуть вычисление зависимости в [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook), либо в [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often), если это функция.

---

### Мой эффект без конца перезапускается {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Если ваш эффект перезапускается в бесконечном цикле, то скорее всего имеют место быть оба следующих факта:

- Ваш эффект изменяет состояние.
- Изменение состояния перезапускает рендеринг, и в процессе изменяются зависимости эффекта.

Перед тем, как приступить к исправлению, задайтесь вопросом: подключается ли к внешней системе ваш эффект (к DOM, к сети, к стороннему виджету, и т.п.)? Зачем этому эффекту изменять состояние? Он так синхронизируется с внешней системой? Или вы так просто пытаетесь управлять потоком данных в приложении?

Если подключения к внешней системе нет, то возможно вашу логику можно упростить, если [избавиться от эффекта как такового.](/learn/you-might-not-need-an-effect)

Если вы действительно пытаетесь синхронизироваться с внешней системой, то подумайте, зачем и при каких именно условиях эффект должен изменять состояние. Влияют ли изменения на визуальное отображение компонента? Если нужно отслеживать какие-то данные, не участвующие в рендеринге, то возможно вам больше подойдёт [реф](/reference/react/useRef#referencing-a-value-with-a-ref) (без перезапуска рендеринга). Если нужно обновлять состояние (с перезапуском рендеринга), убедитесь, что обновление не происходит чаще, чем нужно.

Наконец, если эффект обновляет состояние ровно тогда, когда это нужно, но всё равно без конца перезапускается -- значит обновление состояния приводит к изменению какой-то зависимости эффекта. [Почитайте, как можно отладить изменения в зависимостях.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### Моя логика сброса запустилась, хотя компонент не размонтируется {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

Сброс эффекта происходит не только при размонтировании, но и после каждого рендеринга, в котором изменились зависимости. Кроме того, в режиме разработки React [делает при монтировании один дополнительный запуск установки и сброса.](#my-effect-runs-twice-when-the-component-mounts)

Если для вашего кода сброса нет соответствующего кода установки -- обычно это признак проблем в коде:

```js {2-5}
useEffect(() => {
  // 🔴 Не делайте так: логика сброса не соответствует логике установки.
  return () => {
    doSomething();
  };
}, []);
```

Ваша логика сброса должна быть "симметрична" логике установки, отменяя и откатывая всю ту работу, которую проделала установка:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Изучите, в чём отличие жизненного цикла эффекта по сравнению с жизненным циклом компонента.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Мой эффект делает визуальные изменения, но я вижу мерцание перед его срабатыванием {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Если вам нужно, чтобы браузер не [отрисовывал экран,](/learn/render-and-commit#epilogue-browser-paint) пока не сработает эффект, то замените `useEffect` на [`useLayoutEffect`](/reference/react/useLayoutEffect). Однако помните, что **для подавляющего большинства эффектов такое не должно быть нужно.** Замена будет нужна только там, где критически важно, чтобы эффект сработал до отрисовки браузером: например, чтобы эффект вычислил размеры и расположение для всплывающей подсказки до того, как её увидит пользователь.
