---
title: <Activity>
version: experimental
---
<Experimental>

**Этот API экспериментальный и еще недоступен в стабильной версии React.**

Вы можете попробовать его, обновив пакеты React до последней экспериментальной версии:

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

Оберните часть пользовательского интерфейса в `<Activity>`, чтобы управлять состоянием её видимости:

```js
import {unstable_Activity as Activity} from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

В режиме "hidden" (`скрытый`) дочерние элементы `<Activity />` не видны на странице. Если новый `<Activity>` монтируется в режиме "hidden", то он предварительно рендерит контент с пониженным приоритетом, не блокируя видимый контент на странице, но не монтирует его, создавая эффекты. Когда видимый `<Activity>` переключается в режим "hidden", он концептуально размонтируется, уничтожая все эффекты, но сохраняет своё состояние. Это позволяет быстро переключаться между состояниями "visible" и "hidden" без повторного создания состояния для скрытого `<Activity>`.

В будущем, скрытые `<Activity>` могут автоматически уничтожать состояние на основе ресурсов, таких как память.

#### Props {/*props*/}

* `children`: Фактический UI, который вы хотите отобразить.
* **optional** `mode`: Либо "visible" (`видимый`), либо "hidden" (`скрытый`). По умолчанию "visible". В режиме "hidden" обновления дочерних элементов откладываются до более низкого приоритета. Компонент не будет создавать эффекты до тех пор, пока `<Activity>` не будет переключен в режим "visible". Если видимый `<Activity>` переключается в режим "hidden", эффекты будут уничтожены.

#### Особенности {/*caveats*/}

- В режиме "hidden" дочерние элементы `<Activity>` скрываются на странице.
- `<Activity>` размонтирует все эффекты при переключении из режима "visible" в "hidden" без уничтожения состояния React или DOM. Это означает, что эффекты, которые должны запускаться только один раз при монтировании, будут запускаться снова при переключении из режима "hidden" в "visible". Концептуально, скрытые `<Activity>` размонтируются, но не уничтожаются. Мы рекомендуем использовать [`<StrictMode>`](/reference/react/StrictMode) для отлова любых неожиданных побочных эффектов такого поведения.
- При использовании с `<ViewTransition>`, скрытые `<Activity>` при появлении в переходе активируют анимацию "входа". Видимые `<Activity>`, скрытые в переходе, активируют анимацию "выхода".
- Части UI, обернутые в `<Activity mode="hidden">`, не включаются в SSR-ответ.
- Части UI, обернутые в `<Activity mode="visible">`, будут гидратироваться с более низким приоритетом, чем другой контент.

---

## Использование {/*usage*/}

### Предварительный рендеринг части UI {/*pre-render-part-of-the-ui*/}

Вы можете предварительно отрендерить часть UI, используя `<Activity mode="hidden">`:

```js
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

Когда `<Activity>` рендерится в режиме `mode="hidden"`, дочерние элементы не видны на странице, но рендерятся с более низким приоритетом, чем видимый контент на странице.

Когда `mode` позже переключается на "visible", предварительно отрендеренные дочерние элементы будут смонтированы и станут видимыми. Это можно использовать для подготовки частей UI, с которыми пользователь, вероятно, будет взаимодействовать в дальнейшем, чтобы сократить время загрузки.

В следующем примере из [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators) компонент `PostsTab` получает данные с помощью `use`. Когда вы нажимаете на вкладку "Posts", компонент `PostsTab` приостанавливается, вызывая появление индикатора загрузки кнопки:

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

В этом примере пользователю нужно ждать загрузки постов при нажатии на вкладку "Posts".

Мы можем сократить задержку для вкладки "Posts", предварительно отрендерив неактивные вкладки с помощью скрытого `<Activity>`:

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

### Сохранение состояния части UI {/*keeping-state-for-part-of-the-ui*/}


Вы можете сохранить состояние для частей UI, переключив `<Activity>` из режима "visible" в "hidden":

