---
title: "<form>"
---

<Intro>

[Встроенный в браузер компонент `<form>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form) позволяет создавать интерактивные элементы управления для отправки информации.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Поиск</button>
</form>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<form>` {/*form*/}

Чтобы создать интерактивные элементы управления для отправки информации, отрендерите [встроенный в браузер компонент `<form>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Поиск</button>
</form>
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

`<form>` поддерживает все [общие пропсы HTML-элементов.](/reference/react-dom/components/common#props)

[`action`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form#action): URL или функция. Когда в проп `action` передаётся URL, форма ведёт себя как компонент HTML-формы. Когда в проп `action` передаётся функция, она отвечает за обработку отправки формы. Функция, переданная в `action`, может быть асинхронной и вызываться с одним аргументом, содержащим в себе [данные отправляемой формы](https://developer.mozilla.org/ru/docs/Web/API/FormData). Проп `action` может быть переопределён пропом `formAction` для компонента `<button>`, `<input type="submit">` или `<input type="image">`.

#### Предостережения {/*caveats*/}

* Когда в проп `action` или `formAction` передаётся функция, то HTTP-методом всегда будет POST независимо от значения в пропе `method`.

---

## Применение {/*usage*/}

### Обработка отправки формы на клиенте {/*handle-form-submission-on-the-client*/}

Чтобы обработать форму при отправке, передайте функцию в проп `action`. Объект [`formData`](https://developer.mozilla.org/ru/docs/Web/API/FormData) будет передан в функцию в качестве аргумента, чтобы получить доступ к данным, отправленным формой. Это отличается от стандартной работы [`action` в HTML](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form#action), который принимает только URL-адреса. После успешного выполнения переданной в `action` функции, все неуправляемые поля формы сбрасываются.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`Вы искали '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Поиск</button>
    </form>
  );
}
```

</Sandpack>

### Обработка отправки формы с использованием серверной функции {/*handle-form-submission-with-a-server-function*/}

Отрендерите `<form>` с полем ввода и кнопкой отправки. Для обработки формы при отправке передайте серверную функцию (функция, отмеченная как [`'use server'`](/reference/rsc/use-server)) в проп `action`.

Передача серверной функции в `<form action>` позволяет пользователям отправлять формы без включённого JavaScript или до момента, когда код будет загружен. Это полезно для пользователей с медленным соединением, устройством или отключённым JavaScript и схоже с тем, как работают формы при передаче URL в проп `action`.

Вы можете использовать скрытые поля формы для предоставления данных действию `<form>`. Серверная функция будет вызвана с данными из скрытых полей формы как экземпляр [`FormData`](https://developer.mozilla.org/ru/docs/Web/API/FormData).

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
        <button type="submit">Добавить в корзину</button>
    </form>

  );
}
```

