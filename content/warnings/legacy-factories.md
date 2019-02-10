---
title: Фабрики React-элементов и JSX-предупреждение
layout: single
permalink: warnings/legacy-factories.html
---

Вы, вероятно, пришли сюда, потому что ваш код вызывает компонент как функцию. Теперь это устарело:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // ПРЕДУПРЕЖДЕНИЕ
}
```

## JSX {#jsx}

Компоненты React больше не могут вызываться таким образом. Вместо этого [вы можете использовать JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Без JSX {#without-jsx}

Если вы не хотите или не можете использовать JSX, тогда перед вызовом компонента вам необходимо перевести его в фабрику:

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

Это простой путь обновления, если у вас много вызовов функций.

## Динамические компоненты без JSX {#dynamic-components-without-jsx}

Если вы получаете класс компонента из динамического источника, то необязательно создавать фабрику, на которую вы немедленно ссылаетесь. Вместо этого вы можете напрямую создать элемент:

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## Подробнее {#in-depth}

[Узнайте подробнее, ПОЧЕМУ мы делаем это изменение.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
