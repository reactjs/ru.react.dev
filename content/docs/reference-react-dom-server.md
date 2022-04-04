---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

Объект `ReactDOMServer` позволяет отрендерить компоненты в статическую разметку. В основном, он используется на Node-сервере.

```js
// ES-модули
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Обзор {#overview}

В окружении сервера и браузера могут использоваться методы:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

Следующие методы зависят от пакета `stream`, поэтому **доступны только на сервере** и не будут работать в браузере.

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Справочник {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Рендерит React-элемент в исходный HTML и возвращает его в виде строки. Вы можете использовать этот метод, чтобы сгенерировать HTML на сервере и отправить разметку в ответ на запрос, ускоряя загрузку страницы и позволяя поисковым движкам обработать ваши страницы для SEO.

<<<<<<< HEAD
Если вы вызываете [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на узле, который уже содержит разметку, отрендеренную на сервере, React сохранит её и закрепит только обработчики событий, позволяя вам значительно ускорить первоначальную загрузку страницы.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Похож на метод [`renderToString`](#rendertostring), но не создаёт дополнительных DOM-атрибутов, таких как `data-reactroot`, используемых внутри React. Этот метод полезен, когда вы хотите использовать React для генерации простой статической страницы, где отсутствие дополнительных атрибутов может сохранить несколько байтов. 

<<<<<<< HEAD
Не пользуйтесь этим методом, если вы планируете использовать React на клиенте для создания интерактивной разметки. Вместо него используйте [`renderToString`](#rendertostring) на сервере и [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клиенте.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
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
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Рендерит React-элемент в исходный HTML. Возвращает [поток для чтения](https://nodejs.org/api/stream.html#stream_readable_streams), который выводит HTML-строку. HTML из потока идентичен тому, что возвращает [`ReactDOMServer.renderToString`](#rendertostring). Вы можете использовать этот метод, чтобы сгенерировать HTML на сервере и отправить разметку в ответ на запрос, ускоряя загрузку страницы и позволяя поисковым движкам обработать ваши страницы для SEO.

<<<<<<< HEAD
Если вы вызываете [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на узле, который уже содержит разметку, отрендеренную на сервере, React сохранит её и закрепит только обработчики событий, позволяя вам значительно ускорить первоначальную загрузку страницы.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

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
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Примечание:
>
> Метод используется только на сервере. Этот API недоступен в браузере.
>
> Метод возвращает поток байтов, закодированный в utf-8. Если вам нужен поток с другой кодировкой, то посмотрите на проект [iconv-lite](https://www.npmjs.com/package/iconv-lite). Он позволяет преобразовывать кодировку потоков текста.
