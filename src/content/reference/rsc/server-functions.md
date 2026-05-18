---
title: Server Functions
---

<RSC>

Серверные функции предназначены для использования в [Компонентах сервера React](/reference/rsc/server-components).

**Примечание:** До сентября 2024 года мы называли все серверные функции «Серверными действиями». Если серверная функция передается в свойство действия или вызывается изнутри действия, то это Серверное действие, но не все серверные функции являются Серверными действиями. Наименования в этой документации были обновлены, чтобы отразить, что серверные функции могут использоваться для различных целей.

</RSC>

<Intro>

Серверные функции позволяют клиентским компонентам вызывать асинхронные функции, выполняемые на сервере.

</Intro>

<InlineToc />

<Note>

#### Как реализовать поддержку серверных функций? {/*how-do-i-build-support-for-server-functions*/}

Хотя серверные функции в React 19 стабильны и не будут нарушаться между минорными версиями, базовые API, используемые для реализации серверных функций в бандлере или фреймворке React Server Components, не следуют semver и могут нарушаться между минорными версиями React 19.x.

Для поддержки серверных функций в качестве бандлера или фреймворка мы рекомендуем закрепить определенную версию React или использовать Canary-релиз. Мы продолжим работать с бандлерами и фреймворками над стабилизацией API, используемых для реализации серверных функций в будущем.

</Note>

Когда серверная функция определяется с директивой [`"use server"`](/reference/rsc/use-server), ваш фреймворк автоматически создаст ссылку на серверную функцию и передаст эту ссылку клиентскому компоненту. Когда эта функция вызывается на клиенте, React отправит запрос на сервер для выполнения функции и вернет результат.

Серверные функции могут быть созданы в серверных компонентах и переданы как пропсы клиентским компонентам, либо они могут быть импортированы и использованы в клиентских компонентах.

## Использование {/*usage*/}

### Создание серверной функции из серверного компонента {/*creating-a-server-function-from-a-server-component*/}

Серверные компоненты могут определять серверные функции с директивой `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Серверный компонент
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Серверная функция
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Когда React отрисует серверный компонент `EmptyNote`, он создаст ссылку на функцию `createNoteAction` и передаст эту ссылку клиентскому компоненту `Button`. При нажатии на кнопку React отправит запрос на сервер для выполнения функции `createNoteAction` с предоставленной ссылкой:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

Подробнее см. в документации по [`"use server"`](/reference/rsc/use-server).


### Импорт серверных функций из клиентских компонентов {/*importing-server-functions-from-client-components*/}

Клиентские компоненты могут импортировать серверные функции из файлов, использующих директиву `"use server"`:

```js [[1, 3, "createNote"]]
"use server";

export async function createNote() {
  await db.notes.create();
}

```

Когда бандлер соберет клиентский компонент `EmptyNote`, он создаст ссылку на функцию `createNote` в бандле. При нажатии на кнопку `button` React отправит запрос на сервер для выполнения функции `createNote` с предоставленной ссылкой:

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

### Серверные функции с действиями {/*server-functions-with-actions*/}

Серверные функции могут быть вызваны из действий на клиенте:

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

Это позволяет получить доступ к состоянию `isPending` серверной функции, обернув ее в действие на клиенте.

Подробнее см. в документации по [Вызов серверной функции вне `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### Серверные функции с действиями форм {/*using-server-functions-with-form-actions*/}

Серверные функции работают с новыми возможностями форм в React 19.

Вы можете передать серверную функцию в `<form>` для автоматической отправки формы на сервер:


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

При успешной отправке формы React автоматически сбросит форму. Вы можете добавить `useActionState` для доступа к состоянию ожидания, последнему ответу или для поддержки прогрессивного улучшения.

Подробнее см. в документации по [Серверные функции в формах](/reference/rsc/use-server#server-functions-in-forms).

### Серверные функции с `useActionState` {/*server-functions-with-use-action-state*/}

Вы можете вызывать серверные функции с `useActionState` для распространенного случая, когда вам просто нужен доступ к состоянию ожидания действия и последнему полученному ответу:

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

При использовании `useActionState` с серверными функциями React также автоматически повторно воспроизведет отправку формы, введенную до завершения гидратации. Это означает, что пользователи могут взаимодействовать с вашим приложением еще до того, как оно будет гидратировано.

Подробнее см. в документации по [`useActionState`](/reference/react-dom/hooks/useFormState).

### Прогрессивное улучшение с `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Серверные функции также поддерживают прогрессивное улучшение с помощью третьего аргумента `useActionState`.

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

Когда <CodeStep step={2}>постоянная ссылка</CodeStep> предоставляется `useActionState`, React перенаправит на указанный URL, если форма отправлена до загрузки JavaScript-бандла.

Подробнее см. в документации по [`useActionState`](/reference/react-dom/hooks/useFormState).
