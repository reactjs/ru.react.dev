---
title: Статические API React DOM
---
<Intro>

API `react-dom/static` позволяют генерировать статический HTML для React-компонентов. Их функциональность ограничена по сравнению со стриминговыми API. [Фреймворк](/learn/start-a-new-react-project#production-grade-react-frameworks) может вызывать их за вас. Большинству ваших компонентов не нужно их импортировать или использовать.

</Intro>

---

## Статические API для Web Streams {/*static-apis-for-web-streams*/}

Эти методы доступны только в средах с [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), включая браузеры, Deno и некоторые современные среды выполнения на периферии:

* [`prerender`](/reference/react-dom/static/prerender) рендерит React-дерево в статический HTML с помощью [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)


---

## Статические API для Node.js Streams {/*static-apis-for-nodejs-streams*/}

Эти методы доступны только в средах с [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) рендерит React-дерево в статический HTML с помощью [Node.js Stream.](https://nodejs.org/api/stream.html)