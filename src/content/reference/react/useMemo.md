---
title: useMemo
---

<Intro>

`useMemo` – хук в React, позволяющий кешировать результаты вычислений между ререндерами.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useMemo` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Справочник {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Чтобы закешировать результат вычислений между ререндерами, достаточно вызвать `useMemo` на верхнем уровне внутри компонента:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `calculateValue`: Функция, возвращающая значение, которое нужно закешировать. Она должна быть чистой и не должна принимать никаких аргументов. React обязательно вызовет её при первом рендере, а при последующих будет возвращать готовое значение. В том случае если какое-то значение из массива зависимостей `dependencies` изменилось, React заново вызовет `calculateValue`, получит новое значение и сохранит его для будущего переиспользования.

* `dependencies`: Массив всех реактивных значений, которые используются внутри функции `calculateValue`. Реактивные значения включают в себя пропсы, состояние и все переменные и функции, объявленные внутри компонента. Если вы настроили свой [линтер для работы с React](/learn/editor-setup#linting), он проверит, все ли реактивные компоненты были указаны как зависимости. Массив зависимостей должен иметь конечное число элементов и быть описан как `[dep1, dep2, dep3]`. React будет сравнивать каждую такую зависимость с её предыдущим значением при помощи [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Возвращаемое значение {/*returns*/}

При первом рендере `useMemo` возвращает результат вызова функции `calculateValue`.

При всех последующих рендерах `useMemo` либо будет возвращать значение, сохранённое при предыдущем рендере (если ничто в массиве зависимостей не изменилось), либо заново вызовет функцию `calculateValue` и вернёт возвращаемое ею значение.

#### Предостережения {/*caveats*/}

* Поскольку `useMemo` это хук, то вызывать его можно только **на верхнем уровне внутри вашего компонента** или кастомного хука. Хуки нельзя вызывать внутри циклов или условий. Однако, если вам необходимо такое поведение, то можно извлечь новый компонент и переместить вызов хука в него.
* В строгом режиме React дважды вызовет передаваемую в `useMemo` функцию, чтобы проверить, [является ли она чистой](#my-calculation-runs-twice-on-every-re-render). Такое поведение существует только в режиме разработки и никак не проявляется в продакшене. Если эта функция чистая (какой она и должна быть), это никак не скажется на работе приложения. Результат одного из запусков будет просто проигнорирован.
* React **не отбрасывает закешированное значение, если на то нет веских причин**. Например, в режиме разработки React отбросит кеш, если файл компонента был изменён. В обоих режимах, разработки и продакшене, React отбросит кеш, если компонент [«задержится»](/reference/react/Suspense) во время первоначального монтирования. Помимо того, в дальнейшем в React могут быть добавлены новые возможности, которые смогут отбрасывать кеш. Например, если в будущем в React появится встроенная поддержка виртуализированных списков, будет иметь смысл отбрасывать кеш для тех элементов, которые выходят за область видимости. Полагаться на `useMemo` стоит только как на средство для оптимизации производительности. В противном случае, использование [состояния](/reference/react/useState#avoiding-recreating-the-initial-state) или [рефа](/reference/react/useRef#avoiding-recreating-the-ref-contents) может быть более подходящим вариантом.

<Note>

Подобное кеширование возвращаемых значений называют [*мемоизацией*](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BC%D0%BE%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F), поэтому данный хук был назван `useMemo`.

</Note>

---

## Использование {/*usage*/}

### Пропуск ресурсоёмких вычислений {/*skipping-expensive-recalculations*/}

Чтобы закешировать вычисления между ререндерами, достаточно обернуть их в `useMemo` на верхнем уровне внутри компонента:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo` ожидает два аргумента:

1. <CodeStep step={1}>Вычислительную функцию</CodeStep>, не принимающую никаких аргументов и возвращающую некоторое значение.
2. <CodeStep step={2}>Массив зависимостей</CodeStep>, включающий в себя все значения, находящиеся внутри компонента и использующиеся при вычислении.

При первом рендере <CodeStep step={3}>значение</CodeStep>, получаемое из `useMemo`, будет результатом вызова <CodeStep step={1}>вычислительной функции</CodeStep>.

