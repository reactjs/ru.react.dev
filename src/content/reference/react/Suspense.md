---
title: Задержка
---
```html
<Intro>

`<Suspense>` позволяет отображать запасной вариант, пока его дочерние элементы не завершат загрузку.

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
* `children`: Фактический пользовательский интерфейс, который вы собираетесь отобразить. Если `children` приостанавливает рендеринг, граница Suspense переключится на рендеринг `fallback`.
* `fallback`: Альтернативный пользовательский интерфейс для отображения вместо фактического пользовательского интерфейса, если он не завершил загрузку. Принимается любой допустимый узел React, хотя на практике запасной вариант — это облегченное представление-заполнитель, такое как индикатор загрузки или скелет. Suspense автоматически переключится на `fallback`, когда `children` приостанавливает рендеринг, и обратно на `children`, когда данные будут готовы. Если `fallback` приостанавливает рендеринг, он активирует ближайшую родительскую границу Suspense.

#### Предостережения {/*caveats*/}

- React не сохраняет состояние для рендеров, которые были приостановлены до того, как они смогли смонтироваться в первый раз. Когда компонент загрузится, React повторит рендеринг приостановленного дерева с нуля.
- Если Suspense отображал контент для дерева, но затем снова приостановил его, `fallback` будет показан снова, если обновление, вызвавшее это, не было вызвано [`startTransition`](/reference/react/startTransition) или [`useDeferredValue`](/reference/react/useDeferredValue).
- Если React необходимо скрыть уже видимый контент, потому что он снова приостановлен, он очистит [эффекты макета](/reference/react/useLayoutEffect) в дереве контента. Когда контент будет готов к повторному отображению, React снова запустит эффекты макета. Это гарантирует, что эффекты, измеряющие макет DOM, не будут пытаться сделать это, пока контент скрыт.
- React включает в себя оптимизации, такие как *потоковая серверная отрисовка* и *выборочная гидратация*, которые интегрированы с Suspense. Прочтите [обзор архитектуры](https://github.com/reactwg/react-18/discussions/37) и посмотрите [технический доклад](https://www.youtube.com/watch?v=pj5N-Khihgc), чтобы узнать больше.

---

## Использование {/*usage*/}

### Отображение запасного варианта во время загрузки контента {/*displaying-a-fallback-while-content-is-loading*/}

Вы можете обернуть любую часть вашего приложения границей Suspense:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React отобразит ваш <CodeStep step={1}>запасной вариант загрузки</CodeStep>, пока не будет загружен весь код и данные, необходимые для <CodeStep step={2}>дочерних элементов</CodeStep>.

В примере ниже компонент `Albums` *приостанавливает* рендеринг при получении списка альбомов. Пока он не готов к рендерингу, React переключает ближайшую границу Suspense выше, чтобы показать запасной вариант — ваш компонент `Loading`. Затем, когда данные загружаются, React скрывает запасной вариант `Loading` и отображает компонент `Albums` с данными.

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
// Обычно логика кэширования находится внутри фреймворка.

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
    throw Error('Не реализовано');
  }
}

async function getAlbums() {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
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

**Только источники данных с поддержкой Suspense активируют компонент Suspense.** Они включают в себя:

- Получение данных с помощью фреймворков с поддержкой Suspense, таких как [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) и [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- Ленивая загрузка кода компонента с помощью [`lazy`](/reference/react/lazy)
- Чтение значения закэшированного Promise с помощью [`use`](/reference/react/use)

Suspense **не** обнаруживает, когда данные извлекаются внутри Effect или обработчика событий.

Точный способ загрузки данных в компоненте `Albums` выше зависит от вашего фреймворка. Если вы используете фреймворк с поддержкой Suspense, вы найдете подробности в его документации по получению данных.

Получение данных с поддержкой Suspense без использования предвзятого фреймворка пока не поддерживается. Требования к реализации источника данных с поддержкой Suspense нестабильны и не документированы. Официальный API для интеграции источников данных с Suspense будет выпущен в будущей версии React.

</Note>

---

### Отображение контента вместе одновременно {/*revealing-content-together-at-once*/}

По умолчанию все дерево внутри Suspense обрабатывается как единое целое. Например, даже если *только один* из этих компонентов приостанавливает рендеринг в ожидании каких-либо данных, *все* они вместе будут заменены индикатором загрузки:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Затем, после того, как все они будут готовы к отображению, они все появятся вместе одновременно.

В примере ниже и `Biography`, и `Albums` получают некоторые данные. Однако, поскольку они сгруппированы под одной границей Suspense, эти компоненты всегда «всплывают» вместе в одно и то же время.

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
// Обычно логика кэширования находится внутри фреймворка.

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
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
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

Компоненты, которые загружают данные, не обязательно должны быть прямыми дочерними элементами границы Suspense. Например, вы можете переместить `Biography` и `Albums` в новый компонент `Details`. Это не изменит поведение. `Biography` и `Albums` используют одну и ту же ближайшую родительскую границу Suspense, поэтому их отображение координируется вместе.

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

### Отображение вложенного контента по мере его загрузки {/*revealing-nested-content-as-it-loads*/}

Когда компонент приостанавливает рендеринг, ближайший родительский компонент Suspense показывает запасной вариант. Это позволяет вкладывать несколько компонентов Suspense для создания последовательности загрузки. Запасной вариант каждой границы Suspense будет заполняться по мере доступности следующего уровня контента. Например, вы можете предоставить списку альбомов свой собственный запасной вариант:

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

С этим изменением отображение `Biography` не должно «ждать», пока загрузятся `Albums`.

Последовательность будет следующей:

1. Если `Biography` еще не загрузился, `BigSpinner` отображается вместо всей области контента.
2. После того, как `Biography` завершит загрузку, `BigSpinner` заменяется контентом.
3. Если `Albums` еще не загрузился, `AlbumsGlimmer` отображается вместо `Albums` и его родительского элемента `Panel`.
4. Наконец, после того, как `Albums` завершит загрузку, он заменяет `AlbumsGlimmer`.

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
// Обычно логика кэширования находится внутри фреймворка.

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
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
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

Границы Suspense позволяют координировать, какие части вашего пользовательского интерфейса всегда должны «всплывать» вместе в одно и то же время, а какие части должны постепенно отображать больше контента в последовательности состояний загрузки. Вы можете добавлять, перемещать или удалять границы Suspense в любом месте дерева, не влияя на поведение остальной части вашего приложения.

Не размещайте границу Suspense вокруг каждого компонента. Границы Suspense не должны быть более детализированными, чем последовательность загрузки, которую вы хотите, чтобы пользователь испытал. Если вы работаете с дизайнером, спросите его, где следует разместить состояния загрузки — скорее всего, они уже включили их в свои проектные каркасы.

---

### Отображение устаревшего контента во время загрузки нового контента {/*showing-stale-content-while-fresh-content-is-loading*/}

В этом примере компонент `SearchResults` приостанавливает рендеринг при получении результатов поиска. Введите «a», подождите результатов, а затем отредактируйте его на «ab». Результаты для «a» будут заменены запасным вариантом загрузки.

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
    return <p>Нет совпадений для <i>"{query}"</i></p>;
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
// Примечание: способ получения данных зависит от
// фреймворка, который вы используете вместе с Suspense.
// Обычно логика кэширования находится внутри фреймворка.

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
    throw Error('Не реализовано');
  }
}

async function getSearchResults(query) {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
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

Распространенным альтернативным шаблоном пользовательского интерфейса является *откладывание* обновления списка и продолжение отображения предыдущих результатов до тех пор, пока не будут готовы новые результаты. Хук [`useDeferredValue`](/reference/react/useDeferredValue) позволяет передать отложенную версию запроса вниз:

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
      <Suspense fallback={<h2>Загрузка...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` обновится немедленно, поэтому ввод отобразит новое значение. Однако `deferredQuery` сохранит свое предыдущее значение до тех пор, пока данные не будут загружены, поэтому `SearchResults` на некоторое время покажет устаревшие результаты.

Чтобы сделать это более очевидным для пользователя, вы можете добавить визуальную индикацию при отображении списка устаревших результатов:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1 
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Введите «a» в примере ниже, подождите, пока загрузятся результаты, а затем отредактируйте ввод на «ab». Обратите внимание, как вместо запасного варианта Suspense теперь отображается затемненный список устаревших результатов, пока не загрузятся новые результаты:

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
      <Suspense fallback={<h2>Загрузка...</h2>}>
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
    return <p>Нет совпадений для <i>"{query}"</i></p>;
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
// Примечание: способ получения данных зависит от
// фреймворка, который вы используете вместе с Suspense.
// Обычно логика кэширования находится внутри фреймворка.

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
    throw Error('Не реализовано');
  }
}

async function getSearchResults(query) {
  // Добавьте фиктивную задержку, чтобы ожидание было заметным.
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
  },