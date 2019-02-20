---
id: forms
title: Forms
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

В React, HTML элементы формы работают несколько иначе, чем другие DOM элементы, так как естественным образом хранят свое внутреннее состояние. К примеру, в HTML форму ниже можно ввести имя:

```html
<form>
  <label>
    Имя:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Отправить" />
</form>
```

При отправке пользователем, поведением по умолчанию для такой HTML формы будет переход на новую страницу. Точно так же она будет вести себя и в React. Однако, чаще всего удобно обрабатывать отправку формы через JavaScript функцию, которая имеет доступ к введённым в форму данным. Для этого можно воспользоваться стандартным способом под названием "управляемые компоненты".

## Управляемые компоненты {#controlled-components}

Такие HTML элементы формы, как `<input>`, `<textarea>`, and `<select>` обычно сами управляют своим состоянием и обновляют его когда пользователь вводит данные. В React, мутабельное состояние обычно содержится в свойстве компонентов `state` и обновляется только через вызов[`setState()`](/docs/react-component.html#setstate)

Мы можем скомбинировать оба подхода и сделать состояние React компонента "единственным источником правды". Тогда React компонент будет рендерить форму и управлять её поведением в ответ на пользовательский ввод. Значением элемента формы input в этом случае будет управлять React, а сам элемент будет называться "управляемый компонент".

Допустим, требуется, чтобы предыдущий пример при отправке выводил в лог имя. Тогда можно написать форму в виде управляемого компонента:

```javascript{4,10-12,24}
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

 На элементе формы input установлен аттрибут `value`, а его отображаемое значение всегда будет `this.state.value`, что делает состояние React компонента "источником правды". А, так как `handleChange` вызывается на каждое нажатие клавиши и обновляет состояние React компонента, отображаемое значение будет обновляться по мере того как пользователь печатает.

В управляемом компоненте каждая мутация состояния будет иметь связанную с ней функцию—обработчик. Это делает валидацию или изменение пользовательского ввода простой задачей. Например, если требуется, чтобы имя обязательно состояло из заглавных букв, то можно написать `handleChange` в таком виде:

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## Тэг textarea {#the-textarea-tag}

В HTML, элемент `<textarea>` в качестве текста отображает дочерний элемент:

```html
<textarea>
  Доброго здоровья, тут просто немного текста внутри тега textarea
</textarea>
```

В React, `<textarea>` использует аттрибут `value`. Таким образом, форму с `<textarea>` можно написать почти тем же способом что и форму с однострочным `<input>`: 

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Будьте любезны, напишите сочинение о вашем любимом DOM элементе.'
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

Заметьте, что `this.state.value` инициализировано в конструкторе, так что текстовая область отображается уже с текстом. 

## Тэг select {#the-select-tag}

В HTML, `<select>` создаёт выпадающий список. В примере ниже HTML создаёт выпадающий список вкусов:

```html
<select>
  <option value="grapefruit">Грейпфрут</option>
  <option value="lime">Лайм</option>
  <option selected value="coconut">Кокос</option>
  <option value="mango">Манго</option>
</select>
```

Опция "Кокос" выбрана по умолчанию из за установленного атрибута `selected`. React вместо этого атрибута использует `value` в корневом теге `select`. Это удобно в управляемом компоненте потому что обновлять значение нужно только в одном месте (`state`). Пример:

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
> Вы можете передать массив внутрь атрибута `value`, что позволит выбрать несколько опций в теге `select`:
>
>```js
><select multiple={true} value={['Б', 'В']}>
>```

## Загрузка файла {#the-file-input-tag}
## The file input Tag {#the-file-input-tag}

В HTML, `<input type="file">` позволяет пользователю выбрать один или несколько файлов для загрузки с устройства на сервер или работать с ними на JavaScript с помощью [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications). 

```html
<input type="file" />
```

Так как значение такого элемента доступно только для чтения, это **неуправляемый** React компонент. Этот случай описан вместе с другими неуправляемыми компонентами [далее в документации](/docs/uncontrolled-components.html#the-file-input-tag).

## Обработка нескольких input {#handling-multiple-inputs}

Когда вы имеете дело с несколькими управляемыми элементами `input`, вы можете добавить каждому из них аттрибут `name`, что позволит функции—обработчику решать, что делать, основываясь на значении `event.target.name`.

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
          Пойду:
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

Обратите внимание, мы используем синтаксиса ES6 [вычисляемые имена](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names), чтобы обновить значение в `state` через ключ, который соответствует атрибуту name элемента input:

```js{2}
this.setState({
  [name]: value
});
```

Идентичный ES5 код:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Кроме того, `setState()` автоматически производит [слияние части состояния с текущим состоянием](/docs/state-and-lifecycle.html#state-updates-are-merged), то есть можно вызывать этот метод только для изменяемых в данный момент частей `state`.

## Значение null управляемого компонента {#controlled-input-null-value}

Передача пропа value [управляемому компоненту](/docs/forms.html#controlled-components) позволит вам не дать пользователю изменить значение input без вашего желания. Если значение `value` передано но input остается редактируемым, возможно, значение `value` случайно было установлено в `undefined` или `null`.

Код ниже это демонстрирует. (после небольшой задержки, сперва заблокированный для ввода input становится редактируемым.)

```javascript
ReactDOM.render(<input value="Привет" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Альтернативы управляемым компонентам {#alternatives-to-controlled-components}

Использование управляемых компонентов иногда может быть утомительным. Приходится писать обработчик события для каждого варианта изменения ваших данных и проводить всё состояние input через React компонент. Это может особенно раздражать если вы переносите существующую кодовую базу в React, или когда работаете над интеграцией React приложения с не—React библиотекой. В такой ситуации могут пригодиться [uncontrolled components](/docs/uncontrolled-components.html), альтернативная техника реализации ввода данных в форму.

## Полноценные решения {#fully-fledged-solutions}

При поиске полноценного решения, которое может валидировать ввод, запомнить посещённые поля формы и обработать ее отправку, [Formik](https://jaredpalmer.com/formik) будет одной из популярных опций. Как бы то ни было, эта библиотека построена на принципах управляемых компонентов и управления состоянием, так что не пренебрегайте их изучением.
