---
title: Managing State
---

<Intro>

По мере роста вашего приложения полезно более осознанно подходить к организации состояния и потокам данных между компонентами. Избыточное или дублирующееся состояние — частый источник ошибок. В этой главе вы узнаете, как правильно структурировать состояние, как поддерживать логику обновления состояния в управляемом виде и как совместно использовать состояние между удалёнными компонентами.

</Intro>

<YouWillLearn isChapter={true}>

* [Как думать об изменениях UI как об изменениях состояния](/learn/reacting-to-input-with-state)
* [Как правильно структурировать состояние](/learn/choosing-the-state-structure)
* [Как «поднимать состояние вверх» для совместного использования между компонентами](/learn/sharing-state-between-components)
* [Как контролировать сохранение или сброс состояния](/learn/preserving-and-resetting-state)
* [Как консолидировать сложную логику состояния в функции](/learn/extracting-state-logic-into-a-reducer)
* [Как передавать информацию без «проп-драйлинга»](/learn/passing-data-deeply-with-context)
* [Как масштабировать управление состоянием по мере роста приложения](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## Реакция на ввод с помощью состояния {/*reacting-to-input-with-state*/}

В React вы не будете напрямую изменять UI из кода. Например, вы не будете писать команды вроде «отключить кнопку», «включить кнопку», «показать сообщение об успехе» и т. д. Вместо этого вы опишете UI, который хотите видеть для различных визуальных состояний вашего компонента («начальное состояние», «состояние ввода», «состояние успеха»), а затем будете запускать изменения состояния в ответ на ввод пользователя. Это похоже на то, как дизайнеры думают об UI.

Вот форма викторины, созданная с использованием React. Обратите внимание, как она использует переменную состояния `status`, чтобы определить, следует ли включать или отключать кнопку отправки, и следует ли показывать сообщение об успехе вместо этого.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

Прочтите **[Реакция на ввод с помощью состояния](/learn/reacting-to-input-with-state)**, чтобы узнать, как подходить к взаимодействиям с точки зрения управления состоянием.

</LearnMore>

## Выбор структуры состояния {/*choosing-the-state-structure*/}

Правильная структура состояния может иметь решающее значение между компонентом, который приятно изменять и отлаживать, и тем, который является постоянным источником ошибок. Самый важный принцип — состояние не должно содержать избыточной или дублирующейся информации. Если есть ненужное состояние, его легко забыть обновить, что приведёт к ошибкам!

Например, эта форма имеет **избыточную** переменную состояния `fullName`:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Вы можете удалить его и упростить код, вычисляя `fullName` во время рендеринга компонента:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Это может показаться небольшим изменением, но многие ошибки в приложениях React исправляются таким образом.

<LearnMore path="/learn/choosing-the-state-structure">

Прочтите **[Выбор структуры состояния](/learn/choosing-the-state-structure)**, чтобы узнать, как проектировать форму состояния для предотвращения ошибок.

</LearnMore>

## Совместное использование состояния между компонентами {/*sharing-state-between-components*/}

Иногда вам нужно, чтобы состояние двух компонентов всегда изменялось вместе. Для этого удалите состояние из обоих компонентов, переместите его в их ближайшего общего родителя, а затем передайте его им через пропсы. Это известно как «подъём состояния вверх» (lifting state up), и это одна из самых распространённых вещей, которые вы будете делать при написании кода React.

В этом примере только одна панель должна быть активна одновременно. Чтобы добиться этого, вместо того чтобы хранить активное состояние внутри каждой отдельной панели, родительский компонент хранит состояние и указывает пропсы для своих дочерних компонентов.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

Прочтите **[Совместное использование состояния между компонентами](/learn/sharing-state-between-components)**, чтобы узнать, как поднимать состояние вверх и синхронизировать компоненты.

</LearnMore>

## Сохранение и сброс состояния {/*preserving-and-resetting-state*/}

При повторном рендеринге компонента React должен решить, какие части дерева сохранить (и обновить), а какие — отбросить или пересоздать с нуля. В большинстве случаев автоматическое поведение React работает достаточно хорошо. По умолчанию React сохраняет части дерева, которые «совпадают» с предыдущим деревом отрендеренного компонента.

Однако иногда это не то, чего вы хотите. В этом чат-приложении ввод сообщения, а затем переключение получателя не сбрасывает поле ввода. Это может привести к тому, что пользователь случайно отправит сообщение не тому человеку:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

React позволяет переопределить поведение по умолчанию и *принудительно* сбросить состояние компонента, передав ему другой `key`, например `<Chat key={email} />`. Это говорит React, что если получатель отличается, он должен считаться *другим* компонентом `Chat`, который необходимо пересоздать с нуля с новыми данными (и UI, такими как поля ввода). Теперь переключение между получателями сбрасывает поле ввода — даже если вы рендерите один и тот же компонент.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

Прочтите **[Сохранение и сброс состояния](/learn/preserving-and-resetting-state)**, чтобы узнать о жизненном цикле состояния и как им управлять.

</LearnMore>

## Извлечение логики состояния в редьюсер {/*extracting-state-logic-into-a-reducer*/}

Компоненты с множеством обновлений состояния, распределённых по многим обработчикам событий, могут стать громоздкими. В таких случаях вы можете консолидировать всю логику обновления состояния за пределами вашего компонента в одной функции, называемой «редьюсер» (reducer). Ваши обработчики событий станут лаконичными, поскольку они будут только указывать на «действия» пользователя. В нижней части файла функция редьюсера определяет, как состояние должно обновляться в ответ на каждое действие!

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
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

```js src/TaskList.js hidden
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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Прочтите **[Извлечение логики состояния в редьюсер](/learn/extracting-state-logic-into-a-reducer)**, чтобы узнать, как консолидировать логику в функции редьюсера.

</LearnMore>

## Передача данных вглубь с помощью контекста {/*passing-data-deeply-with-context*/}

Обычно вы передаёте информацию из родительского компонента в дочерний через пропсы. Но передача пропсов может стать неудобной, если вам нужно передать какой-то пропс через множество компонентов или если многим компонентам нужна одна и та же информация. Контекст позволяет родительскому компоненту сделать некоторую информацию доступной для любого компонента в дереве ниже него — независимо от того, насколько глубоко он находится — без явной передачи через пропсы.

Здесь компонент `Heading` определяет свой уровень заголовка, «спрашивая» ближайший `Section` о его уровне. Каждый `Section` отслеживает свой собственный уровень, спрашивая родительский `Section` и добавляя к нему единицу. Каждый `Section` предоставляет информацию всем компонентам ниже него, не передавая пропсы — он делает это через контекст.

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

<LearnMore path="/learn/passing-data-deeply-with-context">

Прочтите **[Передача данных вглубь с помощью контекста](/learn/passing-data-deeply-with-context)**, чтобы узнать об использовании контекста как альтернативы передаче пропсов.

</LearnMore>

## Масштабирование с помощью редьюсера и контекста {/*scaling-up-with-reducer-and-context*/}

Редьюсеры позволяют консолидировать логику обновления состояния компонента. Контекст позволяет передавать информацию глубоко другим компонентам. Вы можете объединить редьюсеры и контекст вместе для управления состоянием сложного экрана.

С помощью этого подхода родительский компонент со сложным состоянием управляет им с помощью редьюсера. Другие компоненты, находящиеся глубоко в дереве, могут читать его состояние через контекст. Они также могут отправлять действия для обновления этого состояния.

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
      <TasksDispatchContext.Provider
        value={dispatch}
      >
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

export default function AddTask({ onAddTask }) {
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

Прочтите **[Масштабирование с помощью редьюсера и контекста](/learn/scaling-up-with-reducer-and-context)**, чтобы узнать, как управление состоянием масштабируется в растущем приложении.

</LearnMore>

## Что дальше? {/*whats-next*/}

Перейдите к [Реакция на ввод с помощью состояния](/learn/reacting-to-input-with-state), чтобы начать читать эту главу страница за страницей!

Или, если вы уже знакомы с этими темами, почему бы не прочитать о [Лазейках](/learn/escape-hatches)?
