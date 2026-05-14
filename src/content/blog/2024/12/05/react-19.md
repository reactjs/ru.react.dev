---
title: "React v19"
author: The React Team
date: 2024/12/05
description: React 19 теперь доступен в npm! В этой статье мы рассмотрим новые
  возможности React 19 и способы их использования.
---
```
December 05, 2024 от [Команды React](/community/team)

---
<Note>

### React 19 теперь стабилен! {/*react-19-is-now-stable*/}

Дополнения с момента первоначальной публикации этого поста с React 19 RC в апреле:

- **Предварительный прогрев для приостановленных деревьев**: см. [Улучшения Suspense](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense).
- **Статические API React DOM**: см. [Новые статические API React DOM](#new-react-dom-static-apis).

_Дата этого поста была обновлена, чтобы отражать дату стабильного релиза._

</Note>

<Intro>

React v19 теперь доступен в npm!

</Intro>

В нашем [Руководстве по обновлению React 19](/blog/2024/04/25/react-19-upgrade-guide) мы поделились пошаговыми инструкциями по обновлению вашего приложения до React 19. В этом посте мы предоставим обзор новых возможностей React 19 и способы их внедрения.

- [Что нового в React 19](#whats-new-in-react-19)
- [Улучшения в React 19](#improvements-in-react-19)
- [Как обновиться](#how-to-upgrade)

Список критических изменений см. в [Руководстве по обновлению](/blog/2024/04/25/react-19-upgrade-guide).

---

## Что нового в React 19 {/*whats-new-in-react-19*/}

### Действия {/*actions*/}

Распространенным вариантом использования в приложениях React является выполнение мутации данных, а затем обновление состояния в ответ. Например, когда пользователь отправляет форму для изменения своего имени, вы сделаете запрос к API, а затем обработаете ответ. В прошлом вам нужно было вручную обрабатывать состояния ожидания, ошибки, оптимистичные обновления и последовательные запросы.

Например, вы можете обработать состояние ожидания и ошибки в `useState`:

```js
// До действий
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

В React 19 мы добавляем поддержку использования асинхронных функций в переходах для автоматической обработки состояний ожидания, ошибок, форм и оптимистичных обновлений.

Например, вы можете использовать `useTransition` для обработки состояния ожидания:

```js
// Использование состояния ожидания из действий
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

Асинхронный переход немедленно установит состояние `isPending` в true, выполнит асинхронные запросы и переключит `isPending` в false после любых переходов. Это позволяет вам поддерживать отзывчивость и интерактивность текущего пользовательского интерфейса во время изменения данных.

<Note>

#### По соглашению функции, использующие асинхронные переходы, называются «Действиями». {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Действия автоматически управляют отправкой данных за вас:

- **Состояние ожидания**: Действия предоставляют состояние ожидания, которое начинается в начале запроса и автоматически сбрасывается при фиксации окончательного обновления состояния.
- **Оптимистичные обновления**: Действия поддерживают новый хук [`useOptimistic`](#new-hook-optimistic-updates), чтобы вы могли показывать пользователям мгновенную обратную связь во время отправки запросов.
- **Обработка ошибок**: Действия обеспечивают обработку ошибок, чтобы вы могли отображать Error Boundaries при сбое запроса и автоматически возвращать оптимистичные обновления к их исходному значению.
- **Формы**: Элементы `<form>` теперь поддерживают передачу функций в свойства `action` и `formAction`. Передача функций в свойства `action` по умолчанию использует Действия и автоматически сбрасывает форму после отправки.

</Note>

Основываясь на Действиях, React 19 представляет [`useOptimistic`](#new-hook-optimistic-updates) для управления оптимистичными обновлениями и новый хук [`React.useActionState`](#new-hook-useactionstate) для обработки общих случаев для Действий. В `react-dom` мы добавляем [`<form>` Действия](#form-actions) для автоматического управления формами и [`useFormStatus`](#new-hook-useformstatus) для поддержки общих случаев для Действий в формах.

В React 19 приведенный выше пример можно упростить до:

```js
// Использование <form> Действий и useActionState
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

В следующем разделе мы разберем каждую из новых функций Действий в React 19.

### Новый хук: `useActionState` {/*new-hook-useactionstate*/}

Чтобы упростить общие случаи для Действий, мы добавили новый хук под названием `useActionState`:

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

