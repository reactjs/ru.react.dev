---
title: 'Обращаемся к значениям через рефы'
---

<Intro>

Для того, чтобы компонент «запомнил» какие-либо данные, но изменения этих данных не [вызывали новый рендер](/learn/render-and-commit), вы можете  использовать *реф*.

</Intro>

<YouWillLearn>

- Как добавить реф в ваш компонент
- Как обновить значение рефа
- Отличие рефа от состояния
- Как безопасно использовать рефы

</YouWillLearn>

## Добавляем реф в ваш компонент {/*adding-a-ref-to-your-component*/}

Чтобы добавить реф в ваш компонент, импортируйте хук `useRef` из React:

```js
import { useRef } from 'react';
```

Внутри компонента вызовите хук `useRef` и передайте аргумент, который будет являться начальным значением. Например, здесь значением реф является `0`:

```js
const ref = useRef(0);
```

`useRef` возвращает следующий объект:

```js
{
  current: 0 // Значение, которое вы передали в useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Стрелка с подписью 'current', вложенная в карман с подписью 'ref'." />

Получить доступ к значению рефа можно через свойство `ref.current`. Это значение намеренно является мутируемым, т.е. оно доступно как для чтения, так и для изменения. По сути, это как секретный карман, за которым React не следит. (Благодаря этому, реф является «лазейкой» в однонаправленном потоке данных React. Подробнее об этом ниже!)

В примере ниже создадим кнопку, которая будет увеличивать `ref.current` на каждый клик:

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

Здесь реф ссылается на число, но как и в случае с [состоянием](/learn/state-a-components-memory), вы можете ссылаться на что угодно: на строку, объект или даже на функцию. В отличии от состояния, реф—это обычный JavaScript-объект со свойством `current`, которое можно читать и изменять.

Имейте в виду, что **изменение реф не вызовет повторный рендер на каждое изменение.** Рефы будут сохраняться между повторными рендерами, как и состояние. Однако, обновление состояние вызывает новый рендер. А изменение рефа нет!

## Пример: создадим секундомер {/*example-building-a-stopwatch*/}

Рефы и состояние можно использовать в одном компоненте. Например, создадим секундомер, который можно будет запускать и останавливать нажатием кнопки. Чтобы отобразить сколько времени прошло с момента клика «Start», нужно следить за моментом клика и за текущим временем. **Так как эти данные используются при рендере, их лучше хранить в состоянии:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Чтобы обновлять время каждые 10 миллисекунд, после того как пользователь нажимает «Start»,  будем использовать [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval):

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Начинаем отсчёт.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Обновляем текущее время каждые 10мс.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

</Sandpack>

Когда нажата кнопка «Stop», нужно очистить текущий интервал, чтобы значение состояния `now` перестало обновляться. Для реализации можно использовать вызов[`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), но интервалу нужно задать  ID, которое возвращается при вызове `setInterval`, когда пользователь нажал «Start».  ID интервала нужно где-то сохранить. **Поскольку ID интервала не используется для рендера, вы можете сохранить его в реф:**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

Когда какие-то данные используются для рендера, держите её в состоянии. Когда данные нужны только для обработчиков событий, и изменение этих данных не требуют повторного рендера, использование реф будет более эффективным.

## Отличие рефа от состояния {/*differences-between-refs-and-state*/}

Может показаться, что рефы менее «строгие», чем состояние—их можно изменять напрямую, вместо использования функции для обновления состояния. Но в большинстве случаев вам захочется использовать состояние. Рефы—это «лазейка», которую не рекомендуется использовать слишком часто. Ниже сравнение рефа и состояния:

| refs                                                                                  | state                                                                                                                   |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` возвращает `{ current: initialValue }`                            | `useState(initialValue)` возвращает текущее значение состояния и функцию-сеттер для его обновления ( `[value, setValue]`) |
| При изменении не вызывает повторный рендер.                                         | При изменении вызывает повторный рендер.                                                                                    |
| Мутабельный—можно изменять и обновлять значение `current` независимо от процесса рендера. | «Иммутабельный»—обязательно использовать функцию-сеттер, чтобы добавить изменение состояния в очередь обновлений.                       |
| Не рекомендуется читать (или изменять) значение `current` во время рендера. | Можно читать значение состояния в любое время. Однако, за каждым рендером закреплён свой [снимок](/learn/state-as-a-snapshot) состояния, который не будет изменяться.

В следующем примере создадим кнопку счётчика, которая использует состояние:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

В этом случае имеет смысл использовать состояние, т.к. значение `count` отображается на странице. Когда состояние счётчика обновляется при помощи `setCount()`,  React вызывает повторный рендер и на экране отображается новое значение счётчика.

Если использовать реф, React никогда не вызовет повторный рендер, поэтому вы никогда не увидите изменение счётчика! Например, в данном случае клик по кнопке **не обновляет её текст**:

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Повторный рендер не вызовется!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

Именно поэтому чтение из `ref.current` во время рендера приводит к непредсказуемому результату. Используйте состояние, если во время рендера вам точно нужно читать данные из него!

<DeepDive>

#### Как работает useRef изнутри? {/*how-does-use-ref-work-inside*/}

Хотя оба хука `useState` и `useRef` могут быть импортированы из React, `useRef` может быть реализован поверх  `useState`. Можно представлять, что внутри React `useRef` реализован следующим образом:

```js
// Внутри React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Во время первого рендера `useRef` возвращает `{ current: initialValue }`. Этот объект сохраняется внутри React, поэтому во время следующего рендера вернётся точно такой же объект. Обратите внимание, что функция для обновления состояния в этом примере не используется. В этом нет необходимости, т.к. `useRef` всегда возвращает один и тот же объект!

