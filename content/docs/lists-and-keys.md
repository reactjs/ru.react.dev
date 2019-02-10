---
id: lists-and-keys
title: Списки и ключи
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Сначала посмотрим как мы работаем со списками в JavaScript.

В коде ниже мы используем функцию [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), чтобы удвоить значения в массиве `numbers`. Мы присваиваем массив, возвращаемый из `map()`, в переменную `doubled` и выводим её в консоль:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Этот код выведет `[2, 4, 6, 8, 10]` в консоль.

В React преобразование массивов в список [элементов](/docs/rendering-elements.html) выглядит похожим образом.

### Рендер нескольких компонентов {#rendering-multiple-components}

Вы можете создавать коллекции элементов и добавлять их в JSX [include them in JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) с помощью фигурных скобок `{}`.

Ниже, мы итерируемся по массиву `numbers`, используя функцию JavaScript [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), и возвращаем элемент `<li>` в каждой итерации. В итоге мы присваиваем получившийся массив элементов в `listItems`:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

Затем добавляем массив `listItems` внутрь элемента `<ul>` и [рендерим в DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Данный код выведет ненумерованный список с числами от 1 до 5.

### Базовый компонент списка {#basic-list-component}

Обычно вы будете рендерить списки внутри [компонента](/docs/components-and-props.html).

Мы можем отрефакторить предыдущий пример с использованием компонента, который принимает массив `numbers` и выводит неупорядоченный список элементов.

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

Когда вы запустите данный код, то увидите предупреждение о том, что у каждого элемента массива должен быть ключ. «Ключ» – это специальный строковый атрибут, который вам необходимо добавлять при создании списка элементов. Мы обсудим почему это важно в следующей главе.

Добавим `key` к нашему списку элементов внутри `numbers.map()` и поправим проблему его отсутствия.

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

Ключи помогают React определять какие элементы были изменены, добавлены или удалены. Ключи нужно присваивать элементам внутри массива для их явной идентификации:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Лучший способ выбрать ключ это использовать строку, которая будет явно отличать элемент списка от его соседей. Чаще всего вы будете использовать ID из ваших данных как ключи:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Когда у вас нет заданных ID для списка, то в крайнем случае можете использовать индекс элемента как ключ:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Делайте так только если у элементов массива нет заданного ID
  <li key={index}>
    {todo.text}
  </li>
);
```

Мы не рекомендуем использовать индексы как ключи если порядок элементов может поменяться. Это негативно скажется на производительности и может вызвать проблемы с состоянием компонента. Посмотрите статью Робина Покорни (Robin Pokorny) с [подробным объяснением негативного влияния использования индексов как ключей](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). Если вы решите не присваивать ключ к элементу списка, то React по умолчанию будет использовать индексы как ключи.

Вот [подробное объяснение о том, почему ключи необходимы](/docs/reconciliation.html#recursing-on-children) если вы захотели узнать больше.

### Извлечение компонентов с ключами {#extracting-components-with-keys}

Ключи имеют смысл только в контексте массива.

Например если вы [извлекаете](/docs/components-and-props.html#extracting-components) компонент `ListItem`, то нужно указывать ключ для `<ListItem />` в массиве, вместо элементов `<li>` внутри самого `ListItem`.

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
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
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

Наличие ключей у элементов внутри `map()` является хорошим тоном.

### Ключи должны быть уникальными среди соседей {#keys-must-only-be-unique-among-siblings}

Ключам, которые используются в массивах, нужно быть уникальными среди своих соседей. Однако они не должны быть уникальными глобально. Мы можем использовать одни и те же ключи для создания двух разных массивов.

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

Ключи являются подсказками для React, но они никогда не передаются в ваши компоненты. Если в компоненте нужно тоже самое значение, то передайте его явно через проп с другим именем:

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

JSX позволяет [встроить любое выражение](/docs/introducing-jsx.html#embedding-expressions-in-jsx) в фигурные скобки, так мы можем заинлайнить результат `map()`:

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

Иногда это приводит к более чистому коду, но таким стилем так же можно злоупотреблять. Как и в JavaScript вам придется самостоятельно решать стоит ли извлекать код в переменную для читабельности. Держите в голове, что если содержимое `map()` является слишком сложным, вероятно это отличная возможность чтобы [извлечь компонент](/docs/components-and-props.html#extracting-components).
