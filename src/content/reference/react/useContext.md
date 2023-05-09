---
title: useContext
---

<Intro>

`useContext` - это хук, который позволяет вам считывать и подписываться на [контекст](/learn/passing-data-deeply-with-context) внутри вашего компонента.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Вызовите `useContext` на верхнем уровне вашего компонента для чтения и подписки на [контекст.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `SomeContext`: Контекст, который вы создали заранее с помощью [`createContext`](/reference/react/createContext). Сам по себе контекст не хранит данные. Он является представлением типа данных, которые вы можете предоставить или прочитать внутри ваших компонентов.
#### Возвращаемое значение {/*returns*/}

`useContext` возвращает значение контекста для вызывающего компонента. Оно определяется как `value`, переданное ближайшему `SomeContext.Provider` выше по дереву, чем вызывающий компонент. Если такого источника нет, то вернется `defaultValue`, который вы передали в [`createContext`](/reference/react/createContext) для этого контекста. Возвращаемое значение всегда актуально. React автоматически повторно рендерит компоненты, которые считывают определенный контекст, при его изменении.

#### Замечания {/*caveats*/}

* Вызов `useContext()` из компонента не будет затронут источниками, созданными в  *том же* компоненте. Соответствующий `<Context.Provider>` **обязан быть *выше по дереву***, чем компонент, который вызывает `useContext()`.
* React **автоматически повторно рендерит** все дочерние компоненты, использующие источник, значение `value` которого было изменено. Предшествующее и следующее значения сравниваются, используя сравнение [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Пропуск повторных рендеров с помощью [`memo`](/reference/react/memo) не препятствует получению дочерними компонентами актуальных значений контекста.
* Если ваша система сборки дублирует выходящие модули (что может произойти при использовании символических ссылок), результат использования контекста может стать непредсказуемым. Передача чего-либо через контекст будет успешна только если `SomeContext`, который вы используете для  предоставления контекста, и `SomeContext`, который вы используете, чтобы его считать, ***полностью* идентичны друг другу**, аналогично оператору сравнения `===`.

---

## Применение {/*usage*/}


### Передача данных вглубь дерева {/*passing-data-deeply-into-the-tree*/}

Вызовите `useContext` на верхнем уровне вашего компонента чтобы прочитать и подписаться на [контекст.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` возвращает <CodeStep step={2}>значение контекста</CodeStep>для переданного <CodeStep step={1}>контекста</CodeStep>. Чтобы определить значение контекста, React ищет в дереве компонентов **ближайший источник контекста выше по дереву** для данного конкретного контекста.

Чтобы передать контекст компоненту `Button`, оберните его или один из его родительских компонентов в источник соответствующего контекста:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Не имеет значения, сколько слоев компонентов находится между источником контекста и  `Button`. Когда `Button` *в любом месте* внутри `Form` вызывает `useContext(ThemeContext)`, он получит значение `"dark"`.

<Pitfall>

`useContext()` всегда ищет ближайший источник контекста *выше по дереву*, чем компонент, который его запрашивает. Он делает поиск только вверх и **не рассматривает** источники в компоненте, вызывающем `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Добро пожаловать">
      <Button>Зарегистрироваться</Button>
      <Button>Войти</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Изменение данных, передаваемых через контекст {/*updating-data-passed-via-context*/}

Чаще всего вам понадобится, чтобы контекст менялся со временем. Чтобы изменить контекст, используйте его вместе с [состоянием.](/reference/react/useState) Объявите переменную состояния в родительском компоненте, и передайте текущее состояние источнику контекста как <CodeStep step={2}>значение контекста</CodeStep>.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Поставить светлую тему
      </Button>
    </ThemeContext.Provider>
  );
}
```

Теперь любой компонент `Button` внутри источника будет получать текущее значение `theme`. Если вы вызовете `setTheme`, чтобы изменить значение `theme`, которое вы передали в источник, все компоненты `Button` будут повторно отрендерены с новым зачением `'light'`.

<Recipes titleText="Примеры изменения контекста" titleId="examples-basic">

#### Изменение значения через контекст {/*updating-a-value-via-context*/}

В этом примере компонент `MyApp` содержит переменную состояния, которая затем передается в источник `ThemeContext`. Активация чекбокса "Dark mode" изменяет состояние. Изменение предоставляемого значения вызывает повторный рендер всех компонентов, использующих данный контекст.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Темная тема
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Добро пожаловать">
      <Button>Зарегистрироваться</Button>
      <Button>Войти</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Заметьте, что `value="dark"` передает строку `"dark"`, однако `value={theme}` передает значение JavaScript-переменной `theme`, используя [фигурные скобки JSX.](/learn/javascript-in-jsx-with-curly-braces) Фигурные скобки также позволяют вам передавать в контекст другие значения помимо строк.

<Solution />

#### Изменение объекта через контекст {/*updating-an-object-via-context*/}

В данном примере есть переменная состояния `currentUser`, которая хранит объект. Вы объединяете `{ currentUser, setCurrentUser }` в один объект и передаете его вниз через контекст, используя `value={}`. В этом случае любой компонент ниже по дереву, например `LoginButton`, считывают и `currentUser`, и `setCurrentUser`, а затем вызывают `setCurrentUser` по необходимости.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Добро пожаловать">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>Вы вошли как {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Войти как Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Несколько контекстов {/*multiple-contexts*/}

В данном примере есть два независимых контекста. `ThemeContext` передает текущую тему, которая является строкой, а `CurrentUserContext` хранит объект с описанием текущего пользователя.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Использовать темную тему
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Добро пожаловать">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Вы вошли как {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        Имя{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Фамилия{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Войти
      </Button>
      {!canLogin && <i>Заполните оба поля.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Выделение источников контекста в отдельный компонент {/*extracting-providers-to-a-component*/}

С ростом вашего приложения, у вас, скорее всего, появится "пирамида" из контекстов ближе к корневому компоненту. В этом нет никакой проблемы. Однако, если вам эстетически не по душе такая вложенность, вы можете выделить источники контекста в отдельный компонент. В данном примере, `MyProviders` прячет всю реализацию и рендерит переданные ему дочерние компоненты внутри необходимых источников. Заметьте, что состояние `theme` и `setTheme` используется в самом `MyApp`, поэтому `MyApp` все еще содержит эту часть состояния.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Использовать темную тему
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Добро пожаловать">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Вы вошли как {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        Имя{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Фамилия{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Войти
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Масштабирование с контекстом и редюсером {/*scaling-up-with-context-and-a-reducer*/}

В больших приложениях частой практикой является совмещение контекста с [редюсером](/reference/react/useReducer) чтобы вынести всю относящуюся к состоянию логику из компонентов. В данном примере, вся реализация скрыта с глаз внутри `TasksContext.js`, который содержит редюсер и два отдельных контекста.

Смотрите [полное описание](/learn/scaling-up-with-reducer-and-context) этого примера.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Выходной в Киото</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Неизвестное событие: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Путь философа', done: true },
  { id: 1, text: 'Сходить в храм', done: false },
  { id: 2, text: 'Выпить матчу', done: false }
];
```

```js AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Добавить задачу"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Добавить</button>
    </>
  );
}

let nextId = 3;
```

```js TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Сохранить
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Изменить
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Удалить
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Specifying a fallback default value {/*specifying-a-fallback-default-value*/}

If React can't find any providers of that particular <CodeStep step={1}>context</CodeStep> in the parent tree, the context value returned by `useContext()` will be equal to the <CodeStep step={3}>default value</CodeStep> that you specified when you [created that context](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

The default value **never changes**. If you want to update context, use it with state as [described above.](#updating-data-passed-via-context)

Often, instead of `null`, there is some more meaningful value you can use as a default, for example:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

This way, if you accidentally render some component without a corresponding provider, it won't break. This also helps your components work well in a test environment without setting up a lot of providers in the tests.

In the example below, the "Toggle theme" button is always light because it's **outside any theme context provider** and the default context theme value is `'light'`. Try editing the default theme to be `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Overriding context for a part of the tree {/*overriding-context-for-a-part-of-the-tree*/}

You can override the context for a part of the tree by wrapping that part in a provider with a different value.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

You can nest and override providers as many times as you need.

<Recipes title="Examples of overriding context">

#### Overriding a theme {/*overriding-a-theme*/}

Here, the button *inside* the `Footer` receives a different context value (`"light"`) than the buttons outside (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Automatically nested headings {/*automatically-nested-headings*/}

You can "accumulate" information when you nest context providers. In this example, the `Section` component keeps track of the `LevelContext` which specifies the depth of the section nesting. It reads the `LevelContext` from the parent section, and provides the `LevelContext` number increased by one to its children. As a result, the `Heading` component can automatically decide which of the `<h1>`, `<h2>`, `<h3>`, ..., tags to use based on how many `Section` components it is nested inside of.

Read a [detailed walkthrough](/learn/passing-data-deeply-with-context) of this example.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Optimizing re-renders when passing objects and functions {/*optimizing-re-renders-when-passing-objects-and-functions*/}

You can pass any values via context, including objects and functions.

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Here, the <CodeStep step={2}>context value</CodeStep> is a JavaScript object with two properties, one of which is a function. Whenever `MyApp` re-renders (for example, on a route update), this will be a *different* object pointing at a *different* function, so React will also have to re-render all components deep in the tree that call `useContext(AuthContext)`.

In smaller apps, this is not a problem. However, there is no need to re-render them if the underlying data, like `currentUser`, has not changed. To help React take advantage of that fact, you may wrap the `login` function with [`useCallback`](/reference/react/useCallback) and wrap the object creation into [`useMemo`](/reference/react/useMemo). This is a performance optimization:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

As a result of this change, even if `MyApp` needs to re-render, the components calling `useContext(AuthContext)` won't need to re-render unless `currentUser` has changed.

Read more about [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) and [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Troubleshooting {/*troubleshooting*/}

### My component doesn't see the value from my provider {/*my-component-doesnt-see-the-value-from-my-provider*/}

There are a few common ways that this can happen:

1. You're rendering `<SomeContext.Provider>` in the same component (or below) as where you're calling `useContext()`. Move `<SomeContext.Provider>` *above and outside* the component calling `useContext()`.
2. You may have forgotten to wrap your component with `<SomeContext.Provider>`, or you might have put it in a different part of the tree than you thought. Check whether the hierarchy is right using [React DevTools.](/learn/react-developer-tools)
3. You might be running into some build issue with your tooling that causes `SomeContext` as seen from the providing component and `SomeContext` as seen by the reading component to be two different objects. This can happen if you use symlinks, for example. You can verify this by assigning them to globals like `window.SomeContext1` and `window.SomeContext2` and then checking whether `window.SomeContext1 === window.SomeContext2` in the console. If they're not the same, fix that issue on the build tool level.

### I am always getting `undefined` from my context although the default value is different {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

You might have a provider without a `value` in the tree:

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

If you forget to specify `value`, it's like passing `value={undefined}`.

You may have also mistakingly used a different prop name by mistake:

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

In both of these cases you should see a warning from React in the console. To fix them, call the prop `value`:

```js {1,2}
// ✅ Passing the value prop
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Note that the [default value from your `createContext(defaultValue)` call](#specifying-a-fallback-default-value) is only used **if there is no matching provider above at all.** If there is a `<SomeContext.Provider value={undefined}>` component somewhere in the parent tree, the component calling `useContext(SomeContext)` *will* receive `undefined` as the context value.
