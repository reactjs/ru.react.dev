---
title: Совместное использование состояния между компонентами
---

<Intro>

Иногда требуется, чтобы состояние двух компонентов всегда изменялось вместе. Для этого нужно удалить состояние из обоих компонентов, переместить его в ближайшего общего родителя и передать его им через пропсы. Это называется *подъемом состояния вверх* и является одним из наиболее распространенных приемов при написании кода на React.

</Intro>

<YouWillLearn>
- Как использовать одно состояние между компонентами, подняв его вверх
- Что такое управляемые и неуправляемые компоненты

</YouWillLearn>

## Подъём состояния на примере {/*lifting-state-up-by-example*/}

В этом примере родительский компонент `Accordion` рендерит два отдельных компонента `Panel`:
* `Accordion`
  - `Panel`
  - `Panel`

Каждый компонент `Panel` имеет булевое состояние `isActive`, которое определяет, будет ли его содержимое видимым.

Нажмите кнопку Показать на обеих панелях:

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
          Показать
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Алматы, Казахстан</h2>
      <Panel title="Подробнее">
        Алматы с населением около 2 миллионов человек является крупнейшим городом Казахстана. С 1929 по 1997 год этот город был столицей.
      </Panel>
      <Panel title="Этимология">
        Название происходит от <span lang="kk-KZ">алма</span>, казахского слова, означающего "яблоко", и часто переводится как "полное яблок". На самом деле, регион, прилегающий к Алматы, считается прародиной яблони, а дикий <i lang="la">Malus sieversii</i> считается вероятным кандидатом на роль предка современного домашнего яблока.
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

Обратите внимание, что нажатие кнопки на одной панели не влияет на другую панель--они независимы.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Диаграмма, показывающая дерево из трех компонентов: один родительский компонент с названием Accordion и два дочерних компонента с названием Panel. Оба компонента Panel содержат состояние isActive со значением false.">

Изначально, каждая панель имеет состояние `isActive` в значении `false`, поэтому они обе отображаются свернутыми

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Диаграмма такая же, как и предыдущая, но выделено состояние isActive у первого дочернего компонента Panel, это показывает, что был совершен клик и значение isActive установлено в true. Второй компонент Panel по-прежнему содержит значение false." >

Нажатие кнопки на одной из панелей приведет к обновлению состояния `isActive` только этой панели

</Diagram>

</DiagramGroup>

**А теперь предположим, что вы хотите изменить поведение так, чтобы в любой момент времени была раскрыта только одна панель.** В таком случае раскрытие второй панели должно привести к сворачиванию первой. Как бы вы это сделали?

Чтобы согласовать поведение этих двух панелей, вам нужно "поднять их состояние" в родительский компонент в три шага:

1. **Удалите** состояние из дочерних компонентов.
2. **Передайте** данные хардкодом из общего родителя.
3. **Добавьте** состояние в общего родителя и передайте его вместе с обработчиками событий.

Это позволит компоненту `Accordion` управлять обеими панелями и раскрывать только по одной за раз.

### Шаг 1: Удалить состояние из дочерних компонентов {/*step-1-remove-state-from-the-child-components*/}

Вы передадите управление значением `isActive` родительскому компоненту `Panel`. Это означает, что родительский компонент будет передавать значение `isActive` через проп, вместо того, чтобы хранить это состояние в `Panel`. Начните с **удаления этой строки** из компонента `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

И вместо нее, добавьте `isActive` в список пропсов `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Теперь родитель компонента `Panel` может *управлять* `isActive`, [передавая его вниз как проп.](/learn/passing-props-to-a-component) С другой стороны, компонент `Panel` теперь *не имеет контроля* над значением `isActive`--теперь оно зависит от родительского компонента!

### Шаг 2: Передать данные хардкодом из общего родителя {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Чтобы поднять состояние, вам необходимо определить ближайшего общего родителя для обоих дочерних компонентов, которые вы хотите скоординировать:

* `Accordion` *(ближайший общий родитель)*
  - `Panel`
  - `Panel`

