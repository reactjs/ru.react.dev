---
title: "`<input>`"
---
```html
<Intro>

Встроенный [компонент `<input>` браузера](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input) позволяет отображать различные виды полей ввода формы.

```js
<input />
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<input>` {/*input*/}

Чтобы отобразить поле ввода, отрендерите [встроенный компонент `<input>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input) браузера.

```js
<input name="myInput" />
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

`<input>` поддерживает все [общие пропсы элементов.](/reference/react-dom/components/common#props)

- [`formAction`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#formaction): Строка или функция. Переопределяет родительский `<form action>` для `type="submit"` и `type="image"`. Когда URL передается в `action`, форма будет вести себя как стандартная HTML-форма. Когда функция передается в `formAction`, функция будет обрабатывать отправку формы. См. [`<form action>`](/reference/react-dom/components/form#props).

Вы можете [сделать поле ввода управляемым](#controlling-an-input-with-a-state-variable), передав один из этих пропсов:

* [`checked`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement#checked): Логическое значение. Для флажка или переключателя определяет, выбран ли он.
* [`value`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement#value): Строка. Для текстового поля ввода управляет его текстом. (Для переключателя указывает данные формы.)

Когда вы передаете любой из них, вы также должны передать обработчик `onChange`, который обновляет переданное значение.

Эти пропсы `<input>` актуальны только для неуправляемых полей ввода:

* [`defaultChecked`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement#defaultChecked): Логическое значение. Указывает [начальное значение](#providing-an-initial-value-for-an-input) для полей ввода `type="checkbox"` и `type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement#defaultValue): Строка. Указывает [начальное значение](#providing-an-initial-value-for-an-input) для текстового поля ввода.

Эти пропсы `<input>` актуальны как для неуправляемых, так и для управляемых полей ввода:

