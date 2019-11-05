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

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Справочник {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Рендерит React-элемент в исходный HTML и возвращает его в виде строки. Вы можете использовать этот метод, чтобы сгенерировать HTML на сервере и отправить разметку в ответ на запрос, ускоряя загрузку страницы и позволяя поисковым движкам обработать ваши страницы для SEO.

Если вы вызываете [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на узле, который уже содержит разметку, отрендеренную на сервере, React сохранит её и закрепит только обработчики событий, позволяя вам значительно ускорить первоначальную загрузку страницы.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Похож на метод [`renderToString`](#rendertostring), но не создаёт дополнительных DOM-атрибутов, таких как `data-reactroot`, используемых внутри React. Этот метод полезен, когда вы хотите использовать React для генерации простой статической страницы, где отсутствие дополнительных атрибутов может сохранить несколько байтов. 

Не пользуйтесь этим методом, если вы планируете использовать React на клиенте для создания интерактивной разметки. Вместо него используйте [`renderToString`](#rendertostring) на сервере и [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клиенте.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Рендерит React-элемент в исходный HTML. Возвращает [поток для чтения](https://nodejs.org/api/stream.html#stream_readable_streams), который выводит HTML-строку. HTML из потока идентичен тому, что возвращает [`ReactDOMServer.renderToString`](#rendertostring). Вы можете использовать этот метод, чтобы сгенерировать HTML на сервере и отправить разметку в ответ на запрос, ускоряя загрузку страницы и позволяя поисковым движкам обработать ваши страницы для SEO.

Если вы вызываете [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на узле, который уже содержит разметку, отрендеренную на сервере, React сохранит её и закрепит только обработчики событий, позволяя вам значительно ускорить первоначальную загрузку страницы.

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

Не пользуйтесь этим методом, если вы планируете использовать React на клиенте для создания интерактивной разметки. Вместо него используйте [`renderToNodeStream`](#rendertonodestream) на сервере и [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) на клиенте.

> Примечание:
>
> Метод используется только на сервере. Этот API недоступен в браузере.
>
> Метод возвращает поток байтов, закодированный в utf-8. Если вам нужен поток с другой кодировкой, то посмотрите на проект [iconv-lite](https://www.npmjs.com/package/iconv-lite). Он позволяет преобразовывать кодировку потоков текста.
