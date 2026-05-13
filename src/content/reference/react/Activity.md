---
title: <Activity>
version: experimental
---

<Experimental>

**Этот API экспериментальный и пока недоступен в стабильной версии React.**

Вы можете попробовать его, обновив пакеты React до самой последней экспериментальной версии:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Экспериментальные версии React могут содержать ошибки. Не используйте их в продакшене.

</Experimental>

<Intro>

`<Activity>` позволяет скрывать и показывать часть пользовательского интерфейса.

```js
<Activity mode={mode}>
  <Page />
</Activity>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<Activity>` {/*activity*/}

Оберните часть пользовательского интерфейса в `<Activity>`, чтобы управлять его состоянием видимости:

```js
import {unstable_Activity as Activity} from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

Когда установлено значение "hidden", `children` компонента `<Activity />` не отображаются на странице. Если новый `<Activity>` монтируется как "hidden", то он предварительно отрисовывает контент с более низким приоритетом, не блокируя видимый контент на странице, но не монтируется путем создания Effects. Когда "visible" Activity переключается на "hidden", он концептуально размонтируется, уничтожая все Effects, но сохраняет свое состояние. Это позволяет быстро переключаться между состояниями "visible" и "hidden" без повторного создания состояния для "hidden" Activity.

В будущем "hidden" Activities могут автоматически уничтожать состояние на основе таких ресурсов, как память.

#### Пропсы {/*props*/}

* `children`: Фактический пользовательский интерфейс, который вы собираетесь отрисовать.
* **необязательный** `mode`: Либо "visible", либо "hidden". По умолчанию "visible". Когда установлено значение "hidden", обновления дочерних элементов откладываются до более низкого приоритета. Компонент не будет создавать Effects, пока Activity не переключится на "visible". Если "visible" Activity переключается на "hidden", Effects будут уничтожены.

#### Предостережения {/*caveats*/}

- Пока скрыто, `children` компонента `<Activity>` скрыты на странице.
- `<Activity>` размонтирует все Effects при переключении с "visible" на "hidden" без уничтожения состояния React или DOM. Это означает, что Effects, которые должны запускаться только один раз при монтировании, будут запускаться снова при переключении с "hidden" на "visible". Концептуально, "hidden" Activities размонтируются, но они также не уничтожаются. Мы рекомендуем использовать [`<StrictMode>`](/reference/react/StrictMode), чтобы обнаружить любые непредвиденные побочные эффекты от такого поведения.
- При использовании с `<ViewTransition>` скрытые activities, которые отображаются в переходе, активируют анимацию "enter". Visible Activities, скрытые в переходе, активируют анимацию "exit".
- Части пользовательского интерфейса, обернутые в `<Activity mode="hidden">`, не включаются в ответ SSR.
- Части пользовательского интерфейса, обернутые в `<Activity mode="visible">`, будут гидратироваться с более низким приоритетом, чем другой контент.

---


## Использование {/*usage*/}

### Предварительный рендер части пользовательского интерфейса {/*pre-render-part-of-the-ui*/}

Вы можете предварительно отрендерить часть пользовательского интерфейса, используя `<Activity mode="hidden">`:

```js
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

Когда Activity рендерится с `mode="hidden"`, `children` не отображаются на странице, но рендерятся с более низким приоритетом, чем видимое содержимое страницы.

Когда `mode` позже переключается на "visible", предварительно отрендеренные children смонтируются и станут видимыми. Это можно использовать для подготовки частей пользовательского интерфейса, с которыми пользователь, вероятно, будет взаимодействовать в следующий раз, чтобы уменьшить время загрузки.

В следующем примере из [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators), компонент `PostsTab` извлекает некоторые данные, используя `use`. Когда вы нажимаете вкладку «Posts», компонент `PostsTab` приостанавливается, в результате чего появляется состояние загрузки кнопки:

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
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
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
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

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

</Sandpack>

В этом примере пользователю нужно подождать, пока загрузятся посты, при нажатии на вкладку «Posts».

