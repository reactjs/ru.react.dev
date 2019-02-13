---
title: Предупреждение: Refs Must Have Owner
layout: single
permalink: warnings/refs-must-have-owner.html
---

Вероятно, вы зашли на эту страницу потому что получили одно из следующих сообщений об ошибке:

*React 16.0.0+*
> Warning:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).

*более ранние версии React*
> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.

Обычно это означает одну из трёх вещей:

- Вы пытаетесь добавить `ref` в функциональный компонент.
- Вы пытаетесь добавить `ref` к элементу, который был создан вне метода `render()` текущего компонента.
- У вас загружено несколько конфликтующих копий React (например, из-за неправильной настройки npm-зависимостей).

## Рефы и функциональные компоненты {#refs-on-function-components}

Если `<Foo>` -- функциональный компонент, ему нельзя добавить `ref`:

```js
// Не работает, если Foo это фукнция!
<Foo ref={foo} />
```

Если требуется добавить `ref` к компоненту, преобразуйте его в класс или не пользуйтесь механизмом рефов, потому что он [редко необходим](/docs/refs-and-the-dom.html#when-to-use-refs). 

## Строковые рефы вне метода `render` {#strings-refs-outside-the-render-method}

Обычно это означает, что вы пытаетесь добавить реф к компонентy, который не имеет владельца (т.е. не был создан внутри метода `render` какого-либо компонента).

Следующий пример работать не будет:

```js
// Не работает!
ReactDOM.render(<App ref="app" />, el);
```

Попробуйте отрендерить этот компонент внутри нового компонента-обертки, который будет содержать реф. Как вариант, вы можете использовать колбэк-реф:

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Хорошо подумайте, [действительно ли вам нужен реф](/docs/refs-and-the-dom.html#when-to-use-refs) перед использованием этого подхода.

## Несколько копий React {#multiple-copies-of-react}

Bower хорошо решает вопрос дублирования зависимостей, а вот npm — нет. Если вы не делаете с вашими рефами ничего особенного, скорее всего, проблема не в вашем коде, а в нескольких загруженных копиях React. Иногда, когда вы устанавливаете сторонний пакет через npm, вы можете получить дублирование библиотеки из зависимостей, и это может создать проблему.

Если вы используете npm, `npm ls` или `npm ls react` поможет разобраться, какие установлены зависимости.
