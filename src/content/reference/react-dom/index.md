---
title: API React DOM
---

<Intro>

Пакет `react-dom` содержит методы, которые поддерживаются только для веб-приложений (которые работают в DOM среде браузера). Они не поддерживаются для React Native.

</Intro>

---

## APIs {/*apis*/}

Эти API могут быть импортированы из ваших компонентов. Они используются редко:

<<<<<<< HEAD
* [`createPortal`](/reference/react-dom/createPortal) позволяет рендерить дочерние компоненты в другой части DOM-дерева.
* [`flushSync`](/reference/react-dom/flushSync) позволяет принудительно вынудить React обновить состояние и синхронно обновить DOM.
=======
* [`createPortal`](/reference/react-dom/createPortal) lets you render child components in a different part of the DOM tree.
* [`flushSync`](/reference/react-dom/flushSync) lets you force React to flush a state update and update the DOM synchronously.
* [`requestFormReset`](/reference/react-dom/requestFormReset) lets you request a form reset when handling submissions with custom Actions or Transitions.
>>>>>>> 46a54e0592729712b7640308b53268e84fdc7c9f

## API предварительной загрузки ресурсов {/*resource-preloading-apis*/}

Эти API можно использовать для ускорения работы приложений за счёт предварительной загрузки ресурсов — таких как скрипты, таблицы стилей и шрифты — сразу после того, как становится понятно, что они понадобятся. Например, до перехода на другую страницу, где эти ресурсы будут использоваться.

<<<<<<< HEAD
[Фреймворки на базе React](/learn/start-a-new-react-project) часто берут на себя управление загрузкой ресурсов, так что вам может не понадобиться напрямую вызывать эти API. Подробнее об этом — в документации фреймворка.
=======
[React-based frameworks](/learn/creating-a-react-app) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.
>>>>>>> 46a54e0592729712b7640308b53268e84fdc7c9f

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) позволяет предварительно получить IP-адрес доменного имени, с которым вы планируете установить соединение.
* [`preconnect`](/reference/react-dom/preconnect) заранее устанавливает соединение с сервером, с которого вы, скорее всего, запросите ресурсы, даже если ещё не знаете, какие именно.
* [`preload`](/reference/react-dom/preload) заранее загружает таблицу стилей, шрифт, изображение или внешний скрипт, которые вы собираетесь использовать.
* [`preloadModule`](/reference/react-dom/preloadModule) предварительно загружает модуль ECMAScript (ESM), который вы собираетесь использовать.
* [`preinit`](/reference/react-dom/preinit) предварительно загружает и выполняет внешний скрипт либо загружает и вставляет таблицу стилей.
* [`preinitModule`](/reference/react-dom/preinitModule) предварительно загружает и выполняет модуль ECMAScript (ESM).

## Server Rendering APIs {/*server-rendering-apis*/}

This API controls how components render on the server:

* [`browser`](/reference/react-dom/browser) lets you mark a component as browser-only during server rendering.

---

## Точки входа {/*entry-points*/}

Пакет `react-dom` предоставляет две дополнительные точки входа:

* [`react-dom/client`](/reference/react-dom/client) содержит API для рендеринга компонентов React на стороне клиента (в браузере).
* [`react-dom/server`](/reference/react-dom/server) содержит API для рендеринга компонентов React на сервере.

---

## Удалённые API {/*deprecated-apis*/}

Эти API были удалены в React 19.

<<<<<<< HEAD
* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): изучите [альтернативы](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): используйте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) вместо.
* [`render`](https://18.react.dev/reference/react-dom/render): используйте [`createRoot`](/reference/react-dom/client/createRoot) вместо.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): используйте [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) вместо.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): используйте [`react-dom/server`](/reference/react-dom/server) API вместо.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): используйте [`react-dom/server`](/reference/react-dom/server) API вместо.
=======
* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): see [alternatives](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): use [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) instead.
* [`render`](https://18.react.dev/reference/react-dom/render): use [`createRoot`](/reference/react-dom/client/createRoot) instead.
* [`unmountComponentAtNode`](https://18.react.dev/reference/react-dom/unmountComponentAtNode): use [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) instead.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
>>>>>>> 46a54e0592729712b7640308b53268e84fdc7c9f
