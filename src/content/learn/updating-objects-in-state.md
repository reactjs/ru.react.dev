---
title: Обновление объектов в состоянии
---

<Intro>

Состояние может содержать в себе любые JavaScript-значения, включая объекты. Значения объектов, которые находятся в состоянии, нельзя изменять напрямую. Вместо этого, если вы хотите обновить состояние, вам необходимо создать новый объект или копию текущего объекта, а затем установить состоянию этот объект.

</Intro>

<YouWillLearn>

- Как правильно в React обновлять объект в состоянии
- Как обновить вложенный объект без мутации
- Что такое иммутабельность, как её не нарушить
- Как упростить копирование объектов с Immer

</YouWillLearn>

## Что такое мутация? {/*whats-a-mutation*/}

Вы можете хранить любое JavaScript-значение в состоянии.

```js
const [x, setX] = useState(0);
```

До сих пор вы работали с числами, строками и логическими значениями. Эти виды значений в JavaScript являются "иммутабельными" (еще один вариант определения — неизменяемыми) -- это значит, что они не изменяются и доступны "только для чтения". Вы можете запустить повторный рендер для _замены_ значения:

```js
setX(5);
```

Значение состояния `x` изменилось с `0` на `5`, но _число `0` само по себе_ не изменилось. Невозможно проводить изменения со встроенными (built-in) примитивами, такими как числа, строки и логические значения в JavaScript.

Рассмотрим объект в состоянии:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Технически возможно изменить содержимое _самого объекта_. **Это называется мутацией:**

```js
position.x = 5;
```

На самом деле, объекты в состоянии в React мутабельны (изменяемы), но вы должны относиться к ним так, будто они иммутабельны, как и числа, строки, логические значения. Вместо того, чтобы изменять объекты напрямую, вы должны _заменять_ их.

## Рассматривайте состояние как доступное "только для чтения" {/*treat-state-as-read-only*/}

Иными словами, **вам необходимо рассматривать любой объект JavaScript, который находится в состоянии, доступным только для чтения.**

В примере ниже состояние хранит в себе объект -- текущее положение курсора. Красная точка должна двигаться, когда вы касаетесь или перемещаете курсор над областью предварительного просмотра. Точка в данном примере остаётся в своей исходной позиции:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Существует проблема в фрагменте кода:

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Этот код изменяет объект `position` в [предыдущем рендере.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) React не знает об изменении объекта, так как не применялась функция установки состояния. Следовательно, React ничего не делает в ответ. Представьте, будто вы пытаетесь изменить заказ после того, как уже поели. Конечно, в некоторых случаях такое изменение может работать, но мы не рекомендуем подобным образом обновлять состояние. Вы всегда должны рассматривать значение состояния, к которому у вас есть доступ, как доступное "только для чтения".

