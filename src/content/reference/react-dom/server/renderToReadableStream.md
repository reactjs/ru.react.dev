---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` рендерит React-дерево в [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Этот API зависит от [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Для Node.js вместо этого используйте [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

</Note>

---

## Справочник {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

Вызовите `renderToReadableStream`, чтобы отрендерить ваше React-дерево в виде HTML в [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

На клиенте вызовите [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы сделать сгенерированный сервером HTML интерактивным.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `reactNode`: React-узел, который вы хотите отрендерить в HTML. Например, JSX-элемент вроде `<App />`. Ожидается, что он будет представлять собой весь документ, поэтому компонент `App` должен рендерить тег `<html>`.

* **необязательный** `options`: Объект с опциями стриминга.
  * **необязательный** `bootstrapScriptContent`: Если указано, эта строка будет помещена во встроенный тег `<script>`.
  * **необязательный** `bootstrapScripts`: Массив URL-адресов строк для тегов `<script>`, которые будут выведены на странице. Используйте это для включения `<script>`, который вызывает [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Пропустите его, если вы вообще не хотите запускать React на клиенте.
  * **необязательный** `bootstrapModules`: Подобно `bootstrapScripts`, но выводит [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) вместо этого.
  * **необязательный** `identifierPrefix`: Строка-префикс, которую React использует для ID, сгенерированных [`useId`.](/reference/react/useId) Полезно для избежания конфликтов при использовании нескольких корней на одной странице. Должен быть тем же префиксом, что и переданный в [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **необязательный** `namespaceURI`: Строка с корневым [URI пространства имен](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) для потока. По умолчанию — обычный HTML. Передайте `'http://www.w3.org/2000/svg'` для SVG или `'http://www.w3.org/1998/Math/MathML'` для MathML.
  * **необязательный** `nonce`: Строка [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) для разрешения скриптов для [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **необязательный** `onError`: Обратный вызов, который срабатывает при любой ошибке на сервере, будь то [восстановимая](#recovering-from-errors-outside-the-shell) или [невосстановимая.](#recovering-from-errors-inside-the-shell) По умолчанию вызывается только `console.error`. Если вы переопределяете его для [логирования отчетов о сбоях](#logging-crashes-on-the-server), убедитесь, что вы по-прежнему вызываете `console.error`. Вы также можете использовать его для [установки кода состояния](#setting-the-status-code) перед выводом оболочки.
  * **необязательный** `progressiveChunkSize`: Количество байтов в чанке. [Подробнее о стандартной эвристике.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **необязательный** `signal`: [Сигнал отмены](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), который позволяет [отменить рендеринг на сервере](#aborting-server-rendering) и рендерить остальное на клиенте.


#### Возвращает {/*returns*/}

`renderToReadableStream` возвращает Promise:

- Если рендеринг [оболочки](#specifying-what-goes-into-the-shell) успешен, этот Promise разрешится в [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- Если рендеринг оболочки завершается ошибкой, Promise будет отклонен. [Используйте это для вывода запасной оболочки.](#recovering-from-errors-inside-the-shell)

Возвращаемый поток имеет дополнительное свойство:

* `allReady`: Promise, который разрешается, когда весь рендеринг завершен, включая как [оболочку](#specifying-what-goes-into-the-shell), так и весь дополнительный [контент.](#streaming-more-content-as-it-loads) Вы можете `await stream.allReady` перед возвратом ответа [для краулеров и статической генерации.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Если вы сделаете это, вы не получите никакого прогрессивного отображения. Поток будет содержать окончательный HTML.

---

## Использование {/*usage*/}

### Рендеринг React-дерева в виде HTML в Readable Web Stream {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

Вызовите `renderToReadableStream`, чтобы отрендерить ваше React-дерево в виде HTML в [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: