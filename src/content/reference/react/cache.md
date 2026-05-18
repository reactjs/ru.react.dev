---
title: cache
canary: true
---
<RSC>

`cache` предназначен только для использования с [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

</RSC>

<Intro>

`cache` позволяет кэшировать результат получения данных или вычислений.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `cache(fn)` {/*cache*/}

Вызовите `cache` вне любого компонента, чтобы создать версию функции с кэшированием.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Когда `getMetrics` впервые вызывается с `data`, `getMetrics` вызовет `calculateMetrics(data)` и сохранит результат в кэше. Если `getMetrics` будет вызван снова с тем же `data`, он вернет кэшированный результат вместо повторного вызова `calculateMetrics(data)`.

[См. примеры ниже.](#usage)

#### Параметры {/*parameters*/}

- `fn`: Функция, для которой вы хотите кэшировать результаты. `fn` может принимать любые аргументы и возвращать любое значение.

#### Возвращает {/*returns*/}

`cache` возвращает кэшированную версию `fn` с той же сигнатурой типа. Он не вызывает `fn` в процессе.

При вызове `cachedFn` с заданными аргументами, он сначала проверяет, существует ли кэшированный результат в кэше. Если кэшированный результат существует, он возвращает результат. Если нет, он вызывает `fn` с аргументами, сохраняет результат в кэше и возвращает результат. Единственный раз, когда `fn` вызывается, — это при промахе в кэше.

<Note>

Оптимизация кэширования возвращаемых значений на основе входных данных известна как [_мемоизация_](https://en.wikipedia.org/wiki/Memoization). Функцию, возвращаемую из `cache`, мы называем мемоизированной функцией.

</Note>

#### Ограничения {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- React будет инвалидировать кэш для всех мемоизированных функций для каждого серверного запроса.
- Каждый вызов `cache` создает новую функцию. Это означает, что многократный вызов `cache` с одной и той же функцией вернет разные мемоизированные функции, которые не разделяют один и тот же кэш.
- `cachedFn` также будет кэшировать ошибки. Если `fn` выбрасывает ошибку для определенных аргументов, она будет кэширована, и та же ошибка будет повторно выброшена при вызове `cachedFn` с теми же аргументами.
- `cache` предназначен только для использования в [Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

---

## Использование {/*usage*/}

### Кэширование дорогостоящих вычислений {/*cache-expensive-computation*/}

Используйте `cache` для пропуска дублирующейся работы.

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

Если один и тот же объект `user` отображается как в `Profile`, так и в `TeamReport`, эти два компонента могут совместно использовать работу и вызвать `calculateUserMetrics` только один раз для этого `user`.

Предположим, `Profile` отображается первым. Он вызовет <CodeStep step={1}>`getUserMetrics`</CodeStep> и проверит, есть ли кэшированный результат. Поскольку это первый вызов `getUserMetrics` с этим `user`, произойдет промах кэша. Затем `getUserMetrics` вызовет `calculateUserMetrics` с этим `user` и запишет результат в кэш.

Когда `TeamReport` отобразит список `users` и дойдет до того же объекта `user`, он вызовет <CodeStep step={2}>`getUserMetrics`</CodeStep> и прочитает результат из кэша.

<Pitfall>

##### Вызов разных мемоизированных функций приведет к чтению из разных кэшей. {/*pitfall-different-memoized-functions*/}

Для доступа к одному и тому же кэшу компоненты должны вызывать одну и ту же мемоизированную функцию.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Неправильно: вызов `cache` в компоненте создает новый `getWeekReport` для каждого рендера
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Неправильно: `getWeekReport` доступен только для компонента `Precipitation`.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

В приведенном выше примере <CodeStep step={2}>`Precipitation`</CodeStep> и <CodeStep step={1}>`Temperature`</CodeStep> каждый вызывают `cache` для создания новой мемоизированной функции со своими собственными проверками кэша. Если оба компонента рендерятся для одного и того же `cityData`, они выполнят дублирующуюся работу по вызову `calculateWeekReport`.

Кроме того, `Temperature` создает <CodeStep step={1}>новую мемоизированную функцию</CodeStep> при каждом рендере компонента, что не позволяет совместно использовать кэш.

Чтобы максимизировать количество попаданий в кэш и сократить работу, два компонента должны вызывать одну и ту же мемоизированную функцию для доступа к одному и тому же кэшу. Вместо этого определите мемоизированную функцию в выделенном модуле, который можно [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) в компонентах.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
Здесь оба компонента вызывают <CodeStep step={3}>одну и ту же мемоизированную функцию</CodeStep>, экспортируемую из `./getWeekReport.js`, для чтения и записи в один и тот же кэш.
</Pitfall>

### Совместное использование снимка данных {/*take-and-share-snapshot-of-data*/}

Чтобы совместно использовать снимок данных между компонентами, вызовите `cache` с функцией получения данных, такой как `fetch`. Когда несколько компонентов выполняют один и тот же запрос данных, выполняется только один запрос, а возвращенные данные кэшируются и совместно используются между компонентами. Все компоненты ссылаются на один и тот же снимок данных во время серверного рендеринга.

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

Если `AnimatedWeatherCard` и `MinimalWeatherCard` оба рендерятся для одного и того же <CodeStep step={1}>города</CodeStep>, они получат один и тот же снимок данных из <CodeStep step={2}>мемоизированной функции</CodeStep>.

Если `AnimatedWeatherCard` и `MinimalWeatherCard` передают разные аргументы <CodeStep step={1}>города</CodeStep> в <CodeStep step={2}>`getTemperature`</CodeStep>, то `fetchTemperature` будет вызван дважды, и каждый сайт вызова получит разные данные.

<CodeStep step={1}>Город</CodeStep> действует как ключ кэша.

<Note>

[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>Асинхронный рендеринг</CodeStep> поддерживается только для Server Components.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'To render components that use asynchronous data in Client Components, see `use` documentation.'

</Note>

### Предварительная загрузка данных {/*preload-data*/}

Кэшируя длительный запрос данных, вы можете начать асинхронную работу до рендеринга компонента.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Хорошо: начать получение данных пользователя
  getUser(id);
  // ... некоторая вычислительная работа
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

При рендеринге `Page` компонент вызывает <CodeStep step={1}>`getUser`</CodeStep>, но обратите внимание, что он не использует возвращаемые данные. Этот ранний вызов <CodeStep step={1}>`getUser`</CodeStep> запускает асинхронный запрос к базе данных, который происходит, пока `Page` выполняет другую вычислительную работу и рендерит дочерние элементы.

При рендеринге `Profile` мы снова вызываем <CodeStep step={2}>`getUser`</CodeStep>. Если первоначальный вызов <CodeStep step={1}>`getUser`</CodeStep> уже вернул и кэшировал данные пользователя, то когда `Profile` <CodeStep step={2}>запрашивает и ожидает эти данные</CodeStep>, он может просто прочитать их из кэша без необходимости повторного вызова удаленной процедуры. Если <CodeStep step={1}>первоначальный запрос данных</CodeStep> еще не завершен, предварительная загрузка данных по этому шаблону сокращает задержку при получении данных.

<DeepDive>

#### Кэширование асинхронной работы {/*caching-asynchronous-work*/}

При вычислении [асинхронной функции](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) вы получите [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) для этой работы. Promise содержит состояние этой работы ( _pending_, _fulfilled_, _failed_) и ее окончательный результат.

В этом примере асинхронная функция <CodeStep step={1}>`fetchData`</CodeStep> возвращает Promise, который ожидает `fetch`.

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... некоторая вычислительная работа
  await getData();
  // ...
}
```

При первом вызове <CodeStep step={2}>`getData`</CodeStep> Promise, возвращаемый <CodeStep step={1}>`fetchData`</CodeStep>, кэшируется. Последующие обращения будут возвращать тот же Promise.

Обратите внимание, что первый вызов <CodeStep step={2}>`getData`</CodeStep> не использует `await`, в то время как <CodeStep step={3}>второй</CodeStep> использует. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) — это оператор JavaScript, который будет ожидать и возвращать установленный результат Promise. Первый вызов <CodeStep step={2}>`getData`</CodeStep> просто инициирует `fetch` для кэширования Promise для второго <CodeStep step={3}>`getData`</CodeStep> для поиска.

Если ко второму <CodeStep step={3}>вызову</CodeStep> Promise все еще находится в состоянии _pending_, то `await` будет ждать результата. Оптимизация заключается в том, что пока мы ждем `fetch`, React может продолжить вычислительную работу, тем самым сокращая время ожидания для <CodeStep step={3}>второго вызова</CodeStep>.

Если Promise уже установлен, либо в ошибку, либо в _fulfilled_ результат, `await` немедленно вернет это значение. В обоих случаях есть преимущество в производительности.
</DeepDive>

<Pitfall>

##### Вызов мемоизированной функции вне компонента не будет использовать кэш. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Неправильно: вызов мемоизированной функции вне компонента не будет мемоизирован.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Хорошо: `getUser` будет мемоизирован.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React предоставляет доступ к кэшу только мемоизированной функции в компоненте. При вызове <CodeStep step={1}>`getUser`</CodeStep> вне компонента функция все равно будет вычислена, но кэш не будет прочитан или обновлен.

Это связано с тем, что доступ к кэшу предоставляется через [контекст](/learn/passing-data-deeply-with-context), который доступен только из компонента.

</Pitfall>

<DeepDive>

#### Когда следует использовать `cache`, [`memo`](/reference/react/memo) или [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

Все упомянутые API предлагают мемоизацию, но разница заключается в том, что они предназначены для мемоизации, кто может получить доступ к кэшу и когда их кэш инвалидируется.

#### `useMemo` {/*deep-dive-use-memo*/}

В целом, следует использовать [`useMemo`](/reference/react/useMemo) для кэширования дорогостоящих вычислений в Client Component между рендерами. Например, для мемоизации преобразования данных внутри компонента.

```jsx {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
В этом примере `App` рендерит два `WeatherReport` с одной и той же записью. Несмотря на то, что оба компонента выполняют одну и ту же работу, они не могут совместно использовать работу. Кэш `useMemo` доступен только локально для компонента.

Однако `useMemo` гарантирует, что если `App` перерендерится, а объект `record` не изменится, каждый экземпляр компонента пропустит работу и будет использовать мемоизированное значение `avgTemp`. `useMemo` будет кэшировать только последнее вычисление `avgTemp` с заданными зависимостями.

#### `cache` {/*deep-dive-cache*/}

В целом, следует использовать `cache` в Server Components для мемоизации работы, которая может быть совместно использована между компонентами.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
Переписывая предыдущий пример с использованием `cache`, в этом случае <CodeStep step={3}>второй экземпляр `WeatherReport`</CodeStep> сможет пропустить дублирующуюся работу и прочитать из того же кэша, что и <CodeStep step={1}>первый `WeatherReport`</CodeStep>. Еще одно отличие от предыдущего примера заключается в том, что `cache` также рекомендуется для <CodeStep step={2}>мемоизации запросов данных</CodeStep>, в отличие от `useMemo`, который следует использовать только для вычислений.

В настоящее время `cache` следует использовать только в Server Components, и кэш будет инвалидироваться между серверными запросами.

#### `memo` {/*deep-dive-memo*/}

Следует использовать [`memo`](reference/react/memo) для предотвращения повторного рендеринга компонента, если его пропсы не изменились.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

В этом примере оба компонента `MemoWeatherReport` вызовут `calculateAvg` при первом рендеринге. Однако, если `App` перерендерится без изменений в `record`, ни один из пропсов не изменится, и `MemoWeatherReport` не будет перерендериваться.

По сравнению с `useMemo`, `memo` мемоизирует рендеринг компонента на основе пропсов, а не конкретных вычислений. Подобно `useMemo`, мемоизированный компонент кэширует только последний рендер с последними значениями пропсов. Как только пропсы изменятся, кэш инвалидируется, и компонент перерендерится.

</DeepDive>

---

## Устранение неполадок {/*troubleshooting*/}

### Моя мемоизированная функция все еще выполняется, хотя я вызывал ее с теми же аргументами {/*memoized-function-still-runs*/}

См. ранее упомянутые подводные камни:
* [Вызов разных мемоизированных функций приведет к чтению из разных кэшей.](#pitfall-different-memoized-functions)
* [Вызов мемоизированной функции вне компонента не будет использовать кэш.](#pitfall-memoized-call-outside-component)

Если ни одно из вышеперечисленных не применимо, возможно, проблема заключается в том, как React проверяет наличие чего-либо в кэше.

Если ваши аргументы не являются [примитивами](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (например, объекты, функции, массивы), убедитесь, что вы передаете одну и ту же ссылку на объект.

При вызове мемоизированной функции React будет искать входные аргументы, чтобы проверить, есть ли уже кэшированный результат. React будет использовать поверхностное равенство аргументов для определения попадания в кэш.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Неправильно: props — это объект, который меняется при каждом рендере.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

В этом случае два `MapMarker` выглядят так, будто они выполняют одну и ту же работу и вызывают `calculateNorm` с одним и тем же значением `{x: 10, y: 10, z:10}`. Несмотря на то, что объекты содержат одинаковые значения, это не одна и та же ссылка на объект, поскольку каждый компонент создает свой собственный объект `props`.

React будет использовать [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) для проверки входных данных, чтобы убедиться в попадании в кэш.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Хорошо: передавайте примитивы в мемоизированную функцию
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Один из способов решить эту проблему — передать измерения вектора в `calculateNorm`. Это работает, потому что сами измерения являются примитивами.

Другим решением может быть передача самого объекта вектора в качестве пропса компоненту. Нам нужно будет передать один и тот же объект обоим экземплярам компонента.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Хорошо: передайте один и тот же объект `vector`
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
