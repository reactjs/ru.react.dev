---
id: lists-and-keys
title: Списки и ключи
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Сначала давайте вспомним, как работать со списками в JavaScript.

В коде ниже мы используем функцию [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), чтобы удвоить значения в массиве `numbers`. Мы присваиваем массив, возвращаемый из `map()`, переменной `doubled` и выводим её в консоль:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Этот код выведет `[2, 4, 6, 8, 10]` в консоль.

В React преобразование массивов в список [элементов](/docs/rendering-elements.html) выглядит похожим образом.

### Рендер нескольких компонентов {#rendering-multiple-components}

Вы можете создавать коллекции элементов и [встраивать их в JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) с помощью фигурных скобок `{}`.

Ниже, мы проходим по массиву `numbers`, используя функцию JavaScript [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), и возвращаем элемент `<li>` в каждой итерации. Получившийся массив элементов мы сохраним в `listItems`:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

Затем включаем массив `listItems` внутрь элемента `<ul>` и [рендерим его в DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Этот код выведет список чисел от 1 до 5.

### Простой компонент-список {#basic-list-component}

Как правило, вы будете рендерить списки внутри какого-нибудь [компонента](/docs/components-and-props.html).

Мы можем отрефакторить предыдущий пример с использованием компонента, который принимает массив `numbers` и выводит список элементов.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

Когда вы запустите данный код, то увидите предупреждение о том, что у каждого элемента массива должен быть ключ (key). «Ключ» – это специальный строковый атрибут, который вам необходимо добавлять при создании списка элементов. Мы обсудим, почему это важно, ниже на странице.

Чтобы исправить проблему с неуказанными ключами, добавим каждому элементу в списке атрибут `key`.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Ключи {#keys}

Ключи помогают React определять, какие элементы были изменены, добавлены или удалены. Их необходимо указывать, чтобы React мог сопоставлять элементы массива с течением времени:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Лучший способ выбрать ключ – это использовать строку, которая будет явно отличать элемент списка от его соседей. Чаще всего вы будете использовать ID из ваших данных как ключи:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Когда у вас нет заданных ID для списка, то в крайнем случае можно использовать индекс элемента как ключ:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Делайте так, только если у элементов массива нет заданного ID
  <li key={index}>
    {todo.text}
  </li>
);
```

Мы не рекомендуем использовать индексы как ключи, если порядок элементов может поменяться. Это негативно скажется на производительности и может вызвать проблемы с состоянием компонента. Почитайте статью Робина Покорни (Robin Pokorny), [которая объясняет, почему индексы-ключи приводят к проблемам](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). Если вы опустите ключ для элемента в списке, то React по умолчанию будет использовать индексы как ключи.

Вот [подробное объяснение о том, почему ключи необходимы](/docs/reconciliation.html#recursing-on-children).

### Извлечение компонентов с ключами {#extracting-components-with-keys}

Имеет смысл использовать ключи только в пределах окружающего массива.

Например, если вы [извлекаете](/docs/components-and-props.html#extracting-components) компонент `ListItem`, то нужно указывать ключ для `<ListItem />` в массиве, а не в элементе `<li>` внутри самого `ListItem`.

**Пример неправильного использования ключей**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Неправильно! Нет необходимости задавать здесь ключ:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Неправильно! Ключ необходимо определить здесь:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Пример правильного использования ключей**

```javascript{2,3,9,10}
function ListItem(props) {
  // Правильно! Не нужно определять здесь ключ:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Правильно! Ключ нужно определять внутри массива:
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

Как правило, элементам внутри `map()` нужны ключи.

### Ключи должны быть уникальными среди одноуровневых элементов {#keys-must-only-be-unique-among-siblings}

Ключи внутри массива должны быть уникальными только среди своих одноуровневых элементов. Им не нужно быть уникальными глобально. Можно использовать один и тот же ключ в двух разных массивах.

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Ключи служат подсказками для React, но они никогда не передаются в ваши компоненты. Если в компоненте нужно то же самое значение, то передайте его явно через проп с другим именем:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

В примере выше компонент `Post` может прочитать значение `props.id`, но не `props.key`.

### Встраивание map() в JSX {#embedding-map-in-jsx}

В примерах выше мы отдельно определяли переменную `listItems` и вставляли её в JSX:

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX позволяет [встроить любое выражение](/docs/introducing-jsx.html#embedding-expressions-in-jsx) в фигурные скобки, так что мы можем включить результат выполнения `map()`:

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Иногда это приводит к более чистому коду, но бывает и наоборот. Как и в любом JavaScript-коде, вам придется самостоятельно решать стоит ли извлекать код в переменную для читабельности. Не забывайте, что если код внутри `map()` слишком громоздкий, имеет смысл [извлечь его в отдельный компонент](/docs/components-and-props.html#extracting-components).
