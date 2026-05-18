---
title: Сохранение и сброс состояния
---
<Intro>

Состояние изолировано между компонентами. React отслеживает, какому компоненту принадлежит состояние, на основе его положения в дереве рендеринга. Вы можете контролировать, когда сохранять состояние, а когда сбрасывать его между повторными рендерами.

</Intro>

<YouWillLearn>

* Когда React сохраняет или сбрасывает состояние
* Как заставить React сбросить состояние компонента
* Как ключи и типы влияют на сохранение состояния

</YouWillLearn>

## Состояние привязано к позиции в дереве рендеринга {/*state-is-tied-to-a-position-in-the-tree*/}

React строит [деревья рендеринга](learn/understanding-your-ui-as-a-tree#the-render-tree) для структуры компонентов в вашем пользовательском интерфейсе.

Когда вы даете компоненту состояние, вы можете подумать, что состояние «живет» внутри компонента. Но на самом деле состояние хранится внутри React. React связывает каждую часть состояния, которое он хранит, с правильным компонентом по его положению в дереве рендеринга.

Здесь есть только один JSX-тег `<Counter />`, но он рендерится в двух разных позициях:

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

Вот как это выглядит в виде дерева:    

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Диаграмма дерева React-компонентов. Корневой узел помечен как 'div' и имеет два дочерних элемента. Каждый из дочерних элементов помечен как 'Counter' и оба содержат блок состояния с меткой 'count' и значением 0.">

Дерево React

</Diagram>

</DiagramGroup>

**Это два отдельных счетчика, потому что каждый рендерится в своей собственной позиции в дереве.** Обычно вам не нужно думать об этих позициях, чтобы использовать React, но это может быть полезно для понимания того, как это работает.

В React каждый компонент на экране имеет полностью изолированное состояние. Например, если вы рендерите два компонента `Counter` рядом, каждый из них получит свое собственное, независимое состояние `score` и `hover`.

Попробуйте нажать на оба счетчика и заметьте, что они не влияют друг на друга:

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

Как видите, когда обновляется один счетчик, обновляется только состояние этого компонента:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Диаграмма дерева React-компонентов. Корневой узел помечен как 'div' и имеет два дочерних элемента. Левый дочерний элемент помечен как 'Counter' и содержит блок состояния с меткой 'count' и значением 0. Правый дочерний элемент помечен как 'Counter' и содержит блок состояния с меткой 'count' и значением 1. Блок состояния правого дочернего элемента выделен желтым, чтобы указать, что его значение обновилось.">

Обновление состояния

</Diagram>

</DiagramGroup>


React будет сохранять состояние до тех пор, пока вы рендерите один и тот же компонент в одной и той же позиции. Чтобы увидеть это, увеличьте оба счетчика, затем удалите второй компонент, сняв флажок "Render the second counter", а затем добавьте его снова, установив флажок:

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

Обратите внимание, что в тот момент, когда вы перестаете рендерить второй счетчик, его состояние полностью исчезает. Это потому, что когда React удаляет компонент, он уничтожает его состояние.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Диаграмма дерева React-компонентов. Корневой узел помечен как 'div' и имеет два дочерних элемента. Левый дочерний элемент помечен как 'Counter' и содержит блок состояния с меткой 'count' и значением 0. Правый дочерний элемент отсутствует, и на его месте находится изображение желтого «пуфа», выделяющее удаляемый из дерева компонент.">

Удаление компонента

</Diagram>

</DiagramGroup>

Когда вы устанавливаете флажок "Render the second counter", второй `Counter` и его состояние инициализируются с нуля (`score = 0`) и добавляются в DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Диаграмма дерева React-компонентов. Корневой узел помечен как 'div' и имеет два дочерних элемента. Левый дочерний элемент помечен как 'Counter' и содержит блок состояния с меткой 'count' и значением 0. Правый дочерний элемент помечен как 'Counter' и содержит блок состояния с меткой 'count' и значением 0. Весь правый дочерний узел выделен желтым, указывая на то, что он только что был добавлен в дерево.">

Добавление компонента

</Diagram>

</DiagramGroup>

**React сохраняет состояние компонента до тех пор, пока он рендерится в своей позиции в дереве пользовательского интерфейса.** Если он удаляется или другой компонент рендерится в той же позиции, React уничтожает его состояние.

## Один и тот же компонент в одной и той же позиции сохраняет состояние {/*same-component-at-the-same-position-preserves-state*/}

В этом примере есть два разных тега `<Counter />`:

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

Когда вы устанавливаете или снимаете флажок, состояние счетчика не сбрасывается. Независимо от того, `true` или `false` значение `isFancy`, у вас всегда есть `<Counter />` как первый дочерний элемент `div`, возвращаемый корневым компонентом `App`:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Диаграмма с двумя разделами, разделенными стрелкой, переходящей между ними. Каждый раздел содержит компоновку компонентов с родителем, помеченным как 'App', содержащим блок состояния с меткой isFancy. Этот компонент имеет один дочерний элемент 'div', который ведет к блоку свойств, содержащему isFancy (выделен фиолетовым), передаваемому единственному дочернему элементу. Последний дочерний элемент помечен как 'Counter' и содержит блок состояния с меткой 'count' и значением 3 в обеих диаграммах. В левой части диаграммы ничего не выделено, а значение состояния родителя isFancy равно false. В правой части диаграммы значение состояния родителя isFancy изменилось на true, и оно выделено желтым, как и блок свойств ниже, который также изменил свое значение isFancy на true.">

Обновление состояния `App` не сбрасывает `Counter`, потому что `Counter` остается на той же позиции

</Diagram>

</DiagramGroup>


Это тот же компонент в той же позиции, поэтому с точки зрения React это тот же счетчик.

<Pitfall>

Помните, что **именно позиция в дереве пользовательского интерфейса, а не в JSX-разметке, имеет значение для React!** Этот компонент имеет два `return` с разными JSX-тегами `<Counter />` внутри и вне `if`:

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

Вы можете ожидать, что состояние сбросится при установке флажка, но это не так! Это потому, что **оба этих тега `<Counter />` рендерятся в одной и той же позиции.** React не знает, где вы размещаете условия в своей функции. Все, что он «видит», — это дерево, которое вы возвращаете.

В обоих случаях компонент `App` возвращает `<div>` с `<Counter />` в качестве первого дочернего элемента. Для React эти два счетчика имеют один и тот же «адрес»: первый дочерний элемент первого дочернего элемента корня. Вот как React сопоставляет их между предыдущим и следующим рендером, независимо от того, как вы структурируете свою логику.

</Pitfall>

## Разные компоненты в одной и той же позиции сбрасывают состояние {/*different-components-at-the-same-position-reset-state*/}

В этом примере установка флажка заменит `<Counter>` на `<p>`:

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

Здесь вы переключаетесь между _разными_ типами компонентов в одной и той же позиции. Изначально первый дочерний элемент `<div>` содержал `Counter`. Но когда вы заменили его на `p`, React удалил `Counter` из дерева рендеринга и уничтожил его состояние.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Диаграмма с тремя разделами, с стрелкой, переходящей между каждым разделом. Первый раздел содержит React-компонент с меткой 'div' с одним дочерним элементом с меткой 'Counter', содержащим блок состояния с меткой 'count' и значением 3. Средний раздел имеет тот же родительский 'div', но дочерний компонент теперь удален, что обозначено изображением желтого «пуфа». Третий раздел снова имеет тот же родительский 'div', теперь с новым дочерним элементом с меткой 'p', выделенным желтым.">

Когда `Counter` меняется на `p`, `Counter` удаляется, а `p` добавляется

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Диаграмма с тремя разделами, с стрелкой, переходящей между каждым разделом. Первый раздел содержит React-компонент с меткой 'p'. Средний раздел имеет тот же родительский 'div', но дочерний компонент теперь удален, что обозначено изображением желтого «пуфа». Третий раздел снова имеет тот же родительский 'div', теперь с новым дочерним элементом с меткой 'Counter', содержащим блок состояния с меткой 'count' и значением 0, выделенным желтым.">

При возврате `p` удаляется, а `Counter` добавляется

</Diagram>

</DiagramGroup>

Кроме того, **когда вы рендерите другой компонент в той же позиции, это сбрасывает состояние всего его поддерева.** Чтобы увидеть, как это работает, увеличьте счетчик, а затем установите флажок:

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

Состояние счетчика сбрасывается при нажатии на флажок. Хотя вы рендерите `Counter`, первый дочерний элемент `div` меняется с `section` на `div`. Когда дочерний `section` был удален из DOM, все дерево под ним (включая `Counter` и его состояние) также было уничтожено.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Диаграмма с тремя разделами, с стрелкой, переходящей между каждым разделом. Первый раздел содержит React-компонент с меткой 'div' с одним дочерним элементом с меткой 'section', который имеет один дочерний элемент с меткой 'Counter', содержащий блок состояния с меткой 'count' и значением 3. Средний раздел имеет тот же родительский 'div', но дочерние компоненты теперь удалены, что обозначено изображением желтого «пуфа». Третий раздел снова имеет тот же родительский 'div', теперь с новым дочерним элементом с меткой 'div', выделенным желтым, также с новым дочерним элементом с меткой 'Counter', содержащим блок состояния с меткой 'count' и значением 0, все выделено желтым.">

Когда `section` меняется на `div`, `section` удаляется, а новый `div` добавляется

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Диаграмма с тремя разделами, с стрелкой, переходящей между каждым разделом. Первый раздел содержит React-компонент с меткой 'div' с одним дочерним элементом с меткой 'div', который имеет один дочерний элемент с меткой 'Counter', содержащий блок состояния с меткой 'count' и значением 0. Средний раздел имеет тот же родительский 'div', но дочерние компоненты теперь удалены, что обозначено изображением желтого «пуфа». Третий раздел снова имеет тот же родительский 'div', теперь с новым дочерним элементом с меткой 'section', выделенным желтым, также с новым дочерним элементом с меткой 'Counter', содержащим блок состояния с меткой 'count' и значением 0, все выделено желтым.">

При переключении обратно `div` удаляется, а новый `section` добавляется

</Diagram>

</DiagramGroup>

Как правило, **если вы хотите сохранить состояние между повторными рендерами, структура вашего дерева должна «соответствовать»** от одного рендера к другому. Если структура отличается, состояние уничтожается, потому что React уничтожает состояние при удалении компонента из дерева.

<Pitfall>

Вот почему вы не должны вкладывать определения функций компонентов.

Здесь функция компонента `MyTextField` определяется *внутри* `MyComponent`:

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


Каждый раз, когда вы нажимаете кнопку, состояние ввода исчезает! Это потому, что для каждого рендера `MyComponent` создается *разная* функция `MyTextField`. Вы рендерите *разный* компонент в той же позиции, поэтому React сбрасывает все состояние ниже. Это приводит к ошибкам и проблемам с производительностью. Чтобы избежать этой проблемы, **всегда объявляйте функции компонентов на верхнем уровне и не вкладывайте их определения.**

</Pitfall>

## Сброс состояния в той же позиции {/*resetting-state-at-the-same-position*/}

По умолчанию React сохраняет состояние компонента, пока он находится в той же позиции. Обычно это именно то, чего вы хотите, поэтому такое поведение является стандартным. Но иногда вам может понадобиться сбросить состояние компонента. Рассмотрим приложение, которое позволяет двум игрокам отслеживать свои очки в каждом раунде:

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

В настоящее время, когда вы меняете игрока, счет сохраняется. Два `Counter` отображаются в одной и той же позиции, поэтому React считает их *одним и тем же* `Counter`, у которого изменился проп `person`.

Но концептуально, в этом приложении они должны быть двумя отдельными счетчиками. Они могут отображаться в одном и том же месте в пользовательском интерфейсе, но один — это счетчик для Тейлор, а другой — для Сары.

Есть два способа сбросить состояние при переключении между ними:

1. Отображать компоненты в разных позициях
2. Присвоить каждому компоненту явный идентификатор с помощью `key`


### Вариант 1: Отображение компонента в разных позициях {/*option-1-rendering-a-component-in-different-positions*/}

Если вы хотите, чтобы эти два `Counter` были независимыми, вы можете отобразить их в двух разных позициях:

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

* Изначально `isPlayerA` равно `true`. Поэтому первая позиция содержит состояние `Counter`, а вторая пуста.
* Когда вы нажимаете кнопку "Next player", первая позиция очищается, но вторая теперь содержит `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Диаграмма с деревом компонентов React. Родительский элемент помечен как 'Scoreboard' с пузырьком состояния isPlayerA со значением 'true'. Единственный дочерний элемент, расположенный слева, помечен как Counter с пузырьком состояния 'count' со значением 0. Весь левый дочерний элемент выделен желтым, указывая на то, что он был добавлен.">

Начальное состояние

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Диаграмма с деревом компонентов React. Родительский элемент помечен как 'Scoreboard' с пузырьком состояния isPlayerA со значением 'false'. Пузырек состояния выделен желтым, указывая на то, что он изменился. Левый дочерний элемент заменен желтым изображением 'пуф', указывающим на то, что он был удален, и справа появился новый дочерний элемент, выделенный желтым, указывающим на то, что он был добавлен. Новый дочерний элемент помечен как 'Counter' и содержит пузырек состояния 'count' со значением 0.">

Нажатие "next"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Диаграмма с деревом компонентов React. Родительский элемент помечен как 'Scoreboard' с пузырьком состояния isPlayerA со значением 'true'. Пузырек состояния выделен желтым, указывая на то, что он изменился. Слева появился новый дочерний элемент, выделенный желтым, указывающим на то, что он был добавлен. Новый дочерний элемент помечен как 'Counter' и содержит пузырек состояния 'count' со значением 0. Правый дочерний элемент заменен желтым изображением 'пуф', указывающим на то, что он был удален.">

Повторное нажатие "next"

</Diagram>

</DiagramGroup>

Состояние каждого `Counter` уничтожается каждый раз, когда он удаляется из DOM. Вот почему они сбрасываются каждый раз при нажатии кнопки.

Это решение удобно, когда у вас есть всего несколько независимых компонентов, отображаемых в одном месте. В этом примере их всего два, поэтому нетрудно отобразить оба отдельно в JSX.

### Вариант 2: Сброс состояния с помощью ключа {/*option-2-resetting-state-with-a-key*/}

Существует также другой, более универсальный способ сбросить состояние компонента.

Возможно, вы видели `key`, когда [рендерили списки.](/learn/rendering-lists#keeping-list-items-in-order-with-key) Ключи предназначены не только для списков! Вы можете использовать ключи, чтобы заставить React различать любые компоненты. По умолчанию React использует порядок внутри родительского элемента ("первый счетчик", "второй счетчик") для различения компонентов. Но ключи позволяют вам указать React, что это не просто *первый* счетчик или *второй* счетчик, а конкретный счетчик — например, счетчик *Тейлор*. Таким образом, React будет знать счетчик *Тейлор*, где бы он ни появился в дереве!

В этом примере два `<Counter />` не разделяют состояние, хотя они и появляются в одном и том же месте в JSX:

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

Переключение между Тейлор и Сарой не сохраняет состояние. Это потому, что **вы дали им разные `key`**:

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Указание `key` говорит React использовать сам `key` как часть позиции, вместо их порядка внутри родительского элемента. Вот почему, даже несмотря на то, что вы отображаете их в одном и том же месте в JSX, React считает их двумя разными счетчиками, и поэтому они никогда не будут разделять состояние. Каждый раз, когда счетчик появляется на экране, его состояние создается. Каждый раз, когда он удаляется, его состояние уничтожается. Переключение между ними снова и снова сбрасывает их состояние.

<Note>

Помните, что ключи не являются глобально уникальными. Они только указывают позицию *внутри родительского элемента*.

</Note>

### Сброс формы с помощью ключа {/*resetting-a-form-with-a-key*/}

Сброс состояния с помощью ключа особенно полезен при работе с формами.

В этом приложении чата компонент `<Chat>` содержит состояние текстового поля ввода:

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
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
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

Попробуйте ввести что-нибудь в поле ввода, а затем нажмите "Alice" или "Bob", чтобы выбрать другого получателя. Вы заметите, что состояние поля ввода сохраняется, потому что `<Chat>` отображается в той же позиции в дереве.

**Во многих приложениях это желаемое поведение, но не в приложении чата!** Вы не хотите отправлять сообщение, которое вы уже набрали, не тому человеку из-за случайного клика. Чтобы исправить это, добавьте `key`:

```js
<Chat key={to.id} contact={to} />
```

Это гарантирует, что при выборе другого получателя компонент `Chat` будет воссоздан с нуля, включая любое состояние в дереве ниже него. React также пересоздаст DOM-элементы вместо их повторного использования.

Теперь при смене получателя поле ввода всегда очищается:

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

<DeepDive>

#### Сохранение состояния для удаленных компонентов {/*preserving-state-for-removed-components*/}

В реальном приложении чата вы, вероятно, захотите восстановить состояние ввода, когда пользователь снова выберет предыдущего получателя. Есть несколько способов сохранить состояние "активным" для компонента, который больше не виден:

- Вы можете отобразить _все_ чаты вместо одного текущего, но скрыть все остальные с помощью CSS. Чаты не будут удалены из дерева, поэтому их локальное состояние сохранится. Это решение отлично подходит для простых интерфейсов. Но оно может стать очень медленным, если скрытые деревья большие и содержат много DOM-узлов.
- Вы можете [поднять состояние вверх](/learn/sharing-state-between-components) и хранить ожидающее сообщение для каждого получателя в родительском компоненте. Таким образом, когда дочерние компоненты удаляются, это не имеет значения, потому что именно родитель сохраняет важную информацию. Это самое распространенное решение.
- Вы также можете использовать другой источник в дополнение к состоянию React. Например, вы, вероятно, захотите, чтобы черновик сообщения сохранялся, даже если пользователь случайно закроет страницу. Чтобы реализовать это, вы можете сделать так, чтобы компонент `Chat` инициализировал свое состояние, читая из [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), и сохранял черновики там же.

Независимо от выбранной стратегии, чат _с Алисой_ концептуально отличается от чата _с Бобом_, поэтому имеет смысл присвоить `key` дереву `<Chat>` на основе текущего получателя.

</DeepDive>

<Recap>

- React сохраняет состояние до тех пор, пока один и тот же компонент отображается в одной и той же позиции.
- Состояние не хранится в JSX-тегах. Оно связано с позицией в дереве, куда вы поместили этот JSX.
- Вы можете принудительно сбросить состояние поддерева, присвоив ему другой ключ.
- Не вкладывайте определения компонентов друг в друга, иначе вы случайно сбросите состояние.

</Recap>



<Challenges>

#### Исправление исчезающего текста в поле ввода {/*fix-disappearing-input-text*/}

Этот пример показывает сообщение при нажатии кнопки. Однако нажатие кнопки также случайно сбрасывает поле ввода. Почему это происходит? Исправьте это так, чтобы нажатие кнопки не сбрасывало текст в поле ввода.

<Sandpack>

```js src/App.js
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

Проблема в том, что `Form` отображается в разных позициях. В ветке `if` он является вторым дочерним элементом `<div>`, а в ветке `else` — первым. Поэтому тип компонента в каждой позиции меняется. Первая позиция меняется между `p` и `Form`, а вторая — между `Form` и `button`. React сбрасывает состояние каждый раз, когда тип компонента изменяется.

Самое простое решение — унифицировать ветки, чтобы `Form` всегда отображался в одной и той же позиции:

<Sandpack>

```js src/App.js
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


Технически вы также можете добавить `null` перед `<Form />` в ветке `else`, чтобы соответствовать структуре ветки `if`:

<Sandpack>

```js src/App.js
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

Таким образом, `Form` всегда будет вторым дочерним элементом, поэтому он останется на той же позиции и сохранит свое состояние. Но этот подход гораздо менее очевиден и создает риск того, что кто-то другой удалит этот `null`.

</Solution>

#### Поменять местами два поля формы {/*swap-two-form-fields*/}

Эта форма позволяет вводить имя и фамилию. Она также имеет флажок, который определяет, какое поле идет первым. Когда вы ставите галочку, поле "Фамилия" появляется перед полем "Имя".

Это почти работает, но есть ошибка. Если вы заполните поле "Имя" и поставите галочку, текст останется в первом поле (которое теперь "Фамилия"). Исправьте это так, чтобы текст ввода также перемещался при изменении порядка.

<Hint>

Кажется, для этих полей их позиция внутри родителя недостаточна. Есть ли способ сообщить React, как сопоставить состояние между рендерами?

</Hint>

<Sandpack>

```js src/App.js
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

Присвойте `key` обоим компонентам `<Field>` в обеих ветках `if` и `else`. Это говорит React, как "сопоставить" правильное состояние для каждого `<Field>`, даже если их порядок внутри родителя изменится:

<Sandpack>

```js src/App.js
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

#### Сброс формы редактирования {/*reset-a-detail-form*/}

Это редактируемый список контактов. Вы можете редактировать детали выбранного контакта, а затем нажать "Save", чтобы обновить их, или "Reset", чтобы отменить изменения.

Когда вы выбираете другого контакта (например, Алису), состояние обновляется, но форма продолжает показывать детали предыдущего контакта. Исправьте это так, чтобы форма сбрасывалась при изменении выбранного контакта.

<Sandpack>

```js src/App.js
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

```js src/ContactList.js
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

```js src/EditContact.js
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

Присвойте `key={selectedId}` компоненту `EditContact`. Таким образом, переключение между разными контактами сбросит форму:

<Sandpack>

```js src/App.js
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

```js src/ContactList.js
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

```js src/EditContact.js
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

#### Очистка изображения во время его загрузки {/*clear-an-image-while-its-loading*/}

При нажатии "Next" браузер начинает загружать следующее изображение. Однако, поскольку оно отображается в том же теге `<img>`, по умолчанию вы по-прежнему будете видеть предыдущее изображение до тех пор, пока не загрузится следующее. Это может быть нежелательно, если важно, чтобы текст всегда соответствовал изображению. Измените это так, чтобы в момент нажатия "Next" предыдущее изображение немедленно очищалось.

<Hint>

Есть ли способ сообщить React, чтобы он пересоздавал DOM вместо его повторного использования?

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

Вы можете предоставить `key` тегу `<img>`. Когда этот `key` изменится, React пересоздаст DOM-узел `<img>` с нуля. Это вызывает кратковременную вспышку при загрузке каждого изображения, поэтому вы не захотите делать это для каждого изображения в вашем приложении. Но это имеет смысл, если вы хотите, чтобы изображение всегда соответствовало тексту.

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

#### Исправьте неправильное состояние в списке {/*fix-misplaced-state-in-the-list*/}

В этом списке каждое `Contact` имеет состояние, определяющее, была ли нажата кнопка "Показать email" для него. Нажмите "Показать email" для Алисы, а затем установите флажок "Показывать в обратном порядке". Вы заметите, что теперь развернут email Тейлора, а Алисы, которая переместилась вниз, отображается свернутой.

Исправьте это так, чтобы развернутое состояние было связано с каждым контактом, независимо от выбранного порядка.

<Sandpack>

```js src/App.js
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
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Показывать в обратном порядке
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

```js src/Contact.js
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
        {expanded ? 'Скрыть' : 'Показать'} email
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

Проблема в том, что в этом примере в качестве `key` использовался индекс:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Однако, вы хотите, чтобы состояние было связано с _каждым конкретным контактом_.

Использование ID контакта в качестве `key` вместо этого решает проблему:

<Sandpack>

```js src/App.js
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
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Показывать в обратном порядке
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

```js src/Contact.js
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
        {expanded ? 'Скрыть' : 'Показать'} email
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

Состояние связано с позицией в дереве. `key` позволяет указать именованную позицию вместо того, чтобы полагаться на порядок.

</Solution>

</Challenges>