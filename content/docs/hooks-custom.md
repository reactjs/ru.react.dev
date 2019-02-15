---
id: hooks-custom
title: Создание пользовательских хуков
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*Хуки* -- новинка в React 16.8, которая позволяет использовать состояние и другие возможности React без написания классов.

Создание пользовательских хуков позволяет вам перенести компонентную логику в функции, которые можно многократно использовать.

В разделе [использование хука эффекта](/docs/hooks-effect.html#example-using-hooks-1) мы увидели компонент из приложения чата, в котором отображается сообщение о том, находится ли наш друг в сети:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Теперь предположим, что в приложении чата также есть список контактов, и мы хотим отображать зелёным цветом имена онлайн пользователей. Мы могли бы просто скопировать и вставить приведённую выше логику в наш компонент `FriendListItem`, но это не самый лучший вариант:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Вместо этого мы разделим эту логику между `FriendStatus` и `FriendListItem`.

Традиционно в React у нас было два популярных способа обмена логикой состояния между компонентами: [рендер-пропсы](/docs/render-props.html) и [компоненты высшего порядка](/docs/higher-order-components.html). Рассмотрим, как хуки решают многие из тех же задач, не заставляя вас добавлять больше компонентов в дерево.

## Извлечение логики в пользовательский хук {#extracting-a-custom-hook}

Когда мы хотим разделить логику между двумя JavaScript-функциями, мы извлекаем её в третью функцию. Так как компонент и хук являются функциями, то для них это тоже работает!

**Пользовательский хук -- это функция JavaScript, имя которой начинается с "`use`", и которая может вызывать другие хуки.** Например, функция `useFriendStatus` ниже -- это наш первый пользовательский хук:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Здесь нет ничего нового, логика просто скопирована из компонентов выше. Так же как и в компонентах, убедитесь, что вы не используете другие хуки внутри условных операторов и вызываете их на верхнем уровне вашего хука.

В отличие от React-компонента, пользовательский хук не обязательно должен иметь конкретную сигнатуру. Мы можем решить, что он принимает в качестве аргументов, и должен ли он что-либо возвращать. Другими словами, это как обычная функция. Её имя всегда следует начинать с `use`, чтобы вы могли сразу увидеть, что к ней применяются [правила хуков](/docs/hooks-rules.html).

Цель нашего хука `useFriendStatus` -- подписать нас на статус друга. Поэтому он принимает в качестве аргумента `friendID` и возвращает статус друга в сети:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Теперь давайте посмотрим, как мы можем использовать наш пользовательски хук.

## Использование пользовательского хука {#using-a-custom-hook}

Вначале нашей целью было удалить дублированную логику из компонентов `FriendStatus` и `FriendListItem`. Они оба хотят знать, есть ли друг в сети.

Теперь, когда мы извлекли эту логику в хук `useFriendStatus`, мы можем его использовать:

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**Код будет работать как раньше?** Да, он работает точно так же. Если вы посмотрите внимательно, вы заметите, что мы не вносили никаких изменений в логику. Всё, что мы сделали, это извлекли общий код в отдельную функцию. **Пользовательские хуки -- это условие, которое естественным образом следует из конструкции хуков, а не функция React.**

**Должен ли я писать “`use`” в начале названия хука?** Очень желательно. Это важное условие, без которого мы не сможем автоматически проверять нарушения [правил хуков](/docs/hooks-rules.html), потому что не определим, содержит ли определённая функция вызовы хуков внутри.

**У хука, используемого в двух компонентах, одинаковое состояние?** Нет. Пользовательские хуки -- это механизм повторного использования *логики с состоянием* (например, установка подписки и сохранение текущего значения), но каждый раз, когда вы используете пользовательский хук, всё состояние и эффекты внутри него полностью изолированы.

**Как пользовательский хук получает изолированное состояние?** Каждый вызов хука получает изолированное состояние. Поскольку мы вызываем `useFriendStatus` напрямую, с точки зрения React наш компонент просто вызывает` useState` и `useEffect`. И как мы [узнали](/docs/hooks-state.html#tip-using-multiple-state-variables) [ранее](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), мы можем вызывать `useState` и `useEffect` много раз в одном компоненте, и они будут полностью независимы.

### Совет: Передача информации между хуками {#tip-pass-information-between-hooks}

Поскольку хуки являются функциями, мы можем передавать информацию между ними.

Продемонстрируем это используя другой компонент из нашего гипотетического примера чата. Это средство выбора получателей сообщений чата, которое показывает, находится ли выбранный в данный момент друг в сети:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Мы сохраняем выбранный в настоящее время идентификатор друга в переменной состояния `recipientID` и обновляем его, если пользователь выбирает другого друга в `<select>`.

Поскольку вызов хука `useState` даёт нам последнее значение переменной состояния `recipientID`, мы можем передать его в наш пользовательский хук `useFriendStatus` в качестве аргумента:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Это позволяет нам узнать, находится ли выбранный друг в сети. Если мы выберем другого друга и обновим переменную состояния `recipientID`, наш хук `useFriendStatus` отменит подписку на ранее выбранного друга и подпишется на статус вновь выбранного.

## `используйтеВоображение()` {#useyourimagination}

Пользовательские хуки предлагают гибкую логику совместного использования, которая раньше была невозможна в React-компонентах. Вы можете написать собственные хуки, которые охватывают широкий спектр вариантов использования, таких как обработка форм, анимация, декларативные подписки, таймеры и, возможно, многие другие, которые мы не рассматривали. Более того, вы можете создавать хуки, которые так же просты в использовании, как и встроенные функции React.

Попробуйте не добавлять абстракцию слишком рано. Теперь, когда функциональные компоненты обладают большими возможностями, вполне вероятно, средний функциональный компонент станет длиннее в вашей кодовой базе. Это нормально - не думайте, что вы *должны* немедленно разделить его на хуки. Но мы также рекомендуем вам находить ситуации, когда пользовательский хук поможет скрыть сложную логику за простым интерфейсом или распутать большой компонент.

Например, у вас есть сложный компонент, который содержит множество внутренних состояний, которые управляются специальным образом. `useState` не помогает объединить логику обновления, поэтому вы можете написать её как [Redux](https://redux.js.org/)-редюсер:

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... другие действия ...
    default:
      return state;
  }
}
```

Редюсеры очень удобно тестировать изолированно и масштабировать для реализации сложной логики обновления. При необходимости вы можете разбить их на более мелкие редюсеры. Однако, вам может нравиться пользоваться преимуществами внутреннего состояния React, или вы не хотите устанавливать ещё одну стороннюю библиотеку.

Что если мы могли бы написать хук `useReducer`, который позволяет нам управлять *внутренним* состоянием нашего компонента с помощью редюсера? Упрощённая версия может выглядеть так:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Теперь мы можем использовать его в нашем компоненте и с помощью редюсера управлять его состоянием:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

Так как необходимость управления внутренним состоянием с помощью редюсера в сложном компоненте достаточно распространена, мы встроили хук `useReducer` прямо в React. Вы найдёте его вместе с другими встроенными хуками в [справочнике API хуков](/docs/hooks-reference.html).
