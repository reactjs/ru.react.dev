---
title: Обновление массивов в состоянии
---

<Intro>

Массивы мутабельны в JavaScript, но вы должны относиться к ним как к иммутабельным, когда сохраняете их в состоянии. Также как и в случае с объектами, когда вы хотите обновить массив, хранящийся в состоянии, вам нужно создать новый (или создать копию уже существующего), и затем установить состояние, используя новый массив.
</Intro>

<YouWillLearn>
- Как добавлять, удалять, или изменять элементы в массиве в состоянии React
- Как обновлять объект внутри массива
- Как лаконично копировать массив c Immer

</YouWillLearn>

## Обновление массивов без мутаций {/*updating-arrays-without-mutation*/}

В JavaScript, массивы это просто другой тип объекта. [В точности как к объектам](/learn/updating-objects-in-state) **вы должны относиться к массивам в состоянии React как к неизменяемым.** Это также означает, что вы не должны переназначать элементы внутри массива, например как `arr[0] = 'bird'`, и также вы не должны использовать методы, которые мутируют массив, такие как `push()` и `pop()`.

Вместо этого, каждый раз когда вы захотите обновить массив, вам нужно передать *новый* массив в функцию установки состояния. Чтобы сделать это, вы можете создать новый массив из оригинального в вашем состоянии путем вызовов не-мутирующих методов, таких как `filter()` и `map()`. После вы можете передать в ваше состояние новый полученный массив.

Здесь представлена таблица распостраненных операций с массивами. Когда вы имеете дело с массивами внутри состояния React, вам стоит избегать методов из левой клоноки, и вместо них использовать методы из правой: 

