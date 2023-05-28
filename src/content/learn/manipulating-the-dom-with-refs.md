---
title: 'Манипулирование DOM с помощью ссылок'
---

<Intro>

React автоматически обновляет [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction ) в соответствии с вашими результатами рендеринга, так что вашим компонентам не нужно будет часто манипулировать ими. Однако иногда вам может понадобиться доступ к элементам DOM, управляемым React, например, чтобы сфокусировать узел, прокрутить до него или измерить его размер и положение. В React нет встроенного способа выполнить эти действия, поэтому вам понадобится * ссылка * на узел DOM.

</Intro>

<YouWillLearn>

- Как получить доступ к узлу DOM, управляемому React, с атрибутом `ref`
- Как атрибут JSX `ref` соотносится с крючком `use Reef`
- Как получить доступ к DOM-узлу другого компонента
- В каких случаях безопасно изменять DOM, управляемый React

</YouWillLearn>

## Получение ссылки на узел {/*getting-a-ref-to-the-node*/}

Чтобы получить доступ к узлу DOM, управляемому React, сначала импортируйте `user` Крюк:

```js
import { useRef } from 'react';
```

Затем используйте его для объявления ссылки внутри вашего компонента:

```js
const myRef = useRef(null);
```

Наконец, передайте свой ref в качестве атрибута `ref` тегу JSX, для которого вы хотите получить узел DOM:

```js
<div ref={myRef}>
```

Крюк `use Reef` возвращает объект с единственным свойством под названием `current`. Изначально `myRef.current` будет иметь значение `null`. Когда React создаст узел DOM для этого `<div>`, React поместит ссылку на этот узел в `myRef.current`. Затем вы можете получить доступ к этому узлу DOM из ваших [обработчиков событий](/learn/responsing-to-events) и использовать встроенные [API браузера](https://developer.mozilla.org/docs/Web/API/Element ) определено на нем.

```js
// Вы можете использовать любые API-интерфейсы браузера, например:
myRef.current.scrollIntoView();
```

### Пример: Фокусировка ввода текста {/*example-focusing-a-text-input*/}

В этом примере нажатие кнопки сфокусирует вводимые данные:

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

1. Объявите `input Ref` с помощью крючка `use Reef`.
2. Передайте его как `<input ref={входная ссылка}>`. Это указывает React на **поместить этот DOM-узел `<input>` в `input Ref.current`.**
3. В функции `handleClick` считайте входной DOM-узел из `inputRef.current` и вызывайте [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus ) на нем с помощью `inputRef.current.focus()`.
4. Передайте обработчик события "обработать щелчок" в `<кнопка>` с помощью `onClick`.

В то время как манипулирование DOM является наиболее распространенным вариантом использования ссылок, крючки `use Reef` могут использоваться для хранения других вещей вне React, таких как идентификаторы таймера. Аналогично состоянию, ссылки остаются между рендерами. Ссылки подобны переменным состояния, которые не запускают повторный рендеринг, когда вы их устанавливаете. Читайте о ссылках в [Ссылка на значения с помощью ссылок.](/learn/referencing-values-with-refs)
### Пример: Прокрутка к элементу {/*example-scrolling-to-an-element*/}

У вас может быть более одного ref в компоненте. В этом примере есть карусель из трех изображений. Каждая кнопка центрирует изображение, вызывая браузер [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView ) метод на соответствующем узле DOM:

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
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
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

#### Как управлять списком ссылок с помощью обратного вызова ref {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

В приведенных выше примерах существует предопределенное количество ссылок. Однако иногда вам может понадобиться ссылка на каждый элемент в списке, и вы не знаете, сколько их у вас будет. Что-то вроде этого ** не сработало бы**:
```js
<ul>
  {items.map((item) => {
    // Не работает!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Это связано с тем, что **Перехватчики должны вызываться только на верхнем уровне вашего компонента.** Вы не можете вызвать `ushered` в цикле, в условии или внутри вызова `map()`.

Один из возможных способов обойти это - получить единственную ссылку на их родительский элемент, а затем использовать методы манипулирования DOM, такие как [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) чтобы "найти" из него отдельные дочерние узлы. Однако это хрупко и может сломаться, если ваша структура DOM изменится.

Другое решение состоит в том, чтобы **передать функцию атрибуту `ref`.** Это называется [`ref` callback.](/reference/react-dom/components/common#ref-callback) React вызовет ваш обратный вызов ref с помощью узла DOM, когда придет время установить ref, и с помощью `null`, когда придет время его очистить. Это позволяет вам поддерживать свой собственный массив или [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), и получить доступ к anyref по его индексу или какому-либо идентификатору.

В этом примере показано, как вы можете использовать этот подход для прокрутки к произвольному узлу в длинном списке:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const itemsRef = useRef(null);

  function scrollToId(itemId) {
    const map = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Инициализируйте Map при первом использовании.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>
          Tom
        </button>
        <button onClick={() => scrollToId(5)}>
          Maru
        </button>
        <button onClick={() => scrollToId(9)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          {catList.map(cat => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat.id, node);
                } else {
                  map.delete(cat.id);
                }
              }}
            >
              <img
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
    imageUrl: 'https://placekitten.com/250/200?image=' + i
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
```

</Sandpack>

В этом примере `items Ref` не содержит ни одного DOM-узла. Вместо этого он содержит [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) от идентификатора элемента к узлу DOM. ([Refs can hold any values!](/learn/referencing-values-with-refs)) Обратный вызов [`ref` callback](/reference/react-dom/components/common#ref-callback) для каждого элемента списка заботится об обновлении карты:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Добавить в Map
      map.set(cat.id, node);
    } else {
      // Убрать из Map
      map.delete(cat.id);
    }
  }}
