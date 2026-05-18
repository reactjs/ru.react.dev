---
title: <ViewTransition>
version: experimental
---
<Experimental>

**Этот API является экспериментальным и пока недоступен в стабильной версии React.**

Вы можете попробовать его, обновив пакеты React до последней экспериментальной версии:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Экспериментальные версии React могут содержать ошибки. Не используйте их в продакшене.

</Experimental>

<Intro>

`<ViewTransition>` позволяет анимировать элементы, которые обновляются внутри [Transition](/reference/react/useTransition).


```js
import {unstable_ViewTransition as ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

Оберните элементы в `<ViewTransition>`, чтобы анимировать их при обновлении внутри [Transition](/reference/react/useTransition). React использует следующие эвристики для определения, активируется ли View Transition для анимации:

- `enter`: Если сам `ViewTransition` вставляется в этот Transition, то он активируется.
- `exit`: Если сам `ViewTransition` удаляется в этом Transition, то он активируется.
- `update`: Если `ViewTransition` содержит DOM-мутации, выполняемые React (например, изменение пропса), или если граница `ViewTransition` изменяет размер или положение из-за непосредственного соседа. Если есть вложенные `ViewTransition`, то мутация применяется к ним, а не к родительскому элементу.
- `share`: Если именованный `ViewTransition` находится во вложенном поддереве, а другой именованный `ViewTransition` с тем же именем является частью вставленного поддерева в том же Transition, они образуют Shared Element Transition и анимируются от удаленного к вставленному.

По умолчанию `<ViewTransition>` анимируется с помощью плавного перекрестного затухания (стандартный переход представления браузера). Вы можете настроить анимацию, предоставив [View Transition Class](#view-transition-class) компоненту `<ViewTransition>`. Вы можете настроить анимацию для каждого типа триггера (см. [Стилизация View Transitions](#styling-view-transitions)).

<DeepDive>

#### Как работает `<ViewTransition>`? {/*how-does-viewtransition-work*/}

Под капотом React применяет `view-transition-name` к инлайн-стилям ближайшего DOM-узла, вложенного в компонент `<ViewTransition>`. Если есть несколько соседних DOM-узлов, таких как `<ViewTransition><div /><div /></ViewTransition>`, React добавляет суффикс к имени, чтобы сделать каждый уникальным, но концептуально они являются частью одного и того же. React не применяет их немедленно, а только в тот момент, когда граница должна участвовать в анимации.

React автоматически вызывает `startViewTransition` сам, поэтому вам никогда не следует делать это самостоятельно. Фактически, если что-то другое на странице запускает ViewTransition, React прервет его. Поэтому рекомендуется использовать сам React для координации этих действий. Если у вас были другие способы запуска ViewTransitions в прошлом, мы рекомендуем перейти на встроенный способ.

Если другие React ViewTransitions уже запущены, React дождется их завершения, прежде чем начать следующий. Однако важно отметить, что если во время выполнения первого происходит несколько обновлений, все они будут сгруппированы в одно. Если вы запускаете A->B. Затем в это время происходит обновление до C, а затем до D. Когда первая анимация A->B завершится, следующая будет анимирована от B->D.

Метод жизненного цикла `getSnapshotBeforeUpdate` будет вызван перед `startViewTransition`, и некоторые `view-transition-name` будут обновлены одновременно.

Затем React вызывает `startViewTransition`. Внутри `updateCallback` React:

- Применяет мутации к DOM и вызывает useInsertionEffects.
- Ждет загрузки шрифтов.
- Вызывает componentDidMount, componentDidUpdate, useLayoutEffect и refs.
- Ждет завершения любой ожидающей навигации.
- Затем React измерит любые изменения в макете, чтобы определить, какие границы потребуют анимации.

После разрешения промиса `startViewTransition` React отменит `view-transition-name`. Затем React вызовет колбэки `onEnter`, `onExit`, `onUpdate` и `onShare`, чтобы разрешить ручное программное управление анимациями. Это произойдет после того, как будут вычислены встроенные стандартные анимации.

Если `flushSync` произойдет в середине этой последовательности, React пропустит Transition, поскольку он зависит от возможности синхронного завершения.

После разрешения промиса завершения `startViewTransition` React вызовет `useEffect`. Это предотвращает их вмешательство в производительность анимации. Однако это не гарантия, потому что если другой `setState` произойдет во время выполнения анимации, он все равно должен будет вызвать `useEffect` раньше, чтобы сохранить последовательные гарантии.

</DeepDive>

#### Пропсы {/*props*/}

По умолчанию `<ViewTransition>` анимируется с помощью плавного перекрестного затухания. Вы можете настроить анимацию или указать переход общих элементов с помощью этих пропсов:

* **optional** `enter`: Строка или объект. [View Transition Class](#view-transition-class), применяемый при активации `enter`.
* **optional** `exit`: Строка или объект. [View Transition Class](#view-transition-class), применяемый при активации `exit`.
* **optional** `update`: Строка или объект. [View Transition Class](#view-transition-class), применяемый при активации `update`.
* **optional** `share`: Строка или объект. [View Transition Class](#view-transition-class), применяемый при активации общего элемента.
* **optional** `default`: Строка или объект. [View Transition Class](#view-transition-class), используемый, когда не найден другой соответствующий проп активации.
* **optional** `name`: Строка или объект. Имя View Transition, используемое для переходов общих элементов. Если не указано, React будет использовать уникальное имя для каждого View Transition, чтобы предотвратить неожиданные анимации.

#### Колбэки {/*events*/}

Эти колбэки позволяют вам настраивать анимацию императивно с помощью API [animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate):

* **optional** `onEnter`: Функция. React вызывает `onEnter` после анимации "enter".
* **optional** `onExit`: Функция. React вызывает `onExit` после анимации "exit".
* **optional** `onShare`: Функция. React вызывает `onShare` после анимации "share".
* **optional** `onUpdate`: Функция. React вызывает `onUpdate` после анимации "update".

Каждый колбэк получает в качестве аргументов:
- `element`: DOM-элемент, который был анимирован.
- `types`: [Transition Types](/reference/react/addTransitionType), включенные в анимацию.

### View Transition Class {/*view-transition-class*/}

View Transition Class — это имя(имена) CSS-класса, применяемое React во время перехода при активации ViewTransition. Это может быть строка или объект.
- `string`: `class`, добавленный к дочерним элементам при активации. Если указано `'none'`, класс не будет добавлен.
- `object`: класс, добавленный к дочерним элементам, будет соответствовать ключу типа View Transition, добавленного с помощью `addTransitionType`. Объект также может указывать `default` для использования, если соответствующий тип не найден.

Значение `'none'` может быть использовано для предотвращения активации View Transition для определенного триггера.

### Стилизация View Transitions {/*styling-view-transitions*/}

<Note>

Во многих ранних примерах View Transitions в интернете вы видели использование [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) с последующей стилизацией с помощью селекторов `::view-transition-...(my-name)`. Мы не рекомендуем такой подход для стилизации. Вместо этого мы обычно рекомендуем использовать View Transition Class.

</Note>

Чтобы настроить анимацию для `<ViewTransition>`, вы можете предоставить View Transition Class одному из пропсов активации. View Transition Class — это имя CSS-класса, которое React применяет к дочерним элементам при активации ViewTransition.

Например, чтобы настроить анимацию "enter", предоставьте имя класса пропсу `enter`:


```js
<ViewTransition enter="slide-in">
```

Когда `<ViewTransition>` активирует анимацию "enter", React добавит имя класса `slide-in`. Затем вы можете ссылаться на этот класс с помощью [псевдоселекторов View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements) для создания многоразовых анимаций:

```css
::view-transition-group(.slide-in) {
  
}
::view-transition-old(.slide-in) {

}
::view-transition-new(.slide-in) {

}
```
В будущем CSS-библиотеки могут добавлять встроенные анимации, используя View Transition Classes, чтобы упростить их использование.

#### Оговорки {/*caveats*/}

- По умолчанию `setState` обновляется немедленно и не активирует `<ViewTransition>`, только обновления, обернутые в [Transition](/reference/react/useTransition). Вы также можете использовать [`<Suspense>`](/reference/react/Suspense) для выбора Transition для [отображения контента](/link-to-suspense-below).
- `<ViewTransition>` создает изображение, которое можно перемещать, масштабировать и перекрестно затушевывать. В отличие от Layout Animations, которые вы могли видеть в React Native или Motion, это означает, что не каждый отдельный элемент внутри него анимирует свое положение. Это может привести к лучшей производительности и более непрерывному, плавному ощущению по сравнению с анимацией каждого отдельного элемента. Однако это также может привести к потере непрерывности в вещах, которые должны двигаться сами по себе. Поэтому вам, возможно, придется вручную добавлять больше границ `<ViewTransition>`.
- Многие пользователи могут предпочесть отсутствие анимации на странице. React автоматически не отключает анимацию для этого случая. Мы рекомендуем использовать медиа-запрос `@media (prefers-reduced-motion)` для отключения анимации или ее смягчения в зависимости от предпочтений пользователя. В будущем CSS-библиотеки могут иметь это встроенным в свои пресеты.
- В настоящее время `<ViewTransition>` работает только в DOM. Мы работаем над добавлением поддержки React Native и других платформ.

---


## Использование {/*usage*/}

### Анимация элемента при входе/выходе {/*animating-an-element-on-enter*/}

Переходы входа/выхода срабатывают, когда `<ViewTransition>` добавляется или удаляется компонентом в рамках перехода:

```js
function Child() {
  return <ViewTransition>Hi</ViewTransition>
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

Когда вызывается `setShow`, `show` переключается на `true`, и компонент `Child` рендерится. Когда `Child` рендерит `ViewTransition` перед любыми другими DOM-узлами, срабатывает анимация `enter`.

Когда `show` переключается обратно на `false`, срабатывает анимация `exit`.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Pitfall>

`<ViewTransition>` активируется только в том случае, если он расположен перед любым DOM-узлом. Если бы `Child` выглядел так, анимация не сработала бы:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}
```

</Pitfall>

---
### Анимация общего элемента {/*animating-a-shared-element*/}

Обычно мы не рекомендуем присваивать имя `<ViewTransition>` и вместо этого позволяем React присваивать ему автоматическое имя. Причина, по которой вы можете захотеть присвоить имя, — это анимировать переход между совершенно разными компонентами, когда одно дерево размонтируется, а другое монтируется одновременно. Для сохранения непрерывности.

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

Когда одно дерево размонтируется, а другое монтируется, если существует пара с одинаковым именем в размонтируемом дереве и монтируемом дереве, это инициирует анимацию "совместного использования" на обоих. Она анимируется от размонтируемой стороны к монтируемой.

В отличие от анимации выхода/входа, это может быть глубоко внутри удаляемого/смонтированного дерева. Если `<ViewTransition>` также будет подходить для выхода/входа, то анимация "совместного использования" имеет приоритет.

Если переход сначала размонтирует одну сторону, а затем приводит к отображению запасного варианта `<Suspense>` перед тем, как в конечном итоге будет смонтировано новое имя, то переход общего элемента не происходит.

<Sandpack>

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video, Thumbnail, FullscreenVideo} from "./Video";
import videos from "./data";

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return <FullscreenVideo
      video={videos[0]}
      onExit={() => startTransition(() => setFullscreen(false))}
    />
  }
  return <Video
    video={videos[0]}
    onClick={() => startTransition(() => setFullscreen(true))}
  />
}

```

