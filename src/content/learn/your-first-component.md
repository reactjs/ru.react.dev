---
title: Ваш первый компонент
---

<Intro>

*Компоненты* — это один из основных концептов React. Они являются основой, на которой вы строите пользовательские интерфейсы (UI), что делает их идеальным местом для начала вашего пути в React!

</Intro>

<YouWillLearn>

* Что такое компонент
* Какую роль играют компоненты в React-приложении
* Как написать ваш первый React-компонент

</YouWillLearn>

## Компоненты: строительные блоки UI {/*components-ui-building-blocks*/}

В интернете HTML позволяет создавать нам структурированные документы, используя встроенный набор тегов, например `<h1>` и `<li>`:

```html
<article>
  <h1>Мой первый компонент</h1>
  <ol>
    <li>Компоненты: строительные блоки UI</li>
    <li>Определение компонента</li>
    <li>Использование компонента</li>
  </ol>
</article>
```

Разметка выше представляет эту статью как `<article>`, её заголовок как `<h1>` и (сокращённое) оглавление как упорядоченный список `<ol>`. Такая разметка, в сочетании с CSS для стилизации и JavaScript для создания интерактивности, кроется в каждой боковой панели, аватаре, модальном окне, выпадающем меню — каждой части UI, которую вы видите в интернете.

С React можно объединять разметку, CSS и JavaScript в ваши собственные "компоненты", **переиспользуемые элементы UI для вашего приложения**. Код оглавления выше, можно превратить в компонент `<TableOfContents />` и отрендерить его на любой странице. Внутри он всё ещё использует те же HTML-теги, такие как `<article>`, `<h1>` и т.д.

Как и HTML-теги, компоненты можно комбинировать, упорядочивать и вкладывать друг в друга для создания целых страниц. Например, страница документации, которую вы сейчас читаете, состоит из React-компонентов:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Документация</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

