---
title: createContext
---
<Intro>

`createContext` позволяет создавать [контекст](/learn/passing-data-deeply-with-context), который компоненты могут предоставлять или читать.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Вызовите `createContext` вне любого компонента для создания контекста.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `defaultValue`: Значение, которое будет иметь контекст, если выше в дереве компонентов, читающих контекст, нет соответствующего провайдера контекста. Если у вас нет значимого значения по умолчанию, укажите `null`. Значение по умолчанию предназначено как «запасной» вариант. Оно статично и никогда не меняется со временем.

#### Возвращает {/*returns*/}

`createContext` возвращает объект контекста.

**Сам объект контекста не содержит никакой информации.** Он представляет собой _идентификатор_, который другие компоненты читают или предоставляют. Обычно вы будете использовать [`SomeContext.Provider`](#provider) в компонентах выше для указания значения контекста и вызывать [`useContext(SomeContext)`](/reference/react/useContext) в компонентах ниже для его чтения. Объект контекста имеет несколько свойств:

* `SomeContext.Provider` позволяет предоставлять значение контекста компонентам.
* `SomeContext.Consumer` — это альтернативный и редко используемый способ чтения значения контекста.

---

### `SomeContext.Provider` {/*provider*/}

Оберните ваши компоненты в провайдер контекста, чтобы указать значение этого контекста для всех компонентов внутри:

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

* `value`: Значение, которое вы хотите передать всем компонентам, читающим этот контекст внутри этого провайдера, независимо от их глубины. Значение контекста может быть любого типа. Компонент, вызывающий [`useContext(SomeContext)`](/reference/react/useContext) внутри провайдера, получает `value` от ближайшего соответствующего провайдера контекста над ним.

---

### `SomeContext.Consumer` {/*consumer*/}

До появления `useContext` существовал старый способ чтения контекста:

```js
function Button() {
  // 🟡 Устаревший способ (не рекомендуется)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Хотя этот старый способ всё ещё работает, **новый код следует писать с использованием [`useContext()`](/reference/react/useContext) вместо него:**

```js
function Button() {
  // ✅ Рекомендуемый способ
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Пропсы {/*consumer-props*/}

* `children`: Функция. React вызовет функцию, которую вы передали, с текущим значением контекста, определённым тем же алгоритмом, что и [`useContext()`](/reference/react/useContext), и отрисует результат, который вы вернёте из этой функции. React также будет повторно вызывать эту функцию и обновлять UI всякий раз, когда контекст от родительских компонентов изменится.

---

## Использование {/*usage*/}

### Создание контекста {/*creating-context*/}

Контекст позволяет компонентам [передавать информацию глубоко вниз](/learn/passing-data-deeply-with-context), не передавая явно пропсы.

Вызовите `createContext` вне любого компонента, чтобы создать один или несколько контекстов.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` возвращает <CodeStep step={1}>объект контекста</CodeStep>. Компоненты могут читать контекст, передавая его в [`useContext()`](/reference/react/useContext):

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

По умолчанию значения, которые они получают, будут <CodeStep step={3}>значениями по умолчанию</CodeStep>, которые вы указали при создании контекстов. Однако само по себе это не очень полезно, так как значения по умолчанию никогда не меняются.

Контекст полезен, потому что вы можете **предоставлять другие, динамические значения из ваших компонентов:**

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

Теперь компонент `Page` и любые компоненты внутри него, независимо от их глубины, будут «видеть» переданные значения контекста. Если переданные значения контекста изменятся, React также перерисует компоненты, читающие контекст.

[Узнайте больше о чтении и предоставлении контекста и посмотрите примеры.](/reference/react/useContext)

---

### Импорт и экспорт контекста из файла {/*importing-and-exporting-context-from-a-file*/}

Часто компонентам в разных файлах требуется доступ к одному и тому же контексту. Поэтому принято объявлять контексты в отдельном файле. Затем вы можете использовать оператор [`export`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export), чтобы сделать контекст доступным для других файлов:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Компоненты, объявленные в других файлах, затем могут использовать оператор [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) для чтения или предоставления этого контекста:

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

## Устранение неполадок {/*troubleshooting*/}

### Я не могу найти способ изменить значение контекста {/*i-cant-find-a-way-to-change-the-context-value*/}


Код вроде этого указывает *значение контекста по умолчанию*:

```js
const ThemeContext = createContext('light');
```

Это значение никогда не меняется. React использует это значение только в качестве запасного варианта, если не может найти соответствующий провайдер выше.

Чтобы контекст изменялся со временем, [добавьте состояние и оберните компоненты в провайдер контекста.](/reference/react/useContext#updating-data-passed-via-context)