React предоставляет встроенный хук `useRef`, т.к. это достаточно часто встречается на практике. Но можно представлять себе, что это обычное значение состояния, но без функции обновления. Если вы знакомы с объектно-ориентированным программированием, рефы могут напоминать вам поля экземпляра--но вместо `this.something` используется `somethingRef.current`.

</DeepDive>

## Когда использовать рефы {/*when-to-use-refs*/}

Как правило, вы будете использовать реф, когда захотите выйти за пределы парадигмы React и иметь возможность взаимодействовать со сторонними API—часто это API браузера, которое никак не влияет на отображение компонента на странице. Ниже приведены примеры таких ситуаций:

- Хранение [ID таймера](https://developer.mozilla.org/docs/Web/API/setTimeout)
- Хранение и манипулирование [DOM-элементами](https://developer.mozilla.org/docs/Web/API/Element), которое мы разберём [в следующей главе](/learn/manipulating-the-dom-with-refs)
- Хранение различных других объектов, которые не влияют на JSX.

Если вы хотите сохранить какое-то значение внутри компонента, которое не влияет на логику рендера, используйте реф.

## Рекомендации по использованию рефов {/*best-practices-for-refs*/}

Следуйте следующим принципам, чтобы сделать ваши компоненты более предсказуемыми:

- **Используйте рефы как лазейку.** Использование рефов является оправданным, когда вы работаете со сторонними системами или с API браузера. Если большая часть логики вашего приложения и потока данных зависит от рефов, скорее всего вам стоит переосмыслить свой подход.
- **Не читайте и не изменяйте `ref.current` во время рендера.** Если необходимо использовать какие-то данные во время рендера, используйте [состояние](/learn/state-a-components-memory) вместо рефа. Даже просто чтение во время рендера делает поведение вашего компонента менее предсказуемым, поскольку React ничего не знает об изменении `ref.current`. (Единственным исключением является `if (!ref.current) ref.current = new Thing()`, где реф устанавливается единожды, во время первого рендера.)

Ограничения React при использовании состояния никак не влияют на рефы. Например, состояние ведёт себя как [снимок для каждого рендера](/learn/state-as-a-snapshot) и [не обновляется синхронно.](/learn/queueing-a-series-of-state-updates) Но при изменении текущего значения реф, оно изменяется сразу же:

```js
ref.current = 5;
console.log(ref.current); // 5
```

Это обусловлено тем,  что **реф—это обычный JavaScript-объект,** и ведёт себя как объект.

Когда вы работаете с рефами, вам не нужно беспокоится о том, чтобы [избегать мутаций](/learn/updating-objects-in-state). До тех пор пока объект, который вы мутируете не используется для рендера, React нет дела, что вы делаете с рефами и их значениями.

## Рефы и DOM {/*refs-and-the-dom*/}

Вы можете использовать реф в качестве ссылки на любое значение. Однако, на практике рефы часто используются для доступа к DOM-элементам. Например, когда нужно программно сфокусироваться на элементе `input`. Когда вы устанавливаете `ref` через атрибут, `<div ref={myRef}>`, React сохранит соответствующий DOM-элемент в качестве значения `myRef.current`. Как только элемент удалён из DOM, React записывает `null` в `myRef.current`. Вы можете больше прочитать об этом в [Manipulating the DOM with Refs.](/learn/manipulating-the-dom-with-refs).

<Recap>

- Реф—это лазейка для хранения значений, которые не используются при рендере. Чаще всего вы можете обойтись без них.
- Реф—это обычный JavaScript-объект с единственным свойством `current`, которое доступно как для чтения, так и для записи.
- Вы можете использовать реф, вызвав хук `useRef` из React.
- Рефы позволяют вам сохранить данные между перерисовками компонента, как и в случае с состоянием.
- В отличии от состояния, запись нового значения в `ref.current` не спровоцирует повторный рендер компонента.
- Не читайте и не записывайте ничего в `ref.current` во время рендера. Это сделает поведение вашего компонента менее предсказуемым.

</Recap>



<Challenges>

#### Исправьте неработающий input в чате {/*fix-a-broken-chat-input*/}

Введите сообщение и нажмите «Send». Можно заметить трёхсекундную задержку перед тем, как появится модальное окно с сообщением «Sent!». Во время этой задержки появляется кнопка «Undo». Кликните по ней. Предполагается, что кнопка «Undo» предотвратит появление сообщения «Sent!». Это происходит из-за вызова [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) для сохранения ID во время `handleSend`. Однако, даже после клика «Undo», сообщение все ещё появляется. Попробуйте разобраться, почему этот код не работает, и исправить его.

<Hint>

Обычные переменные, такие как `let timeoutID` не «выживают» между повторными рендерами, потому что каждый рендер запускает компонент (и инициализирует переменные) с нуля.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Каждый раз когда компонент рендерится повторно (например, когда устанавливается новое состояние), все локальные переменные инициализируются с нуля. Поэтому вы не можете сохранить ID таймера в обычную переменную, как `timeoutID` и ожидать, что обработчик сможет «увидеть» её в будущем. Вместо этого сохраните её в реф, который React сохраняет между рендерами.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Исправьте ошибку при повторном рендере компонента {/*fix-a-component-failing-to-re-render*/}

Предполагается, что кнопка должна переключаться между отображением «On» и «Off». Но всегда отображается «Off». Что не так с эти кодом? Попробуйте исправить.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

В этом примере текущее значение реф используется для вычисления того, что отобразится на странице: `{isOnRef.current ? 'On' : 'Off'}`. Это признак того, что эти данные не должны хранится в рефе, и вместо этого должны храниться в состоянии. Чтобы исправить, удалите реф и используйте состояние вместо него:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Исправьте debouncing {/*fix-debouncing*/}

<<<<<<< HEAD
В данном примере все обработчики событий для кнопок являются ["debounced".](https://redd.one/blog/debounce-vs-throttle) Чтобы понять, как это работает, кликните на одну из кнопок. Обратите внимание, что сообщение появляется через секунду. Если нажать на кнопку во время ожидания сообщения, таймер сбросится. Таким образом, если вы продолжите кликать одну и ту же кнопку много раз, сообщение не появится до тех пор, пока не пройдёт секунда _после_ последнего клика. Debouncing позволяет вам установить задержку до тех пор, пока пользователь «не прекратит делать что-то», прежде чем произойдёт какое-то действие.
=======
In this example, all button click handlers are ["debounced".](https://kettanaito.com/blog/debounce-vs-throttle) To see what this means, press one of the buttons. Notice how the message appears a second later. If you press the button while waiting for the message, the timer will reset. So if you keep clicking the same button fast many times, the message won't appear until a second *after* you stop clicking. Debouncing lets you delay some action until the user "stops doing things".
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

Этот пример работает, но не совсем как было задумано. Кнопки не являются независимыми. Чтобы увидеть проблему, кликните на одну из кнопок и затем кликните на другую кнопку. Мы ожидаем увидеть два сообщения, которые привязаны к каждой кнопке. Но мы увидим только сообщение последней. Сообщение первой кнопки потерялось.

Почему кнопки конфликтуют между собой? Попробуйте найти и исправить проблему.

<Hint>

Последний ID таймера используется во всех компонентах `DebouncedButton`. В этом причина того, что клик по одной кнопке сбрасывает таймер другой. Можно ли хранить  ID таймера отдельно для каждой из кнопок?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Переменная  `timeoutID` была использована во всех компонентах. Поэтому клик по второй кнопке сбрасывал таймер ожидания первой. Чтобы это исправить, следует хранить таймер в рефе. Каждая кнопка получит свой реф, и вместе кнопки будут работать корректно. Обратите внимание, что быстрый клик по двум кнопкам покажет оба сообщения.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Прочитайте самое новое состояние {/*read-the-latest-state*/}

В данном примере, после нажатия «Send» есть небольшая задержка прежде чем  появится сообщение. Введите «hello», нажмите Send и потом снова отредактируйте поле ввода. Несмотря на редактирование, модальное окно все ещё показывает «hello» (эта строка была значением состояния [во время](/learn/state-as-a-snapshot#state-over-time), когда произошёл клик по кнопке).

Как правило, именно такое поведение вам необходимо в вашем приложении. Тем не менее, могут возникнуть случаи, когда будет необходимость получить доступ к самой _последней_ версии состояния в каком-либо асинхронном коде. Можете ли вы найти решение, чтобы модальное окно показывало _текущий_ текст поля ввода вместо состояния, которое сохранилось во время клика?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

Состояние работает как [снимок](/learn/state-as-a-snapshot), поэтому вы не сможете получить доступ к его последней версии из асинхронного кода, например внутри таймера. Однако, вы можете хранить последнее значение поля ввода в рефе. Реф является мутируемым, поэтому свойство `current` доступно для чтения в любое время. Поскольку, в этом примере, введённый текст также используется для рендера, вам необходимо использовать и *состояние* переменной (для рендера), и *реф* (для чтения внутри таймера). Обновляйте текущий реф вручную.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>