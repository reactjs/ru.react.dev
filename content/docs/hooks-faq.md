---
id: hooks-faq
title: Хуки - вопросы и ответы
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Хуки* были добавлены в React 16.8. С их помощью вы можете использовать состояние и другие возможности React без необходимости использовать классы.

На этой странице вы найдёте ответы на некоторые популярные вопросы о [хуках](/docs/hooks-overview.html).

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
  * [Что я могу сделать с помощью хуков, что не смог бы с помощью классов?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Какая часть моих знаний о React всё еще актуальна?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Что мне использовать: хуки, классы или оба подхода?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Дают ли хуки все возможности классов?](#do-hooks-cover-all-use-cases-for-classes)
  * [Являются ли хуки заменой рендер-пропсам и компонентам высшего порядка?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Как хуки повлияют на популярные API - например Redux `connect()` и React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Поддерживают ли хуки статическую типизацию?](#do-hooks-work-with-static-typing)
  * [Как тестировать компоненты, которые используют хуки?](#how-to-test-components-that-use-hooks)
  * [Что конкретно правила линтера проверяют в хуках?](#what-exactly-do-the-lint-rules-enforce)
* **[От классов к хукам](#from-classes-to-hooks)**
  * [Как методы жизненного цикла соответствуют хукам?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Существует что-нибудь наподобие полей экземпляра?](#is-there-something-like-instance-variables)
  * [Сколько переменных состояния я могу использовать - одну или несколько?](#should-i-use-one-or-many-state-variables)
  * [Могу ли я использовать эфеект только на обновлениях компонента?](#can-i-run-an-effect-only-on-updates)
  * [Как получить прошлые пропсы или состояние](#how-to-get-the-previous-props-or-state)
  * [Как я могу реализовать getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [Существует что-нибудь набодобие forceUpdate?](#is-there-something-like-forceupdate)
  * [Can I make a ref to a function component?](#can-i-make-a-ref-to-a-function-component)
  * [Что значит `const [thing, setThing] = useState()`](#what-does-const-thing-setthing--usestate-mean)
* **[Оптимизации производительности](#performance-optimizations)**
  * [Могу ли я пропустить эффект при обновлениях?](#can-i-skip-an-effect-on-updates)
  * [Как я могу реализовать shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [Как закешировать вычисления?](#how-to-memoize-calculations)
  * [Как лениво создавать ресурсозатратные объекты?](#how-to-create-expensive-objects-lazily)
  * [Are Hooks slow because of creating functions in render?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [How to avoid passing callbacks down?](#how-to-avoid-passing-callbacks-down)
  * [How to read an often-changing value from useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Under the Hood](#under-the-hood)**
  * [How does React associate Hook calls with components?](#how-does-react-associate-hook-calls-with-components)
  * [What is the prior art for Hooks?](#what-is-the-prior-art-for-hooks)

## Внедрение хуков {#adoption-strategy}

### В какой версии React появились хуки?{#which-versions-of-react-include-hooks}

Начиная с релиза 16.8.0, React включает в себя стабильную реализацию хуков для:

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Обратите внимание, что **хуки будут доступны, только если все React-пакеты версии 16.8.0 или выше**. Хуки не будут работать, если вы, например, забыли обновить React DOM.

Поддержка хуков в React Native добавится в следующем стабильном релизе.

### Надо ли переписать все мои классовые компоненты?{#do-i-need-to-rewrite-all-my-class-components}

No. There are [no plans](/docs/hooks-intro.html#gradual-adoption-strategy) to remove classes from React -- we all need to keep shipping products and can't afford rewrites. We recommend trying Hooks in new code.

Нет. [Мы не собираемся удалять классы из React](/docs/hooks-intro.html#gradual-adoption-strategy). Это новая функциональность, которая не заставляет переписывать всё приложение. Мы рекомендуем пробовать хуки только в новом коде.

### Что я могу сделать с помощью хуков, что не смог бы с помощью классов? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Хуки дают новый мощный способ переиспользования кода между компонентами. ["Создание ваших хуков"](/docs/hooks-custom.html) даст представление об их возможностях. [Эта статья](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889), написанная одним из участников команды React, описывает новые возможности, которые открывают хуки.

### Какая часть моих знаний о React всё еще актуальна? {#how-much-of-my-react-knowledge-stays-relevant}

Хуки -- это новый способ использовать возможности React, которые вы уже знаете: состояние, жизненный цикл, контекст и рефы. Хуки не изменили фундаментальную логику React, и ваши знания компонентов, пропсов и потока данных сверху-вниз остаются актуальными.

Однако, хуки не самая простая часть React. Если вам чего-то не хватает в этой документации, [дайте нам знать](https://github.com/reactjs/reactjs.org/issues/new), и мы постараемся вам помочь.

### Что мне использовать: Хуки, классы или оба подхода? {#should-i-use-hooks-classes-or-a-mix-of-both}

Когда вы будете готовы, мы рекомендуем вам начать использовать хуки в ваших новых компонентах. Убедитесь, что каждый в вашей команде знаком с документацией и поддерживает вас. Мы не рекомендуем переписывать ваши существующие классы на хуки, пока нет необходимости возвращаться к определённому компоненту (например, чтобы исправить баг).

Вы не можете использовать хуки *внутри* классового компонента, но вы можете комбинировать классы и функциональные компоненты с хуками в одном дереве. Классовый компонент или функциональный с хуками - неважно, это всего-лишь особенности  реализации. В дальнейшем будущем, мы ожидаем, что хуки статун главным способ написания React-компонентов.

### Дают ли хуки все возможности классов? {#do-hooks-cover-all-use-cases-for-classes}

Наша задача для хуков - это полное покрытие функционала классов чем раньше, тем лучше. Пока не существует хуков, реализующих методы жизненного цикла  `getSnapshotBeforeUpdate` и `componentDidCatch`, но мы планируем скоро их добавить.

Хуки появились совсем недавно, и некоторые сторонние библиотеки могли еще не приспособиться к ним.

### Являются ли хуки заменой рендер-пропсам и компонентам высшего порядка? {#do-hooks-replace-render-props-and-higher-order-components}

Often, render props and higher-order components render only a single child. We think Hooks are a simpler way to serve this use case. There is still a place for both patterns (for example, a virtual scroller component might have a `renderItem` prop, or a visual container component might have its own DOM structure). But in most cases, Hooks will be sufficient and can help reduce nesting in your tree.

Обычно, рендер пропсы и компоненты высшего порядка рендерят только один дочерний компонент. Мы думаем, что Хуки - более простой способ сделать это.
TODO
Но в большинстве случаев, Хуки должны помочь уменьшить вложенность компонентов в вашем дереве.

### Как Хуки повлияют на популярные API - например Redux `connect()` и React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}.

Вы можете продолжать использовать тот же API, который вы использовали до этого - всё продолжает работать.

В будущем, новые версии этих библиотек могут также экспортировать специальные хуки, например `useRedux()` или  `useRouter()`, которые позволят вам использовать тот же функционал без необходимости обарачивать компоненты.

### Поддерживают ли хуки статическую типизацию? {#do-hooks-work-with-static-typing}

Хуки спроектированы с учётом статической типизации. Так как они являются функциями, их легче типизировать правильно чем, например, компоненты высшего порядка. Последние версии Flow и TypeScript включают в себя поддержку React-хуков.

Importantly, custom Hooks give you the power to constrain React API if you'd like to type them more strictly in some way. React gives you the primitives, but you can combine them in different ways than what we provide out of the box.

TODO

### Как тестировать компоненты, которые используют Хуки? {#how-to-test-components-that-use-hooks}

С точки зрения React, компонент, использующий хуки, является обычным компонентом. Если ваш способ тестирования не опирается на внутреннюю часть React, тестирование компонентов с хуками не должно отличатся от тестирования других компонентов.

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

Если вам надо протестировать созданный хук, вы можете создать компонент в ваших тестах и использовать в нём этот хук. После этого вы можете протестировать сам компонент.

Для уменьшения однотипного кода, мы советуем использовать библиотеку [`react-testing-library`](https://git.io/react-testing-library). Она была создана для написания тестов, использующих ваши компоненты, как это делают конечные пользователи.

### Что конкретно [правила линтера](https://www.npmjs.com/package/eslint-plugin-react-hooks) проверяют в хуках?{#what-exactly-do-the-lint-rules-enforce}

Мы предоставляем [плагин к ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks), который принуждает следовать [правилам хуков](/docs/hooks-rules.html), чтобы избежать ошибок. Подразумевается, что любая функция, имя который начинается с "`use`" и заглавной буквы далее, является хуком. Мы понимаем, что это предположение не идеальное, и могут случится ложные срабатывания. Однако, без этого важного соглашения, было бы невозможно заставить хуки работать хорошо, а более длинные имена могли бы помешать людям начать использовать хуки или следовать соглашению.

В частности, правила проверяют, что:

* Вызовы хуков происходят либо внутри функции с именем в `ВерблюжемРегистре` (подразумевается, что это класс), либо внутри другой `useSomething` функции (подразумевается, что это созданный пользователем хук).
* Хуки вызываются в одном и том же порядке каждый раз.

Существует еще несколько предположений, которые могут измениться по мере того, как мы будем регулировать правила и искать баланс между нахождением ошибок и ложными срабатываниями.

## От классов к хукам {#from-classes-to-hooks}

### [Как методы жизненного цикла соответствуют хукам?] {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Функциональному компоненту не нужен конструктор.  Вы можете инициализировать состояние, используя вызов [`useState`](/docs/hooks-reference.html#usestate). Если вычисления состояния трудозатратны, вы можете передать функцию в `useState`.

* `getDerivedStateFromProps`: Schedule an update [while rendering](#how-do-i-implement-getderivedstatefromprops) instead.

* `getDerivedStateFromProps`: TODO

* `shouldComponentUpdate`: Смотрите `React.memo` [below](#how-do-i-implement-shouldcomponentupdate).

* `render`: Это тело функционального компонента.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: [хук `useEffect`](/docs/hooks-reference.html#useeffect) заменяет все их комбинации (включая [более](#can-i-skip-an-effect-on-updates) [редкие](#can-i-run-an-effect-only-on-updates) случаи).

* `componentDidCatch` и `getDerivedStateFromError`: В данный момент не существует хуков-аналогов для этих методов, но они будут скоро добавлены.

### Существует что-нибудь наподобие полей экземпляра? {#is-there-something-like-instance-variables}

Да! Хук [`useRef()`](/docs/hooks-reference.html#useref) может использоваться не только для DOM рефов. Реф - это общий контейнер, а его поле `current` -- изменяемое и может хранить любое значение, как и поле экземпляра класса.

Вы можете использовать его внутри `useEffect`:

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

Если мы захотим просто установить интервал, нам не нужен будет реф (`id` может использоваться только внутри эффекта). Но реф будет полезным, если мы захотим очистить интервал из обработчика события:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

В целом вы можете рассматривать рефы как поля экземпляра класса. Старайтесь избегать установки рефов во время рендера, пока вы не занимаетесь  [ленивой инициализацией](#how-to-create-expensive-objects-lazily), так как это может привести к неожиданному поведению. Вместо этого, зачастую вы будете изменять рефы в обработчиках событий и эффектах.

### Сколько переменных состояния я могу использовать - одну или несколько? {#should-i-use-one-or-many-state-variables}

Если вы привыкли писать классовые компоненты, вы скорее всего всегда вызываете `useState()` один раз для одного изменения состояния и храните всё состояние в одном объекте. Вы можете делать то же самое с хуками, если пожелаете. Взгляните на пример компонента, который следует за движением  курсора. Мы храним позицию и размер этого компонента в локальном состоянии.

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Допустим, мы хотим написать некоторую логику, которая будет изменять значения `left` и `top`, когда пользователь двигает курсор мышки. Обратите внимание, что мы обязаны объединять эти поля с предыдущим объектом состоянии вручную:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Использование "...state" гарантирует, что мы не `потеряем` поля width и height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Примичание: эта реализация немного упрощена
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Это необходимо, потому что мы изменяем переменную состояния, *заменяя* её значение. Данное поведение отличается от `this.setState`, ведь этот классовый метод *объединяет* изменённые поля и текущий объект состояния.

Если вам не хватает автоматического объединения состояния, вы можете например свой хук `useLegacyState`, который будет объединять обновленные поля. Однако, вместо этого **мы рекомендуем разделять состояние на несколько переменных, учитывая какие поля логически относятся друг к другу и будут изменяться вместе.**

Например, мы можем разделить состояние нашего компонента на объекты `position` и `size`, что поможет всегда изменять только `position`, без необходимости волноваться об объединении:

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

В разделении состояния на независимые переменные есть еще одно преимущество. Это поможет легко вынести некоторую логику в отдельный хук в будущем, например:

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

Обратите внимание, как мы смогли вынести вызов `useState`, изменящий `position`, и соответствующих эффект в отдельный хук, практически не меняя их код. Если бы всё состояние хранилось в одном объекте, сделать это перемещение было бы на порядок сложнее.

Оба варинта работают на самом деле работают. Компоненты будут более читаемыми, если вы найдёте баланс между двумя подходами и будете групировать связанные друг с другом данные. Если работа с состоянием становится сложной, мы советуем [использовать редюсер](/docs/hooks-reference.html#usereducer) или выносить логику в отдельные хуки.

### Могу ли я использовать эфеект только на обновлениях компонента? {#can-i-run-an-effect-only-on-updates}

Это - довольно редкий случай. Вы можете [использовать изменяемый реф](#is-there-something-like-instance-variables), чтобы вручную хранить логическое значение, показывающее, прошел ли первый рендер. В свою очередь эффект может опираться на это значение. Если вы замечаете, что эта логика нужна вам часто, вы можете вынести её в отдельный хук.

### Как получить прошлые пропсы или состояние? {#how-to-get-the-previous-props-or-state}

Сейчас, вы можете сделать это вручную, [используя реф](#is-there-something-like-instance-variables):

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Сейчас: {count}, до этого: {prevCount}</h1>;
}
```

Это может показаться чрезмерно сложным, но вы можете вынести эту логику в отдельный хук:

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Сейчас: {count}, до этого: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Обратите внимание, как это будет работать для пропсов, состояния или любого другого вычисляемого значения.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

Возмонжо, в будущем React добавит хук `usePrevious` в свой API, так как это довольно распространенный случай в разработке.

Также смотрите [рекомендованный паттерн для полученного состояния](#how-do-i-implement-getderivedstatefromprops).

### Как я могу реализовать `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

Не смотря на то, что вам скорее всего [это не надо](/blog/2018/06/07/you-probably-dont-need-derived-state.html), в редких случаях (например, реализация компонента `<Transition>`), вы можете изменять состояние прямо во время рендера. React моментально перерендерит компонент с обновлённым состоянием сразу после первого рендера, и это не будет затратным.

В этом примере, мы храним предыдущее значение пропса `row` в состоянии, что позволяет сранить значения:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row изменился с прошлого рендера. Обновляем isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

Сперва это может показаться странным, но изменение во время рендера - это именно то, чем всегда концептуально являлся метод `getDerivedStateFromProps`.

### Существует что-нибудь набодобие forceUpdate? {#is-there-something-like-forceupdate}

Оба хука `useState` и `useReducer` [игнорируют апдейты](/docs/hooks-reference.html#bailing-out-of-a-state-update), если следующее значение равно предыдущему. Мутирование состояния и вызов `setState` не вызовет ре-рендеры.

Обычно, вы не должны мутировать локальное состояние в React. Однако, в качестве трюка, вы можете использовать увеличивающийся счетчик, чтобы заставлять компонент повторно рендериться, если состояние не изменилось:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Старайтесь избегать этого подхода, если возможно.

### Могу ли я создать реф для функционального компонента? {#can-i-make-a-ref-to-a-function-component}

Несмотря на то, что вам не понадобится это часто, вы можете предоставить некоторые императивные методы для родительского компонента используя хук [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### Что значит `const [thing, setThing] = useState()`? {#what-does-const-thing-setthing--usestate-mean}

Если вы не знакомы с этим синтаксисом, ознакомтесь с [объяснением](/docs/hooks-state.html#tip-what-do-square-brackets-mean) в документации хука для состояния.


## Оптимизации производительности {#performance-optimizations}

### Могу ли я пропустить эффект при обновлениях? {#can-i-skip-an-effect-on-updates}

Да. Ознакомтесь с [условным вызовом эффектов](/docs/hooks-reference.html#conditionally-firing-an-effect). Обратите внимание, что забыв обработать обновления, вы зачастую можете [создать ошибки](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update). Поэтому это и не является поведением по умолчанию.

### Как я могу реализовать `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

Вы можете обернуть функциональный компонент в вызов `React.memo` для поверхностного сравнения его пропсов:

```js
const Button = React.memo((props) => {
  // ваш компонент
});
```

Это функция не является хуком, так как она не ведёт себя как хук. `React.memo` аналогична `PureComponent`, но она сравнивает только пропсы. (Вы также можете добавить второй аргумент, чтобы определить свою функцию сравнения, которая примет старые и новые пропсы. Если эта функция вернёт `true`, обновление будет пропущено.)

`React.memo` doesn't compare state because there is no single state object to compare. But you can make children pure too, or even [optimize individual children with `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

`React.memo` не сравнивает состояние, потому что не существует единого объекта, который можно сравнить. Но вы можете также сделать дочерние компоненты чистыми или даже [оптимизировать каждый дочерний компонент используя хук `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### Как закешировать вычисления? {#how-to-memoize-calculations}

Хук [`useMemo`](/docs/hooks-reference.html#usememo) позволяет вам закешировать вычисления между несколькими рендерами, путём запоминания прошлого результата:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Этот код вызывает `computeExpensiveValue(a, b)`. Но если аргументы `[a, b]` не изменились с прошлого рендера, `useMemo` пропустит повторный вызов и повторно использует значения, которые он вернул в прошлый раз.

Помните, что функция, передаваемая в `useMemo`, выполняется во время рендера. Не стоит делать в ней что-то, что вы обычно не делаете во время рендера. Например, побочные эффекты выполняются в хуке `useEffect`, а не в `useMemo`.

**Рассматриваете `useMemo`, как оптимизацию производительности, но не стоит пологаться на неё на 100%.**. В будущем React сможет `забыть` прошлые закешированные значения и провести перерасчет на следующем рендере, например, для освобождения памяти, занятой компонентами вне экрана. Пишите ваш код так, чтобы он мог работать без `useMemo`, и только тогда добавляйте оптимизацию производительности. (Для редких случаев, когда значение **не должно никогда** перерасчитываться, вы можете [лениво инициализировать](#how-to-create-expensive-objects-lazily) реф.)

Также удобно, что `useMemo` позволяет пропускать затратные повторные рендеры дочерних компонентов:

```js
function Parent({ a, b }) {
  // Рендерится повторно, только если `a` изменится:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Рендерится повторно, только если `b` изменится:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Обратите внимание, что этот подход не будет работать внутри циклов, так как вызовы хуков [не могут](/docs/hooks-rules.html) быть помещены внуть циклов. Но вы можете создать отдельный компонент для элемента списка, и вызвать `useMemo` там.

### Как лениво создавать ресурсозатратные объекты? {#how-to-create-expensive-objects-lazily}

Хук `useMemo` позволяет вам [закешировать ресурсозатратные вычисления](#how-to-memoize-calculations), если входные данные не изменились. Однако, этот способ **не гарантирует**, что повторных вычислений не случится. Иногда вам нужно удостовериться, что объект будет создан только один раз.

**Первый частый вариант использования - создание изначального состония ресурсозатратно:**

```js
function Table(props) {
  // ⚠️ createRows() вызывается на каждом рендере
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

Чтобы избежать повторого создания игнорируемого начального состояния, мы можем передать **функцию** в `useState`:

```js
function Table(props) {
  // ✅ createRows() будет вызван только один раз
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React вызовёт эту функцию один раз во время первого рендера. Смотрите [справочник API по хуку `useState`](/docs/hooks-reference.html#usestate).

**Иногда, вам будет нужно избежать повторного создания начального значения от `useRef()`.** Например, возможно вы захотите убедиться, что экземпляр некоторого императивного класса создаётся только один раз:

```js
function Image(props) {
  // ⚠️ IntersectionObserver создаётся на каждом рендере
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

У хука `useRef` **нет** реализации, принимающей специальную функцию, как у `useState`. Вместо этого, вы можете написать свою функцию, которая будет лениво создавать и назначать этот экземпляр:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver лениво создаётся только один раз
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // Когда он вам понадобится, вызовете getObserver()
  // ...
}
```

Этот подход позволяет избежать создания ресурсозатратных объектов во всех случаях, кроме первого, кода это действительно необходимо. Если вы используете Flow или TypeScript, вы можете также установить для `getObserver()` непустой тип для уверенности.

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
