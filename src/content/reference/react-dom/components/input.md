---
title: "<input>"
---
<Intro>

Встроенный браузерный компонент [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) позволяет отображать различные типы полей ввода формы.

```js
<input />
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<input>` {/*input*/}

Чтобы отобразить поле ввода, используйте встроенный браузерный компонент [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

`<input>` поддерживает все [общие пропсы элементов.](/reference/react-dom/components/common#props)

- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Строка или функция. Переопределяет `action` родительского `<form>` для `type="submit"` и `type="image"`. Когда URL передается в `action`, форма ведет себя как стандартная HTML-форма. Когда функция передается в `formAction`, функция обрабатывает отправку формы. См. [`<form action>`](/reference/react-dom/components/form#props).

Вы можете [сделать поле ввода управляемым](#controlling-an-input-with-a-state-variable), передав один из этих пропсов:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Булево значение. Для флажка или переключателя контролирует, выбран ли он.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): Строка. Для текстового поля ввода контролирует его текст. (Для переключателя указывает его данные формы.)

Когда вы передаете одно из них, вы также должны передать обработчик `onChange`, который обновляет переданное значение.

Эти пропсы `<input>` актуальны только для неуправляемых полей ввода:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Булево значение. Задает [начальное значение](#providing-an-initial-value-for-an-input) для полей ввода `type="checkbox"` и `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): Строка. Задает [начальное значение](#providing-an-initial-value-for-an-input) для текстового поля ввода.

Эти пропсы `<input>` актуальны как для неуправляемых, так и для управляемых полей ввода:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): Строка. Указывает, какие типы файлов принимаются полем ввода `type="file"`.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): Строка. Указывает альтернативный текст изображения для поля ввода `type="image"`.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): Строка. Указывает медиа (микрофон, видео или камеру), захватываемое полем ввода `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): Строка. Указывает одно из возможных [поведений автозаполнения.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Булево значение. Если `true`, React сфокусируется на элементе при монтировании.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): Строка. Указывает имя поля формы для направления элемента.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Булево значение. Если `true`, поле ввода не будет интерактивным и будет отображаться затемненным.
* `children`: `<input>` не принимает дочерние элементы.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): Строка. Указывает `id` формы `<form>`, к которой принадлежит это поле ввода. Если опущено, это ближайшая родительская форма.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Строка. Переопределяет `action` родительской `<form>` для `type="submit"` и `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): Строка. Переопределяет `enctype` родительской `<form>` для `type="submit"` и `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): Строка. Переопределяет `method` родительской `<form>` для `type="submit"` и `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): Строка. Переопределяет `noValidate` родительской `<form>` для `type="submit"` и `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): Строка. Переопределяет `target` родительской `<form>` для `type="submit"` и `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): Строка. Указывает высоту изображения для `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): Строка. Указывает `id` `<datalist>` с вариантами автозаполнения.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Число. Указывает максимальное значение для числовых и временных полей ввода.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Число. Указывает максимальную длину текста и других полей ввода.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Число. Указывает минимальное значение для числовых и временных полей ввода.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Число. Указывает минимальную длину текста и других полей ввода.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Булево значение. Указывает, разрешены ли множественные значения для `<type="file"` и `type="email"`.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): Строка. Указывает имя для этого поля ввода, которое [отправляется с формой.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Обработчик [`Event`](/reference/react-dom/components/common#event-handler). Обязателен для [управляемых полей ввода.](#controlling-an-input-with-a-state-variable) Срабатывает немедленно при изменении значения поля ввода пользователем (например, срабатывает при каждом нажатии клавиши). Работает аналогично браузерному событию [`input`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Версия `onChange`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): Обработчик [`Event`](/reference/react-dom/components/common#event-handler). Срабатывает немедленно при изменении значения пользователем. По историческим причинам в React идиоматично использовать `onChange`, который работает аналогично.
* `onInputCapture`: Версия `onInput`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): Обработчик [`Event`](/reference/react-dom/components/common#event-handler). Срабатывает, если поле ввода не проходит проверку при отправке формы. В отличие от встроенного события `invalid`, событие React `onInvalid` всплывает.
* `onInvalidCapture`: Версия `onInvalid`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Обработчик [`Event`](/reference/react-dom/components/common#event-handler). Срабатывает после изменения выделения внутри `<input>`. React расширяет событие `onSelect`, чтобы оно срабатывало также для пустого выделения и при редактировании (что может повлиять на выделение).
* `onSelectCapture`: Версия `onSelect`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): Строка. Указывает шаблон, которому должно соответствовать `value`.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): Строка. Отображается приглушенным цветом, когда значение поля ввода пустое.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Булево значение. Если `true`, поле ввода не редактируется пользователем.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Булево значение. Если `true`, значение должно быть предоставлено для отправки формы.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Число. Аналогично установке ширины, но единица измерения зависит от элемента управления.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): Строка. Указывает источник изображения для поля ввода `type="image"`.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Положительное число или строка `'any'`. Указывает расстояние между допустимыми значениями.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): Строка. Один из [типов ввода.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): Строка. Указывает ширину изображения для поля ввода `type="image"`.

#### Особенности {/*caveats*/}

- Флажки требуют `checked` (или `defaultChecked`), а не `value` (или `defaultValue`).
- Если текстовое поле ввода получает строковый пропс `value`, оно будет [считаться управляемым.](#controlling-an-input-with-a-state-variable)
- Если флажок или переключатель получает булев пропс `checked`, он будет [считаться управляемым.](#controlling-an-input-with-a-state-variable)
- Поле ввода не может быть одновременно управляемым и неуправляемым.
- Поле ввода не может переключаться между управляемым и неуправляемым состоянием в течение своего жизненного цикла.
- Каждое управляемое поле ввода требует обработчика события `onChange`, который синхронно обновляет его базовое значение.

---

## Использование {/*usage*/}

### Отображение полей ввода разных типов {/*displaying-inputs-of-different-types*/}

Чтобы отобразить поле ввода, используйте компонент `<input>`. По умолчанию это будет текстовое поле. Вы можете передать `type="checkbox"` для флажка, `type="radio"` для переключателя, [или один из других типов ввода.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Предоставление метки для поля ввода {/*providing-a-label-for-an-input*/}

Обычно вы помещаете каждое `<input>` внутрь тега [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label). Это сообщает браузеру, что эта метка связана с этим полем ввода. Когда пользователь нажимает на метку, браузер автоматически фокусируется на поле ввода. Это также важно для доступности: программа чтения с экрана объявит текст метки, когда пользователь сфокусируется на связанном поле ввода.

Если вы не можете вложить `<input>` в `<label>`, свяжите их, передав одинаковый `id` в `<input id>` и [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Чтобы избежать конфликтов между несколькими экземплярами одного компонента, сгенерируйте такой `id` с помощью [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Предоставление начального значения для поля ввода {/*providing-an-initial-value-for-an-input*/}

Вы можете опционально указать начальное значение для любого поля ввода. Передайте его как строку `defaultValue` для текстовых полей ввода. Флажки и переключатели должны указывать начальное значение с помощью булева значения `defaultChecked` вместо этого.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Чтение значений полей ввода при отправке формы {/*reading-the-input-values-when-submitting-a-form*/}

Добавьте [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) вокруг ваших полей ввода с [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) внутри. Это вызовет ваш обработчик события `<form onSubmit>`. По умолчанию браузер отправит данные формы на текущий URL и обновит страницу. Вы можете переопределить это поведение, вызвав `e.preventDefault()`. Прочитайте данные формы с помощью [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
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
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
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

Присвойте каждому `<input>` атрибут `name`, например `<input name="firstName" defaultValue="Taylor" />`. Указанное вами имя будет использоваться как ключ в данных формы, например `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

