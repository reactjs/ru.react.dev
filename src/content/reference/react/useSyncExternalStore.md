---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` — это хук React, который позволяет вам подписаться на внешний источник данных.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Вызовите `useSyncExternalStore` на верхнем уровне вашего компонента, чтобы прочитать значение из внешнего источника данных.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Он возвращает снимок данных из хранилища. Вам нужно передать две функции в качестве аргументов:

1. Функция