---
title: Новое в React v0.4: автопривязка по умолчанию"
author: [zpao]
---

React v0.4 очень близок к завершению. По мере того, как мы заканчиваем, 
мы хотели бы поделиться с вами некоторыми из основных изменений, 
которые мы внесли после v0.3. Это первый из нескольких постов, которые 
мы сделаем на следующей неделе.

## Что такое React.autoBind? {#что-такое-reactautobind}

Если вы посмотрите на большинство наших текущих примеров, то увидите, 
что мы используем `React.autoBind` для обработчиков событий. 
Он используется вместо `Function.prototype.bind`. Помните, что в JS,
[вызовы функций задерживаются](https://bonsaiden.github.io/JavaScript-Garden/#function.this).
Это означает, что если вы просто передадите функцию, то используемый 
внутри `this` не обязательно будет такой, какой вы ожидаете.
`Function.prototype.bind` создает новую, правильно связанную функцию,
так что при вызове, это именно то, что вы ожидаете.

Перед запуском React, мы бы написали это:

```js{4}
React.createClass({
  onClick: function(event) {/* делаете что-то с этим */},
  render: function() {
    return <button onClick={this.onClick.bind(this)} />;
  }
});
```

We wrote `React.autoBind` as a way to cache the function creation and save on memory usage. Since `render` can get called multiple times, if you used `this.onClick.bind(this)` you would actually create a new function on each pass. With React v0.3 you were able to write this instead:

Мы написали `React.autoBind` как способ кэшировать создание функции 
и экономить на использовании памяти. Так как `render` может вызываться 
несколько раз, если бы вы использовали `this.onClick.bind(this)`, 
то вы бы на самом деле создавали новую функцию на каждом проходе.
С помощью React v0.3 вы можете написать так:

```js{2,4}
React.createClass({
  onClick: React.autoBind(function(event) {/* делаете что-то с этим */}),
  render: function() {
    return <button onClick={this.onClick} />;
  }
});
```

## Что меняется в v0.4? {#что-меняется-в-v04}

После использования `React.autoBind` в течение нескольких недель,
мы поняли, что очень мало раз мы не хотели такого поведения. 
Поэтому мы сделали это по умолчанию! Теперь все методы, определенные 
в `React.createClass`, уже будут привязаны к правильному экземпляру.

Начиная с v0.4 вы можете писать так:

```js{2,4}
React.createClass({
  onClick: function(event) {/* делаете что-то с этим */},
  render: function() {
    return <button onClick={this.onClick} />;
  }
});
```

Для версии 0.4 мы просто сделаем `React.autoBind` не исполняемым - она 
просто вернет переданную ей функцию. Скорее всего, вам не придется 
менять код, чтобы учесть это изменение, хотя мы рекомендуем вам 
обновиться. Мы опубликуем руководство по миграции, документирующее 
это и другие изменения, сопровождающие React v0.4.
