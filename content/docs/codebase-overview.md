---
id: codebase-overview
title: Устройство кодовой базы
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

В этой главе вы узнаете об устройстве кодовой базы React, используемых соглашениях и реализации.

Если вы хотите [внести свой вклад в React](/docs/how-to-contribute.html), то мы надеемся, что эта глава вам поможет.

Мы считаем, что вам не обязательно следовать этим соглашениям в ваших React-приложениях. Многие из этих соглашений существуют по историческим причинам и могут быть изменены со временем.

### Top-Level Folders {#top-level-folders}

После клонирования [репозитория React](https://github.com/facebook/react) вы увидите папки верхнего уровня:

<<<<<<< HEAD
* [`packages`](https://github.com/facebook/react/tree/master/packages) содержит метаданные (такие как `package.json`) и исходный код (подпапка `src`) для каждого пакета из репозитория React. **Большая часть работы с кодом происходит в подпапках `src` внутри каждого пакета.**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) содержит несколько небольших React-приложений для контрибьютеров.
* `build` содержит скомпилированную версию React. Этого каталога нет в репозитории, но он появится после того, как вы [соберёте проект](/docs/how-to-contribute.html#development-workflow) в первый раз.
=======
* [`packages`](https://github.com/facebook/react/tree/main/packages) contains metadata (such as `package.json`) and the source code (`src` subdirectory) for all packages in the React repository. **If your change is related to the code, the `src` subdirectory of each package is where you'll spend most of your time.**
* [`fixtures`](https://github.com/facebook/react/tree/main/fixtures) contains a few small React test applications for contributors.
* `build` is the build output of React. It is not in the repository but it will appear in your React clone after you [build it](/docs/how-to-contribute.html#development-workflow) for the first time.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

Документация расположена в [отдельном репозитории](https://github.com/reactjs/reactjs.org).

Существуют ещё несколько вспомогательных верхнеуровневых папок. Но вы, вероятно, не столкнётесь с ними при изменении кода.

### Тесты {#colocated-tests}

У нас нет отдельной верхнеуровневой папки с юнит тестами. Вместо этого, мы помещаем их в папку `__tests__`, расположенную рядом с тестируемыми файлами.

Например, тесты для [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) расположены в [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js).

### Предупреждения и инварианты {#warnings-and-invariants}

Предупреждения в React выводятся через `console.error`.

```js
if (__DEV__) {
  console.error('Что-то не так.');
}
```

Предупреждения включены только в режиме разработки и полностью вырезаны из продакшена. Если вам необходимо запретить выполнение какого-либо кода, тогда используйте модуль `invariant`:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'Ты не пройдёшь!'
);
```

**Если условие внутри `invariant` равно `false`, тогда выбрасывается исключение.**

"Инварианты" -- это всего лишь способ сказать: "Условие всегда истинно". Вы можете думать о них как об утверждениях (assertion).

Важно чтобы режимы разработки и продакшена имели похожее поведение, поэтому исключения выбрасываются в обоих режимах. Сообщения об ошибках в продакшене автоматически заменяются кодами ошибок, для того, чтобы избежать разрастания бандла.

### Режимы разработки и продакшена {#development-and-production}

Вы можете использовать псевдоглобальную переменную `__DEV__`, чтобы блок кода присутствовал только в режиме разработки.

На этапе компиляции добавится проверка `process.env.NODE_ENV !== 'production'`, определяющая, должен ли данный блок кода присутствовать в сборке CommonJS.

Выражение будет равно `true` в неминифицированной сборке, а в минифицированной будет вырезан весь блок вместе с `if`.

```js
if (__DEV__) {
  // Этот код будет выполнен только в режиме разработки.
}
```

### Flow {#flow}

Недавно мы представили статический анализатор [Flow](https://flow.org/). Файлы, помеченные аннотацией `@flow` в заголовке после лицензии, будут подвергнуты проверке типов.

Мы принимаем пулл реквесты [на дополнение аннотаций Flow в уже существующий код](https://github.com/facebook/react/pull/7600/files). Вот пример кода:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

Новый код, если это возможно, должен использовать Flow. Вы можете выполнить `yarn`&nbsp`flow`, чтобы произвести проверку типов.

### Множество пакетов {#multiple-packages}

React является [монолитным репозиторием](https://danluu.com/monorepo/). Он содержит множество отдельных пакетов, чтобы изменения были согласованными, а проблемы решались в одном месте.

### Ядро React {#react-core}

Ядро включает в себя весь [верхнеуровневый API](/docs/top-level-api.html#react), например:

* `React.createElement()`
* `React.Component`
* `React.Children`

**Ядро включает в себя только API необходимый для объявления компонентов.** Оно не включает [алгоритм согласования](/docs/reconciliation.html) или какой-либо платформо-специфический код. Этот код находится в компонентах React DOM и React Native.

<<<<<<< HEAD
Код ядра расположен в папке [`packages/react`](https://github.com/facebook/react/tree/master/packages/react). Он доступен в npm в виде пакета [`react`](https://www.npmjs.com/package/react). Соответствующая сборка для браузера экспортирует глобальную переменную `React` и называется `react.js`.
=======
The code for React core is located in [`packages/react`](https://github.com/facebook/react/tree/main/packages/react) in the source tree. It is available on npm as the [`react`](https://www.npmjs.com/package/react) package. The corresponding standalone browser build is called `react.js`, and it exports a global called `React`.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

### Рендереры {#renderers}

Изначально React создавался для DOM, но позже был адаптирован к другим платформам, таким как [React Native](https://reactnative.dev/). В этом разделе мы расскажем об используемых рендерерах.

**Рендереры превращают React дерево в платформо-специфический код.**

<<<<<<< HEAD
Они расположены в каталоге [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) рендерит React-компоненты в DOM. Он реализует [`ReactDOM` API](/docs/react-dom.html) и доступен как пакет [`react-dom`](https://www.npmjs.com/package/react-dom) из npm репозитория. Можно подключать как отдельный бандл `react-dom.js`, экспортирующий глобальную переменную `ReactDOM`.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) рендерит React компоненты в нативные представления. Используется внутри React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) рендерит React компоненты в JSON-дерево. Используется при [тестировании снимками](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) через фреймворк [Jest](https://facebook.github.io/jest) и доступен как пакет [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) в npm.

Мы начали поддерживать единственный неофициальный рендерер [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art), который раньше находился в отдельном [GitHub-репозитории](https://github.com/reactjs/react-art).
=======
Renderers are also located in [`packages/`](https://github.com/facebook/react/tree/main/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/main/packages/react-dom) renders React components to the DOM. It implements [top-level `ReactDOM` APIs](/docs/react-dom.html) and is available as [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. It can also be used as standalone browser bundle called `react-dom.js` that exports a `ReactDOM` global.
* [React Native Renderer](https://github.com/facebook/react/tree/main/packages/react-native-renderer) renders React components to native views. It is used internally by React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/main/packages/react-test-renderer) renders React components to JSON trees. It is used by the [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) feature of [Jest](https://facebook.github.io/jest) and is available as [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

The only other officially supported renderer is [`react-art`](https://github.com/facebook/react/tree/main/packages/react-art). It used to be in a separate [GitHub repository](https://github.com/reactjs/react-art) but we moved it into the main source tree for now.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

>**Примечание:**
>
<<<<<<< HEAD
>Технически [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) -- это очень тонкий слой, который учит React взаимодействовать с React Native. Платформо-специфический код, управляющий нативными представлениями, расположен в [репозитории React Native](https://github.com/facebook/react-native) вместе с его компонентами.
=======
>Technically the [`react-native-renderer`](https://github.com/facebook/react/tree/main/packages/react-native-renderer) is a very thin layer that teaches React to interact with React Native implementation. The real platform-specific code managing the native views lives in the [React Native repository](https://github.com/facebook/react-native) together with its components.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

### Согласователи {#reconcilers}

Даже очень непохожим рендерерам, таким как React DOM и React Native, необходимо разделять много логики. В частности, реализации [алгоритма согласования](/docs/reconciliation.html) должны быть настолько похожими, чтобы декларативный рендеринг, пользовательские компоненты, состояние, методы жизненного цикла и рефы работали одинаково между различными платформами.

В качестве решения, различные рендереры имеют между собой общий код. В React мы называем эту часть «согласователь». Когда запланировано такое обновление, как `setState()`, согласователь вызывает `render()` в дереве компонентов и монтирует, обновляет либо размонтирует их.

Согласователи не являются отдельнымы пакетами, потому что не имеют открытого API. Вместо этого они используются исключительно такими рендерерами как React DOM и React Native.

### Согласователь Stack {#stack-reconciler}

Cогласователь «Stack» -- это реализация, которая использовалась в React 15 и более ранних версиях. Мы перестали его использовать, но задокументировали в [следующией главе](/docs/implementation-notes.html).

### Cоглаcователь Fiber {#fiber-reconciler}

В согласователе «Fiber» мы пытаемся исправить давно существующие ошибки и решить проблемы, появившиеся в согласователе Stack.

Его основными целями являются:

* Разделение прерываемых задач на подзадачи.
* Дать задачам приоритеты, иметь возможность перемещать их и переиспользовать.
* Иметь возможность перемещаться вперёд и назад между родителями и детьми в разметке React.
* Иметь возможность возвращать множество элементов из метода `render()`.
* Улучшенная обработка ошибок.

Вы можете узнать больше об архитектуре React Fiber [здесь](https://github.com/acdlite/react-fiber-architecture) и [здесь](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). Несмотря на то, что он включён в React 16, асинхронная функциональность по умолчанию не включена.

<<<<<<< HEAD
Исходный код расположен в папке [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).
=======
Its source code is located in [`packages/react-reconciler`](https://github.com/facebook/react/tree/main/packages/react-reconciler).
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

### Система событий {#event-system}

<<<<<<< HEAD
Для большей кроссбраузерной совместимости в React реализован слой, инкапсулирующий работу с нативными событиями. Его исходный код расположен в каталоге [`packages/react-dom/src/events`](https://github.com/facebook/react/tree/master/packages/react-dom/src/events).
=======
React implements a layer over native events to smooth out cross-browser differences. Its source code is located in [`packages/react-dom/src/events`](https://github.com/facebook/react/tree/main/packages/react-dom/src/events).
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

### Что дальше? {#what-next}

В [следующей главе](/docs/implementation-notes.html) вы познакомитесь с реализацией согласователя (версий React 15 и ранее) более подробно. Для нового согласователя мы ещё не писали документацию.
