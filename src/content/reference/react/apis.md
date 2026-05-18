---
title: "Built-in React APIs"
---

<Intro>

В дополнение к [хукам](/reference/react) и [компонентам](/reference/react/components), пакет `react` экспортирует несколько других API, полезных для определения компонентов. Эта страница перечисляет все остальные современные API React.

</Intro>

---

* [`createContext`](/reference/react/createContext) позволяет вам определять и предоставлять контекст дочерним компонентам. Используется с [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) позволяет вашему компоненту предоставлять DOM-узел в качестве рефа родительскому. Используется с [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) позволяет отложить загрузку кода компонента до его первого рендеринга.
* [`memo`](/reference/react/memo) позволяет вашему компоненту пропускать повторные рендеры с теми же пропсами. Используется с [`useMemo`](/reference/react/useMemo) и [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) позволяет пометить обновление состояния как не срочное. Аналогично [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) позволяет обернуть рендеры и взаимодействия в тестах, чтобы гарантировать обработку обновлений перед проверками.

---

## API ресурсов {/*resource-apis*/}

К *ресурсам* компонент может получить доступ, не имея их в своем состоянии. Например, компонент может прочитать сообщение из Promise или информацию о стилях из контекста.

Чтобы прочитать значение из ресурса, используйте этот API:

* [`use`](/reference/react/use) позволяет вам прочитать значение ресурса, такого как [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) или [контекст](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
