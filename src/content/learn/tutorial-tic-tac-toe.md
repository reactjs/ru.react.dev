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

Давайте дадим игрокам знать, когда игра завершена, вы можете отобразить текст, такой как "Winner: X" или "Winner: O". Для этого вы добавите раздел `status` в компонент `Board`. Статус будет отображать победителя, если игра завершена, и если игра продолжается, вы отобразите, чей ход следующий:

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

Поздравляем! Теперь у вас есть работающая игра в крестики-нолики. И вы только что узнали основы React. Поэтому _вы_ - настоящий победитель здесь. Вот как должен выглядеть код:

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

## Добавление путешествия в прошлое {/*adding-time-travel*/}

В качестве финального задания, давайте дадим возможность "вернуться назад во времени" к предыдущим ходам в игре.

### Хранение истории ходов {/*storing-a-history-of-moves*/}

Если вы мутировали массив `squares`, реализовать путешествие в прошлое было бы очень сложно.

Однако вы использовали `slice()`, чтобы создать новую копию массива `squares` после каждого хода, и рассматривали его как неизменяемый. Это позволит вам хранить каждую предыдущую версию массива `squares`, и перемещаться между ходами, которые уже произошли.

Вы будете хранить предыдущие массивы `squares` в другом массиве, названном `history`, который вы храните как новую переменную состояния. Массив `history` представляет все состояния доски, от первого до последнего хода, и имеет форму, как показано ниже:

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

### Поднятие состояния, снова {/*lifting-state-up-again*/}

Теперь вы напишете новый компонент верхнего уровня, названный `Game`, чтобы отобразить список предыдущих ходов. Это место, где вы будете хранить `history` состояние, содержащее всю историю игры.

Помещение `history` состояния в компонент `Game` позволит вам удалить `squares` состояние из его дочернего компонента `Board`. Как вы "подняли состояние" из компонента `Square` в компонент `Board`, так теперь вы поднимаете его из `Board` в компонент верхнего уровня `Game`. Это дает компоненту `Game` полный контроль над данными `Board` и позволяет ему инструктировать `Board` отображать предыдущие ходы из `history`.

Сначала добавьте компонент `Game` с `export default`. Дайте ему отображать компонент `Board` и некоторую разметку:

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

Обратите внимание, что вы удаляете ключевые слова `export default` перед объявлением `function Board() {` и добавляете их перед объявлением `function Game() {`. Это говорит вашему `index.js` файлу использовать компонент `Game` как компонент верхнего уровня вместо компонента `Board`. Дополнительные `div`s возвращаемые компонентом `Game` занимают место для информации о игре, которую вы добавите на доску позже.

Добавьте состояние в компонент `Game`, чтобы отслеживать, кто ходит следующим, и историю ходов:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Обратите внимание, что `[Array(9).fill(null)]` является массивом с одним элементом, который в свою очередь является массивом из 9 `null`ов.

Чтобы отобразить квадраты для текущего хода, вы можете прочитать последний массив квадратов из `history`. Вы не нуждаетесь в `useState` для этого--у вас достаточно информации для вычисления его в процессе рендеринга:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Далее создайте функцию `handlePlay` внутри компонента `Game`, которая будет вызываться компонентом `Board` для обновления игры. Передайте `xIsNext`, `currentSquares` и `handlePlay` как props компоненту `Board`:

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

Давайте сделаем компонент `Board` полностью контролируемым с помощью props, которые он получает. Измените компонент `Board`, чтобы он принимал три props: `xIsNext`, `squares`, и новую функцию `onPlay`, которую `Board` может вызвать с обновленным массивом квадратов, когда игрок делает ход. Затем удалите первые две строки функции `Board`, которые вызывают `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Теперь замените вызовы `setSquares` и `setXIsNext` в `handleClick` в компоненте `Board` на вызов новой функции `onPlay`, чтобы компонент `Game` мог обновить `Board` при нажатии на квадрат:

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

Компонент `Board` полностью контролируется props, передаваемыми ему компонентом `Game`. Вам нужно реализовать функцию `handlePlay` в компоненте `Game`, чтобы снова заставить игру работать.

Что должно делать `handlePlay` при вызове? Помните, что `Board` использовал раньше вызывать `setSquares` с обновленным массивом; теперь он передает обновленный `squares` массив в `onPlay`.

Функция `handlePlay` должна обновить состояние `Game`, чтобы вызвать перерендеринг, но у вас больше нет функции `setSquares`, которую вы можете вызвать--вы теперь используете переменную состояния `history` для хранения этой информации. Вы хотите обновить `history`, добавив обновленный `squares` массив как новую запись истории. Вы также хотите переключить `xIsNext`, как `Board` использовал раньше:

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

Здесь, `[...history, nextSquares]` создает новый массив, содержащий все элементы в `history`, за которыми следуют `nextSquares`. (Вы можете прочитать `...history` [*spread syntax*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) как "перечислите все элементы в `history`".)

Например, если `history` равно `[[null,null,null], ["X",null,null]]` и `nextSquares` равно `["X",null,"O"]`, то новый массив `[...history, nextSquares]` будет `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