>
```

Это позволяет вам позже считывать отдельные узлы DOM с карты.

</DeepDive>

## Доступ к DOM-узлам другого компонента {/*accessing-another-components-dom-nodes*/}

Когда вы помещаете ссылку на встроенный компонент, который выводит элемент браузера, такой как `<input />`, React установит свойство `current` этого ref для соответствующего узла DOM (например, фактического `<input />` в браузере).

Однако, если вы попытаетесь поместить reef на ** свой собственный ** компонент, например `<My Input />`, по умолчанию вы получите `null`. Вот пример, демонстрирующий это. Обратите внимание, что нажатие кнопки ** не приводит к ** фокусировке ввода:

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
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

Чтобы помочь вам заметить проблему, React также выводит сообщение об ошибке на консоль:

<ConsoleBlock level="error">

Предупреждение: Функциональным компонентам не могут быть предоставлены ссылки. Попытки получить доступ к этой ссылке завершатся неудачей. Вы имели в виду использовать React.forwardRef()?

</ConsoleBlock>

Это происходит потому, что по умолчанию React не позволяет компоненту получать доступ к DOM-узлам других компонентов. Даже для своих собственных детей! Это сделано намеренно. Рефери - это аварийный люк, которым следует пользоваться с осторожностью. Ручное манипулирование DOM-узлами другого компонента делает ваш код еще более хрупким.

Вместо этого компоненты, которые _want_ предоставляют доступ к своим DOM-узлам, должны ** согласиться ** на такое поведение. Компонент может указать, что он "пересылает" свой ref одному из своих дочерних элементов. Вот как "My Input" может использовать API "forward Ref":

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Вот как это работает:

1. `<My Input ref={input Ref} />` сообщает React поместить соответствующий узел DOM в `input Ref.current`. Однако выбор в пользу этого зависит от компонента "Мои входные данные" - по умолчанию это не так.
2. Компонент `My Input` объявлен с использованием `forward Ref`. ***Это позволяет ему получать `input Ref` сверху в качестве второго аргумента `ref`**, который объявляется после `props`.
3. Сам `myInput` передает полученный им `ref` в `<input>` внутри него.

Теперь нажатие кнопки для фокусировки ввода работает:

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
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

В системах проектирования это обычная схема для низкоуровневых компонентов, таких как кнопки, входные данные и так далее, пересылать свои ссылки на свои DOM-узлы. С другой стороны, компоненты высокого уровня, такие как формы, списки или разделы страниц, обычно не раскрывают свои узлы DOM, чтобы избежать случайных зависимостей от структуры DOM.

<DeepDive>

#### Предоставление подмножества API с императивным дескриптором {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

В приведенном выше примере `My Input" предоставляет исходный элемент ввода DOM. Это позволяет родительскому компоненту вызвать `focus()` для него. Однако это также позволяет родительскому компоненту делать что-то еще - например, изменять свои стили CSS. В редких случаях вы можете захотеть ограничить доступную функциональность. Вы можете сделать это с помощью `использовать императивный дескриптор`:

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Только выставляйте фокус и ничего больше
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
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

Здесь "real Input Ref` input `My Input` содержит фактический входной DOM-узел. Однако "использовать императивный дескриптор" предписывает React предоставить ваш собственный специальный объект в качестве значения ссылки на родительский компонент. Таким образом, `input Ref.current" внутри компонента `Form` будет иметь только метод `focus`. В этом случае ссылка "handle" - это не узел DOM, а пользовательский объект, который вы создаете внутри вызова "use Imperative Handle".

