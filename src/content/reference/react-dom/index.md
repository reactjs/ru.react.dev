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

---

## Точки входа {/*entry-points*/}

Пакет `react-dom` предоставляет две дополнительные точки входа:

* [`react-dom/client`](/reference/react-dom/client) содержит API для рендеринга компонентов React на стороне клиента (в браузере).
* [`react-dom/server`](/reference/react-dom/server) содержит API для рендеринга компонентов React на сервере.

---

## Устаревшие API {/*deprecated-apis*/}

<Deprecated>

Эти API будут удалены в одной из следующих версий React.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) находит ближайший DOM-узел, соответствующий экземпляру классового компонента.
* [`hydrate`](/reference/react-dom/hydrate) монтирует дерево в DOM, созданное из HTML на сервере. Устарел в пользу [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) монтирует дерево в DOM. Устарел в пользу [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) размонтирует дерево из DOM. Устарел в пользу [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).