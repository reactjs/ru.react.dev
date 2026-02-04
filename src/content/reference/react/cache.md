```html
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

#### Возвращаемое значение {/*returns*/}

`cache` возвращает кэшированную версию `fn` с той же сигнатурой типа. Сам по себе он `fn` не вызывает.

При вызове `cachedFn` с заданными аргументами, он сначала проверяет, существует ли кэшированный результат. Если кэшированный результат существует, он возвращает его. Если нет, он вызывает `fn` с аргументами, сохраняет результат в кэше и возвращает его. `fn` вызывается только при отсутствии кэшированного значения (cache miss).

<Note>

Оптимизация кэширования возвращаемых значений на основе входных данных известна как [_мемоизация_](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BC%D0%BE%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F). Функцию, возвращаемую из `cache`, мы называем мемоизированной функцией.

</Note>

#### Ограничения {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- React будет инвалидировать кэш для всех мемоизированных функций для каждого серверного запроса.
- Каждый вызов `cache` создает новую функцию. Это означает, что многократный вызов `cache` с одной и той же функцией вернет разные мемоизированные функции, которые не разделяют один и тот же кэш.
- `cachedFn` также будет кэшировать ошибки. Если `fn` выбрасывает ошибку для определенных аргументов, она будет закэширована, и та же ошибка будет повторно выброшена при вызове `cachedFn` с теми же аргументами.
- `cache` предназначен только для использования в [Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

---
```

## Использование {/*usage*/}

### Кеширование дорогостоящих вычислений {/*cache-expensive-computation*/}

Используйте `cache`, чтобы пропускать повторяющиеся вызовы.

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

Если один и тот же объект `user` отображается как в `Profile`, так и в `TeamReport`, эти два компонента могут совместно использовать результаты вычислений и вызвать `calculateUserMetrics` только один раз для этого `user`.

Предположим, сначала отображается `Profile`. Он вызовет <CodeStep step={1}>`getUserMetrics`</CodeStep> и проверит, есть ли кешированный результат. Поскольку это первый вызов `getUserMetrics` с этим `user`, кеш будет пуст. Затем `getUserMetrics` вызовет `calculateUserMetrics` с этим `user` и запишет результат в кеш.

Когда `TeamReport` отобразит список `users` и дойдет до того же объекта `user`, он вызовет <CodeStep step={2}>`getUserMetrics`</CodeStep> и прочитает результат из кеша.

<Pitfall>

##### Вызов разных мемоизированных функций приведет к чтению из разных кешей. {/*pitfall-different-memoized-functions*/}

Чтобы получить доступ к одному и тому же кешу, компоненты должны вызывать одну и ту же мемоизированную функцию.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Неправильно: вызов `cache` в компоненте создает новую `getWeekReport` при каждом рендере
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Неправильно: `getWeekReport` доступна только для компонента `Precipitation`.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

В приведенном выше примере <CodeStep step={2}>`Precipitation`</CodeStep> и <CodeStep step={1}>`Temperature`</CodeStep> каждый вызывает `cache` для создания новой мемоизированной функции со своим собственным кешем. Если оба компонента рендерятся для одних и тех же `cityData`, они будут выполнять повторяющуюся работу, вызывая `calculateWeekReport`.

Кроме того, `Temperature` создает <CodeStep step={1}>новую мемоизированную функцию</CodeStep> при каждом рендере компонента, что не позволяет совместно использовать кеш.

Чтобы максимизировать количество попаданий в кеш и уменьшить объем работы, оба компонента должны вызывать одну и ту же мемоизированную функцию для доступа к одному и тому же кешу. Вместо этого определите мемоизированную функцию в выделенном модуле, который можно [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) в компонентах.

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
Здесь оба компонента вызывают <CodeStep step={3}>одну и ту же мемоизированную функцию</CodeStep>, экспортируемую из `./getWeekReport.js`, для чтения и записи в один и тот же кеш.
</Pitfall>

### Обмен снимком данных {/*take-and-share-snapshot-of-data*/}

