---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` отрисовывает дерево React в [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Этот API зависит от [Web Streams.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Для Node.js используйте [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) вместо этого.

</Note>

---

## Справочник {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

Вызовите `renderToReadableStream`, чтобы отрисовать ваше дерево React в виде HTML в [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

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

На клиенте вызовите [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), чтобы сделать HTML, сгенерированный сервером, интерактивным.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `reactNode`: Узел React, который вы хотите отрисовать в HTML. Например, JSX-элемент вроде `<App />`. Ожидается, что он будет представлять весь документ, поэтому компонент `App` должен отрисовать тег `<html>`.

* **необязательный** `options`: Объект с опциями потоковой передачи.
  * **необязательный** `bootstrapScriptContent`: Если указано, эта строка будет помещена во встроенный тег `<script>`.
  * **необязательный** `bootstrapScripts`: Массив строковых URL для тегов `<script>`, которые будут выведены на странице. Используйте это, чтобы включить `<script>`, который вызывает [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Пропустите его, если вы вообще не хотите запускать React на клиенте.
  * **необязательный** `bootstrapModules`: Подобно `bootstrapScripts`, но выводит [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) вместо этого.
  * **необязательный** `identifierPrefix`: Строковый префикс, который React использует для ID, сгенерированных [`useId`.](/reference/react/useId) Полезно для предотвращения конфликтов при использовании нескольких корней на одной странице. Должен быть тем же префиксом, что и переданный в [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **необязательный** `namespaceURI`: Строка с корневым [URI пространства имён](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) для потока. По умолчанию — обычный HTML. Передайте `'http://www.w3.org/2000/svg'` для SVG или `'http://www.w3.org/1998/Math/MathML'` для MathML.
  * **необязательный** `nonce`: Строка [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) для разрешения скриптов для [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **необязательный** `onError`: Обратный вызов, который срабатывает при любой ошибке сервера, будь то [восстановимая](#recovering-from-errors-outside-the-shell) или [нет.](#recovering-from-errors-inside-the-shell) По умолчанию вызывается только `console.error`. Если вы переопределите его для [логирования отчётов о сбоях](#logging-crashes-on-the-server), убедитесь, что вы по-прежнему вызываете `console.error`. Вы также можете использовать его для [настройки кода состояния](#setting-the-status-code) перед выводом оболочки.
  * **необязательный** `progressiveChunkSize`: Количество байтов в фрагменте. [Подробнее о стандартном эвристическом подходе.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **необязательный** `signal`: [Сигнал отмены](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), который позволяет [отменить серверный рендеринг](#aborting-server-rendering) и отрисовать остальное на клиенте.


#### Возвращает {/*returns*/}

`renderToReadableStream` возвращает Promise:

- Если отрисовка [оболочки](#specifying-what-goes-into-the-shell) прошла успешно, этот Promise будет разрешён в [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- Если отрисовка оболочки не удалась, Promise будет отклонён. [Используйте это для вывода запасной оболочки.](#recovering-from-errors-inside-the-shell)

Возвращаемый поток имеет дополнительное свойство:

* `allReady`: Promise, который разрешается, когда весь рендеринг завершён, включая как [оболочку](#specifying-what-goes-into-the-shell), так и весь дополнительный [контент.](#streaming-more-content-as-it-loads) Вы можете использовать `await stream.allReady` перед возвратом ответа [для краулеров и статической генерации.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Если вы сделаете это, вы не получите прогрессивной загрузки. Поток будет содержать окончательный HTML.

---

## Использование {/*usage*/}

### Отрисовка React-дерева в HTML для Readable Web Stream {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

Вызовите `renderToReadableStream`, чтобы отрисовать ваше React-дерево в HTML в виде [Readable Web Stream:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
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

Вместе с <CodeStep step={1}>корневым компонентом</CodeStep> вам нужно предоставить список <CodeStep step={2}>путей к загрузочным `<script>`</CodeStep>. Ваш корневой компонент должен возвращать **весь документ, включая корневой тег `<html>`**.

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

React вставит [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) и ваши <CodeStep step={2}>загрузочные `<script>` теги</CodeStep> в результирующий HTML-поток:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML из ваших компонентов ... -->
</html>
<script src="/main.js" async=""></script>
```

