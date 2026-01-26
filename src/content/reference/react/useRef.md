---
title: useRef
---

<Intro>

`useRef` – хук в React, позволяющий хранить ссылку на значение, которое не нужно рендерить.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Вызовите `useRef` на верхнем уровне компонента, чтобы объявить один или несколько [рефов](/learn/referencing-values-with-refs):

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `initialValue`: Изначальное значение, которое будет присвоено свойству `current` при первом рендере. Оно может быть любого типа. При всех последующих рендерах значение этого аргумента будет игнорироваться.

#### Возвращаемое значение {/*returns*/}

`useRef` возвращает объект с одним единственным свойством:

* `current`: Изначально оно равно `initialValue`. В дальнейшем ему можно присвоить другое значение. Если передать созданный при помощи `useRef` объект в качестве атрибута `ref` любому JSX-узлу, React автоматически установит свойство `current`.

При всех последующих рендерах `useRef` будет возвращать один и тот же объект.

#### Предостережения {/*caveats*/}

* В отличие от состояния свойство `ref.current` можно изменять напрямую. Однако если в нём хранится объект, использующийся для рендера (например, часть состояния), тогда этот объект изменять не стоит.
* При изменении свойства `ref.current` React не рендерит компонент повторно. Поскольку реф это простой JavaScript-объект, React ничего не знает о его изменениях.
* Не стоит перезаписывать или считывать `ref.current` во время рендера, за исключением [первоначальной инициализации](#avoiding-recreating-the-ref-contents). Это может привести к непредсказуемому поведению компонента.
* В строгом режиме React вызовет функцию компонента дважды, чтобы [помочь обнаружить возможные побочные эффекты](#my-initializer-or-updater-function-runs-twice). Это поведение существует только в режиме разработки и никак не проявляется в продакшене. Каждый реф будет создан дважды, но одна из версий будет отброшена. Если функция вашего компонента является чистой (как и следует), это никак не должно повлиять на его поведение.

---

## Использование {/*usage*/}

### Хранение ссылки на значение при помощи рефов {/*referencing-a-value-with-a-ref*/}

Вызовите `useRef` на верхнем уровне компонента, чтобы объявить [реф](/learn/referencing-values-with-refs):

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` возвращает <CodeStep step={1}>объект</CodeStep> с одним единственным свойством <CodeStep step={2}>`current`</CodeStep>, которое изначально равно переданному в `useRef` <CodeStep step={3}>значению</CodeStep>.

При последующих рендерах `useRef` будет возвращать один и тот же объект, чьё свойство `current` можно считывать и перезаписывать. Это похоже на [состояние](/reference/react/useState), однако между состоянием и рефом существует одно важное отличие.

**Изменение рефа не вызывает ререндер**. Таким образом, рефы идеально подходят для хранения информации, которая не оказывает никакого влияния на визуальную составляющую компонента (например, в реф можно положить [`intervalId`](https://developer.mozilla.org/ru/docs/Web/API/setInterval)). Чтобы обновить значение внутри рефа, нужно вручную изменить его свойство <CodeStep step={2}>`current`</CodeStep>:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

В дальнейшем этот `intervalId` можно будет считать и использовать для [очистки интервала](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Используя рефы, можно быть уверенными в том, что:

- Информация хранится **между ререндерами** (в отличие от обычных переменных, которые сбрасываются при каждом ререндере).
- Изменение рефа **не вызывает ререндер** (в отличие от состояния, изменение которого вызывает ререндер).
- **Информация является локальной** для каждой копии компонента (в отличие от внешних переменных, которые являются общими для всех).

Поскольку изменения рефов не вызывают ререндер, они не подходят для хранения информации, которую нужно отображать на экране. Для этого лучше использовать состояние.

Подробнее о [выборе между `useRef` и `useState`](/learn/referencing-values-with-refs#differences-between-refs-and-state).

<Recipes titleText="Примеры использования useRef" titleId="examples-value">

#### Счётчик нажатий {/*click-counter*/}

Компонент ниже отслеживает количество нажатий кнопки. В нём использование рефа (а не состояния) уместно, поскольку счётчик нажатий считывается и перезаписывается только внутри обработчиков событий.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Вы нажали ' + ref.current + ' раз(а)!');
  }

  return (
    <button onClick={handleClick}>
      Нажми!
    </button>
  );
}
```

</Sandpack>

При этом если отобразить `{ref.current}` в JSX, то счётчик не будет обновляться по нажатию, поскольку изменение `ref.current` не вызывает ререндер. Информацию, которую необходимо отображать на экране, следует хранить в состоянии.

<Solution />

#### Секундомер {/*a-stopwatch*/}

В этом примере состояние и реф используются вместе. Переменные `startTime` и `now` являются переменными состояния, поскольку они используются для рендера. При этом, чтобы иметь возможность остановить интервал по нажатию кнопки, нужно где-то хранить [`intervalId`](https://developer.mozilla.org/ru/docs/Web/API/setInterval). Так как `intervalId` не используется для рендера, его уместно хранить в рефе и обновлять вручную.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Прошло времени: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Старт
      </button>
      <button onClick={handleStop}>
        Стоп
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**Не перезаписывайте и _не считывайте_ `ref.current` во время рендера.**

React ожидает, что компоненты будут [вести себя как чистые функции](/learn/keeping-components-pure):

- Для одинакового набора входных данных ([пропсов](/learn/passing-props-to-a-component), [состояния](/learn/state-a-components-memory) и [контекста](/learn/passing-data-deeply-with-context)), компонент всегда должен возвращать одинаковый JSX.
- Вызов компонента в другом порядке или с другими аргументами не должен повлиять на результаты других вызовов.

Перезаписывание или считывание рефа **во время рендера** не оправдывает эти ожидания.

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Не перезаписывайте рефы во время рендера
  myRef.current = 123;
  // ...
  // 🚩 Не считывайте рефы во время рендера
  return <h1>{myOtherRef.current}</h1>;
}
```

Рефы можно считывать или перезаписывать **в обработчиках событий или эффектах**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Можно считывать и перезаписывать рефы в эффектах
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Можно считывать и перезаписывать рефы в обработчиках событий
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Если вам *необходимо* что-то считать [или перезаписать](/reference/react/useState#storing-information-from-previous-renders) во время рендера, то вместо рефа стоит использовать [состояние](/reference/react/useState).

Хотя при нарушении этих правил компонент всё ещё может работать, большинство нововведений, которые мы добавляем в React, будут полагаться именно на них. Больше о сохранении компонентов чистыми [тут](/learn/keeping-components-pure#where-you-_can_-cause-side-effects).

</Pitfall>

---

### Управление DOM при помощи рефов {/*manipulating-the-dom-with-a-ref*/}

Особенно часто рефы используются для управления [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API)-узлами.

Для этого нужно создать <CodeStep step={1}>объект рефа</CodeStep> с <CodeStep step={3}>изначальным значением</CodeStep> `null`:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

И затем передать его как атрибут `ref` в тот JSX, чьим DOM-узлом вы хотите управлять:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

После того как React создаст DOM-узел и отобразит его на экране, ссылка на него будет сохранена в свойство <CodeStep step={2}>`current`</CodeStep>. Теперь при помощи рефа можно получать доступ к DOM-узлу `<input>` и вызывать различные его методы. Например, [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React установит свойство `current` обратно в `null`, если DOM-узел будет удалён.

Больше про [управление DOM при помощи рефов](/learn/manipulating-the-dom-with-refs).

<Recipes titleText="Примеры управления DOM при помощи useRef" titleId="examples-dom">

#### Фокусировка input {/*focusing-a-text-input*/}

В этом примере нажатие кнопки сфокусирует input:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Сфокусировать input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Прокрутка изображения в область видимости {/*scrolling-an-image-into-view*/}

В этом примере нажатие кнопки прокрутит изображение в область видимости. Здесь в рефе хранится ссылка на DOM-узел списка. У него затем вызывается метод [`querySelectorAll`](https://developer.mozilla.org/ru/docs/Web/API/Document/querySelectorAll), чтобы найти то изображение, которое нужно прокрутить в область видимости.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // Эта строчка предполагает определённую структуру DOM:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Воспроизведение и приостановка видео {/*playing-and-pausing-a-video*/}

В этом примере реф используется для вызова методов [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) и [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) у DOM-узла `<video>`.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Приостановить' : 'Воспроизвести'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Передача рефа в пользовательский компонент {/*exposing-a-ref-to-your-own-component*/}

Иногда может понадобиться управлять DOM-узлом дочернего компонента из родительского. Например, если вы разрабатываете компонент `MyInput` и хотите дать возможность родительскому компоненту фокусировать `<input>` (к которому родитель не имеет доступа), то можно создать `реф` в родительском компоненте и передать `реф` как проп в дочерний компонент. Подробнее об этом в [пошаговом руководстве](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes).

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Сфокусировать input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Избежание пересоздания содержимого рефов {/*avoiding-recreating-the-ref-contents*/}

React сохраняет изначальное значение рефа один раз и при последующих рендерах игнорирует его.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Хотя результат вызова `new VideoPlayer()` используется только при первоначальном рендере, эта функция всё ещё вызывается при всех последующих рендерах. Такое поведение может быть ресурсозатратным, если речь идёт о создании дорогостоящих объектов.

Чтобы этого избежать, реф можно инициализировать вот так:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Хотя перезаписывать или считывать `ref.current` во время рендера не разрешено, в этом случае это нормально, поскольку результат всегда один и тот же, и условие выполняется только во время инициализации (что полностью предсказуемо).

<DeepDive>

#### Как инициализировать реф позднее в коде и избежать проверок на null {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Если в вашем проекте есть проверка типов и вы не хотите постоянно проверять значение на `null`, можно воспользоваться следующим паттерном:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

В примере выше `playerRef` может принимать значение `null`. При этом можно убедить тайп-чекер в том, что `getPlayer()` никогда не возвратит `null`, и использовать в обработчиках событий именно его.

</DeepDive>

---

## Диагностика неполадок {/*troubleshooting*/}

### Не могу передать реф в свой компонент {/*i-cant-get-a-ref-to-a-custom-component*/}

Если передавать `ref` в свой компонент так:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

То можно получить такую ошибку:

<ConsoleBlock level="error">

TypeError: Cannot read properties of null

</ConsoleBlock>

По умолчанию пользовательские компоненты не передают рефы ни на какие DOM-узлы внутри них.

Чтобы это исправить, сперва найдите компонент, которому хотите передать реф:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

<<<<<<< HEAD
И затем добавьте `реф` в список пропов вашего компонента и передайте `ref` как проп в нужный дочерний [встроенный компонент](/reference/react-dom/components/common):
=======
And then add `ref` to the list of props your component accepts and pass `ref` as a prop to the relevant child [built-in component](/reference/react-dom/components/common) like this:
>>>>>>> a1ddcf51a08cc161182b90a24b409ba11289f73e

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

Теперь родительский компонент может передать реф в `MyInput` и получить доступ к его DOM-узлу `<input>`.

Больше о [получении доступа к DOM-узлам других компонентов](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes).
