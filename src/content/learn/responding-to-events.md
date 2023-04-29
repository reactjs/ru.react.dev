---
title: Обработка событий
---

<Intro>

В React можно добавлять  позволяет добавлять *обработчики событий* в JSX. Обработчики событий - это функции, которые вызываются в ответ на событие, например, клик на элемент, наведение курсора, фокус поля формы и так далее.

</Intro>

<YouWillLearn>

* Как писать обработчики событий
* Как передавать логику обработки событий от родительского компонента
* Как всплывают события и как их останавливать

</YouWillLearn>

## Добавление обработчиков событий {/*adding-event-handlers*/}

Для того, чтобы добавить обработчик событий, сначала нужно создать функцию, а затем [передать ее пропом](/learn/passing-props-to-a-component) в соответствующий JSX-тег. Ниже приведена кнопка, которая пока еще ничего не делает:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      Я ничего не делаю
    </button>
  );
}
```

</Sandpack>

Чтобы при нажатии на кнопку появилось сообщение, вам нужно выполнить следующие шаги:

1. Определить функцию `handleClick` *внутри* вашего компонента `Button`.
2. Реализовать логику внутри этой функции (используйте `alert`, чтобы показать сообщение).
3. Добавить `onClick={handleClick}` в JSX `<button>`.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('Вы нажали на меня!');
  }

  return (
    <button onClick={handleClick}>
      Нажми на меня
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Вы определили функцию `handleClick`, а затем [передали ее как проп](/learn/passing-props-to-a-component) в `<button>`. `handleClick` - это и есть **обработчик событий**. Обработчики событий:

* Обычно определены *внутри* компонентов.
* Начинаются со слова `handle`, после которого идет название события.

Принято называть обработчики событий `handle`, за которым следует имя события. Часто можно встретить `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` и так далее.

Также можно определить обработчик события внутри JSX:

```jsx
<button onClick={function handleClick() {
  alert('Вы нажали на меня!');
}}>
```

Или, более кратко, с помощью стрелочной функции:

```jsx
<button onClick={() => {
  alert('Вы нажали на меня!');
}}>
```

Оба этих варианта эквивалентны. Инлайновые обработчики событий удобны для коротких функций.

<Pitfall>

Функции, которые передаются в обработчики событий, должны именно передаваться, а не быть вызванными. Например:

| передача функции (правильно)     | вызов функции (неправильно)        |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Это важно. В первом примере функция `handleClick` передается как обработчик события `onClick`. Это указывает React запомнить ее и вызывать вашу функцию только тогда, когда пользователь нажмет на кнопку.

Во втором примере `()` в конце `handleClick()` вызывают функцию *непосредственно* во время [рендера](/learn/render-and-commit), без каких-либо кликов. Так происходит потому, что JavaScript внутри [JSX `{` и `}`](/learn/javascript-in-jsx-with-curly-braces) выполняется сразу.

Когда вы пишете инлайн-код, та же самая проблема проявляется снова:

| передача функции (правильно)            | вызов функции (неправильно)       |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Переданный инлайн код, как тот, что ниже, не сработает по клику - он будет срабатывать каждый раз при рендеринге компонента:

```jsx
// Это сообщение появляется, когда компонент рендерится, а не при нажатии!
<button onClick={alert('Вы нажали на меня!')}>
```

Если вы хотите определить обработчик события инлайн, оберните его в анонимную функцию:

```jsx
<button onClick={() => alert('Вы нажали на меня!')}>
```

Это позволит не выполнять код при каждом рендере компонента.

В обоих случаях то, что вы хотите передать, должно быть функцией:

* `<button onClick={handleClick}>` передает функцию `handleClick`.
* `<button onClick={() => alert('...')}>` передает стрелочную функцию `() => alert('...')`.

[Подробнее о стрелочных функциях.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Чтение пропсов в обработчиках событий {/*reading-props-in-event-handlers*/}

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
      <AlertButton message="Воспроизводится!">
        Воспроизвести фильм
      </AlertButton>
      <AlertButton message="Загружается!">
        Загрузить изображение
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Тем самым эти кнопки могут показывать разные сообщения. Попробуйте изменить передаваемые им сообщения.

### Передача аргументов в обработчики событий {/*passing-event-handlers-as-props*/}

Часто требуется, чтобы родительский компонент определял обработчик событий дочернего компонента. Рассмотрим две кнопки: в зависимости от того, где используется компонент `Button`, он может выполнять разные функции - например, один воспроизведет фильм, а другой загрузит изображение.

Для этого в качестве обработчика события нужно передать проп, который компонент получит от своего родителя:

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
      Воспроизвести "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Загружается!')}>
      Загрузить изображение
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Ведьмина служба доставки" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

В примере выше компонент `Toolbar` рендерит компоненты `PlayButton` и `UploadButton`:

- `PlayButton` передает `handlePlayClick` как свойство `onClick` для `Button`.
- `UploadButton` передает `() => alert('Uploading!')` как свойство `onClick` для `Button`.

В конечном итоге, компонент `Button` получает свойство `onClick`. Он передаст это свойство непосредственно встроенному в браузер `<button>` с `onClick={onClick}`. Тем самым React получит команду вызвать переданную функцию по клику.

Если вы используете [дизайн систему](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), то обычно компоненты, такие как кнопки, содержат стили, но не определяют поведение. Так и здесь, `PlayButton` и `UploadButton` будут передавать обработчики событий дальше.

### Именование пропов обработчика событий {/*naming-event-handler-props*/}

Встроенные компоненты, такие как `<button>` и `<div>`, поддерживают только [имена событий браузера](/reference/react-dom/components/common#common-props), такие как `onClick`. Но, когда вы создаете свои собственные компоненты, вы можете назвать обработчики событий как угодно.

Название пропа обработчика должно начинаться с `on`, за которым следует заглавная буква.

Например, проп `onClick` компонента `Button` можно назвать `onSmash`:

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
      <Button onSmash={() => alert('Воспроизводится!')}>
        Воспроизвести фильм
      </Button>
      <Button onSmash={() => alert('Загружается!')}>
        Загрузить изображение
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

В примере выше `<button onClick={onSmash}>` показывает, что браузерному `<button>` (строчная буква) все еще нужен проп `onClick`, но имя пропа, полученное вашим пользовательским компонентом `Button`, зависит от вас!

Если ваш компонент поддерживает несколько вариантов взаимодействия, вы можете назвать реквизиты обработчиков событий с учетом специфики приложения. Например, компонент `Toolbar` принимает обработчики событий `onPlayMovie` и `onUploadImage`:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Воспроизводится!')}
      onUploadImage={() => alert('Загружается!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Воспроизвести фильм
      </Button>
      <Button onClick={onUploadImage}>
        Загрузить изображение
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

Обратите внимание, что компоненту `App` не нужно знать, *что* `Toolbar` будет делать с `onPlayMovie` или `onUploadImage`. Это детали внетренней реализации `Toolbar`. В данном случае `Toolbar` передает их как обработчики `onClick` для своих `Button`, но позже он также может задействовать их для обработки нажатия клавиш. Называя реквизиты в соответствии со спецификой приложения, например, `onPlayMovie`, вы можете гибко менять их последующее поведение.

## Всплытие событий {/*event-propagation*/}

Обработчики событий также будут улавливать события от всех дочерних компонентов, которые могут быть у вашего компонента. Говорят, что событие "всплывает" или "распространяется" вверх по дереву: оно начинается с того места, где произошло событие, и затем поднимается вверх по этому дереву.

Этот `<div>` содержит две кнопки. И `<div>` *и* каждая кнопка имеют свои собственные обработчики `onClick`. Какие обработчики, по вашему мнению, сработают при нажатии на кнопку?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Воспроизводится!')}>
        Воспроизвести фильм
      </button>
      <button onClick={() => alert('Загружается!')}>
        Загрузить изображение
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

В React всплывают все события, кроме `onScroll`, которое реагирует только на тег JSX, к которому вы его привязяли.

</Pitfall>

### Прекращение передачи события {/*stopping-propagation*/}

При вызове обработчика, в него передаётся специальный объект **event**, обычно его называют `e`, из которого можно получить информацию о событии.

Всплытие события можно остановить с помощью метода `e.stopPropagation()`, как это сделано в компоненте `Button`:

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
      <Button onClick={() => alert('Воспроизводится!')}>
        Воспроизвести фильм
      </Button>
      <Button onClick={() => alert('Загружается!')}>
        Загрузить изображение
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
2. Обработчик, который определен в `Button`, делает следующее:
   * Вызывает `e.stopPropagation()`, который останавливает всплытие события.
   * Вызывает функцию `onClick`, которая является пропом, переданным из компонента `Toolbar`.
3. Функция, определенная в компоненте `Toolbar`, выводит на дисплей сообщение.
4. Поскольку всплытие было остановлено, обработчик `onClick` родительского `<div>` *не* выполнится.

После вызова `e.stopPropagation()` нажатие на кнопки теперь показывает только одно сообщение (от `<button>`), а не два из них (от `<button>` и родительской панели инструментов `<div>`). Нажатие на кнопку - это не то же самое, что нажатие на окружающую панель инструментов, поэтому остановка всплытия имеет смысл для данного пользовательского интерфейса.

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

### Отмена поведения по умолчанию {/*preventing-default-behavior*/}


Некоторые браузерные события имеют поведение по умолчанию. Например, событие отправки `<form>`, которое происходит при нажатии на кнопку внутри него, по умолчанию перезагружает всю страницу:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Отправление!')}>
      <input />
      <button>Отправить</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Для того, чтобы отменить поведение браузера, котрое установлено по умолчанию, вы можете вызвать `e.preventDefault()`.

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Отправление!');
    }}>
      <input />
      <button>Отправить</button>
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

## Могут ли обработчики событий иметь побочные эффекты? {/*can-event-handlers-have-side-effects*/}

Конечно! Обработчики событий - отличное место для побочных эффектов.

В отличие от функций рендеринга, обработчикам событий не требуется быть [чистыми](/learn/keeping-components-pure), поэтому это отличное место для *изменения* чего-либо - например, изменения значения ввода в ответ на ввод текста или изменения списка при нажатии кнопки. Но для того, чтобы изменить какую-то информацию, сначала нужно каким-то образом ее сохранить. В React для этого используется [состояние - память компонента.](/learn/state-a-components-memory) Вы узнаете об этом на следующей странице.

<Recap>

* Для обработки событий в React можно передать функцию в качестве пропа, например, `<button>`.
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

#### Исправьте обработчик события {/*fix-an-event-handler*/}

Нажатие на эту кнопку должно переключить фон страницы с белого на черный и наоборот. Однако при нажатии ничего не происходит. Исправьте эту проблему. (Не беспокойтесь насчет логики внутри `handleClick` - эта часть в порядке).

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
      Переключить фон
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
      Переключить фон
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
      Переключить фон
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Wire up the events {/*wire-up-the-events*/}

Компонент `ColorSwitch` рендерит кнопку. Предполагается, что она будет менять цвет страницы. Привяжите его к обработчику события `onChangeColor`, который компонент принимает от родителя, чтобы при нажатии на кнопку менялся цвет.

После того как вы это сделаете, обратите внимание, что нажатие на кнопку также увеличивает счетчик нажатий на страницу. Ваш коллега, который написал родительский компонент, утверждает, что `onChangeColor` не увеличивает никаких счетчиков. Что еще может происходить? Исправьте компонент так, чтобы нажатие на кнопку *изменяло* цвет и _не_ увеличивало счетчик.

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
      <h2>Нажатий на страницу: {clicks}</h2>
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
      Изменить цвет
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
      <h2>Нажатий на страницу: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