При всех последующих рендерах React будет сравнивать текущие <CodeStep step={2}>зависимости</CodeStep> с зависимостями из предыдущего рендера, используя [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Если никакие из зависимостей не изменились, `useMemo` вернёт вычисленное прежде значение. В противном случае, React заново запустит вычислительную функцию и вернёт новое значение.

Иными словами, `useMemo` кеширует значение между ререндерами до тех пор, пока никакое значение из массива зависимостей не изменится.

**Посмотрим на примере, когда это может быть полезно.**

По умолчанию при ререндере React заново перезапускает всё тело компонента. Например, если `TodoList` обновит своё состояние или получит новый пропс, функция `filterTodos` перезапустится:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Обычно это не такая большая проблема, поскольку большинство вычислений довольно быстрые. Однако если приходится фильтровать или преобразовывать большой массив данных, или совершать какие-то иные ресурсоёмкие вычисления, то имеет смысл их пропускать (если входные данные никак не изменились). Оборачивание вычислительной функции в `useMemo` позволит переиспользовать вычисленные ранее `visibleTodos` (если ни `todos`, ни `tab` никак не изменились с предыдущего рендера).

Такой тип кеширования называют *[мемоизацией](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BC%D0%BE%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F)*.

<Note>

**На хук `useMemo` стоит полагаться лишь как на средство для оптимизации производительности.** Если ваш код не работает без него, сперва стоит найти и исправить ошибку, и только затем думать об использовании `useMemo`.

</Note>

<DeepDive>

#### Как понять, ресурсоёмкие ли вычисления? {/*how-to-tell-if-a-calculation-is-expensive*/}

Если вы не создаёте или не проходите в цикле тысячи объектов, то вычисления, скорее всего, не ресурсоёмкие. Для измерения времени, затраченного на выполнение некоторого куска кода, можно воспользоваться следующими методами консоли:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

После выполнения функции `filterTodos` в консоли появятся логи типа `filter array: 0.15ms`. Если вычисление занимает довольно существенное количество времени (скажем, `1ms` или больше), то имеет смысл его мемоизировать. Для этого можно обернуть его в `useMemo` и проверить, уменьшилось ли общее время выполнения или нет:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Вычисление будет пропущено, если todos и tab не изменились
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` не делает *первый* рендер быстрее. Он лишь позволяет пропускать ненужные вычисления при последующих ререндерах.

Стоит помнить, что ваша машина, скорее всего, мощнее, чем у ваших пользователей. Поэтому хорошей практикой будет измерять производительность, искусственно замедлив ваш компьютер. Например, в Chrome для этих целей существует [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling).

Необходимо также учитывать, что измерение производительности в режиме разработки даёт не самые точные результаты. Например, при включённом [строгом режиме](/reference/react/StrictMode), React будет рендерить каждый компонент дважды. Чтобы получить наиболее точные результаты, тестирование нужно проводить в продакшен-режиме и на устройстве, подобном тому, которое используют ваши пользователи.

</DeepDive>

<DeepDive>

#### Везде ли стоит использовать useMemo? {/*should-you-add-usememo-everywhere*/}

<<<<<<< HEAD
В приложениях, подобных этому сайту, где большинство взаимодействий «грубые» (например, изменение страницы или целого раздела), мемоизация может быть излишня. С другой стороны, если ваше приложение больше похоже на графический редактор, где происходит много мелких взаимодействий (например, передвижение фигур), мемоизация может иметь смысл.
=======
If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

Прибегать к оптимизации при помощи `useMemo` стоит лишь в некоторых случаях:

- Если вычисление, помещаемое в `useMemo`, является ощутимо медленным и его зависимости редко изменяются.
- Если результат вычисления передаётся как проп дочернему компоненту, обёрнутому в [`memo`](/reference/react/memo). Мемоизация позволит пропускать его ререндеры, пока зависимости остаются прежними.
- Если вычисляемое значение в дальнейшем используется как зависимость другого хука. Например, если другой `useMemo` в своих вычислениях зависит от него. Или если это значение используется в [`useEffect`](/reference/react/useEffect).

В иных случаях особого смысла оборачивать вычисления в `useMemo` нет. Хотя в этом и нет ничего плохого: некоторые команды предпочитают не думать о каждом конкретном случае, а стараются мемоизировать как можно больше. Недостатком такого подхода может быть менее читаемый код. Кроме того, не любая мемоизация эффективна: одного значения, которое каждый раз новое, достаточно, чтобы сломать мемоизацию всего компонента.

**Излишней мемоизации можно избежать, следуя таким принципам:**

1. Когда один компонент визуально оборачивает другие компоненты, ему можно передать весь этот [JSX в виде дочерних компонентов](/learn/passing-props-to-a-component#passing-jsx-as-children). В таком случае, когда родительский компонент обновляет своё состояние, React будет знать, что дочерние компоненты не нуждаются в ререндере.
1. Предпочитайте локальное состояние и не [поднимайте его выше](/learn/sharing-state-between-components), чем это действительно необходимо. Не храните переходные состояния типа форм или проверок на hover в библиотеке для управления глобальным состоянием или на самом верху вашего дерева компонентов.
1. Держите ваши компоненты [чистыми](/learn/keeping-components-pure). Если ререндер компонента приводит к проблемам или производит какие-то визуальные артефакты – это баг! Исправьте его, а не прибегайте к мемоизации.
1. Избейгате лишних [Эффектов, которые обновляют состояние](/learn/you-might-not-need-an-effect). В React-приложениях большинство проблем с производительностью вызваны цепочками обновлений, которые создаются в Эффектах и вынуждают компоненты ререндериться снова и снова.
1. Постарайтесь [убрать лишние зависимости в Эффектах](/learn/removing-effect-dependencies). Иногда проще перенести функцию или объект внутрь функции Эффекта, или вынести их за пределы компонента, чем прибегать к мемоизации.

Если какие-то взаимодействия всё ещё ощущаются медленными, можно [воспользоваться профилировщиком из React DevTools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html), чтобы посмотреть, каким компонентам больше всего нужна мемоизация, и затем добавить её там, где это необходимо. Эти принципы сделают ваши компоненты более простыми для отладки и понимания – поэтому ими не стоит пренебрегать. 

</DeepDive>

<Recipes titleText="Разница с использованием useMemo и без него" titleId="examples-recalculation">

#### Пропуск повторных вычислений при помощи `useMemo` {/*skipping-recalculation-with-usememo*/}

В данном примере функция `filterTodos` **искусственно замедлена**, чтобы показать, что случается в том случае, если вызываемая во время рендера функция действительно медленная. Попробуйте попереключаться между вкладками и попереключать тему.

Переключение вкладок ощущается таким медленным потому, что оно вынуждает перезапускаться замедленную функцию `filterTodos` каждый раз, когда изменяется значение `tab`. (Если интересно, почему она запускается дважды, объяснение можно найти [здесь](#my-calculation-runs-twice-on-every-re-render).)

Переключите тему. **Благодаря `useMemo` это происходит быстро (несмотря на искусственное замедление).** Медленный вызов `filterTodos` был пропущен, потому что и `todos`, и `tab` (которые вы передаете как зависимости для `useMemo`) не изменились с момента последнего рендера.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Все
      </button>
      <button onClick={() => setTab('active')}>
        Активные
      </button>
      <button onClick={() => setTab('completed')}>
        Выполненные
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмная тема
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Примечание: <code>filterTodos</code> искусственно замедлена!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ЗАМЕДЛЕННО] Фильтрация ' + todos.length + ' todos для вкладки "' + tab + '"');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ничего не делать 500 миллисекунд, чтобы сымитировать медленный код
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Повторное вычисление значения {/*always-recalculating-a-value*/}

В данном примере функция `filterTodos` также замедлена, чтобы показать, что случается в том случае, если вызываемая во время рендера функция действительно медленная. Попробуйте попереключаться между вкладками и попереключать тему.

Поскольку **в этом примере отсутствует вызов `useMemo`**, то искусственно замедленная функция `filterTodos` вызывается при каждом ререндере (даже в том случае, если изменилось только значение `theme`).

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Все
      </button>
      <button onClick={() => setTab('active')}>
        Активные
      </button>
      <button onClick={() => setTab('completed')}>
        Выполненные
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмная тема
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Примечание: <code>filterTodos</code> искусственно замедлена!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ЗАМЕДЛЕННО] Фильтрация ' + todos.length + ' todos для вкладки "' + tab + '"');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ничего не делать 500 миллисекунд, чтобы сымитировать медленный код
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ниже приведён код **без искусственного замедления**. Заметно ли отсутствие `useMemo`?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Все
      </button>
      <button onClick={() => setTab('active')}>
        Активные
      </button>
      <button onClick={() => setTab('completed')}>
        Выполненные
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмная тема
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Фильтрация ' + todos.length + ' todos для вкладки "' + tab + '"');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Часто код и без мемоизации работает хорошо. Нет необходимости использовать мемоизацию, если вычисления не ресурсоёмкие.

Можете попробовать увеличить количество todo в `utils.js` и посмотреть, как это скажется на скорости работы приложения. Изначально эти вычисления не очень ресурсоёмкое, однако если существенно увеличить количество todo, то дополнительная нагрузка будет вызвана скорее ререндером, чем фильтрацией. Ниже рассмотрим способы оптимизации ререндеров при помощи `useMemo`.

<Solution />

</Recipes>

---

### Пропуск ререндеров дочерних компонентов {/*skipping-re-rendering-of-components*/}

В некоторых случаях `useMemo` можно использовать для оптимизации ререндеров дочерних компонентов. Допустим, что `TodoList` передаёт как проп `visibleTodos` дочернему компоненту `List`:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

В этом случае при изменении `theme` приложение будет на какое-то время подтормаживать. Однако если из разметки удалить `<List />`, то всё будет работать быстро.

**По умолчанию при ререндере некоторого компонента React рекурсивно ререндерит и всех его потомков.** По этой причине, когда `TodoList` ререндерится с другим значением `theme`, дочерний компонент `List` ререндерится *вместе* с ним. Это не страшно для компонентов, которые не производят никаких ресурсоёмких вычислений. Однако если ререндер заметно медленный (как с компонентом `List`), то имеет смысл обернуть его в [`memo`](/reference/react/memo). Это позволит избежать ререндеров, если пропсы с предыдущего рендера никак не изменились:

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Теперь компонент `List` не будет ререндериться, если его пропсы с предыдущего рендера никак не изменились**. Однако представим, что `visibleTodos` вычисляется без `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // При каждом изменении theme функция filterTodos создаёт новый массив...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... поэтому компонент List всегда будет получать новые пропсы и ререндериться каждый раз */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**В примере ниже функция `filterTodos` всегда создаёт новый массив**, подобно тому как объектный литерал `{}` всегда создаёт новый объект. Это значит, что компонент `List` всегда будет получать новые пропсы, и оптимизация при помощи [`memo`](/reference/react/memo) не работает. Здесь на помощь приходит `useMemo`:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Просим React закешировать вычисления между ререндерами...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...и пока эти зависимости не изменяются...
  );
  return (
    <div className={theme}>
      {/* ...List будет получать одинаковые пропсы и пропускать ререндеры */}
      <List items={visibleTodos} />
    </div>
  );
}
```

В примере выше `visibleTodos` всегда будет иметь *одно и то же* значение, пока массив зависимостей остаётся неизменным. Следует помнить, что нет необходимости использовать `useMemo` без веской на то причины. Однако здесь это оправданно, поскольку `visibleTodos` передаётся как пропс в компонент, обёрнутый в [`memo`](/reference/react/memo), что позволяет пропускать лишние ререндеры. Существует ещё несколько причин, когда использование `useMemo` оправданно, – о них речь пойдёт ниже.

<DeepDive>

#### Мемоизация отдельных JSX-узлов {/*memoizing-individual-jsx-nodes*/}

Вместо того чтобы оборачивать `List` в [`memo`](/reference/react/memo), можно обернуть сам JSX-узел `<List />` в `useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

