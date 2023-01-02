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

Вам не обязательно знать React, чтобы проходить это введение.

## Прежде чем начать {#before-we-start-the-tutorial}

В этом введении мы будем постепенно создавать небольшую игру. **Возможно, вы захотите пропустить его, потому что не разрабатываете игры, но вам стоит попробовать.** Подходы, которые вы изучите в этом введении, являются основополагающими для создания любого React-приложения. Их освоение даст вам глубокое понимание React.

>Совет
>
>Это введение рассчитано на людей, которые предпочитают **учиться на практике**. Если вам больше нравится изучать предмет от начала до конца, то начните с [пошагового руководства](/docs/hello-world.html). Введение и руководство в чём-то дополняют друг друга.

Введение состоит из нескольких разделов:

* [Настройка окружения](#setup-for-the-tutorial) поможет подготовиться к практической части.
* [Обзор](#overview) научит вас **основам** React: компонентам, пропсам и состоянию.
* [Создание игры](#completing-the-game) научит вас **наиболее распространённым подходам** в React-разработке.
* [Добавление путешествия во времени](#adding-time-travel) даст вам **более глубокое понимание** особенностей и сильных сторон React.

Вам не обязательно проходить все части сразу, чтобы получить пользу от этого введения. Изучите столько, сколько можете, даже если это будет один или два раздела.


### Что мы собираемся писать? {#what-are-we-building}

В этом введении мы покажем как создать интерактивную игру крестики-нолики на React.

Результат вы можете посмотреть здесь — **[готовая игра](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Если вы не очень хорошо понимаете код, или вы не знакомы с синтаксисом, не беспокойтесь. Цель этого введения — помочь разобраться с React и его синтаксисом.

Мы советуем вам поиграть в крестики-нолики, прежде чем продолжите чтение. Одна из особенностей, которую вы можете заметить – это нумерованный список справа от игрового поля. Этот список отображает историю всех игровых ходов и обновляется по мере игры.

Вы можете закрыть игру в крестики-нолики, как только познакомитесь с ней. Мы начнём с простой заготовки. Следующим шагом мы настроим окружение, чтобы вы могли начать создание игры.


### Предварительные требования {#prerequisites}

Мы предполагаем, что вы немного знакомы с HTML и JavaScript. Однако, вы сможете изучать введение, даже если знакомы только с другими языками программирования. Мы также полагаем, что вы знакомы с такими понятиями программирования как функции, объекты, массивы и, в меньшей степени, классы.

Если вам нужно повторить основы JavaScript, мы рекомендуем прочитать [вот этот учебник](https://developer.mozilla.org/ru/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Обратите внимание, что мы используем некоторые особенности из ES6 (последней версии JavaScript), такие как [стрелочные функции](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [классы](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes), операторы [`let`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/let) и [`const`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/const). Вы можете воспользоваться [Babel REPL](babel://es5-syntax-example), чтобы узнать во что компилируется ES6-код.

## Настройка окружения {#setup-for-the-tutorial}

Есть два варианта прохождения практической части — вы можете писать код в браузере, либо настроить окружение для разработки на компьютере.

### Вариант 1: Пишем код в браузере {#setup-option-1-write-code-in-the-browser}

Это самый быстрый способ для старта.

Для начала откройте эту **[Заготовку](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** в новой вкладке. Вы увидите пустое поле для игры в крестики-нолики и код на React, который мы будем постепенно изменять.

Можете пропустить следующую часть и перейти к [Обзору](#overview) React.

### Вариант 2: Локальное окружение для разработки {#setup-option-2-local-development-environment}

Это не является обязательным и не требуется этим вводным руководством!

<br>

<details>

<summary><b>Опционально: Инструкции для написания кода в вашем любимом редакторе</b></summary>

Эти настройки потребуют больше работы, но позволят продолжить разработку с использованием вашего любимого редактора. Вот что нужно сделать:

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

# Для пользователей Windows
del *

# Затем вернёмся в папку проекта
cd ..
```

4. Создайте файл с именем `index.css` в папке `src/` и добавьте в него [вот этот CSS код](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Создайте файл с именем `index.js` в папке `src/` и добавьте в него [этот JS код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. В начало файла `index.js` в папке`src/` добавьте следующие три строчки:

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
```

Теперь, когда вы запустите `npm start` в папке проекта и откроете `http://localhost:3000` в браузере, вы должны увидеть пустое поле для крестиков-ноликов.

Мы рекомендуем выполнить [эти инструкции](https://babeljs.io/docs/editors/) для настройки подсветки синтаксиса в вашем редакторе.
</details>

### Помогите, я застрял! {#help-im-stuck}

Если вы застряли – обратитесь к [сообществу](/community/support.html). В частности [Чат Reactiflux](https://discord.gg/reactiflux) – это прекрасное место, где вам помогут. Если вы не дождались ответа или всё ещё не решили своей проблемы, пожалуйста, [задайте вопрос](https://github.com/reactjs/ru.reactjs.org/issues/new), и мы вам поможем.

## Обзор {#overview}

Теперь, когда вы готовы, перейдём к рассмотрению React!

### Что такое React? {#what-is-react}

React – это декларативная, эффективная и гибкая JavaScript-библиотека для создания пользовательских интерфейсов. Она позволяет вам собирать сложный UI из маленьких изолированных кусочков кода, называемых «компонентами».

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

Скоро мы перейдём к этим забавным, похожим на XML, тегам. Мы используем компоненты, чтобы сообщить React, что мы хотим увидеть на экране. Каждый раз, когда наши данные меняются, React эффективно обновляет и повторно рендерит наши компоненты.

`ShoppingList` является примером **классового компонента React**. Компонент принимает параметры, которые называются пропсами (`props`, сокращение от `properties` – свойства), и возвращает из метода `render()` иерархию представлений для отображения.

Метод `render` возвращает *описание* того, что вы хотите увидеть на экране. React берёт это описание и отображает результат. Если точнее, `render` возвращает **React-элемент**, который является легковесным описанием того, что нужно отрендерить. Большинство React-разработчиков используют специальный синтаксис под названием «JSX» для упрощения описания структуры. Во время компиляции синтаксис `<div />` преобразовывается в `React.createElement('div')`. Пример выше равнозначен вот этому:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Смотрите полную версию.](babel://tutorial-expanded-version)

Если вам интересно, то `createElement()` более подробно описан в [справочнике API](/docs/react-api.html#createelement), однако, мы не будем им пользоваться в этом введении. Вместо этого мы продолжим использовать JSX.

JSX обладает всей мощью JavaScript. В JSX вы можете использовать *любые* JavaScript-выражения внутри фигурных скобок. Каждый React-элемент является JavaScript-объектом, который можно сохранить в переменную или использовать внутри программы.

Приведённый выше компонент `ShoppingList` рендерит только встроенные DOM-компоненты вроде `<div />` или `<li />`. Но вы также можете создавать и рендерить собственные компоненты. Например, теперь вы можете ссылаться на весь компонент со списком покупок, написав `<ShoppingList />`. Каждый React-компонент инкапсулирован и может использоваться независимо. Это позволяет создавать сложный UI из простых компонентов.

### Разберёмся со стартовым кодом {#inspecting-the-starter-code}

Если вы собираетесь работать над практической частью **в вашем браузере**, откройте этот код в новой вкладке **[начальный код](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Если вы собираетесь работать над практикумом **локально**, откройте `src/index.js` в папке вашего проекта (вы уже использовали этот файл в разделе [настройки](#setup-option-2-local-development-environment)).

Этот стартовый код – база, с которой мы начнём разработку. Мы будем использовать готовые CSS-стили, чтобы сосредоточиться на изучении React и написании игры крестики-нолики.

Изучив код, вы обнаружите три React-компонента:

* Square (Клетка)
* Board (Поле)
* Game (Игра)

Компонент `Board` рендерит 9 компонентов `Square`, каждый из которых рендерит по одному элементу `<button>`. Компонент `Game` рендерит поле c заглушками, которые мы изменим позже. Пока у нас нет ни одного интерактивного компонента.

### Передача данных через пропсы {#passing-data-through-props}

Для начала давайте попробуем передать некоторые данные из нашего компонента `Board` в компонент `Square`.

Настоятельно рекомендуем набирать код самостоятельно, а не копировать его и вставлять. Это упрощает понимание и развивает мышечную память.

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
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

После: Вы должны увидеть число внутри каждого отрендеренного квадрата.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Поздравляем! Вы только что «передали проп» из родительского компонента Board в дочерний компонент Square.
Передача пропсов это то, как данные в React-приложениях "перетекают" от родительских компонентов к дочерним.

### Добавим взаимодействие с компонентом {#making-an-interactive-component}

Попробуем при клике на компонент Square ставить «X».
Вначале изменим тег кнопки, который возвращается из метода `render()` компонента Square:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { console.log('клик'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Теперь, если вы кликнете по `Square`, то увидите "клик" в консоли инструментах разработки браузера.

>Примечание
>
>Чтобы избежать [странного поведения `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), мы будем использовать [синтаксис стрелочных функций](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions) для обработчиков событий (здесь и ниже):
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => console.log('клик')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>

>Обратите внимание что в `onClick={() => console.log('клик')}`, мы передаём *функцию* в качестве значения пропа `onClick`. React вызовет эту функцию при клике. Пропуск `() =>` и запись `onClick={console.log('клик')}`довольно распространённая ошибка. Такой код будет выдавать сообщение при каждом перерендере.

Следующим шагом мы хотим, чтобы компонент Square «запоминал», что по нему кликнули и поставили «X».
Для «запоминания» компоненты используют **состояние**.

Компоненты React могут получить состояние, устанавливая `this.state` в конструкторе. `this.state` должно рассматриваться как приватное свойство React-компонента, определяемое им самим. Давайте сохраним текущее значение Square в `this.state` и изменим его при клике.

Сперва добавим конструктор к классу, чтобы инициализировать состояние:

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
      <button className="square" onClick={() => console.log('клик')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Примечание
>
>В [JavaScript-классах](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes) вам всегда нужно вызывать `super` при объявлении конструктора подкласса. Все классовые React-компоненты, у которых есть `constructor`, должны начинаться с вызова `super(props)`.

Теперь изменим метод `render` компонента Square для отображения текущего значения из состояния при клике:

* Заменим `this.props.value` на `this.state.value` внутри тега `<button>`.
* Заменим обработчик `onClick={...}` на `onClick={() => this.setState({value: 'X'})}`.
* Поместим свойства `className` и `onClick` на разных строчках для лучшей читабельности.

После этих изменений тег `<button>`, возвращаемый из метода `render` компонента Square, будет выглядеть так:

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

Вызывая `this.setState` из обработчика `onClick` (как это описано в методе `render`), мы говорим React, что нужно перерендерить Square при каждом клике по `<button>`. После обновления, `this.state.value` внутри Square станет `X`, поэтому на игровом поле мы увидим `X`. Если вы кликнете по любому Square, должен появиться `X`.

Когда вы вызываете `setState` внутри компонента, React так же автоматически обновляет дочерние компоненты.


**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Инструменты разработки {#developer-tools}

Расширение React Devtools для [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) и [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) позволяет вам изучать дерево React-компонентов внутри панели инструментов разработчика вашего браузера.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">


Расширение React DevTools позволяет просматривать пропсы и состояние ваших React-компонентов.

После установки React DevTools, вы можете кликнуть правой кнопкой мыши на любой элемент страницы и нажать `Inspect` (`Просмотреть код`), чтобы открыть инструменты разработчика. Вкладки React («⚛️ Components» и «⚛️ Profiler») появятся справа. Используйте вкладку «⚛️️ Components» для просмотра дерева компонентов.


**Внимание, чтобы это работало на CodePen нужно сделать ещё несколько действий:**

1. Войти или зарегистрироваться и подтвердить вашу электронную почту (требуется для защиты от спама).
2. Нажать кнопку «Fork».
3. Нажать «Change View» и выбрать «Debug mode».
4. В открывшейся новой вкладке у вас должны появиться инструменты разработчика.

## Создание игры {#completing-the-game}

Теперь у нас есть базовые элементы для создания игры крестики-нолики. Для полноценной игры нам необходимо реализовать поочерёдное размещение «X» и «O», а также способ определения победителя.

### Подъём состояния {#lifting-state-up}

Сейчас каждый компонент Square хранит в себе состояние игры. Для выявления победителя мы будем хранить значение всех 9 клеток в одном месте.

Возможно, вы предполагали, что `Board` просто запросит у каждого `Square` его состояние. Хотя такой подход в React возможен, мы его не одобряем. Из-за этого код становится трудным, провоцирует ошибки и усложняет рефакторинг. Вместо этого, лучшим решением будет хранение состояния игры в родительском компоненте Board, а не в каждом отдельном Square. Компонент Board может указывать каждому Square, что именно нужно отобразить, передавая проп. [Мы так уже делали, когда передавали число в каждую клетку](#passing-data-through-props).

**Чтобы собрать данные из нескольких дочерних элементов, или чтобы дать возможность двум компонентам общаться, вам нужно объявить общее состояние внутри родительского компонента. Родительский компонент может передать состояние обратно дочерним элементам с помощью пропсов. Это поддерживает синхронизацию дочерних компонентов друг с другом и с родительским компонентом.**

Подъём состояния в родительский компонент – обычное дело при рефакторинге React-компонентов. Давайте воспользуемся случаем и попробуем это сделать.

Добавим конструктор к компоненту Board и установим начальное состояние в виде массива из 9 элементов, заполненного значениями null. Эти 9 элементов соответствуют 9 квадратам:

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

Вначале мы передали из Board  [проп `value` вниз](#passing-data-through-props), чтобы отобразить номера от 0 до 8 внутри каждого Square. На другом шаге мы заменили числа знаком «X», [определённом в собственном состоянии Square](#making-an-interactive-component). Именно поэтому сейчас Square игнорирует проп `value`, переданный в него из Board.

Мы снова воспользуемся механизмом передачи пропсов. Изменим Board, чтобы передать каждому Square его текущее значение (`'X'`, `'O'` или `null`). Мы уже определили массив `squares` в конструкторе Board. Давайте изменим метод `renderSquare`, чтобы читать данные из этого массива:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Теперь каждый Square получает проп `value`, который будет, либо `'X'` или `'O'`, либо `null` для пустых клеток.

Дальше нам нужно поменять то, что происходит при клике на Square. Теперь компонент Board хранит информацию о заполненных клетках. Нам нужен способ, которым Square сможет обновлять состояние Board. Поскольку состояние является приватным для компонента, где оно определено, мы не можем обновить состояние Board напрямую из Square.

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
>Мы разбили возвращаемый элемент на несколько строк для удобства чтения и добавили скобки, чтобы JavaScript не вставлял точку с запятой после `return` и не ломал наш код.

Теперь мы передаём вниз два пропса из Board в Square : `value` и `onClick`. Проп `onClick` – это функция, которую Square вызывает при клике. Внесём следующие изменения в компонент Square:

* Заменим `this.state.value` на `this.props.value` внутри метода `render`.
* Заменим `this.setState()` на `this.props.onClick()` внутри метода `render`.
* Удалим `constructor` из Square, потому что компонент больше не отвечает за хранение состояния игры.

После этих изменений компонент Square выглядит так:

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

При клике на Square вызывается функция `onClick`, которая была передана из Board. Вот как это происходит:

1. Проп `onClick` на встроенном DOM-компоненте `<button>` указывает React установить обработчик события.
2. При клике по кнопке, React вызовет обработчик `onClick`, который определён в методе `render()` Square.
3. Этот обработчик вызовет `this.props.onClick()`. Проп `onClick` определён для Square внутри Board.
4. Т.к. Board передаёт в Square `onClick={() => this.handleClick(i)}`, Square при клике вызывает `handleClick(i)` у Board.
5. Мы пока не определили метод `handleClick()`, поэтому наш код сломается. Если вы сейчас кликнете на клетку, вы увидите красный экран с ошибкой вроде `this.handleClick is not a function`.

>Примечание
>
>Атрибут `onClick` DOM-элемента `<button>` имеет для React особое значение, потому что это встроенный компонент. Для обычных компонентов вроде Square вы можете называть пропсы как угодно. Мы можем назвать проп Square `onClick` и метод для Board `handleClick` любым именем, и они будут работать так же. Но в React есть соглашение об именах – `on[Имя события]` для пропсов, отвечающих за события, и `handle[Имя события]` для методов обрабатывающих события.

При клике на Square мы должны получить ошибку, потому что метод `handleClick` ещё не определён. Давайте добавим его в класс Board:

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
    const status = 'Следующий ход: X';

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

После этих изменений мы снова можем заполнять клетки по клику. Однако теперь состояние хранится внутри компонента Board, а не в разрозненных компонентах Square. При изменении состояния Board  произойдёт повторный рендер компонентов Square. Хранение состояния всех клеток внутри компонента Board позволит в будущем определить победителя.

Поскольку компоненты Square больше не содержат состояния, они получают все значения из Board и уведомляют его при кликах. В терминах React компонент Square теперь является **управляемым**. Им полностью управляет Board.

Обратите внимание, что внутри `handleClick` мы вызвали `.slice()` для создания копии массива `squares` вместо изменения существующего массива. В следующей части мы объясним зачем создавать копию массива `squares`.


### Почему иммутабельность так важна? {#why-immutability-is-important}

В последнем примере мы советовали использовать метод `.slice()` для создания и последующего копирования копии массива `squares` вместо изменения существующего. Теперь мы обсудим иммутабельность и почему её так важно изучить.

В целом есть два подхода к изменению данных. Первый подход – *мутировать*(изменять) данные, напрямую устанавливая новые значения. Второй подход – заменять данные новой копией, которая содержит изменения.

#### Мутирующее изменение данных {#data-change-with-mutation}

```javascript
var player = {score: 1, name: 'Джефф'};
player.score = 2;
// Теперь player имеет значение {score: 2, name: 'Джефф'}
```

#### Изменение данных без мутаций {#data-change-without-mutation}

```javascript
var player = {score: 1, name: 'Джефф'};

var newPlayer = Object.assign({}, player, {score: 2});
// Здесь `player` не изменился, а в `newPlayer` находится {score: 2, name: 'Джефф'}

// Или, если вы пользуетесь синтаксисом расширения объектов, вы можете написать:
// var newPlayer = {...player, score: 2};
```

Конечный результат будет тот же, но без мутации (т.е. изменения) исходных данных напрямую. Ниже описаны преимущества такого подхода.

#### Сложное становится простым {#complex-features-become-simple}

Иммутабельность делает реализацию сложной функциональности проще. Ниже мы реализуем функциональность «путешествие во времени», которая позволит хранить историю игры и «возвращаться» к прошлым ходам. Эта функциональность не характерна для игр, однако, возможность отменять и заново применять действия часто встречается в приложениях. Избежание прямой мутации данных позволяет сохранять предыдущие состояния игры без изменений и обращаться к ним позже.

#### Обнаружение изменений {#detecting-changes}

Работая с мутируемыми объектами довольно сложно обнаружить изменения, потому что они изменяются напрямую. В таком случае нам требуется сравнивать объект как со своей последней копией, так и со всем деревом объектов.

Обнаружение изменений в иммутабельных объектах намного проще. Если неизменяемый объект, на который ссылаются, отличается от предыдущего, то объект изменился.

#### Как React понимает, когда нужно перерендерить {#determining-when-to-re-render-in-react}

Основным преимуществом иммутабельности является то, что она помогает создавать в React _чистые компоненты_. Неизменяемые данные позволяют легко определить наличие изменений и момент, когда компонент нужно перерендерить.

Вы можете узнать больше о `shouldComponentUpdate()` и как создавать *чистые компоненты* в статье про [оптимизацию производительности](/docs/optimizing-performance.html#examples).

### Функциональные компоненты {#function-components}

Давайте сделаем Square **функциональным компонентом**.

В React **функциональные компоненты** являются более простым способом написания компонентов, которые содержат только метод `render` и не имеют собственного состояния. Вместо определения класса, который наследуется от `React.Component`, мы можем написать функцию, которая принимает на вход `props` и возвращает то, что должно быть отрендерено. Функциональные компоненты проще писать, чем классы, и многие компоненты могут быть оформлены таким образом.

Заменим класс Square следующей функцией:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Мы заменили `this.props` на `props` оба раза, когда обращались к ним.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Примечание
>
>Когда мы заменили Square на функциональный компонент, мы также изменили `onClick={() => this.props.onClick()}` на более короткое `onClick={props.onClick}` (обратите внимание на отсутствие скобок с *обеих* сторон).

### Очерёдность {#taking-turns}

Нам нужно исправить одну очевидную проблему в нашей игре – на поле нельзя поставить «O».

По-умолчанию установим первый ход за «X». Мы можем сделать это, изменяя начальное состояние внутри конструктора Board:


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

Каждый раз, когда игрок делает ход, `xIsNext` (булево значение) будет инвертироваться, чтобы обозначить, какой игрок ходит следующим, а состояние игры будет сохраняться. Мы обновим метод `handleClick` класса Board, для инверсии значения `xIsNext`:

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

После этих изменений «X» и «O» будут чередоваться. Попробуйте.

Давайте также изменим текст «status» в методе `render` класса Board так, чтобы он отображал какой игрок ходит следующим:

```javascript{2}
  render() {
    const status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // остальное не изменилось
```

После этих изменений наш Board-компонент должен выглядеть так:

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

Теперь, когда мы показываем, какой игрок ходит следующим, нам также нужно показать, когда игра закончена, и больше нет ходов. Скопируйте вспомогательную функцию в конец файла:

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

Функция получает массив из 9 клеток, проверяет победителя и возвращает `'X'`, `'O'` или `null`.

Будем вызывать `calculateWinner(squares)` внутри метода `render` класса Board, чтобы проверять, выиграл ли игрок. Если у нас есть победитель, мы покажем сообщение «Выиграл X» или «Выиграл O». Заменим объявление `status` в `render` следующим кодом:

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
      // остальное не изменилось
```

Теперь мы можем изменить метод `handleClick` класса Board для выхода из функции и игнорировании клика, если кто-то уже победил или если клетка уже заполнена:

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

Поздравляем! Теперь у вас есть работающая игра в крестики-нолики. И кроме этого вы только что изучили основы React. Похоже, настоящий победитель здесь это *вы*.

## Добавление путешествия во времени {#adding-time-travel}

В качестве последнего упражнения давайте добавим возможность «вернуться в прошлое» – к прошлым ходам игры.

### Сохраняем историю ходов {#storing-a-history-of-moves}

Если бы мы изменяли массив `squares`, реализация такой задачи была бы очень трудной.

Но мы использовали `slice()` для создания новой копии массива `squares` после каждого хода и работали с ним, [не изменяя оригинала](#why-immutability-is-important). Это позволит нам хранить каждую версию массива `squares` и перемещаться по ходам, которые уже были сделаны.

Сохраним массивы `squares` в другом массиве и назовём его `history`. Этот массив `history` будет хранить все состояния поля. От первого до последнего хода. У него будет такая структура:

```javascript
history = [
  // Перед первым ходом
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

### Подъём состояния. Снова {#lifting-state-up-again}

Мы хотим, чтобы вышележащий компонент Game отображал список последних ходов. Для этого ему понадобится доступ к `history`, поэтому мы поместим `history` в состояние родительского компонента Game.

Размещение `history` в состоянии компонента Game позволяет нам удалить `squares` из состояния его дочернего компонента Board. Так же, как мы уже [«поднимали состояние»](#lifting-state-up) из компонента Square в Board, мы теперь поднимем его из Board в компонент-родитель Game. Это даст компоненту Game полный контроль над данными Board и позволит отдавать команду для Board на рендеринг прошлых ходов из `history`:

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

После этого нужно, чтобы Board получил пропсы `squares` и `onClick` из компонента Game. Поскольку внутри Board у нас один обработчик кликов для всех Squares, нам достаточно передать позицию для каждого Square в обработчик `onClick`, чтобы показать по какой клетке мы кликнули. Для изменения компонента Board нам нужно выполнить следующие шаги:

* Удалить `constructor` в Board.
* Заменить `this.state.squares[i]` на `this.props.squares[i]` в методе `renderSquare` Board.
* Заменить `this.handleClick(i)` на `this.props.onClick(i)` в методе `renderSquare` Board.

Теперь компонент Board должен выглядеть вот так:

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

Давайте обновим метод `render` компонента Game, чтобы использовать последнюю запись из истории для определения и отображения статуса игры:

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

Поскольку компонент Game теперь рендерит статус игры, мы можем убрать соответствующий код из метода `render` внутри Board. После изменений метод `render` компонента Board выглядит так:

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

Наконец, нужно перенести метод `handleClick` из компонента Board в компонент Game. Мы также должны изменить `handleClick`, потому что состояние компонента Game имеет другую структуру. В методе `handleClick` компонента Game мы добавим новые записи истории в `history`.

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
>В отличие от метода массива `push()`, с которым вы должно быть знакомы, метод `concat()` не изменяет оригинальный массив, поэтому мы предпочтём его.

Теперь компоненту Board нужно только два метода – `renderSquare` и `render`. Состояние игры и `handleClick` должны находиться внутри компонента Game.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Показываем прошлые ходы {#showing-the-past-moves}

Поскольку мы записываем ход игры, мы теперь можем показать игроку список предыдущих ходов.

Ранее мы узнали, что React-элементы -- это обычные объекты JavaScript. Мы можем передавать их внутри нашего приложения. Для рендера нескольких записей в React мы можем использовать массив React-элементов.

В JavaScript у массивов есть [`метод map()`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/map), который обычно используется для преобразования данных. Например:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Используя метод `map`, мы можем отобразить историю наших ходов в React-элементы, представленные кнопками на экране, и отрисовать список кнопок для «перехода» к прошлым ходам.

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
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

При итерации по массиву `history`, переменная `step` содержит текущее значение элемента `history`, а `move` — текущий индекс элемента `history`. Поскольку нам нужен только `move`, то `step` не используется.

Для каждого хода в истории игры мы создаём элемент списка `<li>`, который содержит кнопку `<button>`. У кнопки есть обработчик `onClick`, который вызывает метод `this.jumpTo()`. Мы ещё не реализовали этот `jumpTo()` метод. Пока что мы должны видеть только список ходов, которые были сделаны в игре и вот такое предупреждение в инструментах разработчика:

>  Warning:
>  Each child in an array or iterator should have a unique «key» prop. Check the render method of «Game».

Что переводится как:

>  Предупреждение:
>  Каждый элемент в массиве или итераторе должен иметь уникальный проп «key». Проверьте метод render в Game

Давайте обсудим, что это предупреждение значит.

### Выбор ключа {#picking-a-key}

Когда мы рендерим список, React хранит информацию о каждом отрендеренном элементе списка. Если мы обновляем список, React должен понять, что в нём изменилось. Мы могли добавить, удалить, поменять порядок или обновить элементы списка.

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

В дополнении к изменённым цифрам, человек, читающий это, вероятно, сказал бы что Алекс и Бен поменялись местами, а между ними вставили Клаву. Но React -- это компьютерная программа, и она не знает чего мы хотим, поэтому нам нужно указать свойство *key* для каждого элемента списка, чтобы отличать каждый элемент от остальных. Один из вариантов – использовать строки `Алекс`, `Бен`, `Клава`. Если мы показываем информацию из базы данных, то в качестве ключей мы могли бы использовать идентификаторы из базы.

```html
<li key={user.id}>{user.name}: {user.taskCount} задач осталось</li>
```

При повторном рендеринге списка, React берёт у каждого элемента списка ключ и ищет его в элементах прошлого списка. Если в новом списке есть ключ, которого раньше не было, React создаёт новый компонент. Если в текущем списке отсутствует ключ, который был в прошлом списке, React уничтожает предыдущий компонент. Если два ключа совпадают, соответствующий компонент перемещается. Ключи в React работают как идентификаторы для каждого компонента, что помогает React поддерживать состояние между повторными рендерингами. Если у компонента меняется ключ, компонент будет уничтожен и создан вновь с новым состоянием.

`key` – это специальное зарезервированное свойство в React (наряду с `ref`, более продвинутой функциональностью). Когда элемент создан, React извлекает свойство `key` и сохраняет этот ключ непосредственно в возвращаемом элементе. Хотя `key` выглядит как пропс, к нему нельзя обращаться через `this.props.key`. React автоматически использует `key` для определения того, какой компонент должен обновиться. Компонент не может узнать о своём ключе.

**Настоятельно рекомендуется использовать правильные ключи каждый раз, когда вы строите динамические списки**. Если у вас нет подходящего ключа, можно подумать о реструктуризации ваших данных, чтобы он у вас появился.

Если ключ не был определён, React покажет предупреждение и по умолчанию использует индекс элемента в массиве в качестве ключа. Использование индексов массива может вызвать проблемы при попытке отсортировать элементы списка или при вставке/удалении элементов. Явная передача `key={i}` отключает предупреждение, но вызывает те же проблемы, связанные с индексами массивов, так что в большинстве случаев лучше так не делать.

Ключи не обязательно должны быть уникальными глобально. Они должны быть уникальными только между компонентами и их братьями и сёстрами.


### Реализация путешествия во времени {#implementing-time-travel}

В истории игры крестики-нолики каждый прошлый ход имеет уникальный идентификатор: это номер хода в последовательности. Ходы никогда не меняют свой порядок, не удаляются и не добавляются в середину последовательности, так что вполне безопасно пользоваться индексом в качестве ключа.

В методе `render` компонента Game мы можем добавить ключ следующим образом `<li key={move}>` и предупреждения от React об отсутствующих ключах должны пропасть:

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

Клик на любой кнопке из списка выбросит ошибку, потому что метод `jumpTo` не определён. Прежде чем реализовывать `jumpTo`, мы добавим `stepNumber` в состояние компонента Game, для указания номера хода, который сейчас отображается.

Сначала добавим `stepNumber: 0` в начальное состояние Game внутри `constructor`:

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

Далее, мы определим метод `jumpTo` в компоненте Game для обновления `stepNumber`. Мы также установим `xIsNext` в `true`, если номер хода, на который мы меняем `stepNumber`, чётный:

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

Обратите внимание, что в методе `jumpTo` мы не обновили свойство `history` состояния. Это потому, что обновления состояния объединяются или, проще говоря, React обновит только те свойства, которые были указаны в методе `setState` без изменения остальных свойств. Подробнее об этом читайте в **[документации](/docs/state-and-lifecycle.html#state-updates-are-merged)**.

Мы сделаем ещё несколько изменений в методе Game `handleClick`, который выполняется когда вы кликаете на клетки.

Добавленный нами `stepNumber` указывает номер хода, отображающегося пользователю. Когда мы делаем очередной ход, нам нужно обновить `stepNumber` используя `stepNumber: history.length` как часть аргумента для `this.setState`. Это гарантирует, что мы не застрянем, показывая одно и то же после того, как был сделан новый ход.

Мы также заменим чтение `this.state.history` на `this.state.history.slice(0, this.state.stepNumber + 1)`. Это гарантирует, что если мы «вернёмся назад», а затем сделаем новый шаг из этой точки, мы удалим всю «будущую» историю, которая перестала быть актуальной.

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

Наконец, мы изменим метод `render` для Game, чтобы вместо рендера последнего хода он рендерил ход, соответствующий `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Остальной код не менялся
```

Если мы кликнем на любой ход в игровой истории, поле должно немедленно обновиться, показывая как оно выглядело после этого хода.

**[Посмотреть полный код этого шага](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Подводя итоги {#wrapping-up}

Поздравляем! Вы только что создали игру в крестики-нолики, которая:

* Позволяет вам играть в крестики нолики,
* Показывает, когда один из игроков выиграл,
* Хранит историю игры,
* Позволяет игрокам просматривать историю игры и видеть прошлые состояния игрового поля.

Хорошая работа! Мы надеемся, вы чувствуете уверенность в своих знаниях о том, как работает React.

Посмотреть готовую игру вы можете здесь: **[Готовый результат](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Если у вас есть дополнительное время или вы хотите попрактиковать свои новые навыки в React, вот пара идей для улучшений, которые вы можете внедрить в крестики-нолики (перечислены в порядке увеличения сложности):

1. Отобразите позицию для каждого хода в формате (колонка, строка) в списке истории ходов.
2. Выделите выбранный элемент в списке ходов.
3. Перепишите Board, используя вложенные циклы для создания клеток, вместо их жёсткого кодирования.
4. Добавьте переключатель, который позволит вам сортировать ходы по возрастанию или по убыванию.
5. Когда кто-то выигрывает, подсветите три клетки, которые привели к победе.
6. Когда победителя нет, покажите сообщение о том, что игра окончилась вничью.

В этом вводном руководстве мы затронули концепции React, включая элементы, компоненты, пропсы и состояние. Для более детального ознакомления с каждой из этих тем обратитесь к [остальной документации](/docs/hello-world.html). Чтобы узнать больше про объявление компонентов изучите [Документацию по API `React.Component`](/docs/react-component.html).
