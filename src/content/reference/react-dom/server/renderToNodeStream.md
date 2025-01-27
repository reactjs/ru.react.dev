---
Заголовок: renderToNodeStream
---

<Deprecated>

Этот API будет удалён в будущей основной версии React. Лучше использовать вместо него [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

</Deprecated>

<Intro>

`renderToNodeStream` отображает дерево React в [Node.js Readable Stream.](https://nodejsdev.ru/api/stream/#streamreadable)

```js
const stream = renderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Справка {/*reference*/}

### `renderToNodeStream(reactNode, options?)` {/*rendertonodestream*/}

На сервере вызовите `renderToNodeStream`, чтобы получить [Node.js Readable Stream](https://nodejsdev.ru/api/stream/#streamreadable), который вы можете передать в ответ.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

На клиенте вызовите [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы сделать интерактивный HTML—код, созданный сервером.

[Смотрите ещё примеры ниже.](#usage)

#### Параметры {/*parameters*/}

* `reactNode`: Узел React, который вы хотите отобразить в HTML. Например, такой JSX элемент как `<App />`.

* **необязательный** `options`: Объект для серверного рендера.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для генерации идентификаторов с помощью [`useId`.](/reference/react/useId) Полезен, чтобы избежать конфликтов между разными корневыми элементами на одной и той же странице. Должен совпадать с префиксом, переданным в [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Возвращаемое значение {/*returns*/}

[Node.js Readable Stream](https://nodejsdev.ru/api/stream/#streamreadable), который выводит строку HTML.

#### Предупреждения {/*caveats*/}

* Этот метод будет ждать [Suspense boundaries](/reference/react/Suspense), прежде чем возвращать какие-либо данные.

* Начиная с React 18, этот метод буферизует все данные на выходе, из-за чего на самом деле он не даёт никаких преимуществ потоковой передачи. Поэтому вместо этого рекомендуется перейти на [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)

* Возвращаемый поток представляет собой поток байтов, закодированный в utf-8. Если вам нужен поток в другой кодировке, посмотрите проект [iconv-lite](https://www.npmjs.com/package/iconv-lite), который предоставляет потоки преобразования для перекодирования текста.

---

## Применение {/*usage*/}

### Рендеринг дерева React как HTML в Node.js Readable Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

Вызовите `renderToNodeStream`, чтобы получить [Node.js Readable Stream](https://nodejsdev.ru/api/stream/#streamreadable), который вы можете передать вашему серверу:

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// Синтаксис обработчика маршрута зависит от вашей внутренней структуры
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

Поток произведёт начальный неинтерактивный HTML—вывод ваших компонентов React. На клиенте вам нужно будет вызвать [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы *гидратировать* этот сгенерированный сервером HTML и сделать его интерактивным.