```js src/Video.js
import {unstable_ViewTransition as ViewTransition} from "react";

const THUMBNAIL_NAME = "video-thumbnail"

export function Thumbnail({ video, children }) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({ video, onClick }) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button
          className="close-button"
          onClick={onExit}
        >
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```


```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  height: 100%;
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>


<Note>

Если одна из сторон пары (смонтированная или размонтированная) находится за пределами области просмотра, то пара не формируется. Это гарантирует, что она не вылетит из области просмотра при прокрутке. Вместо этого она обрабатывается как обычный вход/выход сама по себе.

Это не происходит, если один и тот же экземпляр компонента меняет положение, что вызывает "обновление". Такие элементы анимируются независимо от того, находится ли одна из позиций за пределами области просмотра.

В настоящее время существует особенность: если глубоко вложенный размонтированный `<ViewTransition>` находится в пределах области просмотра, но смонтированная сторона находится за ее пределами, то размонтированная сторона анимируется как собственный "выход", даже если она глубоко вложена, а не как часть анимации родителя.

</Note>

<Pitfall>

Важно, чтобы в приложении одновременно был смонтирован только один элемент с одинаковым именем. Поэтому важно использовать уникальные пространства имен для имени, чтобы избежать конфликтов. Чтобы гарантировать это, вы можете добавить константу в отдельный модуль, который вы импортируете.

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>


---

### Анимация переупорядочивания элементов в списке {/*animating-reorder-of-items-in-a-list*/}


```js
items.map(item => <Component key={item.id} item={item} />)
```

При переупорядочивании списка без обновления содержимого анимация "обновления" срабатывает для каждого `<ViewTransition>` в списке, если они находятся вне DOM-узла. Аналогично анимациям входа/выхода.

Это означает, что это вызовет анимацию для этого `<ViewTransition>`:

```js
function Component() {
  return <ViewTransition><div>...</div></ViewTransition>;
}
```
<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}
  

```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Однако это не будет анимировать каждый отдельный элемент:

