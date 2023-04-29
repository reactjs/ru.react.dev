---
title: Обработка событий
---

<Intro>

React позволяет добавлять *обработчики событий* прямо в JSX. Обработчики событий - это функции, которые вызываются в ответ на определенное событие, например, клик на элемент, наведение курсора, фокус поля формы и т.д.

</Intro>

<YouWillLearn>

* Различные способы написания обработчика событий
* Как передавать логику обработки событий от родительского компонента
* Как события распространяются и как их остановить

</YouWillLearn>

## Добавление обработчиков событий {/*adding-event-handlers*/}

Чтобы добавить обработчик событий, сначала нужно определить функцию, а затем передать ее [в качестве пропа](/learn/passing-props-to-a-component) в соответствующий JSX-тег. Например, вот кнопка, у которой пока нет обработчика событий:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      У меня нет обработчика событий
    </button>
  );
}
```

</Sandpack>

Для того, чтобы при нажатии на кнопку появилось сообщение, выполните эти шаги:

1. Определите функцию `handleClick` *внутри* компонента `Button`.
2. Внутри функции `handleClick` реализуйте логику, которая будет срабатывать при нажатии на кнопку (используйте функцию `alert` для отображения сообщения).
3. Добавьте `onClick={handleClick}` в JSX-тег `<button>`, чтобы связать функцию handleClick с событием клика на кнопке.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('Вы нажали на меня!');
  }

  return (
    <button onClick={handleClick}>
      Нажмите на меня
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Вы определили функцию `handleClick` и затем [передали ее в качестве пропа](/learn/passing-props-to-a-component) в `<button>`. `handleClick` - это обработчик событий. Функции обработчиков событий:

* Обычно определяются *внутри* ваших компонентов.
* начинаются со слова `handle`, за которым следует имя события.

Обработчики событий принято называть со слова `handle`, за которым следует имя события. Вы часто будете встречать `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` и т.п.

Ещё обработчик события можно определить внутри JSX:

```jsx
<button onClick={function handleClick() {
  alert('Вы нажали на меня!');
}}>
```

Или короче с помощью стрелочной функции:

```jsx
<button onClick={() => {
  alert('Вы нажали на меня!');
}}>
```

Оба этих варианта эквивалентны. Инлайновые обработчики событий удобны для коротких функций.

<Pitfall>

Функции, которые передаются в обработчики событий, должны быть переданы, а не вызваны. Например:

| передача функции (правильно)     | вызов функции (неправильно)        |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Разница здесь небольшая. В первом примере функция `handleClick` передается как обработчик событий `onClick`. Это говорит React запомнить ее и вызывать только при клике пользователя на кнопку.

Во втором примере `()` в конце `handleClick()` вызывает функцию *немедленно* во время [рендеринга](/learn/render-and-commit), без кликов. Это происходит потому, что JavaScript внутри [`{` и `}` JSX](/learn/javascript-in-jsx-with-curly-braces) выполняется сразу же.

При написании кода встроенным образом (inline), та же опасность проявляется по-другому:

| передача функции (правильно)            | вызов функции (неправильно)       |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Передача кода встроенным образом вроде этого не приведет к срабатыванию при клике — он будет выполняться каждый раз при рендеринге компонента:

```jsx
// Это сообщение появляется, когда компонент рендерится, а не при нажатии!
<button onClick={alert('Вы нажали на меня!')}>
```

Если вы хотите определить обработчик событий встроенным образом, оберните его в анонимную функцию, как показано ниже:

```jsx
<button onClick={() => alert('Вы нажали на меня!')}>
```

Таким образом, вместо выполнения кода при каждом рендеринге, создается функция, которая будет вызвана позже.

В обоих случаях вам нужно передавать функцию:

* `<button onClick={handleClick}>` передает функцию `handleClick`.
* `<button onClick={() => alert('...')}>` передает стрелочную функцию `() => alert('...')`.

[Подробнее о стрелочных функциях.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Чтение пропсов в обработчиках событий {/*reading-props-in-event-handlers*/}

Поскольку обработчики событий объявляются внутри компонента, они имеют доступ к пропсам компонента. Вот кнопка, которая при нажатии показывает предупреждение со значением своего свойства message:

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

Это позволяет двум кнопкам показывать разные сообщения. Попробуйте изменить передаваемые им сообщения.

### Передача обработчиков событий в качестве пропсов {/*passing-event-handlers-as-props*/}

Часто вы захотите, чтобы родительский компонент указал обработчик событий для дочернего компонента. Например, для кнопок: в зависимости от места использования компонента `Button` вам может потребоваться выполнить разные функции — например, воспроизведение фильма или загрузка изображения.

Для этого передайте компоненту проп, который он получит от своего родителя в качестве обработчика событий, например:

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
    alert(`Воспроизводится ${movieName}!`);
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

Здесь компонент `Toolbar` рендерит компоненты `PlayButton` и `UploadButton`:


- `PlayButton` передает `handlePlayClick` в качестве пропа `onClick` внутренней кнопке.
- `UploadButton` передает `() => alert('Загружается!')` в качестве пропа `onClick` внутренней кнопке.

Наконец, ваш компонент `Button` принимает проп с именем `onClick`. Он передает этот проп напрямую встроенной `<button>` браузера с помощью `onClick={onClick}`. Это указывает React вызвать переданную функцию при клике.


Если вы используете [дизайн-систему](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), то обычно компоненты, такие как кнопки, содержат стили, но не указывают поведение. Вместо этого компоненты, такие как `PlayButton` и `UploadButton`, передадут обработчики событий вниз по иерархии.

### Название пропсов для обработчиков событий {/*naming-event-handler-props*/}

Встроенные компоненты, такие как `<button>` и `<div>`, поддерживают только [имена событий браузера](/reference/react-dom/components/common#common-props), такие как `onClick`. Однако, при создании своих собственных компонентов, вы можете называть их обработчики событий любым именем, которое вам нравится.

Пропсы для обработчиков событий должны начинаться с `on`, за которым следует заглавная буква.

Например, проп `onClick` компонента `Button` мог бы называться onSmash:

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

В этом примере `<button onClick={onSmash}>` показывает, что встроенный элемент `<button>` (с маленькой буквы) все еще нуждается в пропе с именем `onClick`, но имя пропа, которое получает ваш пользовательский компонент `Button`, зависит от вас!

Когда ваш компонент поддерживает несколько взаимодействий, вы можете называть пропсы для обработчиков событий в соответствии с конкретными понятиями вашего приложения. Например, компонент `Toolbar` получает обработчики событий `onPlayMovie` и `onUploadImage`:

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

Заметьте, что компонент `App` не должен знать, *что* делает `Toolbar` с `onPlayMovie` или `onUploadImage`. Это детали реализации `Toolbar`. Здесь `Toolbar` передает их в качестве обработчиков `onClick` своим кнопкам, но позже он также может вызывать их по клавиатурному сочетанию. Называние пропсов в соответствии со спецификой вашего приложения, например `onPlayMovie`, дает вам гибкость в изменении их использовании в будущем.

## Всплытие событий {/*event-propagation*/}

Обработчики событий также будут перехватывать события от любых дочерних компонентов вашего компонента. Говорят, что событие "всплывает" или "распространяется" вверх по дереву: оно начинается там, где произошло событие, а затем поднимается вверх по дереву.

Этот `<div>` содержит две кнопки. У `<div>` *и* каждой кнопки есть свои собственные обработчики `onClick`. Какие обработчики вы думаете будут вызваны, когда вы нажмете на кнопку?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Вы нажали на панель инструментов!');
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

Если вы нажмете на любую кнопку, то сначала будет выполнен ее обработчик `onClick`, а затем обработчик `onClick` родительского элемента `<div>`. Таким образом, появится два сообщения. Если вы нажмете на саму панель инструментов, то будет выполнен только обработчик `onClick` родительского элемента `<div>`.

<Pitfall>

В React все события распространяются, за исключением `onScroll`, который работает только на теге JSX, к которому он привязан.

</Pitfall>

### Остановка распространения событий {/*stopping-propagation*/}

Обработчики событий получают **объект события** в качестве единственного аргумента. Этот объект обычно называется `e`, что означает "event". С помощью этого объекта вы можете прочитать информацию о событии.

Объект события также позволяет остановить распространение события. Если вы хотите предотвратить достижение события родительским компонентам, вам необходимо вызвать метод `e.stopPropagation()`, как это делает компонент `Button`:

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
2. Этот обработчик, определенный в компоненте `Button`, выполняет следующее:
   * Вызывает `e.stopPropagation()`, который предотвращает дальнейшее всплытие события.
   * Вызывает функцию `onClick`, которая является пропом, переданным из компонента `Toolbar`.
3. Эта функция, определенная в компоненте Toolbar, выводит всплывающее окно для кнопки.
4. Так как всплытие события было остановлено, обработчик `onClick` родительского элемента `<div>` не будет вызван.

В результате `e.stopPropagation()` нажатие на кнопки теперь вызывает только одно всплывающее окно (из `<button>`), а не два (из `<button>` и родительской панели инструментов `<div>`). Нажатие кнопки не то же самое, что нажатие на панель инструментов, поэтому остановка распространения события имеет смысл для этого интерфейса.

<DeepDive>

#### Перехват событий {/*capture-phase-events*/}

В редких случаях вам может понадобиться перехватывать все события на дочерних элементах, *даже если они остановили распространение*. Например, возможно, вы хотите зарегистрировать каждый клик мыши в аналитике, независимо от логики распространения. Для этого можно добавить `Capture` в конец имени события:

```js
<div onClickCapture={() => { /* это происходит в первую очередь */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Каждое событие распространяется в трех фазах:

1. Оно спускается вниз, вызывая все обработчики `onClickCapture`.
2. Оно вызывает обработчик `onClick` для нажатого элемента.
3. Оно поднимается вверх, вызывая все обработчики `onClick`.

События захвата полезны для кода, такого как роутеры или аналитика, но, вероятно, вы не будете использовать их в приложении.

</DeepDive>

### Передача обработчиков в качестве альтернативы распространению событий {/*passing-handlers-as-alternative-to-propagation*/}

Обратите внимание, как этот обработчик клика выполняет строку кода, _а затем_ вызывает переданный родителем проп `onClick`:

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

Вы также можете добавить больше кода в этот обработчик перед вызовом обработчика событий `onClick` родительского компонента. Этот шаблон обеспечивает *альтернативу* распространению. Он позволяет дочернему компоненту обрабатывать событие, а также позволяет родительскому компоненту указывать дополнительное поведение. В отличие от распространения, это не происходит автоматически. Но преимущество этого шаблона заключается в том, что вы можете четко следить за всей цепочкой кода, который выполняется в результате какого-либо события.

Если вы полагаетесь на распространение, и трудно отследить, какие обработчики выполняются и почему, попробуйте использовать этот подход.

### Предотвращение стандартного поведения {/*preventing-default-behavior*/}

Некоторые события в браузере имеют связанное со стандартным поведением. Например, событие отправки формы `<form>`, которое происходит при нажатии на кнопку внутри нее, по умолчанию перезагружает всю страницу:

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

Вы можете вызвать метод `e.preventDefault()` из объекта события, чтобы предотвратить это:

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

Не путайте `e.stopPropagation()` и `e.preventDefault()`. Оба они полезны, но не связаны между собой:

* [e.stopPropagation()](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) останавливает срабатывание обработчиков событий, привязанных к тегам выше по иерархии DOM.
* [e.preventDefault()](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) предотвращает стандартное поведение браузера для некоторых событий.

## Могут ли обработчики событий иметь побочные эффекты? {/*can-event-handlers-have-side-effects*/}

Конечно! Обработчики событий - это лучшее место для побочных эффектов.

В отличие от функций рендеринга, обработчики событий не обязаны быть [чистыми функциями](/learn/keeping-components-pure), поэтому это отличное место для изменения чего-то - например, изменения значения ввода в ответ на набор текста или изменения списка при нажатии на кнопку. Однако, чтобы изменить какую-то информацию, сначала нужно иметь способ ее хранения. В React для этого используется [состояние компонента - его память](/learn/state-a-components-memory). Вы узнаете об этом на следующей странице.

<Recap>

* Вы можете обрабатывать события, передавая функцию в качестве пропа элементу, например, `<button>`.
* Обработчики событий должны передаваться, а **не вызываться**! Например, `onClick={handleClick}`, а не `onClick={handleClick()}`.
* Вы можете определять функцию обработчика событий отдельно или встроенно.
* Обработчики событий определяются внутри компонента, поэтому они могут получать доступ к свойствам.
* Вы можете объявить обработчик событий в родительском компоненте и передать его в качестве пропа дочернему элементу.
* Вы можете определять свои собственные пропы обработчика событий с именами, специфичными для вашего приложения.
* События всплывают вверх по иерархии элементов. Чтобы предотвратить это, вызовите `e.stopPropagation()`.
* События могут иметь нежелательное поведение по умолчанию браузера. Чтобы предотвратить это, вызовите `e.preventDefault()`.
* Явный вызов свойства обработчика событий из дочернего обработчика - хорошая альтернатива всплытию событий.

</Recap>



<Challenges>

#### Исправление обработчика событий {/*fix-an-event-handler*/}

При нажатии на эту кнопку фон страницы должен переключаться между белым и черным цветами. Однако, ничего не происходит при нажатии на неё. Исправьте эту проблему. (Не беспокойтесь о логике внутри `handleClick` - она в порядке.)

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

Проблема заключается в том, что `<button onClick={handleClick()}>` _вызывает_ функцию `handleClick` при рендеринге, а не _передает_ ее. Удаление вызова `()` так, чтобы оно выглядело как `<button onClick={handleClick}>` решит проблему:

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

В качестве альтернативы, вы можете обернуть вызов в другую функцию, например, `<button onClick={() => handleClick()}>`:

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

#### Подключение обработчиков событий {/*wire-up-the-events*/}

Этот компонент `ColorSwitch` отображает кнопку, которая должна изменять цвет страницы. Подключите её к обработчику событий `onChangeColor`, который он получает от родительского компонента, так что при нажатии на кнопку изменяется цвет страницы.

После выполнения этой задачи вы заметите, что при нажатии на кнопку также увеличивается счетчик кликов на странице. Ваш коллега, который написал родительский компонент, настаивает на том, что `onChangeColor` не должен увеличивать никакие счетчики. Что еще может происходить? Исправьте это, чтобы при нажатии на кнопку _менялся_ только цвет, и _не_ увеличивался счетчик.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
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

<Solution>

Сначала вам нужно добавить обработчик событий, например, `<button onClick={onChangeColor}>`.

Однако, возникает проблема с увеличением счетчика при нажатии на кнопку. Если `onChangeColor` не увеличивает счетчик, как настаивает ваш коллега, то проблема заключается в том, что это событие передается родительским элементам и один из этих элементов увеличивает счетчик. Чтобы решить эту проблему, необходимо остановить всплытие события, но при этом не забыть вызвать `onChangeColor`.

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
