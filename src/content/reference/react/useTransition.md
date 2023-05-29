---
title: useTransition
---

<Intro>

`useTransition` — это React хук, который позволяет вам обновлять состояние, не блокируя UI.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useTransition()` {/*usetransition*/}

Вызовите `useTransition` на верхнем уровне вашего компонента, чтобы пометить некоторые обновления состояния как переходы.

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

1. Флаг `isPending`, который указывает, есть ли ожидающий переход.
2. [Функция `startTransition`](#starttransition), которая позволяет помечать обновление состояния как переход.

---

### Функция `startTransition` {/*starttransition*/}

Функция `startTransition`, которую возвращает `useTransition`, позволяет помечать обновление состояния как переход.

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

#### Параметры {/*starttransition-parameters*/}

* `scope`: Функция, которая обновляет некоторое состояние, вызывая одну или несколько [функций `set`.](/reference/react/useState#setstate) React немедленно вызывает `scope` без параметров и помечает все обновления состояния, которые были синхронно запланированны во время вызова функции `scope`, как переходы. Они будут [неблокирующими](#marking-a-state-update-as-a-non-blocking-transition) и [не будут отображать нежелательные индикаторы загрузки.](#preventing-unwanted-loading-indicators)

#### Возвращаемое значение {/*starttransition-returns*/}

`startTransition` ничего не возвращает.

#### Подводные камни {/*starttransition-caveats*/}

* `useTransition` — это хук, поэтому его можно вызывать только внутри компонентов или пользовательских хуков. Если вам нужно запустить переход где-то ещё (например, из библиотеки данных), вместо этого вызовите автономный [`startTransition`](/reference/react/startTransition).

* Вы можете обернуть обновление в переход, только если у вас есть доступ к функции `set` этого состояния. Если вы хотите запустить переход в ответ на какой-либо проп или значение пользовательского хука, попробуйте вместо этого [`useDeferredValue`](/reference/react/useDeferredValue).

* Функция, которую вы передаёте в `startTransition`, должна быть синхронной. React немедленно выполнит эту функцию, пометя все обновления состояния, которые происходят во время его выполнения, как переходы. Если вы позже попытаетесь выполнить больше обновлений состояния (например, по тайм-ауту), то они не будут помечены как переходы.

* Обновление состояния, помеченное как переход, будет прервано другими обновлениями состояния. Например, если вы обновляете компонент диаграммы внутри перехода, но затем начинаете вводить текст в поле ввода, когда диаграмма находится в середине повторного рендера, React перезапустит работу по рендерингу компонента диаграммы после обработки обновления поля ввода.

* Обновления перехода не могут быть использованы для управления текстовыми полями ввода.

* Если существует несколько активных переходов, React, в настоящее время, группирует их вместе. Это ограничение, вероятно, будет убрано в будущих версиях.

---

## Использование {/*usage*/}

### Пометка обновления состояния как неблокирующего перехода {/*marking-a-state-update-as-a-non-blocking-transition*/}

Вызовите `useTransition` на верхнем уровне вашего компонента, чтобы пометить обновления состояния как неблокирующие *переходы*.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` возвращает массив ровно из двух элементов:

1. <CodeStep step={1}>Флаг `isPending`</CodeStep> указывает, есть ли ожидающий переход.
2. <CodeStep step={2}>Функция `startTransition`</CodeStep> позволяет пометить обновление состояния как переход.

Затем вы можете пометить обновление состояния как переход следующим образом:

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

Переходы позволяют сохранять отзывчивость обновлений пользовательского интерфейса даже на медленных устройствах.

С использованием переходов ваш UI остаётся отзывчивым во время повторного рендеринга. Например, если пользователь нажимает на вкладку, а затем меняет своё решение и нажимает на другую вкладку, он может сделать это, не дожидаясь завершения первого повторного рендеринга.

<Recipes titleText="Разница между useTransition и обычными обновлениями состояния" titleId="examples">

#### Обновление текущей вкладки в переходе {/*updating-the-current-tab-in-a-transition*/}

В этом примере вкладка "Posts" **искусственно замедлена**, чтобы ей требовалось не менее одной секунды для рендеринга.

