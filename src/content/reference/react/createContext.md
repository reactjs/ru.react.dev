---
title: createContext
---

<Intro>

`createContext` позволяет вам создать [контекст](/learn/passing-data-deeply-with-context), который можно предоставлять или читать.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Вызовите `createContext` вне кода компонентов для создания контекста.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `defaultValue`: Значение контекста по умолчанию, когда над компонентом, читающим контекст, нет провайдера соответствующего контекста. Если у вас нет подходящего значения по умолчанию, используйте `null`. Значение по умолчанию используется как вариант "на крайний случай". Оно постоянно и никогда не изменится с течением времени.

#### Возвращаемое значение {/*returns*/}

`createContext` возвращает объект контекста.

**Объект контекста сам по себе не содержит никакой информации.** Он говорит о том, _какой_ контекст компоненты читают или предоставляют. Обычно, вы будете использовать [`SomeContext.Provider`](#provider) в компонентах выше, чтобы определить значение контекста, и вызывать [`useContext(SomeContext)`](/reference/react/useContext) в компонентах ниже, чтобы получить его значение. Объект контекста имеет несколько параметров:

* `SomeContext.Provider` позволяет предоставить контекст компонентам.
* `SomeContext.Consumer` альтернативный и редко используемый способ получить значение контекста.

---

### `SomeContext.Provider` {/*provider*/}

Оберните ваши компоненты в провайдер контекста, чтобы определить его значение для всех компонентов внутри:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Пропсы {/*provider-props*/}

* `value`: Значение, которое вы хотите передать всем компонентам внутри данного провайдера, читающим этот контекст. Глубина вложенности не играет роли. Тип значения может быть любым.  Компонент, вызывающий [`useContext(SomeContext)`](/reference/react/useContext) внутри провайдера, получает `value` ближайшего провайдера соответствующего контекста.

---

### `SomeContext.Consumer` {/*consumer*/}

Когда `useContext` ещё не существовал, был старый способ получить значение контекста:

```js
function Button() {
  // 🟡 Старый способ (не рекомендуется)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Хотя старый способ все ещё работает, **при написании нового кода используйте [`useContext()`](/reference/react/useContext):**

```js
function Button() {
  // ✅ Рекомендуемый способ
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Пропсы {/*consumer-props*/}

* `children`: Функция. React вызовет ее, передав текущее значение контекста, и отрендерит возвращаемый результат. Значение контекста определяется тем же алгоритмом, что и в [`useContext()`](/reference/react/useContext). Когда значение изменится — React повторно вызовет функцию и обновит UI.

---

## Использование {/*usage*/}

### Создание контекста {/*creating-context*/}

Контекст позволяет компонентам [передавать данные вглубь](/learn/passing-data-deeply-with-context), избегая явной передачи пропсов.

Вызовите `createContext` вне кода компонентов для создания одного или нескольких контекстов.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` возвращает <CodeStep step={1}>объект контекста</CodeStep>. Компоненты могут получить значение контекста, передав его в [`useContext()`](/reference/react/useContext):

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

В данном случае полученные значения являются <CodeStep step={3}>значениями по умолчанию</CodeStep>, которые вы определили при создании контекста. Такое поведение нас вряд ли заинтересует, ведь значения по умолчанию никогда не изменятся.

Контекст полезен возможностью **передавать динамически изменяемые значения из ваших компонентов:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Теперь компонент `Page` и все компоненты внутри него, на каком бы уровне вложенности они не находились, будут "видеть" переданное значение контекста. Если данные изменятся, React выполнит повторный рендер читающих контекст компонентов.

[Больше про чтение и передачу контекста с примерами.](/reference/react/useContext)

---

### Импорт и экспорт контекста из файла {/*importing-and-exporting-context-from-a-file*/}

Часто компонентам из разных файлов нужен доступ к одному и тому же контексту. Вот почему принято объявлять контекст в отдельном файле. Что бы сделать контекст доступным для других файлов вы можете использовать [оператор `export`](https://developer.mozilla.org/ru/docs/web/javascript/reference/statements/export):

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Компоненты, объявленные в других файлах, могут использовать оператор [`import`](https://developer.mozilla.org/ru/docs/web/javascript/reference/statements/import) для чтения или предоставления данного контекста:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Это работает аналогично [импорту и экспорту компонентов.](/learn/importing-and-exporting-components)

---

## Возможные проблемы {/*troubleshooting*/}

### Я не могу найти способ изменить значение контекста {/*i-cant-find-a-way-to-change-the-context-value*/}

Код наподобие этого определяет значение контекста *по умолчанию*:

```js
const ThemeContext = createContext('light');
```

Это значение никогда не изменится. React использует его в качестве запасного варианта, если не может найти соответствующий провайдер выше.

Что бы контекст изменялся со временем, [добавьте компоненты состояния и обёртки в провайдер контекста.](/reference/react/useContext#updating-data-passed-via-context)

