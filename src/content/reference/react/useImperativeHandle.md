---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` — это React Hook, который позволяет вам настроить обработчик, предоставляемый как [ref.](/learn/manipulating-the-dom-with-refs)

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Вызовите `useImperativeHandle` на верхнем уровне вашего компонента, чтобы настроить обработчик ref, который он предоставляет:

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... ваши методы ...
    };
  }, []);
  // ...
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*