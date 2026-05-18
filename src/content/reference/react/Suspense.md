---
title: <Suspense>
---
<Intro>

`<Suspense>` позволяет отобразить резервный вариант, пока его дочерние элементы не закончат загрузку.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Пропсы {/*props*/}
* `children`: Фактический UI, который вы намерены отобразить. Если `children` приостанавливает рендеринг, граница Suspense переключится на отображение `fallback`.
* `fallback`: Альтернативный UI для отображения вместо фактического UI, если он еще не закончил загрузку. Принимает любой допустимый React-узел, хотя на практике `fallback` представляет собой легкое заполнительское представление, такое как индикатор загрузки или скелет. Suspense автоматически переключится на `fallback`, когда `children` приостановится, и обратно на `children`, когда данные будут готовы. Если `fallback` приостановится во время рендеринга, он активирует ближайшую родительскую границу Suspense.

#### Особенности {/*caveats*/}

- React не сохраняет состояние для рендеров, которые были приостановлены до их первого монтирования. Когда компонент загрузится, React повторит попытку рендеринга приостановленного дерева с нуля.
- Если Suspense отображал контент для дерева, но затем снова приостановился, будет показан `fallback`, если только обновление, вызвавшее это, не было вызвано [`startTransition`](/reference/react/startTransition) или [`useDeferredValue`](/reference/react/useDeferredValue).
- Если React необходимо скрыть уже видимый контент, потому что он снова приостановился, он очистит [эффекты макета](/reference/react/useLayoutEffect) в дереве контента. Когда контент снова будет готов к отображению, React снова вызовет эффекты макета. Это гарантирует, что эффекты, измеряющие макет DOM, не будут пытаться сделать это, пока контент скрыт.
- React включает в себя оптимизации "под капотом", такие как *потоковая серверная отрисовка* и *выборочная гидратация*, которые интегрированы с Suspense. Прочтите [обзор архитектуры](https://github.com/reactwg/react-18/discussions/37) и посмотрите [технический доклад](https://www.youtube.com/watch?v=pj5N-Khihgc), чтобы узнать больше.

---

## Использование {/*usage*/}

### Отображение запасного варианта во время загрузки контента {/*displaying-a-fallback-while-content-is-loading*/}

Вы можете обернуть любую часть вашего приложения в границу `Suspense`:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React будет отображать ваш <CodeStep step={1}>запасной вариант загрузки</CodeStep> до тех пор, пока не будут загружены весь код и данные, необходимые <CodeStep step={2}>дочерним компонентам</CodeStep>.

В приведенном ниже примере компонент `Albums` *приостанавливается* во время получения списка альбомов. Пока он не будет готов к рендерингу, React переключает ближайшую границу `Suspense` над ним, чтобы показать запасной вариант — ваш компонент `Loading`. Затем, когда данные загрузятся, React скроет запасной вариант `Loading` и отрендерит компонент `Albums` с данными.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Загрузка...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
// Примечание: способ получения данных зависит от
// фреймворка, который вы используете вместе с Suspense.
// Обычно логика кеширования находится внутри фреймворка.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Добавляем фейковую задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

<Note>

**Только источники данных, поддерживающие Suspense, активируют компонент Suspense.** К ним относятся:

- Получение данных с помощью фреймворков, поддерживающих Suspense, таких как [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) и [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- Ленивая загрузка кода компонента с помощью [`lazy`](/reference/react/lazy)
- Чтение значения кешированного Promise с помощью [`use`](/reference/react/use)

`Suspense` **не** обнаруживает получение данных внутри `Effect` или обработчика событий.

Точный способ загрузки данных в компоненте `Albums` выше зависит от вашего фреймворка. Если вы используете фреймворк, поддерживающий Suspense, вы найдете подробности в его документации по получению данных.

Получение данных с поддержкой Suspense без использования специализированного фреймворка пока не поддерживается. Требования к реализации источника данных с поддержкой Suspense нестабильны и не документированы. Официальный API для интеграции источников данных с Suspense будет выпущен в будущей версии React.

</Note>

---

### Одновременное отображение контента {/*revealing-content-together-at-once*/}

По умолчанию все дерево внутри `Suspense` рассматривается как единое целое. Например, даже если *только один* из этих компонентов приостанавливается в ожидании данных, *все* они вместе будут заменены индикатором загрузки:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Затем, после того как все они будут готовы к отображению, они появятся одновременно.

В приведенном ниже примере и `Biography`, и `Albums` получают некоторые данные. Однако, поскольку они сгруппированы под одной границей `Suspense`, эти компоненты всегда «появляются» вместе в одно и то же время.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Загрузка...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
// Примечание: способ получения данных зависит от
// фреймворка, который вы используете вместе с Suspense.
// Обычно логика кеширования находится внутри фреймворка.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Добавляем фейковую задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Добавляем фейковую задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Компоненты, которые загружают данные, не обязательно должны быть прямыми дочерними элементами `Suspense`. Например, вы можете переместить `Biography` и `Albums` в новый компонент `Details`. Это не меняет поведения. `Biography` и `Albums` разделяют одну и ту же ближайшую родительскую границу `Suspense`, поэтому их появление координируется вместе.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### Последовательное отображение вложенного контента по мере загрузки {/*revealing-nested-content-as-it-loads*/}

Когда компонент приостанавливается, ближайший родительский компонент `Suspense` показывает запасной вариант. Это позволяет вкладывать несколько компонентов `Suspense` для создания последовательности загрузки. Запасной вариант каждой границы `Suspense` будет заполняться по мере готовности следующего уровня контента. Например, вы можете дать списку альбомов свой собственный запасной вариант:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

С этим изменением отображение `Biography` не требует «ожидания» загрузки `Albums`.

Последовательность будет следующей:

1. Если `Biography` еще не загружен, `BigSpinner` отображается вместо всей области контента.
2. Как только `Biography` завершит загрузку, `BigSpinner` будет заменен контентом.
3. Если `Albums` еще не загружен, `AlbumsGlimmer` отображается вместо `Albums` и его родительского `Panel`.
4. Наконец, как только `Albums` завершит загрузку, он заменит `AlbumsGlimmer`.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Загрузка...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
// Примечание: способ получения данных зависит от
// фреймворка, который вы используете вместе с Suspense.
// Обычно логика кеширования находится внутри фреймворка.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Добавляем фейковую задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Добавляем фейковую задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Границы `Suspense` позволяют координировать, какие части вашего UI должны всегда «появляться» одновременно, а какие должны постепенно раскрывать больше контента в последовательности состояний загрузки. Вы можете добавлять, перемещать или удалять границы `Suspense` в любом месте дерева, не влияя на поведение остальной части вашего приложения.

Не помещайте границу `Suspense` вокруг каждого компонента. Границы `Suspense` не должны быть более гранулярными, чем последовательность загрузки, которую вы хотите, чтобы пользователь видел. Если вы работаете с дизайнером, спросите его, где должны располагаться состояния загрузки — вероятно, они уже включены в его макеты дизайна.

---

### Отображение устаревшего контента во время загрузки нового {/*showing-stale-content-while-fresh-content-is-loading*/}

В этом примере компонент `SearchResults` приостанавливается во время получения результатов поиска. Введите `"a"`, подождите результатов, а затем измените ввод на `"ab"`. Результаты для `"a"` будут заменены на запасной вариант загрузки.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
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
    return <p>No matches for <i>"{query}"</i></p>;
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
    setTimeout(resolve, 500);
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

Распространенный альтернативный UI-паттерн заключается в том, чтобы *отложить* обновление списка и продолжать отображать предыдущие результаты до тех пор, пока новые результаты не будут готовы. Хук [`useDeferredValue`](/reference/react/useDeferredValue) позволяет передать отложенную версию запроса вниз:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` обновится немедленно, поэтому ввод отобразит новое значение. Однако `deferredQuery` сохранит свое предыдущее значение до тех пор, пока данные не будут загружены, поэтому `SearchResults` будет некоторое время отображать устаревшие результаты.

Чтобы сделать это более очевидным для пользователя, вы можете добавить визуальный индикатор при отображении устаревшего списка результатов:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Введите `"a"` в примере ниже, дождитесь загрузки результатов, а затем измените ввод на `"ab"`. Обратите внимание, что вместо запасного варианта Suspense вы теперь видите затемненный список устаревших результатов до тех пор, пока новые результаты не будут загружены:


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
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
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
    setTimeout(resolve, 500);
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

<Note>

Как отложенные значения, так и [Transitions](#preventing-already-revealed-content-from-hiding) позволяют избежать отображения запасного варианта Suspense в пользу встроенных индикаторов. Transitions помечают все обновление как не срочное, поэтому они обычно используются фреймворками и библиотеками маршрутизации для навигации. Отложенные значения, с другой стороны, в основном полезны в коде приложения, где вы хотите пометить часть UI как не срочную и позволить ей "отставать" от остальной части UI.

</Note>

---

### Предотвращение скрытия уже отображенного контента {/*preventing-already-revealed-content-from-hiding*/}

Когда компонент приостанавливается, ближайший родительский узел Suspense переключается на отображение запасного варианта. Это может привести к резкому ухудшению пользовательского опыта, если он уже отображал какой-то контент. Попробуйте нажать эту кнопку:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Когда вы нажали кнопку, компонент `Router` отобразил `ArtistPage` вместо `IndexPage`. Компонент внутри `ArtistPage` приостановился, поэтому ближайший узел Suspense начал отображать запасной вариант. Ближайшим узлом Suspense был узел у корня, поэтому весь макет сайта был заменен на `BigSpinner`.

Чтобы предотвратить это, вы можете пометить обновление состояния навигации как *Transition* с помощью [`startTransition`:](/reference/react/startTransition)

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);      
    });
  }
  // ...
```

Это говорит React, что переход состояния не является срочным, и лучше продолжать отображать предыдущую страницу, чем скрывать любой уже отображенный контент. Теперь нажатие кнопки "ждет" загрузки `Biography`:

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Transition не ждет загрузки *всего* контента. Он ждет ровно столько, сколько нужно, чтобы не скрывать уже отображенный контент. Например, макет сайта `Layout` уже был отображен, поэтому было бы плохо скрывать его за индикатором загрузки. Однако вложенный узел `Suspense` вокруг `Albums` является новым, поэтому Transition его не ждет.

<Note>

Предполагается, что маршрутизаторы с поддержкой Suspense по умолчанию оборачивают обновления навигации в Transitions.

</Note>

---

### Отображение индикатора перехода {/*indicating-that-a-transition-is-happening*/}

В примере выше, после нажатия кнопки, нет визуального индикатора того, что навигация в процессе. Чтобы добавить индикатор, вы можете заменить [`startTransition`](/reference/react/startTransition) на [`useTransition`](/reference/react/useTransition), который возвращает булево значение `isPending`. В примере ниже оно используется для изменения стиля заголовка сайта во время перехода:

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Загрузка...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Музыкальный браузер
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Открыть страницу исполнителя The Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Примечание: способ получения данных зависит от
// фреймворка, который вы используете вместе с Suspense.
// Обычно логика кеширования находится внутри фреймворка.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Не реализовано');
  }
}

