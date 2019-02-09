---
id: uncontrolled-components
title: Неконтролируемые компоненты
permalink: docs/uncontrolled-components.html
---

В большинстве случаев мы рекомендуем использовать [контролируемые компоненты]((/docs/forms.html)) для работы с формами.
В контролируемом компоненте, данные формы обрабатываются React-компонентом.
Альтернативой являются неконтролируемые компоненты, где данные форм обрабатываются через DOM.

Вместо того, чтобы писать обработчик события для каждого обновления состояния, вы можете использовать неконтролируемый компонент и [ref](/docs/refs-and-the-dom.html) для получения значений из DOM.

Вот так, к примеру, можно получить имя в обработчике неконтролируемого компонента:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Такие компоненты хранят данные в DOM и их проще интегрировать в не-React приложение. Этот код можно сократить если пожертвовать стилистикой. В противном случае лучше использовать контролируемые компоненты.

Если всё ещё остаётся непонятным какой тип компонента Вам необходимо использовать в конкретной ситуации, то, возможно, [статья о контролируемых против некотролируемых input'ах](http://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) может показаться Вам полезной.

### Значения по умолчанию {#default-values}

На этапе прорисовки жизненного цикла в React, атрибут `value` на элементах формы будет переопределять значение в DOM. С неконтролируемым компонентом Вам часто необходимо, чтобы React определял первоначальное значение, но оставлял неконтролируемыми последующие обновления. В этом случае, Вам необходимо определить атрибут `defaultValue` вместо `value`.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

Аналогично, `<input type="checkbox">` и `<input type="radio">` используют `defaultChecked`, а `<select>` и `<textarea>` - `defaultValue`.

## The file input Tag {#the-file-input-tag}

In HTML, an `<input type="file">` lets the user choose one or more files from their device storage to be uploaded to a server or manipulated by JavaScript via the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

В React `<input type="file">` всегда является неконтролируемым компонентом, потому что его значение может быть установлено только пользователем, а не программно.

Вы должны использовать File API для взаимодействия с файлами. В следующем примере показано, как создать [ссылку на узел DOM](/docs/refs-and-the-dom.html) для доступа к файлам в обработчике отправки:

`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

