---
title: Passing Data Deeply with Context
---

<Intro>

Обычно вы передаете информацию из родительского компонента в дочерний через пропсы. Но передача пропсов может стать громоздкой и неудобной, если вам приходится передавать их через множество промежуточных компонентов, или если многим компонентам в вашем приложении нужна одна и та же информация. *Контекст* позволяет родительскому компоненту сделать некоторую информацию доступной любому компоненту в дереве ниже него — независимо от глубины — без явной передачи через пропсы.

</Intro>

<YouWillLearn>

- Что такое "проп-дриллинг" (prop drilling)
- Как заменить повторяющуюся передачу пропсов контекстом
- Распространенные сценарии использования контекста
- Распространенные альтернативы контексту

</YouWillLearn>

## Проблема передачи пропсов {/*the-problem-with-passing-props*/}

[Передача пропсов](/learn/passing-props-to-a-component) — отличный способ явно передавать данные через дерево вашего UI компонентам, которые их используют.

Но передача пропсов может стать громоздкой и неудобной, когда вам нужно передать какой-то пропс глубоко через дерево, или если многим компонентам нужен один и тот же пропс. Ближайший общий предок может быть далеко от компонентов, которым нужны данные, а [подъем состояния вверх](/learn/sharing-state-between-components) на такую высоту может привести к ситуации, называемой "проп-дриллинг".

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Диаграмма с деревом из трех компонентов. Родительский компонент содержит пузырек, представляющий значение, выделенное фиолетовым цветом. Значение передается вниз к обоим дочерним компонентам, оба выделены фиолетовым." >

Подъем состояния вверх

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Диаграмма с деревом из десяти узлов, каждый узел имеет два или менее дочерних узла. Корневой узел содержит пузырек, представляющий значение, выделенное фиолетовым цветом. Значение передается вниз к двум дочерним узлам, каждый из которых передает значение, но не содержит его. Левый дочерний узел передает значение двум своим дочерним узлам, оба выделены фиолетовым. Правый дочерний узел корневого узла передает значение одному из своих двух дочерних узлов — правому, который выделен фиолетовым. Этот дочерний узел передает значение своему единственному дочернему узлу, который передает его обоим своим дочерним узлам, выделенным фиолетовым.">

Проп-дриллинг

</Diagram>

</DiagramGroup>

Не было бы здорово, если бы существовал способ "телепортировать" данные в компоненты дерева, которым они нужны, без передачи пропсов? С помощью функции контекста React это возможно!

## Контекст: альтернатива передаче пропсов {/*context-an-alternative-to-passing-props*/}

Контекст позволяет родительскому компоненту предоставлять данные всему дереву ниже него. Существует множество применений контекста. Вот один из примеров. Рассмотрим компонент `Heading`, который принимает `level` для определения размера:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Допустим, вы хотите, чтобы несколько заголовков в одном `Section` всегда имели одинаковый размер:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

В настоящее время вы передаете пропс `level` каждому `<Heading>` отдельно:

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

Было бы неплохо, если бы вы могли передать пропс `level` компоненту `<Section>` вместо этого и убрать его из `<Heading>`. Таким образом, вы могли бы гарантировать, что все заголовки в одном разделе имеют одинаковый размер:

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

Но как компонент `<Heading>` может узнать уровень своего ближайшего `<Section>`? **Для этого нужен способ, чтобы дочерний компонент мог "запросить" данные откуда-то выше в дереве.**

С помощью одних только пропсов это не сделать. Здесь на помощь приходит контекст. Вы сделаете это в три шага:

1. **Создайте** контекст. (Вы можете назвать его `LevelContext`, так как он предназначен для уровня заголовка.)
2. **Используйте** этот контекст из компонента, которому нужны данные. (`Heading` будет использовать `LevelContext`.)
3. **Предоставьте** этот контекст из компонента, который определяет данные. (`Section` будет предоставлять `LevelContext`.)

Контекст позволяет родительскому компоненту — даже удаленному! — предоставлять данные всему дереву внутри него.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Диаграмма с деревом из трех компонентов. Родительский компонент содержит пузырек, представляющий значение, выделенное оранжевым цветом, которое проецируется вниз к двум дочерним компонентам, каждый из которых выделен оранжевым." >

Использование контекста в близких дочерних компонентах

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Диаграмма с деревом из десяти узлов, каждый узел имеет два или менее дочерних узла. Корневой родительский узел содержит пузырек, представляющий значение, выделенное оранжевым цветом. Значение проецируется вниз непосредственно к четырем листьям и одному промежуточному компоненту в дереве, все они выделены оранжевым. Ни один из других промежуточных компонентов не выделен.">

Использование контекста в удаленных дочерних компонентах

</Diagram>

</DiagramGroup>

### Шаг 1: Создайте контекст {/*step-1-create-the-context*/}

Сначала вам нужно создать контекст. Вам нужно будет **экспортировать его из файла**, чтобы ваши компоненты могли его использовать:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Единственный аргумент для `createContext` — это _значение по умолчанию_. Здесь `1` относится к самому большому уровню заголовка, но вы можете передать любое значение (даже объект). Вы увидите значение значения по умолчанию на следующем шаге.

