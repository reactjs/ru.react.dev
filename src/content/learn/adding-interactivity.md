---
title: Adding Interactivity
---

<Intro>

Некоторые элементы на экране обновляются в ответ на ввод пользователя. Например, нажатие на галерею изображений переключает активное изображение. В React данные, которые изменяются со временем, называются *состоянием* (state). Вы можете добавить состояние в любой компонент и обновлять его по мере необходимости. В этой главе вы узнаете, как писать компоненты, которые обрабатывают взаимодействия, обновляют свое состояние и отображают различный вывод со временем.

</Intro>

<YouWillLearn isChapter={true}>

* [Как обрабатывать события, инициированные пользователем](/learn/responding-to-events)
* [Как заставить компоненты "помнить" информацию с помощью состояния](/learn/state-a-components-memory)
* [Как React обновляет пользовательский интерфейс в две фазы](/learn/render-and-commit)
* [Почему состояние не обновляется сразу после его изменения](/learn/state-as-a-snapshot)
* [Как ставить в очередь несколько обновлений состояния](/learn/queueing-a-series-of-state-updates)
* [Как обновлять объект в состоянии](/learn/updating-objects-in-state)
* [Как обновлять массив в состоянии](/learn/updating-arrays-in-state)

</YouWillLearn>

## Обработка событий {/*responding-to-events*/}

React позволяет добавлять *обработчики событий* (event handlers) в ваш JSX. Обработчики событий — это ваши собственные функции, которые будут вызываться в ответ на действия пользователя, такие как клики, наведение курсора, фокусировка на полях ввода и так далее.

Встроенные компоненты, такие как `<button>`, поддерживают только встроенные события браузера, например `onClick`. Однако вы можете создавать и свои собственные компоненты и давать их пропсам обработчиков событий любые имена, специфичные для вашего приложения.

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

<LearnMore path="/learn/responding-to-events">

Прочтите **[Обработка событий](/learn/responding-to-events)**, чтобы узнать, как добавлять обработчики событий.

</LearnMore>

## Состояние: память компонента {/*state-a-components-memory*/}

Компонентам часто нужно изменять то, что отображается на экране, в результате взаимодействия. Ввод текста в форму должен обновлять поле ввода, нажатие кнопки "далее" в карусели изображений должно изменять отображаемое изображение, нажатие кнопки "купить" добавляет товар в корзину. Компонентам нужно "помнить" вещи: текущее значение ввода, текущее изображение, содержимое корзины. В React такая специфичная для компонента память называется *состоянием* (state).

Вы можете добавить состояние в компонент с помощью хука [`useState`](/reference/react/useState). *Хуки* — это специальные функции, которые позволяют вашим компонентам использовать возможности React (состояние — одна из таких возможностей). Хук `useState` позволяет объявить переменную состояния. Он принимает начальное состояние и возвращает пару значений: текущее состояние и функцию для установки состояния, которая позволяет его обновлять.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Вот как галерея изображений использует и обновляет состояние при клике:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Прочтите **[Состояние: память компонента](/learn/state-a-components-memory)**, чтобы узнать, как запоминать значение и обновлять его при взаимодействии.

</LearnMore>

## Рендер и коммит {/*render-and-commit*/}

Прежде чем ваши компоненты будут отображены на экране, они должны быть отрендерены React. Понимание шагов этого процесса поможет вам разобраться, как выполняется ваш код, и объяснить его поведение.

Представьте, что ваши компоненты — это повара на кухне, готовящие вкусные блюда из ингредиентов. В этом сценарии React — это официант, который принимает заказы от клиентов и доставляет им их блюда. Этот процесс запроса и подачи пользовательского интерфейса состоит из трех шагов:

1. **Запуск** рендера (доставка заказа клиента на кухню)
2. **Рендер** компонента (приготовление заказа на кухне)
3. **Коммит** в DOM (подача заказа клиенту за столик)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Прочтите **[Рендер и коммит](/learn/render-and-commit)**, чтобы узнать о жизненном цикле обновления пользовательского интерфейса.

