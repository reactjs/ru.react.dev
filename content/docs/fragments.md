---
id: fragments
title: Фрагменты
permalink: docs/fragments.html
---

Возврат нескольких элементов из компонента является распространённой практикой в React. Фрагменты позволяют формировать список дочерних элементов, не добавляя дополнительных узлов в DOM.

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

Также существует [сокращённая запись](#short-syntax), однако, не все популярные инструменты поддерживают её.

## Мотивация {#motivation}

Возврат списка дочерних элементов из компонента – распространённая практика. Рассмотрим пример на React:

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

`<Columns />` должен вернуть несколько элементов `<td>`, чтобы получить валидный HTML. Если использовать div как родительский элемент внутри метода `render()` компонента `<Columns />`, то полученный HTML будет невалидным.

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

результатом вывода `<Table />` будет:

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

результатом будет правильный вывод `<Table />`:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Сокращённая запись {#short-syntax}

Существует сокращённая запись объявления фрагментов. Она выглядит как пустые теги:

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

Можно использовать `<></>` так же, как используется любой другой элемент. Однако, такая запись не поддерживает ключи или атрибуты.

Обратите внимание, что **[большинство инструментов ещё не поддерживают сокращённую запись](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)**, поэтому можно явно указывать `<React.Fragment>`, пока не появится поддержка.

### Фрагменты с ключами {#keyed-fragments}

Фрагменты, объявленные с помощью `<React.Fragment>`, могут иметь ключи. Как пример использования – преобразовать коллекцию в массив фрагментов, например, для создания списка определений:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Без указания атрибута `key`, React выдаст предупреждение об его отсутствии
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` – это единственный атрибут, допустимый у `Fragment`. В будущем мы планируем добавить поддержку дополнительных атрибутов, например, обработчиков событий.

### Живой пример {#live-demo}

Новый синтаксис JSX фрагментов можно попробовать на [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
