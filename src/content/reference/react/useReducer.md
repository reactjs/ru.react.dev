---
title: useReducer
---

<Intro>

`useReducer` это хук, который использует [редьюсер](/learn/extracting-state-logic-into-a-reducer), для управления состоянием компонента. 

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Вызовите `useReducer` на верхнем уровне компонента чтобы управлять состоянием с помощью [редьюсера.](/learn/extracting-state-logic-into-a-reducer)

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `reducer`: Редьюсер — чистая функция, которая определяет логику обновления состояния. Редьюсер принимает два аргумента – состояние и действие, и возвращает следующее состояние. Состояние и действие могут быть любых типов.
* `initialArg`: Значение на основе которого вычисляется начальное состояние. Значение начального состояния может быть любого типа. То как из него будет вычисляться начальное состояние, зависит от аргумента `init`.
* **optional** `init`: Функция инициализатора, которая возвращает начальное состояние. Если она не указана, то начальное состояние устанавливается в `initialArg`. В противном случае начальное состояние устанавливается в результат вызова `init(initialArg)`.

#### Возвращаемое значение {/*returns*/}

`useReducer` возвращает массив, и содержит только два значения:

1. Текущее состояние. Во время первого рендеринга, устанавливается `init(initialArg)` или `initialArg` если не указать параметр `init`.
2. Функцию [`dispatch` function](#dispatch), которая обновляет состояние до другого значения и вызывает повротный рендеринг.

#### Замечания {/*caveats*/}

* `useReducer это хук, поэтому вызывайте его только **на верхнем уровне компонента** или собственных хуков. useReducer нельзя вызвать, внутри циклов или условий. Если это нужно, создайте новый компонент и переместите состояние в него.
* В строгом режиме, React будет **вызывать редьюсер и инициализатор дважды** [поможет найти случайные побочные эффекты.](#my-reducer-or-initializer-function-runs-twice) Такое поведение проявляется, только в режиме разработки и не влияет на продакшен-режим. Логика обновления состояния не изменится, если редьюсер и инициализатор – чистые функции (какими они и должны быть). Результат второго вызова проигнорируется.

---

### Функция `dispatch` {/*dispatch*/}

Функция `dispatch`, которую возвращает `useReducer` обновляет состояние до другого значения и вызывает повторный рендеринг. Передайте действие в качестве единственного аргумента функции `dispatch`:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React установит следующее состояние как результат вызова функции `reducer`, которую вы предоставляете с текущим `state` и действием, которое вы передали в `dispatch`.

#### Параметры {/*dispatch-parameters*/}

* `action`: Действие выполняемое пользователем. `action` может быть значением любого типа. По соглашению, `action` — объект со свойством `type`, идентифицирующим его, и, по желанию, другими свойствами с дополнительной информацией.

#### Returns {/*dispatch-returns*/}

Функция `dispatch` не возвращает значения.

#### Замечания {/*setstate-caveats*/}

* Функция `dispatch` **обновляет состояние, только для *следующего* рендера**. Если прочитать переменную состояния, после вызова функции `dispatch`, [вы получите старое значение](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) которое было на экране, до вашего вызова.

* Если новое значение, которое вы предоставли, идентично текущему `state`, что определяется сравнением [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React  **пропустит повторное отображение компонента и дочерних элементов.** Это оптимизация. React также может попытаться вызвать компонент перед игнорированием результата, но это не должно повлиять на код.

* [Пакетное обновление состояния](/learn/queueing-a-series-of-state-updates) React. Обновляет экран **после того, как все обработчики событий были запущены** и вызвали свои `set` функции. Это предотвратит множественные повторные рендеринги во время одного события. В редких случаях, когда нужно заставить React обновить экран раньше, например, для доступа к DOM, используйте  [`flushSync`.](/reference/react-dom/flushSync)

---

## Применение {/*usage*/}

### Добавление редьюсера в компонент {/*adding-a-reducer-to-a-component*/}

Вызовите `useReducer` на верхнем уровне компонента, чтобы управлять состоянием компонента с помощью [редьюсера.](/learn/extracting-state-logic-into-a-reducer)

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` возвращает массив, который состоит из двух элементов:

1. <CodeStep step={1}>Текущее состояние</CodeStep> этой переменной состояния, первоначально установленное в <CodeStep step={3}>начальное состояние</CodeStep>, которое вы предоставили.
2. Функция <CodeStep step={2}>`dispatch`</CodeStep>, которая позволяет менять состояние в ответ на взаимодействие.

Чтобы обновить то, что вы видите на экране, вызовите <CodeStep step={2}>`dispatch`</CodeStep> с объектом, представляющим то, что сделал пользователь, который называется *action*:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React передаст текущее состояние и действие в <CodeStep step={4}>редьюсер</CodeStep>. Редьюсер вычислит и вернет следующее состояние. React сохранит это состояние, отрисует компонент и обновит пользовательский интерфейс.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Добавить год к возрату
      </button>
      <p>Привет! Тебе {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` похож на [`useState`](/reference/react/useState), но он переносит логику обновления состояния из обработчиков событий в одну функцию вне компонента. Подробнее о [выборе между `useState` и `useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### Составление функции редьюсера {/*writing-the-reducer-function*/}

Объявите редьюсер, следующим образом:

```js
function reducer(state, action) {
  // ...
}
```

Затем, напишите код, который вычислит и возвратить следущее состояние. По традиции, это делают при помощи инструкции [`switch`.](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/switch) Для каждого `case` в `switch`, вычислите и возвратите следующее состояние.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Действия могут иметь любую форму. По традиции, принято передавать объекты со свойством `type` идентифицирующим действие. Оно должно включать минимально необходимую информацию, которая нужна редьюсеру для вычисления следующего состояния.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Имена типов действий являются локальными для вашего компонента. [Каждое действие описывает одно взаимодействие, даже если оно приводит к нескольким изменениям данных.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) Форма состояния произвольна, но обычно это будет объект или массив.

Прочитайте про [извлечение логики состояния в редьюсер](/learn/extracting-state-logic-into-a-reducer) чтобы узнать больше.

<Pitfall>

Состояние доступно только для чтения. Не изменяйте никакие объекты или массивы в состоянии:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Не изменяйте состояние объекта напрямую, подобно этому:
      state.age = state.age + 1;
      return state;
    }
```

Вместо этого всегда возвращайте новые объекты из вашего редьюсера:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ вместо этого, верните новый объект:
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Прочитайте про [обновление объектов в состоянии](/learn/updating-objects-in-state) и [обновление массивов в состоянии](/learn/updating-arrays-in-state) чтобы узнать больше.

</Pitfall>

<Recipes titleText="Основные примеры использования useReducer" titleId="examples-basic">

#### Форма (объект) {/*form-object*/}

В этом примере, редьюсер управляет состоянием объекта с двумя полями: `name` и `age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Тэйлор', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Добавить год возраста
      </button>
      <p>Привет, {state.name}. Тебе {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Список дел (массив) {/*todo-list-array*/}

В этом примере, редьюсер управляет массивом из задач. Массив необходимо обновлять [без мутации.](/learn/updating-arrays-in-state)

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Посетить музей Кафки', done: true },
  { id: 1, text: 'Посмотреть кукольный спектакль', done: false },
  { id: 2, text: 'Сфотографировать стену Леннона', done: false }
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Добавить задачу"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

#### Написание локаничной логики, с помощью Immer {/*writing-concise-update-logic-with-immer*/}

Если обновление массивов и объектов без мутации для вас является утомительным занятием, вы можете использовать такую библиотеку как [Immer](https://github.com/immerjs/use-immer#useimmerreducer) для сокращения повторяющегося кода. Immer позволит вам писать лаконичный код, как если бы вы изменяли объекты, но под копотом, она выполняет неизменяемые обновления:

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Маршрут по Праге</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Посетить музей Кафки', done: true },
  { id: 1, text: 'Посмотреть кукольный спектакль', done: false },
  { id: 2, text: 'Сфотографировать стену Леннона', done: false },
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Добавить задачу"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
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
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Избегание пересоздания начального состояния {/*avoiding-recreating-the-initial-state*/}

React сохраняет начальное состояние один раз и игнорирует его при последующих рендерах.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

Хотя результат `createInitialState(username)` используется только, для начального рендеринга, вы все равно вызываете эту функцию при каждом рендеринге. Это может быть расточительно, если она создает большие массивы или выполняет дорогостоящие вычисления.

Чтобы решить эту проблему, вы можете **передать ее в качестве функции _initializer_** чтобы вместо него в качестве третьего аргумента использовать `useReducer`:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Обратите внимание, что вы передаета `createInitialState`, которая является *самой функцией*, а не `createInitialState()`, которая является результатом ее вызова. Таким образом, начальное состояние не будет повторно создано после инициализации.

В приведеном выше примере, `createInitialState` принимает аргумент `username`. Если вашему инициализатору не нужна информация для вычисления начального состояния, вы можете передать `null` в качестве второго аргументя `useReducer`.

<Recipes titleText="Разница между передачей инициализатора и начального состояния напрямую" titleId="examples-initializer">

#### Передача функции инифиализатора {/*passing-the-initializer-function*/}

В этом примере передается функция инициализатора, поэтому функция `createInitialState` выполняется только во время инициализации. Она не выполняется при повторном рендеринге компонента, например, когда вы вводите текст в поле ввода.

<Sandpack>

```js App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Тэйлор" />;
}
```

```js TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Передача начального значения напрямую {/*passing-the-initial-state-directly*/}

В этом примере **не** передачется функция инициализатора, поэтому функция `createInitialState` выполняется при каждом рендере, например когда вы вводите текст в input. Разница в поведении не заметна, но этот код менее эффективен.

<Sandpack>

```js App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Тэйлор" />;
}
```

```js TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## Устранение неполадок {/*troubleshooting*/}

### Я отправил действие, но возвращается старое значение состояния {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Вызов функции `dispatch` **не изменяет состояние в вызываемом коде**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Запрос повторного рендеринга с 43
  console.log(state.age);  // Все еще 42!

  setTimeout(() => {
    console.log(state.age); // Так же 42!
  }, 5000);
}
```

Это происходит потому–что [состояние ведет себя как снимок.](/learn/state-as-a-snapshot) Обновление состояния, запрашивает другой рендер с новым значением состояния, но не влияет на переменную JavaScript `state` в уже запущенном обработчике событий.

Если вам нужно получить значение следующего состояни, вы можете вычислить его вручную, вызвав редьюсер самостоятельно:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { возраст: 42 }
console.log(nextState); // { возраст: 43 }
```

---

### Я отправил действие, но экран не обновляется {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React будет **игнорировать ваше обновление, если следующее состояние равно предыдущему,** что определяется инструкцией [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is) сравнения. Обычно это происходит, когда вы изменяете объект или массив в состоянии напрямую:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Неправильно: изменение существующего объекта
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Неправильно: изменение существующего объекта
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Вы изменили существующий объект `state` и вернули его, поэтому React проигнорировал обновление. Чтобы исправиит это, убедитесь, что вы всегда [обновляете объекты в состоянии](/learn/updating-objects-in-state) и [обновляете массивы в состоянии](/learn/updating-arrays-in-state) не изменяя их:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Правильно: создание нового объекта
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Правильно: создание нового объекта
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Часть состояния моего редьюсера становится неопределенной после диспетчеризации {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Убедитесь, что каждая ветвь `case` **копирует все существующие поля** когда возвращает новое состояние:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Не забывайте об этом!
        age: state.age + 1
      };
    }
    // ...
