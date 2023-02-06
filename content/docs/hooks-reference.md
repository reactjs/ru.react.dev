---
id: hooks-reference
title: Справочник API хуков
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Хуки* — нововведение в React 16.8, которое позволяет использовать состояние и другие возможности React без написания классов.

На этой странице описан API, относящийся к встроенным хукам React.

Если вы новичок в хуках, вы можете сначала ознакомиться с [общим обзором](/docs/hooks-overview.html). Вы также можете найти полезную информацию в главе [«Хуки: ответы на вопросы»](/docs/hooks-faq.html).

- [Основные хуки](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Дополнительные хуки](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)
  - [`useDeferredValue`](#usedeferredvalue)
  - [`useTransition`](#usetransition)
  - [`useId`](#useid)
- [Library Hooks](#library-hooks)
  - [`useSyncExternalStore`](#usesyncexternalstore)
  - [`useInsertionEffect`](#useinsertioneffect)

## Основные хуки {#basic-hooks}

### `useState` {#usestate}

> Try the new React documentation for [`useState`](https://beta.reactjs.org/reference/react/useState).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
const [state, setState] = useState(initialState);
```

Возвращает значение с состоянием и функцию для его обновления.

Во время первоначального рендеринга возвращаемое состояние (`state`) совпадает со значением, переданным в качестве первого аргумента (`initialState`).

Функция `setState` используется для обновления состояния. Она принимает новое значение состояния и ставит в очередь повторный рендер компонента.

```js
setState(newState);
```

Во время последующих повторных рендеров первое значение, возвращаемое `useState`, всегда будет самым последним состоянием после применения обновлений.

>Примечание
>
>React гарантирует, что идентичность функции `setState` стабильна и не изменяется при повторных рендерах. Поэтому её можно безопасно не включать в списки зависимостей хуков `useEffect` и `useCallback`.

#### Функциональные обновления {#functional-updates}

Если новое состояние вычисляется с использованием предыдущего состояния, вы можете передать функцию в `setState`. Функция получит предыдущее значение и вернёт обновлённое значение. Вот пример компонента счётчик, который использует обе формы `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Счёт: {count}
      <button onClick={() => setCount(initialCount)}>Сбросить</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

Кнопки «+» и «-» используют функциональную форму, потому что обновлённое значение основано на предыдущем значении. Но кнопка «Сбросить» использует обычную форму, потому что она всегда устанавливает счётчик обратно в 0.

Если функция обновления возвращает абсолютно такой же результат как и текущее состояние, то последующие повторные рендеры будут полностью пропущены.

> Примечание
>
> В отличие от метода `setState`, который вы можете найти в классовых компонентах, `useState` не объединяет объекты обновления автоматически. Вы можете повторить это поведение, комбинируя форму функции обновления с синтаксисом расширения объекта:
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>   // Object.assign также будет работать
>   return {...prevState, ...updatedValues};
> });
> ```
>
> Другой вариант – `useReducer`, который больше подходит для управления объектами состояния, содержащими несколько значений.

#### Ленивая инициализация состояния {#lazy-initial-state}

Аргумент `initialState` – это состояние, используемое во время начального рендеринга. В последующих рендерах это не учитывается. Если начальное состояние является результатом дорогостоящих вычислений, вы можете вместо этого предоставить функцию, которая будет выполняться только при начальном рендеринге:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### Досрочное прекращение обновления состояния {#bailing-out-of-a-state-update}

Если вы обновите состояние хука тем же значением, что и текущее состояние, React досрочно выйдет из хука без повторного рендера дочерних элементов и запуска эффектов. (React использует [алгоритм сравнения `Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Обратите внимание, что для React всё ещё может быть необходим повторный рендер этого компонента. Это не должно быть проблемой, потому что React не будет сильно «углубляться» в дерево. Если вы делаете дорогостоящие вычисления во время рендеринга, вы можете оптимизировать их с помощью `useMemo`.

#### Группировка обновлений состояния {#batching-of-state-updates}

React может группировать несколько обновлений состояния в один повторный рендер для улучшения производительности. Обычно это улучшает производительность и не должно влиять на поведение вашего приложения.

До 18 версии React группировал только обновления внутри обработчиков событий. Начиная с 18 версии, [группировка включена по умолчанию для всех обновлений](/blog/2022/03/08/react-18-upgrade-guide.html#automatic-batching). Обратите внимание, что если обновления вызваны несколькими *различными* действиями пользователя -- например, пользователь дважды кликнул на кнопку -- то они обрабатываются раздельно и не будут сгруппированы. Это позволяет избежать логических ошибок.

В редких случаях, когда вам нужно вызвать принудительное синхронное обновление DOM, вы можете обернуть его в [`flushSync`](/docs/react-dom.html#flushsync). Однако это может вызвать ухудшение производительности, используйте это только в тех случаях, где это действительно нужно.

### `useEffect` {#useeffect}

> Try the new React documentation for [`useEffect`](https://beta.reactjs.org/reference/react/useEffect).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
useEffect(didUpdate);
```

Принимает функцию, которая содержит императивный код, возможно, с эффектами.

Мутации, подписки, таймеры, логирование и другие побочные эффекты не допускаются внутри основного тела функционального компонента (называемого _этапом рендеринга_ React). Это приведёт к запутанным ошибкам и несоответствиям в пользовательском интерфейсе.

Вместо этого используйте `useEffect`. Функция, переданная в `useEffect`, будет запущена после того, как рендер будет зафиксирован на экране. Думайте об эффектах как о лазейке из чисто функционального мира React в мир императивов.

По умолчанию эффекты запускаются после каждого завершённого рендеринга, но вы можете решить запускать их [только при изменении определённых значений](#conditionally-firing-an-effect).

#### Очистка эффекта {#cleaning-up-an-effect}

Часто эффекты создают ресурсы, которые необходимо очистить (или сбросить) перед тем, как компонент покидает экран, например подписку или идентификатор таймера. Чтобы сделать это, функция переданная в `useEffect`, может вернуть функцию очистки. Например, чтобы создать подписку:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Очистить подписку
    subscription.unsubscribe();
  };
});
```

Функция очистки запускается до удаления компонента из пользовательского интерфейса, чтобы предотвратить утечки памяти. Кроме того, если компонент рендерится несколько раз (как обычно происходит), **предыдущий эффект очищается перед выполнением следующего эффекта**. В нашем примере это означает, что новая подписка создаётся при каждом обновлении. Чтобы избежать воздействия на каждое обновление, обратитесь к следующему разделу.

#### Порядок срабатывания эффектов {#timing-of-effects}

В отличие от `componentDidMount` и `componentDidUpdate`, функция, переданная в `useEffect`, запускается во время отложенного события **после** разметки и отрисовки. Это делает хук подходящим для многих распространённых побочных эффектов, таких как настройка подписок и обработчиков событий, потому что большинство типов работы не должны блокировать обновление экрана браузером.

Однако не все эффекты могут быть отложены. Например, изменение DOM, которое видно пользователю, должно запускаться синхронно до следующей отрисовки, чтобы пользователь не замечал визуального несоответствия. (Различие концептуально схоже с пассивным и активным слушателями событий.) Для этих типов эффектов React предоставляет один дополнительный хук, называемый [`useLayoutEffect`](#uselayouteffect). Он имеет ту же сигнатуру, что и `useEffect`, и отличается только в его запуске.

Также с 18 версии React, функция, переданная в `useEffect`, будет вызвана синхронно **перед** разметкой и отрисовкой, если эффект был вызван действием пользователя или результат обновления был обернут в [`flushSync`](/docs/react-dom.html#flushsync). Такое поведение позволяет системе событий или функции, вызвавшей [`flushSync`](/docs/react-dom.html#flushsync) следить за результатом эффекта.

> Примечание
>
> Это влияет только на время, когда функция, переданная в `useEffect`, будет вызвана - обновления, которые запланированы внутри эффектов останутся отложенными. Это поведение отлично от [`useLayoutEffect`](#uselayouteffect), который вызывает функцию и обрабатывает обновления внутри него мнгновенно.

Хотя `useEffect` откладывается до тех пор, пока браузер не выполнит отрисовку, он гарантированно срабатывает перед любыми новыми рендерами. React всегда полностью применяет эффекты предыдущего рендера перед началом нового обновления.

#### Условное срабатывание эффекта {#conditionally-firing-an-effect}

По умолчанию эффекты запускаются после каждого завершённого рендера. Таким образом, эффект всегда пересоздаётся, если значение какой-то из зависимости изменилось.

Однако в некоторых случаях это может быть излишним, например, в примере подписки из предыдущего раздела. Нам не нужно создавать новую подписку на каждое обновление, а только если изменился проп `source`.

Чтобы реализовать это, передайте второй аргумент в `useEffect`, который является массивом значений, от которых зависит эффект. Наш обновлённый пример теперь выглядит так:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Теперь подписка будет создана повторно только при изменении `props.source`.

>Примечание
>
>Если вы хотите использовать эту оптимизацию, обратите внимание на то, чтобы массив включал в себя **все значения из области видимости компонента (такие как пропсы и состояние), которые могут изменяться с течением времени, и которые будут использоваться эффектом**. В противном случае, ваш код будет ссылаться на устаревшее значение из предыдущих рендеров. Отдельные страницы документации рассказывают о том, [как поступить с функциями](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) и [что делать с часто изменяющимися массивами](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Если вы хотите запустить эффект и сбросить его только один раз (при монтировании и размонтировании), вы можете передать пустой массив (`[]`) вторым аргументом. React посчитает, что ваш эффект не зависит от *каких-либо* значений из пропсов или состояния и поэтому не будет выполнять повторных запусков эффекта. Это не обрабатывается как особый случай -- он напрямую следует из логики работы входных массивов.
>
>Если вы передадите пустой массив (`[]`), пропсы и состояние внутри эффекта всегда будут иметь значения, присвоенные им изначально. Хотя передача `[]` ближе по модели мышления к знакомым `componentDidMount` и `componentWillUnmount`, обычно есть [более хорошие](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [способы](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) избежать частых повторных рендеров. Не забывайте, что React откладывает выполнение `useEffect`, пока браузер не отрисует все изменения, поэтому выполнение дополнительной работы не является существенной проблемой.
>
>Мы рекомендуем использовать правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), входящее в наш пакет правил линтера [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Оно предупреждает, когда зависимости указаны неправильно и предлагает исправление.

Массив зависимостей не передаётся в качестве аргументов функции эффекта. Тем не менее, в теории вот что происходит: каждое значение, на которое ссылается функция эффекта, должно также появиться в массиве зависимостей. В будущем достаточно продвинутый компилятор сможет создать этот массив автоматически.

### `useContext` {#usecontext}

> Try the new React documentation for [`useContext`](https://beta.reactjs.org/reference/react/useContext).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const value = useContext(MyContext);
```

Принимает объект контекста (значение, возвращённое из `React.createContext`) и возвращает текущее значение контекста для этого контекста. Текущее значение контекста определяется пропом `value` ближайшего `<MyContext.Provider>` над вызывающим компонентом в дереве.

Когда ближайший `<MyContext.Provider>` над компонентом обновляется, этот хук вызовет повторный рендер с последним значением контекста, переданным этому провайдеру `MyContext`. Даже если родительский компонент использует [`React.memo`](/docs/react-api.html#reactmemo) или реализует [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate), то повторный рендер будет выполняться, начиная c компонента, использующего `useContext`.

Запомните, аргументом для `useContext` должен быть *непосредственно сам объект контекста*:

 * **Правильно:** `useContext(MyContext)`
 * **Неправильно:** `useContext(MyContext.Consumer)`
 * **Неправильно:** `useContext(MyContext.Provider)`

Компонент, вызывающий `useContext`, всегда будет перерендериваться при изменении значения контекста. Если повторный рендер компонента затратен, вы можете [оптимизировать его с помощью мемоизации](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

>Совет
>
>Если вы были знакомы с API контекстов до появления хуков, то вызов `useContext(MyContext)` аналогичен выражению `static contextType = MyContext` в классе, либо компоненту `<MyContext.Consumer>`.
>
>`useContext(MyContext)` позволяет только *читать* контекст и подписываться на его изменения. Вам всё ещё нужен `<MyContext.Provider>` выше в дереве, чтобы *предоставить* значение для этого контекста.

**Соединим все вместе с Context.Provider**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      Я стилизован темой из контекста!
    </button>
  );
}
```
Это пример из раздела [Продвинутые темы: Контекст](/docs/context.html), только переписанный с использованием хуков. В этом же разделе можно найти больше информации о том, как и когда использовать объект Context.


## Дополнительные хуки {#additional-hooks}

Следующие хуки являются вариантами базовых из предыдущего раздела или необходимы только для конкретных крайних случаев. Их не требуется основательно изучать заранее.

### `useReducer` {#usereducer}

> Try the new React documentation for [`useReducer`](https://beta.reactjs.org/reference/react/useReducer).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Альтернатива для [`useState`](#usestate). Принимает редюсер типа `(state, action) => newState` и возвращает текущее состояние в паре с методом `dispatch`. (Если вы знакомы с Redux, вы уже знаете, как это работает.)

Хук `useReducer` обычно предпочтительнее `useState`, когда у вас сложная логика состояния, которая включает в себя несколько значений, или когда следующее состояние зависит от предыдущего. `useReducer` также позволяет оптимизировать производительность компонентов, которые запускают глубокие обновления, [поскольку вы можете передавать `dispatch` вместо колбэков](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Вот пример счётчика из раздела [`useState`](#usestate), переписанный для использования редюсера:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>Примечание
>
>React гарантирует, что идентичность функции `dispatch` стабильна и не изменяется при повторных рендерах. Поэтому её можно безопасно не включать в списки зависимостей хуков `useEffect` и `useCallback`.

#### Указание начального состояния {#specifying-the-initial-state}

Существует два разных способа инициализации состояния `useReducer`. Вы можете выбрать любой из них в зависимости от ситуации. Самый простой способ -- передать начальное состояние в качестве второго аргумента:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Примечание
>
>React не использует соглашение об аргументах `state = initialState`, популярное в Redux. Начальное значение иногда должно зависеть от пропсов и поэтому указывается вместо вызова хука. Если вы сильно в этом уверены, вы можете вызвать `useReducer(reducer, undefined, reducer)`, чтобы эмулировать поведение Redux, но это не рекомендуется.

#### Ленивая инициализация {#lazy-initialization}

Вы также можете создать начальное состояние лениво. Для этого вы можете передать функцию `init` в качестве третьего аргумента. Начальное состояние будет установлено равным результату вызова `init(initialArg)`.

Это позволяет извлечь логику для расчёта начального состояния за пределы редюсера. Это также удобно для сброса состояния позже в ответ на действие:

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### Досрочное прекращение `dispatch` {#bailing-out-of-a-dispatch}

Если вы вернёте то же значение из редюсера хука, что и текущее состояние, React выйдет без перерисовки дочерних элементов или запуска эффектов. (React использует [алгоритм сравнения Object.is](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)

Обратите внимание, что для React всё ещё может быть необходим повторный рендер этого компонента. Это не должно быть проблемой, потому что React не будет сильно «углубляться» в дерево. Если вы делаете дорогостоящие вычисления во время рендеринга, вы можете оптимизировать их с помощью `useMemo`.

### `useCallback` {#usecallback}

> Try the new React documentation for [`useCallback`](https://beta.reactjs.org/reference/react/useCallback).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Возвращает [мемоизированный](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BC%D0%BE%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F) колбэк.

Передайте встроенный колбэк и массив зависимостей. Хук `useCallback` вернёт мемоизированную версию колбэка, который изменяется только, если изменяются значения одной из зависимостей. Это полезно при передаче колбэков оптимизированным дочерним компонентам, которые полагаются на равенство ссылок для предотвращения ненужных рендеров (например, `shouldComponentUpdate`).

`useCallback(fn, deps)` – это эквивалент `useMemo(() => fn, deps)`.

> Примечание
>
> Массив зависимостей не передаётся в качестве аргументов для колбэка. Концептуально, однако, это то, что они представляют: каждое значение, использованное в колбэке, должно также появиться в массиве зависимостей. В будущем достаточно продвинутый компилятор может создать этот массив автоматически.
>
> Мы рекомендуем использовать правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), входящее в наш пакет правил линтера [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Оно предупреждает, когда зависимости указаны неправильно и предлагает исправление.

### `useMemo` {#usememo}

> Try the new React documentation for [`useMemo`](https://beta.reactjs.org/reference/react/useMemo).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Возвращает [мемоизированное](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BC%D0%BE%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F) значение.

Передайте «создающую» функцию и массив зависимостей. `useMemo` будет повторно вычислять мемоизированное значение только тогда, когда значение какой-либо из зависимостей изменилось. Эта оптимизация помогает избежать дорогостоящих вычислений при каждом рендере.

Помните, что функция, переданная `useMemo`, запускается во время рендеринга. Не делайте там ничего, что вы обычно не делаете во время рендеринга. Например, побочные эффекты принадлежат `useEffect`, а не `useMemo`.

Если массив не был передан, новое значение будет вычисляться при каждом рендере.

**Вы можете использовать `useMemo` как оптимизацию производительности, а не как семантическую гарантию.** В будущем React может решить «забыть» некоторые ранее мемоизированные значения и пересчитать их при следующем рендере, например, чтобы освободить память для компонентов вне области видимости экрана. Напишите свой код, чтобы он по-прежнему работал без `useMemo`, а затем добавьте его для оптимизации производительности.

> Примечание
>
> Массив зависимостей не передаётся в качестве аргументов функции. Концептуально, однако, это то, что они представляют: каждое значение, на которое ссылается функция, должно также появиться в массиве зависимостей. В будущем достаточно продвинутый компилятор может создать этот массив автоматически.
>
> Мы рекомендуем использовать правило [`exhaustive-deps`](https://github.com/facebook/react/issues/14920), входящее в наш пакет правил линтера [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Оно предупреждает, когда зависимости указаны неправильно и предлагает исправление.

### `useRef` {#useref}

> Try the new React documentation for [`useRef`](https://beta.reactjs.org/reference/react/useRef).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const refContainer = useRef(initialValue);
```

`useRef` возвращает изменяемый ref-объект, свойство `.current` которого инициализируется переданным аргументом (`initialValue`). Возвращённый объект будет сохраняться в течение всего времени жизни компонента.

Обычный случай использования – это доступ к потомку в императивном стиле:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` указывает на смонтированный элемент `input`
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Установить фокус на поле ввода</button>
    </>
  );
}
```

По сути, `useRef` похож на «коробку», которая может содержать изменяемое значение в своём свойстве `.current`.

Возможно, вы знакомы с рефами в основном как со способом [получить доступ к DOM](/docs/refs-and-the-dom.html). Если вы передадите React объект рефа с помощью подобного выражения `<div ref={myRef}/>`, React установит собственное свойство `.current` на соответствующий DOM-узел при каждом его изменении.

Но хук `useRef()` полезен не только установкой атрибута с рефом. Он [удобен для сохранения любого мутируемого значения](/docs/hooks-faq.html#is-there-something-like-instance-variables), по аналогии с тем, как вы используете поля экземпляра в классах.

Это возможно, поскольку `useRef()` создаёт обычный JavaScript-объект. Единственная разница между `useRef()` и просто созданием самого объекта `{current: ...}` — это то, что хук `useRef` даст один и тот же объект с рефом при каждом рендере.

Имейте в виду, что `useRef` *не* уведомляет вас, когда изменяется его содержимое. Мутирование свойства `.current` не вызывает повторный рендер. Если вы хотите запустить некоторый код, когда React присоединяет или отсоединяет реф к узлу DOM, вы можете использовать [колбэк-реф](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) вместо этого.

### `useImperativeHandle` {#useimperativehandle}

> Try the new React documentation for [`useImperativeHandle`](https://beta.reactjs.org/reference/react/useImperativeHandle).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` настраивает значение экземпляра, которое предоставляется родительским компонентам при использовании `ref`. Как всегда, в большинстве случаев следует избегать императивного кода, использующего ссылки. `useImperativeHandle` должен использоваться с [`forwardRef`](/docs/react-api.html#reactforwardref):

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

В этом примере родительский компонент, который отображает `<FancyInput ref={inputRef} />`, сможет вызывать `inputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

<<<<<<< HEAD
Сигнатура идентична `useEffect`, но этот хук запускается синхронно после всех изменений DOM. Используйте его для чтения макета из DOM и синхронного повторного рендеринга. Обновления, запланированные внутри `useLayoutEffect`, будут полностью применены синхронно перед тем, как браузер получит шанс осуществить отрисовку.
=======
> Try the new React documentation for [`useLayoutEffect`](https://beta.reactjs.org/reference/react/useLayoutEffect).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

Предпочитайте стандартный `useEffect`, когда это возможно, чтобы избежать блокировки визуальных обновлений.

> Совет
>
> Если вы переносите код из классового компонента, `useLayoutEffect` запускается в той же фазе, что и `componentDidMount` и `componentDidUpdate`. Тем не менее, **мы рекомендуем начать с `useEffect`**, и попробовать использовать `useLayoutEffect`, если тот приводит к возникновению проблем.
>
>Если вы используете серверный рендеринг, имейте в виду, что ни `useLayoutEffect`, ни `useEffect` не могут работать до загрузки JavaScript. Вот почему React предупреждает, когда серверный компонент содержит `useLayoutEffect`. Чтобы справиться с данной проблемой, либо переместите эту логику в `useEffect` (если она не нужна для первого рендера), либо задержите отображение этого компонента до тех пор, пока не выполнится рендеринг на стороне клиента (если HTML некорректный до запуска `useLayoutEffect`).
>
>Чтобы исключить компонент, который нуждается в эффектах макета из HTML-кода, полученного в результате серверного рендеринга, выполните его рендер по условию `showChild && <Child />` и отложите отображение с помощью `useEffect(() => { setShowChild(true); }, [])`. Таким образом, пользовательский интерфейс не будет выглядеть некорректно перед гидратацией.

### `useDebugValue` {#usedebugvalue}

> Try the new React documentation for [`useDebugValue`](https://beta.reactjs.org/reference/react/useDebugValue).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
useDebugValue(value)
```

`useDebugValue` может использоваться для отображения метки для пользовательских хуков в React DevTools.

Например, рассмотрим пользовательский хук `useFriendStatus`, описанный в разделе [«Создание собственных хуков»](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Показывать ярлык в DevTools рядом с этим хуком
  // например, «Статус друга: В сети»
  useDebugValue(isOnline ? 'В сети' : 'Не в сети');

  return isOnline;
}
```

> Совет
>
> Мы не рекомендуем добавлять значения отладки в каждый пользовательский хук. Это наиболее ценно для пользовательских хуков, которые являются частью общих библиотек.

#### Отложите форматирование значений отладки {#defer-formatting-debug-values}

В некоторых случаях форматирование значения для отображения может быть дорогой операцией. Это также не нужно, если хук не проверен.

По этой причине `useDebugValue` принимает функцию форматирования в качестве необязательного второго параметра. Эта функция вызывается только при проверке хуков. Она получает значение отладки в качестве параметра и должна возвращать форматированное отображаемое значение.

Например, пользовательский хук, который возвратил значение `Date`, может избежать ненужного вызова функции `toDateString`, передав следующую функцию форматирования:

```js
useDebugValue(date, date => date.toDateString());
```

### `useDeferredValue` {#usedeferredvalue}

> Try the new React documentation for [`useDeferredValue`](https://beta.reactjs.org/reference/react/useDeferredValue).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const deferredValue = useDeferredValue(value);
```

`useDeferredValue` accepts a value and returns a new copy of the value that will defer to more urgent updates. If the current render is the result of an urgent update, like user input, React will return the previous value and then render the new value after the urgent render has completed.

This hook is similar to user-space hooks which use debouncing or throttling to defer updates. The benefits to using `useDeferredValue` is that React will work on the update as soon as other work finishes (instead of waiting for an arbitrary amount of time), and like [`startTransition`](/docs/react-api.html#starttransition), deferred values can suspend without triggering an unexpected fallback for existing content.

#### Memoizing deferred children {#memoizing-deferred-children}
`useDeferredValue` only defers the value that you pass to it. If you want to prevent a child component from re-rendering during an urgent update, you must also memoize that component with [`React.memo`](/docs/react-api.html#reactmemo) or [`React.useMemo`](/docs/hooks-reference.html#usememo):

```js
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

Memoizing the children tells React that it only needs to re-render them when `deferredQuery` changes and not when `query` changes. This caveat is not unique to `useDeferredValue`, and it's the same pattern you would use with similar hooks that use debouncing or throttling.

### `useTransition` {#usetransition}

> Try the new React documentation for [`useTransition`](https://beta.reactjs.org/reference/react/useTransition).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const [isPending, startTransition] = useTransition();
```

Returns a stateful value for the pending state of the transition, and a function to start it.

`startTransition` lets you mark updates in the provided callback as transitions:

```js
startTransition(() => {
  setCount(count + 1);
});
```

`isPending` indicates when a transition is active to show a pending state:

```js
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    });
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transition will not show a fallback for re-suspended content. This allows the user to continue interacting with the current content while rendering the update.

### `useId` {#useid}

> Try the new React documentation for [`useId`](https://beta.reactjs.org/reference/react/useId).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const id = useId();
```

`useId` is a hook for generating unique IDs that are stable across the server and client, while avoiding hydration mismatches.

> Note
>
> `useId` is **not** for generating [keys in a list](/docs/lists-and-keys.html#keys). Keys should be generated from your data.

For a basic example, pass the `id` directly to the elements that need it:

```js
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
};
```

For multiple IDs in the same component, append a suffix using the same `id`:

```js
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```

> Note:
> 
> `useId` generates a string that includes the `:` token. This helps ensure that the token is unique, but is not supported in CSS selectors or APIs like `querySelectorAll`.
> 
> `useId` supports an `identifierPrefix` to prevent collisions in multi-root apps. To configure, see the options for [`hydrateRoot`](/docs/react-dom-client.html#hydrateroot) and [`ReactDOMServer`](/docs/react-dom-server.html).

## Library Hooks {#library-hooks}

The following Hooks are provided for library authors to integrate libraries deeply into the React model, and are not typically used in application code.

### `useSyncExternalStore` {#usesyncexternalstore}

> Try the new React documentation for [`useSyncExternalStore`](https://beta.reactjs.org/reference/react/useSyncExternalStore).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const state = useSyncExternalStore(subscribe, getSnapshot[, getServerSnapshot]);
```

`useSyncExternalStore` is a hook recommended for reading and subscribing from external data sources in a way that's compatible with concurrent rendering features like selective hydration and time slicing.

This method returns the value of the store and accepts three arguments:
- `subscribe`: function to register a callback that is called whenever the store changes.
- `getSnapshot`: function that returns the current value of the store.
- `getServerSnapshot`: function that returns the snapshot used during server rendering.

The most basic example simply subscribes to the entire store:

```js
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

However, you can also subscribe to a specific field:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
);
```

When server rendering, you must serialize the store value used on the server, and provide it to `useSyncExternalStore`. React will use this snapshot during hydration to prevent server mismatches:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
  () => INITIAL_SERVER_SNAPSHOT.selectedField,
);
```

> Note:
>
> `getSnapshot` must return a cached value. If getSnapshot is called multiple times in a row, it must return the same exact value unless there was a store update in between.
> 
> A shim is provided for supporting multiple React versions published as `use-sync-external-store/shim`. This shim will prefer `useSyncExternalStore` when available, and fallback to a user-space implementation when it's not.
> 
> As a convenience, we also provide a version of the API with automatic support for memoizing the result of getSnapshot published as `use-sync-external-store/with-selector`.

### `useInsertionEffect` {#useinsertioneffect}

> Try the new React documentation for [`useInsertionEffect`](https://beta.reactjs.org/reference/react/useInsertionEffect).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
useInsertionEffect(didUpdate);
```

The signature is identical to `useEffect`, but it fires synchronously _before_ all DOM mutations. Use this to inject styles into the DOM before reading layout in [`useLayoutEffect`](#uselayouteffect). Since this hook is limited in scope, this hook does not have access to refs and cannot schedule updates.

> Note:
>
> `useInsertionEffect` should be limited to css-in-js library authors. Prefer [`useEffect`](#useeffect) or [`useLayoutEffect`](#uselayouteffect) instead.