Для того чтобы [запустить повторный рендер](/learn/state-as-a-snapshot#setting-state-triggers-renders), **необходимо создать *новый* объект и передать его в функцию установки состояния:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

С `setPosition` вы сообщаете React:

* Заменить `position` новым объектом;
* Запустить новый рендер.

В новом примере кода красная точка следует за вашим указателем, когда вы касаетесь или наводите курсор на область предварительного просмотра:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Локальная мутация допустима {/*local-mutation-is-fine*/}

Код ниже является проблемным, потому что изменяет *существующий* объект состояния:

```js
position.x = e.clientX;
position.y = e.clientY;
```

А этот фрагмент кода **абсолютно нормальный,** потому что вы мутируете *только что созданный* объект:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

На самом деле, это полностью эквивалентно:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Мутация становится проблемой, когда вы изменяете *существующий* объект, который уже в состоянии. Мутировать объект, который вы только что создали, допустимо, так как *никакой код не ссылается на этот объект*. От изменения такого объекта ничего не зависит, он ничего не может случайно сломать. Это и есть "локальная мутация". Вы даже можете проводить локальную мутацию объекта [пока идёт рендер.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Это удобно и совершенно нормально!

</DeepDive>  

## Копирование объектов с использованием оператора расширения {/*copying-objects-with-the-spread-syntax*/}

В предыдущем примере объект `position` всегда создаётся заново, исходя из текущей позиции курсора. На практике чаще всего вы захотите включать уже *существующие* данные в новый объект, который вы создаёте. Например, вы можете захотеть обновить *только одно* поле в форме, остальные значения полей сохранить без изменений.

Эти поля ввода не работают, потому что обработчики `onChange` изменяют состояние:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        Имя:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Фамилия:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Почта:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Например, эта строка изменяет состояние из прошлого рендера:

```js
person.firstName = e.target.value;
```

Надёжный способ получить желаемое поведение -- создать новый объект и передать его в `setPerson`. Но здесь вы также захотите **скопировать в него существующие данные**, потому что изменилось только одно из полей:

```js
setPerson({
  firstName: e.target.value, // новое значение имени из поля ввода
  lastName: person.lastName,
  email: person.email
});
```

Вы можете использовать `...` [оператор расширения,](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_%D0%B2_%D0%BB%D0%B8%D1%82%D0%B5%D1%80%D0%B0%D0%BB%D0%B0%D1%85_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%B0) чтобы вам не нужно было копировать каждое свойство отдельно.

```js
setPerson({
  ...person, // Копируем старые данные
  firstName: e.target.value // Но переписываем одно из полей
});
```

Теперь форма работает! 

Обратите внимание, вы не объявляли отдельную переменную состояния для каждого поля ввода. Для больших форм хранение всех данных, сгруппированных в объекте, очень удобно, при условии, что вы правильно обновляете объект!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        Имя:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Фамилия:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Почта:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Помните, что `...` оператор расширения является "поверхностным" -- он копирует элементы только на один уровень вглубь. Это свойство делает его быстрым, но это также означает, что если вы хотите обновить вложенное свойство, вам придётся использовать его более одного раза.

<DeepDive>

#### Использование одного обработчика событий для нескольких полей {/*using-a-single-event-handler-for-multiple-fields*/}

Также вы можете использовать скобки `[` и `]` внутри определения вашего объекта, чтобы указывать свойство с динамическим именем. Ниже представлен тот же самый пример, но с одним обработчиком событий вместо трёх разных:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        Имя:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Фамилия:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Почта:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Здесь `e.target.name` ссылается на свойство `name` в `<input>` DOM-элемента.

</DeepDive>

## Обновление вложенного объекта {/*updating-a-nested-object*/}

Рассмотрим структуру вложенных объектов, подобную этой:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Если вы хотите обновить `person.artwork.city`, то понятно как это сделать с помощью мутации:

```js
person.artwork.city = 'New Delhi';
```

Но в React состояние иммутабельное! Чтобы изменить `city`, вам сначала нужно создать новый объект `artwork` (предварительно заполненный данными из предыдущего `artwork`), а затем создать новый объект `person`, который указывает на новый `artwork`:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Или записанный как вызов одной функции:

```js
setPerson({
  ...person, // копируем поля
  artwork: { // но заменяем artwork
    ...person.artwork, // с тем же значением
    city: 'New Delhi' // но с New Delhi!
  }
});
```

Это немного многословно, но во многих случаях работает хорошо:

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
        Автор:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Название:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Город:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Изображение:
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

<DeepDive>

#### Объекты на самом деле не вложены {/*objects-are-not-really-nested*/}

Объект в примере ниже выглядит "вложенным":

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Однако, "вложенность" -- это неточный способ думать о том, как ведут себя объекты. Когда код выполняется, нет такого понятия, как "вложенный" объект. Вы действительно смотрите на два разных объекта:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

Объект `obj1` не находится внутри `obj2`. Например, `obj3` также мог "указывать" на `obj1`:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Если бы вы изменили `obj3.artwork.city`, это повлияло бы как на `obj2.artwork.city`, так и на `obj1.city`. Это связано с тем, что `obj3.artwork`, `obj2.artwork` и `obj1` являются одним и тем же объектом. Это трудно осознать, когда вы думаете об объектах как о «вложенных». Вместо этого они представляют собой отдельные объекты, «указывающие» друг на друга.

</DeepDive>  

### Напишем лаконичное обновление с помощью Immer {/*write-concise-update-logic-with-immer*/}

Если ваш объект имеет несколько уровней вложенности, вы можете подумать об [упрощении структуры объекта.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) Однако, если вы не хотите изменять структуру объекта, вы можете ссылаться на вложенные объекты. [Immer](https://github.com/immerjs/use-immer) -- это популярная библиотека, которая позволяет вам использовать удобный, но мутирующий синтаксис. Кроме того, она ответственна за создание копий объекта. С Immer ваш код выглядит так, будто вы "нарушили правило" и мутировали объект:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

В отличие от обычной мутации, Immer не перезаписывает предыдущее состояние напрямую!

<DeepDive>

#### Как работает Immer? {/*how-does-immer-work*/}

`Черновик`, предоставленный Immer, является особенным типом объекта, который называется [прокси](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Proxy), он "записывает" то, что вы с ним делаете. Вот почему вы можете мутировать его столько раз, сколько захотите! Под капотом Immer выясняет, какие части `черновика` были изменены, и создаёт новый объект с наличием этих изменений.

</DeepDive>

Попробуйте Immer:

1. Запустите в терминале `npm install use-immer`, чтобы добавить Immer как зависимость
2. Далее замените `import { useState } from 'react'` на `import { useImmer } from 'use-immer'`

Ниже представлен пример с использованием Immer:

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
        Автор:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Название:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Город:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Изображение:
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

Обратите внимание на лакончиный код обработчиков событий. Вы можете смешивать и сочетать `useState` и `useImmer` в отдельном компоненте так, как считаете нужным. Immer -- отличный способ сделать обработчики более краткими, особенно, если в вашем состоянии есть вложенность, а копирование объектов приводит к повторяющемуся коду.

<DeepDive>

#### Почему мутирование состояния не рекомендовано в React? {/*why-is-mutating-state-not-recommended-in-react*/}

Существует ряд причин:

* **Отладка:** если вы используете `console.log` и не мутируете состояние, ваши прошлые логи не будут затёрты более поздними изменениями состояния. Вы можете явно проследить, как состояние менялось между рендерами.
* **Oптимизация:** [общие стратегии оптимизации работы в React](/reference/react/memo) основаны на пропуске работы, если прошлые пропсы и/или состояние не изменились.  Можно быстро проверить были ли какие-то изменения и мутировалось ли состояние. Если выполняется равенство `prevObj === obj`, вы можете быть уверены, что действительно ничего не изменилось.
* **Новая функциональность:** разработчики React, когда создают новую функциональность, полагаются на то, что [состояние рассматривается как снимок.](/learn/state-as-a-snapshot) Если вы мутируете прошлые версии состояния, это может помешать вам использовать новую функциональность.
* **Изменения требований:** некоторые функции приложения, например, такие как реализация Undo/Redo, отображение истории изменений или предоставление пользователю возможности сбросить форму до более ранних значений, проще сделать, когда ничего не изменяется. Это связано с тем, что вы можете хранить прошлые копии состояния в памяти и повторно использовать их при необходимости. Если вы будете использовать подход мутирования, впоследствии будет сложно добавить такие функции.
* **Более простая реализация:** поскольку React не полагается на мутацию, ему не нужно делать ничего особенного с вашими объектами: не нужно захватывать их свойства, всегда оборачивать их в прокси или выполнять другую работу при инициализации, как это делают многие «реактивные» решения. По этой же причине React позволяет помещать в состояние любой объект, независимо от его размера, без дополнительных проблем с производительностью или корректностью.

На практике вы часто можете "уйти" от мутации состояния в React, но мы настоятельно рекомендуем вам не делать этого, чтобы вы могли использовать новые функции React, разработанные с учётом этого подхода.

</DeepDive>

<Recap>

* Рассматривайте все состояния в React как иммутабельные (неизменяемые).
* Когда вы храните объекты в состоянии, их прямое изменение не вызовет повторный рендер и изменит состояние в предыдущих "снимках" рендера.
* Вместо этого создайте *новую* версию объекта и активируйте повторный рендер, установив для него состояние.
* Вы можете использовать оператор расширения, чтобы создать новый объект на основе копии старого. Например, `{...obj, something: 'newValue'}`.
* Синтаксис расширения "поверхностный": копирование объекта происходит только на одном уровне в глубину.
* Чтобы обновить вложенный объект, вам нужно создать копии на всем пути от того места, которое вы обновляете.
* Для написания лаконичного кода копирования сложного объекта используйте Immer.

</Recap>



<Challenges>

#### Исправить некорректные обновления состояния {/*fix-incorrect-state-updates*/}

Форма имеет несколько ошибок. Нажмите кнопку, которая увеличивает счёт. Обратите внимание, он не увеличивается визуально. Затем отредактируйте имя и обратите внимание, что счёт внезапно "догнал" ваши изменения. Наконец, отредактируйте фамилию и обратите внимание, что счёт полностью исчез.

Необходимо исправить эти ошибки. Когда вы завершите исправления, объясните, почему происходили ошибки.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Счёт: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Имя:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Фамилия:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Ниже представлено решение:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Счёт: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Имя:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Фамилия:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Проблема с `handlePlusClick` заключалась в том, что он мутировал объект `player`. В результате React не знал, что есть причина для повторного рендера и не обновлял счёт на экране. Вот почему, когда вы редактировали первое имя, состояние обновлялось, вызывая повторный рендер, который _также_ обновлял счёт на экране.

Проблема с `handleLastNameChange` заключалась в том, что он не копировал существующие поля `...player` в новый объект. Вот почему счёт пропал после того, как вы отредактировали фамилию.

</Solution>

#### Найти и исправить мутацию {/*find-and-fix-the-mutation*/}

На статичном фоне есть перетаскиваемый блок. Вы можете изменить цвет блока, используя выбор из выпадающего меню.

Однако, есть одна ошибка. Если вы сначала переместите блок, а затем измените его цвет, фон (который не должен двигаться!) "прыгнет" на позицию блока. Такого быть не должно: свойство position для `Background` установлено на `initialPosition`, а именно `{ x: 0, y: 0 }`. Почему фон двигается после смены цвета?

Найдите ошибку и исправьте её.

<Hint>

Если что-то неожиданно меняется, то происходит мутация. Найдите мутацию в `App.js` и исправьте её.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Перетащи!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Проблема заключалась в мутации внутри `handleMove`. Он изменил `shape.position`, но это тот же объект, на который указывает `initialPosition`. Вот почему блок и фон двигаются. (Это мутация, поэтому изменение не отражается на экране до тех пор, пока несвязанное обновление -- изменение цвета -- не вызовет повторный рендер)

Необходимо удалить мутацию из `handleMove` и использовать оператор расширения для копирования формы. Обратите внимание, что `+=` -- мутация, вам нужно переписать её, чтобы использовать обычную операцию `+`

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Перетащи!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Обновление объекта с Immer {/*update-an-object-with-immer*/}

Это тот же некорректный пример, что и в предыдущем задании. На этот раз воспользуйтесь Immer. Для вашего удобства `useImmer` уже импортирован, вам нужно изменить переменную состояния `shape`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Перетащи!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

<Solution>

Ниже представлено решение с использованием Immer. Обратите внимание, что обработчики событий написаны мутирующим образом, однако, ошибка не возникает. Это связано с тем, что Immer под капотом никогда не мутирует существующие объекты.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Перетащи!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