`useActionState` принимает функцию ( «Действие») и возвращает обернутое Действие для вызова. Это работает, потому что Действия компонуются. Когда обернутое Действие вызывается, `useActionState` вернет последний результат Действия как `data` и состояние ожидания Действия как `pending`.

<Note>

`React.useActionState` ранее назывался `ReactDOM.useFormState` в Canary-релизах, но мы переименовали его и объявили `useFormState` устаревшим.

См. [#28491](https://github.com/facebook/react/pull/28491) для получения дополнительной информации.

</Note>

Для получения дополнительной информации см. документацию по [`useActionState`](/reference/react/useActionState).

### React DOM: `<form>` Действия {/*form-actions*/}

Действия также интегрированы с новыми функциями `<form>` React 19 для `react-dom`. Мы добавили поддержку передачи функций в качестве свойств `action` и `formAction` элементов `<form>`, `<input>` и `<button>`, чтобы автоматически отправлять формы с Действиями:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

Когда `<form>` Действие завершается успешно, React автоматически сбросит форму для неуправляемых компонентов. Если вам нужно сбросить `<form>` вручную, вы можете вызвать новый API React DOM `requestFormReset`.

Для получения дополнительной информации см. документацию `react-dom` по [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) и `<button>`.

### React DOM: Новый хук: `useFormStatus` {/*new-hook-useformstatus*/}

В системах проектирования обычно пишут компоненты проектирования, которым нужен доступ к информации о `<form>`, в которой они находятся, без передачи свойств вниз к компоненту. Это можно сделать через Context, но чтобы упростить общий случай, мы добавили новый хук `useFormStatus`:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` считывает состояние родительского `<form>`, как если бы форма была поставщиком Context.

Для получения дополнительной информации см. документацию `react-dom` по [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Новый хук: `useOptimistic` {/*new-hook-optimistic-updates*/}

Еще одним распространенным шаблоном пользовательского интерфейса при выполнении мутации данных является оптимистичное отображение окончательного состояния, пока выполняется асинхронный запрос. В React 19 мы добавляем новый хук под названием `useOptimistic`, чтобы упростить это:

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

Хук `useOptimistic` немедленно отобразит `optimisticName` во время выполнения запроса `updateName`. Когда обновление завершится или произойдет ошибка, React автоматически переключится обратно на значение `currentName`.

Для получения дополнительной информации см. документацию по [`useOptimistic`](/reference/react/useOptimistic).

### Новый API: `use` {/*new-feature-use*/}

В React 19 мы представляем новый API для чтения ресурсов в рендере: `use`.

Например, вы можете прочитать promise с помощью `use`, и React приостановит выполнение, пока promise не будет разрешен:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` приостановит выполнение, пока promise не будет разрешен.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // Когда `use` приостанавливает выполнение в Comments,
  // будет показана эта граница Suspense.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` не поддерживает promise, созданные в рендере. {/*use-does-not-support-promises-created-in-render*/}

Если вы попытаетесь передать promise, созданный в рендере, в `use`, React выдаст предупреждение:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Компонент был приостановлен некэшированным promise. Создание promise внутри Client Component или хука пока не поддерживается, за исключением случаев использования библиотеки или фреймворка, совместимых с Suspense.

</ConsoleLogLine>

</ConsoleBlockMulti>

Чтобы исправить это, вам нужно передать promise из библиотеки или фреймворка с поддержкой Suspense, который поддерживает кэширование для promise. В будущем мы планируем выпустить функции, упрощающие кэширование promise в рендере.

</Note>

Вы также можете прочитать context с помощью `use`, что позволяет вам условно читать Context, например, после ранних возвратов:

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // Это не будет работать с useContext
  // из-за раннего возврата.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

API `use` можно вызывать только в рендере, как и хуки. В отличие от хуков, `use` можно вызывать условно. В будущем мы планируем поддерживать больше способов потребления ресурсов в рендере с помощью `use`.

Для получения дополнительной информации см. документацию по [`use`](/reference/react/use).

## Новые статические API React DOM {/*new-react-dom-static-apis*/}

Мы добавили два новых API в `react-dom/static` для генерации статических сайтов:
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

Эти новые API улучшают `renderToString`, ожидая загрузки данных для генерации статического HTML. Они разработаны для работы со потоковыми средами, такими как Node.js Streams и Web Streams. Например, в среде Web Stream вы можете предварительно отобразить дерево React в статический HTML с помощью `prerender`:

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

API prerender будут ждать загрузки всех данных, прежде чем вернуть статический HTML-поток. Потоки можно преобразовать в строки или отправить с потоковым ответом. Они не поддерживают потоковую передачу контента по мере его загрузки, что поддерживается существующими [API рендеринга на стороне сервера React DOM](/reference/react-dom/server).

Для получения дополнительной информации см. [Статические API React DOM](/reference/react-dom/static).

## React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

Server Components — это новый вариант, который позволяет отображать компоненты заранее, до пакетирования, в среде, отдельной от вашего клиентского приложения или SSR-сервера. Эта отдельная среда — «сервер» в React Server Components. Server Components могут запускаться один раз во время сборки на вашем CI-сервере или могут запускаться для каждого запроса с использованием веб-сервера.

React 19 включает в себя все функции React Server Components, включенные из канала Canary. Это означает, что библиотеки, поставляемые с Server Components, теперь могут ориентироваться на React 19 в качестве peer-зависимости с [условием экспорта](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) `react-server` для использования в фреймворках, которые поддерживают [архитектуру Full-stack React](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision).

<Note>

#### Как мне создать поддержку Server Components? {/*how-do-i-build-support-for-server-components*/}

Хотя React Server Components в React 19 стабильны и не будут нарушаться между второстепенными версиями, базовые API, используемые для реализации пакетировщика или фреймворка React Server Components, не соответствуют semver и могут нарушаться между второстепенными версиями в React 19.x.

Чтобы поддерживать React Server Components в качестве пакетировщика или фреймворка, мы рекомендуем привязаться к определенной версии React или использовать выпуск Canary. Мы продолжим работать с пакетировщиками и фреймворками, чтобы стабилизировать API, используемые для реализации React Server Components в будущем.

</Note>

Для получения дополнительной информации см. документацию по [React Server Components](/reference/rsc/server-components).

### Server Actions {/*server-actions*/}

Server Actions позволяют Client Components вызывать асинхронные функции, выполняемые на сервере.

Когда Server Action определяется с помощью директивы `"use server"`, ваш фреймворк автоматически создаст ссылку на серверную функцию и передаст эту ссылку Client Component. Когда эта функция вызывается на клиенте, React отправит запрос на сервер для выполнения функции и вернет результат.

<Note>

#### Для Server Components нет директивы. {/*there-is-no-directive-for-server-components*/}

Распространенным заблуждением является то, что Server Components обозначаются `"use server"`, но для Server Components нет директивы. Директива `"use server"` используется для Server Actions.

Для получения дополнительной информации см. документацию по [Директивам](/reference/rsc/directives).

</Note>

Server Actions можно создавать в Server Components и передавать в качестве свойств Client Components, или их можно импортировать и использовать в Client Components.

Для получения дополнительной информации см. документацию по [React Server Actions](/reference/rsc/server-actions).

## Улучшения в React 19 {/*improvements-in-react-19*/}

### `ref` как свойство {/*ref-as-a-prop*/}

Начиная с React 19, теперь вы можете получить доступ к `ref` как к свойству для функциональных компонентов:

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

Новые функциональные компоненты больше не будут нуждаться в `forwardRef`, и мы опубликуем codemod для автоматического обновления ваших компонентов для использования нового свойства `ref`. В будущих версиях мы объявим `forwardRef` устаревшим и удалим его.

<Note>

`refs`, переданные классам, не передаются как свойства, поскольку они ссылаются на экземпляр компонента.

</Note>

### Различия для ошибок гидратации {/*diffs-for-hydration-errors*/}

Мы также улучшили отчеты об ошибках для ошибок гидратации в `react-dom`. Например, вместо регистрации нескольких ошибок в DEV без какой-либо информации о несоответствии:

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

Теперь мы регистрируем одно сообщение с различием несоответствия:

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

### `<Context>` как поставщик {/*context-as-a-provider*/}

В React 19 вы можете отображать `<Context>` как поставщика вместо `<Context.Provider>`:

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

Новые поставщики Context могут использовать `<Context>`, и мы опубликуем codemod для преобразования существующих поставщиков. В будущих версиях мы объявим `<Context.Provider>` устаревшим.

### Функции очистки для refs {/*cleanup-functions-for-refs*/}

Теперь мы поддерживаем возврат функции очистки из обратных вызовов `ref`:

```js {7-9}
<input
  ref={(ref) => {
    // ref создан

    // НОВОЕ: вернуть функцию очистки для сброса
    // ref при удалении элемента из DOM.
    return () => {
      // очистка ref
    };
  }}
/>
```

Когда компонент размонтируется, React вызовет функцию очистки, возвращенную из обратного вызова `ref`. Это работает для DOM refs, refs для классовых компонентов и `useImperativeHandle`.

<Note>

Ранее React вызывал функции `ref` со значением `null` при размонтировании компонента. Если ваш `ref` возвращает функцию очистки, React теперь пропустит этот шаг.

В будущих версиях мы объявим устаревшим вызов refs со значением `null` при размонтировании компонентов.

</Note>

Из-за введения функций очистки ref, возврат чего-либо еще из обратного вызова `ref` теперь будет отклонен TypeScript. Исправление обычно заключается в прекращении использования неявных возвратов, например:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Исходный код возвращал экземпляр `HTMLDivElement`, и TypeScript не знал бы, _должна_ ли это быть функция очистки или вы не хотите возвращать функцию очистки.

Вы можете codemod этот шаблон с помощью [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return).

### `useDeferredValue` начальное значение {/*use-deferred-value-initial-value*/}

Мы добавили опцию `initialValue` в `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // При начальном рендере значение равно ''.
  // Затем запланирован повторный рендер с deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
````

Когда <CodeStep step={2}>initialValue</CodeStep> предоставлено, `useDeferredValue` вернет его как `value` для начального рендера компонента и запланирует повторный рендер в фоновом режиме с возвращенным <CodeStep step={1}>deferredValue</CodeStep>.

Для получения дополнительной информации см. [`useDeferredValue`](/reference/react/useDeferredValue).

### Поддержка метаданных документа {/*support-for-metadata-tags*/}

В HTML теги метаданных документа, такие как `<title>`, `<link>` и `<meta>`, зарезервированы для размещения в разделе `<head>` документа. В React компонент, который определяет, какие метаданные подходят для приложения, может находиться очень далеко от места, где вы отображаете `<head>`, или React вообще не отображает `<head>`. В прошлом эти элементы нужно было вставлять вручную в эффект или с помощью таких библиотек, как [`react-helmet`](https://github.com/nfl/react-helmet), и требовали тщательной обработки при рендеринге приложения React на стороне сервера.

В React 19 мы добавляем поддержку отображения тегов метаданных документа в компонентах изначально:

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

Когда React отображает этот компонент, он увидит теги `<title>`, `<link>` и `<meta>` и автоматически переместит их в раздел `<head>` документа. Поддерживая эти теги метаданных изначально, мы можем гарантировать, что они будут работать с приложениями только для клиентов, потоковой передачей SSR и Server Components.

<Note>

#### Вам все равно может понадобиться библиотека Metadata {/*you-may-still-want-a-metadata-library*/}

Для простых вариантов использования отображение метаданных документа в виде тегов может быть подходящим, но библиотеки могут предлагать более мощные функции, такие как переопределение общих метаданных конкретными метаданными на основе текущего маршрута. Эти функции упрощают поддержку тегов метаданных для фреймворков и библиотек, таких как [`react-helmet`](https://github.com/nfl/react-helmet), а не заменяют их.

</Note>

Для получения дополнительной информации см. документацию по [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link) и [`<meta>`](/reference/react-dom/components/meta).

### Поддержка таблиц стилей {/*support-for-stylesheets*/}

Таблицы стилей, как внешние ссылки (`<link rel="stylesheet" href="...">`), так и встроенные (`<style>...</style>`), требуют тщательного позиционирования в DOM из-за правил приоритета стилей. Создание возможности работы с таблицами стилей, которая позволяет компоновать внутри компонентов, сложно, поэтому пользователи часто либо загружают все свои стили далеко от компонентов, которые могут зависеть от них, либо используют библиотеку стилей, которая инкапсулирует эту сложность.

В React 19 мы решаем эту проблему и обеспечиваем еще более глубокую интеграцию в Concurrent Rendering на клиенте и Streaming Rendering на сервере со встроенной поддержкой таблиц стилей. Если вы сообщите React о `precedence` вашей таблицы стилей, он будет управлять порядком вставки таблицы стилей в DOM и обеспечит загрузку таблицы стилей (если она внешняя) до отображения контента, который зависит от этих правил стиля.

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
      <link rel="stylesheet" href="baz" precedence="default" />  <-- будет вставлен между foo & bar
    </div>
  )
}
```

Во время рендеринга на стороне сервера React включит таблицу стилей в `<head>`, что гарантирует, что браузер не будет рисовать, пока она не загрузится. Если таблица стилей обнаруживается поздно после того, как мы уже начали потоковую передачу, React обеспечит вставку таблицы стилей в `<head>` на клиенте до отображения содержимого границы Suspense, которая зависит от этой таблицы стилей.

Во время рендеринга на стороне клиента React будет ждать загрузки вновь отображенных таблиц стилей, прежде чем зафиксировать рендер. Если вы отображаете этот компонент из нескольких мест в вашем приложении, React включит таблицу стилей только один раз в документ:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // не приведет к дублированию ссылки на таблицу стилей в DOM
  </>
}
```

Для пользователей, привыкших загружать таблицы стилей вручную, это возможность разместить эти таблицы стилей вместе с компонентами, которые зависят от них, что позволяет лучше локально рассуждать и упрощает обеспечение загрузки только тех таблиц стилей, от которых вы действительно зависите.

Библиотеки стилей и интеграции стилей с бандлерами также могут использовать эту новую возможность, поэтому, даже если вы напрямую не отображаете свои собственные таблицы стилей, вы все равно можете извлечь выгоду, когда ваши инструменты будут обновлены для использования этой функции.

Для получения более подробной информации прочтите документацию по [`<link>`](/reference/react-dom/components/link) и [`<style>`](/reference/react-dom/components/style).

### Поддержка асинхронных скриптов {/*support-for-async-scripts*/}

В HTML обычные скрипты (`<script src="...">`) и отложенные скрипты (`<script defer="" src="...">`) загружаются в порядке документа, что делает рендеринг этих видов скриптов глубоко внутри вашего дерева компонентов сложной задачей. Однако асинхронные скрипты (`<script async="" src="...">`) будут загружаться в произвольном порядке.

В React 19 мы включили лучшую поддержку асинхронных скриптов, позволив вам отображать их в любом месте вашего дерева компонентов, внутри компонентов, которые фактически зависят от скрипта, без необходимости управлять перемещением и удалением дубликатов экземпляров скрипта.

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
      <MyComponent> // не приведет к дублированию скрипта в DOM
    </body>
  </html>
}
```

