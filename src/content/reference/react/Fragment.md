---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, или `<>...</>`, позволяет группировать элементы без тега-обертки.

<Canary>Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements.</Canary>

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
- <CanaryBadge /> **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.
>>>>>>> c7d6b700038c63d1aaf2c649af1aefe01ebbacac

#### Предостережения {/*caveats*/}

<<<<<<< HEAD
- Если вы хотите передать `key` фрагменту, то воспользоваться краткой формой `<>...</>` не выйдет. Вы должны явно импортировать `Fragment` из `'react'` и рендерить `<Fragment key={yourKey}>...</Fragment>`.

- React не [сбрасывает состояние](/learn/preserving-and-resetting-state) при переходе от рендеринга `<><Child /></>` к `[<Child />]` или обратно, или при переходе от `<><Child /></>` к `<Child />` или обратно. Это работает только на одном уровне вложенности: например, переход от `<><><Child /></></>` к `<Child />` сбрасывает состояние. Точную семантику можно посмотреть [здесь.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)
=======
* If you want to pass `key` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment key={yourKey}>...</Fragment>`.

* React does not [reset state](/learn/preserving-and-resetting-state) when you go from rendering `<><Child /></>` to `[<Child />]` or back, or when you go from rendering `<><Child /></>` to `<Child />` and back. This only works a single level deep: for example, going from `<><><Child /></></>` to `<Child />` resets the state. See the precise semantics [here.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

* <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

---

### <CanaryBadge /> `FragmentInstance` {/*fragmentinstance*/}

When you pass a `ref` to a Fragment, React provides a `FragmentInstance` object. It implements methods for interacting with the first-level DOM children wrapped by the Fragment.

* [`addEventListener`](#addeventlistener) and [`removeEventListener`](#removeeventlistener) manage event listeners across all first-level DOM children.
* [`dispatchEvent`](#dispatchevent) dispatches an event on the Fragment, which can bubble to the DOM parent.
* [`focus`](#focus), [`focusLast`](#focuslast), and [`blur`](#blur) manage focus across all nested children depth-first.
* [`observeUsing`](#observeusing) and [`unobserveUsing`](#unobserveusing) attach and detach `IntersectionObserver` or `ResizeObserver` instances.
* [`getClientRects`](#getclientrects) returns bounding rectangles of all first-level DOM children.
* [`getRootNode`](#getrootnode) returns the root node of the Fragment's parent.
* [`compareDocumentPosition`](#comparedocumentposition) compares the Fragment's position with another node.
* [`scrollIntoView`](#scrollintoview) scrolls the Fragment's children into view.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Adds an event listener to all first-level DOM children of the Fragment.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### Parameters {/*addeventlistener-parameters*/}

* `type`: A string representing the event type to listen for (e.g. `'click'`, `'focus'`).
* `listener`: The event handler function.
* **optional** `options`: An options object or boolean for capture, matching the [DOM `addEventListener` API.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

##### Returns {/*addeventlistener-returns*/}

`addEventListener` does not return anything (`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Removes an event listener from all first-level DOM children of the Fragment.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### Parameters {/*removeeventlistener-parameters*/}