Поведение будет таким же. Компонент `List` не будет ререндериться, пока значение `visibleTodos` остаётся неизменным.

JSX-узел `<List items={visibleTodos} />` является простым объектом типа `{ type: List, props: { items: visibleTodos } }`. Создать такой объект очень дёшево, однако React не знает, осталось ли его содержимое прежним или нет. Поэтому по умолчанию React всегда будет ререндерить компонент `List`.

При этом, если React видит тот же JSX, который был при предыдущем рендере, он не будет ререндерить компонент. Это происходит потому что JSX-узлы [иммутабельны](https://ru.wikipedia.org/wiki/%D0%9D%D0%B5%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D1%8F%D0%B5%D0%BC%D1%8B%D0%B9_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82). Такие объекты узлов не могут быть изменены с течением времени, поэтому React знает, что пропустить ререндер безопасно. Однако чтобы это работало, узел должен быть *буквально тем же объектом*, а не только *выглядеть* таким же в коде. Это именно то, что делает `useMemo` в данном примере.

Оборачивать JSX-узлы в `useMemo` не всегда удобно. Например, это нельзя делать по условию. По этой причине компоненты чаще оборачивают в [`memo`](/reference/react/memo).

</DeepDive>

<Recipes titleText="Разница между пропуском ререндеров и без него" titleId="examples-rerendering">

#### Пропуск ререндеров при помощи `useMemo` и `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

В данном примере компонент `List` **искусственно замедлен**, чтобы показать, что случается в том случае, если React-компонент действительно медленный. Попробуйте переключить вкладки и переключить тему.

Переключение между вкладками ощущается таким медленным, потому что оно вынуждает замедленный компонент `List` ререндериться. Такое поведение ожидаемо, поскольку проп `tab` изменился, и новые данные необходимо отобразить на экране.

Затем попробуйте переключить тему. **Благодаря `useMemo` в связке с [`memo`](/reference/react/memo) это происходит быстро, несмотря на искусственное замедление.** Поскольку ни `todos`, ни `tab`, указанные как зависимости в `useMemo`, не изменились с предыдущего рендера, то массив `visibleTodos` остался прежним, и компонент `List` пропустил ререндер.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Все
      </button>
      <button onClick={() => setTab('active')}>
        Активные
      </button>
      <button onClick={() => setTab('completed')}>
        Выполненные
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмная тема
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Примечание: компонент <code>List</code> искусственно замедлен!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ЗАМЕДЛЕННО] Рендер компонента <List /> с ' + items.length + ' элементами');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ничего не делать 500 миллисекунд, чтобы сымитировать медленный код
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Повторный ререндер компонента {/*always-re-rendering-a-component*/}

