---
title: "`<ViewTransition>`"
version: experimental
---
```html
<Experimental>

**Этот API является экспериментальным и пока недоступен в стабильной версии React.**

Вы можете попробовать его, обновив пакеты React до самой последней экспериментальной версии:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Экспериментальные версии React могут содержать ошибки. Не используйте их в продакшене.

</Experimental>

<Intro>

`<ViewTransition>` позволяет анимировать элементы, которые обновляются внутри Transition.

```js
import {unstable_ViewTransition as ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## Ссылка {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

Оберните элементы в `<ViewTransition>`, чтобы анимировать их при обновлении внутри [Transition](/reference/react/useTransition). React использует следующие эвристики, чтобы определить, активируется ли View Transition для анимации:

- `enter`: Если сам `ViewTransition` вставляется в этот Transition, то он активируется.
- `exit`: Если сам `ViewTransition` удаляется в этом Transition, то он активируется.
- `update`: Если в `ViewTransition` есть какие-либо изменения DOM, которые выполняет React (например, изменение пропса), или если сама граница `ViewTransition` изменяет размер или положение из-за непосредственного соседа. Если есть вложенные `ViewTransition`, то изменение применяется к ним, а не к родителю.
- `share`: Если именованный `ViewTransition` находится внутри удаленного поддерева, а другой именованный `ViewTransition` с тем же именем является частью вставленного поддерева в том же Transition, они образуют Shared Element Transition, и он анимируется от удаленного к вставленному.

По умолчанию `<ViewTransition>` анимирует с плавным переходом (переход представления по умолчанию в браузере). Вы можете настроить анимацию, предоставив [класс View Transition](#view-transition-class) компоненту `<ViewTransition>`. Вы можете настроить анимацию для каждого типа триггера (см. [Стилизация View Transitions](#styling-view-transitions)).

<DeepDive>

#### Как работает `<ViewTransition>`? {/*how-does-viewtransition-work*/}

В основе React применяет `view-transition-name` к встроенным стилям ближайшего узла DOM, вложенного в компонент `<ViewTransition>`. Если есть несколько соседних узлов DOM, таких как `<ViewTransition><div /><div /></ViewTransition>`, то React добавляет суффикс к имени, чтобы сделать каждый уникальным, но концептуально они являются частью одного и того же. React не применяет их немедленно, а только в то время, когда граница должна участвовать в анимации.

React автоматически вызывает `startViewTransition` сам по себе за кулисами, поэтому вам никогда не следует делать это самостоятельно. Фактически, если у вас есть что-то еще на странице, запускающее ViewTransition, React прервет его. Поэтому рекомендуется использовать сам React для координации этих действий. Если у вас были другие способы запуска ViewTransitions в прошлом, мы рекомендуем вам перейти на встроенный способ.

Если уже запущены другие React ViewTransitions, то React будет ждать их завершения, прежде чем запускать следующий. Однако, что важно, если происходит несколько обновлений, пока выполняется первое, они все будут объединены в одно. Если вы запустите A->B. Затем, тем временем, вы получите обновление, чтобы перейти к C, а затем к D. Когда первая анимация A->B завершится, следующая будет анимироваться от B->D.

Жизненный цикл `getSnapshotBeforeUpdate` будет вызван перед `startViewTransition`, и некоторое `view-transition-name` обновится одновременно.

Затем React вызывает `startViewTransition`. Внутри `updateCallback` React будет:

- Применять свои изменения к DOM и вызывать useInsertionEffects.
- Ждать загрузки шрифтов.
- Вызывать componentDidMount, componentDidUpdate, useLayoutEffect и refs.
- Ждать завершения любой ожидающей навигации.
- Затем React измерит любые изменения в макете, чтобы увидеть, какие границы нужно будет анимировать.

После того, как Promise `startViewTransition` будет разрешен, React затем вернет `view-transition-name`. Затем React вызовет обратные вызовы `onEnter`, `onExit`, `onUpdate` и `onShare`, чтобы обеспечить ручное программное управление анимациями. Это произойдет после того, как встроенные значения по умолчанию уже будут вычислены.

Если `flushSync` попадет в середину этой последовательности, то React пропустит Transition, поскольку он полагается на возможность завершения синхронно.

После того, как Promise `startViewTransition` будет разрешен, React затем вызовет `useEffect`. Это предотвращает их вмешательство в производительность Animation. Однако это не гарантия, потому что, если произойдет еще один `setState`, пока Animation выполняется, ему все равно придется вызвать `useEffect` раньше, чтобы сохранить последовательные гарантии.

</DeepDive>

#### Пропсы {/*props*/}

По умолчанию `<ViewTransition>` анимирует с плавным переходом. Вы можете настроить анимацию или указать переход общего элемента с помощью этих пропсов:

* **необязательный** `enter`: строка или объект. [Класс View Transition](#view-transition-class) для применения при активации enter.
* **необязательный** `exit`: строка или объект. [Класс View Transition](#view-transition-class) для применения при активации exit.
* **необязательный** `update`: строка или объект. [Класс View Transition](#view-transition-class) для применения при активации обновления.
* **необязательный** `share`: строка или объект. [Класс View Transition](#view-transition-class) для применения при активации общего элемента.
* **необязательный** `default`: строка или объект. [Класс View Transition](#view-transition-class), используемый, когда не найден ни один другой соответствующий проп активации.
* **необязательный** `name`: строка или объект. Имя View Transition, используемое для переходов общих элементов. Если не указано, React будет использовать уникальное имя для каждого View Transition, чтобы предотвратить непредвиденные анимации.

#### Callback {/*events*/}

Эти обратные вызовы позволяют вам настраивать анимацию императивно с помощью [animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) API:

* **необязательный** `onEnter`: функция. React вызывает `onEnter` после анимации "enter".
* **необязательный** `onExit`: функция. React вызывает `onExit` после анимации "exit".
* **необязательный** `onShare`: функция. React вызывает `onShare` после анимации "share".
* **необязательный** `onUpdate`: функция. React вызывает `onUpdate` после анимации "update".

Каждый обратный вызов получает в качестве аргументов:
- `element`: элемент DOM, который был анимирован.
- `types`: [Типы переходов](/reference/react/addTransitionType), включенные в анимацию.

### Класс View Transition {/*view-transition-class*/}

Класс View Transition — это имя(названия) CSS-класса, применяемое React во время перехода при активации ViewTransition. Это может быть строка или объект.
- `string`: `class`, добавленный к дочерним элементам при активации. Если предоставлено `'none'`, класс не будет добавлен.
- `object`: класс, добавленный к дочерним элементам, будет ключом, соответствующим типу View Transition, добавленным с помощью `addTransitionType`. Объект также может указывать `default` для использования, если не найден соответствующий тип.

Значение `'none'` можно использовать, чтобы предотвратить активацию View Transition для определенного триггера.

### Стилизация View Transitions {/*styling-view-transitions*/}

<Note>

Во многих ранних примерах View Transitions в сети вы увидите использование [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name), а затем стилизацию с помощью селекторов `::view-transition-...(my-name)`. Мы не рекомендуем это для стилизации. Вместо этого мы обычно рекомендуем использовать класс View Transition.

</Note>

Чтобы настроить анимацию для `<ViewTransition>`, вы можете предоставить класс View Transition одному из пропсов активации. Класс View Transition — это имя CSS-класса, которое React применяет к дочерним элементам при активации ViewTransition.

Например, чтобы настроить анимацию "enter", предоставьте имя класса пропсу `enter`:

```js
<ViewTransition enter="slide-in">
```

Когда `<ViewTransition>` активирует анимацию "enter", React добавит имя класса `slide-in`. Затем вы можете ссылаться на этот класс, используя [псевдоселекторы перехода представления](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements), чтобы создавать многоразовые анимации:

```css
::view-transition-group(.slide-in) {
  
}
::view-transition-old(.slide-in) {

}
::view-transition-new(.slide-in) {

}
```
В будущем библиотеки CSS могут добавить встроенные анимации, используя классы View Transition, чтобы упростить использование.

#### Предостережения {/*caveats*/}

- По умолчанию обновления `setState` происходят немедленно и не активируют `<ViewTransition>`, только обновления, обернутые в [Transition](/reference/react/useTransition). Вы также можете использовать [`<Suspense>`](/reference/react/Suspense), чтобы включиться в Transition для [отображения контента](/link-to-suspense-below).
- `<ViewTransition>` создает изображение, которое можно перемещать, масштабировать и перекрестно перекрывать. В отличие от Layout Animations, которые вы могли видеть в React Native или Motion, это означает, что не каждый отдельный Element внутри него анимирует свою позицию. Это может привести к лучшей производительности и более непрерывному ощущению, плавной анимации по сравнению с анимацией каждой отдельной части. Однако это также может привести к потере непрерывности в вещах, которые должны двигаться сами по себе. В результате вам, возможно, придется вручную добавить больше границ `<ViewTransition>`.
- Многие пользователи могут предпочесть отсутствие анимации на странице. React не отключает анимацию автоматически для этого случая. Мы рекомендуем использовать медиа-запрос `@media (prefers-reduced-motion)`, чтобы отключить анимацию или уменьшить ее в зависимости от предпочтений пользователя. В будущем библиотеки CSS могут иметь это встроенным в свои предустановки.
- В настоящее время `<ViewTransition>` работает только в DOM. Мы работаем над добавлением поддержки React Native и других платформ.

---

## Использование {/*usage*/}

### Анимация элемента при входе/выходе {/*animating-an-element-on-enter*/}

Переходы Enter/Exit срабатывают, когда `<ViewTransition>` добавляется или удаляется компонентом в переходе:

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

Когда вызывается `setShow`, `show` переключается на `true`, и компонент `Child` отображается. Когда `setShow` вызывается внутри `startTransition`, и `Child` отображает `ViewTransition` перед любыми другими узлами DOM, запускается анимация `enter`.

Когда `show` переключается обратно на `false`, запускается анимация `exit`.

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

`<ViewTransition>` активируется только в том случае, если он расположен перед любым узлом DOM. Если `Child` вместо этого выглядел так, анимация не сработает:

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

Обычно мы не рекомендуем назначать имя для `<ViewTransition>`, а вместо этого позволять React назначать ему автоматическое имя. Причина, по которой вы можете захотеть назначить имя, заключается в том, чтобы анимировать между совершенно разными компонентами, когда одно дерево размонтируется, а другое дерево монтируется одновременно. Чтобы сохранить непрерывность.

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

Когда одно дерево размонтируется, а другое монтируется, если есть пара, в которой одно и то же имя существует в размонтируемом дереве и в монтируемом дереве, они запускают анимацию "share" на обоих. Он анимируется со стороны размонтирования на сторону монтирования.

В отличие от анимации выхода/входа, это может быть глубоко внутри удаленного/смонтированного дерева. Если `<ViewTransition>` также будет иметь право на выход/вход, то анимация "share" имеет приоритет.

Если Transition сначала размонтирует одну сторону, а затем приводит к отображению резервного варианта `<Suspense>`, прежде чем, в конечном итоге, будет смонтировано новое имя, то переход общего элемента не произойдет.

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

Если какая-либо сторона пары (смонтированная или размонтированная) находится за пределами области просмотра, то пара не формируется. Это гарантирует, что она не будет влетать или вылетать из области просмотра при прокрутке чего-либо. Вместо этого это рассматривается как обычный вход/выход само по себе.

Это не произойдет, если один и тот же экземпляр Component изменяет положение, что запускает "update". Они анимируются независимо от того, находится ли одна позиция за пределами области просмотра.

В настоящее время существует причуда, когда, если глубоко вложенный размонтированный `<ViewTransition>` находится внутри области просмотра, но смонтированная сторона не находится в области просмотра, то размонтированная сторона анимируется как собственная анимация "exit", даже если она глубоко вложена, а не как часть родительской анимации.

</Note>

<Pitfall>

Важно, чтобы в приложении одновременно было смонтировано только одно имя с одним и тем же именем. Поэтому важно использовать уникальные пространства имен для имени, чтобы избежать конфликтов. Чтобы убедиться, что вы можете это сделать, вы можете добавить константу в отдельный модуль, который вы импортируете.

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>


---

### Анимация переупорядочения элементов в списке {/*animating-reorder-of-items-in-a-list*/}

```js
items.map(item => <Component key={item.id} item={item} />)
```

При переупорядочении списка без обновления содержимого анимация "update" запускается для каждого `<ViewTransition>` в списке, если они находятся за пределами узла DOM. Аналогично анимации входа/выхода.

Это означает, что это запустит анимацию на этом `<ViewTransition>`:

```js
function Component() {
  return <ViewTransition><div>...</div></ViewTransition>;
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
Вместо этого любой родительский `<ViewTransition>` будет перекрестно перекрываться. Если нет родительского `<ViewTransition>`, то в этом случае анимации нет.

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
  display: