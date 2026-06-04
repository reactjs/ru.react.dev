---
title: "Built-in React DOM Hooks"
---

<Intro>

Пакет `react-dom` содержит хуки, которые поддерживаются только в веб-приложениях (работающих в среде браузерного DOM). Эти хуки не поддерживаются в небраузерных средах, таких как приложения для iOS, Android или Windows. Если вы ищете хуки, которые поддерживаются в веб-браузерах *и других средах*, см. [страницу Хуки React](/reference/react). На этой странице перечислены все хуки в пакете `react-dom`.

</Intro>

---

## Хуки для форм {/*form-hooks*/}

*Формы* позволяют создавать интерактивные элементы для отправки информации. Для управления формами в ваших компонентах используйте один из следующих хуков:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) позволяет обновлять пользовательский интерфейс на основе статуса формы.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```