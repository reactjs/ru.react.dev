---
title: Extracting State Logic into a Reducer
---

<Intro>

Компоненты с большим количеством обновлений состояния, распределенных по множеству обработчиков событий, могут стать громоздкими. В таких случаях вы можете объединить всю логику обновления состояния вне компонента в одну функцию, называемую _редьюсером_.

</Intro>

<YouWillLearn>

- Что такое функция-редьюсер
- Как рефакторить `useState` в `useReducer`
- Когда использовать редьюсер
- Как хорошо его написать

</YouWillLearn>

## Объединение логики состояния с помощью редьюсера {/*consolidate-state-logic-with-a-reducer*/}

По мере усложнения ваших компонентов становится труднее с первого взгляда увидеть все различные способы обновления состояния компонента. Например, компонент `TaskApp` ниже хранит массив `tasks` в состоянии и использует три разных обработчика событий для добавления, удаления и редактирования задач:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Каждый из его обработчиков событий вызывает `setTasks` для обновления состояния. По мере роста компонента увеличивается и объем логики состояния, разбросанной по нему. Чтобы уменьшить эту сложность и сохранить всю логику в одном легкодоступном месте, вы можете переместить эту логику состояния в одну функцию вне компонента, **называемую "редьюсером".**

Редьюсеры — это другой способ управления состоянием. Вы можете перейти от `useState` к `useReducer` за три шага:

1. **Переместите** логику установки состояния на отправку действий (dispatch actions).
2. **Напишите** функцию-редьюсер.
3. **Используйте** редьюсер из вашего компонента.

### Шаг 1: Переход от установки состояния к отправке действий {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Ваши обработчики событий в настоящее время указывают, _что делать_, устанавливая состояние:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Удалите всю логику установки состояния. То, что у вас останется, — это три обработчика событий:

- `handleAddTask(text)` вызывается, когда пользователь нажимает "Add".
- `handleChangeTask(task)` вызывается, когда пользователь переключает задачу или нажимает "Save".
- `handleDeleteTask(taskId)` вызывается, когда пользователь нажимает "Delete".

Управление состоянием с помощью редьюсеров немного отличается от прямой установки состояния. Вместо того чтобы сообщать React, "что делать", устанавливая состояние, вы указываете, "что только что сделал пользователь", отправляя "действия" (actions) из ваших обработчиков событий. (Логика обновления состояния будет находиться в другом месте!) Таким образом, вместо "установки `tasks`" через обработчик событий, вы отправляете действие "добавлена/изменена/удалена задача". Это более описательно для намерения пользователя.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

Объект, который вы передаете в `dispatch`, называется "действием" (action):

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // Объект "действия":
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

Это обычный объект JavaScript. Вы решаете, что в него поместить, но обычно он должен содержать минимальную информацию о _том, что произошло_. (Вы добавите функцию `dispatch` на следующем шаге.)

<Note>

Объект действия может иметь любую структуру.

По соглашению, принято давать ему строковый `type`, описывающий произошедшее, и передавать любую дополнительную информацию в других полях. `type` специфичен для компонента, поэтому в этом примере подойдет как `'added'`, так и `'added_task'`. Выберите имя, которое говорит о том, что произошло!

```js
dispatch({
  // специфично для компонента
  type: 'что_произошло',
  // другие поля здесь
});
```

</Note>

### Шаг 2: Напишите функцию-редьюсер {/*step-2-write-a-reducer-function*/}

Функция-редьюсер — это место, где вы будете размещать логику состояния. Она принимает два аргумента: текущее состояние и объект действия, и возвращает следующее состояние:

```js
function yourReducer(state, action) {
  // вернуть следующее состояние для установки React
}
```

React установит состояние в то, что вы вернете из редьюсера.

Чтобы переместить логику установки состояния из обработчиков событий в функцию-редьюсер в этом примере, вы:

1. Объявите текущее состояние (`tasks`) как первый аргумент.
2. Объявите объект `action` как второй аргумент.
3. Верните _следующее_ состояние из редьюсера (которое React установит в качестве состояния).

Вот вся логика установки состояния, перенесенная в функцию-редьюсер:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

Поскольку функция-редьюсер принимает состояние (`tasks`) в качестве аргумента, вы можете **объявить ее вне вашего компонента.** Это уменьшает уровень отступов и может сделать ваш код более читаемым.

<Note>

В приведенном выше коде используются операторы if/else, но по соглашению в редьюсерах принято использовать [операторы switch](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch). Результат тот же, но операторы switch могут быть легче для восприятия с первого взгляда.

