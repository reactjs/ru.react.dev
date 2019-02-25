---
id: faq-styling
title: Стили и CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Как мне добавить CSS классы в компоненты? {#how-do-i-add-css-classes-to-components}

Передайте в проп `className` строку:

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

Обычно CSS классы зависят от пропсов или состояния:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>Совет
>
>Если вы часто пишите такой код, пакет [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) может упростить его.

### Могу ли я использовать встроенные стили? {#can-i-use-inline-styles}

Конечно, прочитайте [документацию об элементах DOM](/docs/dom-elements.html#style).

### Встроенные стили это плохо? {#are-inline-styles-bad}

CSS классы, как правило, лучше для производительности, чем встроенные стили.

### Что такое CSS-in-JS? {#what-is-css-in-js}

"CSS-in-JS" относится к паттерну, в котором CSS создаётся с использованием JavaScript, а не во внешних файлах. Почитайте сравнение CSS-in-JS библиотек [здесь](https://github.com/MicheleBertoli/css-in-js).

_Обратите внимание, что эта функциональность не является частью React, но она предоставляется сторонними библиотеками._ React не имеет никакого отношения к тому, как определяются стили. Если у вас есть сомнения, хорошей отправной точкой является определение ваших стилей в отдельном файле `*.css` как обычно, и обращение к ним с помощью [`className`](/docs/dom-elements.html#classname).

### Могу ли я создавать анимации в React? {#can-i-do-animations-in-react}

React может использоваться для создания крутых анимаций! В качестве примера посмотрите библиотеки [React Transition Group](https://reactcommunity.org/react-transition-group/) и [React Motion](https://github.com/chenglou/react-motion).
