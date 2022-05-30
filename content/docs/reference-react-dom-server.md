---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

Объект `ReactDOMServer` позволяет отрендерить компоненты в статическую разметку. В основном, он используется на Node-сервере.

```js
<<<<<<< HEAD
// ES-модули
import ReactDOMServer from 'react-dom/server';
=======
// ES modules
import * as ReactDOMServer from 'react-dom/server';
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Обзор {#overview}

<<<<<<< HEAD
В окружении сервера и браузера могут использоваться методы:
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

<<<<<<< HEAD
Следующие методы зависят от пакета `stream`, поэтому **доступны только на сервере** и не будут работать в браузере.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Справочник {#reference}
=======
## Reference {#reference}
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

<<<<<<< HEAD
Рендерит React-элемент в исходный HTML и возвращает его в виде строки. Вы можете использовать этот метод, чтобы сгенерировать HTML на сервере и отправить разметку в ответ на запрос, ускоряя загрузку страницы и позволяя поисковым движкам обработать ваши страницы для SEO.

Если вы вызываете [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на узле, который уже содержит разметку, отрендеренную на сервере, React сохранит её и закрепит только обработчики событий, позволяя вам значительно ускорить первоначальную загрузку страницы.
=======
Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

<<<<<<< HEAD
Похож на метод [`renderToString`](#rendertostring), но не создаёт дополнительных DOM-атрибутов, таких как `data-reactroot`, используемых внутри React. Этот метод полезен, когда вы хотите использовать React для генерации простой статической страницы, где отсутствие дополнительных атрибутов может сохранить несколько байтов. 

Не пользуйтесь этим методом, если вы планируете использовать React на клиенте для создания интерактивной разметки. Вместо него используйте [`renderToString`](#rendertostring) на сервере и [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клиенте.
=======
Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

<<<<<<< HEAD
Рендерит React-элемент в исходный HTML. Возвращает [поток для чтения](https://nodejs.org/api/stream.html#stream_readable_streams), который выводит HTML-строку. HTML из потока идентичен тому, что возвращает [`ReactDOMServer.renderToString`](#rendertostring). Вы можете использовать этот метод, чтобы сгенерировать HTML на сервере и отправить разметку в ответ на запрос, ускоряя загрузку страницы и позволяя поисковым движкам обработать ваши страницы для SEO.

Если вы вызываете [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на узле, который уже содержит разметку, отрендеренную на сервере, React сохранит её и закрепит только обработчики событий, позволяя вам значительно ускорить первоначальную загрузку страницы.
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

> Примечание:
>
> Метод используется только на сервере. Этот API не доступен в браузере.
>
> Метод возвращает поток байтов, закодированный в utf-8. Если вам нужен поток с другой кодировкой, то посмотрите на проект [iconv-lite](https://www.npmjs.com/package/iconv-lite). Он позволяет преобразовывать кодировку потоков текста.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Похож на метод [`renderToNodeStream`](#rendertonodestream), но не создаёт дополнительных DOM-атрибутов, таких как `data-reactroot`, используемых внутри React. Метод полезен, когда вы хотите использовать React для генерации простой статической страницы, где отсутствие дополнительных атрибутов может сохранить несколько байтов. 

Поток выводит HTML, идентичный тому, что возвращает [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

<<<<<<< HEAD
Не пользуйтесь этим методом, если вы планируете использовать React на клиенте для создания интерактивной разметки. Вместо него используйте [`renderToNodeStream`](#rendertonodestream) на сервере и [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клиенте.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

> Примечание:
>
> Метод используется только на сервере. Этот API недоступен в браузере.
>
<<<<<<< HEAD
> Метод возвращает поток байтов, закодированный в utf-8. Если вам нужен поток с другой кодировкой, то посмотрите на проект [iconv-lite](https://www.npmjs.com/package/iconv-lite). Он позволяет преобразовывать кодировку потоков текста.
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
