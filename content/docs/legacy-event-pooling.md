---
id: legacy-event-pooling
title: Пул событий
permalink: docs/legacy-event-pooling.html
---

>Примечание
>
>Информация на этой странице актуальна для React версии 16 и ниже, а также для React Native.
>
>Веб-версия React 17 **не** использует пул событий.
>
>[Подробнее в посте блога](/blog/2020/08/10/react-v17-rc.html#no-event-pooling) about this change in React 17.

События [`SyntheticEvent`](/docs/events.html) содержатся в пуле. Это означает, что объект `SyntheticEvent` будет повторно использован, а все его свойства будут очищены после вызова обработчика события.
Например, следующий код не сработает, как ожидается:

```javascript
function handleChange(e) {
  // Ничего не произойдёт, потому что объект события используется повторно.
  setTimeout(() => {
    console.log(e.target.value); // Слишком поздно!
  }, 100);
}
```

Если нужно обратиться к свойствам объекта события после выполнения обработчика события, то необходимо вызвать `e.persist()`:

```javascript
function handleChange(e) {
  // Останавливает React от сброса свойств объекта события:
  e.persist();

  setTimeout(() => {
    console.log(e.target.value); // Сработает
  }, 100);
}
```
