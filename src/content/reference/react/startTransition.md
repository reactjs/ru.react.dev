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

Функция `startTransition`  позволяет пометить обновление состояния как переход.

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
* `scope`: Функция, которая обновляет состояние, вызывая одну или несколько [функций `set`.](/reference/react/useState#setstate) React немедленно вызывает `scope` без параметров и помечает все обновления состояния, запланированные синхронно во время вызова функции scope, как переходы. Они будут [неблокирующими](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) и [не будут отображать нежелательные индикаторы загрузки.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 6bfde58c109ec86fd6c5767421404cb679ffba9a

#### Возвращаемое значение {/*returns*/}

`startTransition` ничего не возвращает. 

#### Замечания {/*caveats*/}

* `startTransition` не предоставляет способа отслеживать, ожидает ли переход выполнения. Чтобы показать индикатор ожидания во время выполнения перехода, необходимо использовать [`useTransition`](/reference/react/useTransition). 

* Вы можете обернуть обновление в переход только в том случае, если у вас есть доступ к функции `set` для этого состояния. Если вы хотите начать переход в ответ на какой-то проп или значение, возвращаемое пользовательским хуком, попробуйте использовать [`useDeferredValue`](/reference/react/useDeferredValue).

* Функция, передаваемая в `startTransition`, должна быть синхронной. React немедленно выполняет эту функцию, помечая как переходы все обновления состояния которые происходят во время ее выполнения. Если вы попытаетесь выполнить дополнительные обновления состояния позже (например, в таймауте), они не будут помечены как переходы.

* Обновление состояния, помеченное как переход, будет прервано другими обновлениями состояния. Например, если вы обновите компонент диаграммы внутри перехода, но затем начнете вводить текст в поле ввода, пока диаграмма находится в процессе повторного рендеринга, React перезапустит процесс рендеринга компонента диаграммы после обработки обновления состояния в поле ввода.

* Обновления перехода не могут использоваться для управления текстовыми полями ввода.

* В случае наличия нескольких одновременных переходов, React в настоящее время группирует их вместе. Это ограничение, вероятно, будет устранено в будущих релизах.

---

## Применение {/*usage*/}

### Пометка обновления состояния как неблокирующего перехода. {/*marking-a-state-update-as-a-non-blocking-transition*/}

Вы можете пометить обновление состояния как *переход*, обернув его в вызов `startTransition`:

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

С помощью перехода ваш UI остается отзывчивым даже во время повторного рендера. Например, если пользователь нажимает на вкладку, но затем меняет свое решение и нажимает на другую вкладку, он может это сделать, не дожидаясь завершения первого перерендеринга.

<Note>

`startTransition` очень похож на [`useTransition`](/reference/react/useTransition), за исключением того, что он не предоставляет флаг `isPending` для отслеживания того, идет ли в данный момент переход. Вы можете вызвать `startTransition`, когда `useTransition` недоступен. Например, `startTransition` работает вне компонентов из например, библиотеки данных.

[Узнайте о переходах и посмотрите примеры на странице `useTransition`.](/reference/react/useTransition)

</Note>