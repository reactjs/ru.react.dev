---
id: web-components
title: Веб-компоненты
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
>
> See [Custom HTML elements](https://react.dev/reference/react-dom/components#custom-html-elements) in the new docs.
>
</div>

React и [веб-компоненты](https://developer.mozilla.org/ru/docs/Web/Web_Components) созданы для решения самых разных задач. Веб-компоненты обеспечивают надёжную инкапсуляцию для повторно используемых компонентов, в то время как React предоставляет декларативную библиотеку для синхронизации данных c DOM. Две цели дополняют друг друга. Как разработчик, вы можете использовать React в своих веб-компонентах, или использовать веб-компоненты в React, или и то, и другое.

Большинство разработчиков React обходятся без веб-компонентов, но у вас может появиться желание попробовать их. Например, если ваш проект использует сторонние компоненты пользовательского интерфейса, написанные с помощью веб-компонентов.

## Использование веб-компонентов в React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Привет, <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Примечание:
>
> Веб-компоненты часто предоставляют императивный API. Например, веб-компонент `video` может предоставлять функции `play()` и `pause()`. Чтобы получить доступ к необходимому API веб-компонентов, необходимо использовать реф для взаимодействия с DOM-узлом напрямую. Если вы используете сторонние веб-компоненты, лучшим решением будет создать React-компонент и использовать его как обёртку для веб-компонента.
>
> События, созданные веб-компонентами, могут неправильно распространяться через дерево React-компонентов.
> Вам нужно вручную добавить обработчики для таких событий в собственные React-компоненты.

Веб-компоненты используют «class» вместо «className», что часто вводит людей в замешательство.

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>Передняя сторона</div>
      <div>Обратная сторона</div>
    </brick-flipbox>
  );
}
```

## Использование React в веб-компонентах {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<a href={url}>{name}</a>);
  }
}
customElements.define('x-search', XSearch);
```

>Примечание:
>
>Данный код **не будет** работать, если вы преобразуете классы с помощью Babel. Взгляните на [ишью](https://github.com/w3c/webcomponents/issues/587) с обсуждением.
>Добавьте шим [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) перед загрузкой веб-компонентов, чтобы решить эту проблему.