В этом месте вы переместили состояние в компонент `Game`, и UI должен быть полностью работать, как и перед рефакторингом. Вот как должен выглядеть код на этом этапе:

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

React-элементы, такие как `<button>`, являются обычными объектами JavaScript; вы можете передавать их по всему приложению. Чтобы отобразить несколько элементов в React, вы можете использовать массив React элементов.

Вы уже имеете массив ходов `history` в состоянии, поэтому вам нужно преобразовать его в массив React-элементов. В JavaScript для преобразования одного массива в другой вы можете использовать метод [array `map` method:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Воспользуйтесь `map`, чтобы преобразовать `history` ходов в React-элементы, представляющие кнопки на экране, и отобразите список кнопок для "перехода" к прошлым ходам. Сделайте `map` по `history` в компоненте Game:

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

Вы можете увидеть, как должен выглядеть ваш код ниже. Обратите внимание, что вы должны увидеть ошибку в консоли разработчика, сообщающую: 

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

Пока вы выполняете итерацию по массиву `history` в функции, переданной в `map`, аргумент `squares` проходит через каждый элемент `history`, а аргумент `move` проходит через каждый индекс массива: `0`, `1`, `2`, …. (В большинстве случаев вам нужно будет иметь фактические элементы массива, но для отображения списка ходов вам нужно будет иметь только индексы.)

Для каждого хода в истории игры крестики-нолики вы создаете элемент списка `<li>`, содержащий кнопку `<button>`. Кнопка имеет обработчик `onClick`, который вызывает функцию под названием `jumpTo` (которую вы пока не реализовали).

В настоящее время вы должны увидеть список ходов, которые произошли в игре, и ошибку в консоли разработчика. Давайте обсудим, что означает сообщение об ошибке "key".

### Выбор ключа {/*picking-a-key*/}

Когда вы отображаете список, React хранит некоторую информацию о каждом отображаемом элементе списка. Когда вы обновляете список, React должен определить, что изменилось. Вы могли добавить, удалить, переставить или обновить элементы списка.

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

Кроме обновленных счетов, человек, читающий это, вероятно, скажет, что вы переставили расположение Алекси и Бена и вставили Клодию между Алекси и Беном. Однако React является компьютерной программой и не знает, что вы хотели сделать, поэтому вам нужно указать свойство _key_ для каждого элемента списка, чтобы различать каждый элемент списка от его братьев и сестер. Если ваши данные были из базы данных, идентификаторы базы данных Алекси, Бена и Клодии могли бы использоваться как ключи.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

Когда список перерендеривается, React берет ключ каждого элемента списка и ищет в предыдущем списке элементы с совпадающим ключом. Если текущий список имеет ключ, который не существовал до этого, React создает компонент. Если текущий список отсутствует ключ, который существовал в предыдущем списке, React стирает предыдущий компонент. Если два ключа совпадают, соответствующий компонент перемещается.

Ключи сообщают React о идентичности каждого компонента, что позволяет React поддерживать состояние между перерендерами. Если ключ компонента изменяется, компонент будет уничтожен и создан снова с новым состоянием.

`key` является специальным и зарезервированным свойством в React. Когда создается элемент, React извлекает свойство `key` и хранит ключ напрямую в возвращаемом элементе. Даже если `key` может выглядеть как передаваемый как prop, React автоматически использует `key` для определения, какие компоненты обновить. У компонента нет возможности запросить, какой `key` указан его родителем.

**Рекомендуется всегда присваивать корректные ключи при создании динамических списков.** Если у вас нет подходящего ключа, вы можете рассмотреть возможность перестройки ваших данных, чтобы это сделать.

Если не указан ключ, React будет сообщать об ошибке и использовать индекс массива как ключ по умолчанию. Использование индекса массива как ключа является проблематичным при попытке перестановки элементов списка или вставки/удаления элементов списка. Явное передача `key={i}` тихонько подавляет ошибку, но имеет те же проблемы, что и индексы массива, и не рекомендуется в большинстве случаев.

Ключи не должны быть глобально уникальными; они должны быть уникальными только между компонентами и их собратьями.

### Реализация путешествия во времени {/*implementing-time-travel*/}

В истории игры крестики-нолики каждый прошлый ход имеет уникальный ID, связанный с ним: это последовательный номер хода. Ходы никогда не будут переставляться, удаляться или вставляться в середину, поэтому безопасно использовать индекс хода как ключ.

В функции `Game` вы можете добавить ключ как `<li key={move}>`, и если вы перезагрузите отображаемую игру, сообщение об ошибке React "key" должно исчезнуть:

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

Перед тем, как вы сможете осуществить `jumpTo`, вы должны сделать `Game` компонентом, который будет отслеживать, какая игра сейчас просматривается пользователем. Для этого определите новую переменную состояния, называемую `currentMove`, по умолчанию `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Дальше, обновите функцию `jumpTo` внутри `Game`, чтобы обновить этот `currentMove`. Также установите `xIsNext` в `true`, если число, на которое вы меняете `currentMove`, является четным.

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

Теперь вы сделаете два изменения в функции `handlePlay` компонента `Game`, которая вызывается при нажатии на квадрат.

- Если вы "вернетесь в прошлое" и затем сделаете новый ход от этой точки, вы хотите сохранить только историю до этой точки. Вместо добавления `nextSquares` после всех элементов (`...` синтаксисspread оператора) в `history`, вы добавите его после всех элементов в `history.slice(0, currentMove + 1)`, чтобы сохранить только эту часть старой истории.
- Каждый раз, когда сделан ход, вам нужно обновить `currentMove`, чтобы указать на последнюю запись истории.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Наконец, вы измените компонент `Game`, чтобы отображать текущий выбранный ход, а не всегда отображать последний ход:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Если вы нажмете на любую запись в истории игры, доска крестики-нолики должна немедленно обновиться, чтобы показать, как выглядела доска после того, как эта запись была сделана.

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

### Финальная чистка {/*final-cleanup*/}

Если вы посмотрите на код очень внимательно, вы можете заметить, что `xIsNext === true` когда `currentMove` четное и `xIsNext === false` когда `currentMove` нечетное. В другими словами, если вы знаете значение `currentMove`, то вы всегда можете определить, что должно быть `xIsNext`.

Нет никакой причины хранить оба этих значения в состоянии. На самом деле, всегда пытайтесь избежать избыточного состояния. Упрощение того, что вы храните в состоянии, уменьшает ошибки и делает ваш код легче для понимания. Измените `Game`, чтобы он не хранил `xIsNext` как отдельную переменную состояния и вместо этого определял его на основе `currentMove`:

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

Вы больше не нуждаетесь в объявлении состояния `xIsNext` или вызовах `setXIsNext`. Теперь, для `xIsNext` нет возможности быть несогласованным с `currentMove`, даже если вы сделаете ошибку при написании компонентов.

### Завершение {/*wrapping-up*/}

Поздравляем! Вы создали игру крестики-нолики, которая:

- позволяет играть в крестики-нолики,
- указывает, когда игрок победил,
- хранит историю игры как игра идет,
- позволяет игрокам просматривать историю игры и видеть предыдущие версии доски игры.

Отличная работа! Надеемся, что теперь вы чувствуете, что достаточно понимаете, как работает React.

Проверьте конечный результат здесь:

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

Если у вас есть дополнительное время или вы хотите потренировать свои новые навыки React, вот несколько идей для улучшений, которые вы можете сделать для игры крестики-нолики, расположенных в порядке увеличения сложности:

1. Для текущего хода только показать "Вы находитесь на ходе #..." вместо кнопки.
2. Перепишите `Board` для использования двух циклов для создания квадратов вместо хардкодинга их.
3. Добавьте кнопку переключения, которая позволяет сортировать ходы в порядке возрастания или убывания.
4. Когда кто-то выигрывает, подсветите три квадрата, вызвавшие победу (и когда никто не выигрывает, отобразите сообщение о том, что результат является ничьей).
5. Покажите местоположение для каждого хода в формате (строка, столбец) в списке истории ходов.

В течение этого руководства вы касались концепций React, включая элементы, компоненты, props и состояние. Теперь, когда вы видите, как эти концепции работают при создании игры, проверьте [Thinking in React](/learn/thinking-in-react), чтобы увидеть, как те же концепции React работают при создании пользовательского интерфейса для приложений.
