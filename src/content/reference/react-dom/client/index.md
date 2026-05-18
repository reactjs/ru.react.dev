---
title: API React DOM для клиента
---
<Intro>

API `react-dom/client` позволяют вам рендерить React-компоненты на клиенте (в браузере). Эти API обычно используются на верхнем уровне вашего приложения для инициализации React-дерева. [Фреймворк](/learn/start-a-new-react-project#production-grade-react-frameworks) может вызывать их за вас. Большинству ваших компонентов не нужно их импортировать или использовать.

</Intro>

---

## Клиентские API {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) позволяет создать корень для отображения React-компонентов внутри DOM-узла браузера.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) позволяет отображать React-компоненты внутри DOM-узла браузера, HTML-содержимое которого было ранее сгенерировано [`react-dom/server`.](/reference/react-dom/server)

---

## Поддержка браузеров {/*browser-support*/}

React поддерживает все популярные браузеры, включая Internet Explorer 9 и выше. Для старых браузеров, таких как IE 9 и IE 10, требуются некоторые полифиллы.