---
title: renderToStaticMarkup
---
<Intro>

`renderToStaticMarkup` рендерит неинтерактивное React-дерево в HTML-строку.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

На сервере вызовите `renderToStaticMarkup`, чтобы отрендерить ваше приложение в HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

Это создаст неинтерактивный HTML-вывод ваших React-компонентов.

[Смотрите больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `reactNode`: React-узел, который вы хотите отрендерить в HTML. Например, JSX-узел вроде `<Page />`.
* **необязательный** `options`: Объект для серверного рендеринга.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для ID, сгенерированных [`useId`.](/reference/react/useId) Полезно для избежания конфликтов при использовании нескольких корневых элементов на одной странице.

#### Возвращает {/*returns*/}

HTML-строку.

#### Ограничения {/*caveats*/}

* Вывод `renderToStaticMarkup` не может быть гидратирован.

* `renderToStaticMarkup` имеет ограниченную поддержку Suspense. Если компонент приостанавливается, `renderToStaticMarkup` немедленно отправляет его запасной вариант в виде HTML.

* `renderToStaticMarkup` работает в браузере, но его использование в клиентском коде не рекомендуется. Если вам нужно отрендерить компонент в HTML в браузере, [получите HTML, отрендерив его в DOM-узел.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Использование {/*usage*/}

### Рендеринг неинтерактивного React-дерева в HTML-строку {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Вызовите `renderToStaticMarkup`, чтобы отрендерить ваше приложение в HTML-строку, которую вы можете отправить с ответом сервера:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// Синтаксис обработчика маршрута зависит от вашего серверного фреймворка
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Это создаст начальный неинтерактивный HTML-вывод ваших React-компонентов.

<Pitfall>

Этот метод рендерит **неинтерактивный HTML, который нельзя гидратировать.** Это полезно, если вы хотите использовать React как простой генератор статических страниц или если вы рендерите полностью статический контент, например, электронные письма.

Интерактивные приложения должны использовать [`renderToString`](/reference/react-dom/server/renderToString) на сервере и [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) на клиенте.

</Pitfall>