</LearnMore>

## Состояние как снимок {/*state-as-a-snapshot*/}

В отличие от обычных переменных JavaScript, состояние React ведет себя скорее как снимок. Его установка не изменяет уже существующую переменную состояния, а вместо этого запускает повторный рендер. Это может быть неожиданно на первый взгляд!

```js
console.log(count);  // 0
setCount(count + 1); // Запрос повторного рендера с 1
console.log(count);  // Все еще 0!
```

Такое поведение помогает избежать тонких ошибок. Вот небольшое приложение для чата. Попробуйте угадать, что произойдет, если сначала нажать "Send", а *затем* сменить получателя на Bob. Чье имя появится в `alert` через пять секунд?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Прочтите **[Состояние как снимок](/learn/state-as-a-snapshot)**, чтобы узнать, почему состояние кажется "фиксированным" и неизменным внутри обработчиков событий.

</LearnMore>

## Постановка в очередь серии обновлений состояния {/*queueing-a-series-of-state-updates*/}

Этот компонент содержит ошибку: нажатие "+3" увеличивает счет только один раз.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[Состояние как снимок](/learn/state-as-a-snapshot) объясняет, почему это происходит. Установка состояния запрашивает новый рендер, но не изменяет его в уже выполняющемся коде. Поэтому `score` остается `0` сразу после вызова `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Вы можете исправить это, передав *функцию обновления* при установке состояния. Обратите внимание, как замена `setScore(score + 1)` на `setScore(s => s + 1)` исправляет кнопку "+3". Это позволяет ставить в очередь несколько обновлений состояния.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Прочтите **[Постановка в очередь серии обновлений состояния](/learn/queueing-a-series-of-state-updates)**, чтобы узнать, как ставить в очередь последовательность обновлений состояния.

</LearnMore>

## Обновление объектов в состоянии {/*updating-objects-in-state*/}

Состояние может содержать любые типы значений JavaScript, включая объекты. Но вы не должны изменять объекты и массивы, которые хранятся в состоянии React, напрямую. Вместо этого, когда вы хотите обновить объект или массив, вам нужно создать новый (или сделать копию существующего), а затем обновить состояние, чтобы использовать эту копию.

Обычно вы будете использовать синтаксис `...` (spread syntax) для копирования объектов и массивов, которые вы хотите изменить. Например, обновление вложенного объекта может выглядеть так:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Если копирование объектов в коде становится утомительным, вы можете использовать библиотеку, такую как [Immer](https://github.com/immerjs/use-immer), чтобы уменьшить повторяющийся код:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

Прочтите **[Обновление объектов в состоянии](/learn/updating-objects-in-state)**, чтобы узнать, как правильно обновлять объекты.

</LearnMore>

## Обновление массивов в состоянии {/*updating-arrays-in-state*/}

Массивы — это еще один тип изменяемых объектов JavaScript, которые можно хранить в состоянии и которые следует рассматривать как доступные только для чтения. Как и в случае с объектами, когда вы хотите обновить массив, хранящийся в состоянии, вам нужно создать новый (или сделать копию существующего), а затем установить состояние, чтобы использовать новый массив:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Если копирование массивов в коде становится утомительным, вы можете использовать библиотеку, такую как [Immer](https://github.com/immerjs/use-immer), чтобы уменьшить повторяющийся код:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

Прочтите **[Обновление массивов в состоянии](/learn/updating-arrays-in-state)**, чтобы узнать, как правильно обновлять массивы.

</LearnMore>

## Что дальше? {/*whats-next*/}

Перейдите к [Обработка событий](/learn/responding-to-events), чтобы начать читать эту главу по страницам!

Или, если вы уже знакомы с этими темами, почему бы не прочитать о [Управлении состоянием](/learn/managing-state)?