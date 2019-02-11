---
id: fragments
title: Фрагменты
permalink: docs/fragments.html
---

Общим примером в React является компонент, возвращающий несколько элементов. Фрагменты позволяют группировать список дочерних элементов без добавления дополнительного узла в DOM.

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

Существует [краткая запись](#short-syntax), но не во все популярные инструменты была добавлена её поддержка.

## Мотивация {#motivation}

Общим примером является компонент, возвращающий список дочерних элементов. Рассмотрим пример на React:

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

`<Columns />` требуется вернуть несколько элементов `<td>` для формирования валидного HTML. Если метод `render` компонента `<Columns />` сгруппирует все дочерние элементы в div, то полученный HTML будет не валидным.

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

результирует в следующий результат `<Table />`:

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

Фрагменты позволяют избавиться от таких проблем.

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

который вернёт результат `<Table />`:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Краткая запись {#short-syntax}

Существует краткая запись фрагментов. Она выглядит как пустые тэги:

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

Вы можете использовать `<></>` точно также, как используете любые другие элементы, за исключение, что такая запись не поддерживает ключи и атрибуты.

Обратите внимание, что **[многие инструменты ещё не поддерживают такой синтакси](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)**, поэтому вы вероятно захотите использовать явный синтаксис `<React.Fragment>` до появления поддержки в инструментах.

### Фрагменты с ключами {#keyed-fragments}

Фрагменты, объявленные с полным синтаксисом `<React.Fragment>`, могут иметь ключи. Маппинг коллекции в массив фрагментов для создания описания, напримре, вариант использования для фрагментов:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Без указания атрибута `key`, React выдаст предупреждени об его отсутсвии
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` – это единственный атрибут, допускаемый у компонента `Fragment`. Мы планируем в ближайшем будущем добавить поддержку дополнительных атрибутов, например, обработчики событий.

### Демо {#live-demo}

Синтаксис JSX фрагментов вы можете опробовать на [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