* `type`: The event type string.
* `listener`: The event handler function to remove.
* **optional** `options`: An options object or boolean, matching the [DOM `removeEventListener` API.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

##### Returns {/*removeeventlistener-returns*/}

`removeEventListener` does not return anything (`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Dispatches an event on the Fragment. Added event listeners are called, and the event can bubble to the Fragment's DOM parent.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### Parameters {/*dispatchevent-parameters*/}

* `event`: An [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) object to dispatch. If `bubbles` is `true`, the event bubbles to the Fragment's parent DOM node.

##### Returns {/*dispatchevent-returns*/}

`true` if the event was not cancelled, `false` if `preventDefault()` was called.

---

#### `focus(options?)` {/*focus*/}

Focuses the first focusable DOM node in the Fragment. Unlike calling `element.focus()` on a DOM element, this method searches *all* nested children depth-first until it finds a focusable element—not just the element itself or its direct children.

```js
fragmentRef.current.focus();
```

##### Parameters {/*focus-parameters*/}

* **optional** `options`: A [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object (e.g. `{ preventScroll: true }`).

##### Returns {/*focus-returns*/}

`focus` does not return anything (`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Focuses the last focusable DOM node in the Fragment. Searches nested children depth-first, then iterates in reverse.

```js
fragmentRef.current.focusLast();
```

##### Parameters {/*focuslast-parameters*/}

* **optional** `options`: A [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object.

##### Returns {/*focuslast-returns*/}

`focusLast` does not return anything (`undefined`).

---

#### `blur()` {/*blur*/}

Removes focus from the active element if it is within the Fragment. If `document.activeElement` is not within the Fragment, `blur` does nothing.

```js
fragmentRef.current.blur();
```

##### Returns {/*blur-returns*/}

`blur` does not return anything (`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

Starts observing all first-level DOM children of the Fragment with the provided observer.

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### Parameters {/*observeusing-parameters*/}

* `observer`: An [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) or [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) instance.

##### Returns {/*observeusing-returns*/}

`observeUsing` does not return anything (`undefined`).

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

Stops observing the Fragment's DOM children with the specified observer.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### Parameters {/*unobserveusing-parameters*/}

* `observer`: The same `IntersectionObserver` or `ResizeObserver` instance previously passed to [`observeUsing`](#observeusing).

##### Returns {/*unobserveusing-returns*/}

`unobserveUsing` does not return anything (`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

Returns a flat array of [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) objects representing the bounding rectangles of all first-level DOM children.

```js
const rects = fragmentRef.current.getClientRects();
```

##### Returns {/*getclientrects-returns*/}

An `Array<DOMRect>` containing the bounding rectangles of all children.

---

#### `getRootNode(options?)` {/*getrootnode*/}

Returns the root node containing the Fragment's parent DOM node, matching the behavior of [`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode).

```js
const root = fragmentRef.current.getRootNode();
```

##### Parameters {/*getrootnode-parameters*/}

* **optional** `options`: An object with a `composed` boolean property, matching the [DOM `getRootNode` API.](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options)

##### Returns {/*getrootnode-returns*/}

A `Document`, `ShadowRoot`, or the `FragmentInstance` itself if there is no parent DOM node.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

Compares the document position of the Fragment with another node, returning a bitmask matching the behavior of [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition).

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### Parameters {/*comparedocumentposition-parameters*/}

* `otherNode`: The DOM node to compare against.

##### Returns {/*comparedocumentposition-returns*/}

A bitmask of [position flags](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value). Empty Fragments and Fragments with children rendered through a [portal](/reference/react-dom/createPortal) include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` in the result.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Scrolls the Fragment's children into view. When `alignToTop` is `true` or omitted, scrolls to align the first child with the top of the scrollable ancestor. When `alignToTop` is `false`, scrolls to align the last child with the bottom.

```js
fragmentRef.current.scrollIntoView();
```

##### Parameters {/*scrollintoview-parameters*/}

* **optional** `alignToTop`: A boolean. If `true` (the default), scrolls the first child to the top of the scrollable area. If `false`, scrolls the last child to the bottom. Unlike [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), this method does not accept a `ScrollIntoViewOptions` object.

##### Returns {/*scrollintoview-returns*/}

`scrollIntoView` does not return anything (`undefined`).

##### Caveats {/*scrollintoview-caveats*/}

* `scrollIntoView` does not accept an options object. Passing one throws an error. Use the `alignToTop` boolean instead.
* When the Fragment has no children, `scrollIntoView` scrolls the nearest sibling or parent into view as a fallback.

---

#### `FragmentInstance` Caveats {/*fragmentinstance-caveats*/}

* Methods that target children (such as `addEventListener`, `observeUsing`, and `getClientRects`) operate on *first-level host (DOM) children* of the Fragment. They do not directly target children nested inside another DOM element.
* `focus` and `focusLast` search nested children depth-first for focusable elements, unlike event and observer methods which only target first-level host children.
* `observeUsing` does not work on text nodes. React logs a warning in development if the Fragment contains only text children.
* React does not apply event listeners added via `addEventListener` to hidden [`<Activity>`](/reference/react/Activity) trees. When an `Activity` boundary switches from hidden to visible, listeners are applied automatically.
* Each first-level DOM child of a Fragment with a `ref` gets a `reactFragments` property—a `Set<FragmentInstance>` containing all Fragment instances that own the element. This enables [caching a shared observer](#caching-global-intersection-observer) across multiple Fragments.
>>>>>>> c7d6b700038c63d1aaf2c649af1aefe01ebbacac

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

### <CanaryBadge /> Adding event listeners without a wrapper element {/*adding-event-listeners-without-wrapper*/}

Fragment `ref`s let you add event listeners to a group of elements without adding a wrapper DOM node. Use a [ref callback](/reference/react-dom/components/common#ref-callback) to attach and clean up listeners:

<Sandpack>

```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Total clicks: {clicks}</p>
      <ClickableFragment onClick={() => {
        setClicks(c => c + 1);
      }}>
        <button>Button A</button>
        <button>Button B</button>
        <button>Button C</button>
      </ClickableFragment>
    </>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

The `addEventListener` call applies the listener to every first-level DOM child of the Fragment. When children are dynamically added or removed, the `FragmentInstance` automatically adds or removes the listener.

<DeepDive>

#### Which children does a Fragment ref target? {/*which-children-does-a-fragment-ref-target*/}

A `FragmentInstance` targets the **first-level host (DOM) children** of the Fragment. Consider this tree:

```js
<Fragment ref={ref}>
  <div id="A" />
  <Wrapper>
    <div id="B">
      <div id="C" />
    </div>
  </Wrapper>
  <div id="D" />
</Fragment>
```

`Wrapper` is a React component, so the `FragmentInstance` looks through it to find DOM nodes. The targeted children are `A`, `B`, and `D`. `C` is not targeted because it is nested inside the DOM element `B`.

Methods like `addEventListener`, `observeUsing`, and `getClientRects` operate on these first-level DOM children. `focus` and `focusLast` are different—they search *all* nested children depth-first to find focusable elements.

</DeepDive>

---

### <CanaryBadge /> Managing focus across a group of elements {/*managing-focus-across-elements*/}

Fragment `ref`s provide `focus`, `focusLast`, and `blur` methods that operate across all DOM nodes within the Fragment:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.focus();
        }}>
          Focus first
        </button>
        <button onClick={() => {
          fragmentRef.current.focusLast();
        }}>
          Focus last
        </button>
        <button onClick={() => {
          fragmentRef.current.blur();
        }}>
          Blur
        </button>
      </div>
      <Fragment ref={fragmentRef}>
        {children}
      </Fragment>
    </>
  );
}

