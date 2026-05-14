---
title: cloneElement
---
```
<Pitfall>

Использование `cloneElement` — нечастая практика, которая может привести к хрупкому коду. [См. распространенные альтернативы.](#alternatives)

</Pitfall>

<Intro>

`cloneElement` позволяет создавать новый React-элемент, используя другой элемент в качестве отправной точки.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Ссылка {/*reference*/}

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

* `element`: Аргумент `element` должен быть допустимым React-элементом. Например, это может быть JSX-узел, такой как `<Something />`, результат вызова [`createElement`](/reference/react/createElement) или результат другого вызова `cloneElement`.

* `props`: Аргумент `props` должен быть либо объектом, либо `null`. Если вы передаете `null`, клонированный элемент сохранит все исходные `element.props`. В противном случае, для каждого пропса в объекте `props` возвращаемый элемент будет «предпочитать» значение из `props` значению из `element.props`. Остальные пропсы будут заполнены из исходных `element.props`. Если вы передаете `props.key` или `props.ref`, они заменят исходные.

* **необязательный** `...children`: Ноль или более дочерних узлов. Они могут быть любыми React-узлами, включая React-элементы, строки, числа, [порталы](/reference/react-dom/createPortal), пустые узлы (`null`, `undefined`, `true` и `false`) и массивы React-узлов. Если вы не передаете никаких аргументов `...children`, исходный `element.props.children` будет сохранен.

#### Возвращает {/*returns*/}

`cloneElement` возвращает объект React-элемента с несколькими свойствами:

* `type`: То же, что и `element.type`.
* `props`: Результат поверхностного слияния `element.props` с переопределяющими `props`, которые вы передали.
* `ref`: Исходный `element.ref`, если он не был переопределен `props.ref`.
* `key`: Исходный `element.key`, если он не был переопределен `props.key`.

Обычно вы возвращаете элемент из своего компонента или делаете его дочерним элементом другого элемента. Хотя вы можете читать свойства элемента, лучше всего относиться к каждому элементу как к непрозрачному после его создания и только рендерить его.

#### Предостережения {/*caveats*/}

* Клонирование элемента **не изменяет исходный элемент.**

* Вам следует **передавать дочерние элементы в качестве нескольких аргументов в `cloneElement`, только если они все статически известны,** например `cloneElement(element, null, child1, child2, child3)`. Если ваши дочерние элементы динамические, передайте весь массив в качестве третьего аргумента: `cloneElement(element, null, listItems)`. Это гарантирует, что React [предупредит вас об отсутствующих `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) для любых динамических списков. Для статических списков это не требуется, потому что они никогда не переупорядочиваются.

* `cloneElement` усложняет отслеживание потока данных, поэтому **попробуйте [альтернативы](#alternatives) вместо этого.**

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

Представьте себе компонент `List`, который отображает свои [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) в виде списка выбираемых строк с кнопкой «Далее», которая изменяет, какая строка выбрана. Компоненту `List` необходимо отображать выбранный `Row` по-другому, поэтому он клонирует каждый дочерний элемент `<Row>`, который он получил, и добавляет дополнительный пропс `isHighlighted: true` или `isHighlighted: false`:

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

Предположим, что исходный JSX, полученный `List`, выглядит так:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

Клонируя свои дочерние элементы, `List` может передавать дополнительную информацию каждому `Row` внутри. Результат выглядит так:

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

Обратите внимание, как нажатие «Далее» обновляет состояние `List` и выделяет другую строку:

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

Подводя итог, `List` клонировал элементы `<Row />`, которые он получил, и добавил к ним дополнительный пропс.

<Pitfall>

Клонирование дочерних элементов затрудняет определение того, как данные проходят через ваше приложение. Попробуйте одну из [альтернатив.](#alternatives)

</Pitfall>

---

## Альтернативы {/*alternatives*/}

### Передача данных с помощью render prop {/*passing-data-with-a-render-prop*/}

Вместо использования `cloneElement` рассмотрите возможность принятия *render prop*, например `renderItem`. Здесь `List` получает `renderItem` в качестве пропса. `List` вызывает `renderItem` для каждого элемента и передает `isHighlighted` в качестве аргумента:

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

Пропс `renderItem` называется «render prop», потому что это пропс, который определяет, как что-то отображать. Например, вы можете передать реализацию `renderItem`, которая отображает `<Row>` с заданным значением `isHighlighted`:

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

Конечный результат такой же, как и с `cloneElement`:

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

Этот шаблон предпочтительнее `cloneElement`, потому что он более явный.

---

### Передача данных через контекст {/*passing-data-through-context*/}

Другой альтернативой `cloneElement` является [передача данных через контекст.](/learn/passing-data-deeply-with-context)

Например, вы можете вызвать [`createContext`](/reference/react/createContext), чтобы определить `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

Ваш компонент `List` может обернуть каждый отображаемый им элемент в провайдер `HighlightContext`:

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

При таком подходе `Row` вообще не нужно получать пропс `isHighlighted`. Вместо этого он считывает контекст:

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

### Извлечение логики в пользовательский хук {/*extracting-logic-into-a-custom-hook*/}

Другой подход, который вы можете попробовать, — это извлечь «невизуальную» логику в свой собственный хук и использовать информацию, возвращаемую вашим хуком, чтобы решить, что отображать. Например, вы можете написать пользовательский хук `useList` следующим образом:

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

Тогда вы можете использовать его так:

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

Этот подход особенно полезен, если вы хотите повторно использовать эту логику между разными компонентами.
```