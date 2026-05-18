---
title: cloneElement
---
<Pitfall>

Использование `cloneElement` встречается редко и может привести к хрупкому коду. [См. альтернативы.](#alternatives)

</Pitfall>

<Intro>

`cloneElement` позволяет создать новый React-элемент, используя другой элемент в качестве отправной точки.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

Вызовите `cloneElement`, чтобы создать React-элемент на основе `element`, но с другими `props` и `children`:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `element`: Аргумент `element` должен быть валидным React-элементом. Например, это может быть JSX-узел вроде `<Something />`, результат вызова [`createElement`](/reference/react/createElement) или результат другого вызова `cloneElement`.

* `props`: Аргумент `props` должен быть объектом или `null`. Если вы передадите `null`, клонированный элемент сохранит все оригинальные `element.props`. В противном случае, для каждого свойства в объекте `props`, возвращаемый элемент будет «предпочитать» значение из `props` значению из `element.props`. Остальные свойства будут взяты из оригинального `element.props`. Если вы передадите `props.key` или `props.ref`, они заменят оригинальные.

* **необязательный** `...children`: Ноль или более дочерних узлов. Это могут быть любые React-узлы, включая React-элементы, строки, числа, [порталы](/reference/react-dom/createPortal), пустые узлы (`null`, `undefined`, `true` и `false`) и массивы React-узлов. Если вы не передадите никаких аргументов `...children`, будут сохранены оригинальные `element.props.children`.

#### Возвращаемое значение {/*returns*/}

`cloneElement` возвращает объект React-элемента с несколькими свойствами:

* `type`: То же, что и `element.type`.
* `props`: Результат поверхностного слияния `element.props` с переданными вами переопределяющими `props`.
* `ref`: Оригинальный `element.ref`, если он не был переопределен `props.ref`.
* `key`: Оригинальный `element.key`, если он не был переопределен `props.key`.

Обычно вы возвращаете элемент из своего компонента или делаете его дочерним элементом другого элемента. Хотя вы можете читать свойства элемента, лучше всего рассматривать каждый элемент как непрозрачный после его создания и только рендерить его.

#### Ограничения {/*caveats*/}

* Клонирование элемента **не изменяет оригинальный элемент.**

* Вы должны **передавать дочерние элементы в качестве нескольких аргументов `cloneElement` только в том случае, если они все статически известны,** например `cloneElement(element, null, child1, child2, child3)`. Если ваши дочерние элементы динамические, передайте весь массив в качестве третьего аргумента: `cloneElement(element, null, listItems)`. Это гарантирует, что React [предупредит вас об отсутствующих `key`](/learn/rendering-lists#keeping-list-items-in-order-with-key) для любых динамических списков. Для статических списков это не требуется, так как они никогда не меняют порядок.

* `cloneElement` затрудняет отслеживание потока данных, поэтому **попробуйте [альтернативы](#alternatives) вместо этого.**

---

## Использование {/*usage*/}

### Переопределение пропсов элемента {/*overriding-props-of-an-element*/}

Чтобы переопределить пропсы некоторого <CodeStep step={1}>React-элемента</CodeStep>, передайте его в `cloneElement` с <CodeStep step={2}>пропсами, которые вы хотите переопределить</CodeStep>:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Здесь результирующий <CodeStep step={3}>клонированный элемент</CodeStep> будет `<Row title="Cabbage" isHighlighted={true} />`.

**Давайте рассмотрим пример, чтобы увидеть, когда это полезно.**

Представьте компонент `List`, который рендерит свои [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) в виде списка выбираемых строк с кнопкой "Next", которая изменяет выбранную строку. Компоненту `List` нужно отображать выбранную `Row` по-другому, поэтому он клонирует каждый дочерний элемент `<Row>`, который он получил, и добавляет дополнительный пропс `isHighlighted: true` или `isHighlighted: false`:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

Допустим, оригинальный JSX, полученный `List`, выглядит так:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

Клонируя свои дочерние элементы, `List` может передавать дополнительную информацию каждой `Row` внутри. Результат выглядит так:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Обратите внимание, как нажатие "Next" обновляет состояние `List` и выделяет другую строку:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Таким образом, `List` клонировал полученные элементы `<Row />` и добавил к ним дополнительный пропс.

<Pitfall>

Клонирование дочерних элементов затрудняет отслеживание потока данных в вашем приложении. Попробуйте [альтернативы.](#alternatives)

</Pitfall>

---

## Альтернативы {/*alternatives*/}

### Передача данных с помощью render prop {/*passing-data-with-a-render-prop*/}

Вместо использования `cloneElement` рассмотрите возможность принятия *render prop*, такого как `renderItem`. Здесь `List` принимает `renderItem` в качестве пропса. `List` вызывает `renderItem` для каждого элемента и передает `isHighlighted` в качестве аргумента:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

Render prop `renderItem` называется так потому, что это пропс, который определяет, как что-то рендерить. Например, вы можете передать реализацию `renderItem`, которая рендерит `<Row>` с заданным значением `isHighlighted`:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

Конечный результат тот же, что и с `cloneElement`:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Однако вы можете четко отследить, откуда берется значение `isHighlighted`.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Этот шаблон предпочтительнее `cloneElement`, так как он более явный.

---

### Передача данных через контекст {/*passing-data-through-context*/}

Другой альтернативой `cloneElement` является [передача данных через контекст.](/learn/passing-data-deeply-with-context)

Например, вы можете вызвать [`createContext`](/reference/react/createContext) для определения `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

Ваш компонент `List` может обернуть каждый элемент, который он рендерит, в провайдер `HighlightContext`:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

При таком подходе `Row` вообще не нужно получать пропс `isHighlighted`. Вместо этого он читает контекст:

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

Это позволяет вызывающему компоненту не знать и не беспокоиться о передаче `isHighlighted` в `<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

Вместо этого `List` и `Row` координируют логику выделения через контекст.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Узнайте больше о передаче данных через контекст.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### Выделение логики в пользовательский хук {/*extracting-logic-into-a-custom-hook*/}

Другой подход, который вы можете попробовать, — это выделить "невизуальную" логику в собственный хук и использовать информацию, возвращаемую вашим хуком, для принятия решения о том, что рендерить. Например, вы можете написать пользовательский хук `useList` следующим образом:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Затем вы можете использовать его так:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

Поток данных явный, но состояние находится внутри пользовательского хука `useList`, который вы можете использовать из любого компонента:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Этот подход особенно полезен, если вы хотите повторно использовать эту логику между различными компонентами.