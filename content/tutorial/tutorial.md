---
id: tutorial
title: "Руководство: Введение в React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

Это руководство не предполагает наличие знаний React.

## Прежде чем начать {#before-we-start-the-tutorial}

По ходу этого руководства мы создадим небольшую игру. **Возможно, вы захотите пропустить это, потому что вы не создаете игру, но вам стоит попробовать.** Походы, которые мы изучим в этом руководстве являются базовыми при создании любого React-приложения. Их освоение даст вам глубокое понимание React.

>Совет
>
>Это руководство создано для людей, которые предпочитают подход **учимся на практике**. Если вы предпочитаете разбираться с предметом с азов, то вам стоит заглянуть в наш [пошаговый учебник](/docs/hello-world.html). Вы можете рассматривать руководство и учебник, как дополняющие друг друга.

Руководство разделено на насколько секций:

* [Настройка оружения](#setup-for-the-tutorial) даст вам **отправную точку** для изучения руководства.
* [Обзор](#overview) научит вас **основам** React: компоненты, пропсы и состояние.
* [Создание игры](#completing-the-game) научит вас **наиболее распространенным подходам** в React-разработке.
* [Добавив Путешествие Во Времени](#adding-time-travel) вы получите  **более глубокое понимание** особенностей и сильных сторон React.

Вам не обязательно проходить все части за раз, чтобы получить пользу от этого руководства. Изучите столько, сколько можете - даже если это будет одна или две секции.

Вполне нормально копировать код по мере прохождения руководства. Но мы советуем набирать его самим. Это позволит вам подключить мышечную память и улучшит понимание.


### Что мы собираемся писать? {#what-are-we-building}

В этом руководстве мы покажем как создать интерактивную игру крестики-нолики на React.

Результат вы можете посмотреть здесь **[Готовая Игра](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Если ее код вам ни о чем не говорит, или вы не знакомы с синтаксисом - не беспокойтесь. Цель этого руководства - помочь вам разобраться с React и его синтаксисом.

Мы советуем вам поиграть в готовые крестики-нолики, прежде чем приниматься за руководство. Одна из особенностей, которую вы можете заметить - это нумерованный список справа от игрового поля. Этот список отображает историю всех игровых ходов, и обновляется по мере игры.

Как только вы познакомитесь с игрой - можете закрывать ее. Мы начнем с самого простого шаблона. Следующим шагом мы настроим окружение, чтобы вы могли начать создание игры.


### Предварительные требования {#prerequisites}

Мы будем полагать, что вы немного знакомы с HTML и JavaScript. Однако вы сможете изучать руководство, даже если вы пришли с других языков программирования. Мы также полагаем, что вы знакомы с такими понятиями программирования как функции, объекты, массивы и , в меньшей степени, классы.

Если вам нужен обзор по JavaScript, мы рекомендуем прочитать [вот этот учебник](https://developer.mozilla.org/ru/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Отметим, что мы используем некоторые особенности из ES6 - последней версии JavaScript. Такие как  [стрелочные функции](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [классы](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes), объявления [`let`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/let), и [`const`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/const). Вы можете воспользоваться [Babel REPL](babel://es5-syntax-example), чтобы узнать во что компилируется код на ES6.

## Настройка окружения {#setup-for-the-tutorial}

Есть два варианта прохождения этого руководства - вы можете писать код в вашем браузере, или вы можете настроить окружение для разработки на вашем компьютере.

### Вариант 1: Пишем код в браузере {#setup-option-1-write-code-in-the-browser}

Это самый быстрый способ для старта!

Для начала откройте эту **[Заготовку](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** в новой вкладке. Вы увидите пустое поле для игры в крестики-нолики и код на React. Мы будем изменять этот код по ходу написания игры.

Можете пропустить следующую чаcть и перейти к [Обзору](#overview) React.

### Вариант 2: Локальное окружение для разработки {#setup-option-2-local-development-environment}

Это не является обязательным и не требуется руководством!

<br>

<details>

<summary><b>Опционально: Инструкции для написания кода в вашем любимом редакторе</b></summary>

Эти настройки потребуют больше сил, но позволят продолжать работу с использованием выбранного вами редактора. Вот что нужно сделать:

1. Убедиться, что у вас установлена последняя версия  [Node.js](https://nodejs.org/en/).
2. Выполнить [инструкции по установке Create React App](/docs/create-a-new-react-app.html#create-react-app) для создания нового проекта.

```bash
npx create-react-app my-app
```

3. Удалить все файлы в папке `src/` нового проекта. 

> Примечание:
>
>**Не удаляйте саму папку `src`, только файлы внутри неё.** Следующим шагом мы заменим стандартные файлы нашими примерами.

```bash
cd my-app
cd src

# Для пользователей Mac или Linux:
rm -f *

# Или, для пользователей Windows
del *

# Затем, вернемся в папку проекта
cd ..
```

4. Создайте файл с именем `index.css` в папку `src/` и добавьте в него [вот этот CSS код](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Создайте файл с именем `index.js` в папку `src/` и добавьте в него [этот JS код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. В начало файла `index.js` в папке`src/` добавьте следующие три строчки:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Теперь, когда вы запустите `npm start` в папке проекта и откроете `http://localhost:3000` в браузере, вы должны увидеть пустое поле для крестиков-ноликов.

Мы рекомендуем выполнить [эти инструкции](https://babeljs.io/docs/editors/) для настройки подсветки синтаксиса в вашем редакторе.
</details>

### Помогите, я застрял! {#help-im-stuck}

Если вы застряли - обратитесь к [поддержке сообщества](/community/support.html). В частности [Чат Reactiflux](https://discord.gg/0ZcbPKXt5bZjGY5n) - это прекрасное место, где вам помогут. Если вы не дождались ответа или все еще не решили вопрос, пожалуйста, [задайте вопрос](https://github.com/reactjs/ru.reactjs.org/issues/new) и мы вам поможем.

## Обзор {#overview}

Теперь, после всех настроек, давайте сделаем обзор React!

### Что такое React? {#what-is-react}

React - это декларативная, эффективная и гибкая JavaScript библиотека для создания пользовательских интерфейсов. Она позволяет вам составлять сложный UI из маленьких изолированных кусочков кода, называемых "компоненты".

React имеет несколько разных видов компонент, но мы начнем с подклассов `React.Component`:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Список покупок для {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Пример использования: <ShoppingList name="Марк" />
```

Скоро мы перейдем к этим забавным, похожим на XML, тегам. Мы используем компоненты, чтобы объяснить React, что мы хотим увидеть на экране. Когда наш данные изменятся, React эффективно обновит и перерисует наши компоненты.

Здесь, `ShoppingList` - это пример **классового компонента React**, или **тип React-компонента**. Компонент принимает параметры, которые называются пропсы (`props`, сокращение от `properties` - свойства), и возвращает из метода `render()` иерархию представлений для отображения.

Метод `render` возвращает *описание* того, что вы ходите увидеть на экране. React берет это описание и отображает результат. Точнее, `render` возвращает **React-элемент**, который является легковесным описанием того, что нужно отрендерить. Большинство React-разработчиков используют специальный синтаксис под названием "JSX" для упрощения описания структуры. Синтаксис `<div />` преобразовывается в `React.createElement('div')`. Пример выше равнозначен вот этому:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Смотрите полную версию.](babel://tutorial-expanded-version)

Если вам интересно, то `createElement()` более подробно описан в [Документации](/docs/react-api.html#createelement), но мы не будем им пользоваться в этом руководства. Вместо этого мы продолжим пользоваться JSX.

JSX обладает всей мощью JavaScript. В JSX вы  можете использовать *любые* JavaScript выражения внутри фигурных скобок. Каждый React-элемент является JavaScript объектов, в котором вы можете хранить переменные или которым вы можете оперировать внутри программы.

Приведенный выше компонент `ShoppingList` только рендерит встроенные DOM-компоненты вроде `<div />` или `<li />`. Но вы также можете составлять и рендерить собственные компоненты. Например, теперь вы можете ссылаться на весь компонент со списком покупок написав `<ShoppingList />`. Каждый React-компонент инкапсулирован и может использоваться независимо, это позволяет создавать сложный UI из простых компонентов.

## Разберемся со стартовым кодом {#inspecting-the-starter-code}

Если вы собираетесь работать над руководством **в вашем браузере**, откройте этот код в новой вкладке **[начальный код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Если вы собираетесь работать над руководством **локально**, откройте `src/index.js` в папке вашего проекта (вы уже имели дело с этим файлом в секции [первоначальной настройки](#setup-option-2-local-development-environment)).

Этот стартовый код - база, с которой мы начнем разработку. Мы предоставили CSS-стили, так что все, что вам нужно - сосредоточиться на изучении React и программировании игры крестики-нолики.

Исследуя этот код, вы обнаружите, что у нас есть три React-компонента:

* Square (Квадрат)
* Board (Поле)
* Game (Игра)

Компонент `Square` отрисовывает просто `<button>`, а `Board` отрисовывает 9 таких элементов. Компонент `Game` рендерит поле c заглушками, которые мы изменим позже. Сейчас у нас нет ни одного интерактивного компонента.

### Передача данных через пропсы {#passing-data-through-props}

Для начала, давайте попробуем передать некоторые данные из нашего `Board`-компонента в компонент `Square`.
Изменим метод `renderSquare` внутри `Board`, чтобы он передавал в `Square` проп с назнанием `value`:


```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Изменим метод `render` внутри Square, заменив `{/* TODO */}` на `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

До:

![React Devtools](../images/tutorial/tictac-empty.png)

После: Вы должны увидеть число, внутри каждого отрисованного квадрата.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Поздравляем! Вы только что "пробросили проп" из родительского Board-компонта в дочерний Square-компонент.
Передача пропсов это то, как передаются даннные в React-приложениях - от родительских к дочерним компонентам.

### Делаем компонент интерактивным {#making-an-interactive-component}

Давайте при клике на Square-компонент будем заполнять его "X".
Сперва, изменим тег кнопки, который возвращается из `render()` метода Square-компонента, вот так:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('клик'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Теперь, если мы кликнем по `Square`, мы увидим в браузере сообщение.

>Примечание
>
>Чтобы меньше печатать и избегать [странного поведения `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), мы будем использовать [синтаксис стрелочных фукнций](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions) для обработчиков событий (здесь и ниже):
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('клик')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Обратите внимание что в `onClick={() => alert('click')}`, мы передаем *функцию* в качестве значения проп `onClick`. Она отработает только при клике. Опускать `() =>` и присать сразу `onClick={alert('click')}` - это распространенная ошибка. Такой код будет выдавать сообщение каждый раз, когда компонент перерендеривается..

Дальше мы хотим, чтобы Square-компонент "запоминал", что по ниму кликнули и отрисовывал "X".
Для "запоминания" компоненты используют **состояние**.

Компоненты React могут получить состояние устанавливая `this.state` в конструкторе. `this.state` должно рассматриваться как приватное свойство React-компонента, определяемое им самим. Давайте сохраним текущее значение Square в `this.state` и изменим его при клике.

Сперва добавим конструктор к классу, чтобы проинициализировать состояние:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('клик')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Примечание
>
>В [JavaScript классах](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes), вы всегда должны вызывать `super`, при объявлении конструктора в классе-наследнике. Все классовые React-компоненты у которых есть `constructor` должны начинаться с вызова `super(props)`.

Теперь изменим метод `render` компонента Square, для отображения текущего значения из стостояния при клике:

* Заменим `this.props.value` на `this.state.value` внутри тега `<button>`.
* Заменим обработчик `() => alert()` на `() => this.setState({value: 'X'})`.
* Поместим свойства `className` и `onClick` на разных строчках, для лучшей читабельности.

После этих изменений тег `<button>`, возвращаемый из метода `render` Square-компонента будет выглядеть так:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Вызывая `this.setState` из обработчика `onClick` (как это описано в методе `render`), мы говорим React, что нужно перерендерить Square каждый раз, когда по его `<button>` кликнули. После обновления, `this.state.value` внутри Square станет `X`, так что мы увидим `X` на игровом поле. Если вы кликните по любому Square, должен появиться `X`.

Когда вы вызваете `setState` внутри компонента, React так же автоматически обновляет дочерние компоненты.


**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Инструменты разработчика {#developer-tools}

Расширения React Devtools для браузеров [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) и [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) позволяют вам изучать дерево React-компонентов внутри панели инструментов разработчика вашего браузера.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">


React DevTools позволяют просматривать пропсы и состояние ваших React-компонентов.

После установки React DevTools, вы можете кликнуть правой кнопкой мыши на любом элемента страницы и нажать `Inspect` (`Просмотреть код`) для открытия инструментов разработчика. Вкладка React будет крайней справа.


**Внимание, чтобы это работало на CodePen нужно сделать еще несколько действий:**

1. Залогиниться или зарегестрироваться и подтвердить вашу электронную почту (требуется для защиты от спама).
2. Нажать кнопку "Fork".
3. Нажать "Change View" и выбрать "Debug mode".
4. В открывшейся новой вкладке у вас должны появиться инструменты разработчика.

## Создание игры {#completing-the-game}

Теперь у нас есть базовые элементы для создания игры крестики-нолики. Для завершения игры нам нужно чередовать размещения "X" и "O" на поле, и нужен способ определить победителя.

### Переносим состояние вверх {#lifting-state-up}

Сейчас каждый Square-компонент хранит в себе состояние игры. Для выявления победителя, мы будет держать значение всех 9 клеток в одном месте.

Возможно, вы подумали, что `Board` просто запросит у каждого `Square` его состояние. Хотя такой подход возможен в React, мы его не одобряем. Такой код становится трудным для понимания, допускающим ошибки и усложняет рефакторинг. Вместо этого, лучшим подходом будет хранить состояние игры в родительском Board-компоненте, а не в каждом отдельно Square. Board-компонент может сказать каждому Square, что нужно отобразить с помощью передачи проп, [мы так уже делали, когда передавали число в каждую клетку](#passing-data-through-props).

**Чтобы собрать данные от множества дочерних элементов, или чтобы дать возможно двум компонентам общаться, вам нужно объявить общее состояние внутри родительского компонентента. Родительский компонент может передать состояние вниз к дочерним элементам с помощью пропсов. Это поддерживает синхронизацию дочерних компонентов друг с другом и с родительским компонентом.**

Перенос состояния в родительский компонент - обычное дело, при рефакторинге React-компонентов. Давайте возпользуемся случаем и попробуем это сделать. Добавим конструктор к компоненту Board и установим начальное состояние, в виде массива из 9 элементов, заполнного null. Эти 9 элементов соответсвуют 9 квадратам:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    const status = 'Следующий игрок: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Позже, при заполнении поля, оно будет выглядеть примерно так:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Метод `renderSquare` внутри Board сейчас выглядит так:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Сначала, мы из Board  [передаем проп `value` вниз](#passing-data-through-props) для отображения номеров от 0 до 8 внутри каждого Square. В отличии от предыдущего шага, мы заменили числа знаком "X" [определенном в собственном состоянии Square](#making-an-interactive-component). Поэтому сейчас Square игнорирует проп `value` переданный в него из Board.

Мы снова воспользуемся механизмом передачи проп. Изменим Board, чтобы передавать каждому Square его текущее значение (`'X'`, `'O'` или `null`). Мы уже определили массив `squares` в конструкторе Board. Давайте изменим метод `renderSquare` чтобы читать из этого массива данные:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Теперь каждый Square получает проп `value`, которое будет `'X'`, `'O'` или `null` для пустых клеток.

Дальше нам нужно поменять то, что происходит при клике на Square. Теперь Board-компонент хранит информацию о заполненных клетках. Нам нужен способ, которым Square сможет обновлять состояние Board. Посколько состояние является приватным для компонента, где оно определено, мы не можем обновить состояние Board напрямую из Square.

Для сохранения конфеденциальности состояния Board мы пробросим из Board в Square функцию. Эта фукнция будет вызываться при клике на Square. Изменим метод `renderSquare` в Board-компоненте на:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Примечание
>
>Мы разбили возвращаемый элемент на несколько строчек для читаемости, и добавили скобки, чтобы JavaScript не вставил точку с запятой после `return` (что сломает наш код).

Теперь мы пробрасываем из Board вниз в Square два пропса: `value` и `onClick`. Проп `onClick` - это фукнция, которую Square вызывает при клике. Внесем следующие изменения в Square-компонент:

* Заменим `this.state.value` на `this.props.value` внутри метода `render`.
* Заменим `this.setState()` на `this.props.onClick()` внутри метода `render`.
* Удалим `constructor` из Square, потому что компонент больше не отвечает за хранение состояния игры.

После этих изменений Square-компонент выглядит так:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

Когда мы кликаем на Square, вызывается фукнция `onCliсk`, которая была передана из Board. Вот как это происходит:

1. Проп `onClick` на встроенном DOM-компоненте `<button>` говорит React установить обработчик события.
2. При клике по кнопке React вызове обработчик `onClick`, который определен в методе `render()` Square.
3. Этот обработчик вызовет `this.props.onClick()`. Проп `onClick`определен для Square внутри Board.
4. Т.к. Board передает в Square `onClick={() => this.handleClick(i)}`,  Square при клике вызывает `this.handleClick(i)`.
5. Мы пока не определили метод `handleClick()`, так что наш код сломается.

>Примечание
>
>Атрибут `onClick` DOM-элемента `<button>` имеет для React особое значение, потому что это встроенный компонент. Для обычных компонентов вроде Square вы можете называть пропсы как угодно. Мы можем назвать проп Square `onClick` и метод для Board `handleClick` - по-разному. Но в React есть соглашение об именах - `on[Имя события]` для пропсов, отвечающих за события, и `handle[Имя событияъ]` для методов обрабатывающих события.

Когда мы кликнем на Square мы должны получить ошибку, потому что мы еще не определили `handleClick`. Теперь добавим его в класс Board:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

После этих изменений мы снова можем кликать на клетки для их заполнения. Но теперь состояние хранится внутри Board-компонента, а не в разрозненных Square-компонентах. Когда состояние Board меняется, Square-компоненты автоматически перерендериваются. То, что теперь мы держим состояние всех клетов внутри Board-компоненте в будущем позволит определять победителя.

Поколько Square-компоненты больше не содержат состояния, они получаются все значения из Board и уведомляют его при кликах. В терминах React Square-компонент теперь является **контроллируемым**. Его полностью контролирует Board.

Обратите внимание, что внутри `handleClick` мы вызвали `.slice()` для создания копии массива `squares` вместо изменения существующего массива. В следующей части мы объясним зачем создавать копию массива `squares`.


### Почему иммутабельность так важна? {#why-immutability-is-important}

В последнем примере мы советовали использовать метод `.slice()` для создания и последующего изменения копии массива `squares`, вместо изменения существующего массива. Теперь мы обсудим иммутабельность и почему ее так важно изучить.

В целом есть два подхода для изменения данных. Первый подход - *мутировать*(изменять) данные напрямую устанавливая новые значения. Второй подход - заменять данные новой копией, которая содержит изменения.

#### Мутирующее изменениее данных {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Изменение данных без мутаций {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Здесь `player` не изменился, а в `newPlayer` находится {score: 2, name: 'Jeff'}

// Или, если вы пользуетесь синтаксисом расширения объектов, вы можете написать:
// var newPlayer = {...player, score: 2};
```

Конечный результат будет тот же, но без мутации (или без изменения базовых данных) напрямую. Ниже будут описаны преимущества от такого подхода.

#### Сложное становится простым {#complex-features-become-simple}

Иммутабельность делает реализацию сложного функционала простой. Ниже мы реализуем функционал "путешествия во времени", который позволит просматривать историю игры, и "возврат назад", который позволит переходить к прошлым ходам. Этот функционал не является чем-то особенным для игр - возможность отменять и снова примерять действия это общий функционал приложений. Изменяя прямой мутации данных позволяет сохранять предыдущеие состояния игры без изменений и обращаться к ним позже.

#### Обнаружение изменений {#detecting-changes}

Работая с мутируемыми объектами довольно сложно обнаружить изменения, потому что они изменяются напрямую. В таком случае нам требуется сравнивать объект с последней копией этого же объекта, и делать тоже самое для всего дерева объектов.

Обнаружение изменений в иммутабельных объектаъ намного проще. Если указатель на иммутабельный объект изменился (отличается от предыдущего), значит объект был изменен.

#### Determining When to Re-render in React {#determining-when-to-re-render-in-react}

The main benefit of immutability is that it helps you build _pure components_ in React. Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.

You can learn more about `shouldComponentUpdate()` and how you can build *pure components* by reading [Optimizing Performance](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

We'll now change the Square to be a **function component**.

In React, **function components** are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

Replace the Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

We have changed `this.props` to `props` both times it appears.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Note
>
>When we modified the Square to be a function component, we also changed `onClick={() => this.props.onClick()}` to a shorter `onClick={props.onClick}` (note the lack of parentheses on *both* sides). In a class, we used an arrow function to access the correct `this` value, but in a function component we don't need to worry about `this`.

### Taking Turns {#taking-turns}

We now need to fix an obvious defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. We can set this default by modifying the initial state in our Board constructor:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

With this change, "X"s and "O"s can take turns. Let's also change the "status" text in Board's `render` so that it displays which player has the next turn:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After applying these changes, you should have this Board component:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declaring a Winner {#declaring-a-winner}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. We can determine a winner by adding this helper function to the end of the file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

We will call `calculateWinner(squares)` in the Board's `render` function to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in Board's `render` function with this code:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So *you're* probably the real winner here.

## Adding Time Travel {#adding-time-travel}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {#storing-a-history-of-moves}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Now we need to decide which component should own the `history` state.

### Lifting State Up, Again {#lifting-state-up-again}

We'll want the top-level Game component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, we'll set up the initial state for the Game component within its constructor:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Next, we'll have the Board component receive `squares` and `onClick` props from the Game component. Since we now have a single click handler in Board for many Squares, we'll need to pass the location of each Square into the `onClick` handler to indicate which Square was clicked. Here are the required steps to transform the Board component:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

The Board component now looks like this:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

We'll update the Game component's `render` function to use the most recent history entry to determine and display the game's status:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Since the Game component is now rendering the game's status, we can remove the corresponding code from the Board's `render` method. After refactoring, the Board's `render` function looks like this:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Finally, we need to move the `handleClick` method from the Board component to the Game component. We also need to modify `handleClick` because the Game component's state is structured differently. Within the Game's `handleClick` method, we concatenate new history entries onto `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Note
>
>Unlike the array `push()` method you might be more familiar with, the `concat()` method doesn't mutate the original array, so we prefer it.

At this point, the Board component only needs the `renderSquare` and `render` methods. The game's state and the `handleClick` method should be in the Game component.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {#showing-the-past-moves}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

In JavaScript, arrays have a [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for mapping data to other data, for example:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
``` 

Using the `map` method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game's `render` method:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

For each move in the tic-tac-toes's game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's discuss what the above warning means.

### Picking a Key {#picking-a-key}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what we intended. Because React cannot know our intentions, we need to specify a *key* property for each list item to differentiate each list item from its siblings. One option would be to use the strings `alexa`, `ben`, `claudia`. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved. Keys tell React about the identity of each component which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it belongs in `props`, `key` cannot be referenced using `this.props.key`. React automatically uses `key` to decide which components to update. A component cannot inquire about its `key`.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.


### Implementing Time Travel {#implementing-time-travel}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game component's `render` method, we can add the key as `<li key={move}>` and React's warning about keys should disappear:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Next, we'll define the `jumpTo` method in Game to update that `stepNumber`. We also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.

The `stepNumber` state we've added reflects the move displayed to the user now. After we make a new move, we need to update `stepNumber` by adding `stepNumber: history.length` as part of the `this.setState` argument. This ensures we don't get stuck showing the same move after a new one has been made.

We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Finally, we will modify the Game component's `render` method from always rendering the last move to rendering the currently selected move according to `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Wrapping Up {#wrapping-up}

Congratulations! You've created a tic-tac-toe game that:

* Lets you play tic-tac-toe,
* Indicates when a player has won the game,
* Stores a game's history as a game progresses,
* Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