|           | стоит избегать (мутируют массив)           | предпочтительны (возвращают новый массив)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| добавление    | `push`, `unshift`                   | `concat`, `[...arr]` синтаксис распостранения ([пример](#adding-to-an-array)) |
| удаление  | `pop`, `shift`, `splice`            | `filter`, `slice` ([пример](#removing-from-an-array))              |
| замена | `splice`, `arr[i] = ...` назначение | `map` ([пример](#replacing-items-in-an-array))                     |
| сортировка   | `reverse`, `sort`                   | скопируйте массив сначала ([пример](#making-other-changes-to-an-array)) |

В качестве альтернативы, вы можете [использовать Immer](#write-concise-update-logic-with-immer), который позволит вам использовать методы из обоих колонок.

<Pitfall>
К сожалению, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) and [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) имеют схожие названия, но сильно различаются по поведению:

* `slice` позволяет вам скопировать массив целиком или его часть.
* `splice` **мутирует** массив (вставляет или удаляет элементы).

В React, вы будете использовать `slice` (без `p`!) гораздо чаще, потому что вы не хотите мутировать объекты или массивы в состоянии. В [обновлении объектов](/learn/updating-objects-in-state) объясняется что такое такое мутация, и почему рекомендуется  ее избегать в обновлениях состояния.
</Pitfall>

### Добавление в массив {/*adding-to-an-array*/}

`push()` мутирует массив, чего вам стоит избегать!

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Вдохновляющие скульпторы:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Добавить</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>
Вместо этого, создайте *новый* массив, который содержит существующие элементы *вместе* с новым элементом в конце. Существует множество путей сделать это, но самый легкий это использовать синтакс  `...` [распостранения массива](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Замена состояния
  [ // с новым массивом
    ...artists, // который содержит все старые элементы
    { id: nextId++, name: name } // и один новый элемент в конце
  ]
);
```

Теперь это работает правильно:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Вдохновляющие скульпторы:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Добавить</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Синтаксис распостранения также позволяет вам подготовить элемент помещая его *до* оригинального `...artists`
```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Помещаем старые элементы в конец
]);
```

Поэтому синтаксис распостранения может выполнять задачи и `push()`, добавляя элементы в конец массива и `unshift()`, добавляя элементы в начало массива. Попробуйте это в песочнице ниже!

### Удаление из массива {/*removing-from-an-array*/}

Самый простой вариант удаления элемента из массива это *отфильтровка*.  Другими словами, вы получите новый массив, который просто не будет содержать этот элемент. Чтобы сделать это, используйте метод `filter`, как в этом примере:
<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Марта Колвин Андраде' },
  { id: 1, name: 'Ламиди Олонаде Факейе'},
  { id: 2, name: 'Луиза Берлявски-Невельсон'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Вдохновляющие скульпторы:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Нажмите кноку "Удалить" несколько раз, и посмотрите на его обработчик.
```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Здесь, `artists.filter(a => a.id !== artist.id)`  означает "создайте массив который состоит из этих `artists` чьи ID отличаются от `artist.id`". Другими словами, каждая кнопка "Удалить", фильтрует _этих_ артистов из массива, и затем запрашивает ре-рендер с итоговым массивом. Заметьте что `filter` не изменяет изначальный массив.
### Изменение массива {/*transforming-an-array*/}

Если вы хотите изменить некоторые или все элементы массива, вы можете использовать `map()`, чтобы создать **новый** массив. Функция, которая будет пропущена в  `map` может решать что делать с каждым элементом, основываясь на информации или его индексе (или их обоих).

В этом примере, массив хранит координаты двух кругов и квадрата. Когда вы нажимаете на кнопку, двигается только круг вниз на 50 пикселей. Это происходит созданием нового массива с использованием `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Без изменений
        return shape;
      } else {
        // возвращает ниже круг размером 50px
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Ре-рендерится с новым массивом
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Круги двигаются вниз!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Замена элементов в массиве {/*replacing-items-in-an-array*/}

Достаточно часто возникает потребность заменить один или больше элементов в массиве. Назначения типа `arr[0] = 'bird'` мутируют изначальный массив, так что вместо этого вы можете захотеть использовать также `map`.

Чтобы заменить элемент, создайте новый массив с `map`. Внутри вызова `map`, вы будете получать индекс элемента вторым аргументом. Используйте это чтобы решить, хотите вы возвращать оригинальный элемент (первый аргумент) или сделать что-то другое:
<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Увеличиваем кликнутый счетчик
        return c + 1;
      } else {
        // Остальное не изменилось
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Вставка в массив {/*inserting-into-an-array*/}

Иногда, вы можете захотеть вставить элемент в определенную позицию, которая ни относится ни к началу, ни к концу. Чтобы сделать это, вы можете использовать `...` синтаксис распостранения вместе с методом `slice()`. Метод `slice()` позволяет вам отрезать "кусочек" массива. Чтобы вставить элемент, создайте массив который распостранит слайс _до_ точки вставки, затем новый элемент, и потом остаток изначального массива.

В этом примере, кнопка Вставить всегда вставляет по индексу `1`:

 <Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Марта Колвин Андраде' },
  { id: 1, name: 'Ламиди Олонаде Факейе'},
  { id: 2, name: 'Луиза Берлявски-Невельсон'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Может быть любой индекс
    const nextArtists = [
      // Элементы до точки пересечения:
      ...artists.slice(0, insertAt),
      // Новый элемент:
      { id: nextId++, name: name },
      //  Элементы до точки пересечения:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Вдохновляющие скульпторы:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Вставить
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Осуществление других изменений в массиве {/*making-other-changes-to-an-array*/}

Есть некоторые вещи, которые вы не должны делать с синтаксисом распостранения и немутирующими метотодами, такими как `map()` и `filter()`. Например, вы можете захотеть изменить направление или отсортировать массив. Методы JavaScript, такие как `reverse()` и `sort()` мутируют изначальный массив, так что вы не сможете использовать их напрямую.

**Однако, вы можете сначала скопировать массив, и уже потом изменить его.**

Например:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Развернуть
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>
Здесь, вы можете использовать `[...list]` синтаксис распостранения чтобы создать копию оригинального массива. Теперь, когда у вас есть копия, вы можете использовать мутирующие методы типа `nextList.reverse()` или `nextList.sort()`, или даже назначить отдельные элементы с `nextList[0] = "something"`.

Кроме того, **даже если скопируете массив, вы не можете мутировать существующие элементы _внутри_ него напрямую**.  Это происходит потому что копирование неглубокое-- новый массив будет содержать те же элементы, что и оригинальный. Так что если вы изменените объект внутри скопированного массива, вы мутируете существующее состояние. Например, код приведенный внизу, представляет из себя проблему:

```js
const nextList = [...list];
nextList[0].seen = true; // Проблема: мутирован list[0]
setList(nextList);
```


Кроме этого, `nextList` и `list` это два разных массива,   **`nextList[0]` and `list[0]` указывают на один и тот же объект.** Так что изменяя `nextList[0].seen`, вы также изменяете `list[0].seen`.  Это мутация состояния, которую вы должны избегать! Вы можете решить этот вопрос похожим путем [обновление вложенных JavaScript объектов](/learn/updating-objects-in-state#updating-a-nested-object)--копированием отдельных элементов, которые вы хотите изменить, вместо того что бы мутировать их. Вот каким образом:
## Обновление объектов внутри массивов {/*updating-objects-inside-arrays*/}

Объекты на самом деле _не_  находятся "внутри" массивов. Может показаться, что они находятся "внутри" в коде, но каждый объект в массиве это отдельное значение, на которое массив указывает. Вот почему вам нужно быть осторожным, когда изменяете внутренние поля, такие как `list[0]`.  Список произведений искусства другого человека может указывать на тот же элемент в массиве!

**Когда обновляется вложенное состояние, вам нужно создать копии с точки которую вы хотите обновить, вплоть до верхнего уровня.** Давайте посмотрим как это работает.

В этом примере, два отдельных списка произведений искусства имеют оно и тоже изначальное состояние. Предполагается, что они изначально изолированы, но из-за мутаций, их состояние случайно стало общим, и устанавка флажка в одном списке влияет на другой:
<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Список произведений искусства</h1>
      <h2>Мой список произведений искусства которые надо посмотреть:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Твой список произведений искусства, которые стоит увидеть:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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
Проблема в коде вроде этого:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Проблема: мутирует существуюший элемент
setMyList(myNextList);
```
Также массив `myNextList` сам по себе новый, а *элементы сами по себе* такие же как в оригинальном массиве  `myList`. Так что изменения `artwork.seen` изменяет *оригинальный* элемент искусства.  Этот предмет искусства так же есть в `yourList`, что порождает баг. Баги вроде этого могут быть сложными для понимания, но к счастью, они исчезают, если вы избегаете мутирующего состояния.

**Вы можете использовать `map` для замены старого элемента с обновленной версией без мутации.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Создает *новый*  объект с изменениями
    return { ...artwork, seen: nextSeen };
  } else {
    // Без изменений
    return artwork;
  }
}));
```

Здесь, `...`  оператор распостранения используется для [создания копии объекта.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

С таким подходом, никто из элементов существующего сотояния не мутируется, и баг пропадет:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Создает *новый* объект с измнениями
        return { ...artwork, seen: nextSeen };
      } else {
        // Без измнений
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Создает *новый* объект с измнениями
        return { ...artwork, seen: nextSeen };
      } else {
        // Без изменений
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Список произведений искусства:</h1>
      <h2>Мой список произведений искусства, которые стоит посмотреть:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Твой список произведений искусства, стоит увидеть:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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
По сути, **вы должны мутировать объекты толького при создании.** Если вы будете вставлять *новое* произведение искусства, вы можете его мутировать, но если вы имеете дело с чем что уже есть в состоянии, вам нужно сделать копию. 
### Пишем лаконичные обновления логики с Immer {/*write-concise-update-logic-with-immer*/}

Обновление  вложенных массивов без мутаций становится многословным и рутинным. [Точно как объекты](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Чаще всего, вам не понадобятся обновения состояния больше чем на пару уровней вниз. Если ваши объекты состояния очень глубоки, вы  можете захотеть [выстроить их по другому](/learn/choosing-the-state-structure#avoid-deeply-nested-state), чтобы они стали более плоскими.
- Если вы не хотите изменять структуру вашего состояния, вы стоит выбрать [Immer](https://github.com/immerjs/use-immer), который позволит вам писать, используя удобный, но мутирующий синтаксис и возьмет заботу о создании копий на себя.

Здесь Список Произведений Искусства переписан при помощи Immer:
<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Список произведений</h1>
      <h2>Список того, что я хотел бы увидеть::</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Твой список произведений искусства, которые стоит увидеть:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Заметьте как с Immer, мутации типа `artwork.seen = nextSeen` теперь проходят нормально:

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```
Это происходит потому что не мутируете _оригинальное_ состояние, но мутируете специальный объект `draft`, предоставленный Immer. Подобно, вы можете назначить мутирующие методы типа`push()` и `pop()` к контенту в `draft`.

За кулисами, Immer всегда всегда создает следующее состояние с нуля в соответствии с изменениями которые вы сделали с `draft`. Это помогает вашим обработчикам быть очень краткими без единой мутации состояния.

<Recap>

- Вы может поместить массивы в состояние, но вы не можете их изменять.
- Вместо мутации массива, создавайте его *новую* версию, и обновляйте состояние там.
- Вы можете использовать`[...arr, newItem]` синтаксис распостранения массива для создания новых массивов с новыми элементами.
- Вы можете использовать `filter()` и `map()` чтобы создавать новые массивы с отфильтроваными или трансформированными элементами.
- Для краткости вы можете использовать Immer.

</Recap>


<Challenges>

#### Обновление элемента в корзине для покупок {/*update-an-item-in-the-shopping-cart*/}

Заполните `handleIncreaseClick` такой логикой, чтобы нажатие на "+" увеличивало связанное число:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Пахлава',
  count: 1,
}, {
  id: 1,
  name: 'Сыр',
  count: 5,
}, {
  id: 2,
  name: 'Макароны',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Вы можете использовать `map` чтобы создать новый массив, и потом использовать оператор распостранения `...`, чтобы создать копию измененного объекта для нового массива:
<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Пахлава',
  count: 1,
}, {
  id: 1,
  name: 'Сыр',
  count: 5,
}, {
  id: 2,
  name: 'Макароны',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Удаление элемента из корзины для покупок {/*remove-an-item-from-the-shopping-cart*/}
У корзины продуктов есть рабочая "+" кнопка, но кнопка "-" пока ничего не делает. Вам нужно добавить обработчик событий, чтобы она могла уменьшать переменную `count` связанного продукта. Если вы нажмете "–", когда счет будет равен 1, продукт должен быть автоматически удален из корзины. Проверьте, чтобы 0 не может быть показан.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Пахлава',
  count: 1,
}, {
  id: 1,
  name: 'Сыр',
  count: 5,
}, {
  id: 2,
  name: 'Макароны',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>


Вы можете сначала использовать `map` для создания нового массива,  затем использовать `filter`  для удаления продуктов, `count` которых равен `0`:
<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Пахлава',
  count: 1,
}, {
  id: 1,
  name: 'Сыр',
  count: 5,
}, {
  id: 2,
  name: 'Макароны',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Исправление мутаций, с использованием не мутационных методов {/*fix-the-mutations-using-non-mutative-methods*/}

В этом примере, все обработчики событий в `App.js` используют мутации. В результате, редактирование и удаление дел не работает.
Перепишите `handleAddTodo`, `handleChangeTodo`, и `handleDeleteTodo` чтобы они использовали не-мутирющие методы:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купить молока', done: true },
  { id: 1, title: 'Съесть шаурму', done: false },
  { id: 2, title: 'Заварить чай', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Добавить дело"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Добавить</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Сохранить
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редактировать
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Удалить
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

В `handleAddTodo`, вы можете использовать синтаксис распостранения массива. В `handleChangeTodo`, вы можете создавать новый массив с `map`. В `handleDeleteTodo`, вы можете создать новый массив с `filter`. Теперь список работает правильно:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купить молока', done: true },
  { id: 1, title: 'Съесть шаурму', done: false },
  { id: 2, title: 'Заварить чай', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Добавить дело"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Добавить</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Сохранить
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редактировать
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Удалить
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Исправление мутаций с использованием Immer {/*fix-the-mutations-using-immer*/}

Этот тот же пример что и в прошлой задаче. Но на этот раз исправьте мутации, используя Immer. Для вашего удобства, `useImmer` уже импортирован, так что вам нужно изменить переменную состояния `todos` чтобы ее использовать.


<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купить молока', done: true },
  { id: 1, title: 'Съесть шаурму', done: false },
  { id: 2, title: 'Заварить чай', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Добавить дело"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Добавить</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Сохранить
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редактировать
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Удалить
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

C Immer, вы можете написать код в мутирующем стиле, так как вы мутируете только те части `draft` который вам дает Immer. Здесь все мутации выполнены в `draft`, так что код работает корректно:
<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купить молока', done: true },
  { id: 1, title: 'Съесть шаурму', done: false },
  { id: 2, title: 'Заварить чай', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Добавить дело"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Добавить</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Сохранить
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редактировать
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Удалить
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Вы также можете смешивать и сочетать мутирующие и не мутирующие методы с Immer.

Например, в этой версии `handleAddTodo` создана с мутацией Immer `draft`, в то время как `handleChangeTodo` и `handleDeleteTodo` используют не-мутирующие методы `map` и `filter`:

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купить молока', done: true },
  { id: 1, title: 'Съесть шаурму', done: false },
  { id: 2, title: 'Заварить чай', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Добавить дело"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Добавить</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Сохранить
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редактировать
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Удалить
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

С Immer, вы можете выбрать тот стиль, который кажется более подходящим в каждом конкретном случае.
</Solution>

</Challenges>
