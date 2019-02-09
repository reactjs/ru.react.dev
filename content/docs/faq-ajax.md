---
id: faq-ajax
title: Запрос к серверу, AJAX и APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Как выполнить AJAX запрос к серверу? {#how-can-i-make-an-ajax-call}

Используйте любую AJAX библиотеку, например [Axios](https://github.com/axios/axios) или [jQuery AJAX](https://api.jquery.com/jQuery.ajax/). А еще присмотритесь к встроенному в браузер методу [window.fetch](https://learn.javascript.ru/fetch).

### Где в жизненном цикле компонента я могу сделать AJAX запрос? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

В методе [`componentDidMount`](/docs/react-component.html#mounting). Сделайте AJAX запрос и используйте `setState` для обновления компонента когда данные будут получены.

### Пример: Результат AJAX запроса и установка внутреннего состояния {#example-using-ajax-results-to-set-local-state}

Компонент ниже демонстрирует как сделать AJAX запрос в `componentDidMount` для дальнейшего обновления внутреннего состояния.

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
        // чтобы не проглотить исключения из-за настоящих багов в компонентах.
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
