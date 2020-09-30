---
title: "Новое в React v0.4: Валидацяи пропсов и значения по умолчанию"
author: [zpao]
---

Многие из вопросов, которые мы получили после публичного запуска React, 
касались пропсов, в частности, того, что люди хотели провести валидацию 
и убедиться в том, что их компоненты имеют верные значения по умолчанию.


## Валидация {#валидация}

Oftentimes you want to validate your `props` before you use them. Perhaps you want to ensure they are a specific type. Or maybe you want to restrict your prop to specific values. Or maybe you want to make a specific prop required. This was always possible — you could have written validations in your `render` or `componentWillReceiveProps` functions, but that gets clunky fast.

Часто вы хотите проверить ваши пропсы перед тем, как использовать их. 
Возможно, вы хотите удостовериться, что они относятся к определенному типу. 
Или, может быть, вы хотите ограничить ваш пропсы конкретными значениями. 
Или, может быть, вы хотите сделать требуемый пропс. Это всегда было 
возможно - вы могли написать валидацию в `render` или функции 
`componentWillReceiveProps`, но это быстро становится неудобным.

React v0.4 предоставит вам хороший простой способ использовать встроенные 
валидаторы или даже написать свои собственные.

```js
React.createClass({
  propTypes: {
    // Опциональная строковая пропса с именем "description".
    description: React.PropTypes.string,

    // Требуемая перечисляемая пропса с именем "category".
    category: React.PropTypes.oneOf(['News','Photos']).isRequired,

    // Пропса с именем "dialog" которая должна соответстовать типу Dialog.
    dialog: React.PropTypes.instanceOf(Dialog).isRequired
  },
  ...
});
```


## Значения по умолчанию {#значения-по-умолчанию}

Один общий шаблон, который мы видели с нашим React кодом, это сделать 
что-то вроде этого:

```js
React.createClass({
  render: function() {
    var value = this.props.value || 'default value';
    return <div>{value}</div>;
  }
});
```

Сделайте это для нескольких пропсов в некоторых компонентам и теперь у 
вас будет много избыточного кода. Начиная с React v0.4, вы можете 
предоставлять значения по умолчанию декларативным способом:

```js
React.createClass({
  getDefaultProps: function() {
    return {
      value: 'default value'
    };
  }
  ...
});
```

Мы будем использовать кэшированный результат этой функции перед каждым `render`.
Мы также выполняем все проверки перед каждым `render`, чтобы удостовериться,
что у вас есть все необходимые данные в правильной форме, прежде чем вы попытаетесь их использовать.

- - -

Обе эти функции являются полностью опциональными. Мы обнаружили, что 
они становятся все более ценными на Facebook по мере роста и развития 
наших приложений, и надеемся, что другие тоже найдут их полезными.
