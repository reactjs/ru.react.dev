---
id: concurrent-mode-reference
title: Справочник API конкурентного режима (экспериментально)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Внимание:
>
>На странице описаны **экспериментальные функции, которых еще нет в стабильной версии**. Не используйте экспериментальные сборки React в продакшен-приложениях. Эти функции могут значительно измениться без предупреждения перед тем, как попасть в React.
>
>Эта документация предназначена для ранних пользователей и интересующихся. Если вы новичок в React, не беспокойтесь об этих возможностях -- вам не нужно изучать их прямо сейчас.

</div>

Страница содержит справочник API [конкурентного режима](/docs/concurrent-mode-intro.html) React. Если вам нужно вводное руководство по этому режиму, прочитайте о [паттернах конкурентного UI](/docs/concurrent-mode-patterns.html).

**Примечание: это не стабильный релиз, а предварительная версия для сообщества. Скорее всего, в будущем API изменится. Используйте его на свой страх и риск!**

- [Включение конкурентного режима](#concurrent-mode)
    - [`createRoot`](#createroot)
    - [`createBlockingRoot`](#createblockingroot)
- [API задержек](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## Включение конкурентного режима {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

Заменяет `ReactDOM.render(<App />, rootNode)` и включает конкурентный режим.

Дополнительную информацию можно узнать в [документации конкурентного режима](/docs/concurrent-mode-intro.html).

### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

Заменяет `ReactDOM.render(<App />, rootNode)` и включает [блокирующий режим](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode).

Для реализации конкурентного режима решено сделать семантические изменения в работе React. Это значит, что вы не сможете использовать конкурентный режим лишь для некоторых компонентов проекта. И как следствие, не все приложения можно будет напрямую перевести на конкурентный режим.

Блокирующий режим содержит небольшую часть возможностей конкурентного режима. Он предназначен в качестве промежуточного этапа для приложений, которые нельзя мигрировать напрямую.

## API задержек {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` даёт возможность вашим компонентам "ждать", отображая запасное состояние, прежде чем они будут отрендерены.

В примере `ProfileDetails` получают данные с помощью асинхронного вызова. Во время ожидания загрузки `ProfileDetails` и `ProfilePhoto`, отображается запасной заголовок `Loading...`. Важно отметить, что до тех пор, пока все дочерние компоненты `<Suspense>` не отрендерены, мы будем видеть запасное состояние.

`Suspense` принимает два пропса:
* **fallback** принимает индикатор загрузки. Запасное состояние отображается до тех пор, пока не завершится рендер всех дочерних компонентов `Suspense`.
* **unstable_avoidThisFallback** принимает логическое значение. Оно сообщает React, что не нужно отображать запасное состояние при первоначальной загрузке. Скорее всего, этот API будет исключён в будущих релизах.

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` помогает скоординировать загрузку множества компонентов с помощью определения порядка, в котором они будут показываться пользователю.

Бывают ситуации, когда нескольким компонентам требуется получить данные, последовательность загрузки которых нельзя предсказать заранее. Если обернуть такие компоненты в `SuspenseList`, то React не покажет компонент из списка до тех пор, пока не будет отображён предыдущий (этим поведением можно управлять).

`SuspenseList` принимает два пропса:
* **revealOrder (forwards, backwards, together)** определяет последовательность, в которой отображаются дочерние компоненты `SuspenseList`.
  * `together` позволяет отобразить *все* компоненты одновременно вместо того, чтобы показывать их последовательно.
* **tail (collapsed, hidden)** определяет, как отображаются компоненты из `SuspenseList`, которые ещё не загружены.
    * По умолчанию `SuspenseList` отображает запасные состояния для всех компонентов в списке.
    * `collapsed` показывает запасное состояние только для компонента, который будет загружен следующим.
    * `hidden` не показывает компоненты, которые ещё не загружены.

Учтите, что `SuspenseList` управляет только ближайшими вложенными компонентами `Suspense` и `SuspenseList`. Поиск осуществляется не более, чем на один уровень вниз, но при этом можно делать многоуровневые вложения `SuspenseList` для построения более сложной разметки.

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` позволяет не отображать состояние загрузки, когда контент обновляется перед **переходом к следующему экрану**. Это также позволяет компонентам так откладывать более медленные обновления выборки данных до последующих рендеров, что более важные обновления могут быть выполнены немедленно.

Хук `useTransition` возвращает массив из двух элементов.

* `startTransition` -- это функция, которая получает колбэк. Её используют, чтобы сообщить React, какое состояние нам нужно отложить.
* `isPending` -- это логическое значение, которое позволяет React проинформировать нас, ожидаем ли мы в данный момент окончания перехода.

**Если обновление состояния компонента является причиной задержки, то его нужно обернуть по паттерну перехода.**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

В этом примере мы обернули получение данных в функцию `startTransition`. Это позволяет сразу загружать данные профиля пользователя, откладывая рендер страницы и компонента `Spinner` на 2 секунды (время указано в `timeoutMs`).

Логическое значение `isPending` показывает, что наш компонент в состоянии перехода. Это позволяет, находясь на предыдущем экране, показать пользователю сообщение о загрузке.

**Паттерн перехода более подробно рассматривается в разделе [Паттерны конкурентного UI](/docs/concurrent-mode-patterns.html#transitions).**

#### Конфигурирование useTransition {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

Хук `useTransition` принимает **объект настройки задержек** со свойством `timeoutMs`. Этот тайм-аут, заданный в миллисекундах, указывает React, сколько времени нужно ждать появления следующего состояния, например, как это было сделано в программе выше.

**Примечание: мы рекомендуем делать объект настройки задержек глобальным для всех модулей проекта.**

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

Возвращает отложенную версию значения, которое может «отставать» от него не более чем на `timeoutMs`.

Это обычно используется для создания отзывчивого интерфейса, когда нужно что-то немедленно отрендерить на основе пользовательского ввода и что-то при этом ожидает загрузки данных.

Хорошим примером является ввод текста.

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 });

  return (
    <div className="App">
      {/* При вводе текста ... */}
      <input value={text} onChange={handleChange} />
      ...
      {/* ... в случае "зависания" можно показать список со значением ожидания */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

Это позволяет нам немедленно начать отображать новый текст для `input`, что позволяет странице чувствовать себя отзывчивой. Между тем, `MySlowList` "отстает" на 2 секунды в соответствии с` timeoutMs` перед обновлением, что позволяет выполнять рендеринг с текущим текстом в фоновом режиме.```

**Паттерн ожидания значений более подробно рассматривается в разделе [Паттерны конкурентного UI](/docs/concurrent-mode-patterns.html#deferring-a-value).**

#### Конфигурирование useDeferredValue {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue` принимает **объект настройки задержек** со свойством `timeoutMs`. Этот тайм-аут (в миллисекундах) сообщает React, на сколько долго отложенное значение может отставать.

React будет пытаться использовать более короткую задержку, когда сеть и устройство это позволяют.
