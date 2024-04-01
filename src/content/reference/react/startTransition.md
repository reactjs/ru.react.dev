---
Заголовок: startTransition
---

<Intro>

`startTransition` позволяет обновлять состояние без блокировки интерфейса. 

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

<<<<<<< HEAD
Функция `startTransition`  позволяет пометить обновление состояния как переход.
=======
The `startTransition` function lets you mark a state update as a Transition.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[См. другие примеры ниже.](#usage)

#### Параметры {/*parameters*/}

<<<<<<< HEAD
* `scope`: Функция, которая обновляет состояние, вызывая одну или несколько [функций `set`.](/reference/react/useState#setstate) React немедленно вызывает `scope` без аргументов и помечает все обновления состояния, запланированные синхронно во время вызова функции scope, как переходы. Они будут [неблокирующими](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) и [не будут отображать нежелательные индикаторы загрузки.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as Transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

#### Возвращаемое значение {/*returns*/}

`startTransition` ничего не возвращает. 

#### Замечания {/*caveats*/}

<<<<<<< HEAD
* `startTransition` не предоставляет способа отслеживать, ожидает ли переход выполнения. Чтобы показать индикатор ожидания во время выполнения перехода, необходимо использовать [`useTransition`](/reference/react/useTransition). 

* Вы можете обернуть обновление в переход только в том случае, если у вас есть доступ к функции `set` для этого состояния. Если вы хотите начать переход в ответ на какой-то проп или значение, возвращаемое пользовательским хуком, попробуйте использовать [`useDeferredValue`](/reference/react/useDeferredValue).

* Функция, передаваемая в `startTransition`, должна быть синхронной. React немедленно выполняет эту функцию, помечая как переходы все обновления состояния которые происходят во время ее выполнения. Если вы попытаетесь выполнить дополнительные обновления состояния позже (например, в таймауте), они не будут помечены как переходы.

* Обновление состояния, помеченное как переход, будет прервано другими обновлениями состояния. Например, если вы обновите компонент диаграммы внутри перехода, но затем начнете вводить текст в поле ввода, пока диаграмма находится в процессе повторного рендеринга, React перезапустит процесс рендеринга компонента диаграммы после обработки обновления состояния в поле ввода.
=======
* `startTransition` does not provide a way to track whether a Transition is pending. To show a pending indicator while the Transition is ongoing, you need [`useTransition`](/reference/react/useTransition) instead.

* You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook return value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as Transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as Transitions.

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

* Обновления перехода не могут использоваться для управления текстовыми полями ввода.

<<<<<<< HEAD
* В случае наличия нескольких одновременных переходов, React в настоящее время группирует их вместе. Это ограничение, вероятно, будет устранено в будущих релизах.
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

---

## Применение {/*usage*/}

<<<<<<< HEAD
### Пометка обновления состояния как неблокирующего перехода. {/*marking-a-state-update-as-a-non-blocking-transition*/}

Вы можете пометить обновление состояния как *переход*, обернув его в вызов `startTransition`:
=======
### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

You can mark a state update as a *Transition* by wrapping it in a `startTransition` call:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Переходы позволяют сохранить отзывчивость обновлений интерфейса даже на медленных устройствах.

<<<<<<< HEAD
С помощью перехода ваш UI остается отзывчивым даже во время повторного рендера. Например, если пользователь нажимает на вкладку, но затем меняет свое решение и нажимает на другую вкладку, он может это сделать, не дожидаясь завершения первого перерендеринга.

<Note>

`startTransition` очень похож на [`useTransition`](/reference/react/useTransition), за исключением того, что он не предоставляет флаг `isPending` для отслеживания того, идет ли в данный момент переход. Вы можете вызвать `startTransition`, когда `useTransition` недоступен. Например, `startTransition` работает вне компонентов из например, библиотеки данных.

[Узнайте о переходах и посмотрите примеры на странице `useTransition`.](/reference/react/useTransition)
=======
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.

<Note>

`startTransition` is very similar to [`useTransition`](/reference/react/useTransition), except that it does not provide the `isPending` flag to track whether a Transition is ongoing. You can call `startTransition` when `useTransition` is not available. For example, `startTransition` works outside components, such as from a data library.

[Learn about Transitions and see examples on the `useTransition` page.](/reference/react/useTransition)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

</Note>