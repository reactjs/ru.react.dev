---
title: useActionState
---

<Intro>

`useActionState` — это хук, который позволяет обновлять состояние на основе результата действия формы.

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

В ранних версиях React Canary этот API был частью React DOM и назывался `useFormState`.

</Note>


<InlineToc />

---

## Справочник {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

Вызовите `useActionState` на верхнем уровне вашего компонента, чтобы создать состояние компонента, которое обновляется [при вызове действия формы](/reference/react-dom/components/form). Вы передаёте `useActionState` существующую функцию действия формы, а также начальное состояние, и он возвращает новое действие, которое вы используете в своей форме, вместе с последним состоянием формы и индикатором того, выполняется ли действие в данный момент. Последнее состояние формы также передается в функцию, которую вы предоставили.

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

Состояние формы — это значение, возвращаемое действием при последней отправке формы. Если форма еще не была отправлена, это начальное состояние, которое вы передали.

При использовании с серверной функцией `useActionState` позволяет отображать ответ сервера после отправки формы еще до завершения гидратации.

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `fn`: Функция, которая будет вызвана при отправке формы или нажатии кнопки. Когда функция будет вызвана, она получит предыдущее состояние формы (изначально `initialState`, которое вы передали, впоследствии — его предыдущее возвращаемое значение) в качестве первого аргумента, за которым следуют аргументы, которые обычно получает действие формы.
* `initialState`: Значение, которое вы хотите установить для состояния изначально. Это может быть любое сериализуемое значение. Этот аргумент игнорируется после первого вызова действия.
* **необязательный** `permalink`: Строка, содержащая уникальный URL страницы, которую изменяет эта форма. Используется на страницах с динамическим контентом (например, лентами) в сочетании с прогрессивным улучшением: если `fn` является [серверной функцией](/reference/rsc/server-functions), и форма отправляется до загрузки JavaScript-пакета, браузер перейдет по указанному URL `permalink` вместо URL текущей страницы. Убедитесь, что тот же компонент формы отображается на целевой странице (включая то же действие `fn` и `permalink`), чтобы React знал, как передать состояние. Как только форма будет гидратирована, этот параметр не будет иметь никакого эффекта.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Возвращает {/*returns*/}

`useActionState` возвращает массив со следующими значениями:

1. Текущее состояние. Во время первого рендера оно будет соответствовать переданному вами `initialState`. После вызова действия оно будет соответствовать значению, возвращенному действием.
2. Новое действие, которое вы можете передать в качестве `action` для вашего компонента `form` или `formAction` для любого компонента `button` внутри формы. Действие также можно вызвать вручную в [`startTransition`](/reference/react/startTransition).
3. Флаг `isPending`, который указывает, есть ли ожидающий переход.

#### Ограничения {/*caveats*/}

* При использовании с фреймворком, поддерживающим React Server Components, `useActionState` позволяет сделать формы интерактивными до выполнения JavaScript на клиенте. При использовании без Server Components он эквивалентен локальному состоянию компонента.
* Функция, переданная в `useActionState`, получает дополнительный аргумент — предыдущее или начальное состояние — в качестве первого аргумента. Это делает ее сигнатуру отличной от той, если бы она использовалась напрямую как действие формы без использования `useActionState`.

---

## Использование {/*usage*/}

### Использование информации, возвращаемой действием формы {/*using-information-returned-by-a-form-action*/}

Вызовите `useActionState` на верхнем уровне вашего компонента, чтобы получить доступ к возвращаемому значению действия с момента последней отправки формы.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState` возвращает массив со следующими элементами:

1. <CodeStep step={1}>Текущее состояние</CodeStep> формы, которое изначально устанавливается в <CodeStep step={4}>начальное состояние</CodeStep>, которое вы предоставили, а после отправки формы устанавливается в возвращаемое значение <CodeStep step={3}>действия</CodeStep>, которое вы предоставили.
2. <CodeStep step={2}>Новое действие</CodeStep>, которое вы передаете в `<form>` как его свойство `action` или вызываете вручную в `startTransition`.
3. <CodeStep step={1}>Флаг ожидания</CodeStep> (`isPending`), который вы можете использовать, пока ваше действие обрабатывается.

Когда форма отправляется, будет вызвана <CodeStep step={3}>функция действия</CodeStep>, которую вы предоставили. Ее возвращаемое значение станет новым <CodeStep step={1}>текущим состоянием</CodeStep> формы.

<CodeStep step={3}>Действие</CodeStep>, которое вы предоставляете, также получит новый первый аргумент, а именно <CodeStep step={1}>текущее состояние</CodeStep> формы. При первой отправке формы это будет <CodeStep step={4}>начальное состояние</CodeStep>, которое вы предоставили, а при последующих отправках — возвращаемое значение из последнего вызова действия. Остальные аргументы такие же, как если бы `useActionState` не использовался.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Отображение информации после отправки формы" titleId="display-information-after-submitting-a-form">

#### Отображение ошибок формы {/*display-form-errors*/}

Чтобы отображать сообщения, такие как сообщение об ошибке или уведомление, возвращаемое серверной функцией, оберните действие в вызов `useActionState`.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

#### Отображение структурированной информации после отправки формы {/*display-structured-information-after-submitting-a-form*/}

Возвращаемое значение серверной функции может быть любым сериализуемым значением. Например, это может быть объект, включающий булево значение, указывающее на успешность действия, сообщение об ошибке или обновленную информацию.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

</Recipes>

## Устранение неполадок {/*troubleshooting*/}

### Мое действие больше не может читать отправленные данные формы {/*my-action-can-no-longer-read-the-submitted-form-data*/}

Когда вы оборачиваете действие с помощью `useActionState`, оно получает дополнительный аргумент *в качестве первого аргумента*. Поэтому отправленные данные формы становятся его *вторым* аргументом вместо первого, как это обычно бывает. Новый первый аргумент, который добавляется, — это текущее состояние формы.

```js
function action(currentState, formData) {
  // ...
}
```