---
id: hooks-faq
title: "Хуки: ответы на вопросы"
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Хуки* — нововведение в React 16.8, которое позволяет использовать состояние и другие возможности React без написания классов.

На этой странице вы найдёте ответы на популярные вопросы о [хуках](/docs/hooks-overview.html).

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
  * [Что можно сделать с помощью хуков, чего невозможно добиться, используя классы?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Какая часть моих знаний о React всё ещё актуальна?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Что мне использовать: хуки, классы или оба подхода?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Дают ли хуки все возможности классов?](#do-hooks-cover-all-use-cases-for-classes)
  * [Являются ли хуки заменой рендер-пропсам и компонентам высшего порядка?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Как хуки повлияют на популярные API, такие как Redux `connect()` и React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Поддерживают ли хуки статическую типизацию?](#do-hooks-work-with-static-typing)
  * [Как тестировать компоненты, которые используют хуки?](#how-to-test-components-that-use-hooks)
  * [Что конкретно проверяют правила линтера в хуках?](#what-exactly-do-the-lint-rules-enforce)
* **[От классов к хукам](#from-classes-to-hooks)**
  * [Как методы жизненного цикла соответствуют хукам?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Существует что-нибудь наподобие полей экземпляра?](#is-there-something-like-instance-variables)
  * [Сколько переменных состояния я могу использовать – одну или несколько?](#should-i-use-one-or-many-state-variables)
  * [Могу ли я использовать эффект только на обновлениях компонента?](#can-i-run-an-effect-only-on-updates)
  * [Как получить прошлые пропсы или состояние](#how-to-get-the-previous-props-or-state)
  * [Как я могу реализовать getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [Существует что-нибудь наподобие forceUpdate?](#is-there-something-like-forceupdate)
  * [Могу ли я изменить реф, переданный в функциональный компонент?](#can-i-make-a-ref-to-a-function-component)
  * [Что значит `const [thing, setThing] = useState()`](#what-does-const-thing-setthing--usestate-mean)
* **[Оптимизации производительности](#performance-optimizations)**
  * [Могу ли я пропустить эффект при обновлениях?](#can-i-skip-an-effect-on-updates)
  * [Как я могу реализовать shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [Как закешировать вычисления?](#how-to-memoize-calculations)
  * [Как лениво создавать большие объекты?](#how-to-create-expensive-objects-lazily)
  * [Являются ли хуки медленными из-за создания функций на каждом рендере?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Как избежать передачи колбэков вниз?](#how-to-avoid-passing-callbacks-down)
  * [Как получить часто изменяемое значение из хука `useCallback`?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Под капотом](#under-the-hood)**
  * [Как React связывает вызовы хуков с компонентом?](#how-does-react-associate-hook-calls-with-components)
  * [Что послужило прообразом хуков?](#what-is-the-prior-art-for-hooks)

## Внедрение хуков {#adoption-strategy}

### В какой версии React появились хуки? {#which-versions-of-react-include-hooks}

Начиная с релиза 16.8.0, React включает в себя стабильную реализацию хуков для:

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Обратите внимание, что **хуки будут доступны, только если все React-пакеты версии 16.8.0 или выше**. Хуки не будут работать, если вы, например, забыли обновить React DOM.

Поддержка хуков в React Native добавится в следующем стабильном релизе.

### Надо ли переписать все мои классовые компоненты? {#do-i-need-to-rewrite-all-my-class-components}

Нет, мы [не собираемся](/docs/hooks-intro.html#gradual-adoption-strategy) удалять классы из React, да никто бы и не смог позволить себе такой глобальный рефакторинг. Мы советуем пробовать хуки только в новом коде.

### Что можно сделать с помощью хуков, чего невозможно добиться, используя классы? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Хуки дают новый мощный способ повторного использования кода в компонентах. [«Создание пользовательских хуков»](/docs/hooks-custom.html) даст представление об их возможностях. [Эта статья](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889), написанная одним из участников команды React, описывает новые возможности, которые открывают хуки.

### Какая часть моих знаний о React всё ещё актуальна? {#how-much-of-my-react-knowledge-stays-relevant}

Хуки -- это новый способ использовать возможности React, которые вы уже знаете: состояние, жизненный цикл, контекст и рефы. Хуки не изменили фундаментальную логику React, и ваши знания компонентов, пропсов и потока данных сверху вниз остаются актуальными.

Однако, хуки -- не самая простая часть React. Если вам чего-то не хватает в этой документации, [дайте нам знать](https://github.com/reactjs/reactjs.org/issues/new), и мы постараемся вам помочь.

### Что мне использовать: хуки, классы или оба подхода? {#should-i-use-hooks-classes-or-a-mix-of-both}

Когда вы будете готовы, мы рекомендуем начать использовать хуки в ваших новых компонентах. Убедитесь, что каждый в команде знаком с документацией и поддерживает вас. Мы не рекомендуем переписывать ваши существующие классы на хуки, пока нет необходимости возвращаться к определённому компоненту (например, чтобы исправить баг).

Вы не можете использовать хуки *внутри* классового компонента, но вы можете комбинировать классы и функциональные компоненты с хуками в одном дереве. Классовый компонент или функциональный с хуками -- неважно, это всего лишь особенности реализации. В будущем мы ожидаем, что хуки станут главным способом написания React-компонентов.

### Дают ли хуки все возможности классов? {#do-hooks-cover-all-use-cases-for-classes}

Наша главная задача, чтобы хуки покрывали весь функционал классов в ближайшем будущем. Пока не существует хуков, реализующих методы жизненного цикла  `getSnapshotBeforeUpdate` и `componentDidCatch`, но мы планируем скоро их добавить.

Хуки появились совсем недавно, и некоторые сторонние библиотеки могли ещё не приспособиться к ним.

### Являются ли хуки заменой рендер-пропсам и компонентам высшего порядка? {#do-hooks-replace-render-props-and-higher-order-components}

Как правило, рендер-пропсы и компоненты высшего порядка рендерят один дочерний компонент, увеличивая вложенность, но добавляя к нему функционал. Мы думаем, что хуки — более простой способ сделать это. Оба подхода всё ещё имеют право на жизнь (например, компонент, следящий за скроллом, может иметь проп `renderItem`, или компонент-контейнер может иметь разные рендер-пропсы для различных слотов). Но в большинстве случаев, хуки должны помочь уменьшить вложенность компонентов в вашем дереве.

### Как хуки повлияют на популярные API, такие как Redux `connect()` и React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Используйте тот же API, который вы использовали до этого – всё продолжает работать.

В будущем, новые версии этих библиотек могут добавить специальные хуки, например `useRedux()` или `useRouter()`, которые позволят вам использовать ту же функциональность без необходимости оборачивать компоненты.

### Поддерживают ли хуки статическую типизацию? {#do-hooks-work-with-static-typing}

Хуки спроектированы с учётом статической типизации. Так как они являются функциями, их легче типизировать правильным образом (например, в сравнении с компонентами высшего порядка). Последние версии Flow и TypeScript включают в себя поддержку React-хуков.

Importantly, custom Hooks give you the power to constrain React API if you'd like to type them more strictly in some way. React gives you the primitives, but you can combine them in different ways than what we provide out of the box. TODO

### Как тестировать компоненты, которые используют хуки? {#how-to-test-components-that-use-hooks}

С точки зрения React, компонент, использующий хуки, является обычным компонентом. Если ваш способ тестирования не опирается на внутреннюю часть React, тестирование компонентов с хуками не должно отличатся от тестирования других компонентов.

Например, у нас есть следующий компонент-счетчик:

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

Для уменьшения однотипного кода, мы советуем использовать библиотеку [`react-testing-library`](https://git.io/react-testing-library). Она была создана для написания тестов, использующих ваши компоненты, как это делают ваши пользователи.

### Что конкретно проверяют [правила линтера](https://www.npmjs.com/package/eslint-plugin-react-hooks) в хуках?{#what-exactly-do-the-lint-rules-enforce}

Мы предоставляем [плагин к ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks), который принуждает следовать [правилам хуков](/docs/hooks-rules.html), чтобы избежать ошибок. Подразумевается, что любая функция, имя который начинается с «`use`» и заглавной буквы далее, является хуком. Мы понимаем, что это предположение не идеальное, и могут случаться ложные срабатывания. Однако, без этого важного соглашения, было бы невозможно заставить хуки работать хорошо, а более длинные имена могли бы помешать людям начать использовать хуки или следовать соглашению.

В частности, правила проверяют, что:

* Вызовы хуков происходят либо внутри функции с именем, написанном в стиле `PascalCase` (подразумевается, что это компонент), либо внутри другой функции `useSomething` (подразумевается, что это созданный пользователем хук).

* Хуки вызываются в одном и том же порядке каждый раз.

Существует ещё несколько предположений, которые могут измениться по мере того, как мы будем регулировать правила и искать баланс между нахождением ошибок и ложными срабатываниями.

## От классов к хукам {#from-classes-to-hooks}

### Как методы жизненного цикла соответствуют хукам? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Функциональному компоненту не нужен конструктор. Вы можете инициализировать состояние, используя вызов [`useState`](/docs/hooks-reference.html#usestate). Если вычисления состояния затратны, вы можете передать функцию в `useState`.

* `getDerivedStateFromProps`: Запланировать обновление [вместо рендера](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Смотрите объяснение `React.memo` [далее](#how-do-i-implement-shouldcomponentupdate).

* `render`: Это тело функционального компонента.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: [Хук `useEffect`](/docs/hooks-reference.html#useeffect) заменяет все их комбинации (включая [более](#can-i-skip-an-effect-on-updates) [редкие](#can-i-run-an-effect-only-on-updates) случаи).

* `componentDidCatch` и `getDerivedStateFromError`: В данный момент не существует хуков-аналогов для этих методов, но они будут скоро добавлены.

### Существует что-нибудь наподобие полей экземпляра? {#is-there-something-like-instance-variables}

Да! Хук [`useRef()`](/docs/hooks-reference.html#useref) может использоваться не только для DOM-рефов. Реф – это общий контейнер, а его поле `current` -- изменяемое и может хранить любое значение, как и поле экземпляра класса.


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

В целом вы можете рассматривать рефы как поля экземпляра класса. Старайтесь избегать установки рефов во время рендера, пока вы не занимаетесь [ленивой инициализацией](#how-to-create-expensive-objects-lazily), так как это может привести к неожиданному поведению. Вместо этого, зачастую вы будете изменять рефы в обработчиках событий и эффектах.

### Сколько переменных состояния я могу использовать – одну или несколько? {#should-i-use-one-or-many-state-variables}

Если вы привыкли писать классовые компоненты, вы скорее всего захотите вызывать `useState()` один раз для одного изменения и хранить всё состояние в одном объекте. Да, вы можете так сделать, если пожелаете. Взгляните на пример компонента, который следует за движением курсора. Мы храним позицию и размер этого компонента в локальном состоянии.

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
      // Использование "...state" гарантирует, что мы не потеряем поля width и height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Примечание: эта реализация немного упрощена
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Это необходимо, потому что мы изменяем переменную состояния, *заменяя* её значение. Данное поведение отличается от `this.setState`, ведь этот классовый метод *объединяет* изменённые поля и текущий объект состояния.

Если вам не хватает автоматического объединения состояния, вы можете например свой хук `useLegacyState`, который будет объединять обновленные поля. Однако, вместо этого **мы рекомендуем разделять состояние на несколько переменных, учитывая, какие поля логически относятся друг к другу и будут изменяться вместе.**

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

В разделении состояния на независимые переменные есть ещё одно преимущество. Это поможет легко вынести некоторую логику в отдельный хук в будущем, например:

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

Обратите внимание, как мы смогли вынести вызов `useState`, изменяющий `position`, и соответствующих эффект в отдельный хук, практически не меняя их код. Если бы всё состояние хранилось в одном объекте, сделать это перемещение было бы на порядок сложнее.

На самом деле, оба варианта имеют право на жизнь. Однако, компоненты будут более читаемыми, если вы найдёте баланс между двумя подходами и будете группировать связанные друг с другом данные. Если работа с состоянием становится сложной, мы советуем [использовать редюсер](/docs/hooks-reference.html#usereducer) или выносить логику в отдельные хуки.

### Могу ли я использовать эффект только на обновлениях компонента? {#can-i-run-an-effect-only-on-updates}

Это довольно редкий случай. Вы можете [использовать изменяемый реф](#is-there-something-like-instance-variables), чтобы вручную хранить логическое значение, показывающее, прошел ли первый рендер. В свою очередь эффект может опираться на это значение. Если вы замечаете, что эта логика нужна вам часто, вы можете вынести её в отдельный хук.

### Как получить предыдущие пропсы или состояние? {#how-to-get-the-previous-props-or-state}

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

Возможно, в будущем React добавит хук `usePrevious` в свой API, так как это довольно распространённый случай в разработке.

Также смотрите [рекомендованный паттерн для полученного состояния](#how-do-i-implement-getderivedstatefromprops).

### Как я могу реализовать `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

Несмотря на то, что вам скорее всего [это не нужно](/blog/2018/06/07/you-probably-dont-need-derived-state.html), в редких случаях (например, реализация компонента `<Transition>`), вы можете изменять состояние прямо во время рендера. React моментально сделает повторный рендер компонента с обновлённым состоянием сразу после первого рендера, и это не будет затратно.

В этом примере, мы храним предыдущее значение пропса `row` в состоянии, что позволяет сравнить значения:

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

Сперва это может показаться странным, но изменение во время рендера – это именно то, чем всегда концептуально являлся метод `getDerivedStateFromProps`.

### Существует что-нибудь наподобие forceUpdate? {#is-there-something-like-forceupdate}

Оба хука `useState` и `useReducer` [игнорируют обновления](/docs/hooks-reference.html#bailing-out-of-a-state-update), если следующее значение равно предыдущему. Мутация состояния и вызов `setState` не вызовет повторного рендера.

Обычно, вы не должны мутировать внутреннее состояние в React. Однако, в качестве трюка, вы можете использовать увеличивающийся счётчик, чтобы заставить компонент повторно рендериться, если состояние не изменилось:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Старайтесь избегать этого подхода, если возможно.

### Могу ли я изменить реф, переданный в функциональный компонент? {#can-i-make-a-ref-to-a-function-component}


Несмотря на то, что вам не понадобится это часто, вы можете предоставить некоторые императивные методы для родительского компонента используя хук [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### Что значит `const [thing, setThing] = useState()`? {#what-does-const-thing-setthing--usestate-mean}

Если вы не знакомы с этим синтаксисом, ознакомьтесь с [объяснением](/docs/hooks-state.html#tip-what-do-square-brackets-mean) в документации хука состояния.


## Оптимизации производительности {#performance-optimizations}

### Могу ли я пропустить эффект при обновлениях? {#can-i-skip-an-effect-on-updates}

Да. Ознакомьтесь с [условным вызовом эффектов](/docs/hooks-reference.html#conditionally-firing-an-effect). Обратите внимание, что забыв обработать обновления, вы зачастую можете [создать ошибки](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update). Поэтому это и не является поведением по умолчанию.

### Как я могу реализовать `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

Вы можете обернуть функциональный компонент в вызов `React.memo` для поверхностного сравнения его пропсов:

```js
const Button = React.memo((props) => {
  // ваш компонент
});
```

Это функция не является хуком, так как она не ведёт себя как хук. `React.memo` аналогична `PureComponent`, но она сравнивает только пропсы. (Вы также можете добавить второй аргумент, чтобы определить свою функцию сравнения, которая примет старые и новые пропсы. Если эта функция вернёт `true`, обновление будет пропущено.)

`React.memo` не сравнивает состояние, потому что не существует единого объекта, который можно сравнить. Но вы можете также сделать дочерние компоненты чистыми или даже [оптимизировать определённый дочерний компонент используя хук `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### Как закешировать вычисления? {#how-to-memoize-calculations}

Хук [`useMemo`](/docs/hooks-reference.html#usememo) позволяет вам закэшировать вычисления между несколькими рендерами, путём запоминания прошлого результата:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Этот код вызовет `computeExpensiveValue(a, b)`. Но если аргументы `[a, b]` не изменились с прошлого рендера, `useMemo` пропустит повторный вызов и повторно использует значения, которые он вернул в прошлый раз.

Помните, что функция, передаваемая в `useMemo`, выполняется во время рендера. Не стоит делать в ней что-то, что вы обычно не делаете во время рендера. Например, побочные эффекты выполняются в хуке `useEffect`, а не в `useMemo`.

**Рассматриваете `useMemo`, как оптимизацию производительности, но не стоит полагаться на неё на 100%.** В будущем React сможет `забыть` прошлые закешированные значения и провести перерасчёт на следующем рендере, например, для освобождения памяти, занятой компонентами вне экрана. Пишите ваш код так, чтобы он мог работать без `useMemo`, и только тогда добавляйте оптимизацию производительности. (Для редких случаев, когда значение **не должно никогда** пересчитываться, вы можете [лениво инициализировать](#how-to-create-expensive-objects-lazily) реф.)

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

Обратите внимание, что этот подход не будет работать внутри циклов, так как вызовы хуков [не могут](/docs/hooks-rules.html) быть помещены внутрь циклов. Но вы можете создать отдельный компонент для элемента списка, и вызвать `useMemo` там.

### Как лениво создавать большие объекты? {#how-to-create-expensive-objects-lazily}

Хук `useMemo` позволяет вам [закешировать ресурсозатратные вычисления](#how-to-memoize-calculations), если входные данные не изменились. Однако, этот способ **не гарантирует**, что повторных вычислений не случится. Иногда вам нужно удостовериться, что объект будет создан только один раз.

**Первый частый вариант использования – создание изначального состояния затратно:**

```js
function Table(props) {
  // ⚠️ createRows() вызывается на каждом рендере
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

Чтобы повторно не создавать начальное состояние (которое по факту игнорируется), мы можем передать **функцию** в `useState`:

```js
function Table(props) {
  // ✅ createRows() будет вызван только один раз
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React вызовет эту функцию один раз во время первого рендера. Смотрите [справочник API по хуку `useState`](/docs/hooks-reference.html#usestate).

**Иногда, вы захотите избежать повторных вызовов хука `useRef()`.** Например, возможно вы захотите убедиться, что экземпляр некоторого императивного класса создаётся только один раз:

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

  // Когда он вам понадобится, вызовите getObserver()
  // ...
}
```

Этот подход позволяет избежать создания больших объектов на всех этапах, кроме первого рендера, когда это действительно необходимо. Если вы используете Flow или TypeScript, вы можете также установить для `getObserver()` непустой тип для уверенности.

### Являются ли хуки медленными из-за создания функций на каждом рендере? {#are-hooks-slow-because-of-creating-functions-in-render}

Нет. В современных браузерах чистая производительность замыканий не сильно отличается от классов, кроме особых случаев.

Также учитывайте, что реализация хуков более эффективная по нескольким причинам:

* Хуки не требуют больших затрат, которые неизбежны в классах. Например, создание экземпляра класса и связывание обработчиков событий в конструкторе.

* **Проект, полностью написанный на хуках, имеет менее глубокое дерево компонентов**. В случае использования рендер-пропсов, компонентов высшего порядка или контекста, финальное дерево компонентов было бы в несколько раз больше. Тут стоит понимать, что чем меньше дерево компонентов, тем меньше работы React должен делать.

Традиционно, проблемы с оптимизацией строчных функций в React связаны с тем, как передача новых колбэков на каждом рендере ломает `shouldComponentUpdate` оптимизации в дочерних компонентах. Подход с хуками может решить эту проблему тремя способами.

* Хук [`useCallback`](/docs/hooks-reference.html#usecallback) позволяет сохранять ту же самую ссылку на колбэк между повторными рендерами, поэтому `shouldComponentUpdate` продолжит корректную работу:

    ```js{2}
    // Не создастся заново, пока `a` или `b` не изменятся
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* Хук [`useMemo` Hook](/docs/hooks-faq.html#how-to-memoize-calculations) облегчает контроль, когда конкретный дочерний компонент должен обновляться, уменьшая нужду в использовании чистых компонентов.

* В конец концов, хук `useReducer` уменьшает нужду в передачи колбэков глубоко вниз по дереву, как описано ниже.

### Как избежать передачи колбэков вниз? {#how-to-avoid-passing-callbacks-down}

Мы поняли, что большинству разработчиков не нравится вручную передавать колбэки вниз на каждом уровне дерева компонентов. Даже учитывая, что этот подход более явный, это может показаться чересчур громоздким.

В качестве альтернативы для больших деревьев компонентов, мы рекомендуем передавать вниз функцию `dispatch` из хука [`useReducer`](/docs/hooks-reference.html#usereducer) через контекст:


```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Примечание: `dispatch` не изменится во время повторных рендеров
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Любой дочерний компонент в дереве внутри `TodosApp` может использовать функцию `dispatch`, чтобы вызвать действия из `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // Если мы хотим выполнить действие, мы можем получить dispatch из контекста.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

Этот вариант более удобный, как с точки зрения поддержки кода (не нужно добавлять пропсы для новых колбэков), так и в разрезе избежания общих проблем с колбэками. Передача функции `dispatch` по такому принципу – это рекомендуемый подход для вызова колбэков и избежания нежелательных обновлений в глубине дерева компонентов.

Обратите внимание, что вы также можете передавать *состояние* приложения вниз через пропсы (более явно) или через контекст (более удобно для глубокого дерева). Если ваш контекст в том числе передаёт некое состояние, используйте два разных типа контекста. Так как контекст `dispatch` никогда не изменяется, то компоненты, использующие его, не будут нуждаться в повторном рендере, если только им не требуется ещё и контекст с состоянием приложения.

### Как получить часто изменяемое значение из хука `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

> Примечание
>
> Мы рекомендуем [передавать `dispatch` вниз через контекст](#how-to-avoid-passing-callbacks-down) вместо передачи отдельных колбэков через пропсы. Следующий подход приведён тут только для полноты картины в качестве лазейки.
>
> Также обратите внимание, что этот подход может вызвать проблемы в [параллельном режиме](/blog/2018/03/27/update-on-async-rendering.html). Мы планируем предоставить более удобные альтернативы в будущем, но самый безопасный вариант сейчас -- всегда отменять колбэк, если значение, на которое он опирается, поменялось.

В некоторых редких случаях, вам может понадобится закешировать колбэк с помощью хука [`useCallback`](/docs/hooks-reference.html#usecallback), но кеширование не будет работать хорошо, потому что внутренняя функция будет пересоздоваться слишком часто. Если функция, которую вы кешируете, является обработчиком событий и не используется во время рендера, вы можете использовать [реф в качестве поля экземпляра](#is-there-something-like-instance-variables), и вручную сохранить туда последнее значение:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // Записать в реф
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Прочитать из рефа
    alert(currentText);
  }, [textRef]); // Избегаем повторных созданий handleSubmit

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

Это довольно запутанный подход, но он показывает, что вы можете сделать эту хитрую оптимизацию, если это вам действительно необходимо. В любом случае, советуем вынести эту логику в отдельный хук:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Будет закешировано, даже если значение `text` изменится:
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
    throw new Error('Невозможно вызвать обработчик события во время рендера.');
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

В любом случае мы **не советуем использовать этот подход** и показываем его тут только для полноты картины. Вместо этого, старайтесь [избегать передачи колбэков глубоко вниз в дерево](#how-to-avoid-passing-callbacks-down).


## Под капотом {#under-the-hood}

### Как React связывает вызовы хуков с компонентом? {#how-does-react-associate-hook-calls-with-components}

React следит за тем, какой компонент рендерится в данный момент. Благодаря [правилам хуков](/docs/hooks-rules.html), мы знаем, что хуки вызываются только из React-компонентов (пользовательские хуки также вызываются только из React-компонентов).

Существует внутренний список `ячеек памяти`, связанных с каждым компонентом. Они являются JavaScript-объектами, в которых мы можем хранить некоторые данные. Когда вызывается некий хук, например `useState()`, он читает значение текущей ячейки (или инициализирует её во время первого рендера) и двигает указатель на следующую. Таким способом каждый вызов `useState()` получит своё независимое состояние.

### Что послужило прообразом хуков? {#what-is-the-prior-art-for-hooks}

Хуки были основаны на следующих идеях и экспериментах:

* Наши старые эксперименты с функциональным API в репозитории [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State).
* Эксперименты с API рендер-пропс от React-сообщества, включая [компонент Reactions](https://github.com/reactions/component) от [Райна Флоренса (Ryan Florence)](https://github.com/ryanflorence).
* [Dominic Gannaway](https://github.com/trueadm) и его предложение [ключевого слова `adopt`](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067), в качестве синтаксического сахара для паттерна рендер-пропс.
* Переменные и ячейки состояния в [DisplayScript](http://displayscript.org/introduction.html).
* [Компоненты-редюсеры](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) в ReasonReact.
* [Подписки](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) в Rx.
* [Алгебраические эффекты](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) в Multicore OCaml.

[Себастьян Маркбаге (Sebastian Markbåge)](https://github.com/sebmarkbage) предложил изначальный дизайн хуков, который позднее улучшили [Эндрю Кларк (Andrew Clark)](https://github.com/acdlite), [Софи Алперт (Sophie Alpert)](https://github.com/sophiebits), [Доминик Ганнауэй (Dominic Gannaway)](https://github.com/trueadm) и другие участники команды React.
