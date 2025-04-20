---
title: API React DOM
---

<Intro>

Пакет `react-dom` содержит методы, которые поддерживаются только для веб-приложений (которые работают в DOM среде браузера). Они не поддерживаются для React Native.

</Intro>

---

## APIs {/*apis*/}

Эти API могут быть импортированы из ваших компонентов. Они используются редко:

* [`createPortal`](/reference/react-dom/createPortal) позволяет рендерить дочерние компоненты в другой части DOM-дерева.
* [`flushSync`](/reference/react-dom/flushSync) позволяет принудительно вынудить React обновить состояние и синхронно обновить DOM.

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## Точки входа {/*entry-points*/}

Пакет `react-dom` предоставляет две дополнительные точки входа:

* [`react-dom/client`](/reference/react-dom/client) содержит API для рендеринга компонентов React на стороне клиента (в браузере).
* [`react-dom/server`](/reference/react-dom/server) содержит API для рендеринга компонентов React на сервере.

---

## Удалённые API {/*deprecated-apis*/}

Эти API были удалены в React 19.

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): изучите [альтернативы](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): используйте [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) вместо.
* [`render`](https://18.react.dev/reference/react-dom/render): используйте [`createRoot`](/reference/react-dom/client/createRoot) вместо.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): используйте [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) вместо.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): используйте [`react-dom/server`](/reference/react-dom/server) API вместо.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): используйте [`react-dom/server`](/reference/react-dom/server) API вместо.
