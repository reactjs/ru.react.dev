---
title: Постановка в очередь серии обновления состояний
---

<Intro>
Обновление переменной состояния запускает в очередь новый рендер. Но иногда вам может понадобиться выполнить множество операций со значением перед следующим рендером. Чтобы сделать это, стоит понять, как React группирует обновления состояния.
</Intro>

<YouWillLearn>

* Что такое "группировка" и как React иcпользует ее для обработки множества обновлений состояния
* Как назначить несколько обновлений к одной и той же переменной состояния подряд

</YouWillLearn>

## React группирует обновления состояния {/*react-batches-state-updates*/}
Вы можете ожидать, что нажимая по кнопку "+3", вы увеличите значение счетчика трижды, т.к. `setNumber(number + 1)` вызывается три раза:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Кроме того, как вы, возможно, помните из прошлой секции, [each render's state values are fixed](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), значение `number` внутри обработчика событий первого рендера всегда равно `0`, независимо от того, сколько раз вы вызвали функцию `setNumber(1)`:
```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```
Кроме этого, есть еще один важный фактор. **React будет ждать пока *весь* код во всех обработчиках событий отработает, перед тем как выполнить обновления состояния.** Вот почему ре-рендер происходит *после* всех вызовов `setNumber()`.    


Для примера воспомним официанта, который принимает заказ в ресторане. Официант не бежит на кухню сразу после того, как услышал первое блюдо! Вместо этого, он ждет пока вы закончите свой заказ, уточняет его детали, и даже принимает заказы от других людей за столом.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

Это позволяет нам обновлять несколько переменных состояния--даже от нескольких компонентов--без вызова слишком большком большого количества [ре-рендеров.](/learn/render-and-commit#re-renders-when-state-updates) Но это также означает, что UI не будет обновлен до _того_, как ваши обработчики событий, и код в них, не исполнится. Это поведение, также известное как **группировка,** позволяет вашему React приложению работать гораздо быстрее. Это также позволяет избегать сбивающих с толку "наполовину законченных" рендеров, где обновились только некоторые переменные.

**React не группирует по *множеству* преднамеренных событий вроде кликов**-- каждый клик обрабыватывается отдельно. В остальном будьте уверены, что React группирует только тогда, когда это в общем безопасно для выполнения. Это гарантирует, например, что если первый клип по кнопке отключает форму, следующий клик не отправит ее снова.


## Обновления одного и того же состояния несколько раз до следующего рендера {/*updating-the-same-state-multiple-times-before-the-next-render*/}

Это не такой распространенный вариант использования, но если вы захотите обновить одну и ту же переменную состояния несколько раз до следующего рендера, вместо того чтобы передавать *следующее значение состояния* в виде `setNumber(number + 1)`, вы можете передать *функцию,* которая подсчитывает следующее состояние базируясь на предыдущем в очереди, типа `setNumber(n => n + 1)`
Это возможность сказать React "сделай что-то со значением состояния" вместо того, чтобы просто его заменить.

Попробуем увеличить значение счетчика сейчас:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>
Здесь, в `n => n + 1` вызывается **обновляющая функция.** Когда вы передаете ее в установшик состояния:

1. React назначает эту функцию в очередь, которая выполнится после всего остального кода в обработчике событий.
2. Во время следующего рендера, React запустит очередь и выдаст вам финальное обновление состояния.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Вот как React обработает сквозь эти строчки кода во время выполнения обработчика событий:

1. `setNumber(n => n + 1)`: `n => n + 1` это функция. React добавляет их в очередь
1. `setNumber(n => n + 1)`: `n => n + 1` это функция. React добавляет их в очередь
1. `setNumber(n => n + 1)`: `n => n + 1` это функция. React добавляет их в очередь

Когда вы вызываете `useState` в следующем рендере, React пропускает эту очередь. Предыдущее состояние `number`  было `0`, так что эта функция обновления и пропускает в следующем обновление как `n`, и так далее:  

|  запланированное обновление | `n` | возвращает |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React сохранит `3` как финальный результат и вернет его из `useState`.
Вот почему нажатие на "+3" в примере выше корректно увеличивает значение на 3.

### Что случится если вы обновите состояние после его замены {/*what-happens-if-you-update-state-after-replacing-it*/}

Что насчет обработчика событий? Как вы полагаете, какое значение примет `number` в следующем рендере?
```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Вот что обработчик событий говорит говорит сделать React:
1. `setNumber(number + 5)`: `number` равен `0`, так что `setNumber(0 + 5)`. React добавит *"заменить с `5`"*  в свою очередь.
2. `setNumber(n => n + 1)`: `n => n + 1` это обновляющая функция. React добавит *эту функцию* в свою очередь.

В продолжении следующего рендера, React пройдет через следующую очередь состояний:

|  очередь обновлений      | `n` | возвращает |
|--------------|---------|-----|
| "заменить с `5`" | `0` (не используется) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React хранит `6` как финальный результат и возвращает это из `useState`. 

<Note>
Вы могли заметить что `setState(5)` на самом деле работает как `setState(n => 5)`, но `n` не используется!
</Note>

### Что случится, если вы замените состояние после его обновления {/*what-happens-if-you-replace-state-after-updating-it*/}

Давайте посмотрим еще один пример. Как вы думаете, какое значение примет `number` в следующем рендере?
```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Вот как React обработает этот код во время выполнения обработчиков событий:
1. `setNumber(number + 5)`: `number` is `0`, so `setNumber(0 + 5)`. React добавит *"заменить на `5`"* в свою очередь.
2. `setNumber(n => n + 1)`: `n => n + 1` это функция обновления. React добавит *эту функцию* в свою очередь.
3. `setNumber(42)`: React добавит *"заменить на `42`"* в очередь.


В продолжении следующего рендера, React пройдет через следующие обновления состояния:

|  очередь обновления      | `n` | возвращает |
|--------------|---------|-----|
| "заменить с `5`" | `0` (не используется) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "заменить с `42`" | `6` (не используется) | `42` |

После React сохранит `42` как финальный результат и вернет его из `useState`.


Подводя итог, вот как вы можете передавать установщик состояния в `setNumber`:
* **Обновляющая функцию** (напр. `n => n + 1`) добавляется в очередь.
* **Любое другое значение** (напр. number `5`) добавляет "заменить на `5`" в очередь, игнорируя то, что уже было запланировано.


После того как все обработчики событий закончатся, React запустит ре-рендер. Во время ре-рендера, React обработает очередь. Обновляющие функции выполняются во время рендеринга, так что **так что обновляющие функции должны быть [чистыми](/learn/keeping-components-pure)** и *возвращать* только результат. Не пытайтесь устанавливать состояние изнутри или запускать другие побочные эффекты.
### Соглашение о наименовании {/*naming-conventions*/}

Достаточно распостраненный вариант именования аргумента обновляющей функции первыми буквами связанной с ней переменной состояния:
```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Если вы предпочитаете более длинный вариант, другим распространенным соглашенением является повторение полного наименования переменной состояния, типа `setEnabled(enabled => !enabled)`,  или же использование префикса типа `setEnabled(prevEnabled => !prevEnabled)`.
<Recap>

* Установка состояния не изменяет переменную в текущем рендере, но запустит новый рендер.
* React выполнит обновления стейта после обработчиков событий который успешно выполнились. Это называется группировка.
* Чтобы обновить любое состояние множество раз за одно событие, можно использовать функцию обновления `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### Исправление счетчика запросов {/*fix-a-request-counter*/}
Вы работаете над интернет-магазином произведений искусства, в котором пользователю можно делать множество заказов предметов искусства за один раз. Каждый раз когда пользователь нажимает кнопку "Buy", счетчик "Pending" должен увеличиться на единицу. После 3 секунд, "Pending" счетчик должен уменьшаться, а счетчик "Completed" должен увеличиваться. 
 
Однако, счетчик "Pending"  не работает как задумано. Когда вы нажимаете "Buy", значение уменьшается до `-1`(чего вообще не должно быть). И если вы быстро кликните дважды, оба счетчика сработают непредсказуемо.

Почему это происходит? Давайте починим оба счетчика.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Внутри  обработчика событий `handleClick`, значения `pending` и `completed` связаны с тем что они из себя предствляли на момент клика. В первом рендере, `pending` значение было `0`, так что `setPending(pending - 1)` стал `setPending(-1)`, что неверно. Раз уж мы хотим *увеличивать* или *уменьшать* счетчики, вместо того чтобы устанавливать для них конкретное значение, определенное во время клика, вы можете вместо этого передать функцию обновления:
<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Теперь вы уверенны, что когда вы увеличиваете или уменьшаете счетчик, вы действительно связываете его с *последним* состоянием, а не с тем, каким оно было на момент щелчка.
</Solution>

#### Реализуйте очередь состояния самостоятельно {/*implement-the-state-queue-yourself*/}

В этом задании, вы сами создадите крохотную часть React с нуля! Это не так сложно как кажется.

Посмотрите на превью sandbox. Стоит заметить что тут показано **четыре тестовых примера.** Они связаны с теми примерами, которые вы видели ранее на этой странице. Вашим заданием будет воссоздать функцию `getFinalState` так чтобы корректный результат возвращался в каждом примере. Если вы воссоздадите все правильно, все четыре теста должны пройти.

Вы получите два аргумента: `baseState` как изначальное состонияние(like `0`), и `очередь`, которая является массивом, который содержит как числа(типа `5`) и обновляющие функции (типа `n => n + 1`) в том порядке в котором они были добавлены.

Ваша задача вернуть итоговое значение, точно так же, как показано в таблицах на этой странице


<Hint>

Если вы чувствуете что застряли, начните вот с такой структуры кода:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: назначить обновляющую функцию
    } else {
      // TODO: заменить состояние
    }
  }

  return finalState;
}
```

Заполните пропущенные строчки!

</Hint>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: сделать что-нибудь с очередью...

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Алгоритм, который использует React для подсчета итогого состояния, представлен на этой странице:
<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      //  Назначаем обновляющую функцию.
      finalState = update(finalState);
    } else {
      // Заменяем следующее состояние.
      finalState = update;
    }
  }

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>
Теперь вы знаете как работает эта часть React!

</Solution>

</Challenges>