Чтобы обмениваться снимком данных между компонентами, вызовите `cache` с функцией получения данных, такой как `fetch`. Когда несколько компонентов выполняют один и тот же запрос данных, выполняется только один запрос, а возвращенные данные кешируются и передаются между компонентами. Все компоненты ссылаются на один и тот же снимок данных во время рендеринга на сервере.

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

Если `AnimatedWeatherCard` и `MinimalWeatherCard` передают разные <CodeStep step={1}>города</CodeStep> в качестве аргументов <CodeStep step={2}>`getTemperature`</CodeStep>, то `fetchTemperature` будет вызван дважды, и каждый вызов получит разные данные.

<CodeStep step={1}>Город</CodeStep> действует как ключ кеша.

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

Кешируя длительный запрос данных, вы можете начать асинхронную работу до рендеринга компонента.

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
  // ✅ Хорошо: начинаем загрузку данных пользователя
  getUser(id);
  // ... некоторая вычислительная работа
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

При рендеринге `Page` компонент вызывает <CodeStep step={1}>`getUser`</CodeStep>, но обратите внимание, что он не использует возвращаемые данные. Этот ранний вызов <CodeStep step={1}>`getUser`</CodeStep> запускает асинхронный запрос к базе данных, который выполняется, пока `Page` выполняет другую вычислительную работу и рендерит дочерние элементы.

При рендеринге `Profile` мы снова вызываем <CodeStep step={2}>`getUser`</CodeStep>. Если первоначальный вызов <CodeStep step={1}>`getUser`</CodeStep> уже вернул и закешировал данные пользователя, то когда `Profile` <CodeStep step={2}>запрашивает и ожидает эти данные</CodeStep>, он может просто прочитать их из кеша без необходимости повторного вызова удаленной процедуры. Если <CodeStep step={1}>первоначальный запрос данных</CodeStep> не был завершен, предварительная загрузка данных в этом шаблоне сокращает задержку при получении данных.

<DeepDive>

#### Кеширование асинхронной работы {/*caching-asynchronous-work*/}

При вычислении [асинхронной функции](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) вы получите [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) для этой работы. Promise хранит состояние этой работы (_pending_, _fulfilled_, _failed_) и ее окончательный результат.

В этом примере асинхронная функция <CodeStep step={1}>`fetchData`</CodeStep> возвращает Promise, который ожидает результат `fetch`.

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

При первом вызове <CodeStep step={2}>`getData`</CodeStep> Promise, возвращаемый <CodeStep step={1}>`fetchData`</CodeStep>, кешируется. Последующие обращения будут возвращать тот же Promise.

Обратите внимание, что первый вызов <CodeStep step={2}>`getData`</CodeStep> не использует `await`, в то время как <CodeStep step={3}>второй</CodeStep> использует. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) — это оператор JavaScript, который будет ждать и возвращать окончательный результат Promise. Первый вызов <CodeStep step={2}>`getData`</CodeStep> просто инициирует `fetch` для кеширования Promise, чтобы второй вызов <CodeStep step={3}>`getData`</CodeStep> мог его найти.

Если ко второму вызову <CodeStep step={3}>Promise</CodeStep> все еще находится в состоянии _pending_, то `await` приостановит выполнение до получения результата. Оптимизация заключается в том, что пока мы ждем `fetch`, React может продолжить вычислительную работу, тем самым сокращая время ожидания для <CodeStep step={3}>второго вызова</CodeStep>.

Если Promise уже разрешен, либо ошибкой, либо _успешным_ результатом, `await` немедленно вернет это значение. В обоих случаях есть выгода в производительности.
</DeepDive>

<Pitfall>

##### Вызов мемоизированной функции вне компонента не будет использовать кеш. {/*pitfall-memoized-call-outside-component*/}

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

React предоставляет доступ к кешу для мемоизированной функции только в компоненте. При вызове <CodeStep step={1}>`getUser`</CodeStep> вне компонента функция все равно будет вычислена, но кеш не будет прочитан или обновлен.

