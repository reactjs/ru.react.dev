---
title: Sharing State Between Components
---

<Intro>

Иногда вам нужно, чтобы состояние двух компонентов изменялось одновременно. Для этого удалите состояние из обоих компонентов, переместите его в их ближайший общий родительский компонент и затем передайте его им через пропсы. Это называется *подъём состояния вверх* (lifting state up) и является одной из самых частых операций при написании кода на React.

</Intro>

<YouWillLearn>

- Как разделять состояние между компонентами, поднимая его вверх
- Что такое управляемые и неуправляемые компоненты

</YouWillLearn>

## Подъём состояния вверх на примере {/*lifting-state-up-by-example*/}

В этом примере родительский компонент `Accordion` отображает два отдельных `Panel`:

* `Accordion`
  - `Panel`
  - `Panel`

Каждый компонент `Panel` имеет булево состояние `isActive`, которое определяет, виден ли его контент.

Нажмите кнопку "Show" для обеих панелей:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Обратите внимание, что нажатие на кнопку одной панели не влияет на другую — они независимы.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Диаграмма, показывающая дерево из трех компонентов: один родительский компонент Accordion и два дочерних компонента Panel. Оба компонента Panel содержат isActive со значением false.">

Изначально состояние `isActive` каждого `Panel` равно `false`, поэтому обе панели отображаются свёрнутыми.

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Та же диаграмма, что и предыдущая, с выделенным состоянием isActive первого дочернего компонента Panel, указывающим на клик, со значением isActive, установленным в true. Второй компонент Panel по-прежнему содержит значение false.">

При нажатии на кнопку любой `Panel` обновляется только состояние `isActive` этой `Panel`.

</Diagram>

</DiagramGroup>

**Но теперь давайте представим, что вы хотите изменить поведение так, чтобы в любой момент времени была развёрнута только одна панель.** При таком дизайне разворачивание второй панели должно сворачивать первую. Как это сделать?

Чтобы скоординировать эти две панели, вам нужно "поднять их состояние вверх" в родительский компонент в три шага:

1. **Удалите** состояние из дочерних компонентов.
2. **Передайте** жёстко закодированные данные от общего родителя.
3. **Добавьте** состояние в общий родительский компонент и передайте его вместе с обработчиками событий.

Это позволит компоненту `Accordion` координировать оба `Panel` и разворачивать только одну панель за раз.

### Шаг 1: Удалите состояние из дочерних компонентов {/*step-1-remove-state-from-the-child-components*/}

Вы передадите управление состоянием `isActive` компонента `Panel` его родительскому компоненту. Это означает, что родительский компонент будет передавать `isActive` в `Panel` как пропс. Начните с **удаления этой строки** из компонента `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

И вместо этого добавьте `isActive` в список пропсов `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Теперь родительский компонент `Panel` может *управлять* `isActive`, [передавая его как пропс.](/learn/passing-props-to-a-component) Напротив, компонент `Panel` теперь *не контролирует* значение `isActive` — это теперь задача родительского компонента!

### Шаг 2: Передайте жёстко закодированные данные от общего родителя {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Чтобы поднять состояние вверх, вы должны найти ближайший общий родительский компонент *обоих* дочерних компонентов, которые вы хотите координировать:

* `Accordion` *(ближайший общий родитель)*
  - `Panel`
  - `Panel`

В этом примере это компонент `Accordion`. Поскольку он находится над обеими панелями и может управлять их пропсами, он станет "источником истины" для того, какая панель в данный момент активна. Заставьте компонент `Accordion` передавать жёстко закодированное значение `isActive` (например, `true`) обеим панелям:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Попробуйте отредактировать жёстко закодированные значения `isActive` в компоненте `Accordion` и посмотрите на результат на экране.

### Шаг 3: Добавьте состояние в общий родительский компонент {/*step-3-add-state-to-the-common-parent*/}

Подъём состояния вверх часто меняет природу того, что вы храните в состоянии.

В данном случае одновременно должна быть активна только одна панель. Это означает, что общий родительский компонент `Accordion` должен отслеживать, *какая* панель является активной. Вместо булева значения он может использовать число в качестве индекса активной `Panel` для переменной состояния:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Когда `activeIndex` равен `0`, активна первая панель, а когда он равен `1`, активна вторая.

