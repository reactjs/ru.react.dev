---
id: render-props
title: Рендер Пропсы
permalink: docs/render-props.html
---

Термин ["рендер пропс"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) это возможность делиться кодом между компонентами реакта где функция может выступить в качестве значения пропа

Компонент с рендер-пропсом берёт функцию, которую возвращает реакт элемент, и вызывает её вместо собственного рендера.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

Библиотеками, использующий такой подход, являются [React Router](https://reacttraining.com/react-router/web/api/Route/Route-render-methods) и [Downshift](https://github.com/paypal/downshift).

В этой статье мы покажем почему рендер-пропс полезен и как написать свой.

## Использование рендер-пропса для сквозных задач {#use-render-props-for-cross-cutting-concerns}

Компоненты это основа реиспользования кода в реакте, но не всегда очевидно как использовать совместно состояние или поведение, которые один компонент инкапсулирует в другие компоненты, которые нуждаются в этом же стейте.

Например, следующий компонент отслеживает положение мыши в веб-приложении:

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
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

Когда курсор перемещается по экрану, компонент отображает (x, y) координаты внутри `<p>`.

Теперь вопрос: Как мы можем повторно использовать поведение в другом компоненте? Другими словами, если другому компоненту необходимо знать о позиции курсора, сможем ли мы инкапсулировать это поведение, чтобы мы могли легко поделиться им с этим компонентом?

Поскольку компоненты являются основой реиспользования кода в реакте, давай попробуем немного отрефакторить код используя внутри `<Mouse>` который инкапсулирует поведение, которое мы сможем реиспользовать где угодно.

```js
// <Mouse> компонент инкапсулирует поведение, которое нам необходимо...
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
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/* ...но как мы можем отрендерить нечто большее чем <p>? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </div>
    );
  }
}
```

Теперь `<Mouse>` компонент инкапсулирует все поведения, связанные с прослушиванием событий `mousemove` и хранением позиций (x, y) курсора, правда пока без реиспользования.

Например, допустим у нас есть `<Cat>` компонент, который отображает изображение кошки, преследующей мышь по экрану. Мы можем использовать `<Cat mouse={{ x, y }}>` проп, чтобы сообщить компоненту координаты мыши, о том где расположить изображение на экране.

Для начала, вы можете отрендерить `<Cat>` внутри `<Mouse>` `render`а, похожее на это:

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
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Мы могли бы просто поменять <p> на <Cat> здесь ... но тогда
          нам нужно создать отдельный компонент <MouseWithSomethingElse>
          каждый раз когда он нужен нам, поэтому <MouseWithCat>
          пока что нельзя реиспользовать.
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
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Этот подход будет работать для конкретного кейса, но мы не достигли основной цели — инкапсулировать поведение с возможностью реиспользования. Теперь, каждый раз когда мы хотим получить позицию мыши для разных кейсов, мы создаем новый компонент (т.е. другой экземпляр `<MouseWithCat>`), который рендерит специально для этого кейса.

Вот здесь рендер-пропс нам и понадобится: Вместо хардкода `<Cat>` внутри `<Mouse>` компонента, и трудозатратных изменений на выводе рендера, мы предоставляем `<Mouse>` функцию в качестве пропа, с которой мы используем динамическое определение того, что нужно передавать в рендер-пропс.

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
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Вместо статического представления того, что отображает <Mouse>,
          используем `render` пропс для динамического определения визуализации.
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
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Теперь, вместо того, чтобы трудозатратно клонировать `<Mouse>` компонент и хардкодить что-нибудь еще в `render` методе, для решения индивидуального кейса, мы предоставляем `render` пропс этой `<Mouse>`, который может динамически определить что рендерить.

Более конкретно, **рендер-пропс это функция, которая даёт понять компоненту что необходимо рендерить.**

Эта техника позволяет делать максимально реиспользуемые поведения. Чтобы получить такое поведение, отрисуйте `<Mouse>` вместе с `render` пропсом, который сообщит ему где отрендерить курсор с текущим положением (x, y).

Один интересный момент касательно рендер-пропсов то, что вы можете реализовать большинство [higher-order components](/docs/higher-order-components.html) (HOC), используя обычный компонент вместе с рендер-пропсом. Например, если для вас предпочтительней `withMouse` HOC вместо `<Mouse>` компонента, вы можете просто создать один используемый обычный `<Mouse>` компонент вместе с рендер-пропсом:

```js
// Если вам действительно необходим HOC по некоторым причинам, вы можете просто
// создать один обычный компонент с рендер-пропсом!
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

Таким образом, использование рендер-пропса позволяет использовать любой паттерн.

## Использование пропов, отличных от `render` (как название передаваемого свойства) {#using-props-other-than-render}

Важно запомнить, что только потому, что этот паттерн называется "рендер-пропс", не означает, что при использования этого паттерна *у вас должен быть обязательно, проп с названием `render`*. По факту, [*любой* пропс, который использует компонент и он является функцией и в результате этого компонент знает что рендерить технически является "рендер пропсом"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Несмотря на то, что в вышеприведенных примерах мы используем `рендер`, мы можем также легко использовать `чилдрен` пропс!

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

И запомните, `чилдрен` проп не обязательно именовать в списке "атрибутов" вашего JSX элемента. Вместо этого, вы можете положить прямо *внутри* этого элемента!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Вы увидите, что эта техника используется в [react-motion](https://github.com/chenglou/react-motion) API.

Поскольку этот метод не совсем обычен, вы, вероятно, захотите явно указать, что `чилдрен` должен быть функцией в вашем `проптайпс` при разработке такого API.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Caveats {#caveats}

### Будьте осторожны при использовании рендер-пропс вместе с React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Использование рендер-пропса может свести на нет преимущество, которое дает [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) если вы создаете функцию внутри метода `render`. Это связано с тем, что неглубокое сравнение пропсов всегда будет возвращать `false` для новых свойств пропсов, и каждый `render` будет генерировать новое значение для рендер-пропса.

Например, в продолжении нашего `<Mouse>` компонента упомянутого выше, если `Mouse` наследуется от `React.PureComponent` вместо `React.Component`, наш пример будет выглядеть следующим образом:

```js
class Mouse extends React.PureComponent {
  // Та же реализация что и упомянутая выше...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          Это плохо! Значение `render` пропса будет
          разной на каждом рендере.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

В этом примере, каждый раз при рендере `<MouseTracker>`, это сгенерирует новую функцию в качестве значения `<Mouse render>` пропса, тем самым сводя на нет эффект `<Mouse>` наследующий `React.PureComponent` в первую очередь!

Чтобы обойти эту проблему, вы можете иногда определить проп как метод экземляра, вроде этого:

```js
class MouseTracker extends React.Component {
  // Определяем как метод экземпляра, `this.renderTheCat` всегда
  // ссылается на *такую* же функцию когда мы используем её в рендере
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

В случаях, когда вы не можете определить проп статически (например потому что вам необходимо закрыть остальные пропсы и/или стейты) `<Mouse>` должен наследоваться от `React.Component`.
