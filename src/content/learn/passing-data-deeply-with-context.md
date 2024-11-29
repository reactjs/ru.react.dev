---
title: Передача данных через контекст
---

<Intro>

Обычно вы передаёте информацию от родительского компонента к дочернему с помощью пропсов. Однако такая передача может стать многослойной и неудобной, если необходимо передавать информацию через большое количество промежуточных компонентов или если множеству компонентов в вашем приложении нужна одна и та же информация. *Контекст* позволяет родительскому компоненту предоставлять информацию любому компоненту в дереве под ним, независимо от глубины и не передавая данные явно через пропсы.

</Intro>

<YouWillLearn>

- Что такое "проп бурение"
- Как заменить повторяющуюся передачу пропсов
- Рядовые случаи использования контекста
- Альтернативы контекста

</YouWillLearn>

## Проблема передачи пропа {/*the-problem-with-passing-props*/}

[Передача пропсов](/learn/passing-props-to-a-component) — это отличный способ явно передать данные по дереву компонентов туда, где они используются.

Однако передача пропсов может стать муторной, если вам нужно передать их глубоко в дерево или если множеству компонентов нужен один и тот же проп. Ближайший общий предок может находиться далеко от компонентов, которым нужны данные, и [подъём состояния вверх](/learn/sharing-state-between-components) на такую высоту может привести к ситуации, называемой "бурение пропсов" ("prop drilling").

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in purple. The value flows down to each of the two children, both highlighted in purple." >

Подъём состояния

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root node contains a bubble representing a value highlighted in purple. The value flows down through the two children, each of which pass the value but do not contain it. The left child passes the value down to two children which are both highlighted purple. The right child of the root passes the value through to one of its two children - the right one, which is highlighted purple. That child passed the value through its single child, which passes it down to both of its two children, which are highlighted purple.">

Бурение пропсов

</Diagram>

</DiagramGroup>

А если представить, что у нас есть возможность "телепортировать" данные в те компоненты дерева, которым они нужны, без передачи пропсов? В React это возможно с контекстом!

## Контекст: альтернатива передачи пропсов {/*context-an-alternative-to-passing-props*/}

Контекст позволяет родительскому компоненту передавать данные всему дереву под ним. Существует множество вариантов использования контекста. Вот один из примеров. Рассмотрим компонент `Heading`, который принимает значение `level` для своего размера:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Наименование</Heading>
      <Heading level={2}>Заголовок</Heading>
      <Heading level={3}>Под-заголовок</Heading>
      <Heading level={4}>Под-под-заголовок</Heading>
      <Heading level={5}>Под-под-под-заголовок</Heading>
      <Heading level={6}>Под-под-под-под-заголовок</Heading>
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
      throw Error('Неизвестный уровень: ' + level);
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
      <Heading level={1}>Наименование</Heading>
      <Section>
        <Heading level={2}>Заголовок</Heading>
        <Heading level={2}>Заголовок</Heading>
        <Heading level={2}>Заголовок</Heading>
        <Section>
          <Heading level={3}>Под-заголовок</Heading>
          <Heading level={3}>Под-заголовок</Heading>
          <Heading level={3}>Под-заголовок</Heading>
          <Section>
            <Heading level={4}>Под-под-заголовок</Heading>
            <Heading level={4}>Под-под-заголовок</Heading>
            <Heading level={4}>Под-под-заголовок</Heading>
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
      throw Error('Неизвестный уровень: ' + level);
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

Сейчас вы передаёте проп `level` каждому `<Heading>` отдельно:

```js
<Section>
  <Heading level={3}>О нас</Heading>
  <Heading level={3}>Фото</Heading>
  <Heading level={3}>Видео</Heading>
</Section>
```

Более удобным будет передавать параметр `level` в компонент `<Section>` и убирать его из `<Heading>`. Таким образом, мы можем добиться того, чтобы все заголовки в одном разделе имели одинаковый размер:

```js
<Section level={3}>
  <Heading>О нас</Heading>
  <Heading>Фото</Heading>
  <Heading>Видео</Heading>
</Section>
```

Но как компонент `<Heading>` может узнать уровень ближайшего к нему `<Section>`? **Это потребует от дочернего компонента какого-то способа "запрашивать" данные откуда-то сверху.**

С помощью одних только пропсов этого не сделать. Здесь на помощь приходит контекст. Вы можете сделать это в три шага:

