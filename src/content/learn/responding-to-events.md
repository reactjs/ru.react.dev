---
title: Обработка событий
---

<Intro>

React позволяет добавлять *обработчики событий* в ваш JSX. Обработчики событий — это ваши собственные функции, которые будут вызваны в ответ на действия пользователя, такие как клики, наведение курсора, фокусировка на полях ввода и т. д.

</Intro>

<YouWillLearn>

* Различные способы написания обработчика событий
* Как передать логику обработки событий из родительского компонента
* Как события распространяются и как их остановить

</YouWillLearn>

## Добавление обработчиков событий {/*adding-event-handlers*/}

Чтобы добавить обработчик событий, сначала определите функцию, а затем [передайте её как проп](/learn/passing-props-to-a-component) соответствующему JSX-тегу. Например, вот кнопка, которая пока ничего не делает:

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

Вы можете заставить её выводить сообщение при нажатии, выполнив следующие три шага:

1. Объявите функцию с именем `handleClick` *внутри* вашего компонента `Button`.
2. Реализуйте логику внутри этой функции (используйте `alert` для вывода сообщения).
3. Добавьте `onClick={handleClick}` в JSX `<button>`.

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

Вы определили функцию `handleClick`, а затем [передали её как проп](/learn/passing-props-to-a-component) в `<button>`. `handleClick` является **обработчиком событий**. Функции-обработчики событий:

* Обычно определяются *внутри* ваших компонентов.
* Имеют имена, начинающиеся с `handle`, за которыми следует имя события.

По соглашению, принято называть обработчики событий `handle`, за которым следует имя события. Вы часто будете видеть `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` и так далее.

Альтернативно, вы можете определить обработчик событий прямо в JSX:

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Или, более кратко, используя стрелочную функцию:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Все эти стили эквивалентны. Встроенные обработчики событий удобны для коротких функций.

<Pitfall>

Функции, передаваемые в обработчики событий, должны быть переданы, а не вызваны. Например:

| Передача функции (правильно)     | Вызов функции (неправильно)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Разница тонка. В первом примере функция `handleClick` передается как обработчик события `onClick`. Это говорит React запомнить её и вызвать вашу функцию только тогда, когда пользователь нажмёт кнопку.

Во втором примере `()` в конце `handleClick()` вызывает функцию *немедленно* во время [рендеринга](/learn/render-and-commit), без каких-либо кликов. Это происходит потому, что JavaScript внутри [JSX `{` и `}`](/learn/javascript-in-jsx-with-curly-braces) выполняется сразу.

Когда вы пишете код прямо в JSX, та же ловушка проявляется по-другому:

| Передача функции (правильно)            | Вызов функции (неправильно)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Передача кода прямо в JSX таким образом не сработает при клике — она срабатывает при каждом рендеринге компонента:

```jsx
// Этот alert срабатывает при рендеринге компонента, а не при клике!
<button onClick={alert('You clicked me!')}>
```

Если вы хотите определить обработчик событий прямо в JSX, оберните его в анонимную функцию, вот так:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Вместо того чтобы выполнять код внутри при каждом рендеринге, это создаёт функцию, которая будет вызвана позже.

В обоих случаях вы хотите передать функцию:

* `<button onClick={handleClick}>` передаёт функцию `handleClick`.
* `<button onClick={() => alert('...')}>` передаёт функцию `() => alert('...')`.

