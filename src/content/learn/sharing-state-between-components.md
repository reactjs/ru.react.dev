---
title: Sharing State Between Components
---

<Intro>

Иногда вам нужно, чтобы состояние двух компонентов изменялось одновременно. Для этого удалите состояние из обоих компонентов, переместите его в их ближайший общий родительский компонент, а затем передайте его им через пропсы. Это называется *подъём состояния вверх*, и это одна из самых частых операций при написании кода на React.

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

Обратите внимание, что нажатие кнопки одной панели не влияет на другую — они независимы.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Диаграмма, показывающая дерево из трех компонентов: один родительский компонент с меткой Accordion и два дочерних компонента с меткой Panel. Оба компонента Panel содержат isActive со значением false.">

Изначально состояние `isActive` каждого `Panel` равно `false`, поэтому обе панели отображаются в свернутом виде.

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Та же диаграмма, что и предыдущая, с выделенным состоянием isActive первого дочернего компонента Panel, указывающим на клик, со значением isActive, установленным в true. Второй компонент Panel по-прежнему содержит значение false.">

Нажатие кнопки любой из панелей `Panel` обновит только состояние `isActive` этой панели.

</Diagram>

</DiagramGroup>

**Но теперь давайте представим, что вы хотите изменить это так, чтобы в любой момент времени была развернута только одна панель.** При такой конструкции разворачивание второй панели должно сворачивать первую. Как бы вы это сделали?

Чтобы скоординировать эти две панели, вам нужно "поднять их состояние вверх" к родительскому компоненту в три шага:

1. **Удалите** состояние из дочерних компонентов.
2. **Передайте** жестко закодированные данные от общего родителя.
3. **Добавьте** состояние в общий родительский компонент и передайте его вместе с обработчиками событий.

Это позволит компоненту `Accordion` координировать обе панели `Panel` и разворачивать только одну за раз.

### Шаг 1: Удалите состояние из дочерних компонентов {/*step-1-remove-state-from-the-child-components*/}

Вы передадите контроль над `isActive` панели её родительскому компоненту. Это означает, что родительский компонент будет передавать `isActive` в `Panel` как пропс. Начните с **удаления этой строки** из компонента `Panel`:

```js
const [isActive, setIsActive] = useState(false);
```

И вместо этого добавьте `isActive` в список пропсов `Panel`:

```js
function Panel({ title, children, isActive }) {
```

Теперь родительский компонент `Panel` может *контролировать* `isActive`, [передавая его как пропс.](/learn/passing-props-to-a-component) Напротив, компонент `Panel` теперь *не контролирует* значение `isActive` — теперь это зависит от родительского компонента!

### Шаг 2: Передайте жестко зако