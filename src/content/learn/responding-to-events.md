---
title: Обработка событий
---

<Intro>

React позволяет добавлять *обработчики событий* в JSX. Обработчики событий - это функции, которые вызываются в ответ на такие события, как клик на элемент, наведение курсора, фокус поля формы и так далее.

</Intro>

<YouWillLearn>

* Способы написания обработчика событий
* Как передавать логику обработки событий от родительского компонента
* Как распространяются события и как их останавливать

</YouWillLearn>

## Добавление обработчиков событий {/*adding-event-handlers*/}

Чтобы добавить обработчик событий, сначала определите функцию, а затем [передайте ее как проп](/learn/passing-props-to-a-component) в соответствующий JSX-тег. Например, ниже приведена кнопка, которая пока что ничего не делает:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

Чтобы при нажатии на кнопку появилось сообщение, нужно выполнить следующие три шага:

1. Объявить функцию `handleClick` *внутри* вашего компонента `Button`.
2. Реализовать логику внутри этой функции (для показа сообщения используйте `alert`).
3. Добавить `onClick={handleClick}` в JSX `<button>`.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Мы определили функцию `handleClick`, а затем [передали ее как проа](/learn/passing-props-to-a-component) в `<button>`. `handleClick` - это и есть **обработчик событий.** Обработчики событий:

* Обычно определены *внутри* компонентов.
* начнаются с о слова `handle`, после которого следует название события.

Принято называть обработчики событий `handle`, за которым следует имя события. Часто можно встретить `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` и так далее.

Также можно определить обработчик события внутри JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Или, более кратко, с помощью стрелочной функции:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Оба этих варианта эквивалентны. Инлайновые обработчики событий удобны для коротких функций.

<Pitfall>

Функции, которые передаются в обработчики событий, должны именно передаваться, а не вызываться. Например:

| passing a function (correct)     | calling a function (incorrect)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Это важно. В первом примере функция `handleClick` передается как обработчик события `onClick`. Это указывает React запомнить ее и вызывать вашу функцию только тогда, когда пользователь нажмет на кнопку.

Во втором примере `()` в конце `handleClick()` вызывает функцию *непосредственно* во время [рендера](/learn/render-and-commit), без каких-либо кликов. Так происходит потому, что JavaScript внутри [JSX `{` и `}`](/learn/javascript-in-jsx-with-curly-braces) выполняется немедленно.

Когда вы пишете inline-код, та же самая проблема проявляется снова:

| passing a function (correct)            | calling a function (incorrect)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Переданный inline-код, как этот, не сработает по клику - он будет срабатывать каждый раз при рендеринге компонента:

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

Если вы хотите определить обработчик события инлайн, оберните его в анонимную функцию, например, так:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Вместо того чтобы выполнять код при каждом рендере, создается функция, которая будет вызвана позже.

В обоих случаях то, что вы хотите передать, должно быть функцией:

* `<button onClick={handleClick}>` передает функцию `handleClick`.
* `<button onClick={() => alert('...')}>` передает функцию `() => alert('...')`.

