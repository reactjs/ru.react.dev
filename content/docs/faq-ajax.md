---
id: faq-ajax
title: AJAX и API, обращение к серверу
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Как выполнить AJAX-запрос к серверу? {#how-can-i-make-an-ajax-call}

Вы можете использовать встроенный в браузер метод [window.fetch](https://learn.javascript.ru/fetch) или любую AJAX-библиотеку, например [Axios](https://github.com/axios/axios) или [jQuery AJAX](https://api.jquery.com/jQuery.ajax/).

### Где в жизненном цикле компонента я могу сделать AJAX-запрос? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Вы можете сделать AJAX-запрос в [`componentDidMount`](/docs/react-component.html#mounting). Когда вы получите данные, вызовите `setState`, чтобы передать их компоненту.

### Пример: Установка внутреннего состояния из результатов AJAX-запроса {#example-using-ajax-results-to-set-local-state}

Компонент ниже показывает, как в `componentDidMount` задать внутреннее состояние из результата AJAX-запроса.

Допустим, наш API возвращает следующий JSON-объект:

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
        // чтобы не перехватывать исключения из ошибок в самих компонентах.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
