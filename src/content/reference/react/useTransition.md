---
title: useTransition
---

<Intro>
`useTransition` — это React-хук, который позволяет выполнять рендеринг части пользовательского интерфейса в фоновом режиме.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useTransition()` {/*usetransition*/}

Вызовите `useTransition` на верхнем уровне вашего компонента, чтобы пометить некоторые обновления состояния как Переходы.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

`useTransition` не принимает никаких параметров.

#### Возвращаемое значение {/*returns*/}

`useTransition` возвращает массив ровно из двух элементов:

1. Флаг `isPending`, который указывает, есть ли ожидающий Переход.
2. [Функция `startTransition`](#starttransition), которая позволяет помечать изменения как Переход.

---

### `startTransition(action)` {/*starttransition*/}

Функция `startTransition`, которую возвращает `useTransition`, позволяет помечать изменения как Переход.

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
#### Функции, вызываемые в `startTransition` называются «Действия»("Actions"). {/*functions-called-in-starttransition-are-called-actions*/}

Функция, переданная `startTransition`называется «Действие» ("Action"). По соглашению, любой колбэк, вызываемый внутри startTransition (например, колбэк-проп), должен называться `action` или иметь суффикс "Action" в имени:

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          submitAction();
        });
      }}
    >
      Отправить
    </button>
  );
}

```

</Note>



#### Параметры {/*starttransition-parameters*/}