// Even though the inputs are deeply nested,
// focus() searches depth-first to find them.
export default function App() {
  return (
    <FormFields>
      <fieldset>
        <legend>Shipping</legend>
        <label>
          Street: <input name="street" />
        </label>
        <label>
          City: <input name="city" />
        </label>
      </fieldset>
    </FormFields>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Calling `focus()` focuses the `street` input—even though it is nested inside a `<fieldset>` and `<label>`. `focus()` searches depth-first through all nested children, not just direct children of the Fragment. `focusLast()` does the same in reverse, and `blur()` removes focus if the currently focused element is within the Fragment.

---

### <CanaryBadge /> Scrolling a group of elements into view {/*scrolling-group-into-view*/}

Use `scrollIntoView` to scroll a Fragment's children into view without a wrapper element. Pass `true` (or omit the argument) to scroll the first child to the top. Pass `false` to scroll the last child to the bottom:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top
        </button>
        <button onClick={() => {
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom
        </button>
      </div>
      <div className="container">
        <Fragment ref={fragmentRef}>
          {children}
        </Fragment>
      </div>
    </>
  );
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (
    <ScrollableSection>
      <h3>Section Start</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <h3>Section End</h3>
    </ScrollableSection>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding to handle offset of global sticky nav when scrolling for example */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Observing visibility without a wrapper element {/*observing-visibility-without-wrapper*/}

Use `observeUsing` to attach an `IntersectionObserver` to all first-level DOM children of a Fragment. This lets you track visibility without requiring child components to expose `ref`s or adding a wrapper element:

<Sandpack>

```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>
      <VisibleGroup onVisibilityChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </VisibleGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js hidden
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Caching a global IntersectionObserver {/*caching-global-intersection-observer*/}

A common performance optimization for sites with many observers is to share a single IntersectionObserver per config and route its entries to the correct callbacks based on which element intersected. Fragment `ref`s support this same pattern through the `reactFragments` property.

Each first-level DOM child of a Fragment with a `ref` has a `reactFragments` property: a `Set` of `FragmentInstance` objects that contain that element. When the shared observer fires, you can use this property to look up which `FragmentInstance` owns the intersecting element and run the right callbacks.

<Sandpack>

```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (
    <div className="page" style={{
      background: bgColor || 'white',
    }}>
      <div className="filler">Scroll down</div>
      <ObservedGroup onIntersection={onGreen}>
        <Card title="Green section" className="green" />
      </ObservedGroup>
      <div className="filler" />
      <ObservedGroup onIntersection={onBlue}>
        <Card title="Blue section" className="blue" />
      </ObservedGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Register this callback for the
  // fragment instance.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Look up which FragmentInstances own
        // this element.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js hidden
export default function Card({ title, className }) {
  return <div className={'card' + (className ? ' ' + className : '')}>{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Multiple `ObservedGroup` components with the same options reuse a single `IntersectionObserver`. When either section scrolls into view, the shared observer fires and uses `reactFragments` to route the entry to the correct callback.