1. **Создать** контекст. (Можно назвать его `LevelContext`, поскольку он предназначен для уровня заголовка).
2. **Использовать** этот контекст в компоненте, которому нужны данные. (`Heading` будет использовать `LevelContext`).
3. **Передать** этот контекст компоненту, определяющему данные. (`Section` передаст `LevelContext`).

Контекст позволяет родительскому компоненту — даже удалённому — предоставлять определённые данные всему дереву компонентов внутри него.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in orange which projects down to the two children, each highlighted in orange." >

Использование контекста с детьми вблизи

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root parent node contains a bubble representing a value highlighted in orange. The value projects down directly to four leaves and one intermediate component in the tree, which are all highlighted in orange. None of the other intermediate components are highlighted.">

Использование контекста с детьми на расстоянии

</Diagram>

</DiagramGroup>

### Шаг 1: Создать контекст {/*step-1-create-the-context*/}

Сначала нужно создать контекст. Потом вам нужно будет **экспортировать его из файла**, чтобы ваши компоненты могли его использовать:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Наименование</Heading>
      <Section>
        <Heading level={2}>Заголовок</Heading>
        <Heading level={2}>Заголовок</Heading>
        <Heading level={2}>Заголовок</Heading>
        <Section>
          <Heading level={3}>Под-заголовок</Heading>
          <Heading level={3}>Под-заголовок</Heading>
          <Heading level={3}>Под-заголовок</Heading>
          <Section>
            <Heading level={4}>Под-под-заголовок</Heading>
            <Heading level={4}>Под-под-заголовок</Heading>
            <Heading level={4}>Под-под-заголовок</Heading>
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
      throw Error('Неизвестный уровень: ' + level);
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

Единственным аргументом `createContext` является значение по _умолчанию_. Здесь `1` означает самый большой уровень заголовка, но вы можете передать любое значение (даже объект). Значимость значения по умолчанию вы увидите в следующем шаге.

### Шаг 2: Использовать контекст {/*step-2-use-the-context*/}

Импортируем хук `useContext` из React и ваш контекст:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Сейчас компонент `Heading` считывает `level` из пропсов:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Вместо этого удалите проп `level` и добавьте значение из контекста, который вы только что импортировали — `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` — это хук. Как и `useState` и `useReducer`, его можно вызывать только непосредственно внутри компонента React (не в циклах или условиях). **`useContext` сообщает React, что компонент `Heading` хочет получить данные из `LevelContext`.**

Теперь, когда компонент `Heading` больше не имеет свойство `level`, вам не нужно передавать этот проп внутрь `Heading` в ваш JSX как здесь:

```js
<Section>
  <Heading level={4}>Под-под-заголовок</Heading>
  <Heading level={4}>Под-под-заголовок</Heading>
  <Heading level={4}>Под-под-заголовок</Heading>
</Section>
```

Обновите JSX так, чтобы компонент `Section` получал проп `level` как в примере:

```jsx
<Section level={4}>
  <Heading>Под-под-заголовок</Heading>
  <Heading>Под-под-заголовок</Heading>
  <Heading>Под-под-заголовок</Heading>
</Section>
```

Вспомним, что это тот код, который вы пытались заставить работать:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Наименование</Heading>
      <Section level={2}>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Section level={3}>
          <Heading>Под-заголовок</Heading>
          <Heading>Под-заголовок</Heading>
          <Heading>Под-заголовок</Heading>
          <Section level={4}>
            <Heading>Под-под-заголовок</Heading>
            <Heading>Под-под-заголовок</Heading>
            <Heading>Под-под-заголовок</Heading>
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
      throw Error('Неизвестный уровень: ' + level);
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

Обратите внимание, что этот пример еще не совсем рабочий! Все заголовки имеют одинаковый размер, потому что **хоть вы и *используете* контекст, вы еще не *указали* его.** React не знает, где его взять!

Если вы не укажете контекст, React будет использовать значение по умолчанию, которое вы указали на предыдущем шаге. В этом примере вы указали `1` в качестве аргумента для `createContext`, поэтому `useContext(LevelContext)` возвращает `1`, устанавливая для всех заголовков `<h1>` это значение. Давайте исправим эту проблему, заставив каждый `Section` передать свой собственный контекст.