По умолчанию `<button>` внутри `<form>` без атрибута `type` будет отправлять его. Это может быть неожиданно! Если у вас есть собственный компонент React `Button`, рассмотрите возможность использования [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) вместо `<button>` (без типа). Затем, чтобы быть явным, используйте `<button type="submit">` для кнопок, которые *должны* отправлять форму.

</Pitfall>

---

### Управление полем ввода с помощью переменной состояния {/*controlling-an-input-with-a-state-variable*/}

Поле ввода, такое как `<input />`, является *неуправляемым*. Даже если вы [передаете начальное значение](#providing-an-initial-value-for-an-input), например `<input defaultValue="Initial text" />`, ваш JSX указывает только начальное значение. Он не контролирует, каким должно быть значение прямо сейчас.

**Чтобы отобразить _управляемое_ поле ввода, передайте ему пропс `value` (или `checked` для флажков и переключателей).** React заставит поле ввода всегда иметь значение `value`, которое вы передали. Обычно это делается путем объявления [переменной состояния:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Объявите переменную состояния...
  // ...
  return (
    <input
      value={firstName} // ...принудительно установите значение поля ввода в соответствии с переменной состояния...
      onChange={e => setFirstName(e.target.value)} // ...и обновляйте переменную состояния при каждом редактировании!
    />
  );
}
```

Управляемое поле ввода имеет смысл, если вам в любом случае нужно состояние — например, чтобы перерисовывать пользовательский интерфейс при каждом редактировании:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

Это также полезно, если вы хотите предложить несколько способов настройки состояния поля ввода (например, нажав кнопку):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

Значение `value`, которое вы передаете управляемым компонентам, не должно быть `undefined` или `null`. Если вам нужно, чтобы начальное значение было пустым (как в поле `firstName` ниже), инициализируйте переменную состояния пустой строкой (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Если вы передаете `value` без `onChange`, вводить текст в поле будет невозможно.** Когда вы управляете полем ввода, передавая ему какое-либо `value`, вы *принудительно* заставляете его всегда иметь значение, которое вы передали. Поэтому, если вы передаете переменную состояния как `value`, но забываете синхронно обновлять эту переменную состояния во время обработчика события `onChange`, React откатит поле ввода после каждого нажатия клавиши к значению, которое вы указали.

</Pitfall>

---

### Оптимизация перерисовки при каждом нажатии клавиши {/*optimizing-re-rendering-on-every-keystroke*/}

Когда вы используете управляемое поле ввода, вы устанавливаете состояние при каждом нажатии клавиши. Если компонент, содержащий ваше состояние, перерисовывает большое дерево, это может замедлить работу. Есть несколько способов оптимизировать производительность перерисовки.

Например, предположим, вы начинаете с формы, которая перерисовывает все содержимое страницы при каждом нажатии клавиши:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Поскольку `<PageContent />` не зависит от состояния поля ввода, вы можете переместить состояние поля ввода в собственный компонент:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Это значительно улучшает производительность, потому что теперь только `SignupForm` перерисовывается при каждом нажатии клавиши.

Если нет возможности избежать перерисовки (например, если `PageContent` зависит от значения поля ввода поиска), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) позволяет сохранить управляемое поле ввода отзывчивым даже во время большой перерисовки.

---

## Устранение неполадок {/*troubleshooting*/}

### Мое текстовое поле ввода не обновляется при вводе текста {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Если вы отображаете поле ввода с `value`, но без `onChange`, вы увидите ошибку в консоли:

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Как предполагает сообщение об ошибке, если вы хотели только [указать *начальное* значение,](#providing-an-initial-value-for-an-input) вместо этого передайте `defaultValue`:

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

Если вы хотите [управлять этим полем ввода с помощью переменной состояния,](#controlling-an-input-with-a-state-variable) укажите обработчик `onChange`:

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Если значение намеренно только для чтения, добавьте пропс `readOnly`, чтобы подавить ошибку:

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

---

### Мой флажок не обновляется при нажатии на него {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Если вы отображаете флажок с `checked`, но без `onChange`, вы увидите ошибку в консоли:

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Как предполагает сообщение об ошибке, если вы хотели только [указать *начальное* значение,](#providing-an-initial-value-for-an-input) вместо этого передайте `defaultChecked`:

```js
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
```

Если вы хотите [управлять этим флажком с помощью переменной состояния,](#controlling-an-input-with-a-state-variable) укажите обработчик `onChange`:

```js
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Для флажков вам нужно читать `e.target.checked`, а не `e.target.value`.

</Pitfall>

Если флажок намеренно только для чтения, добавьте пропс `readOnly`, чтобы подавить ошибку:

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Курсор моего поля ввода прыгает в начало при каждом нажатии клавиши {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Если вы [управляете полем ввода,](#controlling-an-input-with-a-state-variable) вы должны синхронно обновлять переменную состояния значением поля ввода из DOM во время `onChange`.

Вы не можете обновить его чем-то, кроме `e.target.value` (или `e.target.checked` для флажков):

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Вы также не можете обновлять его асинхронно:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Чтобы исправить ваш код, обновите его синхронно до `e.target.value`:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

Если это не решает проблему, возможно, поле ввода удаляется и повторно добавляется из DOM при каждом нажатии клавиши. Это может произойти, если вы случайно [сбрасываете состояние](/learn/preserving-and-resetting-state) при каждой перерисовке, например, если полю ввода или одному из его родительских элементов всегда присваивается другой атрибут `key`, или если вы вкладываете определения функций компонентов (что не поддерживается и приводит к тому, что "внутренний" компонент всегда считается другим деревом).

---

### Я получаю ошибку: "Компонент изменяет неуправляемое поле ввода, делая его управляемым" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Если вы передаете `value` компоненту, оно должно оставаться строкой на протяжении всего его жизненного цикла.

Вы не можете сначала передать `value={undefined}`, а затем передать `value="some string"`, потому что React не будет знать, хотите ли вы, чтобы компонент был неуправляемым или управляемым. Управляемый компонент всегда должен получать строковое значение `value`, а не `null` или `undefined`.

Если ваше значение `value` поступает из API или переменной состояния, оно может быть инициализировано как `null` или `undefined`. В этом случае либо установите его в пустую строку (`''`) изначально, либо передайте `value={someValue ?? ''}`, чтобы гарантировать, что `value` является строкой.

Аналогично, если вы передаете `checked` флажку, убедитесь, что это всегда булево значение.