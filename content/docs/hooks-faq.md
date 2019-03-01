---
id: hooks-faq
title: Хуки - вопросы и ответы
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Хуки* были добавлены в React 16.8. С их помощью вы можете использовать состояние и другие возможность React без необходимости использовать классы.

На этой странице вы найдёте ответы на некоторые популярные вопросы о [Хуках](/docs/hooks-overview.html).

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[Внедрение хуков](#adoption-strategy)**
  * [В какой версии React появились хуки?](#which-versions-of-react-include-hooks)
  * [Надо ли переписать все мои классовые компоненты?](#do-i-need-to-rewrite-all-my-class-components)
  * [Что я могу сделать с помощью Хуков, что не смог бы с помощью классов?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Какая часть моих знаний о React всё еще актуальна?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Что мне использовать: Хуки, классы или оба подхода?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Дают ли Хуки все возможности классов?](#do-hooks-cover-all-use-cases-for-classes)
  * [Являются ли Хуки заменой рендер-пропсам и компонентам высшего порядка?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Как Хуки повлияют на популярные API - например Redux `connect()` и React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Хуки поддерживают статическую типизацию?](#do-hooks-work-with-static-typing)
  * [Как тестировать компоненты, которые используют Хуки?](#how-to-test-components-that-use-hooks)
  * [Что конкретно правила линтера проверяют в Хуках?](#what-exactly-do-the-lint-rules-enforce)
* **[От классов к Хукам](#from-classes-to-hooks)**
  * [Как методы жизненного цикла соответствуют Хукам?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Is there something like instance variables?](#is-there-something-like-instance-variables)
  * [Should I use one or many state variables?](#should-i-use-one-or-many-state-variables)
  * [Can I run an effect only on updates?](#can-i-run-an-effect-only-on-updates)
  * [How to get the previous props or state?](#how-to-get-the-previous-props-or-state)
  * [How do I implement getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [Is there something like forceUpdate?](#is-there-something-like-forceupdate)
  * [Can I make a ref to a function component?](#can-i-make-a-ref-to-a-function-component)
  * [What does const [thing, setThing] = useState() mean?](#what-does-const-thing-setthing--usestate-mean)
* **[Performance Optimizations](#performance-optimizations)**
  * [Can I skip an effect on updates?](#can-i-skip-an-effect-on-updates)
  * [How do I implement shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [How to memoize calculations?](#how-to-memoize-calculations)
  * [How to create expensive objects lazily?](#how-to-create-expensive-objects-lazily)
  * [Are Hooks slow because of creating functions in render?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [How to avoid passing callbacks down?](#how-to-avoid-passing-callbacks-down)
  * [How to read an often-changing value from useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Under the Hood](#under-the-hood)**
  * [How does React associate Hook calls with components?](#how-does-react-associate-hook-calls-with-components)
  * [What is the prior art for Hooks?](#what-is-the-prior-art-for-hooks)

## Внедрение хуков {#adoption-strategy}

### В какой версии React появились хуки?{#which-versions-of-react-include-hooks}

Начиная с релиза 16.8.0, React включает в себя стабильную реализацию Хуков для:

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Обратите внимание, **чтобы Хуки стали доступны, все React-пакеты должны быть версии 16.8.0 или выше**. Хуки не будут работать, если вы, например, забудете обновить React DOM.

Поддержка Хуков в React Native добавится в следующем стабильном релизе.

### Надо ли переписать все мои классовые компоненты?{#do-i-need-to-rewrite-all-my-class-components}

No. There are [no plans](/docs/hooks-intro.html#gradual-adoption-strategy) to remove classes from React -- we all need to keep shipping products and can't afford rewrites. We recommend trying Hooks in new code.

Нет. [Планов по удалению классов из React нет](/docs/hooks-intro.html#gradual-adoption-strategy) -- нам всем необходимо добавлять новую функциональность, вместо переписывания всего приложения. Мы рекомендуем пробовать Хуки в новом коде.

### Что я могу сделать с помощью Хуков, что не смог бы с помощью классов? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Хуки дают отличный способ повторного использования кода между компонентами. ["Создание ваших Хуков"](/docs/hooks-custom.html) показывает, что вы сможете сделать. [Эта статья](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889), написанная одим из главных участников React-команды, описывает новые возможности, разблокированные релизом Хуков.

### Какая часть моих знаний о React всё еще актуальна? {#how-much-of-my-react-knowledge-stays-relevant}

Хуки -- это новый способ использование возможностей React, которые вы уже знаете, таких, как состояние, жизненный цикл, контекст и рефы. Хуки не изменили фундаментальную логику React, и ваши знания компонентов, пропсов и потока данных сверху-вниз остаются актуальными.

Однако, Хуки -- это не самая простая часть React. Если вам не хватает чего-то в этой документации, [дайте нам знать](https://github.com/reactjs/reactjs.org/issues/new), и мы постараемся вам помочь.

### Что мне использовать: Хуки, классы или оба подхода? {#should-i-use-hooks-classes-or-a-mix-of-both}

Когда вы будете готовы, мы бы очень хотели, чтобы вы начали использовать Хуки в ваших новых компонентах. Убедитесь, чтобы ваши коллеги ознакомились с документацией и поддержали вас. Мы не рекомендуем сразу перепесивать ваши существующие классы на Хуки, пока вы сами не запланируете переписать их (например, чтобы исправить баг).

Вы не можете использовать Хуки *внутри* классового компонента, но вы можете комбинировать классы и функциональные компоненты с Хуками в одном дереве. Классовый компонент или функциональный с Хуками - неважно, это всего-лишь особенности  реализации. В дальнейшем будущем, мы ожидаем, что Хуки статун главным способ написания React-компонентов.

### Дают ли Хуки все возможности классов? {#do-hooks-cover-all-use-cases-for-classes}

Наша задача для Хуков - это полное покрытие функционала классов чем раньше, тем лучше. Пока не существует Хуков, реализующих методы жизненного цикла  `getSnapshotBeforeUpdate` и `componentDidCatch`, но мы планируем скоро их добавить.

Хуки появились совсем недавно, и некоторые сторонние библиотеки могли еще не приспособиться к ним.

### Являются ли Хуки заменой рендер-пропсам и компонентам высшего порядка? {#do-hooks-replace-render-props-and-higher-order-components}

Often, render props and higher-order components render only a single child. We think Hooks are a simpler way to serve this use case. There is still a place for both patterns (for example, a virtual scroller component might have a `renderItem` prop, or a visual container component might have its own DOM structure). But in most cases, Hooks will be sufficient and can help reduce nesting in your tree.

Обычно, рендер пропсы и компоненты высшего порядка рендерят только один дочерний компонент. Мы думаем, что Хуки - более простой способ сделать это.
TODO
Но в большинстве случаев, Хуки должны помочь уменьшить вложенность компонентов в вашем дереве.

### Как Хуки повлияют на популярные API - например Redux `connect()` и React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}.

Вы можете продолжать использовать тот же API, который вы использовали до этого - всё продолжает работать.

В будущем, новые версии этих библиотек могут также экспортировать специальные Хуки, например `useRedux()` или  `useRouter()`, которые позволят вам использовать тот же функционал без необходимости обарачивать компоненты.

### Хуки поддерживают статическую типизацию? {#do-hooks-work-with-static-typing}

Хуки спроектированы с учётом статической типизации. Так как они являются функциями, их легче типизировать правильно чем, например, компоненты высшего порядка. Последние версии Flow и TypeScript включают в себя поддержку React-хуков.

Importantly, custom Hooks give you the power to constrain React API if you'd like to type them more strictly in some way. React gives you the primitives, but you can combine them in different ways than what we provide out of the box.

TODO

### Как тестировать компоненты, которые используют Хуки? {#how-to-test-components-that-use-hooks}

С точки зрения React, компонент, использующий Хуки, является обычным компонентом. Если ваш способ тестирования не опирается на внутреннюю часть React, тестирование компонентов с Хуками не должно отличатся от тестирования других компонентов.

Например, у нас есть этот компонент-счетчик:

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Вы нажали ${count} раз`;
  });
  return (
    <div>
      <p>Вы нажали {count} раз</p>
      <button onClick={() => setCount(count + 1)}>
        Нажми на меня
      </button>
    </div>
  );
}
```

Мы будем тестировать этот компонент с помощью React DOM. Чтобы убедиться, что поведение совпадает с тем, что случится в браузере, мы обернём код рендера и обновления в вызов [`ReactTestUtils.act()`](/docs/test-utils.html#act):

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Тестируем первый рендер и эффект
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Вы нажали 0 раз');
  expect(document.title).toBe('Вы нажали 0 раз');

  // Тестируем второй рендер и эффект
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Вы нажали 1 раз');
  expect(document.title).toBe('Вы нажали 1 раз');
});
```

Вызовы `act()` также запустят эффекты внутри.

Если вам надо протестировать созданный Хук, вы можете создать компонент в ваших тестах и использовать в нём этот Хук. После этого вы можете протестировать сам компонент.

Для уменьшения однотипного кода, мы советуем использовать библиотеку [`react-testing-library`](https://git.io/react-testing-library). Она была создана для написания тестов, использующих ваши компоненты, как это делают конечные пользователи.

### Что конкретно [правила линтера](https://www.npmjs.com/package/eslint-plugin-react-hooks) проверяют в Хуках?{#what-exactly-do-the-lint-rules-enforce}

Мы предоставляем [плагин к ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks), который принуждает следовать [правилам Хуков](/docs/hooks-rules.html), чтобы избежать ошибок. Подразумевается, что любая функция, имя который начинается с "`use`" и заглавной буквы далее, является Хуком. Мы понимаем, что это предположение не идеальное, и могут случится ложные срабатывания. Однако, без этого важного соглашения, было бы невозможно заставить Хуки работать хорошо, а более длинные имена могли бы помешать людям начать использовать Хуки или следовать соглашению.

В частности, правила проверяют, что:

* Вызовы Хуков происходят либо внутри функции с именем в `ВерблюжемРегистре` (подразумевается, что это класс), либо внутри другой `useSomething` функции (подразумевается, что это созданный пользователем Хук).
* Хуки вызываются в одном и том же порядке каждый раз.

Существует еще несколько предположений, которые могут измениться по мере того, как мы будем регулировать правила и искать баланс между нахождением ошибок и ложными срабатываниями.

## От классов к Хукам {#from-classes-to-hooks}

### [Как методы жизненного цикла соответствуют Хукам?] {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Функциональному компоненту не нужен конструктор.  Вы можете инициализировать состояние, используя вызов [`useState`](/docs/hooks-reference.html#usestate). Если вычисления состояния трудозатратны, вы можете передать функцию в `useState`.

* `getDerivedStateFromProps`: Schedule an update [while rendering](#how-do-i-implement-getderivedstatefromprops) instead.

* `getDerivedStateFromProps`: TODO

* `shouldComponentUpdate`: Смотрите `React.memo` [below](#how-do-i-implement-shouldcomponentupdate).

* `render`: Это тело функционального компонента.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: [`useEffect` Хук](/docs/hooks-reference.html#useeffect) заменяет все их комбинации (включая [более](#can-i-skip-an-effect-on-updates) [редкие](#can-i-run-an-effect-only-on-updates) случаи).

* `componentDidCatch` и `getDerivedStateFromError`: В данный момент не существует Хуков-аналогов для этих методов, но они будут скоро добавлены.

### Is there something like instance variables? {#is-there-something-like-instance-variables}

Yes! The [`useRef()`](/docs/hooks-reference.html#useref) Hook isn't just for DOM refs. The "ref" object is a generic container whose `current` property is mutable and can hold any value, similar to an instance property on a class.

You can write to it from inside `useEffect`:

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

If we just wanted to set an interval, we wouldn't need the ref (`id` could be local to the effect), but it's useful if we want to clear the interval from an event handler:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

Conceptually, you can think of refs as similar to instance variables in a class. Unless you're doing [lazy initialization](#how-to-create-expensive-objects-lazily), avoid setting refs during rendering -- this can lead to surprising behavior. Instead, typically you want to modify refs in event handlers and effects.

### Should I use one or many state variables? {#should-i-use-one-or-many-state-variables}

If you're coming from classes, you might be tempted to always call `useState()` once and put all state into a single object. You can do it if you'd like. Here is an example of a component that follows the mouse movement. We keep its position and size in the local state:

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Now let's say we want to write some logic that changes `left` and `top` when the user moves their mouse. Note how we have to merge these fields into the previous state object manually:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Spreading "...state" ensures we don't "lose" width and height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Note: this implementation is a bit simplified
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

This is because when we update a state variable, we *replace* its value. This is different from `this.setState` in a class, which *merges* the updated fields into the object.

If you miss automatic merging, you can write a custom `useLegacyState` Hook that merges object state updates. However, instead **we recommend to split state into multiple state variables based on which values tend to change together.**

For example, we could split our component state into `position` and `size` objects, and always replace the `position` with no need for merging:

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

Separating independent state variables also has another benefit. It makes it easy to later extract some related logic into a custom Hook, for example:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

Note how we were able to move the `useState` call for the `position` state variable and the related effect into a custom Hook without changing their code. If all state was in a single object, extracting it would be more difficult.

Both putting all state in a single `useState` call, and having a `useState` call per each field can work. Components tend to be most readable when you find a balance between these two extremes, and group related state into a few independent state variables. If the state logic becomes complex, we recommend [managing it with a reducer](/docs/hooks-reference.html#usereducer) or a custom Hook.

### Can I run an effect only on updates? {#can-i-run-an-effect-only-on-updates}

This is a rare use case. If you need it, you can [use a mutable ref](#is-there-something-like-instance-variables) to manually store a boolean value corresponding to whether you are on the first or a subsequent render, then check that flag in your effect. (If you find yourself doing this often, you could create a custom Hook for it.)

### How to get the previous props or state? {#how-to-get-the-previous-props-or-state}

Currently, you can do it manually [with a ref](#is-there-something-like-instance-variables):

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

This might be a bit convoluted but you can extract it into a custom Hook:

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Note how this would work for props, state, or any other calculated value.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

It's possible that in the future React will provide a `usePrevious` Hook out of the box since it's a relatively common use case.

See also [the recommended pattern for derived state](#how-do-i-implement-getderivedstatefromprops).

### How do I implement `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

While you probably [don't need it](/blog/2018/06/07/you-probably-dont-need-derived-state.html), in rare cases that you do (such as implementing a `<Transition>` component), you can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn't be expensive.

Here, we store the previous value of the `row` prop in a state variable so that we can compare:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

This might look strange at first, but an update during rendering is exactly what `getDerivedStateFromProps` has always been like conceptually.

### Is there something like forceUpdate? {#is-there-something-like-forceupdate}

Both `useState` and `useReducer` Hooks [bail out of updates](/docs/hooks-reference.html#bailing-out-of-a-state-update) if the next value is the same as the previous one. Mutating state in place and calling `setState` will not cause a re-render.

Normally, you shouldn't mutate local state in React. However, as an escape hatch, you can use an incrementing counter to force a re-render even if the state has not changed:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Try to avoid this pattern if possible.

### Can I make a ref to a function component? {#can-i-make-a-ref-to-a-function-component}

While you shouldn't need this often, you may expose some imperative methods to a parent component with the [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) Hook.

### What does `const [thing, setThing] = useState()` mean? {#what-does-const-thing-setthing--usestate-mean}

If you're not familiar with this syntax, check out the [explanation](/docs/hooks-state.html#tip-what-do-square-brackets-mean) in the State Hook documentation.


## Performance Optimizations {#performance-optimizations}

### Can I skip an effect on updates? {#can-i-skip-an-effect-on-updates}

Yes. See [conditionally firing an effect](/docs/hooks-reference.html#conditionally-firing-an-effect). Note that forgetting to handle updates often [introduces bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), which is why this isn't the default behavior.

### How do I implement `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

You can wrap a function component with `React.memo` to shallowly compare its props:

```js
const Button = React.memo((props) => {
  // your component
});
```

It's not a Hook because it doesn't compose like Hooks do. `React.memo` is equivalent to `PureComponent`, but it only compares props. (You can also add a second argument to specify a custom comparison function that takes the old and new props. If it returns true, the update is skipped.)

`React.memo` doesn't compare state because there is no single state object to compare. But you can make children pure too, or even [optimize individual children with `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).


### How to memoize calculations? {#how-to-memoize-calculations}

The [`useMemo`](/docs/hooks-reference.html#usememo) Hook lets you cache calculations between multiple renders by "remembering" the previous computation:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

This code calls `computeExpensiveValue(a, b)`. But if the inputs `[a, b]` haven't changed since the last value, `useMemo` skips calling it a second time and simply reuses the last value it returned.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance. (For rare cases when a value must *never* be recomputed, you can [lazily initialize](#how-to-create-expensive-objects-lazily) a ref.)

Conveniently, `useMemo` also lets you skip an expensive re-render of a child:

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Note that this approach won't work in a loop because Hook calls [can't](/docs/hooks-rules.html) be placed inside loops. But you can extract a separate component for the list item, and call `useMemo` there.

### How to create expensive objects lazily? {#how-to-create-expensive-objects-lazily}

`useMemo` lets you [memoize an expensive calculation](#how-to-memoize-calculations) if the inputs are the same. However, it only serves as a hint, and doesn't *guarantee* the computation won't re-run. But sometimes you need to be sure an object is only created once.

**The first common use case is when creating the initial state is expensive:**

```js
function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

To avoid re-creating the ignored initial state, we can pass a **function** to `useState`:

```js
function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React will only call this function during the first render. See the [`useState` API reference](/docs/hooks-reference.html#usestate).

**You might also occasionally want to avoid re-creating the `useRef()` initial value.** For example, maybe you want to ensure some imperative class instance only gets created once:

```js
function Image(props) {
  // ⚠️ IntersectionObserver is created on every render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **does not** accept a special function overload like `useState`. Instead, you can write your own function that creates and sets it lazily:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver is created lazily once
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // When you need it, call getObserver()
  // ...
}
```

This avoids creating an expensive object until it's truly needed for the first time. If you use Flow or TypeScript, you can also give `getObserver()` a non-nullable type for convenience.


### Are Hooks slow because of creating functions in render? {#are-hooks-slow-because-of-creating-functions-in-render}

No. In modern browsers, the raw performance of closures compared to classes doesn't differ significantly except in extreme scenarios.

In addition, consider that the design of Hooks is more efficient in a couple ways:

* Hooks avoid a lot of the overhead that classes require, like the cost of creating class instances and binding event handlers in the constructor.

* **Idiomatic code using Hooks doesn't need the deep component tree nesting** that is prevalent in codebases that use higher-order components, render props, and context. With smaller component trees, React has less work to do.

Traditionally, performance concerns around inline functions in React have been related to how passing new callbacks on each render breaks `shouldComponentUpdate` optimizations in child components. Hooks approach this problem from three sides.

* The [`useCallback`](/docs/hooks-reference.html#usecallback) Hook lets you keep the same callback reference between re-renders so that `shouldComponentUpdate` continues to work:

    ```js{2}
    // Will not change unless `a` or `b` changes
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* The [`useMemo` Hook](/docs/hooks-faq.html#how-to-memoize-calculations) makes it easier to control when individual children update, reducing the need for pure components.

* Finally, the `useReducer` Hook reduces the need to pass callbacks deeply, as explained below.

### How to avoid passing callbacks down? {#how-to-avoid-passing-callbacks-down}

We've found that most people don't enjoy manually passing callbacks through every level of a component tree. Even though it is more explicit, it can feel like a lot of "plumbing".

In large component trees, an alternative we recommend is to pass down a `dispatch` function from [`useReducer`](/docs/hooks-reference.html#usereducer) via context:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Note: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Any child in the tree inside `TodosApp` can use the `dispatch` function to pass actions up to `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

This is both more convenient from the maintenance perspective (no need to keep forwarding callbacks), and avoids the callback problem altogether. Passing `dispatch` down like this is the recommended pattern for deep updates.

Note that you can still choose whether to pass the application *state* down as props (more explicit) or as context (more convenient for very deep updates). If you use context to pass down the state too, use two different context types -- the `dispatch` context never changes, so components that read it don't need to rerender unless they also need the application state.

### How to read an often-changing value from `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

>Note
>
>We recommend to [pass `dispatch` down in context](#how-to-avoid-passing-callbacks-down) rather than individual callbacks in props. The approach below is only mentioned here for completeness and as an escape hatch.
>
>Also note that this pattern might cause problems in the [concurrent mode](/blog/2018/03/27/update-on-async-rendering.html). We plan to provide more ergonomic alternatives in the future, but the safest solution right now is to always invalidate the callback if some value it depends on changes.

In some rare cases you might need to memoize a callback with [`useCallback`](/docs/hooks-reference.html#usecallback) but the memoization doesn't work very well because the inner function has to be re-created too often. If the function you're memoizing is an event handler and isn't used during rendering, you can use [ref as an instance variable](#is-there-something-like-instance-variables), and save the last committed value into it manually:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

This is a rather convoluted pattern but it shows that you can do this escape hatch optimization if you need it. It's more bearable if you extract it to a custom Hook:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

In either case, we **don't recommend this pattern** and only show it here for completeness. Instead, it is preferable to [avoid passing callbacks deep down](#how-to-avoid-passing-callbacks-down).


## Under the Hood {#under-the-hood}

### How does React associate Hook calls with components? {#how-does-react-associate-hook-calls-with-components}

React keeps track of the currently rendering component. Thanks to the [Rules of Hooks](/docs/hooks-rules.html), we know that Hooks are only called from React components (or custom Hooks -- which are also only called from React components).

There is an internal list of "memory cells" associated with each component. They're just JavaScript objects where we can put some data. When you call a Hook like `useState()`, it reads the current cell (or initializes it during the first render), and then moves the pointer to the next one. This is how multiple `useState()` calls each get independent local state.

### What is the prior art for Hooks? {#what-is-the-prior-art-for-hooks}

Hooks synthesize ideas from several different sources:

* Our old experiments with functional APIs in the [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) repository.
* React community's experiments with render prop APIs, including [Ryan Florence](https://github.com/ryanflorence)'s [Reactions Component](https://github.com/reactions/component).
* [Dominic Gannaway](https://github.com/trueadm)'s [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) proposal as a sugar syntax for render props.
* State variables and state cells in [DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) in ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) in Rx.
* [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) in Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) came up with the original design for Hooks, later refined by [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), and other members of the React team.
