---
title: Передача данных через контекст
---

<Intro>

Обычно вы передаёте информацию от родительского компонента к дочернему с помощью пропсов. Однако такая передача может стать многослойной и неудобной, если необходимо передавать информацию через множество промежуточных компонентов или если многим компонентам в вашем приложении нужна одна и та же информация. *Контекст* позволяет родительскому компоненту передавать информацию любому компоненту в дереве под ним, независимо от глубины и не передавая данные явно через пропсы.

</Intro>

<YouWillLearn>

- Что такое "проп бурение"
- Как заменить повторяющуюся передачу пропсов
- Рядовые случаи использования контекста
- Альтернативы контекста

</YouWillLearn>

## Проблема передачи пропса {/*the-problem-with-passing-props*/}

[Передача пропсов](/learn/passing-props-to-a-component) — это отличный способ явно передать данные через UI дерево компонентам, которые их используют.

Однако передача пропсов может стать муторной, если вам нужно передать их глубоко в дерево, или если многим компонентам нужен один и тот же пропс. Ближайший общий предок может находиться далеко от компонентов, которым нужны данные, и [подъём состояния вверх](/learn/sharing-state-between-components) на такую высоту может привести к ситуации, называемой «проп бурение».

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in purple. The value flows down to each of the two children, both highlighted in purple." >

Подъём состояния

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Diagram with a tree of ten nodes, each node with two children or less. The root node contains a bubble representing a value highlighted in purple. The value flows down through the two children, each of which pass the value but do not contain it. The left child passes the value down to two children which are both highlighted purple. The right child of the root passes the value through to one of its two children - the right one, which is highlighted purple. That child passed the value through its single child, which passes it down to both of its two children, which are highlighted purple.">

Проп бурение

</Diagram>

</DiagramGroup>

Было замечательно, если бы существовал способ «телепортировать» данные в те компоненты дерева, которым они нужны, без передачи пропсов? С помощью функции React контекст это возможно!

## Контекст: альтернатива передачи пропсов {/*context-an-alternative-to-passing-props*/}

Контекст позволяет родительскому компоненту предоставлять данные всему дереву под ним. Существует множество вариантов использования контекста. Вот один из примеров. Рассмотрим компонент `Heading`, который принимает значение `level` для своего размера:

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

Было неплохо, если бы мы могли передавать параметр `level` в компонент `<Section>` и убирать его из `<Heading>`. Таким образом, мы можем добиться того, чтобы все заголовки в одном разделе имели одинаковый размер:

```js
<Section level={3}>
  <Heading>О нас</Heading>
  <Heading>Фото</Heading>
  <Heading>Видео</Heading>
</Section>
```

Но как компонент `<Heading>` может узнать уровень ближайшего к нему `<Section>`? **Это потребует от дочернего компонента какого-то способа «запрашивать» данные откуда-то сверху.**

С помощью одних только пропсов этого не сделать. Здесь на помощь приходит контекст. Вы можете сделать это в три шага:

1. **Создать** контекст. (Вы можете назвать его `LevelContext`, поскольку он предназначен для уровня заголовка).
2. **Использовать** этот контекст в компоненте, которому нужны данные. (`Heading` будет использовать `LevelContext`).
3. **Предоставить** этот контекст компоненту, определяющему данные. (`Section` предоставит `LevelContext`).

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

Импортируем хук `useContext` и ваш контекст из React:

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

Вместо этого удалите параметр `level` и прочитайте значение из контекста, который вы только что импортировали — `LevelContext`:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` — это хук. Как и `useState`, и `useReducer`, его можно вызывать только непосредственно внутри компонента React (не в циклах или условиях). **`useContext` сообщает React, что компонент `Heading` хочет получить данные из `LevelContext`.**

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

Если вы не укажете контекст, React будет использовать значение по умолчанию, которое вы указали на предыдущем шаге. В этом примере вы указали `1` в качестве аргумента для `createContext`, поэтому `useContext(LevelContext)` возвращает `1`, устанавливая для всех заголовков `<h1>` это значение. Давайте исправим эту проблему, заставив каждый `Section` предоставлять свой собственный контекст.

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

**Оберните их провайдером контекста**, чтобы предоставить им `LevelContext`:

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

Это тот же результат, что и в исходном коде, но вам не нужно передавать проп `level` каждому компоненту `Heading`! Вместо этого он «выясняет» уровень своего заголовка, запрашивая ближайший `Section` выше:

1. Вы передаёте проп `level` в `<Section>`.
2. `Section` оборачивает дочерние элементы в `<LevelContext.Provider value={level}>`.
3. `Heading` запрашивает ближайшее значение `LevelContext` с помощью `useContext(LevelContext)`.

## Использование и предоставление контекста в одном и том же компоненте {/*using-and-providing-context-from-the-same-component*/}

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

Так как контекст позволяет считывать информацию из компонента выше, каждый `Section` может считывать `level` из `Section` выше, и автоматически передавать `level + 1` вниз. Вот как это можно сделать:

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

Благодаря этому изменению вам не нужно передавать параметр `level` *какому либо* `<Section>` или `<Heading>`:

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

Теперь и `Heading`, и `Section` читают `LevelContext`, чтобы выяснить, насколько "глубоко" они находятся. А `Section` оборачивает свои дочерние элементы в `LevelContext`, чтобы указать, что все, что находится внутри него, находится на более "глубоком" уровне.

<Note>

В этом примере используются уровни заголовков, потому что они наглядно показывают, как вложенные компоненты могут переопределять контекст. Но контекст полезен и во многих других случаях. Вы можете передать любую информацию, необходимую всему поддереву: текущую цветовую тему, пользователя вошедшего в систему, и так далее.

</Note>

## Context passes through intermediate components {/*context-passes-through-intermediate-components*/}

You can insert as many components as you like between the component that provides context and the one that uses it. This includes both built-in components like `<div>` and components you might build yourself.

In this example, the same `Post` component (with a dashed border) is rendered at two different nesting levels. Notice that the `<Heading>` inside of it gets its level automatically from the closest `<Section>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
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

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

