---
title: "Встроенные хуки React DOM"
---

<Intro>

Пакет `react-dom` содержит хуки, которые поддерживаются только для веб-приложений (которые работают в среде DOM браузера). Эти хуки не поддерживаются в средах, отличных от браузера, таких как приложения iOS, Android или Windows. Если вы ищете хуки, которые поддерживаются в веб-браузерах *и других средах*, см. [страницу хуков React](/reference/react). На этой странице перечислены все хуки в пакете `react-dom`.

</Intro>

---

## Хуки форм {/*form-hooks*/}

*Формы* позволяют создавать интерактивные элементы управления для отправки информации. Чтобы управлять формами в ваших компонентах, используйте один из этих хуков:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) позволяет вносить изменения в пользовательский интерфейс на основе статуса формы.

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