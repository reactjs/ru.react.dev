---
title: renderToString
---

<Pitfall>

`renderToString` не поддерживает потоковую передачу или ожидание данных. [Смотрите альтернативные варианты.](#alternatives)

</Pitfall>

<Intro>

`renderToString` рендерит дерево React в HTML-строку.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Справка {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

На сервере вызовите `renderToString`, чтобы отрендерить ваше приложение в HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

На клиенте вызовите [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы сделать интерактивным HTML, который сгенерировал сервер.

[Смотрите больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `reactNode`: Узел React, который вы хотите отрендерить в HTML. Например, JSX узел типа `<App />`.

* **необязательный** `options`: Объект для серверного рендера.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для генерации идентификаторов с помощью [`useId`.](/reference/react/useId) Полезен, чтобы избежать конфликтов между разными корневыми элементами на одной и той же странице. Должен совпадать с префиксом, переданным в [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)

#### Возвращаемое значение {/*returns*/}

Строка HTML.

#### Предостережения {/*caveats*/}

* `renderToString` имеет ограниченную поддержку задержки. Если компонент приостановлен, `renderToString` немедленно отправляет fallback в виде HTML.

* `renderToString` работает в браузере, но использовать его в клиентском коде [не рекомендуется.](#removing-rendertostring-from-the-client-code)

---

## Применение {/*usage*/}

### Рендеринг дерева React как строки HTML {/*rendering-a-react-tree-as-html-to-a-string*/}

Вызовите `renderToString`, чтобы отрендерить ваше приложение в строку HTML, которую вы можете отправить вместе с ответом вашего сервера:

```js {5-6}
import { renderToString } from 'react-dom/server';

// Синтаксис обработчика маршрута зависит от вашего бэкенд-фреймворка
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

Этот код создает исходный неинтерактивный HTML-вывод ваших компонентов React. На клиенте вам нужно будет вызвать [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы сделать HTML, который сгенерировал сервер, интерактивным.


<Pitfall>

`renderToString` не поддерживает потоковую передачу или ожидание данных. [Смотрите альтернативные варианты.](#alternatives)

</Pitfall>

---

## Альтернативные варианты {/*alternatives*/}

<<<<<<< HEAD
### Переход от `renderToString` к потоковому методу на сервере {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` немедленно возвращает строку, поэтому он не поддерживает потоковую передачу или ожидание данных.
=======
### Migrating from `renderToString` to a streaming render on the server {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` returns a string immediately, so it does not support streaming content as it loads.
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c

Мы рекомендуем использовать эти полнофункциональные альтернативы, когда это возможно:

* Если вы используете Node.js, используйте [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* Если вы используете Deno или современную пограничную среду выполнения с [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), используйте [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

Вы можете продолжать использовать`renderToString`, если среда вашего сервера не поддерживает потоки.

---

<<<<<<< HEAD
### Удаление `renderToString` из клиентского кода {/*removing-rendertostring-from-the-client-code*/}
=======
### Migrating from `renderToString` to a static prerender on the server {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` returns a string immediately, so it does not support waiting for data to load for static HTML generation.

We recommend using these fully-featured alternatives:

* If you use Node.js, use [`prerenderToNodeStream`.](/reference/react-dom/static/prerenderToNodeStream)
* If you use Deno or a modern edge runtime with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), use [`prerender`.](/reference/react-dom/static/prerender)

You can continue using `renderToString` if your static site generation environment does not support streams.

---

### Removing `renderToString` from the client code {/*removing-rendertostring-from-the-client-code*/}
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c

Иногда `renderToString` используют на клиенте для преобразования какого-либо компонента в HTML.

```js {1-2}
// 🚩 Лишнее: использование renderToString на клиенте
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // Например, "<svg>...</svg>"
```

Импорт `react-dom/server` **на клиенте** излишне увеличивает размер пакета, и этого следует избегать. Если вам в браузере нужно преобразовать какой-либо компонент в HTML, используйте [`createRoot`](/reference/react-dom/client/createRoot) и читайте HTML из DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // Например, "<svg>...</svg>"
```

Вызов [`flushSync`](/reference/react-dom/flushSync) необходим, чтобы DOM обновлялся перед чтением его свойства [`innerHTML`](https://developer.mozilla.org/ru/docs/Web/API/Element/innerHTML).

---

## Поиск неисправностей {/*troubleshooting*/}

### Когда компонент приостанавливается, HTML всегда содержит fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` не полностью поддерживает задержку.

Если какой-либо компонент приостанавливается (например, потому что он определен с [`lazy`](/reference/react/lazy) или извлекает данные), `renderToString` не будет ждать разрешения своего содержимого. Вместо этого `renderToString` найдет ближайшую [`<Suspense>`](/reference/react/Suspense) границу над ней и отрендерит её `fallback` в HTML. Содержимое не появится, пока не загрузится клиентский код.

<<<<<<< HEAD
Чтобы решить эту проблему, используйте одно из [рекомендуемых решений для потоковой передачи.](#migrating-from-rendertostring-to-a-streaming-method-on-the-server) Они могут передавать контент фрагментами по мере его разрешения на сервере, чтобы пользователь видел, что страница постепенно заполняется до загрузки клиентского кода.
=======
To solve this, use one of the [recommended streaming solutions.](#alternatives) For server side rendering, they can stream content in chunks as it resolves on the server so that the user sees the page being progressively filled in before the client code loads. For static site generation, they can wait for all the content to resolve before generating the static HTML.
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c

