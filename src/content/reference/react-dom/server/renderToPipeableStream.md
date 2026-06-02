---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` рендерит React-дерево в [потоковый Node.js Stream.](https://nodejs.org/api/stream.html)

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Этот API специфичен для Node.js. В средах с [Web Streams,](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) таких как Deno и современные edge-среды выполнения, следует использовать [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) вместо этого.

</Note>

---

## Справочник {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

Вызовите `renderToPipeableStream`, чтобы отрендерить ваше React-дерево в HTML, который будет записан в [Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

На клиенте вызовите [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы сделать сгенерированный сервером HTML интерактивным.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `reactNode`: React-узел, который вы хотите отрендерить в HTML. Например, JSX-элемент вроде `<App />`. Ожидается, что он будет представлять весь документ, поэтому компонент `App` должен рендерить тег `<html>`.

* **необязательный** `options`: Объект с опциями стриминга.
  * **необязательный** `bootstrapScriptContent`: Если указано, эта строка будет помещена во встроенный тег `<script>`.
  * **необязательный** `bootstrapScripts`: Массив строк с URL-адресами для тегов `<script>`, которые будут вставлены на страницу. Используйте это для включения `<script>`, который вызывает [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Пропустите его, если вы вообще не хотите запускать React на клиенте.
  * **необязательный** `bootstrapModules`: Подобно `bootstrapScripts`, но вставляет [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) вместо этого.
  * **необязательный** `identifierPrefix`: Строка-префикс, которую React использует для ID, сгенерированных [`useId`.](/reference/react/useId) Полезно для избежания конфликтов при использовании нескольких корней на одной странице. Должен быть тем же префиксом, что и переданный в [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **необязательный** `namespaceURI`: Строка с корневым [URI пространства имён](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) для потока. По умолчанию — обычный HTML. Передайте `'http://www.w3.org/2000/svg'` для SVG или `'http://www.w3.org/1998/Math/MathML'` для MathML.
  * **необязательный** `nonce`: Строка [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) для разрешения скриптов для [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **необязательный** `onAllReady`: Обратный вызов, который срабатывает, когда рендеринг завершен полностью, включая как [оболочку](#specifying-what-goes-into-the-shell), так и весь дополнительный [контент.](#streaming-more-content-as-it-loads) Вы можете использовать его вместо `onShellReady` [для краулеров и статической генерации.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Если вы начнете стриминг здесь, вы не получите никакого прогрессивного отображения. Поток будет содержать финальный HTML.
  * **необязательный** `onError`: Обратный вызов, который срабатывает всякий раз, когда возникает ошибка на сервере, будь то [восстановимая](#recovering-from-errors-outside-the-shell) или [невосстановимая.](#recovering-from-errors-inside-the-shell) По умолчанию вызывается только `console.error`. Если вы переопределяете его для [логирования отчетов о сбоях,](#logging-crashes-on-the-server) убедитесь, что вы по-прежнему вызываете `console.error`. Вы также можете использовать его для [установки кода состояния](#setting-the-status-code) перед отправкой оболочки.
  * **необязательный** `onShellReady`: Обратный вызов, который срабатывает сразу после рендеринга [начальной оболочки](#specifying-what-goes-into-the-shell). Вы можете [установить код состояния](#setting-the-status-code) и вызвать `pipe` здесь, чтобы начать стриминг. React будет [стримить дополнительный контент](#streaming-more-content-as-it-loads) после оболочки вместе со встроенными тегами `<script>`, которые заменяют HTML-заполнители загрузки контентом.
  * **необязательный** `onShellError`: Обратный вызов, который срабатывает, если произошла ошибка при рендеринге начальной оболочки. Он получает ошибку в качестве аргумента. Байты еще не были отправлены в поток, и ни `onShellReady`, ни `onAllReady` не будут вызваны, поэтому вы можете [вывести запасной HTML-оболочку.](#recovering-from-errors-inside-the-shell)
  * **необязательный** `progressiveChunkSize`: Количество байтов в чанке. [Подробнее о стандартном эвристическом подходе.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)


#### Возвращает {/*returns*/}

`renderToPipeableStream` возвращает объект с двумя методами:

* `pipe` выводит HTML в предоставленный [Writable Node.js Stream.](https://nodejs.org/api/stream.html#writable-streams) Вызовите `pipe` в `onShellReady`, если вы хотите включить стриминг, или в `onAllReady` для краулеров и статической генерации.
* `abort` позволяет вам [отменить рендеринг на сервере](#aborting-server-rendering) и выполнить остальную часть рендеринга на клиенте.

---

## Использование {/*usage*/}

### Рендеринг React-дерева в HTML с помощью Node.js Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Вызовите `renderToPipeableStream`, чтобы отрендерить ваше React-дерево в HTML, который будет записан в [Node.js Stream:](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// Синтаксис обработчика маршрута зависит от вашего серверного фреймворка
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Вместе с <CodeStep step={1}>корневым компонентом</CodeStep> вам нужно предоставить список <CodeStep step={2}>путей к bootstrap-скриптам</CodeStep>. Ваш корневой компонент должен возвращать **весь документ, включая корневой тег `<html>`.**

Например, это может выглядеть так:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React вставит [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) и ваши <CodeStep step={2}>bootstrap `<script>` теги</CodeStep> в результирующий HTML-поток:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML из ваших компонентов ... -->
</html>
<script src="/main.js" async=""></script>
```

