---
id: test-renderer
title: Тестовый рендерер
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Импортирование**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 с помощью npm
```

## Обзор {#overview}

В этом пакете вы найдёте рендерер, который умеет рендерить React-компоненты в обычные JavaScript-объекты, не используя при этом DOM или мобильное окружение.

Пакет `react-test-renderer` облегчает получение снимка иерархии представления платформы (чем-то похожего на DOM-дерево), отрендеренного компонентом React DOM или React Native. При этом не используются ни браузер, ни [jsdom](https://github.com/tmpvar/jsdom).

Пример:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Jest может автоматически сохранять в файл снимок копии дерева в виде JSON, а затем проверять в тестах, что в этом снимке ничего не изменилось с момента прошлого исполнения теста: [узнать подробнее](https://jestjs.io/docs/ru/snapshot-testing).

Также есть возможность искать в дереве конкретные узлы и проверять утверждения относительно них:

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)

### Методы и поля экземпляра TestRenderer {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Справочник {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Создаёт экземпляр `TestRenderer` для переданного React-элемента. И хотя реальный DOM не будет использоваться, дерево компонентов будет полностью отрендерено в памяти и его можно будет протестировать с помощью утверждений. У созданного экземпляра `TestRenderer` будут присутствовать следующие методы и свойства:

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Возвращает объект, представляющий собой отрендеренное дерево. В дереве будут присутствовать только те узлы, которые специфичны для платформы (например, узлы `<div>` или `<View>`) и их пропсы. А вот компонентов, созданных разработчиками, в этом дереве не будет. Это очень удобно для тестирования с [помощью снимков](https://jestjs.io/docs/ru/snapshot-testing#%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D1%81-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC-%D1%81%D0%BD%D0%B8%D0%BC%D0%BA%D0%BE%D0%B2-%D0%B2-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Возвращает объект, представляющий собой отрендеренное дерево. В отличии от `toJSON()` в отрендеренное дерево попадут и пользовательские компоненты. Скорее всего, этот метод вряд ли будет полезен, пока вы не захотите создать собственную библиотеку тестирования поверх `TestRenderer`.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Повторно рендерит находящееся в памяти дерево компонентов с учётом нового корневого элемента. По сути, это симуляция вызова React-обновления для корневого элемента. Если новый элемент имеет тот же тип и ключ, что и предыдущий, то дерево будет обновлено. Иначе, будет перемонтировано новое дерево.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Демонтирует дерево, находящееся в памяти. При этом запустятся необходимые события жизненного цикла.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Возвращает экземпляр соответствующий корневому элементу, если таковой существует. Этот метод не сработает, если верхним элементом будет функциональный компонент, потому что они не имеют экземляров (в отличие от классовых компонентов).

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Возвращает корневой тестовый экземпляр, который полезен для проверок конкретных узлов дерева. Полученный экземпляр можно использовать и для поиска других тестовых экземпляров, расположенных глубже в дереве.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Находит единственный вложенный тестовый экземпляр для которого `test(testInstance)` возвращает `true`. Метод `test(testInstance)` должен вернуть `true` ровно для одного тестового экземпляра, в противном случае будет сгенерирована ошибка.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Находит единственный вложенный тестовый экземпляр с указанным типом `type`. Метод `findByType` сгенерирует ошибку, если тестовых экземпляров с указанным `type` не найдено или найдено больше одного.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Находит единственный вложенный тестовый экземлпяр с указанными пропсами `props`. Метод `findByProps` сгенерирует ошибку, если тестовых экземпляров с указанными пропсами не найдено или найдено больше одного.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Находит все вложенные тестовые экземпляры, для которых `test(testInstance)` возвращает `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Находит все вложенные тестовые экземпляры с указанным типом `type`.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Находит все вложенные тестовые экземпляры c указанными пропсами `props`.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

Экземпляр компонента, соответствующий его тестовому экземпляру. Свойство доступно только для классовых компонентов, т.к. функциональные компоненты не имеют экземпляров. Этот экземпляр компонента будет соответствовать значению `this` внутри данного компонента.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

Тип компонента, соответствующий его тестовому экземпляру. Например, компонент `<Button />` имеет тип `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

Пропсы, соответствующие тестовому экземпляру. Например, у компонента `<Button size="small" />` пропсами будут `{size: "small"}`.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

Родительский тестовый экземпляр текущего тестового экземпляра.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Дочерние тестовые экземпляры текущего тестового экземпляра.

## Используем тестовый рендерер {#ideas}

Можно передать функцию `createNodeMock` в `TestRenderer.create` как параметр для создания собственных фиктивных рефов. Функция `createNodeMock` принимает элемент и возвращает фиктивный реф-объект.

Это может быть полезно для тестирования компонентов, которые используют рефы.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // возвращаем фиктивную функцию "focus"
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