Мы можем уменьшить задержку для вкладки «Posts», предварительно отрендерив неактивные вкладки со скрытым `<Activity>`:

<Sandpack>

```js
import { Suspense, useState, unstable_Activity as Activity } from "react";
import TabButton from "./TabButton.js";
import AboutTab from "./AboutTab.js";
import PostsTab from "./PostsTab.js";
import ContactTab from "./ContactTab.js";

export default function TabContainer() {
  const [tab, setTab] = useState("about");
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === "about"} action={() => setTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} action={() => setTab("posts")}>
        Posts
      </TabButton>
      <TabButton isActive={tab === "contact"} action={() => setTab("contact")}>
        Contact
      </TabButton>
      <hr />
      <Activity mode={tab === "about" ? "visible" : "hidden"}>
        <AboutTab />
      </Activity>
      <Activity mode={tab === "posts" ? "visible" : "hidden"}>
        <PostsTab />
      </Activity>
      <Activity mode={tab === "contact" ? "visible" : "hidden"}>
        <ContactTab />
      </Activity>
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
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
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
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

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

</Sandpack>

---

### Сохранение состояния для части UI {/*keeping-state-for-part-of-the-ui*/}

Вы можете сохранять состояние для частей пользовательского интерфейса, переключая `<Activity>` с "visible" на "hidden":

```js
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

Когда Activity переключается с `mode="visible"` на "hidden", `children` будут скрыты на странице и размонтированы путем уничтожения всех Effects, но сохранят свое состояние React и DOM.

Когда `mode` позже переключится на "visible", сохраненное состояние будет повторно использовано при монтировании children путем создания всех Effects. Это можно использовать для сохранения состояния в тех частях пользовательского интерфейса, с которыми пользователь, вероятно, будет взаимодействовать снова, чтобы поддерживать состояние DOM или React.

В следующем примере из [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators), `ContactTab` включает в себя `<textarea>` с черновиком сообщения для отправки. Если вы введете какой-либо текст и перейдете на другую вкладку, то при повторном нажатии на вкладку «Contact» черновик сообщения будет потерян:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('contact');
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
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
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
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

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

</Sandpack>

Это приводит к потере состояния DOM, введенного пользователем. Мы можем сохранить состояние для вкладки Contact, скрыв неактивные вкладки с помощью `<Activity>`:

<Sandpack>

```js
import { Suspense, useState, unstable_Activity as Activity } from "react";
import TabButton from "./TabButton.js";
import AboutTab from "./AboutTab.js";
import PostsTab from "./PostsTab.js";
import ContactTab from "./ContactTab.js";

export default function TabContainer() {
  const [tab, setTab] = useState("about");
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === "about"} action={() => setTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} action={() => setTab("posts")}>
        Posts
      </TabButton>
      <TabButton isActive={tab === "contact"} action={() => setTab("contact")}>
        Contact
      </TabButton>
      <hr />
      <Activity mode={tab === "about" ? "visible" : "hidden"}>
        <AboutTab />
      </Activity>
      <Activity mode={tab === "posts" ? "visible" : "hidden"}>
        <PostsTab />
      </Activity>
      <Activity mode={tab === "contact" ? "visible" : "hidden"}>
        <ContactTab />
      </Activity>
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
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
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
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

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

</Sandpack>

---


## Устранение неполадок {/*troubleshooting*/}

### Эффекты не монтируются, когда Activity скрыто {/*effects-dont-mount-when-an-activity-is-hidden*/}

Когда `<Activity>` «скрыто», все эффекты размонтируются. Концептуально компонент размонтируется, но React сохраняет состояние для последующего использования.

Это особенность Activity, потому что это означает, что подписки не будут подписаны для скрытых частей пользовательского интерфейса, что уменьшает объем работы для скрытого контента. Это также означает, что очистка, такая как приостановка видео (которая ожидается, если вы размонтировали без Activity), запустится. Когда Activity переключается в состояние «visible», он смонтируется, создав эффекты, которые подпишутся и воспроизведут видео.

Рассмотрим следующий пример, в котором для каждой кнопки воспроизводится разное видео:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';
import './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      {video === 1 &&
        <VideoPlayer key={1}
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      }
      {video === 2 && 
        <VideoPlayer key={2}
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      }
    </>
  );
}
```