```

Без `...state` выше, возвращаемое следующее состояние, будет возвращать только поле `age` и ничего больше.

---

### Все состояние моего редьюсера становится неопределенным после диспетчеризации {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Если ваше состояние неожиданно становится `undefined`, скорее всего, вы забыли `возвратить` состояние в одном из случаев, или ваш тип действия не соответствует ни одному из утверждений `case`. Чтобы выяснить причину, выбросьте ошибку вне `case`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Вы также можете использовать статическую проверку типов, например TypeScript, для выявления таких ошибок.

---

### Я получаю ошибку: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Вы можете получить ошибку, которая гласит: `Слишком много повторных рендеров. React ограничивает количество рендеров для предотвращения бесконечного цикла.` Обычно это означает, что вы безоговорочно отправляете действие *во время рендера*, поэтому ваш компонент попадает в цикл: рендер, диспетчеризация (которая вызывает рендер), рендер, диспетчеризация (которая вызывает рендер) и так далее. Очень часто причиной этого является ошибка в определении обработчика события:

```js {1-2}
// 🚩 Неправильно: вызывает обработчик во время рендеринга
return <button onClick={handleClick()}>Click me</button>

// ✅ Правильно: передает обработчик события
return <button onClick={handleClick}>Click me</button>

// ✅ Правильно: передается через встроенную функцию
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Если вы не можете найти причину этой ошибки, нажмите на стрелку рядом с ошибкой в консоли и просмотрите стек JavaScript, чтобы найти конкретный вызов функции `dispatch`, ответственный за ошибку.

