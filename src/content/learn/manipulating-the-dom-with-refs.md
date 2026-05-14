---
title: 'Манипулирование DOM с помощью рефов'
---
```html
<Intro>

React автоматически обновляет [DOM](https://developer.mozilla.org/ru/docs/Web/API/Document_Object_Model/Introduction), чтобы соответствовать вашему рендер-выводу, поэтому вашим компонентам не часто потребуется манипулировать им. Однако иногда вам может потребоваться доступ к DOM-элементам, управляемым React, например, чтобы сфокусировать узел, прокрутить к нему или измерить его размер и положение. В React нет встроенного способа сделать это, поэтому вам понадобится *ref* для DOM-узла.

</Intro>

<YouWillLearn>

- Как получить доступ к DOM-узлу, управляемому React, с помощью атрибута `ref`
- Как атрибут `ref` JSX связан с хуком `useRef`
- Как получить доступ к DOM-узлу другого компонента
- В каких случаях безопасно изменять DOM, управляемый React

</YouWillLearn>

## Получение ref к узлу {/*getting-a-ref-to-the-node*/}

Чтобы получить доступ к DOM-узлу, управляемому React, сначала импортируйте хук `useRef`:

```js
import { useRef } from 'react';
```

Затем используйте его, чтобы объявить ref внутри вашего компонента:

```js
const myRef = useRef(null);
```

Наконец, передайте свой ref в качестве атрибута `ref` в JSX-тег, для которого вы хотите получить DOM-узел:

```js
<div ref={myRef}>
```

Хук `useRef` возвращает объект с одним свойством `current`. Изначально `myRef.current` будет равно `null`. Когда React создает DOM-узел для этого `<div>`, React поместит ссылку на этот узел в `myRef.current`. Затем вы можете получить доступ к этому DOM-узлу из ваших [обработчиков событий](/learn/responding-to-events) и использовать встроенные [API браузера](https://developer.mozilla.org/ru/docs/Web/API/Element), определенные в нем.

```js
// Вы можете использовать любые API браузера, например:
myRef.current.scrollIntoView();
```

### Пример: Фокусировка текстового ввода {/*example-focusing-a-text-input*/}

В этом примере нажатие кнопки сфокусирует ввод:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Чтобы реализовать это:

1. Объявите `inputRef` с помощью хука `useRef`.
2. Передайте его как `<input ref={inputRef}>`. Это указывает React **поместить DOM-узел этого `<input>` в `inputRef.current`.**
3. В функции `handleClick` прочитайте DOM-узел ввода из `inputRef.current` и вызовите [`focus()`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/focus) на нем с помощью `inputRef.current.focus()`.
4. Передайте обработчик событий `handleClick` в `<button>` с помощью `onClick`.

Хотя манипулирование DOM является наиболее распространенным вариантом использования refs, хук `useRef` можно использовать для хранения других вещей вне React, таких как идентификаторы таймеров. Аналогично состоянию, refs остаются между рендерами. Refs похожи на переменные состояния, которые не вызывают повторные рендеры при их установке. Прочтите о refs в [Ссылки на значения с помощью Refs.](/learn/referencing-values-with-refs)

### Пример: Прокрутка к элементу {/*example-scrolling-to-an-element*/}

У вас может быть больше одного ref в компоненте. В этом примере есть карусель из трех изображений. Каждая кнопка центрирует изображение, вызывая метод браузера [`scrollIntoView()`](https://developer.mozilla.org/ru/docs/Web/API/Element/scrollIntoView) на соответствующем DOM-узле:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### Как управлять списком refs с помощью ref-callback {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

В приведенных выше примерах есть предопределенное количество refs. Однако иногда вам может понадобиться ref для каждого элемента в списке, и вы не знаете, сколько у вас будет. Что-то вроде этого **не будет работать**:

```js
<ul>
  {items.map((item) => {
    // Не работает!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Это связано с тем, что **хуки должны вызываться только на верхнем уровне вашего компонента.** Вы не можете вызывать `useRef` в цикле, в условии или внутри вызова `map()`.

Один из возможных способов обойти это — получить один ref к родительскому элементу, а затем использовать методы манипулирования DOM, такие как [`querySelectorAll`](https://developer.mozilla.org/ru/docs/Web/API/Document/querySelectorAll), чтобы «найти» отдельные дочерние узлы из него. Однако это хрупко и может сломаться, если ваша структура DOM изменится.

Другое решение — **передать функцию в атрибут `ref`.** Это называется [`ref` callback.](/reference/react-dom/components/common#ref-callback) React вызовет ваш ref-callback с DOM-узлом, когда придет время установить ref, и с `null`, когда придет время очистить его. Это позволяет вам поддерживать свой собственный массив или [Map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map) и получать доступ к любому ref по его индексу или какому-либо идентификатору.

В этом примере показано, как вы можете использовать этот подход для прокрутки к произвольному узлу в длинном списке:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

В этом примере `itemsRef` не содержит один DOM-узел. Вместо этого он содержит [Map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map) от идентификатора элемента к DOM-узлу. ([Refs могут содержать любые значения!](/learn/referencing-values-with-refs)) [`ref` callback](/reference/react-dom/components/common#ref-callback) для каждого элемента списка заботится об обновлении Map:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Добавить в Map
    map.set(cat, node);

    return () => {
      // Удалить из Map
      map.delete(cat);
    };
  }}
>
```

Это позволяет вам позже считывать отдельные DOM-узлы из Map.

<Note>

Когда включен Strict Mode, ref-callback будет запускаться дважды в режиме разработки.

Узнайте больше о [том, как это помогает находить ошибки](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) в callback refs.

</Note>

</DeepDive>

## Доступ к DOM-узлам другого компонента {/*accessing-another-components-dom-nodes*/}

<Pitfall>
Refs — это лазейка. Ручное манипулирование DOM-узлами _другого_ компонента может сделать ваш код хрупким.
</Pitfall>

Вы можете передавать refs от родительского компонента дочерним компонентам [так же, как и любые другие пропсы](/learn/passing-props-to-a-component).

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

В приведенном выше примере ref создается в родительском компоненте `MyForm` и передается дочернему компоненту `MyInput`. `MyInput` затем передает ref в `<input>`. Поскольку `<input>` является [встроенным компонентом](/reference/react-dom/components/common), React устанавливает свойство `.current` ref в DOM-элемент `<input>`.

`inputRef`, созданный в `MyForm`, теперь указывает на DOM-элемент `<input>`, возвращенный `MyInput`. Обработчик кликов, созданный в `MyForm`, может получить доступ к `inputRef` и вызвать `focus()`, чтобы установить фокус на `<input>`.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

#### Предоставление подмножества API с помощью императивного обработчика {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

В приведенном выше примере ref, переданный в `MyInput`, передается исходному DOM-элементу ввода. Это позволяет родительскому компоненту вызывать `focus()` на нем. Однако это также позволяет родительскому компоненту делать что-то еще — например, изменять его стили CSS. В редких случаях вам может потребоваться ограничить раскрытую функциональность. Вы можете сделать это с помощью [`useImperativeHandle`](/reference/react/useImperativeHandle):

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Только предоставить focus и ничего больше
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

</Sandpack>

Здесь `realInputRef` внутри `MyInput` содержит фактический DOM-узел ввода. Однако [`useImperativeHandle`](/reference/react/useImperativeHandle) предписывает React предоставить ваш собственный специальный объект в качестве значения ref для родительского компонента. Таким образом, `inputRef.current` внутри компонента `Form` будет иметь только метод `focus`. В этом случае «обработчик» ref — это не DOM-узел, а пользовательский объект, который вы создаете внутри вызова [`useImperativeHandle`](/reference/react/useImperativeHandle).

</DeepDive>

## Когда React прикрепляет refs {/*when-react-attaches-the-refs*/}

В React каждое обновление разделено на [две фазы](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Во время **рендера** React вызывает ваши компоненты, чтобы выяснить, что должно быть на экране.
* Во время **commit** React применяет изменения к DOM.

В целом, вы [не хотите](/learn/referencing-values-with-refs#best-practices-for-refs) получать доступ к refs во время рендеринга. Это относится и к refs, содержащим DOM-узлы. Во время первого рендера DOM-узлы еще не созданы, поэтому `ref.current` будет равно `null`. А во время рендеринга обновлений DOM-узлы еще не обновлены. Поэтому слишком рано их читать.

React устанавливает `ref.current` во время commit. Перед обновлением DOM React устанавливает затронутые значения `ref.current` в `null`. После обновления DOM React немедленно устанавливает их в соответствующие DOM-узлы.

**Обычно вы будете получать доступ к refs из обработчиков событий.** Если вы хотите что-то сделать с ref, но для этого нет конкретного события, вам может понадобиться Effect. Мы обсудим Effects на следующих страницах.

<DeepDive>

#### Синхронная очистка обновлений состояния с помощью flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Рассмотрим такой код, который добавляет новое todo и прокручивает экран вниз к последнему дочернему элементу списка. Обратите внимание, что по какой-то причине он всегда прокручивает к todo, которое было *непосредственно перед* последним добавленным:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

Проблема в этих двух строках:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

В React [обновления состояния ставятся в очередь.](/learn/queueing-a-series-of-state-updates) Обычно это то, что вам нужно. Однако здесь это вызывает проблему, потому что `setTodos` не сразу обновляет DOM. Поэтому, когда вы прокручиваете список к его последнему элементу, todo еще не добавлен. Вот почему прокрутка всегда «отстает» на один элемент.

Чтобы исправить эту проблему, вы можете заставить React обновить («очистить») DOM синхронно. Для этого импортируйте `flushSync` из `react-dom` и **оберните обновление состояния** в вызов `flushSync`:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Это укажет React обновить DOM синхронно сразу после выполнения кода, обернутого в `flushSync`. В результате последнее todo уже будет в DOM к тому времени, когда вы попытаетесь прокрутить к нему:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Лучшие практики для манипулирования DOM с помощью refs {/*best-practices-for-dom-manipulation-with-refs*/}

Refs — это лазейка. Вам следует использовать их только тогда, когда вам нужно «выйти за пределы React». Общие примеры этого включают управление фокусом, положением прокрутки или вызов API браузера, которые React не предоставляет.

Если вы придерживаетесь недеструктивных действий, таких как фокусировка и прокрутка, у вас не должно возникнуть никаких проблем. Однако, если вы попытаетесь **изменить** DOM вручную, вы рискуете вступить в конфликт с изменениями, которые вносит React.

Чтобы проиллюстрировать эту проблему, этот пример включает приветственное сообщение и две кнопки. Первая кнопка переключает свое присутствие с помощью [условного рендеринга](/learn/conditional-rendering) и [состояния](/learn/state-a-components-memory), как вы обычно делаете в React. Вторая кнопка использует [API `remove()` DOM](https://developer.mozilla.org/ru/docs/Web/API/Element/remove), чтобы принудительно удалить его из DOM вне контроля React.

Попробуйте несколько раз нажать «Переключить с помощью setState». Сообщение должно исчезнуть и появиться снова. Затем нажмите «Удалить из DOM». Это принудительно удалит его. Наконец, нажмите «Переключить с помощью setState»:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

После того, как вы вручную удалили DOM-элемент, попытка использовать `setState`, чтобы снова показать его, приведет к сбою. Это связано с тем, что вы изменили DOM, и React не знает, как продолжить его правильное управление.

**Избегайте изменения DOM-узлов, управляемых React.** Изменение, добавление дочерних элементов или удаление дочерних элементов из элементов, управляемых React, может привести к несогласованным визуальным результатам или сбоям, как указано выше.

Однако это не означает, что вы вообще не можете этого делать. Это требует осторожности. **Вы можете безопасно изменять части DOM, которые React _не имеет причин_ обновлять.** Например, если какой-то `<div>` всегда пуст в JSX, у React не будет причин касаться его списка дочерних элементов. Поэтому безопасно вручную добавлять или удалять элементы там.

<Recap>

- Refs — это общий концепт, но чаще всего вы будете использовать их для хранения DOM-элементов.
- Вы указываете React поместить DOM-узел в `myRef.current`, передав `<div ref={myRef}>`.
- Обычно вы будете использовать refs для недеструктивных действий, таких как фокусировка, прокрутка или измерение DOM-элементов.
- Компонент не предоставляет свои DOM-узлы по умолчанию. Вы можете согласиться на предоставление DOM-узла, используя проп `ref`.
- Избегайте изменения DOM-узлов, управляемых React.
- Если вы изменяете DOM-узлы, управляемые React, изменяйте части, которые React не имеет причин обновлять.

</Recap>

<Challenges>

#### Воспроизведение и приостановка видео {/*play-and-pause-the-video*/}

В этом примере кнопка переключает переменную состояния, чтобы переключаться между состояниями воспроизведения и паузы. Однако, чтобы фактически воспроизвести или приостановить видео, переключение состояния недостаточно. Вам также необходимо вызвать [`play()`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/play) и [`pause()`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/pause) на DOM-элементе для `<video>`. Добавьте ref к нему и заставьте кнопку работать.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Для дополнительной задачи сохраняйте кнопку «Воспроизвести» в синхронизации с тем, воспроизводится ли видео, даже если пользователь щелкает правой кнопкой мыши по видео и воспроизводит его с помощью встроенных элементов управления мультимедиа браузера. Возможно, вам захочется прослушивать `onPlay` и `onPause` на видео, чтобы сделать это.

<Solution>

Объявите ref и поместите его в элемент `<video>`. Затем вызовите `ref.current.play()` и `ref.current.pause()` в обработчике событий в зависимости от следующего состояния.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Чтобы обработать встроенные элементы управления браузера, вы можете добавить обработчики `onPlay` и `onPause` в элемент `<video>` и вызывать `setIsPlaying` из них. Таким образом, если пользователь воспроизводит видео с помощью элементов управления браузера, состояние будет скорректировано соответствующим образом.

</Solution>

#### Фокусировка поля поиска {/*focus-the-search-field*/}

Сделайте так, чтобы при нажатии кнопки «Поиск» фокус переходил в поле.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Добавьте ref к вводу и вызовите `focus()` на DOM-узле, чтобы сфокусировать его:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Прокрутка карусели изображений {/*scrolling-an-image-carousel*/}

Эта карусель изображений имеет кнопку «Далее», которая переключает активное изображение. Сделайте так, чтобы галерея прокручивалась по горизонтали к активному изображению при нажатии. Вам нужно будет вызвать [`scrollIntoView()`](https://developer.mozilla.org/ru/docs/Web/API/Element/scrollIntoView) на DOM-узле активного изображения:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Вам не нужно иметь ref для каждого изображения для этого упражнения. Должно быть достаточно иметь ref для текущего активного изображения или для самого списка. Используйте `flushSync`, чтобы убедиться, что DOM обновлен *перед* прокруткой.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Вы можете объявить `selectedRef`, а затем передавать его условно только текущему изображению:

```js
<li ref={index === i ? selectedRef : null}>
```

Когда `index === i`, что означает, что изображение является выбранным, `<li>` получит `selectedRef`. React позаботится о том, чтобы `selectedRef.current` всегда указывал на правильный DOM-узел.

Обратите внимание, что вызов `flushSync` необходим, чтобы заставить React обновить DOM перед прокруткой. В противном случае `selectedRef.current` всегда будет указывать на ранее выбранный элемент.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-