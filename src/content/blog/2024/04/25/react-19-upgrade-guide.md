---
title: "React 19 Upgrade Guide"
author: Ricky Hanlon
date: 2024/04/25
description: Улучшения, добавленные в React 19, требуют некоторых критических изменений, но мы постарались сделать обновление максимально плавным и не ожидаем, что эти изменения затронут большинство приложений. В этой статье мы проведем вас через шаги по обновлению приложений и библиотек до React 19.
---

25 апреля 2024 г. от [Ricky Hanlon](https://twitter.com/rickhanlonii)

---


<Intro>

Улучшения, добавленные в React 19, требуют некоторых изменений, нарушающих обратную совместимость, но мы постарались сделать обновление максимально плавным, и не ожидаем, что эти изменения повлияют на большинство приложений.

</Intro>

<Note>

#### Также опубликован React 18.3 {/*react-18-3*/}

Чтобы облегчить переход на React 19, мы опубликовали релиз `react@18.3`, который идентичен 18.2, но добавляет предупреждения об устаревших API и других изменениях, необходимых для React 19.

Мы рекомендуем сначала обновиться до React 18.3, чтобы выявить возможные проблемы перед обновлением до React 19.

Список изменений в 18.3 см. в [Заметках к релизу](https://github.com/facebook/react/blob/main/CHANGELOG.md#1830-april-25-2024).

</Note>

В этой статье мы проведем вас через шаги по обновлению до React 19:

- [Установка](#installing)
- [Codemods](#codemods)
- [Изменения, нарушающие обратную совместимость](#breaking-changes)
- [Новые устаревшие функции](#new-deprecations)
- [Заметные изменения](#notable-changes)
- [Изменения TypeScript](#typescript-changes)
- [Changelog](#changelog)

Если вы хотите помочь нам протестировать React 19, следуйте инструкциям в этом руководстве по обновлению и [сообщайте о любых проблемах](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D), с которыми вы столкнетесь. Список новых функций, добавленных в React 19, см. в [посте о релизе React 19](/blog/2024/12/05/react-19).

---
## Установка {/*installing*/}

<Note>

#### Новый JSX-трансформатор теперь обязателен {/*new-jsx-transform-is-now-required*/}

Мы представили [новый JSX-трансформатор](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) в 2020 году для улучшения размера сборки и использования JSX без импорта React. В React 19 мы добавляем дополнительные улучшения, такие как использование `ref` в качестве пропса и улучшения скорости JSX, которые требуют нового трансформатора.

Если новый трансформатор не включен, вы увидите это предупреждение:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Ваше приложение (или одна из его зависимостей) использует устаревший JSX-трансформатор. Обновитесь до современного JSX-трансформатора для повышения производительности: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


Мы ожидаем, что большинство приложений не пострадают, так как трансформатор уже включен в большинстве сред. Инструкции по обновлению вручную см. в [анонсе](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>


Чтобы установить последнюю версию React и React DOM:

```bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0
```

Или, если вы используете Yarn:

```bash
yarn add --exact react@^19.0.0 react-dom@^19.0.0
```

Если вы используете TypeScript, вам также необходимо обновить типы.
```bash
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Или, если вы используете Yarn:
```bash
yarn add --exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Мы также включаем codemod для наиболее распространенных замен. См. [Изменения TypeScript](#typescript-changes) ниже.

## Codemods {/*codemods*/}

Чтобы помочь с обновлением, мы сотрудничали с командой [codemod.com](https://codemod.com) для публикации codemods, которые автоматически обновят ваш код до многих новых API и паттернов в React 19.

Все codemods доступны в репозитории [`react-codemod`](https://github.com/reactjs/react-codemod), и команда Codemod присоединилась к поддержке codemods. Для запуска этих codemods мы рекомендуем использовать команду `codemod` вместо `react-codemod`, поскольку она работает быстрее, обрабатывает более сложные миграции кода и обеспечивает лучшую поддержку TypeScript.


<Note>

#### Запуск всех codemods React 19 {/*run-all-react-19-codemods*/}

Запустите все codemods, перечисленные в этом руководстве, с помощью рецепта `codemod` для React 19:

```bash
npx codemod@latest react/19/migration-recipe
```

Это запустит следующие codemods из `react-codemod`:
- [`replace-reactdom-render`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-reactdom-render)
- [`replace-string-ref`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-string-ref)
- [`replace-act-import`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-act-import)
- [`replace-use-form-state`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-use-form-state)
- [`prop-types-typescript`](https://github.com/reactjs/react-codemod#react-proptypes-to-prop-types)

Это не включает изменения TypeScript. См. [Изменения TypeScript](#typescript-changes) ниже.

</Note>

Изменения, включающие codemod, сопровождаются командой ниже.

Список всех доступных codemods см. в репозитории [`react-codemod`](https://github.com/reactjs/react-codemod).

## Изменения, нарушающие обратную совместимость {/*breaking-changes*/}

### Ошибки при рендеринге не перебрасываются {/*errors-in-render-are-not-re-thrown*/}

В предыдущих версиях React ошибки, возникающие во время рендеринга, перехватывались и перебрасывались. В режиме разработки (DEV) мы также выводили сообщения в `console.error`, что приводило к дублированию логов ошибок.

В React 19 мы [улучшили обработку ошибок](/blog/2024/04/25/react-19#error-handling), чтобы уменьшить дублирование, не перебрасывая их:

- **Неперехваченные ошибки**: Ошибки, которые не были перехвачены Error Boundary, сообщаются в `window.reportError`.
- **Перехваченные ошибки**: Ошибки, которые были перехвачены Error Boundary, сообщаются в `console.error`.

Это изменение не должно повлиять на большинство приложений, но если ваша система отчетности об ошибках в продакшене полагается на переброс ошибок, вам может потребоваться обновить обработку ошибок. Для поддержки этого мы добавили новые методы в `createRoot` и `hydrateRoot` для пользовательской обработки ошибок:

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... log error report
  },
  onCaughtError: (error, errorInfo) => {
    // ... log error report
  }
});
```

Дополнительную информацию см. в документации по [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) и [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot).


### Удалены устаревшие API React {/*removed-deprecated-react-apis*/}

#### Удалено: `propTypes` и `defaultProps` для функций {/*removed-proptypes-and-defaultprops*/}
`PropTypes` были объявлены устаревшими в [апреле 2017 г. (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings).

В React 19 мы удаляем проверки `propTypes` из пакета React, и их использование будет молчаливо игнорироваться. Если вы используете `propTypes`, мы рекомендуем перейти на TypeScript или другое решение для проверки типов.

Мы также удаляем `defaultProps` из функциональных компонентов в пользу параметров по умолчанию ES6. Классовые компоненты продолжат поддерживать `defaultProps`, поскольку для них нет альтернативы в ES6.

```js
// До
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```
```ts
// После
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

<Note>

Codemod `propTypes` в TypeScript с помощью:

```bash
npx codemod@latest react/prop-types-typescript
```

</Note>

#### Удалено: Устаревший контекст с использованием `contextTypes` и `getChildContext` {/*removed-removing-legacy-context*/}

Устаревший контекст был объявлен устаревшим в [октябре 2018 г. (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html).

Устаревший контекст был доступен только в классовых компонентах с использованием API `contextTypes` и `getChildContext` и был заменен на `contextType` из-за тонких ошибок, которые было легко пропустить. В React 19 мы удаляем устаревший контекст, чтобы сделать React немного меньше и быстрее.

Если вы все еще используете устаревший контекст в классовых компонентах, вам нужно будет перейти на новый API `contextType`:

```js {5-11,19-21}
// До
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// После
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### Удалено: строковые рефы {/*removed-string-refs*/}
Строковые рефы были объявлены устаревшими в [марте 2018 г. (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html).

Классовые компоненты поддерживали строковые рефы до их замены на колбэки рефов из-за [множества недостатков](https://github.com/facebook/react/issues/1373). В React 19 мы удаляем строковые рефы, чтобы сделать React проще и понятнее.

Если вы все еще используете строковые рефы в классовых компонентах, вам нужно будет перейти на колбэки рефов:

```js {4,8}
// До
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// После
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

Codemod строковых рефов в колбэки рефов:

```bash
npx codemod@latest react/19/replace-string-ref
```

</Note>

#### Удалено: фабрики шаблонных модулей {/*removed-module-pattern-factories*/}
Фабрики шаблонных модулей были объявлены устаревшими в [августе 2019 г. (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories).

Этот паттерн использовался редко, и его поддержка делает React немного больше и медленнее, чем необходимо. В React 19 мы удаляем поддержку фабрик шаблонных модулей, и вам нужно будет перейти на обычные функции:

```js
// До
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// После
function FactoryComponent() {
  return <div />;
}
```

#### Удалено: `React.createFactory` {/*removed-createfactory*/}
`createFactory` был объявлен устаревшим в [феврале 2020 г. (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory).

Использование `createFactory` было обычным делом до широкой поддержки JSX, но сегодня оно используется редко и может быть заменено JSX. В React 19 мы удаляем `createFactory`, и вам нужно будет перейти на JSX:

```js
// До
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// После
const button = <button />;
```

#### Удалено: `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

В React 18 мы обновили `react-test-renderer/shallow` для повторного экспорта [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer). В React 19 мы удаляем `react-test-render/shallow`, чтобы предпочесть прямую установку пакета:

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### Пожалуйста, пересмотрите поверхностное рендерирование {/*please-reconsider-shallow-rendering*/}

Поверхностное рендерирование зависит от внутренних механизмов React и может блокировать вас от будущих обновлений. Мы рекомендуем перенести ваши тесты на [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) или [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro).

</Note>

### Удалены устаревшие API React DOM {/*removed-deprecated-react-dom-apis*/}

#### Удалено: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

Мы переместили `act` из `react-dom/test-utils` в пакет `react`:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` устарел в пользу `React.act`. Импортируйте `act` из `react`, а не из `react-dom/test-utils`. См. https://react.dev/warnings/react-dom-test-utils для получения дополнительной информации.

</ConsoleLogLine>

</ConsoleBlockMulti>

Чтобы исправить это предупреждение, вы можете импортировать `act` из `react`:

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

Все остальные функции `test-utils` были удалены. Эти утилиты использовались редко и слишком упрощали зависимость от низкоуровневых деталей реализации ваших компонентов и React. В React 19 эти функции будут вызывать ошибку при вызове, а их экспорты будут удалены в будущей версии.

См. [страницу предупреждений](https://react.dev/warnings/react-dom-test-utils) для альтернатив.

<Note>

Codemod `ReactDOMTestUtils.act` в `React.act`:

```bash
npx codemod@latest react/19/replace-act-import
```

</Note>

#### Удалено: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render` был объявлен устаревшим в [марте 2022 г. (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). В React 19 мы удаляем `ReactDOM.render`, и вам нужно будет перейти на использование [`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot):

```js
// До
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// После
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

<Note>

Codemod `ReactDOM.render` в `ReactDOMClient.createRoot`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Удалено: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate` был объявлен устаревшим в [марте 2022 г. (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). В React 19 мы удаляем `ReactDOM.hydrate`, и вам нужно будет перейти на использование [`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot),

```js
// До
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// После
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<Note>

Codemod `ReactDOM.hydrate` в `ReactDOMClient.hydrateRoot`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Удалено: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode` был объявлен устаревшим в [марте 2022 г. (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide). В React 19 вам нужно будет перейти на использование `root.unmount()`.


```js
// До
unmountComponentAtNode(document.getElementById('root'));

// После
root.unmount();
```

Подробнее см. `root.unmount()` для [`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount) и [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount).

<Note>

Codemod `unmountComponentAtNode` в `root.unmount`:

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Удалено: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}

`ReactDOM.findDOMNode` был [объявлен устаревшим в октябре 2018 г. (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode).

Мы удаляем `findDOMNode`, поскольку это был устаревший обходной путь, который медленно выполнялся, был хрупким к рефакторингу, возвращал только первый дочерний элемент и нарушал уровни абстракции (подробнее см. [здесь](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)). Вы можете заменить `ReactDOM.findDOMNode` на [DOM-рефы](/learn/manipulating-the-dom-with-refs):

```js
// До
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

```js
// После
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Hello" />
}
```

## Новые устаревшие функции {/*new-deprecations*/}

### Устарело: `element.ref` {/*deprecated-element-ref*/}

React 19 поддерживает [`ref` как пропс](/blog/2024/04/25/react-19#ref-as-a-prop), поэтому мы объявляем устаревшим `element.ref` в пользу `element.props.ref`.

Доступ к `element.ref` вызовет предупреждение:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Доступ к element.ref больше не поддерживается. ref теперь является обычным пропсом. Он будет удален из типа JSX Element в будущей версии.

</ConsoleLogLine>

</ConsoleBlockMulti>

### Устарело: `react-test-renderer` {/*deprecated-react-test-renderer*/}

Мы объявляем устаревшим `react-test-renderer`, поскольку он реализует собственную среду рендеринга, которая не соответствует среде, используемой пользователями, способствует тестированию деталей реализации и полагается на интроспекцию внутренних механизмов React.

Тестовый рендерер был создан до появления более жизнеспособных стратегий тестирования, таких как [React Testing Library](https://testing-library.com), и теперь мы рекомендуем использовать современную библиотеку тестирования вместо него.

В React 19 `react-test-renderer` выводит предупреждение об устаревании и переключился на конкурентный рендеринг. Мы рекомендуем перенести ваши тесты на [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) или [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro/) для современного и хорошо поддерживаемого опыта тестирования.

## Заметные изменения {/*notable-changes*/}

### Изменения StrictMode {/*strict-mode-improvements*/}

React 19 включает несколько исправлений и улучшений для Strict Mode.

При двойном рендеринге в Strict Mode в режиме разработки `useMemo` и `useCallback` будут повторно использовать мемоизированные результаты первого рендеринга во время второго рендеринга. Компоненты, которые уже совместимы со Strict Mode, не должны заметить разницы в поведении.

Как и все функции Strict Mode, эти функции предназначены для проактивного выявления ошибок в ваших компонентах во время разработки, чтобы вы могли исправить их до того, как они будут выпущены в продакшен. Например, во время разработки Strict Mode будет дважды вызывать функции колбэков рефов при первоначальном монтировании, чтобы имитировать то, что происходит, когда смонтированный компонент заменяется запасным элементом Suspense.

### Улучшения Suspense {/*improvements-to-suspense*/}

В React 19, когда компонент приостанавливается (suspends), React немедленно зафиксирует запасной элемент ближайшего пограничного элемента Suspense, не дожидаясь рендеринга всего дерева братьев и сестер. После фиксации запасного элемента React планирует еще один рендеринг для приостановленных братьев и сестер, чтобы "предварительно разогреть" ленивые запросы в остальной части дерева:

<Diagram name="prerender" height={162} width={1270} alt="Диаграмма, показывающая дерево из трех компонентов, один родительский компонент с меткой Accordion и два дочерних компонента с меткой Panel. Оба компонента Panel содержат isActive со значением false.">

Ранее, когда компонент приостанавливался, рендерились братья и сестры, а затем фиксировался запасной элемент.

</Diagram>

<Diagram name="prewarm" height={162} width={1270} alt="Та же диаграмма, что и предыдущая, с выделенным isActive первого дочернего компонента Panel, указывающим на клик со значением isActive, установленным в true. Второй компонент Panel по-прежнему содержит значение false." >

В React 19, когда компонент приостанавливается, фиксируется запасной элемент, а затем рендерится приостановленный братский элемент.

</Diagram>

Это изменение означает, что запасные элементы Suspense отображаются быстрее, при этом "предварительно разогревая" ленивые запросы в приостановленном дереве.

### Удалены UMD-сборки {/*umd-builds-removed*/}

UMD широко использовался в прошлом как удобный способ загрузки React без шага сборки. Теперь существуют современные альтернативы для загрузки модулей в виде скриптов в HTML-документах. Начиная с React 19, React больше не будет создавать UMD-сборки, чтобы уменьшить сложность процесса тестирования и выпуска.

Чтобы загрузить React 19 с помощью тега скрипта, мы рекомендуем использовать CDN на основе ESM, такой как [esm.sh](https://esm.sh/).

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### Библиотеки, зависящие от внутренних механизмов React, могут блокировать обновления {/*libraries-depending-on-react-internals-may-block-upgrades*/}

Этот релиз включает изменения во внутренних механизмах React, которые могут повлиять на библиотеки, игнорирующие наши просьбы не использовать внутренние механизмы, такие как `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`. Эти изменения необходимы для внедрения улучшений в React 19 и не нарушат работу библиотек, которые следуют нашим рекомендациям.

В соответствии с нашей [Политикой версионирования](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change), эти обновления не перечислены как нарушающие обратную совместимость, и мы не предоставляем документацию по их обновлению. Рекомендация — удалить любой код, который зависит от внутренних механизмов.

Чтобы отразить влияние использования внутренних механизмов, мы переименовали суффикс `SECRET_INTERNALS` в:

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

В будущем мы будем более агрессивно блокировать доступ к внутренним механизмам React, чтобы препятствовать их использованию и гарантировать, что пользователи не будут заблокированы от обновления.

## Изменения в TypeScript {/*typescript-changes*/}

### Удалены устаревшие типы TypeScript {/*removed-deprecated-typescript-types*/}

Мы очистили типы TypeScript на основе удалённых API в React 19. Некоторые из удалённых типов были перемещены в более релевантные пакеты, а другие больше не нужны для описания поведения React.

<Note>
Мы опубликовали [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/), чтобы перенести большинство связанных с типами критических изменений:

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

Если у вас много некорректного доступа к `element.props`, вы можете запустить этот дополнительный codemod:

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

Ознакомьтесь с [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) для получения списка поддерживаемых замен. Если вы считаете, что codemod отсутствует, его можно отследить в [списке отсутствующих codemods для React 19](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement).


### Требуется очистка `ref` {/*ref-cleanup-required*/}

_Это изменение включено в пресет codemod `react-19` как [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)._

Из-за введения функций очистки `ref` возврат чего-либо, кроме `undefined`, из колбэка `ref` теперь будет отклоняться TypeScript. Исправление обычно заключается в прекращении использования неявных возвратов:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Исходный код возвращал экземпляр `HTMLDivElement`, и TypeScript не знал, предназначалась ли это функция очистки или нет.

### `useRef` требует аргумент {/*useref-requires-argument*/}

_Это изменение включено в пресет codemod `react-19` как [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults)._

Долгое время жаловались на то, как TypeScript и React работают с `useRef`. Мы изменили типы так, что `useRef` теперь требует аргумент. Это значительно упрощает его сигнатуру типа. Теперь он будет вести себя больше как `createContext`.

```ts
// @ts-expect-error: Ожидался 1 аргумент, но не было предоставлено
useRef();
// Проходит
useRef(undefined);
// @ts-expect-error: Ожидался 1 аргумент, но не было предоставлено
createContext();
// Проходит
createContext(undefined);
```

Теперь это также означает, что все `ref` являются изменяемыми. Вы больше не столкнётесь с проблемой, когда не можете изменить `ref`, потому что инициализировали его с помощью `null`:

```ts
const ref = useRef<number>(null);

// Нельзя присвоить значение 'current', потому что это свойство только для чтения
ref.current = 1;
```

`MutableRef` теперь устарел в пользу единого типа `RefObject`, который `useRef` всегда будет возвращать:

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` по-прежнему имеет удобную перегрузку для `useRef<T>(null)`, которая автоматически возвращает `RefObject<T | null>`. Чтобы облегчить миграцию из-за обязательного аргумента для `useRef`, была добавлена удобная перегрузка для `useRef(undefined)`, которая автоматически возвращает `RefObject<T | undefined>`.

Ознакомьтесь с [[RFC] Сделать все `ref` изменяемыми](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772) для предварительного обсуждения этого изменения.

### Изменения в типе `ReactElement` TypeScript {/*changes-to-the-reactelement-typescript-type*/}

_Это изменение включено в codemod [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props)._

`props` React-элементов теперь по умолчанию `unknown` вместо `any`, если элемент типизирован как `ReactElement`. Это не повлияет на вас, если вы передаёте аргумент типа в `ReactElement`:

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

Но если вы полагались на значение по умолчанию, теперь вам придётся обрабатывать `unknown`:

```ts
type Example = ReactElement["props"];
//   ^? Раньше было 'any', теперь 'unknown'
```

Вам это понадобится только в том случае, если у вас много устаревшего кода, полагающегося на некорректный доступ к пропсам элемента. Интроспекция элементов существует только как крайняя мера, и вы должны явно указывать, что ваш доступ к пропсам некорректен, с помощью явного `any`.

### Пространство имён JSX в TypeScript {/*the-jsx-namespace-in-typescript*/}
Это изменение включено в пресет codemod `react-19` как [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx)

Давний запрос — удалить глобальное пространство имён `JSX` из наших типов в пользу `React.JSX`. Это помогает предотвратить загрязнение глобальных типов, что предотвращает конфликты между различными библиотеками пользовательского интерфейса, использующими JSX.

Теперь вам нужно будет обернуть дополнение модуля пространства имён JSX в `declare module "....":`

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

Точный спецификатор модуля зависит от JSX-рантайма, который вы указали в `compilerOptions` вашего `tsconfig.json`:

- Для `"jsx": "react-jsx"` это будет `react/jsx-runtime`.
- Для `"jsx": "react-jsxdev"` это будет `react/jsx-dev-runtime`.
- Для `"jsx": "react"` и `"jsx": "preserve"` это будет `react`.

### Улучшенные типы `useReducer` {/*better-usereducer-typings*/}

`useReducer` теперь имеет улучшенное выведение типов благодаря [@mfp22](https://github.com/mfp22).

Однако это потребовало критического изменения, при котором `useReducer` не принимает полный тип редьюсера в качестве параметра типа, а вместо этого либо не требует никакого (и полагается на контекстное типирование), либо требует как тип состояния, так и тип действия.

Новая лучшая практика — _не_ передавать аргументы типа в `useReducer`.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
Это может не работать в крайних случаях, когда вы можете явно типизировать состояние и действие, передав `Action` в виде кортежа:
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
Если вы определяете редьюсер встраиваемо, мы рекомендуем вместо этого аннотировать параметры функции:
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
Это также то, что вам придётся сделать, если вы вынесете редьюсер за пределы вызова `useReducer`:

```ts
const reducer = (state: State, action: Action) => state;
```

## Список изменений {/*changelog*/}

### Другие критические изменения {/*other-breaking-changes*/}

- **react-dom**: Ошибка для javascript URL в `src` и `href` [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: Удалён `errorInfo.digest` из `onRecoverableError` [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: Удалён `unstable_flushControlled` [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: Удалён `unstable_createEventHandle` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Удалён `unstable_renderSubtreeIntoContainer` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Удалён `unstable_runWithPriority` [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: Удалены устаревшие методы из `react-is` [28224](https://github.com/facebook/react/pull/28224)

### Другие заметные изменения {/*other-notable-changes*/}

- **react**: Пакетные, синхронные, стандартные и непрерывные очереди [#25700](https://github.com/facebook/react/pull/25700)
- **react**: Не предрендерить соседей приостановленного компонента [#26380](https://github.com/facebook/react/pull/26380)
- **react**: Обнаружение бесконечных циклов обновлений, вызванных обновлениями в фазе рендеринга [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: Переходы в popstate теперь синхронны [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: Удалено предупреждение о `layout effect` во время SSR [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: Предупреждение и не установка пустой строки для src/href (кроме тегов `<a>`) [#28124](https://github.com/facebook/react/pull/28124)

Полный список изменений см. в [Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024).

---

Благодарим [Andrew Clark](https://twitter.com/acdlite), [Eli White](https://twitter.com/Eli_White), [Jack Pope](https://github.com/jackpope), [Jan Kassens](https://github.com/kassens), [Josh Story](https://twitter.com/joshcstory), [Matt Carroll](https://twitter.com/mattcarrollcode), [Noah Lemen](https://twitter.com/noahlemen), [Sophie Alpert](https://twitter.com/sophiebits) и [Sebastian Silbermann](https://twitter.com/sebsilbermann) за рецензирование и редактирование этой публикации.