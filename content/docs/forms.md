---
id: forms
title: Формы
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

<<<<<<< HEAD
В React HTML-элементы формы ведут себя немного иначе по сравнению с DOM-элементами, так как у элементов формы изначально есть внутреннее состояние. К примеру, в эту HTML-форму можно ввести имя:
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [`<input>`](https://beta.reactjs.org/reference/react-dom/components/input)
> - [`<select>`](https://beta.reactjs.org/reference/react-dom/components/select)
> - [`<textarea>`](https://beta.reactjs.org/reference/react-dom/components/textarea)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

HTML form elements work a bit differently from other DOM elements in React, because form elements naturally keep some internal state. For example, this form in plain HTML accepts a single name:
>>>>>>> 47adefd30c46f486428d8231a68e639d62f02c9e

```html
<form>
  <label>
    Имя:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Отправить" />
</form>
```

По умолчанию браузер переходит на другую страницу при отправке HTML-форм, в том числе и этой. Если вас это устраивает, то не надо ничего менять, в React формы работают как обычно. Однако чаще всего форму удобнее обрабатывать с помощью JavaScript-функции, у которой есть доступ к введённым данным. Стандартный способ реализации такого поведения называется «управляемые компоненты».

## Управляемые компоненты {#controlled-components}

В HTML элементы формы, такие как `<input>`, `<textarea>` и `<select>`, обычно сами управляют своим состоянием и обновляют его когда пользователь вводит данные. В React мутабельное состояние обычно содержится в свойстве компонентов `state` и обновляется только через вызов [`setState()`](/docs/react-component.html#setstate)

Мы можем скомбинировать оба подхода и сделать состояние React-компонента "единственным источником правды". Тогда React-компонент будет рендерить форму и контролировать её поведение в ответ на пользовательский ввод. Значение элемента формы input в этом случае будет контролировать React, а сам элемент будет называться «управляемый компонент».

Допустим, мы хотим, чтобы предыдущий пример показал в модальном окне введённое имя, когда мы отправляем форму. Тогда можно написать форму в виде управляемого компонента:

```javascript{4,10-12,21,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Отправленное имя: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Имя:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Отправить" />
      </form>
    );
  }
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

Мы установили атрибут `value` для поля ввода и теперь в нём всегда будет отображаться значение `this.state.value`. Состояние React-компонента стало «источником истины». А так как каждое нажатие клавиши вызывает `handleChange`, который обновляет состояние React-компонента, значение в поле будет обновляться по мере того, как пользователь печатает.

В управляемом компоненте значение поля ввода всегда определяется состоянием React. Хотя это означает, что вы должны написать немного больше кода, теперь вы сможете передать значение и другим UI-элементам или сбросить его с других обработчиков событий.

## Тег textarea {#the-textarea-tag}

HTML-элемент `<textarea>` в качестве текста отображает дочерний элемент:

```html
<textarea>
  Привет! Тут просто немного текста внутри тега textarea
</textarea>
```

В React `<textarea>` использует атрибут `value`. Таким образом, форму с `<textarea>` можно написать почти тем же способом, что и форму с однострочным `<input>`: 

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Будьте любезны, напишите сочинение о вашем любимом DOM-элементе.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Сочинение отправлено: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Сочинение:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Отправить" />
      </form>
    );
  }
}
```

Обратите внимание, что мы инициализировали `this.state.value` в конструкторе, так что в текстовой области изначально есть текст.

## Тег select {#the-select-tag}

В HTML `<select>` создаёт выпадающий список. HTML-код в этом примере создаёт выпадающий список вкусов:

```html
<select>
  <option value="grapefruit">Грейпфрут</option>
  <option value="lime">Лайм</option>
  <option selected value="coconut">Кокос</option>
  <option value="mango">Манго</option>
</select>
```

Пункт списка «Кокос» выбран по умолчанию из-за установленного атрибута `selected`. React вместо этого атрибута использует `value` в корневом теге `select`. В управляемом компоненте так удобнее, потому что обновлять значение нужно только в одном месте (`state`). Пример:

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Ваш любимый вкус: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Выберите ваш любимый вкус:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Грейпфрут</option>
            <option value="lime">Лайм</option>
            <option value="coconut">Кокос</option>
            <option value="mango">Манго</option>
          </select>
        </label>
        <input type="submit" value="Отправить" />
      </form>
    );
  }
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Подводя итог, `<input type="text">`, `<textarea>`, и `<select>` работают очень похоже. Все они принимают атрибут `value`, который можно использовать, чтобы реализовать управляемый компонент.

> Примечание
>
> В атрибут `value` можно передать массив, что позволит выбрать несколько опций в теге `select`:
>
>```js
><select multiple={true} value={['Б', 'В']}>
>```

## Загрузка файла {#the-file-input-tag}

В HTML `<input type="file">` позволяет пользователю выбрать один или несколько файлов для загрузки с устройства на сервер или управлять им через JavaScript с помощью [File API](https://developer.mozilla.org/ru/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Так как значение такого элемента доступно только для чтения, это **неуправляемый** React-компонент. Мы расскажем про этот и другие неуправляемые компоненты [далее в документации](/docs/uncontrolled-components.html#the-file-input-tag).

## Обработка нескольких элементов input {#handling-multiple-inputs}

Если вам нужны несколько управляемых элементов `input`, вы можете назначить каждому из них атрибут `name`, что позволит функции-обработчику решать, что делать, основываясь на значении `event.target.name`.

Пример:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Пойдут:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Количество гостей:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Обратите внимание, что мы используем [вычисляемые имена свойств](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Object_initializer#%D0%92%D1%8B%D1%87%D0%B8%D1%81%D0%BB%D1%8F%D0%B5%D0%BC%D1%8B%D0%B5_%D0%B8%D0%BC%D0%B5%D0%BD%D0%B0_%D1%81%D0%B2%D0%BE%D0%B9%D1%81%D1%82%D0%B2), чтобы обновить значение в `state` через ключ, который соответствует атрибуту name элемента input:

```js{2}
this.setState({
  [name]: value
});
```

Идентичный ES5-код:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Кроме того, `setState()` автоматически производит [слияние части состояния с текущим состоянием](/docs/state-and-lifecycle.html#state-updates-are-merged), то есть нам нужно передать в него только ту часть `state`, которую хотим изменить.

## Значение null управляемого компонента {#controlled-input-null-value}

Если установить [управляемому компоненту](/docs/forms.html#controlled-components) проп `value`, то пользователь не сможет изменить его значение без вашего желания. Если вы установили `value`, а поле ввода по-прежнему можно редактировать, то, возможно, вы случайно задали `value`, равный `undefined` или `null`.

Код ниже это демонстрирует. (Изначально заблокированный `input` становится редактируемым после небольшой задержки.)

```javascript
ReactDOM.createRoot(mountNode).render(<input value="Привет" />);

setTimeout(function() {
  ReactDOM.createRoot(mountNode).render(<input value={null} />);
}, 1000);
```

## Альтернативы управляемым компонентам {#alternatives-to-controlled-components}

Использование управляемых компонентов иногда может быть утомительным. Приходится писать обработчик события для каждого варианта изменения ваших данных и проводить всё состояние формы через компонент React. Это может особенно раздражать, если вы переносите существующую кодовую базу в React, или когда работаете над интеграцией React-приложения с другой библиотекой. В такой ситуации могут пригодиться [неуправляемые компоненты](/docs/uncontrolled-components.html) — альтернативная техника реализации ввода данных в форму.

## Полноценные решения {#fully-fledged-solutions}

Если вы ищете полноценное решение, которое может валидировать ввод, запомнить посещённые поля формы и обработать её отправку, присмотритесь к [Formik](https://jaredpalmer.com/formik). Эта библиотека построена на принципах управляемых компонентов и управления состоянием, так что не пренебрегайте их изучением.
