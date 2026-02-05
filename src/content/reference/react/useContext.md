---
title: useContext
---

<Intro>

`useContext` — это хук React, который позволяет читать и подписываться на [контекст](/learn/passing-data-deeply-with-context) из вашего компонента.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Вызовите `useContext` на верхнем уровне вашего компонента, чтобы читать и подписываться на [контекст.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `SomeContext`: Контекст, который вы ранее создали с помощью [`createContext`](/reference/react/createContext). Сам контекст не хранит информацию, он только представляет тип информации, которую вы можете передавать или читать из компонентов.

#### Возвращаемое значение {/*returns*/}

`useContext` возвращает значение контекста для вызывающего компонента. Оно определяется как `value`, переданное ближайшему `SomeContext.Provider` выше вызывающего компонента в дереве. Если такого провайдера нет, то возвращаемое значение будет `defaultValue`, которое вы передали в [`createContext`](/reference/react/createContext) для этого контекста. Возвращаемое значение всегда актуально. React автоматически перерендерит компоненты, которые читают контекст, если он изменится.

#### Предупреждения {/*caveats*/}

* Вызов `useContext()` в компоненте не затрагивается провайдерами, возвращёнными из *того же самого* компонента. Соответствующий `<Context.Provider>` **должен быть *выше*** компонента, который вызывает `useContext()`.
* React **автоматически перерендерит** всех потомков, которые используют определённый контекст, начиная с провайдера, который получил другое `value`. Предыдущее и следующее значения сравниваются с помощью [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Пропуск повторных рендеров с помощью [`memo`](/reference/react/memo) не помешает потомкам получить свежие значения контекста.
* Если ваша система сборки создаёт дублирующиеся модули в выходных данных (что может произойти при использовании символических ссылок), это может сломать контекст. Передача чего-либо через контекст работает только если `SomeContext`, который вы используете для передачи контекста, и `SomeContext`, который вы используете для его чтения, — это ***в точности* один и тот же объект**, что определяется сравнением `===`.

---

## Использование {/*usage*/}


### Передача данных глубоко в дерево {/*passing-data-deeply-into-the-tree*/}

Вызовите `useContext` на верхнем уровне вашего компонента, чтобы читать и подписываться на [контекст.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` возвращает <CodeStep step={2}>значение контекста</CodeStep> для переданного <CodeStep step={1}>контекста</CodeStep>. Чтобы определить значение контекста, React ищет по дереву компонентов и находит **ближайший провайдер контекста выше** для этого конкретного контекста.

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

Не имеет значения, сколько слоёв компонентов находится между провайдером и `Button`. Когда `Button` *где угодно* внутри `Form` вызывает `useContext(ThemeContext)`, он получит `"dark"` в качестве значения.

<Pitfall>

`useContext()` всегда ищет ближайший провайдер *выше* компонента, который его вызывает. Он ищет вверх и **не учитывает** провайдеры в компоненте, из которого вы вызываете `useContext()`.

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

Часто вы захотите изменять контекст со временем. Чтобы обновить контекст, совместите его с [состоянием.](/reference/react/useState) Объявите переменную состояния в родительском компоненте и передайте текущее состояние вниз как <CodeStep step={2}>значение контекста</CodeStep> провайдеру.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Переключить на светлую тему
      </Button>
    </ThemeContext.Provider>
  );
}
```

Теперь любой `Button` внутри провайдера будет получать текущее значение `theme`. Если вы вызовете `setTheme` для обновления значения `theme`, которое вы передаёте провайдеру, все компоненты `Button` перерендерятся с новым значением `'light'`.

<Recipes titleText="Примеры обновления контекста" titleId="examples-basic">

#### Обновление значения через контекст {/*updating-a-value-via-context*/}

В этом примере компонент `MyApp` содержит переменную состояния, которая затем передаётся провайдеру `ThemeContext`. Установка флажка "Тёмный режим" обновляет состояние. Изменение переданного значения перерендерит все компоненты, использующие этот контекст.

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
        Использовать тёмный режим
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Добро пожаловать">
      <Button>Регистрация</Button>
      <Button>Вход</Button>
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

Обратите внимание, что `value="dark"` передаёт строку `"dark"`, но `value={theme}` передаёт значение JavaScript-переменной `theme` с помощью [JSX-фигурных скобок.](/learn/javascript-in-jsx-with-curly-braces) Фигурные скобки также позволяют передавать значения контекста, которые не являются строками.

<Solution />

#### Обновление объекта через контекст {/*updating-an-object-via-context*/}

В этом примере есть переменная состояния `currentUser`, которая хранит объект. Вы объединяете `{ currentUser, setCurrentUser }` в один объект и передаёте его вниз через контекст внутри `value={}`. Это позволяет любому компоненту ниже, например `LoginButton`, читать и `currentUser`, и `setCurrentUser`, а затем вызывать `setCurrentUser` при необходимости.

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
      setCurrentUser({ name: 'Адвика' })
    }}>Войти как Адвика</Button>
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

#### Множественные контексты {/*multiple-contexts*/}

В этом примере есть два независимых контекста. `ThemeContext` предоставляет текущую тему, которая является строкой, а `CurrentUserContext` хранит объект, представляющий текущего пользователя.

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
Использовать тёмный режим
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
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
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

#### Извлечение провайдеров в компонент {/*extracting-providers-to-a-component*/}

По мере роста вашего приложения ожидается, что у вас появится "пирамида" контекстов ближе к корню приложения. В этом нет ничего плохого. Однако, если вам эстетически не нравится вложенность, вы можете извлечь провайдеры в один компонент. В этом примере `MyProviders` скрывает "водопровод" и рендерит переданных ему потомков внутри необходимых провайдеров. Обратите внимание, что состояние `theme` и `setTheme` нужно в самом `MyApp`, поэтому `MyApp` всё ещё владеет этой частью состояния.

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
        Использовать тёмный режим
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

#### Масштабирование с контекстом и редюсером {/*scaling-up-with-context-and-a-reducer*/}

В больших приложениях обычно комбинируют контекст с [редюсером](/reference/react/useReducer), чтобы извлечь логику, связанную с некоторым состоянием, из компонентов. В этом примере весь "водопровод" скрыт в `TasksContext.js`, который содержит редюсер и два отдельных контекста.

Прочитайте [полное пошаговое руководство](/learn/scaling-up-with-reducer-and-context) по этому примеру.

<Sandpack>

```js src/App.js
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

### Указание запасного значения по умолчанию {/*specifying-a-fallback-default-value*/}

Если React не может найти ни одного провайдера этого конкретного <CodeStep step={1}>контекста</CodeStep> в родительском дереве, значение контекста, возвращаемое `useContext()`, будет равно <CodeStep step={3}>значению по умолчанию</CodeStep>, которое вы указали при [создании этого контекста](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Значение по умолчанию **никогда не меняется**. Если вы хотите обновить контекст, используйте его с состоянием, как [описано выше.](#updating-data-passed-via-context)

Часто вместо `null` можно использовать более осмысленное значение по умолчанию, например:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

Таким образом, если вы случайно отрендерите какой-то компонент без соответствующего провайдера, он не сломается. Это также помогает вашим компонентам хорошо работать в тестовой среде без настройки множества провайдеров в тестах.

В примере ниже кнопка "Переключить тему" всегда светлая, потому что она находится **вне любого провайдера контекста темы**, и значение контекста темы по умолчанию — `'light'`. Попробуйте изменить тему по умолчанию на `'dark'`.

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
        Переключить тему
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Добро пожаловать">
      <Button>Регистрация</Button>
      <Button>Вход</Button>
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

Вы можете переопределить контекст для части дерева, обернув эту часть в провайдер с другим значением.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

Вы можете вкладывать и переопределять провайдеры столько раз, сколько нужно.

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
    <Panel title="Добро пожаловать">
      <Button>Регистрация</Button>
      <Button>Вход</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Настройки</Button>
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

Вы можете "накапливать" информацию, когда вкладываете провайдеры контекста. В этом примере компонент `Section` отслеживает `LevelContext`, который указывает глубину вложенности секции. Он читает `LevelContext` из родительской секции и предоставляет число `LevelContext`, увеличенное на единицу, своим потомкам. В результате компонент `Heading` может автоматически решать, какой из тегов `<h1>`, `<h2>`, `<h3>`, ..., использовать, в зависимости от того, в скольких компонентах `Section` он вложен.

Прочитайте [подробное пошаговое руководство](/learn/passing-data-deeply-with-context) по этому примеру.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Заголовок</Heading>
      <Section>
        <Heading>Подзаголовок</Heading>
        <Heading>Подзаголовок</Heading>
        <Heading>Подзаголовок</Heading>
        <Section>
          <Heading>Под-подзаголовок</Heading>
          <Heading>Под-подзаголовок</Heading>
          <Heading>Под-подзаголовок</Heading>
          <Section>
            <Heading>Под-под-подзаголовок</Heading>
            <Heading>Под-под-подзаголовок</Heading>
            <Heading>Под-под-подзаголовок</Heading>
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
      throw Error('Heading должен быть внутри Section!');
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
      throw Error('Неизвестный уровень: ' + level);
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

Вы можете передавать любые значения через контекст, включая объекты и функции.

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

Здесь <CodeStep step={2}>значение контекста</CodeStep> — это JavaScript-объект с двумя свойствами, одно из которых — функция. Когда `MyApp` перерендеривается (например, при обновлении маршрута), это будет *другой* объект, указывающий на *другую* функцию, поэтому React также будет перерендеривать все компоненты глубоко в дереве, которые вызывают `useContext(AuthContext)`.

В небольших приложениях это не проблема. Однако нет необходимости их повторно рендерить, если базовые данные, такие как `currentUser`, не изменились. Чтобы помочь React воспользоваться этим фактом, вы можете обернуть функцию `login` в [`useCallback`](/reference/react/useCallback), а создание объекта — в [`useMemo`](/reference/react/useMemo). Это оптимизация производительности:

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

В результате этого изменения, даже если `MyApp` потребуется перерендериться, компонентам, вызывающим `useContext(AuthContext)`, не нужно будет перерендериваться, если только `currentUser` не изменился.

Узнайте больше о [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) и [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Решение проблем {/*troubleshooting*/}

### Мой компонент не видит значение из моего провайдера {/*my-component-doesnt-see-the-value-from-my-provider*/}

Есть несколько распространённых способов, как это может произойти:

1. Вы рендерите `<SomeContext.Provider>` в том же компоненте (или ниже), где вызываете `useContext()`. Переместите `<SomeContext.Provider>` *выше и за пределы* компонента, вызывающего `useContext()`.
2. Возможно, вы забыли обернуть свой компонент в `<SomeContext.Provider>`, или поместили его в другую часть дерева, чем вы думали. Проверьте, правильна ли иерархия, используя [React DevTools.](/learn/react-developer-tools)
3. Возможно, у вас возникла проблема со сборкой с вашим инструментарием, из-за которой `SomeContext` в предоставляющем компоненте и `SomeContext` в читающем компоненте являются двумя разными объектами. Это может произойти, если вы используете символические ссылки, например. Вы можете проверить это, присвоив их глобальным переменным, таким как `window.SomeContext1` и `window.SomeContext2`, а затем проверив в консоли, равны ли `window.SomeContext1 === window.SomeContext2`. Если они не одинаковые, исправьте эту проблему на уровне инструмента сборки.

### Я всегда получаю `undefined` из моего контекста, хотя значение по умолчанию другое {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Возможно, у вас есть провайдер без `value` в дереве:

```js {1,2}
// 🚩 Не работает: нет пропа value
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

Если вы забудете указать `value`, это равносильно передаче `value={undefined}`.

Возможно, вы также по ошибке использовали другое имя пропа:

```js {1,2}
// 🚩 Не работает: проп должен называться "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

В обоих этих случаях вы должны увидеть предупреждение от React в консоли. Чтобы исправить их, назовите проп `value`:

```js {1,2}
// ✅ Передача пропа value
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Обратите внимание, что [значение по умолчанию из вашего вызова `createContext(defaultValue)`](#specifying-a-fallback-default-value) используется **только если вообще нет подходящего провайдера выше**. Если где-то в родительском дереве есть компонент `<SomeContext.Provider value={undefined}>`, компонент, вызывающий `useContext(SomeContext)`, *получит* `undefined` в качестве значения контекста.
