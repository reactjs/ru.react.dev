---
title: Философия React
---

<Intro>

С React вы начнёте по-другому смотреть на дизайны макетов и мыслить во время разработки приложений. Когда вы создаёте интерфейс на React, первым делом вы разбиваете его на части -- *компоненты*. Потом вы описываете для них всевозможные визуальные состояния. Наконец, вы соединяете ваши компоненты между собой так, чтобы данные перемещались по ним. В этом руководстве мы разберём пример создания таблицы продуктов с поиском на React.

</Intro>

## Начнём с макета {/*start-with-the-mockup*/}

Представьте, что у вас уже есть JSON API и макет от дизайнера.

JSON API возвращает данные, которые выглядят так:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

Макет выглядит так:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Когда вы создаёте UI на React, обычно надо сделать одни и те же пять шагов.

## Шаг 1: Разбейте интерфейс на составляющие {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Для начала выделите все компоненты и подкомпоненты на макете и дайте им имена. Если вы работаете с дизайнерами, то вполне возможно, что они уже как-то называют эти компоненты. Узнайте у них как! 

Вы можете подходить к разбиению дизайна на компоненты по-разному, основываясь на вашем опыте:

<<<<<<< HEAD
* **Программирование** -- используйте тот же подход, как при решении создать простую функцию или целый объект. Можно применить [принцип единственной ответственности:](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF_%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9_%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8) каждый компонент должен заниматься какой-то одной задачей. Если функциональность компонента увеличивается с течением времени, его следует разбить на более мелкие подкомпоненты.
* **CSS** -- подумайте, для чего бы вы сделали селекторы класса. (Помните, что компоненты не настолько узкие.)
* **Дизайн** -- подумайте, как бы вы организовали слои дизайна.
=======
* **Programming**--use the same techniques for deciding if you should create a new function or object. One such technique is the [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns), that is, a component should ideally only be concerned with one thing. If it ends up growing, it should be decomposed into smaller subcomponents. 
* **CSS**--consider what you would make class selectors for. (However, components are a bit less granular.)
* **Design**--consider how you would organize the design's layers.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

Хорошая структура у JSON часто уже отражает структуру компонентов на вашем UI. Это происходит из-за того, что у UI и модели данных часто похожая информационная архитектура. Разбейте UI на компоненты, каждый из которых отображает часть модели данных.

Здесь можно выделить пять компонентов:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (серый) содержит в себе приложение целиком.
2. `SearchBar` (синий) получает пользовательский ввод.
3. `ProductTable` (фиолетовый) отображает и фильтрует список в соответствии с пользовательским вводом.
4. `ProductCategoryRow` (зелёный) отображает заголовки категорий.
5. `ProductRow`	(жёлтый) отображает отдельно взятые товары.

</CodeDiagram>

</FullWidth>

Обратите внимание, что внутри `ProductTable` (фиолетовый) заголовок таблицы ("Name" и "Price") сам по себе не является отдельным компонентом. Отделять его или нет -- вопрос личного предпочтения. В данном примере он является частью `ProductTable`, потому что находится внутри списка `ProductTable`. Тем не менее, если в будущем заголовок пополнится новыми функциями (например, возможностью сортировать товар), вы можете извлечь его в самостоятельный компонент  `ProductTableHeader`.

Теперь, когда вы определили компоненты на макете, расположите их согласно иерархии. Компоненты, которые являются частью других компонентов, в иерархии будут дочерними:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Шаг 2: Создайте статическое приложение на React {/*step-2-build-a-static-version-in-react*/}

Теперь, когда все компоненты расположены в иерархическом порядке, пришло время воплотить в жизнь ваше приложение. Самый лёгкий способ -- создать версию, которая рендерит UI, основанный на вашей модели данных, но не предполагает никакой интерактивности... пока что! Обычно проще всего сначала создать статическое приложение и только потом добавить интерактивность. Написание статического приложения требует много печатать и совсем немного думать. С другой стороны, создание интерактивного приложения подразумевает более глубокий мыслительный процесс и лишь долю рутинной печати.

