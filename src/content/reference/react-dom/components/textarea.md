---
title: "Помогает вам создавать пользовательские интерфейсы с помощью React.

  </textarea>"
---
```
<Intro>

[Встроенный компонент браузера `<textarea>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea) позволяет отображать многострочный ввод текста.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<textarea>` {/*textarea*/}

Чтобы отобразить текстовую область, отрендерите [встроенный компонент браузера `<textarea>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

`<textarea>` поддерживает все [общие пропсы элементов.](/reference/react-dom/components/common#props)

Вы можете [сделать текстовую область управляемой](#controlling-a-text-area-with-a-state-variable), передав проп `value`:

* `value`: строка. Управляет текстом внутри текстовой области.

Когда вы передаёте `value`, вы также должны передать обработчик `onChange`, который обновляет переданное значение.

Если ваш `<textarea>` неуправляемый, вы можете вместо этого передать проп `defaultValue`:

* `defaultValue`: строка. Указывает [начальное значение](#providing-an-initial-value-for-a-text-area) для текстовой области.

Эти пропсы `<textarea>` актуальны как для неуправляемых, так и для управляемых текстовых областей:

* [`autoComplete`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#autocomplete): либо `'on'`, либо `'off'`. Указывает поведение автозаполнения.
* [`autoFocus`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#autofocus): логическое значение. Если `true`, React сфокусирует элемент при монтировании.
* `children`: `<textarea>` не принимает дочерние элементы. Чтобы установить начальное значение, используйте `defaultValue`.
* [`cols`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#cols): число. Указывает ширину по умолчанию в средних ширинах символов. По умолчанию `20`.
* [`disabled`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#disabled): логическое значение. Если `true`, ввод не будет интерактивным и будет отображаться тусклым.
* [`form`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#form): строка. Указывает `id` `<form>`, которому принадлежит этот ввод. Если опущено, это ближайшая родительская форма.
* [`maxLength`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#maxlength): число. Указывает максимальную длину текста.
* [`minLength`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#minlength): число. Указывает минимальную длину текста.
* [`name`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#name): строка. Указывает имя для этого ввода, которое [отправляется с формой.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: функция [`Event` handler](/reference/react-dom/components/common#event-handler). Требуется для [управляемых текстовых областей.](#controlling-a-text-area-with-a-state-variable) Срабатывает сразу, когда значение ввода изменяется пользователем (например, срабатывает при каждом нажатии клавиши). Ведёт себя как [событие `input`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/input_event) браузера.
* `onChangeCapture`: версия `onChange`, которая срабатывает на [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/input_event): функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает сразу, когда значение изменяется пользователем. По историческим причинам в React принято использовать `onChange` вместо этого, который работает аналогично.
* `onInputCapture`: версия `onInput`, которая срабатывает на [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement/invalid_event): функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает, если ввод не проходит проверку при отправке формы. В отличие от встроенного события `invalid`, событие React `onInvalid` всплывает.
* `onInvalidCapture`: версия `onInvalid`, которая срабатывает на [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/ru/docs/Web/API/HTMLTextAreaElement/select_event): функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает после изменения выделения внутри `<textarea>`. React расширяет событие `onSelect`, чтобы оно также срабатывало для пустого выделения и при редактировании (что может повлиять на выделение).
* `onSelectCapture`: версия `onSelect`, которая срабатывает на [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#placeholder): строка. Отображается тусклым цветом, когда значение текстовой области пусто.
* [`readOnly`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#readonly): логическое значение. Если `true`, текстовую область нельзя редактировать пользователем.
* [`required`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#required): логическое значение. Если `true`, значение должно быть предоставлено для отправки формы.
* [`rows`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#rows): число. Указывает высоту по умолчанию в средних высотах символов. По умолчанию `2`.
* [`wrap`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#wrap): либо `'hard'`, `'soft'`, либо `'off'`. Указывает, как текст должен переноситься при отправке формы.

#### Предостережения {/*caveats*/}

- Передача дочерних элементов, таких как `<textarea>something</textarea>`, не допускается. [Используйте `defaultValue` для начального контента.](#providing-an-initial-value-for-a-text-area)
- Если текстовая область получает строковый проп `value`, она будет [рассматриваться как управляемая.](#controlling-a-text-area-with-a-state-variable)
- Текстовая область не может быть одновременно управляемой и неуправляемой.
- Текстовая область не может переключаться между управляемой и неуправляемой в течение своего жизненного цикла.
- Каждая управляемая текстовая область нуждается в обработчике события `onChange`, который синхронно обновляет её базовое значение.

---

## Использование {/*usage*/}

### Отображение текстовой области {/*displaying-a-text-area*/}

Отрендерите `<textarea>`, чтобы отобразить текстовую область. Вы можете указать её размер по умолчанию с помощью атрибутов [`rows`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#rows) и [`cols`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/textarea#cols), но по умолчанию пользователь сможет изменить её размер. Чтобы отключить изменение размера, вы можете указать `resize: none` в CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Напишите свой пост:
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

Обычно вы будете помещать каждый `<textarea>` внутрь тега [`<label>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/label). Это сообщает браузеру, что эта метка связана с этой текстовой областью. Когда пользователь нажимает на метку, браузер фокусирует текстовую область. Это также важно для доступности: программа чтения с экрана объявит заголовок метки, когда пользователь сфокусирует текстовую область.

Если вы не можете вложить `<textarea>` в `<label>`, свяжите их, передав один и тот же ID в `<textarea id>` и [`<label htmlFor>`.](https://developer.mozilla.org/ru/docs/Web/API/HTMLLabelElement/htmlFor) Чтобы избежать конфликтов между экземплярами одного компонента, сгенерируйте такой ID с помощью [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Напишите свой пост:
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

При необходимости вы можете указать начальное значение для текстовой области. Передайте его как строку `defaultValue`.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Отредактируйте свой пост:
      <textarea
        name="postContent"
        defaultValue="Мне очень понравилось кататься на велосипеде вчера!"
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

В отличие от HTML, передача начального текста, такого как `<textarea>Какой-то контент</textarea>`, не поддерживается.

</Pitfall>

---

### Чтение значения текстовой области при отправке формы {/*reading-the-textarea-value-when-submitting-a-form*/}

Добавьте [`<form>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form) вокруг вашей текстовой области с [`<button type="submit">`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/button) внутри. Он вызовет ваш обработчик события `<form onSubmit>`. По умолчанию браузер отправит данные формы на текущий URL и обновит страницу. Вы можете переопределить это поведение, вызвав `e.preventDefault()`. Прочтите данные формы с помощью [`new FormData(e.target)`](https://developer.mozilla.org/ru/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Предотвратить перезагрузку страницы браузером
    e.preventDefault();

    // Прочитать данные формы
    const form = e.target;
    const formData = new FormData(form);

    // Вы можете передать formData в качестве тела запроса fetch напрямую:
    fetch('/some-api', { method: form.method, body: formData });

    // Или вы можете работать с ним как с простым объектом:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Заголовок поста: <input name="postTitle" defaultValue="Катание на велосипеде" />
      </label>
      <label>
        Отредактируйте свой пост:
        <textarea
          name="postContent"
          defaultValue="Мне очень понравилось кататься на велосипеде вчера!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Сбросить изменения</button>
      <button type="submit">Сохранить пост</button>
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

Дайте `name` вашей `<textarea>`, например `<textarea name="postContent" />`. Указанное вами `name` будет использоваться в качестве ключа в данных формы, например `{ postContent: "Ваш пост" }`.

</Note>

<Pitfall>

По умолчанию *любая* `<button>` внутри `<form>` отправит её. Это может быть неожиданностью! Если у вас есть свой собственный пользовательский React-компонент `Button`, рассмотрите возможность возврата [`<button type="button">`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input/button) вместо `<button>`. Затем, чтобы быть явным, используйте `<button type="submit">` для кнопок, которые *должны* отправлять форму.

</Pitfall>

---

### Управление текстовой областью с помощью переменной состояния {/*controlling-a-text-area-with-a-state-variable*/}

Текстовая область, такая как `<textarea />`, является *неуправляемой*. Даже если вы [передаёте начальное значение](#providing-an-initial-value-for-a-text-area), например `<textarea defaultValue="Initial text" />`, ваш JSX указывает только начальное значение, а не текущее значение.

**Чтобы отобразить _управляемую_ текстовую область, передайте ей проп `value`.** React заставит текстовую область всегда иметь переданное вами `value`. Обычно вы будете управлять текстовой областью, объявляя [переменную состояния:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Объявите переменную состояния...
  // ...
  return (
    <textarea
      value={postContent} // ...заставьте значение ввода соответствовать переменной состояния...
      onChange={e => setPostContent(e.target.value)} // ... и обновляйте переменную состояния при любых изменениях!
    />
  );
}
```

Это полезно, если вы хотите перерендерить какую-то часть пользовательского интерфейса в ответ на каждое нажатие клавиши.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Введите немного markdown:
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

**Если вы передаёте `value` без `onChange`, будет невозможно печатать в текстовой области.** Когда вы управляете текстовой областью, передавая ей какое-то `value`, вы *заставляете* её всегда иметь переданное вами значение. Поэтому, если вы передаёте переменную состояния в качестве `value`, но забываете синхронно обновить эту переменную состояния во время обработчика события `onChange`, React вернёт текстовую область после каждого нажатия клавиши обратно к указанному вами `value`.

</Pitfall>

---

## Устранение неполадок {/*troubleshooting*/}

### Моя текстовая область не обновляется, когда я печатаю в ней {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Если вы отображаете текстовую область с `value`, но без `onChange`, вы увидите ошибку в консоли:

```js
// 🔴 Ошибка: управляемая текстовая область без обработчика onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

Вы предоставили проп `value` для поля формы без обработчика `onChange`. Это отобразит поле только для чтения. Если поле должно быть изменяемым, используйте `defaultValue`. В противном случае установите либо `onChange`, либо `readOnly`.

</ConsoleBlock>

Как предполагает сообщение об ошибке, если вы просто хотели [указать *начальное* значение,](#providing-an-initial-value-for-a-text-area) передайте вместо этого `defaultValue`:

```js
// ✅ Хорошо: неуправляемая текстовая область с начальным значением
<textarea defaultValue={something} />
```

Если вы хотите [управлять этой текстовой областью с помощью переменной состояния,](#controlling-a-text-area-with-a-state-variable) укажите обработчик `onChange`:

```js
// ✅ Хорошо: управляемая текстовая область с onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Если значение намеренно доступно только для чтения, добавьте проп `readOnly`, чтобы подавить ошибку:

```js
// ✅ Хорошо: управляемая текстовая область только для чтения без изменений
<textarea value={something} readOnly={true} />
```

---

### Мой курсор в текстовой области перескакивает в начало при каждом нажатии клавиши {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

Если вы [управляете текстовой областью,](#controlling-a-text-area-with-a-state-variable) вы должны обновить её переменную состояния до значения текстовой области из DOM во время `onChange`.

Вы не можете обновить её до чего-то, кроме `e.target.value`:

```js
function handleChange(e) {
  // 🔴 Ошибка: обновление ввода до чего-то, кроме e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Вы также не можете обновить её асинхронно:

```js
function handleChange(e) {
  // 🔴 Ошибка: асинхронное обновление ввода
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Чтобы исправить ваш код, обновите его синхронно до `e.target.value`:

```js
function handleChange(e) {
  // ✅ Обновление управляемого ввода до e.target.value синхронно
  setFirstName(e.target.value);
}
```

Если это не решит проблему, возможно, текстовая область удаляется и повторно добавляется из DOM при каждом нажатии клавиши. Это может произойти, если вы случайно [сбрасываете состояние](/learn/preserving-and-resetting-state) при каждом перерендере. Например, это может произойти, если текстовая область или один из её родителей всегда получает другой атрибут `key` или если вы вкладываете определения компонентов (что не допускается в React и приводит к повторному монтированию «внутреннего» компонента при каждом рендере).

---

### Я получаю ошибку: «Компонент изменяет неуправляемый ввод, чтобы он стал управляемым» {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

Если вы предоставляете `value` компоненту, он должен оставаться строкой в течение всего срока его службы.

Вы не можете сначала передать `value={undefined}`, а затем передать `value="some string"`, потому что React не будет знать, хотите ли вы, чтобы компонент был неуправляемым или управляемым. Управляемый компонент всегда должен получать строковое `value`, а не `null` или `undefined`.

Если ваш `value` поступает из API или переменной состояния, он может быть инициализирован как `null` или `undefined`. В этом случае либо установите его в пустую строку (`''`) изначально, либо передайте `value={someValue ?? ''}`, чтобы убедиться, что `value` является строкой.
```