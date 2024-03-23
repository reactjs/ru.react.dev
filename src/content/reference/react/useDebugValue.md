---
title: useDebugValue
---

<Intro>

Хук `useDebugValue` позволяет добавить метку к пользовательскому хуку в [React DevTools.](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Вызовите `useDebugValue` на верхнем уровне [пользовательского хука](/learn/reusing-logic-with-custom-hooks), чтобы отобразить читаемое отладочное значение:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `value`: Значение, которое вы хотите отобразить в React DevTools. Значение может быть любого типа.
* **необязательный** `format`: Функция форматирования. При осмотре компонента React DevTools вызовет функцию форматирования с `value` в качестве аргумента, а затем отобразит возвращаемое отформатированное значение (которое может иметь любой тип). Если не указать функцию форматирования, то будет отображено исходнное значение `value`.

#### Возвращаемое значение {/*returns*/}

`useDebugValue` ничего не возвращает.

## Использование {/*usage*/}

### Добавление метки к пользовательскому хуку {/*adding-a-label-to-a-custom-hook*/}

Вызовите `useDebugValue` на верхнем уровне [пользовательского хука](/learn/reusing-logic-with-custom-hooks), чтобы отобразить читаемое отладочное значение <CodeStep step={1}>debug value</CodeStep> в [React DevTools.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

В результате компоненты, вызывающие `useOnlineStatus`, получают метку типа `OnlineStatus: "Online"` при их осмотре:

![Скриншот React DevTools показывающий отладочное значение](/images/docs/react-devtools-usedebugvalue.png)

Без вызова `useDebugValue` отображались бы только базовые данные (в данном примере - `true`).

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

Не добавляйте отладочные значения в каждый пользовательский хук. Это ценнее для пользовательских хуков, которые являются частью общих библиотек и имеют сложную внутреннюю структуру данных, которую трудно проверить.

</Note>

---

### Отсрочка форматирования отладочного значения {/*deferring-formatting-of-a-debug-value*/}

Вы можете передать функцию форматирования в качестве второго аргумента в `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Ваша функция форматирования будет получать в качестве параметра <CodeStep step={1}>debug value</CodeStep> и должна возвращать <CodeStep step={2}>форматированное отображаемое значение</CodeStep>. Когда ваш компонент будет осмотрен, React DevTools вызовет эту функцию и отобразит ее результат.

Это позволит избежать выполнения потенциально дорогостоящей логики форматирования, если компонент не проверяется. Например, если `date` является значением Date, это позволит избежать вызова `toDateString()` для него при каждом рендеринге.