Мы будем использовать их на протяжении всего остального документа следующим образом:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

Мы рекомендуем заключать каждый блок `case` в фигурные скобки `{` и `}`, чтобы переменные, объявленные внутри разных `case`, не конфликтовали друг с другом. Кроме того, `case` обычно должен заканчиваться `return`. Если вы забудете `return`, код "провалится" в следующий `case`, что может привести к ошибкам!

Если вы еще не знакомы с операторами switch, использование if/else совершенно нормально.

</Note>

<DeepDive>

#### Почему редьюсеры называются так? {/*why-are-reducers-called-this-way*/}

Хотя редьюсеры могут "уменьшить" количество кода внутри вашего компонента, на самом деле они названы в честь операции [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce), которую можно выполнить над массивами.

Операция `reduce()` позволяет взять массив и "накопить" одно значение из многих:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

Функция, которую вы передаете в `reduce`, известна как "редьюсер". Она берет _текущий результат_ и _текущий элемент_, а затем возвращает _следующий результат._ Редьюсеры React являются примером той же идеи: они берут _текущее состояние_ и _действие_, и возвращают _следующее состояние._ Таким образом, они накапливают действия со временем в состояние.

Вы даже можете использовать метод `reduce()` с `initialState` и массивом `actions` для вычисления конечного состояния, передав ему вашу функцию-редьюсер:

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Вы, вероятно, не будете делать это сами, но это похоже на то, что делает React!

</DeepDive>

### Шаг 3: Используйте редьюсер из вашего компонента {/*step-3-use-the-reducer-from-your-component*/}

Наконец, вам нужно подключить `tasksReducer` к вашему компоненту. Импортируйте хук `useReducer` из React:

```js
import { useReducer } from 'react';
```

