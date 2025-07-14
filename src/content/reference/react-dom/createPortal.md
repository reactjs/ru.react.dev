---
title: createPortal
---

<Intro>

`createPortal` позволяет отрендерить дочерние элементы в другую часть DOM-дерева.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Чтобы создать портал, вызовите `createPortal`, передав JSX и DOM-узел, в который нужно отрендерить содержимое:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Этот элемент будет отрендерен внутри родительского div.</p>
  {createPortal(
    <p>А этот — прямо в document.body.</p>,
    document.body
  )}
</div>
```

[См. больше примеров ниже.](#usage)

Портал влияет только на физическое размещение DOM-узла. Во всём остальном JSX, отрендеренный через портал, ведёт себя как обычный дочерний элемент React-компонента. Например, он может получать контекст от родительского дерева, а события всплывают вверх по дереву React-компонентов (а не DOM-структуре).

#### Параметры {/*parameters*/}

* `children`: Всё, что может быть отрендерено в React — JSX (например, `<div />` или `<SomeComponent />`), [Фрагмент](/reference/react/Fragment) (`<>...</>`), строка, число или массив этих элементов.

* `domNode`: DOM-элемент (например, возвращённый `document.getElementById()`). Он должен существовать к моменту рендера. Если при обновлении передать другой DOM-узел — содержимое портала будет пересоздано.

* **необязательный** `key`: Уникальная строка или число, используемые как [key](/learn/rendering-lists/#keeping-list-items-in-order-with-key) для портала.

#### Возвращаемое значение {/*returns*/}

`createPortal` возвращает React-узел, который можно включить в JSX или вернуть из компонента. При рендере React поместит переданный `children` внутрь указанного `domNode`.

#### Предостережения {/*caveats*/}

- События от порталов всплывают по дереву React-компонентов, а не по DOM. Например, если вы кликнете внутри портала, и он обёрнут в `<div onClick>`, этот обработчик сработает. Если это вызывает проблемы, остановите всплытие события внутри портала или поднимите портал выше в дереве компонентов.

---

## Использование {/*usage*/}

### Рендеринг в другую часть DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Порталы* позволяют компонентам рендерить часть своих потомков в другое место DOM-дерева. Это даёт возможность "вырваться" из любых ограничивающих контейнеров. Например, компонент может отобразить модальное окно или всплывающую подсказку, расположенные поверх остального содержимого страницы.

Чтобы создать портал, отрендерите результат `createPortal`, передав <CodeStep step={1}>JSX</CodeStep> и <CodeStep step={2}>DOM-узел, куда его вставить</CodeStep>:

```js [[1, 8, "<p>А этот — в document.body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Этот элемент внутри родительского div.</p>
      {createPortal(
        <p>А этот — в document.body.</p>,
        document.body
      )}
    </div>
  );
}
```

React вставит DOM-узлы для <CodeStep step={1}>переданного JSX</CodeStep> внутрь <CodeStep step={2}>указанного DOM-узла</CodeStep>.

Без портала второй `<p>` оказался бы внутри родительского `<div>`, но портал "телепортировал" его в [`document.body`](https://developer.mozilla.org/ru/docs/Web/API/Document/body):

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Этот элемент внутри родительского div.</p>
      {createPortal(
        <p>А этот — в document.body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Обратите внимание: второй абзац визуально размещён вне родительского `<div>` с рамкой. Если открыть DOM в инструментах разработчика, вы увидите, что второй `<p>` действительно размещён 
прямо в `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>Этот элемент внутри родительского div.</p>
      </div>
    ...
  </div>
  <p>А этот — в document.body.</p>
</body>
```

Портал изменяет только физическое размещение DOM-узла. Во всех остальных отношениях JSX, отрендеренный через портал, остаётся потомком React-компонента, который его рендерит. Например, он может получать контекст от родительского дерева, а события продолжают всплывать вверх по React-иерархии.

---

### Рендеринг модального окна с помощью портала {/*rendering-a-modal-dialog-with-a-portal*/}

Вы можете использовать портал для отображения модального окна, которое всплывает поверх остальной части страницы — даже если компонент, открывающий это окно, находится внутри контейнера с `overflow: hidden` или другими стилями, мешающими отображению.

В этом примере оба контейнера имеют стили, которые могут "обрезать" модальное окно, но тот, что отрендерен через портал, работает корректно — потому что в DOM он не находится внутри родительских JSX-элементов.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Показать модалку без портала
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Показать модалку с использованием портала
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>Я — модальное окно</div>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position: absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Важно убедиться, что при использовании порталов ваше приложение остаётся доступным. Например, вам может потребоваться управлять фокусом клавиатуры, чтобы пользователь мог перемещать фокус внутрь и наружу из портала естественным способом.

<<<<<<< HEAD
Следуйте [рекомендациям WAI-ARIA по созданию модальных окон](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal). Если вы используете готовую библиотеку, убедитесь, что она поддерживает доступность и следует этим рекомендациям.
=======
Follow the [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) when creating modals. If you use a community package, ensure that it is accessible and follows these guidelines.
>>>>>>> 84a56968d92b9a9e9bbac1ca13011e159e815dc1

</Pitfall>

---

### Рендеринг компонентов React в разметку, сгенерированную вне React {/*rendering-react-components-into-non-react-server-markup*/}

Порталы полезны, когда корень React занимает только часть страницы, собранной статически или на сервере без использования React. Например, если ваша страница построена с помощью серверного фреймворка (например, Rails), вы можете добавить интерактивные элементы в статические области — например, в боковую панель. В отличие от [нескольких отдельных корней React](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react), порталы позволяют работать с приложением как с единой React-структурой с общим состоянием — даже если части рендерятся в разные участки DOM.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Моё приложение</title></head>
  <body>
    <h1>Добро пожаловать в гибридное приложение</h1>
    <div class="parent">
      <div class="sidebar">
          Это серверная (не-React) разметка
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>Эта часть отрендерена с помощью React</p>;
}

function SidebarContent() {
  return <p>И эта часть — тоже отрендерена React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Рендеринг компонентов React в DOM-узлы, созданные вне React {/*rendering-react-components-into-non-react-dom-nodes*/}

Вы также можете использовать портал для управления содержимым DOM-элемента, который создаётся и управляется сторонним кодом вне React. Например, если вы интегрируете сторонний виджет карты и хотите отрендерить React-контент внутри всплывающего окна. Сначала объявите состояние `popupContainer`, в котором вы будете хранить DOM-узел для рендера:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Когда вы создаёте виджет, сохраните возвращённый элемент DOM, чтобы потом использовать его как контейнер:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Теперь вы можете использовать `createPortal`, чтобы отрендерить React-контент в `popupContainer`, как только он будет доступен:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Привет из React!</p>,
      popupContainer
    )}
  </div>
);
```

Ниже приведён полный пример, с которым можно поэкспериментировать:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Привет из React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