В данном примере это компонент `Accordion`. Поскольку он находится выше обеих панелей и может контролировать их пропсы, он станет "источником истины", чтобы определить, какая панель сейчас активна. Давайте сделаем так, чтобы `Accordion` передавал значения `isActive` хардкодом (например, `true`) обеим панелям:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Алматы, Казахстан</h2>
      <Panel title="Подробнее" isActive={true}>
        Алматы с населением около 2 миллионов человек является крупнейшим городом Казахстана. С 1929 по 1997 год этот город был столицей.
      </Panel>
      <Panel title="Этимология" isActive={true}>
        Название происходит от <span lang="kk-KZ">алма</span>, казахского слова, означающего "яблоко", и часто переводится как "полное яблок". На самом деле, регион, прилегающий к Алматы, считается прародиной яблони, а дикий <i lang="la">Malus sieversii</i> считается вероятным кандидатом на роль предка современного домашнего яблока.
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
          Показать
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

Попробуйте изменить хардкод значение `isActive` в компоненте `Accordion` и обратите внимание как это повлияет на результат.

### Шаг 3: Добавить состояние в общего родителя {/*step-3-add-state-to-the-common-parent*/}

Подъём состояния часто приводит к изменению сущности хранимого состояния.

В нашем случае, только одна панель должна быть активна одновременно. Это означает, что общему родителю `Accordion` нужно следить за тем *какая* панель активна в данный момент. Вместо булевого значения в состоянии можно хранить число, которое будет означать индекс активной панели:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Когда `activeIndex` равен `0`, активна первая панель, а когда равен `1`, активна вторая.