Затем вы можете заменить `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

на `useReducer` следующим образом:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

Хук `useReducer` похож на `useState` — вы должны передать ему начальное состояние, и он возвращает значение состояния и способ установки состояния (в данном случае, функцию `dispatch`). Но он немного отличается.

Хук `useReducer` принимает два аргумента:

1. Функция-редьюсер
2. Начальное состояние

И возвращает:

1. Значение состояния
2. Функция `dispatch` (для "отправки" действий пользователя в редьюсер)

Теперь все подключено! Здесь редьюсер объявлен внизу файла компонента:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

При желании вы можете переместить редьюсер в другой файл:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Логику компонента легче читать, когда вы разделяете обязанности таким образом. Теперь обработчики событий только указывают, _что произошло_, отправляя действия, а функция-редьюсер определяет, _как состояние обновляется_ в ответ на них.

## Сравнение `useState` и `useReducer` {/*comparing-usestate-and-usereducer*/}

Редьюсеры не лишены недостатков! Вот несколько способов их сравнить:

- **Размер кода:** В целом, с `useState` вы пишете меньше кода изначально. С `useReducer` вам придется написать как функцию-редьюсер, _так и_ отправлять действия. Однако `useReducer` может помочь сократить код, если многие обработчики событий изменяют состояние схожим образом.
- **Читаемость:** `useState` очень легко читать, когда обновления состояния просты. Когда они становятся более сложными, они могут раздуть код вашего компонента и затруднить его сканирование. В этом случае `useReducer` позволяет чисто отделить _как_ логика обновления от _что произошло_ в обработчиках событий.
- **Отладка:** Когда у вас возникает ошибка с `useState`, может быть трудно определить, _где_ состояние было установлено неправильно и _почему_. С `useReducer` вы можете добавить вывод в консоль в ваш редьюсер, чтобы увидеть каждое обновление состояния и _почему_ оно произошло (из-за какого `action`). Если каждое `action` корректно, вы будете знать, что ошибка заключается в самой логике редьюсера. Однако вам придется пройти через больше кода, чем с `useState`.
- **Тестирование:** Редьюсер — это чистая функция, которая не зависит от вашего компонента. Это означает, что вы можете экспортировать и тестировать ее отдельно, изолированно. Хотя в целом лучше тестировать компоненты в более реалистичной среде, для сложной логики обновления состояния может быть полезно убедиться, что ваш редьюсер возвращает определенное состояние для определенного начального состояния и действия.
- **Личные предпочтения:** Некоторым нравятся редьюсеры, другим — нет. Это нормально. Это вопрос предпочтений. Вы всегда можете конвертировать между `useState` и `useReducer` туда и обратно: они эквивалентны!

Мы рекомендуем использовать редьюсер, если вы часто сталкиваетесь с ошибками из-за неправильных обновлений состояния в каком-либо компоненте и хотите внести больше структуры в его код. Вам не обязательно использовать редьюсеры для всего: смешивайте и сочетайте по своему усмотрению! Вы даже можете использовать `useState` и `useReducer` в одном компоненте.

## Хорошее написание редьюсеров {/*writing-reducers-well*/}

При написании редьюсеров помните эти два совета:

- **Редьюсеры должны быть чистыми.** Подобно [функциям обновления состояния](/learn/queueing-a-series-of-state-updates), редьюсеры выполняются во время рендеринга! (Действия ставятся в очередь до следующего рендеринга.) Это означает, что редьюсеры [должны быть чистыми](/learn/keeping-components-pure)—одинаковые входные данные всегда должны давать одинаковый результат. Они не должны отправлять запросы, планировать тайм-ауты или выполнять какие-либо побочные эффекты (операции, влияющие на что-то вне компонента). Они должны обновлять [объекты](/learn/updating-objects-in-state) и [массивы](/learn/updating-arrays-in-state) без мутаций.
- **Каждое действие описывает одно взаимодействие пользователя, даже если это приводит к нескольким изменениям в данных.** Например, если пользователь нажимает "Reset" в форме с пятью полями, управляемыми редьюсером, имеет смысл отправить одно действие `reset_form`, а не пять отдельных действий `set_field`. Если вы регистрируете каждое действие в редьюсере, этот лог должен быть достаточно ясным, чтобы вы могли восстановить, какие взаимодействия или ответы произошли и в каком порядке. Это помогает при отладке!

## Написание лаконичных редюсеров с Immer {/*writing-concise-reducers-with-immer*/}

Подобно [обновлению объектов](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) и [массивов](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) в обычном состоянии, вы можете использовать библиотеку Immer, чтобы сделать редюсеры более лаконичными. Здесь [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) позволяет вам мутировать состояние с помощью `push` или присваивания `arr[i] =`:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Пражский маршрут</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Посетить музей Кафки', done: true},
  {id: 1, text: 'Посмотреть кукольное представление', done: false},
  {id: 2, text: 'Фото у стены Леннона', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Добавить задачу"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Добавить
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Сохранить</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Редактировать</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Удалить</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
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

Редюсеры должны быть чистыми, поэтому они не должны мутировать состояние. Но Immer предоставляет специальный объект `draft`, который безопасно мутировать. Под капотом Immer создаст копию вашего состояния с изменениями, которые вы внесли в `draft`. Вот почему редюсеры, управляемые `useImmerReducer`, могут мутировать свой первый аргумент и не нуждаются в возврате состояния.

<Recap>

- Чтобы перейти от `useState` к `useReducer`:
  1. Отправляйте действия из обработчиков событий.
  2. Напишите функцию-редюсер, которая возвращает следующее состояние для данного состояния и действия.
  3. Замените `useState` на `useReducer`.
- Редюсеры требуют написания немного большего кода, но они помогают с отладкой и тестированием.
- Редюсеры должны быть чистыми.
- Каждое действие описывает одно взаимодействие пользователя.
- Используйте Immer, если вы хотите писать редюсеры в мутирующем стиле.

</Recap>

<Challenges>

#### Отправка действий из обработчиков событий {/*dispatch-actions-from-event-handlers*/}

В настоящее время обработчики событий в `ContactList.js` и `Chat.js` содержат комментарии `// TODO`. Именно поэтому ввод текста в поле не работает, а нажатие на кнопки не меняет выбранного получателя.

Замените эти два `// TODO` кодом для отправки соответствующих действий. Чтобы увидеть ожидаемую структуру и тип действий, проверьте редюсер в `messengerReducer.js`. Редюсер уже написан, поэтому вам не нужно его менять. Вам нужно только отправлять действия в `ContactList.js` и `Chat.js`.

<Hint>

Функция `dispatch` уже доступна в обоих этих компонентах, так как она была передана в качестве пропса. Поэтому вам нужно вызвать `dispatch` с соответствующим объектом действия.

Чтобы проверить структуру объекта действия, вы можете посмотреть на редюсер и увидеть, какие поля `action` он ожидает увидеть. Например, случай `changed_selection` в редюсере выглядит так:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

Это означает, что ваш объект действия должен иметь `type: 'changed_selection'`. Вы также видите, что используется `action.contactId`, поэтому вам нужно включить свойство `contactId` в ваше действие.

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Из кода редюсера вы можете сделать вывод, что действия должны выглядеть так:

```js
// Когда пользователь нажимает "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// Когда пользователь вводит "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

Вот обновленный пример, отправляющий соответствующие сообщения:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Очистка поля ввода при отправке сообщения {/*clear-the-input-on-sending-a-message*/}

В настоящее время нажатие кнопки "Send" ничего не делает. Добавьте обработчик событий к кнопке "Send", который будет:

1. Отображать `alert` с email получателя и сообщением.
2. Очищать поле ввода сообщения.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Есть пара способов сделать это в обработчике событий кнопки "Send". Один из подходов — показать оповещение, а затем отправить действие `edited_message` с пустым `message`:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Это работает и очищает поле ввода при нажатии "Send".

Однако с точки зрения пользователя отправка сообщения — это другое действие, чем редактирование поля. Чтобы отразить это, вы можете вместо этого создать _новое_ действие под названием `sent_message` и обрабатывать его отдельно в редюсере:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Результат работы тот же. Но помните, что типы действий в идеале должны описывать "что сделал пользователь", а не "как вы хотите изменить состояние". Это облегчит добавление новых функций в будущем.

При любом из этих решений важно, чтобы вы **не** помещали `alert` внутрь редюсера. Редюсер должен быть чистой функцией — он должен только вычислять следующее состояние. Он не должен ничего "делать", включая отображение сообщений пользователю. Это должно происходить в обработчике событий. (Чтобы помочь выявить такие ошибки, React будет вызывать ваши редюсеры несколько раз в Strict Mode. Вот почему, если вы поместите оповещение в редюсер, оно сработает дважды.)

</Solution>

#### Восстановление значений полей ввода при переключении вкладок {/*restore-input-values-when-switching-between-tabs*/}

В этом примере при переключении между разными получателями текстовое поле ввода всегда очищается:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Очищает поле ввода
  };
```

Это связано с тем, что вы не хотите использовать один и тот же черновик сообщения для нескольких получателей. Но было бы лучше, если бы ваше приложение «запоминало» черновик для каждого контакта отдельно, восстанавливая его при переключении контактов.

Ваша задача — изменить структуру состояния так, чтобы запоминать отдельный черновик сообщения для каждого контакта. Вам потребуется внести несколько изменений в редьюсер, начальное состояние и компоненты.

<Hint>

Вы можете структурировать своё состояние следующим образом:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Черновик для contactId = 0
    1: 'Hello, Alice', // Черновик для contactId = 1
  },
};
```

Синтаксис [вычисляемых имён свойств](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) `[key]: value` может помочь вам обновить объект `messages`:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Вам потребуется обновить редьюсер, чтобы он сохранял и обновлял отдельный черновик сообщения для каждого контакта:

```js
// При редактировании поля ввода
case 'edited_message': {
  return {
    // Сохраняем другое состояние, например, выбранный контакт
    ...state,
    messages: {
      // Сохраняем сообщения для других контактов
      ...state.messages,
      // Но изменяем сообщение для выбранного контакта
      [state.selectedId]: action.message
    }
  };
}
```

Вам также потребуется обновить компонент `Messenger`, чтобы он считывал сообщение для текущего выбранного контакта:

```js
const message = state.messages[state.selectedId];
```

Вот полное решение:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Обратите внимание, что вам не пришлось изменять какие-либо обработчики событий для реализации этого другого поведения. Без редьюсера вам пришлось бы изменять каждый обработчик событий, который обновляет состояние.

</Solution>

#### Реализация `useReducer` с нуля {/*implement-usereducer-from-scratch*/}

В предыдущих примерах вы импортировали хук `useReducer` из React. На этот раз вы реализуете сам хук `useReducer`! Вот заготовка, которая поможет вам начать. Это не должно занять больше 10 строк кода.

Чтобы протестировать изменения, попробуйте ввести текст в поле ввода или выбрать контакт.

<Hint>

Вот более подробный эскиз реализации:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Вспомните, что функция-редьюсер принимает два аргумента — текущее состояние и объект действия — и возвращает следующее состояние. Что должна делать ваша реализация `dispatch` с этим?

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Отправка действия вызывает редьюсер с текущим состоянием и действием и сохраняет результат как следующее состояние. Вот как это выглядит в коде:

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Хотя в большинстве случаев это не имеет значения, немного более точная реализация выглядит так:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

Это связано с тем, что отправляемые действия ставятся в очередь до следующего рендеринга, [подобно функциям обновления.](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>
