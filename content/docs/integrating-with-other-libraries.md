---
id: Взаимодествие со сторонними библиотеками
title: Integrating with Other Libraries
permalink: docs/integrating-with-other-libraries.html
---

React может использоваться в любом веб-приложении. Он может быть встроен в другие приложения, и с некоторыми оговорками другие приложения могут встраиваться в React. Это руководство рассматривает некоторые общие случаи, с упором на интеграцию с [jQuery](https://jquery.com/) и [Backbone](http://backbonejs.org). Те же подходы могут использоваться для интеграции компонентов с любым существующим кодом.

## Интеграция с плагинами, изменяющими DOM {#integrating-with-dom-manipulation-plugins}

React не значет об изменениях DOM, которые сделаны вне React. Он определяет обновления на основе своего внутреннего представления, и изменение тех же DOM узлов другими библиотеками сбивает React c толку.

Это не означает, что соединить React с другими инструментами работы с DOM сложно или невозможно. Просто нужно помнить, за что отвечает каждый инструмент.

Самый простой способ избежать конфликтов -- предотвратить обновление React компонента. Это можно сделать отрендерив элемент, который не должен обновляться React, например пустой `<div />`.

### Как подступиться к проблеме {#how-to-approach-the-problem}

Для демонстрации давайте набросаем обертку вокруг обобщенного jQuery плагина.

Мы установим [реф](/docs/refs-and-the-dom.html) на корневой DOM-элемент. Внутри `componentDidMount` мы получим ссылку и передадим ее в jQuery плагин.

Чтобы React не трогал DOM после монтирования, мы вернем пустой `<div />` из метода `render()`. Элемент `<div />` не имеет ни свойств, ни дочерних компонентов, так что для React нет никаких причин его обновлять. Это дает jQuery полную свободу управления этой частью DOM: 

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Заметьте, что мы объявили два [метода жизненного цикла](/docs/react-component.html#the-component-lifecycle) - и `componentDidMount` и `componentWillUnmount`. Многие jQuery плагина добавляют обработчики событий для DOM, поэтмоу важно отключать их внутри `componentWillUnmount`. Если плагин не предоставляет метод для очистки, то, возможно, вам придется написать свой. Помните об удалении обработчиков события, добавленных плагином, чтобы избежать утечек памяти.

### Интеграция с jQuery плагином Chosen {#integrating-with-jquery-chosen-plugin}

Теперь рассмотрим конкретный пример. Давайте напишем минимальную обертку для плагина [Chosen](https://harvesthq.github.io/chosen/), который работает с `<select>` элементами.

>**Примечание:**
>
>Да, это можно делать, но это не всегда лучший подход для React приложений. Мы советуем пользоваться React-компонентами, когда это возможно. Они являются самым простым способом переиспользовать код в React-приложения, и часто дают больший контроль над поведением и внешним видом.

Для начала, давайте посмотрим, что Chosen делает с DOM.

Когда вы вызоваете его на узле `<select>`, он читает атрибуты этого узла, скрывает его с помощью инлайновых стилей и прямо за ним добавляет отдельный DOM-узел с собственным визуальным представлением.

Допустим, мы хотим предоставить следующий API для нашего компонента-обертки над `<Chosen>`:

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>ваниль</option>
      <option>шоколад</option>
      <option>клубника</option>
    </Chosen>
  );
}
```

Для простоты мы будем реальзовывать [неконтролируемый компонент](/docs/uncontrolled-components.html).

Для начала создадим пустой компонент, с методом `render()`, который возвращает `<select>`, обернутрый в `<div>`:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Обратите внимание, что мы обернули `<select>` в дополнительный `<div>`. Это нужно потому, что Chosen добавляет новый элемент сразу за `<select>`-узлом, на котором он вызывается. Но React всегда ожидает только один дочерний элемент для `<div>`. Так мы гарантируем, что обновления React не будут конфликтовать с дополнительным узлом, добавляемым Chosen. Если вы собираетесь изменять DOM вне React, важно убедиться, что у React нет причин трогать эти узлы.

Следующим шагом мы реализуем методы жизненного цикла. Нам нужно инициализировать Chosen с рефом на `<select>`-узле в `componentDidMount`, и убрать его в `componentWillUnmount`:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**Открыть на CodePen**](http://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Обратите внимание, что React не придает никакого особого значения полю `this.el`. Код работает потому, что ранее мы присвоили этому полю `ref` в методе `render()`:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Этого достаточно, чтобы наш компонент отрендерился, но мы бы хотели получать уведомления об изменении значений. Для этого мы подпишемся на jQuery событие `change` на `<select>`, контролируемом Chosen.

Мы не станем передавать в Chosen `this.props.onChange` непосредственно, потому что пропсы компонента могут со временем изменениться (в том числе и обработчики событий). Вместо этого мы объявим метод `handleChange()`, который будет вызывать `this.props.onChange`, и подпишем его на jQuery событие `change`:

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**Открыть на CodePen**](http://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Осталась еще одна вещь, которую нужно сделать под конец. В React пропсы могут изменяться со временем. Например, `<Chosen>` компонент может получать разные дочерние элементы, если состояние родительского компонента изменяется. Это означает, что в точке интеграции нам нужно вручную обновлять DOM, в соответствии с обновлениями проп, так как React больше не управляет DOM для нас.

Документация к Chosen предлагает использовать jQuery метод `trigger()`, чтобы сообщить об изменения в оригинальном DOM-элементе. Мы позволим React позаботиться об обновлении `this.props.children` внутри `<select>`, но нам нужно добавить метод жизненного цикла `componentDidUpdate()`, чтобы уведомлять Chosen об обновлении списка дочерних элементом:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

Так Chosen будет узнавать, что нужно обновить его DOM-элемент, когда дочерние элементы `<select>` были обновлены React'ом.

Полная реализация `Chosen` компоненты выглядит так:

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**Открыть на CodePen**](http://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Интеграция с другими визульными библиотеками {#integrating-with-other-view-libraries}

Благодаря гибкости [`ReactDOM.render()`](/docs/react-dom.html#render) React может встраиваться с другие приложения.

Хотя обычно React используют для загрузки в DOM одного корневого компонента, `ReactDOM.render()` может быть вызван несколько раз, для независимых частей UI. Это могут быть как отельные кнопки, так и большие приложения.

На самом деле, именно так React используется в Facebook. Это позволяет писать приложения на React по-частям и объединять их с существующими генерируемыми сервером шаблонами и другим клиентским кодом.

### Замена строковых шаблонов с помощью React {#replacing-string-based-rendering-with-react}

В старых веб-приложениях описание частей DOM c помощью строк (вроде `${el.html(htmlString)`}) является распространенным подоходом. Такие моменты прекрасно подходят, для внедрения React. Просто переписываем рендеринг на основе строк в React-компонент.

Вот такая реализация на jQuery ...

```js
$('#container').html('<button id="btn">Сказать Привет</button>');
$('#btn').click(function() {
  alert('Привет!');
});
```

... может быть переписан на React компонентах:

```js
function Button() {
  return <button id="btn">Сказать Привет</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Привет!');
    });
  }
);
```

А дальше вы можете начать переносить логику внутрь компонента и использовать остальные React-подходы. Например, в компонентах лучше не полагаться на ID, потому что один и тот же компонент может быть отрендерен несколько раз. Вместо этого мы используем [событийную систему React](/docs/handling-events.html) и зарегестрируем обработчик непосредственно на React-элементе `<button>`:

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Сказать Привет</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Привет!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**Открыть на CodePen**](http://codepen.io/gaearon/pen/RVKbvW?editors=1010)

Вы можете завести столько изолированных компонентов, сколько вам захочется. И использовать `ReactDOM.render()` для рендеринга в разные DOM-контейнеры. Постепенно, по мере перевода вашего приложения на React, вы сможете комбинировать их в большие компоненты и переносить вызов `ReactDOM.render()` вверх по структуре.

### Встраиваем React в представления  Backbone {#embedding-react-in-a-backbone-view}

Представления в [Backbone](http://backbonejs.org/) обычно используют HTML-строки или функции создающие строковые шаблоны для создания DOM элементов. Этот менханизм так же может быть заменен рендерингом React-компонентов.

Ниже мы создадим Backbone-представление c названием `ParagraphView`. Оно переопределит метод `render()` из `Backbone.View` для рендеринга React-компонента `<Paragraph>` в DOM-элемент предосталяемый Backbone (`this.el`). Здесь мы также используем [`ReactDOM.render()`](/docs/react-dom.html#render):

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Открыть на CodePen**](http://codepen.io/gaearon/pen/gWgOYL?editors=0010)

Важным моментом является вызов `ReactDOM.unmountComponentAtNode()` в методе `remove`, чтобы React отключил обработчики событий и другие ресурсы, связанный с деревом компонентов, при удалении.

Когда компонент удаляется из дерева React, очистка производится автоматически, но т.к. мы удаляем сущность из дерева вручную, мы обязаны вызвать этот метод.

## Integrating with Model Layers {#integrating-with-model-layers}

While it is generally recommended to use unidirectional data flow such as [React state](/docs/lifting-state-up.html), [Flux](http://facebook.github.io/flux/), or [Redux](http://redux.js.org/), React components can use a model layer from other frameworks and libraries.

### Using Backbone Models in React Components {#using-backbone-models-in-react-components}

The simplest way to consume [Backbone](http://backbonejs.org/) models and collections from a React component is to listen to the various change events and manually force an update.

Components responsible for rendering models would listen to `'change'` events, while components responsible for rendering collections would listen for `'add'` and `'remove'` events. In both cases, call [`this.forceUpdate()`](/docs/react-component.html#forceupdate) to rerender the component with the new data.

In the example below, the `List` component renders a Backbone collection, using the `Item` component to render individual items.

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**Открыть на CodePen**](http://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Extracting Data from Backbone Models {#extracting-data-from-backbone-models}

The approach above requires your React components to be aware of the Backbone models and collections. If you later plan to migrate to another data management solution, you might want to concentrate the knowledge about Backbone in as few parts of the code as possible.

One solution to this is to extract the model's attributes as plain data whenever it changes, and keep this logic in a single place. The following is [a higher-order component](/docs/higher-order-components.html) that extracts all attributes of a Backbone model into state, passing the data to the wrapped component.

This way, only the higher-order component needs to know about Backbone model internals, and most components in the app can stay agnostic of Backbone.

In the example below, we will make a copy of the model's attributes to form the initial state. We subscribe to the `change` event (and unsubscribe on unmounting), and when it happens, we update the state with the model's current attributes. Finally, we make sure that if the `model` prop itself changes, we don't forget to unsubscribe from the old model, and subscribe to the new one.

Note that this example is not meant to be exhaustive with regards to working with Backbone, but it should give you an idea for how to approach this in a generic way:

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

To demonstrate how to use it, we will connect a `NameInput` React component to a Backbone model, and update its `firstName` attribute every time the input changes:

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**Открыть на CodePen**](http://codepen.io/gaearon/pen/PmWwwa?editors=0010)

This technique is not limited to Backbone. You can use React with any model library by subscribing to its changes in the lifecycle methods and, optionally, copying the data into the local React state.
