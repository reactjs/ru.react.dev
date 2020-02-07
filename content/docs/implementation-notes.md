---
id: implementation-notes
title: Детали реализации
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---

В этой главе собраны примеры из реализации [согласователя Stack](/docs/codebase-overview.html#stack-reconciler). 

Они очень специфичны и требуют хорошего знания React API, а также ядра, рендереров и согласователя. Если вы не очень хорошо знакомы с архитектурой React, тогда изучите главу [Архитектура кодовой базы](/docs/codebase-overview.html), а затем вернитесь к этой.

Также предполагается, что вы понимаете [разницу между компонентами, их экземплярами и элементами в React](/blog/2015/12/18/react-components-elements-and-instances.html).

Согласователь Stack использовался в React 15 и более ранних версиях. Его код находится в каталоге [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Видео: сборка React с нуля {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) рассказал в своём докладе [как собрать React с нуля](https://www.youtube.com/watch?v=_MAD4Oly9yg), используя материал из этой главы.

В его докладе и этой главе описаны упрощённые реализации, поэтому, ознакомившись с ними, вы сможете лучше понять, как работает реальная реализация.

### Введение {#overview}

Согласователь не имеет открытого API. [Рендереры](/docs/codebase-overview.html#renderers), такие как React DOM и React Native, используются, чтобы эффективно обновлять пользовательские UI-компоненты.

### Монтирование как рекурсивный процесс {#mounting-as-a-recursive-process}

Давайте рассмотрим, как компонент монтируется в первый раз.

```js
ReactDOM.render(<App />, rootEl);
```

React DOM передаст `<App />` в согласователь. Запомните, что `<App />` -- это React-элемент, т.е. описание того, что нужно отрендерить. Вы можете представлять его как просто объект.

```js
console.log(<App />);
// { type: App, props: {} }
```

Согласователь будет проверять, чем является `App`: классом или функцией.

Если `App` -- функция, согласователь вызовет `App(props)`, чтобы получить элемент, который нужно отрендерить.

Если `App` -- класс, согласователь создаст экземпляр `App` с помощью `new App(props)`, вызовет метод жизненного цикла  `componentWillMount()`, а затем вызовет `render()`, чтобы получить элемент, который нужно отрендерить.

В любом случае, согласователь изучит элемент `App`, чтобы узнать, что нужно отрендерить.

Этот процесс рекурсивен. `App` может рендерить `<Greeting />`, `Greeting` -- `<Button />`, и т.д. Согласователь будет рекурсивно погружаться в пользовательские компоненты, пока не узнает, что каждый компонент должен рендерить.

Рассмотрим этот процесс с помощью псевдокода:

```js
function isClass(type) {
  // Подклассы React.Component имеют соответствующий флаг
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Функция получает React-элемент (например, <App />)
// и возвращает узел, являющуюся вершиной DOM- или Native-дерева элементов.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // Мы будем вычислять необходимый элемент
  // либо выполняя type как функцию,
  // либо с помощью создания экземпляра и вызова метода render().
  var renderedElement;
  if (isClass(type)) {
    // Компонент является классом
    var publicInstance = new type(props);
    // Задать пропсы
    publicInstance.props = props;
    // Если необходимо, вызвать метод жизненного цикла
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Получить необходимый элемент с помощью вызова render()
    renderedElement = publicInstance.render();
  } else {
    // Компонент является функцией
    renderedElement = type(props);
  }

  // Этот процесс может быть рекурсивным, потому что компонент может
  // возвращать другой компонент.
  return mount(renderedElement);

  // Примечание: эта реализация не завершена и выполняется бесконечно!
  // Обрабатывает такие элементы как <App /> и <Button />.
  // Пока не обрабатывает такие элементы как <div /> и <p />.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**Примечание:**
>
>Пример выше -- псевдокод. Он не является реальной реализацией. А также этот код приводит к переполнению стека, потому что мы не описали, когда нужно остановить рекурсию.

Рассмотрим основные идеи этого кода:

* React-элементы -- просто объекты, описывающие тип компонента (например, `App`) и его пропсы.
* Пользовательские компоненты могут быть как классами, так и функциями, но оба «рендерят» элементы.
* «Монтирование» -- рекурсивный процесс, который создаёт DOM- или Native-дерево заданного React элемента верхнего уровня (например, `<App />`).

### Монтирование базовых элементов {#mounting-host-elements}

Процесс монтирования может стать бесполезным, если мы не отобразим результат на экран.

В дополнение к пользовательским («составным») компонентам, React-элементы также могут быть представлены платформо-специфическими («базовыми») компонентами. Например, `Button` может вернуть `<div />` из метода render().

Если свойство `type` имеет тип string, значит мы имеем дело с базовым элементом:

```js
console.log(<div />);
// { type: 'div', props: {} }
```

Для базового элемента не существует пользовательского кода.

Когда согласователь встречает базовый элемент, ответственность за монтирование возьмёт на себя рендерер. Например, React DOM может создать DOM-узел.

Если элемент имеет потомков, согласователь рекурсивно монтирует их, следуя алгоритму выше. Потомки могут быть базовыми (например, `<div><hr /></div>`), составными (например, `<div><Button /></div>`) или обоих типов.

DOM-узлы, созданные дочерними компонентами, будут добавлены к родительскому DOM-узлу, и рекурсивно будет собрана полная DOM-структура.

>**Примечание:**
>
>Согласователь не связан с DOM. Точный результат монтирования (иногда называемый «смонтированный образ») зависит от рендерера и может быть DOM-узлом (React DOM), строкой (React DOM Server) или числом (React Native).

Если мы изменим код, чтобы он обрабатывал базовые элементы, то результат будет выглядеть вот так:

```js
function isClass(type) {
  // Подклассы React.Component имеют соответствующий флаг
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Эта функция обрабатывает только составные элементы.
// Например, <App /> и <Button />, но не <div />
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // Компонент является классом
    var publicInstance = new type(props);
    // Задать пропсы
    publicInstance.props = props;
    // Если необходимо, вызвать метод жизненного цикла
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Компонент является функцией
    renderedElement = type(props);
  }

  // Эта функция рекурсивна, но иногда достигает границ рекурсии, когда
  // встречает базовый элемент (такой, как <div />), вместо составного (такого, как <App />):
  return mount(renderedElement);
}

// Эта функция обрабатывает только базовые элементы.
// Например, <div /> и <p />, но не <App />.
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // Этот блок кода не следует размещать в согласователе.
  // Каждый рендеререр может инициализировать узлы по-своему.
  // Например, React Native может создать представление для iOS или Android.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Монтировать потомков
  children.forEach(childElement => {
    // Потомки могут быть как базовыми (<div />), так и составными (<Button />).
    // Их мы тоже будем монтировать рекурсивно:
    var childNode = mount(childElement);

    // Эта строка кода может отличаться
    // в зависимости от рендерера
    node.appendChild(childNode);
  });

  // Вернуть DOM ноду в качестве результата.
  // Здесь рекурия заканчивается.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Пользовательский компонент
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Платформо-специфический компонент
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

Этот код работает, но всё ещё далёк от того, как согласователь реализован на самом деле. Отсутствует ключевая деталь -- поддержка обновлений.

### Введение во внутренние экземпляры {#introducing-internal-instances}

Ключевая особенность React -- ререндеринг всего без пересоздания DOM или сброса состояния:

```js
ReactDOM.render(<App />, rootEl);
// Использовать уже существующий DOM:
ReactDOM.render(<App />, rootEl);
```

Однако, наша реализация знает только как монтировать начальное дерево. Она не может обновлять его, потому что не содержит необходимой информации, например, экземпляры `publicInstance`, или какой DOM-узел (`node`) соответствует компоненту.


Согласователь Stack решает эту проблему, сделав функцию `mount()` методом класса. В этом решении есть недостатки, поэтому мы решили [переписать согласователь](/docs/codebase-overview.html#fiber-reconciler). Однако, опишем, как он сейчас работает.

Вместо разделения на функции `mountHost` и `mountComposite`, мы создадим два класса:

Оба класса имеют конструктор, принимающий `element`, а также имеют метод `mount()`, который возвращает необходимый узел. Заменим вызывающую функцию `mount()` на фабрику, которая будет создавать нужный класс:

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Пользовательский компонент
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Платформо-специфический компонент
    return new DOMComponent(element);
  }  
}
```

Для начала рассмотрим реализацию `CompositeComponent`:

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // Для составных компонентов сделать экземпляр класса видимым.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Компонент является классом
      publicInstance = new type(props);
      // Задать пропсы
      publicInstance.props = props;
      // Если необходимо, вызвать метод жизненного цикла
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Компонент является функцией
      publicInstance = null;
      renderedElement = type(props);
    }

    // Сохранить внешний экземпляр
    this.publicInstance = publicInstance;

    // Получить внутренний экземпляр в соответствии с элементом.
    // Это может быть DOMComponent для <div /> или <p />,
    // и CompositeComponent для <App /> или <Button />:
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Монтировать полученный результат
    return renderedComponent.mount();
  }
}
```

Это не сильно отличается от предыдущей реализации `mountComposite()`, однако теперь мы можем сохранять некоторую информацию, такую как `this.currentElement`, `this.renderedComponent` и `this.publicInstance`, чтобы использовать во время обновлений.

Заметьте, что экземпляр `CompositeComponent`, это не то же самое, что экземпляр `element.type`. `CompositeComponent` -- деталь реализации нашего согласователя, которая не может быть доступна пользователю. Пользовательский класс -- это единственное, что мы читаем из `element.type`, а `CompositeComponent` создаёт его экземпляр.

Чтобы избежать путаницы, мы будем называть экземпляры `CompositeComponent` и `DOMComponent` "внутренними экземплярами". Они существуют для того, чтобы мы могли сохранять в них некоторые долгоживущие данные. Только рендереры и согласователь знают об их существовании.

В противоположность, мы будем называть экземпляры пользовательских классов "внешними экземплярами". Внешние экземпляры -- это то, что вы видите как  `this` внутри `render()` и других методов ваших компонентов.

Функция `mountHost()`, переименованная в метод `mount()` класса `DOMComponent`, также будет выглядеть знакомо:

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // Для DOM-компонентов сделать DOM-узел видимым.
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Создать и сохранить узел
    var node = document.createElement(type);
    this.node = node;

    // Задать атрибуты
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Создать и сохранить потомков.
    // Каждый из них может быть либо DOMComponent, либо CompositeComponent,
    // в зависимости от типа свойства type (строка или функция).
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Собрать DOM-узлы, которые возвращает метод mount.
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Вернуть DOM-узел в качестве результата
    return node;
  }
}
```

Основное отличие от метода `mountHost()` в том, что теперь мы храним `this.node` и `this.renderedChildren` внутри DOMComponent. Мы будем использовать их в дальнейшем, чтобы не поломать структуру во время обновлений.

В результате, каждый внутренний экземпляр (составной и базовый) имеет ссылку на свои внутренние экземпляры-потомки. Чтобы лучше представить себе этот процесс, создадим функциональный компонент `<App>`, который рендерит класс-компонент `<Button>`, который рендерит `<div>`. Вот как может выглядеть дерево внутренних экземпляров:

```js
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```

Внутри DOM вы увидите только `<div>`. Однако дерево внутренних экземпляров содержит как `DOMComponent`, так и `CompositeComponent`.

`CompositeComponent` должен хранить:

* Текущий элемент.
* Внешний экземпляр, если свойство type в элементе является классом.
* Единственный внутренний экземпляр. Он может быть как `DOMComponent`, так и `CompositeComponent`.

`DOMComponent` должен хранить:

* Текущий элемент.
* DOM ноду.
* Все внутренние экземпляры-потомки. Каждый из них может быть как `DOMComponent`, так и `CompositeComponent`.

Если в более сложном приложении вам тяжело представить, как выглядит дерево внутренних экземпляров, [React DevTools](https://github.com/facebook/react-devtools) поможет вам в этом, выделяя базовые экземпляры серым цветом, а составные фиолетовым:

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

В завершении, создадим функцию, которая монтирует полученное дерево в узел-контейнер аналогично `ReactDOM.render()`. Также как и `ReactDOM.render()`, она вернёт внешний экземпляр:

```js
function mountTree(element, containerNode) {
  // Создать верхнеуровневый внутренний экземпляр
  var rootComponent = instantiateComponent(element);

  // Монтировать верхнеуровневый компонент внутрь контейнера
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Вернуть внешний экземпляр
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Демонтирование {#unmounting}

Теперь, когда у нас есть внутренние экземпляры, которые хранят своих потомков и DOM ноды, мы можем реализовать демонтирование. Для составного компонента демонтирование рекурсивно и вызывает метод жизненного цикла.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Если необходимо, вызвать метод жизненного цикла
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Демонтировать единственный компонент
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

Для `DOMComponent` демонтировать каждого потомка:

```js
class DOMComponent {

  // ...

  unmount() {
    // Демонтировать всех потомков
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

В действительности демонтирование DOM компонентов также удаляет слушателей событий и очищает кэш, но опустим эти детали.

Теперь добавим верхнеуровневую функцию `unmountTree(containerNode)`, которая аналогична `ReactDOM.unmountComponentAtNode()`:

```js
function unmountTree(containerNode) {
  // Получить внутренний экземпляр из DOM ноды:
  // (Пока не работает, нам нужно изменить mountTree(), чтобы хранить переменную.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Демонтировать дерево и очистить контейнер
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

Чтобы это работало, нам нужно получить корневой внутренний экземпляр из DOM ноды. Мы изменим `mountTree()`, добавив свойство `_internalInstance` в корневую ноду. Также научим `mountTree()` уничтожать уже существующее дерево, чтобы можно было вызывать этот метод несколько раз.

```js
function mountTree(element, containerNode) {
  // Уничтожить уже существующее дерево
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Создать верхнеуровневый внутренний экземпляр
  var rootComponent = instantiateComponent(element);

  // Монтировать верхнеуровневый компонент внутрь контейнера
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Сохранить ссылку на внутренний экземпляр
  node._internalInstance = rootComponent;

  // Вернуть внешний экземпляр
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

Теперь вызов `unmountTree()`, а также повторный вызов  `mountTree()` удалят старое дерево и запустят в компоненте метод жизненного цикла `componentWillUnmount()`.

### Обновления {#updating}

В предыдущей части мы реализовали демонтирование. Однако React не был бы так полезен, если бы после каждого изменения пропсов демонтировалось и монтировалось заново всё дерево.

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Использовать уже существующий DOM:
mountTree(<App />, rootEl);
```

Расширим наш внутренний экземпляр ещё одним методом. В дополнение к `mount()` и `unmount()`, в `DOMComponent` и `CompositeComponent` будет реализован новый метод `receive(nextElement)`:

```js
class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
```

Его задача -- сделать всё необходимое, чтобы обновить компонент (со всеми потомками) в соответствии с `nextElement`.

Несмотря на то, что мы рекурсивно обновляем экземпляры `DOMComponent` и `CompositeComponent`, эту часть часто называют "diff-алгоритмом для виртуального DOM".

### Обновление составных компонентов {#updating-composite-components}

Когда составной компонент получает новый элемент, мы выполняем метод жизненного цикла `componentWillUpdate()`.

Затем мы заново отрендерим компонент с новыми пропсами и получим новый React-элемент:

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Обновить *свой* элемент
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Вычислить новый результат render()
    var nextRenderedElement;
    if (isClass(type)) {
      // Компонент является классом
      // Если необходимо, вызвать метод жизненного цикла
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Обновить пропсы
      publicInstance.props = nextProps;
      // Отрендерить снова
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Компонент является функцией
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Далее, мы можем рассмотреть свойство `type`. Если оно не изменилось с последнего рендеринга, то компонент ниже может быть обновлён.

Например, если в первый раз результат был `<Button color="red" />`, а во второй -- `<Button color="blue" />`, значит мы можем просто вызвать `receive()` (с новым элементом в качестве параметра) у соответствующего внутреннего экземпляра:

```js
    // ...

    // Если свойство type не изменилось, то
    // переиспользовать внутренний экземпляр и прекратить выполнение.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

Однако, если свойство `type` нового элемента отличается от предыдущего, то мы не можем обновить внутренний экземпляр. `<button>` не может "превратиться" в `<input>`.

Вместо этого мы демонтируем существующий внутренний экземпляр и монтируем новый, который будет рендерить соответствующий элемент. Например, вот что происходит, когда компонент, который ранее рендерил `<button />`, рендерит `<input />`:

```js
    // ...

    // Если мы дошли до сюда, то нам нужно демонтировать предыдущий
    // компонент, монтировать новый, и обменять их ноды.

    // Найти старый узел, потому что его нужно заменить
    var prevNode = prevRenderedComponent.getHostNode();

    // Демонтировать старого потомка и монтировать нового
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Обновить потомка
    this.renderedComponent = nextRenderedComponent;

    // Заменить старого потомка на нового
    // Заметка: этот код завязан на рендерере и,
    // в иделе, должен находиться вне CompositeComponent:
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

Подводя итог, когда составной компонент получает новый элемент, он может либо делегировать обновление внутреннему экземпляру, либо демонтировать старый компонент и монтировать новый.

Существует ещё одна ситуация, когда компонент будет заново монтировать потомка вместо вызова `receive()` -- `key` элемента изменился. Мы не будем обсуждать обработку `key` в этой главе, потому что это добавит ещё больше сложности к и без того уже сложному материалу.

Заметьте, что во внутренний экземпляр нам нужно добавить метод `getHostNode()`, чтобы возможно было обнаружить платформо-специфичные ноды и заменить их во время обновления. Его реализация очевидна в обоих классах:

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Попросить внутренний экземпляр предоставить ноду.
    // Этот вызов рекурсивно развернёт все компоненты.
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }  
}
```

### Обновление базовых компонентов {#updating-host-components}

Хостовые компоненты, такие как `DOMComponent`, обновляются по-другому. Когда они получают элемент, то им необходимо обновить платформо-специфический view. В случае с React DOM, это означает обновить DOM атрибуты:

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Удалить старые атрибуты.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Задать новые атрибуты.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Затем хостовым компонентам необходимо обновить их потомков. В отличии от составных, они могут содержать более чем одного потомка.

В этом упрощённом примере, мы используем массив внутренних экземпляров и проходим по каждому из них, обновляя либо заменяя внутренние экземпляры, в зависимости от того, соответствует ли полученный `type` предыдущему. В реальности reconciler также берёт `key` элементов и, в добавок к вставкам и удалениям элементов, отслеживает их перещение, но мы опустим эту деталь.

Соберём DOM операции над потомками в список, чтобы мы смогли выполнить их обновление группой:

```js
    // ...

    // Массивы React элементов
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // Массивы внутренних экземпляров
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // Проходя по потомкам, будем добавлять операции в массив.
    var operationQueue = [];

    // Заметка: блок кода ниже очень упрощён! Он не обрабатывает 
    // переупорядочивание, передачу компонентов как пропсов, и потомков со свойством `key`.
    // Он нужен только чтобы показать основы, а не детали.

    for (var i = 0; i < nextChildren.length; i++) {
      // Попытаться получить внутренний экземпляр
      var prevChild = prevRenderedChildren[i];

      // Если не существует внутреннего экземпляра с этим индексом,
      // то потомок будет добавлен в конец. Создать новый
      // внутренний экземпляр, монтировать его и использовать его ноду.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Записать, что нам нужно добавить ноду
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Мы можем обновлять экземпляры только если их элементы совпадают.
      // Например, <Button size="small" /> может быть обновлён на
      // <Button size="large" />, но не на <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // Если невозможно обновить существующий экземпляр, то мы должны
      // демонтировать его и монтировать вместо него новый.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Записать, что нам нужно поменять ноды
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Если возможно обновить существующий экземпляр, то передать
      // новый элемент в receive() и позволить ему обновиться самостоятельно.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Наконец, демонтировать потомков, которых больше не существует:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Записать, что нам нужно удалить ноды      
      operationQueue.push({type: 'REMOVE', node});
    }

    // Обновить спосок внутренних экземпляров
    this.renderedChildren = nextRenderedChildren;

    // ...
```

Последний шаг -- выполним DOM операции. Опять же, реальная реализация согласователя более сложная, потому что обрабатывает перемещения:

```js
    // ...

    // Обработать очередь операций
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }
}
```

И всё это нужно для обновляния хостовых компонентов.

### Итоговая реализация обновлений {#top-level-updates}

Сейчас, когда в `CompositeComponent` и `DOMComponent` реализован метод `receive(nextElement)`, мы можем изменить вызывающую функцию `mountTree()`, чтобы вызывать её, когда свойство `type` в элементе не изменилось:

```js
function mountTree(element, containerNode) {
  // Проверить наличие дерева
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // Переиспользовать существующий корневой компонент, если это возможно
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Иначе, демонтировать существуюющее дерево
    unmountTree(containerNode);
  }

  // ...

}
```

Теперь вызов `mountTree()` дважды с одним и тем же параметром ничего не разрушает.

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Переиспользовать существующий DOM:
mountTree(<App />, rootEl);
```

