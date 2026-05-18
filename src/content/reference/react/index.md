---
title: Обзор справочника React
---
<Intro>

Этот раздел содержит подробную справочную документацию по работе с React. Для ознакомления с React посетите раздел [Learn](/learn).

</Intro>

Справочная документация React разделена на функциональные подразделы:

## React {/*react*/}

Программные возможности React:

* [Hooks](/reference/react/hooks) - Используйте различные возможности React из ваших компонентов.
* [Components](/reference/react/components) - Встроенные компоненты, которые вы можете использовать в своем JSX.
* [APIs](/reference/react/apis) - API, полезные для определения компонентов.
* [Directives](/reference/rsc/directives) - Предоставляют инструкции для сборщиков, совместимых с React Server Components.

## React DOM {/*react-dom*/}

React-dom содержит функции, которые поддерживаются только для веб-приложений (работающих в среде браузерного DOM). Этот раздел разбит на следующие части:

* [Hooks](/reference/react-dom/hooks) - Хуки для веб-приложений, работающих в среде браузерного DOM.
* [Components](/reference/react-dom/components) - React поддерживает все встроенные в браузер HTML и SVG компоненты.
* [APIs](/reference/react-dom) - Пакет `react-dom` содержит методы, поддерживаемые только в веб-приложениях.
* [Client APIs](/reference/react-dom/client) - API `react-dom/client` позволяют рендерить React-компоненты на клиенте (в браузере).
* [Server APIs](/reference/react-dom/server) - API `react-dom/server` позволяют рендерить React-компоненты в HTML на сервере.

## Rules of React {/*rules-of-react*/}

React имеет идиомы — или правила — для выражения паттернов таким образом, чтобы их было легко понять и они приводили к созданию высококачественных приложений:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Чистота делает ваш код более понятным, облегчает отладку и позволяет React автоматически правильно оптимизировать ваши компоненты и хуки.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React отвечает за рендеринг компонентов и хуков при необходимости для оптимизации пользовательского опыта.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Хуки определяются с использованием функций JavaScript, но они представляют собой особый тип повторно используемой логики пользовательского интерфейса с ограничениями на то, где они могут быть вызваны.

## Legacy APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - Экспортируются из пакета `react`, но не рекомендуются для использования в новом коде.