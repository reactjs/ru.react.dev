---
title: JavaScript в JSX с использованием фигурных скобок
---

<Intro>

JSX позволяет писать HTML-подобную разметку внутри файла JavaScript, чтобы держать логику рендеринга и контент в одном месте. Иногда вы захотите добавить немного логики на JavaScript или обратиться к динамическому свойству внутри этой разметки. В этой ситуации вы можете использовать фигурные скобки в своём JSX, чтобы открыть доступ к JavaScript.

</Intro>

<YouWillLearn>

* Как передавать строки с кавычками
* Как обратиться к переменной JavaScript внутри JSX с помощью фигурных скобок
* Как вызвать функцию JavaScript внутри JSX с помощью фигурных скобок
* Как использовать объект JavaScript внутри JSX с помощью фигурных скобок

</YouWillLearn>

## Передача строк с кавычками {/*passing-strings-with-quotes*/}

Когда вы хотите передать строковый атрибут в JSX, вы помещаете его в одинарные или двойные кавычки:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Грегорио И. Зара"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Здесь `"https://i.imgur.com/7vQD0fPs.jpg"` и `"Грегорио И. Зара"` передаются как строки.

А что, если вы хотите динамически задать значение `src` или текста `alt`? Вы можете **использовать значение из JavaScript, заменив `"` и `"` на `{` и `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Грегорио И. Зара';
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

Обратите внимание на разницу между `className="avatar"`, которое задаёт имя CSS-класса `"avatar"`, делающего изображение круглым, и `src={avatar}`, которое считывает значение переменной JavaScript, называемой `avatar`. Это потому, что фигурные скобки позволяют вам работать с JavaScript прямо в вашей разметке!

## Использование фигурных скобок: окно в мир JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX — это особый способ написания JavaScript. Это значит, что внутри JSX можно использовать JavaScript — с помощью фигурных скобок `{ }`. В примере ниже сначала объявляется имя учёного, `name`, затем встраивается внутри `<h1>` с помощью фигурных скобок:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Грегорио И. Зара';
  return (
    <h1>Список дел {name}</h1>
  );
}
```

</Sandpack>

Попробуйте изменить значение переменной `name` с `'Грегорио И. Зара'` на `'Хеди Ламарр'`. Видите, как изменился заголовок списка?

Любое выражение JavaScript будет работать между фигурными скобками, включая вызовы функций, например `formatDate()`:

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

Вы можете использовать фигурные скобки внутри JSX только двумя способами:

1. **Как текст** непосредственно внутри тега JSX: `<h1>Список дел {name}</h1>` будет работать, но `<{tag}>Список дел Грегорио И. Зара</{tag}>` — нет.
2. **Как атрибуты**, следующие непосредственно за знаком `=`: `src={avatar}` прочитает переменную `avatar`, но `src="{avatar}"` передаст строку `"{avatar}"`.

## Использование "двойных фигурных скобок": CSS и другие объекты в JSX. {/*using-double-curlies-css-and-other-objects-in-jsx*/}

В дополнение к строкам, числам и другим выражениям JavaScript, вы можете передавать объекты в JSX. Объекты также обозначаются фигурными скобками `{ name: "Хеди Ламарр", inventions: 5 }`. Поэтому, чтобы передать JS-объект в JSX, вы должны обернуть объект в ещё одни фигурные скобки: `person={{ name: "Хеди Ламарр", inventions: 5 }}`.

