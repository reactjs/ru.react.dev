---
id: fragments
title: Фрагменты
permalink: docs/fragments.html
---

Возврат нескольких элементов из компонента является распространенной практикой в React. Фрагменты позволяют сформировать список дочерних элементов без добавления дополнительного узла в DOM.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

Существует [сокращенная запись](#short-syntax), но ещё не все популярные инструменты поддерживают её.

## Мотивация {#motivation}

Возврат списка дочерних элементов из компонента – распространенная практика. Рассмотрим следующий пример на React:

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` следует вернуть несколько элементов `<td>`, чтобы отрендерить валидный HTMl. Если использовать div как родительский элемент в `render` компонента `<Columns />`, получим не валидный HTML.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

приводит к результату в `<Table />`:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Фрагменты решают эту проблему.

## Использование {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

приводит к результату в `<Table />`:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Сокращенная запись {#short-syntax}

Существует сокращенная запись фрагментов. Она выглядит как пустые тэги:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

Вы можете использовать `<></>` так же, как используете любой другой элемент, но такая запись не поддерживает ключи и атрибуты.

Обратите внимание, что **[многие инструменты ещё не поддерживают сокращенную запись](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)**, поэтому вы можете использовать запись `<React.Fragment>`, пока не появится поддержка в инструментах.

### Фрагменты с ключами {#keyed-fragments}

Фрагменты, объявленные с помощью `<React.Fragment>`, могут иметь ключи. Примером использования является маппинг коллекции в массив фрагментов – например, для создания списка определений:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Без указания атрибута `key`, React выдаст предупреждение об его отсутсвии
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` – это единственный атрибут, допустимый у `Fragment`. Мы планируем в будущем добавить поддержку дополнительных атрибутов, например, обработчики событий.

### Живой пример {#live-demo}

Новый синтаксис JSX фрагментов вы можете опробовать на [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