* [`accept`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#accept): Строка. Указывает, какие типы файлов принимаются полем ввода `type="file"`.
* [`alt`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#alt): Строка. Указывает альтернативный текст изображения для поля ввода `type="image"`.
* [`capture`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#capture): Строка. Указывает носитель (микрофон, видео или камеру), захватываемый полем ввода `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#autocomplete): Строка. Указывает одно из возможных [поведений автозаполнения.](https://developer.mozilla.org/ru/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#autofocus): Логическое значение. Если `true`, React сфокусирует элемент при монтировании.
* [`dirname`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#dirname): Строка. Указывает имя поля формы для направленности элемента.
* [`disabled`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#disabled): Логическое значение. Если `true`, поле ввода не будет интерактивным и будет отображаться тусклым.
* `children`: `<input>` не принимает дочерние элементы.
* [`form`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#form): Строка. Указывает `id` `<form>`, к которой принадлежит это поле ввода. Если опущено, это ближайшая родительская форма.
* [`formAction`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#formaction): Строка. Переопределяет родительский `<form action>` для `type="submit"` и `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#formenctype): Строка. Переопределяет родительский `<form enctype>` для `type="submit"` и `type="image"`.
* [`formMethod`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#formmethod): Строка. Переопределяет родительский `<form method>` для `type="submit"` и `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#formnovalidate): Строка. Переопределяет родительский `<form noValidate>` для `type="submit"` и `type="image"`.
* [`formTarget`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#formtarget): Строка. Переопределяет родительский `<form target>` для `type="submit"` и `type="image"`.
* [`height`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#height): Строка. Указывает высоту изображения для `type="image"`.
* [`list`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#list): Строка. Указывает `id` `<datalist>` с параметрами автозаполнения.
* [`max`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#max): Число. Указывает максимальное значение числовых и datetime полей ввода.
* [`maxLength`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#maxlength): Число. Указывает максимальную длину текста и других полей ввода.
* [`min`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#min): Число. Указывает минимальное значение числовых и datetime полей ввода.
* [`minLength`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#minlength): Число. Указывает минимальную длину текста и других полей ввода.
* [`multiple`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#multiple): Логическое значение. Указывает, разрешено ли несколько значений для `<type="file"` и `type="email"`.
* [`name`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#name): Строка. Указывает имя для этого поля ввода, которое [отправляется с формой.](#reading-the-input-values-when-submitting-a-form)
* `onChange`: Функция [`Event` handler](/reference/react-dom/components/common#event-handler). Требуется для [управляемых полей ввода.](#controlling-an-input-with-a-state-variable) Срабатывает сразу, когда значение поля ввода изменяется пользователем (например, срабатывает при каждом нажатии клавиши). Ведет себя как [событие `input` браузера.](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: Версия `onChange`, которая срабатывает на [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/input_event): Функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает сразу, когда значение изменяется пользователем. По историческим причинам в React принято использовать `onChange` вместо него, который работает аналогично.
* `onInputCapture`: Версия `onInput`, которая срабатывает на [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement/invalid_event): Функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает, если поле ввода не проходит проверку при отправке формы. В отличие от встроенного события `invalid`, событие React `onInvalid` всплывает.
* `onInvalidCapture`: Версия `onInvalid`, которая срабатывает на [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement/select_event): Функция [`Event` handler](/reference/react-dom/components/common#event-handler). Срабатывает после изменения выделения внутри `<input>`. React расширяет событие `onSelect`, чтобы оно также срабатывало для пустого выделения и при редактировании (что может повлиять на выделение).
* `onSelectCapture`: Версия `onSelect`, которая срабатывает на [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`pattern`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#pattern): Строка. Указывает шаблон, которому должно соответствовать `value`.
* [`placeholder`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#placeholder): Строка. Отображается тусклым цветом, когда значение поля ввода пусто.
* [`readOnly`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#readonly): Логическое значение. Если `true`, поле ввода не редактируется пользователем.
* [`required`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#required): Логическое значение. Если `true`, значение должно быть предоставлено для отправки формы.
* [`size`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#size): Число. Аналогично установке ширины, но единица измерения зависит от элемента управления.
* [`src`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#src): Строка. Указывает источник изображения для поля ввода `type="image"`.
* [`step`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#step): Положительное число или строка `'any'`. Указывает расстояние между допустимыми значениями.
* [`type`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#type): Строка. Один из [типов ввода.](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#input_types)
* [`width`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#width): Строка. Указывает ширину изображения для поля ввода `type="image"`.

#### Предостережения {/*caveats*/}

- Флажки требуют `checked` (или `defaultChecked`), а не `value` (или `defaultValue`).
- Если текстовое поле ввода получает строковый проп `value`, оно будет [рассматриваться как управляемое.](#controlling-an-input-with-a-state-variable)
- Если флажок или переключатель получает логический проп `checked`, он будет [рассматриваться как управляемый.](#controlling-an-input-with-a-state-variable)
- Поле ввода не может быть одновременно управляемым и неуправляемым.
- Поле ввода не может переключаться между управляемым и неуправляемым в течение своего жизненного цикла.
- Каждому управляемому полю ввода требуется обработчик события `onChange`, который синхронно обновляет его базовое значение.

---

## Использование {/*usage*/}

### Отображение полей ввода разных типов {/*displaying-inputs-of-different-types*/}

Чтобы отобразить поле ввода, отрендерите компонент `<input>`. По умолчанию это будет текстовое поле ввода. Вы можете передать `type="checkbox"` для флажка, `type="radio"` для переключателя [или один из других типов ввода.](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input#input_types)

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

Обычно вы будете помещать каждый `<input>` внутрь тега [`<label>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/label). Это сообщает браузеру, что эта метка связана с этим полем ввода. Когда пользователь нажимает на метку, браузер автоматически фокусирует поле ввода. Это также важно для доступности: программа чтения с экрана объявит заголовок метки, когда пользователь сфокусирует связанное поле ввода.

Если вы не можете вложить `<input>` в `<label>`, свяжите их, передав один и тот же ID в `<input id>` и [`<label htmlFor>`.](https://developer.mozilla.org/ru/docs/Web/API/HTMLLabelElement/htmlFor) Чтобы избежать конфликтов между несколькими экземплярами одного компонента, сгенерируйте такой ID с помощью [`useId`.](/reference/react/useId)

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

При необходимости вы можете указать начальное значение для любого поля ввода. Передайте его как строку `defaultValue` для текстовых полей ввода. Флажки и переключатели должны указывать начальное значение с помощью логического значения `defaultChecked`.

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

Добавьте [`<form>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form) вокруг ваших полей ввода с [`<button type="submit">`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/button) внутри. Он вызовет ваш обработчик события `<form onSubmit>`. По умолчанию браузер отправит данные формы на текущий URL и обновит страницу. Вы можете переопределить это поведение, вызвав `e.preventDefault()`. Прочитайте данные формы с помощью [`new FormData(e.target)`](https://developer.mozilla.org/ru/docs/Web/API/FormData).
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

Присвойте `name` каждому `<input>`, например `<input name="firstName" defaultValue="Taylor" />`. Указанное вами `name` будет использоваться в качестве ключа в данных формы, например `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

По умолчанию `<button>` внутри `<form>` без атрибута `type` отправит ее. Это может быть неожиданностью! Если у вас есть собственный пользовательский React-компонент `Button`, рассмотрите возможность использования [`<button type="button">`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/button) вместо `<button>` (без типа). Затем, чтобы быть явным, используйте `<button type="submit">` для кнопок, которые *должны* отправлять форму.

</Pitfall>

---

### Управление полем ввода с помощью переменной состояния {/*controlling-an-input-with-a-state-variable*/}

Поле ввода, такое как `<input />`, является *неуправляемым*. Даже если вы [передаете начальное значение](#providing-an-initial-value-for-an-input), например `<input defaultValue="Initial text" />`, ваш JSX только указывает начальное значение. Он не управляет тем, каким должно быть значение прямо сейчас.

**Чтобы отобразить _управляемое_ поле ввода, передайте ему проп `value` (или `checked` для флажков и переключателей).** React заставит поле ввода всегда иметь переданное вами `value`. Обычно вы делаете это, объявляя [переменную состояния:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Объявите переменную состояния...
  // ...
  return (
    <input
      value={firstName} // ...заставьте значение поля ввода соответствовать переменной состояния...
      onChange={e => setFirstName(e.target.value)} // ... и обновляйте переменную состояния при любых изменениях!
    />
  );
}
```

Управляемое поле ввода имеет смысл, если вам все равно нужно состояние — например, чтобы перерендерить ваш пользовательский интерфейс при каждом изменении:

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

Это также полезно, если вы хотите предложить несколько способов настройки состояния ввода (например, нажатием кнопки):

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

`value`, которое вы передаете управляемым компонентам, не должно быть `undefined` или `null`. Если вам нужно, чтобы начальное значение было пустым (например, в поле `firstName` ниже), инициализируйте переменную состояния пустой строкой (`''`).

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

**Если вы передаете `value` без `onChange`, в поле ввода будет невозможно что-либо ввести.** Когда вы управляете полем ввода, передавая ему какое-либо `value`, вы *заставляете* его всегда иметь переданное вами значение. Поэтому, если вы передаете переменную состояния как `value`, но забываете синхронно обновить эту переменную состояния во время обработчика события `onChange`, React вернет поле ввода после каждого нажатия клавиши обратно к указанному вами `value`.

</Pitfall>

---

### Оптимизация перерендеринга при каждом нажатии клавиши {/*optimizing-re-rendering-on-every-keystroke*/}

Когда вы используете управляемое поле ввода, вы устанавливаете состояние при каждом нажатии клавиши. Если компонент, содержащий ваше состояние, перерендеривает большое дерево, это может замедлиться. Есть несколько способов оптимизировать производительность перерендеринга.

Например, предположим, что вы начинаете с формы, которая перерендеривает все содержимое страницы при каждом нажатии клавиши:

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

Поскольку `<PageContent />` не зависит от состояния ввода, вы можете переместить состояние ввода в свой собственный компонент:

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

Это значительно повышает производительность, потому что теперь только `SignupForm` перерендеривается при каждом нажатии клавиши.

Если невозможно избежать перерендеринга (например, если `PageContent` зависит от значения поля поиска), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) позволяет вам поддерживать отзывчивость управляемого поля ввода даже в середине большого перерендеринга.

---

## Устранение неполадок {/*troubleshooting*/}

### Мое текстовое поле ввода не обновляется, когда я что-то ввожу {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Если вы отображаете поле ввода с `value`, но без `onChange`, вы увидите ошибку в консоли:

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

<ConsoleBlock level="error">

Вы предоставили проп `value` полю формы без обработчика `onChange`. Это отобразит поле только для чтения. Если поле должно быть изменяемым, используйте `defaultValue`. В противном случае установите либо `onChange`, либо `readOnly`.

</ConsoleBlock>

Как предполагает сообщение об ошибке, если вы просто хотели [указать *начальное* значение,](#providing-an-initial-value-for-an-input) передайте вместо этого `defaultValue`:

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

Если вы хотите [управлять этим полем ввода с помощью переменной состояния,](#controlling-an-input-with-a-state-variable) укажите обработчик `onChange`:

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Если значение намеренно доступно только для чтения, добавьте проп `readOnly`, чтобы подавить ошибку:

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

---

### Мой флажок не обновляется, когда я нажимаю на него {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Если вы отображаете флажок с `checked`, но без `onChange`, вы увидите ошибку в консоли:

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

Вы предоставили проп `checked` полю формы без обработчика `onChange`. Это отобразит поле только для чтения. Если поле должно быть изменяемым, используйте `defaultChecked`. В противном случае установите либо `onChange`, либо `readOnly`.

</ConsoleBlock>

Как предполагает сообщение об ошибке, если вы просто хотели [указать *начальное* значение,](#providing-an-initial-value-for-an-input) передайте вместо этого `defaultChecked`:

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

Если флажок намеренно доступен только для чтения, добавьте проп `readOnly`, чтобы подавить ошибку:

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Мой курсор в поле ввода перескакивает в начало при каждом нажатии клавиши {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Если вы [управляете полем ввода,](#controlling-an-input-with-a-state-variable) вы должны обновить его переменную состояния до значения поля ввода из DOM во время `onChange`.

Вы не можете обновить его до чего-либо, кроме `e.target.value` (или `e.target.checked` для флажков):

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Вы также не можете обновить его асинхронно:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Чтобы исправить свой код, обновите его синхронно до `e.target.value`:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

Если это не решит проблему, возможно, поле ввода удаляется и повторно добавляется из DOM при каждом нажатии клавиши. Это может произойти, если вы случайно [сбрасываете состояние](/learn/preserving-and-resetting-state) при каждом перерендеринге, например, если поле ввода или один из его родителей всегда получает другой атрибут `key` или если вы вкладываете определения функций компонентов (что не поддерживается и приводит к тому, что «внутренний» компонент всегда считается другим деревом).

---

### Я получаю ошибку: «Компонент изменяет неуправляемый ввод, чтобы он стал управляемым» {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

Если вы предоставляете `value` компоненту, он должен оставаться строкой на протяжении всего своего жизненного цикла.

Вы не можете сначала передать `value={undefined}`, а затем передать `value="some string"`, потому что React не будет знать, хотите ли вы, чтобы компонент был неуправляемым или управляемым. Управляемый компонент всегда должен получать строковое `value`, а не `null` или `undefined`.

Если ваше `value` поступает из API или переменной состояния, оно может быть инициализировано как `null` или `undefined`. В этом случае либо установите его изначально пустой строкой (`''`), либо передайте `value={someValue ?? ''}`, чтобы убедиться, что `value` является строкой.

Аналогично, если вы передаете `checked` флажку, убедитесь, что он всегда является логическим значением.
```