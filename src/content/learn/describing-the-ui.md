---
title: Описание пользовательского интерфейса
---

<Intro>

React -- это JavaScript-библиотека для рендеринга пользовательских интерфейсов (UI). Интерфейс состоит из множества маленький частей: кнопок, изображений и текста. React позволяет объединять их в переиспользуемые *компоненты* и вкладывать друг в друга. Всё что вы видите на экране, будь то веб-сайт или мобильное приложение, может быть описано как набор компонентов. В этой главе вы узнаете как создавать, настраивать и показывать React-компоненты в зависимости от разных условий.

</Intro>

<YouWillLearn isChapter={true}>

* [Как написать ваш первый React-компонент](/learn/your-first-component)
* [Как и когда использовать компоненты из разных файлов](/learn/importing-and-exporting-components)
* [Как добавить разметку в JavaScript при помощи JSX](/learn/writing-markup-with-jsx)
* [Как использовать возможности JavaScript в JSX-разметке с помощью фигурных скобок](/learn/javascript-in-jsx-with-curly-braces)
* [Как настроить поведение компонентов с помощью пропсов](/learn/passing-props-to-a-component)
* [Как рендерить компоненты в зависимости от условий](/learn/conditional-rendering)
* [Как рендерить список компонентов](/learn/rendering-lists)
* [Как избежать появления багов с помощью "чистых" функций](/learn/keeping-components-pure)

</YouWillLearn>

## Ваш первый компонент {/*your-first-component*/}

React-приложения состоят из изолированных кусочков интерфейса, которые называют *компонентами*. React-компонент -- это JavaScript-функция, в которую вы можете добавить разметку. Компоненты могут быть маленькими (например, кнопка) или большими (например, целая страница приложения). Ниже приведён код компонента `Gallery`, который рендерит три компонента `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Кэтрин Джонсон"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Выдающиеся учёные</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Изучите статью **[Ваш первый компонент](/learn/your-first-component)**, чтобы узнать как объявлять и использовать React-компоненты.

</LearnMore>

## Импорт и экспорт компонентов {/*importing-and-exporting-components*/}

Вы можете объявлять сколько угодно компонентов в одном файле, но с большими файлами становится затруднительно работать. Чтобы избежать этой проблемы, вы можете поместить компонент в его собственный файл, *экспортировать*, а затем *импортировать* этот компонент в другие файлы:


<Sandpack>

```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Выдающиеся учёные</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Харт"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Ознакомьтесь со статьёй **[Импорт и экспорт компонентов](/learn/importing-and-exporting-components)**, чтобы научиться выносить компоненты в их собственные файлы.

</LearnMore>

## Написание JSX-разметки {/*writing-markup-with-jsx*/}

Каждый React-компонент -- это JavaScript-функция, которая может содержать разметку для рендеринга в браузере. React-компоненты используют специальный синтаксис, названный JSX, чтобы описывать разметку. JSX очень похож на HTML, но немного строже и позволяет отображать динамическую информацию.

