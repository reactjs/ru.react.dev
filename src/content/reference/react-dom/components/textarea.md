---
title: "<textarea>"
---
<Intro>

Встроенный браузерный компонент [`<textarea>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea) позволяет отображать многострочное текстовое поле.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<textarea>` {/*textarea*/}

Чтобы отобразить текстовую область, используйте встроенный браузерный компонент [`<textarea>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[См. примеры ниже.](#usage)

#### Пропсы {/*props*/}

`<textarea>` поддерживает все [общие пропсы элементов.](/reference/react-dom/components/common#props)

Вы можете [сделать текстовую область управляемой](#controlling-a-text-area-with-a-state-variable), передав ей пропс `value`:

* `value`: Строка. Управляет текстом внутри текстовой области.

Когда вы передаёте `value`, вы также должны передать обработчик `onChange`, который обновляет переданное значение.

Если ваша `<textarea>` не является управляемой, вы можете вместо этого передать пропс `defaultValue`:

* `defaultValue`: Строка. Задаёт [начальное значение](#providing-an-initial-value-for-a-text-area) для текстовой области.

Эти пропсы `<textarea>` актуальны как для неуправляемых, так и для управляемых текстовых областей:

* [`autoComplete`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#autocomplete): `'on'` или `'off'`. Задаёт поведение автозаполнения.
* [`autoFocus`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#autofocus): Булево значение. Если `true`, React сфокусируется на элементе при его монтировании.
* `children`: `<textarea>` не принимает дочерние элементы. Чтобы задать начальное значение, используйте `defaultValue`.
* [`cols`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#cols): Число. Задаёт ширину по умолчанию в среднем количестве символов. По умолчанию `20`.
* [`disabled`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#disabled): Булево значение. Если `true`, ввод будет неинтерактивным и будет выглядеть затемнённым.
* [`form`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#form): Строка. Задаёт `id` формы `<form>`, к которой принадлежит этот ввод. Если опущено, используется ближайшая родительская форма.
* [`maxLength`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#maxlength): Число. Задаёт максимальную длину текста.
* [`minLength`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#minlength): Число. Задаёт минимальную длину текста.
* [`name`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#name): Строка. Задаёт имя для этого ввода, которое [отправляется вместе с формой.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: Функция [`Event` handler](/reference/react-dom/components/common#event-handler). Требуется для [управляемых текстовых областей.](#controlling-a-text-area-with-a-state-variable) Срабатывает немедленно при изменении значения ввода пользователем (например, срабатывает при каждом нажатии клавиши). Работает аналогично браузерному событию [`input`.](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Версия `onChange`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/input_event): Функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает немедленно при изменении значения пользователем. По историческим причинам в React идиоматично использовать `onChange`, который работает аналогично.
* `onInputCapture`: Версия `onInput`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement/invalid_event): Функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает, если ввод не прошёл валидацию при отправке формы. В отличие от встроенного события `invalid`, событие React `onInvalid` всплывает.
* `onInvalidCapture`: Версия `onInvalid`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/ru/docs/Web/API/HTMLTextAreaElement/select_event): Функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает после изменения выделения внутри `<textarea>`. React расширяет событие `onSelect`, чтобы оно срабатывало также для пустого выделения и при редактировании (что может повлиять на выделение).
* `onSelectCapture`: Версия `onSelect`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#placeholder): Строка. Отображается приглушённым цветом, когда значение текстовой области пустое.
* [`readOnly`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#readonly): Булево значение. Если `true`, текстовая область не может быть отредактирована пользователем.
* [`required`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#required): Булево значение. Если `true`, значение должно быть предоставлено для отправки формы.
* [`rows`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#rows): Число. Задаёт высоту по умолчанию в среднем количестве строк символов. По умолчанию `2`.
* [`wrap`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#wrap): `'hard'`, `'soft'` или `'off'`. Задаёт, как текст должен быть перенесён при отправке формы.

#### Ограничения {/*caveats*/}

- Передача дочерних элементов, таких как `<textarea>что-то</textarea>`, не разрешена. [Используйте `defaultValue` для начального содержимого.](#providing-an-initial-value-for-a-text-area)
- Если текстовой области передаётся строковый пропс `value`, она будет [считаться управляемой.](#controlling-a-text-area-with-a-state-variable)
- Текстовая область не может быть одновременно управляемой и неуправляемой.
- Текстовая область не может переключаться между управляемым и неуправляемым состоянием в течение своего жизненного цикла.
- Каждая управляемая текстовая область требует обработчика события `onChange`, который синхронно обновляет её базовое значение.

---

## Использование {/*usage*/}

### Отображение текстовой области {/*displaying-a-text-area*/}

Отобразите `<textarea>`, чтобы показать текстовую область. Вы можете указать её размер по умолчанию с помощью атрибутов [`rows`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#rows) и [`cols`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#cols), но по умолчанию пользователь сможет изменять её размер. Чтобы отключить изменение размера, вы можете указать `resize: none` в CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Предоставление метки для текстовой области {/*providing-a-label-for-a-text-area*/}

Обычно вы помещаете каждую `<textarea>` внутрь тега [`<label>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/label). Это сообщает браузеру, что эта метка связана с этой текстовой областью. Когда пользователь нажимает на метку, браузер фокусирует текстовую область. Это также важно для доступности: программа чтения с экрана объявит заголовок метки, когда пользователь сфокусируется на текстовой области.

Если вы не можете вложить `<textarea>` в `<label>`, свяжите их, передав одинаковый `id` в `<textarea id>` и [`<label htmlFor>`.](https://developer.mozilla.org/ru/docs/Web/API/HTMLLabelElement/htmlFor) Чтобы избежать конфликтов между экземплярами одного компонента, сгенерируйте такой `id` с помощью [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Предоставление начального значения для текстовой области {/*providing-an-initial-value-for-a-text-area*/}

Вы можете опционально указать начальное значение для текстовой области. Передайте его как строку `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

В отличие от HTML, передача начального текста в виде `<textarea>Какой-то текст</textarea>` не поддерживается.

</Pitfall>

---

### Чтение значения текстовой области при отправке формы {/*reading-the-text-area-value-when-submitting-a-form*/}

Добавьте [`<form>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form) вокруг вашей текстовой области с [`<button type="submit">`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/button) внутри. Это вызовет ваш обработчик события `<form onSubmit>`. По умолчанию браузер отправит данные формы на текущий URL и перезагрузит страницу. Вы можете переопределить это поведение, вызвав `e.preventDefault()`. Прочитайте данные формы с помощью [`new FormData(e.target)`](https://developer.mozilla.org/ru/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Присвойте `name` вашей `<textarea>`, например `<textarea name="postContent" />`. Указанное вами имя будет использоваться как ключ в данных формы, например `{ postContent: "Ваш пост" }`.

</Note>

<Pitfall>

По умолчанию *любая* кнопка `<button>` внутри `<form>` отправляет её. Это может быть неожиданно! Если у вас есть собственный компонент `Button` React, рассмотрите возможность возврата [`<button type="button">`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input/button) вместо `<button>`. Затем, чтобы быть явным, используйте `<button type="submit">` для кнопок, которые *должны* отправлять форму.

</Pitfall>

---

### Управление текстовой областью с помощью переменной состояния {/*controlling-a-text-area-with-a-state-variable*/}

Текстовая область, такая как `<textarea />`, является *неуправляемой*. Даже если вы [передаёте начальное значение](#providing-an-initial-value-for-a-text-area), например `<textarea defaultValue="Начальный текст" />`, ваш JSX указывает только начальное значение, а не текущее.

**Чтобы отобразить _управляемую_ текстовую область, передайте ей пропс `value`.** React будет принудительно устанавливать для текстовой области значение, которое вы передали. Обычно вы управляете текстовой областью, объявляя [переменную состояния:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Объявите переменную состояния...
  // ...
  return (
    <textarea
      value={postContent} // ...принудительно установите значение поля ввода в соответствии с переменной состояния...
      onChange={e => setPostContent(e.target.value)} // ...и обновляйте переменную состояния при каждом редактировании!
    />
  );
}
```

Это полезно, если вы хотите перерисовать часть пользовательского интерфейса в ответ на каждое нажатие клавиши.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**Если вы передаёте `value` без `onChange`, вводить текст в текстовую область будет невозможно.** Когда вы управляете текстовой областью, передавая ей какое-либо значение `value`, вы *принуждаете* её всегда иметь то значение, которое вы указали. Поэтому, если вы передаёте переменную состояния как `value`, но забываете синхронно обновлять эту переменную состояния в обработчике события `onChange`, React будет откатывать текстовую область после каждого нажатия клавиши к значению, которое вы указали.

</Pitfall>

---

## Устранение неполадок {/*troubleshooting*/}

### Моя текстовая область не обновляется при вводе текста {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Если вы отображаете текстовую область с `value`, но без `onChange`, вы увидите ошибку в консоли:

```js
// 🔴 Ошибка: управляемое текстовое поле без обработчика onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Как предполагает сообщение об ошибке, если вы хотели только [указать *начальное* значение,](#providing-an-initial-value-for-a-text-area) вместо этого используйте `defaultValue`:

```js
// ✅ Хорошо: неуправляемое текстовое поле с начальным значением
<textarea defaultValue={something} />
```

Если вы хотите [управлять этой текстовой областью с помощью переменной состояния,](#controlling-a-text-area-with-a-state-variable) укажите обработчик `onChange`:

```js
// ✅ Хорошо: управляемое текстовое поле с onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Если значение намеренно только для чтения, добавьте пропс `readOnly`, чтобы подавить ошибку:

```js
// ✅ Хорошо: управляемое текстовое поле только для чтения без onChange
<textarea value={something} readOnly={true} />
```

---

### Курсор моей текстовой области перемещается в начало при каждом нажатии клавиши {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Если вы [управляете текстовой областью,](#controlling-a-text-area-with-a-state-variable) вы должны обновлять её переменную состояния значением текстовой области из DOM во время `onChange`.

Вы не можете обновлять её чем-то другим, кроме `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Ошибка: обновление поля ввода чем-то, кроме e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Вы также не можете обновлять её асинхронно:

```js
function handleChange(e) {
  // 🔴 Ошибка: асинхронное обновление поля ввода
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Чтобы исправить ваш код, обновляйте его синхронно до `e.target.value`:

```js
function handleChange(e) {
  // ✅ Синхронное обновление управляемого поля ввода до e.target.value
  setFirstName(e.target.value);
}
```

Если это не решает проблему, возможно, текстовая область удаляется и повторно добавляется из DOM при каждом нажатии клавиши. Это может произойти, если вы случайно [сбрасываете состояние](/learn/preserving-and-resetting-state) при каждом перерендере. Например, это может произойти, если текстовая область или один из её родительских элементов всегда получает другой атрибут `key`, или если вы вкладываете определения компонентов (что не разрешено в React и приводит к повторному монтированию "внутреннего" компонента при каждом рендере).

---

### Я получаю ошибку: "Компонент изменяет неуправляемый ввод на управляемый" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Если вы передаёте `value` компоненту, он должен оставаться строкой на протяжении всего своего жизненного цикла.

Вы не можете сначала передать `value={undefined}`, а затем передать `value="какая-то строка"`, потому что React не будет знать, хотите ли вы, чтобы компонент был неуправляемым или управляемым. Управляемый компонент всегда должен получать строковое значение `value`, а не `null` или `undefined`.

Если ваше значение поступает из API или переменной состояния, оно может быть инициализировано как `null` или `undefined`. В этом случае либо установите его как пустую строку (`''`) изначально, либо передайте `value={someValue ?? ''}`, чтобы гарантировать, что `value` является строкой.