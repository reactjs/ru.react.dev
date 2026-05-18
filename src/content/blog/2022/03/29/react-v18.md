---
title: "React v18.0"
author: The React Team
date: 2022/03/08
description: React 18 теперь доступен в npm! В нашем последнем посте мы поделились пошаговыми инструкциями по обновлению вашего приложения до React 18. В этом посте мы рассмотрим, что нового появилось в React 18 и что это значит для будущего.
---

29 марта 2022 г. от [Команды React](/community/team)

---

<Intro>

React 18 теперь доступен в npm! В нашем последнем посте мы поделились пошаговыми инструкциями по [обновлению вашего приложения до React 18](/blog/2022/03/08/react-18-upgrade-guide). В этом посте мы дадим обзор того, что нового в React 18, и что это значит для будущего.

</Intro>

---

Наша последняя основная версия включает улучшения, доступные "из коробки", такие как автоматическая группировка обновлений (automatic batching), новые API, такие как `startTransition`, и потоковую передачу рендеринга на стороне сервера с поддержкой Suspense.

Многие из функций React 18 построены на основе нашего нового конкурентного рендерера (concurrent renderer), который является внутренним изменением, открывающим мощные новые возможности. Конкурентный React является опциональным — он включается только тогда, когда вы используете конкурентную функцию — но мы думаем, что он окажет большое влияние на то, как люди создают приложения.

Мы потратили годы на исследования и разработку поддержки конкурентности в React, и мы позаботились о том, чтобы предоставить постепенный путь внедрения для существующих пользователей. Прошлым летом [мы сформировали рабочую группу React 18](/blog/2021/06/08/the-plan-for-react-18), чтобы собрать отзывы от экспертов сообщества и обеспечить плавный опыт обновления для всей экосистемы React.

Если вы пропустили, мы поделились многим из этого видения на React Conf 2021:

* В [основном докладе](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa) мы объясняем, как React 18 вписывается в нашу миссию по упрощению создания отличного пользовательского опыта для разработчиков.
* [Шрути Капур (Shruti Kapoor)](https://twitter.com/shrutikapoor08) [продемонстрировала, как использовать новые функции в React 18](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2).
* [Шаундай Персон (Shaundai Person)](https://twitter.com/shaundai) представила нам обзор [потоковой передачи рендеринга на стороне сервера с Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3).

Ниже представлен полный обзор того, что ожидать в этом релизе, начиная с конкурентного рендеринга.

<Note>

Для пользователей React Native, React 18 будет поставляться с новой архитектурой React Native. Для получения дополнительной информации, см. [основной доклад React Conf здесь](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## Что такое конкурентный React? {/*what-is-concurrent-react*/}

Самое важное дополнение в React 18 — это то, о чем мы надеемся, вы никогда не будете думать: конкурентность. Мы думаем, что это в значительной степени верно для разработчиков приложений, хотя для сопровождающих библиотек ситуация может быть немного сложнее.

Конкурентность — это не функция как таковая. Это новый внутренний механизм, который позволяет React одновременно подготавливать несколько версий вашего пользовательского интерфейса. Вы можете думать о конкурентности как о детали реализации — она ценна из-за функций, которые она открывает. React использует сложные методы в своей внутренней реализации, такие как очереди с приоритетами и множественное буферирование. Но вы не увидите этих концепций в наших публичных API.

Когда мы разрабатываем API, мы стараемся скрыть детали реализации от разработчиков. Как разработчик React, вы фокусируетесь на том, *каким* вы хотите видеть пользовательский опыт, а React обрабатывает *то, как* этот опыт будет доставлен. Поэтому мы не ожидаем, что разработчики React будут знать, как работает конкурентность "под капотом".

Однако конкурентный React важнее обычной детали реализации — это фундаментальное обновление основной модели рендеринга React. Поэтому, хотя знать, как работает конкурентность, не очень важно, возможно, стоит знать, что это такое на высоком уровне.

Ключевым свойством конкурентного React является то, что рендеринг может быть прерван. Когда вы впервые обновляетесь до React 18, прежде чем добавлять какие-либо конкурентные функции, обновления рендерятся так же, как и в предыдущих версиях React — в одной, непрерывной, синхронной транзакции. При синхронном рендеринге, как только обновление начинает рендериться, ничто не может его прервать, пока пользователь не увидит результат на экране.

В конкурентном рендеринге это не всегда так. React может начать рендерить обновление, приостановиться посередине, а затем продолжить позже. Он может даже полностью отказаться от рендеринга в процессе. React гарантирует, что пользовательский интерфейс будет выглядеть последовательно, даже если рендеринг прерван. Для этого он ждет выполнения мутаций DOM до конца, после того как все дерево будет оценено. Благодаря этой возможности React может подготавливать новые экраны в фоновом режиме, не блокируя основной поток. Это означает, что пользовательский интерфейс может немедленно реагировать на ввод пользователя, даже если он находится в середине большой задачи рендеринга, создавая плавный пользовательский опыт.

Другим примером является повторно используемое состояние. Конкурентный React может удалять части пользовательского интерфейса с экрана, а затем снова добавлять их позже, повторно используя предыдущее состояние. Например, когда пользователь переключается с экрана и возвращается обратно, React должен иметь возможность восстановить предыдущий экран в том же состоянии, в котором он был до этого. В предстоящем минорном релизе мы планируем добавить новый компонент под названием `<Offscreen>`, который реализует этот шаблон. Аналогично, вы сможете использовать `Offscreen` для подготовки нового пользовательского интерфейса в фоновом режиме, чтобы он был готов до того, как пользователь его отобразит.

Конкурентный рендеринг — это мощный новый инструмент в React, и большинство наших новых функций созданы для его использования, включая Suspense, переходы (transitions) и потоковую передачу рендеринга на стороне сервера. Но React 18 — это только начало того, что мы стремимся построить на этом новом фундаменте.

## Постепенное внедрение конкурентных функций {/*gradually-adopting-concurrent-features*/}

Технически, конкурентный рендеринг является обратно несовместимым изменением. Поскольку конкурентный рендеринг может быть прерван, компоненты ведут себя немного иначе, когда он включен.

В ходе нашего тестирования мы обновили тысячи компонентов до React 18. Мы обнаружили, что почти все существующие компоненты "просто работают" с конкурентным рендерингом без каких-либо изменений. Однако некоторые из них могут потребовать дополнительных усилий по миграции. Хотя изменения обычно незначительны, у вас все равно будет возможность вносить их в удобном для вас темпе. Новое поведение рендеринга в React 18 **включено только в тех частях вашего приложения, которые используют новые функции.**

Общая стратегия обновления заключается в том, чтобы ваше приложение работало на React 18 без нарушения существующего кода. Затем вы можете постепенно начать добавлять конкурентные функции в удобном для вас темпе. Вы можете использовать [`<StrictMode>`](/reference/react/StrictMode) для помощи в выявлении ошибок, связанных с конкурентностью, во время разработки. Strict Mode не влияет на поведение в продакшене, но во время разработки он будет выводить дополнительные предупреждения и дважды вызывать функции, которые должны быть идемпотентными. Он не обнаружит все, но будет эффективен в предотвращении наиболее распространенных типов ошибок.

После обновления до React 18 вы сможете немедленно начать использовать конкурентные функции. Например, вы можете использовать `startTransition` для навигации между экранами без блокировки ввода пользователя. Или `useDeferredValue` для замедления дорогостоящих повторных рендеров.

Однако в долгосрочной перспективе мы ожидаем, что основным способом добавления конкурентности в ваше приложение будет использование совместимой с конкурентностью библиотеки или фреймворка. В большинстве случаев вы не будете напрямую взаимодействовать с конкурентными API. Например, вместо того чтобы разработчики вызывали `startTransition` каждый раз, когда они переходят на новый экран, библиотеки маршрутизации будут автоматически оборачивать навигации в `startTransition`.

Библиотекам может потребоваться некоторое время для обновления, чтобы стать совместимыми с конкурентностью. Мы предоставили новые API, чтобы упростить библиотекам использование конкурентных функций. А пока, пожалуйста, будьте терпеливы с сопровождающими, пока мы работаем над постепенной миграцией экосистемы React.

Для получения дополнительной информации см. наш предыдущий пост: [Как обновиться до React 18](/blog/2022/03/08/react-18-upgrade-guide).

## Suspense в фреймворках для работы с данными {/*suspense-in-data-frameworks*/}

В React 18 вы можете начать использовать [Suspense](/reference/react/Suspense) для получения данных в специализированных фреймворках, таких как Relay, Next.js, Hydrogen или Remix. Получение данных "ad hoc" с помощью Suspense технически возможно, но все еще не рекомендуется в качестве общей стратегии.

В будущем мы можем предоставить дополнительные примитивы, которые могут упростить доступ к вашим данным с помощью Suspense, возможно, без использования специализированного фреймворка. Однако Suspense лучше всего работает, когда он глубоко интегрирован в архитектуру вашего приложения: ваш маршрутизатор, ваш слой данных и ваша среда рендеринга на сервере. Поэтому даже в долгосрочной перспективе мы ожидаем, что библиотеки и фреймворки будут играть решающую роль в экосистеме React.

Как и в предыдущих версиях React, вы также можете использовать Suspense для разделения кода на стороне клиента с помощью `React.lazy`. Но наше видение Suspense всегда было больше, чем просто загрузка кода — цель состоит в том, чтобы расширить поддержку Suspense, чтобы в конечном итоге один и тот же декларативный запасной вариант (fallback) Suspense мог обрабатывать любую асинхронную операцию (загрузку кода, данных, изображений и т. д.).

## Server Components все еще в разработке {/*server-components-is-still-in-development*/}

[**Server Components**](/blog/2020/12/21/data-fetching-with-react-server-components) — это предстоящая функция, которая позволяет разработчикам создавать приложения, охватывающие сервер и клиент, сочетая богатую интерактивность клиентских приложений с улучшенной производительностью традиционного серверного рендеринга. Server Components не связаны напрямую с Concurrent React, но они разработаны для лучшей работы с конкурентными функциями, такими как Suspense и потоковая передача рендеринга на сервере.

Server Components все еще находятся в экспериментальной стадии, но мы ожидаем выпустить первоначальную версию в минорном релизе 18.x. А пока мы работаем с фреймворками, такими как Next.js, Hydrogen и Remix, над продвижением предложения и подготовкой его к широкому внедрению.

## Что нового в React 18 {/*whats-new-in-react-18*/}

### Новая функция: Автоматическая группировка обновлений {/*new-feature-automatic-batching*/}

Группировка обновлений (Batching) — это когда React объединяет несколько обновлений состояния в один повторный рендер для повышения производительности. Без автоматической группировки мы группировали обновления только внутри обработчиков событий React. Обновления внутри промисов, `setTimeout`, нативных обработчиков событий или любых других событий по умолчанию не группировались в React. С автоматической группировкой эти обновления будут группироваться автоматически:


```js
// До: группировались только события React.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React будет рендерить дважды, по одному разу для каждого обновления состояния (без группировки)
}, 1000);

// После: обновления внутри тайм-аутов, промисов,
// нативных обработчиков событий или любых других событий группируются.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React будет перерисовываться только один раз в конце (это группировка!)
}, 1000);
```

Для получения дополнительной информации см. этот пост [Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21).

### Новая функция: Переходы {/*new-feature-transitions*/}

Переход (Transition) — это новая концепция в React для различения срочных и несрочных обновлений.

*   **Срочные обновления** отражают прямое взаимодействие, такое как ввод текста, нажатие кнопки и т. д.
*   **Переходы** переводят пользовательский интерфейс из одного вида в другой.

Срочные обновления, такие как ввод текста, нажатие кнопки или клавиши, требуют немедленного ответа, чтобы соответствовать нашим интуитивным представлениям о поведении физических объектов. В противном случае они ощущаются "неправильными". Однако переходы отличаются, потому что пользователь не ожидает видеть каждое промежуточное значение на экране.

Например, когда вы выбираете фильтр в выпадающем списке, вы ожидаете, что сама кнопка фильтра отреагирует немедленно при нажатии. Однако фактические результаты могут переходить отдельно. Небольшая задержка будет незаметной и часто ожидаемой. И если вы снова измените фильтр до того, как результаты будут полностью отрисованы, вас будут интересовать только последние результаты.

Как правило, для наилучшего пользовательского опыта одно взаимодействие с пользователем должно приводить как к срочному, так и к несрочному обновлению. Вы можете использовать API `startTransition` внутри события ввода, чтобы сообщить React, какие обновления являются срочными, а какие — "переходами":


```js
import { startTransition } from 'react';

// Срочное: Показать, что было введено
setInputValue(input);

// Пометить все обновления состояния внутри как переходы
startTransition(() => {
  // Переход: Показать результаты
  setSearchQuery(input);
});
```


Обновления, обернутые в `startTransition`, обрабатываются как несрочные и будут прерваны, если поступят более срочные обновления, такие как клики или нажатия клавиш. Если переход прерывается пользователем (например, при вводе нескольких символов подряд), React отбросит устаревшую работу по рендерингу, которая не была завершена, и отрендерит только последнее обновление.


*   `useTransition`: хук для запуска переходов, включая значение для отслеживания состояния ожидания.
*   `startTransition`: метод для запуска переходов, когда хук не может быть использован.

Переходы будут использовать конкурентный рендеринг, который позволяет прерывать обновление. Если контент повторно приостанавливается (suspends), переходы также сообщают React о необходимости продолжать отображать текущий контент во время рендеринга контента перехода в фоновом режиме (см. [RFC Suspense](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) для получения дополнительной информации).

[См. документацию по переходам здесь](/reference/react/useTransition).

### Новые функции Suspense {/*new-suspense-features*/}

Suspense позволяет декларативно указывать состояние загрузки для части дерева компонентов, если оно еще не готово к отображению:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense делает "состояние загрузки пользовательского интерфейса" первоклассной декларативной концепцией в модели программирования React. Это позволяет нам создавать на его основе функции более высокого уровня.

Мы представили ограниченную версию Suspense несколько лет назад. Однако единственным поддерживаемым сценарием использования было разделение кода с помощью `React.lazy`, и оно вообще не поддерживалось при рендеринге на сервере.

В React 18 мы добавили поддержку Suspense на сервере и расширили его возможности с использованием функций конкурентного рендеринга.

Suspense в React 18 лучше всего работает в сочетании с API переходов. Если вы приостанавливаетесь во время перехода, React предотвратит замену уже видимого контента запасным вариантом (fallback). Вместо этого React отложит рендеринг до тех пор, пока не будет загружено достаточно данных, чтобы избежать плохого состояния загрузки.

Подробнее см. в RFC для [Suspense в React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md).

### Новые API для рендеринга на клиенте и сервере {/*new-client-and-server-rendering-apis*/}

В этом релизе мы воспользовались возможностью переработать API, которые мы предоставляем для рендеринга на клиенте и сервере. Эти изменения позволяют пользователям продолжать использовать старые API в режиме React 17 во время обновления до новых API в React 18.

#### React DOM Client {/*react-dom-client*/}

Эти новые API теперь экспортируются из `react-dom/client`:

*   `createRoot`: Новый метод для создания корневого узла для `render` или `unmount`. Используйте его вместо `ReactDOM.render`. Новые функции в React 18 не работают без него.
*   `hydrateRoot`: Новый метод для гидратации приложения, отрендеренного на сервере. Используйте его вместо `ReactDOM.hydrate` в сочетании с новыми API React DOM Server. Новые функции в React 18 не работают без него.

И `createRoot`, и `hydrateRoot` принимают новую опцию `onRecoverableError` на случай, если вы хотите получать уведомления, когда React восстанавливается после ошибок во время рендеринга или гидратации для логирования. По умолчанию React будет использовать [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError) или `console.error` в старых браузерах.

[См. документацию по React DOM Client здесь](/reference/react-dom/client).

#### React DOM Server {/*react-dom-server*/}

Эти новые API теперь экспортируются из `react-dom/server` и имеют полную поддержку потоковой передачи Suspense на сервере:

*   `renderToPipeableStream`: для потоковой передачи в средах Node.
*   `renderToReadableStream`: для современных сред выполнения на границе сети (edge runtime), таких как Deno и Cloudflare workers.

Существующий метод `renderToString` продолжает работать, но не рекомендуется.

[См. документацию по React DOM Server здесь](/reference/react-dom/server).

### Новое поведение Strict Mode {/*new-strict-mode-behaviors*/}

В будущем мы хотели бы добавить функцию, которая позволит React добавлять и удалять части пользовательского интерфейса, сохраняя при этом состояние. Например, когда пользователь переключается с экрана и возвращается обратно, React должен иметь возможность немедленно отобразить предыдущий экран. Для этого React будет размонтировать и повторно монтировать деревья, используя то же состояние компонента, что и раньше.

Эта функция обеспечит лучшую производительность приложений React "из коробки", но требует, чтобы компоненты были устойчивы к многократному монтированию и уничтожению эффектов. Большинство эффектов будут работать без изменений, но некоторые эффекты предполагают, что они монтируются и уничтожаются только один раз.

Чтобы помочь выявить эти проблемы, React 18 вводит новую проверку в Strict Mode, предназначенную только для разработки. Эта новая проверка будет автоматически размонтировать и повторно монтировать каждый компонент, когда компонент монтируется впервые, восстанавливая предыдущее состояние при втором монтировании.

До этого изменения React монтировал компонент и создавал эффекты:

```
* React монтирует компонент.
  * Создаются эффекты макета (Layout effects).
  * Создаются эффекты (Effects).
```

Со Strict Mode в React 18 React будет симулировать размонтирование и повторное монтирование компонента в режиме разработки:

```
* React монтирует компонент.
  * Создаются эффекты макета (Layout effects).
  * Создаются эффекты (Effects).
* React симулирует размонтирование компонента.
  * Уничтожаются эффекты макета (Layout effects).
  * Уничтожаются эффекты (Effects).
* React симулирует монтирование компонента с предыдущим состоянием.
  * Создаются эффекты макета (Layout effects).
  * Создаются эффекты (Effects).
```

[См. документацию по обеспечению повторно используемого состояния здесь](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### Новые хуки {/*new-hooks*/}

#### useId {/*useid*/}

`useId` — это новый хук для генерации уникальных идентификаторов как на клиенте, так и на сервере, избегая при этом несоответствий при гидратации. Он в основном полезен для библиотек компонентов, интегрирующихся с API доступности, требующими уникальных идентификаторов. Это решает проблему, которая уже существует в React 17 и ниже, но становится еще более важной в React 18 из-за того, как новый потоковый серверный рендерер доставляет HTML вне порядка. [См. документацию здесь](/reference/react/useId).

> Примечание
>
> `useId` **не** предназначен для генерации [ключей в списке](/learn/rendering-lists#where-to-get-your-key). Ключи должны генерироваться из ваших данных.

#### useTransition {/*usetransition*/}

`useTransition` и `startTransition` позволяют помечать некоторые обновления состояния как несрочные. Другие обновления состояния по умолчанию считаются срочными. React позволит срочным обновлениям состояния (например, обновлению текстового поля) прерывать несрочные обновления состояния (например, рендеринг списка результатов поиска). [См. документацию здесь](/reference/react/useTransition).

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` позволяет отложить повторный рендеринг несрочной части дерева. Это похоже на "debouncing", но имеет несколько преимуществ по сравнению с ним. Нет фиксированной временной задержки, поэтому React попытается отложенный рендеринг сразу после того, как первый рендер будет отражен на экране. Отложенный рендеринг может быть прерван и не блокирует ввод пользователя. [См. документацию здесь](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` — это новый хук, который позволяет внешним хранилищам поддерживать конкурентные чтения, принудительно синхронизируя обновления хранилища. Он устраняет необходимость в `useEffect` при реализации подписок на внешние источники данных и рекомендуется для любых библиотек, которые интегрируются с состоянием вне React. [См. документацию здесь](/reference/react/useSyncExternalStore).

> Примечание
>
> `useSyncExternalStore` предназначен для использования библиотеками, а не кодом приложения.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` — это новый хук, который позволяет библиотекам CSS-in-JS решать проблемы производительности при внедрении стилей во время рендеринга. Если вы еще не создали библиотеку CSS-in-JS, мы не ожидаем, что вы когда-либо будете использовать это. Этот хук будет выполняться после мутации DOM, но до того, как эффекты макета (layout effects) прочитают новый макет. Это решает проблему, которая уже существует в React 17 и ниже, но становится еще более важной в React 18, поскольку React уступает управление браузеру во время конкурентного рендеринга, давая ему возможность пересчитать макет. [См. документацию здесь](/reference/react/useInsertionEffect).

> Примечание
>
> `useInsertionEffect` предназначен для использования библиотеками, а не кодом приложения.

## Как обновиться {/*how-to-upgrade*/}

См. [Как обновиться до React 18](/blog/2022/03/08/react-18-upgrade-guide) для пошаговых инструкций и полного списка обратно несовместимых и значительных изменений.

## Журнал изменений {/*changelog*/}

### React {/*react*/}

* Добавлены `useTransition` и `useDeferredValue` для разделения срочных обновлений и переходов. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) от [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii) и [@sebmarkbage](https://github.com/sebmarkbage))
* Добавлен `useId` для генерации уникальных идентификаторов. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) от [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan) и [@sebmarkbage](https://github.com/sebmarkbage))
* Добавлен `useSyncExternalStore` для помощи библиотекам внешних хранилищ в интеграции с React. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) от [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn) и [@drarmstr](https://github.com/drarmstr))
* Добавлена `startTransition` как версия `useTransition` без обратной связи о состоянии ожидания. ([#19696](https://github.com/facebook/react/pull/19696) от [@rickhanlonii](https://github.com/rickhanlonii))
* Добавлен `useInsertionEffect` для библиотек CSS-in-JS. ([#21913](https://github.com/facebook/react/pull/21913) от [@rickhanlonii](https://github.com/rickhanlonii))
* Suspense теперь повторно монтирует эффекты макета при повторном появлении контента. ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) от [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn) и [@lunaruan](https://github.com/lunaruan))
* `<StrictMode>` теперь повторно запускает эффекты для проверки восстанавливаемого состояния. ([#19523](https://github.com/facebook/react/pull/19523), [#21418](https://github.com/facebook/react/pull/21418) от [@bvaughn](https://github.com/bvaughn) и [@lunaruan](https://github.com/lunaruan))
* Предполагается, что Symbols всегда доступны. ([#23348](https://github.com/facebook/react/pull/23348) от [@sebmarkbage](https://github.com/sebmarkbage))
* Удален полифилл `object-assign`. ([#23351](https://github.com/facebook/react/pull/23351) от [@sebmarkbage](https://github.com/sebmarkbage))
* Удален неподдерживаемый API `unstable_changedBits`. ([#20953](https://github.com/facebook/react/pull/20953) от [@acdlite](https://github.com/acdlite))
* Компоненты теперь могут рендерить `undefined`. ([#21869](https://github.com/facebook/react/pull/21869) от [@rickhanlonii](https://github.com/rickhanlonii))
* Эффекты, вызванные дискретными событиями, такими как клики, теперь синхронно применяются. ([#21150](https://github.com/facebook/react/pull/21150) от [@acdlite](https://github.com/acdlite))
* `fallback={undefined}` в Suspense теперь ведет себя так же, как `null`, и не игнорируется. ([#21854](https://github.com/facebook/react/pull/21854) от [@rickhanlonii](https://github.com/rickhanlonii))
* Все `lazy()` теперь считаются эквивалентными одному и тому же компоненту. ([#20357](https://github.com/facebook/react/pull/20357) от [@sebmarkbage](https://github.com/sebmarkbage))
* Консоль больше не перехватывается во время первого рендеринга. ([#22308](https://github.com/facebook/react/pull/22308) от [@lunaruan](https://github.com/lunaruan))
* Улучшено использование памяти. ([#21039](https://github.com/facebook/react/pull/21039) от [@bgirard](https://github.com/bgirard))
* Улучшены сообщения об ошибках при приведении строк (Temporal.*, Symbol и т. д.). ([#22064](https://github.com/facebook/react/pull/22064) от [@justingrant](https://github.com/justingrant))
* Используется `setImmediate` вместо `MessageChannel`, если доступно. ([#20834](https://github.com/facebook/react/pull/20834) от [@gaearon](https://github.com/gaearon))
* Исправлена ошибка, из-за которой контекст не передавался внутри подвешенных деревьев. ([#23095](https://github.com/facebook/react/pull/23095) от [@gaearon](https://github.com/gaearon))
* Исправлена ошибка, из-за которой `useReducer` мог наблюдать некорректные пропсы, путем удаления механизма раннего выхода. ([#22445](https://github.com/facebook/react/pull/22445) от [@josephsavona](https://github.com/josephsavona))
* Исправлена ошибка, из-за которой `setState` игнорировался в Safari при добавлении iframe. ([#23111](https://github.com/facebook/react/pull/23111) от [@gaearon](https://github.com/gaearon))
* Исправлен сбой при рендеринге `ZonedDateTime` в дереве. ([#20617](https://github.com/facebook/react/pull/20617) от [@dimaqq](https://github.com/dimaqq))
* Исправлен сбой при установке `document` в `null` в тестах. ([#22695](https://github.com/facebook/react/pull/22695) от [@SimenB](https://github.com/SimenB))
* Исправлена ошибка, из-за которой `onLoad` не срабатывал при включенных конкурентных функциях. ([#23316](https://github.com/facebook/react/pull/23316) от [@gnoff](https://github.com/gnoff))
* Исправлено предупреждение при возврате `NaN` селектором. ([#23333](https://github.com/facebook/react/pull/23333) от [@hachibeeDI](https://github.com/hachibeeDI))
* Исправлен сбой при установке `document` в `null` в тестах. ([#22695](https://github.com/facebook/react/pull/22695) от [@SimenB](https://github.com/SimenB))
* Исправлен сгенерированный заголовок лицензии. ([#23004](https://github.com/facebook/react/pull/23004) от [@vitaliemiron](https://github.com/vitaliemiron))
* Добавлен `package.json` как одна из точек входа. ([#22954](https://github.com/facebook/react/pull/22954) от [@Jack](https://github.com/Jack-Works))
* Разрешено приостанавливать выполнение вне границы Suspense. ([#23267](https://github.com/facebook/react/pull/23267) от [@acdlite](https://github.com/acdlite))
* Регистрируется восстанавливаемая ошибка всякий раз, когда гидратация не удается. ([#23319](https://github.com/facebook/react/pull/23319) от [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* Добавлены `createRoot` и `hydrateRoot`. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) от [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm) и [@sebmarkbage](https://github.com/sebmarkbage))
* Добавлена выборочная гидратация. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) от [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm) и [@sebmarkbage](https://github.com/sebmarkbage))
* Добавлен `aria-description` в список известных ARIA-атрибутов. ([#22142](https://github.com/facebook/react/pull/22142) от [@mahyareb](https://github.com/mahyareb))
* Добавлено событие `onResize` для видеоэлементов. ([#21973](https://github.com/facebook/react/pull/21973) от [@rileyjshaw](https://github.com/rileyjshaw))
* Добавлены `imageSizes` и `imageSrcSet` в известные пропсы. ([#22550](https://github.com/facebook/react/pull/22550) от [@eps1lon](https://github.com/eps1lon))
* Разрешено использовать нестроковые дочерние элементы `<option>`, если предоставлено значение `value`. ([#21431](https://github.com/facebook/react/pull/21431) от [@sebmarkbage](https://github.com/sebmarkbage))
* Исправлена ошибка, из-за которой стиль `aspectRatio` не применялся. ([#21100](https://github.com/facebook/react/pull/21100) от [@gaearon](https://github.com/gaearon))
* Предупреждение при вызове `renderSubtreeIntoContainer`. ([#23355](https://github.com/facebook/react/pull/23355) от [@acdlite](https://github.com/acdlite))

### React DOM Server {/*react-dom-server-1*/}

* Добавлен новый потоковый рендерер. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) от [@sebmarkbage](https://github.com/sebmarkbage))
* Исправлена ошибка с провайдерами контекста в SSR при обработке нескольких запросов. ([#23171](https://github.com/facebook/react/pull/23171) от [@frandiox](https://github.com/frandiox))
* Откат к рендерингу на клиенте при несоответствии текста. ([#23354](https://github.com/facebook/react/pull/23354) от [@acdlite](https://github.com/acdlite))
* Устаревший `renderToNodeStream`. ([#23359](https://github.com/facebook/react/pull/23359) от [@sebmarkbage](https://github.com/sebmarkbage))
* Исправлена ложная запись об ошибке в новом серверном рендерере. ([#24043](https://github.com/facebook/react/pull/24043) от [@eps1lon](https://github.com/eps1lon))
* Исправлена ошибка в новом серверном рендерере. ([#22617](https://github.com/facebook/react/pull/22617) от [@shuding](https://github.com/shuding))
* Игнорируются значения функций и символов внутри пользовательских элементов на сервере. ([#21157](https://github.com/facebook/react/pull/21157) от [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* Выбрасывается исключение при использовании `act` в продакшене. ([#21686](https://github.com/facebook/react/pull/21686) от [@acdlite](https://github.com/acdlite))
* Поддержка отключения ложных предупреждений `act` с помощью `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/facebook/react/pull/22561) от [@acdlite](https://github.com/acdlite))
* Расширено предупреждение `act` для охвата всех API, которые могут планировать работу React. ([#22607](https://github.com/facebook/react/pull/22607) от [@acdlite](https://github.com/acdlite))
* `act` теперь группирует обновления. ([#21797](https://github.com/facebook/react/pull/21797) от [@acdlite](https://github.com/acdlite))
* Удалено предупреждение о "висящих" пассивных эффектах. ([#22609](https://github.com/facebook/react/pull/22609) от [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Отслеживание поздно смонтированных корней в Fast Refresh. ([#22740](https://github.com/facebook/react/pull/22740) от [@anc95](https://github.com/anc95))
* Добавлено поле `exports` в `package.json`. ([#23087](https://github.com/facebook/react/pull/23087) от [@otakustay](https://github.com/otakustay))

### Server Components (Experimental) {/*server-components-experimental*/}

* Добавлена поддержка Server Context. ([#23244](https://github.com/facebook/react/pull/23244) от [@salazarm](https://github.com/salazarm))
* Добавлена поддержка `lazy`. ([#24068](https://github.com/facebook/react/pull/24068) от [@gnoff](https://github.com/gnoff))
* Обновлен плагин webpack для webpack 5 ([#22739](https://github.com/facebook/react/pull/22739) от [@michenly](https://github.com/michenly))
* Исправлена ошибка в Node loader. ([#22537](https://github.com/facebook/react/pull/22537) от [@btea](https://github.com/btea))
* Использование `globalThis` вместо `window` для сред выполнения Edge. ([#22777](https://github.com/facebook/react/pull/22777) от [@huozhi](https://github.com/huozhi))
