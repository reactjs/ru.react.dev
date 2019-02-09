---
id: faq-ajax
title: AJAX и API
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Как выполнить AJAX-запрос? {#how-can-i-make-an-ajax-call}

Вы можете использовать любую AJAX-библиотеку, которую вам хочется использовать в React-приложении. Некоторые популярные AJAX-библиотеки — [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/) и встроенный в браузер [window.fetch](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API).

### Где в жизненном цикле компонента нужно сделать AJAX-запрос? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Вам стоит сохранять данные из вызовов AJAX в методе жизненного цикла [`componentDidMount`](/docs/react-component.html#mounting). Данный метод позволит использовать `setState` для обновления компонента, когда будут получены результаты запроса.

### Пример: Использование AJAX-результатов для установки локального состояния {#example-using-ajax-results-to-set-local-state}

Компонент ниже показывает, как сделать AJAX-запрос в методе `componentDidMount`, чтобы наполнить локальное состояние компонента.

Пример нашего API возвращает следующий JSON-объект:

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
        // Примечание: важно обрабатывать ошибки в этом колбэке,
        // а не использовать блок catch() для этого, чтобы не 
        // перехватывать исключения из-за существующих багов
        // в компонентах.
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