Чтобы написать статическое приложение, отображающее модель данных, нам нужно создать [компоненты,](/learn/your-first-component) которые используют другие компоненты и передают данные через [пропсы.](/learn/passing-props-to-a-component) С помощью пропсов данные передаются от родителя к потомку. (Если вы знакомы с понятием [состояния,](/learn/state-a-components-memory) то для статического приложения это как раз то, чего вам использовать не нужно. Состояние подразумевает собой данные, которые меняются со временем, интерактивность. Так как мы работаем над статическим приложением, нам этого не нужно.)

Написание кода можно начать как сверху вниз с компонентов, которые находятся выше по иерархии (таких как `FilterableProductTable`), так и снизу вверх с низкоуровневых компонентов (таких как `ProductRow`). Более простые приложения удобнее начать с компонентов, находящихся выше по иерархии. В более сложных приложениях удобнее в первую очередь создавать и тестировать подкомпоненты.

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Наименование</th>
          <th>Цена</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Показывать только товар в наличии
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Фрукты", price: "$1", stocked: true, name: "Яблоко"},
  {category: "Фрукты", price: "$1", stocked: true, name: "Питахайя"},
  {category: "Фрукты", price: "$2", stocked: false, name: "Маракуйя"},
  {category: "Овощи", price: "$2", stocked: true, name: "Шпинат"},
  {category: "Овощи", price: "$4", stocked: false, name: "Тыква"},
  {category: "Овощи", price: "$1", stocked: true, name: "Горох"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Если этот код показался вам сложным, то прочтите раздел [Начало работы!](/learn/))

Когда закончите создавать компоненты, у вас на руках появится библиотека повторно используемых компонентов, отображающих вашу модель данных. Так как это статическое приложение, компоненты будут лишь возвращать JSX. Компонент выше по иерархии (`FilterableProductTable`) будет передавать модель данных через пропсы. Это называется _односторонний поток данных,_ потому что данные передаются по компонентам, начиная с высокоуровневых и заканчивая теми, что ниже по иерархии.

<Pitfall>

Сейчас вы не должны использовать никаких значений состояния. Вы сделаете их в следующем шаге!

</Pitfall>

## Шаг 3: Определите минимальное, но полноценное отображение состояния интерфейса {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Чтобы сделать UI интерактивным, нужно сделать так, чтобы пользователи могли изменять вашу модель данных. Для этого вы и используете *состояние*.

