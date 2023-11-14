---
title: useId
---

<Intro>

Хук `useId` позволяет создавать уникальные идентификаторы, которые затем можно использовать, например, в атрибутах доступности.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useId()` {/*useid*/}

Чтобы создать уникальный идентификатор, вызовите `useId` на верхнем уровне своего компонента:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[См. другие примеры ниже.](#usage)

#### Параметры {/*parameters*/}

`useId` не принимает параметров.

#### Возвращаемое значение {/*returns*/}

`useId` возвращает уникальный идентификатор, привязанный к данному конкретному вызову `useId` в данном конкретном компоненте.

#### Замечания {/*caveats*/}

* `useId` -- это хук, поэтому его нужно вызывать только **на верхнем уровне вашего компонента** или хука. Его нельзя вызывать внутри циклов и условий. Если это всё же для чего-то нужно, выделите этот вызов в отдельный компонент, который затем можно рендерить по условию или в цикле.

* `useId` **не должен использоваться для создания ключей** в списках. [Ключи должны выбираться на основе данных.](/learn/rendering-lists#where-to-get-your-key)

---

## Применение {/*usage*/}

<Pitfall>

**Не используйте `useId` для создания ключей** в списках. [Ключи должны выбираться на основе данных.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Создание уникальных идентификаторов для атрибутов доступности {/*generating-unique-ids-for-accessibility-attributes*/}

Чтобы получить уникальный идентификатор, вызовите `useId` на верхнем уровне своего компонента:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

После чего вы можете указывать этот <CodeStep step={1}> сгенерированный идентификатор</CodeStep> в различных атрибутах:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Разберём на примере, когда это может быть полезно.**

[HTML-атрибуты доступности](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA), такие как [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby), позволяют обозначать смысловую связь между тегами. Например, можно указать, что некоторый элемент разметки (абзац) содержит краткое описание другого элемента (поля ввода).

В обычном HTML вы могли бы описать это так:

```html {5,8}
<label>
  Пароль:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  Пароль должен содержать не менее 18 символов
</p>
```

Однако в React подобным образом фиксировать идентификаторы в коде -- не лучшая практика. Один и тот же компонент может использоваться в нескольких разных местах -- но ведь в каждом случае идентификаторы должны быть уникальны! Поэтому вместо фиксированного идентификатора лучше сгенерировать уникальный с помощью `useId`:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Пароль:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Пароль должен содержать не менее 18 символов
      </p>
    </>
  );
}
```

В итоге, сгенерированные идентификаторы не будут конфликтовать, даже если использовать `PasswordField` на экране в нескольких местах.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Пароль:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Пароль должен содержать не менее 18 символов
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Выберите пароль</h2>
      <PasswordField />
      <h2>Подтвердите пароль</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Посмотрите видео-демонстрацию](https://www.youtube.com/watch?v=0dNzNcuEuOo) о том, как всё это влияет на опыт использования вспомогательных технологий.

<Pitfall>

При использовании вместе с [серверным рендерингом](/reference/react-dom/server) **`useId` требует, чтобы деревья компонентов на сервере и на клиенте получались идентичными**. Если отрендеренные на сервере и на клиенте деревья не совпадут, то сгенерироованные на сервере идентификаторы не совпадут со сгенерированными на клиенте.

</Pitfall>

<DeepDive>

#### Чем `useId` лучше обычного инкрементируемого счётчика? {/*why-is-useid-better-than-an-incrementing-counter*/}

Возможно, вы задаётесь вопросом, почему для получения нового идентификатора лучше использовать `useId`, а не увеличивать постоянно некий глобальный счётчик -- `nextId++`.

Главное преимущество `useId` в том, что React гарантирует его корректную работу с [серверным рендерингом](/reference/react-dom/server). В процессе серверного рендеринга ваши компоненты создают HTML, к которому затем на клиенте при [гидратации](/reference/react-dom/client/hydrateRoot) подключаются ваши обработчики событий. Чтобы гидратация сработала правильно, клиентский вывод должен совпасть с полученным от сервера HTML.

Однако крайне трудно быть уверенным, что они совпадут, если пользоваться обычным инкрементируемым счётчиком. Ведь порядок гидратации клиентских компонентов может не совпадать с порядком, в котором HTML составлялся на сервере. Используя же `useId`, вы гарантируете, что созданные идентификаторы на сервере и на клиенте будут совпадать, и гидратация выполнится правильно.

Внутри React `useId` вычисляется на основе "пути из цепочки родителей" того компонента, который вызывает `useId`. А если отрендеренные на сервере и на клиенте деревья компонентов совпадают, то и полный "путь из цепочки родителей" для каждого компонента будет совпадать, в каком бы порядке они не рендерились.

</DeepDive>

---

### Создание идентификаторов для нескольких элементов {/*generating-ids-for-several-related-elements*/}

Если вам нужны разные идентификаторы для нескольких элементов, и эти элементы как-то связаны по смыслу, то с помощью `useId` вы можете создать один общий для всех префикс:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>Имя:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Фамилия:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Так можно обойтись без лишних вызовов `useId` на каждый элемент, которому понадобился идентификатор.

---

### Задание общего префикса для всех идентификаторов вообще {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Если вы отображаете несколько независимых React-приложений на одной странице, то в вызовах [`createRoot`](/reference/react-dom/client/createRoot#parameters) и [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) вы можете указать опцию `identifierPrefix`. Поскольку все полученные из `useId` идентификаторы будут с префиксом, указанным в этой опции, то так можно гарантировать, что сгенерированные разными приложениями идентификаторы никогда не пересекутся.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Моё приложение</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Пароль:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Пароль должен содержать не менее 18 символов
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Выберите пароль</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>