На клиенте ваш bootstrap-скрипт должен [гидрировать весь `document` вызовом `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Это добавит обработчики событий к сгенерированному сервером HTML и сделает его интерактивным.

<DeepDive>

#### Чтение путей к CSS и JS ресурсам из вывода сборки {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Финальные URL-адреса ресурсов (таких как файлы JavaScript и CSS) часто хешируются после сборки. Например, вместо `styles.css` вы можете получить `styles.123456.css`. Хеширование имен файлов статических ресурсов гарантирует, что каждая отдельная сборка одного и того же ресурса будет иметь другое имя файла. Это полезно, потому что позволяет безопасно включить долгосрочное кеширование для статических ресурсов: файл с определенным именем никогда не изменит своего содержимого.

Однако, если вы не знаете URL-адреса ресурсов до завершения сборки, у вас нет возможности вставить их в исходный код. Например, жесткое кодирование `"/styles.css"` в JSX, как ранее, не сработает. Чтобы исключить их из вашего исходного кода, ваш корневой компонент может считывать реальные имена файлов из карты, переданной в качестве пропса:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

На сервере отрендерите `<App assetMap={assetMap} />` и передайте вашу `assetMap` с URL-адресами ресурсов:

```js {1-5,8,9}
// Вам нужно будет получить этот JSON из инструментов сборки, например, прочитать его из вывода сборки.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Поскольку ваш сервер теперь рендерит `<App assetMap={assetMap} />`, вам нужно будет отрендерить его и на клиенте, чтобы избежать ошибок гидратации. Вы можете сериализовать и передать `assetMap` клиенту следующим образом:

```js {9-10}
// Вам нужно будет получить этот JSON из инструментов сборки.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Осторожно: Безопасно использовать stringify() для этого, так как эти данные не генерируются пользователем.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

В приведенном выше примере опция `bootstrapScriptContent` добавляет дополнительный встроенный тег `<script>`, который устанавливает глобальную переменную `window.assetMap` на клиенте. Это позволяет клиентскому коду считывать ту же `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

И клиент, и сервер рендерят `App` с одинаковым пропсом `assetMap`, поэтому ошибок гидратации не возникает.

</DeepDive>

---

### Стриминг большего контента по мере его загрузки {/*streaming-more-content-as-it-loads*/}

Стриминг позволяет пользователю начать видеть контент еще до того, как все данные будут загружены на сервере. Например, рассмотрим страницу профиля, которая отображает обложку, боковую панель с друзьями и фотографиями, а также список постов:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

Представьте, что загрузка данных для `<Posts />` занимает некоторое время. В идеале вы хотели бы показать остальной контент страницы профиля пользователю, не дожидаясь загрузки постов. Для этого [оберните `Posts` в `<Suspense>` границу:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Это говорит React начать стриминг HTML до того, как `Posts` загрузит свои данные. React сначала отправит HTML для запасного варианта загрузки (`PostsGlimmer`), а затем, когда `Posts` закончит загрузку своих данных, React отправит оставшийся HTML вместе со встроенным тегом `<script>`, который заменит запасной вариант загрузки этим HTML. С точки зрения пользователя, страница сначала появится с `PostsGlimmer`, а затем сменится на `Posts`.

Вы можете дополнительно [вкладывать `<Suspense>` границы](/reference/react/Suspense#revealing-nested-content-as-it-loads), чтобы создать более гранулированную последовательность загрузки:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

В этом примере React может начать стриминг страницы еще раньше. Только `ProfileLayout` и `ProfileCover` должны завершить рендеринг первыми, поскольку они не обернуты ни в одну `<Suspense>` границу. Однако, если `Sidebar`, `Friends` или `Photos` должны загрузить какие-либо данные, React вместо этого отправит HTML для запасного варианта `BigSpinner`. Затем, по мере доступности большего количества данных, будет продолжать раскрываться больше контента, пока все не станет видимым.

Стриминг не требует ожидания загрузки самого React в браузере или интерактивности вашего приложения. HTML-контент с сервера будет постепенно раскрываться до загрузки каких-либо `<script>` тегов.

[Подробнее о том, как работает стриминг HTML.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Только источники данных, поддерживающие Suspense, активируют компонент Suspense.** К ним относятся:

- Получение данных с помощью фреймворков, поддерживающих Suspense, таких как [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) и [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Ленивая загрузка кода компонента с помощью [`lazy`](/reference/react/lazy)
- Чтение значения Promise с помощью [`use`](/reference/react/use)

Suspense **не** обнаруживает, когда данные извлекаются внутри Effect или обработчика событий.

Точный способ загрузки данных в компоненте `Posts` выше зависит от вашего фреймворка. Если вы используете фреймворк, поддерживающий Suspense, вы найдете подробности в его документации по получению данных.

Получение данных с поддержкой Suspense без использования структурированного фреймворка пока не поддерживается. Требования к реализации источника данных с поддержкой Suspense нестабильны и не документированы. Официальный API для интеграции источников данных с Suspense будет выпущен в будущей версии React.

</Note>

---

### Определение того, что входит в оболочку {/*specifying-what-goes-into-the-shell*/}

Часть вашего приложения, находящаяся вне любых `<Suspense>` границ, называется *оболочкой (shell):*

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Она определяет самое раннее состояние загрузки, которое может увидеть пользователь:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Если вы обернете все приложение в `<Suspense>` границу на корневом уровне, оболочка будет содержать только этот спиннер. Однако это не лучший пользовательский опыт, поскольку видеть большой спиннер на экране может ощущаться медленнее и раздражать больше, чем подождать еще немного и увидеть реальный макет. Поэтому обычно вы захотите разместить `<Suspense>` границы так, чтобы оболочка ощущалась *минимальной, но полной* — как скелет всего макета страницы.

Обратный вызов `onShellReady` срабатывает, когда вся оболочка отрендерена. Обычно вы начинаете стриминг в этот момент:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

К моменту срабатывания `onShellReady` компоненты во вложенных `<Suspense>` границах могут все еще загружать данные.

---

### Логирование сбоев на сервере {/*logging-crashes-on-the-server*/}

По умолчанию все ошибки на сервере логируются в консоль. Вы можете переопределить это поведение, чтобы логировать отчеты о сбоях:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Если вы предоставляете пользовательскую реализацию `onError`, не забудьте также логировать ошибки в консоль, как показано выше.

---

### Восстановление после ошибок внутри оболочки {/*recovering-from-errors-inside-the-shell*/}

В этом примере оболочка содержит `ProfileLayout`, `ProfileCover` и `PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Если при рендеринге этих компонентов возникает ошибка, React не будет иметь значимого HTML для отправки клиенту. Переопределите `onShellError`, чтобы в качестве последней меры отправить запасной HTML, который не полагается на серверный рендеринг:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Если при генерации оболочки возникает ошибка, будут вызваны как `onError`, так и `onShellError`. Используйте `onError` для отчетности об ошибках и `onShellError` для отправки запасного HTML-документа. Ваш запасной HTML не обязательно должен быть страницей ошибки. Вместо этого вы можете включить альтернативную оболочку, которая рендерит ваше приложение только на клиенте.

---

### Восстановление после ошибок вне оболочки {/*recovering-from-errors-outside-the-shell*/}

В этом примере компонент `<Posts />` обернут в `<Suspense>`, поэтому он *не является* частью оболочки:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Если в компоненте `Posts` или где-либо внутри него возникает ошибка, React [попытается восстановиться после нее:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. Он отправит запасной вариант загрузки для ближайшей `<Suspense>` границы (`PostsGlimmer`) в HTML.
2. Он "откажется" от попытки рендерить контент `Posts` на сервере.
3. Когда JavaScript-код загрузится на клиенте, React *повторит попытку* рендеринга `Posts` на клиенте.

Если повторная попытка рендеринга `Posts` на клиенте *также* завершится ошибкой, React выбросит ошибку на клиенте. Как и во всех ошибках, возникающих во время рендеринга, [ближайшая родительская граница ошибки](/reference/react/Component#static-getderivedstatefromerror) определяет, как представить ошибку пользователю. На практике это означает, что пользователь увидит индикатор загрузки до тех пор, пока не станет ясно, что ошибка не является восстановимой.

Если повторная попытка рендеринга `Posts` на клиенте будет успешной, запасной вариант загрузки с сервера будет заменен выводом клиентского рендеринга. Пользователь не узнает, что была ошибка сервера. Однако будут вызваны обратный вызов сервера `onError` и клиентские обратные вызовы [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot), чтобы вы могли получать уведомления об ошибке.

---

### Установка кода состояния {/*setting-the-status-code*/}

Стриминг вводит компромисс. Вы хотите начать стриминг страницы как можно раньше, чтобы пользователь мог видеть контент быстрее. Однако, как только вы начнете стриминг, вы больше не сможете установить код состояния ответа.

[Разделив ваше приложение](#specifying-what-goes-into-the-shell) на оболочку (выше всех `<Suspense>` границ) и остальной контент, вы уже решили часть этой проблемы. Если оболочка выдает ошибку, вы получите обратный вызов `onShellError`, который позволяет установить код состояния ошибки. В противном случае вы знаете, что приложение может восстановиться на клиенте, поэтому вы можете отправить "OK".

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Если компонент *вне* оболочки (т.е. внутри `<Suspense>` границы) выбрасывает ошибку, React не остановит рендеринг. Это означает, что обратный вызов `onError` будет вызван, но вы все равно получите `onShellReady` вместо `onShellError`. Это связано с тем, что React попытается восстановиться после этой ошибки на клиенте, [как описано выше.](#recovering-from-errors-outside-the-shell)

Однако, если вы хотите, вы можете использовать тот факт, что что-то вызвало ошибку, чтобы установить код состояния:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Это будет отлавливать только ошибки вне оболочки, которые произошли во время генерации начального содержимого оболочки, поэтому это не исчерпывающе. Если критически важно знать, произошла ли ошибка для какого-либо контента, вы можете переместить его выше в оболочку.

---

### Обработка различных ошибок по-разному {/*handling-different-errors-in-different-ways*/}

Вы можете [создать свои собственные подклассы `Error`](https://javascript.info/custom-errors) и использовать оператор [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) для проверки, какая ошибка была выброшена. Например, вы можете определить пользовательский `NotFoundError` и выбросить его из своего компонента. Затем ваши обратные вызовы `onError`, `onShellReady` и `onShellError` могут делать что-то разное в зависимости от типа ошибки:

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>');
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Имейте в виду, что как только вы отправите оболочку и начнете стриминг, вы не сможете изменить код состояния.

---

### Ожидание полной загрузки всего контента для краулеров и статической генерации {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Стриминг предлагает лучший пользовательский опыт, потому что пользователь может видеть контент по мере его доступности.

Однако, когда краулер посещает вашу страницу, или если вы генерируете страницы во время сборки, вы можете захотеть дождаться полной загрузки всего контента, а затем произвести финальный HTML-вывод вместо постепенного раскрытия.

Вы можете дождаться полной загрузки всего контента, используя обратный вызов `onAllReady`:


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... зависит от вашей стратегии обнаружения ботов ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>');
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Обычный посетитель получит поток прогрессивно загружаемого контента. Краулер получит финальный HTML-вывод после загрузки всех данных. Однако это также означает, что краулеру придется ждать *всех* данных, некоторые из которых могут загружаться медленно или вызывать ошибки. В зависимости от вашего приложения, вы можете выбрать отправку оболочки и краулерам.

---

### Отмена серверного рендеринга {/*aborting-server-rendering*/}

Вы можете заставить серверный рендеринг "сдаться" по истечении времени ожидания:

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React отправит оставшиеся запасные варианты загрузки в виде HTML и попытается выполнить остальную часть рендеринга на клиенте.