Под состоянием подразумевается минимальный набор изменяемых данных, который необходимо запомнить вашему приложению. Главное в его разработке -- следовать принципу [DRY: Don't Repeat Yourself (рус. не повторяйся).](https://ru.wikipedia.org/wiki/Don%27t_repeat_yourself) Определите минимально необходимое состояние, которое нужно вашему приложению. Всё остальное вычисляйте по необходимости. Например, если вы создаёте список покупок, можете создать состояние и поместить в него массив предметов из списка. Если надо отобразить количество предметов, не стоит создавать ещё одно состояние для их числа. Вместо этого используйте длину существующего массива.

Обдумайте все данные в демо-приложении:

1. Первоначальный список товаров
2. Поисковый запрос, введённый пользователем
3. Значение чекбокса
4. Отфильтрованный список товаров

Какие из этих данных должны храниться в состоянии? Определите те, которые не должны:

* Остаются ли они **неизменными** со временем? Если так, то эти данные не должны храниться в состоянии.
* **Передаются ли они от родителя** через пропсы? Если так, то эти данные не должны храниться в состоянии.
* **Можете ли вы вычислить их** на основании существующих состояний или пропсов в своём компоненте? Если так, то эти данные *точно* не должны храниться в состоянии!

Оставшиеся данные, скорее всего, должны храниться в состоянии.

Пройдёмся по каждому из них ещё раз:

1. Исходный список товаров **передаётся через пропсы, так что не нужно хранить его в состоянии.** 
2. Поисковый запрос изменяется со временем, и его нельзя вычислить из других данных, так что он вполне сойдёт за состояние.
3. Значение чекбокса изменяется со временем, и его нельзя вычислить из других данных, так что его стоит хранить в состоянии.
4. Отфильтрованный список товаров **не является состоянием, так как его можно вычислить,** отфильтровав оригинальный список с помощью поискового запроса и значения чекбокса.

Получается, что только поисковой запрос и значение чекбокса являются состояниями! Отличная работа!

<DeepDive>

#### Разница между пропсами и состоянием {/*props-vs-state*/}

В React существует два типа "модели" данных: пропсы и состояние. Они сильно отличаются друг от друга:

* [**Пропсы** похожи на аргументы, которые вы передаёте](/learn/passing-props-to-a-component) функции. Они позволяют родительскому компоненту передавать данные дочернему компоненту и изменять его вид. Например, `Form` может передавать проп `color` компоненту `Button`.
* [**Состояние** можно назвать памятью компонента.](/learn/state-a-components-memory) Оно позволяет компоненту хранить информацию и изменять её во время работы. Например, `Button` может иметь состояние `isHovered`.

Пропсы и состояние отличаются, но работают вместе. Родительский компонент будет часто хранить у себя информацию в состоянии (чтобы он мог её изменить) и *передавать* её дочерним компонентам как пропсы. Если вам всё ещё не до конца понятны различия -- ничего страшного. После небольшой практики разница станет более очевидной!

</DeepDive>

## Шаг 4: Определите, где должно находиться ваше состояние {/*step-4-identify-where-your-state-should-live*/}

После определения минимального набора состояний приложения вам нужно выяснить, какой из компонентов отвечает за изменение состояния или *владеет* им. Помните: React использует односторонний поток данных, передавая данные от родительских компонентов к их потомкам. Сначала может быть не совсем ясно, какой из компонентов какое состояние должен хранить. Если эта концепция для вас новая, то, возможно, для вас это будет тяжело. Однако вы можете разобраться, следуя этим инструкциям!

Для каждой части состояния в вашем приложении:

1. Определите *все* компоненты, которые рендерят что-то, исходя из этого состояния.
2. Найдите их ближайший общий родительский компонент -- это компонент, расположенный над всеми компонентами в иерархии.
3. Определите, где должно находиться состояние:
    1. Часто вы можете поместить состояние прямо в общего предка.
    2. Так же вы можете поместить состояние в любой из компонентов над их общим предком.
    3. Если вам не удаётся найти подходящий компонент, то создайте новый исключительно для хранения состояния и разместите его выше в иерархии над общим родительским компонентом.

В предыдущем шаге вы нашли два состояния в демо-приложении: поисковой запрос и значение чекбокса. В этом примере они всегда находятся вместе, поэтому логично поместить их в один компонент.

Давайте разберём их с помощью нашей стратегии:

1. **Определите компоненты, которые используют состояния:**
    * `ProductTable` фильтрует список товаров, основываясь на состояниях (поисковой запрос и значение чекбокса). 
    * `SearchBar` отображает состояния (поисковой запрос и значение чекбокса).
2. **Найдите их общего предка:** Первый общий родительский компонент для них -- `FilterableProductTable`.
3. **Определите, где будет находиться состояние**: Мы будем хранить текст фильтра и значение чекбокса в `FilterableProductTable`.

Итак, значения состояний будут находиться в `FilterableProductTable`. 

Добавьте состояние в компонент при помощи [хука `useState()`.](/reference/react/useState) Хуки -- это особые функции, с помощью которых вы можете "подцепиться" к React. Добавьте две переменные состояния в начало `FilterableProductTable` и укажите их начальное значение:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

После этого передайте `filterText` и `inStockOnly` в компоненты `ProductTable` и `SearchBar` как пропсы:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Теперь вы начинаете видеть, как будет работать ваше приложение. Измените начальное значение `filterText` на `useState('fruit')` вместо `useState('')` в редакторе кода ниже. Вы увидите, что изменились и поисковой запрос, и таблица:

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Наименование</th>
          <th>Цена</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Показывать только товар в наличии
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Фрукты", price: "$1", stocked: true, name: "Яблоко"},
  {category: "Фрукты", price: "$1", stocked: true, name: "Питахайя"},
  {category: "Фрукты", price: "$2", stocked: false, name: "Маракуйя"},
  {category: "Овощи", price: "$2", stocked: true, name: "Шпинат"},
  {category: "Овощи", price: "$4", stocked: false, name: "Тыква"},
  {category: "Овощи", price: "$1", stocked: true, name: "Горох"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Обратите внимание, что изменение поискового запроса пока ничего не делает. Ошибка в консоли редактора выше объясняет, почему:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

В редакторе кода сверху `ProductTable` и `SearchBar` считывают `filterText` и `inStockOnly`, чтобы отрендерить таблицу, поле ввода и чекбокс. Например, вот так `SearchBar` заполняет значение поля ввода:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

Однако вы пока не добавили никакого кода, который бы реагировал на действия пользователя. Это вы сделаете в последнем шаге.


## Шаг 5: Добавьте обратный поток данных {/*step-5-add-inverse-data-flow*/}

Сейчас ваше приложение рендерится, основываясь  на пропсах и состоянии, передающихся вниз по иерархии. Однако для того, чтобы состояние менялось от пользовательского ввода, вам надо обеспечить поток данных в обратную сторону: компоненты формы в самом низу иерархии должны обновлять состояние в `FilterableProductTable`. 

Поток данных в React однонаправленный. Из-за этого требуется немного больше кода, чем с двусторонней привязкой данных. Если вы попытаетесь ввести текст в поле поиска или установить флажок в чекбоксе в примере выше, то увидите, что React игнорирует любой ввод. Так и должно быть. Когда вы написали `<input value={filterText} />`, вы приравняли значение пропа `value` в `input` к состоянию `filterText`, которое передаётся из `FilterableProductTable`. Так как состояние `filterText` не задано, поле ввода никогда не изменится.

Вам нужно, чтобы при изменениях поисковой формы менялось состояние ввода. Состояние находится в  `FilterableProductTable`, поэтому только он может вызвать `setFilterText` и `setInStockOnly`. Чтобы `SearchBar` мог обновлять состояние в `FilterableProductTable`, вам надо передать эти функции в `SearchBar`:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Внутри `SearchBar` добавьте обработчики событий `onChange` и с их помощью установите значения состояний в родителе:

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

Теперь приложение полностью работает!

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Наименование</th>
          <th>Цена</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Показывать только товар в наличии
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Фрукты", price: "$1", stocked: true, name: "Яблоко"},
  {category: "Фрукты", price: "$1", stocked: true, name: "Питахайя"},
  {category: "Фрукты", price: "$2", stocked: false, name: "Маракуйя"},
  {category: "Овощи", price: "$2", stocked: true, name: "Шпинат"},
  {category: "Овощи", price: "$4", stocked: false, name: "Тыква"},
  {category: "Овощи", price: "$1", stocked: true, name: "Горох"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Об обработке событий и обновлении состояния вы можете прочитать в разделе [Добавление интерактивности.](/learn/adding-interactivity)

## Что дальше {/*where-to-go-from-here*/}

Это было очень краткое введение в подход к написанию компонентов и приложений на React. Теперь вы можете [начать проект на React](/learn/installation) или [углубиться в синтаксис,](/learn/describing-the-ui) использованный в этом руководстве.