На клиенте ваш загрузочный скрипт должен [гидрировать весь `document` вызовом `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Это подключит обработчики событий к сгенерированному сервером HTML и сделает его интерактивным.

<DeepDive>

#### Чтение путей к CSS и JS ресурсам из вывода сборки {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Финальные URL-адреса ресурсов (таких как файлы JavaScript и CSS) часто хешируются после сборки. Например, вместо `styles.css` вы можете получить `styles.123456.css`. Хеширование имен файлов статических ресурсов гарантирует, что каждая отдельная сборка одного и того же ресурса будет иметь другое имя файла. Это полезно, поскольку позволяет безопасно включать долгосрочное кеширование для статических ресурсов: файл с определенным именем никогда не изменит свое содержимое.

Однако, если вы не знаете URL-адреса ресурсов до завершения сборки, вы не сможете указать их в исходном коде. Например, жесткое кодирование `"/styles.css"` в JSX, как было показано ранее, не сработает. Чтобы исключить их из вашего исходного кода, ваш корневой компонент может считывать реальные имена файлов из карты, передаваемой в качестве пропса:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

На сервере отрисуйте `<App assetMap={assetMap} />` и передайте вашу `assetMap` с URL-адресами ресурсов:

```js {1-5,8,9}
// Вам нужно будет получить этот JSON из ваших инструментов сборки, например, прочитать его из вывода сборки.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Поскольку ваш сервер теперь отрисовывает `<App assetMap={assetMap} />`, вам также нужно отрисовать его с `assetMap` на клиенте, чтобы избежать ошибок гидратации. Вы можете сериализовать и передать `assetMap` клиенту следующим образом:

```js {9-10}
// Вам нужно будет получить этот JSON из ваших инструментов сборки.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Внимание: Безопасно использовать stringify() для этого, поскольку эти данные не генерируются пользователем.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

В приведенном выше примере опция `bootstrapScriptContent` добавляет дополнительный встроенный тег `<script>`, который устанавливает глобальную переменную `window.assetMap` на клиенте. Это позволяет клиентскому коду считывать ту же `assetMap`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

И клиент, и сервер отрисовывают `App` с одним и тем же пропсом `assetMap`, поэтому ошибок гидратации не возникает.

</DeepDive>

---

### Потоковая передача большего количества контента по мере его загрузки {/*streaming-more-content-as-it-loads*/}

Потоковая передача позволяет пользователю начать видеть контент еще до того, как все данные будут загружены на сервере. Например, рассмотрим страницу профиля, которая отображает обложку, боковую панель с друзьями и фотографиями, а также список постов:

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

Представьте, что загрузка данных для `<Posts />` занимает некоторое время. В идеале вы хотели бы показать остальной контент страницы профиля пользователю, не дожидаясь загрузки постов. Для этого [оберните `Posts` в границу `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

Это говорит React начать потоковую передачу HTML до того, как `Posts` загрузит свои данные. React сначала отправит HTML для запасного варианта загрузки (`PostsGlimmer`), а затем, когда `Posts` закончит загрузку своих данных, React отправит оставшийся HTML вместе со встроенным тегом `<script>`, который заменит запасной вариант загрузки этим HTML. С точки зрения пользователя, страница сначала появится с `PostsGlimmer`, который позже будет заменен на `Posts`.

Вы можете дополнительно [вкладывать границы `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads), чтобы создать более детальную последовательность загрузки:

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


В этом примере React может начать потоковую передачу страницы еще раньше. Только `ProfileLayout` и `ProfileCover` должны завершить отрисовку первыми, поскольку они не обернуты ни в какую границу `<Suspense>`. Однако, если `Sidebar`, `Friends` или `Photos` нуждаются в загрузке каких-либо данных, React отправит HTML для запасного варианта `BigSpinner` вместо этого. Затем, по мере поступления новых данных, будет раскрываться больше контента, пока все не станет видимым.

Потоковая передача не требует ожидания загрузки самого React в браузере или интерактивности вашего приложения. HTML-контент с сервера будет постепенно раскрываться до загрузки каких-либо тегов `<script>`.

[Подробнее о том, как работает потоковая передача HTML.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Только источники данных, поддерживающие Suspense, активируют компонент Suspense.** К ним относятся:

- Получение данных с помощью фреймворков, поддерживающих Suspense, таких как [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) и [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Ленивая загрузка кода компонента с помощью [`lazy`](/reference/react/lazy)
- Чтение значения Promise с помощью [`use`](/reference/react/use)

Suspense **не** обнаруживает, когда данные загружаются внутри Effect или обработчика событий.

Точный способ загрузки данных в компоненте `Posts` выше зависит от вашего фреймворка. Если вы используете фреймворк, поддерживающий Suspense, вы найдете подробности в его документации по получению данных.

Получение данных с поддержкой Suspense без использования структурированного фреймворка пока не поддерживается. Требования к реализации источника данных с поддержкой Suspense нестабильны и не документированы. Официальный API для интеграции источников данных с Suspense будет выпущен в будущей версии React.

</Note>

---

### Указание того, что входит в оболочку {/*specifying-what-goes-into-the-shell*/}

Часть вашего приложения, находящаяся вне любых границ `<Suspense>`, называется *оболочкой (shell):*

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

Если вы обернете все приложение в границу `<Suspense>` на корневом уровне, оболочка будет содержать только этот спиннер. Однако это не лучший пользовательский опыт, поскольку видеть большой спиннер на экране может ощущаться медленнее и раздражать больше, чем немного подождать и увидеть реальную разметку. Поэтому обычно вы хотите разместить границы `<Suspense>` так, чтобы оболочка выглядела *минимальной, но полной* — как скелет всей разметки страницы.

Асинхронный вызов `renderToReadableStream` разрешится в `stream`, как только вся оболочка будет отрисована. Обычно вы начинаете потоковую передачу, создавая и возвращая ответ с этим `stream`:

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

К моменту возврата `stream` компоненты во вложенных границах `<Suspense>` все еще могут загружать данные.

---

### Логирование сбоев на сервере {/*logging-crashes-on-the-server*/}

По умолчанию все ошибки на сервере логируются в консоль. Вы можете переопределить это поведение, чтобы логировать отчеты о сбоях:

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
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

Если при отрисовке этих компонентов возникает ошибка, React не сможет отправить клиенту значимый HTML. Оберните ваш вызов `renderToReadableStream` в `try...catch`, чтобы в качестве последнего средства отправить запасной HTML, который не зависит от серверной отрисовки:

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Если при генерации оболочки возникает ошибка, сработают как `onError`, так и ваш блок `catch`. Используйте `onError` для отчетности об ошибках и блок `catch` для отправки запасного HTML-документа. Ваш запасной HTML не обязательно должен быть страницей ошибки. Вместо этого вы можете включить альтернативную оболочку, которая отрисовывает ваше приложение только на клиенте.

---

### Восстановление после ошибок вне оболочки {/*recovering-from-errors-outside-the-shell*/}

В этом примере компонент `<Posts />` обернут в `<Suspense>`, поэтому он *не* является частью оболочки:

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

1. Он отправит запасной вариант загрузки для ближайшей границы `<Suspense>` (`PostsGlimmer`) в HTML.
2. Он "откажется" от попытки отрисовать контент `Posts` на сервере.
3. Когда JavaScript-код загрузится на клиенте, React *повторит попытку* отрисовки `Posts` на клиенте.

Если повторная попытка отрисовки `Posts` на клиенте *также* завершится ошибкой, React выбросит ошибку на клиенте. Как и при всех ошибках, возникающих во время отрисовки, [ближайшая родительская граница ошибки](/reference/react/Component#static-getderivedstatefromerror) определяет, как представить ошибку пользователю. На практике это означает, что пользователь увидит индикатор загрузки до тех пор, пока не станет ясно, что ошибка не может быть исправлена.

Если повторная попытка отрисовки `Posts` на клиенте будет успешной, запасной вариант загрузки с сервера будет заменен выводом клиентской отрисовки. Пользователь не узнает, что на сервере произошла ошибка. Однако сработают колбэк сервера `onError` и клиентские колбэки [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot), чтобы вы могли получать уведомления об ошибке.

---

### Установка кода состояния {/*setting-the-status-code*/}

Потоковая передача вводит компромисс. Вы хотите начать потоковую передачу страницы как можно раньше, чтобы пользователь мог увидеть контент быстрее. Однако, как только вы начнете потоковую передачу, вы больше не сможете установить код состояния ответа.

[Разделив ваше приложение](#specifying-what-goes-into-the-shell) на оболочку (выше всех границ `<Suspense>`) и остальной контент, вы уже решили часть этой проблемы. Если оболочка выдает ошибку, выполнится ваш блок `catch`, который позволяет установить код состояния ошибки. В противном случае вы знаете, что приложение может восстановиться на клиенте, поэтому вы можете отправить "OK".

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Если компонент *вне* оболочки (т.е. внутри границы `<Suspense>`) выбрасывает ошибку, React не остановит отрисовку. Это означает, что колбэк `onError` сработает, но ваш код продолжит выполняться, не попадая в блок `catch`. Это связано с тем, что React попытается восстановиться после этой ошибки на клиенте, [как описано выше.](#recovering-from-errors-outside-the-shell)

Однако, если вы хотите, вы можете использовать тот факт, что что-то вызвало ошибку, для установки кода состояния:

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Это перехватит только ошибки вне оболочки, которые произошли во время генерации начального содержимого оболочки, поэтому это не исчерпывающе. Если знание о том, произошла ли ошибка для какого-либо контента, имеет решающее значение, вы можете переместить его выше в оболочку.

---

### Обработка различных ошибок по-разному {/*handling-different-errors-in-different-ways*/}

Вы можете [создавать собственные подклассы `Error`](https://javascript.info/custom-errors) и использовать оператор [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) для проверки типа выбрасываемой ошибки. Например, вы можете определить пользовательский `NotFoundError` и выбросить его из вашего компонента. Затем вы можете сохранить ошибку в `onError` и выполнить различные действия перед возвратом ответа в зависимости от типа ошибки:

```js {2-3,5-15,22,28,33}
async function handler(request) {
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

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Имейте в виду, что как только вы отправите оболочку (shell) и начнете потоковую передачу, вы не сможете изменить код состояния.

---

### Ожидание загрузки всего контента для краулеров и статической генерации {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Потоковая передача обеспечивает лучший пользовательский опыт, поскольку пользователь может видеть контент по мере его доступности.

Однако, когда краулер посещает вашу страницу, или если вы генерируете страницы во время сборки, вы можете захотеть сначала загрузить весь контент, а затем сгенерировать окончательный HTML-вывод вместо постепенного его отображения.

Вы можете дождаться загрузки всего контента, дождавшись промиса `stream.allReady`:

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... зависит от вашей стратегии обнаружения ботов ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Обычный посетитель получит поток постепенно загружаемого контента. Краулер получит окончательный HTML-вывод после загрузки всех данных. Однако это также означает, что краулеру придется ждать *всех* данных, загрузка некоторых из которых может быть медленной или вызывать ошибки. В зависимости от вашего приложения, вы можете выбрать отправку оболочки (shell) и краулерам.

---

### Прерывание серверного рендеринга {/*aborting-server-rendering*/}

Вы можете принудительно "отказаться" от серверного рендеринга по истечении времени ожидания:

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

React отправит оставшиеся загружаемые резервные варианты (fallbacks) в виде HTML и попытается отрисовать остальное на клиенте.