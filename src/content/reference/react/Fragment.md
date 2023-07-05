---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, или `<>...</>`, позволяет группировать элементы без тега-обертки.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<Fragment>` {/*fragment*/}

Оберните элементы в `<Fragment>` для объединения их, когда вам нужен один элемент. Группировка элементов в `Fragment` не влияет на итоговый DOM; оно остаётся таким же, как если бы элементы не были сгруппированы. Пустой JSX-тег `<></>` обычно является сокращением для `<Fragment></Fragment>`.

#### Пропсы {/*props*/}

- **необязательный** `key`: Фрагменты, объявленные с помощью явного синтаксиса `<Fragment>`, могут иметь [ключи.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Предостережения {/*caveats*/}

- Если вы хотите передать `key` фрагменту, то воспользоваться краткой формой `<>...</>` не выйдет. Вы должны явно импортировать `Fragment` из `'react'` и рендерить `<Fragment key={yourKey}>...</Fragment>`.

- React не [сбрасывает состояние](/learn/preserving-and-resetting-state) при переходе от рендеринга `<><Child /></>` к `[<Child />]` или обратно, или при переходе от `<><Child /></>` к `<Child />` или обратно. Это работает только на одном уровне вложенности: например, переход от `<><><Child /></></>` к `<Child />` сбрасывает состояние. Точную семантику можно посмотреть [здесь.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

---

## Применение {/*usage*/}

### Возвращение нескольких элементов {/*returning-multiple-elements*/}

Используйте `Fragment` или `<>...</>`, чтобы сгруппировать несколько элементов. Вы можете применить его для размещения нескольких элементов в любом месте, где может находиться один элемент. Например, компонент может возвращать только один элемент, но используя `Fragment`, можно объеденить несколько элементов, а затем вернуть их:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Фрагменты полезны тем, что группировка элементов с их помощью не влияет на отображение элементов на странице или стили, в отличие от случая, когда вы используете в роли контейнера DOM-элемент. Изучив этот пример в браузере с помощью инструментов разработчика, вы увидите, что все DOM-узлы `<h1>` и `<article>` отображаются рядом и без оберток:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="Обновление" body="Давненько я не писал..." />
      <Post title="Мой новый блог" body="Я начинаю новый блог!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Как написать фрагмент без использования особого синтаксиса? {/*how-to-write-a-fragment-without-the-special-syntax*/}

Приведенный выше пример эквивалентен импорту `Fragment` из React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

В большинстве случаев это не нужно, за исключением ситуаций, когда необходимо [передать фрагменту `key`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Присвоение переменной нескольких элементов {/*assigning-multiple-elements-to-a-variable*/}

Как и любой другой элемент, вы можете присваивать элементы `Fragment` переменным, передавать их в качестве пропсов и так далее:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Вы уверены, что хотите покинуть эту страницу?
    </AlertDialog>
  );
}
```

---

### Группировка элементов с текстом {/*grouping-elements-with-text*/}

Вы можете использовать `Fragment` чтобы сгруппировать текст вместе с компонентами:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      С
      <DatePicker date={start} />
      до
      <DatePicker date={end} />
    </>
  );
}
```

---

### Рендеринг списка фрагментов {/*rendering-a-list-of-fragments*/}

Рассмотрим ситуацию, где вы должны использовать `Fragment`, а не его краткую форму `<></>`. Когда вы [рендерите несколько элементов в цикле](/learn/rendering-lists), то каждому из них нужно присвоить `key`. Если элементы цикла являются фрагментами, то вам необходимо использовать стандартный синтаксис JSX-элементов, чтобы это сделать:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Вы можете проверить DOM и убедиться, что дочерние элементы фрагмента ни во что не обернуты:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'Обновление', body: "Давненько я не писал..." },
  { id: 2, title: 'Мой новый блог', body: 'Я начинаю новый блог!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>
