---
id: render-props
title: Рендер-пропсы
permalink: docs/render-props.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
>
> Render props are used in modern React, but aren't very common.  
> For many cases, they have been replaced by [custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).

</div>

Термин [«рендер-проп»](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) относится к возможности компонентов React разделять код между собой с помощью пропа, значение которого является функцией.

Компонент с рендер-пропом берёт функцию, которая возвращает React-элемент, и вызывает её вместо реализации собственного рендера.

```jsx
<DataProvider render={data => (
  <h1>Привет, {data.target}</h1>
)}/>
```

Такой подход, в частности, применяется в библиотеках [React Router](https://reacttraining.com/react-router/web/api/Route/render-func), [Downshift](https://github.com/paypal/downshift) и [Formik](https://github.com/jaredpalmer/formik).

В этой статье мы покажем, чем полезны и как писать рендер-пропсы.

## Использование рендер-пропа для сквозных задач {#use-render-props-for-cross-cutting-concerns}

Компоненты -- это основа повторного использования кода в React. Однако бывает неочевидно, как сделать, чтобы одни компоненты разделяли своё инкапсулированное состояние или поведение с другими компонентами, заинтересованными в таком же состоянии или поведении.

Например, следующий компонент отслеживает положение мыши в приложении:

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Перемещайте курсор мыши!</h1>
        <p>Текущее положение курсора мыши: ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

Когда курсор перемещается по экрану, компонент отображает координаты (x, y) внутри `<p>`.

Возникает вопрос: как мы можем повторно использовать это поведение в другом компоненте? То есть если другому компоненту необходимо знать о позиции курсора, можем ли мы как-то инкапсулировать это поведение, чтобы затем легко использовать его в этом компоненте?

Поскольку компоненты являются основой повторного использования кода в React, давайте применим небольшой рефакторинг. Пусть наш код полагается на компонент `<Mouse>`, инкапсулирующий поведение, которое мы хотим применять в разных местах.

```js
// Компонент <Mouse> инкапсулирует поведение, которое нам необходимо...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ...но как можно отрендерить что-то, кроме <p>? */}
        <p>Текущее положение курсора мыши: ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Перемещайте курсор мыши!</h1>
        <Mouse />
      </>
    );
  }
}
```

Теперь компонент `<Mouse>` инкапсулирует всё поведение, связанное с обработкой событий `mousemove` и хранением позиций курсора (x, y), но пока не обеспечивает повторного использования.

Например, допустим у нас есть компонент `<Cat>`, который рендерит изображение кошки, преследующей мышь по экрану. Мы можем использовать проп `<Cat mouse={{ x, y }}>`, чтобы сообщить компоненту координаты мыши, и он знал, где расположить изображение на экране.

Для начала вы можете отрендерить `<Cat>` *внутри метода `render` компонента `<Mouse>`* следующим образом:

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          Мы могли бы просто поменять <p> на <Cat>... но тогда
          нам нужно создать отдельный компонент <MouseWithSomethingElse>
          каждый раз, когда он нужен нам, поэтому <MouseWithCat>
          пока что нельзя повторно использовать.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Перемещайте курсор мыши!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Этот подход будет работать для конкретного случая, но мы не достигли основной цели — инкапсулировать поведение с возможностью повторного использования. Теперь, каждый раз когда мы хотим получить позицию мыши для разных случаев, нам требуется создавать новый компонент (т. е. другой экземпляр `<MouseWithCat>`), который рендерит что-то специально для этого случая.

Вот здесь рендер-проп нам и понадобится: вместо явного указания `<Cat>` внутри `<Mouse>` компонента, и трудозатратных изменений на выводе рендера, мы предоставляем `<Mouse>` функцию в качестве пропа, с которой мы используем динамическое определение того, что нужно передавать в рендер-проп.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          Вместо статического представления того, что рендерит <Mouse>,
          используем рендер-проп для динамического определения, что надо отрендерить.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Перемещайте курсор мыши!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Теперь, вместо того, чтобы фактически клонировать компонент `<Mouse>` и жёстко указывать что-нибудь ещё в методе `render`, для решения специфичного случая, мы предоставляем рендер-проп компоненту `<Mouse>`, который может динамически определить что рендерить.

Иными словами, **рендер-проп – функция, которая сообщает компоненту что необходимо рендерить.**

Эта техника позволяет сделать легко портируемым поведение, которое мы хотим повторно использовать. Для этого следует отрендерить компонент `<Mouse>` с помощью рендер-пропа, который сообщит, где отрендерить курсор с текущим положением (x, y).

Один интересный момент касательно рендер-пропсов заключается в том, что вы можете реализовать большинство [компонентов высшего порядка](/docs/higher-order-components.html) (HOC), используя обычный компонент вместе с рендер-пропом. Например, если для вас предпочтительней HOC `withMouse` вместо компонента `<Mouse>`, вы можете создать обычный компонент `<Mouse>` вместе с рендер-пропом:

```js
// Если вам действительно необходим HOC по некоторым причинам, вы можете просто
// создать обычный компонент с рендер-пропом!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

Таким образом, рендер-пропы позволяют реализовать любой из описанных выше паттернов.

## Использование пропсов, отличных от `render` (как название передаваемого свойства) {#using-props-other-than-render}

Важно запомнить, что из названия паттерна «рендер-проп» вовсе не следует, что для его использования *вы должны обязательно называть проп `render`*. На самом деле, [*любой* проп, который используется компонентом и является функцией рендеринга, технически является и «рендер-пропом»](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Несмотря на то, что в вышеприведённых примерах мы используем `render`, мы можем также легко использовать проп `children`!

```js
<Mouse children={mouse => (
  <p>Текущее положение курсора мыши: {mouse.x}, {mouse.y}</p>
)}/>
```

И запомните, проп `children` не обязательно именовать в списке «атрибутов» вашего JSX-элемента. Вместо этого, вы можете поместить его прямо *внутрь* элемента!

```js
<Mouse>
  {mouse => (
    <p>Текущее положение курсора мыши: {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Эту технику можно увидеть в действии в API библиотеки [react-motion](https://github.com/chenglou/react-motion).


Поскольку этот метод не совсем обычен, вы, вероятно, захотите явно указать, что `children` должен быть функцией в вашем `propTypes` при разработке такого API.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Предостережения {#caveats}

### Будьте осторожны при использовании рендер-проп вместе с React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Использование рендер-пропа может свести на нет преимущество, которое даёт [`React.PureComponent`](/docs/react-api.html#reactpurecomponent), если вы создаёте функцию внутри метода `render`. Это связано с тем, что поверхностное сравнение пропсов всегда будет возвращать `false` для новых пропсов и каждый `render` будет генерировать новое значение для рендер-пропа.

Например, в продолжение нашего `<Mouse>` компонента упомянутого выше, если `Mouse` наследуется от `React.PureComponent` вместо `React.Component`, наш пример будет выглядеть следующим образом:

```js
class Mouse extends React.PureComponent {
  // Та же реализация, что и упомянутая выше...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Перемещайте курсор мыши!</h1>

        {/*
          Это плохо! Значение рендер-пропа будет
          разным при каждом рендере.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

В этом примере, при каждом рендере `<MouseTracker>` генерируется новая функция в качестве значения пропа `<Mouse render>`. Это сводит на нет эффекты `React.PureComponent`, от которого наследует `<Mouse>`!

Чтобы решить эту проблему, вы можете определить проп как метод экземпляра, например так:

```js
class MouseTracker extends React.Component {
  // Определяем как метод экземпляра, `this.renderTheCat` всегда
  // ссылается на *ту же самую* функцию, когда мы используем её в рендере
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Перемещайте курсор мыши!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

В случаях, когда вы не можете определить проп статически (например, вам необходимо замкнуть пропсы и/или состояние компонента), `<Mouse>` нужно наследовать от `React.Component`.
