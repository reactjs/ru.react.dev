---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

Объект `ReactDOMServer` позволяет вам отрендерить компоненты в статическую разметку. В основном, он используется на Node сервере.

```js
// ES модули
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Обзор {#overview}

В окружении сервера и браузера могут использоваться методы:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

Следующие методы зависят от пакета (`stream`), поэтому **доступны только на сервере** и не могут выполняться в браузере.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Справочник {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Рендерит React-элемент в исходный HTML. React вернёт HTML строку. Вы можете использовать этот метод, чтобы сгенерировать HTML на сервере и отправить разметку в ответе на запрос, ускоряя загрузку страницы и позволяя поиcковым движкам обработать ваши страницы для SEO.

Если вы вызываете [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на узле, который уже содержит разметку, отрендеренную на сервере, React сохранит её и закрепит только обработчики событий, позволяя вам значительно ускорить первоначальную загрузку страницы.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```
Похож на метод [`renderToString`](#rendertostring), но не создаёт дополнительных DOM-аттрибутов, таких как `data-reactroot`, используемых внутри реакта. Метод полезен, когда вы хотите использовать React для генерации простой статической страницы, где отсутствие дополнительных аттрибутов может сохранить несколько байт. 

Не пользуйтесь этим методом, если вы планируете использовать React на клиенте для создания интерактивной разметки. Вместо него используйте [`renderToString`](#rendertostring) на сервере и [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клиенте.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Рендерит React элемент в исходный HTML. Возвращает [Поток для чтения](https://nodejs.org/api/stream.html#stream_readable_streams), который отдаёт HTML строку. HTML из потока идентичен тому, что возвращает [`ReactDOMServer.renderToString`](#rendertostring). Вы можете использовать этот метод, чтобы сгенерировать HTML на сервере и отправить разметку в ответе на запрос, ускоряя загрузку страницы и позволяя поиcковым движкам обработать ваши страницы для SEO.

Если вы вызываете [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на узле, который уже содержит разметку, отрендеренную на сервере, React сохранит её и закрепит только обработчики событий, позволяя вам значительно ускорить первоначальную загрузку страницы.

> Примечание:
>
> Метод используется только на сервере. Этот API не доступен в браузере.
>
> Метод возвращает поток, который отдаёт поток байт, закодированный в utf-8. Если вам нужен поток с другой кодировкой, то взгляните на проект [iconv-lite](https://www.npmjs.com/package/iconv-lite). Он позволяет преобразовывать потоки для транскодировки текста.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Похож на метод [`renderToNodeStream`](#rendertonodestream), но не создаёт дополнительных DOM-аттрибутов, таких как `data-reactroot`, используемых внутри реакта. Метод полезен, когда вы хотите использовать React для генерации простой статической страницы, где отсутствие дополнительных аттрибутов может сохранить несколько байт. 

Поток отдаёт HTML, идентичный тому, что возвращает [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup).

Не пользуйтесь этим методом, если вы планируете использовать React на клиенте для создания интерактивной разметки. Вместо него используйте [`renderToNodeStream`](#rendertonodestream) на сервере и [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клиенте.

> Примечание:
>
> Метод используется только на сервере. Этот API не доступен в браузере.
>
> Метод возвращает поток, который отдаёт поток байт, закодированный в utf-8. Если вам нужен поток с другой кодировкой, то взгляните на проект [iconv-lite](https://www.npmjs.com/package/iconv-lite). Он позволяет преобразовывать потоки для транскодировки текста.