Это видно на примере встроенных CSS-стилей в JSX. React не требует использования встроенных стилей (CSS-классы отлично работают в большинстве случаев). Но когда вам нужен встроенный стиль, вы передаёте объект в атрибут `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Улучшить видеотелефон</li>
      <li>Подготовить лекции по аэронавтике</li>
      <li>Работать над спиртовым двигателем</li>
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

Вы можете увидеть объект JavaScript внутри фигурных скобок, если напишите его так:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

The next time you see `{{` and `}}` in JSX, know that it's nothing more than an object inside the JSX curlies!

Когда вы в следующий раз увидите `{{` и `}}` в JSX, знайте, что это просто объект внутри фигурных скобок JSX!

<Pitfall>

Свойства `встроенного стиля` записываются в camelCase. Например, HTML-код `<ul style="background-color: black">` записывается как `<ul style={{ backgroundColor: 'black' }}>` в вашем компоненте.

</Pitfall>

## Больше веселья с объектами JavaScript и фигурными скобками {/*more-fun-with-javascript-objects-and-curly-braces*/}

Вы можете объединить несколько выражений в один объект и ссылаться на них в вашем JSX с помощью фигурных скобок:

<Sandpack>

```js
const person = {
  name: 'Грегорио И. Зара',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Список дел {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Грегорио И. Зара"
      />
      <ul>
        <li>Улучшить видеотелефон</li>
        <li>Подготовить лекции по аэронавтике</li>
        <li>Работать над спиртовым двигателем</li>
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
  name: 'Грегорио И. Зара',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Компонент может использовать эти значения из `person` вот так:

```js
<div style={person.theme}>
  <h1>Список дел {person.name}</h1>
```

JSX очень минималистичный язык шаблонов, потому что он позволяет организовывать данные и логику с помощью JavaScript.

<Recap>

Теперь вы знаете почти все о JSX:

* Атрибуты JSX в кавычках передаются как строки.
* Фигурные скобки позволяют использовать JavaScript-логику и переменные в вашей разметке.
* Они работают внутри содержимого тега JSX или непосредственно после `=` в атрибутах.
* `{{` и `}}` не являются специальным синтаксисом: это объект JavaScript, спрятанный внутри фигурных скобок JSX.

</Recap>

<Challenges>

#### Исправьте ошибку {/*fix-the-mistake*/}

Этот код выдаёт ошибку `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'Грегорио И. Зара',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Список дел {person}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Грегорио И. Зара"
      />
      <ul>
        <li>Улучшить видеотелефон</li>
        <li>Подготовить лекции по аэронавтике</li>
        <li>Работать над спиртовым двигателем</li>
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

Можете найти проблему?

<Hint>Ищите то, что находится внутри фигурных скобок. Всё ли правильно мы туда помещаем?</Hint>

<Solution>

Так происходит потому, что этот пример рендерит *сам объект* в разметку, а не строку: `<h1>Список дел {person}</h1>` пытается отренлерить весь объект `person`! Рендер объектов как текстовое содержимое вызывает ошибку, потому что React не знает, как их отображать.

Чтобы это исправить замените `<h1>Список дел {person}</h1>` на `<h1>Список дел {person.name}</h1>`:

<Sandpack>

```js
const person = {
  name: 'Грегорио И. Зара',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Список дел {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Грегорио И. Зара"
      />
      <ul>
        <li>Улучшить видеотелефон</li>
        <li>Подготовить лекции по аэронавтике</li>
        <li>Работать над спиртовым двигателем</li>
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
  name: 'Грегорио И. Зара',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Список дел {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Грегорио И. Зара"
      />
      <ul>
        <li>Улучшить видеотелефон</li>
        <li>Подготовить лекции по аэронавтике</li>
        <li>Работать над спиртовым двигателем</li>
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

Переместите URL-адрес изображения в свойство `person.imageUrl` и прочитайте его из тега `<img>` с помощью фигурных скобок:

<Sandpack>

```js
const person = {
  name: 'Грегорио И. Зара',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Список дел {person.name}</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Грегорио И. Зара"
      />
      <ul>
        <li>Улучшить видеотелефон</li>
        <li>Подготовить лекции по аэронавтике</li>
        <li>Работать над спиртовым двигателем</li>
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

#### Запишите выражение внутри фигурных скобок JSX. {/*write-an-expression-inside-jsx-curly-braces*/}

В объекте ниже полный URL-адрес изображения разбит на четыре части: базовый URL, `imageId`, `imageSize` и расширение файла.

Мы хотим объединить эти атрибуты вместе в URL-адрес изображения: базовый URL (всегда `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) и расширение файла (всегда `'.jpg'`). Однако что-то не так с тем, как тег `<img>` указывает свой атрибут `src`.

Можете исправить?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Грегорио И. Зара',
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
      <h1>Список дел {person.name}</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Улучшить видеотелефон</li>
        <li>Подготовить лекции по аэронавтике</li>
        <li>Работать над спиртовым двигателем</li>
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

Чтобы проверить, что ваши правки сработали, попробуйте изменить значение `imageSize` на `'b'`. После ваших изменений изображение должно изменить свой размер.

<Solution>

Вы можете написать так `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` открывает JavaScript выражение
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` создаёт правильную строку URL
3. `}` закрывает JavaScript выражение

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Грегорио И. Зара',
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
      <h1>Список дел {person.name}</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Улучшить видеотелефон</li>
        <li>Подготовить лекции по аэронавтике</li>
        <li>Работать над спиртовым двигателем</li>
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

Вы также можете переместить этот выражение в отдельную функцию, например `getImageUrl` ниже:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Грегорио И. Зара',
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
      <h1>Список дел {person.name}</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Улучшить видеотелефон</li>
        <li>Подготовить лекции по аэронавтике</li>
        <li>Работать над спиртовым двигателем</li>
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

Переменные и функции могут помочь вам упростить разметку!

</Solution>

</Challenges>
