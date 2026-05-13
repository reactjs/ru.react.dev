---
title: useTransition
---

<Intro>

`useTransition` — это React Hook, который позволяет отображать часть пользовательского интерфейса в фоновом режиме.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Ссылка {/*reference*/}

### `useTransition()` {/*usetransition*/}

Вызовите `useTransition` на верхнем уровне вашего компонента, чтобы пометить некоторые обновления состояния как Transitions.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

`useTransition` не принимает никаких параметров.

#### Возвращает {/*returns*/}

`useTransition` возвращает массив ровно с двумя элементами:

1. Флаг `isPending`, который сообщает, есть ли ожидающая Transition.
2. Функция [`startTransition`](#starttransition), которая позволяет помечать обновления как Transition.

---

### `startTransition(action)` {/*starttransition*/}

Функция `startTransition`, возвращаемая `useTransition`, позволяет помечать обновление как Transition.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<Note>
#### Функции, вызываемые в `startTransition`, называются «Действиями». {/*functions-called-in-starttransition-are-called-actions*/}

Функция, передаваемая в `startTransition`, называется «Действием». По соглашению, любой обратный вызов, вызываемый внутри `startTransition` (например, обратный вызов prop), должен называться `action` или включать суффикс «Action»:

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>

#### Параметры {/*starttransition-parameters*/}

* `action`: Функция, которая обновляет некоторое состояние, вызывая одну или несколько [`set` функций](/reference/react/useState#setstate). React вызывает `action` немедленно без параметров и помечает все обновления состояния, запланированные синхронно во время вызова функции `action`, как Transitions. Любые асинхронные вызовы, ожидаемые в `action`, будут включены в Transition, но в настоящее время требуют оборачивания любых `set` функций после `await` в дополнительный `startTransition` (см. [Устранение неполадок](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Обновления состояния, помеченные как Transitions, будут [неблокирующими](#marking-a-state-update-as-a-non-blocking-transition) и [не будут отображать нежелательные индикаторы загрузки](#preventing-unwanted-loading-indicators).

#### Возвращает {/*starttransition-returns*/}

`startTransition` ничего не возвращает.

#### Предостережения {/*starttransition-caveats*/}

* `useTransition` — это Hook, поэтому его можно вызывать только внутри компонентов или пользовательских Hooks. Если вам нужно запустить Transition в другом месте (например, из библиотеки данных), вместо этого вызовите автономный [`startTransition`](/reference/react/startTransition).

* Вы можете обернуть обновление в Transition, только если у вас есть доступ к `set` функции этого состояния. Если вы хотите запустить Transition в ответ на какой-либо prop или значение пользовательского Hook, попробуйте вместо этого [`useDeferredValue`](/reference/react/useDeferredValue).

* Функция, которую вы передаете в `startTransition`, вызывается немедленно, помечая все обновления состояния, которые происходят во время ее выполнения, как Transitions. Если вы попытаетесь выполнить обновления состояния в `setTimeout`, например, они не будут помечены как Transitions.

* Вы должны обернуть любые обновления состояния после любых асинхронных запросов в другой `startTransition`, чтобы пометить их как Transitions. Это известное ограничение, которое мы исправим в будущем (см. [Устранение неполадок](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Функция `startTransition` имеет стабильную идентичность, поэтому вы часто будете видеть, что она опущена из зависимостей Effect, но включение ее не приведет к срабатыванию Effect. Если линтер позволяет вам опустить зависимость без ошибок, это безопасно. [Узнайте больше об удалении зависимостей Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Обновление состояния, помеченное как Transition, будет прервано другими обновлениями состояния. Например, если вы обновляете компонент диаграммы внутри Transition, но затем начинаете печатать в поле ввода, пока диаграмма находится в середине повторного рендеринга, React перезапустит работу по рендерингу компонента диаграммы после обработки обновления ввода.

* Обновления Transition нельзя использовать для управления текстовыми полями ввода.

* Если есть несколько текущих Transitions, React в настоящее время объединяет их вместе. Это ограничение, которое может быть удалено в будущей версии.


## Использование {/*usage*/}

### Выполнение неблокирующих обновлений с помощью Actions {/*perform-non-blocking-updates-with-actions*/}

Вызовите `useTransition` в верхней части вашего компонента, чтобы создать Actions, и получить доступ к состоянию ожидания:

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` возвращает массив ровно с двумя элементами:

1.  <CodeStep step={1}>Флаг `isPending`</CodeStep>, который сообщает, есть ли ожидающий Transition.
2.  <CodeStep step={2}>Функция `startTransition`</CodeStep>, которая позволяет вам создать Action.

Чтобы запустить Transition, передайте функцию в `startTransition` следующим образом:

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

Функция, переданная в `startTransition`, называется «Action». Вы можете обновлять состояние и (опционально) выполнять побочные эффекты внутри Action, и работа будет выполняться в фоновом режиме, не блокируя взаимодействия пользователя на странице. Transition может включать несколько Actions, и пока Transition выполняется, ваш UI остается отзывчивым. Например, если пользователь нажимает на вкладку, но затем передумывает и нажимает на другую вкладку, второй клик будет обработан немедленно, не дожидаясь завершения первого обновления.

Чтобы предоставить пользователю обратную связь о выполняющихся Transitions, состояние `isPending` переключается в `true` при первом вызове `startTransition` и остается `true`, пока все Actions не завершатся и конечное состояние не будет показано пользователю. Transitions гарантируют завершение побочных эффектов в Actions, чтобы [предотвратить нежелательные индикаторы загрузки](#preventing-unwanted-loading-indicators), и вы можете предоставить немедленную обратную связь, пока Transition выполняется, с помощью `useOptimistic`.

<Recipes titleText="Разница между Actions и обычной обработкой событий">

#### Обновление количества в Action {/*updating-the-quantity-in-an-action*/}

В этом примере функция `updateQuantity` имитирует запрос к серверу для обновления количества товара в корзине. Эта функция *искусственно замедлена*, чтобы выполнение запроса занимало не менее секунды.

Обновите количество несколько раз быстро. Обратите внимание, что состояние ожидания «Total» отображается, пока выполняются какие-либо запросы, и «Total» обновляется только после завершения последнего запроса. Поскольку обновление находится в Action, «quantity» может продолжать обновляться, пока выполняется запрос.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, await the callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Это базовый пример, демонстрирующий работу Actions, но этот пример не обрабатывает запросы, завершающиеся не по порядку. При многократном обновлении количества возможно, что предыдущие запросы завершатся после более поздних запросов, что приведет к обновлению количества не по порядку. Это известное ограничение, которое мы исправим в будущем (см. [Устранение неполадок](#my-state-updates-in-transitions-are-out-of-order) ниже).

Для распространенных вариантов использования React предоставляет встроенные абстракции, такие как:
- [`useActionState`](/reference/react/useActionState)
- [Действия `<form>`](/reference/react-dom/components/form)
- [Server Functions](/reference/rsc/server-functions)

Эти решения обрабатывают порядок запросов за вас. При использовании Transitions для создания собственных пользовательских хуков или библиотек, которые управляют переходами асинхронного состояния, у вас больше контроля над порядком запросов, но вы должны обрабатывать его самостоятельно.

<Solution />

#### Обновление количества без Action {/*updating-the-users-name-without-an-action*/}

В этом примере функция `updateQuantity` также имитирует запрос к серверу для обновления количества товара в корзине. Эта функция *искусственно замедлена*, чтобы выполнение запроса занимало не менее секунды.

Обновите количество несколько раз быстро. Обратите внимание, что состояние ожидания «Total» отображается, пока выполняются какие-либо запросы, но «Total» обновляется несколько раз для каждого нажатия «quantity»:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Общим решением этой проблемы является предотвращение внесения изменений пользователем, пока количество обновляется:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Это решение делает приложение медленным, потому что пользователь должен ждать каждый раз, когда он обновляет количество. Можно вручную добавить более сложную обработку, чтобы позволить пользователю взаимодействовать с UI, пока количество обновляется, но Actions обрабатывают этот случай с помощью простого встроенного API.

<Solution />


### Предоставление пропса `action` из компонентов {/*exposing-action-props-from-components*/}

Вы можете предоставить пропс `action` из компонента, чтобы разрешить родительскому компоненту вызывать Action.

Например, этот компонент `TabButton` оборачивает свою логику `onClick` в пропс `action`:

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async. 
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

Поскольку родительский компонент обновляет своё состояние внутри `action`, это обновление состояния помечается как Transition. Это означает, что вы можете нажать на «Posts», а затем сразу нажать «Contact», и это не блокирует взаимодействие с пользователем:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async. 
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<Note>

При предоставлении пропса `action` из компонента, вы должны `await` его внутри transition.

Это позволяет колбэку `action` быть синхронным или асинхронным, не требуя дополнительного `startTransition` для оборачивания `await` в action.

</Note>

---

### Отображение визуального состояния ожидания {/*displaying-a-pending-visual-state*/}

Вы можете использовать логическое значение `isPending`, возвращаемое `useTransition`, чтобы указать пользователю, что Transition выполняется. Например, кнопка вкладки может иметь специальное визуальное состояние «ожидание»:

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Обратите внимание, как нажатие «Posts» теперь ощущается более отзывчивым, потому что сама кнопка вкладки обновляется сразу:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Предотвращение нежелательных индикаторов загрузки {/*preventing-unwanted-loading-indicators*/}

В этом примере компонент `PostsTab` получает некоторые данные, используя [use](/reference/react/use). Когда вы нажимаете вкладку «Posts», компонент `PostsTab` *приостанавливает* выполнение, вызывая появление ближайшего запасного варианта загрузки:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Скрытие всего контейнера вкладок для отображения индикатора загрузки приводит к неприятному пользовательскому опыту. Если добавить `useTransition` в `TabButton`, можно вместо этого отображать состояние ожидания в кнопке вкладки.

Обратите внимание, что нажатие «Posts» больше не заменяет весь контейнер вкладок спиннером:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Подробнее об использовании Transitions с Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Transitions только «ждут» достаточно долго, чтобы избежать скрытия *уже отображенного* контента (например, контейнера вкладок). Если бы у вкладки Posts была [вложенная граница `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads), Transition не стала бы «ждать» ее.

</Note>

---


### Создание роутера с поддержкой Suspense {/*building-a-suspense-enabled-router*/}

Если вы создаёте фреймворк React или роутер, мы рекомендуем помечать переходы по страницам как Transitions.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Это рекомендуется по трём причинам:

- [Transitions можно прервать,](#marking-a-state-update-as-a-non-blocking-transition) что позволяет пользователю уйти, не дожидаясь завершения перерендера.
- [Transitions предотвращают нежелательные индикаторы загрузки,](#preventing-unwanted-loading-indicators) что позволяет пользователю избежать резких скачков при навигации.
- [Transitions ждут завершения всех ожидающих действий,](#perform-non-blocking-updates-with-actions) что позволяет пользователю дождаться завершения побочных эффектов, прежде чем будет показана новая страница.

Вот упрощённый пример роутера, использующего Transitions для навигации.

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

Ожидается, что роутеры с [поддержкой Suspense](/reference/react/Suspense) по умолчанию будут оборачивать обновления навигации в Transitions.

</Note>

---

### Отображение ошибки пользователям с помощью предохранителя {/*displaying-an-error-to-users-with-error-boundary*/}

Если функция, переданная в `startTransition`, выдаёт ошибку, вы можете отобразить ошибку пользователю с помощью [предохранителя](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Чтобы использовать предохранитель, оберните компонент, в котором вы вызываете `useTransition`, в предохранитель. Как только функция, переданная в `startTransition`, выдаст ошибку, будет отображён fallback для предохранителя.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Устранение неполадок {/*troubleshooting*/}

### Обновление input в Transition не работает {/*updating-an-input-in-a-transition-doesnt-work*/}

Вы не можете использовать Transition для переменной состояния, которая управляет input:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Нельзя использовать Transitions для управляемого состояния input
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Это связано с тем, что Transitions являются неблокирующими, но обновление input в ответ на событие изменения должно происходить синхронно. Если вы хотите запустить Transition в ответ на ввод текста, у вас есть два варианта:

1.  Вы можете объявить две отдельные переменные состояния: одну для состояния input (которая всегда обновляется синхронно) и одну, которую вы будете обновлять в Transition. Это позволит вам управлять input, используя синхронное состояние, и передавать переменную состояния Transition (которая будет «отставать» от input) в остальную часть вашей логики рендеринга.
2.  В качестве альтернативы, вы можете иметь одну переменную состояния и добавить [`useDeferredValue`](/reference/react/useDeferredValue), которая будет «отставать» от реального значения. Она будет запускать неблокирующие перерендеринги, чтобы автоматически «догнать» новое значение.

---

### React не обрабатывает мое обновление состояния как Transition {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Когда вы оборачиваете обновление состояния в Transition, убедитесь, что это происходит *во время* вызова `startTransition`:

```js
startTransition(() => {
  // ✅ Установка состояния *во время* вызова startTransition
  setPage('/about');
});
```

Функция, которую вы передаете в `startTransition`, должна быть синхронной. Вы не можете пометить обновление как Transition следующим образом:

```js
startTransition(() => {
  // ❌ Установка состояния *после* вызова startTransition
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Вместо этого вы можете сделать так:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Установка состояния *во время* вызова startTransition
    setPage('/about');
  });
}, 1000);
```

---

### React не обрабатывает мое обновление состояния после `await` как Transition {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

Когда вы используете `await` внутри функции `startTransition`, обновления состояния, которые происходят после `await`, не помечаются как Transitions. Вы должны обернуть обновления состояния после каждого `await` в вызов `startTransition`:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Не используется startTransition после await
  setPage('/about');
});
```

Однако, это работает вместо этого:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Использование startTransition *после* await
  startTransition(() => {
    setPage('/about');
  });
});
```

Это ограничение JavaScript из-за того, что React теряет область видимости асинхронного контекста. В будущем, когда [AsyncContext](https://github.com/tc39/proposal-async-context) станет доступен, это ограничение будет снято.

---

### Я хочу вызвать `useTransition` извне компонента {/*i-want-to-call-usetransition-from-outside-a-component*/}

Вы не можете вызвать `useTransition` вне компонента, потому что это Hook. В этом случае используйте вместо этого автономный метод [`startTransition`](/reference/react/startTransition). Он работает так же, но не предоставляет индикатор `isPending`.

---

### Функция, которую я передаю в `startTransition`, выполняется немедленно {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Если вы запустите этот код, он выведет 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**Ожидается, что он выведет 1, 2, 3.** Функция, которую вы передаете в `startTransition`, не задерживается. В отличие от браузерного `setTimeout`, она не запускает обратный вызов позже. React выполняет вашу функцию немедленно, но любые обновления состояния, запланированные *во время ее выполнения*, помечаются как Transitions. Вы можете представить, что это работает так:

```js
// Упрощенная версия того, как работает React

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... запланировать обновление состояния Transition ...
  } else {
    // ... запланировать срочное обновление состояния ...
  }
}
```

### Мои обновления состояния в Transitions выполняются не по порядку {/*my-state-updates-in-transitions-are-out-of-order*/}

Если вы используете `await` внутри `startTransition`, вы можете увидеть, что обновления происходят не по порядку.

В этом примере функция `updateQuantity` имитирует запрос к серверу для обновления количества товара в корзине. Эта функция *искусственно возвращает каждый второй запрос после предыдущего*, чтобы имитировать гонки для сетевых запросов.

Попробуйте обновить количество один раз, а затем быстро обновить его несколько раз. Вы можете увидеть неверную общую сумму:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  
  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(async () => {
      await action(e.target.value);
    });
  }  
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Обновление..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Неверная общая сумма, ожидается: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>

При многократном нажатии возможно, что предыдущие запросы завершатся после более поздних запросов. Когда это происходит, React в настоящее время не имеет возможности узнать предполагаемый порядок. Это связано с тем, что обновления запланированы асинхронно, и React теряет контекст порядка через асинхронную границу.

Это ожидаемо, потому что Actions внутри Transition не гарантируют порядок выполнения. Для распространенных вариантов использования React предоставляет абстракции более высокого уровня, такие как [`useActionState`](/reference/react/useActionState) и действия [`<form>`](/reference/react-dom/components/form), которые обрабатывают упорядочение за вас. Для расширенных вариантов использования вам потребуется реализовать собственную очередь и логику прерывания для обработки этого.

Пример обработки порядка выполнения `useActionState`:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
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
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Return the new quantity to update the state
    },
    1 // Initial quantity
  );

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }  
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Обновление..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Неверная общая сумма, ожидается: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>