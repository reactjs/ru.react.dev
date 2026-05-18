---
title: Описание пользовательского интерфейса
---
<Intro>

React — это JavaScript-библиотека для создания пользовательских интерфейсов (UI). Пользовательские интерфейсы строятся из небольших частей, таких как кнопки, текст и изображения. React позволяет объединять их в многократно используемые, вложенные *компоненты*. От веб-сайтов до мобильных приложений — всё на экране можно разбить на компоненты. В этой главе вы научитесь создавать, настраивать и условно отображать компоненты React.

</Intro>

<YouWillLearn isChapter={true}>

* [Как написать свой первый компонент React](/learn/your-first-component)
* [Когда и как создавать файлы с несколькими компонентами](/learn/importing-and-exporting-components)
* [Как добавлять разметку в JavaScript с помощью JSX](/learn/writing-markup-with-jsx)
* [Как использовать фигурные скобки в JSX для доступа к функциональности JavaScript из ваших компонентов](/learn/javascript-in-jsx-with-curly-braces)
* [Как настраивать компоненты с помощью пропсов](/learn/passing-props-to-a-component)
* [Как условно отображать компоненты](/learn/conditional-rendering)
* [Как одновременно отображать несколько компонентов](/learn/rendering-lists)
* [Как избегать запутанных ошибок, сохраняя компоненты чистыми](/learn/keeping-components-pure)
* [Почему полезно понимать свой UI как деревья](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## Ваш первый компонент {/*your-first-component*/}

Приложения React строятся из изолированных частей UI, называемых *компонентами*. Компонент React — это функция JavaScript, которую вы можете дополнить разметкой. Компоненты могут быть маленькими, как кнопка, или большими, как целая страница. Вот компонент `Gallery`, отображающий три компонента `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
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

Прочитайте **[Ваш первый компонент](/learn/your-first-component)**, чтобы узнать, как объявлять и использовать компоненты React.

</LearnMore>

## Импорт и экспорт компонентов {/*importing-and-exporting-components*/}

Вы можете объявлять множество компонентов в одном файле, но большие файлы могут стать трудными для навигации. Чтобы решить эту проблему, вы можете *экспортировать* компонент в собственный файл, а затем *импортировать* этот компонент из другого файла:


<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Прочитайте **[Импорт и экспорт компонентов](/learn/importing-and-exporting-components)**, чтобы узнать, как разделять компоненты на собственные файлы.

</LearnMore>

## Написание разметки с помощью JSX {/*writing-markup-with-jsx*/}

Каждый компонент React — это функция JavaScript, которая может содержать разметку, которую React отображает в браузере. Компоненты React используют синтаксическое расширение под названием JSX для представления этой разметки. JSX очень похож на HTML, но он немного строже и может отображать динамическую информацию.

Если мы вставим существующую HTML-разметку в компонент React, это не всегда будет работать:

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Если у вас есть существующий HTML, подобный этому, вы можете исправить его с помощью [конвертера](https://transform.tools/html-to-jsx):

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
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

Прочитайте **[Написание разметки с помощью JSX](/learn/writing-markup-with-jsx)**, чтобы узнать, как писать валидный JSX.

</LearnMore>

## JavaScript в JSX с фигурными скобками {/*javascript-in-jsx-with-curly-braces*/}

JSX позволяет писать разметку в стиле HTML внутри файла JavaScript, сохраняя логику рендеринга и контент в одном месте. Иногда вам захочется добавить немного логики JavaScript или сослаться на динамическое свойство внутри этой разметки. В такой ситуации вы можете использовать фигурные скобки в вашем JSX, чтобы "открыть окно" в JavaScript:

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

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Прочитайте **[JavaScript в JSX с фигурными скобками](/learn/javascript-in-jsx-with-curly-braces)**, чтобы узнать, как получать доступ к данным JavaScript из JSX.

</LearnMore>

## Передача пропсов компоненту {/*passing-props-to-a-component*/}

Компоненты React используют *пропсы* для взаимодействия друг с другом. Каждый родительский компонент может передавать некоторую информацию своим дочерним компонентам, давая им пропсы. Пропсы могут напомнить вам HTML-атрибуты, но через них можно передавать любые значения JavaScript, включая объекты, массивы, функции и даже JSX!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
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

```js src/utils.js
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

Прочитайте **[Передача пропсов компоненту](/learn/passing-props-to-a-component)**, чтобы узнать, как передавать и читать пропсы.

</LearnMore>

## Условный рендеринг {/*conditional-rendering*/}

Вашим компонентам часто придется отображать разные вещи в зависимости от разных условий. В React вы можете условно отображать JSX, используя синтаксис JavaScript, такой как `if` операторы, `&&` и операторы `? :`.

В этом примере оператор `&&` JavaScript используется для условного отображения галочки:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Прочитайте **[Условный рендеринг](/learn/conditional-rendering)**, чтобы узнать о различных способах условного отображения контента.

</LearnMore>

## Рендеринг списков {/*rendering-lists*/}

Часто вам придется отображать несколько похожих компонентов из коллекции данных. Вы можете использовать `filter()` и `map()` в JavaScript с React, чтобы фильтровать и преобразовывать ваш массив данных в массив компонентов.

Для каждого элемента массива вам нужно будет указать `key`. Обычно вы захотите использовать ID из базы данных в качестве `key`. Ключи позволяют React отслеживать местоположение каждого элемента в списке, даже если список изменяется.

<Sandpack>

```js src/App.js
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
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
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

Прочитайте **[Рендеринг списков](/learn/rendering-lists)**, чтобы узнать, как отображать список компонентов и как выбирать ключ.

</LearnMore>

## Сохранение чистоты компонентов {/*keeping-components-pure*/}

Некоторые функции JavaScript являются *чистыми*. Чистая функция:

* **Не вмешивается в чужие дела.** Она не изменяет объекты или переменные, которые существовали до её вызова.
* **Те же входные данные, тот же результат.** При одинаковых входных данных чистая функция всегда должна возвращать один и тот же результат.

Строго следуя принципу написания компонентов как чистых функций, вы можете избежать целого класса запутанных ошибок и непредсказуемого поведения по мере роста вашей кодовой базы. Вот пример нечистого компонента:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Плохо: изменение существующей переменной!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
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

Вы можете сделать этот компонент чистым, передав пропс вместо изменения существующей переменной:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
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

Прочитайте **[Сохранение чистоты компонентов](/learn/keeping-components-pure)**, чтобы узнать, как писать компоненты как чистые, предсказуемые функции.

</LearnMore>

## Ваш UI как дерево {/*your-ui-as-a-tree*/}

React использует деревья для моделирования взаимосвязей между компонентами и модулями.

Дерево рендеринга React — это представление родительских и дочерних отношений между компонентами.

<Diagram name="generic_render_tree" height={250} width={500} alt="График дерева с пятью узлами, каждый узел представляет компонент. Корневой узел находится вверху графика дерева и помечен как 'Root Component'. От него идут две стрелки вниз к узлам 'Component A' и 'Component C'. Каждая стрелка помечена как 'renders'. 'Component A' имеет одну стрелку 'renders' к узлу 'Component B'. 'Component C' имеет одну стрелку 'renders' к узлу 'Component D'.">

Пример дерева рендеринга React.

</Diagram>

Компоненты, находящиеся ближе к вершине дерева, рядом с корневым компонентом, считаются компонентами верхнего уровня. Компоненты без дочерних компонентов являются листовыми компонентами. Эта категоризация компонентов полезна для понимания потока данных и производительности рендеринга.

Моделирование взаимосвязей между модулями JavaScript — еще один полезный способ понять ваше приложение. Мы называем это деревом зависимостей модулей.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="График дерева с пятью узлами. Каждый узел представляет модуль JavaScript. Самый верхний узел помечен как 'RootModule.js'. От него идут три стрелки к узлам: 'ModuleA.js', 'ModuleB.js' и 'ModuleC.js'. Каждая стрелка помечена как 'imports'. Узел 'ModuleC.js' имеет одну стрелку 'imports', которая указывает на узел 'ModuleD.js'.">

Пример дерева зависимостей модулей.

</Diagram>

Дерево зависимостей часто используется инструментами сборки для объединения всего релевантного кода JavaScript, который клиент должен загрузить и отобразить. Большой размер бандла ухудшает пользовательский опыт в приложениях React. Понимание дерева зависимостей модулей полезно для отладки таких проблем.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Прочитайте **[Ваш UI как дерево](/learn/understanding-your-ui-as-a-tree)**, чтобы узнать, как создавать деревья рендеринга и деревья зависимостей модулей для приложения React, и как они являются полезными ментальными моделями для улучшения пользовательского опыта и производительности.

</LearnMore>

## Что дальше? {/*whats-next*/}

Перейдите к [Ваш первый компонент](/learn/your-first-component), чтобы начать читать эту главу страница за страницей!

Или, если вы уже знакомы с этими темами, почему бы не прочитать о [Добавлении интерактивности](/learn/adding-interactivity)?