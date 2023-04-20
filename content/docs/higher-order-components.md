---
id: higher-order-components
title: Компоненты высшего порядка
permalink: docs/higher-order-components.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> Higher-order components are not commonly used in modern React code.

</div>

Компонент высшего порядка (Higher-Order Component, HOC) -- это один из продвинутых способов для повторного использования логики. HOC не являются частью API React, но часто применяются из-за композиционной природы компонентов.

Говоря просто, **компонент высшего порядка -- это функция, которая принимает компонент и возвращает новый компонент.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Если обычный компонент преобразует пропсы в UI, то компонент высшего порядка преобразует компонент в другой компонент.

HOC часто встречаются в сторонних библиотеках, например [`connect`](https://react-redux.js.org/api/connect) в Redux и [`createFragmentContainer`](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer) в Relay.

В этой главе мы обсудим чем полезны компоненты высшего порядка и как их создавать.

## HOC для сквозной функциональности {#use-hocs-for-cross-cutting-concerns}

> **Примечание**
>
> В прошлом мы рекомендовали примеси для реализации сквозной функциональности, но со временем выяснилось, что от них больше вреда, чем пользы. [Узнайте](/blog/2016/07/13/mixins-considered-harmful.html), почему мы решили убрать примеси и как переписать старые компоненты.

Традиционные компоненты подразумевают многократное использование, но не позволяют с лёгкостью решить некоторые проблемы.

Рассмотрим пример `CommentList`, который получает список комментариев из внешнего источника данных и отображает их:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" -- произвольный глобальный источник данных
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Подписаться на оповещения
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Отписаться от оповещений
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Сохранить комментарии из внешнего источника в локальном состоянии
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Теперь мы решили реализовать новый компонент, который отслеживает изменения конкретной публикации и повторяет уже знакомый нам шаблон:

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

Разница между `CommentList` и `BlogPost` в том, что они вызывают разные методы `DataSource` и рендерят разный вывод. Однако в большинстве своём они похожи:

- Оба компонента подписываются на оповещения от `DataSource` при монтировании.
- Оба меняют внутреннее состояние при изменении `DataSource`.
- Оба отписываются от `DataSource` при размонтировании.

Можете представить, что в больших приложениях связка «подписаться на `DataSource`, затем вызвать `setState`» повторяется очень часто. Было бы здорово абстрагировать эту функциональность и использовать её в других компонентах. 

Давайте реализуем функцию `withSubscription` -- она будет создавать компоненты и подписывать их на обновления `DataSource` (наподобие `CommentList` и `BlogPost`). Функция будет принимать оборачиваемый компонент и через пропсы передавать ему новые данные:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

Первый параметр -- это оборачиваемый компонент. Второй -- функция, которая извлекает нужные нам данные, она получает `DataSource` и текущие пропсы.

Когда `CommentListWithSubscription` и `BlogPostWithSubscription` рендерятся, они передают в `CommentList` и `BlogPost` обновлённые данные `DataSource` через проп `data`:

```js
// Эта функция принимает компонент...
function withSubscription(WrappedComponent, selectData) {
  // ...и возвращает другой компонент...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ...который подписывается на оповещения...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... и рендерит оборачиваемый компонент со свежими данными!
      // Обратите внимание, что мы передаём остальные пропсы
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Заметьте, что HOC ничего не меняет и не наследует поведение оборачиваемого компонента, вместо этого HOC *оборачивает* оригинальный компонент в контейнер посредством *композиции*. HOC является чистой функцией без побочных эффектов.

Вот и всё! Оборачиваемый компонент получает все пропсы, переданные контейнеру, а также проп `data`. Для HOC не важно, как будут использоваться данные, а оборачиваемому компоненту не важно, откуда они берутся.

Так как `withSubscription` -- это обычная функция, то мы можем убрать или добавить любое количество аргументов. Например, мы могли бы сделать конфигурируемым название пропа `data` и ещё больше изолировать HOC от оборачиваемого компонента. Также мы можем добавить аргумент для конфигурации `shouldComponentUpdate` или источника данных. Всё это возможно, потому что HOC полностью контролирует процесс создания компонента.

Взаимодействие между `withSubscription` и оборачиваемым компонентом осуществляется с помощью пропсов, так же, как и между обычными компонентами. Благодаря этому мы можем с лёгкостью заменить один HOC на другой, при условии, что они передают одни и те же пропсы в оборачиваемый компонент. Это может пригодиться если, например, мы решим поменять библиотеку получения данных.

## Не мутируйте оборачиваемый компонент. Используйте композицию. {#dont-mutate-the-original-component-use-composition}

Не поддавайтесь соблазну менять прототип компонента (или мутировать его любым другим способом) внутри HOC.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Текущие пропсы: ', this.props);
    console.log('Предыдущие пропсы: ', prevProps);
  };
  // Если мы возвращаем оборачиваемый компонент, значит, наверняка мы его изменили
  return InputComponent;
}

// EnhancedComponent будет печатать в консоль при каждом изменении пропсов
const EnhancedComponent = logProps(InputComponent);
```

В приведённом выше примере мы не можем повторно использовать `InputComponent` отдельно от `EnhancedComponent`. Важнее то, что если мы захотим обернуть `EnhancedComponent` в другой HOC, который *тоже* меняет `componentDidUpdate`, то мы сотрём функциональность заданную первым HOC! Более того, `EnhancedComponent` не работает с функциональными компонентами, потому что у них отсутствуют методы жизненного цикла.

Мутирующие HOC являются хрупкой абстракцией, они конфликтуют с другими HOC, мы не сможем просто применять их без того, чтобы знать что именно они меняют.

Вместо мутации, компоненты высшего порядка должны применять композицию, оборачивая компонент в контейнер:

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Текущие пропсы: ', this.props);
      console.log('Предыдущие пропсы: ', prevProps);
    }
    render() {
      // Оборачиваем компонент в контейнер без мутаций. Супер!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

Этот HOC обладает такой же функциональностью, как и предыдущий, но не создаёт конфликтов с другими HOC и работает как с функциональными, так и с классовыми компонентами. Более того, HOC реализован с помощью чистой функции, поэтому его можно совмещать с другими HOC, или даже самого с собой.

Возможно, вы уже заметили сходство между HOC и **компонентами-контейнерами**. Напомним, что при помощи контейнеров мы обычно разделяем общую функциональность от частной. Например, в контейнере мы будем управлять внутренним состоянием или подпиской на внешние ресурсы, и через пропсы передавать данные в компоненты, ответственные за рендер UI. При реализации HOC мы тоже используем контейнеры. Можно сказать что HOC -- это инструмент для параметризированного создания контейнеров.

## Соглашение: передавайте посторонние пропсы оборачиваемому компоненту {#convention-pass-unrelated-props-through-to-the-wrapped-component}

HOC добавляют компонентам функциональность, но они не должны менять их оригинальное предназначение. Ожидается, что интерфейс компонента, который вы возвращаете из HOC, будет похож на интерфейс оборачиваемого компонента.

Пропсы, которые напрямую не связаны с функциональностью HOC, должны передаваться без изменений оборачиваемому компоненту. Рендер-метод большинства HOC похож на следующий:

```js
render() {
  // Отфильтруйте пропсы применимые только к этому HOC и которые не нужно передавать дальше
  const { extraProp, ...passThroughProps } = this.props;

  // Добавьте новые пропсы в оборачиваемый компонент. Обычно мы передаём значения состояния или методы экземпляра
  const injectedProp = someStateOrInstanceMethod;

  // Передайте пропсы в оборачиваемый компонент
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

Такое соглашение помогает создавать гибкие повторно используемые компоненты.

## Соглашение: Максимизируем композитивность {#convention-maximizing-composability}

Не все HOC выглядят одинаково. Некоторые принимают всего лишь один аргумент -- оборачиваемый компонент:

```js
const NavbarWithRouter = withRouter(Navbar);
```

Обычно HOC принимают несколько аргументов. В данном примере из Relay, мы используем объект конфигурации с описанием данных для компонента:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

Самый распространённый способ вызова HOC выглядит так:

```js
// `connect` из React Redux
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*Удивлены?* Давайте разберём эту строку по частям.

```js
// Вызов функции connect возвращает другую функцию
const enhance = connect(commentListSelector, commentListActions);

// Эта функция и есть HOC. Она возвращает компонент, подключённый к хранилищу Redux
const ConnectedComment = enhance(CommentList);
```
Другими словами, `connect` -- это функция высшего порядка, которая возвращает компонент высшего порядка!

Такая форма может показаться запутанной и ненужной, но есть и преимущества. Вызов `connect` возвращает HOC с подписью `Component => Component`. Функции с одинаковым типом результата и единственного аргумента легко совмещаются в композиции.

```js
// Вместо этого...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... вы можете воспользоваться вспомогательной совмещающей функцией
// compose(f, g, h) идентичен (...args) => f(g(h(...args)))
const enhance = compose(
  // Оба параметра являются HOC и принимают один единственный аргумент
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(Поэтому мы можем использовать `connect` и другие расширяющие функциональность HOC в качестве экспериментальных JavaScript-декораторов.)

Вы можете найти вспомогательную функцию `compose` во многих сторонних библиотеках, включая lodash (под названием [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose/), и [Ramda](https://ramdajs.com/docs/#compose).

## Соглашение: добавьте отображаемое имя для лёгкой отладки {#convention-wrap-the-display-name-for-easy-debugging}

Созданные HOC компоненты-контейнеры отображаются в консоли [инструментов разработки React](https://github.com/facebook/react/tree/main/packages/react-devtools) наряду с другими компонентами. Для более лёгкой отладки вы можете задать имя, которое подскажет, что определённый компонент был создан с помощью HOC.

Самый распространённый способ -- это обернуть имя оборачиваемого компонента. Например, если вы назвали компонент высшего порядка `withSubscription`, а имя оборачиваемого компонента было `CommentList`, то отображаемое имя будет `WithSubscription(CommentList)`:

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

## Предостережения {#caveats}

Вы можете столкнуться с неочевидными проблемами, когда работаете с компонентами высшего порядка.

### Не используйте HOC внутри рендер-метода {#dont-use-hocs-inside-the-render-method}

Алгоритм сравнения React (известный как [согласование или reconciliation](/docs/reconciliation.html)) использует тождественность компонентов чтобы определить нужно ли обновить существующее поддерево, или убрать и монтировать вместо него новое. Если компонент, полученный из `render`, идентичен (`===`) компоненту из предыдущего рендера, то React рекурсивно продолжит сравнивать поддерево. Если компоненты не равны, React полностью удалит и заменит старое поддерево.

Обычно нас это не беспокоит. Однако, важно учитывать что мы не можем применять компоненты высшего порядка внутри рендер-метода компонента:

```js
render() {
  // Мы создаём новую версию EnhancedComponent при каждом рендере
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // Мы каждый раз размонтируем и монтируем целиком всё поддерево!
  return <EnhancedComponent />;
}
```

Проблема не только в производительности. Повторное монтирование компонента обнуляет его состояние, а также состояние его дочерних компонентов.

Не применяйте HOC в определении другого компонента. Сначала нужно отдельно получить компонент из HOC, и только потом использовать его. Таким образом React будет сравнивать один и тот же компонент при повторном рендере.

При необходимости (в редких случаях) можно динамически применять HOC в методах жизненного цикла или конструкторе компонента.

### Копируйте статические методы {#static-methods-must-be-copied-over}

Иногда бывает полезно определить статические методы компонента. Например, статический метод `getFragment` библиотеки Relay позволяет составить композицию из фрагментов данных GraphQL.

Когда мы применяем HOC, то заворачиваем оригинальный компонент в контейнер. Поэтому у нового компонента не будет статических методов оригинального компонента.

```js
// Определим статический метод
WrappedComponent.staticMethod = function() {/*...*/}
// Теперь применим HOC
const EnhancedComponent = enhance(WrappedComponent);

// У расширенного компонента нет статических методов
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

Скопируйте недостающие методы в контейнер:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Мы должны точно знать какие методы копировать :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

К сожалению, вы должны точно знать какие методы копировать. Вы можете воспользоваться [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics), чтобы автоматически скопировать не связанные с React статические методы:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Другое возможное решение -- экспортировать статические методы отдельно от компонента.

```js
// Вместо...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...отдельно экспортируйте метод...
export { someFunction };

// ...в модуле-потребителе мы можем использовать оба экспорта
import MyComponent, { someFunction } from './MyComponent.js';
```

### Рефы не передаются {#refs-arent-passed-through}

По соглашению компоненты высшего порядка передают оборачиваемому компоненту все пропсы, кроме рефов. `ref` на самом деле не проп, как, например, `key`, и поэтому иначе обрабатывается React. Реф элемента, созданного компонентом из HOC, будет указывать на экземпляр ближайшего в иерархии контейнера, а не на оборачиваемый компонент.

Вы можете решить эту проблему с помощью API-метода `React.forwardRef` (добавлен в React 16.3). [Узнать подробнее в главе Перенаправление рефов](/docs/forwarding-refs.html).