### Шаг 3: Указать контекст {/*step-3-provide-the-context*/}

Компонент `Section` в данный момент отображает свои дочерние элементы:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Оберните их провайдером контекста**, чтобы передать им `LevelContext`:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Это сообщает React: "если какой-либо компонент внутри `<Section>` запрашивает `LevelContext`, дайте ему этот уровень." Компонент будет использовать значение ближайшего `<LevelContext.Provider>` в дереве UI над ним.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Наименование</Heading>
      <Section level={2}>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Section level={3}>
          <Heading>Под-заголовок</Heading>
          <Heading>Под-заголовок</Heading>
          <Heading>Под-заголовок</Heading>
          <Section level={4}>
            <Heading>Под-под-заголовок</Heading>
            <Heading>Под-под-заголовок</Heading>
            <Heading>Под-под-заголовок</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
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
      throw Error('Неизвестный уровень: ' + level);
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

Это тот же результат, что и в исходном коде, но вам не нужно передавать проп `level` каждому компоненту `Heading`! Вместо этого он "выясняет" уровень своего заголовка, запрашивая ближайший `Section` выше:

1. Вы передаёте проп `level` в `<Section>`.
2. `Section` оборачивает дочерние элементы в `<LevelContext.Provider value={level}>`.
3. `Heading` запрашивает ближайшее значение `LevelContext` с помощью `useContext(LevelContext)`.

## Использование и передача контекста в компонентах {/*using-and-providing-context-from-the-same-component*/}

В настоящее время вам по-прежнему приходится указывать `level` каждого раздела вручную:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Так как контекст позволяет считывать информацию из компонента выше, каждый `Section` может считывать `level` из `Section` сверху, и автоматически передавать `level + 1` вниз. Вот как это можно сделать:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Благодаря этому изменению вам не нужно передавать параметр `level` *какому-либо* `<Section>` или `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Наименование</Heading>
      <Section>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Heading>Заголовок</Heading>
        <Section>
          <Heading>Под-заголовок</Heading>
          <Heading>Под-заголовок</Heading>
          <Heading>Под-заголовок</Heading>
          <Section>
            <Heading>Под-под-заголовок</Heading>
            <Heading>Под-под-заголовок</Heading>
            <Heading>Под-под-заголовок</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
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
    case 0:
      throw Error('Heading must be inside a Section!');
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

export const LevelContext = createContext(0);
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

Теперь и `Heading`, и `Section` читают `LevelContext`, чтобы выяснить, насколько "глубоко" они находятся. А `Section` оборачивает свои дочерние элементы в LevelContext с целью указать, что всё, что находится внутри, расположено на более "глубоком" уровне.

<Note>

В этом примере используются уровни заголовков, потому что они наглядно показывают, как вложенные компоненты могут переопределять контекст. Но контекст полезен и во многих других случаях. Вы можете передать любую информацию, необходимую всему поддереву: текущую цветовую тему, пользователя вошедшего в систему, и так далее.

</Note>

## Прохождение контекста через промежуточные компоненты {/*context-passes-through-intermediate-components*/}

Вы можете использовать столько компонентов между передающим контекст и тем, который его использует компонентами, сколько захотите. Сюда входят как базовые компоненты, такие как `<div>`, так и те, которые вы можете создать самостоятельно.

В этом примере один и тот же компонент `Post` (с пунктирной границей) отображается на двух разных уровнях вложенности. Обратите внимание, что `<Heading>` внутри него автоматически получает свой уровень из ближайшего `<Section>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>Мой профиль</Heading>
      <Post
        title="Привет, путешественник!"
        body="Почитай о моих путешествиях."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Пост</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Последние посты</Heading>
      <Post
        title="Вкусы Лиссабона"
        body="...those pastéis de nata!"
      />
      <Post
        title="Буэнос-Айрес в ритме танго"
        body="Мне понравилось это!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
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
    case 0:
      throw Error('Heading должен находиться внутри раздела!');
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

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Вы не сделали ничего волшебного, чтобы это заработало. `Section` определяет контекст для дерева внутри него, поэтому вы можете поставить `<Heading>` в любое место, и он будет иметь правильный размер. Попробуйте это в песочнице выше!

**Контекст позволяет вам писать компоненты, которые "адаптируются к своему окружению" и отображаются по-разному в зависимости от того, _где_ (или другими словами, _в каком контексте_) они отображаются.**