```js
function Component() {
  return <div><ViewTransition>...</ViewTransition></div>;
}
```
Вместо этого любой родительский `<ViewTransition>` будет плавно переходить. Если родительского `<ViewTransition>` нет, то в этом случае анимации не будет.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from "react";
import {Video} from "./Video";
import videos from "./data";

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}
  

```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  }
]
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Это означает, что вы можете захотеть избежать обертывающих элементов в списках, где вы хотите позволить компоненту управлять собственной анимацией переупорядочивания:

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

Вышеуказанное правило также применяется, если один из элементов обновляется, чтобы изменить размер, что затем вызывает изменение размера соседних элементов; это также будет анимировать соседний `<ViewTransition>`, но только если они являются непосредственными соседями.

Это означает, что во время обновления, вызывающего множество перерасчетов макета, React не анимирует индивидуально каждый `<ViewTransition>` на странице. Это привело бы к большому количеству шумных анимаций, отвлекающих от фактического изменения. Поэтому React более консервативен в отношении того, когда срабатывает индивидуальная анимация.

<Pitfall>

Важно правильно использовать ключи для сохранения идентичности при переупорядочивании списков. Может показаться, что вы можете использовать "имя", совместное использование элементов для анимации переупорядочивания, но это не сработает, если одна сторона находится за пределами области просмотра. Чтобы анимировать переупорядочивание, вы часто хотите показать, что оно переместилось в положение за пределами области просмотра.

</Pitfall>

---

### Анимация контента из Suspense {/*animating-from-suspense-content*/}

Как и любая другая анимация перехода (Transition), React ожидает загрузки данных и новых CSS (`<link rel="stylesheet" precedence="...">`) перед запуском анимации. Кроме того, ViewTransitions также ожидают до 500 мс загрузки новых шрифтов перед началом анимации, чтобы избежать их мерцания. По той же причине изображение, обёрнутое в ViewTransition, будет ждать загрузки изображения.

Если контент находится внутри нового экземпляра Suspense boundary, сначала отображается резервный вариант (fallback). После полной загрузки Suspense boundary запускается `<ViewTransition>` для анимации отображения контента.

В настоящее время это происходит только для клиентских переходов (client-side Transition). В будущем это также будет применяться для анимации Suspense boundary при потоковой передаче SSR, когда контент с сервера приостанавливается во время начальной загрузки.

Существует два способа анимировать Suspense boundary в зависимости от того, где вы размещаете `<ViewTransition>`:

Обновление:

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```
В этом сценарии, когда контент переходит от A к B, он будет рассматриваться как «обновление» и, при необходимости, будет применена соответствующая CSS-классификация. Оба A и B получат одинаковое имя `view-transition-name` и, следовательно, по умолчанию будут действовать как плавное затухание (cross-fade).

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: "loading"}
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition,
  Suspense
} from 'react';
import {Video, VideoPlaceholder} from "./Video";
import {useLazyVideoData} from "./data"

