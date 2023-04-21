---
id: uncontrolled-components
title: Неуправляемые компоненты
permalink: docs/uncontrolled-components.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [`<input>`](https://react.dev/reference/react-dom/components/input)
> - [`<select>`](https://react.dev/reference/react-dom/components/select)
> - [`<textarea>`](https://react.dev/reference/react-dom/components/textarea)

</div>

В большинстве случаев при работе с формами мы рекомендуем использовать [управляемые компоненты](/docs/forms.html#controlled-components). В управляемом компоненте, данные формы обрабатываются React-компонентом. В качестве альтернативы можно использовать неуправляемые компоненты. Они хранят данные формы прямо в DOM.

Вместо того, чтобы писать обработчик события для каждого обновления состояния, вы можете использовать неуправляемый компонент и читать значения из DOM через [реф](/docs/refs-and-the-dom.html).

Вот так, к примеру, обработчик неуправляемого компонента может получить имя от элемента `input`:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('Отправленное имя: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Имя:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Отправить" />
      </form>
    );
  }
}
```

[**Посмотреть на CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Неуправляемые компоненты опираются на DOM в качестве источника данных и могут быть удобны при интеграции React с кодом, не связанным с React. Количество кода может уменьшиться, правда, за счёт потери в его чистоте. Поэтому в обычных ситуациях мы рекомендуем использовать управляемые компоненты.

Если всё ещё остаётся неясным, какой тип компонента лучше использовать в конкретной ситуации, то, возможно, [статья про сравнение управляемых и неуправляемых полей ввода](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) окажется полезной.

### Значения по умолчанию {#default-values}

На этапе рендеринга атрибут `value` полей ввода переопределяет значение в DOM. С неуправляемым компонентом зачастую нужно, чтобы React определил первоначальное значение, но впоследствии ничего не делал с ним. В этом случае необходимо определить атрибут `defaultValue` вместо `value`. Изменение значения атрибута `defaultValue` после монтирования компонента не обновит значение в DOM.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Имя:
        <input
          defaultValue="Боб"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Отправить" />
    </form>
  );
}
```

Аналогично, `<input type="checkbox">` и `<input type="radio">` используют `defaultChecked`, а `<select>` и `<textarea>` — `defaultValue`.

## Тег поля загрузки файла {#the-file-input-tag}

HTML-тег `<input type="file">` позволяет пользователю выбрать один или несколько файлов из дискового устройства, чтобы загрузить их на сервер, либо управлять ими с помощью JavaScript через [File API](https://developer.mozilla.org/ru/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

В React `<input type="file">` всегда является неуправляемым компонентом, потому что его значение может быть установлено только пользователем, а не программным путём.

Для взаимодействия с файлами следует использовать File API. В следующем примере показано, как создать [реф на DOM-узел](/docs/refs-and-the-dom.html), чтобы затем получить доступ к файлам в обработчике отправки формы:

`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

