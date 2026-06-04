---
title: Children
---

<Pitfall>

Использование `Children` встречается редко и может привести к хрупкому коду. [См. распространенные альтернативы.](#alternatives)

</Pitfall>

<Intro>

`Children` позволяет вам манипулировать и трансформировать JSX, полученный как [`children` prop.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Вызовите `Children.count(children)`, чтобы посчитать количество дочерних элементов в структуре данных `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[См. больше примеров ниже.](#counting-children)

#### Параметры {/*children-count-parameters*/}

* `children`: Значение [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children), полученное вашим компонентом.

#### Возвращает {/*children-count-returns*/}

Количество узлов внутри этих `children`.

#### Ограничения {/*children-count-caveats*/}

- Пустые узлы (`null`, `undefined` и булевы значения), строки, числа и [React-элементы](/reference/react/createElement) считаются отдельными узлами. Массивы не считаются отдельными узлами, но их дочерние элементы считаются. **Обход не идет глубже React-элементов:** они не рендерятся, и их дочерние элементы не обходятся. [Фрагменты](/reference/react/Fragment) не обходятся.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Вызовите `Children.forEach(children, fn, thisArg?)`, чтобы выполнить некоторый код для каждого дочернего элемента в структуре данных `children`.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[См. больше примеров ниже.](#running-some-code-for-each-child)

#### Параметры {/*children-foreach-parameters*/}

* `children`: Значение [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children), полученное вашим компонентом.
* `fn`: Функция, которую вы хотите выполнить для каждого дочернего элемента, аналогично колбэку [метода `forEach` массива](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Она будет вызвана с дочерним элементом в качестве первого аргумента и его индексом в качестве второго. Индекс начинается с `0` и увеличивается при каждом вызове.
* **необязательный** `thisArg`: [`this` значение](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), с которым должна быть вызвана функция `fn`. Если опущено, значение равно `undefined`.

#### Возвращает {/*children-foreach-returns*/}

`Children.forEach` возвращает `undefined`.

#### Ограничения {/*children-foreach-caveats*/}

- Пустые узлы (`null`, `undefined` и булевы значения), строки, числа и [React-элементы](/reference/react/createElement) считаются отдельными узлами. Массивы не считаются отдельными узлами, но их дочерние элементы считаются. **Обход не идет глубже React-элементов:** они не рендерятся, и их дочерние элементы не обходятся. [Фрагменты](/reference/react/Fragment) не обходятся.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Вызовите `Children.map(children, fn, thisArg?)`, чтобы отобразить или трансформировать каждый дочерний элемент в структуре данных `children`.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[См. больше примеров ниже.](#transforming-children)

#### Параметры {/*children-map-parameters*/}

* `children`: Значение [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children), полученное вашим компонентом.
* `fn`: Функция отображения, аналогичная колбэку [метода `map` массива](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Она будет вызвана с дочерним элементом в качестве первого аргумента и его индексом в качестве второго. Индекс начинается с `0` и увеличивается при каждом вызове. Вы должны вернуть React-узел из этой функции. Это может быть пустой узел (`null`, `undefined` или булево значение), строка, число, React-элемент или массив других React-узлов.
* **необязательный** `thisArg`: [`this` значение](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this), с которым должна быть вызвана функция `fn`. Если опущено, значение равно `undefined`.

#### Возвращает {/*children-map-returns*/}

Если `children` равно `null` или `undefined`, возвращает то же значение.

В противном случае возвращает плоский массив, состоящий из узлов, которые вы вернули из функции `fn`. Возвращаемый массив будет содержать все возвращенные вами узлы, кроме `null` и `undefined`.

#### Ограничения {/*children-map-caveats*/}

- Пустые узлы (`null`, `undefined` и булевы значения), строки, числа и [React-элементы](/reference/react/createElement) считаются отдельными узлами. Массивы не считаются отдельными узлами, но их дочерние элементы считаются. **Обход не идет глубже React-элементов:** они не рендерятся, и их дочерние элементы не обходятся. [Фрагменты](/reference/react/Fragment) не обходятся.

- Если вы возвращаете элемент или массив элементов с ключами из `fn`, **ключи возвращаемых элементов будут автоматически объединены с ключом соответствующего исходного элемента из `children`.** Когда вы возвращаете несколько элементов из `fn` в массиве, их ключи должны быть уникальны только локально среди них самих.

---

### `Children.only(children)` {/*children-only*/}


Вызовите `Children.only(children)`, чтобы убедиться, что `children` представляет собой один React-элемент.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Параметры {/*children-only-parameters*/}

* `children`: Значение [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children), полученное вашим компонентом.

#### Возвращает {/*children-only-returns*/}

Если `children` [является допустимым элементом](/reference/react/isValidElement), возвращает этот элемент.

В противном случае выбрасывает ошибку.

#### Ограничения {/*children-only-caveats*/}

- Этот метод всегда **выбрасывает ошибку, если вы передаете массив (например, результат `Children.map`) в качестве `children`.** Другими словами, он гарантирует, что `children` является одним React-элементом, а не массивом с одним элементом.

---

### `Children.toArray(children)` {/*children-toarray*/}

Вызовите `Children.toArray(children)`, чтобы преобразовать структуру данных `children` в обычный JavaScript-массив. Это позволит вам манипулировать массивом с помощью встроенных методов массива, таких как [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) или [`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

</Sandpack>

#### Параметры {/*children-toarray-parameters*/}

* `children`: Значение [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children), полученное вашим компонентом.

#### Возвращает {/*children-toarray-returns*/}

Возвращает плоский массив элементов в `children`.

#### Ограничения {/*children-toarray-caveats*/}

- Пустые узлы (`null`, `undefined` и булевы значения) будут опущены в возвращаемом массиве. **Ключи возвращаемых элементов будут вычислены из ключей исходных элементов, их уровня вложенности и позиции.** Это гарантирует, что приведение массива к плоскому виду не приведет к изменению поведения.

---

## Использование {/*usage*/}

### Трансформация дочерних элементов {/*transforming-children*/}

Чтобы трансформировать JSX-дочерние элементы, которые ваш компонент [получает как `children` prop,](/learn/passing-props-to-a-component#passing-jsx-as-children) вызовите `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

В приведенном выше примере `RowList` оборачивает каждый полученный дочерний элемент в контейнер `<div className="Row">`. Например, предположим, что родительский компонент передает три тега `<p>` как `children` prop в `RowList`:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

Затем, с реализацией `RowList` выше, окончательный отрендеренный результат будет выглядеть так:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map` похож на [трансформацию массивов с помощью `map()`.](/learn/rendering-lists) Разница в том, что структура данных `children` считается *непрозрачной*. Это означает, что даже если она иногда является массивом, вы не должны предполагать, что это массив или какой-либо другой конкретный тип данных. Поэтому вы должны использовать `Children.map`, если вам нужно ее трансформировать.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

<DeepDive>

#### Почему `children` prop не всегда является массивом? {/*why-is-the-children-prop-not-always-an-array*/}

В React `children` prop считается *непрозрачной* структурой данных. Это означает, что вы не должны полагаться на ее структуру. Для трансформации, фильтрации или подсчета дочерних элементов следует использовать методы `Children`.

На практике структура данных `children` часто представляется внутри как массив. Однако, если существует только один дочерний элемент, React не будет создавать дополнительный массив, так как это приведет к ненужным накладным расходам памяти. Пока вы используете методы `Children` вместо прямого анализа `children` prop, ваш код не сломается, даже если React изменит способ реализации структуры данных.

Даже когда `children` является массивом, `Children.map` имеет полезное специальное поведение. Например, `Children.map` объединяет [ключи](/learn/rendering-lists#keeping-list-items-in-order-with-key) в возвращаемых элементах с ключами в `children`, которые вы ему передали. Это гарантирует, что исходные JSX-дочерние элементы не "потеряют" ключи, даже если они будут обернуты, как в приведенном выше примере.

</DeepDive>

<Pitfall>

Структура данных `children` **не включает отрендеренный вывод** компонентов, которые вы передаете как JSX. В приведенном ниже примере `children`, полученные `RowList`, содержат только два элемента вместо трех:

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

Вот почему в этом примере генерируются только два обертки строки:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

**Нет способа получить отрендеренный вывод внутреннего компонента**, такого как `<MoreRows />`, при манипулировании `children`. Вот почему [обычно лучше использовать одно из альтернативных решений.](#alternatives)

</Pitfall>

---

### Выполнение некоторого кода для каждого дочернего элемента {/*running-some-code-for-each-child*/}

Вызовите `Children.forEach`, чтобы перебрать каждый дочерний элемент в структуре данных `children`. Он не возвращает никакого значения и похож на [метод `forEach` массива.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Вы можете использовать его для выполнения пользовательской логики, такой как создание собственного массива.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

Как упоминалось ранее, нет способа получить отрендеренный вывод внутреннего компонента при манипулировании `children`. Вот почему [обычно лучше использовать одно из альтернативных решений.](#alternatives)

</Pitfall>

---

### Подсчет дочерних элементов {/*counting-children*/}

Вызовите `Children.count(children)`, чтобы рассчитать количество дочерних элементов.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Как упоминалось ранее, нет способа получить отрендеренный вывод внутреннего компонента при манипулировании `children`. Вот почему [обычно лучше использовать одно из альтернативных решений.](#alternatives)

</Pitfall>

---

### Преобразование дочерних элементов в массив {/*converting-children-to-an-array*/}

Вызовите `Children.toArray(children)`, чтобы преобразовать структуру данных `children` в обычный JavaScript-массив. Это позволит вам манипулировать массивом с помощью встроенных методов массива, таких как [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) или [`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

</Sandpack>

<Pitfall>

Как упоминалось ранее, нет способа получить отрендеренный вывод внутреннего компонента при манипулировании `children`. Вот почему [обычно лучше использовать одно из альтернативных решений.](#alternatives)

</Pitfall>

---

## Альтернативы {/*alternatives*/}

<Note>

В этом разделе описываются альтернативы API `Children` (с большой буквы `C`), который импортируется следующим образом:

```js
import { Children } from 'react';
```

Не путайте его с [использованием пропса `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) (с маленькой буквы `c`), которое является правильным и поощряется.

</Note>

### Предоставление нескольких компонентов {/*exposing-multiple-components*/}

Манипулирование дочерними элементами с помощью методов `Children` часто приводит к хрупкому коду. Когда вы передаете дочерние элементы компоненту в JSX, вы обычно не ожидаете, что компонент будет манипулировать или преобразовывать отдельные дочерние элементы.

Когда это возможно, старайтесь избегать использования методов `Children`. Например, если вы хотите, чтобы каждый дочерний элемент `RowList` был обернут в `<div className="Row">`, экспортируйте компонент `Row` и вручную оборачивайте каждую строку в него следующим образом:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Это первый элемент.</p>
      </Row>
      <Row>
        <p>Это второй элемент.</p>
      </Row>
      <Row>
        <p>Это третий элемент.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

В отличие от использования `Children.map`, этот подход не оборачивает каждый дочерний элемент автоматически. **Однако этот подход имеет существенное преимущество по сравнению с [предыдущим примером с `Children.map`](#transforming-children), поскольку он работает, даже если вы продолжите извлекать больше компонентов.** Например, он по-прежнему работает, если вы извлечете собственный компонент `MoreRows`:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Это первый элемент.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>Это второй элемент.</p>
      </Row>
      <Row>
        <p>Это третий элемент.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

Это не сработало бы с `Children.map`, потому что он "видел" бы `<MoreRows />` как один дочерний элемент (и одну строку).

---

### Принятие массива объектов в качестве пропса {/*accepting-an-array-of-objects-as-a-prop*/}

Вы также можете явно передать массив в качестве пропса. Например, этот `RowList` принимает массив `rows` в качестве пропса:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>Это первый элемент.</p> },
      { id: 'second', content: <p>Это второй элемент.</p> },
      { id: 'third', content: <p>Это третий элемент.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
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
```

</Sandpack>

Поскольку `rows` является обычным массивом JavaScript, компонент `RowList` может использовать встроенные методы массива, такие как [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), для работы с ним.

Этот шаблон особенно полезен, когда вы хотите иметь возможность передавать больше информации в виде структурированных данных вместе с дочерними элементами. В приведенном ниже примере компонент `TabSwitcher` получает массив объектов в качестве пропса `tabs`:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'Первый',
        content: <p>Это первый элемент.</p>
      },
      {
        id: 'second',
        header: 'Второй',
        content: <p>Это второй элемент.</p>
      },
      {
        id: 'third',
        header: 'Третий',
        content: <p>Это третий элемент.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

В отличие от передачи дочерних элементов в виде JSX, этот подход позволяет ассоциировать дополнительную информацию, такую как `header`, с каждым элементом. Поскольку вы работаете непосредственно с `tabs`, и это массив, вам не нужны методы `Children`.

---

### Вызов рендер-пропса для настройки рендеринга {/*calling-a-render-prop-to-customize-rendering*/}

Вместо того чтобы генерировать JSX для каждого отдельного элемента, вы также можете передать функцию, которая возвращает JSX, и вызывать эту функцию при необходимости. В этом примере компонент `App` передает функцию `renderContent` компоненту `TabSwitcher`. Компонент `TabSwitcher` вызывает `renderContent` только для выбранной вкладки:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>Это {tabId} элемент.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

Пропс, такой как `renderContent`, называется *рендер-пропсом*, потому что это пропс, который определяет, как отображать часть пользовательского интерфейса. Однако в нем нет ничего особенного: это обычный пропс, который является функцией.

Рендер-пропсы — это функции, поэтому вы можете передавать им информацию. Например, этот компонент `RowList` передает `id` и `index` каждой строки в рендер-пропс `renderRow`, который использует `index` для выделения четных строк:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>Это {id} элемент.</p>
          </Row>
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Всего строк: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Это еще один пример того, как родительские и дочерние компоненты могут взаимодействовать без манипулирования дочерними элементами.

---

## Устранение неполадок {/*troubleshooting*/}

### Я передаю пользовательский компонент, но методы `Children` не показывают результат его рендеринга {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Предположим, вы передаете два дочерних элемента в `RowList` следующим образом:

```js
<RowList>
  <p>Первый элемент</p>
  <MoreRows />
</RowList>
```

Если вы выполните `Children.count(children)` внутри `RowList`, вы получите `2`. Даже если `MoreRows` отображает 10 различных элементов или возвращает `null`, `Children.count(children)` все равно будет равен `2`. С точки зрения `RowList`, он "видит" только полученный JSX. Он не "видит" внутреннее устройство компонента `MoreRows`.

Это ограничение затрудняет извлечение компонента. Вот почему [альтернативы](#alternatives) предпочтительнее использования `Children`.