---
id: integrating-with-other-libraries
title: Взаимодествие со сторонними библиотеками
permalink: docs/integrating-with-other-libraries.html
---

React может использоваться в любом веб-приложении. Он может быть встроен в другие приложения, и, с некоторыми оговорками, другие приложения могут встраиваться в React. Это руководство рассматривает некоторые общие случаи, с упором на интеграцию с [jQuery](https://jquery.com/) и [Backbone](http://backbonejs.org). Те же подходы могут использоваться для интеграции компонентов с любым существующим кодом.

## Интеграция с плагинами, изменяющими DOM {#integrating-with-dom-manipulation-plugins}

React не знает про изменения DOM, которые сделаны вне React. Он определяет обновления на основе своего внутреннего представления, и если одни и те же DOM-узлы управляются другими библиотеками, то это нарушает работу React без возможности её восстановления.

Это не означает, что соединить React с другими инструментами работы с DOM сложно или невозможно. Просто нужно помнить, за что отвечает каждый инструмент.

Самый простой способ избежать конфликтов -- предотвратить обновление React-компонента. Это можно сделать через рендеринг элемента, который не должен обновляться React, например, пустой `<div />`.

### Как решить проблему {#how-to-approach-the-problem}

Для демонстрации давайте набросаем обертку вокруг обобщенного jQuery плагина.

Мы установим [реф](/docs/refs-and-the-dom.html) на корневой DOM-элемент. Внутри `componentDidMount` мы получим ссылку и передадим её в jQuery-плагин.

Чтобы React не трогал DOM после монтирования, мы вернём пустой `<div />` из метода `render()`. Элемент `<div />` не имеет ни свойств, ни дочерних компонентов, так что для React нет никаких причин его обновлять. Это даёт jQuery полную свободу управления этой частью DOM: 

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

Заметьте, что мы объявили два [метода жизненного цикла](/docs/react-component.html#the-component-lifecycle) — как `componentDidMount`, так и `componentWillUnmount`. Многие jQuery-плагины добавляют обработчики событий DOM, поэтому важно отключать их внутри `componentWillUnmount`. Если плагин не предоставляет метод для очистки, то, возможно, вам придётся написать свой. Помните об удалении обработчиков событий, добавленных плагином, чтобы избежать утечек памяти.

### Интеграция с jQuery-плагином Chosen {#integrating-with-jquery-chosen-plugin}

Теперь рассмотрим конкретный пример. Давайте напишем минимальную обёртку для плагина [Chosen](https://harvesthq.github.io/chosen/), который работает с элементами `<select>`.

>**Примечание:**
>
>Да, это можно делать, но это не всегда лучший подход для React приложений. Мы советуем пользоваться React-компонентами, когда это возможно. Они являются самым простым способом переиспользовать код в React-приложении, и часто дают больший контроль над поведением и внешним видом.

Для начала, давайте посмотрим, что Chosen делает с DOM.

Когда вы вызываете его на узле `<select>`, он читает атрибуты этого узла, скрывает его с помощью инлайновых стилей и прямо за ним добавляет отдельный DOM-узел с собственным визуальным представлением.

Допустим, мы хотим предоставить следующий API для нашего компонента-обёртки над `<Chosen>`:

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

Для простоты мы будем реализовывать [неконтролируемый компонент](/docs/uncontrolled-components.html).

Сначала создадим пустой компонент, с методом `render()`, который возвращает `<select>`, обернутрый в `<div>`:

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

Обратите внимание, что мы обернули `<select>` в дополнительный `<div>`. Это нужно, потому что Chosen добавляет новый элемент сразу за узлом `<select>`, на котором он вызывается. Но React всегда ожидает только один дочерний элемент для `<div>`. Так мы гарантируем, что обновления React не будут конфликтовать с дополнительным узлом, добавляемым Chosen. Если вы собираетесь изменять DOM вне React, важно убедиться, что React не должен взаимодействовать с DOM-узлами.

Следующим шагом реализуем методы жизненного цикла. Нам нужно инициализировать Chosen с рефом на узле `<select>` в `componentDidMount`, а зетем убрать его в `componentWillUnmount`:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Обратите внимание, что React не придаёт никакого особого значения полю `this.el`. Код работает потому, что ранее мы присвоили этому полю `ref` в методе `render()`:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Этого достаточно, чтобы наш компонент отрендерился, но мы бы хотели получать уведомления об изменении значений. Для этого мы подпишемся на jQuery событие `change` на `<select>`, контролируемом Chosen.

Мы не станем передавать в Chosen `this.props.onChange` напрямую, потому что пропсы компонента могут со временем изменениться (в том числе и обработчики событий). Вместо этого мы объявим метод `handleChange()`, который будет вызывать `this.props.onChange`, и подпишем его на jQuery-событие `change`:

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

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/bWgbeE?editors=0010)

В завершение осталось сделать ещё кое-что. В React пропсы могут изменяться со временем. Например, компонент `<Chosen>` может получать разные дочерние элементы, если состояние родительского компонента изменяется. Это означает, что в точке интеграции нам нужно вручную обновлять DOM, в соответствии с обновлениями проп, так как React больше не управляет DOM для нас.

Документация Chosen предлагает использовать jQuery-метод `trigger()`, чтобы сообщить об изменения в оригинальном DOM-элементе. Мы поручим React заниматься обновлением `this.props.children` внутри `<select>`, но нужно добавить метод жизненного цикла `componentDidUpdate()`, чтобы уведомлять Chosen про обновление списка дочерних элементов:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

Таким способом Chosen узнает, что нужно обновить его DOM-элемент, когда дочерние элементы `<select>` были обновлены React.

Полная реализация `Chosen` компонента выглядит так:

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

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Интеграция с другими визульными библиотеками {#integrating-with-other-view-libraries}

Благодаря гибкости [`ReactDOM.render()`](/docs/react-dom.html#render) React может встраиваться в другие приложения.

Хотя обычно React используют для загрузки в DOM одного корневого компонента, `ReactDOM.render()` может быть вызван несколько раз для независимых частей UI. Это могут быть как отельные кнопки, так и большие приложения.

На самом деле, именно так React используется в Facebook. Это позволяет писать приложения на React по частям и объединять их с существующими генерируемыми сервером шаблонами и другим клиентским кодом.

### Замена строковых шаблонов с помощью React {#replacing-string-based-rendering-with-react}

Распространённый подход в старых веб-приложениях — описание частей DOM c помощью строк (вроде `${el.html(htmlString)`}). Такие участки кода прекрасно подходят для внедрения React. Просто переписываем рендеринг на основе строк в React-компонент.

Итак, есть текущая реализация на jQuery...

```js
$('#container').html('<button id="btn">Сказать «Привет»</button>');
$('#btn').click(function() {
  alert('Привет!');
});
```

...может быть переписана в React-компонент:

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

А дальше вы можете начать переносить логику внутрь компонента и использовать остальные React-подходы. Например, в компонентах лучше не полагаться на идентификаторы, потому что один и тот же компонент может быть отрендерен несколько раз. Вместо этого мы используем [событийную систему React](/docs/handling-events.html) и зарегестрируем обработчик непосредственно на React-элементе `<button>`:

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

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/RVKbvW?editors=1010)

Вы можете завести столько изолированных компонентов, сколько вам захочется. И использовать `ReactDOM.render()` для рендеринга в разные DOM-контейнеры. Постепенно, по мере перевода вашего приложения на React, вы сможете комбинировать их в большие компоненты и переносить вызов `ReactDOM.render()` вверх по структуре.

### Встраиваем React в представления Backbone {#embedding-react-in-a-backbone-view}

Представления в [Backbone](http://backbonejs.org/) обычно используют HTML-строки или функции, создающие строковые шаблоны для создания DOM элементов. Этот механизм также может быть заменен рендерингом React-компонентов.

Ниже мы создадим Backbone-представление `ParagraphView`. Оно переопределит метод `render()` (из `Backbone.View`) для рендеринга React-компонента `<Paragraph>` в DOM-элемент, предоставляемый Backbone (`this.el`). Также мы воспользуемся [`ReactDOM.render()`](/docs/react-dom.html#render):

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

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/gWgOYL?editors=0010)

Стоит отметить вызов `ReactDOM.unmountComponentAtNode()` в методе `remove`. Он нужен для того, чтобы React отключил обработчики событий и другие ресурсы, связанные с деревом компонентов при удалении.

Когда компонент удаляется из дерева React, очистка производится автоматически, но поскольку мы удаляем сущность из дерева вручную, то обязаны вызвать этот метод.

## Интеграция со слоем моделей {#integrating-with-model-layers}

Обычно рекомендуется использовать однонаправленный поток данных, вроде [состояния React](/docs/lifting-state-up.html), [Flux](http://facebook.github.io/flux/) или [Redux](http://redux.js.org/). Но React-компоненты могут также использовать слой данных из других библиотек и фреймворков.

### Использование моделей Backbone в React-компонентах {#using-backbone-models-in-react-components}

Самый простой способ использовать модели и коллекции [Backbone](http://backbonejs.org) из React-компонентов — это обработка различных событий и ручное обновление компонентов.

Компоненты, отвечающие за рендеринг моделей, будут обрабатывать событие `'change'`, а компоненты, отвечающие за рендеринг коллекций, будут обрабатывать события `'add'` и `'remove'`. В обоих случаях для отображения новых данных нужно вызвать [`this.forceUpdate()`]](/docs/react-component.html#forceupdate).

В следующем примере компонент `list` ренедрит Backbone-коллекцию, используя компонент `Item` для рендеринга отдельных элементов.

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

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Вынос данных из моделей  Backbone {#extracting-data-from-backbone-models}

Подход, показанный выше, требует, чтобы ваши React-компоненты знали о наличии моделей и коллекций Backbone. Если у вас в планах есть переход на другое решение для управления данными, вы, возможно, захотите максимально уменьшить связь с Backbone.

Один из подходов — вынос атрибутов моделей в простые данные, когда вы изменяете связанный код, а также хранить логику в одном месте. Следующий [компонент высшего порядка](/docs/higher-order-components.html) извлекат все атрибуты Backbone-модели в `state`, передавая данные в оборачиваемый компонент.

При этом подходе только компоненты высшего порядка будут знать о Backbone-моделях, а большая часть компонентов в приложении не будет завязана на Backbone.

В примере ниже, мы сделаем копию атрибутов модели для формирования начального состояния. Мы подпишемся на событие `change` (и отпишется от него при удалении), и когда оно будет возникать мы обновим состояние текущими атрибутами. Наконец, мы убедимся, что если пропадает сама `model`, мы не забываем отписаться от старой модели и подписаться на новую.

Обратите внимание, пример ниже не является полным в отношении работы с Backbone. Но он должен дать вам понимание общего подхода:

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

Для демонстрации использования мы соеденим React-компонент `NameInput` и Backbone-модель и будем обновлять ее атрибут `firstName` при каждом изменении поля ввода:

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      Мое имя - {props.firstName}.
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

[**Посмотреть на CodePen**](http://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Этот подход не ограничивается Backbone. Вы можете использовать React с любой библиотекой для работы с данными, просто подписываясь на методы жизненно цикла и, при необходимости, копируя данные во внутреннее состояние React.
