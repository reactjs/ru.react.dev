---
title: useDeferredValue
---

<Intro>

Хук `useDeferredValue` позволяет откладывать обновление для части UI.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

Чтобы сделать обновления значения отложенными, вызовите `useDeferredValue` с этим значением на верхнем уровне своего компонента:

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[См. другие примеры ниже.](#usage)

#### Параметры {/*parameters*/}

<<<<<<< HEAD
* `value`: Значение, обновление которого вы хотите отложить.
* <CanaryBadge title="Эта функциональность доступна только в canary-версии" /> **необязательный** `initialValue`: Значение, установленное для первого рендера. Если этот параметр опущен, `useDeferredValue` не сработает для первого рендера, так как нет предыдущей версии `value`, которую можно было бы показать.
=======
* `value`: The value you want to defer. It can have any type.
* **optional** `initialValue`: A value to use during the initial render of a component. If this option is omitted, `useDeferredValue` will not defer during the initial render, because there's no previous version of `value` that it can render instead.
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c


#### Возвращаемое значение {/*returns*/}

<<<<<<< HEAD
- `currentValue`: При первом рендеринге вызов вернёт то же значение, которое вы указали. Когда в следующих обновлениях значение изменится, вызов вернёт прошлое значение, но при этом React запустит дополнительный фоновый рендеринг, в котором вызов вернёт обновлённое значение.

<Canary>

В последних canary-версиях React, `useDeferredValue` возвращает `initialValue` для первого рендера, и в фоновом режиме планирует последующий рендер уже с `value`.

</Canary>
=======
- `currentValue`: During the initial render, the returned deferred value will be the `initialValue`, or the same as the value you provided. During updates, React will first attempt a re-render with the old value (so it will return the old value), and then try another re-render in the background with the new value (so it will return the updated value).
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c

#### Замечания {/*caveats*/}

- Когда обновление происходит внутри перехода (Transition), оно уже отложено, поэтому `useDeferredValue` всегда возвращает новое значение `value` и не приводит к повторному рендеру.

- Значения, которые вы передаёте в `useDeferredValue`, должны либо быть примитивного типа (как, например, строки или числа), либо должны создаваться **не** во время рендеринга. Если вы будете во время рендеринга каждый раз передавать в `useDeferredValue` свеже созданный объект, то так вы будете постоянно запускать ненужный фоновый рендеринг.

- Когда `useDeferredValue` получит другое значение (сравниваться будет через [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), помимо текущего рендеринга (в котором хук вернёт старое значение), дополнительно в фоне запустится рендеринг для собственно нового значения. Но этот фоновый рендеринг может прерваться: если значение параметра `value` изменится ещё раз, то React перезапустит фоновый рендеринг заново. Например, если пользователь будет печатать быстрее, чем зависящий от ввода график будет успевать в фоне рендерить предыдущий ввод -- график в таком случае обновится, только когда пользователь перестанет печатать.

- `useDeferredValue` интегрирован с [`<Suspense>`.](/reference/react/Suspense) Если фоновое обновление для нового значения задержится, то вместо заглушки `<Suspense>` пользователь просто увидит старое значение, пока загружаются данные для фонового обновления.

- Сам по себе `useDeferredValue` не защищает от лишних запросов в сеть.

- `useDeferredValue` не пытается отложить обновление на какое-то конкретное количество времени. Как только React закончит с текущим рендерингом, он сразу же запустит в фоне рендеринг для новой версии отложенного значения. А любые обновления из-за внешних событий (пользователь печатает, например), будут просто более приоритетными, чем фоновый рендеринг, и прервут его.

- Эффекты фонового рендеринга, вызванного `useDeferredValue`, сработают, только когда React зафиксирует результат на экране. Если фоновый рендеринг запросит задержку, то эффекты сработают только после того, как данные загрузятся, а экран обновится.

---

## Применение {/*usage*/}

### Отображение старых данных, пока загружаются новые {/*showing-stale-content-while-fresh-content-is-loading*/}

Чтобы отложить обновление для части UI, вызовите `useDeferredValue` на верхнем уровне своего компонента:

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

При первом рендеринге <CodeStep step={2}>отложенное значение</CodeStep> будет равно <CodeStep step={1}>значению</CodeStep>, которое вы передадите.

В следующих обновлениях <CodeStep step={2}>отложенное значение</CodeStep> будет как бы "отставать" от актуального <CodeStep step={1}>значения</CodeStep>. А именно: сначала React отрендерит компонент, *не обновляя* отложенное значение, а затем в фоне попытается отрендерить компонент с новым значением.

**Разберём на примере, когда это может быть полезно.**

<Note>

Предполагается, что данные в этом примере вы получаете через источники, которые поддерживают Suspense:

<<<<<<< HEAD
- Запрашиваете данные с помощью поддерживающих Suspense фреймворков, как, например, [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) или [Next.js](https://nextjs.org/docs/getting-started/react-essentials).
- Лениво загружаете код компонентов с помощью [`lazy`](/reference/react/lazy).
- Читаете значение промиса с помощью [`use`](/reference/react/use).
=======
- Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense)
- Lazy-loading component code with [`lazy`](/reference/react/lazy)
- Reading the value of a Promise with [`use`](/reference/react/use)
>>>>>>> 2859efa07357dfc2927517ce9765515acf903c7c

[Подробнее о Suspense и связанных с ним ограничениях.](/reference/react/Suspense)

</Note>


В этом примере компонент `SearchResults` [задерживается](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading), т.к. отправляет поисковый запрос. Попробуйте ввести `"a"`, дождаться результатов поиска, и затем ввести `"ab"`. На месте результатов по запросу `"a"` ненадолго появится индикатор загрузки.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Найти альбом:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Загрузка...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>По запросу <i>"{query}"</i> ничего не найдено</p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Однако здесь можно применить другой частый паттерн в UI: *отложить* обновление списка результатов, продолжив показывать старые результаты, пока не подготовятся новые. Чтобы показать результаты поиска по отложенной версии запроса, можно применить `useDeferredValue`:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Найти альбом:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Загрузка...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

Значение `query` будет всегда актуальным -- соответственно и отображаемый в поле ввода запрос. Но в `deferredQuery` будет предыдущее значение запроса, пока не загрузятся новые результаты поиска -- поэтому `SearchResults` ещё некоторое время будет показывать старые результаты.

В изменённом примере ниже введите `"a"`, дождитесь загрузки результатов поиска, и затем измените запрос на `"ab"`. Обратите внимание, что теперь, пока загружаются новые результаты, вместо индикатора загрузки (заглушки Suspense) отображаются предыдущие результаты.

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Найти альбом:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Загрузка...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>По запросу <i>"{query}"</i> ничего не найдено</p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### Как работает отложенное обновление значения? {/*how-does-deferring-a-value-work-under-the-hood*/}

Для простоты удобно представлять, что обновление происходит в два этапа:

1. **Сначала React отрендерит компонент с новым запросом `"ab"` в `query`, но пока что с отложенным `"a"` в `deferredQuery`.** Значение в `deferredQuery`, которое вы передаёте в список результатов, является *отложенным:* оно "отстаёт" от значения `query`.

2. **Затем в фоне React попытается ещё раз отрендерить компонент, но уже с новым запросом `"ab"` и в `query`, и в `deferredQuery`.** Если этот рендеринг выполнится до конца, то React отобразит его результаты на экране. Но если рендеринг задержится (встанет в ожидании результатов для  `"ab"`), то React эту конкретную попытку прервёт, а когда результаты загрузятся, попробует снова. Пока данные не загрузились, пользователю будет показываться старое отложенное значение.

Отложенный фоновый рендеринг можно прервать. Если, например, продолжить печатать запрос, React прервёт фоновый рендеринг и перезапустит его уже с новым вводом. React всегда будет ориентироваться только на самое последнее переданное ему значение.

В этом примере важно обратить внимание, что запросы в сеть всё ещё отправляются по каждому нажатию на клавиатуре. Откладывается здесь именно обновление результатов на экране, а не отправка в сеть запроса поиска. Просто запрос по каждому нажатию кэшируется -- поэтому по удалению символа результат уже без запроса мгновенно берётся из кэша.

</DeepDive>

---

### Подсветка неактуальных данных {/*indicating-that-the-content-is-stale*/}

В предыдущем примере в списке последних результатов никак не обозначалось, что результаты по новому запросу всё ещё загружаются. Такой интерфейс может сбить с толку, особенно если новые результаты будут загружаться долго. Решить проблему можно, добавив визуальную индикацию для случая, когда отображаемый список результатов больше не актуален и не соответствует последнему запросу:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Благодаря этим изменениям, когда вы начнёте набирать новый запрос, список старых результатов потускнеет, пока не загрузится новый список. Вы даже можете добавить анимированный переход с задержкой, чтобы визуально "устаревание" ощущалось постепенным. Например:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Найти альбом:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Загрузка...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>По запросу <i>"{query}"</i> ничего не найдено</p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### Откладывание повторного рендеринга для части UI {/*deferring-re-rendering-for-a-part-of-the-ui*/}

`useDeferredValue` -- это в том числе инструмент оптимизации. Его можно применить в ситуации, когда какая-то часть вашего UI требует вычислительно долгого рендеринга, с которым очень трудно что-то сделать, но при этом вы не хотите из-за этого постоянно блокировать рендеринг остального UI.

Представьте, что в вашем приложении некий сложный компонент (график, либо очень длинный список) каждый раз заново рендерится по каждому нажатию клавиши в поле ввода:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

Для начала, вы можете [обернуть `SlowList` в `memo`](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged), чтобы рендеринг `SlowList` не повторялся, если его пропсы не меняются.

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

Но этого не достаточно. Ведь так рендеринг ускорится, только если всегда передавать в `SlowList` *одни и те же* значения пропсов. Проблема в том, что рендеринг всё ещё медленный, если передавать *другие* значения пропсов, требующие другой визуализации.

Конкретно в этом примере, `SlowList` будет на каждый ввод символа получать новые пропсы и своим рендерингом блокировать остальной интерфейс. Из-за чего ввод будет слишком заметно "заедать". В такой ситуации с помощью `useDeferredValue` можно сделать обновления поля ввода всегда более приоритетными (отзывчивее), чем обновления списка (которые в любом случае медленные):

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

Собственно сам рендеринг `SlowList` не станет от этого быстрее. Однако теперь React понимает, что не нужно блокировать обработку нажатий рендерингом списка. Визуально список будет как бы "отставать" от ввода, а затем его "догонять". Конечно, как и до оптимизации, React будет стараться обновлять список как можно раньше, но уже не в ущерб возможности печатать.

<Recipes titleText="Сравнение: useDeferredValue против неоптимизированного рендеринга" titleId="examples">

#### Отложенный рендеринг списка {/*deferred-re-rendering-of-the-list*/}

В этом примере каждый элемент в компоненте `SlowList` **искусственно замедлен**, чтобы продемонстрировать, как `useDeferredValue` позволяет сохранить отзывчивость поля ввода. Попробуйте попечатать в поле ввода -- оцените свои ощущения от того, как мгновенно оно реагирует на ввод, хотя список при этом заметно отстаёт.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Собственно замедление происходит в SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Крутимся в цикле одну миллисекунду, эмулируя очень медленный рендеринг
  }

  return (
    <li className="item">
      Текст: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Неоптимизированный рендеринг списка {/*unoptimized-re-rendering-of-the-list*/}

В этом примере каждый элемент в компоненте `SlowList` **искусственно замедлен**, но `useDeferredValue` уже не используется.

Обратите внимание, как поле ввода заедает при каждом нажатии. Так происходит потому, что без `useDeferredValue` каждое нажатие клавиши требует немедленно заново отрендерить список. Причём без возможности прерывать рендеринг.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Собственно замедление происходит в SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Крутимся в цикле одну миллисекунду, эмулируя очень медленный рендеринг
  }

  return (
    <li className="item">
      Текст: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Для такой оптимизации `SlowList` должен обязательно быть обёрнут в [`memo`.](/reference/react/memo) Цель оптимизации ведь в том, чтобы при каждом изменении `text` React рендерил родительский компонент (`App`) как можно быстрей. Во время этого рендеринга в `deferredText` будет такое же значение, как и в прошлый рендеринг -- а значит пропсы `SlowList` не изменились, и нет нужды заново рендерить список. Но без [`memo`](/reference/react/memo) список всё равно будет рендерится ещё раз -- что делает саму оптимизацию бессмысленной.

</Pitfall>

<DeepDive>

#### Чем отложенное обновление отличается от дебаунсинга и тротлинга? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Возможно, вы в похожей ситуации применили бы один из двух распространённых приёмов:

- *Дебаунсинг (debouncing)*, при котором приложение сначала бы дожидалось, когда пользователь перестанет печатать (уже секунду не печатал, например), и потом обновляло список.
- *Тротлинг (throttling)*, при котором, как бы быстро пользователь ни печатал, приложение обновляло бы список не чаще одного раза за какой-то период (раз в секунду, например).

Хотя эти методы полезны в некоторых случаях, `useDeferredValue` лучше подходит для оптимизации рендеринга, поскольку он тесно взаимодействует с React и может подстроиться под возможности устройства пользователя.

Можно не привязываться к какой-то фиксированной задержке. У пользователей с быстрым, мощным устройством фоновый рендеринг будет выполняться быстро и без заметной задержки. А у пользователей со слабым устройством список будет "отставать" ровно на столько, на сколько позволяет устройство.

Кроме того, в отличие от дебаунсинга и тротлинга, отложенный с помощью `useDeferredValue` рендеринг можно прервать. Это значит, что если, например, пользователь введёт очередной символ, пока в фоне рендерится большой сложный список, React прервёт этот рендеринг, обработает ввод, и затем снова запустит рендеринг в фоне. При этом с дебаунсингом или тротлингом в такой же ситуации интерфейс всё ещё будет тормозить и заедать -- ведь эти приёмы не устраняют собственно *блокировку* ввода: с ними она случается просто либо позже, либо реже.

Когда нужно оптимизировать что-то помимо рендеринга, дебаунсинг и тротлинг могут наоборот быть очень полезны. Например, они помогут уменьшить количество запросов в сеть. А ещё их можно совмещать с описанными здесь техниками.

</DeepDive>