* `action`: Функция, которая обновляет некоторое состояние, вызывая одну или несколько [функций `set`.](/reference/react/useState#setstate) React немедленно вызывает `action` без параметров и помечает все обновления состояния, которые были синхронно запланированы во время вызова функции `action`, как Переходы. Любые асинхронные вызовы, которые ожидаются в `action`, будут включены в Переход, но в настоящее время требуют обёртывания любых функций `set` после `await` в дополнительный startTransition (см. [Устранение неполадок](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Обновления состояния, помеченные как Переходы, будут [неблокирующими](#marking-a-state-update-as-a-non-blocking-transition) и [не будут отображать нежелательные индикаторы загрузки](#preventing-unwanted-loading-indicators).

#### Возвращаемое значение {/*starttransition-returns*/}

`startTransition` ничего не возвращает.

#### Подводные камни {/*starttransition-caveats*/}

* `useTransition` — это хук, поэтому его можно вызывать только внутри компонентов или пользовательских хуков. Если вам нужно запустить Переход где-то ещё (например, из библиотеки данных), вместо этого вызовите автономный [`startTransition`](/reference/react/startTransition).

* Вы можете обернуть обновление в Переход, только если у вас есть доступ к функции `set` этого состояния. Если вы хотите запустить Переход в ответ на какой-либо проп или значение пользовательского хука, попробуйте вместо этого [`useDeferredValue`](/reference/react/useDeferredValue).

* Функция, которую вы передаёте в `startTransition`, вызывается немедленно, помечая все обновления состояния, которые происходят во время его выполнения, как Переходы. Если вы попытаетесь обновить состояния в, например, `setTimeout`, то они не будут помечены как Переходы.

* Вы должны обернуть любые обновления состояния после асинхронных запросов в дополнительный `startTransition`, чтобы пометить их как Переходы. Это известное ограничение, которое мы планируем исправить в будущем (см. [Устранение неполадок](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Функция `startTransition` имеет стабильную идентичность, поэтому вы часто увидите, что её опускают в зависимостях Эффектов, но добавление её в список зависимостей не вызовет повторного срабатывания Эффекта. Если линтер позволяет опустить зависимость без ошибок, то это можно смело делать. [Узнайте больше о том, как удалять зависимости Эффекта.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Обновление состояния, помеченное как Переход, будет прервано другими обновлениями состояния. Например, если вы обновляете компонент диаграммы внутри Перехода, а затем начинаете вводить текст в поле ввода, когда диаграмма находится в середине повторного рендера, React перезапустит работу по рендерингу компонента диаграммы после обработки обновления поля ввода.

* Обновления Перехода не могут быть использованы для управления текстовыми полями ввода.

* Если существует несколько активных Переходов, React, в настоящее время, группирует их вместе. Это ограничение, вероятно, будет убрано в будущих версиях.

## Использование {/*usage*/}

### Выполняйте неблокирующие изменения с помощью Действий. {/*marking-a-state-update-as-a-non-blocking-transition*/}

Вызовите `useTransition` на верхнем уровне вашего компонента, чтобы создать Действие и получить доступ к состоянию ожидания.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` возвращает массив ровно из двух элементов:

1. <CodeStep step={1}>Флаг `isPending`</CodeStep> указывает, есть ли ожидающий Переход.
2. <CodeStep step={2}>Функция `startTransition`</CodeStep> позволяет создать Действие.

Чтобы начать Переход, передайте функцию в `startTransition` следующим образом:

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

Функция, передаваемая в `startTransition`, называется «Действие». Внутри Действия можно обновлять состояние и (опционально) выполнять побочные эффекты. Эта работа будет выполнена в фоновом режиме, не блокируя взаимодействие пользователя со страницей. Переход может включать несколько Действий, и пока Переход выполняется, ваш интерфейс остаётся отзывчивым. Например, если пользователь нажмёт на вкладку, а затем передумает и кликнет на другую — второй клик будет обработан немедленно, не дожидаясь завершения первого обновления.

Чтобы дать пользователю обратную связь о выполняющихся Переходах, состояние `isPending` переключается в `true` при первом вызове `startTransition` и остаётся `true`, пока все Действия не завершатся и финальное состояние не будет отображено пользователю. Переходы гарантируют, что побочные эффекты в Действиях выполняются последовательно, чтобы [избежать нежелательных индикаторов загрузки](#preventing-unwanted-loading-indicators). Также, во время выполнения Перехода можно обеспечить немедленную обратную связь с помощью `useOptimistic`.

<Recipes titleText="Разница между Действиями и обычной обработкой событий">

#### Обновление количества в Действии {/*updating-the-quantity-in-an-action*/}

В этом примере функция `updateQuantity` имитирует запрос к серверу для обновления количества товара в корзине. Эта функция *искусственно замедлена*, чтобы выполнение запроса занимало как минимум одну секунду.

Попробуйте быстро несколько раз обновить количество. Обратите внимание, что состояние "Total" остаётся в ожидании, пока выполняются запросы, и обновляется только после завершения последнего запроса. Поскольку обновление выполняется внутри Действия, значение "quantity" можно продолжать изменять, даже пока запрос ещё выполняется.

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
    // Чтобы получить доступ к состоянию ожидания перехода,
    // вызовите startTransition ещё раз.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Оформление заказа</h1>
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
    // Чтобы передать проп для действия, вызовите колбэк внутри startTransition.
    startTransition(async () => {
      action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Билеты на концерты группы Era</span>
      <label htmlFor="name">Количество: </label>
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
      <span>Итого:</span>
      <span>
        {isPending ? "🌀 Обновляется..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Имитируем медленный сетевой запрос.
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

Это базовый пример, демонстрирующий, как работают Действия, но этот пример не обрабатывает завершение запросов в неправильном порядке. При обновлении количества несколько раз возможно, что предыдущие запросы завершатся после более поздних, что приведет к обновлению количества не в том порядке. Это известное ограничение, которое мы исправим в будущем (см. [Устранение неполадок](#my-state-updates-in-transitions-are-out-of-order) ниже).

Для распространённых случаев использования React предоставляет встроенные абстракции, такие как:
- [`useActionState`](/reference/react/useActionState)
- [`<form>` actions](/reference/react-dom/components/form)
- [Серверные функции](/reference/rsc/server-functions)

Эти решения сами обрабатывают порядок запросов. При использовании Переходов для создания собственных хуков или библиотек, управляющих асинхронными состояниями, у вас есть больший контроль над порядком запросов, но вы должны обрабатывать это самостоятельно.

<Solution />

#### Обновление количества без Действия {/*updating-the-users-name-without-an-action*/}

В этом примере функция `updateQuantity` также имитирует запрос к серверу для обновления количества товара в корзине. Эта функция *искусственно замедлена*, чтобы выполнение запроса занимало как минимум одну секунду.

Попробуйте быстро несколько раз обновить количество. Обратите внимание, что состояние "Total" отображается в ожидании, пока выполняется любой запрос, но при этом "Total" обновляется несколько раз — каждый раз, когда нажимается кнопка изменения "quantity":

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
    // Ручное управление состоянием isPending.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Оформление заказа</h1>
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
      <span>Билеты на концерты группы Era</span>
      <label htmlFor="name">Количество: </label>
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
      <span>Итого:</span>
      <span>
        {isPending ? "🌀 Обновляется..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Имитируем медленный сетевой запрос.
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

Распространённое решение этой проблемы — запретить пользователю вносить изменения, пока количество обновляется:

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
    // Ручное управление состоянием isPending.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Оформление заказа</h1>
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
      <span>Билеты на концерты группы Era</span>
      <label htmlFor="name">Количество: </label>
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
      <span>Итого:</span>
      <span>
        {isPending ? "🌀 Обновляется..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Имитируем медленный сетевой запрос.
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

Этот подход делает приложение медленным на ощупь, так как пользователю приходится ждать каждый раз, когда он изменяет количество. Можно вручную добавить более сложную логику, чтобы позволить пользователю взаимодействовать с интерфейсом, пока количество обновляется, но Действия решают эту задачу с помощью простого и встроенного API.

<Solution />

</Recipes>

---

### Передача пропа `action` из компонентов {/*exposing-action-props-from-components*/}

Вы можете передать проп `action` из компонента, чтобы родительский компонент мог вызывать Действие.

Например, компонент `TabButton` оборачивает свою логику `onClick` в проп `action`:


```js {8-10}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

Поскольку родительский компонент обновляет своё состояние внутри `action`, это обновление состояния помечается как Переход. Это значит что, вы можете нажать на «Публикации», а затем сразу же нажать на «Контакты» — и это не блокирует взаимодействие с пользователем:

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
        Обо мне
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Публикации (замедлена)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Контакты
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
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
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
    <p>Добро пожаловать в мой профиль!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Логировать один раз. Фактическое замедление происходит внутри SlowPost.
  console.log('[ИСКУССТВЕННО ЗАМЕДЛЕННО] Рендеринг 500 <SlowPost />');

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
    // Ничего не делать в течение 1 мс за элемент, чтобы эмулировать чрезвычайно медленный код
  }

  return (
    <li className="item">
      Публикация №{index + 1}
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
        Найти меня в Интернете можно здесь:
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
```

</Sandpack>

---

### Отображение ожидающего визуального состояния {/*displaying-a-pending-visual-state*/}

Вы можете использовать булево значение `isPending`, возвращаемое `useTransition`, чтобы указать пользователю, что происходит Переход. Например, кнопка вкладки может иметь специальное визуальное состояние «ожидание»:

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Обратите внимание, что нажатие на «Публикации» теперь кажется более отзывчивым, потому что кнопка вкладки сразу же обновляется:

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
        Обо мне
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Публикации (замедлена)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Контакты
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
      startTransition(() => {
        action();
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
    <p>Добро пожаловать в мой профиль!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Логировать один раз. Фактическое замедление происходит внутри SlowPost.
  console.log('[ИСКУССТВЕННО ЗАМЕДЛЕННО] Рендеринг 500 <SlowPost />');

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
    // Ничего не делать в течение 1 мс за элемент, чтобы эмулировать чрезвычайно медленный код
  }

  return (
    <li className="item">
      Публикация №{index + 1}
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
        Найти меня в Интернете можно здесь:
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

В этом примере компонент `PostsTab` получает некоторые данные, используя [use](/reference/react/use). Когда вы нажимаете на вкладку «Публикации», компонент `PostsTab` *задерживается*, что приводит к появлению ближайшего запасного варианта загрузки:

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
    <Suspense fallback={<h1>🌀 Загрузка...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        Обо мне
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Публикации
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Контакты
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
    <p>Добро пожаловать в мой профиль!</p>
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
        Найти меня в Интернете можно здесь:
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
// Примечание: способ получения данных зависит от фреймворка,
// который вы используете вместе с Задержкой.
// Обычно логика кэширования находится внутри фреймворка.

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
    throw Error('Не реализовано');
  }
}

async function getPosts() {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Публикация №' + (i + 1)
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

Скрытие всего контейнера вкладок для отображения индикатора загрузки приводит к неприятному пользовательскому опыту. Если вы добавите `useTransition` в `TabButton`, вы можете вместо этого показать состояние ожидания в кнопке вкладки.

Обратите внимание, что нажатие на «Публикации» больше не заменяет весь контейнер вкладок на спиннер:

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
    <Suspense fallback={<h1>🌀 Загрузка...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        Обо мне
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Публикации
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Контакты
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
      startTransition(() => {
        action();
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
    <p>Добро пожаловать в мой профиль!</p>
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
        Найти меня в Интернете можно здесь:
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
// Примечание: способ получения данных зависит от фреймворка,
// который вы используете вместе с Задержкой.
// Обычно логика кэширования находится внутри фреймворка.

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
    throw Error('Не реализовано');
  }
}

async function getPosts() {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Публикация №' + (i + 1)
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

[Узнайте больше об использовании Переходов с Задержкой.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Переходы будут «ждать» достаточно долго, чтобы не скрыть *уже показанный* контент (например, контейнер вкладок). Если бы во вкладке «Публикации» присутствовала [вложенная граница `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads), Переход бы её не «ждал».

</Note>

---

### Создание маршрутизатора, поддерживающего Задержку {/*building-a-suspense-enabled-router*/}

Если вы создаёте React-фреймворк или маршрутизатор, мы рекомендуем помечать навигацию между страницами как Переходы.

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

- [Переходы прерываемы,](#marking-a-state-update-as-a-non-blocking-transition) что позволяет пользователю кликнуть куда-то ещё, не дожидаясь завершения повторного рендера.
- [Переходы предотвращают нежелательные индикаторы загрузки,](#preventing-unwanted-loading-indicators) что позволяет пользователю избежать резких скачков при навигации.
- [Переходы ожидают завершения всех ожидающих Действий](#perform-non-blocking-updates-with-actions), позволяя пользователю дождаться выполнения побочных эффектов перед отображением новой страницы.

Вот небольшой упрощённый пример маршрутизатора, использующего Переходы для навигации.

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
  return <h2>🌀 Загрузка...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Браузер музыки
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
      Открыть страницу исполнителя The Beatles
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
// Примечание: способ получения данных зависит от фреймворка,
// который вы используете вместе с Задержкой.
// Обычно логика кэширования находится внутри фреймворка.

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
    throw Error('Не реализовано');
  }
}

async function getBio() {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles — английская рок-группа, 
    сформированная в Ливерпуле в 1960 году, в состав которой входили 
    Джон Леннон, Пол Маккартни, Джордж Харрисон 
    и Ринго Старр.`;
}

async function getAlbums() {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
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

Ожидается, что маршрутизаторы, поддерживающие [Задержку](/reference/react/Suspense), по умолчанию оборачивают обновления навигации в Переходы.

</Note>

---

### Отображение ошибки пользователю с помощью границы ошибок {/*displaying-an-error-to-users-with-error-boundary*/}

Если функция, переданная в `startTransition`, выбрасывает ошибку, вы можете отобразить её пользователю с помощью [границы ошибок](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Чтобы использовать границу ошибок, оберните компонент, в котором вызывается `useTransition`, в границу ошибок. Как только функция, переданная в `startTransition`, выдаст ошибку, будет отображён запасной интерфейс  от границы ошибок.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Что-то пошло не так</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // Для демонстрации работы границы ошибок
  if (comment == null) {
    throw new Error("Пример ошибки: Искусственно выброшенная ошибка для проверки границы ошибок");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Специально не передаём комментарий
          // чтобы сгенерировать ошибку
          addComment();
        });
      }}
    >
      Добавить комментарий
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

### Обновление ввода во время Перехода не работает {/*updating-an-input-in-a-transition-doesnt-work*/}

Вы не можете использовать Переход для переменной состояния, которая управляет вводом:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Нельзя использовать Переходы для контролируемого состояния ввода
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Это происходит, потому что Переходы являются неблокирующими, но обновление ввода в ответ на событие изменения должно происходить синхронно. Если вы хотите запустить Переход при вводе текста, у вас есть два варианта:

1. Вы можете объявить две отдельные переменные состояния: одну для состояния ввода (которая всегда обновляется синхронно), и одну, которую вы будете обновлять во время Перехода. Это позволит вам управлять вводом с использованием синхронного состояния и передавать переменную состояния Перехода (которая будет «отставать» от ввода) в остальную логику рендеринга.
2. В качестве альтернативы, вы можете использовать одну переменную состояния и добавить [`useDeferredValue`](/reference/react/useDeferredValue), так что она будет «отставать» от реального значения. Она будет вызывать неблокирующие перерисовки, чтобы «догнать» новое значение автоматически.

---

### React не обрабатывает моё обновление состояния как Переход {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Когда вы оборачиваете обновление состояния в Переход, убедитесь, что оно происходит *во время* вызова `startTransition`.

```js
startTransition(() => {
  // ✅ Установка состояния *во время* вызова startTransition
  setPage('/about');
});
```

Функция, которую вы передаёте `startTransition`, должна быть синхронной. Вы не можете отметить обновление как Переход вот так:

```js
startTransition(() => {
  // ❌ Установка состояния *после* вызова startTransition
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Вместо этого вы можете сделать следующее:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Установка состояния *во время* вызова startTransition
    setPage('/about');
  });
}, 1000);
```

---

### React не считает обновление состояния после `await` Переходом {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

Когда вы используете `await` внутри функции `startTransition`, обновления состояния, которые происходят после `await`, не помечаются как Переходы. Чтобы исправить это, необходимо обернуть каждое обновление состояния после `await` в отдельный вызов `startTransition`:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Не используется startTransition после await
  setPage('/about');
});
```

Однако, это будет работать вместо этого:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Использование startTransition *после* await
  startTransition(() => {
    setPage('/about');
  });
});
```

Это ограничение JavaScript, связанное с тем, что React теряет область видимости асинхронного контекста. В будущем, когда станет доступен [AsyncContext](https://github.com/tc39/proposal-async-context), это ограничение будет снято.

---

### Я хочу вызвать `useTransition` вне компонента {/*i-want-to-call-usetransition-from-outside-a-component*/}

Вы не можете вызывать `useTransition` вне компонента, так как это хук. В этом случае, используйте отдельный метод [`startTransition`](/reference/react/startTransition). Он работает так же, но не предоставляет индикатор `isPending`.

---

### Функция, которую я передаю `startTransition`, сразу же выполняется {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Если вы запустите этот код, он напечатает 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**Ожидается, что будет напечатано 1, 2, 3.** Функция, которую вы передаёте `startTransition`, не задерживается. В отличие от `setTimeout` в браузере, она не запускает колбэк позже. React немедленно выполняет вашу функцию, но любые обновления состояния, запланированные *во время её выполнения*, помечаются как Переходы. Можно представить, что это работает так:

```js
// Упрощённая версия того, как работает React

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... запланировать обновление состояния Перехода ...
  } else {
    // ... запланировать срочное обновление состояния ...
  }
}
```

### Мои обновления состояния в Переходах приходят не по порядку {/*my-state-updates-in-transitions-are-out-of-order*/}

Если вы используете `await` внутри `startTransition`, вы можете столкнуться с тем, что обновления будут происходить не в том порядке.

В этом примере функция `updateQuantity` имитирует запрос к серверу для обновления количества товара в корзине. Эта функция *искусственно возвращает каждый второй запрос после предыдущего*, чтобы смоделировать состояние гонки сетевых запросов.

Попробуйте сначала обновить количество один раз, а затем быстро несколько раз подряд. Возможно, вы увидите некорректное итоговое значение:

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
  // Храним фактическое количество в отдельном состоянии, чтобы показать расхождение.
  const [clientQuantity, setClientQuantity] = useState(1);
  
  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Получаем доступ к состоянию ожидания перехода,
    // обернув вызов снова в startTransition.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Оформление заказа</h1>
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
    // Обновляем количество внутри Действия.
    startTransition(() => {
      action(e.target.value);
    });
  }  
  return (
    <div className="item">
      <span>Билеты на концерты группы Era</span>
      <label htmlFor="name">Количество: </label>
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
      <span>Итого:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Обновляется..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Неверный итог, ожидалось: ${intl.format(clientQuantity * 9999)}`}
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
        // Имитируем, что каждый второй запрос выполняется медленнее
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


При множественном нажатии возможно, что предыдущие запросы завершатся после более поздних. В таких случаях React на данный момент не может определить предполагаемый порядок. Это происходит потому, что обновления планируются асинхронно, и React теряет контекст порядка на границе асинхронного кода.

Это ожидаемое поведение, так как Действия внутри одного Перехода не гарантируют порядок выполнения. Для распространённых случаев React предоставляет более высокоуровневые абстракции, такие как [`useActionState`](/reference/react/useActionState) и [`<form>` действия](/reference/react-dom/components/form), которые сами управляют порядком. Для более сложных кейсов придётся реализовать собственную логику очередей и отмены запросов.