Нажатие кнопки "Show" в любой `Panel` должно изменять активный индекс в `Accordion`. `Panel` не может напрямую установить состояние `activeIndex`, потому что оно определено внутри `Accordion`. Компонент `Accordion` должен *явно разрешить* компоненту `Panel` изменять своё состояние, [передав обработчик событий в качестве пропса.](/learn/responding-to-events#passing-event-handlers-as-props)

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

`<button>` внутри `Panel` теперь будет использовать пропс `onShow` в качестве обработчика события клика:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Это завершает подъём состояния вверх! Перемещение состояния в общий родительский компонент позволило вам координировать две панели. Использование активного индекса вместо двух флагов "is shown" гарантировало, что в любой момент времени активна только одна панель. А передача обработчика событий дочернему компоненту позволила дочернему компоненту изменять состояние родительского.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Диаграмма, показывающая дерево из трех компонентов: один родительский компонент Accordion и два дочерних компонента Panel. Accordion содержит значение activeIndex равное нулю, которое преобразуется в значение isActive равное true, передаваемое первому Panel, и значение isActive равное false, передаваемое второму Panel.">

Изначально `activeIndex` компонента `Accordion` равен `0`, поэтому первый `Panel` получает `isActive = true`.

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="Та же диаграмма, что и предыдущая, с выделенным значением activeIndex родительского компонента Accordion, указывающим на клик, со значением, измененным на единицу. Поток к обоим дочерним компонентам Panel также выделен, и значение isActive, передаваемое каждому дочернему компоненту, установлено противоположно: false для первого Panel и true для второго.">

Когда состояние `activeIndex` компонента `Accordion` изменяется на `1`, второй `Panel` получает `isActive = true` вместо этого.

</Diagram>

</DiagramGroup>

<DeepDive>

#### Управляемые и неуправляемые компоненты {/*controlled-and-uncontrolled-components*/}

Компонент с локальным состоянием часто называют "неуправляемым". Например, исходный компонент `Panel` с переменной состояния `isActive` является неуправляемым, потому что его родитель не может повлиять на то, активна панель или нет.

В отличие от этого, компонент можно назвать "управляемым", когда важная информация в нём определяется пропсами, а не его собственным локальным состоянием. Это позволяет родительскому компоненту полностью определять его поведение. Финальный компонент `Panel` с пропсом `isActive` управляется компонентом `Accordion`.

Неуправляемые компоненты проще в использовании внутри их родительских компонентов, так как требуют меньше конфигурации. Но они менее гибки, когда вам нужно координировать их вместе. Управляемые компоненты максимально гибки, но требуют, чтобы родительские компоненты полностью настраивали их с помощью пропсов.

На практике "управляемый" и "неуправляемый" — это не строгие технические термины; каждый компонент обычно имеет смесь локального состояния и пропсов. Однако это полезный способ говорить о том, как спроектированы компоненты и какие возможности они предлагают.

При написании компонента подумайте, какая информация в нём должна быть управляемой (через пропсы), а какая — неуправляемой (через состояние). Но вы всегда можете передумать и реорганизовать код позже.

</DeepDive>

## Единственный источник правды для каждого состояния {/*a-single-source-of-truth-for-each-state*/}

В приложении React многие компоненты будут иметь своё собственное состояние. Часть состояния может "жить" близко к листовым компонентам (компонентам внизу дерева), таким как поля ввода. Другая часть состояния может "жить" ближе к верху приложения. Например, даже библиотеки маршрутизации на стороне клиента обычно реализуются путём хранения текущего маршрута в состоянии React и передачи его вниз через пропсы!

**Для каждой уникальной части состояния вы выберете компонент, который "владеет" ею.** Этот принцип также известен как наличие ["единственного источника правды".](https://en.wikipedia.org/wiki/Single_source_of_truth) Это не означает, что всё состояние живёт в одном месте — но что для _каждой_ части состояния есть _конкретный_ компонент, который хранит эту информацию. Вместо дублирования общего состояния между компонентами, *поднимите его* к их общему родительскому компоненту и *передайте вниз* дочерним компонентам, которым оно нужно.

Ваше приложение будет меняться по мере работы над ним. Нередко вы будете перемещать состояние вниз или обратно вверх, пока ещё выясняете, где "живёт" каждая часть состояния. Это всё часть процесса!

Чтобы увидеть, как это ощущается на практике с несколькими дополнительными компонентами, прочитайте [Мышление в терминах React.](/learn/thinking-in-react)

<Recap>

* Когда вы хотите скоординировать два компонента, переместите их состояние к их общему родителю.
* Затем передайте информацию вниз через пропсы от их общего родителя.
* Наконец, передайте обработчики событий вниз, чтобы дочерние компоненты могли изменять состояние родителя.
* Полезно рассматривать компоненты как "управляемые" (управляемые пропсами) или "неуправляемые" (управляемые состоянием).

</Recap>

<Challenges>

#### Синхронизированные поля ввода {/*synced-inputs*/}

Эти два поля ввода независимы. Сделайте так, чтобы они оставались синхронизированными: редактирование одного поля ввода должно обновлять другое поле ввода тем же текстом, и наоборот.

<Hint>

Вам нужно будет поднять их состояние в родительский компонент.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Переместите переменную состояния `text` в родительский компонент вместе с обработчиком `handleChange`. Затем передайте их в качестве пропсов обоим компонентам `Input`. Это сохранит их синхронизацию.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Фильтрация списка {/*filtering-a-list*/}

В этом примере `SearchBar` имеет собственное состояние `query`, которое управляет полем ввода. Его родительский компонент `FilterableList` отображает `List` элементов, но не учитывает поисковый запрос.

Используйте функцию `filterItems(foods, query)`, чтобы отфильтровать список в соответствии с поисковым запросом. Чтобы проверить свои изменения, убедитесь, что ввод "s" в поле ввода фильтрует список до "Sushi", "Shish kebab" и "Dim sum".

Обратите внимание, что `filterItems` уже реализована и импортирована, поэтому вам не нужно писать её самостоятельно!

<Hint>

Вам нужно будет удалить состояние `query` и обработчик `handleChange` из `SearchBar` и переместить их в `FilterableList`. Затем передайте их в `SearchBar` в качестве пропсов `query` и `onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

Поднимите состояние `query` в компонент `FilterableList`. Вызовите `filterItems(foods, query)`, чтобы получить отфильтрованный список, и передайте его в `List`. Теперь изменение запроса в поле ввода отражается в списке:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>