function LazyVideo() {
  const video = useLazyVideoData();
  return (
    <Video video={video}/>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from "react";

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```


```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(90deg, rgba(173, 216, 230, 0.3) 25%, rgba(135, 206, 250, 0.5) 50%, rgba(173, 216, 230, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Вход/Выход:

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

В этом сценарии это два отдельных экземпляра ViewTransition, каждый со своим `view-transition-name`. Это будет рассматриваться как «выход» из `<A>` и «вход» в `<B>`.

Вы можете добиться различных эффектов в зависимости от того, где вы размещаете границу `<ViewTransition>`.

---
### Отключение анимации {/*opting-out-of-an-animation*/}

Иногда вы оборачиваете большой существующий компонент, например, целую страницу, и хотите анимировать некоторые обновления, такие как изменение темы. Однако вы не хотите, чтобы все обновления внутри всей страницы автоматически получали эффект плавного затухания (cross-fade) при их изменении. Особенно если вы постепенно добавляете больше анимаций.

Вы можете использовать класс "none" для отключения анимации. Обернув дочерние элементы в "none", вы можете отключить анимацию для их обновлений, в то время как родительский элемент по-прежнему будет запускать анимацию.

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">
      {children}
    </ViewTransition>
  </div>
</ViewTransition>
```

Это анимирует только изменение темы, а не только обновление дочерних элементов. Дочерние элементы по-прежнему могут снова включить анимацию с помощью собственного `<ViewTransition>`, но, по крайней мере, это будет сделано вручную.

---

### Настройка анимаций {/*customizing-animations*/}

По умолчанию `<ViewTransition>` включает стандартное плавное затухание (cross-fade) из браузера.

Чтобы настроить анимации, вы можете передать пропсы компоненту `<ViewTransition>`, чтобы указать, какие анимации использовать, в зависимости от того, как активируется `<ViewTransition>`.

Например, мы можем замедлить стандартное плавное затухание:

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

И определить `slow-fade` в CSS с помощью классов view transition:

```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Помимо установки `default`, вы также можете предоставить конфигурации для анимаций `enter`, `exit`, `update` и `share`.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >{showItem ? '➖' : '➕'}</button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

### Настройка анимаций с помощью типов {/*customizing-animations-with-types*/}
Вы можете использовать API [`addTransitionType`](/reference/react/addTransitionType) для добавления имени класса к дочерним элементам при активации определенного типа перехода для конкретного триггера активации. Это позволяет настроить анимацию для каждого типа перехода.

Например, чтобы настроить анимацию для всех прямых и обратных навигаций:

```js
<ViewTransition default={{
  'navigation-back': 'slide-right',
  'navigation-forward': 'slide-left',
 }}>
  <div>...</div>
</ViewTransition>
 
// в вашем роутере:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

Когда ViewTransition активирует анимацию "navigation-back", React добавит имя класса "slide-right". Когда ViewTransition активирует анимацию "navigation-forward", React добавит имя класса "slide-left".

В будущем роутеры и другие библиотеки могут добавить поддержку стандартных типов и стилей view-transition.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({ video }) {
  return (
    <div className="video">
      <div
        className="link"
      >
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  unstable_ViewTransition as ViewTransition,
  unstable_addTransitionType as addTransitionType,
  useState,
  startTransition,
} from "react";
import {Video} from "./Video";
import videos from "./data"

function Item() {
  return (
    <ViewTransition enter={
        {
          "add-video-back": "slide-in-back",
          "add-video-forward": "slide-in-forward"
        }
      }
      exit={
        {
          "remove-video-back": "slide-in-forward",
          "remove-video-forward": "slide-in-back"
        }
      }>
      <Video video={videos[0]}/>
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-back")
              } else {
                addTransitionType("add-video-back")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >⬅️</button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType("remove-video-forward")
              } else {
                addTransitionType("add-video-forward")
              }
              setShowItem((prev) => !prev);
            });
          }}
        >➡️</button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  }
]
```


```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

### Создание роутеров с поддержкой View Transition {/*building-view-transition-enabled-routers*/}

React ожидает завершения любых ожидающих навигаций (Navigation), чтобы гарантировать, что восстановление прокрутки (scroll restoration) происходит в рамках анимации. Если навигация заблокирована в React, ваш роутер должен разблокировать ее в `useLayoutEffect`, поскольку `useEffect` приведет к взаимоблокировке (deadlock).

Если `startTransition` запускается из устаревшего события popstate, например, во время навигации "назад" (back-navigation), то он должен завершиться синхронно, чтобы обеспечить правильное восстановление прокрутки и форм. Это противоречит выполнению анимации View Transition. Поэтому React будет пропускать анимации из popstate. Следовательно, анимации не будут выполняться для кнопки "назад". Вы можете исправить это, обновив свой роутер для использования Navigation API.

---

## Устранение неполадок {/*troubleshooting*/}

### Мой `<ViewTransition>` не активируется {/*my-viewtransition-is-not-activating*/}

`<ViewTransition>` активируется только в том случае, если он расположен перед любым DOM-узлом:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>Hi</ViewTransition>
    </div>
  );
}
```

Чтобы исправить это, убедитесь, что `<ViewTransition>` находится перед любыми другими DOM-узлами:

```js [3, 5]
function Component() {
  return (
    <ViewTransition>
      <div>Hi</div>
    </ViewTransition>
  );
}
```

### Я получаю ошибку "Одновременно смонтировано два компонента `<ViewTransition name=%s>` с одинаковым именем." {/*two-viewtransition-with-same-name*/}

Эта ошибка возникает, когда два компонента `<ViewTransition>` с одинаковым `name` монтируются одновременно:

```js [3]
function Item() {
  // 🚩 Все элементы получат одно и то же "имя".
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {item.map(item => <Item key={item.id} />)}
    </>
  );
}
```

Это приведет к ошибке при переходе между представлениями. В режиме разработки React обнаруживает эту проблему, чтобы сообщить о ней, и выводит две ошибки:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

Одновременно смонтировано два компонента `<ViewTransition name=%s>` с одинаковым именем. Это не поддерживается и приведет к ошибке переходов между представлениями. Попробуйте использовать более уникальное имя, например, используя префикс пространства имен и добавив идентификатор элемента к имени.
{'    '}at Item
{'    '}at ItemList

</ConsoleLogLine>

<ConsoleLogLine level="error">

Существующий дубликат `<ViewTransition name=%s>` имеет следующий стек вызовов.
{'    '}at Item
{'    '}at ItemList

</ConsoleLogLine>
</ConsoleBlockMulti>

Чтобы исправить это, убедитесь, что одновременно в приложении смонтирован только один `<ViewTransition>` с одинаковым именем, обеспечив уникальность `name` или добавив `id` к имени:

```js [3]
function Item({id}) {
  // ✅ Все элементы получат одно и то же "имя".
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {item.map(item => <Item key={item.id} item={item} />)}
    </>
  );
}
```