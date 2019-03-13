---
id: faq-styling
title: Стилизация и CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Как добавить CSS-классы в компоненты? {#how-do-i-add-css-classes-to-components}

Передайте в проп `className` строку:

```jsx
render() {
  return <span className="menu navigation-menu">Меню</span>
}
```

Обычно CSS-классы зависят от пропсов или состояния:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Меню</span>
}
```

>Совет
>
>Если вы часто пишите похожий код, то пакет [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) поможет упростить его.

### Как можно использовать встроенные стили? {#can-i-use-inline-styles}

Конечно, прочитайте [документацию об элементах DOM](/docs/dom-elements.html#style).

### Встроенные стили — это плохо? {#are-inline-styles-bad}

CSS-классы, как правило, лучше для производительности, чем встроенные стили.

### Что такое CSS-in-JS? {#what-is-css-in-js}

«CSS-in-JS» — это паттерн, в котором CSS-код создаётся при помощи JavaScript, вместо того, чтобы писать его во внешних файлах. Ознакомьтесь со сравнением библиотек по работе с «CSS-in-JS» в [этом репозитории](https://github.com/MicheleBertoli/css-in-js).

_Обратите внимание, что данная функциональность не входит в React из коробки, а предоставляется сторонними библиотеками._ React ничего не знает про то, как определяются стили. Если вы сомневаетесь, использовать указанный выше способ, то хорошим началом станет определение стилей в отдельном файле с расширением `*.css`, как вы ранее привыкли это делать, а затем указать нужные классы с помощью [`className`](/docs/dom-elements.html#classname).

### Можно создавать анимации в React? {#can-i-do-animations-in-react}

React может использоваться для создания крутых анимаций! В качестве примера посмотрите библиотеки [React Transition Group](https://reactcommunity.org/react-transition-group/) и [React Motion](https://github.com/chenglou/react-motion).
