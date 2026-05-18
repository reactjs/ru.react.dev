---
title: createRef
---
<Pitfall>

`createRef` в основном используется для [классовых компонентов](/reference/react/Component). Функциональные компоненты обычно вместо этого используют [`useRef`](/reference/react/useRef).

</Pitfall>

<Intro>

`createRef` создаёт [реф](/learn/referencing-values-with-refs) объект, который может содержать произвольное значение.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `createRef()` {/*createref*/}

Вызовите `createRef` для объявления [рефа](/learn/referencing-values-with-refs) внутри [классового компонента.](/reference/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

`createRef` не принимает параметров.

#### Возвращаемое значение {/*returns*/}

`createRef` возвращает объект с одним свойством:

* `current`: Изначально установлено в `null`. Позже вы можете установить его в другое значение. Если вы передадите реф-объект в React как атрибут `ref` узлу JSX, React установит его свойство `current`.

#### Особенности {/*caveats*/}

* `createRef` всегда возвращает *разный* объект. Это эквивалентно написанию `{ current: null }` самостоятельно.
* В функциональном компоненте вы, вероятно, захотите использовать [`useRef`](/reference/react/useRef) вместо этого, который всегда возвращает один и тот же объект.
* `const ref = useRef()` эквивалентно `const [ref, _] = useState(() => createRef(null))`.

---

## Использование {/*usage*/}

### Объявление рефа в классовом компоненте {/*declaring-a-ref-in-a-class-component*/}

Чтобы объявить реф внутри [классового компонента,](/reference/react/Component) вызовите `createRef` и присвойте результат полю класса:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Если вы теперь передадите `ref={this.inputRef}` элементу `<input>` в вашем JSX, React заполнит `this.inputRef.current` DOM-узлом ввода. Например, вот как сделать кнопку, которая фокусирует ввод:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` в основном используется для [классовых компонентов](/reference/react/Component). Функциональные компоненты обычно вместо этого используют [`useRef`](/reference/react/useRef).

</Pitfall>

---

## Альтернативы {/*alternatives*/}

### Миграция из класса с `createRef` в функцию с `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Мы рекомендуем использовать функциональные компоненты вместо [классовых компонентов](/reference/react/Component) в новом коде. Если у вас есть существующие классовые компоненты, использующие `createRef`, вот как вы можете их преобразовать. Это оригинальный код:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

При [преобразовании этого компонента из класса в функцию](/reference/react/Component#alternatives) замените вызовы `createRef` вызовами [`useRef`:](/reference/react/useRef)

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>