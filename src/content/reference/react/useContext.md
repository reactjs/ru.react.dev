---
title: useContext
---

<Intro>

`useContext` -- это хук, который позволяет вам считывать и подписываться на [контекст](/learn/passing-data-deeply-with-context) внутри вашего компонента.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Вызовите `useContext` на верхнем уровне вашего компонента, чтобы прочитать и подписаться на [контекст.](/learn/passing-data-deeply-with-context)

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

`useContext` возвращает значение контекста для вызывающего компонента. Оно определяется как `value`, переданное ближайшему `SomeContext.Provider` выше по дереву, чем вызывающий компонент. Если такого источника нет, то вернётся `defaultValue`, который вы передали в [`createContext`](/reference/react/createContext) для этого контекста. Возвращаемое значение всегда актуально. React автоматически повторно рендерит компоненты, которые считывают определённый контекст, при его изменении.

#### Замечания {/*caveats*/}

* Вызов `useContext()` из компонента не будет затронут источниками, возвращёнными из  *того же* компонента. Соответствующий `<Context.Provider>` **обязан быть *выше по дереву***, чем компонент, который вызывает `useContext()`.
* React **автоматически повторно рендерит** все дочерние компоненты, использующие источник, значение `value` которого было изменено. Предшествующее и следующее значения сравниваются, используя сравнение [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Пропуск повторных рендеров с помощью [`memo`](/reference/react/memo) не препятствует получению дочерними компонентами актуальных значений контекста.
* Если ваша система сборки дублирует выходящие модули (что может произойти при использовании символических ссылок), результат использования контекста может быть непредсказуемым. Передача чего-либо через контекст будет успешна только если `SomeContext`, который вы используете для  предоставления контекста, и `SomeContext`, который вы используете, чтобы его считать, ***полностью* идентичны друг другу**, аналогично оператору сравнения `===`.

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

Не имеет значения, сколько слоёв компонентов находится между источником контекста и  `Button`. Когда `Button` *в любом месте* внутри `Form` вызовет `useContext(ThemeContext)`, он получит значение `"dark"`.

<Pitfall>

`useContext()` всегда ищет ближайший источник контекста *выше по дереву*, чем компонент, который его запрашивает. Он делает поиск только вверх и **не** рассматривает источники в компоненте, вызывающем `useContext()`.

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

Чаще всего вам понадобится, чтобы контекст менялся со временем. Чтобы изменить контекст, используйте его вместе с [состоянием.](/reference/react/useState) Объявите переменную состояния в родительском компоненте, и передайте текущее состояние вниз по дереву как <CodeStep step={2}>значение контекста</CodeStep>.

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

Теперь любой компонент `Button` внутри источника будет получать текущее значение `theme`. Если вы вызовете `setTheme`, чтобы изменить значение `theme`, которое вы передаёте в источник, все компоненты `Button` будут повторно отрендерены с новым зачением `'light'`.

<Recipes titleText="Примеры изменения контекста" titleId="examples-basic">

#### Изменение значения через контекст {/*updating-a-value-via-context*/}

В этом примере компонент `MyApp` содержит переменную состояния, которая затем передаётся в источник `ThemeContext`. Активация чекбокса "Dark mode" изменяет состояние. Изменение предоставляемого значения вызывает повторный рендер всех компонентов, использующих данный контекст.

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
        Тёмная тема
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

Заметьте, что `value="dark"` передаёт строку `"dark"`, однако `value={theme}` передаёт значение JavaScript-переменной `theme`, используя [фигурные скобки JSX.](/learn/javascript-in-jsx-with-curly-braces) Фигурные скобки также позволяют вам передавать в контекст другие значения помимо строк.

<Solution />

#### Изменение объекта через контекст {/*updating-an-object-via-context*/}

В данном примере есть переменная состояния `currentUser`, которая хранит объект. Вы объединяете `{ currentUser, setCurrentUser }` в один объект и передаёте его вниз через контекст, используя `value={}`. В этом случае любой компонент ниже по дереву, например `LoginButton`, считывают и `currentUser`, и `setCurrentUser`, а затем вызывают `setCurrentUser` по необходимости.

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

В данном примере есть два независимых контекста. `ThemeContext` передаёт текущую тему, которая является строкой, а `CurrentUserContext` хранит объект с описанием текущего пользователя.

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
          Использовать тёмную тему
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

С ростом вашего приложения, у вас, скорее всего, появится "пирамида" из контекстов ближе к корневому компоненту. В этом нет никакой проблемы. Однако, если вам эстетически не по душе такая вложенность, вы можете выделить источники контекста в отдельный компонент. В данном примере, `MyProviders` прячет всю реализацию и рендерит переданные ему дочерние компоненты внутри необходимых источников. Заметьте, что состояние `theme` и `setTheme` используется в самом `MyApp`, поэтому `MyApp` все ещё содержит эту часть состояния.

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
        Использовать тёмную тему
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

В больших приложениях частой практикой является совмещение контекста с [редюсером](/reference/react/useReducer) чтобы вынести всю относящуюся к состоянию логику из компонентов. В данном примере, всё "закулисье" находится в файле `TasksContext.js`, который содержит редюсер и два отдельных контекста.

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

### Указание стандартного запасного значения {/*specifying-a-fallback-default-value*/}

Если React не сможет найти ни одного источника конкретного <CodeStep step={1}>контекста</CodeStep> в дереве родительских компонентов, значение контекста возвращённое вызовом `useContext()` будет равно <CodeStep step={3}>стандартному значению</CodeStep>, которое вы указали при [создании этого контекста](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Стандартное значения **остаётся неизменным**. Если вы хотите изменить контекст, используйте его вместе с состоянием, [как описано выше.](#updating-data-passed-via-context)

Зачастую, вместо использования `null`, можно задать более содержательное стандартное значение, например:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

В ином случае, если вы случайно отрендерите какой-то компонент без соответствующего источника контекста, что-то может пойти не так. Такой подход также поможет вашим компонентам хорошо работать в тестовом окружении, без установки множества источников в тестах.

В примере выше кнопка "Toggle theme" всегда светлая, потому что она находится **снаружи какого-либо источника контекста темы**, а стандартное значение источника контекста темы -- `'light'`. Можете попробовать изменить стандартное значение темы на `'dark'`.

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

Вы можете переопределить контекст для части дерева, обернув её в источник контекста с другими значениями.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

Вы можете вкладывать и переопределять источники сколько вам нужно.

<Recipes title="Примеры переопределения контекста">

#### Переопределение темы {/*overriding-a-theme*/}

В данном случае, кнопка *внутри* компонента `Footer` получает значение контекста (`"light"`), в отличие от кнопок снаружи, которые получают (`"dark"`).

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

#### Автоматическое вкладывание заголовков {/*automatically-nested-headings*/}

Вы можете "аккумулировать" данные при вкладывании источников контекста. В данном примере, компонент `Section` следит за `LevelContext`, который определяет глубину вложенности разделов. Он получает значение `LevelContext` из родительского компонента раздела, и предоставляет число `LevelContext`, увеличенное на единицу, своим дочерним компонентам. В результате компонент `Heading` может сам решить, какой из `<h1>`, `<h2>`, `<h3>`, ..., тегов использовать, в зависимости от того, сколько компонентов `Section` находятся выше него.

Смотрите [полное описание](/learn/passing-data-deeply-with-context) этого примера.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Название</Heading>
      <Section>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Section>
          <Heading>Подзаголовок</Heading>
          <Heading>Подзаголовок</Heading>
          <Heading>Подзаголовок</Heading>
          <Section>
            <Heading>Подподзаголовок</Heading>
            <Heading>Подподзаголовок</Heading>
            <Heading>Подподзаголовок</Heading>
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
      throw Error('Заголовок должен быть внутри раздела!');
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
      throw Error('Неизвестный уровень глубины: ' + level);
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

### Оптимизация повторных рендеров при передаче объектов и функций {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Вы можете передавать через контекст любые значения, включая объекты и функции.

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

В данном случае, <CodeStep step={2}>значение контекста</CodeStep> является JavaScript-объектом с двумя свойствами, одно из которых -- функция. Когда произойдёт повторный рендер `MyApp` (например, при обновлении маршрута), это значение станет *другим* объектом, указывающим на *другую* функцию, и React придётся заново рендерить все компоненты в этом дереве, вызывающие `useContext(AuthContext)`.

В небольших приложениях это не проблема. Однако нет необходимости заново рендерить их если основные данные, как, например, `currentUser`, не изменились. Чтобы помочь React воспользоваться этим фактом, вы можете обернуть функцию `login` в [`useCallback`](/reference/react/useCallback), а создание объекта -- в [`useMemo`](/reference/react/useMemo). Это -- оптимизация производительности:

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

В результате этого изменения, даже если компоненту `MyApp` нужен повторный рендер, компонентам, вызывающим `useContext(AuthContext)`, не понадобится повторный рендер, если, конечно, не изменился `currentUser`.

Узнайте больше про [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) и [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Устранение неполадок {/*troubleshooting*/}

### Мой компонент не видит значение из источника контекста {/*my-component-doesnt-see-the-value-from-my-provider*/}

Есть несколько распространённых причин, по которым это может происходить:

1. Вы рендерите `<SomeContext.Provider>` в том же компоненте (или ниже по дереву), в котором вызываете `useContext()`. Сдвиньте `<SomeContext.Provider>` *выше и наружу* компонента, вызывающего `useContext()`.
2. Возможно, вы забыли обернуть ваш компонент в `<SomeContext.Provider>`, или он попал не в ту часть дерева, в которой вы его ожидали. Проверьте вашу иерархию с помощью [React DevTools.](/learn/react-developer-tools)
3. Вы можете иметь дело с какой-то проблемой сборки вашими инструментами приложения, из-за которой `SomeContext`, как контекст из предоставляющего его компонента, и `SomeContext`, как контекст из читающего компонента, становятся двумя разными объектами. Это может произойти, например, при использовании символических ссылок. Вы можете проверить это, если присвоите контексты глобальным переменным, например  `window.SomeContext1` и `window.SomeContext2`, а затем написать в консоли `window.SomeContext1 === window.SomeContext2`. Если они различаются, эту проблему нужно исправлять на уровне инструментов сборки.

### Мой контекст всегда возвращает `undefined`, хотя стандартное значение отличается {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Возможно, вы забыли прописать `value` вашему источнику в дереве:

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

Если же вы забыли указать `value`, это то же самое, как передать в источник `value={undefined}`.

Также возможно, что вы по ошибке использовали другое имя пропа:

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

Если возникнет любая из этих проблем, вы увидите в консоли предупреждение от React. Чтобы исправить их, назовите проп `value`:

```js {1,2}
// ✅ Passing the value prop
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Заметьте, что [стандартное значение вызова `createContext(defaultValue)`](#specifying-a-fallback-default-value) используется лишь **если соответсвующего источника контекста не существует выше по дереву** Если же где-то в дереве родительских компонентов есть компонент `<SomeContext.Provider value={undefined}>`, компонент, вызывающий `useContext(SomeContext)` *получит* `undefined` как значение контекста.
