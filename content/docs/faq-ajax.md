---
id: faq-ajax
title: AJAX и обращение к API
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Как выполнить AJAX-запрос к серверу? {#how-can-i-make-an-ajax-call}

Вы можете использовать встроенный в браузер метод [window.fetch](https://learn.javascript.ru/fetch) или любую AJAX-библиотеку, например [Axios](https://github.com/axios/axios) или [jQuery AJAX](https://api.jquery.com/jQuery.ajax/).

### Где в жизненном цикле компонента лучше делать запрос? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Вы можете сделать AJAX-запрос в [`componentDidMount`](/docs/react-component.html#mounting). Когда вы получите данные, вызовите `setState`, чтобы передать их компоненту.

### Пример: Устанавливаем состояние из AJAX-запроса {#example-using-ajax-results-to-set-local-state}

Компонент ниже показывает, как в `componentDidMount` задать внутреннее состояние из результата AJAX-запроса.

Допустим, наш API возвращает следующий JSON-объект:

```json
{
  "items": [
    { "id": 1, "name": "Яблоки",  "price": "$2" },
    { "id": 2, "name": "Персики", "price": "$5" }
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

Here is the equivalent with [Hooks](https://reactjs.org/docs/hooks-intro.html): 

```js
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.items);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
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
```
