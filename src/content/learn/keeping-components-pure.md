---
title: Чистота компонентов
---

<Intro>

Некоторые функции JavaScript являются *чистыми*. Чистые функции только выполняют вычисления и ничего более. Строго следуя этому правилу при написании компонентов, вы можете избежать целого класса запутанных ошибок и непредсказуемого поведения по мере роста вашей кодовой базы. Чтобы получить эти преимущества, вы должны соблюдать несколько правил.

</Intro>

<YouWillLearn>

* Что такое чистота и как она помогает избежать ошибок
* Как сохранять чистоту компонентов, не внося изменений во время рендеринга
* Как использовать Strict Mode для поиска ошибок в компонентах

</YouWillLearn>

## Чистота: компоненты как формулы {/*purity-components-as-formulas*/}

В информатике (и особенно в мире функционального программирования) [чистая функция](https://ru.wikipedia.org/wiki/%D0%A7%D0%B8%D1%81%D1%82%D0%B0%D1%8F_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F) — это функция, обладающая следующими характеристиками:

* **Она занимается своим делом.** Она не изменяет никакие объекты или переменные, которые существовали до её вызова.
* **Те же входные данные, тот же результат.** При одинаковых входных данных чистая функция всегда должна возвращать один и тот же результат.

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

В приведенном выше примере `double` — это **чистая функция**. Если вы передадите ей `3`, она вернет `6`. Всегда.

React спроектирован на основе этой концепции. **React предполагает, что каждый компонент, который вы пишете, является чистой функцией.** Это означает, что компоненты React, которые вы пишете, должны всегда возвращать один и тот же JSX при одинаковых входных данных:

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

Когда вы передаете `drinkers={2}` в `Recipe`, он возвращает JSX, содержащий `2 cups of water`. Всегда.

Если вы передаете `drinkers={4}`, он возвращает JSX, содержащий `4 cups of water`. Всегда.

Точно так же, как математическая формула.

Вы можете думать о своих компонентах как о рецептах: если вы будете им следовать и не будете вводить новые ингредиенты в процессе приготовления, вы каждый раз получите одно и то же блюдо. Это "блюдо" — JSX, который компонент предоставляет React для [рендеринга](/learn/render-and-commit).

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="Рецепт чая для x человек: взять x стаканов воды, добавить x ложек чая и 0.5x ложек специй, и 0.5x стаканов молока" />

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

Этот компонент читает и записывает переменную `guest`, объявленную вне его. Это означает, что **многократный вызов этого компонента приведет к разному JSX!** Более того, если _другие_ компоненты читают `guest`, они тоже будут возвращать разный JSX, в зависимости от того, когда они были отрендерены! Это непредсказуемо.

Возвращаясь к нашей формуле <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, теперь, даже если <Math><MathI>x</MathI> = 2</Math>, мы не можем быть уверены, что <Math><MathI>y</MathI> = 4</Math>. Наши тесты могут падать, наши пользователи будут сбиты с толку, самолеты будут падать с неба — вы видите, как это может привести к запутанным ошибкам!

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

В общем случае, вы не должны ожидать, что ваши компоненты будут рендериться в каком-либо определенном порядке. Не имеет значения, вызываете ли вы <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> до или после <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: обе формулы вычисляются независимо друг от друга. Точно так же каждый компонент должен "думать сам за себя" и не пытаться координироваться с другими или зависеть от них во время рендеринга. Рендеринг — это как школьный экзамен: каждый компонент должен самостоятельно вычислять JSX!

<DeepDive>

#### Обнаружение нечистых вычислений с помощью StrictMode {/*detecting-impure-calculations-with-strict-mode*/}

Хотя вы, возможно, еще не использовали их все, в React есть три типа входных данных, которые вы можете читать во время рендеринга: [пропсы](/learn/passing-props-to-a-component), [состояние](/learn/state-a-components-memory) и [контекст.](/learn/passing-data-deeply-with-context) Вы всегда должны относиться к этим входным данным как к только для чтения.

Когда вы хотите *изменить* что-то в ответ на ввод пользователя, вы должны [установить состояние](/learn/state-a-components-memory) вместо записи в переменную. Вы никогда не должны изменять существующие переменные или объекты во время рендеринга компонента.

React предлагает "Strict Mode", в котором он дважды вызывает функцию каждого компонента во время разработки. **Вызывая функции компонентов дважды, Strict Mode помогает находить компоненты, нарушающие эти правила.**

Обратите внимание, как в исходном примере отображалось "Guest #2", "Guest #4" и "Guest #6" вместо "Guest #1", "Guest #2" и "Guest #3". Исходная функция была нечистой, поэтому ее вызов дважды сломал ее. Но исправленная чистая версия работает, даже если функция вызывается дважды каждый раз. **Чистые функции только вычисляют, поэтому их вызов дважды ничего не изменит** — точно так же, как вызов `double(2)` дважды не меняет возвращаемое значение, и решение <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> дважды не меняет значение <MathI>y</MathI>. Те же входные данные, тот же результат. Всегда.

Strict Mode не оказывает никакого влияния в продакшене, поэтому он не замедлит работу приложения для ваших пользователей. Чтобы включить Strict Mode, вы можете обернуть ваш корневой компонент в `<React.StrictMode>`. Некоторые фреймворки делают это по умолчанию.

</DeepDive>

### Локальное изменение: маленький секрет вашего компонента {/*local-mutation-your-components-little-secret*/}

В приведенном выше примере проблема заключалась в том, что компонент изменял *существующую* переменную во время рендеринга. Это часто называют **"мутацией"**, чтобы это звучало немного страшнее. Чистые функции не изменяют переменные вне области видимости функции или объекты, которые были созданы до вызова — это делает их нечистыми!

Однако, **совершенно нормально изменять переменные и объекты, которые вы *только что* создали во время рендеринга.** В этом примере вы создаете массив `[]`, присваиваете его переменной `cups`, а затем добавляете в него дюжину чашек с помощью `push`:

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

Однако это нормально, потому что вы создали их *во время того же рендеринга*, внутри `TeaGathering`. Никакой код вне `TeaGathering` никогда не узнает, что это произошло. Это называется **"локальной мутацией"** — это как маленький секрет вашего компонента.

## Где можно вызывать побочные эффекты {/*where-you-_can_-cause-side-effects*/}

Хотя функциональное программирование сильно полагается на чистоту, в какой-то момент где-то _что-то_ должно измениться. В

#### Исправьте сломанный трей историй {/*fix-a-broken-story-tray*/}

Генеральный директор вашей компании просит вас добавить "истории" в ваше приложение для онлайн-часов, и вы не можете отказаться. Вы написали компонент `StoryTray`, который принимает список `stories`, а затем плейсхолдер "Создать историю".

Вы реализовали плейсхолдер "Создать историю", добавив в конец массива `stories`, который вы получаете как пропс, ещё одну фейковую историю. Но по какой-то причине "Создать историю" появляется более одного раза. Исправьте проблему.

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

Обратите внимание, что каждый раз, когда часы обновляются, "Создать историю" добавляется *дважды*. Это намекает на то, что у нас есть мутация во время рендеринга — Strict Mode вызывает компоненты дважды, чтобы сделать эти проблемы более заметными.

Функция `StoryTray` не является чистой. Вызывая `push` для полученного массива `stories` (пропса!), она мутирует объект, который был создан *до* того, как `StoryTray` начал рендеринг. Это делает её глючной и очень сложной для предсказания.

Самый простой способ исправить — не трогать массив вообще и отрисовать "Создать историю" отдельно:

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

Альтернативно, вы можете создать *новый* массив (скопировав существующий) перед тем, как добавить в него элемент:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
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

Это сохраняет вашу мутацию локальной, а функцию рендеринга — чистой. Однако вам всё равно нужно быть осторожным: например, если бы вы попытались изменить какие-либо существующие элементы массива, вам пришлось бы клонировать и их.

Полезно помнить, какие операции с массивами мутируют их, а какие нет. Например, `push`, `pop`, `reverse` и `sort` мутируют исходный массив, а `slice`, `filter` и `map` создают новый.

</Solution>

</Challenges>