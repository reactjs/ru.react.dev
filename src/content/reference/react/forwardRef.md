---
title: forwardRef
---
<Deprecated>

В React 19 `forwardRef` больше не нужен. Вместо этого передавайте `ref` как пропс.

`forwardRef` будет устаревшим в будущем релизе. Узнайте больше [здесь](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

`forwardRef` позволяет вашему компоненту предоставить DOM-узел родительскому компоненту с помощью [ref.](/learn/manipulating-the-dom-with-refs)

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Вызовите `forwardRef()`, чтобы ваш компонент мог принимать ref и передавать его дочернему компоненту:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `render`: Функция рендеринга для вашего компонента. React вызывает эту функцию с пропсами и `ref`, которые ваш компонент получил от родителя. Возвращаемый вами JSX будет результатом работы вашего компонента.

#### Возвращает {/*returns*/}

`forwardRef` возвращает React-компонент, который вы можете рендерить в JSX. В отличие от React-компонентов, определённых как обычные функции, компонент, возвращаемый `forwardRef`, также способен принимать пропс `ref`.

#### Особенности {/*caveats*/}

* В Strict Mode React **дважды вызовет вашу функцию рендеринга**, чтобы [помочь вам найти случайные примеси.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Это поведение только для разработки и не влияет на продакшен. Если ваша функция рендеринга является чистой (как и должно быть), это не должно повлиять на логику вашего компонента. Результат одного из вызовов будет проигнорирован.


---

### Функция `render` {/*render-function*/}

`forwardRef` принимает функцию рендеринга в качестве аргумента. React вызывает эту функцию с `props` и `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Параметры {/*render-parameters*/}

* `props`: Пропсы, переданные родительским компонентом.

* `ref`: Атрибут `ref`, переданный родительским компонентом. `ref` может быть объектом или функцией. Если родительский компонент не передал ref, он будет `null`. Вы должны либо передать полученный `ref` другому компоненту, либо передать его в [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### Возвращает {/*render-returns*/}

`forwardRef` возвращает React-компонент, который вы можете рендерить в JSX. В отличие от React-компонентов, определённых как обычные функции, компонент, возвращаемый `forwardRef`, способен принимать пропс `ref`.

---

## Использование {/*usage*/}

### Предоставление DOM-узла родительскому компоненту {/*exposing-a-dom-node-to-the-parent-component*/}

По умолчанию DOM-узлы каждого компонента являются приватными. Однако иногда бывает полезно предоставить DOM-узел родителю — например, чтобы позволить ему сфокусироваться на нём. Чтобы включить эту возможность, оберните определение вашего компонента в `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Вы получите <CodeStep step={1}>ref</CodeStep> как второй аргумент после пропсов. Передайте его DOM-узлу, который вы хотите предоставить:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Это позволяет родительскому компоненту `Form` получить доступ к DOM-узлу `<input>`, предоставленному `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Этот компонент `Form` [передаёт ref](/reference/react/useRef#manipulating-the-dom-with-a-ref) в `MyInput`. Компонент `MyInput` *перенаправляет* этот ref в браузерный тег `<input>`. В результате компонент `Form` может получить доступ к этому DOM-узлу `<input>` и вызвать на нём [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus).

Имейте в виду, что предоставление ref к DOM-узлу внутри вашего компонента затрудняет изменение внутренних данных вашего компонента в будущем. Обычно вы будете предоставлять DOM-узлы из повторно используемых низкоуровневых компонентов, таких как кнопки или текстовые поля ввода, но не для компонентов уровня приложения, таких как аватар или комментарий.

<Recipes titleText="Примеры перенаправления ref">

#### Фокусировка текстового поля ввода {/*focusing-a-text-input*/}

Нажатие на кнопку сфокусирует поле ввода. Компонент `Form` определяет ref и передаёт его компоненту `MyInput`. Компонент `MyInput` перенаправляет этот ref в браузерное поле ввода `<input>`. Это позволяет компоненту `Form` сфокусироваться на `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Воспроизведение и пауза видео {/*playing-and-pausing-a-video*/}

Нажатие на кнопку вызовет [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) и [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) на DOM-узле `<video>`. Компонент `App` определяет ref и передаёт его компоненту `MyVideoPlayer`. Компонент `MyVideoPlayer` перенаправляет этот ref в браузерный узел `<video>`. Это позволяет компоненту `App` воспроизводить и ставить на паузу `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Перенаправление ref через несколько компонентов {/*forwarding-a-ref-through-multiple-components*/}

Вместо перенаправления `ref` на DOM-узел, вы можете перенаправить его на собственный компонент, такой как `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Если этот компонент `MyInput` перенаправляет ref на свой `<input>`, то ref на `FormField` даст вам этот `<input>`:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Компонент `Form` определяет ref и передаёт его `FormField`. Компонент `FormField` перенаправляет этот ref в `MyInput`, который перенаправляет его в DOM-узел браузерного `<input>`. Таким образом `Form` получает доступ к этому DOM-узлу.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Предоставление императивного обработчика вместо DOM-узла {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Вместо предоставления всего DOM-узла, вы можете предоставить пользовательский объект, называемый *императивным обработчиком*, с более ограниченным набором методов. Для этого вам потребуется определить отдельный ref для хранения DOM-узла:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Передайте полученный `ref` в [`useImperativeHandle`](/reference/react/useImperativeHandle) и укажите значение, которое вы хотите предоставить для `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Если какой-либо компонент получит ref на `MyInput`, он получит только ваш объект `{ focus, scrollIntoView }` вместо DOM-узла. Это позволяет вам ограничить информацию, которую вы предоставляете о вашем DOM-узле, до минимума.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Это не сработает, потому что DOM-узел не предоставлен:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Подробнее об использовании императивных обработчиков.](/reference/react/useImperativeHandle)

<Pitfall>

**Не злоупотребляйте refs.** Используйте refs только для *императивных* действий, которые вы не можете выразить через пропсы: например, прокрутка к узлу, фокусировка на узле, запуск анимации, выделение текста и т. д.

**Если вы можете выразить что-то через пропс, вам не следует использовать ref.** Например, вместо предоставления императивного обработчика вроде `{ open, close }` из компонента `Modal`, лучше принять `isOpen` как пропс, например `<Modal isOpen={isOpen} />`. [Эффекты](/learn/synchronizing-with-effects) могут помочь вам предоставлять императивные действия через пропсы.

</Pitfall>

---

## Устранение неполадок {/*troubleshooting*/}

### Мой компонент обёрнут в `forwardRef`, но `ref` на него всегда `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Обычно это означает, что вы забыли фактически использовать полученный `ref`.

Например, этот компонент ничего не делает с `ref`:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Чтобы исправить это, передайте `ref` вниз к DOM-узлу или другому компоненту, который может принять ref:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`ref` на `MyInput` также может быть `null`, если некоторая логика является условной:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Если `showInput` равно `false`, то ref не будет перенаправлен ни к одному узлу, и ref на `MyInput` останется пустым. Это особенно легко упустить, если условие скрыто внутри другого компонента, как `Panel` в этом примере:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```