async function getBio() {
  // Добавляем фейковую задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles — английская рок-группа, 
    образованная в Ливерпуле в 1960 году, в состав которой входили 
    Джон Леннон, Пол Маккартни, Джордж Харрисон 
    и Ринго Старр.`;
}

async function getAlbums() {
  // Добавляем фейковую задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Сброс границ Suspense при навигации {/*resetting-suspense-boundaries-on-navigation*/}

Во время перехода React будет избегать скрытия уже отображенного контента. Однако, если вы переходите к маршруту с другими параметрами, вы можете сообщить React, что это *другой* контент. Вы можете выразить это с помощью `key`:

```js
<ProfilePage key={queryParams.id} />
```

Представьте, что вы переходите внутри страницы профиля пользователя, и что-то вызывает приостановку. Если это обновление обернуто в переход, это не вызовет запасной вариант для уже видимого контента. Это ожидаемое поведение.

Однако теперь представьте, что вы переходите между двумя разными профилями пользователей. В этом случае имеет смысл показать запасной вариант. Например, временная шкала одного пользователя — это *другой контент*, отличный от временной шкалы другого пользователя. Указав `key`, вы гарантируете, что React будет рассматривать профили разных пользователей как разные компоненты и сбрасывать границы Suspense во время навигации. Маршрутизаторы, интегрированные с Suspense, должны делать это автоматически.

---

### Предоставление запасного варианта для серверных ошибок и контента, доступного только на клиенте {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

Если вы используете один из [API серверного рендеринга с потоковой передачей](/reference/react-dom/server) (или фреймворк, который на них полагается), React также будет использовать ваши `<Suspense>` границы для обработки ошибок на сервере. Если компонент вызывает ошибку на сервере, React не прервет серверный рендеринг. Вместо этого он найдет ближайший `<Suspense>` компонент над ним и включит его запасной вариант (например, индикатор загрузки) в сгенерированный HTML сервера. Пользователь сначала увидит индикатор загрузки.

На клиенте React попытается снова отрисовать тот же компонент. Если он также вызовет ошибку на клиенте, React вызовет ошибку и отобразит ближайший [предохранитель](/reference/react/Component#static-getderivedstatefromerror). Однако, если на клиенте ошибки не будет, React не покажет ошибку пользователю, поскольку контент в конечном итоге был успешно отображен.

Вы можете использовать это, чтобы исключить некоторые компоненты из рендеринга на сервере. Для этого вызовите ошибку в серверной среде, а затем оберните их в `<Suspense>` границу, чтобы заменить их HTML запасными вариантами:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat должен рендериться только на клиенте.');
  }
  // ...
}
```

Серверный HTML будет включать индикатор загрузки. Он будет заменен компонентом `Chat` на клиенте.

---

## Устранение неполадок {/*troubleshooting*/}

### Как предотвратить замену пользовательского интерфейса на запасной вариант во время обновления? {/*preventing-unwanted-fallbacks*/}

Замена видимого пользовательского интерфейса на запасной вариант создает неприятные впечатления у пользователя. Это может произойти, когда обновление вызывает приостановку компонента, а ближайший `Suspense` уже отображает контент пользователю.

Чтобы предотвратить это, [отметьте обновление как некритичное с помощью `startTransition`](#preventing-already-revealed-content-from-hiding). Во время перехода (`Transition`) React будет ждать, пока не загрузится достаточно данных, чтобы предотвратить появление нежелательного запасного варианта:

```js {2-3,5}
function handleNextPageClick() {
  // Если это обновление вызовет приостановку, не скрывайте уже отображенный контент
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Это позволит избежать скрытия существующего контента. Однако любые вновь отображаемые `Suspense` границы по-прежнему будут немедленно показывать запасные варианты, чтобы не блокировать пользовательский интерфейс и позволить пользователю видеть контент по мере его доступности.

**React будет предотвращать нежелательные запасные варианты только во время некритичных обновлений**. Он не будет задерживать рендеринг, если это результат срочного обновления. Вы должны явно указать это с помощью API, такого как [`startTransition`](/reference/react/startTransition) или [`useDeferredValue`](/reference/react/useDeferredValue).

Если ваш маршрутизатор интегрирован с Suspense, он должен автоматически оборачивать свои обновления в [`startTransition`](/reference/react/startTransition).