То, как работает контекст, может напомнить вам о [наследовании свойств CSS.](https://developer.mozilla.org/ru/docs/Web/CSS/Inheritance) В нём вы можете указать `color: blue` для `<div>`, и любой узел DOM внутри него, независимо от его глубины, унаследует этот цвет, если только какой-либо другой узел DOM в середине не переопределит его на `color: green`. Аналогично в React. Eдинственный способ переопределить контекст, поступающий сверху, — это обернуть дочерние элементы в провайдер контекста с другим значением.

В CSS разные свойства, такие как `color` и `background-color`, не переопределяют друг друга. Вы можете установить во всех `<div>` свойство `color` на красный, не влияя на `background-color`. Аналогично, **разные контексты React не переопределяют друг друга.** Каждый контекст, который вы создаёте с помощью `createContext()` полностью отделён от других и связывает компоненты, использующие и передающие *этот конкретный* контекст. Один компонент может использовать или передавать множество разных контекстов без проблем.

## Перед использованием контекста {/*before-you-use-context*/}

Контекст — это очень заманчиво! Однако это также означает, что им слишком легко злоупотребить. **Если вам нужно просто передать какие-то пропсы на несколько уровней в глубину, это не значит, что вы должны передавать информацию через контекст.**

Вот несколько альтернатив, которые нужно рассмотреть, прежде чем использовать контекст:

1. **Начните с [передачи пропсов.](/learn/passing-props-to-a-component)** Если ваши компоненты достаточно простые, то нередко приходится передавать множество пропсов вниз через множество компонентов. Это может показаться трудоёмкой задачей, но так становится ясно, какие компоненты используют те или иные данные! Человек, обслуживающий ваш код, будет рад, что вы сделали поток данных явным с помощью пропсов.
2. **Извлекайте компоненты и [передавайте им JSX как `детям`](/learn/passing-props-to-a-component#passing-jsx-as-children).** Если вы передаёте какие-то данные через множество промежуточных компонентов, которые не используют эти данные (а только передают их дальше вниз), это часто означает, что вы забыли извлечь некоторые компоненты на этом пути. Например, вы передаете такие пропсы, как `posts`, визуальным компонентам, которые не используют их напрямую, например, `<Layout posts={posts} />`. Вместо этого сделайте так, чтобы `Layout` принимал `children` в качестве пропа и выводил `<Layout><Posts posts={posts} /></Layout>`. Это уменьшает количество слоёв между компонентом, задающим данные, и компонентом, которому они нужны.

Если ни один из этих подходов вам не подходит, рассмотрите контекст.

## Варианты использования контекста {/*use-cases-for-context*/}

* **Изменение темы:** Если ваше приложение позволяет пользователю изменять его внешний вид (например, темный режим), вы можете поместить провайдер контекста в верхней части приложения и использовать этот контекст в компонентах, которым нужно изменять свой внешний вид.
* **Текущий аккаунт:** Многим компонентам может потребоваться информация о текущем вошедшем в систему пользователе. Поместив его в контекст, эту информацию удобно будет читать в любом месте дерева. Некоторые приложения также позволяют работать с несколькими учетными записями одновременно (например оставлять комментарии от имени другого пользователя). В таких случаях может быть удобно обернуть часть UI во вложенный провайдер с другим текущим значением.
* **Маршрутизация:** Большинство решений для маршрутизации используют внутренний контекст для хранения текущего маршрута. Так каждая ссылка "знает", активна она или нет. Если вы создадите свой собственный маршрутизатор, то, возможно, захотите сделать также.
* **Управление состоянием:** По мере роста вашего приложения вы можете столкнуться с большим количеством состояний в верхней части вашего приложения. Многие дальние компоненты внизу могут захотеть изменить их. Обычно [используется редюсер вместе с контекстом](/learn/scaling-up-with-reducer-and-context), чтобы управлять сложным состоянием и передавать его вниз удаленным компонентам без особых проблем.

Контекст не ограничивается статическими значениями. Если при следующем рендере вы передадите другое значение, React обновит все компоненты, читающие его ниже! Именно поэтому контекст часто используется в связке с состоянием.

В общем, если какая-то информация нужна удалённым компонентам в разных частях дерева, это хороший признак того, что контекст вам может помочь.

<Recap>

* Контекст позволяет компоненту передавать некоторую информацию всему дереву под ним.
* Чтобы передать контекст:
  1. Создайте и экспортируйте его с помощью `export const MyContext = createContext(defaultValue)`.
  2. Передайте его хуку `useContext(MyContext)` чтобы прочитать его в любом дочернем компоненте, независимо от его глубины.
  3. Заверните дочерние компоненты в обертку `<MyContext.Provider value={...}>`, чтобы подтянуть его из родительского компонента.
* Контекст проходит через любые компоненты в середине.
* Контекст позволяет писать компоненты, которые "адаптируются к своему окружению".
* Прежде чем использовать контекст, попробуйте передать пропсы или передать JSX в качестве `children`.

</Recap>

<Challenges>

#### Замените проп бурение на контекст {/*replace-prop-drilling-with-context*/}

В этом примере переключение `checkbox` изменяет проп `imageSize`, передаваемый каждому `<PlaceImage>`. Состояние элемента `checkbox` хранится в компоненте верхнего уровня `App`, но каждый `<PlaceImage>` должен знать о нем.

Сейчас `App` передает `imageSize` в `List`, который передает его в каждый `Place`, который передает его в `PlaceImage`. Удалите проп `imageSize` и вместо этого передавайте его из компонента `App` прямо в `PlaceImage`.

Вы можете объявить контекст в файле `Context.js`.

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
        Использовать большие изображения
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
  name: 'Бо-Каап в Кейптауне, Южная Африка',
  description: 'Традиция выбирать яркие цвета для домов зародилась в конце 20 века.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Радужная деревня в Тайчжуне, Тайвань',
  description: 'Чтобы спасти дома от сноса, местный житель Хуан Юн Фу в 1924 году раскрасил все 1200 зданий.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Макромурал из Пачуки, Мексика',
  description: 'Одна из самых больших фресок в мире, покрывающая дома в районе на холме.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Лестница Селарона в Рио-де-Жанейро, Бразилия',
  description: 'Эта достопримечательность была создана Хорхе Селароном, художником чилийского происхождения, как "дань уважения бразильскому народу".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Бурано, Италия',
  description: 'Дома окрашены по особой системе цветов, восходящей к 16 веку.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Шефчауэн, Марокко',
  description: 'Существует несколько теорий, почему дома окрашены в синий цвет, в том числе то, что этот цвет отпугивает комаров или символизирует небо и рай.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Культурная деревня Гамчхон в Пусане, Южная Корея',
  description: 'В 2009 году деревня была превращена в культурный центр: дома были покрашены, в них были организованы выставки и художественные инсталляции.',
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

Удалите проп `imageSize` из всех компонентов.

Создайте и экспортируйте `ImageSizeContext` из `Context.js`. Затем оберните список провайдером`<ImageSizeContext.Provider value={imageSize}>`, чтобы передать значение вниз, и используйте `useContext(ImageSizeContext)`, чтобы прочитать его в `PlaceImage`:

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
    <ImageSizeContext.Provider
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
        Использовать большие изображения
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
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
  name: 'Бо-Каап в Кейптауне, Южная Африка',
  description: 'Традиция выбирать яркие цвета для домов зародилась в конце 20 века.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Радужная деревня в Тайчжуне, Тайвань',
  description: 'Чтобы спасти дома от сноса, местный житель Хуан Юн Фу в 1924 году раскрасил все 1200 зданий.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Макромурал из Пачуки, Мексика',
  description: 'Одна из самых больших фресок в мире, покрывающая дома в районе на холме.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Лестница Селарона в Рио-де-Жанейро, Бразилия',
  description: 'Эта достопримечательность была создана Хорхе Селароном, художником чилийского происхождения, как "дань уважения бразильскому народу".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Бурано, Италия',
  description: 'Дома окрашены по особой системе цветов, восходящей к 16 веку.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Шефчауэн, Марокко',
  description: 'Существует несколько теорий, почему дома окрашены в синий цвет, в том числе то, что этот цвет отпугивает комаров или символизирует небо и рай.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Культурная деревня Гамчхон в Пусане, Южная Корея',
  description: 'В 2009 году деревня была превращена в культурный центр: дома были покрашены, в них были организованы выставки и художественные инсталляции.',
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

Обратите внимание, что компонентам в середине больше не нужно передавать `imageSize`.

</Solution>

</Challenges>
