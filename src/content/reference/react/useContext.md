---
title: useContext
---
<Intro>

`useContext` — это React Hook, который позволяет вам читать и подписываться на [контекст](/learn/passing-data-deeply-with-context) из вашего компонента.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Вызовите `useContext` на верхнем уровне вашего компонента, чтобы прочитать контекст и подписаться на него.

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `SomeContext`: Контекст, который вы ранее создали с помощью [`createContext`](/reference/react/createContext). Сам по себе контекст не хранит информацию, он лишь представляет тип информации, которую можно предоставлять или читать из компонентов.

#### Возвращаемое значение {/*returns*/}

`useContext` возвращает значение контекста для вызывающего компонента. Оно определяется как `value`, переданное ближайшему `SomeContext.Provider` над вызывающим компонентом в дереве. Если такого провайдера нет, возвращаемое значение будет `defaultValue`, которое вы передали в [`createContext`](/reference/react/createContext) для этого контекста. Возвращаемое значение всегда актуально. React автоматически повторно отрисовывает компоненты, которые читают некоторый контекст, если он изменяется.

#### Ограничения {/*caveats*/}

* Вызов `useContext()` в компоненте не затрагивается провайдерами, возвращаемыми из *того же* компонента. Соответствующий `<Context.Provider>` **должен быть *выше*** компонента, выполняющего вызов `useContext()`.
* React **автоматически повторно отрисовывает** всех дочерних компонентов, использующих данный контекст, начиная с провайдера, который получает другое значение (`value`). Предыдущее и следующее значения сравниваются с помощью [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Пропуск повторного рендеринга с помощью [`memo`](/reference/react/memo) не мешает дочерним компонентам получать актуальные значения контекста.
* Если ваша система сборки создает дубликаты модулей в выходных данных (что может произойти при использовании символических ссылок), это может нарушить работу контекста. Передача чего-либо через контекст работает только в том случае, если `SomeContext`, который вы используете для предоставления контекста, и `SomeContext`, который вы используете для его чтения, являются ***точно* одним и тем же объектом**, что определяется сравнением `===`.

---

## Использование {/*usage*/}


### Передача данных глубоко в дерево {/*passing-data-deeply-into-the-tree*/}

Вызовите `useContext` на верхнем уровне вашего компонента, чтобы прочитать контекст и подписаться на него [контекст.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` возвращает <CodeStep step={2}>значение контекста</CodeStep> для переданного вами [контекста.](/learn/passing-data-deeply-with-context) Чтобы определить значение контекста, React ищет дерево компонентов и находит **ближайший провайдер контекста выше** для данного конкретного контекста.

Чтобы передать контекст в `Button`, оберните его или один из его родительских компонентов в соответствующий провайдер контекста:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... рендерит кнопки внутри ...
}
```

Не имеет значения, сколько слоев компонентов находится между провайдером и `Button`. Когда `Button` *где-либо* внутри `Form` вызывает `useContext(ThemeContext)`, он получит `"dark"` в качестве значения.

<Pitfall>

`useContext()` всегда ищет ближайший провайдер *выше* компонента, который его вызывает. Он ищет вверх и **не** учитывает провайдеры в компоненте, из которого вы вызываете `useContext()`.

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

### Обновление данных, передаваемых через контекст {/*updating-data-passed-via-context*/}

Часто вам потребуется, чтобы контекст менялся со временем. Чтобы обновить контекст, объедините его с [состоянием.](/reference/react/useState) Объявите переменную состояния в родительском компоненте и передайте текущее состояние в качестве <CodeStep step={2}>значения контекста</CodeStep> провайдеру.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

Теперь любая кнопка `Button` внутри провайдера получит текущее значение `theme`. Если вы вызовете `setTheme` для обновления значения `theme`, которое вы передаете провайдеру, все компоненты `Button` будут перерендерены с новым значением `'light'`.

<Recipes titleText="Примеры обновления контекста" titleId="examples-basic">

#### Обновление значения через контекст {/*updating-a-value-via-context*/}

В этом примере компонент `MyApp` содержит переменную состояния, которая затем передается провайдеру `ThemeContext`. Установка флажка "Dark mode" обновляет состояние. Изменение предоставленного значения перерендеривает все компоненты, использующие этот контекст.

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
        Use dark mode
      </label>
    </ThemeContext.Provider>
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

Обратите внимание, что `value="dark"` передает строку `"dark"`, а `value={theme}` передает значение переменной JavaScript `theme` с помощью [фигурных скобок JSX.](/learn/javascript-in-jsx-with-curly-braces) Фигурные скобки также позволяют передавать значения контекста, которые не являются строками.

<Solution />

#### Обновление объекта через контекст {/*updating-an-object-via-context*/}

В этом примере есть переменная состояния `currentUser`, которая содержит объект. Вы объединяете `{ currentUser, setCurrentUser }` в один объект и передаете его через контекст внутри `value={}`. Это позволяет любому компоненту ниже, например `LoginButton`, читать как `currentUser`, так и `setCurrentUser`, а затем вызывать `setCurrentUser` при необходимости.

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
    <Panel title="Welcome">
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
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
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

В этом примере есть два независимых контекста. `ThemeContext` предоставляет текущую тему, которая является строкой, в то время как `CurrentUserContext` содержит объект, представляющий текущего пользователя.

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
          Use dark mode
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
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
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
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
        Log in
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

#### Выделение провайдеров в компонент {/*extracting-providers-to-a-component*/}

По мере роста вашего приложения ожидается, что у вас будет "пирамида" контекстов ближе к корню приложения. В этом нет ничего плохого. Однако, если вам не нравится эстетика вложенности, вы можете выделить провайдеры в один компонент. В этом примере `MyProviders` скрывает "соединения" и рендерит дочерние элементы, переданные ему, внутри необходимых провайдеров. Обратите внимание, что состояние `theme` и `setTheme` необходимо в самом `MyApp`, поэтому `MyApp` по-прежнему владеет этой частью состояния.

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
        Use dark mode
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
    <Panel title="Welcome">
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
    <p>You logged in as {currentUser.name}.</p>
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
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
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
        Log in
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

#### Масштабирование с помощью контекста и редюсера {/*scaling-up-with-context-and-a-reducer*/}

В больших приложениях принято объединять контекст с [редюсером](/reference/react/useReducer), чтобы вынести логику, связанную с некоторым состоянием, из компонентов. В этом примере вся "связующая" логика скрыта в `TasksContext.js`, который содержит редюсер и два отдельных контекста.

Прочитайте [полное пошаговое руководство](/learn/scaling-up-with-reducer-and-context) по этому примеру.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
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
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
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
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
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
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

### Указание значения по умолчанию {/*specifying-a-fallback-default-value*/}

Если React не может найти провайдеры этого конкретного [контекста](/learn/passing-data-deeply-with-context) в родительском дереве, возвращаемое значение контекста `useContext()` будет равно [значению по умолчанию,](/reference/react/createContext) которое вы указали при [создании этого контекста:](/reference/react/createContext)

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Значение по умолчанию **никогда не меняется**. Если вы хотите обновить контекст, используйте его с состоянием, как [описано выше.](#updating-data-passed-via-context)

Часто вместо `null` можно использовать более осмысленное значение по умолчанию, например:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

Таким образом, если вы случайно отрендерите какой-либо компонент без соответствующего провайдера, он не сломается. Это также помогает вашим компонентам хорошо работать в тестовой среде без необходимости настраивать множество провайдеров в тестах.

В приведенном ниже примере кнопка "Toggle theme" всегда светлая, потому что она находится **вне любого провайдера контекста темы**, а значение контекста по умолчанию равно `'light'`. Попробуйте изменить значение темы по умолчанию на `'dark'`.

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

### Переопределение контекста для части дерева {/*overriding-context-for-a-part-of-the-tree*/}

Вы можете переопределить контекст для части дерева, обернув эту часть в `Provider` с другим значением.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

Вы можете вкладывать и переопределять `Provider`-ы столько раз, сколько вам нужно.

<Recipes titleText="Примеры переопределения контекста">

#### Переопределение темы {/*overriding-a-theme*/}

Здесь кнопка *внутри* `Footer` получает другое значение контекста (`"light"`), чем кнопки снаружи (`"dark"`).

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

#### Автоматически вложенные заголовки {/*automatically-nested-headings*/}

Вы можете «накапливать» информацию при вложении `Provider`-ов контекста. В этом примере компонент `Section` отслеживает `LevelContext`, который определяет глубину вложенности секций. Он считывает `LevelContext` от родительской секции и предоставляет `LevelContext` с увеличенным на единицу значением своим дочерним элементам. В результате компонент `Heading` может автоматически решать, какой из тегов `<h1>`, `<h2>`, `<h3>`, ... использовать, в зависимости от того, сколько компонентов `Section` он содержит.

Прочитайте [подробное описание](/learn/passing-data-deeply-with-context) этого примера.

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

```js src/Section.js
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

```js src/Heading.js
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

```js src/LevelContext.js
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

### Оптимизация повторных рендеров при передаче объектов и функций {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Через контекст можно передавать любые значения, включая объекты и функции.

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

Здесь <CodeStep step={2}>значение контекста</CodeStep> — это объект JavaScript с двумя свойствами, одно из которых является функцией. Каждый раз, когда `MyApp` выполняет повторный рендер (например, при обновлении маршрута), это будет *другой* объект, указывающий на *другую* функцию, поэтому React также придется повторно отрисовывать все компоненты глубоко в дереве, которые вызывают `useContext(AuthContext)`.

В небольших приложениях это не проблема. Однако нет необходимости повторно отрисовывать их, если базовые данные, такие как `currentUser`, не изменились. Чтобы помочь React использовать этот факт, вы можете обернуть функцию `login` с помощью [`useCallback`](/reference/react/useCallback), а создание объекта — с помощью [`useMemo`](/reference/react/useMemo). Это оптимизация производительности:

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

В результате этого изменения, даже если `MyApp` потребуется повторный рендер, компонентам, вызывающим `useContext(AuthContext)`, не потребуется повторный рендер, если только `currentUser` не изменился.

Подробнее о [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) и [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Устранение неполадок {/*troubleshooting*/}

### Мой компонент не видит значение из моего провайдера {/*my-component-doesnt-see-the-value-from-my-provider*/}

Это может произойти по нескольким распространенным причинам:

1. Вы рендерите `<SomeContext.Provider>` в том же компоненте (или ниже), где вызываете `useContext()`. Переместите `<SomeContext.Provider>` *выше и вне* компонента, вызывающего `useContext()`.
2. Возможно, вы забыли обернуть ваш компонент в `<SomeContext.Provider>`, или вы поместили его в другую часть дерева, чем предполагали. Проверьте правильность иерархии с помощью [React DevTools.](/learn/react-developer-tools)
3. Возможно, вы столкнулись с проблемой сборки вашего инструментария, из-за которой `SomeContext`, видимый из предоставляющего компонента, и `SomeContext`, видимый из читающего компонента, являются разными объектами. Это может произойти, например, если вы используете символические ссылки. Вы можете проверить это, присвоив их глобальным переменным, таким как `window.SomeContext1` и `window.SomeContext2`, а затем проверив в консоли, равны ли `window.SomeContext1 === window.SomeContext2`. Если они не равны, устраните эту проблему на уровне сборщика.

### Я всегда получаю `undefined` из моего контекста, хотя значение по умолчанию другое {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Возможно, в дереве отсутствует провайдер со свойством `value`:

```js {1,2}
// 🚩 Не работает: нет свойства value
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

Если вы забудете указать `value`, это будет эквивалентно передаче `value={undefined}`.

Возможно, вы по ошибке использовали другое имя свойства:

```js {1,2}
// 🚩 Не работает: свойство должно называться "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

В обоих этих случаях вы должны увидеть предупреждение от React в консоли. Чтобы исправить их, назовите свойство `value`:

```js {1,2}
// ✅ Передаем свойство value
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Обратите внимание, что [значение по умолчанию из вашего вызова `createContext(defaultValue)`](#specifying-a-fallback-default-value) используется только в том случае, если **вообще нет соответствующего провайдера выше**. Если в родительском дереве есть компонент `<SomeContext.Provider value={undefined}>`, то компонент, вызывающий `useContext(SomeContext)`, *получит* `undefined` в качестве значения контекста.