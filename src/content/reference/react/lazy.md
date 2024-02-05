---
title: lazy
---

<Intro>

`lazy` позволяет отложить загрузку кода компонента до его первого рендеринга.
```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `lazy(load)` {/*lazy*/}

Вызовите `lazy` вне ваших компонентов, чтобы объявить компонент React с ленивой загрузкой:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[См. другие примеры ниже.](#usage)

#### Параметры {/*parameters*/}

* `load`: Функция, которая возвращает [Промис](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise) или другой *thenable* (объект, в котором определен метод `then`). Вызова `load` не произойдет до тех пор, пока вы не попытаетесь отрендерить возвращённый компонент. После первого вызова `load`, React будет ждать завершения выполнения команды, а затем отрендерит разрешённое значение `.default` как React-компонент. Возвращаемый промис и разрешённое значение промиса будут кэшироваться, поэтому React не будет вызывать `load` более одного раза. Если Promise отклоняется, React укажет причину в ближайшем Error Boundary.

#### Возвращаемое значение {/*returns*/}

`lazy` возвращает React-компонент, который можно отрендерить в вашем дереве. Пока код для ленивого компонента все еще загружается, попытка его отрисовки *приостанавливается.* Используйте [`<Suspense>`](/reference/react/Suspense) для отображения индикатора загрузки во время загрузки.

---

### Функция `load` {/*load*/}

#### Параметры {/*load-parameters*/}

`load` не принимает параметров.

#### Возвращаемое значение {/*load-returns*/}

Возвращает [Промис](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise) или другой *thenable* (объект, в котором определен метод `then`). В конечном итоге он вернёт объект со свойством `.default`, принимающим валидный React-компонент, например функцию, [`memo`](/reference/react/memo), или [`forwardRef`](/reference/react/forwardRef)-компонент.

---

## Использование {/*usage*/}

### Ленивая загрузка компонентов с Suspense {/*suspense-for-code-splitting*/}

Обычно импорт компонентов происходит со статическим [`import`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/import) объявлением:

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Чтобы отложить загрузку кода этого компонента до его первого рендеринга, замените этот импорт на:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Этот код опирается на [динамический `import()`,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) который должен поддерживаться вашим бандлером или фреймворком. Использование этого подхода требует, чтобы импортируемый компонент был экспортирован с помощью экспорта по умолчанию.

Теперь, когда код вашего компонента загружается по запросу, вам также необходимо указать, что должно отображаться во время его загрузки. Это можно сделать путем оборачивания ленивого компонента или его родителя в границы [`<Suspense>`](/reference/react/Suspense):

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

Например, код для `MarkdownPreview` не загрузится, пока его не попытаются вызвать. Если `MarkdownPreview` ещё не загрузился, на его месте отобразится `Loading`. Попробуйте поставить галочку в чекбоксе:

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Добавьте фиксированную задержку, чтобы увидеть загрузку
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Это демо загрузится с искусственной задержкой. В следующий раз когда вы снимите и поставите галочку, `Preview` будет закэшировано, загрузки не будет. Чтобы снова увидеть загрузку, нужно нажать "Reset" в сандбоксе.

[Узнать об управлении состояниями загрузки с помощью Suspense.](/reference/react/Suspense)

---

## Траблшутинг {/*troubleshooting*/}

### Состояние моего `lazy` компонента неожиданно сбрасывается {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Не объявляйте `lazy` компоненты *внутри* других компонентов:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Плохо: Все состояния сбросятся при ре-рендере
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Вместо этого всегда объявляйте их в верхнем уровне своего модуля:

```js {3-4}
import { lazy } from 'react';

// ✅ Хорошо: lazy компонент объявлен вне ваших компонентов.
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