В данном примере компонент `List` также искусственно замедлен, чтобы показать, что случается в том случае, если React-компонент действительно медленный. Попробуйте попереключаться между вкладками и попереключать тему.

В отличие от предыдущего примера, здесь отсутствует `useMemo`. По этой причине `visibleTodos` всегда будет новым массивом, и компонент `List` не сможет пропустить ререндер.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Все
      </button>
      <button onClick={() => setTab('active')}>
        Активные
      </button>
      <button onClick={() => setTab('completed')}>
        Выполненные
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмная тема
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Примечание: компонент <code>List</code> искусственно замедлен!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ЗАМЕДЛЕННО] Рендер компонента <List /> с ' + items.length + ' элементами');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ничего не делать 500 миллисекунд, чтобы сымитировать медленный код
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ниже приведён код **без искусственного замедления**. Заметно ли отсутствие `memo` и `useMemo`?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Все
      </button>
      <button onClick={() => setTab('active')}>
        Активные
      </button>
      <button onClick={() => setTab('completed')}>
        Выполненные
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмная тема
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Часто код и без мемоизации работает хорошо. Нет необходимости использовать мемоизацию, если вычисления не ресурсоёмкие.

Чтобы получить наиболее реалистичные данные относительно того, что может замедлять ваше приложение, React стоит запускать в продакшен-режиме, с отключёнными [React DevTools](/learn/react-developer-tools) и на устройстве, подобном тому, которое используют ваши пользователи.