Если мы просто вставим существующую HTML-разметку, это необязательно будет работать:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Этот код не совсем рабочий!
    <h1>Список дел Хеди Ламарр</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Хеди Ламарр"
      class="photo"
    >
    <ul>
      <li>Изобрести новый светофор
      <li>Отрепетировать сцену из фильма
      <li>Усовершенствовать технологии связи
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Если вы хотите использовать HTML-код наподобие этого, вы можете исправить его проблемы с помощью [конвертера](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Список дел Хеди Ламарр</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Хеди Ламарр"
        className="photo"
      />
      <ul>
        <li>Изобрести новый светофор</li>
        <li>Отрепетировать сцену из фильма</li>
        <li>Улучшить технологии связи</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Прочитайте статью **[Написание JSX-разметки](/learn/writing-markup-with-jsx)**, чтобы узнать как писать работающий JSX.

</LearnMore>

## JavaScript в JSX с использованием фигурных скобок {/*javascript-in-jsx-with-curly-braces*/}

JSX позволяет писать HTML-подобную разметку внутри JavaScript-файла, таким образом логика рендеринга и данные оказываются в одном месте. Иногда у вас может возникнуть желание добавить немного логики или использовать динамическую переменную в разметке. В этой ситуации вы можете использовать фигурные скобки внутри JSX, чтобы  "открыть окно" в JavaScript:

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
        <li>Усовершенствовать видеофон</li>
        <li>Подготовить лекции по воздухоплаванию</li>
        <li>Поработать над двигателем на спиртовом топливе</li>
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

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Прочитайте статью **[JavaScript в JSX с использованием фигурных скобок](/learn/javascript-in-jsx-with-curly-braces)**, чтобы узнать как получить доступ к JavaScript из JSX.

</LearnMore>

## Передача пропсов в компонент {/*passing-props-to-a-component*/}

React-компоненты используют *пропсы*, чтобы общаться друг с другом. Каждый родительский компонент может сообщить некоторую информацию дочерним компонентам, передав её через пропсы. Пропсы могут напомнить вам HTML-атрибуты, но при их помощи вы можете передать любое JavaScript-значение, включая объекты, массивы, функции и даже JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Кацуко Сарухаси',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Обратитесь к статье **[Передача пропсов в компонент](/learn/passing-props-to-a-component)**, чтобы узнать как передавать и читать пропсы.

</LearnMore>

## Условный рендеринг {/*conditional-rendering*/}

Вам наверняка потребуется изменять отображение ваших компонентов в браузере в зависимости от различных условий. React позволяет рендерить разный JSX, используя возможности синтаксиса JavaScript для обработки условий, такие как инструкции `if`, оператор `&&` и тернарный оператор `? :`.

В следующем примере оператор `&&` используется, чтобы опционально рендерить галочку:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item
          isPacked={true}
          name="Скафандр"
        />
        <Item
          isPacked={true}
          name="Шлем с сусальным золотом"
        />
        <Item
          isPacked={false}
          name="Фотография Тэм"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Прочитайте статью **[Условный рендеринг](/learn/conditional-rendering)** и узнайте все способы, как можно отображать данные в зависимости от условий.

</LearnMore>

## Рендер списков {/*rendering-lists*/}

В веб-программировании часто бывает необходимо показать какой-нибудь список. Вы можете использовать методы JavaScript `filter()` и `map()` вместе с React, чтобы отфильтровать и преобразовать ваш массив данных в список компонентов.

Для каждого элемента массива вы должны указать `key` (ключ). Как правило, в качестве ключа вы будете использовать идентификатор из базы данных. Ключи позволяют React отслеживать положение элемента в списке, даже когда список меняется.

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ', '}
        { person.gender === 'женский' ? 'известна ' : 'известен ' } благодаря {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Учёные</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Кэтрин Джонсон',
  profession: 'математик',
  accomplishment: 'астродинамическим расчётам',
  gender: 'женский',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Марио Хосе Молина',
  profession: 'химик',
  accomplishment: 'открытию арктических озоновых дыр',
  gender: 'мужской',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Мухаммад Абдус Салам',
  profession: 'физик',
  accomplishment: 'теории электромагнитных взаимодействий',
  gender: 'мужской',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Перси Джулиан',
  profession: 'химик',
  accomplishment: 'исследованиям в области производства кортизона, других кортикостероидов и противозачаточных таблеток',
  gender: 'мужской',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субраманьян Чандрасекар',
  profession: 'астрофизик',
  accomplishment: 'расчётам предельной массы белых карликов',
  gender: 'мужской',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

В статье **[Рендер списков](/learn/rendering-lists)** вы найдёте более подробную информацию о том, как отобразить массив данных и выбрать правильный ключ.

</LearnMore>

## Использование чистых компонентов {/*keeping-components-pure*/}

Некоторые JavaScript-функции называют *чистыми.* Чистая функция:

* **Занимается своим делом.** Она не меняет объекты и переменные, которые существовали до её создания.
* **Даёт предсказуемый результат.** Для одного и того же набора входных значений чистая функция возвращает одинаковый результат.

Если вы будете писать ваши компоненты как чистые функции, вы сможете избежать ряда трудноуловимых дефектов и непредсказуемого поведения по мере роста вашей кодовой базы. Вот пример компонента, который *не является чистой функцией*:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Чашка чая для гостя #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Чтобы сделать компонент чистым вам нужно передать в него проп, а не изменять созданную ранее переменную:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Чашка чая для гостя #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Прочитайте статью **[Использование чистых компонентов](/learn/keeping-components-pure)**, чтобы узнать как использовать чистые и предсказуемые функции для создания компонентов.

</LearnMore>

## Что дальше? {/*whats-next*/}

Перейдите к статье [Ваш первый компонент](/learn/your-first-component), чтобы изучить эту главу страница за страницей!

Или, если вы уже знакомы с этими темами, почему бы не почитать про [Добавление интерактивности](/learn/adding-interactivity)?
