---
title: "<form>"
---

<Intro>

Встроенный компонент браузера `<form>` позволяет создавать интерактивные элементы для отправки информации.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<form>` {/*form*/}

Для создания интерактивных элементов для отправки информации используйте встроенный компонент браузера `<form>`.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[См. примеры ниже.](#usage)

#### Пропсы {/*props*/}

`<form>` поддерживает все [общие пропсы элементов](/reference/react-dom/components/common#props).

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): URL или функция. При передаче URL в `action` форма будет вести себя как HTML-компонент формы. При передаче функции в `action` функция будет обрабатывать отправку формы. Функция, переданная в `action`, может быть асинхронной и будет вызвана с одним аргументом, содержащим [данные формы](https://developer.mozilla.org/en-US/docs/Web/API/FormData) отправленной формы. Пропс `action` может быть переопределен атрибутом `formAction` на компоненте `<button>`, `<input type="submit">` или `<input type="image">`.

#### Ограничения {/*caveats*/}

* При передаче функции в `action` или `formAction` HTTP-метод будет POST, независимо от значения пропа `method`.

---

## Использование {/*usage*/}

### Обработка отправки формы на клиенте {/*handle-form-submission-on-the-client*/}

Передайте функцию в пропс `action` формы, чтобы выполнить эту функцию при отправке формы. [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) будет передана в функцию в качестве аргумента, чтобы вы могли получить доступ к данным, отправленным формой. Это отличается от стандартного [HTML `action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action), который принимает только URL. После успешного выполнения функции `action` все неуправляемые элементы полей в форме сбрасываются.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

### Обработка отправки формы с помощью серверной функции {/*handle-form-submission-with-a-server-function*/}

Отобразите `<form>` с полем ввода и кнопкой отправки. Передайте серверную функцию (функцию, помеченную [`'use server'`](/reference/rsc/use-server)) в пропс `action` формы, чтобы выполнить эту функцию при отправке формы.

Передача серверной функции в `<form action>` позволяет пользователям отправлять формы без включенного JavaScript или до загрузки кода. Это полезно для пользователей с медленным соединением, устройством или отключенным JavaScript, и похоже на то, как работают формы при передаче URL в пропс `action`.

Вы можете использовать скрытые поля формы для предоставления данных действию `<form>`. Серверная функция будет вызвана с данными скрытого поля формы в виде экземпляра [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

Вместо использования скрытых полей формы для предоставления данных действию `<form>`, вы можете вызвать метод <CodeStep step={1}>`bind`</CodeStep>, чтобы передать ему дополнительные аргументы. Это привяжет новый аргумент (<CodeStep step={2}>`productId`</CodeStep>) к функции в дополнение к <CodeStep step={3}>`formData`</CodeStep>, который передается в качестве аргумента функции.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

Когда `<form>` отображается [серверным компонентом](/reference/rsc/use-client), а [серверная функция](/reference/rsc/server-functions) передается в пропс `action` `<form>`, форма [прогрессивно улучшается](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### Отображение состояния ожидания во время отправки формы {/*display-a-pending-state-during-form-submission*/}
Чтобы отобразить состояние ожидания во время отправки формы, вы можете вызвать хук `useFormStatus` в компоненте, отображаемом в `<form>`, и прочитать возвращаемое свойство `pending`.

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

Чтобы узнать больше о хуке `useFormStatus`, см. [справочную документацию](/reference/react-dom/hooks/useFormStatus).

### Оптимистичное обновление данных формы {/*optimistically-updating-form-data*/}
Хук `useOptimistic` предоставляет способ оптимистичного обновления пользовательского интерфейса до завершения фоновой операции, такой как сетевой запрос. В контексте форм этот метод помогает сделать приложения более отзывчивыми. Когда пользователь отправляет форму, вместо ожидания ответа сервера для отражения изменений, интерфейс немедленно обновляется с ожидаемым результатом.

Например, когда пользователь вводит сообщение в форму и нажимает кнопку "Отправить", хук `useOptimistic` позволяет сообщению немедленно появиться в списке с меткой "Отправка...", еще до того, как сообщение будет фактически отправлено на сервер. Этот "оптимистичный" подход создает впечатление скорости и отзывчивости. Затем форма пытается действительно отправить сообщение в фоновом режиме. Как только сервер подтвердит получение сообщения, метка "Отправка..." будет удалена.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

[//]: # 'Uncomment the next line, and delete this line after the `useOptimistic` reference documentatino page is published'
[//]: # 'To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/hooks/useOptimistic).'

### Обработка ошибок отправки формы {/*handling-form-submission-errors*/}

В некоторых случаях функция, вызываемая пропсом `action` формы, генерирует ошибку. Вы можете обрабатывать эти ошибки, оборачивая `<form>` в Error Boundary. Если функция, вызываемая пропсом `action` формы, генерирует ошибку, будет отображаться резервный вариант для error boundary.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Отображение сообщения об ошибке отправки формы без JavaScript {/*display-a-form-submission-error-without-javascript*/}

Отображение сообщения об ошибке отправки формы до загрузки JavaScript-пакета для прогрессивного улучшения требует:

1. `<form>` должен быть отрисован [серверным компонентом](/reference/rsc/use-client).
1. Функция, переданная в пропс `action` `<form>`, должна быть [серверной функцией](/reference/rsc/server-functions).
1. Хук `useActionState` должен использоваться для отображения сообщения об ошибке.

`useActionState` принимает два параметра: [серверную функцию](/reference/rsc/server-functions) и начальное состояние. `useActionState` возвращает два значения: переменную состояния и действие. Действие, возвращаемое `useActionState`, должно быть передано в пропс `action` формы. Переменная состояния, возвращаемая `useActionState`, может использоваться для отображения сообщения об ошибке. Значение, возвращаемое серверной функцией, переданной в `useActionState`, будет использоваться для обновления переменной состояния.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

</Sandpack>

Узнайте больше об обновлении состояния из действия формы в документации [`useActionState`](/reference/react/useActionState).

### Обработка нескольких типов отправки {/*handling-multiple-submission-types*/}

Формы могут быть разработаны для обработки нескольких действий отправки в зависимости от нажатой пользователем кнопки. Каждая кнопка внутри формы может быть связана с отдельным действием или поведением путем установки пропса `formAction`.

Когда пользователь нажимает определенную кнопку, форма отправляется, и выполняется соответствующее действие, определяемое атрибутами и действием этой кнопки. Например, форма может отправлять статью на рассмотрение по умолчанию, но иметь отдельную кнопку с `formAction`, установленным на сохранение статьи в черновик.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

</Sandpack>