---
id: refs-and-the-dom
title: Рефы и DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Рефы дают возможность получить доступ к DOM-узлам или React-элементам, созданным в методе `render`.

В обычном потоке данных React родительские компоненты могут взаимодействовать с дочерними только через [пропсы](/docs/components-and-props.html). Чтобы модифицировать потомка, вы должны заново отрендерить его с новыми пропсами. Тем не менее, могут возникать ситуации, когда вам требуется императивно изменить дочерний элемент вопреки обычному потоку данных. Подлежащий изменениям дочерний элемент может быть как React компонентом, так и DOM элементом. В обоих случаях, React предоставляет спасательный круг (обходное решение).

### Когда Использовать Рефы {#when-to-use-refs}

Cитуации, в которых использования рефов является оправданным:

* Управление фокусом, выделение текста или воспроизведение медиа.
* Императивный вызов анимаций.
* Интеграция со сторонними DOM библиотеками.

Избегайте использования рефов в ситуациях, когда задачу можно решить декларативным методом.

Например, вместо того чтобы предоставлять `open()` и `close()` методы для компонента `Dialog`, передавайте ему проп `isOpen`.

### Не Злоупотребляйте Рефами {#dont-overuse-refs}

Возможно, с первого взгляда вам показалось, что рефы применяются, когда нужно, чтобы в вашем приложении “что-то произошло”. Если у вас сложилось такое впечатление, сделайте паузу и задумайтесь, где должно поддерживаться состояние в компонентной иерархии. Зачастую является очевидным, что правильным местом для “хранения” состояния является верхний уровень в иерархии. Подробнее об этом в главе [Подъём состояния](/docs/lifting-state-up.html).

> Заметка
>
> Приведённые ниже примеры были обновлены с использованием `React.createRef()` API представленном в React 16.3. Если вы используете более старую версию React, мы рекомендуем использовать [колбэк рефы](#callback-refs).

### Создание Рефов {#creating-refs}

Рефы создаются с помощью `React.createRef()` и прикрепляются к React элементам через `ref` атрибут. Обычно рефы присваиваются свойству экземпляра класса в конструкторе, чтобы на них можно ссылаться из любой части компонента.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Доступ к Рефам {#accessing-refs}

Когда реф передается элементу в методе `render`, ссылка на данный узел становится доступной через атрибут `current` в рефе.

```javascript
const node = this.myRef.current;
```

Значение рефа отличается в зависимости от типа узла:

- Когда `ref` атрибут используется с HTML элементом, реф созданный в конструкторе с помощью `React.createRef()` получает в свойстве `current` соответствующий DOM элемент.
- Когда `ref` атрибут используется с классовым компонентом, объект рефа в свойстве `current` получает примонтированную сущность компонента.
- **Нельзя использовать `ref` атрибут с функциональными компонентами**, потому что у них нет сущностей.

Представленные ниже примеры демонстрируют отличия в зависимости от типа узла.

#### Добавление Рефа к DOM Элементу {#adding-a-ref-to-a-dom-element}

В представленном ниже примере `реф` используется для хранения ссылки на DOM элемент.

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // создаем реф для хранения значения DOM элемента поля ввода текста
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Задаем фокус на текстовое поле с помощью чистого DOM API
    // Примечание: обращаемся к "current", чтобы получить DOM узел
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Фокус на текстовом поле"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React поместит DOM элемент в свойство `current` при монтировании компонента и вернет обратно значение `null` при размонтировании. Обновление свойства `ref` происходит перед вызовом методов `componentDidMount` или `componentDidUpdate`.

#### Добавление Рефа к Классовому Компоненту {#adding-a-ref-to-a-class-component}

Для того чтобы произвести имитацию клика по `CustomTextInput` из прошлого примера сразу же после монтирования, можно использовать реф, чтобы получить доступ к пользовательскому компоненту для ввода текста и явно вызвать его метод `focusTextInput`:

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Обратите внимание, что это сработает только в том случае, если `CustomTextInput` объявлен как классовый компонент:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Рефы и Функциональные Компоненты {#refs-and-function-components}

**Нельзя использовать `ref` атрибут с функциональными компонентами**, потому что для них не создаются сущности:

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // Данный код *не будет* работать!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Если вам нужен реф на функциональный компонент, превратите его в классовый, точно так же, как если бы вам нужно было использовать state или методы жизненного цикла компонента.

Тем не менее, можно **использовать `ref` атрибут внутри функционального компонента** при условии, что он ссылается на DOM элемент или классовый компонент:

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // переменная textInput должна быть объявлена на верхнем уровне, чтобы реф мог иметь к ней доступ
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Фокус на поле для ввода текста"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Exposing DOM Refs to Parent Components {#exposing-dom-refs-to-parent-components}

In rare cases, you might want to have access to a child's DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

While you could [add a ref to the child component](#adding-a-ref-to-a-class-component), this is not an ideal solution, as you would only get a component instance rather than a DOM node. Additionally, this wouldn't work with function components.

If you use React 16.3 or higher, we recommend to use [ref forwarding](/docs/forwarding-refs.html) for these cases. **Ref forwarding lets components opt into exposing any child component's ref as their own**. You can find a detailed example of how to expose a child's DOM node to a parent component [in the ref forwarding documentation](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

If you use React 16.2 or lower, or if you need more flexibility than provided by ref forwarding, you can use [this alternative approach](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) and explicitly pass a ref as a differently named prop.

When possible, we advise against exposing DOM nodes, but it can be a useful escape hatch. Note that this approach requires you to add some code to the child component. If you have absolutely no control over the child component implementation, your last option is to use [`findDOMNode()`](/docs/react-dom.html#finddomnode), but it is discouraged and deprecated in [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Callback Refs {#callback-refs}

React also supports another way to set refs called "callback refs", which gives more fine-grain control over when refs are set and unset.

Instead of passing a `ref` attribute created by `createRef()`, you pass a function. The function receives the React component instance or HTML DOM element as its argument, which can be stored and accessed elsewhere. 

The example below implements a common pattern: using the `ref` callback to store a reference to a DOM node in an instance property.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts. Refs are guaranteed to be up-to-date before `componentDidMount` or `componentDidUpdate` fires.

You can pass callback refs between components like you can with object refs that were created with `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

In the example above, `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

### Legacy API: String Refs {#legacy-api-string-refs}

If you worked with React before, you might be familiar with an older API where the `ref` attribute is a string, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against it because string refs have [some issues](https://github.com/facebook/react/pull/8333#issuecomment-271648615), are considered legacy, and **are likely to be removed in one of the future releases**. 

> Note
>
> If you're currently using `this.refs.textInput` to access refs, we recommend using either the [callback pattern](#callback-refs) or the [`createRef` API](#creating-refs) instead.

### Caveats with callback refs {#caveats-with-callback-refs}

If the `ref` callback is defined as an inline function, it will get called twice during updates, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the `ref` callback as a bound method on the class, but note that it shouldn't matter in most cases.
