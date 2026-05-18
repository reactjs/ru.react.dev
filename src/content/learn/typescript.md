---
title: Using TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript — популярный способ добавления определений типов в кодовые базы JavaScript. Из коробки TypeScript [поддерживает JSX](/learn/writing-markup-with-jsx), а полную поддержку React Web можно получить, добавив [`@types/react`](https://www.npmjs.com/package/@types/react) и [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) в ваш проект.

</Intro>

<YouWillLearn>

* [TypeScript с компонентами React](/learn/typescript#typescript-with-react-components)
* [Примеры типизации с хуками](/learn/typescript#example-hooks)
* [Общие типы из `@types/react`](/learn/typescript/#useful-types)
* [Дополнительные ресурсы для изучения](/learn/typescript/#further-learning)

</YouWillLearn>

## Установка {/*installation*/}

Все [фреймворки React для продакшена](/learn/start-a-new-react-project#production-grade-react-frameworks) предлагают поддержку использования TypeScript. Следуйте руководству для конкретного фреймворка по установке:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Добавление TypeScript в существующий проект React {/*adding-typescript-to-an-existing-react-project*/}

Чтобы установить последнюю версию определений типов React:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

Следующие параметры компилятора необходимо установить в вашем `tsconfig.json`:

1. `dom` должен быть включен в [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Примечание: Если опция `lib` не указана, `dom` включается по умолчанию).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) должен быть установлен в одно из допустимых значений. `preserve` должно быть достаточно для большинства приложений.
  Если вы публикуете библиотеку, обратитесь к документации по [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) относительно выбора значения.

## TypeScript с компонентами React {/*typescript-with-react-components*/}

<Note>

Каждый файл, содержащий JSX, должен использовать расширение файла `.tsx`. Это специфичное для TypeScript расширение, которое сообщает TypeScript, что этот файл содержит JSX.

</Note>

Написание TypeScript с React очень похоже на написание JavaScript с React. Ключевое отличие при работе с компонентом заключается в том, что вы можете предоставлять типы для пропсов вашего компонента. Эти типы могут использоваться для проверки корректности и предоставления встроенной документации в редакторах.

Взяв компонент [`MyButton`](/learn#components) из руководства [Быстрый старт](/learn), мы можем добавить тип, описывающий `title` для кнопки:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Эти песочницы могут обрабатывать код TypeScript, но они не запускают проверку типов. Это означает, что вы можете изменять песочницы TypeScript для обучения, но не получите никаких ошибок или предупреждений типов. Чтобы получить проверку типов, вы можете использовать [TypeScript Playground](https://www.typescript.org/play) или более полнофункциональную онлайн-песочницу.

</Note>

Этот синтаксис внутри строки — самый простой способ предоставления типов для компонента, хотя, как только у вас появится несколько полей для описания, это может стать громоздким. Вместо этого вы можете использовать `interface` или `type` для описания пропсов компонента:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** The text to display inside the button */
  title: string;
  /** Whether the button can be interacted with */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Тип, описывающий пропсы вашего компонента, может быть простым или сложным, насколько вам нужно, хотя он должен быть объектным типом, описанным с помощью `type` или `interface`. Вы можете узнать, как TypeScript описывает объекты, в разделе [Object Types](https://www.typescript.org/docs/handbook/2/objects.html), но вас также могут заинтересовать [Union Types](https://www.typescript.org/docs/handbook/2/everyday-types.html#union-types) для описания пропса, который может быть одним из нескольких разных типов, и руководство [Creating Types from Types](https://www.typescript.org/docs/handbook/2/types-from-types.html) для более продвинутых сценариев использования.


## Примеры хуков {/*example-hooks*/}

Определения типов из `@types/react` включают типы для встроенных хуков, поэтому вы можете использовать их в своих компонентах без дополнительной настройки. Они созданы с учетом кода, который вы пишете в своем компоненте, поэтому во многих случаях вы будете получать [выведенные типы](https://www.typescript.org/docs/handbook/type-inference.html) и в идеале вам не нужно будет заниматься мелочами предоставления типов.

Однако давайте рассмотрим несколько примеров того, как предоставлять типы для хуков.

### `useState` {/*typing-usestate*/}

Хук [`useState`](/reference/react/useState) будет повторно использовать значение, переданное в качестве начального состояния, для определения типа значения. Например:

```ts
// Вывести тип как "boolean"
const [enabled, setEnabled] = useState(false);
```

Это присвоит тип `boolean` переменной `enabled`, а `setEnabled` будет функцией, принимающей либо аргумент типа `boolean`, либо функцию, возвращающую `boolean`. Если вы хотите явно указать тип для состояния, вы можете сделать это, предоставив аргумент типа вызову `useState`:

```ts
// Явно установить тип как "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

В данном случае это не очень полезно, но распространенный случай, когда вам может понадобиться предоставить тип, — это когда у вас есть объединяющий тип. Например, `status` здесь может быть одной из нескольких разных строк:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Или, как рекомендуется в [Принципах структурирования состояния](/learn/choosing-the-state-structure#principles-for-structuring-state), вы можете сгруппировать связанное состояние как объект и описать различные возможности с помощью объектных типов:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

Хук [`useReducer`](/reference/react/useReducer) — это более сложный хук, который принимает функцию-редьюсер и начальное состояние. Типы для функции-редьюсера выводятся из начального состояния. Вы можете опционально предоставить аргумент типа вызову `useReducer` для предоставления типа состояния, но часто лучше вместо этого установить тип для начального состояния:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


Мы используем TypeScript в нескольких ключевых местах:

 - `interface State` описывает структуру состояния редьюсера.
 - `type CounterAction` описывает различные действия, которые могут быть отправлены редьюсеру.
 - `const initialState: State` предоставляет тип для начального состояния, а также тип, который используется `useReducer` по умолчанию.
 - `stateReducer(state: State, action: CounterAction): State` устанавливает типы для аргументов и возвращаемого значения функции-редьюсера.

Более явной альтернативой установке типа для `initialState` является предоставление аргумента типа для `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

Хук [`useContext`](/reference/react/useContext) — это техника передачи данных вниз по дереву компонентов без необходимости передавать пропсы через компоненты. Он используется путем создания компонента-провайдера и часто путем создания хука для потребления значения в дочернем компоненте.

Тип значения, предоставляемого контекстом, выводится из значения, переданного вызову `createContext`:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Этот метод работает, когда у вас есть значение по умолчанию, которое имеет смысл — но иногда бывают случаи, когда его нет, и в этих случаях `null` может показаться разумным в качестве значения по умолчанию. Однако, чтобы система типов понимала ваш код, вам нужно явно установить `ContextShape | null` для `createContext`.

Это вызывает проблему, заключающуюся в том, что вам нужно устранить `| null` в типе для потребителей контекста. Наша рекомендация — использовать хук для проверки во время выполнения на его существование и выбрасывать ошибку, когда он не присутствует:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Это более простой пример, но вы можете представить здесь более сложный объект
type ComplexObject = {
  kind: string
};

// Контекст создается с `| null` в типе, чтобы точно отразить значение по умолчанию.
const Context = createContext<ComplexObject | null>(null);

// `| null` будет удален через проверку в хуке.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

Хук [`useMemo`](/reference/react/useMemo) создает/повторно получает доступ к запомненному значению из вызова функции, повторно запуская функцию только при изменении зависимостей, переданных в качестве второго параметра. Результат вызова хука выводится из возвращаемого значения функции в первом параметре. Вы можете быть более явными, предоставив аргумент типа для хука.

```ts
// Тип visibleTodos выводится из возвращаемого значения filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

Хук [`useCallback`](/reference/react/useCallback) предоставляет стабильную ссылку на функцию до тех пор, пока зависимости, переданные во второй параметр, остаются прежними. Как и `useMemo`, тип функции выводится из возвращаемого значения функции в первом параметре, и вы можете быть более явными, предоставив аргумент типа для хука.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

При работе в строгом режиме TypeScript `useCallback` требует добавления типов для параметров в вашем колбэке. Это связано с тем, что тип колбэка выводится из возвращаемого значения функции, и без параметров тип не может быть полностью понят.

В зависимости от ваших предпочтений в стиле кода, вы можете использовать функции `*EventHandler` из типов React для предоставления типа для обработчика событий одновременно с определением колбэка:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## Полезные типы {/*useful-types*/}

Пакет `@types/react` содержит довольно обширный набор типов, стоит ознакомиться с ним, когда вы почувствуете себя уверенно во взаимодействии React и TypeScript. Вы можете найти их [в папке React в DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Здесь мы рассмотрим несколько наиболее распространенных типов.

### DOM События {/*typing-dom-events*/}

При работе с DOM-событиями в React тип события часто может быть выведен из обработчика событий. Однако, когда вы хотите выделить функцию для передачи в обработчик событий, вам нужно будет явно указать тип события.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

В типах React предоставляется множество типов событий — полный список можно найти [здесь](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373), который основан на [наиболее популярных событиях DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

При определении нужного типа вы можете сначала посмотреть информацию при наведении на используемый обработчик событий, которая покажет тип события.

Если вам нужно использовать событие, которое не включено в этот список, вы можете использовать тип `React.SyntheticEvent`, который является базовым типом для всех событий.

### Children {/*typing-children*/}

Существует два распространенных способа описания дочерних элементов компонента. Первый — использовать тип `React.ReactNode`, который является объединением всех возможных типов, которые могут быть переданы в качестве дочерних элементов в JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Это очень широкое определение дочерних элементов. Второй — использовать тип `React.ReactElement`, который представляет собой только JSX-элементы, а не примитивы JavaScript, такие как строки или числа:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Обратите внимание, что вы не можете использовать TypeScript для описания того, что дочерние элементы являются определенным типом JSX-элементов, поэтому вы не можете использовать систему типов для описания компонента, который принимает только дочерние элементы `<li>`.

Вы можете увидеть примеры как `React.ReactNode`, так и `React.ReactElement` с проверкой типов в [этой песочнице TypeScript](https://www.typescript.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Style Props {/*typing-style-props*/}

При использовании встроенных стилей в React вы можете использовать `React.CSSProperties` для описания объекта, переданного в пропс `style`. Этот тип является объединением всех возможных CSS-свойств и является хорошим способом убедиться, что вы передаете допустимые CSS-свойства в пропс `style`, а также получить автодополнение в вашем редакторе.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Дополнительное обучение {/*further-learning*/}

Это руководство охватило основы использования TypeScript с React, но есть еще много чего узнать.
Отдельные страницы API в документации могут содержать более подробную документацию о том, как использовать их с TypeScript.

Мы рекомендуем следующие ресурсы:

 - [Справочник по TypeScript](https://www.typescriptlang.org/docs/handbook/) — это официальная документация по TypeScript, охватывающая большинство ключевых возможностей языка.

 - [Заметки о выпуске TypeScript](https://devblogs.microsoft.com/typescript/) подробно освещают новые возможности.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) — это поддерживаемый сообществом справочник по использованию TypeScript с React, охватывающий множество полезных крайних случаев и предоставляющий более широкое освещение, чем этот документ.

 - [TypeScript Community Discord](https://discord.com/invite/typescript) — отличное место, чтобы задавать вопросы и получать помощь по проблемам с TypeScript и React.