Это и есть основа работы React изнутри.

### Что не было рассмотрено {#what-we-left-out}

Эта реализация упрощена по сравнению с реальной. Существует много важных вещей на которые мы не обратили внимание:

* Компоненты могут рендерить `null`, а согласователь может обрабатывать массив из «пустых слотов».

* Согласователь также берёт `key` элементов и использует их, чтобы установить связь между внутренними экземплярами и элементами в массиве. Основная сложность React связана именно с этой деталью.

* В дополнение к составным и хостовым компонентам, также существуют внутренние экземпляры для «текстовых» и «пустых». Они представляют текстовые ноды и «пустые слоты», которые вы получаете, когда рендерите `null`.

* Рендереры используют [инъекции](/docs/codebase-overview.html#dynamic-injection), чтобы прокинуть базовые компоненты в согласователь. Например, React Dom говорит recolciler-у, что нужно использовать `ReactDOMComponent` в качестве внутреннего экземпляра.

* Логика обновления списка потомков вынесена в миксин `ReactMultiChild`, который используется хостовым компонентами в React DOM и React Native.

* Согласователь также реализует поддержку `setState()` в соствавных компонентах. Множество обновлений внутри события объединяются в единое обновление.

* Также согласователь берёт на себя ответственность за присоединение и отсоединение рефов для составных компонентов и хостовых нод.

* Методы жизненного цикла, которые вызываются по готовности DOM (такие, как `componentDidMount()` и `componentDidUpdate()`), собираются в «очередь обратных вызовов» и выполняются единым вызовом.

* React кладёт информацию о текущем обновлении в объект, называемый "транзакция". Транзакции полезны для отслеживания очереди из методов жизненного цикла, DOM предупреждений, и всего остального, что является "глобальным" для текущего обновления. Также транзакции гарантируют, что React "очищает всё" после обновлений. Например, класс транзакции, предоставляемый React DOM, после обновления восстановит выделение в инпуте.

### Погружение в код {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) содержит методы `mountTree()` и `unmountTree()` из этой главы. Он заботится о монтировании и демонтировании компонентов. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) -- аналог из React Native.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) -- эквивалент `DOMComponent` из этой главы. Он реализует хостовый компонент для React DOM рендерера. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) -- аналог из React Native.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) -- эквивалент `CompositeComponent` из этой главы. Он обрабатывает вызовы из пользовательских компонентов и хранит состояние.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) содержит switch для элемента, который выбирает необходимый внутренний экземпляр. Является эквивалентом `instantiateComponent()` из этой главы.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) -- обёртка над методами `mountComponent()`, `receiveComponent()` и `unmountComponent()`. Вызывает соответствующую реализацию внутреннего экземпляра, а также включает некоторый общий код, который используют все реализации.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) реализует логику монтирования, обновления и демонтирования потомков, в соответствии со свойством `key`.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) обрабатывает очередь операций для вставки, удаления и перемещения потомков независимо от используемого рендерера.

* `mount()`, `receive()`, и `unmount()` в репозитории React называются `mountComponent()`, `receiveComponent()`, и `unmountComponent()` по историческим причинам, но, в качестве параметра, получают элемент.

* Свойства во внутренних экземплярах начинаются с нижнего подчёркивания, например, `_currentElement`. Внутри репозитория являются открытыми и нигде не изменяются.

### Будущие изменения {#future-directions}

Согласователь Stack имеет ограничения, такие как синхронность и невозможность прерывать выполнение или разделять задачу на подзадачи. Сейчас идёт работа над [new Fiber reconciler](/docs/codebase-overview.html#fiber-reconciler) с [совершенно другой архитектурой](https://github.com/acdlite/react-fiber-architecture). В будущем, мы собираемся поменять согласователь Stack на Fiber, но в настоящий момент он не является полноценным аналогом.

### Что дальше? {#next-steps}

[В следующей главе](/docs/design-principles.html) описаны принципы проектирования, которые мы используем в разработке React.
