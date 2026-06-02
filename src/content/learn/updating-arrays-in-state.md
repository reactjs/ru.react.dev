---
title: Updating Arrays in State
---

<Intro>

Массивы в JavaScript изменяемы, но в состоянии React вы должны относиться к ним как к неизменяемым. Как и с объектами, когда вы хотите обновить массив в состоянии, вам нужно создать новый массив (или скопировать существующий), а затем установить состояние, используя новый массив.

</Intro>

<YouWillLearn>

- Как добавлять, удалять или изменять элементы в массиве в состоянии React
- Как обновлять объект внутри массива
- Как сделать копирование массивов менее повторяющимся с помощью Immer

</YouWillLearn>

## Обновление массивов без мутации {/*updating-arrays-without-mutation*/}

В JavaScript массивы — это просто другой тип объектов. [Как и с объектами](/learn/updating-objects-in-state), **в состоянии React вы должны рассматривать массивы как доступные только для чтения.** Это означает, что вы не должны переназначать элементы внутри массива, например `arr[0] = 'bird'`, и также не следует использовать методы, которые изменяют массив, такие как `push()` и `pop()`.

Вместо этого, каждый раз, когда вы хотите обновить массив, вам нужно передать *новый* массив в функцию установки состояния. Для этого вы можете создать новый массив из исходного массива в вашем состоянии, вызвав его неизменяющие методы, такие как `filter()` и `map()`. Затем вы можете установить состояние, используя полученный новый массив.

Вот справочная таблица для распространенных операций с массивами. При работе с массивами в состоянии React вам нужно избегать методов из левой колонки и вместо этого предпочитать методы из правой колонки:

|           | избегать (изменяет массив)           | предпочитать (возвращает новый массив)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| добавление    | `push`, `unshift`                   | `concat`, синтаксис `...` spread ([пример](#adding-to-an-array)) |
| удаление  | `pop`, `shift`, `splice`            | `filter`, `slice` ([пример](#removing-from-an-array))              |
| замена | `splice`, присваивание `arr[i] = ...` | `map` ([пример](#replacing-items-in-an-array))                     |
| сортировка   | `reverse`, `sort`                   | сначала скопировать массив ([пример](#making-other-changes-to-an-array)) |

Альтернативно, вы можете [использовать Immer](#write-concise-update-logic-with-immer), который позволяет использовать методы из обеих колонок.

<Pitfall>

К сожалению, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) и [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) похожи по названию, но очень разные:

* `slice` позволяет скопировать массив или его часть.
* `splice` **изменяет** массив (для вставки или удаления элементов).

В React вы будете гораздо чаще использовать `slice` (без `p`!), потому что вы не хотите изменять объекты или массивы в состоянии. [Обновление объектов](/learn/updating-objects-in-state) объясняет, что такое мутация и почему она не рекомендуется для состояния.

</Pitfall>

### Добавление в массив {/*adding-to-an-array*/}

`push()` изменяет массив, чего вы не хотите:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
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

Вместо этого создайте *новый* массив, который содержит существующие элементы *и* новый элемент в конце. Есть несколько способов сделать это, но самый простой — использовать синтаксис `...` [spread для массивов](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Заменить состояние
  [ // новым массивом
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
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
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

Синтаксис spread для массивов также позволяет добавить элемент в начало, поместив его *перед* исходным `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Поместить старые элементы в конец
]);
```

Таким образом, spread может выполнять работу как `push()` (добавление в конец массива), так и `unshift()` (добавление в начало массива). Попробуйте это в песочнице выше!

### Удаление из массива {/*removing-from-an-array*/}

Самый простой способ удалить элемент из массива — это *отфильтровать* его. Другими словами, вы создадите новый массив, который не будет содержать этот элемент. Для этого используйте метод `filter`, например:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
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
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Нажмите кнопку "Delete" несколько раз и посмотрите на ее обработчик клика.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Здесь `artists.filter(a => a.id !== artist.id)` означает "создать массив, состоящий из тех `artists`, чьи ID отличаются от `artist.id`". Другими словами, кнопка "Delete" каждого художника будет фильтровать *этого* художника из массива, а затем запрашивать перерисовку с полученным массивом. Обратите внимание, что `filter` не изменяет исходный массив.

### Преобразование массива {/*transforming-an-array*/}

Если вы хотите изменить некоторые или все элементы массива, вы можете использовать `map()` для создания **нового** массива. Функция, которую вы передадите в `map`, может решать, что делать с каждым элементом, основываясь на его данных или его индексе (или обоих).

В этом примере массив содержит координаты двух кругов и квадрата. Когда вы нажимаете кнопку, она перемещает только круги вниз на 50 пикселей. Для этого создается новый массив данных с помощью `map()`:

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
        // Возвращаем новый круг на 50px ниже
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Перерисовываем с новым массивом
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
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

Часто возникает необходимость заменить один или несколько элементов в массиве. Присваивания типа `arr[0] = 'bird'` изменяют исходный массив, поэтому вместо этого вам также следует использовать `map`.

Чтобы заменить элемент, создайте новый массив с помощью `map`. Внутри вашего вызова `map` вы получите индекс элемента в качестве второго аргумента. Используйте его, чтобы решить, возвращать ли исходный элемент (первый аргумент) или что-то другое:

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
        // Увеличиваем нажатый счетчик
        return c + 1;
      } else {
        // Остальные не изменились
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

Иногда вам может понадобиться вставить элемент в определенную позицию, которая не является ни началом, ни концом. Для этого вы можете использовать синтаксис `...` spread для массивов вместе с методом `slice()`. Метод `slice()` позволяет вырезать "срез" массива. Чтобы вставить элемент, вы создадите массив, который распространяет срез *до* точки вставки, затем новый элемент, а затем остальную часть исходного массива.

В этом примере кнопка "Insert" всегда вставляет элемент в индекс `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Может быть любым индексом
    const nextArtists = [
      // Элементы до точки вставки:
      ...artists.slice(0, insertAt),
      // Новый элемент:
      { id: nextId++, name: name },
      // Элементы после точки вставки:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
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

### Внесение других изменений в массив {/*making-other-changes-to-an-array*/}

Есть некоторые вещи, которые вы не можете сделать с помощью синтаксиса spread и неизменяющих методов, таких как `map()` и `filter()` по отдельности. Например, вы можете захотеть перевернуть или отсортировать массив. Методы JavaScript `reverse()` и `sort()` изменяют исходный массив, поэтому вы не можете использовать их напрямую.

**Однако вы можете сначала скопировать массив, а затем внести в него изменения.**

Например:

<Sandpack>

```js
import { useState } from 'react';

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
        Reverse
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

Здесь вы используете синтаксис spread `[...list]` для создания копии исходного массива. Теперь, когда у вас есть копия, вы можете использовать изменяющие методы, такие как `nextList.reverse()` или `nextList.sort()`, или даже присваивать отдельные элементы с помощью `nextList[0] = "something"`.

Однако, **даже если вы копируете массив, вы не можете напрямую изменять существующие элементы _внутри_ него.** Это потому, что копирование является поверхностным — новый массив будет содержать те же элементы, что и исходный. Поэтому, если вы изменяете объект внутри скопированного массива, вы изменяете существующее состояние. Например, такой код является проблемой.

```js
const nextList = [...list];
nextList[0].seen = true; // Проблема: изменяет list[0]
setList(nextList);
```

Хотя `nextList` и `list` — это два разных массива, **`nextList[0]` и `list[0]` указывают на один и тот же объект.** Поэтому, изменяя `nextList[0].seen`, вы также изменяете `list[0].seen`. Это мутация состояния, которой следует избегать! Вы можете решить эту проблему аналогично [обновлению вложенных объектов JavaScript](/learn/updating-objects-in-state#updating-a-nested-object) — копируя отдельные элементы, которые вы хотите изменить, вместо их мутации. Вот как.

## Обновление объектов в массивах {/*updating-objects-inside-arrays*/}

Объекты на самом деле не находятся «внутри» массивов. Они могут выглядеть так в коде, но каждый объект в массиве — это отдельное значение, на которое «указывает» массив. Именно поэтому нужно быть осторожным при изменении вложенных полей, таких как `list[0]`. Список произведений искусства другого пользователя может указывать на тот же элемент массива!

**При обновлении вложенного состояния необходимо создавать копии, начиная с точки обновления и до самого верхнего уровня.** Давайте посмотрим, как это работает.

В этом примере два отдельных списка произведений искусства имеют одинаковое начальное состояние. Они должны быть изолированы, но из-за мутации их состояние случайно становится общим, и установка флажка в одном списке влияет на другой список:

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
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
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

Проблема заключается в коде вида:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Проблема: мутирует существующий элемент
setMyList(myNextList);
```

Хотя массив `myNextList` является новым, сами *элементы* те же, что и в исходном массиве `myList`. Поэтому изменение `artwork.seen` изменяет *исходный* элемент произведения искусства. Этот элемент произведения искусства также находится в `yourList`, что вызывает ошибку. Такие ошибки могут быть сложны для понимания, но, к счастью, они исчезают, если избегать мутации состояния.

**Вы можете использовать `map` для замены старого элемента его обновленной версией без мутации.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Создайте *новый* объект с изменениями
    return { ...artwork, seen: nextSeen };
  } else {
    // Изменений нет
    return artwork;
  }
}));
```

Здесь `...` — это синтаксис деструктуризации объекта, используемый для [создания копии объекта.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

При таком подходе ни один из существующих элементов состояния не мутирует, и ошибка исправлена:

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
        // Создайте *новый* объект с изменениями
        return { ...artwork, seen: nextSeen };
      } else {
        // Изменений нет
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Создайте *новый* объект с изменениями
        return { ...artwork, seen: nextSeen };
      } else {
        // Изменений нет
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
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

В целом, **вы должны мутировать только те объекты, которые вы только что создали.** Если бы вы добавляли новое произведение искусства, вы могли бы его мутировать, но если вы работаете с чем-то, что уже есть в состоянии, вам нужно создать копию.

### Напишите лаконичную логику обновления с Immer {/*write-concise-update-logic-with-immer*/}

Обновление вложенных массивов без мутации может быть немного утомительным. [Так же, как и с объектами](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Как правило, вам не нужно обновлять состояние более чем на пару уровней вглубь. Если ваши объекты состояния очень глубокие, вы можете [переструктурировать их иначе](/learn/choosing-the-state-structure#avoid-deeply-nested-state), чтобы они были плоскими.
- Если вы не хотите менять структуру состояния, вы можете предпочесть использовать [Immer](https://github.com/immerjs/use-immer), который позволяет вам писать с удобным, но мутирующим синтаксисом и сам позаботится о создании копий.

Вот пример «Списка желаний» (Art Bucket List), переписанный с Immer:

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
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
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

Обратите внимание, что с Immer **мутация, такая как `artwork.seen = nextSeen`, теперь допустима:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Это связано с тем, что вы мутируете не _исходное_ состояние, а специальный объект `draft`, предоставляемый Immer. Аналогично, вы можете применять мутирующие методы, такие как `push()` и `pop()`, к содержимому `draft`.

За кулисами Immer всегда создает новое состояние с нуля на основе изменений, которые вы внесли в `draft`. Это делает ваши обработчики событий очень лаконичными, никогда не мутируя состояние.

<Recap>

- Вы можете помещать массивы в состояние, но не можете их изменять.
- Вместо мутации массива создайте его *новую* версию и обновите состояние ею.
- Вы можете использовать синтаксис spread-оператора `[...arr, newItem]` для создания массивов с новыми элементами.
- Вы можете использовать `filter()` и `map()` для создания новых массивов с отфильтрованными или преобразованными элементами.
- Вы можете использовать Immer, чтобы ваш код оставался лаконичным.

</Recap>



<Challenges>

#### Обновите товар в корзине {/*update-an-item-in-the-shopping-cart*/}

Заполните логику `handleIncreaseClick` так, чтобы нажатие "+" увеличивало соответствующее число:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
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

Вы можете использовать функцию `map` для создания нового массива, а затем синтаксис spread-оператора `{...}` для создания копии измененного объекта для нового массива:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
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

#### Удалите товар из корзины {/*remove-an-item-from-the-shopping-cart*/}

В этой корзине есть рабочий кнопка "+", но кнопка "–" ничего не делает. Вам нужно добавить ей обработчик событий, чтобы нажатие на нее уменьшало `count` соответствующего товара. Если нажать "–" при значении count равном 1, товар должен автоматически удалиться из корзины. Убедитесь, что счетчик никогда не показывает 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
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

Вы можете сначала использовать `map` для создания нового массива, а затем `filter` для удаления товаров с `count`, равным `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
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

#### Исправьте мутации с помощью не мутирующих методов {/*fix-the-mutations-using-non-mutative-methods*/}

В этом примере все обработчики событий в `App.js` используют мутацию. В результате редактирование и удаление задач не работает. Перепишите `handleAddTodo`, `handleChangeTodo` и `handleDeleteTodo`, чтобы использовать не мутирующие методы:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

В `handleAddTodo` вы можете использовать синтаксис spread-оператора для массивов. В `handleChangeTodo` вы можете создать новый массив с помощью `map`. В `handleDeleteTodo` вы можете создать новый массив с помощью `filter`. Теперь список работает правильно:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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


#### Исправьте мутации с помощью Immer {/*fix-the-mutations-using-immer*/}

Это тот же пример, что и в предыдущем задании. На этот раз исправьте мутации с помощью Immer. Для вашего удобства `useImmer` уже импортирован, поэтому вам нужно изменить переменную состояния `todos`, чтобы использовать его.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

С Immer вы можете писать код в мутативном стиле, пока вы мутируете только части `draft`, которые Immer вам предоставляет. Здесь все мутации выполняются на `draft`, поэтому код работает:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

Вы также можете смешивать мутативный и немутативный подходы с Immer.

Например, в этой версии `handleAddTodo` реализован путем мутации Immer `draft`, в то время как `handleChangeTodo` и `handleDeleteTodo` используют немутативные методы `map` и `filter`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
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

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
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
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

С Immer вы можете выбрать стиль, который кажется вам наиболее естественным для каждого отдельного случая.

</Solution>

</Challenges>