Нажмите на "Posts", а затем сразу нажмите на "Contact". Обратите внимание, что это прерывает медленный рендеринг "Posts". Вкладка "Contact" отображается сразу. Поскольку это обновление состояния помечено как переход, медленный повторный рендеринг не блокирует пользовательский интерфейс.

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
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

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
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
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
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
```

</Sandpack>

<Solution />

#### Обновление текущей вкладки без перехода {/*updating-the-current-tab-without-a-transition*/}

В этом примере вкладка "Posts" также **искусственно замедлена**, так что для её рендера требуется не менее секунды. В отличие от предыдущего примера, это обновление состояния **не является переходом**.

Нажмите на "Posts", а затем сразу нажмите на "Contact". Обратите внимание, что приложение зависает при ренднре замедленной вкладки, а UI перестаёт отвечать на запросы. Это обновление состояния не является переходом, поэтому медленный повторный рендер заморозил пользовательский интерфейс.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
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

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
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
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
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
```

</Sandpack>

<Solution />

</Recipes>

---

### Updating the parent component in a transition {/*updating-the-parent-component-in-a-transition*/}

Вы также можете обновить состояние родительского компонента с помощью вызова `useTransition`. Например, этот компонент `TabButton` заключает свою логику `onClick` в переход:

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

Поскольку родительский компонент обновляет своё состояние внутри обработчика события `onClick`, это обновление состояния помечается как переход. Вот поэтому, как и в предыдущем примере, вы можете нажать на "Posts", а затем сразу же нажать на "Contact". Обновление выбранной вкладки помечается как переход, поэтому взаимодействия пользователя не блокируются.

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
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
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

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
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
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
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
```

</Sandpack>

---

### Отображение ожидающего визуального состояния во время перехода {/*displaying-a-pending-visual-state-during-the-transition*/}

Вы можете использовать булево значение `isPending`, возвращаемое `useTransition`, чтобы указать пользователю, что происходит переход. Например, кнопка вкладки может иметь специальное визуальное состояние «ожидание»:

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Обратите внимание, что нажатие на "Posts" теперь кажется более отзывчивым, потому что кнопка вкладки сразу же обновляется:

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
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
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

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
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
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
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
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
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

В этом примере компонент `PostsTab` получает некоторые данные, используя источник данных поддерживающий [Задержку](/reference/react/Suspense). Когда вы нажимаете на вкладку "Posts", компонент `PostsTab` *приостанавливается*, что приводит к появлению ближайшего запасного варианта загрузки:

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
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
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

```js TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Примечание: этот компонент написан с использованием экспериментального API,
// которого пока нет в стабильных версиях React.

// Для реалистичного примера, который вы можете использовать сегодня, попробуйте фреймворк,
// который интегрирован с Задержкой, например Relay или Next.js.

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

// Это временное решение для исправления ошибки и запуска демонстрационной версии.
// TODO: заменить на реальную реализацию, когда ошибка будет исправлена.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js ContactTab.js hidden
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


```js data.js hidden
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
    throw Error('Not implemented');
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

Скрытие всего контейнера вкладок для отображения индикатора загрузки приводит к неприятному пользовательскому опыту. Если вы добавите `useTransition` в `TabButton`, вы можете вместо этого указать состояние ожидания в кнопке вкладки.

Обратите внимание, что нажатие на "Posts" больше не заменяет весь контейнер вкладок на спиннер:

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
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
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

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
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
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Примечание: этот компонент написан с использованием экспериментального API,
// которого пока нет в стабильных версиях React.

// Для реалистичного примера, который вы можете использовать сегодня, попробуйте фреймворк,
// который интегрирован с Задержкой, например Relay или Next.js.

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

// Это временное решение для исправления ошибки и запуска демонстрационной версии.
// TODO: заменить на реальную реализацию, когда ошибка будет исправлена.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js ContactTab.js hidden
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


```js data.js hidden
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
    throw Error('Not implemented');
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