```js src/checker.js hidden
let interval = setInterval(() => {
  const videos = Array.from(document.querySelectorAll('video'));
  const playing = videos.filter(
    (v) => !v.paused
  );
  if (playing.length > 1) {
    console.error(`Multiple playing videos: ${playing.length}`);
  }
    
}, 50);
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

</Sandpack>

Всякий раз, когда вы меняете видео и возвращаетесь, видео перезагружается с самого начала. Чтобы сохранить состояние, вы можете попробовать отобразить оба видео и скрыть неактивное видео в `display: none`. Однако это приведет к одновременному воспроизведению обоих видео:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';
import VideoChecker from './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      <div style={{display: video === 1 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      </div>
      <div style={{display: video === 2 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      </div>
      <VideoChecker />
    </>
  );
}
```

```js src/checker.js hidden
import {useRef, useEffect} from 'react';

export default function VideoChecker() {
  const hasLogged = useRef(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (hasLogged.current === false) {

        const videos = Array.from(document.querySelectorAll('video'));
        const playing = videos.filter(
          (v) => !v.paused
        );
        if (hasLogged.current === false && playing.length > 1) {
          hasLogged.current = true;
          console.error(`Multiple playing videos: ${playing.length}`);
        }
      }

    }, 50);
    
    return () => {
      hasLogged.current = false;
      clearInterval(interval);
    }
  });
  
}

```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

</Sandpack>

Это похоже на то, что произошло бы, если бы Activity монтировал эффекты при скрытии. Аналогичным образом, если бы Activity не размонтировал эффекты при скрытии, видео продолжали бы воспроизводиться в фоновом режиме.

Activity решает эту проблему, не создавая эффекты при первом отображении как «hidden» и уничтожая все эффекты при переключении с «visible» на «hidden»:

<Sandpack>

```js
import { useState, useRef, useEffect, unstable_Activity as Activity } from 'react';
import VideoChecker from './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      <Activity mode={video === 1 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />
      </Activity>
      <Activity mode={video === 2 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      </Activity>
      <VideoChecker />
    </>
  );
}
```

```js src/checker.js hidden
import {useRef, useEffect} from 'react';

export default function VideoChecker() {
  const hasLogged = useRef(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (hasLogged.current === false) {

        const videos = Array.from(document.querySelectorAll('video'));
        const playing = videos.filter(
          (v) => !v.paused
        );
        if (hasLogged.current === false && playing.length > 1) {
          hasLogged.current = true;
          console.error(`Multiple playing videos: ${playing.length}`);
        }
      }

    }, 50);
    
    return () => {
      hasLogged.current = false;
      clearInterval(interval);
    }
  });
  
}

```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

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

</Sandpack>

По этой причине лучше всего думать об Activity концептуально как о «размонтировании» и «повторном монтировании» компонента, но сохранении состояния React или DOM для последующего использования. На практике это работает, как и ожидалось, если вы следовали руководству [Вам, возможно, не нужен эффект](learn/you-might-not-need-an-effect). Чтобы быстро найти проблемные эффекты, мы рекомендуем добавить [`<StrictMode>`](/reference/react/StrictMode), который будет быстро выполнять размонтирование и монтирование Activity, чтобы выявить любые непредвиденные побочные эффекты.

### Моя скрытая Activity не отображается в SSR {/*my-hidden-activity-is-not-rendered-in-ssr*/}

Когда вы используете `<Activity mode="hidden">` во время рендеринга на стороне сервера, содержимое Activity не будет включено в ответ SSR. Это связано с тем, что содержимое не отображается на странице и не требуется для начального рендеринга. Если вам нужно включить содержимое в ответ SSR, вы можете использовать другой подход, например [`useDeferredValue`](/reference/react/useDeferredValue), чтобы отложить рендеринг содержимого.