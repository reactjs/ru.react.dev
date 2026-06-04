---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` — это хук React, который позволяет вам настроить обработчик, предоставляемый как [реф.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Вызовите `useImperativeHandle` на верхнем уровне вашего компонента, чтобы настроить обработчик рефа, который он предоставляет:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... ваши методы ...
    };
  }, []);
  // ...
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `ref`: `ref`, который вы получили как пропс компонента `MyInput`.

* `createHandle`: Функция, которая не принимает аргументов и возвращает обработчик рефа, который вы хотите предоставить. Этот обработчик рефа может иметь любой тип. Обычно вы будете возвращать объект с методами, которые хотите предоставить.

* **необязательный** `dependencies`: Список всех реактивных значений, на которые ссылается код `createHandle`. Реактивные значения включают пропсы, состояние и все переменные и функции, объявленные непосредственно внутри тела вашего компонента. Если ваш линтер [настроен для React](/learn/editor-setup#linting), он проверит, что каждое реактивное значение правильно указано как зависимость. Список зависимостей должен иметь постоянное количество элементов и быть написан в строке, например `[dep1, dep2, dep3]`. React будет сравнивать каждую зависимость с её предыдущим значением с помощью [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) сравнения. Если повторный рендер привел к изменению какой-либо зависимости, или если вы опустили этот аргумент, ваша функция `createHandle` будет выполнена повторно, и новый обработчик будет назначен рефу.

<Note>

Начиная с React 19, [`ref` доступен как пропс.](/blog/2024/12/05/react-19#ref-as-a-prop) В React 18 и более ранних версиях было необходимо получить `ref` из [`forwardRef`.](/reference/react/forwardRef)

</Note>

#### Возвращает {/*returns*/}

`useImperativeHandle` возвращает `undefined`.

---

## Использование {/*usage*/}

### Предоставление пользовательского обработчика рефа родительскому компоненту {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

Чтобы предоставить DOM-узел родительскому элементу, передайте пропс `ref` этому узлу.

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

С помощью кода выше, [реф к `MyInput` получит DOM-узел `<input>`.](/learn/manipulating-the-dom-with-refs) Однако вы можете предоставить вместо него пользовательское значение. Чтобы настроить предоставляемый обработчик, вызовите `useImperativeHandle` на верхнем уровне вашего компонента:

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... ваши методы ...
    };
  }, []);

  return <input />;
};
```

Обратите внимание, что в коде выше `ref` больше не передается в `<input>`.

Например, предположим, вы не хотите предоставлять весь DOM-узел `<input>`, но хотите предоставить два его метода: `focus` и `scrollIntoView`. Для этого сохраните реальный DOM браузера в отдельном рефе. Затем используйте `useImperativeHandle`, чтобы предоставить обработчик только с теми методами, которые вы хотите, чтобы родительский компонент мог вызывать:

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input ref={inputRef} />;
};
```

Теперь, если родительский компонент получит реф к `MyInput`, он сможет вызывать методы `focus` и `scrollIntoView` на нем. Однако он не будет иметь полного доступа к нижележащему DOM-узлу `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Это не сработает, потому что DOM-узел не предоставлен:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Предоставление собственных императивных методов {/*exposing-your-own-imperative-methods*/}

Методы, которые вы предоставляете через императивный обработчик, не обязательно должны точно совпадать с методами DOM. Например, этот компонент `Post` предоставляет метод `scrollAndFocusAddComment` через императивный обработчик. Это позволяет родительскому компоненту `Page` прокрутить список комментариев *и* сфокусироваться на поле ввода при нажатии кнопки:

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Не злоупотребляйте рефами.** Используйте рефы только для *императивных* действий, которые вы не можете выразить через пропсы: например, прокрутка к узлу, фокусировка на узле, запуск анимации, выделение текста и т. д.

**Если вы можете выразить что-то через пропс, вы не должны использовать реф.** Например, вместо предоставления императивного обработчика вроде `{ open, close }` из компонента `Modal`, лучше принять `isOpen` как пропс, например `<Modal isOpen={isOpen} />`. [Эффекты](/learn/synchronizing-with-effects) могут помочь вам предоставить императивное поведение через пропсы.

</Pitfall>