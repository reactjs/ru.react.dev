---
title: "Встроенные React API"
---

<Intro>

В дополнение к [Хукам](/reference/react) и [Компонентам](/reference/react/components), пакет `react` экспортирует несколько других API, которые полезны для определения компонентов. На этой странице перечислены все остальные современные React API.

</Intro>

---

* [`createContext`](/reference/react/createContext) позволяет определять и предоставлять контекст дочерним компонентам. Используется с [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) позволяет вашему компоненту предоставлять DOM-узел в качестве рефа родительскому компоненту. Используется с [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) позволяет отложить загрузку кода компонента до его первой отрисовки.
* [`memo`](/reference/react/memo) позволяет вашему компоненту пропускать повторные рендеры с теми же пропсами. Используется с [`useMemo`](/reference/react/useMemo) и [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) позволяет пометить обновление состояния как не срочное. Аналогично [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) позволяет обернуть рендеры и взаимодействия в тестах, чтобы убедиться, что обновления обработаны, прежде чем делать утверждения.

---

## API ресурсов {/*resource-apis*/}

*Ресурсы* могут быть доступны компоненту, не являясь частью его состояния. Например, компонент может прочитать сообщение из Promise или прочитать информацию о стилях из контекста.

Чтобы прочитать значение из ресурса, используйте этот API:

* [`use`](/reference/react/use) позволяет прочитать значение ресурса, такого как [Promise](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise) или [контекст](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```