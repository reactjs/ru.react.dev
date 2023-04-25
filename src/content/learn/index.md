---
title: Quick Start
---

<Intro>

Добро пожаловать в документацию React! Эта страница посвятит вас в основы 80% концепций React, которыми вы будете пользоваться каждый день.
</Intro>

<YouWillLearn>

- Как создавать и вкладывать компоненты
- Как добавлять разметку и стили
- Как отображать данные
- Как отрисовывать условия и списки
- Как реагировать на события и обновлять экран
- Как обмениваться данными между компонентами

</YouWillLearn>

## Создание и вложение компонентов {/*components*/}

Приложения на React собираются из *компонентов*. Компонент — это часть пользовательского интерфейса, у которой есть свои логика и внешность. Компоненты в размерах разнятся от мелких кнопок до больших цельных страниц.

Компоненты React — это функции JavaScript, которые возвращают разметку:

```js
function MyButton() {
  return (
    <button>Я кнопка</button>
  );
}
```

Вы объявили компонент `MyButton`, который можно вложить в другой компонент:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Добро пожаловать в моё приложение</h1>
      <MyButton />
    </div>
  );
}
```

Обратите внимание на то, что `<MyButton />` начинается с заглавной буквы. Это отличительная черта компонентов React. Названия компонентов в React всегда должны начинаться с заглавной буквы, а теги HTML — с маленькой.

Посмотрите на результат:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Я кнопка
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Добро пожаловать в моё приложение</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

Ключевые слова `export default` указывают на основной компонент в файле. Для того, чтобы понять некоторые особенности синтаксиса JavaScript, можно пользоваться ресурсами [MDN](https://developer.mozilla.org/ru-RU/docs/web/javascript/reference/statements/export) и [learn.javascript.ru](https://learn.javascript.ru/import-export).

## Написание разметки с JSX {/*writing-markup-with-jsx*/}

Используемый в примерах выше синтаксис разметки называется *JSX*. Он не обязателен, но большинство проектов на React предпочитают его использовать за удобство. Все [инструменты, которые мы рекомендуем для локальной разработки,](/learn/installation) поддерживают JSX из коробки.

JSX строже HTML. Вам нужно закрывать теги вроде `<br />`. Ваш компонент также не может возвращать несколько JSX-тегов. Их нужно будет обернуть внутрь общего родителя, например, `<div>...</div>` или пустую обёртку вида `<>...</>`:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>Обо мне</h1>
      <p>Привет.<br />Как дела?</p>
    </>
  );
}
```

