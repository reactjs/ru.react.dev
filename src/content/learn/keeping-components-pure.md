---
title: Keeping Components Pure
---

<Intro>

Некоторые JavaScript-функции являются *чистыми*. Чистые функции только выполняют вычисления и ничего более. Строго следуя этому правилу при написании компонентов, вы сможете избежать целого класса запутанных ошибок и непредсказуемого поведения по мере роста вашей кодовой базы. Однако, чтобы получить эти преимущества, вы должны соблюдать несколько правил.

</Intro>

<YouWillLearn>

* Что такое чистота и как она помогает избежать ошибок
* Как сохранять компоненты чистыми, не внося изменений во время фазы рендеринга
* Как использовать Strict Mode для поиска ошибок в ваших компонентах

</YouWillLearn>

## Чистота: компоненты как формулы {/*purity-components-as-formulas*/}

В информатике (и особенно в мире функционального программирования) [чистая функция](https://wikipedia.org/wiki/Pure_function) — это функция, обладающая следующими характеристиками:

* **Она занимается своим делом.** Она не изменяет никакие объекты или переменные, которые существовали до её вызова.
* **Одинаковые входные данные — одинаковый результат.** При одинаковых входных данных чистая функция всегда должна возвращать один и тот же результат.

Возможно, вы уже знакомы с одним примером чистых функций: математическими формулами.

Рассмотрим эту математическую формулу: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Если <Math><MathI>x</MathI> = 2</Math>, то <Math><MathI>y</MathI> = 4</Math>. Всегда.

Если <Math><MathI>x</MathI> = 3</Math>, то <Math><MathI>y</MathI> = 6</Math>. Всегда.

Если <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> не будет иногда равняться <Math>9</Math>, <Math>–1</Math> или <Math>2.5</Math> в зависимости от времени суток или состояния фондового рынка.

Если <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> и <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> _всегда_ будет <Math>6</Math>.

Если бы мы преобразовали это в JavaScript-функцию, она выглядела бы так:

```js
function double(number) {
  return 2 * number;
}
```

В приведенном выше примере `double` — это **чистая функция.** Если вы передадите ей `3`, она вернёт `6`. Всегда.

React разработан на основе этой концепции. **React предполагает, что каждый компонент, который вы пишете, является чистой функцией.** Это означает, что компоненты React, которые вы пишете, должны всегда возвращать один и тот же JSX при одинаковых входных данных:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Когда вы передаёте `drinkers={2}` в `Recipe`, он вернёт JSX, содержащий `2 cups of water`. Всегда.

Если вы передаёте `drinkers={4}`, он вернёт JSX, содержащий `4 cups of water`. Всегда.

Точно так же, как математическая формула.

Вы можете думать о своих компонентах как о рецептах: если вы будете им следовать и не вводить новые ингредиенты в процессе приготовления, вы каждый раз будете получать одно и то же блюдо. Это «блюдо» — JSX, который компонент предоставляет React для [рендеринга.](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## Побочные эффекты: (не)преднамеренные последствия {/*side-effects-unintended-consequences*/}

Процесс рендеринга React всегда должен быть чистым. Компоненты должны только *возвращать* свой JSX и не *изменять* никакие объекты или переменные, которые существовали до рендеринга — это сделало бы их нечистыми!

Вот компонент, который нарушает это правило:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Плохо: изменение существующей переменной!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Этот компонент читает и записывает переменную `guest`, объявленную вне его. Это означает, что **многократный вызов этого компонента приведёт к разному JSX!** Более того, если _другие_ компоненты читают `guest`, они тоже будут производить разный JSX, в зависимости от того, когда они были отрендерены! Это непредсказуемо.

Возвращаясь к нашей формуле <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, теперь, даже если <Math><MathI>x</MathI> = 2</Math>, мы не можем быть уверены, что <Math><MathI>y</MathI> = 4</Math>. Наши тесты могут провалиться, наши пользователи будут сбиты с толку, самолёты будут падать с неба — вы видите, как это может привести к запутанным ошибкам!

Вы можете исправить этот компонент, [передав `guest` в качестве пропса вместо этого](/learn/passing-props-to-a-component):

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

Теперь ваш компонент чист, так как возвращаемый им JSX зависит только от пропса `guest`.

В общем случае, вы не должны ожидать, что ваши компоненты будут рендериться в каком-либо определённом порядке. Не имеет значения, вызываете ли вы <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> до или после <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: обе формулы решаются независимо друг от друга. Точно так же каждый компонент должен "думать сам за себя" и не пытаться координировать или зависеть от других во время рендеринга. Рендеринг — это как экзамен в школе: каждый компонент должен самостоятельно вычислять JSX!

<DeepDive>

#### Обнаружение нечистых вычислений с помощью StrictMode {/*detecting-impure-calculations-with-strict-mode*/}

Хотя вы, возможно, ещё не использовали их все, в React есть три типа входных данных, которые вы можете читать во время рендеринга: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory) и [context.](/learn/passing-data-deeply-with-context) Вы всегда должны относиться к этим входным данным как к только для чтения.

Когда вы хотите *изменить* что-то в ответ на ввод пользователя, вы должны [установить состояние](/learn/state-a-components-memory) вместо записи в переменную. Вы никогда не должны изменять существующие переменные или объекты во время рендеринга компонента.

React предлагает "Strict Mode", в котором он дважды вызывает функцию каждого компонента во время разработки. **Вызывая функции компонентов дважды, Strict Mode помогает находить компоненты, нарушающие эти правила.**

Обратите внимание, как в исходном примере вместо "Guest #1", "Guest #2" и "Guest #3" отображалось "Guest #2", "Guest #4" и "Guest #6". Исходная функция была нечистой, поэтому её двукратный вызов нарушил её работу. Но исправленная чистая версия работает, даже если функция вызывается дважды каждый раз. **Чистые функции только вычисляют, поэтому их двукратный вызов ничего не изменит** — точно так же, как двукратный вызов `double(2)` не меняет возвращаемое значение, и двукратное решение <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> не меняет <MathI>y</MathI>. Одинаковые входные данные, одинаковые выходные данные. Всегда.

Strict Mode не оказывает никакого влияния в продакшене, поэтому он не замедляет работу приложения для ваших пользователей. Чтобы включить Strict Mode, вы можете обернуть ваш корневой компонент в `<React.StrictMode>`. Некоторые фреймворки делают это по умолчанию.

</DeepDive>

### Локальное изменение: маленький секрет вашего компонента {/*local-mutation-your-components-little-secret*/}

В приведенном выше примере проблема заключалась в том, что компонент изменял *существующую* переменную во время рендеринга. Это часто называют **"мутацией"**, чтобы это звучало немного страшнее. Чистые функции не мутируют переменные вне области видимости функции или объекты, которые были созданы до вызова — это делает их нечистыми!

Однако, **полностью допустимо изменять переменные и объекты, которые вы *только что* создали во время рендеринга.** В этом примере вы создаёте массив `[]`, присваиваете его переменной `cups`, а затем добавляете в него дюжину чашек с помощью `push`:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Если бы переменная `cups` или массив `[]` были созданы вне функции `TeaGathering`, это было бы огромной проблемой! Вы бы изменяли *существующий* объект, добавляя элементы в этот массив.

Однако это допустимо, потому что вы создали их *во время того же рендеринга*, внутри `TeaGathering`. Никакой код вне `TeaGathering` никогда не узнает об этом. Это называется **"локальной мутацией"** — это как маленький секрет вашего компонента.

## Где вы _можете_ вызывать побочные эффекты {/*where-you-_can_-cause-side-effects*/}

Хотя функциональное программирование в значительной степени опирается на чистоту, в какой-то момент, где-то, _что-то_ должно измениться. В этом и заключается суть программирования! Эти изменения — обновление экрана, запуск анимации, изменение данных — называются **побочными эффектами.** Это вещи, которые происходят _"попутно"_, а не во время рендеринга.

В React **побочные эффекты обычно принадлежат [обработчикам событий.](/learn/responding-to-events)** Обработчики событий — это функции, которые React запускает, когда вы выполняете какое-либо действие — например, когда нажимаете кнопку. Несмотря на то, что обработчики событий определены *внутри* вашего компонента, они не выполняются *во время* рендеринга! **Поэтому обработчики событий не должны быть чистыми.**

Если вы исчерпали все другие варианты и не можете найти подходящий обработчик событий для вашего побочного эффекта, вы все равно можете прикрепить его к возвращаемому JSX с помощью вызова [`useEffect`](/reference/react/useEffect) в вашем компоненте. Это говорит React выполнить его позже, после рендеринга, когда побочные эффекты разрешены. **Однако этот подход должен быть вашей последней мерой.**

По возможности старайтесь выражать свою логику только с помощью рендеринга. Вы будете удивлены, как далеко это вас заведет!

<DeepDive>

#### Почему React заботится о чистоте? {/*why-does-react-care-about-purity*/}

Написание чистых функций требует некоторой привычки и дисциплины. Но это также открывает удивительные возможности:

* Ваши компоненты могут выполняться в другой среде — например, на сервере! Поскольку они возвращают одинаковый результат для одинаковых входных данных, один компонент может обслуживать множество пользовательских запросов.
* Вы можете повысить производительность, [пропуская рендеринг](/reference/react/memo) компонентов, чьи входные данные не изменились. Это безопасно, потому что чистые функции всегда возвращают одинаковые результаты, поэтому их безопасно кэшировать.
* Если какие-то данные изменяются в середине рендеринга глубокого дерева компонентов, React может перезапустить рендеринг, не тратя время на завершение устаревшего рендеринга. Чистота делает безопасным остановку вычислений в любой момент.

Каждая новая функция React, которую мы создаем, использует чистоту. От получения данных до анимации и производительности — сохранение чистоты компонентов раскрывает мощь парадигмы React.

</DeepDive>

<Recap>

* Компонент должен быть чистым, что означает:
  * **Он занимается своим делом.** Он не должен изменять никакие объекты или переменные, которые существовали до рендеринга.
  * **Одинаковые входные данные — одинаковый результат.** При одинаковых входных данных компонент всегда должен возвращать один и тот же JSX.
* Рендеринг может происходить в любое время, поэтому компоненты не должны зависеть от последовательности рендеринга друг друга.
* Вы не должны мутировать никакие входные данные, которые ваши компоненты используют для рендеринга. Это включает пропсы, состояние и контекст. Чтобы обновить экран, ["устанавливайте" состояние](/learn/state-a-components-memory) вместо мутации существующих объектов.
* Старайтесь выражать логику вашего компонента в возвращаемом JSX. Когда вам нужно "изменить вещи", вы обычно захотите сделать это в обработчике событий. В крайнем случае, вы можете использовать `useEffect`.
* Написание чистых функций требует некоторой практики, но это раскрывает мощь парадигмы React.

</Recap>


  
<Challenges>

#### Исправьте сломанные часы {/*fix-a-broken-clock*/}

Этот компонент пытается установить CSS-класс `<h1>` в `"night"` в период с полуночи до шести часов утра и `"day"` в остальное время. Однако это не работает. Можете ли вы исправить этот компонент?

Вы можете проверить, работает ли ваше решение, временно изменив часовой пояс компьютера. Когда текущее время находится между полуночью и шестью утра, часы должны иметь инвертированные цвета!

<Hint>

Рендеринг — это *вычисление*, он не должен пытаться "делать" вещи. Можете ли вы выразить ту же идею по-другому?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Вы можете исправить этот компонент, вычислив `className` и включив его в вывод рендеринга:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

В этом примере побочный эффект (модификация DOM) был совершенно не нужен. Вам нужно было только вернуть JSX.

</Solution>

#### Исправьте сломанный профиль {/*fix-a-broken-profile*/}

Два компонента `Profile` рендерятся бок о бок с разными данными. Нажмите "Collapse" на первом профиле, а затем "Expand" его. Вы заметите, что оба профиля теперь показывают одного и того же человека. Это ошибка.

Найдите причину ошибки и исправьте её.

<Hint>

Ошибка находится в `Profile.js`. Убедитесь, что вы прочитали его от начала до конца!

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

Проблема в том, что компонент `Profile` записывает в существующую переменную `currentPerson`, а компоненты `Header` и `Avatar` читают из неё. Это делает *всех троих* нечистыми и трудными для предсказания.

Чтобы исправить ошибку, удалите переменную `currentPerson`. Вместо этого передайте всю информацию из `Profile` в `Header` и `Avatar` через пропсы. Вам нужно будет добавить пропс `person` обоим компонентам и передать его вниз.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Помните, что React не гарантирует, что функции компонентов будут выполняться в каком-либо определённом порядке, поэтому вы не можете обмениваться данными между ними, устанавливая переменные. Всё общение должно происходить через пропсы.

</Solution>

#### Исправьте сломанный трей историй {/*fix-a-broken-story-tray*/}

Генеральный директор вашей компании просит вас добавить "истории" в ваше приложение с онлайн-часами, и вы не можете отказаться. Вы написали компонент `StoryTray`, который принимает список `stories`, а затем плейсхолдер "Create Story".

Вы реализовали плейсхолдер "Create Story", добавив ещё одну фиктивную историю в конец массива `stories`, который вы получаете как пропс. Но по какой-то причине "Create Story" появляется более одного раза. Исправьте проблему.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Обратите внимание, что каждый раз, когда часы обновляются, "Create Story" добавляется *дважды*. Это служит подсказкой, что у нас есть мутация во время рендеринга — Strict Mode вызывает компоненты дважды, чтобы сделать эти проблемы более заметными.

Функция `StoryTray` не является чистой. Вызывая `push` для полученного массива `stories` (пропс!), она мутирует объект, который был создан *до* начала рендеринга `StoryTray`. Это делает её ошибочной и очень трудной для предсказания.

Самое простое исправление — не трогать массив вообще и рендерить "Create Story" отдельно:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Альтернативно, вы можете создать _новый_ массив (скопировав существующий) перед тем, как добавить в него элемент:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Скопируйте массив!
  let storiesToDisplay = stories.slice();

  // Не влияет на исходный массив:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Это сохраняет вашу мутацию локальной, а функцию рендеринга — чистой. Однако вам всё равно нужно быть осторожным: например, если вы попытаетесь изменить какие-либо существующие элементы массива, вам придётся клонировать и их.

Полезно помнить, какие операции с массивами мутируют их, а какие нет. Например, `push`, `pop`, `reverse` и `sort` мутируют исходный массив, а `slice`, `filter` и `map` создают новый.

</Solution>

</Challenges>
