---
title: Сохранение и сброс состояния
---

<Intro>

Состояние изолировано между компонентами. React отслеживает, какое состояние принадлежит какому компоненту, основываясь на их месте в дереве пользовательского интерфейса. Вы можете контролировать, когда сохранять состояние и когда сбрасывать его между повторными рендерингами.

</Intro>

<YouWillLearn>

* Как React «видит» структуру компонентов
* Когда React выбирает сохранение или сброс состояния
* Как заставить React сбросить состояние компонента
* Как ключи и типы влияют на сохранение состояния

</YouWillLearn>

## Дерево UI {/*the-ui-tree*/}

Браузеры используют множество древовидных структур для моделирования пользовательского UI. The [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) представляет элементы HTML, [CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model) делает тоже самое для CSS. Есть даже [Дерево специальных возможностей](https://developer.mozilla.org/docs/Glossary/Accessibility_tree)!

React также использует древовидные структуры для управления и моделирования пользовательского интерфейса, который вы создаете. React создает **UI деревья** из вашего JSX. Затем React DOM обновляет элементы DOM браузера, чтобы они соответствовали этому дереву пользовательского интерфейса. (React Native переводит эти деревья в элементы, специфичные для мобильных платформ.)

<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

Из компонентов React создает UI дерево, которое React DOM использует для рендеринга DOM.

</Diagram>

</DiagramGroup>

## Состояние привязано к положению в дереве {/*state-is-tied-to-a-position-in-the-tree*/}

Когда вы задаете состояние компонента, вы можете подумать, что это состояние «живет» внутри компонента. Но на самом деле состояние хранится внутри React. React связывает каждую часть состояния, которую он хранит, с правильным компонентом в зависимости от того, где этот компонент находится в дереве UI.


Здесь есть только один `<Counter />` тег JSX, но он отображается в двух разных позициях:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Вот как они выглядят в виде дерева:    

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

Дерево React

</Diagram>

</DiagramGroup>

**Это два отдельных счетчика, поскольку каждый из них отображается в своей позиции в дереве.** Обычно вам не нужно думать об этих позициях, чтобы использовать React, но может быть полезно понять, как это работает.

В React каждый компонент на экране находится в полностью изолированном состоянии. Например, если вы визуализируете два `Counter` компонента рядом, каждый из них получит свое собственное, независимое состояние `score` и `hover` состояние.

Попробуйте щелкнуть оба счетчика и обратите внимание, что они не влияют друг на друга:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Как видите, при обновлении одного счетчика обновляется только состояние этого компонента:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

Обновление состояния

</Diagram>

</DiagramGroup>


React будет сохранять состояние до тех пор, пока вы визуализируете один и тот же компонент в одной и той же позиции. Чтобы увидеть это, увеличьте оба счетчика, затем удалите второй компонент, сняв флажок «Визуализировать второй счетчик», а затем добавьте его обратно, отметив его снова:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Обратите внимание, как в тот момент, когда вы прекращаете рендеринг второго счетчика, его состояние полностью исчезает. Это потому, что когда React удаляет компонент, он уничтожает его состояние.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

Удаление компонента

</Diagram>

</DiagramGroup>

Когда вы ставите галочку "рендерить второй счетчик", второй `Counter` и ее состояние инициализируются с нуля (`score = 0`) и добавляются в DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

Добавление компонента

</Diagram>

</DiagramGroup>

**React сохраняет состояние компонента до тех пор, пока он отображается в своей позиции в дереве пользовательского интерфейса.** Если он удаляется или другой компонент отображается в той же позиции, React отбрасывает его состояние.

## от же компонент в той же позиции сохраняет состояние {/*same-component-at-the-same-position-preserves-state*/}

В этом примере есть два разных `<Counter />` тега:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

При установке или снятии флажка состояние счетчика не сбрасывается. Независимо от того, `isFancy` является `true` или `false`, у вас всегда есть `<Counter />` как первый дочерний элемент, возвращенный `div` returned из корневого `App` компонента:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

Обновление `App` состояния не сбрасывает, `Counter` потому что `Counter` остается в том же положении

</Diagram>

</DiagramGroup>


Это тот же компонент в той же позиции, поэтому с точки зрения React это тот же counter.

<Pitfall>

Помните, что **для React важна позиция в UI дереве, а не в разметке JSX!** Этот компонент имеет два `return` предложения с разными `<Counter />` тегами JSX внутри и снаружи `if`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Вы можете ожидать, что состояние сбросится, когда вы поставите галочку, но это не так! Это связано с тем, что  **оба этих `<Counter />` тега отображаются в одной и той же позиции.** React не знает, где вы размещаете условия в своей функции. Все, что он «видит», — это дерево, которое вы возвращаете.

В обоих случаях `App` компонент возвращает `<div>` с `<Counter />` в качестве первого дочернего элемента. Для React эти два счетчика имеют один и тот же «адрес»: первый дочерний элемент первого дочернего элемента корня. Вот как React сопоставляет их между предыдущим и следующим рендерингом, независимо от того, как вы структурируете свою логику.

</Pitfall>

## Состояние сброса разных компонентов в одном и том же положении {/*different-components-at-the-same-position-reset-state*/}

В этом примере установка флага заменит  `<Counter>` на `<p>`:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Здесь вы переключаетесь между _различными_ типами компонентов в одной и той же позиции. Первоначально первый дочерний элемент `<div>` содержал `Counter`. Но когда вы заменили `p`, React удалил `Counter` из дерева UI и уничтожил его состояние.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

При изменении  `Counter` на `p`,  `Counter` удаляется и `p` добавляется

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

При обратном переключении `p` удаляется и `Counter` добавлется

</Diagram>

</DiagramGroup>

Кроме того, **когда вы визуализируете другой компонент в той же позиции, он сбрасывает состояние всего его поддерева.** Чтобы увидеть, как это работает, увеличьте счетчик и установите флажок:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Состояние счетчика сбрасывается при установке флажка. Хотя вы рендерите `Counter`, первый дочерний элемент  `div` изменяется с `div` на `section`. Когда дочерний элемент `div` был удален из DOM, все дерево под ним (включая `Counter` и его состояние) также было уничтожено.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

При изменении `section` на `div`, `section` удаляется идобавляется `div`

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

При обратном переключении удаляется  `div` и добавляется `section`

</Diagram>

</DiagramGroup>

Как правило, **если вы хотите сохранить состояние между повторными рендерингами, структура вашего дерева должна «сопоставляться** от одного рендеринга к другому. Если структура отличается, состояние уничтожается, потому что React уничтожает состояние, когда удаляет компонент из дерева.

<Pitfall>

Вот почему вы не должны вкладывать определения функций компонентов.

Здесь функция компонента `MyTextField` определена *внутри* `MyComponent`:

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


Каждый раз, когда вы нажимаете кнопку, состояние ввода исчезает! Это связано с тем, что для каждого рендеринга `MyComponent` слздвется *другая* функция `MyTextField`. Вы визуализируете *другой* компонент в той же позиции, поэтому React сбрасывает все состояния ниже. Это приводит к ошибкам и проблемам с производительностью. Чтобы избежать этой проблемы, **всегда объявляйте функции компонентов на верхнем уровне и не вкладывайте их определения.**

</Pitfall>

## Сброс состояния в той же позиции {/*resetting-state-at-the-same-position*/}

По умолчанию React сохраняет состояние компонента, пока он остается в том же положении. Обычно это именно то, что вам нужно, поэтому это имеет смысл в качестве поведения по умолчанию. Но иногда вам может понадобиться сбросить состояние компонента. Рассмотрим это приложение, которое позволяет двум игрокам отслеживать свои очки во время каждого хода:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

В настоящее время при смене игрока счет сохраняется. Два `Counter` появляются в одной и той же позиции, поэтому React видит их как *одно и то же* `Counter`, чье свойство `person` изменилось.

Но концептуально в этом приложении они должны быть двумя отдельными счетчиками. Они могут появляться в одном и том же месте пользовательского интерфейса, но один из них является счетчиком Тейлора, а другой — счетчиком Сары.

Существует два способа сброса состояния при переключении между ними:

1. Рендер компонентов в разных позициях
2. Дать каждому компоненту явную идентичность с `key`


### Вариант 1. Рендер компонента в разных позициях {/*option-1-rendering-a-component-in-different-positions*/}

Если вы хотите, чтобы эти два `Counter` были независимыми, вы можете отображать их в двух разных позициях:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Изначально `isPlayerA` является `true`. Итак, первая позиция содержит состояние `Counter`, а вторая пуста.
* Когда вы нажимаете кнопку «Следующий игрок», первая позиция очищается, но вторая теперь содержит `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

Начальное состояние

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

Нажимаем «Далее»

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

Нажимаем «Далее» еще раз

</Diagram>

</DiagramGroup>

Каждое состояние `Counter` уничтожается каждый раз, когда оно удаляется из DOM. Вот почему они сбрасываются каждый раз, когда вы нажимаете кнопку.

Это решение удобно, когда у вас есть только несколько независимых компонентов, отображаемых в одном месте. В этом примере у вас есть только два, поэтому не составит труда визуализировать оба по отдельности в JSX.

### Вариант 2. Сброс состояния с помощью ключа {/*option-2-resetting-state-with-a-key*/}

Существует также другой, более общий способ сброса состояния компонента.

Возможно, вы видели `key` при [рендеринге списков.](/learn/rendering-lists#keeping-list-items-in-order-with-key) Ключи нужны не только для списков! Вы можете использовать ключи, чтобы React различал любые компоненты. По умолчанию React использует порядок внутри родителя («первый счетчик», «второй счетчик»), чтобы различать компоненты. Но ключи позволяют вам сказать React, что это не просто *первый* или *второй* счетчик, а конкретный счетчик, например, счетчик *Тейлора*. Таким образом, React будет знать счетчик *Тейлора*, где бы он ни появлялся в дереве!

В этом примере два `<Counter />` не имеют общего состояния, даже если они появляются в одном и том же месте в JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Переключение между Тейлором и Сарой не сохраняет состояние. Это потому, что **вы дали им разные `key`s:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Указание `key` указывает React использовать `key` как часть позиции, а не их порядок внутри родителя. Вот почему, даже если вы визуализируете их в одном и том же месте в JSX, React видит их как два разных счетчика, и поэтому они никогда не будут иметь общего состояния. Каждый раз, когда счетчик появляется на экране, создается его состояние. Каждый раз, когда он удаляется, его состояние уничтожается. Переключение между ними сбрасывает их состояние снова и снова.

<Note>

Помните, что ключи не являются глобально уникальными. Они указывают только позицию *внутри родителя*.

</Note>

### Сброс формы с помощью ключа {/*resetting-a-form-with-a-key*/}

Сброс состояния с помощью ключа особенно полезен при работе с формами.

В этом чат-приложении компонент `<Chat>` содержит состояние ввода текста:

<Sandpack>

```js App.js
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
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
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

```js Chat.js
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

Попробуйте ввести что-нибудь в поле ввода, а затем нажмите «Алиса» или «Боб», чтобы выбрать другого получателя. Вы заметите, что состояние ввода сохраняется, потому что `<Chat>` отображается в той же позиции в дереве.

**Во многих приложениях это может быть желаемым поведением, но не в приложении чата!** Вы не хотите, чтобы пользователь отправил сообщение, которое он уже набрал, не тому человеку из-за случайного клика. Чтобы исправить это, добавьте `key`:

```js
<Chat key={to.id} contact={to} />
```

Это гарантирует, что при выборе другого получателя компонент `Chat` компонент будет воссоздан с нуля, включая все состояния в дереве под ним. React также будет воссоздавать элементы DOM вместо их повторного использования.

Теперь переключение получателя всегда очищает текстовое поле:

<Sandpack>

```js App.js
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
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
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

```js Chat.js
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

<DeepDive>

#### Сохранение состояния для удаленных компонентов {/*preserving-state-for-removed-components*/}

В реальном приложении чата вы, вероятно, захотите восстановить состояние ввода, когда пользователь снова выбирает предыдущего получателя. Есть несколько способов сохранить состояние «живым» для компонента, который больше не виден:

- Вы можете отобразить _все_ чаты, а не только текущий, но скрыть все остальные с помощью CSS. Чаты не будут удалены из дерева, поэтому их локальное состояние будет сохранено. Это решение отлично работает для простых пользовательских интерфейсов. Но это может быть очень медленным, если скрытые деревья большие и содержат много узлов DOM.
- Вы можете [поднять состояние](/learn/sharing-state-between-components) и сохранить ожидающее сообщение для каждого получателя в родительском компоненте. Таким образом, когда удаляются дочерние компоненты, это не имеет значения, потому что родительский компонент сохраняет важную информацию. Это наиболее распространенное решение.
- Вы также можете использовать другой источник в дополнение к состоянию React. Например, вы, вероятно, хотите, чтобы черновик сообщения сохранялся, даже если пользователь случайно закроет страницу. Чтобы реализовать это, вы можете сделать так, чтобы `Chat` компонент инициализировал свое состояние, читая из файла [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), и сохранял там черновики.

Независимо от того, какую стратегию вы выберете, чат _с Алисой_ концептуально отличается от чата _с Бобом_, поэтому имеет смысл задать `key` `<Chat>` на основе текущего получателя.

</DeepDive>

<Recap>

- React сохраняет состояние до тех пор, пока один и тот же компонент отображается в одной и той же позиции.
- Состояние не сохраняется в тегах JSX. Он связан с позицией дерева, в которую вы помещаете этот JSX.
- Вы можете заставить поддерево сбросить свое состояние, назначив ему другой ключ.
- Не вкладывайте определения компонентов, иначе вы случайно сбросите состояние.

</Recap>



<Challenges>

#### Исправление исчезающего ввода текста {/*fix-disappearing-input-text*/}

В этом примере показано сообщение при нажатии кнопки. Однако нажатие кнопки также случайно сбрасывает ввод. Почему это происходит? Исправьте, чтобы нажатие на кнопку не сбрасывало вводимый текст.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Проблема в том, что `Form` рендерится в разных позициях. В `if` ветке это второй дочерний элемент `<div>`, но в `else` ветке это первый дочерний элемент. Поэтому тип компонента в каждой позиции меняется. Первая позиция меняется между удерживанием `p` и `Form`, а вторая позиция меняется между удерживанием `Form` и `button`. React сбрасывает состояние каждый раз, когда изменяется тип компонента.

Самое простое решение — объединить ветки так, чтобы `Form` всегда отображались в одной и той же позиции:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Технически вы также можете добавить `null` перед `<Form />` в ветке `else` чтобы соответствовать `if` структуре ветки:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

Таким образом, `Form` это всегда второй дочерний элемент, поэтому он остается в том же положении и сохраняет свое состояние. Но этот подход гораздо менее очевиден и повышает риск того, что кто-то другой удалит `null`.

</Solution>

#### Поменять местами два поля формы {/*swap-two-form-fields*/}

Эта форма позволяет ввести имя и фамилию. Он также имеет флажок, определяющий, какое поле будет первым. При установке флажка поле «Фамилия» появится перед полем «Имя».

Это почти работает, но есть ошибка. Если вы заполните поле ввода «Имя» и отметите флажок, текст останется в первом поле ввода (теперь это «Фамилия»). Исправьте это так, чтобы вводимый текст *также* перемещался, когда вы меняете порядок.

<Hint>

Кажется, что для этих полей их положения внутри родителя недостаточно. Есть ли способ сообщить React, как сопоставить состояние между повторными рендерингами?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Дайте `key` обоим компонентам `<Field>` в обоих ветвях `if` и `else`. Это говорит React, как «сопоставить» правильное состояние для любого из `<Field>`, даже если их порядок внутри родителя изменится:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Сбросить форму сведений {/*reset-a-detail-form*/}

Это редактируемый список контактов. Вы можете отредактировать данные выбранного контакта, а затем либо нажать «Сохранить», чтобы обновить его, либо «Сбросить», чтобы отменить изменения.

Когда вы выбираете другой контакт (например, Алису), состояние обновляется, но в форме продолжают отображаться сведения о предыдущем контакте. Исправьте, чтобы форма сбрасывалась при изменении выбранного контакта.

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Дайте `key={selectedId}` компоненту `EditContact`. Таким образом, переключение между разными контактами приведет к сбросу формы:

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Очистить изображение во время его загрузки {/*clear-an-image-while-its-loading*/}

Когда вы нажимаете «Далее», браузер начинает загрузку следующего изображения. Однако, поскольку оно отображается в том же теге `<img>` по умолчанию вы все равно будете видеть предыдущее изображение, пока не загрузится следующее. Это может быть нежелательно, если важно, чтобы текст всегда соответствовал изображению. Измените его так, чтобы в тот момент, когда вы нажимаете «Далее», предыдущее изображение сразу исчезало.

<Hint>

Есть ли способ сказать React воссоздать DOM вместо его повторного использования?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Вы можете предоставить `key` тегу `<img>`. Когда `key` изменится, React заново создаст узел `<img>` DOM с нуля. Это вызывает краткую вспышку при загрузке каждого изображения, так что это не то, что вы хотели бы делать для каждого изображения в вашем приложении. Но это имеет смысл, если вы хотите, чтобы изображение всегда соответствовало тексту.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Исправьте неуместное состояние в списке {/*fix-misplaced-state-in-the-list*/}

В этом списке у каждого `Contact` есть состояние, определяющее, была ли для него нажата кнопка «Показать электронную почту». Нажмите «Показать электронную почту» для Алисы, а затем установите флажок «Показать в обратном порядке». Вы заметите, что электронная почта _Тейлора_ теперь развернута, а электронная почта Алисы, которая переместилась в конец, выглядит свернутой.

Исправьте это так, чтобы развернутое состояние ассоциировалось с каждым контактом, независимо от выбранного порядка.

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Проблема в том, что в этом примере индекс использовался как `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Однако вы хотите, чтобы состояние было связано с _каждым конкретным контактом_.

Вместо этого использование идентификатора контакта `key` устраняет проблему:

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

Состояние связано с позицией дерева. А `key` позволяет указать именованную позицию вместо того, чтобы полагаться на порядок.

</Solution>

</Challenges>