---

### Моя функция редьюсера или инициализатора выполняется дважды {/*my-reducer-or-initializer-function-runs-twice*/}

В [строгом режиме](/reference/react/StrictMode), React будет вызывать ваши функции reducer и initializer дважды. Это не должно сломать ваш код.

Это поведение, справдедливо только для **режима разработки,** и помогает вам [поддерживать чистоту компонентов.](/learn/keeping-components-pure) React использует результат одного из вызовов и игнорирует результат другого вызова. Пока ваши функции компонента, инициализатора и редьюсера чисты, это не должно влиять на вашу логику. Однако если они случайно оказались нечистыми, это поможет вам заметить ошибки.

Например, эта нечистая функция редьюсера изменяет массив состояния напрямую:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Ошибка: изменения состояния напрямую
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```
Поскольку React дважды вызывает вашу функцию reducer, вы увидите, что todo было добавлено дважды, поэтому вы будете знать, что произошла ошибка. В этом примере вы можете исправить ошибку, [заменив массив вместо его изменения](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Правильно: замена на новое состояние
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Теперь, когда функция редьюсера является чистой, ее повторный вызов не изменит поведение. Вот почему двойной вызов в React помогает найти ошибки. **Только функции компонента, инициализатора и редьюсера должны быть чистыми.** Обработчики событий не должны быть чистыми, поэтому React никогда не будет вызывать обработчики событий дважды.

Прочитайте про [сохранение чистоты компонентов](/learn/keeping-components-pure) чтобы узнать больше.