[Подробнее о стрелочных функциях.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Reading props in event handlers {/*reading-props-in-event-handlers*/}

Поскольку обработчики событий объявлены внутри компонента, они имеют доступ к пропам. Ниже приведена кнопка, которая при нажатии показывает алерт с текстом из переменной `message`:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Тем самым эти две кнопки могут показывать разные сообщения. Попробуйте изменить передаваемые им сообщения.

### Передача аргументов в обработчики событий {/*passing-event-handlers-as-props*/}

Часто требуется, чтобы родительский компонент определял обработчик событий дочернего компонента. Рассмотрим две кнопки: в зависимости от того, где вы используете компонент `Button`, вы захотите выполнить разные функции - например, одна воспроизведет фильм, а другая загрузит изображение. 

Для этого в качестве обработчика события нужно передать проп, который компонент получит от своего родителя, например, так:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

В примере выше компонент `Toolbar` рендерит два компонента: `PlayButton` и `UploadButton`:

- `PlayButton` передает `handlePlayClick` как свойство `onClick` для `Button`.
- `UploadButton` передает `() => alert('Uploading!')` как свойство `onClick` для `Button`.

В конечном итоге, компонент `Button` получает свойство `onClick`. Он передаст это свойство непосредственно встроенному в браузер `<button>` с `onClick={onClick}`. Тем самым React получает команду вызвать переданную функцию по клику.

Если вы используете [дизайн систему](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), то обычно такие компоненты, как кнопки, содержат стили, но не определяют поведение. Поэтому такие компоненты, как `PlayButton` и `UploadButton` будут передавать обработчики событий вниз.

### Naming event handler props {/*naming-event-handler-props*/}

Встроенные компоненты, такие как `<button>` и `<div>`, поддерживают только [имена событий браузера](/reference/react-dom/components/common#common-props), такие как `onClick`. Но, когда вы создаете свои собственные компоненты, вы можете называть их обработчики событий как угодно.

Согласно правилам, название реквизита обработчика событий должно начинаться с `on`, за которым следует заглавная буква.

Например, реквизит `onClick` компонента `Button` можно было бы назвать `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

В этом примере `<button onClick={onSmash}>` показывает, что браузеру `<button>` (строчная буква) все еще нужен реквизит `onClick`, но имя реквизита, полученное вашим пользовательским компонентом `Button`, зависит от вас!

Если ваш компонент поддерживает множество видов взаимодействия, вы можете назвать обработчики событий именами специфических для приложения понятий. Например, компонент `Toolbar` принимает обработчики событий `onPlayMovie` и `onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Обратите внимание, что компоненту `App` не нужно знать, *что* `Toolbar` будет делать с `onPlayMovie` или `onUploadImage`. Это детали реализации `Toolbar`. В данном случае `Toolbar` передает их как обработчики `onClick` для своих `Button`, но позже он также может задействовать их при нажатии клавиш. Использование названий обработчиков в соответствии со специфическими для приложения действиями, такими как `onPlayMovie`, позволяет вам гибко изменять их дальнейшее использование.

## Event propagation {/*event-propagation*/}

Обработчики событий также будут улавливать события от всех дочерних компонентов, которые могут быть у вашего компонента. Говорят, что событие "пузырится" или "распространяется" вверх по дереву: оно начинается с того места, где произошло событие, и затем поднимается вверх по этому дереву.

Этот `<div>` содержит две кнопки. И `<div>` *и* каждая кнопка имеют свои собственные обработчики `onClick`. Какие обработчики, по вашему мнению, сработают при нажатии на кнопку?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Если вы нажмете на любую из кнопок, сначала сработает ее `onClick`, а затем `onClick` родительского `<div>`. В результате появятся два сообщения. Если щелкнуть саму панель инструментов, то выполнится только `onClick` родительского `<div>`.

<Pitfall>

В React распространяются все события, кроме `onScroll`, которое действует только на тег JSX, к которому вы его прикрепили.

</Pitfall>

### Stopping propagation {/*stopping-propagation*/}

Обработчики событий принимают объект **event** в качестве единственного аргумента. Обычно его называют `e`, что означает " event". Из этого объекта можно получить всю информацию о событии.

Это объект события также позволяет вам остановить его распространение. Если вы хотите, чтобы событие не дошло до родительских компонентов, вам нужно вызвать `e.stopPropagation()`, как это сделано в компоненте `Button`:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

При нажатии на кнопку:

1. React вызывает обработчик `onClick`, переданный в `<button>`. 
2. Этот обработчик, определенный в `Button`, делает следующее:
   * Вызывает `e.stopPropagation()`, предотвращая дальнейшее распространение события.
   * Вызывает функцию `onClick`, которая является пропом, переданным из компонента `Toolbar`.
3. Функция, определенная в компоненте `Toolbar`, выводит на дисплей сообщение.
4. Поскольку распространение было остановлено, обработчик `onClick` родительского `<div>` *не* выполняется.

В результате `e.stopPropagation()` нажатие на кнопки теперь показывает только одно сообщение (от `<button>`), а не два из них (от `<button>` и родительской панели инструментов `<div>`). Нажатие на кнопку - это не то же самое, что нажатие на окружающую панель инструментов, поэтому остановка распространения имеет смысл для данного пользовательского интерфейса.

<DeepDive>

#### Capture phase events {/*capture-phase-events*/}

В некоторых случаях вам может понадобиться перехватить все события на дочерних элементах, *даже если их распространение прекращено*. Например, вы хотите регистрировать каждый клик в аналитике, независимо от логики распространения. Это можно сделать, добавив `Capture` в конце имени события:

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Каждое событие проходит три фазы: 

1. Оно перемещается вниз, вызывая все обработчики `onClickCapture`.
2. Запускается обработчик `onClick` элемента, по которому щелкнули. 
3. Он перемещается вверх, вызывая все обработчики `onClick`.

Захват событий полезен для такого кода, как роутеры или аналитика, но, скорее всего, вы не будете использовать их в коде приложений.

</DeepDive>

### Passing handlers as alternative to propagation {/*passing-handlers-as-alternative-to-propagation*/}

Обратите внимание, как этот обработчик клика выполняет строку кода _и затем_ вызывает проп `onClick`, переданный родителем:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Вы можете добавить больше кода в этот обработчик перед вызовом обработчика родительского события `onClick`. Этот паттерн обеспечивает *альтернативу* распространению. Он позволяет дочернему компоненту обрабатывать событие, в то же время позволяя родительскому компоненту задавать дополнительное поведение. В отличие от распространения, он не является автоматическим. Но преимущество этого паттерна в том, что вы можете четко проследить всю цепочку вызовов в результате какого-то события.

Если вы используете распространение и вам сложно отследить, какие обработчики выполняются и почему, воспользуйтесь этим подходом.

### Preventing default behavior {/*preventing-default-behavior*/}


Некоторые браузерные события имеют поведение по умолчанию. Например, событие отправки `<form>`, которое происходит при нажатии на кнопку внутри него, по умолчанию перезагружает всю страницу:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Для того, чтобы отменить поведение браузера, установленное по умолчанию, вы можете вызвать `e.preventDefault()`.

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Не путайте `e.stopPropagation()` и `e.preventDefault()`. Они оба полезны, но не связаны между собой:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) позволяет остановить всплытие события по дереву элементов.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) позволяет заблокировать стандартное поведение браузера.

