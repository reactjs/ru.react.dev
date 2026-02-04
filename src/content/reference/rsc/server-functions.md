---
title: Server Functions
---

<RSC>

Server Functions предназначены для использования в [React Server Components](/reference/rsc/server-components).

**Примечание:** До сентября 2024 года мы называли все Server Functions «Server Actions». Если Server Function передается в action prop или вызывается изнутри action, то это Server Action, но не все Server Functions являются Server Actions. Названия в этой документации были обновлены, чтобы отразить, что Server Functions могут использоваться для различных целей.

</RSC>

<Intro>

Server Functions позволяют Client Components вызывать асинхронные функции, выполняющиеся на сервере.

</Intro>

<InlineToc />

<Note>

#### Как мне реализовать поддержку Server Functions? {/*how-do-i-build-support-for-server-functions*/}

Хотя Server Functions в React 19 стабильны и не будут ломаться между минорными версиями, базовые API, используемые для реализации Server Functions в бандлере или фреймворке React Server Components, не следуют semver и могут ломаться между минорными версиями React 19.x.

Для поддержки Server Functions в качестве бандлера или фреймворка мы рекомендуем зафиксировать определенную версию React или использовать Canary release. Мы продолжим работать с бандлерами и фреймворками над стабилизацией API, используемых для реализации Server Functions в будущем.

</Note>

Когда Server Function определяется с директивой [`"use server"`](/reference/rsc/use-server), ваш фреймворк автоматически создаст ссылку на серверную функцию и передаст эту ссылку в Client Component. Когда эта функция вызывается на клиенте, React отправит запрос на сервер для выполнения функции и вернет результат.

Server Functions могут быть созданы в Server Components и переданы в качестве пропсов в Client Components, либо они могут быть импортированы и использованы в Client Components.

## Использование {/*usage*/}

### Создание Server Function из Server Component {/*creating-a-server-function-from-a-server-component*/}

Server Components могут определять Server Functions с директивой `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Когда React рендерит `EmptyNote` Server Component, он создаст ссылку на функцию `createNoteAction` и передаст эту ссылку в `Button` Client Component. При нажатии на кнопку React отправит запрос на сервер для выполнения функции `createNoteAction` с предоставленной ссылкой:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

Подробнее см. в документации по [`"use server"`](/reference/rsc/use-server).


### Импорт Server Functions из Client Components {/*importing-server-functions-from-client-components*/}

Client Components могут импортировать Server Functions из файлов, использующих директиву `"use server"`:

```js [[1, 3, "createNote"]]
"use server";

export async function createNote() {
  await db.notes.create();
}

```

Когда бандлер собирает `EmptyNote` Client Component, он создаст ссылку на функцию `createNote` в бандле. При нажатии на `button` React отправит запрос на сервер для выполнения функции `createNote` с предоставленной ссылкой:

```js [[1, 2, "createNote"], [1, 5, "createNote"], [1, 7, "createNote"]]
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

Подробнее см. в документации по [`"use server"`](/reference/rsc/use-server).

### Server Functions с Actions {/*server-functions-with-actions*/}

Server Functions могут быть вызваны из Actions на клиенте:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {error && <span>Failed: {error}</span>}
    </form>
  )
}
```

Это позволяет получить доступ к состоянию `isPending` Server Function, обернув ее в Action на клиенте.

Подробнее см. в документации по [Вызов Server Function вне `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### Server Functions с Form Actions {/*using-server-functions-with-form-actions*/}

Server Functions работают с новыми возможностями Form в React 19.

Вы можете передать Server Function в Form для автоматической отправки формы на сервер:


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

При успешной отправке формы React автоматически сбросит форму. Вы можете добавить `useActionState` для доступа к состоянию ожидания, последнему полученному ответу или для поддержки прогрессивного улучшения.

Подробнее см. в документации по [Server Functions в Forms](/reference/rsc/use-server#server-functions-in-forms).

### Server Functions с `useActionState` {/*server-functions-with-use-action-state*/}

Вы можете вызывать Server Functions с `useActionState` для распространенного случая, когда вам просто нужен доступ к состоянию ожидания action и последнему возвращенному ответу:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

При использовании `useActionState` с Server Functions React также автоматически воспроизведет отправку формы, введенную до завершения гидратации. Это означает, что пользователи смогут взаимодействовать с вашим приложением еще до того, как оно будет гидратировано.

Подробнее см. в документации по [`useActionState`](/reference/react-dom/hooks/useFormState).

### Прогрессивное улучшение с `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Server Functions также поддерживают прогрессивное улучшение с помощью третьего аргумента `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

Когда <CodeStep step={2}>permalink</CodeStep> предоставляется `useActionState`, React перенаправит на указанный URL, если форма отправлена до загрузки JavaScript-бандла.

Подробнее см. в документации по [`useActionState`](/reference/react-dom/hooks/useFormState).