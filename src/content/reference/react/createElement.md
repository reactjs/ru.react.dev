---
title: createElement
---
<Intro>

`createElement` позволяет создавать React-элементы. Это альтернатива написанию [JSX.](/learn/writing-markup-with-jsx)

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Вызовите `createElement`, чтобы создать React-элемент с указанным `type`, `props` и `children`.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `type`: Аргумент `type` должен быть допустимым типом React-компонента. Например, это может быть строка с именем тега (например, `'div'` или `'span'`) или React-компонент (функция, класс или специальный компонент, такой как [`Fragment`](/reference/react/Fragment)).

* `props`: Аргумент `props` должен быть объектом или `null`. Если вы передадите `null`, это будет равносильно передаче пустого объекта. React создаст элемент со свойствами, соответствующими переданным вами `props`. Обратите внимание, что `ref` и `key` из вашего объекта `props` являются специальными и *не* будут доступны как `element.props.ref` и `element.props.key` в возвращаемом `element`. Они будут доступны как `element.ref` и `element.key`.

* **необязательный** `...children`: Ноль или более дочерних узлов. Это могут быть любые React-узлы, включая React-элементы, строки, числа, [порталы](/reference/react-dom/createPortal), пустые узлы (`null`, `undefined`, `true` и `false`) и массивы React-узлов.

#### Возвращает {/*returns*/}

`createElement` возвращает объект React-элемента с несколькими свойствами:

* `type`: Переданный вами `type`.
* `props`: Переданные вами `props`, за исключением `ref` и `key`.
* `ref`: Переданный вами `ref`. Если отсутствует, то `null`.
* `key`: Переданный вами `key`, приведенный к строке. Если отсутствует, то `null`.

Обычно вы возвращаете элемент из своего компонента или делаете его дочерним элементом другого элемента. Хотя вы можете читать свойства элемента, лучше всего рассматривать каждый элемент как непрозрачный после его создания и только рендерить его.

#### Ограничения {/*caveats*/}

* Вы должны **рассматривать React-элементы и их `props` как [неизменяемые](https://en.wikipedia.org/wiki/Immutable_object)** и никогда не изменять их содержимое после создания. В режиме разработки React будет [замораживать](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) возвращаемый элемент и его свойство `props` на верхнем уровне, чтобы обеспечить это.

* Когда вы используете JSX, **вы должны начинать тег с заглавной буквы, чтобы рендерить собственный пользовательский компонент.** Другими словами, `<Something />` эквивалентно `createElement(Something)`, а `<something />` (строчная буква) эквивалентно `createElement('something')` (обратите внимание, что это строка, поэтому она будет рассматриваться как встроенный HTML-тег).

* Вы должны **передавать дочерние элементы в качестве нескольких аргументов `createElement` только в том случае, если они все статически известны,** например `createElement('h1', {}, child1, child2, child3)`. Если ваши дочерние элементы динамические, передайте весь массив в качестве третьего аргумента: `createElement('ul', {}, listItems)`. Это гарантирует, что React [предупредит вас об отсутствующих `key`](/learn/rendering-lists#keeping-list-items-in-order-with-key) для любых динамических списков. Для статических списков это не требуется, поскольку они никогда не переупорядочиваются.

---

## Использование {/*usage*/}

### Создание элемента без JSX {/*creating-an-element-without-jsx*/}

Если вам не нравится [JSX](/learn/writing-markup-with-jsx) или вы не можете использовать его в своем проекте, вы можете использовать `createElement` в качестве альтернативы.

Чтобы создать элемент без JSX, вызовите `createElement` с некоторым <CodeStep step={1}>типом</CodeStep>, <CodeStep step={2}>props</CodeStep> и <CodeStep step={3}>дочерними элементами</CodeStep>:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>Дочерние элементы</CodeStep> необязательны, и вы можете передать столько, сколько вам нужно (в приведенном выше примере три дочерних элемента). Этот код отобразит заголовок `<h1>` с приветствием. Для сравнения, вот тот же пример, переписанный с использованием JSX:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

Чтобы рендерить собственный React-компонент, передайте функцию, такую как `Greeting`, в качестве <CodeStep step={1}>типа</CodeStep> вместо строки, такой как `'h1'`:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

С JSX это выглядело бы так:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

Вот полный пример, написанный с использованием `createElement`:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

А вот тот же пример, написанный с использованием JSX:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Оба стиля кодирования приемлемы, поэтому вы можете использовать тот, который предпочитаете для своего проекта. Основное преимущество использования JSX по сравнению с `createElement` заключается в том, что легко увидеть, какой закрывающий тег соответствует какому открывающему тегу.

<DeepDive>

#### Что такое React-элемент, собственно? {/*what-is-a-react-element-exactly*/}

Элемент — это легковесное описание части пользовательского интерфейса. Например, и `<Greeting name="Taylor" />`, и `createElement(Greeting, { name: 'Taylor' })` создают объект, подобный этому:

```js
// Немного упрощенно
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**Обратите внимание, что создание этого объекта не рендерит компонент `Greeting` и не создает никаких DOM-элементов.**

React-элемент больше похож на описание — инструкцию для React, чтобы позже отрисовать компонент `Greeting`. Возвращая этот объект из вашего компонента `App`, вы сообщаете React, что делать дальше.

Создание элементов чрезвычайно дешево, поэтому вам не нужно пытаться оптимизировать или избегать этого.

</DeepDive>