## Can event handlers have side effects? {/*can-event-handlers-have-side-effects*/}

Absolutely! Event handlers are the best place for side effects.

Unlike rendering functions, event handlers don't need to be [pure](/learn/keeping-components-pure), so it's a great place to *change* something—for example, change an input's value in response to typing, or change a list in response to a button press. However, in order to change some information, you first need some way to store it. In React, this is done by using [state, a component's memory.](/learn/state-a-components-memory) You will learn all about it on the next page.

<Recap>

* Для обработки событий в React можно передать функцию в качестве prop элемента, например, `<button>`.
* Обработчики событий должны быть **переданы в элемент без вызова**, используя следующий синтаксис: `onClick={handleClick}`, **а не** `onClick={handleClick()}`.
* Определение обработчика событий может быть выполнено инлайн или отдельно.
* Обработчики событий определяются внутри компонента и могут иметь доступ к его props.
* Обработчик событий может быть определен в родительском компоненте и передан в дочерний компонент в качестве prop.
* Для определения собственных реквизитов обработчика событий, уникальных для конкретного приложения, можно использовать свои собственные имена.
* События в React распространяются вверх по иерархии компонентов. Чтобы предотвратить это, вызовите метод e.stopPropagation() на первом аргументе.
* События могут иметь нежелательные стандартные поведения браузера, которые можно предотвратить вызовом метода e.preventDefault().
* Явный вызов свойства обработчика события из дочернего обработчика является альтернативой распространению событий.

</Recap>



<Challenges>

#### Fix an event handler {/*fix-an-event-handler*/}

Нажатие на эту кнопку должно переключить фон страницы с белого на черный. Однако при нажатии ничего не происходит. Исправьте эту проблему. ( Не беспокойтесь насчет логики внутри `handleClick` - эта часть в порядке).

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

Проблема в том, что `<button onClick={handleClick()}>` _вызывает_ функцию `handleClick` во время рендеринга вместо того, чтобы _передать_ ее. Если убрать вызов `()`, чтобы получилось `<button onClick={handleClick}>`, проблема будет устранена:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

Также можно обернуть вызов в другую функцию, например `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Wire up the events {/*wire-up-the-events*/}

Компонент `ColorSwitch` рендерит кнопку. Предполагается, что она будет менять цвет страницы. Привяжите его к обработчику события `onChangeColor`, который он принимает от родителя, чтобы при нажатии на кнопку менялся цвет.

После того как вы это сделаете, обратите внимание, что нажатие на кнопку также увеличивает счетчик нажатий на страницу. Ваш коллега, который написал родительский компонент, утверждает, что `onChangeColor` не увеличивает никаких счетчиков. Что еще может происходить? Поправьте компонент так, чтобы нажатие на кнопку *только* изменяло цвет и _не_ увеличивало счетчик.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Сначала нужно добавить обработчик события, например `<button onClick={onChangeColor}>`.

Но при этом возникает ошибка, связанная с увеличением счетчика. Если `onChangeColor` этого не делает, как утверждает ваш коллега, то проблема в том, что это событие распространяется вверх, и какой-то обработчик выше делает это. Чтобы решить эту проблему, нужно остановить распространение. Но не забудьте, что вы все равно должны вызвать `onChangeColor`.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