По мере роста вашего проекта вы заметите, что многие из ваших дизайнов можно создать, переиспользуя уже готовые компоненты, а это ускорит разработку. Наше оглавление выше может быть добавлено на любой экран как `<TableOfContents />`! Можно дать резкий старт своему проекту, используя тысячи компонентов с открытым исходным кодом, которые были созданы React-сообществом, например [Chakra UI](https://chakra-ui.com/) и [Material UI.](https://material-ui.com/)

## Определение компонента {/*defining-a-component*/}

Раньше при создании веб-страниц разработчики размечали свой контент, а затем добавляли щепотку интерактивности с помощью JavaScript. Это работало отлично, ведь интерактивность в интернете была просто приятной мелочью. Сегодня же это обязательная часть многих сайтов, еще больше — приложений. React ставит интерактивность на первое место, при этом используя ту же технологию: **React-компонент представляет собой JavaScript-функцию, которую можно _припудрить разметкой_.** Вот как это выглядит (вы можете редактировать пример ниже):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Кэтрин Джонсон"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

А вот как создать компонент:

### Шаг 1: Экспортировать компонент {/*step-1-export-the-component*/}

Префикс `export default` —  это [стандартный синтаксис JavaScript](https://developer.mozilla.org/ru/docs/web/javascript/reference/statements/export) (не является спецификой React). Он позволяет пометить основную функцию в файле, чтобы её можно было импортировать из других файлов. (Подробнее об импорте в [Импорт и Экспорт компонентов](/learn/importing-and-exporting-components)!)

### Шаг 2: Определить функцию {/*step-2-define-the-function*/}

С помощью `function Profile() { }` вы определяете JavaScript-функцию с именем `Profile`.

<Pitfall>

React-компоненты — это обычные JavaScript функции, но **их имена должны начинаться с заглавной буквы**, иначе они не будут работать!

</Pitfall>

### Шаг 3: Добавить разметку {/*step-3-add-markup*/}

Компонент возвращает тег `<img />` с атрибутами `src` и `alt`. `<img />` выглядит как HTML, но на самом деле под капотом это JavaScript! Этот синтаксис называется [JSX](/learn/writing-markup-with-jsx), и он позволяет вам вставлять разметку в JavaScript.

Оператор `return` можно записать в одну строку, как в этом компоненте:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кэтрин Джонсон" />;
```

Но если вся ваша разметка не находится на той же строке, что и ключевое слово `return`, то вы должны обернуть её в пару скобок:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кэтрин Джонсон" />
  </div>
);
```

<Pitfall>

Без скобок любой код на строках после `return` [будет проигнорирован](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Использование компонента {/*using-a-component*/}

Теперь, когда вы определили компонент `Profile`, вы можете вкладывать его в другие компоненты. Например, вы можете экспортировать компонент `Gallery`, который использует несколько компонентов `Profile`:

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
      <h1>Изумительные учёные</h1>
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

### Что видит браузер {/*what-the-browser-sees*/}

Обратите внимание на разницу в регистре:

* `<section>` в нижнем регистре, поэтому React знает, что мы обращаемся к HTML-тегу.
* `<Profile />` начинается с заглавной буквы `P`, поэтому React знает, что мы хотим использовать наш компонент с именем `Profile`.

А `Profile` содержит ещё больше HTML: `<img />`. В конечном итоге, вот что видит браузер:

```html
<section>
  <h1>Изумительные учёные</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кэтрин Джонсон" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кэтрин Джонсон" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Кэтрин Джонсон" />
</section>
```

### Вкладывание и организация компонентов {/*nesting-and-organizing-components*/}

Компоненты — это обычные функции JavaScript, поэтому вы можете держать несколько компонентов в одном файле. Это удобно, когда компоненты относительно небольшие или тесно связаны друг с другом. Если этот файл становится переполненным, вы всегда можете переместить `Profile` в отдельный файл. В скором времени вы узнаете, как это сделать на [странице об импортах.](/learn/importing-and-exporting-components)

Поскольку компоненты `Profile` рендерятся внутри компонента `Gallery`—даже несколько раз!—мы можем сказать, что `Gallery` является **родительским компонентом**, который рендерит каждый `Profile` как "ребёнка". Это часть магии React: вы можете определить компонент один раз и затем использовать его в любом количестве мест и сколько угодно раз.

<Pitfall>

Компоненты могут рендерить другие компоненты, но **вы никогда не должны вкладывать их определения:**

```js {2-5}
export default function Gallery() {
  // 🔴 Никогда не определяйте компонент внутри другого компонента!
  function Profile() {
    // ...
  }
  // ...
}
```

Код выше [очень медленный и вызывает ошибки.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Вместо этого определяйте каждый компонент на верхнем уровне:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Определяйте компоненты на верхнем уровне
function Profile() {
  // ...
}
```

Если дочернему компоненту нужны данные от родительского, [передавайте их через пропсы](/learn/passing-props-to-a-component), вместо вложенных определений.

</Pitfall>

<DeepDive>

#### Компоненты на все случаи жизни {/*components-all-the-way-down*/}

Ваше React-приложение начинается с "корневого" компонента. Обычно он создаётся автоматически при создании нового проекта. Например, если вы используете [CodeSandbox](https://codesandbox.io/), корневой компонент определён в файле `src/App.js`. Если вы используете фреймворк [Next.js](https://nextjs.org/), корневой компонент определён в файле `pages/index.js`. В этих примерах вы экспортировали корневые компоненты.

Большинство React-приложений используют компоненты повсюду. Это означает, что вы будете использовать компоненты не только для переиспользуемых элементов, таких как кнопки, но также для более крупных элементов: боковых панелей, списков и в конечном итоге, целых страниц! Компоненты — это удобный способ организации кода UI и разметки, даже если некоторые из них используются только один раз.

<<<<<<< HEAD
[Фреймворки на основе React](/learn/start-a-new-react-project) пошли ещё дальше. Вместо того, чтобы использовать пустой файл HTML и позволять React "захватывать" управление страницей с помощью JavaScript, они *также* автоматически генерируют HTML из ваших React-компонентов. Это позволяет вашему приложению показывать часть контента до того, как загрузится JavaScript код.
=======
[React-based frameworks](/learn/creating-a-react-app) take this a step further. Instead of using an empty HTML file and letting React "take over" managing the page with JavaScript, they *also* generate the HTML automatically from your React components. This allows your app to show some content before the JavaScript code loads.
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

Тем не менее, многие веб-сайты используют React только для [добавления интерактивности на существующие HTML-страницы.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) У них есть множество корневых компонентов вместо одного для всей страницы. Вы можете брать от React столько, сколько вам нужно.

</DeepDive>

<Recap>

Вы только что познакомились с React! Давайте повторим некоторые ключевые моменты.

* React позволяет вам создавать компоненты, **переиспользуемые элементы UI для вашего приложения.**
* В React-приложении каждый элемент UI это компонент.
* Компоненты React — это обычные функции JavaScript, за исключением того, что:
  
  1. Их имена всегда начинаются с заглавной буквы.
  2. Они возвращают разметку JSX.

</Recap>



<Challenges>

#### Экспортируйте компонент {/*export-the-component*/}

Этот пример не работает из-за того, что корневой компонент не экспортирован:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Аклилу Лемма"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Попробуйте исправить его самостоятельно прежде чем смотреть в решение!

<Solution>

Добавьте `export default` перед определением функции, вот так:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Аклилу Лемма"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Возможно, вы задаётесь вопросом, почему написать лишь `export` недостаточно, чтобы исправить этот пример. Вы можете узнать разницу между `export` и `export default` в разделе [Импорт и Экспорт компонентов.](/learn/importing-and-exporting-components)

</Solution>

#### Исправьте оператор return {/*fix-the-return-statement*/}

Что-то не так с оператором `return`. Сможете его исправить?

<Hint>

При попытке исправить оператор вы можете получить ошибку "Unexpected token". В этом случае убедитесь, что точка с запятой находится *после* закрывающей скобки. Оставив точку с запятой внутри `return ( )`, вы вызовите ошибку.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Кацуко Сарухаси" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Вы можете исправить этот компонент, записав оператор `return` в одну строку, вот так:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Кацуко Сарухаси" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Или обернув возвращаемуе JSX разметку в скобки, которые открываются сразу после `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Кацуко Сарухаси" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Найдите ошибку {/*spot-the-mistake*/}

Что-то не так с тем, как объявлен и использован компонент `Profile`. Сможете найти ошибку? (Попробуйте вспомнить, как React отличает компоненты от обычных тегов HTML!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Харт"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Изумительные учёные</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Имена React-компонентов должны начинаться с заглавной буквы.

Замените `function profile()` на `function Profile()`, а затем каждый `<profile />` на `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Харт"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Изумительные учёные</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Ваш компонент {/*your-own-component*/}

Напишите компонент с нуля. Вы можете дать ему любое допустимое имя и вернуть любую разметку. Если ничего не приходит на ум, то вы можете написать компонент `Congratulations`, который отображает заголовок `<h1>Хорошая работа!</h1>`. Не забудьте экспортировать компонент!

<Sandpack>

```js
// Напишите свой компонент ниже!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Хорошая работа!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
