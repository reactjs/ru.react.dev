---
title: Responding to Events
---

<Intro>

React позволяет добавлять *обработчики событий* в ваш JSX. Обработчики событий — это ваши собственные функции, которые будут вызываться в ответ на такие взаимодействия, как клики, наведение курсора, фокусировка на полях ввода и так далее.

</Intro>

<YouWillLearn>

* Различные способы написания обработчика событий
* Как передать логику обработки событий из родительского компонента
* Как события распространяются и как их остановить

</YouWillLearn>

## Добавление обработчиков событий {/*adding-event-handlers*/}

Чтобы добавить обработчик событий, сначала нужно определить функцию, а затем [передать её как пропс](/learn/passing-props-to-a-component) соответствующему JSX-тегу. Например, вот кнопка, которая пока ничего не делает:

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

Вы можете сделать так, чтобы она показывала сообщение при клике пользователя, выполнив следующие три шага:

1. Объявите функцию с именем `handleClick` *внутри* вашего компонента `Button`.
2. Реализуйте логику внутри этой функции (используйте `alert` для отображения сообщения).
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

Вы определили функцию `handleClick`, а затем [передали её как пропс](/learn/passing-props-to-a-component) в `<button>`. `handleClick` — это **обработчик событий**. Функции-обработчики событий:

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

Функции, передаваемые обработчикам событий, должны быть переданы, а не вызваны. Например:

| передача функции (правильно)     | вызов функции (неправильно)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Разница тонка. В первом примере функция `handleClick` передается как обработчик события `onClick`. Это говорит React, чтобы он запомнил её и вызвал вашу функцию только тогда, когда пользователь нажмет кнопку.

Во втором примере `()` в конце `handleClick()` запускает функцию *немедленно* во время [рендеринга](/learn/render-and-commit), без каких-либо кликов. Это происходит потому, что JavaScript внутри [JSX `{` и `}`](/learn/javascript-in-jsx-with-curly-braces) выполняется сразу.

Когда вы пишете код прямо в JSX, та же самая ловушка проявляется по-другому:

| передача функции (правильно)            | вызов функции (неправильно)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Передача такого встроенного кода не сработает при клике — он срабатывает при каждом рендеринге компонента:

```jsx
// Этот alert срабатывает при рендеринге компонента, а не при клике!
<button onClick={alert('You clicked me!')}>
```

Если вы хотите определить обработчик событий прямо в JSX, оберните его в анонимную функцию, вот так:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Вместо выполнения кода внутри при каждом рендеринге, это создает функцию, которая будет вызвана позже.

В обоих случаях вы хотите передать функцию:

* `<button onClick={handleClick}>` передает функцию `handleClick`.
* `<button onClick={() => alert('...')}>` передает функцию `() => alert('...')`.

