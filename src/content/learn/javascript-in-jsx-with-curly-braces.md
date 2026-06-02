---
title: JavaScript in JSX with Curly Braces
---

<Intro>

JSX позволяет писать разметку в стиле HTML прямо в файле JavaScript, сохраняя логику рендеринга и контент в одном месте. Иногда вам захочется добавить немного JavaScript-логики или сослаться на динамическое свойство внутри этой разметки. В такой ситуации вы можете использовать фигурные скобки в вашем JSX, чтобы открыть окно в JavaScript.

</Intro>

<YouWillLearn>

* Как передавать строки в кавычках
* Как ссылаться на переменную JavaScript внутри JSX с помощью фигурных скобок
* Как вызывать функцию JavaScript внутри JSX с помощью фигурных скобок
* Как использовать объект JavaScript внутри JSX с помощью фигурных скобок

</YouWillLearn>

## Передача строк в кавычках {/*passing-strings-with-quotes*/}

Когда вы хотите передать строковый атрибут в JSX, вы заключаете его в одинарные или двойные кавычки:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Здесь `"https://i.imgur.com/7vQD0fPs.jpg"` и `"Gregorio Y. Zara"` передаются как строки.

Но что, если вы хотите динамически указать `src` или `alt` текст? Вы можете **использовать значение из JavaScript, заменив `"` и `"` на `{` и `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Обратите внимание на разницу между `className="avatar"`, который указывает CSS-класс `"avatar"`, делающий изображение круглым, и `src={avatar}`, который считывает значение переменной JavaScript с именем `avatar`. Это потому, что фигурные скобки позволяют вам работать с JavaScript прямо в вашей разметке!

## Использование фигурных скобок: окно в мир JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX — это особый способ написания JavaScript. Это означает, что внутри него можно использовать JavaScript — с помощью фигурных скобок `{ }`. В приведенном ниже примере сначала объявляется имя ученого `name`, а затем оно встраивается с помощью фигурных скобок в `<h1>`:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

Попробуйте изменить значение `name` с `'Gregorio Y. Zara'` на `'Hedy Lamarr'`. Видите, как меняется заголовок списка?

Любое выражение JavaScript будет работать между фигурными скобками, включая вызовы функций, такие как `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Где использовать фигурные скобки {/*where-to-use-curly-braces*/}

Вы можете использовать фигурные скобки в JSX только двумя способами:

1. **Как текст** непосредственно внутри JSX-тега: `<h1>{name}'s To Do List</h1>` работает, но `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` — нет.
2. **Как атрибуты** сразу после знака `=` : `src={avatar}` прочитает переменную `avatar`, но `src="{avatar}"` передаст строку `"{avatar}"`.

## Использование «двойных фигурных скобок»: CSS и другие объекты в JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Помимо строк, чисел и других выражений JavaScript, вы можете даже передавать объекты в JSX. Объекты также обозначаются фигурными скобками, например `{ name: "Hedy Lamarr", inventions: 5 }`. Поэтому, чтобы передать объект JS в JSX, вы должны заключить объект в еще одну пару фигурных скобок: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Вы можете увидеть это с встроенными стилями CSS в JSX. React не требует использования встроенных стилей (CSS-классы отлично подходят для большинства случаев). Но когда вам нужен встроенный стиль, вы передаете объект атрибуту `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Попробуйте изменить значения `backgroundColor` и `color`.

Вы действительно можете увидеть объект JavaScript внутри фигурных скобок, когда пишете его так:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

В следующий раз, когда вы увидите `{{` и `}}` в JSX, знайте, что это не более чем объект внутри фигурных скобок JSX!

<Pitfall>

Свойства встроенного `style` пишутся в camelCase. Например, HTML `<ul style="background-color: black">` будет записан как `<ul style={{ backgroundColor: 'black' }}>` в вашем компоненте.

</Pitfall>

## Больше возможностей с объектами JavaScript и фигурными скобками {/*more-fun-with-javascript-objects-and-curly-braces*/}

Вы можете объединить несколько выражений в один объект и ссылаться на них в вашем JSX внутри фигурных скобок:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

В этом примере объект JavaScript `person` содержит строку `name` и объект `theme`:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Компонент может использовать эти значения из `person` следующим образом:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX очень минималистичен как язык шаблонов, потому что он позволяет организовывать данные и логику с помощью JavaScript.

<Recap>

Теперь вы знаете почти все о JSX:

* Атрибуты JSX в кавычках передаются как строки.
* Фигурные скобки позволяют вставлять логику и переменные JavaScript в вашу разметку.
* Они работают внутри содержимого JSX-тега или сразу после `=` в атрибутах.
* `{{` и `}}` — это не специальный синтаксис: это объект JavaScript, помещенный внутрь фигурных скобок JSX.

</Recap>

<Challenges>

#### Исправьте ошибку {/*fix-the-mistake*/}

Этот код выдает ошибку `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Можете ли вы найти проблему?

<Hint>Посмотрите, что находится внутри фигурных скобок. Правильное ли мы туда поместили?</Hint>

<Solution>

Это происходит потому, что в этом примере *сам объект* рендерится в разметку, а не строка: `<h1>{person}'s Todos</h1>` пытается отрендерить весь объект `person`! Включение необработанных объектов в качестве текстового содержимого вызывает ошибку, потому что React не знает, как вы хотите их отобразить.

Чтобы исправить это, замените `<h1>{person}'s Todos</h1>` на `<h1>{person.name}'s Todos</h1>`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Извлеките информацию в объект {/*extract-information-into-an-object*/}

Извлеките URL изображения в объект `person`.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Переместите URL изображения в свойство `person.imageUrl` и считайте его из тега `<img>`, используя фигурные скобки:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Напишите выражение внутри фигурных скобок JSX {/*write-an-expression-inside-jsx-curly-braces*/}

В приведенном ниже объекте полный URL изображения разделен на четыре части: базовый URL, `imageId`, `imageSize` и расширение файла.

Мы хотим, чтобы URL изображения объединял эти атрибуты: базовый URL (всегда `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) и расширение файла (всегда `'.jpg'`). Однако в том, как тег `<img>` указывает свой `src`, есть ошибка.

Можете ли вы это исправить?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Чтобы проверить, сработал ли ваш фикс, попробуйте изменить значение `imageSize` на `'b'`. Изображение должно измениться в размере после вашего редактирования.

<Solution>

Вы можете написать это как `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` открывает выражение JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` создает правильную строку URL
3. `}` закрывает выражение JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Вы также можете вынести это выражение в отдельную функцию, как `getImageUrl` ниже:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Переменные и функции могут помочь вам сохранить разметку простой!

</Solution>

</Challenges>