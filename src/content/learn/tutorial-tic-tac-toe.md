---
title: 'Tutorial: Tic-Tac-Toe'
---

<Intro>

В этом руководстве вы создадите небольшую игру «крестики-нолики». Это руководство не предполагает предварительных знаний React. Методы, которые вы изучите в ходе руководства, являются основополагающими для создания любого приложения React, и полное их понимание даст вам глубокое представление о React.

</Intro>

<Note>

Это руководство предназначено для тех, кто предпочитает **учиться на практике** и хочет быстро попробовать создать что-то осязаемое. Если вы предпочитаете изучать каждую концепцию шаг за шагом, начните с [Описания пользовательского интерфейса.](/learn/describing-the-ui)

</Note>

Руководство разделено на несколько разделов:

- [Настройка для руководства](#setup-for-the-tutorial) предоставит вам **отправную точку** для прохождения руководства.
- [Обзор](#overview) научит вас **основам** React: компонентам, пропсам и состоянию.
- [Завершение игры](#completing-the-game) научит вас **наиболее распространенным методам** в разработке React.
- [Добавление перемотки времени](#adding-time-travel) даст вам **более глубокое понимание** уникальных преимуществ React.

### Что вы будете создавать? {/*what-are-you-building*/}

В этом руководстве вы создадите интерактивную игру «крестики-нолики» с помощью React.

Вот как она будет выглядеть по завершении:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Если код пока непонятен или вы не знакомы с синтаксисом кода, не волнуйтесь! Цель этого руководства — помочь вам понять React и его синтаксис.

Мы рекомендуем вам ознакомиться с игрой «крестики-нолики» выше, прежде чем продолжить руководство. Одна из функций, которую вы заметите, — это нумерованный список справа от игрового поля. Этот список содержит историю всех ходов, которые произошли в игре, и обновляется по мере ее продвижения.

После того как вы поиграете с готовой игрой «крестики-нолики», прокрутите дальше. В этом руководстве вы начнете с более простого шаблона. Следующий шаг — подготовить вас к созданию игры.

## Настройка для руководства {/*setup-for-the-tutorial*/}

В редакторе кода ниже нажмите **Fork** в правом верхнем углу, чтобы открыть редактор в новой вкладке с помощью сайта CodeSandbox. CodeSandbox позволяет писать код в браузере и просматривать, как пользователи увидят созданное вами приложение. Новая вкладка должна отображать пустой квадрат и стартовый код для этого руководства.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Вы также можете следовать этому руководству, используя свою локальную среду разработки. Для этого вам необходимо:

1. Установить [Node.js](https://nodejs.org/en/)
1. Во вкладке CodeSandbox, которую вы открыли ранее, нажмите кнопку в верхнем левом углу, чтобы открыть меню, а затем выберите **Download Sandbox** в этом меню, чтобы скачать архив файлов локально
1. Распакуйте архив, затем откройте терминал и перейдите в каталог, который вы распаковали
1. Установите зависимости с помощью `npm install`
1. Запустите `npm start`, чтобы запустить локальный сервер и следовать инструкциям для просмотра кода, работающего в браузере

Если вы застряли, не позволяйте этому остановить вас! Вместо этого следуйте онлайн-руководству и попробуйте настроить локальную среду позже.

</Note>

## Обзор {/*overview*/}

Теперь, когда вы готовы, давайте получим общее представление о React!

### Изучение стартового кода {/*inspecting-the-starter-code*/}

В CodeSandbox вы увидите три основных раздела:

![CodeSandbox со стартовым кодом](../images/tutorial/react-starter-code-codesandbox.png)

1. Раздел _Файлы_ со списком файлов, таких как `App.js`, `index.js`, `styles.css`, и папкой `public`.
1. _Редактор кода_, где вы увидите исходный код выбранного файла.
1. Раздел _браузер_, где вы увидите, как будет отображаться написанный вами код.

Файл `App.js` должен быть выбран в разделе _Файлы_. Содержимое этого файла в _редакторе кода_ должно быть следующим:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

Раздел _браузер_ должен отображать квадрат с буквой X внутри, как показано здесь:

![квадрат с X](../images/tutorial/x-filled-square.png)

Теперь давайте посмотрим на файлы стартового кода.

#### `App.js` {/*appjs*/}

Код в `App.js` создает _компонент_. В React компонент — это фрагмент многократно используемого кода, представляющий часть пользовательского интерфейса. Компоненты используются для рендеринга, управления и обновления элементов пользовательского интерфейса в вашем приложении. Давайте рассмотрим компонент построчно, чтобы понять, что происходит:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

Первая строка определяет функцию с именем `Square`. Ключевое слово `export` в JavaScript делает эту функцию доступной вне этого файла. Ключевое слово `default` указывает другим файлам, использующим ваш код, что это основная функция в вашем файле.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

Вторая строка возвращает кнопку. Ключевое слово `return` в JavaScript означает, что все, что следует за ним, возвращается в качестве значения вызывающей функции. `<button>` — это *JSX-элемент*. JSX-элемент — это комбинация кода JavaScript и HTML-тегов, описывающая то, что вы хотите отобразить. `className="square"` — это свойство кнопки или *проп*, которое указывает CSS, как стилизовать кнопку. `X` — это текст, отображаемый внутри кнопки, а `</button>` закрывает JSX-элемент, указывая, что любой последующий контент не должен быть помещен внутрь кнопки.

#### `styles.css` {/*stylescss*/}

Нажмите на файл с названием `styles.css` в разделе _Файлы_ CodeSandbox. Этот файл определяет стили для вашего React-приложения. Первые два _CSS-селектора_ (`*` и `body`) определяют стиль больших частей вашего приложения, в то время как селектор `.square` определяет стиль любого компонента, у которого свойство `className` установлено в `square`. В вашем коде это будет соответствовать кнопке из вашего компонента Square в файле `App.js`.

#### `index.js` {/*indexjs*/}

Нажмите на файл с названием `index.js` в разделе _Файлы_ CodeSandbox. Вы не будете редактировать этот файл во время учебника, но он является связующим звеном между компонентом, который вы создали в файле `App.js`, и веб-браузером.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

Строки 1–5 объединяют все необходимые части:

* React
* Библиотеку React для взаимодействия с веб-браузерами (React DOM)
* Стили для ваших компонентов
* Компонент, который вы создали в `App.js`.

Оставшаяся часть файла объединяет все части и внедряет конечный продукт в `index.html` в папке `public`.

### Создание доски {/*building-the-board*/}

Давайте вернемся к `App.js`. Здесь вы проведете остальную часть учебника.

В настоящее время доска состоит только из одного квадрата, но вам нужно девять! Если вы просто скопируете и вставите свой квадрат, чтобы создать два квадрата, вот так:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Вы получите эту ошибку:

<ConsoleBlock level="error">

/src/App.js: Смежные JSX-элементы должны быть обернуты в заключающий тег. Вы хотели использовать JSX Fragment `<>...</>`?

</ConsoleBlock>

React-компоненты должны возвращать один JSX-элемент, а не несколько смежных JSX-элементов, таких как две кнопки. Чтобы исправить это, вы можете использовать *Фрагменты* (`<>` и `</>`) для обертывания нескольких смежных JSX-элементов, вот так:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Теперь вы должны увидеть:

![два квадрата с X](../images/tutorial/two-x-filled-squares.png)

Отлично! Теперь вам просто нужно скопировать и вставить несколько раз, чтобы добавить девять квадратов и...

![девять квадратов с X в ряд](../images/tutorial/nine-x-filled-squares.png)

О нет! Квадраты расположены в одну линию, а не в сетку, как вам нужно для нашей доски. Чтобы исправить это, вам нужно будет сгруппировать ваши квадраты по строкам с помощью `div` и добавить некоторые CSS-классы. Пока вы этим занимаетесь, вы присвоите каждому квадрату номер, чтобы убедиться, что вы знаете, где отображается каждый квадрат.

В файле `App.js` обновите компонент `Square`, чтобы он выглядел так:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

CSS, определенный в `styles.css`, стилизует `div` с `className` `board-row`. Теперь, когда вы сгруппировали свои компоненты по строкам с помощью стилизованных `div`s, у вас есть доска для крестиков-ноликов:

![доска для крестиков-ноликов, заполненная числами от 1 до 9](../images/tutorial/number-filled-board.png)

Но теперь у вас возникла проблема. Ваш компонент с именем `Square` на самом деле больше не является квадратом. Давайте исправим это, изменив имя на `Board`:

```js {1}
export default function Board() {
  //...
}
```

К этому моменту ваш код должен выглядеть примерно так:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Пссст... Это много для набора! Не страшно копировать и вставлять код с этой страницы. Однако, если вы готовы к небольшому испытанию, мы рекомендуем копировать только тот код, который вы уже набрали вручную хотя бы один раз.

</Note>

### Передача данных через пропсы {/*passing-data-through-props*/}

Далее вы захотите изменить значение квадрата с пустого на "X" при нажатии на квадрат. При текущей структуре доски вам пришлось бы копировать и вставлять код, обновляющий квадрат, девять раз (по одному для каждого квадрата)! Вместо копирования и вставки, архитектура компонентов React позволяет создавать многократно используемый компонент, чтобы избежать беспорядочного, дублирующегося кода.

Сначала вы скопируете строку, определяющую ваш первый квадрат (`<button className="square">1</button>`) из вашего компонента `Board` в новый компонент `Square`:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Затем вы обновите компонент `Board`, чтобы он рендерил этот компонент `Square` с использованием синтаксиса JSX:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Обратите внимание, что в отличие от браузерных `div`s, ваши собственные компоненты `Board` и `Square` должны начинаться с заглавной буквы.

Давайте посмотрим:

![доска, заполненная единицами](../images/tutorial/board-filled-with-ones.png)

О нет! Вы потеряли пронумерованные квадраты, которые были раньше. Теперь каждый квадрат показывает "1". Чтобы исправить это, вы будете использовать *пропсы* для передачи значения, которое должен иметь каждый квадрат, от родительского компонента (`Board`) к его дочернему (`Square`).

Обновите компонент `Square`, чтобы он считывал проп `value`, который вы будете передавать из `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` указывает, что компоненту `Square` может быть передан проп с именем `value`.

Теперь вы хотите отобразить этот `value` вместо `1` внутри каждого квадрата. Попробуйте сделать это так:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Упс, это не то, что вы хотели:

![доска, заполненная словом value](../images/tutorial/board-filled-with-value.png)

Вы хотели отобразить JavaScript-переменную `value` из вашего компонента, а не слово "value". Чтобы "выйти в JavaScript" из JSX, вам нужны фигурные скобки. Добавьте фигурные скобки вокруг `value` в JSX вот так:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Пока что вы должны увидеть пустую доску:

![пустая доска](../images/tutorial/empty-board.png)

Это потому, что компонент `Board` еще не передал проп `value` каждому компоненту `Square`, который он рендерит. Чтобы исправить это, вы добавите проп `value` каждому компоненту `Square`, который рендерит компонент `Board`:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Теперь вы снова должны увидеть сетку чисел:

![доска для крестиков-ноликов, заполненная числами от 1 до 9](../images/tutorial/number-filled-board.png)

Ваш обновленный код должен выглядеть так:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Создание интерактивного компонента {/*making-an-interactive-component*/}

Давайте заполним компонент `Square` буквой "X" при нажатии. Объявите функцию с именем `handleClick` внутри `Square`. Затем добавьте `onClick` к пропсам JSX-элемента кнопки, возвращаемого из `Square`:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Если вы нажмете на квадрат сейчас, вы увидите в консоли сообщение `"clicked!"` во вкладке _Консоль_ в нижней части раздела _Браузер_ в CodeSandbox. Нажатие на квадрат более одного раза снова выведет `"clicked!"`. Повторяющиеся сообщения в консоли не создадут новых строк в консоли. Вместо этого вы увидите увеличивающийся счетчик рядом с вашим первым сообщением `"clicked!"`.

<Note>

Если вы следуете этому учебнику, используя свою локальную среду разработки, вам нужно открыть Консоль вашего браузера. Например, если вы используете браузер Chrome, вы можете просмотреть Консоль с помощью сочетания клавиш **Shift + Ctrl + J** (в Windows/Linux) или **Option + ⌘ + J** (в macOS).

</Note>

В качестве следующего шага вы хотите, чтобы компонент `Square` "запомнил", что на него нажали, и заполнил его отметкой "X". Чтобы "запоминать" вещи, компоненты используют *состояние*.

React предоставляет специальную функцию под названием `useState`, которую вы можете вызвать из своего компонента, чтобы он мог "запоминать" вещи. Давайте сохраним текущее значение `Square` в состоянии и изменим его при нажатии на `Square`.

Импортируйте `useState` в верхней части файла. Удалите проп `value` из компонента `Square`. Вместо этого добавьте новую строку в начале `Square`, которая вызывает `useState`. Пусть она вернет переменную состояния с именем `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` хранит значение, а `setValue` — это функция, которую можно использовать для изменения значения. `null`, переданный в `useState`, используется в качестве начального значения для этой переменной состояния, поэтому `value` здесь изначально равно `null`.

Поскольку компонент `Square` больше не принимает пропсы, вы удалите проп `value` из всех девяти компонентов `Square`, созданных компонентом `Board`:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Теперь вы измените `Square`, чтобы он отображал "X" при нажатии. Замените обработчик события `console.log("clicked!");` на `setValue('X');`. Теперь ваш компонент `Square` выглядит так:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Вызвав эту функцию `set` из обработчика `onClick`, вы говорите React перерисовать этот `Square` каждый раз, когда его `<button>` нажимается. После обновления `value` компонента `Square` будет `'X'`, поэтому вы увидите "X" на игровой доске. Нажмите на любой квадрат, и должен появиться "X":

![добавление X на доску](../images/tutorial/tictac-adding-x-s.gif)

Каждый квадрат имеет свое собственное состояние: `value`, хранящееся в каждом квадрате, полностью независимо от других. Когда вы вызываете функцию `set` в компоненте, React автоматически обновляет и дочерние компоненты внутри него.

После внесения вышеуказанных изменений ваш код будет выглядеть так:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Инструменты разработчика React {/*react-developer-tools*/}

React DevTools позволяют проверять пропсы и состояние ваших React-компонентов. Вы можете найти вкладку React DevTools в нижней части раздела _Браузер_ в CodeSandbox:

![React DevTools в CodeSandbox](../images/tutorial/codesandbox-devtools.png)

Чтобы проверить конкретный компонент на экране, используйте кнопку в верхнем левом углу React DevTools:

![Выбор компонентов на странице с помощью React DevTools](../images/tutorial/devtools-select.gif)

<Note>

Для локальной разработки React DevTools доступен как [расширение для браузера Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) и [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil). Установите его, и вкладка *Компоненты* появится в Инструментах разработчика вашего браузера для сайтов, использующих React.

</Note>

## Завершение игры {/*completing-the-game*/}

К этому моменту у вас есть все основные строительные блоки для вашей игры в крестики-нолики. Чтобы завершить игру, вам теперь нужно чередовать размещение "X" и "O" на доске, а также определить способ определения победителя.

### Подъём состояния {/*lifting-state-up*/}

В настоящее время каждый компонент `Square` поддерживает часть состояния игры. Чтобы проверить наличие победителя в игре в крестики-нолики, `Board` должен будет каким-то образом знать состояние каждого из 9 компонентов `Square`.

Как бы вы к этому подошли? Сначала вы можете предположить, что `Board` должен "спросить" каждый `Square` о состоянии этого `Square`. Хотя этот подход технически возможен в React, мы его не рекомендуем, поскольку код становится трудным для понимания, подверженным ошибкам и сложным для рефакторинга. Вместо этого лучший подход — хранить состояние игры в родительском компоненте `Board`, а не в каждом `Square`. Компонент `Board` может сообщать каждому `Square`, что отображать, передавая проп, как вы сделали, когда передавали число каждому `Square`.

**Чтобы собрать данные от нескольких дочерних компонентов или чтобы два дочерних компонента общались друг с другом, объявите общее состояние в их родительском компоненте. Родительский компонент может передать это состояние обратно дочерним компонентам через пропсы. Это позволяет дочерним компонентам синхронизироваться друг с другом и с их родителем.**

Подъём состояния в родительский компонент является распространенной практикой при рефакторинге компонентов React.

Воспользуемся этой возможностью и попробуем. Отредактируйте компонент `Board`, чтобы он объявил переменную состояния с именем `squares`, которая по умолчанию является массивом из 9 `null`, соответствующих 9 квадратам:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` создает массив из девяти элементов и устанавливает каждый из них в `null`. Вызов `useState()` вокруг него объявляет переменную состояния `squares`, которая изначально устанавливается в этот массив. Каждый элемент массива соответствует значению квадрата. Когда вы позже заполните доску, массив `squares` будет выглядеть так:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Теперь ваш компонент `Board` должен передавать проп `value` каждому `Square`, который он отображает:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

Далее вы отредактируете компонент `Square`, чтобы он получал проп `value` от компонента `Board`. Это потребует удаления собственного отслеживания состояния `value` компонентом `Square` и пропа `onClick` кнопки:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

К этому моменту вы должны увидеть пустую доску для крестиков-ноликов:

![empty board](../images/tutorial/empty-board.png)

И ваш код должен выглядеть так:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Каждый `Square` теперь будет получать проп `value`, который будет либо `'X'`, либо `'O'`, либо `null` для пустых квадратов.

Далее вам нужно изменить то, что происходит при нажатии на `Square`. Компонент `Board` теперь отслеживает, какие квадраты заполнены. Вам нужно будет создать способ для `Square` обновлять состояние `Board`. Поскольку состояние является приватным для компонента, который его определяет, вы не можете напрямую обновлять состояние `Board` из `Square`.

Вместо этого вы передадите функцию из компонента `Board` в компонент `Square`, и `Square` вызовет эту функцию при нажатии на квадрат. Вы начнете с функции, которую компонент `Square` вызовет при нажатии. Вы назовете эту функцию `onSquareClick`:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Далее вы добавите функцию `onSquareClick` в пропсы компонента `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Теперь вы подключите проп `onSquareClick` к функции в компоненте `Board`, которую вы назовете `handleClick`. Чтобы подключить `onSquareClick` к `handleClick`, вы передадите функцию в проп `onSquareClick` первого компонента `Square`:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Наконец, вы определите функцию `handleClick` внутри компонента `Board`, чтобы обновить массив `squares`, содержащий состояние вашей доски:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Функция `handleClick` создает копию массива `squares` (`nextSquares`) с помощью метода массива JavaScript `slice()`. Затем `handleClick` обновляет массив `nextSquares`, добавляя `X` в первый квадрат (индекс `[0]`).

Вызов функции `setSquares` позволяет React узнать, что состояние компонента изменилось. Это вызовет повторный рендеринг компонентов, использующих состояние `squares` (`Board`), а также его дочерних компонентов (компонентов `Square`, составляющих доску).

<Note>

JavaScript поддерживает [замыкания](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures), что означает, что внутренняя функция (например, `handleClick`) имеет доступ к переменным и функциям, определенным во внешней функции (например, `Board`). Функция `handleClick` может читать состояние `squares` и вызывать метод `setSquares`, поскольку оба они определены внутри функции `Board`.

</Note>

Теперь вы можете добавлять X на доску... но только в верхний левый квадрат. Ваша функция `handleClick` жестко закодирована для обновления индекса верхнего левого квадрата (`0`). Давайте обновим `handleClick`, чтобы она могла обновлять любой квадрат. Добавьте аргумент `i` в функцию `handleClick`, которая принимает индекс обновляемого квадрата:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Далее вам нужно будет передать этот `i` в `handleClick`. Вы могли бы попытаться установить проп `onSquareClick` квадрата в `handleClick(0)` напрямую в JSX вот так, но это не сработает:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Вот почему это не работает. Вызов `handleClick(0)` будет частью рендеринга компонента доски. Поскольку `handleClick(0)` изменяет состояние компонента доски, вызывая `setSquares`, весь ваш компонент доски будет снова перерендерен. Но это снова вызовет `handleClick(0)`, что приведет к бесконечному циклу:

<ConsoleBlock level="error">

Слишком много повторных рендеров. React ограничивает количество рендеров, чтобы предотвратить бесконечный цикл.

</ConsoleBlock>

Почему эта проблема не возникла раньше?

Когда вы передавали `onSquareClick={handleClick}`, вы передавали функцию `handleClick` как проп. Вы не вызывали ее! Но теперь вы *вызываете* эту функцию немедленно — обратите внимание на скобки в `handleClick(0)` — и именно поэтому она выполняется слишком рано. Вы не хотите вызывать `handleClick` до тех пор, пока пользователь не нажмет!

Вы могли бы исправить это, создав функцию вроде `handleFirstSquareClick`, которая вызывает `handleClick(0)`, функцию вроде `handleSecondSquareClick`, которая вызывает `handleClick(1)`, и так далее. Вы бы передавали (а не вызывали) эти функции как пропсы, например `onSquareClick={handleFirstSquareClick}`. Это решило бы проблему бесконечного цикла.

Однако определение девяти разных функций и присвоение каждой из них имени слишком многословно. Вместо этого сделаем так:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Обратите внимание на новый синтаксис `() =>`. Здесь `() => handleClick(0)` — это *стрелочная функция*, которая является более коротким способом определения функций. Когда квадрат будет нажат, код после стрелки `=>` выполнится, вызвав `handleClick(0)`.

Теперь вам нужно обновить остальные восемь квадратов, чтобы они вызывали `handleClick` из стрелочных функций, которые вы передаете. Убедитесь, что аргумент для каждого вызова `handleClick` соответствует индексу правильного квадрата:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

Теперь вы снова можете добавлять X в любой квадрат на доске, нажимая на них:

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

Но на этот раз всем управлением состоянием занимается компонент `Board`!

Вот как должен выглядеть ваш код:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Теперь, когда обработка состояния находится в компоненте `Board`, родительский компонент `Board` передает пропсы дочерним компонентам `Square`, чтобы они могли правильно отображаться. При нажатии на `Square` дочерний компонент `Square` теперь просит родительский компонент `Board` обновить состояние доски. Когда состояние `Board` изменяется, как компонент `Board`, так и каждый дочерний `Square` автоматически перерендериваются. Хранение состояния всех квадратов в компоненте `Board` позволит ему в будущем определять победителя.

Давайте подытожим, что происходит, когда пользователь нажимает на верхний левый квадрат на вашей доске, чтобы добавить к нему `X`:

1. Нажатие на верхний левый квадрат запускает функцию, которую `button` получил как свой проп `onClick` от `Square`. Компонент `Square` получил эту функцию как свой проп `onSquareClick` от `Board`. Компонент `Board` определил эту функцию непосредственно в JSX. Он вызывает `handleClick` с аргументом `0`.
1. `handleClick` использует аргумент (`0`) для обновления первого элемента массива `squares` с `null` на `X`.
1. Состояние `squares` компонента `Board` было обновлено, поэтому `Board` и все его дочерние компоненты перерендериваются. Это приводит к изменению пропа `value` компонента `Square` с индексом `0` с `null` на `X`.

В итоге пользователь видит, что верхний левый квадрат изменился с пустого на `X` после нажатия на него.

<Note>

Атрибут `onClick` элемента DOM `<button>` имеет особое значение для React, поскольку это встроенный компонент. Для пользовательских компонентов, таких как `Square`, именование остается на ваше усмотрение. Вы могли бы присвоить любое имя пропу `onSquareClick` компонента `Square` или функции `handleClick` компонента `Board`, и код работал бы одинаково. В React принято использовать имена `onSomething` для пропсов, представляющих события, и `handleSomething` для определений функций, обрабатывающих эти события.

</Note>

### Почему важна неизменяемость {/*why-immutability-is-important*/}

Обратите внимание, как в `handleClick` вы вызываете `.slice()` для создания копии массива `squares` вместо изменения существующего массива. Чтобы объяснить почему, нам нужно обсудить неизменяемость и почему важно изучить ее.

Существует два общих подхода к изменению данных. Первый подход — _изменять_ данные, напрямую изменяя их значения. Второй подход — заменять данные новой копией, которая имеет желаемые изменения. Вот как это выглядело бы, если бы вы изменили массив `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Теперь `squares` это ["X", null, null, null, null, null, null, null, null];
```

А вот как это выглядело бы, если бы вы изменили данные, не изменяя массив `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Теперь `squares` не изменен, но первый элемент `nextSquares` равен 'X', а не `null`
```

Результат одинаков, но, не изменяя (не изменяя базовые данные) напрямую, вы получаете несколько преимуществ.

Неизменяемость значительно упрощает реализацию сложных функций. Позже в этом руководстве вы реализуете функцию "путешествия во времени", которая позволит вам просматривать историю игры и "возвращаться" к предыдущим ходам. Эта функциональность не специфична для игр — возможность отменять и повторять определенные действия является распространенным требованием для приложений. Избегая прямого изменения данных, вы можете сохранять предыдущие версии данных нетронутыми и использовать их позже.

Есть и еще одно преимущество неизменяемости. По умолчанию все дочерние компоненты автоматически перерендериваются при изменении состояния родительского компонента. Это включает даже те дочерние компоненты, которые не были затронуты изменением. Хотя повторный рендеринг сам по себе не заметен пользователю (вам не следует активно пытаться его избежать!), вы можете захотеть пропустить повторный рендеринг части дерева, которая явно не была затронута, из соображений производительности. Неизменяемость делает очень дешевым для компонентов сравнение того, изменились ли их данные или нет. Вы можете узнать больше о том, как React выбирает, когда перерендеривать компонент, в [справочнике по API `memo`](/reference/react/memo).

### Чередование ходов {/*taking-turns*/}

Пришло время исправить серьезный недостаток в этой игре в крестики-нолики: "O" нельзя отметить на доске.

Вы установите первый ход по умолчанию как "X". Давайте отслеживать это, добавив еще одно состояние в компонент `Board`:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Каждый раз, когда игрок делает ход, `xIsNext` (булево значение) будет переключаться, чтобы определить, чей ход следующий, и состояние игры будет сохранено. Вы обновите функцию `handleClick` компонента `Board`, чтобы переключить значение `xIsNext`:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

Теперь, когда вы нажимаете на разные квадраты, они будут чередоваться между `X` и `O`, как и положено!

Но подождите, есть проблема. Попробуйте нажать на один и тот же квадрат несколько раз:

![O overwriting an X](../images/tutorial/o-replaces-x.gif)

`X` перезаписывается `O`! Хотя это добавило бы очень интересный поворот в игру, мы пока придерживаемся оригинальных правил.

Когда вы отмечаете квадрат `X` или `O`, вы сначала не проверяете, есть ли в квадрате уже значение `X` или `O`. Вы можете исправить это, *вернувшись раньше*. Вы проверите, есть ли в квадрате уже `X` или `O`. Если квадрат уже заполнен, вы вернетесь из функции `handleClick` раньше — до того, как она попытается обновить состояние доски.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Теперь вы можете добавлять `X` или `O` только в пустые квадраты! Вот как должен выглядеть ваш код на данный момент:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Определение победителя {/*declaring-a-winner*/}

Теперь, когда игроки могут ходить по очереди, вам нужно показывать, когда игра выиграна и больше нет ходов. Для этого вы добавите вспомогательную функцию `calculateWinner`, которая принимает массив из 9 квадратов, проверяет наличие победителя и возвращает `'X'`, `'O'` или `null` соответственно. Не беспокойтесь слишком сильно о функции `calculateWinner`; она не специфична для React:

```js src/App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
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

<Note>

Не имеет значения, определите ли вы `calculateWinner` до или после `Board`. Давайте поместим её в конец, чтобы вам не приходилось прокручивать её каждый раз при редактировании компонентов.

</Note>

Вы будете вызывать `calculateWinner(squares)` в функции `handleClick` компонента `Board`, чтобы проверить, выиграл ли игрок. Вы можете выполнить эту проверку одновременно с проверкой того, нажал ли пользователь на квадрат, в котором уже есть `X` или `O`. Мы хотим выйти из функции в обоих случаях:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Чтобы игроки знали, когда игра окончена, вы можете отображать текст, например "Победитель: X" или "Победитель: O". Для этого вы добавите секцию `status` в компонент `Board`. Статус будет отображать победителя, если игра окончена, а если игра продолжается, вы будете отображать, чей следующий ход:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Поздравляем! Теперь у вас есть рабочая игра в крестики-нолики. И вы только что изучили основы React. Так что _вы_ — настоящий победитель здесь. Вот как должен выглядеть код:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## Добавление перемотки {/*adding-time-travel*/}

В качестве последнего упражнения мы сделаем возможным «возвращаться в прошлое» к предыдущим ходам в игре.

### Сохранение истории ходов {/*storing-a-history-of-moves*/}

Если бы вы мутировали массив `squares`, реализовать перемотку было бы очень сложно.

Однако вы использовали `slice()` для создания новой копии массива `squares` после каждого хода и обращались с ней как с неизменяемой. Это позволит вам сохранить каждую прошлую версию массива `squares` и перемещаться между уже произошедшими ходами.

Вы будете хранить прошлые массивы `squares` в другом массиве под названием `history`, который вы сохраните как новую переменную состояния. Массив `history` представляет все состояния доски, от первого до последнего хода, и имеет следующую структуру:

```jsx
[
  // Перед первым ходом
  [null, null, null, null, null, null, null, null, null],
  // После первого хода
  [null, null, null, null, 'X', null, null, null, null],
  // После второго хода
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Подъём состояния, снова {/*lifting-state-up-again*/}

Теперь вы напишете новый компонент верхнего уровня под названием `Game` для отображения списка прошлых ходов. Именно там вы разместите состояние `history`, которое содержит всю историю игры.

Размещение состояния `history` в компоненте `Game` позволит вам удалить состояние `squares` из его дочернего компонента `Board`. Точно так же, как вы «подняли состояние» из компонента `Square` в компонент `Board`, теперь вы поднимете его из `Board` в компонент `Game` верхнего уровня. Это даст компоненту `Game` полный контроль над данными `Board` и позволит ему давать указания `Board` отображать предыдущие ходы из `history`.

Сначала добавьте компонент `Game` с `export default`. Пусть он отображает компонент `Board` и некоторый разметку:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

Обратите внимание, что вы удалили ключевые слова `export default` перед объявлением `function Board() {` и добавили их перед объявлением `function Game() {`. Это говорит вашему файлу `index.js` использовать компонент `Game` в качестве компонента верхнего уровня вместо вашего компонента `Board`. Дополнительные `div`s, возвращаемые компонентом `Game`, освобождают место для игровой информации, которую вы добавите на доску позже.

Добавьте состояние в компонент `Game` для отслеживания следующего игрока и истории ходов:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Обратите внимание, что `[Array(9).fill(null)]` — это массив с одним элементом, который сам по себе является массивом из 9 `null`.

Чтобы отобразить квадраты для текущего хода, вам нужно будет прочитать последний массив квадратов из `history`. Вам не нужен `useState` для этого — у вас уже достаточно информации, чтобы рассчитать его во время рендеринга:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Далее создайте функцию `handlePlay` внутри компонента `Game`, которая будет вызываться компонентом `Board` для обновления игры. Передайте `xIsNext`, `currentSquares` и `handlePlay` в качестве пропсов компоненту `Board`:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Сделайте компонент `Board` полностью управляемым пропсами, которые он получает. Измените компонент `Board` так, чтобы он принимал три пропса: `xIsNext`, `squares` и новую функцию `onPlay`, которую `Board` может вызывать с обновленным массивом квадратов, когда игрок делает ход. Затем удалите первые две строки функции `Board`, которые вызывают `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Теперь замените вызовы `setSquares` и `setXIsNext` в `handleClick` в компоненте `Board` одним вызовом вашей новой функции `onPlay`, чтобы компонент `Game` мог обновить `Board` при нажатии игроком на квадрат:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

Компонент `Board` полностью управляется пропсами, передаваемыми ему компонентом `Game`. Вам нужно реализовать функцию `handlePlay` в компоненте `Game`, чтобы игра снова заработала.

Что должна делать `handlePlay` при вызове? Помните, что `Board` раньше вызывал `setSquares` с обновленным массивом; теперь он передает обновленный массив `squares` в `onPlay`.

Функция `handlePlay` должна обновить состояние `Game`, чтобы вызвать повторный рендеринг, но у вас больше нет функции `setSquares`, которую вы могли бы вызвать — теперь вы используете переменную состояния `history` для хранения этой информации. Вам нужно будет обновить `history`, добавив обновленный массив `squares` как новую запись в истории. Вам также нужно будет переключить `xIsNext`, как это делал `Board`:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Здесь `[...history, nextSquares]` создает новый массив, который содержит все элементы из `history`, за которыми следует `nextSquares`. (Вы можете прочитать [*синтаксис spread*](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Spread_syntax) `...history` как «перечислить все элементы в `history`».)

Например, если `history` равен `[[null,null,null], ["X",null,null]]`, а `nextSquares` равен `["X",null,"O"]`, то новый массив `[...history, nextSquares]` будет `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

К этому моменту вы переместили состояние в компонент `Game`, и пользовательский интерфейс должен полностью работать, как и до рефакторинга. Вот как должен выглядеть код на данный момент:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Отображение прошлых ходов {/*showing-the-past-moves*/}

Поскольку вы записываете историю игры в крестики-нолики, теперь вы можете отобразить список прошлых ходов игроку.

React-элементы, такие как `<button>`, являются обычными JavaScript-объектами; вы можете передавать их по всему приложению. Чтобы отобразить несколько элементов в React, вы можете использовать массив React-элементов.

У вас уже есть массив ходов `history` в состоянии, поэтому теперь вам нужно преобразовать его в массив React-элементов. В JavaScript для преобразования одного массива в другой вы можете использовать [метод `map` массива:](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Вы будете использовать `map` для преобразования вашего `history` ходов в React-элементы, представляющие кнопки на экране, и отображать список кнопок для «прыжка» к прошлым ходам. Давайте применим `map` к `history` в компоненте `Game`:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

Вы можете увидеть, как должен выглядеть ваш код ниже. Обратите внимание, что вы увидите ошибку в консоли инструментов разработчика:

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>
  
Вы исправите эту ошибку в следующем разделе.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

При итерации по массиву `history` внутри функции, переданной в `map`, аргумент `squares` проходит через каждый элемент `history`, а аргумент `move` проходит через каждый индекс массива: `0`, `1`, `2`, …. (В большинстве случаев вам понадобятся фактические элементы массива, но для отображения списка ходов вам понадобятся только индексы.)

Для каждого хода в истории игры в крестики-нолики вы создаете элемент списка `<li>`, который содержит кнопку `<button>`. Кнопка имеет обработчик `onClick`, который вызывает функцию под названием `jumpTo` (которую вы еще не реализовали).

Пока что вы должны увидеть список произошедших в игре ходов и ошибку в консоли инструментов разработчика. Давайте обсудим, что означает ошибка «key».

### Выбор ключа {/*picking-a-key*/}

Когда вы отображаете список, React сохраняет некоторую информацию о каждом отображенном элементе списка. Когда вы обновляете список, React должен определить, что изменилось. Вы могли добавить, удалить, переставить или обновить элементы списка.

Представьте переход от

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

к

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Помимо обновленных счетчиков, человек, читающий это, вероятно, сказал бы, что вы поменяли местами порядок Alexa и Ben и вставили Claudia между Alexa и Ben. Однако React — это компьютерная программа, и она не знает, что вы имели в виду, поэтому вам нужно указать свойство _key_ для каждого элемента списка, чтобы отличать каждый элемент списка от его соседей. Если бы ваши данные были из базы данных, идентификаторы базы данных Alexa, Ben и Claudia могли бы использоваться в качестве ключей.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

Когда список перерисовывается, React берет ключ каждого элемента списка и ищет совпадение ключа среди элементов предыдущего списка. Если в текущем списке есть ключ, которого раньше не было, React создает компонент. Если в текущем списке отсутствует ключ, который был в предыдущем списке, React уничтожает предыдущий компонент. Если два ключа совпадают, соответствующий компонент перемещается.

Ключи сообщают React об идентификации каждого компонента, что позволяет React поддерживать состояние между повторными рендерингами. Если ключ компонента изменяется, компонент будет уничтожен и воссоздан с новым состоянием.

`key` — это специальное зарезервированное свойство в React. Когда элемент создается, React извлекает свойство `key` и сохраняет ключ непосредственно в возвращаемом элементе. Даже если `key` выглядит так, как будто он передается как пропс, React автоматически использует `key` для принятия решения о том, какие компоненты обновлять. Компонент не может узнать, какой `key` указал его родитель.

**Настоятельно рекомендуется назначать правильные ключи при создании динамических списков.** Если у вас нет подходящего ключа, вы можете рассмотреть возможность реструктуризации ваших данных так, чтобы он был.

Если ключ не указан, React сообщит об ошибке и по умолчанию будет использовать индекс массива в качестве ключа. Использование индекса массива в качестве ключа проблематично при попытке изменить порядок элементов списка или вставить/удалить элементы списка. Явная передача `key={i}` подавляет ошибку, но имеет те же проблемы, что и индексы массива, и в большинстве случаев не рекомендуется.

Ключи не обязательно должны быть глобально уникальными; они должны быть уникальными только между компонентами и их соседями.

### Реализация перемотки времени {/*implementing-time-travel*/}

В игре крестики-нолики каждая прошлая запись в истории имеет уникальный идентификатор: это порядковый номер хода. Ходы никогда не будут переупорядочены, удалены или вставлены в середину, поэтому использовать индекс хода в качестве ключа безопасно.

В функции `Game` вы можете добавить ключ как `<li key={move}>`, и если вы перезагрузите отрисованную игру, ошибка React "key" должна исчезнуть:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Прежде чем вы сможете реализовать `jumpTo`, вам нужно, чтобы компонент `Game` отслеживал, какой шаг в данный момент просматривает пользователь. Для этого определите новую переменную состояния с именем `currentMove`, значение по умолчанию которой равно `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Далее, обновите функцию `jumpTo` внутри `Game`, чтобы она обновляла `currentMove`. Вы также установите `xIsNext` в `true`, если число, на которое вы меняете `currentMove`, четное.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

Теперь вы внесете два изменения в функцию `handlePlay` компонента `Game`, которая вызывается при нажатии на квадрат.

- Если вы "вернетесь в прошлое" и затем сделаете новый ход с этой точки, вы захотите сохранить историю только до этой точки. Вместо добавления `nextSquares` после всех элементов (`...` синтаксис spread) в `history`, вы добавите его после всех элементов в `history.slice(0, currentMove + 1)`, чтобы сохранить только эту часть старой истории.
- Каждый раз, когда делается ход, вам нужно обновлять `currentMove`, чтобы он указывал на последнюю запись в истории.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Наконец, вы измените компонент `Game`, чтобы он отображал выбранный в данный момент ход, а не всегда отображал последний ход:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Если вы нажмете на любой шаг в истории игры, доска крестиков-ноликов должна немедленно обновиться, чтобы показать, как выглядела доска после этого шага.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Финальная очистка {/*final-cleanup*/}

Если вы внимательно посмотрите на код, вы можете заметить, что `xIsNext === true`, когда `currentMove` четное, и `xIsNext === false`, когда `currentMove` нечетное. Другими словами, если вы знаете значение `currentMove`, вы всегда можете определить, каким должно быть `xIsNext`.

Нет причин хранить оба значения в состоянии. На самом деле, всегда старайтесь избегать избыточного состояния. Упрощение того, что вы храните в состоянии, уменьшает количество ошибок и делает ваш код более понятным. Измените `Game` так, чтобы он не хранил `xIsNext` как отдельную переменную состояния, а вычислял его на основе `currentMove`:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

Вам больше не нужны объявление состояния `xIsNext` и вызовы `setXIsNext`. Теперь нет шанса, что `xIsNext` выйдет из синхронизации с `currentMove`, даже если вы допустите ошибку при написании компонентов.

### Завершение {/*wrapping-up*/}

Поздравляем! Вы создали игру крестики-нолики, которая:

- Позволяет играть в крестики-нолики,
- Указывает, когда игрок выиграл игру,
- Хранит историю игры по мере ее прогресса,
- Позволяет игрокам просматривать историю игры и видеть предыдущие версии доски игры.

Отличная работа! Надеемся, теперь у вас есть хорошее представление о том, как работает React.

Ознакомьтесь с окончательным результатом здесь:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Если у вас есть дополнительное время или вы хотите попрактиковаться в новых навыках React, вот несколько идей для улучшений, которые вы можете внести в игру крестики-нолики, перечисленных в порядке возрастания сложности:

1. Для текущего хода только отображайте "Вы находитесь на ходу №..." вместо кнопки.
1. Перепишите `Board`, чтобы использовать два цикла для создания квадратов вместо жесткого кодирования.
1. Добавьте кнопку переключения, которая позволяет сортировать ходы в порядке возрастания или убывания.
1. Когда кто-то выигрывает, выделите три квадрата, которые привели к победе (а когда никто не выигрывает, отобразите сообщение о ничьей).
1. Отобразите местоположение каждого хода в формате (строка, столбец) в списке истории ходов.

На протяжении всего этого руководства вы затрагивали концепции React, включая элементы, компоненты, props и состояние. Теперь, когда вы увидели, как эти концепции работают при создании игры, ознакомьтесь с [Мышление в React](/learn/thinking-in-react), чтобы узнать, как те же концепции React работают при создании пользовательского интерфейса приложения.
