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

* [Внедрение хуков](#adoption-strategy)
  * [В какой версии React появились хуки?](#which-versions-of-react-include-hooks)
  * [Нужно ли переписать все мои классовые компоненты?](#do-i-need-to-rewrite-all-my-class-components)
  * [Что можно сделать с помощью хуков, чего невозможно добиться, используя классы?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Какая часть моих знаний о React всё ещё актуальна?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Что мне использовать: хуки, классы или оба подхода?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Дают ли хуки все возможности классов?](#do-hooks-cover-all-use-cases-for-classes)
  * [Являются ли хуки заменой рендер-пропсам и компонентам высшего порядка?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Как хуки повлияют на популярные API, такие как Redux `connect()` и React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Поддерживают ли хуки статическую типизацию?](#do-hooks-work-with-static-typing)
  * [Как тестировать компоненты, которые используют хуки?](#how-to-test-components-that-use-hooks)
  * [Что конкретно проверяют правила линтера в хуках?](#what-exactly-do-the-lint-rules-enforce)
* [От классов к хукам](#from-classes-to-hooks)
  * [Как методы жизненного цикла соответствуют хукам?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Как осуществлять запросы данных с помощью хуков?](#how-can-i-do-data-fetching-with-hooks)
  * [Существует что-нибудь наподобие полей экземпляра?](#is-there-something-like-instance-variables)
  * [Сколько переменных состояния я могу использовать – одну или несколько?](#should-i-use-one-or-many-state-variables)
  * [Могу ли я использовать эффект только на обновлениях компонента?](#can-i-run-an-effect-only-on-updates)
  * [Как получить предыдущие пропсы или состояние?](#how-to-get-the-previous-props-or-state)
  * [Почему я вижу устаревшие пропсы или состояние в моей функции?](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [Как я могу реализовать `getDerivedStateFromProps`?](#how-do-i-implement-getderivedstatefromprops)
  * [Существует что-нибудь наподобие forceUpdate?](#is-there-something-like-forceupdate)
  * [Могу ли я изменить реф, переданный в функциональный компонент?](#can-i-make-a-ref-to-a-function-component)
  * [Как я могу измерить узел DOM?](#how-can-i-measure-a-dom-node)
  * [Что значит `const [thing, setThing] = useState()`?](#what-does-const-thing-setthing--usestate-mean)
* [Оптимизации производительности](#performance-optimizations)
  * [Могу ли я пропустить эффект при обновлениях?](#can-i-skip-an-effect-on-updates)
  * [Безопасно ли не указывать функции в списке зависимостей?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [Что делать, если зависимости эффекта изменяются слишком часто?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [Как я могу реализовать `shouldComponentUpdate`?](#how-do-i-implement-shouldcomponentupdate)
  * [Как закешировать вычисления?](#how-to-memoize-calculations)
  * [Как лениво создавать большие объекты?](#how-to-create-expensive-objects-lazily)
  * [Являются ли хуки медленными из-за создания функций на каждом рендере?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Как избежать передачи колбэков вниз?](#how-to-avoid-passing-callbacks-down)
  * [Как получить часто изменяемое значение из хука `useCallback`?](#how-to-read-an-often-changing-value-from-usecallback)
* [Под капотом](#under-the-hood)
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

Поддержка хуков в React Native появилась в версии 0.59.

### Надо ли переписать все мои классовые компоненты? {#do-i-need-to-rewrite-all-my-class-components}

Нет, мы [не собираемся](/docs/hooks-intro.html#gradual-adoption-strategy) удалять классы из React, поскольку никто не может позволить себе такой глобальный рефакторинг. Мы советуем пробовать хуки только в новом коде.

### Что можно сделать с помощью хуков, чего невозможно добиться, используя классы? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Хуки дают новый мощный способ повторного использования кода в компонентах. [«Создание пользовательских хуков»](/docs/hooks-custom.html) даёт представление об их возможностях. [Эта статья](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889), написанная одним из участников команды React, описывает новые возможности, которые открывают хуки.

### Какая часть моих знаний о React всё ещё актуальна? {#how-much-of-my-react-knowledge-stays-relevant}

Хуки -- это новый способ использовать возможности React, которые вы уже знаете: состояние, жизненный цикл, контекст и рефы. Хуки не изменили фундаментальную логику React, поэтому ваши знания компонентов, пропсов и нисходящего потока данных остаются актуальными.

Однако, хуки -- не самая простая часть React. Если вам чего-то не хватает в этой документации, [дайте нам знать](https://github.com/reactjs/reactjs.org/issues/new), и мы постараемся вам помочь.

### Что мне использовать: хуки, классы или оба подхода? {#should-i-use-hooks-classes-or-a-mix-of-both}

Мы рекомендуем начать с использования хуков в новых компонентах, когда вы будете готовы. Убедитесь, что каждый человек в вашей команде поддерживает вас и знаком с документацией. Мы не рекомендуем переписывать все существующие классы на хуки, пока нет необходимости возвращаться к определённому компоненту (например, чтобы исправить баг).

Вы не можете использовать хуки *внутри* классового компонента, но вы можете комбинировать классы и функциональные компоненты с хуками в одном дереве. Является ли компонент классовым или функциональным с использованием хуков -- неважно, это всего лишь особенность реализации. Мы ожидаем, что в будущем хуки станут главным способом написания React-компонентов.

### Дают ли хуки все возможности классов? {#do-hooks-cover-all-use-cases-for-classes}

Наша главная задача, чтобы хуки покрывали всю функциональность классов в ближайшем будущем. Пока не существует хуков, реализующих методы жизненного цикла  `getSnapshotBeforeUpdate` и `componentDidCatch`, но мы планируем скоро их добавить.

Хуки появились совсем недавно, и некоторые сторонние библиотеки могут быть ещё не совместимы с ними.

### Являются ли хуки заменой рендер-пропсам и компонентам высшего порядка? {#do-hooks-replace-render-props-and-higher-order-components}

Как правило, рендер-пропсы и компоненты высшего порядка рендерят только один дочерний компонент, увеличивая вложенность в дереве, но добавляя потомку новую функциональность. Мы думаем, что хуки — более простой способ сделать это. Оба подхода всё ещё имеют право на жизнь (например, компонент, следящий за скроллом, может иметь проп `renderItem` или компонент-контейнер может иметь разные рендер-пропсы для различных слотов). Но в большинстве случаев хуки должны помочь уменьшить вложенность компонентов в вашем дереве.

### Как хуки повлияют на популярные API, такие как Redux `connect()` и React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Вы можете продолжить использовать тот же самый API, который вы использовали – всё продолжит работать как прежде.

Начиная с версии 7.1.0, React Redux [поддерживает API хуков](https://react-redux.js.org/api/hooks) и предоставляет такие хуки как `useDispatch` и `useSelector`.

В будущем библиотеки наподобие React Router могут также начать предоставлять хуки.

### Поддерживают ли хуки статическую типизацию? {#do-hooks-work-with-static-typing}

Хуки спроектированы с учётом статической типизации. Так как они являются функциями, их легче правильно типизировать чем, например, компоненты высшего порядка. Последние версии определений типов React для Flow и TypeScript поддерживают хуки.

Заметьте, что пользовательские хуки дают вам возможность накладывать ограничения на API React, если вы хотите типизировать их более строго каким-то образом. React предоставляет примитивы, которые вы можете комбинировать по своему усмотрению даже такими способами, которые и не были изначально предусмотрены.

### Как тестировать компоненты, которые используют хуки? {#how-to-test-components-that-use-hooks}

С точки зрения React, компонент, использующий хуки, является обычным компонентом. Если ваш способ тестирования не опирается на внутреннюю реализацию React, тестирование компонентов с хуками не должно отличатся от тестирования других компонентов.

>Примечание
>
>[Рецепты Тестирования](/docs/testing-recipes.html) включают в себя множество примеров, которые вы можете скопировать себе.

Например, у нас есть следующий компонент-счётчик:

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Вы кликнули ${count} раз`;
  });
  return (
    <div>
      <p>Вы кликнули {count} раз</p>
      <button onClick={() => setCount(count + 1)}>
        Кликни меня
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
  expect(label.textContent).toBe('Вы кликнули 0 раз');
  expect(document.title).toBe('Вы кликнули 0 раз');

  // Тестируем второй рендер и эффект
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Вы кликнули 1 раз');
  expect(document.title).toBe('Вы кликнули 1 раз');
});
```

Вызовы `act()` также запустят эффекты внутри.

Если вам надо протестировать пользовательский хук, вы можете создать компонент в ваших тестах и использовать в нём этот хук. После этого вы можете протестировать сам компонент.

Для уменьшения однотипного кода, мы советуем использовать библиотеку [React Testing Library](https://testing-library.com/react). Она была создана для написания тестов, использующих ваши компоненты и имитирующих поведение пользователей в браузере.

За более подробной информацией обратитесь к [Рецептам Тестирования](/docs/testing-recipes.html).

### Что конкретно проверяют [правила линтера](https://www.npmjs.com/package/eslint-plugin-react-hooks) в хуках?{#what-exactly-do-the-lint-rules-enforce}

Мы предоставляем [плагин к ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks), который принуждает следовать [правилам хуков](/docs/hooks-rules.html), чтобы избежать ошибок. Подразумевается, что любая функция, имя который начинается с «`use`» и заглавной буквы далее, является хуком. Мы понимаем, что это предположение не идеальное, и могут случаться ложные срабатывания. Однако, без этого важного соглашения, было бы невозможно заставить хуки работать хорошо, а более длинные имена могли бы помешать людям начать использовать хуки или следовать соглашению.

Правила линтера проверяют, что:

* Вызовы хуков происходят либо внутри функции с именем, написанном в стиле `PascalCase` (подразумевается, что это компонент), либо внутри другой функции `useSomething` (подразумевается, что это пользовательский хук).

* Хуки вызываются в одном и том же порядке при каждом рендере.

Существует ещё несколько предположений, которые могут измениться по мере того, как мы будем регулировать правила и искать баланс между нахождением ошибок и ложными срабатываниями.

## От классов к хукам {#from-classes-to-hooks}

### Как методы жизненного цикла соответствуют хукам? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Функциональному компоненту не нужен конструктор. Вы можете инициализировать состояние, используя вызов [`useState`](/docs/hooks-reference.html#usestate). Если вычисления состояния затратны, вы можете передать функцию в `useState`.

* `getDerivedStateFromProps`: Запланировать обновление [при рендере](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Смотрите объяснение `React.memo` [ниже](#how-do-i-implement-shouldcomponentupdate).

* `render`: Это тело функционального компонента.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: [Хук `useEffect`](/docs/hooks-reference.html#useeffect) заменяет все их комбинации (включая [более](#can-i-skip-an-effect-on-updates) [редкие](#can-i-run-an-effect-only-on-updates) случаи).

* `componentDidCatch` и `getDerivedStateFromError`: В данный момент не существует хуков-аналогов для этих методов, но они будут скоро добавлены.

### Как осуществлять запросы за данными с помощью хуков? {#how-can-i-do-data-fetching-with-hooks}

Посмотрите [небольшое демо](https://codesandbox.io/s/jvvkoo8pq3), а затем ознакомьтесь [со статьёй](https://www.robinwieruch.de/react-hooks-fetch-data/), которая рассказывает как делать запросы данных с помощью хуков.

### Есть ли что-то вроде переменных экземпляра? {#is-there-something-like-instance-variables}

Да! Хук [`useRef()`](/docs/hooks-reference.html#useref) может использоваться не только для DOM-рефов. Реф – это общий контейнер, а его свойство `current` -- изменяемое и может хранить любое значение, подобно свойству экземпляра класса.


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

Для объявления интервала нам не понадобится реф (`id` может быть локальным относительно эффекта). Но это будет полезно, если потребуется сбросить интервал из обработчика события:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

В целом вы можете рассматривать рефы как свойства экземпляра класса. Старайтесь избегать установки рефов во время рендера, пока вы не реализуете [ленивую инициализацию](#how-to-create-expensive-objects-lazily), так как это может привести к неожиданному поведению. Как правило, вы будете изменять рефы в обработчиках событий и эффектах.

### Сколько переменных состояния я могу использовать – одну или несколько? {#should-i-use-one-or-many-state-variables}

Если вы привыкли писать классовые компоненты, вы скорее всего захотите вызывать `useState()` однократно и сразу сохранить всё состояние в одном объекте. Да, вы можете так сделать. Взгляните на пример компонента, который следует за движением курсора. Мы храним позицию и размер этого компонента в локальном состоянии.

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Допустим, мы хотим написать некоторую логику, которая будет изменять значения `left` и `top`, когда пользователь двигает курсор мышки. Обратите внимание, что мы обязаны объединить эти поля с предыдущим объектом состояния вручную:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Использование "...state" гарантирует, что мы не потеряем width и height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Примечание: эта реализация немного упрощена
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Код написан так, потому что мы обновляем переменную состояния, *заменяя* её значение. Данное поведение отличается от `this.setState`, ведь этот классовый метод *объединяет* изменённые поля с текущим объектом состояния.

Если вам не хватает автоматического объединения состояния, вы можете написать свой хук `useLegacyState`, который объединяет обновления состояния объекта. Однако, вместо этого **мы рекомендуем разделять состояние на несколько переменных, учитывая, какие свойства логически относятся друг к другу и будут изменяться вместе.**

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

Это довольно редкий случай. Вы можете [использовать изменяемый реф](#is-there-something-like-instance-variables), чтобы вручную хранить логическое значение, показывающее, прошёл ли первый рендер. В свою очередь эффект может опираться на это значение. Если вы замечаете, что эта логика нужна вам часто, вы можете вынести её в отдельный хук.

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

Это может показаться усложнённым, но вы можете вынести эту логику в отдельный хук:

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

Возможно, в будущем API React введёт хук `usePrevious`, так как он требуется довольно часто.

Также смотрите [рекомендованный паттерн для производного состояния](#how-do-i-implement-getderivedstatefromprops).

### Почему я вижу устаревшие пропсы или состояние в моей функции? {#why-am-i-seeing-stale-props-or-state-inside-my-function}

Любая функция внутри компонента, включая эффекты и обработчики событий, «видит» пропсы и состояние из функции `render()`, в которой она была создана. Рассмотрим такой код:

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('Вы кликнули по: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>Вы кликнули {count} раз(а)</p>
      <button onClick={() => setCount(count + 1)}>
        Кликни меня
      </button>
      <button onClick={handleAlertClick}>
        Показать предупреждение
      </button>
    </div>
  );
}
```

Если вы сперва кликните по "Показать предупреждение", а потом увеличите счётчик, то предупреждение отобразит значение переменной `count` **на момент нажатия по кнопке "Показать предупреждение"**. Такое поведение предотвращает баги в коде, который предполагает, что пропсы и состояние не меняются.

Если вы намеренно хотите считать из асинхронного колбэка *свежайшее* состояние, вы можете сперва сохранить его [в реф](/docs/hooks-faq.html#is-there-something-like-instance-variables), потом изменить его и затем считать его из рефа.

Наконец, возможна другая ситуация, почему вы видите устаревшие пропсы или состояние: когда вы используете оптимизацию с помощью «массива зависимостей», но неправильно указали какие-то зависимости. Например, если эффект передаёт вторым параметром `[]`, но при этом использует `someProp`, то он продолжит «видеть» исходное значение `someProp`. Правильным решением является либо исправление массива, либо отказ от его использования.
По этим ссылкам описаны [подходы к функциям](#is-it-safe-to-omit-functions-from-the-list-of-dependencies) в аналогичных ситуациях и [другие известные способы](#what-can-i-do-if-my-effect-dependencies-change-too-often) снижения частоты вызова эффектов, исключающие передачу неправильных зависимостей.

>Примечание
>
>Мы предоставляем правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) в нашем пакете линтера [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Оно предупреждает о неправильно указанных зависимостях и рекомендует их исправить.

### Как я могу реализовать `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

Несмотря на то, что вам скорее всего [это не нужно](/blog/2018/06/07/you-probably-dont-need-derived-state.html), в редких случаях (например, для реализации компонента `<Transition>`), вы можете изменять состояние прямо во время рендера. React моментально сделает повторный рендер компонента с обновлённым состоянием сразу после первого рендера, и это не будет затратно.

В этом примере, мы храним предыдущее значение пропа `row` в состоянии, что позволяет сравнить значения:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row изменился с прошлого рендера. Обновляем isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Прокрутка вниз: ${isScrollingDown}`;
}
```

Сперва это может показаться странным, но изменение во время рендера – это именно то, чем всегда концептуально являлся метод `getDerivedStateFromProps`.

### Существует что-нибудь наподобие forceUpdate? {#is-there-something-like-forceupdate}

Оба хука `useState` и `useReducer` [игнорируют обновления](/docs/hooks-reference.html#bailing-out-of-a-state-update), если следующее значение равно предыдущему. Мутация состояния и вызов `setState` не приведут к повторному рендеру.

Обычно, вы не должны мутировать внутреннее состояние в React. Однако, в качестве лазейки, вы можете использовать увеличивающийся счётчик, чтобы заставить компонент повторно рендериться, если состояние не изменилось:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Старайтесь избегать этого подхода, если возможно.

### Могу ли я изменить реф, переданный в функциональный компонент? {#can-i-make-a-ref-to-a-function-component}

Несмотря на то, что вам не понадобится это часто, вы можете предоставить некоторые императивные методы родительскому компоненту, используя хук [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### Как я могу измерить узел DOM? {#how-can-i-measure-a-dom-node}

Для определения положения или размера DOM-узла можно использовать [колбэк-реф](/docs/refs-and-the-dom.html#callback-refs). React будет вызывать этот колбэк всякий раз, когда реф привязывается к другому узлу. Вот [небольшая демонстрация](https://codesandbox.io/s/l7m0v5x4v9):

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Привет, мир</h1>
      <h2>Заголовок выше имеет высоту {Math.round(height)} пикселей</h2>
    </>
  );
}
```

Мы не выбрали `useRef` в этом примере, потому что объект рефа не уведомляет нас об *изменениях* текущего значения рефа. Использование колбэк-рефа гарантирует, что [даже если дочерний компонент отображает измеренный узел позже](https://codesandbox.io/s/818zzk8m78) (например, в ответ на клик), мы по-прежнему получаем уведомление об этом в родительском компоненте и можем обновлять измерения.

Обратите внимание, что мы передаём `[]` как массив зависимостей в `useCallback`. Это гарантирует, что наш колбэк-реф не изменится между повторными рендерами, а значит React не будет вызывать его без необходимости.

При желании вы можете [извлечь эту логику](https://codesandbox.io/s/m5o42082xy) в повторно используемый хук:

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Привет, мир</h1>
      {rect !== null &&
      <h2>Заголовок выше имеет высоту {Math.round(rect.height)} пикселей</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```

### Что значит `const [thing, setThing] = useState()`? {#what-does-const-thing-setthing--usestate-mean}

Если вы не знакомы с этим синтаксисом, ознакомьтесь с [объяснением](/docs/hooks-state.html#tip-what-do-square-brackets-mean) в документации хука состояния.


## Оптимизации производительности {#performance-optimizations}

### Могу ли я пропустить эффект при обновлениях? {#can-i-skip-an-effect-on-updates}

Да. Ознакомьтесь с [условным вызовом эффектов](/docs/hooks-reference.html#conditionally-firing-an-effect). Обратите внимание, что забыв обработать обновления, вы зачастую можете [создать ошибки](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update). Поэтому это и не является поведением по умолчанию.

### Безопасно ли не указывать функции в списке зависимостей? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

Вообще говоря, это небезопасно.

```js{3,8}
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 Так делать небезопасно (вызывать `doSomething`, который использует `someProp`)
}
```

Сложно помнить, какие пропсы и состояние используются функцией определённой вне эффекта. Именно поэтому, **лучше объявлять функции нужные эффекту *внутри* него**. Тогда легче увидеть, от каких значений из области видимости компонента зависит эффект:

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ Правильно (наш эффект использует только `someProp`)
}
```

Если после такого изменения мы видим, что никакие значения из области видимости компонента не используются, то можно безопасно указать `[]`:

```js{7-8}
useEffect(() => {
  function doSomething() {
    console.log('Привет');
  }

  doSomething();
}, []); // ✅ Так можно поступить в этом примере, потому что
        // нет зависимости от значений из области видимости компонента
```

В зависимости от ситуации, может пригодиться один из вариантов, описанных ниже.

>Примечание
>
>Мы предоставляем правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) в пакете нашего линтера [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Оно поможет выявлять компоненты, не обрабатывающие обновления консистентно.

Давайте разберёмся, почему это важно.

Когда вы указываете [список зависимостей](/docs/hooks-reference.html#conditionally-firing-an-effect) через последний аргумент хуков `useEffect`, `useMemo`, `useCallback` или `useImperativeHandle`, в него должны войти все использованные значения, которые задействованы в потоке данных React, включая пропсы, состояние и их производные.

Безопасно опускать в списке **только** те функции, которые не используют ни сами, ни через функции, которые они вызывают, пропсы, состояние или их производные. Так, в следующем примере показан баг:

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product' + productId); // Использует проп productId
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 Неправильно, потому что `fetchProduct` использует `productId`
  // ...
}
```

**Рекомендовано исправлять такой код, перемещая функцию _внутрь_ вашего эффекта**. Это помогает замечать, какие пропсы и состояние используются вашим эффектом, и убедиться, что они перечислены в списке зависимостей:

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Переместив эту функцию внутрь эффекта, мы ясно видим, какие значения она использует.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Правильно, потому что эффект использует только productId
  // ...
}
```

Это также позволяет обрабатывать ответы, пришедшие не в порядке запросов, с помощью локальной переменной внутри эффекта:

```js{2,6,10}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }
    fetchProduct();
    return () => { ignore = true };
  }, [productId]);
```

Мы переместили функцию внутрь эффекта, так что её не нужно указывать в списке зависимостей.

>Совет
>
>Посмотрите [этот небольшой пример](https://codesandbox.io/s/jvvkoo8pq3) и [эту статью](https://www.robinwieruch.de/react-hooks-fetch-data/), чтобы узнать больше о загрузке данных с помощью хуков.

**Если по какой-то причине вы _не_ можете переместить функцию в эффект, есть другие варианты:**

* **Можно попробовать поместить функцию снаружи компонента**. В таком случае она гарантированно не будет ссылаться на пропсы и состояние, так что её не требуется перечислять в списке зависимостей.
* Если функция, которую вы вызываете, является чистым вычислением и её безопасно вызывать во время рендера, вы можете **вызвать её снаружи эффекта, а не внутри**, и сделать эффект зависящим от результата этого вызова, а не от самой функции.
* В крайнем случае можете **добавить саму функцию в список зависимостей эффекта, но _обернув её определение_** в хук [`useCallback`](/docs/hooks-reference.html#usecallback). Тогда функция будет оставаться неизменной, до тех пор, пока не изменятся её зависимости:

```js{2-5,13}
function ProductPage({ productId }) {
  // ✅ Оборачиваем в useCallback, чтобы избежать изменений при каждом рендере
  const fetchProduct = useCallback(() => {
    // ... Что-то делаем с productId ...
  }, [productId]); // ✅ Перечисляем все зависимости useCallback

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct })
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ Перечисляем все зависимости useEffect
  // ...
}
```

Заметьте, что в примере выше мы всё ещё **должны** указать функцию в списке зависимостей. Тогда гарантируется, что изменение пропа `productId` у `ProductPage` приведёт к повторному запрашиванию данных в компоненте `ProductDetails`.

### Что делать, если зависимости эффекта изменяются слишком часто? {#what-can-i-do-if-my-effect-dependencies-change-too-often}

Бывают случаи, когда эффект может зависеть от состояния, которое очень часто изменяется. У вас может возникнуть желание не включать это состояние в список зависимостей хука, но это как правило приводит к багам:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Этот эффект зависит от переменной состояния `count`
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Баг: `count` не указан в качестве зависимости

  return <h1>{count}</h1>;
}
```

Пустой набор зависимостей `[]` означает, что эффект будет выполняться только один раз, когда компонент монтируется, а не при каждом повторном рендере. Проблема в том, что внутри обратного вызова `setInterval` значение `count` не изменяется, потому что мы создали замыкание со значением `count`, установленным в `0`, как это было при выполнении обратного вызова эффекта. Каждую секунду этот обратный вызов вызывает `setCount(0 + 1)`, поэтому счетчик никогда не превышает 1.

Если переписать список зависимостей как `[count]`, то баг будет устранён, но это приведёт к сбрасыванию интервала при каждом изменении. Такое поведение может быть нежелательно. Чтобы исправить это, мы можем применить [форму функционального обновления хука `setState`](/docs/hooks-reference.html#functional-updates), которая позволяет указать, *как* должно меняться состояние, не ссылаясь явно на *текущее* состояние:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ Эта строчка не зависит от внешней переменной `count`
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ Наш эффект не использует никаких переменных из области видимости компонента

  return <h1>{count}</h1>;
}
```

(Идентичность функции `setCount` гарантирована, поэтому её можно безопасно не включать в список зависимостей.)

Теперь обратный вызов `setInterval` выполняется один раз в секунду, но каждый раз, когда внутренний вызов `setCount` может использовать обновленное значение для `count` (называемое `c` в обратном вызове здесь.)

В более сложных случаях (например, когда одно состояние зависит от другого), попробуйте перенести логику обновления состояния из хука эффекта в хук [`useReducer`](/docs/hooks-reference.html#usereducer). [Эта статья](https://adamrackis.dev/state-and-use-reducer/) иллюстрирует пример того, как это сделать. **Идентичность функции `dispatch` из хука `useReducer` всегда стабильна** — даже если функция редюсера объявлена внутри компонента и считывает его пропсы.

В крайнем случае если вы хотите реализовать что-то наподобие `this` в классах, вы можете [использовать реф](/docs/hooks-faq.html#is-there-something-like-instance-variables), чтобы хранить в нём изменяемую переменную. Тогда можно писать и читать из него. Например:

```js{2-6,10-11,16}
function Example(props) {
  // Сохраняем свежайшие значения пропсов в ref
  let latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Считываем свежайшие значения пропсов в любое время
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // Этот эффект никогда не исполняется повторно
}
```

Рекомендуется прибегать к этому подходу только если не удалось найти лучшей альтернативы, поскольку компоненты, полагающиеся на изменчивость, менее предсказуемы. Если какой-то конкретный паттерн плохо получается выразить, [откройте ишью на GitHub](https://github.com/facebook/react/issues/new) с примером исполняемого кода и мы постараемся помочь.

### Как я могу реализовать `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

Вы можете обернуть функциональный компонент в вызов `React.memo` для поверхностного сравнения его пропсов:

```js
const Button = React.memo((props) => {
  // ваш компонент
});
```

Это функция не является хуком, так как она не ведёт себя как хук. `React.memo` аналогична `PureComponent`, но она сравнивает только пропсы. (Вы также можете добавить второй аргумент, чтобы определить свою функцию сравнения, которая примет старые и новые пропсы. Если эта функция вернёт `true`, обновление будет пропущено.)

`React.memo` не сравнивает состояние, потому что не существует единого объекта, который можно сравнить. Но вы можете также сделать дочерние компоненты чистыми или даже [оптимизировать определённые дочерние компоненты, используя хук `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### Как закешировать вычисления? {#how-to-memoize-calculations}

Хук [`useMemo`](/docs/hooks-reference.html#usememo) позволяет вам закешировать вычисления между несколькими рендерами, путём запоминания прошлого результата:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Этот код вызовет `computeExpensiveValue(a, b)`. Но если зависимости `[a, b]` не изменились с прошлого рендера, `useMemo` пропустит повторный вызов и повторно использует значения, которые он вернул в прошлый раз.

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

Хук `useMemo` позволяет вам [закешировать ресурсозатратные вычисления](#how-to-memoize-calculations), если зависимости не изменились. Однако, этот способ **не гарантирует**, что повторных вычислений не случится. Иногда вам нужно удостовериться, что объект будет создан только один раз.

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
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // Когда он вам понадобится, вызовите getObserver()
  // ...
}
```

Этот подход позволяет избежать создания больших объектов на всех этапах, кроме первого рендера, когда это действительно необходимо. Если вы используете Flow или TypeScript, вы можете также установить для `getObserver()` непустой тип для уверенности.

### Являются ли хуки медленными из-за создания функций на каждом рендере? {#are-hooks-slow-because-of-creating-functions-in-render}

Нет. В современных браузерах сырая производительность замыканий не сильно отличается от классов, кроме особых случаев.

Также учитывайте, что реализация хуков более эффективна по нескольким причинам:

* Хуки не требуют больших затрат, которые неизбежны в классах. Например, создание экземпляра класса и связывание обработчиков событий в конструкторе.

* **Проект, полностью написанный на хуках, имеет менее глубокое дерево компонентов**. В случае использования рендер-пропсов, компонентов высшего порядка или контекста, финальное дерево компонентов было бы в несколько раз больше. Тут стоит понимать, что чем меньше дерево компонентов, тем меньше работы React должен делать.

Традиционно, проблемы с оптимизацией встроенных функций в React связаны с тем, как передача новых колбэков на каждом рендере ломает оптимизации `shouldComponentUpdate` в дочерних компонентах. Подход с хуками может решить эту проблему тремя способами.

* Хук [`useCallback`](/docs/hooks-reference.html#usecallback) позволяет сохранять ту же самую ссылку на колбэк между повторными рендерами, поэтому `shouldComponentUpdate` продолжит корректную работу:

    ```js{2}
    // Не создастся заново, пока `a` или `b` не изменятся
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* Хук [`useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) облегчает контроль, когда конкретный дочерний компонент должен обновляться, уменьшая нужду в использовании чистых компонентов.

* Наконец, хук [`useReducer`](/docs/hooks-reference.html#usereducer) уменьшает необходимость передавать колбэки глубоко вниз по дереву, как описано ниже.

### Как избежать передачи колбэков вниз? {#how-to-avoid-passing-callbacks-down}

Мы поняли, что большинству разработчиков не нравится вручную передавать колбэки вниз на каждом уровне дерева компонентов. Даже учитывая, что этот подход более явный, это может показаться чересчур громоздким.

В качестве альтернативы для больших деревьев компонентов мы рекомендуем передавать вниз функцию `dispatch` из хука [`useReducer`](/docs/hooks-reference.html#usereducer) через контекст:

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

Любой дочерний компонент в дереве внутри `TodosApp` может использовать функцию `dispatch`, чтобы передать объекты-действия в `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // Если мы хотим выполнить действие, мы можем получить dispatch из контекста.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'Привет' });
  }

  return (
    <button onClick={handleClick}>Добавить задание</button>
  );
}
```

Этот вариант более удобен как с точки зрения поддержки кода (не нужно добавлять пропсы для новых колбэков), так и в разрезе избежания общих проблем с колбэками. Передача функции `dispatch` по такому принципу – это рекомендуемый подход для вызова колбэков и избежания нежелательных обновлений в глубине дерева компонентов.

Обратите внимание, что вы также можете передавать *состояние* приложения вниз через пропсы (более явно) или через контекст (более удобно для глубокого дерева). Если ваш контекст в том числе передаёт некое состояние, используйте два разных типа контекста. Так как контекст `dispatch` никогда не изменяется, то компоненты, использующие его, не будут нуждаться в повторном рендере, если только им не требуется ещё и контекст с состоянием приложения.

### Как получить часто изменяемое значение из хука `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

> Примечание
>
> Мы рекомендуем [передавать `dispatch` вниз через контекст](#how-to-avoid-passing-callbacks-down) вместо передачи отдельных колбэков через пропсы. Следующий подход приведён тут только для полноты картины в качестве лазейки.
>
> Также обратите внимание, что этот подход может вызвать проблемы в [параллельном режиме](/blog/2018/03/27/update-on-async-rendering.html). Мы планируем предоставить более удобные альтернативы в будущем, но самый безопасный вариант сейчас -- всегда отменять колбэк, если значение, на которое он опирается, поменялось.

В некоторых редких случаях, вам может понадобится закешировать колбэк с помощью хука [`useCallback`](/docs/hooks-reference.html#usecallback), но кеширование не будет работать хорошо, потому что внутренняя функция будет пересоздаваться слишком часто. Если функция, которую вы кешируете, является обработчиком событий и не используется во время рендера, вы можете использовать [реф в качестве свойства экземпляра](#is-there-something-like-instance-variables), и вручную сохранить туда последнее значение:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Записать это в реф
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

  useEffect(() => {
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