[Подробнее о стрелочных функциях.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Чтение пропсов в обработчиках событий {/*reading-props-in-event-handlers*/}

Поскольку обработчики событий объявляются внутри компонента, они имеют доступ к пропсам этого компонента. Вот кнопка, которая при нажатии выводит сообщение из своего пропа `message`:

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

Это позволяет этим двум кнопкам выводить разные сообщения. Попробуйте изменить передаваемые им сообщения.

### Передача обработчиков событий как пропсов {/*passing-event-handlers-as-props*/}

Часто вы захотите, чтобы родительский компонент определял обработчик событий дочернего. Рассмотрим кнопки: в зависимости от того, где вы используете компонент `Button`, вы можете захотеть выполнить разную функцию — возможно, одна будет воспроизводить фильм, а другая загружать изображение.

Для этого передайте проп, который компонент получает от родителя, как обработчик события, вот так:

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

Здесь компонент `Toolbar` рендерит `PlayButton` и `UploadButton`:

- `PlayButton` передаёт `handlePlayClick` как проп `onClick` в `Button` внутри.
- `UploadButton` передаёт `() => alert('Uploading!')` как проп `onClick` в `Button` внутри.

Наконец, ваш компонент `Button` принимает проп под названием `onClick`. Он напрямую передаёт этот проп встроенной браузерной кнопке `<button>` с помощью `onClick={onClick}`. Это говорит React вызвать переданную функцию при клике.

Если вы используете [систему дизайна](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), часто компоненты, такие как кнопки, содержат стилизацию, но не определяют поведение. Вместо этого компоненты, такие как `PlayButton` и `UploadButton`, передают обработчики событий вниз.

### Именование пропсов обработчиков событий {/*naming-event-handler-props*/}

Встроенные компоненты, такие как `<button>` и `<div>`, поддерживают только [имена событий браузера](/reference/react-dom/components/common#common-props), такие как `onClick`. Однако, когда вы создаёте свои собственные компоненты, вы можете называть их пропсы обработчиков событий как угодно.

По соглашению, пропсы обработчиков событий должны начинаться с `on`, за которым следует заглавная буква.

Например, проп `onClick` компонента `Button` мог бы называться `onSmash`:

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

В этом примере `<button onClick={onSmash}>` показывает, что браузерная кнопка `<button>` (в нижнем регистре) по-прежнему нуждается в пропе с именем `onClick`, но имя пропса, полученное вашим пользовательским компонентом `Button`, зависит от вас!

Когда ваш компонент поддерживает несколько взаимодействий, вы можете называть пропсы обработчиков событий по концепциям, специфичным для приложения. Например, этот компонент `Toolbar` получает обработчики событий `onPlayMovie` и `onUploadImage`:

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

Обратите внимание, что компонент `App` не должен знать, *что* `Toolbar` будет делать с `onPlayMovie` или `onUploadImage`. Это деталь реализации `Toolbar`. Здесь `Toolbar` передаёт их как обработчики `onClick` своим `Button`, но позже он также может запускать их по сочетанию клавиш. Именование пропсов по взаимодействиям, специфичным для приложения, таким как `onPlayMovie`, даёт вам гибкость в изменении того, как они используются в дальнейшем.
  
<Note>

Убедитесь, что вы используете соответствующие HTML-теги для ваших обработчиков событий. Например, для обработки кликов используйте [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button), а не `<div onClick={handleClick}>`. Использование настоящей браузерной кнопки `<button>` включает встроенные браузерные поведения, такие как навигация с клавиатуры. Если вам не нравится стандартный браузерный стиль кнопки, и вы хотите, чтобы она выглядела больше как ссылка или другой элемент интерфейса, вы можете добиться этого с помощью CSS. [Узнайте больше о написании доступной разметки.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
  
</Note>

## Распространение событий {/*event-propagation*/}

Обработчики событий также будут перехватывать события от любых дочерних элементов вашего компонента. Мы говорим, что событие «всплывает» или «распространяется» вверх по дереву: оно начинается с места, где произошло событие, а затем движется вверх по дереву.

Этот `<div>` содержит две кнопки. И `<div>`, *и* каждая кнопка имеют свои собственные обработчики `onClick`. Как вы думаете, какие обработчики сработают при нажатии на кнопку?

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

Если вы нажмёте на любую кнопку, сначала сработает её обработчик `onClick`, а затем обработчик `onClick` родительского `<div>`. Таким образом, появятся два сообщения. Если вы нажмёте на сам `toolbar`, сработает только обработчик `onClick` родительского `<div>`.

<Pitfall>

Все события распространяются в React, кроме `onScroll`, который работает только на JSX-теге, к которому он прикреплён.

</Pitfall>

### Остановка распространения {/*stopping-propagation*/}

Обработчики событий получают **объект события** в качестве единственного аргумента. По соглашению, его обычно называют `e`, что означает «event» (событие). Вы можете использовать этот объект для чтения информации о событии.

Этот объект события также позволяет остановить распространение. Если вы хотите предотвратить распространение события на родительские компоненты, вам нужно вызвать `e.stopPropagation()`, как это делает компонент `Button`:

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

Когда вы нажимаете на кнопку:

1. React вызывает обработчик `onClick`, переданный в `<button>`.
2. Этот обработчик, определённый в `Button`, выполняет следующее:
   * Вызывает `e.stopPropagation()`, предотвращая дальнейшее всплытие события.
   * Вызывает функцию `onClick`, которая является пропом, переданным из компонента `Toolbar`.
3. Эта функция, определённая в компоненте `Toolbar`, отображает собственное оповещение кнопки.
4. Поскольку распространение было остановлено, обработчик `onClick` родительского `<div>` *не* выполняется.

В результате вызова `e.stopPropagation()`, нажатие на кнопки теперь отображает только одно оповещение (от `<button>`), а не два (от `<button>` и родительского `<div>` toolbar). Нажатие на кнопку — это не то же самое, что нажатие на окружающий toolbar, поэтому остановка распространения имеет смысл для этого пользовательского интерфейса.

<DeepDive>

#### События фазы захвата {/*capture-phase-events*/}

В редких случаях вам может понадобиться перехватывать все события на дочерних элементах, *даже если они остановили распространение*. Например, вы можете захотеть записывать каждый клик в аналитику, независимо от логики распространения. Вы можете сделать это, добавив `Capture` в конец имени события:

```js
<div onClickCapture={() => { /* это выполняется первым */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Каждое событие распространяется в три фазы:

1. Оно движется вниз, вызывая все обработчики `onClickCapture`.
2. Выполняется обработчик `onClick` нажатого элемента.
3. Оно движется вверх, вызывая все обработчики `onClick`.

События захвата полезны для такого кода, как маршрутизаторы или аналитика, но вы, вероятно, не будете использовать их в коде приложения.

</DeepDive>

### Передача обработчиков как альтернатива распространению {/*passing-handlers-as-alternative-to-propagation*/}

Обратите внимание, как этот обработчик клика выполняет строку кода, _а затем_ вызывает проп `onClick`, переданный родителем:

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

Вы можете добавить больше кода в этот обработчик перед вызовом родительского обработчика события `onClick`. Этот шаблон предоставляет *альтернативу* распространению. Он позволяет дочернему компоненту обрабатывать событие, а также позволяет родительскому компоненту указывать дополнительное поведение. В отличие от распространения, это не автоматическое. Но преимущество этого шаблона заключается в том, что вы можете четко проследить всю цепочку кода, которая выполняется в результате какого-либо события.

Если вы полагаетесь на распространение, и вам трудно отследить, какие обработчики выполняются и почему, попробуйте вместо этого использовать этот подход.

### Предотвращение поведения по умолчанию {/*preventing-default-behavior*/}

Некоторые события браузера имеют связанное с ними поведение по умолчанию. Например, событие отправки формы (`<form>` submit), которое происходит при нажатии на кнопку внутри неё, по умолчанию перезагрузит всю страницу:

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

Вы можете вызвать `e.preventDefault()` в объекте события, чтобы предотвратить это:

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

Не путайте `e.stopPropagation()` и `e.preventDefault()`. Оба полезны, но не связаны:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) останавливает срабатывание обработчиков событий, прикреплённых к вышестоящим тегам.
* [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) предотвращает стандартное поведение браузера для тех немногих событий, которые его имеют.

## Могут ли обработчики событий иметь побочные эффекты? {/*can-event-handlers-have-side-effects*/}

Абсолютно! Обработчики событий — лучшее место для побочных эффектов.

В отличие от функций рендеринга, обработчикам событий не нужно быть [чистыми](/learn/keeping-components-pure), поэтому это отличное место для *изменения* чего-либо — например, изменения значения поля ввода в ответ на ввод текста или изменения списка в ответ на нажатие кнопки. Однако, чтобы изменить какую-либо информацию, вам сначала нужен способ её сохранить. В React это делается с помощью [состояния, памяти компонента.](/learn/state-a-components-memory) Вы узнаете всё об этом на следующей странице.

<Recap>

* Вы можете обрабатывать события, передавая функцию в качестве пропа элементу, такому как `<button>`.
* Обработчики событий должны быть переданы, **а не вызваны!** `onClick={handleClick}`, а не `onClick={handleClick()}`.
* Вы можете определить функцию обработчика событий отдельно или встроено.
* Обработчики событий определяются внутри компонента, поэтому они могут получать доступ к пропсам.
* Вы можете объявить обработчик событий в родительском компоненте и передать его как проп дочернему.
* Вы можете определить свои собственные пропсы обработчиков событий с именами, специфичными для приложения.
* События распространяются вверх. Вызовите `e.stopPropagation()` в первом аргументе, чтобы предотвратить это.
* События могут иметь нежелательное поведение браузера по умолчанию. Вызовите `e.preventDefault()`, чтобы предотвратить это.
* Явный вызов пропса обработчика событий из дочернего обработчика является хорошей альтернативой распространению.

</Recap>



<Challenges>

#### Исправьте обработчик события {/*fix-an-event-handler*/}

Нажатие на эту кнопку должно переключать фон страницы между белым и чёрным. Однако при нажатии ничего не происходит. Исправьте проблему. (Не беспокойтесь о логике внутри `handleClick` — эта часть в порядке.)

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

Проблема в том, что `<button onClick={handleClick()}>` *вызывает* функцию `handleClick` во время рендеринга, а не *передаёт* её. Удаление вызова `()` так, чтобы получилось `<button onClick={handleClick}>`, исправляет проблему:

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

В качестве альтернативы вы можете обернуть вызов в другую функцию, например `<button onClick={() => handleClick()}>`:

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

#### Подключите события {/*wire-up-the-events*/}

Этот компонент `ColorSwitch` отображает кнопку. Он должен менять цвет страницы. Подключите его к пропу обработчика события `onChangeColor`, который он получает от родительского компонента, чтобы нажатие на кнопку меняло цвет.

После этого обратите внимание, что нажатие на кнопку также увеличивает счётчик кликов страницы. Ваш коллега, написавший родительский компонент, настаивает, что `onChangeColor` не увеличивает никакие счётчики. Что ещё может происходить? Исправьте это так, чтобы нажатие на кнопку *только* меняло цвет и *не* увеличивало счётчик.

<Sandpack>

```js src/ColorSwitch.js active
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

```js src/App.js hidden
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

Сначала вам нужно добавить обработчик события, например `<button onClick={onChangeColor}>`.

Однако это создаёт проблему с увеличением счётчика. Если `onChangeColor` этого не делает, как настаивает ваш коллега, то проблема в том, что событие распространяется вверх, и какой-то обработчик выше делает это. Чтобы решить эту проблему, вам нужно остановить распространение. Но не забывайте, что вы всё равно должны вызвать `onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
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

```js src/App.js hidden
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