Для того, чтобы перевести большое количество HTML-верстки в JSX, можно использовать [онлайн-конвертер.](https://transform.tools/html-to-jsx)

## Добавление стилей {/*adding-styles*/}

В React CSS-классы объявляются с помощью свойства `className`. Оно работает аналогично HTML-аттрибуту [`class`](https://developer.mozilla.org/ru-RU/docs/Web/HTML/Global_attributes/class):

```js
<img className="avatar" />
```

В отдельном CSS-файле вы прописываете стили для него. 

```css
/* В вашем CSS */
.avatar {
  border-radius: 50%;
}
```

React не ограничивает вас в том, как добавлять CSS-файлы. В самом простом случае вы добавляете тэг [`<link>`](https://developer.mozilla.org/ru-RU/docs/Web/HTML/Element/link) в ваш HTML-файл. Если вы используете инструмент для сборки или фреймворк, обратитесь к его документации, чтобы понять, как добавить CSS-файл в ваш проект.

## Отображение данных {/*displaying-data*/}

JSX позволяет вам встраивать разметку в JavaScript, а фигурные скобки позволяют вам "выйти" в JavaScript для того, чтобы вы могли встроить какую-либо переменную из вашего кода и показать ее пользователю. Например, этот код отобразит переменную `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Вы тажке можете "выйти в JavaScript" из атрибутов JSX, но вам нужно использовать фигурные скобки *вместо* кавычек. Например, `className="avatar"` передает строку `"avatar"` как класс CSS, но `src={user.imageUrl}` считывает значение JavaScript-переменной `user.imageUrl` и затем передает его в качестве атрибута `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Вы также можете прописывать более сложные выражения внутри фигурных скобок JSX, например, [сложение строк](https://learn.javascript.ru/operators#slozhenie-strok-pri-pomoschi-binarnogo):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Фото ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

В этом примере `style={{}}` не явлется особым синтаксисом, а представляет из себя обычный объект `{}` внутри фигурных скобок JSX `style={ }`. Вы можете использовать атрибут `style` в случаях, когда ваши стили зависят от переменных JavaScript.

## Условный рендеринг {/*conditional-rendering*/}

В React не существует особого синтаксиса для описания условий, вместо этого пишите привычный вам код на JavaScript. Например, для условного использования JSX-кода можно применять инструкцию [`if`](https://developer.mozilla.org/ru-RU/docs/Web/JavaScript/Reference/Statements/if...else):

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Если вы предпочитаете писать более компактный код, используйте [условный оператор `?`.](https://developer.mozilla.org/ru-RU/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) В отличие от `if` его можно использовать в JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Когда вам не нужна ветка `else`, можно использовать более короткий [логический оператор `&&`](https://developer.mozilla.org/ru-RU/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Все эти способы подходят и для условного задания атрибутов. Если вам не знакомы такие синтаксические конструкции JavaScript, вы можете начать с повсеместного использования `if...else`.

## Рендеринг списков {/*rendering-lists*/}

Для отрисовки списков компонентов вам будет нужно использовать такие возможности JavaScript, как [цикл `for`](https://developer.mozilla.org/ru-RU/docs/Web/JavaScript/Reference/Statements/for) и [функция массива `map()`](https://developer.mozilla.org/ru-RU/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

Например, представим, что у вас есть массив продуктов:

```js
const products = [
  { title: 'Капуста', id: 1 },
  { title: 'Чеснок', id: 2 },
  { title: 'Яблоко', id: 3 },
];
```

Преобразуйте этот массив в массив элементов `<li>` с помощью функции `map()` внутри вашего компонента: 

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Обратите внимание, что у `<li>` есть атрибут `key`. Для каждого элемента списка вам нужно задавать ключ в виде строки или числа, который позволит однозначно определить этот элемент среди остальных в списке. Обычно этот ключ берется из ваших данных, например, ключом может быть идентификатор из базы данных. React использует информацию о ключах, чтобы понимать, что случилось, если вы добавите, удалите или переупорядочите элементы.

<Sandpack>

```js
const products = [
  { title: 'Капуста', isFruit: false, id: 1 },
  { title: 'Чеснок', isFruit: false, id: 2 },
  { title: 'Яблоко', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Обработка событий {/*responding-to-events*/}

Можно реагировать на события, объявляя внутри ваших компонентов функции *обработчиков событий*:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('Вы нажали на меня!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

Заметьте: у `onClick={handleClick}` нет скобок в конце! Не _вызывайте_ функцию обработчика событий: вам нужно просто ее *передать*. React вызовет ваш обработчик событий, когда пользователь кликнет по кнопке.

## Обновление экрана {/*updating-the-screen*/}

Вам может понадобиться, чтобы ваш компонент "помнил" какую-то информацию и отображал её. Например, вы хотите посчитать, сколько раз была нажата кнопка. Чтобы это сделать, добавьте *состояние* в ваш компонент.

Сначала импортируйте [`useState`](/reference/react/useState) из React:

```js
import { useState } from 'react';
```

Теперь можно объявить *переменную состояния* внутри вашего компонента:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState` вернет вам две сущности: текущее состояние (`count`) и функцию (`setCount`), которая обновляет его. Можно назвать их как вам угодно, но такого рода вещи принято называть `[something, setSomething]`.

На первый показ кнопки `count` будет иметь значение `0`, потому что вы передали `0` в `useState()`. Когда вы хотите изменить состояние, вызовите `setCount()` и передайте туда новое значение. Клик на эту кнопку будет увеличивать счётчик:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Кликнули {count} раз
    </button>
  );
}
```

React снова вызовет функцию вашего компонента. На этот раз `count` будет равно `1`, затем `2`, и так далее.

Если вы рендерите один и тот же компонент несколько раз, то у каждого из них будет своё состояние. Попробуйте покликать на каждую кнопку по отдельности:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Независимо обновляющиеся счётчики</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Кликнули {count} раз
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Обратите внимание на то, как каждая кнопка "помнит" свое состояние `count` и не влияет на другие кнопки. 

## Использование хуков {/*using-hooks*/}

Функции, которые начинаются с `use`, называются *хуками*. `useState` — это встроенный в React хук. В [справочнике API](/reference/react) приводятся другие встроенные хуки. Также, вы можете писать свои собственные хуки, совмещая уже существующие.

У хуков больше ограничений, чем у других функций. Хуки могут вызываться только *в начале* ваших компонентов (или других хуков). Если вам нужен `useState` в условии или цикле, выделите новый компонент и используйте его там.

## Обмен данными между компонентами {/*sharing-data-between-components*/}

В предыдущем примере у каждого `MyButton` имеется своё собственное состояние `count`, и при клике на каждую кнопку обновление `count` происходило только у нажатой кнопки.

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Диаграмма, показывающая дерево из трех компонентов, состоящее из компонента-родителя под названием MyApp и двух дочерних компонентов под названием MyButton. Оба компонента MyButton содержат счётчик со значением, равным нулю.">

В начале у каждого `MyButton` состояние `count` равно `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="Диаграмма, аналогичная предыдущей, с выделенным значением счётчика первого компонента-потомка MyButton, обозначающая клик и увеличение значение счётчика на один. Второй компонент MyButton до сих пор содержит значение, равное нулю." >

Первый компонент `MyButton` обновляет свой `count` значением `1`

</Diagram>

</DiagramGroup>

Однако, вы будете часто сталкиваться с ситуацией, когда вам будет нужно, чтобы компоненты *имели общие данные и всегда обновлялись вместе*.

Для того, чтобы оба компонента `MyButton` отображали одно и то же значение `count`, вам нужно выделить состояние из отдельных кнопок "вверх" в ближайший компонент, содержащий эти компоненты.

В этом случае таким компонентом является `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Диаграмма, показывающая дерево из трех компонентов, одного родителя под названием MyApp и двух потомков под названием MyButton. MyApp содержит значение счётчика, равное нулю, которое передаётся вниз обоим компонентам MyButton, которые также показывают значение, равное нулю." >

Сначала состояние `count` компонента `MyApp` равно `0` и передаётся обоим потомкам

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="Аналогичная предыдущей диаграмма, с выделенным значением первого компонента-потомка MyApp, обозначающая клик и увеличение значение счётчика на один. Направление к обоим компонентам-потомкам MyButton также подсвечено, и значение счётчиков в каждом потомке равно одному, обозначая передачу значения вниз." >

При клике `MyApp` обновляет своё состояние `count` значением `1` и передает его вниз обоим потомкам

</Diagram>

</DiagramGroup>

Теперь, когда вы нажимаете на любую из кнопок, `count` в `MyApp` будет менять своё значение, что в свою очередь повлечёт обновление счётчиков в обоих компонентах `MyButton`. Вот как это можно прописать в коде.

Сначала *переместите вверх состояние* из `MyButton` в `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Независимо обновляющиеся счётчики</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... мы перемещаем код отсюда ...
}

```

Затем *передайте состояние на уровень ниже* из `MyApp` каждому `MyButton` вместе с общим обработчиком клика. Можно передавать информацию в `MyButton` через фигурные скобки JSX таким же образом, как вы это делали со встроенными тегами наподобие `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Совместно обновляющиеся счётчики</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Информация, которую вы передаёте таким образом, называется _пропсами_. Теперь у компонента `MyApp` есть состояние `count` и обработчик событий `handleClick`, *которые он передает в качестве пропсов* каждой кнопке-потомку.

Наконец, подправьте компонент `MyButton` так, чтобы он *считывал* пропсы, переданные от своего родителя:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Кликнули {count} раз
    </button>
  );
}
```

Когда вы нажимаете на кнопку, срабатывает обработчик `onClick`. В каждой кнопке в качестве значения пропа `onClick` задана функция `handleClick` из `MyApp`, таким образом, исполняется код этой функции. Этот код вызывает `setCount(count + 1)`, тем самым увеличивая переменную состояния `count`. Новое значение `count` передается в качестве пропа каждой кнопке, таким образом все кнопки будут показывать это новое значение. Это называется "подъёмом состояния вверх". Поднимая состояние вверх, вы делаете его общим для всех компонентов.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Следующие шаги {/*next-steps*/}

Теперь вы знаете, как писать простой код для React!

Ознакомьтесь с [введением](/learn/tutorial-tic-tac-toe), в рамках которого вы примените полученные знания и соберёте свое первое мини-приложение на React.
