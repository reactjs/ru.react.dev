---
title: 'Введение: Крестики-нолики'
---
```html
<Intro>

В этом руководстве вы создадите небольшую игру «крестики-нолики». В этом руководстве не предполагается никаких существующих знаний React. Методы, которые вы изучите в руководстве, являются основополагающими для создания любого приложения React, и полное понимание этого даст вам глубокое понимание React.

</Intro>

<Note>

Это руководство предназначено для людей, которые предпочитают **учиться на практике** и хотят быстро попробовать сделать что-то ощутимое. Если вы предпочитаете изучать каждую концепцию шаг за шагом, начните с [Описание пользовательского интерфейса.](/learn/describing-the-ui)

</Note>

Руководство разделено на несколько разделов:

- [Настройка для руководства](#setup-for-the-tutorial) даст вам **отправную точку** для прохождения руководства.
- [Обзор](#overview) научит вас **основам** React: компонентам, пропсам и состоянию.
- [Завершение игры](#completing-the-game) научит вас **наиболее распространенным методам** разработки React.
- [Добавление путешествия во времени](#adding-time-travel) даст вам **более глубокое понимание** уникальных сильных сторон React.

### Что вы строите? {/*what-are-you-building*/}

В этом руководстве вы создадите интерактивную игру «крестики-нолики» с помощью React.

Вы можете увидеть, как это будет выглядеть, когда вы закончите, здесь:

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

Если код вам пока непонятен или вы не знакомы с синтаксисом кода, не волнуйтесь! Цель этого руководства — помочь вам понять React и его синтаксис.

Мы рекомендуем вам ознакомиться с игрой «крестики-нолики» выше, прежде чем продолжить работу с руководством. Одна из функций, которую вы заметите, заключается в том, что справа от игрового поля есть нумерованный список. Этот список содержит историю всех ходов, которые произошли в игре, и он обновляется по мере развития игры.

После того, как вы поиграли с готовой игрой «крестики-нолики», продолжайте прокрутку. В этом руководстве вы начнете с более простого шаблона. Нашим следующим шагом будет настройка, чтобы вы могли начать создавать игру.

## Настройка для руководства {/*setup-for-the-tutorial*/}

В живом редакторе кода ниже нажмите **Fork** в правом верхнем углу, чтобы открыть редактор в новой вкладке с помощью веб-сайта CodeSandbox. CodeSandbox позволяет вам писать код в вашем браузере и просматривать, как ваши пользователи будут видеть созданное вами приложение. В новой вкладке должны отображаться пустой квадрат и стартовый код для этого руководства.

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

Вы также можете следовать этому руководству, используя свою локальную среду разработки. Для этого вам нужно:

1. Установить [Node.js](https://nodejs.org/en/)
1. На вкладке CodeSandbox, которую вы открыли ранее, нажмите кнопку в верхнем левом углу, чтобы открыть меню, а затем выберите **Download Sandbox** в этом меню, чтобы загрузить архив файлов локально.
1. Разархивируйте архив, затем откройте терминал и перейдите в каталог, который вы разархивировали, с помощью команды `cd`
1. Установите зависимости с помощью команды `npm install`
1. Запустите `npm start`, чтобы запустить локальный сервер, и следуйте подсказкам, чтобы просмотреть код, работающий в браузере.

Если вы застряли, не позволяйте этому остановить вас! Следуйте инструкциям онлайн и попробуйте локальную настройку позже.

</Note>

## Обзор {/*overview*/}

Теперь, когда вы настроены, давайте рассмотрим React!

### Проверка стартового кода {/*inspecting-the-starter-code*/}

В CodeSandbox вы увидите три основных раздела:

![CodeSandbox со стартовым кодом](../images/tutorial/react-starter-code-codesandbox.png)

1. Раздел _Files_ со списком файлов, таких как `App.js`, `index.js`, `styles.css` и папка под названием `public`
1. _Редактор кода_, где вы увидите исходный код выбранного вами файла
1. Раздел _browser_, где вы увидите, как будет отображаться написанный вами код

Файл `App.js` должен быть выбран в разделе _Files_. Содержимое этого файла в _редакторе кода_ должно быть:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

В разделе _browser_ должен отображаться квадрат с буквой X внутри, как здесь:

![x-filled square](../images/tutorial/x-filled-square.png)

Теперь давайте посмотрим на файлы в стартовом коде.

#### `App.js` {/*appjs*/}

Код в `App.js` создает _компонент_. В React компонент — это фрагмент многократно используемого кода, представляющий часть пользовательского интерфейса. Компоненты используются для рендеринга, управления и обновления элементов пользовательского интерфейса в вашем приложении. Давайте посмотрим на компонент строка за строкой, чтобы увидеть, что происходит:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

Первая строка определяет функцию с именем `Square`. Ключевое слово JavaScript `export` делает эту функцию доступной за пределами этого файла. Ключевое слово `default` сообщает другим файлам, использующим ваш код, что это основная функция в вашем файле.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

Вторая строка возвращает кнопку. Ключевое слово JavaScript `return` означает, что все, что следует дальше, возвращается как значение вызывающему функцию. `<button>` — это *JSX-элемент*. JSX-элемент — это комбинация кода JavaScript и HTML-тегов, которая описывает, что вы хотите отобразить. `className="square"` — это свойство кнопки или *пропс*, которое сообщает CSS, как стилизовать кнопку. `X` — это текст, отображаемый внутри кнопки, а `</button>` закрывает JSX-элемент, чтобы указать, что любое последующее содержимое не должно размещаться внутри кнопки.

#### `styles.css` {/*stylescss*/}

Щелкните файл с меткой `styles.css` в разделе _Files_ CodeSandbox. Этот файл определяет стили для вашего приложения React. Первые два _CSS-селектора_ (`*` и `body`) определяют стиль больших частей вашего приложения, а селектор `.square` определяет стиль любого компонента, для которого свойство `className` установлено в значение `square`. В вашем коде это будет соответствовать кнопке из вашего компонента Square в файле `App.js`.

#### `index.js` {/*indexjs*/}

Щелкните файл с меткой `index.js` в разделе _Files_ CodeSandbox. Вы не будете редактировать этот файл во время работы с руководством, но он является мостом между компонентом, который вы создали в файле `App.js`, и веб-браузером.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

Строки 1-5 объединяют все необходимые части:

* React
* Библиотека React для взаимодействия с веб-браузерами (React DOM)
* стили для ваших компонентов
* компонент, который вы создали в `App.js`.

Остальная часть файла объединяет все части и внедряет конечный продукт в `index.html` в папке `public`.

### Создание доски {/*building-the-board*/}

Давайте вернемся к `App.js`. Здесь вы проведете остаток руководства.

В настоящее время доска представляет собой только один квадрат, но вам нужно девять! Если вы просто попытаетесь скопировать и вставить свой квадрат, чтобы сделать два квадрата, как это:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Вы получите эту ошибку:

<ConsoleBlock level="error">

/src/App.js: Смежные JSX-элементы должны быть обернуты в тег-контейнер. Вы хотели JSX-фрагмент `<>...</>`?

</ConsoleBlock>

Компоненты React должны возвращать один JSX-элемент, а не несколько смежных JSX-элементов, таких как две кнопки. Чтобы исправить это, вы можете использовать *фрагменты* (`<>` и `</>`) для обертывания нескольких смежных JSX-элементов, как это:

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

![two x-filled squares](../images/tutorial/two-x-filled-squares.png)

Отлично! Теперь вам просто нужно несколько раз скопировать и вставить, чтобы добавить девять квадратов, и...

![nine x-filled squares in a line](../images/tutorial/nine-x-filled-squares.png)

О нет! Квадраты находятся в одной строке, а не в сетке, как вам нужно для нашей доски. Чтобы исправить это, вам нужно сгруппировать квадраты в строки с помощью `div` и добавить несколько CSS-классов. Пока вы этим занимаетесь, вы присвоите каждому квадрату номер, чтобы убедиться, что вы знаете, где отображается каждый квадрат.

В файле `App.js` обновите компонент `Square`, чтобы он выглядел следующим образом:

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

CSS, определенный в `styles.css`, стилизует div с `className` `board-row`. Теперь, когда вы сгруппировали свои компоненты в строки со стилизованными `div`, у вас есть игровое поле для крестиков-ноликов:

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

Но теперь у вас есть проблема. Ваш компонент с именем `Square` на самом деле больше не является квадратом. Давайте исправим это, изменив имя на `Board`:

```js {1}
export default function Board() {
  //...
}
```

На данный момент ваш код должен выглядеть примерно так:

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

Псссс... Это много печатать! Можно копировать и вставлять код с этой страницы. Однако, если вы готовы к небольшому испытанию, мы рекомендуем копировать только код, который вы сами напечатали хотя бы один раз.

</Note>

### Передача данных через пропсы {/*passing-data-through-props*/}

Далее вы захотите изменить значение квадрата с пустого на «X», когда пользователь щелкнет по квадрату. С учетом того, как вы построили доску до сих пор, вам нужно будет девять раз скопировать и вставить код, который обновляет квадрат (по одному разу для каждого квадрата, который у вас есть)! Вместо копирования и вставки архитектура компонентов React позволяет вам создать многоразовый компонент, чтобы избежать грязного, дублированного кода.

Сначала вы скопируете строку, определяющую ваш первый квадрат (`<button className="square">1</button>`) из вашего компонента `Board` в новый компонент `Square`:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Затем вы обновите компонент Board, чтобы отобразить этот компонент `Square`, используя синтаксис JSX:

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

Обратите внимание, что в отличие от браузерных `div`, ваши собственные компоненты `Board` и `Square` должны начинаться с заглавной буквы.

Давайте посмотрим:

![one-filled board](../images/tutorial/board-filled-with-ones.png)

О нет! Вы потеряли пронумерованные квадраты, которые были раньше. Теперь в каждом квадрате написано «1». Чтобы исправить это, вы будете использовать *пропсы*, чтобы передать значение, которое должен иметь каждый квадрат, от родительского компонента (`Board`) к его дочернему компоненту (`Square`).

Обновите компонент `Square`, чтобы прочитать пропс `value`, который вы передадите из `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` указывает, что в компонент Square можно передать пропс с именем `value`.

Теперь вы хотите отобразить это `value` вместо `1` внутри каждого квадрата. Попробуйте сделать это так:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Упс, это не то, что вы хотели:

![value-filled board](../images/tutorial/board-filled-with-value.png)

Вы хотели отобразить переменную JavaScript с именем `value` из вашего компонента, а не слово «value». Чтобы «перейти в JavaScript» из JSX, вам нужны фигурные скобки. Добавьте фигурные скобки вокруг `value` в JSX следующим образом:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Пока что вы должны увидеть пустую доску:

![empty board](../images/tutorial/empty-board.png)

Это связано с тем, что компонент `Board` еще не передал пропс `value` каждому компоненту `Square`, который он отображает. Чтобы исправить это, вы добавите пропс `value` к каждому компоненту `Square`, отображаемому компонентом `Board`:

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

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

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

Давайте заполним компонент `Square` буквой `X`, когда вы щелкните по нему. Объявите функцию с именем `handleClick` внутри `Square`. Затем добавьте `onClick` к пропсам элемента button JSX, возвращаемого из `Square`:

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

Если вы щелкнете по квадрату сейчас, вы должны увидеть в журнале сообщение «clicked!» на вкладке _Console_ в нижней части раздела _Browser_ в CodeSandbox. Щелчок по квадрату более одного раза снова зарегистрирует «clicked!». Повторяющиеся журналы консоли с одним и тем же сообщением не будут создавать больше строк в консоли. Вместо этого вы увидите увеличивающийся счетчик рядом с вашим первым журналом «clicked!».

<Note>

Если вы работаете с этим руководством, используя свою локальную среду разработки, вам нужно открыть консоль вашего браузера. Например, если вы используете браузер Chrome, вы можете просмотреть консоль с помощью сочетания клавиш **Shift + Ctrl + J** (в Windows/Linux) или **Option + ⌘ + J** (в macOS).

</Note>

В качестве следующего шага вы хотите, чтобы компонент Square «запомнил», что по нему щелкнули, и заполнил его отметкой «X». Чтобы «запомнить» вещи, компоненты используют *состояние*.

React предоставляет специальную функцию под названием `useState`, которую вы можете вызвать из своего компонента, чтобы он «запомнил» вещи. Давайте сохраним текущее значение `Square` в состоянии и изменим его, когда по `Square` щелкнут.

Импортируйте `useState` в верхней части файла. Удалите пропс `value` из компонента `Square`. Вместо этого добавьте новую строку в начало `Square`, которая вызывает `useState`. Пусть он вернет переменную состояния с именем `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` хранит значение, а `setValue` — это функция, которую можно использовать для изменения значения. `null`, переданный в `useState`, используется в качестве начального значения для этой переменной состояния, поэтому `value` здесь изначально равно `null`.

Поскольку компонент `Square` больше не принимает пропсы, вы удалите пропс `value` из всех девяти компонентов Square, созданных компонентом Board:

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

Теперь вы измените `Square`, чтобы отображать «X», когда по нему щелкнут. Замените обработчик событий `console.log("clicked!");` на `setValue('X');`. Теперь ваш компонент `Square` выглядит так:

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

Вызывая эту функцию `set` из обработчика `onClick`, вы говорите React перерисовывать этот `Square` всякий раз, когда по его `<button>` щелкают. После обновления `value` `Square` будет равно «X», поэтому вы увидите «X» на игровом поле. Щелкните по любому квадрату, и должно появиться «X»:

![adding xes to board](../images/tutorial/tictac-adding-x-s.gif)

Каждый Square имеет свое собственное состояние: `value`, хранящееся в каждом Square, полностью независимо от других. Когда вы вызываете функцию `set` в компоненте, React автоматически обновляет дочерние компоненты внутри тоже.

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

### React Developer Tools {/*react-developer-tools*/}

React DevTools позволяет вам проверять пропсы и состояние ваших компонентов React. Вы можете найти вкладку React DevTools в нижней части раздела _browser_ в CodeSandbox:

![React DevTools in CodeSandbox](../images/tutorial/codesandbox-devtools.png)

Чтобы проверить конкретный компонент на экране, используйте кнопку в верхнем левом углу React DevTools:

![Selecting components on the page with React DevTools](../images/tutorial/devtools-select.gif)

<Note>

Для локальной разработки React DevTools доступен как [расширение браузера Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) и [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil). Установите его, и вкладка *Components* появится в инструментах разработчика вашего браузера для сайтов, использующих React.

</Note>

## Завершение игры {/*completing-the-game*/}

К этому моменту у вас есть все основные строительные блоки для вашей игры «крестики-нолики». Чтобы иметь полную игру, вам теперь нужно чередовать размещение «X» и «O» на доске, и вам нужен способ определить победителя.

### Поднятие состояния вверх {/*lifting-state-up*/}

В настоящее время каждый компонент `Square` поддерживает часть состояния игры. Чтобы проверить победителя в игре «крестики-нолики», `Board` должен каким-то образом знать состояние каждого из 9 компонентов `Square`.

Как бы вы к этому подошли? Сначала вы можете предположить, что `Board` должен «спросить» каждый `Square` о состоянии этого `Square`. Хотя этот подход технически возможен в React, мы не рекомендуем его, потому что код становится сложным для понимания, подверженным ошибкам и сложным для рефакторинга. Вместо этого лучший подход — хранить состояние игры в родительском компоненте `Board` вместо каждого `Square`. Компонент `Board` может сообщить каждому `Square`, что отображать, передав пропс, как вы это сделали, когда передали число каждому Square.

**Чтобы собрать данные от