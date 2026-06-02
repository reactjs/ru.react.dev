---
title: useFormStatus
---

<Intro>

`useFormStatus` — это хук, который предоставляет информацию о статусе последней отправки формы.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

Хук `useFormStatus` предоставляет информацию о статусе последней отправки формы.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Чтобы получить информацию о статусе, компонент `Submit` должен быть отрисован внутри `<form>`. Хук возвращает такую информацию, как свойство <CodeStep step={1}>`pending`</CodeStep>, которое указывает, происходит ли в данный момент отправка формы.

В приведенном выше примере `Submit` использует эту информацию, чтобы отключить нажатие на `<button>` во время отправки формы.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

`useFormStatus` не принимает никаких параметров.

#### Возвращает {/*returns*/}

Объект `status` со следующими свойствами:

* `pending`: Булево значение. Если `true`, это означает, что родительская форма `<form>` находится в состоянии ожидания отправки. В противном случае — `false`.

* `data`: Объект, реализующий [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), содержащий данные, которые отправляет родительская форма `<form>`. Если активной отправки нет или родительской формы `<form>` нет, значение будет `null`.

* `method`: Строковое значение `'get'` или `'post'`. Это указывает, отправляется ли родительская форма `<form>` с использованием метода [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) `GET` или `POST`. По умолчанию форма `<form>` использует метод `GET`, который можно указать с помощью свойства [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: Ссылка на функцию, переданную в свойство `action` родительской формы `<form>`. Если родительской формы `<form>` нет, свойство будет `null`. Если в свойстве `action` указано значение URI или свойство `action` не указано, `status.action` будет `null`.

#### Ограничения {/*caveats*/}

* Хук `useFormStatus` должен вызываться из компонента, который отрисован внутри `<form>`.
* `useFormStatus` будет возвращать информацию о статусе только для родительской формы `<form>`. Он не будет возвращать информацию о статусе для любой формы `<form>`, отрисованной в том же компоненте или в дочерних компонентах.

---

## Использование {/*usage*/}

### Отображение состояния ожидания во время отправки формы {/*display-a-pending-state-during-form-submission*/}
Чтобы отобразить состояние ожидания во время отправки формы, вы можете вызвать хук `useFormStatus` в компоненте, отрисованном внутри `<form>`, и прочитать возвращаемое свойство `pending`.

Здесь мы используем свойство `pending`, чтобы указать, что форма отправляется.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```
</Sandpack>

<Pitfall>

##### `useFormStatus` не вернет информацию о статусе для `<form>`, отрисованной в том же компоненте. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

Хук `useFormStatus` возвращает информацию о статусе только для родительской формы `<form>`, а не для любой формы `<form>`, отрисованной в том же компоненте, который вызывает хук, или в дочерних компонентах.

```js
function Form() {
  // 🚩 `pending` никогда не будет true
  // useFormStatus не отслеживает форму, отрисованную в этом компоненте
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Вместо этого вызывайте `useFormStatus` из компонента, который находится внутри `<form>`.

```js
function Submit() {
  // ✅ `pending` будет получен из формы, которая оборачивает компонент Submit
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
  // Это <form>, который отслеживает `useFormStatus`
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Чтение отправляемых данных формы {/*read-form-data-being-submitted*/}

Вы можете использовать свойство `data` информации о статусе, возвращаемой `useFormStatus`, чтобы отобразить, какие данные отправляются пользователем.

Здесь у нас есть форма, где пользователи могут запросить имя пользователя. Мы можем использовать `useFormStatus`, чтобы отобразить временное сообщение о статусе, подтверждающее, какое имя пользователя они запросили.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>

---

## Устранение неполадок {/*troubleshooting*/}

### `status.pending` никогда не равен `true` {/*pending-is-never-true*/}

`useFormStatus` будет возвращать информацию о статусе только для родительской формы `<form>`.

Если компонент, вызывающий `useFormStatus`, не вложен в `<form>`, `status.pending` всегда будет возвращать `false`. Убедитесь, что `useFormStatus` вызывается в компоненте, который является дочерним элементом `<form>`.

`useFormStatus` не будет отслеживать статус формы `<form>`, отрисованной в том же компоненте. Подробнее см. [Ограничение](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component).