Это связано с тем, что доступ к кешу предоставляется через [контекст](/learn/passing-data-deeply-with-context), который доступен только из компонента.

</Pitfall>

<DeepDive>

#### Когда следует использовать `cache`, [`memo`](/reference/react/memo) или [`useMemo`](/reference/react/useMemo)? {/*cache-memo-usememo*/}

Все упомянутые API предлагают мемоизацию, но разница заключается в том, что они предназначены для мемоизации, кто может получить доступ к кешу и когда их кеш инвалидируется.

#### `useMemo` {/*deep-dive-use-memo*/}

В целом, следует использовать [`useMemo`](/reference/react/useMemo) для кеширования дорогостоящих вычислений в Client Component между рендерами. Например, для мемоизации преобразования данных внутри компонента.

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
В этом примере `App` рендерит два `WeatherReport` с одним и тем же `record`. Несмотря на то, что оба компонента выполняют одну и ту же работу, они не могут совместно использовать ее. Кеш `useMemo` доступен только локально для компонента.

Однако `useMemo` гарантирует, что если `App` перерендерится, а объект `record` не изменится, каждый экземпляр компонента пропустит работу и будет использовать мемоизированное значение `avgTemp`. `useMemo` будет кешировать только последнее вычисление `avgTemp` с заданными зависимостями.

#### `cache` {/*deep-dive-cache*/}

В целом, следует использовать `cache` в Server Components для мемоизации работы, которая может быть разделена между компонентами.

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
Переписывая предыдущий пример с использованием `cache`, в этом случае <CodeStep step={3}>второй экземпляр `WeatherReport`</CodeStep> сможет пропустить повторяющуюся работу и прочитать из того же кеша, что и <CodeStep step={1}>первый `WeatherReport`</CodeStep>. Еще одно отличие от предыдущего примера заключается в том, что `cache` также рекомендуется для <CodeStep step={2}>мемоизации запросов данных</CodeStep>, в отличие от `useMemo`, который следует использовать только для вычислений.

В настоящее время `cache` следует использовать только в Server Components, и кеш будет инвалидироваться между запросами сервера.

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

По сравнению с `useMemo`, `memo` мемоизирует рендер компонента на основе пропсов, а не конкретных вычислений. Подобно `useMemo`, мемоизированный компонент кеширует только последний рендер с последними значениями пропсов. Как только пропсы изменятся, кеш инвалидируется, и компонент перерендерится.

</DeepDive>

---

## Устранение неполадок {/*troubleshooting*/}

### Моя мемоизированная функция всё равно выполняется, хотя я вызывал её с теми же аргументами {/*memoized-function-still-runs*/}

См. ранее упомянутые подводные камни:
* [Вызов разных мемоизированных функций будет использовать разные кеши.](#pitfall-different-memoized-functions)
* [Вызов мемоизированной функции вне компонента не будет использовать кеш.](#pitfall-memoized-call-outside-component)

Если ни одно из вышеперечисленных условий не применимо, возможно, проблема заключается в том, как React проверяет наличие чего-либо в кеше.

Если ваши аргументы не являются [примитивами](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) (например, объекты, функции, массивы), убедитесь, что вы передаёте одну и ту же ссылку на объект.

При вызове мемоизированной функции React будет искать входные аргументы, чтобы проверить, не сохранён ли уже результат в кеше. React будет использовать поверхностное сравнение аргументов для определения попадания в кеш.

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

В этом случае два `MapMarker` выглядят так, будто выполняют одну и ту же работу и вызывают `calculateNorm` с одним и тем же значением `{x: 10, y: 10, z:10}`. Несмотря на то, что объекты содержат одинаковые значения, это не одна и та же ссылка на объект, поскольку каждый компонент создаёт свой собственный объект `props`.

React будет использовать [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) для входных данных, чтобы проверить, произошло ли попадание в кеш.

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

Другим решением может быть передача самого объекта вектора в качестве пропса компоненту. Нам нужно будет передать один и тот же объект обеим экземплярам компонента.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Хорошо: передавайте один и тот же объект `vector`
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