---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, часто используемый с помощью синтаксиса `<>...</>`, позволяет группировать элементы без оборачивания в дополнительный тег.

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

Оберните элементы в `<Fragment>`, чтобы сгруппировать их вместе в тех случаях, когда вам необходим единственный элемент. Группировка элементов с помощью `Fragment` не влияет на конечный DOM; он остается таким же, как если бы элементы не были сгруппированы. Пустой JSX-тег `<></>` в большинстве случаев является сокращением для `<Fragment></Fragment>`.

#### Пропсы {/*props*/}

- **необязательный** `key`: Фрагменты объявленные с помощью явного синтаксиса `<Fragment>` могут иметь [ключи.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Предостережения {/*caveats*/}

- Если вам необходимо передать `key` фрагменту, вы не можете использовать краткий синтаксис `<>...</>`. Вы должны явно импортировать `Fragment` из `'react'` и рендерить `<Fragment key={yourKey}>...</Fragment>`.

- React не [сбрасывает состояние](/learn/preserving-and-resetting-state) когда вы переключаетесь между рендерингом `<><Child /></>` к `[<Child />]` или обратно, или между `<><Child /></>` и `<Child />`. Однако, это работает только на одном уровне вложенности. Например, когда вы переключаетесь от `<><><Child /></></>` к `<Child />`, то состояние будет сброшено. Точную семантику можно посмотреть [здесь.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

---

## Применение {/*usage*/}

### Возвращение нескольких элементов {/*returning-multiple-elements*/}

Используйте `Fragment` или аналогичный синтаксис `<>...</>`, чтобы сгруппировать несколько элементов. Вы можете использовать его для размещения нескольких элементов в любом месте, где может находиться один элемент. Например, компонент может возвращать только один элемент, но используя `Fragment`, вы можете сгруппировать несколько элементов вместе и затем вернуть их как группу:

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

Фрагменты полезны тем, что группировка элементов с их помощью не влияет на отображение элементов на странице или стили, в отличие от случая, когда вы оборачиваете элементы в другой контейнер, например, в DOM-элемент. Если вы проверите этот пример с помощью инструментов браузера, то увидите, что все DOM-узлы `<h1>` и `<p>` отображаются как соседи без оберток вокруг них:

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

Рассмотрим ситуацию, когда вам нужно явно написать `Fragment`, вместо использования синтаксиса `<></>`. Это может понадобиться, когда вы [рендерите несколько элементов в цикле](/learn/rendering-lists) и каждому элементу нужно присвоить `key`. Если элементы в цикле являются фрагментами, то вам необходимо использовать стандартный синтаксис JSX-элементов, чтобы предоставить атрибут `key`:

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

Вы можете проверить DOM, чтобы убедиться, что вокруг дочерних элементов фрагмента нет оберток:

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
