---
id: web-components
title: Веб-компоненты
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React и [веб-компоненты](https://developer.mozilla.org/ru/docs/Web/Web_Components) созданы для решения различных задач. Веб-компоненты обеспечивают надёжную инкапсуляцию для переиспользуемых компонентов, в том время как React предоставляет декларативную библиотеку для синхроназации данных c DOM. Две цели дополняют друг друга. Как разработчики, вы можете использовать React в своих веб-компонентах, или использовать веб-компоненты в React, или и то, и другое.

Большинство разработчиков React не используют веб-компоненты, но у вас может появиться желание попробовать их. В частности, если используются сторонние компоненты пользовательского интерфейса, написанные с помощью веб-компонентов.

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
> События, созданные веб-компонентами, могут неправильно распостраняться через дерево React-компонентов.
> Вам нужно вручную добавить обработчики для таких событий в ваши React-компоненты.

Одно из распространённых заблуждений — это то, что в веб-компонентах используется «class» вместо «className».

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
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>Примечание:
>
>Данный код **не будет** работать, если вы преобразуете классы с помощью Babel. Взгляните на [ишью](https://github.com/w3c/webcomponents/issues/587) с обсуждением.
>Добавьте [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) перед загрузкой веб-компонентов, чтобы решить эту проблему.