Вместо того, чтобы использовать скрытые поля формы для предоставления данных действию `<form>`, можно вызвать метод <CodeStep step={1}>`bind`</CodeStep> с дополнительными аргументами. Это позволит привязать новый аргумент (<CodeStep step={2}>`productId`</CodeStep>) к функции в дополнение к объетку <CodeStep step={3}>`formData`</CodeStep>, который передаётся в эту функцию в качестве аргумента.

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
      <button type="submit">Добавить в корзину</button>
    </form>
  );
}
```

Когда [серверный компонент](/reference/rsc/use-client) рендерит `<form>`, а [серверная функция](/reference/rsc/server-functions) передана в проп `action` тега `<form>`, форма  [постепенно улучшается](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

### Отображение состояния ожидания при отправке формы {/*display-a-pending-state-during-form-submission*/}
Чтобы отобразить состояние ожидания во время отправления формы, вы можете вызвать хук `useFormStatus` в компоненте, который рендерится внутри тега `<form>`, и использовать возвращаемое свойство `pending`.

Здесь используется свойство `pending`, чтобы указать, что форма отправляется.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Отправка..." : "Отправить"}
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

Узнать подробнее о хуке `useFormStatus` можно в [справочной документации](/reference/react-dom/hooks/useFormStatus).

### Оптимистичное обновление данных формы {/*optimistically-updating-form-data*/}
Хук `useOptimistic` позволяет оптимистично обновлять пользовательский интерфейс до завершения фоновой операции, например, сетевого запроса. В контексте форм этот способ помогает делать приложения более отзывчивыми. Когда пользователь отправляет форму, вместо ожидания ответа от сервера для отображения изменений, интерфейс немедленно обновится до ожидаемого результата.

Например, когда пользователь вводит сообщение в форму и нажимает кнопку "Отправить", хук `useOptimistic` позволяет сообщению немедленно появиться в списке с меткой "Отправка...", ещё до того, как оно фактически будет отправлено на сервер. Такой "оптимистичный" подход создаёт впечатление скорости и отзывчивости. Затем форма пытается отправить сообщение в фоновом режиме. Как только сервер подтверждает, что сообщение получено, метка "Отправка..." удаляется.

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
          {!!message.sending && <small> (Отправка...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Привет!" />
        <button type="submit">Отправить</button>
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

### Обработка ошибок при отправке формы {/*handling-form-submission-errors*/}

В некоторых случаях функция, вызываемая пропом `action` тега `<form>`, выбрасывает ошибку. Эти ошибки можно обрабатывать, обернув `<form>` в предохранитель. Если функция, вызываемая пропом `action` тега `<form>`, выбрасывает ошибку, то будет отображён запасной вариант для предохранителя.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("ошибка поиска");
  }
  return (
    <ErrorBoundary
      fallback={<p>При отправке формы произошла ошибка</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Поиск</button>
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

### Обработка ошибок при отправке формы без JavaScript {/*display-a-form-submission-error-without-javascript*/}

Для отображения сообещния об ошибке при отправке формы до загрузки JavaScript-бандла и соблюдения прогрессивного улучшения необходимо следующее:

1. `<form>` должен рендерится [серверным компонентом](/reference/rsc/use-client)
1. функция, передаваемая в проп `action` тега `<form>`, должна быть [серверной функцией](/reference/rsc/server-functions)
1. для отображения сообщения об ошибке должен использоваться хук `useActionState`

`useActionState` принимает два параметра: [серверную функцию](/reference/rsc/server-functions) и начальное состояние. `useActionState` возвращает два значения — переменную состояния и действие. Действие, возвращаемое хуком `useActionState`, должно быть передано в проп `action` формы. Переменная состояния, возвращаемая `useActionState`, должна использоваться для отображения сообщения об ошибке. Значение, возвращаемое серверной функцией, переданной в `useActionState`, будет использоваться для обновления переменной состояния.

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
      alert(`Добавлен "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Подпишитесь на мою рассылку</h1>
      <p>Подпишитесь дважды, используя один и тот же адрес электронной почты, чтобы увидеть ошибку</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Подписаться</button>
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
    throw new Error("Этот адрес электронной почты уже добавлен");
  }
  emails.push(newEmail);
}
```

</Sandpack>

Узнать больше об обновлении состояния при помощи действия формы можно в документации [`useActionState`](/reference/react/useActionState)

### Обработка нескольких типов отправок {/*handling-multiple-submission-types*/}

Формы могут быть спроектированы так, чтобы они могли обрабатывать несколько действий в зависимости от того, какую кнопку нажал пользователь. Каждую кнопку внутри формы можно связать с отдельным действием или поведением, путём установки пропа `formAction`.

Когда пользователь нажимает на определённую кнопку, форма отправляется, и начинает выполняться соответствующее действие, которое определяется атрибутами и действием этой кнопки. Например, форма может по умолчанию отправлять статью на рецензирование, но иметь отдельную кнопку с `formAction`, которая будет сохранять статьи в качестве черновика.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' был опубликован по кнопке '${button}'`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Ваш черновик с '${content}' был сохранён!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Опубликовать</button>
      <button formAction={save}>Сохранить черновик</button>
    </form>
  );
}
```

</Sandpack>