You didn't do anything special for this to work. A `Section` specifies the context for the tree inside it, so you can insert a `<Heading>` anywhere, and it will have the correct size. Try it in the sandbox above!

**Context lets you write components that "adapt to their surroundings" and display themselves differently depending on _where_ (or, in other words, _in which context_) they are being rendered.**

How context works might remind you of [CSS property inheritance.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) In CSS, you can specify `color: blue` for a `<div>`, and any DOM node inside of it, no matter how deep, will inherit that color unless some other DOM node in the middle overrides it with `color: green`. Similarly, in React, the only way to override some context coming from above is to wrap children into a context provider with a different value.

In CSS, different properties like `color` and `background-color` don't override each other. You can set all  `<div>`'s `color` to red without impacting `background-color`. Similarly, **different React contexts don't override each other.** Each context that you make with `createContext()` is completely separate from other ones, and ties together components using and providing *that particular* context. One component may use or provide many different contexts without a problem.

## Before you use context {/*before-you-use-context*/}

Context is very tempting to use! However, this also means it's too easy to overuse it. **Just because you need to pass some props several levels deep doesn't mean you should put that information into context.**

Here's a few alternatives you should consider before using context:

1. **Start by [passing props.](/learn/passing-props-to-a-component)** If your components are not trivial, it's not unusual to pass a dozen props down through a dozen components. It may feel like a slog, but it makes it very clear which components use which data! The person maintaining your code will be glad you've made the data flow explicit with props.
2. **Extract components and [pass JSX as `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) to them.** If you pass some data through many layers of intermediate components that don't use that data (and only pass it further down), this often means that you forgot to extract some components along the way. For example, maybe you pass data props like `posts` to visual components that don't use them directly, like `<Layout posts={posts} />`. Instead, make `Layout` take `children` as a prop, and render `<Layout><Posts posts={posts} /></Layout>`. This reduces the number of layers between the component specifying the data and the one that needs it.

If neither of these approaches works well for you, consider context.

## Use cases for context {/*use-cases-for-context*/}

* **Theming:** If your app lets the user change its appearance (e.g. dark mode), you can put a context provider at the top of your app, and use that context in components that need to adjust their visual look.
* **Current account:** Many components might need to know the currently logged in user. Putting it in context makes it convenient to read it anywhere in the tree. Some apps also let you operate multiple accounts at the same time (e.g. to leave a comment as a different user). In those cases, it can be convenient to wrap a part of the UI into a nested provider with a different current account value.
* **Routing:** Most routing solutions use context internally to hold the current route. This is how every link "knows" whether it's active or not. If you build your own router, you might want to do it too.
* **Managing state:** As your app grows, you might end up with a lot of state closer to the top of your app. Many distant components below may want to change it. It is common to [use a reducer together with context](/learn/scaling-up-with-reducer-and-context) to manage complex state and pass it down to distant components without too much hassle.
  
Context is not limited to static values. If you pass a different value on the next render, React will update all the components reading it below! This is why context is often used in combination with state.

In general, if some information is needed by distant components in different parts of the tree, it's a good indication that context will help you.

<Recap>

* Context lets a component provide some information to the entire tree below it.
* To pass context:
  1. Create and export it with `export const MyContext = createContext(defaultValue)`.
  2. Pass it to the `useContext(MyContext)` Hook to read it in any child component, no matter how deep.
  3. Wrap children into `<MyContext.Provider value={...}>` to provide it from a parent.
* Context passes through any components in the middle.
* Context lets you write components that "adapt to their surroundings".
* Before you use context, try passing props or passing JSX as `children`.

</Recap>

<Challenges>

#### Replace prop drilling with context {/*replace-prop-drilling-with-context*/}

In this example, toggling the checkbox changes the `imageSize` prop passed to each `<PlaceImage>`. The checkbox state is held in the top-level `App` component, but each `<PlaceImage>` needs to be aware of it.

Currently, `App` passes `imageSize` to `List`, which passes it to each `Place`, which passes it to the `PlaceImage`. Remove the `imageSize` prop, and instead pass it from the `App` component directly to `PlaceImage`.

You can declare context in `Context.js`.

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
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
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

Remove `imageSize` prop from all the components.

Create and export `ImageSizeContext` from `Context.js`. Then wrap the List into `<ImageSizeContext.Provider value={imageSize}>` to pass the value down, and `useContext(ImageSizeContext)` to read it in the `PlaceImage`:

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
        Use large images
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

Note how components in the middle don't need to pass `imageSize` anymore.

</Solution>

</Challenges>
