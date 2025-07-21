---
title: "<option>"
---

<Intro>

[Встроенный в браузер компонент `<option>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/option) отвечает за рендер некоторого пункта списка в поле [`<select>`](/reference/react-dom/components/select).

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

### `<option>` {/*option*/}

[Встроенный в браузер компонент `<option>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/option) отвечает за рендер некоторого пункта списка в поле [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Пункт списка</option>
  <option value="otherOption">Другой пункт списка</option>
</select>
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

<<<<<<< HEAD
`<option>` поддерживает все [пропсы общих HTML-элементов.](/reference/react-dom/components/common#props)
=======
`<option>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

Кроме того, `<option>` поддерживает следующие пропсы:

* [`disabled`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/option#disabled): булево значение. Если `true`, то пункт списка не будет доступен для выбора и будет отображаться затемнённым.
* [`label`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/option#label): строка. Указывает смысловое значение пункта списка. Если значение не указано, то будет использоваться текст самого элемента `<option>`.
* [`value`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/option#value): Значение, которое будет использоваться [в родительском теге `<select>` при отправке формы](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form), если данный пункт списка будет выбран.

#### Предостережения {/*caveats*/}

* React не поддерживает атрибут `selected` тега `<option>`. Вместо этого, передайте `value` пункта списка родительскому [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) для неуправляемого поля выбора или [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) для управляемого.

---

## Применение {/*usage*/}

### Отображение поля выбора с пунктами списка {/*displaying-a-select-box-with-options*/}

Для отображения поля выбора используйте список компонентов `<option>` внутри тега `<select>`. Задайте `value` каждому элементу `<option>`, чтобы предоставить данные для отправки вместе с формой.

[Подробнее про отображение тега `<select>` со списком компонентов `<option>`.](/reference/react-dom/components/select)

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

