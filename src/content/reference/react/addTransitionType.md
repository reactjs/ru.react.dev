---
title: unstable_addTransitionType
version: experimental
---
<Experimental>

**Этот API является экспериментальным и пока недоступен в стабильной версии React.**

Вы можете попробовать его, обновив пакеты React до последней экспериментальной версии:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Экспериментальные версии React могут содержать ошибки. Не используйте их в продакшене.

</Experimental>

<Intro>

`unstable_addTransitionType` позволяет указать причину перехода.


```js
startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### Параметры {/*parameters*/}

- `type`: Тип перехода для добавления. Может быть любой строкой.

#### Возвращаемое значение {/*returns*/}

`startTransition` ничего не возвращает.

#### Особенности {/*caveats*/}

- Если объединено несколько переходов, собираются все типы переходов. Вы также можете добавить более одного типа к переходу.
- Типы переходов сбрасываются после каждого коммита. Это означает, что запасной вариант `<Suspense>` будет ассоциировать типы после `startTransition`, но раскрытие содержимого — нет.

---

## Использование {/*usage*/}

### Добавление причины перехода {/*adding-the-cause-of-a-transition*/}

Вызовите `addTransitionType` внутри `startTransition`, чтобы указать причину перехода:

``` [[1, 6, "unstable_addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]
import { startTransition, unstable_addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      unstable_addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

Когда вы вызываете <CodeStep step={1}>addTransitionType</CodeStep> в области видимости <CodeStep step={2}>startTransition</CodeStep>, React будет ассоциировать <CodeStep step={3}>submit-click</CodeStep> как одну из причин перехода.

В настоящее время типы переходов могут использоваться для настройки различных анимаций в зависимости от того, что вызвало переход. У вас есть три варианта выбора того, как их использовать:

- [Настройка анимаций с использованием типов переходов браузера](#customize-animations-using-browser-view-transition-types)
- [Настройка анимаций с использованием класса `View Transition`](#customize-animations-using-view-transition-class)
- [Настройка анимаций с использованием событий `ViewTransition`](#customize-animations-using-viewtransition-events)

В будущем мы планируем поддерживать больше сценариев использования причины перехода.

---
### Настройка анимаций с использованием типов переходов браузера {/*customize-animations-using-browser-view-transition-types*/}

Когда [`ViewTransition`](/reference/react/ViewTransition) активируется из перехода, React добавляет все типы переходов в качестве браузерных [типов переходов представления](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) к элементу.

Это позволяет настраивать различные анимации на основе CSS-областей:

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### Настройка анимаций с использованием класса `View Transition` {/*customize-animations-using-view-transition-class*/}

Вы можете настраивать анимации для активированного `ViewTransition` на основе типа, передавая объект в класс View Transition:

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setState(newState);
});
```

Если совпадает несколько типов, они объединяются. Если типы не совпадают, используется специальная запись "default". Если какой-либо тип имеет значение "none", то он имеет приоритет, и ViewTransition отключается (не получает имени).

Их можно комбинировать со свойствами enter/exit/update/layout/share для сопоставления на основе типа триггера и типа перехода.

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### Настройка анимаций с использованием событий `ViewTransition` {/*customize-animations-using-viewtransition-events*/}

Вы можете императивно настраивать анимации для активированного `ViewTransition` на основе типа, используя события View Transition:

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

Это позволяет выбирать различные императивные анимации в зависимости от причины.

---

## Устранение неполадок {/*troubleshooting*/}

### TODO {/*todo2*/}