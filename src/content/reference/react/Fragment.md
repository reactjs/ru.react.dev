---
title: <Fragment> (<>...</>)
---

<Intro>

<<<<<<< HEAD
`<Fragment>`, или `<>...</>`, позволяет группировать элементы без тега-обертки.
=======
`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node. 

<Canary> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Canary>
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

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

<<<<<<< HEAD
- **необязательный** `key`: Фрагменты, объявленные с помощью явного синтаксиса `<Fragment>`, могут иметь [ключи.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge />  **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

When you pass a ref to a fragment, React provides a `FragmentInstance` object with methods for interacting with the DOM nodes wrapped by the fragment:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Adds an event listener to all first-level DOM children of the Fragment.
- `removeEventListener(type, listener, options?)`: Removes an event listener from all first-level DOM children of the Fragment.
- `dispatchEvent(event)`: Dispatches an event to a virtual child of the Fragment to call any added listeners and can bubble to the DOM parent.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Compares the document position of the Fragment with another node.
  - If the Fragment has children, the native `compareDocumentPosition` value is returned. 
  - Empty Fragments will attempt to compare positioning within the React tree and include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elements that have a different relationship in the React tree and DOM tree due to portaling or other insertions are `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Returns a flat array of `DOMRect` objects representing the bounding rectangles of all children.
- `getRootNode()`: Returns the root node containing the Fragment's parent DOM node.

**Focus management methods:**
- `focus(options?)`: Focuses the first focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `focusLast(options?)`: Focuses the last focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `blur()`: Removes focus if `document.activeElement` is within the Fragment.

**Observer methods:**
- `observeUsing(observer)`: Starts observing the Fragment's DOM children with an IntersectionObserver or ResizeObserver.
- `unobserveUsing(observer)`: Stops observing the Fragment's DOM children with the specified observer.
>>>>>>> f9e2c1396769bb5da87db60f9ff03683d18711e2

#### Предостережения {/*caveats*/}

- Если вы хотите передать `key` фрагменту, то воспользоваться краткой формой `<>...</>` не выйдет. Вы должны явно импортировать `Fragment` из `'react'` и рендерить `<Fragment key={yourKey}>...</Fragment>`.

- React не [сбрасывает состояние](/learn/preserving-and-resetting-state) при переходе от рендеринга `<><Child /></>` к `[<Child />]` или обратно, или при переходе от `<><Child /></>` к `<Child />` или обратно. Это работает только на одном уровне вложенности: например, переход от `<><><Child /></></>` к `<Child />` сбрасывает состояние. Точную семантику можно посмотреть [здесь.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

- <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

---

## Применение {/*usage*/}

### Возвращение нескольких элементов {/*returning-multiple-elements*/}

Используйте `Fragment` или `<>...</>`, чтобы сгруппировать несколько элементов. Вы можете применить его для размещения нескольких элементов в любом месте, где может находиться один элемент. Например, компонент может возвращать только один элемент, но с помощью `Fragment` можно сгруппировать несколько элементов вместе и затем вернуть их:

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

Фрагменты полезны тем, что группировка элементов с их помощью не влияет на макет или стили, в отличие от оборачивания элементов в другой контейнер, например, DOM-элемент. Изучив этот пример в браузере с помощью инструментов разработчика, вы увидите, что все DOM-узлы `<h1>` и `<article>` отображаются рядом и без обёрток:

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

#### Как написать фрагмент без специального синтаксиса? {/*how-to-write-a-fragment-without-the-special-syntax*/}

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

Вы можете использовать `Fragment` для группировки текста вместе с компонентами:

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

---

### <CanaryBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <CanaryBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
