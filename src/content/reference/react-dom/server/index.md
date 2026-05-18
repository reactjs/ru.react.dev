---
title: API React DOM для сервера
---
<Intro>

API `react-dom/server` позволяют выполнять рендеринг React-компонентов на стороне сервера в HTML. Эти API используются только на сервере на верхнем уровне вашего приложения для генерации начального HTML. [Фреймворк](/learn/start-a-new-react-project#production-grade-react-frameworks) может вызывать их за вас. Большинству ваших компонентов не нужно их импортировать или использовать.

</Intro>

---

## Server APIs for Node.js Streams {/*server-apis-for-nodejs-streams*/}

Эти методы доступны только в средах с [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) рендерит React-дерево в pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)

---

## Server APIs for Web Streams {/*server-apis-for-web-streams*/}

Эти методы доступны только в средах с [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), которые включают браузеры, Deno и некоторые современные edge-среды выполнения:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) рендерит React-дерево в [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

---

## Legacy Server APIs for non-streaming environments {/*legacy-server-apis-for-non-streaming-environments*/}

Эти методы можно использовать в средах, которые не поддерживают потоки:

* [`renderToString`](/reference/react-dom/server/renderToString) рендерит React-дерево в строку.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) рендерит неинтерактивное React-дерево в строку.

Они имеют ограниченную функциональность по сравнению с потоковыми API.