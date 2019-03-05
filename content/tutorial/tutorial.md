---
id: tutorial
title: "Введение: знакомство с React"
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

Это введение не предполагает наличие знаний React.

## Прежде чем начать {#before-we-start-the-tutorial}

По ходу этого вводного руководства мы создадим небольшую игру. **Возможно, вы захотите пропустить его, если ранее не разрабатывали игры, но вам стоит попробовать.** Подходы, которые мы изучим в этом введении, являются базовыми при создании любого React-приложения. Их освоение даст вам глубокое понимание React.

>Совет
>
>Это введение рассчитано на людей, которые предпочитают подход **учиться на практике**. Если вам больше нравится изучать предмет от начала до конца, то начните с [пошагового руководства](/docs/hello-world.html). Введение и руководство в чём-то дополняют друг друга.

Введение разделено на несколько секций:

* [Настройка окружения](#setup-for-the-tutorial) даст вам **отправную точку** для изучения практикума.
* [Обзор](#overview) научит вас **основам** React: компоненты, пропсы и состояние.
* [Создание игры](#completing-the-game) научит вас **наиболее распространённым подходам** в React-разработке.
* [Добавив путешествие во времени](#adding-time-travel) вы получите **более глубокое понимание** особенностей и сильных сторон React.

Вам не обязательно проходить все части за раз, чтобы получить пользу от этого введения. Изучите столько, сколько можете, даже если это будет одна или две секции.

Вполне нормально копировать код по мере изучения практикума. Но мы советуем набирать его самим. Это позволит вам подключить мышечную память и улучшить понимание.

### Что мы собираемся писать? {#what-are-we-building}

В этом введении мы покажем как создать интерактивную игру крестики-нолики на React.

Результат вы можете посмотреть здесь — **[готовая игра](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Если её код вам ни о чём не говорит, или вы не знакомы с синтаксисом, не беспокойтесь. Цель этого введения — помочь вам разобраться с React и его синтаксисом.

Мы советуем вам поиграть в готовые крестики-нолики, прежде чем приниматься за практикум. Одна из особенностей, которую вы можете заметить - это нумерованный список справа от игрового поля. Этот список отображает историю всех игровых ходов, и обновляется по мере игры.

Как только вы познакомитесь с игрой - можете закрывать её. Мы начнём с самого простого шаблона. Следующим шагом мы настроим окружение, чтобы вы могли начать создание игры.


### Предварительные требования {#prerequisites}

Мы будем полагать, что вы немного знакомы с HTML и JavaScript. Однако вы сможете изучать введение, даже если вы пришли с других языков программирования. Мы также полагаем, что вы знакомы с такими понятиями программирования как функции, объекты, массивы и, в меньшей степени, классы.

Если вам нужен обзор JavaScript, мы рекомендуем прочитать [вот этот учебник](https://developer.mozilla.org/ru/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Отметим, что мы используем некоторые особенности из ES6, последней версии JavaScript, такие как [стрелочные функции](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [классы](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes), объявления [`let`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/let), и [`const`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/const). Вы можете воспользоваться [Babel REPL](babel://es5-syntax-example), чтобы узнать во что компилируется код на ES6.

## Настройка окружения {#setup-for-the-tutorial}

Есть два варианта прохождения этого практикума — вы можете писать код в браузере, либо настроить окружение для разработки на компьютере.

### Вариант 1: Пишем код в браузере {#setup-option-1-write-code-in-the-browser}

Это самый быстрый способ для старта!

Для начала откройте эту **[Заготовку](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** в новой вкладке. Вы увидите пустое поле для игры в крестики-нолики и код на React. Мы будем изменять этот код по ходу написания игры.

Можете пропустить следующую чаcть и перейти к [Обзору](#overview) React.

### Вариант 2: Локальное окружение для разработки {#setup-option-2-local-development-environment}

Это не является обязательным и не требуется этим вводным руководством!

<br>

<details>

<summary><b>Опционально: Инструкции для написания кода в вашем любимом редакторе</b></summary>

Эти настройки потребуют больше сил, но позволят продолжать работу с использованием выбранного вами редактора. Вот что нужно сделать:

1. Убедиться, что у вас установлена последняя версия [Node.js](https://nodejs.org/en/).
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

# Затем, вернёмся в папку проекта
cd ..
```

4. Создайте файл с именем `index.css` в папке `src/` и добавьте в него [вот этот CSS код](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Создайте файл с именем `index.js` в папке `src/` и добавьте в него [этот JS код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

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

Если вы застряли - обратитесь к [поддержке сообщества](/community/support.html). В частности [Чат Reactiflux](https://discord.gg/0ZcbPKXt5bZjGY5n) - это прекрасное место, где вам помогут. Если вы не дождались ответа или все ещё не решили вопрос, пожалуйста, [задайте вопрос](https://github.com/reactjs/ru.reactjs.org/issues/new) и мы вам поможем.

## Обзор {#overview}

Теперь, когда вы готовы, перейдём к рассмотрению React!

### Что такое React? {#what-is-react}

React - это декларативная, эффективная и гибкая JavaScript библиотека для создания пользовательских интерфейсов. Она позволяет вам составлять сложный UI из маленьких изолированных кусочков кода, называемых «компонентами».

React имеет несколько разных видов компонентов, но мы начнём с подклассов `React.Component`:

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

Скоро мы перейдём к этим забавным, похожим на XML, тегам. Мы используем компоненты, чтобы объяснить React, что мы хотим увидеть на экране. Когда наши данные изменятся, React эффективно обновит и повторно отрендерит наши компоненты.

Здесь, `ShoppingList` - это пример **классового компонента React**, или **тип React-компонента**. Компонент принимает параметры, которые называются пропсами (`props`, сокращение от `properties` - свойства), и возвращает из метода `render()` иерархию представлений для отображения.

Метод `render` возвращает *описание* того, что вы хотите увидеть на экране. React берет это описание и отображает результат. Точнее, `render` возвращает **React-элемент**, который является легковесным описанием того, что нужно отрендерить. Большинство React-разработчиков используют специальный синтаксис под названием «JSX» для упрощения описания структуры. Синтаксис `<div />` преобразовывается в `React.createElement('div')`. Пример выше равнозначен вот этому:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Смотрите полную версию.](babel://tutorial-expanded-version)

Если вам интересно, то `createElement()` более подробно описан в [справочнике API](/docs/react-api.html#createelement), но мы не будем им пользоваться в этом введении. Вместо этого мы продолжим пользоваться JSX.

JSX обладает всей мощью JavaScript. В JSX вы можете использовать *любые* JavaScript выражения внутри фигурных скобок. Каждый React-элемент является JavaScript объектом, который вы можете хранить в переменной или которым вы можете оперировать внутри программы.

Приведённый выше компонент `ShoppingList` только рендерит встроенные DOM-компоненты вроде `<div />` или `<li />`. Но вы также можете составлять и рендерить собственные компоненты. Например, теперь вы можете ссылаться на весь компонент со списком покупок написав `<ShoppingList />`. Каждый React-компонент инкапсулирован и может использоваться независимо, это позволяет создавать сложный UI из простых компонентов.

## Разберёмся со стартовым кодом {#inspecting-the-starter-code}

Если вы собираетесь работать над практикумом **в вашем браузере**, откройте этот код в новой вкладке **[начальный код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Если вы собираетесь работать над практикумом **локально**, откройте `src/index.js` в папке вашего проекта (вы уже имели дело с этим файлом в секции [первоначальной настройки](#setup-option-2-local-development-environment)).

Этот стартовый код - база, с которой мы начнём разработку. Мы предоставили CSS-стили, так что вам нужно сосредоточиться только на изучении React и программировании игры крестики-нолики.

Исследуя этот код, вы обнаружите, что у нас есть три React-компонента:

* Square (Клетка)
* Board (Поле)
* Game (Игра)

Компонент `Square` отрисовывает просто `<button>`, а `Board` отрисовывает 9 таких элементов. Компонент `Game` рендерит поле c заглушками, которые мы изменим позже. Сейчас у нас нет ни одного интерактивного компонента.

### Передача данных через пропсы {#passing-data-through-props}

Для начала, давайте попробуем передать некоторые данные из нашего `Board`-компонента в компонент `Square`.

Настоятельно рекомендуем по мере работы над введением набирать код самостоятельно, а не пользоваться копированием/вставкой. Это поможет лучшему пониманию и развитию мышечной памяти.

Изменим метод `renderSquare` внутри `Board`, чтобы он передавал в `Square` проп с названием `value`:


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

После: Вы должны увидеть число, внутри каждой отрисованной ячейки.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Поздравляем! Вы только что «пробросили проп» из родительского Board-компонта в дочерний Square-компонент.
Передача пропсов это то, как передаются даннные в React-приложениях - от родительских к дочерним компонентам.

### Делаем компонент интерактивным {#making-an-interactive-component}

Давайте при клике на Square-компонент будем заполнять его «X».
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

Теперь, если вы кликнете по `Square`, то увидите в браузере сообщение.

>Примечание
>
>Чтобы меньше печатать и избегать [странного поведения `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), мы будем использовать [синтаксис стрелочных функций](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions) для обработчиков событий (здесь и ниже):
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
>Обратите внимание что в `onClick={() => alert('click')}`, мы передаём *функцию* в качестве значения проп `onClick`. React вызовет эту функцию при клике. Опускать `() =>` и писать сразу `onClick={alert('click')}` - это распространённая ошибка. Такой код будет выдавать сообщение каждый раз, когда компонент перерендеривается.

Дальше мы хотим, чтобы Square-компонент «запоминал», что по ниму кликнули и отрисовывал «X».
Для «запоминания» компоненты используют **состояние**.

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

Теперь изменим метод `render` Square-компонента для отображения текущего значения из состояния при клике:

* Заменим `this.props.value` на `this.state.value` внутри тега `<button>`.
* Заменим обработчик `onClick={...}` на `onClick={() => this.setState({value: 'X'})}`.
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

Когда вы вызываете `setState` внутри компонента, React так же автоматически обновляет дочерние компоненты.


**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Инструменты разработчика {#developer-tools}

Расширения React Devtools для браузеров [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) и [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) позволяют вам изучать дерево React-компонентов внутри панели инструментов разработчика вашего браузера.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">


React DevTools позволяют просматривать пропсы и состояние ваших React-компонентов.

После установки React DevTools, вы можете кликнуть правой кнопкой мыши на любой элемент страницы и нажать `Inspect` (`Просмотреть код`) для открытия инструментов разработчика. Вкладка React будет крайней справа.


**Внимание, чтобы это работало на CodePen нужно сделать ещё несколько действий:**

1. Залогиниться или зарегестрироваться и подтвердить вашу электронную почту (требуется для защиты от спама).
2. Нажать кнопку «Fork».
3. Нажать «Change View» и выбрать «Debug mode».
4. В открывшейся новой вкладке у вас должны появиться инструменты разработчика.

## Создание игры {#completing-the-game}

Теперь у нас есть базовые элементы для создания игры крестики-нолики. Для завершения игры нам нужно чередовать размещения «X» и «O» на поле, и нужен способ определить победителя.

### Переносим состояние вверх {#lifting-state-up}

Сейчас каждый Square-компонент хранит в себе состояние игры. Для выявления победителя, мы будем держать значение всех 9 клеток в одном месте.

Возможно, вы подумали, что `Board` просто запросит у каждого `Square` его состояние. Хотя такой подход возможен в React, мы его не одобряем. Такой код становится трудным для понимания, допускающим ошибки и усложняет рефакторинг. Вместо этого, лучшим подходом будет хранить состояние игры в родительском Board-компоненте, а не в каждом отдельно Square. Board-компонент может сказать каждому Square, что нужно отобразить с помощью передачи проп, [мы так уже делали, когда передавали число в каждую клетку](#passing-data-through-props).

**Чтобы собрать данные от множества дочерних элементов, или чтобы дать возможно двум компонентам общаться, вам нужно объявить общее состояние внутри родительского компонентента. Родительский компонент может передать состояние вниз к дочерним элементам с помощью пропсов. Это поддерживает синхронизацию дочерних компонентов друг с другом и с родительским компонентом.**

Перенос состояния в родительский компонент - обычное дело, при рефакторинге React-компонентов. Давайте возпользуемся случаем и попробуем это сделать. 

Добавим конструктор к Board-компоненту и установим начальное состояние в виде массива из 9 элементов, заполненного null. Эти 9 элементов соответствую 9 квадратам:

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
```

Позже, при заполнении поля, массив `this.state.squares` будет выглядеть примерно так:

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

Сначала, мы из Board  [передаём проп `value` вниз](#passing-data-through-props) для отображения номеров от 0 до 8 внутри каждого Square. В отличии от предыдущего шага, мы заменили числа знаком «X» [определённом в собственном состоянии Square](#making-an-interactive-component). Поэтому сейчас Square игнорирует проп `value` переданный в него из Board.

Мы снова воспользуемся механизмом передачи проп. Изменим Board, чтобы передавать каждому Square его текущее значение (`'X'`, `'O'` или `null`). Мы уже определили массив `squares` в конструкторе Board. Давайте изменим метод `renderSquare` чтобы читать из этого массива данные:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Теперь каждый Square получает проп `value`, которое будет `'X'`, `'O'` или `null` для пустых клеток.

Дальше нам нужно поменять то, что происходит при клике на Square. Теперь Board-компонент хранит информацию о заполненных клетках. Нам нужен способ, которым Square сможет обновлять состояние Board. Поскольку состояние является приватным для компонента, где оно определено, мы не можем обновить состояние Board напрямую из Square.

Вместо этого, давайте передадим из Board в Square функцию, и будем её вызывать из Square, когда по тому кликнули. Изменим метод `renderSquare` в Board-компоненте на:

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

Теперь мы пробрасываем из Board вниз в Square два пропса: `value` и `onClick`. Проп `onClick` - это фукнция, которую Square вызывает при клике. Внесём следующие изменения в Square-компонент:

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
2. При клике по кнопке React вызове обработчик `onClick`, который определён в методе `render()` Square.
3. Этот обработчик вызовет `this.props.onClick()`. Проп `onClick`определён для Square внутри Board.
4. Т.к. Board передаёт в Square `onClick={() => this.handleClick(i)}`, Square при клике вызывает `this.handleClick(i)`.
5. Мы пока не определили метод `handleClick()`, так что наш код сломается. Если вы сейчас кликните на клетку, вы увидите красный экран, говорящий что-то вроде `this.handleClick is not a function`.

>Примечание
>
>Атрибут `onClick` DOM-элемента `<button>` имеет для React особое значение, потому что это встроенный компонент. Для обычных компонентов вроде Square вы можете называть пропсы как угодно. Мы можем назвать проп Square `onClick` и метод для Board `handleClick` любым именем, и они будут работать так же. Но в React есть соглашение об именах - `on[Имя события]` для пропсов, отвечающих за события, и `handle[Имя события]` для методов обрабатывающих события.

Когда мы кликнем на Square мы должны получить ошибку, потому что мы ещё не определили `handleClick`. Теперь добавим его в класс Board:

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

После этих изменений мы снова можем кликать на клетки для их заполнения, и все работает как раньше. Но теперь состояние хранится внутри Board-компонента, а не в разрозненных Square-компонентах. Когда состояние Board меняется, Square-компоненты автоматически перерендериваются. То, что теперь мы держим состояние всех клетов внутри Board-компоненте в будущем позволит определять победителя.

Поскольку Square-компоненты больше не содержат состояния, они получаются все значения из Board и уведомляют его при кликах. В терминах React Square-компонент теперь является **управляемым**. Им полностью управляет Board.

Обратите внимание, что внутри `handleClick` мы вызвали `.slice()` для создания копии массива `squares` вместо изменения существующего массива. В следующей части мы объясним зачем создавать копию массива `squares`.


### Почему иммутабельность так важна? {#why-immutability-is-important}

В последнем примере мы советовали использовать метод `.slice()` для создания и последующего изменения копии массива `squares`, вместо изменения существующего массива. Теперь мы обсудим иммутабельность и почему её так важно изучить.

В целом есть два подхода для изменения данных. Первый подход - *мутировать*(изменять) данные напрямую устанавливая новые значения. Второй подход - заменять данные новой копией, которая содержит изменения.

#### Мутирующее изменение данных {#data-change-with-mutation}
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

Иммутабельность делает реализацию сложного функционала простой. Ниже мы реализуем функционал «путешествия во времени», который позволит просматривать историю игры, и «возврат назад», который позволит переходить к прошлым ходам. Этот функционал не является чем-то особенным для игр – возможность отменять и снова примерять действия это общий функционал приложений. Избегание прямой мутации данных позволяет сохранять предыдущее состояния игры без изменений и обращаться к ним позже.

#### Обнаружение изменений {#detecting-changes}

Работая с мутируемыми объектами довольно сложно обнаружить изменения, потому что они изменяются напрямую. В таком случае нам требуется сравнивать объект с последней копией этого же объекта, и делать то же самое для всего дерева объектов.

Обнаружение изменений в иммутабельных объектаъ намного проще. Если указатель на иммутабельный объект изменился (отличается от предыдущего), значит объект был изменён.

#### Как React понимает, когда нужно перерендерить {#determining-when-to-re-render-in-react}

Основным преимуществом иммутабельности является то, что он помогает создавать на React _чистые компоненты_. Неизменяемые данные позволяют легко определить наличие изменений и момент, когда компонент нужно перерендерить.

Вы можете узнать больше о `shouldComponentUpdate()` и как создавать *чистые компоненты* в статье про [Оптимизацию Производительности](/docs/optimizing-performance.html#examples).

### Функциональные компоненты {#function-components}

Давайте изменим Square и сделаем его **функциональным компонентом**.

В React **функциональные компоненты** -- возможность проще описывать компоненты, которые содержат только метод `render` и не имеют собственного состояния. Вместо определения класса, который наследуется от `React.Component`, мы можем написать функцию, которая принимает `props` как параметр и возвращает то, что должно быть отрендерено. Функциональные компоненты проще писать, чем классы, и многие компоненты могут быть оформлены таким образом.

Заменим класс Square следующей фукнцией:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Мы заменили `this.props` на `props` оба раза, когда обращись к ним.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Примечание
>
>Когда мы заменили Square на фукнциональный компонент, мы так же изменили `onClick={() => this.props.onClick()}` на более короткое `onClick={props.onClick}` (обратите внимание на отсутствие фигурных скобок с обеих сторон). В классе мы использовали стрелочную фукнцию для получения правильного значения `this`, но в функциональных компонентах нам не нужно беспокоиться о `this`.

### Очерёдность {#taking-turns}

Нам нужно исправить один очевидный момент в нашей игре крестики-нолики - «O» не может быть отмечен на поле.

Закрепим первый ход по-умолчанию за «X». Мы можем сделать это изменяя начальное состояние внутри конструктора Board:


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

Каждый раз, когда игрок делает ход, `xIsNext` (булево значение) будет инвертироваться, чтобы обозначить какой игрок ходит следующим, а состояние игры будет сохраняться. Мы обновим метод `handleClick` класса Board, для инверсии значения `xIsNext`:

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

После этих изменений «X» и «O» будут чередоваться. Проверьте.

Давайте заодно изменим текст «status» в методе `render` класса Board, чтобы он отображал чья очередь ходить:

```javascript{2}
  render() {
    const status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

После этих измнений у наш Board-компонент должен выглядеть так:

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
    const status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');

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

### Определение победителя {#declaring-a-winner}

Теперь, когда мы показываем какой игрок ходит следующим, нам так же нужно определять когда игра закончена, и больше нет ходов. Скопируйте вспомогательную фукнцию в конец файла:

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

Функция получает массив из 9 клеток, проверяет победителя и возвращает соответственно `'X'`, `'O'` или `null`. 

Будем вызывать `calculateWinner(squares)` внутри метода `render` класса Board, чтобвы проверять - выиграл ли игрок. Если у нас есть победитель, мы покажем сообщение «Выиграл X» или «Выиграл O». Заменим объявление `status` в `render` следующим кодом:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Выиграл ' + winner;
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

Теперь мы можем изменить метод `handleClick` класса Board для выхода из функции и игнорировании клика, если кто-то уже победил или если поле заполнено:

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

Поздравляем! Теперь у вас работающая игра в крестики-нолики. И заодно вы только что освоили основы React. Так что, похоже, здесь победитель *вы*.

## Путешествие во времени {#adding-time-travel}

Под конец, давайте добавим возможность «вернуться в прошлое» - к прошлым ходам игры."

### Сохраняем историю ходов {#storing-a-history-of-moves}

Если бы мы изменяли массив `squares`, реализация такой задачи была бы очень трудной.

Но мы использовали `slice()` для создания новой копии массива `squares` после каждого хода и работали с ним [не изменяя](#why-immutability-is-important). Это позволит нам хранить каждую версию массива `squares` и перемещаться по ходам, которые уже были сделаны.

Сохраним массивы `squares` в другом массиве, назовём его `history`. Этот массив `history` будет хранить все состояния поля. С первого до последнего хода. У него будет вот такая структура:

```javascript
history = [
  // Перед перым ходом
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // После первого хода
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // После второго хода
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

Осталось решить, какой компонент будет отвечать за состояние `history`.

### Поднимаем состояние вверх. Снова {#lifting-state-up-again}

Мы хотим, чтобы выше-лежащий компонент Game отображал список последних ходов. Для этого ему нужен доступ к `history`, так что мы поместим `history` в состояние родительского компонента Game.

Размещение `history` в состоянии компонента Game позволит нам удалить `squares` из состояния его дочернего Board-компонента. Так же как мы уже [«поднимали состояние выше»](#lifting-state-up) из Square-компонента в Board, мы теперь поднимем его из Board в компонент-родитель Game. Это даст компоненту Game полный контроль над данными Board и позволит отдавать команду для Board на рендеринг прошлых ходов из `history`: 

Для начала зададим начальное состояние компонента Game внутри конструктора:

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

Дальше нужно, чтобы Board получил `squares` и `onClick` пропсы из компонента Game. Поскольку внутри Board у нас одни обработчик кликов для всех Squares, нам просто нужно передать ползицию для каждого Square внутрь обработчика `onClick`, чтобы показать по какой клетке мы кликнули. Для изменения Board-кoмпонента нам нужно выполнить следующие шаги:

* Удалить `constructor` в Board.
* Заменить `this.state.squares[i]` на `this.props.squares[i]` в методе `renderSquare` Board.
* Заменить `this.handleClick(i)` на `this.props.onClick(i)` в методе `renderSquare` Board.

Теперь Board-компонент должен выглядеть вот так:

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
      status = 'Выиграл ' + winner;
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
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

Давайте обновим метод `render` Game-компонента, чтобы использовать последнюю запись из истории для определения и отображения статуса игры:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Выиграл ' + winner;
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
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

Поскольку компонент Game теперь ренедерит статус игры, мы может убрать соответствующий код из метода `render` внутри Board. После измнений метод `render` Board-компонента выглядит так:

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

Ну и наконец, нужно перенести метод `handleClick` из Board-компонента в Game-компонент. Мы также должны изменить `handleClick`, потому что состояние компонента Game имеет другую структуру. Внутри `handleClick` у Game-компонента, там нужно добавлять запись в массив `history`.

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

>Примечание
>
>В отличии от метода массива `push()`, с которым вы должно быть знакомы, метод `concat()` не изменяет оригинальный массив, поэтому мы используем его.

Теперь Board-компоненту нужно только два метода - `rendeSquare` и `render`. Состоние игры и `handleClick` должны находиться внутри компонента Game.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Показываем прошлые ходы {#showing-the-past-moves}

Поскольку мы записываем ход игры, мы теперь можем показывать игроку список предыдущих ходов.

Раньше мы разобрали, что React-элементы -- это объекты первого класса из JavaScript, т.е. мы можем передавать их внутри нашего приложения как переменные. Для рендеринга нескольких записей в React мы может использовать массив React-элементов.

В JavaScript у массивов есть [`метод map()`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/map), который широко используется для приобразования данных. Например:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Используя метод `map` мы можем отобразить историю наших ходов в React-элементы, представленные кнопками на экране, и отрисовать список кнопок для «перехода» к прошлым ходам.

Давайте применим `map` к `history` внутри метода `render` Game-компонента:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Перейти к ходу #' + move :
        'К началу игры';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Выиграл ' + winner;
    } else {
      status = 'Следущий ход: ' + (this.state.xIsNext ? 'X' : 'O');
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

Для каждого хода в истории игры мы создаём элемент списка `<li>`, который содержит кнопку `<button>`. У кнопки есть обработчик `onClick`, который вызывает метод `this.jumpTo()`. Мы ещё не реализовали этот `jumpTo()` метод. Но сейчас мы должны видеть список ходов, которые были сделаны в игре и вот такое предупреждение в инструментах разработчика:

>  Warning:
>  Each child in an array or iterator should have a unique «key» prop. Check the render method of «Game».

Что переводится как:

>  Предупреждение:
>  Каждый элемент в массиве или итераторе должен иметь уникальный проп «key». Проверьте метод render в Game

Давайте обсудим, что это предупреждение значит.

### Выбор ключа {#picking-a-key}

Когда мы рендерим список, React хранит информацию о каждом отрендереном элементе списка. Если мы обновляем список, React должнет понять, что изменилось. Мы могли добавить, удалить, поменять порядок или обновить элементы списка.

Представим изменения от

```html
<li>Алекс: 7 задач осталось</li>
<li>Бен: 5 задач осталось</li>
```

к

```html
<li>Бен: 9 задач осталось</li>
<li>Клава: 8 задач осталось</li>
<li>Алекс: 5 задач осталось</li>
```

В добавок к изменённым цифрам, человек читающий это, вероятно сказал бы что Алекс и Бен поменялись местами, а между ними вставили Клаву. Но React -- это компьютерная программа, и не знает чего мы хотим. Поскольку React не знает наших намерений, нам нужно указать свойство *key* для каждого элемента списка, чтобы отличать каждый элемент от остальных. Один из вариантов - использовать строки `Алекс`, `Бен`, `Клава`. Если мы показываем информацию из базы данных то в качестве ключей мы могли бы использовать идентефикаторы из базы.

```html
<li key={user.id}>{user.name}: {user.taskCount} задач осталось</li>
```

При повторном рендеринге списка, React берет у каждого элемента списка ключ и ищет его в элементах прошлого списка. Если в новом списке есть ключ, которого раньше не было, React создаёт новый компонент. Если в текущем списке отстутсвует ключ, который был в прошлом списке, React уничтожет предыдущий компонент. Если два ключа совпадают, соответствующий компонент перемещается. Ключи говорит React об уникальности каждого компонента, что помогает React поддерживать состояние между повторным ренедерингом. Если у компонента меняется ключ, компонент будет уничтожет и создан занового в новом состоянии.

`key` - это специальное зарезервированное свойство(проп) в React (наряду с `ref`, более продвинутым функционалом). Когда элемент создан, React извлекает свойство `key` и сохранят этот ключ непосредственно в возвращаемом элементе. Хотя `key` выглядит, как относящийся к пропсам, к нему нельзя обращаться через `this.props.key`. React автоматически использует `key` для определения того, какой компонент должен обновиться. Компонент не может узнать о своём ключе.

**Настоятельно рекомендуется использовать правильные ключи каждый раз, когда вы стоите динамические списки**. Если у вас нет подходящего ключа, можно подумать о реструктуризации ваших данных, чтобы он у вас появился.

Если ключ не был определен, React покажет предупреждение и использует индекс из списка как ключ по умолчанию. Использование индексов массива может вызвать проблемы при попытке пересортировать элементы списка или при вставке/удалении элементов. Явная передача `key={i}` отключает предупреждение, но вызывает те же проблемы, связанные с индексами массивов, так что в большинстве случаев лучше так не делать.

Ключи не обязательно должны быть уникальными глобально. Они всего лишь должны быть уникальными в пределах списка (для выделения компонента среди соседних компонентов).


### Реализация путешествия во времени {#implementing-time-travel}

В истории игры крестики-нолики каждый прошлый ход имеет уникальный идентефикатор: это номер хода в последовательности. Ходы никогда не меняют свой порядок, не удаляются и не добавляются в середину последовательности, так что вполне безопасно пользоваться индексом в качестве ключа.

В методе `render` компонента Game мы можем добавить ключ следующим образом `<li key={move}>` и предупреждения от React об отсутствующих ключах должно пропасть:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Перейти к ходу #' + move :
        'К началу игры';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Клик на любой кнопке из списка выбросит ошибку, потому что метод `jumpTo` не определён. Прежде чем реализовывать `jumpTo` мы добавим `stepNumber` в состояние компонента Game, для отображения номера хода, который сейчас показан.

Сначала добавим `stepNumber: 0` в начальное состояние Game внутри `contructor`:

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

Далее, мы определим метод `jumpTo` в компоненте Game для обновления `stepNumber`. Мы также установим `xIsNext` в `true` если номер хода, на который мы меняем `stepNumber`, чётный:

```javascript{5-10}
  handleClick(i) {
    // Этот метод не изменялся
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // Этот метод не изменялся
  }
```

Мы сделаем ещё несколько изменений в методе Game `handleClick`, который выполняется когда вы кликаете на клетки.

Добавленный нами `stepNumber` отражает номер хода, показываемый пользователю. Когда мы делаем новый шаг, нам нужно обновить `stepNumber` используя `stepNumber: history.length` как чать аргумента для `this.setState`. Это гарантирует, что мы не застрянем, показывая одно и то же после того, как был сделан новый ход.

Мы также заменим чтение `this.state.history` на `this.state.history.slice(0, this.state.stepNumber + 1)`. Это гарантирует, что если мы «вернёмся назад», а затем сделаем новый шаг из этой точки, мы удалим всю «будущую» историю, которая стала неверной.

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

Ну и наконец, мы изменим метод `render` для Game, чтобы вместо рендера последнего хода он отрисовывал ход, соответствующий `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Остальной код не менялся
```

Если мы кликнем на любой шаг в игровой истории, поле должно немедленно обновиться показывая как оно выглядело после этого шага.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Подводя итоги {#wrapping-up}

Поздравляем! Вы только что создали игру в крестики-нолики, которая:

* Позволяет вам играть в крестики нолики,
* Показывает, когда один из игроков выиграл
* Хранит историю игры
* Позволяет игрокам просматривать историю игры и видеть прошлые состояния игрового поля.

Хорошая работа! Мы надеемся вы чувствуете, что хорошо поняли как работает React.

Посмотреть готовую игру вы можете здесь: **[Готовый результат](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Если у вас есть дополнительное время или вы хотите попрактиковать свои новые навыки в React, вот пара идей для улучшений, которые вы можете внедрить в крестики-нолики. Перечисленны в порядке увеличения сложности:

1. Отобразите позицию для каждого хода в формате (колонка, строка) в списке истории ходов.
2. Выделите выбранный элемент в списке ходов.
3. Перепишите Board, для использования вложенных циклов для создания клеток, вместо жёсткого их кодирования.
4. Добавьте переключатель, который позволит вам сортировать ходы по возрастанию или по убыванию.
5. Когда кто-то выигрывает, подсветите три клетки, которые привели к победе.
6. Когда нет победителя, покажите сообщение о том, что ничья.

В этом вводном руководстве мы затронули концепции React, включая элементы, компоненты, пропсы и состояние. Для более детального объяснения каждой из этих тем ознакомьтесь с [остальной документацией](/docs/hello-world.html). Чтобы узнать больше про объявление компонентов изучите [Документацию по API `React.Component`](/docs/react-component.html).
