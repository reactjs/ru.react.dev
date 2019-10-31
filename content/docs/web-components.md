---
id: web-components
title: Веб-компоненты
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React и [веб-компоненты](https://developer.mozilla.org/ru/docs/Web/Web_Components) решают разные задачи. Веб-компоненты обеспечивают надёжную инкапсуляцию для повторно используемых компонентов, в то время как React предоставляет декларативную библиотеку для синхронизации данных c DOM. Они дополняют друг друга. Вы можете использовать как веб-компоненты в React, так и React для создания своих веб-компонентов. Или и то, и то одновременно.

Большинство проектов обходится без веб-компонентов, однако такая потребность вполне может появиться. Например, когда нужно воспользоваться сторонней библиотекой элементов пользовательского интерфейса, реализованных с помощью веб-компонентов.

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
> Веб-компоненты часто предоставляют императивный API. Например, веб-компонент `video` может предоставлять функции `play()` и `pause()`. Чтобы получить доступ к необходимому API веб-компонентов, необходимо использовать реф для взаимодействия с DOM-узлом напрямую. При использовании сторонних веб-компонентов оптимальным решением будет создание вспомогательного React-компонента-обертки для взаимодействия с веб-компонентом.
>
> События, генерируемые веб-компонентами, не всегда распространяются через дерево React-компонентов правильно. Следует вручную добавить обработчик таких событий и далее работать с ними средствами React.

Веб-компоненты используют «class» вместо «className», что часто вводит в замешательство.

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
>Данный код **не будет** работать после преобразования классов с помощью Babel. Подробнее смотрите [обсуждение здесь](https://github.com/w3c/webcomponents/issues/587).
>Чтобы решить эту проблему, добавьте пакет совместимости [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) перед загрузкой веб-компонентов.
