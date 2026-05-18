---
title: "React v19"
author: The React Team
date: 2024/12/05
description: React 19 теперь доступен в npm! В этой статье мы рассмотрим новые возможности React 19 и способы их внедрения.
---

05 декабря 2024 г. от [Команды React](/community/team)

---
<Note>

### React 19 теперь стабилен! {/*react-19-is-now-stable*/}

Дополнения с момента первоначальной публикации этого сообщения с React 19 RC в апреле:

- **Предварительный прогрев для подвешенных деревьев**: см. [Улучшения Suspense](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense).
- **Статические API React DOM**: см. [Новые статические API React DOM](#new-react-dom-static-apis).

_Дата этого сообщения была обновлена, чтобы отразить дату стабильного выпуска._

</Note>

<Intro>

React v19 теперь доступен в npm!

</Intro>

В нашем [Руководстве по обновлению до React 19](/blog/2024/04/25/react-19-upgrade-guide) мы поделились пошаговыми инструкциями по обновлению вашего приложения до React 19. В этом сообщении мы дадим обзор новых функций в React 19 и расскажем, как вы можете их использовать.

- [Что нового в React 19](#whats-new-in-react-19)
- [Улучшения в React 19](#improvements-in-react-19)
- [Как обновиться](#how-to-upgrade)

Список критических изменений см. в [Руководстве по обновлению](/blog/2024/04/25/react-19-upgrade-guide).

---

## Что нового в React 19 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

Распространенный сценарий использования в приложениях React — это изменение данных с последующим обновлением состояния в ответ. Например, когда пользователь отправляет форму для изменения своего имени, вы делаете запрос к API, а затем обрабатываете ответ. В прошлом вам приходилось вручную обрабатывать состояния ожидания, ошибки, оптимистичные обновления и последовательные запросы.

Например, вы могли обрабатывать состояние ожидания и ошибки с помощью `useState`:

```js
// До Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

В React 19 мы добавили поддержку использования асинхронных функций в переходах для автоматической обработки состояний ожидания, ошибок, форм и оптимистичных обновлений.

Например, вы можете использовать `useTransition` для автоматической обработки состояния ожидания:

```js
// Использование состояния ожидания из Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

Асинхронный переход немедленно установит состояние `isPending` в `true`, выполнит асинхронный запрос(ы) и установит `isPending` в `false` после всех переходов. Это позволяет вам сохранять текущий интерфейс отзывчивым и интерактивным во время изменения данных.

<Note>

#### По соглашению, функции, использующие асинхронные переходы, называются "Actions". {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Actions автоматически управляют отправкой данных за вас:

- **Состояние ожидания**: Actions предоставляют состояние ожидания, которое начинается в начале запроса и автоматически сбрасывается при фиксации окончательного обновления состояния.
- **Оптимистичные обновления**: Actions поддерживают новый хук [`useOptimistic`](#new-hook-optimistic-updates), чтобы вы могли мгновенно показывать пользователям обратную связь во время отправки запросов.
- **Обработка ошибок**: Actions обеспечивают обработку ошибок, позволяя отображать Error Boundaries при сбое запроса и автоматически откатывать оптимистичные обновления к исходному значению.
- **Формы**: Элементы `<form>` теперь поддерживают передачу функций в пропсы `action` и `formAction`. Передача функций в пропсы `action` использует Actions по умолчанию и автоматически сбрасывает форму после отправки.

</Note>

Основываясь на Actions, React 19 представляет [`useOptimistic`](#new-hook-optimistic-updates) для управления оптимистичными обновлениями и новый хук [`React.useActionState`](#new-hook-useactionstate) для обработки распространенных случаев использования Actions. В `react-dom` мы добавляем [`<form>` Actions](#form-actions) для автоматического управления формами и [`useFormStatus`](#new-hook-useformstatus) для поддержки распространенных случаев использования Actions в формах.

В React 19 приведенный выше пример можно упростить до:

```js
// Использование <form> Actions и useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

В следующем разделе мы подробно рассмотрим каждую из новых функций Actions в React 19.

### Новый хук: `useActionState` {/*new-hook-useactionstate*/}

Чтобы упростить распространенные случаи использования Actions, мы добавили новый хук под названием `useActionState`:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // Вы можете вернуть любой результат действия.
      // Здесь мы возвращаем только ошибку.
      return error;
    }

    // обработка успеха
    return null;
  },
  null,
);
```

`useActionState` принимает функцию ( "Action") и возвращает обернутую Action для вызова. Это работает, потому что Actions компонуются. Когда вызывается обернутая Action, `useActionState` возвращает последний результат Action как `data`, а состояние ожидания Action как `pending`.

<Note>

`React.useActionState` ранее назывался `ReactDOM.useFormState` в Canary-релизах, но мы переименовали его и устарели `useFormState`.

См. [#28491](https://github.com/facebook/react/pull/28491) для получения дополнительной информации.

</Note>

Для получения дополнительной информации см. документацию по [`useActionState`](/reference/react/useActionState).

### React DOM: `<form>` Actions {/*form-actions*/}

Actions также интегрированы с новыми функциями `<form>` в React 19 для `react-dom`. Мы добавили поддержку передачи функций в пропсы `action` и `formAction` элементов `<form>`, `<input>` и `<button>` для автоматической отправки форм с помощью Actions:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

Когда Action `<form>` успешно завершается, React автоматически сбрасывает форму для неуправляемых компонентов. Если вам нужно сбросить `<form>` вручную, вы можете вызвать новый API React DOM `requestFormReset`.

Для получения дополнительной информации см. документацию `react-dom` по [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) и `<button>`.

### React DOM: Новый хук: `useFormStatus` {/*new-hook-useformstatus*/}

В дизайн-системах принято писать компоненты дизайна, которым нужен доступ к информации о `<form>`, в котором они находятся, без необходимости передавать пропсы вниз по дереву компонентов. Это можно сделать через Context, но чтобы упростить распространенный случай, мы добавили новый хук `useFormStatus`:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` считывает статус родительской `<form>` так, как если бы форма была провайдером Context.

Для получения дополнительной информации см. документацию `react-dom` по [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Новый хук: `useOptimistic` {/*new-hook-optimistic-updates*/}

Еще один распространенный шаблон пользовательского интерфейса при выполнении изменения данных — это оптимистичное отображение конечного состояния во время выполнения асинхронного запроса. В React 19 мы добавляем новый хук под названием `useOptimistic`, чтобы упростить это:

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

Хук `useOptimistic` немедленно отобразит `optimisticName` во время выполнения запроса `updateName`. Когда обновление завершится или произойдет ошибка, React автоматически вернется к значению `currentName`.

Для получения дополнительной информации см. документацию по [`useOptimistic`](/reference/react/useOptimistic).

### Новый API: `use` {/*new-feature-use*/}

В React 19 мы представляем новый API для чтения ресурсов в процессе рендеринга: `use`.

Например, вы можете прочитать промис с помощью `use`, и React приостановит выполнение до тех пор, пока промис не разрешится:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` приостановит выполнение до тех пор, пока промис не разрешится.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // Когда `use` приостановит выполнение в Comments,
  // будет показана эта граница Suspense.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` не поддерживает промисы, созданные во время рендеринга. {/*use-does-not-support-promises-created-in-render*/}

Если вы попытаетесь передать промис, созданный во время рендеринга, в `use`, React выдаст предупреждение:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Компонент был приостановлен из-за непроверенного промиса. Создание промисов внутри клиентского компонента или хука пока не поддерживается, за исключением случаев использования библиотеки или фреймворка, совместимых с Suspense.

</ConsoleLogLine>

</ConsoleBlockMulti>

Чтобы исправить это, вам нужно передать промис из библиотеки или фреймворка с поддержкой Suspense, который поддерживает кеширование для промисов. В будущем мы планируем внедрить функции, которые упростят кеширование промисов во время рендеринга.

</Note>

Вы также можете читать контекст с помощью `use`, что позволяет вам условно считывать контекст, например, после ранних возвратов:

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // Это не сработало бы с useContext
  // из-за раннего возврата.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

API `use` может быть вызван только во время рендеринга, аналогично хукам. В отличие от хуков, `use` может быть вызван условно. В будущем мы планируем поддерживать больше способов потребления ресурсов во время рендеринга с помощью `use`.

Для получения дополнительной информации см. документацию по [`use`](/reference/react/use).

## Новые статические API React DOM {/*new-react-dom-static-apis*/}

Мы добавили два новых API в `react-dom/static` для генерации статических сайтов:
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

Эти новые API улучшают `renderToString`, ожидая загрузки данных для генерации статического HTML. Они разработаны для работы с потоковыми средами, такими как Node.js Streams и Web Streams. Например, в среде Web Stream вы можете предварительно отрисовать дерево React в статический HTML с помощью `prerender`:

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

API Prerender будут ждать загрузки всех данных перед возвратом потока статического HTML. Потоки можно преобразовать в строки или отправить с потоковым ответом. Они не поддерживают потоковую передачу контента по мере его загрузки, что поддерживается существующими [API серверного рендеринга React DOM](/reference/react-dom/server).

Для получения дополнительной информации см. [Статические API React DOM](/reference/react-dom/static).

## React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

Server Components — это новая опция, которая позволяет рендерить компоненты заранее, до бандлинга, в среде, отдельной от вашего клиентского приложения или сервера SSR. Эта отдельная среда является "сервером" в React Server Components. Server Components могут выполняться один раз во время сборки на вашем CI-сервере или могут выполняться для каждого запроса с использованием веб-сервера.

React 19 включает все функции React Server Components из канала Canary. Это означает, что библиотеки, поставляемые с Server Components, теперь могут использовать React 19 в качестве peer-зависимости с условием экспорта `react-server` [export condition](https://github.com/reactjs/rfcs/blob/master/text/0227-server-module-conventions.md#react-server-conditional-exports) для использования во фреймворках, поддерживающих [Полную архитектуру React](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision).


<Note>

#### Как мне реализовать поддержку Server Components? {/*how-do-i-build-support-for-server-components*/}

Хотя React Server Components в React 19 стабильны и не будут нарушаться между минорными версиями, базовые API, используемые для реализации бандлера или фреймворка React Server Components, не следуют semver и могут нарушаться между минорными версиями в React 19.x.

Для поддержки React Server Components в качестве бандлера или фреймворка мы рекомендуем закрепить определенную версию React или использовать Canary-релиз. Мы продолжим работать с бандлерами и фреймворками над стабилизацией API, используемых для реализации React Server Components в будущем.

</Note>


Дополнительную информацию см. в документации по [React Server Components](/reference/rsc/server-components).

### Server Actions {/*server-actions*/}

Server Actions позволяют клиентским компонентам вызывать асинхронные функции, выполняемые на сервере.

Когда Server Action определяется с директивой `"use server"`, ваш фреймворк автоматически создает ссылку на серверную функцию и передает эту ссылку клиентскому компоненту. Когда эта функция вызывается на клиенте, React отправляет запрос на сервер для выполнения функции и возвращает результат.

<Note>

#### Для Server Components нет директивы. {/*there-is-no-directive-for-server-components*/}

Распространенное заблуждение заключается в том, что Server Components обозначаются `"use server"`, но для Server Components директивы нет. Директива `"use server"` используется для Server Actions.

Дополнительную информацию см. в документации по [Директивам](/reference/rsc/directives).

</Note>

Server Actions могут быть созданы в Server Components и переданы в качестве пропсов клиентским компонентам, или они могут быть импортированы и использованы в клиентских компонентах.

Дополнительную информацию см. в документации по [React Server Actions](/reference/rsc/server-actions).

## Улучшения в React 19 {/*improvements-in-react-19*/}

### `ref` как проп {/*ref-as-a-prop*/}

Начиная с React 19, вы можете получать `ref` как проп для функциональных компонентов:

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

Новые функциональные компоненты больше не будут нуждаться в `forwardRef`, и мы опубликуем codemod для автоматического обновления ваших компонентов для использования нового пропа `ref`. В будущих версиях мы объявим `forwardRef` устаревшим и удалим его.

<Note>

`refs`, переданные в классы, не передаются как пропсы, поскольку они ссылаются на экземпляр компонента.

</Note>

### Различия для ошибок гидратации {/*diffs-for-hydration-errors*/}

Мы также улучшили отчетность об ошибках гидратации в `react-dom`. Например, вместо вывода нескольких ошибок в режиме разработки без какой-либо информации о несоответствии:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

Теперь мы выводим одно сообщение с различиями несоответствия:


<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### `<Context>` как провайдер {/*context-as-a-provider*/}

В React 19 вы можете рендерить `<Context>` как провайдер вместо `<Context.Provider>`:


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

Новые провайдеры Context могут использовать `<Context>`, и мы опубликуем codemod для преобразования существующих провайдеров. В будущих версиях мы объявим `<Context.Provider>` устаревшим.

### Функции очистки для `ref` {/*cleanup-functions-for-refs*/}

Теперь мы поддерживаем возврат функции очистки из колбэков `ref`:

```js {7-9}
<input
  ref={(ref) => {
    // ref created

    // NEW: return a cleanup function to reset
    // the ref when element is removed from DOM.
    return () => {
      // ref cleanup
    };
  }}
/>
```

Когда компонент будет размонтирован, React вызовет функцию очистки, возвращенную из колбэка `ref`. Это работает для DOM-refs, refs к классовым компонентам и `useImperativeHandle`.

<Note>

Ранее React вызывал `ref` функции с `null` при размонтировании компонента. Если ваш `ref` возвращает функцию очистки, React теперь пропустит этот шаг.

В будущих версиях мы объявим устаревшим вызов refs с `null` при размонтировании компонентов.

</Note>

Из-за введения функций очистки для `ref`, возврат чего-либо другого из колбэка `ref` теперь будет отклоняться TypeScript. Исправление обычно заключается в прекращении использования неявных возвратов, например:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Исходный код возвращал экземпляр `HTMLDivElement`, и TypeScript не знал, было ли это _предназначено_ быть функцией очистки, или вы не хотели возвращать функцию очистки.

Вы можете преобразовать этот шаблон с помощью [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return).

### Начальное значение `useDeferredValue` {/*use-deferred-value-initial-value*/}

Мы добавили опцию `initialValue` в `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // On initial render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
````

Когда предоставлено <CodeStep step={2}>initialValue</CodeStep>, `useDeferredValue` вернет его как `value` для начального рендеринга компонента и запланирует фоновый повторный рендеринг с возвращаемым <CodeStep step={1}>deferredValue</CodeStep>.

Подробнее см. [`useDeferredValue`](/reference/react/useDeferredValue).

### Поддержка тегов метаданных документа {/*support-for-metadata-tags*/}

В HTML теги метаданных документа, такие как `<title>`, `<link>` и `<meta>`, зарезервированы для размещения в разделе `<head>` документа. В React компонент, который определяет, какие метаданные подходят для приложения, может находиться очень далеко от места, где вы рендерите `<head>`, или React вообще не рендерит `<head>`. В прошлом эти элементы приходилось вставлять вручную в эффекте или с помощью библиотек, таких как [`react-helmet`](https://github.com/nfl/react-helmet), и требовалась тщательная обработка при серверном рендеринге приложения React.

В React 19 мы добавляем нативную поддержку рендеринга тегов метаданных документа в компонентах:

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

Когда React отрендерит этот компонент, он увидит теги `<title>`, `<link>` и `<meta>` и автоматически переместит их в раздел `<head>` документа. Поддерживая эти теги метаданных нативно, мы можем обеспечить их работу с клиентскими приложениями, потоковой SSR и серверными компонентами.

<Note>

#### Вам все еще может понадобиться библиотека метаданных {/*you-may-still-want-a-metadata-library*/}

Для простых случаев рендеринг метаданных документа в виде тегов может быть подходящим, но библиотеки могут предлагать более мощные функции, такие как переопределение общих метаданных конкретными метаданными на основе текущего маршрута. Эти функции облегчают фреймворкам и библиотекам, таким как [`react-helmet`](https://github.com/nfl/react-helmet), поддержку тегов метаданных, а не их замену.

</Note>

Для получения дополнительной информации см. документацию по [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link) и [`<meta>`](/reference/react-dom/components/meta).

### Поддержка таблиц стилей {/*support-for-stylesheets*/}

Таблицы стилей, как внешние связанные (`<link rel="stylesheet" href="...">`), так и встроенные (`<style>...</style>`), требуют тщательного позиционирования в DOM из-за правил приоритета стилей. Создание функциональности таблиц стилей, допускающей композицию в компонентах, сложно, поэтому пользователи часто либо загружают все свои стили далеко от компонентов, которые могут от них зависеть, либо используют библиотеку стилей, которая инкапсулирует эту сложность.

В React 19 мы решаем эту сложность и обеспечиваем более глубокую интеграцию с Concurrent Rendering на клиенте и Streaming Rendering на сервере благодаря встроенной поддержке таблиц стилей. Если вы укажете React `precedence` вашей таблицы стилей, он будет управлять порядком вставки таблицы стилей в DOM и гарантировать, что таблица стилей (если она внешняя) будет загружена перед отображением контента, который зависит от этих правил стилей.

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- will be inserted between foo & bar
    </div>
  )
}
```

Во время серверного рендеринга React включит таблицу стилей в `<head>`, что гарантирует, что браузер не будет отрисовывать до ее загрузки. Если таблица стилей обнаружена поздно, после того как мы уже начали потоковую передачу, React гарантирует, что таблица стилей будет вставлена в `<head>` на клиенте перед отображением контента границы Suspense, которая зависит от этой таблицы стилей.

Во время клиентского рендеринга React будет ждать загрузки вновь отрисованных таблиц стилей перед фиксацией рендеринга. Если вы рендерите этот компонент из нескольких мест в вашем приложении, React включит таблицу стилей только один раз в DOM:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // won't lead to a duplicate stylesheet link in the DOM
  </>
}
```

Для пользователей, привыкших загружать таблицы стилей вручную, это возможность разместить эти таблицы стилей рядом с компонентами, которые от них зависят, что обеспечивает лучшее локальное рассуждение и упрощает обеспечение загрузки только тех таблиц стилей, которые вам действительно нужны.

Библиотеки стилей и интеграции стилей с бандлерами также могут использовать эту новую возможность, поэтому даже если вы не рендерите свои таблицы стилей напрямую, вы все равно можете получить выгоду, когда ваши инструменты будут обновлены для использования этой функции.

Для получения дополнительной информации прочитайте документацию по [`<link>`](/reference/react-dom/components/link) и [`<style>`](/reference/react-dom/components/style).

### Поддержка асинхронных скриптов {/*support-for-async-scripts*/}

В HTML обычные скрипты (`<script src="...">`) и отложенные скрипты (`<script defer="" src="...">`) загружаются в порядке документа, что затрудняет рендеринг таких скриптов глубоко в дереве компонентов. Однако асинхронные скрипты (`<script async="" src="...">`) загружаются в произвольном порядке.

В React 19 мы включили лучшую поддержку асинхронных скриптов, позволив вам рендерить их в любом месте дерева компонентов, внутри компонентов, которые фактически зависят от скрипта, без необходимости управлять перемещением и дедупликацией экземпляров скриптов.

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // won't lead to duplicate script in the DOM
    </body>
  </html>
}
```

Во всех средах рендеринга асинхронные скрипты будут дедуплицироваться, так что React будет загружать и выполнять скрипт только один раз, даже если он рендерится несколькими разными компонентами.

При серверном рендеринге асинхронные скрипты будут включены в `<head>` и будут иметь приоритет ниже более критических ресурсов, блокирующих отрисовку, таких как таблицы стилей, шрифты и предварительная загрузка изображений.

Для получения дополнительной информации прочитайте документацию по [`<script>`](/reference/react-dom/components/script).

### Поддержка предварительной загрузки ресурсов {/*support-for-preloading-resources*/}

Во время начальной загрузки документа и при клиентских обновлениях, раннее информирование браузера о ресурсах, которые ему, вероятно, понадобятся, может оказать значительное влияние на производительность страницы.

React 19 включает ряд новых API для загрузки и предварительной загрузки ресурсов браузера, чтобы максимально упростить создание отличных интерфейсов, не сдерживаемых неэффективной загрузкой ресурсов.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // loads and executes this script eagerly
  preload('https://.../path/to/font.woff', { as: 'font' }) // preloads this font
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // preloads this stylesheet
  prefetchDNS('https://...') // when you may not actually request anything from this host
  preconnect('https://...') // when you will request something but aren't sure what
}
```
```html
<!-- the above would result in the following DOM/HTML -->
<html>
  <head>
    <!-- links/scripts are prioritized by their utility to early loading, not call order -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Эти API можно использовать для оптимизации начальной загрузки страниц, перемещая обнаружение дополнительных ресурсов, таких как шрифты, из загрузки таблиц стилей. Они также могут ускорить клиентские обновления, предварительно загрузив список ресурсов, используемых ожидаемой навигацией, а затем активно предварительно загружая эти ресурсы при нажатии или даже при наведении.

Для получения дополнительной информации см. [API предварительной загрузки ресурсов](/reference/react-dom#resource-preloading-apis).

### Совместимость со сторонними скриптами и расширениями {/*compatibility-with-third-party-scripts-and-extensions*/}

Мы улучшили гидратацию для учета сторонних скриптов и расширений браузера.

При гидратации, если элемент, который рендерится на клиенте, не совпадает с элементом, найденным в HTML с сервера, React принудительно выполнит клиентский повторный рендеринг для исправления контента. Ранее, если элемент был вставлен сторонними скриптами или расширениями браузера, это вызывало ошибку несоответствия и клиентский рендеринг.

В React 19 неожиданные теги в `<head>` и `<body>` будут пропущены, избегая ошибок несоответствия. Если React потребуется повторно отрисовать весь документ из-за несвязанного несоответствия гидратации, он оставит на месте таблицы стилей, вставленные сторонними скриптами и расширениями браузера.

### Улучшенная отчетность об ошибках {/*error-handling*/}

Мы улучшили обработку ошибок в React 19, чтобы устранить дублирование и предоставить параметры для обработки пойманных и непойманных ошибок. Например, когда возникает ошибка при рендеринге, пойманная Error Boundary, ранее React выбрасывал ошибку дважды (один раз для исходной ошибки, затем снова после неудачной автоматической попытки восстановления), а затем вызывал `console.error` с информацией о месте возникновения ошибки.

Это приводило к трем ошибкам на каждую пойманную ошибку:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

В React 19 мы выводим одну ошибку со всей информацией об ошибке:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

Кроме того, мы добавили две новые опции корневого узла в дополнение к `onRecoverableError`:

- `onCaughtError`: вызывается, когда React ловит ошибку в Error Boundary.
- `onUncaughtError`: вызывается, когда выбрасывается ошибка и она не поймана Error Boundary.
- `onRecoverableError`: вызывается, когда выбрасывается ошибка и она автоматически восстанавливается.

Для получения дополнительной информации и примеров см. документацию по [`createRoot`](/reference/react-dom/client/createRoot) и [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).

### Поддержка пользовательских элементов {/*support-for-custom-elements*/}

React 19 добавляет полную поддержку пользовательских элементов и проходит все тесты на [Custom Elements Everywhere](https://custom-elements-everywhere.com/).

В предыдущих версиях использование пользовательских элементов в React было затруднено, поскольку React рассматривал неузнанные пропсы как атрибуты, а не свойства. В React 19 мы добавили поддержку свойств, которая работает на клиенте и во время SSR со следующей стратегией:

- **Серверный рендеринг**: пропсы, переданные пользовательскому элементу, будут рендериться как атрибуты, если их тип является примитивным значением, таким как `string`, `number`, или значение равно `true`. Пропсы с непромитивными типами, такими как `object`, `symbol`, `function`, или значением `false`, будут опущены.
- **Клиентский рендеринг**: пропсы, соответствующие свойству экземпляра пользовательского элемента, будут назначены как свойства, в противном случае они будут назначены как атрибуты.

Благодаря [Joey Arhar](https://github.com/josepharhar) за разработку и реализацию поддержки пользовательских элементов в React.


#### Как обновиться {/*how-to-upgrade*/}
См. [Руководство по обновлению до React 19](/blog/2024/04/25/react-19-upgrade-guide) для пошаговых инструкций и полного списка критических и примечательных изменений.

_Примечание: этот пост был первоначально опубликован 25.04.2024 и обновлен до 05.12.2024 с выпуском стабильной версии._