```js
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

Когда `<Activity>` переключается из `mode="visible"` в "hidden", дочерние элементы становятся невидимыми на странице и размонтируются с уничтожением всех эффектов, но сохраняют своё состояние React и DOM.

Когда `mode` позже переключается на "visible", сохранённое состояние будет повторно использовано при монтировании дочерних элементов с созданием всех эффектов. Это можно использовать для сохранения состояния в частях UI, с которыми пользователь, вероятно, снова будет взаимодействовать, чтобы сохранить состояние DOM или React.

В следующем примере из [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators) `ContactTab` включает `<textarea>` с черновиком сообщения для отправки. Если вы введете текст и переключитесь на другую вкладку, а затем снова нажмете на вкладку "Contact", черновик сообщения будет утерян:


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

Это приводит к потере введенных пользователем данных DOM. Мы можем сохранить состояние для вкладки "Contact", скрыв неактивные вкладки с помощью `<Activity>`:


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

### Эффекты не монтируются, когда `<Activity>` скрыт {/*effects-dont-mount-when-an-activity-is-hidden*/}

Когда `<Activity>` "скрыт", все эффекты размонтируются. Концептуально, компонент размонтируется, но React сохраняет его состояние для последующего использования.

Это особенность Activity, поскольку она означает, что подписки не будут активны для скрытых частей пользовательского интерфейса, что уменьшает объем работы для скрытого контента. Это также означает, что очистка, такая как пауза видео (что ожидалось бы при размонтировании без Activity), будет выполнена. Когда Activity переключается в режим "видимый", он монтируется путем создания эффектов, которые будут подписываться и воспроизводить видео.

Рассмотрим следующий пример, где для каждой кнопки воспроизводится разное видео:


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
        <button onClick={() => setVideo(1)}>Большой кролик Багз Банни</button>
        <button onClick={() => setVideo(2)}>Слоны мечтают</button>
      </div>
      {video === 1 &&
        <VideoPlayer key={1}
          // 'Big Buck Bunny' лицензирован под CC 3.0 фондом Blender. Хостинг archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      }
      {video === 2 && 
        <VideoPlayer key={2}
          // 'Elephants Dream' от Orange Open Movie Project Studio, лицензирован под CC-3.0, хостинг archive.org
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
    console.error(`Несколько воспроизводимых видео: ${playing.length}`);
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


При каждом переключении видео и возврате назад видео перезагружается с начала. Чтобы сохранить состояние, вы можете попытаться отрисовать оба видео и скрыть неактивное видео с помощью `display: none`. Однако это приведет к одновременному воспроизведению обоих видео:


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
        <button onClick={() => setVideo(1)}>Большой кролик Багз Банни</button>
        <button onClick={() => setVideo(2)}>Слоны мечтают</button>
      </div>
      <div style={{display: video === 1 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Big Buck Bunny' лицензирован под CC 3.0 фондом Blender. Хостинг archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      </div>
      <div style={{display: video === 2 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Elephants Dream' от Orange Open Movie Project Studio, лицензирован под CC-3.0, хостинг archive.org
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
          console.error(`Несколько воспроизводимых видео: ${playing.length}`);
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

Это похоже на то, что произошло бы, если бы Activity монтировал эффекты при скрытии. Аналогично, если бы Activity не размонтировал эффекты при скрытии, видео продолжали бы воспроизводиться в фоновом режиме.

Activity решает эту проблему, не создавая эффекты при первом рендеринге в режиме "скрытый" и уничтожая все эффекты при переключении с "видимый" на "скрытый":


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
        <button onClick={() => setVideo(1)}>Большой кролик Багз Банни</button>
        <button onClick={() => setVideo(2)}>Слоны мечтают</button>
      </div>
      <Activity mode={video === 1 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Big Buck Bunny' лицензирован под CC 3.0 фондом Blender. Хостинг archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />
      </Activity>
      <Activity mode={video === 2 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Elephants Dream' от Orange Open Movie Project Studio, лицензирован под CC-3.0, хостинг archive.org
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
          console.error(`Несколько воспроизводимых видео: ${playing.length}`);
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

По этой причине лучше думать об Activity концептуально как о "размонтировании" и "повторном монтировании" компонента, но с сохранением состояния React или DOM для последующего использования. На практике это работает ожидаемым образом, если вы следовали руководству [Вам может не понадобиться эффект](learn/you-might-not-need-an-effect). Чтобы быстро выявлять проблемные эффекты, мы рекомендуем добавить [`<StrictMode>`](/reference/react/StrictMode), который будет принудительно выполнять размонтирование и монтирование Activity для выявления любых неожиданных побочных эффектов.

### Мой скрытый `<Activity>` не рендерится в SSR {/*my-hidden-activity-is-not-rendered-in-ssr*/}

При использовании `<Activity mode="hidden">` во время рендеринга на стороне сервера (SSR) содержимое Activity не будет включено в ответ SSR. Это связано с тем, что содержимое невидимо на странице и не требуется для первоначального рендеринга. Если вам нужно включить содержимое в ответ SSR, вы можете использовать другой подход, например [`useDeferredValue`](/reference/react/useDeferredValue), чтобы отложить рендеринг содержимого.