[Узнайте больше об использовании переходов с Задержкой.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Переходы будут «ждать» достаточно долго, чтобы не скрыть *уже показанный* контент (например, контейнер вкладок). Если бы во вкладке "Posts" присутствовала [вложенная граница `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads), переход бы её не «ждал».

</Note>

---

### Создание маршрутизатора, поддерживающего Suspense {/*building-a-suspense-enabled-router*/}

Если вы создаёте React-фреймворк или маршрутизатор, мы рекомендуем помечать навигацию между страницами как переходы.

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

Это рекомендуется по двум причинам:

- [Переходы прерываемы,](#marking-a-state-update-as-a-non-blocking-transition) что позволяет пользователю кликнуть куда-то ещё, не дожидаясь завершения повторного рендера.
- [Переходы предотвращают нежелательные индикаторы загрузки,](#preventing-unwanted-loading-indicators) что позволяет пользователю избежать резких скачков при навигации.

Вот небольшой упрощённый пример маршрутизатора, использующего переходы для навигации.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
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

```js Layout.js
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

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
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

```js Albums.js hidden
import { fetchData } from './data.js';

// Примечание: этот компонент написан с использованием экспериментального API,
// которого пока нет в стабильных версиях React.

// Для реалистичного примера, который вы можете использовать сегодня, попробуйте фреймворк,
// который интегрирован с Задержкой, например Relay или Next.js.

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

// Это временное решение для исправления ошибки и запуска демонстрационной версии.
// TODO: заменить на реальную реализацию, когда ошибка будет исправлена.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Примечание: этот компонент написан с использованием экспериментального API,
// которого пока нет в стабильных версиях React.

// Для реалистичного примера, который вы можете использовать сегодня, попробуйте фреймворк,
// который интегрирован с Задержкой, например Relay или Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Это временное решение для исправления ошибки и запуска демонстрационной версии.
// TODO: заменить на реальную реализацию, когда ошибка будет исправлена.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
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
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
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

Ожидается, что маршрутизаторы, поддерживающие [Задержку](/reference/react/Suspense), по умолчанию оборачивают обновления навигации в переходы.

</Note>

---

## Устранение неполадок {/*troubleshooting*/}

### Обновление ввода во время перехода не работает {/*updating-an-input-in-a-transition-doesnt-work*/}

Вы не можете использовать переход для переменной состояния, которая управляет вводом:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Нельзя использовать переходы для контролируемого состояния ввода
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Это происходит потому, что переходы являются неблокирующими, но обновление ввода в ответ на событие изменения должно происходить синхронно. Если вы хотите запустить переход при вводе текста, у вас есть два варианта:

1. Вы можете объявить две отдельные переменные состояния: одну для состояния ввода (которая всегда обновляется синхронно), и одну, которую вы будете обновлять во время перехода. Это позволит вам управлять вводом с использованием синхронного состояния и передавать переменную состояния перехода (которая будет «отставать» от ввода) в остальную логику рендеринга.
2. В качестве альтернативы, вы можете использовать одну переменную состояния и добавить [`useDeferredValue`](/reference/react/useDeferredValue), которая будет «отставать» от реального значения. Она будет вызывать неблокирующие перерисовки, чтобы «догнать» новое значение автоматически.

---

### React не обрабатывает моё обновление состояния как переход {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Когда вы оборачиваете обновление состояния в переход, убедитесь, что оно происходит *во время* вызова `startTransition`.

```js
startTransition(() => {
  // ✅ Установка состояния *во время* вызова startTransition
  setPage('/about');
});
```

Функция, которую вы передаёте `startTransition`, должна быть синхронной.

Вы не можете отметить обновление как переход вот так:

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

Аналогично, вы не можете отметить обновление как переход вот так:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Установка состояния *после* вызова startTransition
  setPage('/about');
});
```

Однако, это будет работать вместо этого:

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ Установка состояния *во время* вызова startTransition
  setPage('/about');
});
```

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

**Ожидается, что будет напечатано 1, 2, 3.** Функция, которую вы передаёте `startTransition`, не задерживается. В отличие от `setTimeout` в браузере, она не запускает колбэк позже. React немедленно выполняет вашу функцию, но любые обновления состояния, запланированные *во время её выполнения*, помечаются как переходы. Можно представить, что это работает так:

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
    // ... запланировать обновление состояния перехода ...
  } else {
    // ... запланировать срочное обновление состояния ...
  }
}
```
