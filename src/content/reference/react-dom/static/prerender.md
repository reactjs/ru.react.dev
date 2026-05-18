---
title: prerender
---

<Intro>

`prerender` рендерит дерево React в статический HTML-строку с использованием [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

```js
const {prelude} = await prerender(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Этот API зависит от [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Для Node.js используйте [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) вместо этого.

</Note>

---

## Справочник {/*reference*/}

### `prerender(reactNode, options?)` {/*prerender*/}

Вызовите `prerender`, чтобы отрендерить ваше приложение в статический HTML.

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

На клиенте вызовите [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы сделать сгенерированный сервером HTML интерактивным.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `reactNode`: Узел React, который вы хотите отрендерить в HTML. Например, JSX-узел вроде `<App />`. Ожидается, что он будет представлять весь документ, поэтому компонент App должен рендерить тег `<html>`.

* **необязательный** `options`: Объект с опциями статической генерации.
  * **необязательный** `bootstrapScriptContent`: Если указано, эта строка будет помещена во встроенный тег `<script>`.
  * **необязательный** `bootstrapScripts`: Массив строковых URL-адресов для тегов `<script>`, которые будут выведены на странице. Используйте это для включения `<script>`, который вызывает [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Пропустите его, если вы вообще не хотите запускать React на клиенте.
  * **необязательный** `bootstrapModules`: Подобно `bootstrapScripts`, но выводит [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) вместо этого.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для ID, сгенерированных [`useId`.](/reference/react/useId) Полезно для предотвращения конфликтов при использовании нескольких корней на одной странице. Должен быть тем же префиксом, что и переданный в [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **необязательный** `namespaceURI`: Строка с корневым [URI пространства имён](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) для потока. По умолчанию — обычный HTML. Передайте `'http://www.w3.org/2000/svg'` для SVG или `'http://www.w3.org/1998/Math/MathML'` для MathML.
  * **необязательный** `onError`: Обратный вызов, который срабатывает при любой ошибке на сервере, будь то [восстановимая](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) или [невосстановимая.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) По умолчанию вызывается `console.error`. Если вы переопределяете его для [логирования отчётов о сбоях](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server), убедитесь, что вы всё ещё вызываете `console.error`. Вы также можете использовать его для [установки кода состояния](/reference/react-dom/server/renderToReadableStream#setting-the-status-code) перед выводом оболочки.
  * **необязательный** `progressiveChunkSize`: Количество байт в чанке. [Подробнее о стандартной эвристике.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **необязательный** `signal`: [Сигнал отмены](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), который позволяет [отменить предварительный рендеринг](#aborting-prerendering) и рендерить остальное на клиенте.

#### Возвращает {/*returns*/}

`prerender` возвращает Promise:
- Если рендеринг успешен, Promise разрешится объектом, содержащим:
  - `prelude`: [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) HTML. Вы можете использовать этот поток для отправки ответа по частям или прочитать весь поток в строку.
- Если рендеринг не удался, Promise будет отклонён. [Используйте это для вывода запасной оболочки.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### Ограничения {/*caveats*/}

`nonce` недоступен в качестве опции при предварительном рендеринге. Nonce должны быть уникальными для каждого запроса, и если вы используете nonce для защиты вашего приложения с помощью [CSP](https://developer.developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), было бы неуместно и небезопасно включать значение nonce в сам предварительный рендеринг.


<Note>

### Когда следует использовать `prerender`? {/*when-to-use-prerender*/}

API статического `prerender` используется для статической генерации на стороне сервера (SSG). В отличие от `renderToString`, `prerender` ждёт загрузки всех данных перед разрешением. Это делает его подходящим для генерации статического HTML для полной страницы, включая данные, которые необходимо получить с помощью Suspense. Для потоковой передачи контента по мере его загрузки используйте API потоковой передачи SSR, такой как [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).

</Note>

---

## Использование {/*usage*/}

### Рендеринг дерева React в поток статического HTML {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

Вызовите `prerender`, чтобы отрендерить ваше дерево React в статический HTML в [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream):

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Вместе с <CodeStep step={1}>корневым компонентом</CodeStep> вам нужно предоставить список <CodeStep step={2}>путей к скриптам инициализации</CodeStep>. Ваш корневой компонент должен возвращать **весь документ, включая корневой тег `<html>`.**

Например, это может выглядеть так:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React вставит [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) и ваши <CodeStep step={2}>теги `<script>` для инициализации</CodeStep> в результирующий HTML-поток:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML из ваших компонентов ... -->
</html>
<script src="/main.js" async=""></script>
```

На клиенте ваш скрипт инициализации должен [гидрировать весь `document` вызовом `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Это прикрепит обработчики событий к статическому HTML, сгенерированному сервером, и сделает его интерактивным.

<DeepDive>

#### Чтение путей к CSS и JS ресурсам из вывода сборки {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Окончательные URL-адреса ресурсов (таких как файлы JavaScript и CSS) часто хешируются после сборки. Например, вместо `styles.css` вы можете получить `styles.123456.css`. Хеширование имён файлов статических ресурсов гарантирует, что каждая отдельная сборка одного и того же ресурса будет иметь разное имя файла. Это полезно, потому что позволяет безопасно включить долгосрочное кеширование для статических ресурсов: файл с определённым именем никогда не изменит своего содержимого.

Однако, если вы не знаете URL-адреса ресурсов до завершения сборки, у вас нет возможности поместить их в исходный код. Например, жёсткое кодирование `"/styles.css"` в JSX, как ранее, не сработает. Чтобы исключить их из вашего исходного кода, ваш корневой компонент может считывать реальные имена файлов из карты, переданной в качестве пропса:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

На сервере отрендерите `<App assetMap={assetMap} />` и передайте вашу `assetMap` с URL-адресами ресурсов:

```js {1-5,8,9}
// Вам нужно будет получить этот JSON из ваших инструментов сборки, например, прочитать его из вывода сборки.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Поскольку ваш сервер теперь рендерит `<App assetMap={assetMap} />`, вам также нужно будет отрендерить его с `assetMap` на клиенте, чтобы избежать ошибок гидратации. Вы можете сериализовать и передать `assetMap` клиенту следующим образом:

```js {9-10}
// Вам нужно будет получить этот JSON из ваших инструментов сборки.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    // Осторожно: Безопасно использовать stringify(), так как эти данные не генерируются пользователем.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

В приведенном выше примере опция `bootstrapScriptContent` добавляет дополнительный встроенный тег `<script>`, который устанавливает глобальную переменную `window.assetMap` на клиенте. Это позволяет клиентскому коду считывать ту же `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

И клиент, и сервер рендерят `App` с тем же пропсом `assetMap`, поэтому ошибок гидратации не возникает.

</DeepDive>

---

### Рендеринг дерева React в строку статического HTML {/*rendering-a-react-tree-to-a-string-of-static-html*/}

Вызовите `prerender`, чтобы отрендерить ваше приложение в строку статического HTML:

```js
import { prerender } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  
  const reader = prelude.getReader();
  let content = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      return content;
    }
    content += Buffer.from(value).toString('utf8');
  }
}
```

Это создаст начальный неинтерактивный HTML-вывод ваших компонентов React. На клиенте вам нужно будет вызвать [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы *гидрировать* этот сгенерированный сервером HTML и сделать его интерактивным.

---

### Ожидание загрузки всех данных {/*waiting-for-all-data-to-load*/}

`prerender` ждёт загрузки всех данных перед завершением генерации статического HTML и разрешением. Например, рассмотрим страницу профиля, которая отображает обложку, боковую панель с друзьями и фотографиями, а также список постов:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Представьте, что `<Posts />` нужно загрузить некоторые данные, что занимает некоторое время. В идеале вы хотите дождаться завершения загрузки постов, чтобы они были включены в HTML. Для этого вы можете использовать Suspense для приостановки загрузки данных, и `prerender` будет ждать завершения приостановленного контента перед разрешением в статический HTML.

<Note>

**Только источники данных, поддерживающие Suspense, активируют компонент Suspense.** К ним относятся:

- Получение данных с помощью фреймворков, поддерживающих Suspense, таких как [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) и [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Ленивая загрузка кода компонента с помощью [`lazy`](/reference/react/lazy)
- Чтение значения Promise с помощью [`use`](/reference/react/use)

Suspense **не** обнаруживает, когда данные загружаются внутри Effect или обработчика событий.

Точный способ загрузки данных в компоненте `Posts` выше зависит от вашего фреймворка. Если вы используете фреймворк, поддерживающий Suspense, вы найдёте подробности в его документации по получению данных.

Получение данных с поддержкой Suspense без использования специализированного фреймворка пока не поддерживается. Требования к реализации источника данных с поддержкой Suspense нестабильны и не документированы. Официальный API для интеграции источников данных с Suspense будет выпущен в будущей версии React.

</Note>

---

### Отмена предварительного рендеринга {/*aborting-prerendering*/}

Вы можете заставить предварительный рендеринг "сдаться" по истечении времени ожидания:

```js {2-5,11}
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // prelude будет содержать весь HTML, который был предварительно отрендерен
    // до того, как контроллер был отменен.
    const {prelude} = await prerender(<App />, {
      signal: controller.signal,
    });
    //...
```

Любые границы Suspense с незавершёнными дочерними элементами будут включены в prelude в состоянии отката.

---

## Устранение неполадок {/*troubleshooting*/}

### Мой поток не начинается до тех пор, пока всё приложение не будет отрендерено {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

Ответ `prerender` ждёт завершения рендеринга всего приложения, включая ожидание разрешения всех границ Suspense, перед разрешением. Он предназначен для статической генерации сайтов (SSG) заранее и не поддерживает потоковую передачу большего контента по мере его загрузки.

Для потоковой передачи контента по мере его загрузки используйте API потоковой передачи SSR, такой как [renderToReadableStream](/reference/react-dom/server/renderToReadableStream).