</DeepDive>

## Когда React присоединяет ссылки {/*when-react-attaches-the-refs*/}

В React каждое обновление разделено на [два этапа](/learn/render-and-commit#шаг-3-react-фиксирует-изменения-в-dom):

* Во время **рендеринга** React вызывает ваши компоненты, чтобы выяснить, что должно быть на экране.
* Во время **фиксации** React применяет изменения к DOM.

В общем, вы [не хотите] (/learn/referencing-values-with-refs#best-practices-for-refs) получать доступ к ссылкам во время рендеринга. Это также относится к ссылкам, содержащим узлы DOM. Во время первого рендеринга узлы DOM еще не были созданы, поэтому `ref.current` будет `null`. И во время рендеринга обновлений узлы DOM еще не были обновлены. Так что еще слишком рано их читать.

React устанавливает `ref.current` во время фиксации. Перед обновлением DOM React устанавливает для затронутых значений `ref.current` значение `null`. После обновления DOM React немедленно устанавливает их в соответствующие узлы DOM.

**Обычно вы получаете доступ к ссылкам из обработчиков событий.** Если вы хотите что-то сделать со ссылкой, но нет конкретного события, в котором это можно сделать, вам может понадобиться эффект. Мы обсудим эффекты на следующих страницах.

<DeepDive>

#### Состояние промывки обновляется синхронно с помощью функции flush Sync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Рассмотрим код, подобный этому, который добавляет новое задание и прокручивает экран вниз до последнего дочернего элемента списка. Обратите внимание, что по какой-то причине он всегда прокручивается до пункта "Сделать", который был *непосредственно перед* последним добавленным:

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

Проблема заключается в этих двух строках:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

В React [state updates are queued.](/learn/queueing-a-series-of-state-updates) Обычно это то, чего вы хотите. Однако здесь это вызывает проблему, потому что "установить в dos` не сразу обновляет DOM. Таким образом, к тому времени, когда вы прокручиваете список до его последнего элемента, задача еще не была добавлена. Вот почему прокрутка всегда "отстает" на один элемент.

Чтобы устранить эту проблему, вы можете заставить React обновлять ("сбрасывать") DOM синхронно. Чтобы сделать это, импортируйте "flash Sync" из "react-dom" и ** оберните обновление состояния ** в вызов "flush Sync".:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Это даст команду React асинхронно обновить DOM сразу после выполнения кода, обернутого в "flush Sync". В результате последнее, что нужно сделать, уже будет в DOM к тому времени, когда вы попытаетесь перейти к нему:

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

## Лучшие практики для манипулирования DOM с помощью ссылок {/*best-practices-for-dom-manipulation-with-refs*/}

Судьи - это спасательный люк. Вы должны использовать их только тогда, когда вам нужно "выйти за пределы React". Распространенные примеры этого включают управление фокусом, положением прокрутки или вызов API-интерфейсов браузера, которые React не предоставляет.

Если вы будете придерживаться неразрушающих действий, таких как фокусировка и прокрутка, у вас не должно возникнуть никаких проблем. Однако, если вы попытаетесь ** изменить ** DOM вручную, вы можете столкнуться с риском возникновения конфликта с изменениями, которые вносит React.

Чтобы проиллюстрировать эту проблему, в этом примере есть приветственное сообщение и две кнопки. Первая кнопка переключает свое присутствие, используя [conditional rendering](/learn/conditional-rendering) и [state](/learn/state-a-components-memory), как вы обычно делаете в React. Вторая кнопка использует [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove ), чтобы принудительно удалить его из DOM вне контроля React.

Попробуйте нажать "Переключить с помощью setState" несколько раз. Сообщение должно исчезнуть и появиться снова. Затем нажмите "Удалить из DOM". Это приведет к его принудительному удалению. Наконец, нажмите "Переключить с помощью setState".:

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

После того как вы вручную удалили элемент DOM, попытка использовать `setState` для его повторного отображения приведет к сбою. Это потому, что вы изменили DOM, и React не знает, как продолжать правильно управлять им.

**Избегайте изменения узлов DOM, управляемых React.** Изменение, добавление дочерних элементов к элементам, управляемым React, или удаление дочерних элементов из элементов, управляемых React, может привести к несогласованным визуальным результатам или сбоям, подобным описанным выше.

Однако это не значит, что вы вообще не можете этого сделать. Это требует осторожности. ** Вы можете безопасно изменять части DOM, которые у React нет причин обновлять.** Например, если какой-либо `<div>` всегда пуст в JSX, у React не будет причин трогать его дочерний список. Таким образом, безопасно вручную добавлять или удалять там элементы.

<Recap>

- Ссылки - это общее понятие, но чаще всего вы будете использовать их для хранения элементов DOM.
- Вы даете команду React поместить DOM-узел в `myRef.current`, передавая `<div ref={myRef}>`.
- Обычно вы будете использовать ссылки для неразрушающих действий, таких как фокусировка, прокрутка или измерение элементов DOM.
- Компонент по умолчанию не предоставляет доступ к своим DOM-узлам. Вы можете выбрать предоставление доступа к узлу DOM, используя `forwardRef` и передавая второй аргумент `ref` определенному узлу.
- Избегайте изменения узлов DOM, управляемых React.
- Если вы изменяете узлы DOM, управляемые React, изменяйте части, которые React не имеет причин обновлять.
- 
</Recap>



<Challenges>

#### Воспроизведение и пауза видео {/*play-and-pause-the-video*/}

В этом примере кнопка переключает переменную состояния для переключения между воспроизведением и приостановленным состоянием. Однако для того, чтобы действительно воспроизвести или приостановить видео, переключения состояния недостаточно. Вам также нужно вызвать [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play ) и [`пауза()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause ) в элементе DOM для `<видео>`. Добавьте к нему ссылку и заставьте кнопку работать.

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

Для дополнительной сложности синхронизируйте нажатие кнопки "Воспроизвести" с воспроизведением видео, даже если пользователь щелкает видео правой кнопкой мыши и воспроизводит его с помощью встроенных средств управления мультимедиа браузера. Возможно, для этого вы захотите прослушать `on Play` и `onPause` на видео.

<Solution>

Объявите ссылку и поместите ее в элемент `<video>`. Затем вызовите `ref.current.play()` и `ref.current.pause()` в обработчике событий в зависимости от следующего состояния.

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

Чтобы управлять встроенными элементами управления браузера, вы можете добавить обработчики `on Play` и `onPause` к элементу `<video>` и вызвать из них `setIsPlaying`. Таким образом, если пользователь воспроизводит видео с помощью элементов управления браузера, состояние будет соответствующим образом изменено.

</Solution>

#### Сфокусируйте поле поиска {/*focus-the-search-field*/}

Сделайте так, чтобы нажатие кнопки "Search" наводило фокус на поле.

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

Добавьте ссылку к входным данным и вызовите `focus()` на узле DOM, чтобы сфокусировать его:

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

В этой карусели изображений есть кнопка "Далее", которая переключает активное изображение. Сделайте так, чтобы галерея прокручивалась горизонтально до активного изображения при щелчке мыши. Вы захотите вызвать [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView ) на узле DOM активного изображения:
```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Для этого упражнения вам не нужно указывать ссылку на каждое изображение. Этого должно быть достаточно, чтобы иметь ссылку на текущее активное изображение или на сам список. Используйте "flash Sync", чтобы убедиться, что DOM обновляется *перед* прокруткой.

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
    imageUrl: 'https://placekitten.com/250/200?image=' + i
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

Вы можете объявить `selectedRef`, а затем передать его условно только текущему изображению:

```js
<li ref={index === i ? selectedRef : null}>
```

Когда `index === i`, что означает, что изображение является выбранным, `<li>` получит `выбранную ссылку`. React позаботится о том, чтобы "выбранный Ref.current" всегда указывал на правильный узел DOM.

Обратите внимание, что вызов `flush Sync` необходим, чтобы заставить React обновить DOM перед прокруткой. В противном случае `selected Ref.current` всегда указывал бы на ранее выбранный элемент.

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
    imageUrl: 'https://placekitten.com/250/200?image=' + i
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

</Solution>

#### Выделите поле поиска с помощью отдельных компонентов {/*focus-the-search-field-with-separate-components*/}

Сделайте так, чтобы нажатие кнопки "Search" наводило фокус на поле. Обратите внимание, что каждый компонент определен в отдельном файле и не должен быть перемещен из него. Как вы соединяете их вместе?

<Hint>

Вам понадобится "forwardRef", чтобы выбрать предоставление DOM-узла из вашего собственного компонента, такого как "Search Input".

</Hint>

<Sandpack>

```js App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Вам нужно будет добавить опцию "onClick" к `Search Button` и заставить `Search Button` передавать ее в браузер `<button>`. Вы также передадите ссылку на `<Search Input>`, который перенаправит ее на реальный `<ввод>` и заполнит его. Наконец, в обработчике щелчка вы вызовете "focus" на DOM-узле, хранящемся внутри, который отражает.

<Sandpack>

```js App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
