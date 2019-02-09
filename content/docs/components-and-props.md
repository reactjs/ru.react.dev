---
id: components-and-props
title: Компоненты и пропсы
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

Компоненты позволяют разбить интерфейс на независимые части, про которые легко думать в отдельности. Их можно складывать вместе и использовать несколько раз. На этой странице мы ознакомимся с самой идеей компонентов — [детальное описание API находится здесь](/docs/react-component.html).

Во многом, компоненты ведут себя как обычные функции JavaScript. Они принимают произвольные входные данные («пропсы») и возвращают React-элементы, описывающие, что мы хотим увидеть на экране.

## Функциональные и классовые компоненты {#function-and-class-components}

Проще всего объявить React-компонент как функцию:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Эта функция — компонент, потому что она получает данные в одном объекте («пропсы») в качестве параметра и возвращает React-элемент. Мы будем называть такие компоненты «функциональными», так как они буквально являются функциями.

Ещё компоненты можно определять как [классы ES6](https://developer.mozilla.org/ru-RU/docs/Web/JavaScript/Reference/Classes):

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

С точки зрения React, эти два компонента эквивалентны.

Классам доступны дополнительные возможности, о которых мы поговорим в [следующих главах](/docs/state-and-lifecycle.html). Но пока что мы предпочтём функции за их краткость.

## Как отрендерить компонент {#rendering-a-component}

Пока что мы только встречали React-элементы, представляющие собой DOM-тэги:

```js
const element = <div />;
```

Но элементы могут описывать и наши собственные компоненты:

```js
const element = <Welcome name="Алиса" />;
```

Когда React встречает подобный элемент, он собирает все JSX-атрибуты в один объект и передаёт их нашему компоненту. Такой объект называется «пропсы».

Например, этот компонент выведет «Привет, Алиса» на страницу:

```js{1,5}
function Welcome(props) {
  return <h1>Привет, {props.name}</h1>;
}

const element = <Welcome name="Алиса" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://components-and-props/rendering-a-component)

Давайте разберём, что именно здесь происходит:

1. Мы передаём `<Welcome name="Алиса" />` React-элемент в `ReactDOM.render()`.
2. React вызывает наш компонент `Welcome` с пропсами `{name: 'Алиса'}`.
3. Наш компонент `Welcome` возвращает `<h1>Привет, Алиса</h1>` элемент в качестве результата.
4. React DOM эффективно обновляет DOM, чтобы получилось `<h1>Привет, Алиса</h1>`.

>**Примечание:** Компоненты всегда должны называться с заглавной буквы.
>
>React принимает компоненты, начинающиеся с маленькой буквы, за DOM-тэги. Например, `<div />` представляет собой div-тэг из HTML, а `<Welcome />` это уже наш компонент `Welcome`, который должен быть доступен в области видимости.
>
>Вы можете почитать, почему это так работает [здесь.](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)

## Композиция компонентов {#composing-components}

Компоненты могут ссылаться на другие компоненты в возвращённом ими дереве. Это позволяет нам использовать одну и ту же абстракцию — компоненты — на любом уровне нашего приложения. Не важно, пишем ли мы кнопку, форму, диалог или целый экран: все они, как правило, представляют собой компоненты в React-приложениях.

Например, компонент `App` может отрендерить компонент `Welcome` несколько раз:

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Алиса" />
      <Welcome name="Базилио" />
      <Welcome name="Буратино" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[](codepen://components-and-props/composing-components)

В приложениях, написанных на React с нуля, как правило, есть один компонент `App`, который находится на самом верху. Тем не менее, если вы переписываете существующее приложение на React, имеет смысл начать работу с маленького компонента типа `Button` и постепенно двигаться «вверх» по иерархии.

## Извлечение компонентов {#extracting-components}

Не бойтесь разбивать компоненты на части.

К примеру, допустим у нас есть компонент `Comment`:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components)

Этот компонент представляет собой комментарий в социальной сети. Его пропсы включают в себя `author` (объект), `text` (строка), и `date` (дата).

С этим компонентом может быть не очень удобно работать из-за излишней вложенности. Мы также не можем повторно использовать его составные части. Давайте извлечём из него пару компонентов.

Для начала, мы извлечём `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

Компоненту `Avatar` незачем знать, что он рендерится внутри `Comment`. Поэтому мы дали его пропу чуть менее конкретное имя — `user`, а не `author`.

Пропсы следует называть так, чтобы они имели смысл в первую очередь с точки зрения самого компонента, а уже во вторую тех компонентов, которые его рендерят.

Теперь мы можем немножко упростить наш `Comment`:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Следующим шагом мы извлечём компонент `UserInfo`, который рендерит `Avatar` рядом с именем пользователя:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Это позволит нам ещё сильнее упростить `Comment`:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components-continued)

Извлечение компонентов может сначала показаться неблагодарной работой. Тем не менее, в больших приложениях очень полезно иметь палитру компонентов, которые можно многократно использовать. Если вы не уверены, извлекать компонент или нет, вот простое правило. Если какая-то часть интерфейса многократно в нём повторяется (`Button`, `Panel`, `Avatar`) или сама по себе достаточно сложная (`App`, `FeedStory`, `Comment`), её имеет смысл вынести в независимый компонент.

## Пропсы можно только читать {#props-are-read-only}

Компонент никогда не должен что-то записывать в свои пропсы — вне зависимости от того, [функциональный он или классовый](#function-and-class-components).

Возьмём для примера функцию `sum`:

```js
function sum(a, b) {
  return a + b;
}
```

Такие функции называют [«чистыми»](https://ru.wikipedia.org/wiki/%D0%A7%D0%B8%D1%81%D1%82%D0%BE%D1%82%D0%B0_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8) потому, что они не меняют свои входные данные и предсказуемо возвращают один и тот результат для одних и тех же аргументов.

А вот пример нечистой функции — она записывает данные в свои же аргументы:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React достаточно гибкий, но есть одно правило, которое нельзя нарушать:

**React-компоненты обязаны вести себя как чистые функции по отношению к своим пропсам.**

Конечно, интерфейсы приложений обычно изменяются с течением времени. В [следующей главе](/docs/state-and-lifecycle.html) мы узнаем о том, что такое «состояние» компонента. Состояние даёт компонентам возможность реагировать на действия пользователя, ответы сервера и другие события, не нарушая чистоту компонента. 