Нажатие на кнопку "Показать" в любой из панелей должно изменять индекс активной панели в `Accordion`. `Panel` не может напрямую установить состояние `activeIndex`, потому что оно определено внутри `Accordion`. Компоненту `Accordion` необходимо *явно разрешить* компоненту `Panel` изменять свое состояние, [передав обработчик события как проп](/learn/responding-to-events#passing-event-handlers-as-props):

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

Элемент `<button>` внутри компонента `Panel` теперь будет использовать проп `onShow` в качестве обработчика события `click`:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Алматы, Казахстан</h2>
      <Panel
        title="Подробнее"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Алматы с населением около 2 миллионов человек является крупнейшим городом Казахстана. С 1929 по 1997 год этот город был столицей.
      </Panel>
      <Panel
        title="Этимология"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Название происходит от <span lang="kk-KZ">алма</span>, казахского слова, означающего "яблоко", и часто переводится как "полное яблок". На самом деле, регион, прилегающий к Алматы, считается прародиной яблони, а дикий <i lang="la">Malus sieversii</i> считается вероятным кандидатом на роль предка современного домашнего яблока.
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
          Показать
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

Подъём состояния завершен! Переместив состояние в общий родительский компонент нам удалось скоординировать две панели. Использование индекса активной панели вместо двух флагов `isActive` гарантирует нам, что будет активна только одна панель одновременно. А передав обработчики событий дочерним компонентам мы позволили им управлять состоянием родителя.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="На диаграмме изображено дерево компонентов, один родительский компонент с названием Accordion и два дочерних с названием Panel. Accordion содержит переменную activeIndex со значением ноль, которая преобразуется в isActive со значением true для первой Panel, и в isActive со значением false для второй Panel." >

В начале, `activeIndex` в компоненте `Accordion` имеет значение 0, поэтому первая панель получает `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="Та же диаграмма, что и предыдущая, с выделенным значением активного индекса родительского компонента Accordion, указывающим на клик со значением, измененным на единицу. Стрелки к обоим дочерним компонентам Panel также выделены, а значение isActive, передаваемое каждому дочернему элементу, установлено в противоположное значение: false для первой панели и true для второй." >

Когда состояние `activeIndex` в `Accordion` становится `1`, вторая `Panel` получает `isActive = true` вместо первой

</Diagram>

</DiagramGroup>

<DeepDive>

#### Управляемые и неуправляемые компоненты {/*controlled-and-uncontrolled-components*/}

Компоненты, у которых есть внутреннее состояние, обычно называют "неуправляемыми". Например, оригинальный компонент `Panel` с переменной состояния `isActive` является неуправляемым, потому что его родитель не может повлиять на то, активна ли панель.

Напротив, компонент называют "управляемым", если важная информация зависит от пропов, а не от внутреннего состояния. Это позволяет родительскому компоненту полностью контролировать его поведение. После наших изменений, компонентом `Panel` управляет компонент `Accordion` с помощью пропа `isActive`.

Неуправляемые компоненты проще использовать, потому что им необходимо меньше конфигурации. Но они не такие гибкие, когда вам нужно согласовать их поведение. Управляемые компоненты максимально гибкие, но необходимо чтобы родительские компоненты полностью настраивали их через пропсы.

На практике «управляемые» и «неуправляемые» это не строгие технические определения--обычно компоненты имеют и внутреннее состояние и пропсы. Однако, важно понимать как устроены компоненты и какие возможности они предоставляют.

Когда пишите компонент, подумайте какая информация в нем должна быть управляема (через пропсы), а какая неуправляема (через состояние). Но вы в любой момент можете передумать и сделать рефакторинг позже.

</DeepDive>

## Единый источник истины для каждого состояния {/*a-single-source-of-truth-for-each-state*/}

В приложении на React у многих компонентов будет свое собственное состояние. Какое-то состояние может «жить» близко к листовым компонентам (компоненты внизу дерева), например, текстовое поле. Другое состояние может «жить» ближе к корню приложения. Например, даже при реализации библиотеки клиентской маршрутизации, текущий путь обычно сохраняют в состояние React и передают его вниз через пропсы.

**Для каждого уникального кусочка состояния вы выбираете компонент, который «владеет» им.** Этот принцип также известен как наличие ["единого источника истины".](https://en.wikipedia.org/wiki/Single_source_of_truth) Это не означает, что все состояние React находится в одном месте--для _каждой_ части состояния существует _конкретный_ компонент, который хранит эту информацию. 
Вместо дублирования общего состояния между компонентами, *поднимите* его в общий родительский компонент и «пробросьте» его дочерним компонентам, которым он необходим.

Ваше приложение будет меняться по мере работы над ним. Это нормально, что вы будете перемещать состояние вниз или обратно вверх, пока разбираетесь где «живет» каждая часть состояния. Это все часть процесса!

Чтобы увидеть как это работает на практике с другими компонентами, прочитайте статью [Мыслим на React.](/learn/thinking-in-react).

<Recap>

* Если вы хотите скоординировать два компонента, переместите их состояние к общему родительскому компоненту.
* Затем передайте информацию через пропсы из общего родительского компонента.
* Наконец, пробросьте обработчики событий, чтобы дочерние компоненты могли изменять состояние родительского компонента.
* Полезно рассматривать компоненты как «управляемые» (управляемые пропами) или «неуправляемые» (управляемые состоянием).

</Recap>

<Challenges>

#### Синхронизированные поля ввода {/*synced-inputs*/}

Эти два поля ввода независимы. Синхронизируйте их: редактирование одного поля должно обновлять другое поле с тем же текстом, и наоборот.

<Hint>

Вам нужно поднять их состояние в родительский компонент.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="Первое поле" />
      <Input label="Второе поле" />
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

Переместите переменную состояния `text` в родительский компонент вместе с обработчиком `handleChange`. Затем передайте их вниз как пропсы обоим компонентам `Input`. Таким образом они будут синхронизированы.

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
        label="Первое поле"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Второе поле"
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

В этом примере у компонента `SearchBar` есть своё состояние query, которое управляет текстовым полем. Родительский компонент `FilterableList` отображает список элементов `List`, но не учитывает поисковый запрос.

Используйте функцию `filterItems(foods, query)`, чтобы отфильтровать список в соответствии с поисковым запросом. Чтобы проверить свои изменения, убедитесь, что ввод буквы "s" в поле ввода отфильтрует список так, что остануться элементы "Sushi", "Shish kebab" и "Dim sum".

Обратите внимание, что функция `filterItems` уже реализована и импортирована, поэтому вам не нужно писать её самостоятельно!

<Hint>

Вам нужно удалить состояние `query` и обработчик `handleChange` из компонента `SearchBar` и переместить их в `FilterableList`. Затем передать их вниз в `SearchBar` как пропсы `query` и `onChange`.

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
      Поиск:{' '}
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

```js data.js
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

Поднимите состояние `query` в компонент `FilterableList`. Вызовите функцию `filterItems(foods, query)` для получения отфильтрованного списка и передайте его в компонент `List`. Теперь поиск работает и влияет на отображение списка:

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
      Поиск:{' '}
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

```js data.js
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
