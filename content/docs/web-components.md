---
id: web-components
title: Веб-компоненты
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React и [Веб-компоненты](https://developer.mozilla.org/ru/docs/Web/Web_Components) созданы для решения различных проблемы. Веб-компоненты предоставляют надежную инкапсуляцию для повторно используемых компонентов, пока React предоставляет декларативную библиотеку, поддерживающую DOM в синхронизации с вашими данными. Обе цели дополняют друг друга. Как разработчики, вы можете свободно использовать React в своих веб-компонентах, или использовать веб-компоненты в React, или оба варианта.

Большинство людей, использующих React, не используют веб-компоненты, но вы можете захотеть это сделать, особенно если вы используете сторонние компоненты пользовательного интерфейса, написанные с использованием веб-компонентов.

## Использование веб-компонентов в React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Привет <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Примечание:
>
> Веб-компоненты часто предоставляют императивное API. Например, веб-компонент `video` может предоставлять функции `play()` и `pause()`. Для получения доступа к этому императивному API веб-компонентов, вам необходимо использовать реф для непосредственного взаимодействия с DOM-узлом. Если вы используете сторонние веб-компоненты, лучший решением будет написать React-компоненты, который служат обёрткой для ваших веб-компонентов.
>
> События, созданные веб-компонентами, могут неправильно распостраняться через дерево рендеринга React.
> Вам должны вручную добавить обработчики событий для обработки их в ваших React-компонентах.

Существует распространённая путаница, заключающаяся в том, что в веб-компонентах используется «class» вместо «className».

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>Передняя сторона</div>
      <div>Задняя сторона</div>
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
>Данный код **не будет** работать, если вы трансформируете классы с помощью Babel. Смотрите [данный ишью](https://github.com/w3c/webcomponents/issues/587) для обсуждения.
>Включите [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) перед тем, как вы загрузите ваши веб-компоненты для исправления этой проблемы.