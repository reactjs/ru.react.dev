---
title: Описание пользовательского интерфейса
---

<Intro>

React — это JavaScript-библиотека для создания пользовательских интерфейсов (UI). UI состоит из небольших частей, таких как кнопки, текст и изображения. React позволяет объединять их в многократно используемые, вложенные *компоненты*. От веб-сайтов до мобильных приложений — всё на экране можно разбить на компоненты. В этой главе вы научитесь создавать, настраивать и условно отображать компоненты React.

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
* [Почему полезно рассматривать пользовательский интерфейс как деревья](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## Ваш первый компонент {/*your-first-component*/}

Приложения React строятся из изолированных частей пользовательского интерфейса, называемых *компонентами*. Компонент React — это функция JavaScript, которую вы можете дополнить разметкой. Компоненты могут быть маленькими, как кнопка, или большими, как целая страница. Вот компонент `Gallery`, отображающий три компонента `Profile`:

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

Каждый компонент React — это функция JavaScript, которая может содержать некоторую разметку, которую React отображает в браузере. Компоненты React используют расширение синтаксиса под названием JSX для представления этой разметки. JSX очень похож на HTML, но он немного строже и может отображать динамическую информацию.

Если мы вставим существующую HTML-разметку в компонент React, это не всегда сработает:

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

Если у вас есть существующий

## Ваш UI как дерево {/*your-ui-as-a-tree*/}

React использует деревья для моделирования взаимосвязей между компонентами и модулями.

Дерево рендеринга React — это представление родительско-дочерних отношений между компонентами.

<Diagram name="generic_render_tree" height={250} width={500} alt="Древовидный граф с пятью узлами, каждый из которых представляет компонент. Корневой узел находится вверху графа и помечен как 'Root Component'. От него идут две стрелки к узлам 'Component A' и 'Component C'. Каждая стрелка помечена как 'renders'. 'Component A' имеет одну стрелку 'renders' к узлу 'Component B'. 'Component C' имеет одну стрелку 'renders' к узлу 'Component D'.">

Пример дерева рендеринга React.

</Diagram>

Компоненты, расположенные ближе к вершине дерева, рядом с корневым компонентом, считаются компонентами верхнего уровня. Компоненты без дочерних компонентов являются листовыми компонентами. Такая категоризация компонентов полезна для понимания потока данных и производительности рендеринга.

Моделирование взаимосвязей между JavaScript-модулями — ещё один полезный способ понять ваше приложение. Мы называем это деревом зависимостей модулей.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="Древовидный граф с пятью узлами. Каждый узел представляет JavaScript-модуль. Верхний узел помечен как 'RootModule.js'. От него идут три стрелки к узлам: 'ModuleA.js', 'ModuleB.js' и 'ModuleC.js'. Каждая стрелка помечена как 'imports'. Узел 'ModuleC.js' имеет одну стрелку 'imports', указывающую на узел 'ModuleD.js'.">

Пример дерева зависимостей модулей.

</Diagram>

Дерево зависимостей часто используется инструментами сборки для объединения всего необходимого JavaScript-кода, который клиент должен скачать и отрисовать. Большой размер бандла ухудшает пользовательский опыт в React-приложениях. Понимание дерева зависимостей модулей помогает отлаживать такие проблемы.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Прочтите **[Ваш UI как дерево](/learn/understanding-your-ui-as-a-tree)**, чтобы узнать, как создавать деревья рендеринга и зависимостей модулей для React-приложения и как они являются полезными ментальными моделями для улучшения пользовательского опыта и производительности.

</LearnMore>


## Что дальше? {/*whats-next*/}

Перейдите к [Ваш первый компонент](/learn/your-first-component), чтобы начать читать эту главу по страницам!

Или, если вы уже знакомы с этими темами, почему бы не прочитать о [Добавлении интерактивности](/learn/adding-interactivity)?