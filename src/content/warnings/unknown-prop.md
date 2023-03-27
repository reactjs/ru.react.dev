---
<<<<<<< HEAD:content/warnings/unknown-prop.md
title: "Предупреждение: неизвестный проп"
layout: single
permalink: warnings/unknown-prop.html
---
=======
title: Unknown Prop Warning
---

The unknown-prop warning will fire if you attempt to render a DOM element with a prop that is not recognized by React as a legal DOM attribute/property. You should ensure that your DOM elements do not have spurious props floating around.
>>>>>>> e5fd79cdbb296b87cab7dff17c3b7feee5dba96b:src/content/warnings/unknown-prop.md

Предупреждение о неизвестном пропе выдаётся, когда вы пытаетесь отрендерить DOM-элемент с пропом, который React не может распознать как разрешённый DOM-атрибут или свойство. Вам следует убедиться, что DOM-элементы не получают по ошибке пропсы, которые к ним не относятся.

<<<<<<< HEAD:content/warnings/unknown-prop.md
Есть несколько наиболее вероятных причин, из-за чего возникает это предупреждение:
=======
1. Are you using `{...props}` or `cloneElement(element, props)`? When copying props to a child component, you should ensure that you are not accidentally forwarding props that were intended only for the parent component. See common fixes for this problem below.
>>>>>>> e5fd79cdbb296b87cab7dff17c3b7feee5dba96b:src/content/warnings/unknown-prop.md

1. Используете ли вы `{...this.props}` или `cloneElement(element, this.props)`? Может быть, ваш компонент передаёт собственные пропсы напрямую дочернему элементу (см. [Компоненты и пропсы](/docs/transferring-props.html)). Проверьте, что вы не перенаправляете случайно пропсы, предназначенные для родительского компонента, в дочерние компоненты.

<<<<<<< HEAD:content/warnings/unknown-prop.md
2. Вы используете нестандартный DOM-атрибут на нативном DOM-узле. Например, с целью представить пользовательские данные. Вместо этого следует рассмотреть вариант с использованием data-атрибутов, описанных [на MDN](https://developer.mozilla.org/ru/docs/Web/Guide/HTML/Using_data_attributes).

3. React не распознаёт указанный атрибут. С большой вероятностью, это будет исправлено в будущих версиях React. На сегодняшний же день React удаляет неизвестные атрибуты, поэтому они не будут отрендерены.

4. Имя React-компонента начинается со строчной буквы, поэтому React распознаёт его как DOM-тег, а не как компонент. Это происходит на основе [соглашения о верхнем и нижнем регистре в JSX](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized), которое позволяет React различать пользовательские компоненты от DOM-тегов.

---

Чтобы исправить ситуацию, составные компоненты должны получить все пропсы, которые предназначены только ему, а не его дочерним компонентам. Пример:
=======
3. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React. React will allow you to pass it without a warning if you write the attribute name lowercase.

4. You are using a React component without an upper case, for example `<myButton />`. React interprets it as a DOM tag because React JSX transform uses the upper vs. lower case convention to distinguish between user-defined components and DOM tags. For your own React components, use PascalCase. For example, write `<MyButton />` instead of `<myButton />`.

---

If you get this warning because you pass props like `{...props}`, your parent component needs to "consume" any prop that is intended for the parent component and not intended for the child component. Example:
>>>>>>> e5fd79cdbb296b87cab7dff17c3b7feee5dba96b:src/content/warnings/unknown-prop.md

**Плохо:** Непредвиденный проп `layout` перенаправлен в тег `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // Плохо! Потому что мы уверены, что "layout" не проп, с которым <div> работает.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // Плохо! Потому что мы уверены, что "layout" не проп, с которым <div> работает.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Хорошо:** Оператор расширения (`...`) помогает извлечь часть пропсов (например, `layout`) каждый в отдельную переменную, а оставшиеся — поместить в общую переменную (скажем, `rest`).

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Хорошо:** Вы также можете присвоить пропсы новому объекту и удалить из него те ключи, которые используете в текущем компоненте. Этот объект можно безопасно передать дочерним компонентам. Будьте внимательны и не удаляйте пропсы из оригинального объекта `this.props`, обращайтесь с ним как с иммутабельным.

```js
function MyDiv(props) {
  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
