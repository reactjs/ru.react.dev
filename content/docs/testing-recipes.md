---
id: testing-recipes
title: Рецепты тестирования
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

Общие принципы написания тестов React-компонентов.

> Примечание:
>
> Эта страница предполагает, что вы используете исполнитель тестов [Jest](https://jestjs.io/). Если это не так, то вам возможно придётся подстроиться под API, но в целом общий подход к написанию тестов будет таким же. Подробнее о настройке среды тестирования читайте на странице [Среды тестирования](/docs/testing-environments.html).

На этой странице, в основном, мы будем использовать функциональные компоненты. Тем не менее, стратегии тестирования не зависят от внутренней реализации и могут применяться к классовым компонентам.

- [Подготовка/Завершение](#setup--teardown)
- [`act()`](#act)
- [Рендеринг](#rendering)
- [Получение данных](#data-fetching)
- [Фиктивные модули](#mocking-modules)
- [События](#events)
- [Таймеры](#timers)
- [Тестирование снимками](#snapshot-testing)
- [Несколько рендереров](#multiple-renderers)
- [Чего-то не хватает?](#something-missing)

---

### Подготовка/Завершение {#setup--teardown}

Для каждого теста мы обычно хотим рендерить React-дерево к DOM-элементу, который прикреплён к `document`. Это важно, чтобы он мог получать DOM-события. Когда тест завершается, мы хотим «подчистить» и размонтировать дерево от `document`.

Обычно, чтобы это сделать, следует использовать пару блоков `beforeEach` и `afterEach`, они всегда будут исполняться и изолировать тесты друг от друга:

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

Вы можете использовать другой подход, но не забывайте, что желательно «подчищать» _даже если тест не проходит_. В противном случае тесты могут «течь», и один тест может изменить поведение другого. Это сделает тесты сложными для отладки.

---

### `act()` {#act}

При написании UI-тестов, задачи рендеринга, пользовательских событий или получения данных могут расцениваться, как «блоки» интеграции с пользовательским интерфейсом. В пакете `react-dom/test-utils` есть вспомогательная функция [`act()`](/docs/test-utils.html#act), которая проверяет, что все обновления, связанные с этими «блоками», выполнены и применены к DOM до проверки предполагаемого вывода:

```js
act(() => {
  // рендер компонентов
});
// проверка предполагаемого вывода
```

Это помогает приблизить ваши тесты к тому, что реальные пользователи могли бы испытывать при использовании вашего приложения. Дальнейшие примеры используют `act()`, чтобы обеспечить это.

Если вы считаете, что использование `act()` потребует писать больше шаблонного кода, то чтобы частично этого избежать, вы можете использовать библиотеку [React Testing Library](https://testing-library.com/react), вспомогательные функции которой уже обёрнуты в `act()`.

> Примечание:
>
> Имя функции `act` произошло от шаблона [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert).

---

### Рендеринг {#rendering}

Как правило, вы хотите проверить правильность результата рендеринга компонента с определёнными пропсами. Рассмотрим простой компонент, который рендерит сообщение на основе пропа:

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

Давайте напишем тест для этого компонента:

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### Получение данных {#data-fetching}

Вместо обращения к реальным API в своих тестах, вы можете делать фиктивные запросы, которые вернут подставные данные. Такие запросы предотвращают проблемы в тестах, связанные с недоступностью бэкенда, и увеличивают скорость их выполнения. Примечание: вы всё ещё можете запускать набор [«сквозных»](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests) тестов через фреймворк, которые проверяют, как работает приложение в целом.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

Давайте напишем тесты для этого компонента:

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Используем act асинхронно, чтобы передать успешно завершённые промисы
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // выключаем фиктивный fetch, чтобы убедиться, что тесты полностью изолированы
  global.fetch.mockRestore();
});
```

---

### Фиктивные модули {#mocking-modules}

Некоторые модули могут неправильно работать внутри тестовой среды или совсем не нужны для теста. Подмена таких модулей фиктивными облегчит написание тестов для вашего кода.

Рассмотрим компонент `Contact`, который использует сторонний компонент `GoogleMap`:

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

export default function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

Если мы не хотим загружать этот компонент в наш тест, мы можем подменить его фиктивным и запустить наши тесты:

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### События {#events}

Мы рекомендуем создавать настоящие DOM-события на DOM-элементах и после проверять предполагаемый результат. Рассмотрим компонент `Toggle`:

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

Давайте напишем тесты для этого компонента:

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // получаем элемент button и кликаем на него несколько раз
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

Разные DOM-события и их свойства описаны на [MDN](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent). Обратите внимание, нужно передавать `{ bubbles: true }` в каждое событие, которое вы создаёте, чтобы обработчик событий React его увидел и автоматически передал в корень документа.

> Примечание:
>
> React Testing Library предлагает лаконичный вариант [вспомогательной функции](https://testing-library.com/docs/dom-testing-library/api-events) для запуска событий.

---

### Таймеры {#timers}

Ваш код может использовать таймеры, например `setTimeout`, чтобы запланировать дополнительные действия в будущем. В следующем примере панель множественного выбора ждёт выбора пользователя и выполняет дальнейшие действия, если выбор не сделан в течение 5 секунд:

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

Давайте напишем тесты для этого компонента, используя [фиктивные таймеры Jest](https://jestjs.io/docs/ru/timer-mocks), и протестируем различные состояния, в которых он может быть.

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
  jest.useFakeTimers();
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  jest.useRealTimers();
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // двигаемся вперёд во времени на 100 мс
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // теперь двигаемся вперёд ещё на 5 секунд
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // размонтируем приложение
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

Необязательно использовать фиктивные таймеры во всех тестах. В тесте выше, мы включили их вызвав метод `jest.useFakeTimers()`. Главное их преимущество состоит в том, что вашему тесту не требуется ждать пять секунд для выполнения, а вам усложнять код компонента только для проведения тестирования.

---

### Тестирование снимками {#snapshot-testing}

Фреймворки, такие как Jest, позволяют сохранять «снимки» данных используя [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/ru/snapshot-testing). С их помощью мы можем «сохранить» результат рендера компонента и убедиться, что изменение в нём явно отражено в снимке.

В следующем примере мы рендерим компонент и форматируем отрендеренный HTML, используя пакет [`pretty`](https://www.npmjs.com/package/pretty), перед его сохранением в виде встроенного снимка:

```jsx{29-31}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... автоматически заполняется Jest ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... автоматически заполняется Jest ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... автоматически заполняется Jest ... */
});
```

В большинстве случаев лучше проверять специфические вероятные результаты, чем использовать снимки. Этот тип тестов опирается на внутреннюю реализацию компонентов, в результате тесты легко ломаются и команды начинают уделять меньше внимания поломкам в снимках. Выборочная [подмена дочерних компонентов](#mocking-modules) поможет снизить размер снимков и сделает их код более читаемым для коллег.

---

### Несколько рендереров {#multiple-renderers}

<<<<<<< HEAD
В редких случаях вы можете запустить тест компонента, который использует несколько рендереров. Например, можно запускать тесты снимками для компонента с помощью `react-test-renderer`, который использует `ReactDOM.render` внутри дочернего компонента для рендера некоторого содержимого. В этом случае можно обернуть обновления функциями `act()` в соответствии с их рендерами.
=======
In rare cases, you may be running a test on a component that uses multiple renderers. For example, you may be running snapshot tests on a component with `react-test-renderer`, that internally uses `render` from `react-dom` inside a child component to render some content. In this scenario, you can wrap updates with `act()`s corresponding to their renderers.
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### Чего-то не хватает? {#something-missing}

Если мы упустили какой-то распространённый сценарий, пожалуйста, сообщите нам в [ишью-трекере](https://github.com/reactjs/reactjs.org/issues) сайта с документацией.
