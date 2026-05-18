---
title: PureComponent
---
<Pitfall>

Мы рекомендуем определять компоненты как функции, а не как классы. [См. как выполнить миграцию.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` похож на [`Component`](/reference/react/Component), но он пропускает повторные рендеры при одинаковых пропсах и состоянии. Классовые компоненты по-прежнему поддерживаются React, но мы не рекомендуем использовать их в новом коде.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Чтобы пропустить повторный рендер классового компонента при одинаковых пропсах и состоянии, наследуйте `PureComponent` вместо [`Component`:](/reference/react/Component)

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` является подклассом `Component` и поддерживает [все API `Component`.](/reference/react/Component#reference) Наследование `PureComponent` эквивалентно определению пользовательского метода [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate), который выполняет поверхностное сравнение пропсов и состояния.


[См. больше примеров ниже.](#usage)

---

## Использование {/*usage*/}

### Пропуск ненужных повторных рендеров для классовых компонентов {/*skipping-unnecessary-re-renders-for-class-components*/}

React обычно повторно рендерит компонент всякий раз, когда рендерится его родитель. В качестве оптимизации вы можете создать компонент, который React не будет повторно рендерить, когда рендерится его родитель, при условии, что его новые пропсы и состояние совпадают со старыми пропсами и состоянием. [Классовые компоненты](/reference/react/Component) могут использовать это поведение, наследуя `PureComponent`:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React-компонент всегда должен иметь [чистую логику рендеринга.](/learn/keeping-components-pure) Это означает, что он должен возвращать одинаковый результат, если его пропсы, состояние и контекст не изменились. Используя `PureComponent`, вы сообщаете React, что ваш компонент соответствует этому требованию, поэтому React не нужно повторно рендерить его, пока его пропсы и состояние не изменятся. Однако ваш компонент всё равно будет повторно рендериться, если изменится контекст, который он использует.

В этом примере обратите внимание, что компонент `Greeting` повторно рендерится при каждом изменении `name` (поскольку это один из его пропсов), но не при изменении `address` (поскольку он не передаётся в `Greeting` как пропс):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Мы рекомендуем определять компоненты как функции, а не как классы. [См. как выполнить миграцию.](#alternatives)

</Pitfall>

---

## Альтернативы {/*alternatives*/}

### Миграция классового компонента `PureComponent` на функцию {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Мы рекомендуем использовать функциональные компоненты вместо [классовых компонентов](/reference/react/Component) в новом коде. Если у вас есть существующие классовые компоненты, использующие `PureComponent`, вот как вы можете их преобразовать. Это исходный код:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Когда вы [преобразуете этот компонент из класса в функцию,](/reference/react/Component#alternatives) оберните его в [`memo`:](/reference/react/memo)

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

В отличие от `PureComponent`, [`memo`](/reference/react/memo) не сравнивает новое и старое состояние. В функциональных компонентах вызов [`set` функции](/reference/react/useState#setstate) с тем же состоянием [уже предотвращает повторные рендеры по умолчанию,](/reference/react/memo#updating-a-memoized-component-using-state) даже без `memo`.

</Note>