Во всех средах рендеринга асинхронные скрипты будут удалены, чтобы React загружал и выполнял скрипт только один раз, даже если он отображается несколькими разными компонентами.

В рендеринге на стороне сервера асинхронные скрипты будут включены в `<head>` и приоритизированы после более критичных ресурсов, которые блокируют отрисовку, таких как таблицы стилей, шрифты и предварительная загрузка изображений.

Для получения более подробной информации прочтите документацию по [`<script>`](/reference/react-dom/components/script).

### Поддержка предварительной загрузки ресурсов {/*support-for-preloading-resources*/}

Во время начальной загрузки документа и при обновлениях на стороне клиента сообщение браузеру о ресурсах, которые ему, вероятно, потребуется загрузить как можно раньше, может оказать существенное влияние на производительность страницы.

React 19 включает в себя ряд новых API для загрузки и предварительной загрузки ресурсов браузера, чтобы максимально упростить создание отличных возможностей, которые не сдерживаются неэффективной загрузкой ресурсов.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // загружает и выполняет этот скрипт немедленно
  preload('https://.../path/to/font.woff', { as: 'font' }) // предварительно загружает этот шрифт
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // предварительно загружает эту таблицу стилей
  prefetchDNS('https://...') // когда вы, возможно, на самом деле ничего не запрашиваете с этого хоста
  preconnect('https://...') // когда вы что-то запросите, но не уверены, что именно
}
```
```html
<!-- вышеприведенное приведет к следующему DOM/HTML -->
<html>
  <head>
    <!-- ссылки/скрипты приоритизируются по их полезности для ранней загрузки, а не по порядку вызова -->
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

Эти API можно использовать для оптимизации начальной загрузки страниц путем перемещения обнаружения дополнительных ресурсов, таких как шрифты, из загрузки таблиц стилей. Они также могут ускорить обновления клиента, предварительно загрузив список ресурсов,