<Solution />

</Recipes>

---

### Слишком частые вызовы эффекта {/*preventing-an-effect-from-firing-too-often*/}

Время от времени вам могут понадобиться значения внутри [эффекта:](/learn/synchronizing-with-effects)

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Это создаёт проблему. [Каждое реактивное значение должно быть объявлено как зависимость вашего эффекта.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Но если вы добавите `options` как зависимость, ваш эффект начнёт постоянно переподключаться к чату:


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Проблема: эта зависимость меняется при каждом рендере
  // ...
```

Решение – обернуть необходимый в эффекте объект в `useMemo`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Меняется только тогда, когда меняется roomId

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Вызывается только тогда, когда меняется options
  // ...
```

Это гарантирует, что объект `options` один и тот же между повторными рендерами, если `useMemo` возвращает закешированный объект.

Однако `useMemo` является оптимизацией производительности, а не семантической гарантией. React может отбросить закешированное значение, если [возникнет условие для этого](#caveats). Это также спровоцирует перезапуск эффекта, **так что ещё лучше будет избавиться от зависимости,** переместив ваш объект *внутрь* эффекта:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ Нет необходимости для useMemo или зависимостей объекта!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Меняется только тогда, когда меняется roomId
  // ...
```

Теперь ваш код стал проще и не требует `useMemo`. [Узнайте больше об удалении зависимостей эффекта.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)


### Мемоизация зависимостей других хуков {/*memoizing-a-dependency-of-another-hook*/}

Предположим, что у нас есть вычисления, зависящие от объекта, создаваемого внутри компонента:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Обратите внимание: зависимость от объекта, создаваемого внутри компонента
  // ...
```

Подобная зависимость сводит на нет все преимущества мемоизации. При ререндере компонента весь его внутренний код перезапускается, **включая создание объекта `searchOptions`**. И поскольку этот объект является зависимостью `useMemo`, React каждый раз будет заново вычислять значение `visibleItems`.

Чтобы исправить такое поведение, можно мемоизировать сам объект `searchOptions` перед тем как передавать его в виде зависимости:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Вызывается только при изменении text

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Вызывается только при изменении allItems или searchOptions
  // ...
```

В примере выше `searchOptions` будет изменяться только при изменении `text`. При этом можно сделать ещё лучше – переместить объект `searchOptions` *внутрь* вычислительной функции `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Вызывается только при изменении allItems или text
  // ...
```

Теперь вычисления зависят напрямую от значения `text`, которое является строчным и не может измениться «незаметно».

---

### Мемоизация функций {/*memoizing-a-function*/}

Предположим, что компонент `Form` обёрнут в [`memo`](/reference/react/memo) и получает как проп функцию:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Подобно тому как объектный литерал `{}` создаёт новый объект, определение функции через `function() {}` или `() => {}` создаёт новую функцию при каждом ререндере. Само по себе создание функций не является проблемой (и этого, конечно, не стоит избегать). Однако поскольку компонент `Form` мемоизирован, стоит подумать о пропуске лишних ререндеров, если его пропсы остаются неизменными.

Чтобы мемоизировать функцию, можно вернуть её из вычислительной функции `useMemo`:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

**Поскольку мемоизация функций – довольно распространённая задача, в React есть встроенный хук специально для этих целей**. Вместо `useMemo` можно обернуть функцию в [`useCallback`](/reference/react/useCallback) и избежать написания дополнительной вложенной функции:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Два примера выше абсолютно идентичны. Единственное преимущество использования хука `useCallback` в том, что он позволяет избежать написания дополнительной вложенной функции. Ознакомиться подробнее с хуком `useCallback` можно [здесь](/reference/react/useCallback).

---

## Диагностика неполадок {/*troubleshooting*/}

### Вычисления запускаются дважды при каждом ререндере {/*my-calculation-runs-twice-on-every-re-render*/}

В [строгом режиме](/reference/react/StrictMode) React запускает некоторые функции дважды:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Функция компонента будет запускаться дважды при каждом рендере

  const visibleTodos = useMemo(() => {
    // Эти вычисления также запустятся дважды, если любая из зависимостей изменится
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Такое поведение ожидаемо, и не должно сломать ваш код.

Оно существует только в режиме разработки и помогает разработчику [хранить компоненты чистыми](/learn/keeping-components-pure). React будет использовать данные лишь одного из вызовов и проигнорирует все остальные. Это не должно негативно сказаться на работе приложения, если компонент и вычислительная функция чистые. Однако если в коде существуют функции с [побочными эффектами](https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%B1%D0%BE%D1%87%D0%BD%D1%8B%D0%B9_%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82_(%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)), это поможет их обнаружить.

Например, в коде ниже вычислительная функция мутирует массив, полученный из пропсов:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Ошибка: мутация пропса
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

Благодаря тому что React вызовет эту функцию дважды, разработчик заметит, что один и тот же todo был добавлен два раза. Изменять новые объекты, созданные внутри вычислений – нормально, но никакие существующие объекты изменяться *не должны*. Так, например, если функция `filterTodos` всегда возвращает *новый* массив, то мутировать его перед возвращением можно:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Мутация объекта, созданного в процессе вычислений
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Больше о сохранении компонентов чистым можно прочитать [здесь](/learn/keeping-components-pure).

Помимо того, можно ознакомиться с руководствами по обновлению [объектов](/learn/updating-objects-in-state) и [массивов](/learn/updating-arrays-in-state) без мутаций.

---

### `useMemo` должен возвращать объект, а возвращает undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}
Этот код не работает:

```js {1-2,5}
  // 🔴 Такой записью вернуть объект из стрелочной функции нельзя:
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

В языке JavaScript запись `() => {` открывает тело стрелочной функции и скобка `{` не является частью объекта. По этой причине функция не возвращает объект, что и приводит к ошибке. Это можно исправить, добавив круглые скобки: `({` и `})`:

```js {1-2,5}
  // Этот код работает, однако его легко заново сломать
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

Подобная запись может сбивать с толку, и этот код можно заново сломать, случайно удалив скобки.

Чтобы этого избежать, можно явно написать `return`:

```js {1-3,6-7}
  // ✅ Этот код работает и при этом он описан явно
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Вычисления в `useMemo` запускаются при каждом рендере {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Убедитесь, что в `useMemo` был передан массив зависимостей.

Если не указан массив зависимостей, то `useMemo` будет перезапускаться каждый раз:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Нет массива зависимостей – перезапускается каждый раз
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Исправленная версия с массивом зависимостей выглядит так:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Не перезапускается без надобности
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Если это не помогло, то проблема может быть в том, что какая-то зависимось получает новое значение при каждом рендере. Эту проблему можно отладить, выведя массив зависимостей в консоль:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Затем в консоли можно нажать по массивам правой кнопкой мыши и для обоих выбрать опцию «Сохранить как глобальную переменную». Первый сохраним как `temp1`, а второй – как `temp2`. Здесь же можно проверить, все ли зависимости в массивах одинаковые:

```js
Object.is(temp1[0], temp2[0]); // Одинаковы ли первые значения?
Object.is(temp1[1], temp2[1]); // Одинаковы ли вторые значения?
Object.is(temp1[2], temp2[2]); // ... и так для всех зависимостей ...
```

После того как необходимая зависимость была найдена, можно попробовать убрать её или попытаться [мемоизировать](#memoizing-a-dependency-of-another-hook).

---

### Нужно вызвать `useMemo` для каждого элемента в цикле, но это запрещено {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Предположим, что компонент `Chart` обёрнут в [`memo`](/reference/react/memo). Необходимо пропустить ререндеры для каждого из них, если родительский компонент `ReportList` ререндерится. Однако вызывать `useMemo` в циклах запрещено:

```js {expectedErrors: {'react-compiler': [6]}} {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Нельзя вызвать `useMemo` внутри цикла
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Вместо этого можно извлечь новый компонент и мемоизировать данные внутри него:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Вызов useMemo на верхнем уровне компонента
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

В качестве альтернативного варианта можно убрать `useMemo`, и вместо него обернуть сам `Report` в [`memo`](/reference/react/memo). В этом случае если проп `item` не изменится, то `Report` пропустит ререндер вместе со своим дочерним компонентом `Chart`:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
