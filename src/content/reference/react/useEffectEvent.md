---
title: useEffectEvent
---

<Intro>

Хук `useEffectEvent` позволяет вынести не реактивную (не зависящую от состояния или пропсов) логику из эффекта в переиспользуемую функцию, называемую [Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event).

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />

## Справочник {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

Чтобы объявить **Effect Event** функцию, вызовите `useEffectEvent` на верхнем уровне вашего компонента. Effect Event функцию можно безопасно вызывать внутри эффектов (`useEffect`, `useLayoutEffect`, и т.д.):

```js {4-6,11}
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  // ...
}
```

[См. другие примеры ниже.](#usage)

#### Параметры {/*parameters*/}

* `callback`: функция, содержащая логику вашего Effect Event.
  При определении события через `useEffectEvent`, переданная `callback` всегда получает доступ к **актуальным значениям пропсов и состояния** на момент вызова.
  Это помогает избежать проблем с **устаревшими замыканиями** (stale closures).

#### Возвращаемое значение {/*returns*/}

Возвращает функцию Effect Event. Эту функцию можно вызывать внутри `useEffect`, `useLayoutEffect` или `useInsertionEffect`.

#### Замечания {/*caveats*/}

* **Вызывать только внутри эффектов:**
  Effect Events должны вызываться *только* внутри эффектов.
  Определяйте их непосредственно перед эффектом, который их использует.
  Не передавайте их в другие компоненты или хуки.
  Линтер [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) (версии 6.1.1 и выше) проверяет это ограничение и не даст вызвать Effect Event в неправильном контексте.

* **Не сокращает зависимости:**
  Не используйте `useEffectEvent` как способ “избежать” добавления зависимостей в массив зависимостей эффекта.
  Это может скрыть ошибки и ухудшить читаемость кода.
  Лучше явно указывать зависимости или использовать `ref`, если нужно сравнивать предыдущие значения.

* **Используется для не реактивной логики:**
  Применяйте `useEffectEvent` только для логики, не зависящей напрямую от изменений состояния или пропсов.
___

## Применение {/*usage*/}

### Чтение актуальных пропсов и состояния {/*reading-the-latest-props-and-state*/}

Обычно, когда вы используете реактивные значения (пропсы или состояние) внутри эффекта,
нужно добавить их в массив зависимостей.
Это гарантирует, что эффект выполнится снова при изменении этих значений — что чаще всего и нужно.

Но бывают случаи, когда необходимо **читать самые свежие значения пропсов или состояния**,
не вызывая при этом повторного выполнения эффекта при каждом их изменении.

Чтобы [читать актуальные значения пропсов или состояния](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)
внутри эффекта без превращения их в реактивные зависимости, включите их в Effect Event.

```js {7-9,12}
import { useEffect, useContext, useEffectEvent } from 'react';

function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onNavigate = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onNavigate(url);
  }, [url]);

  // ...
}
```

В этом примере эффект должен выполняться повторно при изменении `url` (чтобы зафиксировать посещение новой страницы), но **не должен** выполняться заново при изменении `numberOfItems`. Оборачивая логику логирования в Effect Event, мы делаем `numberOfItems` *нереактивным*: оно всегда читается в своём актуальном виде, но не вызывает повторный рендер или перезапуск эффекта. При этом вы можете передавать реактивные значения, такие как `url`, в аргументах Effect Event — чтобы сохранить их реактивность и при этом иметь доступ к свежим нереактивным данным внутри события.