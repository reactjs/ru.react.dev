---
title: useOptimistic
canary: true
---

<Canary>

Хук `useOptimistic` сейчас доступен только в React Canary и экспериментальных каналах.  Узнать больше о релизаx React можно [здесь](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useOptimistic` это хук, который позволяет оптимистично обновлять UI.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` --это хук React, который позволяет показать другое состояние пока выполняется какое-то асинхронное действие. Он принимает состояние, которое может отличаться во время выполнения асинхронного действия, например таким действием может быть сетевой запрос. Вы передаёте функцию, которая принимает текущее состояние и входные параметры для какого-то действия, и возвращает  оптимистичное состояние, которое используется пока действие находится режиме ожидания.

Такое состояние называется "оптимистичным" состоянием, потому что обычно используется для того, чтобы показать результат выполнения действия как можно быстрее, даже если для завершения обычно требуется время.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // объединить и вернуть новое состояние
      // с оптимистичным значением
    }
  );
}
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `state`: значение, которое вернётся изначально, и во всех случаях, когда нет действий в состоянии ожидания.
* `updateFn(currentState, optimisticValue)`: функция, которая принимает текущее состояние и оптимистичное значение, переданное в `addOptimistic`, и возвращает результирующее оптимистичное состояние. Это должна быть чистая функция. `updateFn` принимает два параметра: `currentState` и `optimisticValue`. Возвращаемое значение будет результатом объединения `currentState` и  `optimisticValue`.


#### Возвращаемое значение {/*returns*/}

* `optimisticState`: Результат оптимистичного состояния. Оно равно `state` до тех пор, пока действие не находится в состоянии ожидания, иначе будет равно значению, возвращённому из `updateFn`.
* `addOptimistic`: `addOptimistic` --это функция-диспетчер, которая вызывается при оптимистичном обновлении. Она принимает только один аргумент `optimisticValue` любого типа и вызовет `updateFn` с параметрами `state` and `optimisticValue`.

---

## Использование {/*usage*/}

### Оптимистичное обновление форм {/*optimistically-updating-with-forms*/}

Хук `useOptimistic` предоставляет возможность для оптимистичного обновление пользовательского интерфейса перед завершением работы в фоновом режиме, например, сетевого запроса. В контексте форм, эта техника помогает сделать приложение более отзывчивым. Когда пользователь отправляет форму, вместо ожидания ответа от сервера для того, чтобы показать обновление, интерфейс обновится сразу же с учётом ожидаемого результата.

Например, когда пользователь вводит сообщение в форму и нажимает кнопку "Отправить", хук `useOptimistic` позволяет сообщению сразу отобразиться в списке с лейблом "Отправка...", ещё до того как сообщение фактически будет отправлено на сервер. Этот "оптимистичный" подход создаёт ощущение скорости и отзывчивости. Затем данные формы действительно отправляются на сервер в фоновом режиме. Как только приходит подтверждение сервера о том, что сообщение получено, лейбл "Отправка..." удаляется.

<Sandpack>


```js App.js
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
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Отправить</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Привет!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
