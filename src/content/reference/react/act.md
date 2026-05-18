---
title: act
---

<Intro>

`act` — это вспомогательная функция для тестирования, которая применяет ожидающие обновления React перед выполнением утверждений.

```js
await act(async actFn)
```

</Intro>

Чтобы подготовить компонент к утверждениям, оберните код, который его отображает и выполняет обновления, в вызов `await act()`. Это позволит вашему тесту работать ближе к тому, как React работает в браузере.

<Note>
Вы можете найти использование `act()` напрямую немного избыточным. Чтобы избежать некоторого шаблонного кода, вы можете использовать библиотеку, такую как [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), вспомогательные функции которой обёрнуты в `act()`.
</Note>


<InlineToc />

---

## Справочник {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

При написании UI-тестов такие задачи, как рендеринг, пользовательские события или получение данных, можно рассматривать как «единицы» взаимодействия с пользовательским интерфейсом. React предоставляет вспомогательную функцию `act()`, которая гарантирует, что все обновления, связанные с этими «единицами», были обработаны и применены к DOM перед выполнением каких-либо утверждений.

Название `act` происходит от паттерна [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert).

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

Мы рекомендуем использовать `act` с `await` и `async` функцией. Хотя синхронная версия работает во многих случаях, она не работает во всех, и из-за того, как React планирует обновления внутренне, трудно предсказать, когда вы можете использовать синхронную версию.

В будущем мы объявим синхронную версию устаревшей и удалим её.

</Note>

#### Параметры {/*parameters*/}

* `async actFn`: Асинхронная функция, оборачивающая рендеринг или взаимодействия для тестируемых компонентов. Любые обновления, инициированные внутри `actFn`, добавляются во внутреннюю очередь `act`, которая затем обрабатывается вместе для обработки и применения любых изменений к DOM. Поскольку она асинхронна, React также будет выполнять любой код, который пересекает асинхронную границу, и обрабатывать любые запланированные обновления.

#### Возвращает {/*returns*/}

`act` ничего не возвращает.

## Использование {/*usage*/}

При тестировании компонента вы можете использовать `act` для утверждений о его выводе.

Например, предположим, у нас есть компонент `Counter`, примеры использования ниже показывают, как его протестировать:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### Рендеринг компонентов в тестах {/*rendering-components-in-tests*/}

Чтобы протестировать вывод рендеринга компонента, оберните рендеринг в `act()`:

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  
  // ✅ Оберните рендеринг компонента в act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

Здесь мы создаём контейнер, добавляем его в документ и отображаем компонент `Counter` внутри `act()`. Это гарантирует, что компонент будет отображён и его эффекты будут применены перед выполнением утверждений.

Использование `act` гарантирует, что все обновления были применены перед выполнением утверждений.

### Генерация событий в тестах {/*dispatching-events-in-tests*/}

Чтобы протестировать события, оберните генерацию события в `act()`:

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  // ✅ Генерируйте событие внутри act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

Здесь мы отображаем компонент с помощью `act`, а затем генерируем событие внутри другого `act()`. Это гарантирует, что все обновления от события будут применены перед выполнением утверждений.

<Pitfall>

Не забывайте, что генерация DOM-событий работает только тогда, когда DOM-контейнер добавлен в документ. Вы можете использовать библиотеку, такую как [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), чтобы уменьшить количество шаблонного кода.

</Pitfall>

## Устранение неполадок {/*troubleshooting*/}

### Я получаю ошибку: "The current testing environment is not configured to support act"(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

Использование `act` требует установки `global.IS_REACT_ACT_ENVIRONMENT=true` в вашей тестовой среде. Это сделано для того, чтобы `act` использовался только в правильной среде.

Если вы не установите глобальную переменную, вы увидите ошибку, подобную этой:

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

Чтобы исправить это, добавьте следующую строку в ваш файл глобальной настройки для React-тестов:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

В таких фреймворках для тестирования, как [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), `IS_REACT_ACT_ENVIRONMENT` уже установлен для вас.

</Note>
