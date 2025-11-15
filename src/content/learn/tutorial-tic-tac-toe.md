---
title: 'Создаём игру: Крестики-нолики'
---

<Intro>

Вы построите небольшую игру "крестики-нолики" в течение этого урока. Этот туториал не предполагает наличие каких-либо знаний о React. Техники, которые вы узнаете в этом руководстве, являются базовыми для построения любого приложения React, и полное понимание их даст вам глубокое понимание React.

</Intro>

<Note>

Этот урок предназначен для людей, которые предпочитают **учить делая** и хотят быстро попробовать что-то конкретное. Если вы предпочитаете изучать каждый концепт пошагово, начните с [Описания UI.](/learn/describing-the-ui)

</Note>

Этот урок разделен на несколько разделов:

- [Подготовка к уроку](#setup-for-the-tutorial) даст вам **начальный код** для урока.
- [Обзор](#overview) даст вам **основы** React: компоненты, props и state.
- [Завершение игры](#completing-the-game) научит вас **наиболее респростарнённым техникам** в разработке на React.
- [Добавление истории](#adding-time-travel) даст вам **глубокое понимание** уникальных сильных сторон React.

### Что вы напишете? {/*what-are-you-building*/}

В этом уроке вы создадите интерактивную игру "крестики-нолики" с помощью React.

Вы можете увидеть, как это будет выглядеть, когда вы закончите:

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

Если код не имеет смысла для вас пока что, или вы не знакомы с этим синтаксисом, не беспойойтесь! Цель этого урока - помочь вам понять React и его синтаксис.

Мы рекомендуем вам ознакомиться с игрой "крестики-нолики", которую вы видите выше, прежде чем продолжить урок. Одной из особенностей, которые вы заметите, является то, что справа от доски игры есть нумерованный список. Этот список дает вам историю всех ходов, которые были сделаны в игре, и он обновляется при прогрессе игры.

После того как вы поиграете с завершенной игрой "крестики-нолики", продолжайте прокручивать страницу. Вы начнете с более простого шаблона в этом уроке. Наш следующий шаг - настройка, чтобы вы могли начать создавать игру.

## Подготовка к уроку {/*setup-for-the-tutorial*/}

В лайв-редакторе ниже нажмите **Fork** в правом верхнем углу, чтобы открыть редактор в новой вкладке с помощью сайта CodeSandbox. CodeSandbox позволяет вам писать код в браузере и предварительно увидеть, как ваши пользователи увидят приложение, которое вы создали. Новая вкладка должна отображать пустую квадратную область и начальный код для этого урока.

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
2. В новой вкладке, открытие которой вы выполнили ранее, нажмите кнопку в верхнем левом углу, чтобы открыть меню, а затем выберите **Download Sandbox** в этом меню, чтобы скачать архив файлов локально
3. Распакуйте архив, затем откройте терминал и выполните команду `cd`, чтобы перейти в директорию, в которую вы распаковали архив
4. Установите зависимости с помощью `npm install`
5. Запустите `npm start`, чтобы запустить локальный сервер и следуйте инструкциям, чтобы просмотреть код, запущенный в браузере

Если вы застряли, не позволяйте этому остановить вас! Вместо этого следуйте инструкциям онлайн и повторите попытку локальной настройки позже.

</Note>

## Обзор {/*overview*/}

Теперь, когда вы настроились, давайте сделаем обзор React-приложения!

### Проверка стартового кода {/*inspecting-the-starter-code*/}

В CodeSandbox вы увидите три основные секции:

![CodeSandbox with starter code](../images/tutorial/react-starter-code-codesandbox.png)

1. Секция _Files_ со списком файлов, включая `App.js`, `index.js`, `styles.css` и папку `public`
2. Секция _code editor_, где вы увидите код выбранного файла
3. Секция _browser_, где вы увидите как код будет отображаться

Файл `App.js` должен быть выбран в секции _Files_. В секции _code editor_ содержимое этого файла должно быть следующим:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

Секция _browser_ должна отображать квадрат с буквой X в нем, как на рисунке ниже:

![x-filled square](../images/tutorial/x-filled-square.png)

Теперь давайте посмотрим на файлы в стартовом коде.

#### `App.js` {/*appjs*/}

Код в `App.js` создаёт _компонент_. В React-компонент - это часть интерфейса пользователя, которую можно повторно использовать. Компоненты используются для отображения, управления и обновления элементов интерфейса в вашем приложении. Давайте посмотрим на компонент построчно, чтобы понять, что в нёмпроисходит:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

Первая строка определяет функцию под названием `Square`. JavaScript ключевое слово `export` делает эту функцию доступной вне этого файла. Ключевое слово `default` сообщает другим файлам, использующим ваш код, что это основная функция в вашем файле.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

Вторая строка возвращает кнопку. В JavaScript ключевое слово `return` означает, что что-то, что следует за ним, возвращается как значение вызывающей функции. `<button>` является *JSX элементом*. JSX элемент - это комбинация JavaScript-кода и HTML-тегов, которая описывает то, что вы хотите отобразить. `className="square"` является свойством кнопки или *prop*, который сообщает CSS, как стилизовать кнопку. `X` является текстом, отображаемым внутри кнопки, а `</button>` закрывает JSX элемент, чтобы указать, что любое последующее содержимое не должно быть размещено внутри кнопки.

#### `styles.css` {/*stylescss*/}

Нажмите на файл, отмеченный `styles.css`, в разделе _Files_ в CodeSandbox. Этот файл определяет стили для вашего React-приложения. Первые два _CSS селектора_ (`*` и `body`) определяют стиль основной части вашего приложения, в то время как `.square` селектор определяет стиль любого компонента, где свойство `className` установлено в `square`. В вашем коде это будет соответствовать кнопке из компонента Square в файле `App.js`.

#### `index.js` {/*indexjs*/}

Нажмите на файл, отмеченный `index.js`, в разделе _Files_ в CodeSandbox. Вы не будете редактировать этот файл в течение руководства, но он является мостом между компонентом, который вы создали в файле `App.js`, и веб-браузером.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

Строки 1-5 объединяют все необходимые компоненты: 

* React
* Библиотека React для общения с веб-браузером (React DOM)
* Стили для компонентов
* Компонент, который вы создали в файле `App.js`.

Оставшаяся часть файла объединяет все компоненты и помещает написанное приложение в `index.html` в папке `public`.

### Создаём доску {/*building-the-board*/}

Давайте вернёмся к `App.js`. Это то место, где вы будете проводить большую часть руководства.

В настоящее время доска состоит только из одного квадрата, но вам нужно девять! Если вы просто попытаетесь скопировать и вставить квадрат, чтобы сделать два квадрата, как это:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Вы получите эту ошибку:

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

React-компоненты должны возвращать одиночный JSX элемент и не могут возвращать несколько соседних JSX элементов, как две кнопки. Чтобы это исправить, вы можете использовать *Fragments* (`<>` и `</>`) для обертывания нескольких соседних JSX элементов, как это:

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

Отлично! Теперь вам нужно несколько раз скопировать и вставить, чтобы добавить девять квадратов и...

![nine x-filled squares in a line](../images/tutorial/nine-x-filled-squares.png)

О, нет! Все квадраты расположены в одну линию, а не в виде сетки, как это нужно для нашей доски. Чтобы исправить это, вам нужно сгруппировать квадраты в строки с помощью `div` и добавить несколько CSS классов. Пока вы занимаетесь этим, вы присваиваете каждому квадрату номер, чтобы быть уверенным, что знаете, где находится каждый квадрат.

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

CSS стили определяются в `styles.css` и стилизуют `div`ы с `className` `board-row`. Теперь, когда вы разгруппировали компоненты в строки с помощью стилизованного `div`, у вас есть ваша доска для игры в крестики-нолики:

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

Но теперь у вас есть проблема. Ваш компонент `Square`, действительно, больше не является квадратом. Давайте исправим это, изменив его имя на `Board`:

```js {1}
export default function Board() {
  //...
}
```

В этом месте ваш код должен выглядеть примерно так:

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

Тсс... Тут слишком много кода, чтобы печатать самому! Можно скопировать и вставить код с этой страницы. Однако, если вы хотите небольшой вызов, мы рекомендуем копировать код только после того, как вы ввели его вручную хотя бы один раз.

</Note>

### Передача данных через props {/*passing-data-through-props*/}

Затем вы захотите изменить значение квадрата с пустого на “X”, когда пользователь нажимает на квадрат. С помощью компонентов React вы можете создать компонент, который можно переиспользовать, чтобы избежать дублирования кода.

Сначала вы копируете строку определения первого квадрата (`<button className="square">1</button>`) из компонента `Board` в новый компонент `Square`:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Затем вы обновите компонент `Board`, чтобы отобразить компонент `Square` с помощью синтаксиса JSX:

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

Обратите внимание, что в отличие от `div` в браузере, ваши собственные компоненты `Board` и `Square` должны начинаться с заглавной буквы.

Давайте посмотрим:

![one-filled board](../images/tutorial/board-filled-with-ones.png)

О нет! Вы потеряли номерные квадраты, которые у вас были раньше. Теперь каждый квадрат выводит "1". Чтобы исправить это, вы будете использовать *props* для передачи значения, которое должен иметь каждый квадрат от родительского компонента (`Board`) к его дочернему (`Square`).

Обновите компонент `Square`, чтобы прочитать `value` prop, который вы передадите из `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` указывает, что компонент `Square` может принимать prop с именем `value`.

Теперь вы хотите отобразить `value` вместо `1` внутри каждого квадрата. Попробуйте сделать это так:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Упс, это не то, что вы хотели:

![value-filled board](../images/tutorial/board-filled-with-value.png)

Вы хотели отобразить JavaScript-переменную `value`, которая содержится в компоненте, а не слово "value". Чтобы "выйти из JSX" в JavaScript, вам нужно использовать фигурные скобки. Добавьте фигурные скобки вокруг `value` в JSX:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Теперь вы должны увидеть пустую доску:

![empty board](../images/tutorial/empty-board.png)

Это потому, что компонент `Board` не передает prop `value` каждому компоненту `Square`, который он отображает. Чтобы исправить это, вы добавите prop `value` каждому компоненту `Square`, отображаемому компонентом `Board`:

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

Теперь вы снова должны увидеть доску с числами от 1 до 9:

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

### Созадание интерактивного компонента {/*making-an-interactive-component*/}

Давайте заполним компонент `Square` буквой `X`, когда вы нажимаете на него. Объявите функцию с именем `handleClick` внутри компонента `Square`. Затем добавьте `onClick` в props кнопки JSX элемента, возвращаемого компонентом `Square`:

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
<Note>

Если вы нажмёте на квадрат теперь, вы увидите лог `"clicked!"` в _Console_ внизу _Браузера_ в CodeSandbox. Нажатие на квадрат больше одного раза снова выведет `"clicked!"` в консоль. Повторные сообщения в консоли не создадут новые строки. Вместо этого вы увидите увеличивающийся счетчик рядом с первым сообщением `"clicked!"`.

</Note>

В качестве следующего шага сделаем так, чтобы компонент `Square` "запоминал", что он был нажат, и заполнял его буквой `X`. Для этого компоненты используют *state*.

React предоставляет специальную функцию `useState`, которую вы можете вызвать из компонента, чтобы заставить его "помнить" состояние. Давайте сохраним текущее значение `Square` в state, и измените его, когда `Square` будет нажат.

Импортируйте `useState` в начале файла. Удалите `value` prop из компонента `Square`. Затем добавьте новую строку в начале компонента `Square`, которая вызывает `useState`. Давайте сделаем так, чтобы он возвращал переменную состояния под именем `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` хранит значение и `setValue` функция, которая используется для изменения значения. Переданное в `useState` `null` используется как начальное значение для этой переменной состояния, поэтому `value` здесь начинается с `null`.

Поскольку компонент `Square` больше не принимает prop `value`, вы удалиете `value` prop из всех девяти компонентов `Square`, созданных компонентом `Board`:

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

Теперь поменяйте `Square` чтобы отображать "X" при нажатии. Замените `console.log("clicked!");` event handler на `setValue('X');`. Теперь ваш компонент `Square` выглядит так:

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

Вызвав `set` функцию из `onClick` handler, вы говорите React'у перерендерить компонент `Square` каждый раз, когда его `<button>` будет нажат. После обновления `Square`'s `value` будет `'X'`, поэтому вы увидите "X" на игровом поле. Нажмите на любое квадрат, и "X" должен появиться:

![adding xes to board](../images/tutorial/tictac-adding-x-s.gif)

Каждый квадрат имеет свое состояние: значение, хранящееся в каждом квадрате, полностью независимо от других. Когда вы вызываете `set` функцию в компоненте, React автоматически обновляет дочерние компоненты внутри.

После того, как вы сделали вышеуказанные изменения, ваш код должен выглядеть так:

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

React DevTools позволяет проверить props и состояние ваших React-компонентов. Вы можете найти вкладку React DevTools внизу раздела _браузер_ в CodeSandbox:

![React DevTools in CodeSandbox](../images/tutorial/codesandbox-devtools.png)

Чтобы проверить определенный компонент на экране, используйте кнопку в верхнем левом углу React DevTools:

![Selecting components on the page with React DevTools](../images/tutorial/devtools-select.gif)

<Note>

Для локальной разработки React DevTools доступен как [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), и [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) браузерное расширение. Установите его, и вкладка *Components* появится в вашем браузерном инструменте разработчика для сайтов, использующих React.

</Note>

## Завершение игры {/*completing-the-game*/}

В этот момент у вас есть все основные компоненты для игры в крестики-нолики. Чтобы сделать игру завершенной, вам нужно альтернативно размещать "X" и "O" на доске, и вам нужно определить победителя.

### Поднятие состояния {/*lifting-state-up*/}

В настоящее время каждый компонент `Square` хранит часть состояния игры. Чтобы проверить победителя в игре в крестики-нолики, компонент `Board` должен как-то знать состояние каждого из 9 компонентов `Square`.

Как можно этого достичь? Для начала, вы можете подумать, что компонент `Board` должен "спросить" каждый компонент `Square` о состоянии `Square`. Хотя этот подход технически возможен в React, мы не рекомендуем его использовать, так как код становится трудно понимаемым, подверженным ошибкам и сложным для рефакторинга. Вместо этого лучше хранить состояние игры в родительском компоненте `Board` вместо хранения его в каждом компоненте `Square`. Компонент `Board` может сказать каждому компоненту `Square`, что отображать, передавая prop, как вы сделали, когда передавали число каждому компоненту `Square`.

**Чтобы собрать данные из нескольких дочерних компонентов или чтобы два дочерних компонента общались друг с другом, объявите общий state в их родительском компоненте. Родительский компонент может передать это состояние обратно к дочерним компонентам через props. Это поддерживает дочерние компоненты в синхронизации друг с другом и с их родительским компонентом.**

Поднятие состояния в родительский компонент является распространенным подходом при рефакторинге компонентов React.

Давайте воспользуемся возможностью попробовать это. Измените компонент `Board`, чтобы он объявил переменную состояния под названием `squares`, которая по умолчанию будет массивом из 9 элементов, соответствующих 9 квадратам:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` создаёт массив из девяти элементов, каждый из которых установлен в `null`. Вызов `useState()` вокруг него объявляет переменную состояния под названием `squares`, которая по умолчанию будет массивом из 9 элементов, соответствующих 9 квадратам. Когда вы заполните доску позже, массив `squares` будет выглядеть так:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Теперь ваш компонент `Board` должен передать prop `value` каждому компоненту `Square`, которое он рендерит:

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

Следующим шагом является редактирование компонента `Square`, чтобы он принимал prop `value` от компонента `Board`. Это потребует удаления собственного отслеживания состояния компонента `Square` и prop `onClick` кнопки:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

На данном этапе вы должны увидеть пустую доску крестики-нолики:

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

Каждый компонент `Square` теперь получает prop `value`, который будет либо `'X'`, либо `'O'`, либо `null` для пустых квадратов.

Следующим шагом является изменение того, что происходит, когда компонент `Square` нажимается. Компонент `Board` теперь поддерживает состояние, которое определяет, какие квадраты заполнены. Вам нужно будет создать способ, чтобы компонент `Square` обновлял состояние компонента `Board`. Поскольку состояние является приватным для компонента, который его определяет, вы не можете обновить состояние компонента `Board` напрямую из компонента `Square`.

Вместо этого вы передадите функцию из компонента `Board` в компонент `Square`, и сделаем так, чтобы компонент `Square` вызывал эту функцию, когда квадрат нажимается. Начнём с функции, которую компонент `Square` будет вызывать, когда он нажимается. Назовите эту функцию `onSquareClick`:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Дальше добавьте функцию `onSquareClick` в props компонента `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Теперь подключите prop `onSquareClick` к функции в компоненте `Board`, которую вы назовёте `handleClick`. Чтобы подключить `onSquareClick` к `handleClick`, передайте функцию в prop `onSquareClick` первого компонента `Square`:

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

В компоненте `Board` определите функцию `handleClick`, чтобы обновить массив `squares`, хранящий состояние доски:

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

Функция `handleClick` создает копию массива `squares` (`nextSquares`) с помощью метода `slice()` JavaScript. Затем функция `handleClick` обновляет массив `nextSquares`, добавляя `X` в первый (`[0]` индекс) квадрат.

Вызов функции `setSquares` позволяет React знать, что состояние компонента изменилось. Это вызовет перерендер компонентов, которые используют состояние `squares` (`Board`), а также его дочерних компонентов (компоненты `Square`, составляющие доску).

<Note>

JavaScript поддерживает [замыкания](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures), что означает, что внутренняя функция (например, `handleClick`) имеет доступ к переменным и функциям, определенным в внешней функции (например, `Board`). Функция `handleClick` может читать состояние `squares` и вызывать метод `setSquares`, потому что они обе определены внутри функции `Board`.

</Note>

Теперь вы можете добавить X'ы на доску... но только в верхний левый квадрат. Ваша функция `handleClick` зашита в код, которая обновляет индекс для верхнего левого квадрата (`0`). Давайте обновим `handleClick`, чтобы он мог обновить любой квадрат. Добавьте аргумент `i` в функцию `handleClick`, который принимает индекс квадрата для обновления:

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

Дальше вы должны передать `i` в `handleClick`. Вы можете попытаться установить `onSquareClick` prop квадрата `handleClick(0)` непосредственно в JSX, но это не будет работать:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Здесь описано почему это не работает. Вызов `handleClick(0)` будет частью рендеринга компонента `Board`. Поскольку `handleClick(0)` изменяет состояние компонента `Board` вызывая `setSquares`, ваш компонент `Board` будет снова рендериться. Но это вызывает `handleClick(0)` снова, что приводит к бесконечному циклу:

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

Почему эта ошибка не произошла ранее?

Когда вы передавали `onSquareClick={handleClick}`, вы передавали функцию `handleClick` вниз как prop. Вы не вызывали её! Но теперь вы вызываете эту функцию сразу--установите скобки в `handleClick(0)`--и это вызывает её слишком рано. Вы не хотите вызывать `handleClick` до нажатия пользователя!

Вы можете исправить это, создав функцию, например `handleFirstSquareClick`, которая вызывает `handleClick(0)`, функцию `handleSecondSquareClick`, которая вызывает `handleClick(1)`, и так далее. Вы передадите (а не вызовете) эти функции вниз как props, например `onSquareClick={handleFirstSquareClick}`. Это решит бесконечный цикл.

Тем не менее, определение девяти разных функций и присвоение каждой из них имени слишком подробно. Вместо этого давайте сделаем это:

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

Обратите внимание на синтаксис `() =>`. Здесь `() => handleClick(0)` является *стрелочной функцией*, которая является более коротким способом определения функций. Когда квадрат нажимается, код после `=>` "стрелки" будет выполняться, вызывая `handleClick(0)`.

Теперь вам нужно обновить остальные восемь квадратов, чтобы вызвать `handleClick` из функций-стрелок, которые вы передаете. Убедитесь, что аргумент для каждого вызова `handleClick` соответствует индексу правильного квадрата:

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

Теперь вы можете снова добавить X'ы на доску, нажимая на них:

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

Но теперь всё управление состоянием осуществляется компонентом `Board`!

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

Теперь ваше состояние содержит компонент `Board`, родительский компонет `Board` передаёт пропсы в дочерние компоненты `Square` так, чтобы они могли быть отображены правильно. Когда пользователь нажимает на `Square`, дочерний компонент `Square` теперь просит родительский компонент `Board` обновить состояние доски. Когда состояние `Board` изменяется, оба компонента `Board` и каждый дочерний компонент `Square` автоматически перерисовываются. Сохранение состояния всех квадратов в компоненте `Board` позволит ему определить победителя в будущем.

Напомним, что происходит, когда пользователь нажимает на верхний левый квадрат на вашей доске, чтобы добавить `X`:

1. Нажатие на верхний левый квадрат запускает функцию, которая получила компонент `button` как пропс `onClick` от компонента `Square`. Компонент `Square` получил эту функцию как пропс `onSquareClick` от компонента `Board`. Компонент `Board` определил эту функцию непосредственно в JSX. Он вызывает `handleClick` с аргументом `0`.
1. `handleClick` использует аргумент (`0`), чтобы обновить первый элемент массива `squares` от `null` до `X`.
1. Состояние `Board` компонента было обновлено, поэтому компонент `Board` и все его дочерние компоненты перерисовываются. Это вызывает изменение пропса `value` компонента `Square` с индексом `0` от `null` до `X`.

Пользователь видит, что верхний левый квадрат изменился от пустого до `X` после нажатия.

<Note>

 Событие `onClick` DOM элемента `<button>` имеет особое значение для React, потому что это встроенный компонент. Для пользовательских компонентов, таких как `Square`, названия остаются за вами. Вы могли бы дать любое имя  `onSquareClick` пропсу компонента `Square` или `handleClick` функции компонента `Board`, и код работал бы так же. В React принято использовать `onSomething` для пропсов, представляющих события, и `handleSomething` для функций, которые обрабатывают эти события.

</Note>

### Почему неизменяемость важна {/*why-immutability-is-important*/}

Обратите внимание как в `handleClick`, вы вызываете `.slice()` для создания копии массива `squares` вместо изменения существующего массива. Чтобы объяснить почему, нам нужно обсудить иммутабельность и почему она важна для изучения.

В общем случае существует две подхода к изменению данных. Первый подход - изменение данных напрямую (_мутировать_) изменяя их значения напрямую. Второй подход - замена данных новой копией, которая имеет необходимые изменения. Вот как это выглядело бы, если бы вы мутировали массив `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Теперь `squares` является ["X", null, null, null, null, null, null, null, null];
```

А так, если бы вы заменили данные новой копией, которая имеет необходимые изменения:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Теперь `squares` не изменился, но `nextSquares` имеет первый элемент 'X' вместо `null`
```

Результат будет таким же, но не мутируя (изменяя базовые данные) напрямую, вы получаете несколько преимуществ.

Иммутабельность делает сложные функции намного проще для реализации. Позже в этом руководстве вы реализуете функциональность "time travel" (_путишествие во времени_), которая позволяет вам просмотреть историю игры и "вернуться" к предыдущим ходам. Эта функциональность не специфична для игр--способность отменить и повторить определенные действия является общим требованием для приложений. Избегание непосредственного мутирования данных позволяет вам сохранить предыдущие версии данных и использовать их позже.

Также есть еще одно преимущество иммутабельности. По умолчанию все дочерние компоненты автоматически перерисовываются, когда состояние родительского компонента изменяется. Это включает даже дочерние компоненты, которые не были затронуты изменением. Хотя перерисовка сама по себе не заметна пользователю (вы не должны активно пытаться избегать этого!), вы можете пропустить перерисовку части дерева, которая очевидно не была затронута изменением, для целей оптимизации производительности. Иммутабельность упрощает сравнение для компонентов, изменились ли их данные или нет. Вы можете узнать больше о том, как React выбирает, когда перерисовывать компонент, в [справочнике API `memo`](/reference/react/memo).

### Реализация ходов {/*taking-turns*/}

Теперь вам нужно исправить серьезную ошибку в этой игре: пока что "O" не могут быть отмечены на доске.

Вы зададите первый ход "X" по умолчанию. Давайте отслеживаем это, добавив еще одно состояние в компонент Board:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Каждый раз, когда игрок делает ход, `xIsNext` (булево значение) будет перевернуто, чтобы определить, кто ходит следующим, и состояние игры будет сохранено. Вы обновите функцию `handleClick` компонента `Board`, чтобы перевернуть значение `xIsNext`:

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

Теперь, когда вы кликаете на разные ячейки, они будут чередовать между `X` и `O`, как и должно быть!

Но подождите, есть проблема. Попробуйте кликнуть на одну и ту же ячейку несколько раз:

![O overwriting an X](../images/tutorial/o-replaces-x.gif)

`X` перезаписывается `O`! Хотя это добавит очень интересный поворот в игру, мы сейчас остановимся на оригинальных правилах игры.

Когда вы отмечаете ячейку `X` или `O`, вы не проверяете, не имеет ли ячейки уже значения `X` или `O`. Вы можете это исправить, *заранее*. Вы проверяете, не имеет ли ячейка уже значения `X` или `O`. Если ячейка уже заполнена, вы вернетесь к функции `handleClick` раньше--до попытки обновления состояния доски.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Теперь вы можете добавлять только `X`'ы или `O`'и в пустые ячейки! Вот как должен выглядеть ваш код на этом этапе:

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

Теперь, когда игроки могут играть по очереди, вы покажете им, что игра завершена и больше ходов не осталось. Для этого вы добавим вспомогательную функцию под названием `calculateWinner`, которая принимает массив из 9 ячеек, проверяет наличие победителя и возвращает `'X'`, `'O'`, или `null`, в зависимости от ситуации. Не волнуйтесь слишком сильно о функции `calculateWinner`; она не специфична для React:

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

Это не важно, независимо от того, определяете ли вы `calculateWinner` до или после компонента `Board`. Давайте поместим его в конце, чтобы вам не приходилось прокручивать его каждый раз, когда вы редактируете свои компоненты.

</Note>

Вы будете вызывать `calculateWinner(squares)` в функции `handleClick` компонента `Board`, чтобы проверить, победил ли игрок. Вы можете выполнить эту проверку одновременно с проверкой, не нажал ли пользователь на ячейку, которая уже содержит `X` или `O`. Мы хотим вернуться раньше в обоих случаях:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

To let the players know when the game is over, you can display text such as "Winner: X" or "Winner: O". To do that you'll add a `status` section to the `Board` component. The status will display the winner if the game is over and if the game is ongoing you'll display which player's turn is next:

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

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So _you_ are the real winner here. Here is what the code should look like:

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

## Adding time travel {/*adding-time-travel*/}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a history of moves {/*storing-a-history-of-moves*/}

If you mutated the `squares` array, implementing time travel would be very difficult.

However, you used `slice()` to create a new copy of the `squares` array after every move, and treated it as immutable. This will allow you to store every past version of the `squares` array, and navigate between the turns that have already happened.

You'll store the past `squares` arrays in another array called `history`, which you'll store as a new state variable. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Lifting state up, again {/*lifting-state-up-again*/}

You will now write a new top-level component called `Game` to display a list of past moves. That's where you will place the `history` state that contains the entire game history.

Placing the `history` state into the `Game` component will let you remove the `squares` state from its child `Board` component. Just like you "lifted state up" from the `Square` component into the `Board` component, you will now lift it up from the `Board` into the top-level `Game` component. This gives the `Game` component full control over the `Board`'s data and lets it instruct the `Board` to render previous turns from the `history`.

First, add a `Game` component with `export default`. Have it render the `Board` component and some markup:

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

Note that you are removing the `export default` keywords before the `function Board() {` declaration and adding them before the `function Game() {` declaration. This tells your `index.js` file to use the `Game` component as the top-level component instead of your `Board` component. The additional `div`s returned by the `Game` component are making room for the game information you'll add to the board later.

Add some state to the `Game` component to track which player is next and the history of moves:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Notice how `[Array(9).fill(null)]` is an array with a single item, which itself is an array of 9 `null`s.

To render the squares for the current move, you'll want to read the last squares array from the `history`. You don't need `useState` for this--you already have enough information to calculate it during rendering:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Next, create a `handlePlay` function inside the `Game` component that will be called by the `Board` component to update the game. Pass `xIsNext`, `currentSquares` and `handlePlay` as props to the `Board` component:

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

Let's make the `Board` component fully controlled by the props it receives. Change the `Board` component to take three props: `xIsNext`, `squares`, and a new `onPlay` function that `Board` can call with the updated squares array when a player makes a move. Next, remove the first two lines of the `Board` function that call `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Now replace the `setSquares` and `setXIsNext` calls in `handleClick` in the `Board` component with a single call to your new `onPlay` function so the `Game` component can update the `Board` when the user clicks a square:

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

The `Board` component is fully controlled by the props passed to it by the `Game` component. You need to implement the `handlePlay` function in the `Game` component to get the game working again.

What should `handlePlay` do when called? Remember that Board used to call `setSquares` with an updated array; now it passes the updated `squares` array to `onPlay`.

The `handlePlay` function needs to update `Game`'s state to trigger a re-render, but you don't have a `setSquares` function that you can call any more--you're now using the `history` state variable to store this information. You'll want to update `history` by appending the updated `squares` array as a new history entry. You also want to toggle `xIsNext`, just as Board used to do:

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

Here, `[...history, nextSquares]` creates a new array that contains all the items in `history`, followed by `nextSquares`. (You can read the `...history` [*spread syntax*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) as "enumerate all the items in `history`".)

For example, if `history` is `[[null,null,null], ["X",null,null]]` and `nextSquares` is `["X",null,"O"]`, then the new `[...history, nextSquares]` array will be `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

At this point, you've moved the state to live in the `Game` component, and the UI should be fully working, just as it was before the refactor. Here is what the code should look like at this point:

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

### Showing the past moves {/*showing-the-past-moves*/}

Since you are recording the tic-tac-toe game's history, you can now display a list of past moves to the player.

React elements like `<button>` are regular JavaScript objects; you can pass them around in your application. To render multiple items in React, you can use an array of React elements.

You already have an array of `history` moves in state, so now you need to transform it to an array of React elements. In JavaScript, to transform one array into another, you can use the [array `map` method:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

You'll use `map` to transform your `history` of moves into React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves. Let's `map` over the `history` in the Game component:

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

You can see what your code should look like below. Note that you should see an error in the developer tools console that says: 

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>
  
You'll fix this error in the next section.

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

As you iterate through the `history` array inside the function you passed to `map`, the `squares` argument goes through each element of `history`, and the `move` argument goes through each array index: `0`, `1`, `2`, …. (In most cases, you'd need the actual array elements, but to render a list of moves you will only need indexes.)

For each move in the tic-tac-toe game's history, you create a list item `<li>` which contains a button `<button>`. The button has an `onClick` handler which calls a function called `jumpTo` (that you haven't implemented yet).

For now, you should see a list of the moves that occurred in the game and an error in the developer tools console. Let's discuss what the "key" error means.

### Picking a key {/*picking-a-key*/}

When you render a list, React stores some information about each rendered list item. When you update a list, React needs to determine what has changed. You could have added, removed, re-arranged, or updated the list's items.

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

In addition to the updated counts, a human reading this would probably say that you swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what you intended, so you need to specify a _key_ property for each list item to differentiate each list item from its siblings. If your data was from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved.

Keys tell React about the identity of each component, which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React. When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it is passed as props, React automatically uses `key` to decide which components to update. There's no way for a component to ask what `key` its parent specified.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will report an error and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the error but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.

### Implementing time travel {/*implementing-time-travel*/}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. Moves will never be re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the `Game` function, you can add the key as `<li key={move}>`, and if you reload the rendered game, React's "key" error should disappear:

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

Before you can implement `jumpTo`, you need the `Game` component to keep track of which step the user is currently viewing. To do this, define a new state variable called `currentMove`, defaulting to `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Next, update the `jumpTo` function inside `Game` to update that `currentMove`. You'll also set `xIsNext` to `true` if the number that you're changing `currentMove` to is even.

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

You will now make two changes to the `Game`'s `handlePlay` function which is called when you click on a square.

- If you "go back in time" and then make a new move from that point, you only want to keep the history up to that point. Instead of adding `nextSquares` after all items (`...` spread syntax) in `history`, you'll add it after all items in `history.slice(0, currentMove + 1)` so that you're only keeping that portion of the old history.
- Each time a move is made, you need to update `currentMove` to point to the latest history entry.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Finally, you will modify the `Game` component to render the currently selected move, instead of always rendering the final move:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

If you click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

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

### Final cleanup {/*final-cleanup*/}

If you look at the code very closely, you may notice that `xIsNext === true` when `currentMove` is even and `xIsNext === false` when `currentMove` is odd. In other words, if you know the value of `currentMove`, then you can always figure out what `xIsNext` should be.

There's no reason for you to store both of these in state. In fact, always try to avoid redundant state. Simplifying what you store in state reduces bugs and makes your code easier to understand. Change `Game` so that it doesn't store `xIsNext` as a separate state variable and instead figures it out based on the `currentMove`:

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

You no longer need the `xIsNext` state declaration or the calls to `setXIsNext`. Now, there's no chance for `xIsNext` to get out of sync with `currentMove`, even if you make a mistake while coding the components.

### Wrapping up {/*wrapping-up*/}

Congratulations! You've created a tic-tac-toe game that:

- Lets you play tic-tac-toe,
- Indicates when a player has won the game,
- Stores a game's history as a game progresses,
- Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp of how React works.

Check out the final result here:

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

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game, listed in order of increasing difficulty:

1. For the current move only, show "You are at move #..." instead of a button.
1. Rewrite `Board` to use two loops to make the squares instead of hardcoding them.
1. Add a toggle button that lets you sort the moves in either ascending or descending order.
1. When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
1. Display the location for each move in the format (row, col) in the move history list.

Throughout this tutorial, you've touched on React concepts including elements, components, props, and state. Now that you've seen how these concepts work when building a game, check out [Thinking in React](/learn/thinking-in-react) to see how the same React concepts work when building an app's UI.