### Шаг 2: Используйте контекст {/*step-2-use-the-context*/}

Импортируйте хук `useContext` из React и ваш контекст:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

В настоящее время компонент `Heading` читает `level` из пропсов:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Вместо этого удалите пропс `level` и прочитайте значение из только что импортированного контекста, `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` — это хук. Как и `useState` и `useReducer`, вы можете вызывать хук только непосредственно внутри React-компонента (не внутри циклов или условий). **`useContext` сообщает React, что компонент `Heading` хочет прочитать `LevelContext`.**

Теперь, когда у компонента `Heading` нет пропса `level`, вам больше не нужно передавать пропс `level` в `Heading` в вашем JSX вот так:

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Обновите JSX так, чтобы вместо этого его получал `Section`:

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

Напоминаем, вот разметка, которую вы пытались заставить работать:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Обратите внимание, этот пример пока не совсем работает! Все заголовки имеют одинаковый размер, потому что **даже если вы *используете* контекст, вы еще не *предоставили* его.** React не знает, откуда его взять!

Если вы не предоставите контекст, React будет использовать значение по умолчанию, которое вы указали на предыдущем шаге. В этом примере вы указали `1` в качестве аргумента `createContext`, поэтому `useContext(LevelContext)` возвращает `1`, устанавливая все эти заголовки в `<h1>`. Давайте исправим эту проблему, заставив каждый `Section` предоставлять свой собственный контекст.

### Шаг 3: Предоставьте контекст {/*step-3-provide-the-context*/}

Компонент `Section` в настоящее время отображает свои дочерние элементы:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Оберните их в про

## Варианты использования контекста {/*use-cases-for-context*/}

* **Тематизация:** Если ваше приложение позволяет пользователю изменять его внешний вид (например, тёмный режим), вы можете поместить `Context.Provider` в верхнюю часть приложения и использовать этот контекст в компонентах, которым нужно настроить свой внешний вид.
* **Текущая учётная запись:** Многим компонентам может потребоваться знать, какой пользователь вошёл в систему в данный момент. Помещение этой информации в контекст делает её удобной для чтения в любом месте дерева компонентов. Некоторые приложения также позволяют работать с несколькими учётными записями одновременно (например, чтобы оставить комментарий от имени другого пользователя). В таких случаях может быть удобно обернуть часть пользовательского интерфейса во вложенный `Provider` с другим значением текущей учётной записи.
* **Маршрутизация:** Большинство решений для маршрутизации используют контекст внутри себя для хранения текущего маршрута. Именно так каждая ссылка "знает", активна она или нет. Если вы создаёте собственный маршрутизатор, вам, возможно, тоже захочется это сделать.
* **Управление состоянием:** По мере роста вашего приложения вы можете обнаружить, что много состояния находится ближе к вершине дерева компонентов. Многим удалённым компонентам ниже может потребоваться изменить его. Часто [используют редюсер вместе с контекстом](/learn/scaling-up-with-reducer-and-context) для управления сложным состоянием и передачи его удалённым компонентам без особых усилий.
  
Контекст не ограничивается статическими значениями. Если вы передадите другое значение при следующем рендеринге, React обновит все компоненты, которые его читают ниже! Именно поэтому контекст часто используется в сочетании с состоянием.

В целом, если какая-либо информация требуется удалённым компонентам в разных частях дерева, это хороший признак того, что контекст вам поможет.

<Recap>

* Контекст позволяет компоненту предоставлять некоторую информацию всему дереву ниже него.
* Для передачи контекста:
  1. Создайте и экспортируйте его с помощью `export const MyContext = createContext(defaultValue)`.
  2. Передайте его в хук `useContext(MyContext)` для чтения в любом дочернем компоненте, независимо от его глубины.
  3. Оберните дочерние элементы в `<MyContext value={...}>` для предоставления его от родителя.
* Контекст передаётся через любые промежуточные компоненты.
* Контекст позволяет писать компоненты, которые "адаптируются к своему окружению".
* Прежде чем использовать контекст, попробуйте передать пропсы или JSX в качестве `children`.

</Recap>

<Challenges>

#### Замените передачу пропсов через несколько уровней на контекст {/*replace-prop-drilling-with-context*/}

В этом примере переключение флажка изменяет пропс `imageSize`, передаваемый каждому `<PlaceImage>`. Состояние флажка хранится в компоненте верхнего уровня `App`, но каждый `<PlaceImage>` должен быть осведомлён о нём.

В настоящее время `App` передаёт `imageSize` в `List`, который передаёт его каждому `Place`, который передаёт его `PlaceImage`. Удалите пропс `imageSize` и вместо этого передайте его из компонента `App` напрямую в `PlaceImage`.

Вы можете объявить контекст в `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

Удалите пропс `imageSize` из всех компонентов.

Создайте и экспортируйте `ImageSizeContext` из `Context.js`. Затем оберните `List` в `<ImageSizeContext value={imageSize}>` для передачи значения вниз и используйте `useContext(ImageSizeContext)` для его чтения в `PlaceImage`:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

Обратите внимание, как промежуточные компоненты больше не передают `imageSize`.

</Solution>

</Challenges>