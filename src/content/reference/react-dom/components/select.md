---
title: "<select>"
---

<Intro>

[Встроенный в браузер компонент `<select>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select) отвечает за рендер поля выбора с пунктами списка.

```js
<select>
  <option value="someOption">Пункт списка</option>
  <option value="otherOption">Другой пункт списка</option>
</select>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<select>` {/*select*/}

Чтобы отобразить поле выбора, отрендерите [встроенный в браузер компонент `<select>`.](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select)

```js
<select>
  <option value="someOption">Пункт списка</option>
  <option value="otherOption">Другой пункт списка</option>
</select>
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

`<select>` поддерживает все [пропсы общих HTML-элементов.](/reference/react-dom/components/common#props)

Можно сделать [поле выбора управляемым](#controlling-a-select-box-with-a-state-variable), передав проп `value`:

* `value`: строка (или массив строк для [`multiple={true}`](#enabling-multiple-selection)). Управляет выбранным вариантом. Значение каждой строки `value` соответствует некоторому `<option>`, вложенному в `<select>`.

При передаче `value`, также необходимо передать обработчик `onChange`, который будет отвечать за обновление переданного значения.

Если `<select>` является неуправляемым, то нужно передать проп `defaultValue`:

* `defaultValue`: строка (или массив строк для [`multiple={true}`](#enabling-multiple-selection)). Указывает [значение по умолчанию.](#providing-an-initially-selected-option)

Эти пропсы `<select>` актуальны для неуправляемых и управляемых полей выбора:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): строка. Указывает одно из возможных [поведений автозаполнения.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select#autofocus): булево значение. Если `true`, React установит фокус на элемент при монтировании.
* `children`: `<select>` принимает компоненты [`<option>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/optgroup) и [`<datalist>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/datalist) в качестве дочерних. Вы также можете передать свои собственные компоненты, но только в том случае, если в конечном итоге они рендерят один из вышеперечисленных компонентов. Если ваши компоненты рендерят теги `<option>`, то каждый отрендеренный `<option>` должен содержать `value`.
* [`disabled`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select#disabled): булево значение. Если `true`, то поле выбора не будет интерактивным и будет отображаться затемнённым.
* [`form`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select#form): строка. Указывает `id` для тега `<form>`, к которому относится поле выбора. Если значение не указано, то поле выбора будет относиться к ближайшей родительской форме.
* [`multiple`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select#multiple): булево значение. Если `true`, то браузер будет поддерживать возможность [множественного выбора.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select#name): строка. Указывает имя для поля выбора, которое [отправляется вместе с формой.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: функция [обработчика `Event`](/reference/react-dom/components/common#event-handler). Требуется для [управляемых полей выбора.](#controlling-a-select-box-with-a-state-variable) Немедленно срабатывает, когда пользователь выбирает другой вариант. Ведёт себя как [событие `input`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/input_event) в браузере.
* `onChangeCapture`: Вариант `onChange`, который срабатывает на [этапе захвата события.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/input_event): функция [обработчика `Event`](/reference/react-dom/components/common#event-handler). Немедленно срабатывает, когда пользователь меняет значение. По историческим причинам в React принято использовать вместо этого `onChange`, который работает аналогичным образом.
* `onInputCapture`: Вариант `onInput`, который срабатывает на [этапе захвата события.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement/invalid_event): функция [обработчика `Event`](/reference/react-dom/components/common#event-handler). Срабатывает в том случае, если введённые данные не прошли валидацию при отправке формы. В отличии от встроенного события `invalid`, в React событие `onInvalid` всплывает.
* `onInvalidCapture`: Вариант `onInvalid`, который срабатывает на [этапе захвата события.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select#required): булево значение. Если `true`, то необходимо указать значение для отправки формы.
* [`size`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/select#size): число. Для `multiple={true}` указывает количество изначально видимых элементов.

#### Предостережения {/*caveats*/}

- В отличие от HTML, передача атрибута `selected` в `<option>` не поддерживается. Вместо этого используется [`<select defaultValue>`](#providing-an-initially-selected-option) для неуправляемого поля выбора и [`<select value>`](#controlling-a-select-box-with-a-state-variable) для управляемого.
- Если поле выбора принимает проп `value`, то оно будет [считаться управляемым.](#controlling-a-select-box-with-a-state-variable)
- Поле выбора не может быть одновременно управляемым и неуправляемым.
- Поле выбора не может переключаться между управляемым и неуправляемым состоянием в течении своего жизненного цикла.
- Каждому управляемому полю выбора требуется обработчик событий `onChange`, который синхронно обновляет его исходное состояние.

---

## Применение {/*usage*/}

### Отображение поля выбора с пунктами списка {/*displaying-a-select-box-with-options*/}

Для отображения поля выбора используйте список компонентов `<option>` внутри тега `<select>`. Задайте `value` каждому элементу `<option>`, чтобы предоставить данные для отправки вместе с формой.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Выберите фрукт:
      <select name="selectedFruit">
        <option value="apple">Яблоко</option>
        <option value="banana">Банан</option>
        <option value="orange">Апельсин</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### Предоставление метки для поля выбора {/*providing-a-label-for-a-select-box*/}

Обычно, каждый `<select>` размещают внутри тега [`<label>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/label). Это сообщает браузеру, что данная метка связана с этим полем выбора. Когда пользователь нажмёт на метку, браузер автоматически установит фокус на поле выбора. Это также важно для доступности: когда пользовательский фокус будет на поле выбора, скринридер озвучит заголовок метки.

Если вы не можете вложить `<select>` в `<label>`, то свяжите их, передав некоторый ID в `<select id>` и [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) Чтобы избежать конфликтов между несколькими экземплярами одного компонента, сгенерируйте такой ID с помощью хука [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Выберите фрукт:
        <select name="selectedFruit">
          <option value="apple">Яблоко</option>
          <option value="banana">Банан</option>
          <option value="orange">Апельсин</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Выберите овощ:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Огурец</option>
        <option value="corn">Кукуруза</option>
        <option value="tomato">Помидор</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Предоставление значения по умолчанию {/*providing-an-initially-selected-option*/}

По умолчанию браузер выберет первый `<option>` в списке. Чтобы выбрать другой параметр по умолчанию, нужно передать `value` этого `<option>` в качестве `defaultValue` для элемента `<select>`.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Выберите фрукт:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Яблоко</option>
        <option value="banana">Банан</option>
        <option value="orange">Апельсин</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

В отличие от HTML, передача атрибута `selected` в отдельный `<option>` не поддерживается.

</Pitfall>

---

### Включение множественного выбора {/*enabling-multiple-selection*/}

Чтобы пользователь мог выбрать несоклько вариантов, нужно передать `multiple={true}` в `<select>`. В этом случае, если также указать `defaultValue` для выбора вариантов по умолчанию, то это должен быть массив.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Выберите несколько фруктов:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Яблоко</option>
        <option value="banana">Банан</option>
        <option value="orange">Апельсин</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Считывание значения поля выбора при отправке формы {/*reading-the-select-box-value-when-submitting-a-form*/}

Оберните поле выбора в тег [`<form>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form) с [`<button type="submit">`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/button) внутри. Это вызовет ваш обработчик событий `<form onSubmit>`. По умолчанию, браузер отправит данные формы на текущий URL и обновит страницу. Вы можете переопределить это поведение, вызвав `e.preventDefault()`. Считать данные формы можно с помощью [`new FormData(e.target)`](https://developer.mozilla.org/ru/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Предотвращаем перезагрузку страницы браузером
    e.preventDefault();
    // Считываем данные формы
    const form = e.target;
    const formData = new FormData(form);
    // Вы можете передать formData напрямую, как тело запроса:
    fetch('/some-api', { method: form.method, body: formData });
    // Вы можете сгенерировать из него URL, как это делает браузер по умолчанию:
    console.log(new URLSearchParams(formData).toString());
    // Вы можете работать с ним, как с обычным объектом.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Не включает множественный выбор значений
    // Или вы можете получить массив пар ключ-значение.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Выберите ваш любимый фрукт:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Яблоко</option>
          <option value="banana">Банан</option>
          <option value="orange">Апельсин</option>
        </select>
      </label>
      <label>
        Выберите все ваши любимые овощи:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Огурец</option>
          <option value="corn">Кукуруза</option>
          <option value="tomato">Помидор</option>
        </select>
      </label>
      <hr />
      <button type="reset">Сбросить</button>
      <button type="submit">Отправить</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Задайте `name` вашему `<select>`, например `<select name="selectedFruit" />`. Указанный `name` будет использоваться как ключ в данных формы, например `{ selectedFruit: "orange" }`.

Если вы используете `<select multiple={true}>`, то [`FormData`](https://developer.mozilla.org/ru/docs/Web/API/FormData) будет включать каждое выбранное значение как отдельную пару ключ-значение при считывании данных из формы. Внимательно посмотрите на логи в консоли в примере выше.

</Note>

<Pitfall>

По умолчанию, *любой* `<button>` внутри `<form>` отправит данные. Это может быть удивительно! Если у вас есть кастомный React-компонент `Button`, то рассмотрите возможность возвращать [`<button type="button">`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input/button) вместо `<button>`. Затем явно используйте `<button type="submit">` для кнопок, которые *должны* отправлять форму.

</Pitfall>

---

### Управление полем выбора при помощи переменной состояния {/*controlling-a-select-box-with-a-state-variable*/}

Поле выбора типа `<select />` *неуправляемое.* Даже если [передать значение по умолчанию](#providing-an-initially-selected-option) типа `<select defaultValue="orange" />`, то ваш JSX будет указывать только на начально значение, а не на текущее.

**Чтобы отрендерить _управляемое_ поле выбора, передайте ему проп `value`.** React принудит поле выбора всегда хранить переданное `value`. Обычно, управлять полем выбора можно при помощи [переменной состояния:](/reference/react/useState)

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Объявляем переменную состояния...
  // ...
  return (
    <select
      value={selectedFruit} // ...сопоставляем value поля выбора с переменной состояния...
      onChange={e => setSelectedFruit(e.target.value)} // ... и обновляем переменную состояния при любом изменении!
    >
      <option value="apple">Яблоко</option>
      <option value="banana">Банан</option>
      <option value="orange">Апельсин</option>
    </select>
  );
}
```

Это полезно, если вы хотите повторно рендерить какую-то часть UI при каждом изменении значения в поле выбора.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Выберите фрукт:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Яблоко</option>
          <option value="banana">Банан</option>
          <option value="orange">Апельсин</option>
        </select>
      </label>
      <hr />
      <label>
        Выберите все ваши любимые овощи:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Огурец</option>
          <option value="corn">Кукуруза</option>
          <option value="tomato">Помидор</option>
        </select>
      </label>
      <hr />
      <p>Ваш любимый фрукт: {selectedFruit}</p>
      <p>Ваши любимые овощи: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Если передать `value` без `onChange`, то выбрать вариант будет невозможно.** Когда вы управляете полем выбора, передав ему некоторое `value`, вы *принуждаете* его всегда хранить переданное значение. Поэтому, если предать переменную состояния в `value`, но забыть обновлять эту пременную синхронно при помощи обработчика событий `onChange`, то React, после каждого нажатия клавиши, будет возвращать поле выбора с указанным `value`.

В отличие от HTML, передача атрибута `selected` в отдельный `<option>` не поддерживается.

</Pitfall>