[Подробнее о стрелочных функциях.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Чтение пропсов в обработчиках событий {/*reading-props-in-event-handlers*/}

Поскольку обработчики событий объявлены внутри компонента, они имеют доступ к пропсам компонента. Вот кнопка, которая при нажатии показывает оповещение с её пропсом `message`:

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

Это позволяет этим двум кнопкам показывать разные сообщения. Попробуйте изменить передаваемые им сообщения.

### Передача обработчиков событий как пропсов {/*passing-event-handlers-as-props*/}

Часто вы захотите, чтобы родительский компонент определял обработчик событий дочернего. Рассмотрим кнопки: в зависимости от того, где вы используете компонент `Button`, вы можете захотеть выполнить разную функцию — возможно, одна будет воспроизводить фильм, а другая загружать изображение.

Для этого передайте пропс, который компонент получает от родителя, в качестве обработчика событий, вот так:

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

- `PlayButton` передает `handlePlayClick` как пропс `onClick` в `Button` внутри.
- `UploadButton` передает `() => alert('Uploading!')` как пропс `onClick` в `Button` внутри.

Наконец, ваш компонент `Button` принимает пропс под названием `onClick`. Он передает этот пропс напрямую встроенной браузерной кнопке `<button>` с помощью `onClick={onClick}`. Это говорит React вызвать переданную функцию при клике.

Если вы используете [систему дизайна](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), часто компоненты, такие как кнопки, содержат стилизацию, но не определяют поведение. Вместо этого компоненты, такие как `PlayButton` и `UploadButton`, передают обработчики событий вниз.

### Именование пропсов обработчиков событий {/*naming-event-handler-props*/}

Встроенные компоненты, такие как `<button>` и `<div>`, поддерживают только [имена браузерных событий](/reference/react-dom/components/common#common-props), такие как `onClick`. Однако, когда вы создаете свои собственные компоненты, вы можете называть их пропсы обработчиков событий как угодно.

По соглашению, пропсы обработчиков событий должны начинаться с `on`, за которым следует заглавная буква.

Например, пропс `onClick` компонента `Button` мог бы называться `onSmash`:

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

В этом примере `<button onClick={onSmash}>` показывает, что браузерная кнопка `<button>` (в нижнем регистре) по-прежнему нуждается в пропсе с именем `onClick`, но имя пропса, полученное вашим пользовательским компонентом `Button`, остается на ваше усмотрение!

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

Обратите внимание, что компонент `App` не должен знать, *что* `Toolbar` будет делать с `onPlayMovie` или `onUploadImage`. Это деталь реализации `Toolbar`. Здесь `Toolbar` передает их как обработчики `onClick` своим `Button`s, но позже он также может вызывать их по сочетанию клавиш. Именование пропсов по взаимодействиям, специфичным для приложения, таким как `onPlayMovie`, дает вам гибкость в изменении того, как они используются в дальнейшем.
  
<Note>

Убедитесь, что вы используете соответствующие HTML-теги для ваших обработчиков событий. Например, для обработки кликов используйте [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button), а не `<div onClick={handleClick}>`. Использование настоящей браузерной кнопки `<button>` включает встроенное поведение браузера, такое как навигация с клавиатуры. Если вам не нравится стандартное оформление кнопки браузера, и вы хотите, чтобы она выглядела больше как ссылка или другой элемент интерфейса, вы можете добиться этого с помощью CSS. [Узнайте больше о написании доступной разметки.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
  
</Note>

## Распространение событий {/*event-propagation*/}

Обработчики событий также будут перехватывать события от любых дочерних элементов, которые может иметь ваш компонент. Мы говорим, что событие "всплывает" или "распространяется" вверх по дереву: оно начинается с места, где произошло событие, а затем идет вверх по дереву.

Этот `<div>` содержит две кнопки. И `<div>`, *и* каждая кнопка имеют свои собственные обработчики `onClick`. Какие обработчики, по вашему мнению, сработают при нажатии на кнопку?

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

Если вы нажмете на любую кнопку, сначала сработает её `onClick`, а затем `onClick` родительского `<div>`. Таким образом, появятся два сообщения. Если вы нажмете на саму панель инструментов, сработает только `onClick` родительского `<div>`.

<Pitfall>

Все события распространяются в React, кроме `onScroll`, который работает только на JSX-теге, к которому он прикреплен.

</Pitfall>

### Остановка распространения {/*stopping-propagation*/}

Обработчики событий получают **объект события** в качестве единственного аргумента. По соглашению, он обычно называется `e`, что означает "event" (событие). Вы можете использовать этот объект для чтения информации о событии.

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
2. Этот обработчик, определенный в `Button`, делает следующее:
   * Вызывает `e.stopPropagation()`, предотвращая дальнейшее всплытие события.
   * Вызывает функцию `onClick`, которая является пропсом, переданным из компонента `Toolbar`.
3. Эта функция, определенная в компоненте `Toolbar`, отображает собственное оповещение кнопки.
4. Поскольку распространение было остановлено, обработчик `onClick` родительского `<div>` *не* выполняется.

В результате вызова `e.stopPropagation()`, нажатие на кнопки теперь показывает только одно оповещение (от `<button>`), а не два (от `<button>` и родительского `<div>` панели инструментов). Нажатие на кнопку — это не то же самое, что нажатие на окружающую панель инструментов, поэтому остановка распространения имеет смысл для этого пользовательского интерфейса.

<DeepDive>

#### События фазы захвата {/*capture-phase-events*/}

В редких случаях вам может понадобиться перехватывать все события на дочерних элементах, *даже если они остановили распространение*. Например, вы можете захотеть регистрировать каждый клик для аналитики, независимо от логики распространения. Вы можете сделать это, добавив `Capture` в конец имени события:

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

Обратите внимание, как этот обработчик клика выполняет строку кода, _а затем_ вызывает пропс `onClick`, переданный родителем:

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

Вы можете добавить больше кода в этот обработчик перед вызовом родительского обработчика события `onClick`. Этот шаблон предоставляет *альтернативу* распространению. Он позволяет дочернему компоненту обрабатывать событие, а также позволяет родительскому компоненту указывать дополнительное поведение. В отличие от распространения, это не автоматическое. Но преимущество этого шаблона в том, что вы можете четко проследить всю цепочку кода, которая выполняется в результате какого-либо события.

Если вы полагаетесь на распространение, и вам трудно отследить, какие обработчики выполняются и почему, попробуйте вместо этого использовать этот подход.

### Предотвращение поведения по умолчанию {/*preventing-default-behavior*/}

Некоторые браузерные события имеют связанное с ними поведение по умолчанию. Например, событие отправки `<form>`, которое происходит при нажатии на кнопку внутри него, по умолчанию перезагрузит всю страницу:

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

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) останавливает срабатывание обработчиков событий, прикрепленных к тегам выше.
* [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) предотвращает стандартное поведение браузера для тех немногих событий, которые его имеют.

## Могут ли обработчики событий иметь побочные эффекты? {/*can-event-handlers-have-side-effects*/}

Абсолютно! Обработчики событий — лучшее место для побочных эффектов.

В отличие от функций рендеринга, обработчикам событий не нужно быть [чистыми](/learn/keeping-components-pure), поэтому это отличное место для *изменения* чего-либо — например, изменения значения поля ввода в ответ на ввод текста или изменения списка в ответ на нажатие кнопки. Однако, чтобы изменить некоторую информацию, вам сначала нужен способ её сохранить. В React это делается с помощью [состояния, памяти компонента.](/learn/state-a-components-memory) Вы узнаете всё об этом на следующей странице.

<Recap>

* Вы можете обрабатывать события, передавая функцию как пропс элементу, например `<button>`.
* Обработчики событий должны быть переданы, **а не вызваны!** `onClick={handleClick}`, а не `onClick={handleClick()}`.
* Вы можете определить функцию обработчика событий отдельно или прямо в JSX.
* Обработчики событий определяются внутри компонента, поэтому они могут получать доступ к пропсам.
* Вы можете объявить обработчик событий в родительском компоненте и передать его как пропс дочернему.
* Вы можете определить свои собственные пропсы обработчиков событий с именами, специфичными для приложения.
* События распространяются вверх. Вызовите `e.stopPropagation()` в первом аргументе, чтобы предотвратить это.
* События могут иметь нежелательное поведение браузера по умолчанию. Вызовите `e.preventDefault()`, чтобы предотвратить это.
* Явный вызов пропса обработчика событий из дочернего обработчика является хорошей альтернативой распространению.

</Recap>



<Challenges>

#### Исправьте обработчик событий {/*fix-an-event-handler*/}

Нажатие на эту кнопку должно переключать фон страницы между белым и черным. Однако при нажатии ничего не происходит. Исправьте проблему. (Не беспокойтесь о логике внутри `handleClick` — эта часть в порядке.)

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

Проблема в том, что `<button onClick={handleClick()}>` _вызывает_ функцию `handleClick` во время рендеринга вместо того, чтобы _передавать_ её. Удаление вызова `()` так, чтобы получилось `<button onClick={handleClick}>`, исправляет проблему:

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

Альтернативно, вы можете обернуть вызов в другую функцию, например `<button onClick={() => handleClick()}>`:

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

#### Свяжите события {/*wire-up-the-events*/}

Этот компонент `ColorSwitch` рендерит кнопку. Он должен менять цвет страницы. Свяжите его с пропсом обработчика события `onChangeColor`, который он получает от родителя, чтобы нажатие на кнопку меняло цвет.

После этого обратите внимание, что нажатие на кнопку также увеличивает счетчик кликов страницы. Ваш коллега, написавший родительский компонент, настаивает, что `onChangeColor` не увеличивает никакие счетчики. Что еще может происходить? Исправьте это так, чтобы нажатие на кнопку *только* меняло цвет и *не* увеличивало счетчик.

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

Сначала вам нужно добавить обработчик событий, например `<button onClick={onChangeColor}>`.

Однако это создает проблему с увеличением счетчика. Если `onChangeColor` этого не делает, как утверждает ваш коллега, то проблема в том, что событие распространяется вверх, и какой-то обработчик выше делает это. Чтобы решить эту проблему, вам нужно остановить распространение. Но не забывайте, что вы все равно должны вызвать `onChangeColor`.

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
