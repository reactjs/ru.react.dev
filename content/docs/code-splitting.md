---
id: code-splitting
title: Разделение кода
permalink: docs/code-splitting.html
---

## Бандлинг {#bundling}

Большинство React-приложений «собирают» свои файлы такими инструментами, как [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) или [Browserify](http://browserify.org/). Сборка (или «бандлинг») — это процесс выявления импортированных файлов и объединения их в один «собранный» файл (часто называемый «bundle» или «бандл»). Этот бандл после подключения на веб-страницу загружает всё приложение за один раз.

#### Пример {#example}

**Приложение:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Бандл:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Примечание:
>
> Ваши бандлы будут выглядеть не так, как мы только что показали.

Если вы используете [Create React App](https://create-react-app.dev/), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/) или похожие инструменты, то у вас уже будет настроенный Webpack для бандлинга приложения.

Иначе, вам нужно будет настроить webpack самостоятельно. Для этого ознакомьтесь со страницами по [установке](https://webpack.js.org/guides/installation/) и [началу работы](https://webpack.js.org/guides/getting-started/) в документации по Webpack.  

## Разделение кода {#code-splitting}

Бандлинг — это хорошо, но по мере роста вашего приложения, ваш бандл тоже будет расти. Особенно если вы подключаете крупные сторонние библиотеки. Вам нужно следить за кодом, который вы подключаете, чтобы случайно не сделать приложение настолько большим, что его загрузка займёт слишком много времени.

Чтобы предотвратить разрастание бандла, стоит начать «разделять» ваш бандл. Разделение кода — это возможность, поддерживаемая такими бандлерами как [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) или Browserify (с [factor-bundle](https://github.com/browserify/factor-bundle)), которая может создавать несколько бандлов и загружать их по мере необходимости.

Хоть вы и не уменьшите общий объём кода вашего приложения, но избежите загрузки кода, который
может никогда не понадобиться пользователю и уменьшите объём кода, необходимого для начальной загрузки.

## `import()` {#import}

Лучший способ внедрить разделение кода в приложение -- использовать синтаксис динамического импорта: `import()`.

**До:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**После:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

Когда Webpack сталкивается с таким синтаксисом, он автоматически начинает разделять код вашего приложения. Если вы используете Create React App, то всё уже настроено и вы можете сразу [начать использовать](https://create-react-app.dev/docs/code-splitting/) синтаксис динамического импорта. Он также поддерживается «из коробки» в [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

Если вы настраиваете Webpack самостоятельно, то, вероятно, захотите прочитать [руководство Webpack по разделению кода](https://webpack.js.org/guides/code-splitting/). Файл конфигурации Webpack должен выглядеть [примерно так](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Если вы используете [Babel](https://babeljs.io/), вам необходимо убедиться, что он понимает синтаксис динамического импорта.
Для этого вам необходимо установить пакет [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

Функция `React.lazy` позволяет рендерить динамический импорт как обычный компонент.

**До:**

```js
import OtherComponent from './OtherComponent';
```

**После:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

Она автоматически загрузит бандл, содержащий `OtherComponent`, когда этот компонент будет впервые отрендерен.

`React.lazy` принимает функцию, которая должна вызвать динамический `import()`. Результатом возвращённого Promise является модуль, который экспортирует по умолчанию React-компонент (`export default`).

### Задержка {#suspense}

Компонент с ленивой загрузкой должен рендериться внутри компонента `Suspense`, который позволяет нам показать запасное содержимое (например, индикатор загрузки) пока происходит загрузка ленивого компонента.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Загрузка...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

Проп `fallback` принимает любой React-элемент, который вы хотите показать, пока происходит загрузка компонента. Компонент `Suspense` можно разместить в любом месте над ленивым компонентом. Кроме того, можно обернуть несколько ленивых компонентов одним компонентом `Suspense`.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Загрузка...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Avoiding fallbacks {#avoiding-fallbacks}
Any component may suspend as a result of rendering, even components that were already shown to the user. In order for screen content to always be consistent, if an already shown component suspends, React has to hide its tree up to the closest `<Suspense>` boundary. However, from the user's perspective, this can be disorienting.

Consider this tab switcher:

```js
import React, { Suspense } from 'react';
import Tabs from './Tabs';
import Glimmer from './Glimmer';

const Comments = React.lazy(() => import('./Comments'));
const Photos = React.lazy(() => import('./Photos'));

function MyComponent() {
  const [tab, setTab] = React.useState('photos');
  
  function handleTabSelect(tab) {
    setTab(tab);
  };

  return (
    <div>
      <Tabs onTabSelect={handleTabSelect} />
      <Suspense fallback={<Glimmer />}>
        {tab === 'photos' ? <Photos /> : <Comments />}
      </Suspense>
    </div>
  );
}

```

In this example, if tab gets changed from `'photos'` to `'comments'`, but `Comments` suspends, the user will see a glimmer. This makes sense because the user no longer wants to see `Photos`, the `Comments` component is not ready to render anything, and React needs to keep the user experience consistent, so it has no choice but to show the `Glimmer` above.

However, sometimes this user experience is not desirable. In particular, it is sometimes better to show the "old" UI while the new UI is being prepared. You can use the new [`startTransition`](/docs/react-api.html#starttransition) API to make React do this:

```js
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

Here, you tell React that setting tab to `'comments'` is not an urgent update, but is a [transition](/docs/react-api.html#transitions) that may take some time. React will then keep the old UI in place and interactive, and will switch to showing `<Comments />` when it is ready. See [Transitions](/docs/react-api.html#transitions) for more info.

### Предохранители {#error-boundaries}

Если какой-то модуль не загружается (например, из-за сбоя сети), это вызовет ошибку. Вы можете обрабатывать эти ошибки для улучшения пользовательского опыта с помощью [Предохранителей](/docs/error-boundaries.html). После создания предохранителя, его можно использовать в любом месте над ленивыми компонентами для отображения состояния ошибки.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Загрузка...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Разделение кода на основе маршрутов {#route-based-code-splitting}

Решение о том, где в вашем приложении ввести разделение кода, может быть непростым. В идеале, следует выбрать такие места, чтобы код разделялся на бандлы примерно одного размера, тем самым поддерживая хороший пользовательский опыт.

Часто таким удобным местом оказываются маршруты. Большинство интернет-пользователей привыкли к задержкам во время переходов между страницами. Поэтому и вам может быть выгодно повторно отрендерить всю страницу целиком. Это не позволит пользователям взаимодействовать с другими элементами на странице, пока происходит обновление.

Вот пример того, как организовать разделение кода на основе маршрутов с помощью `React.lazy` и таких библиотек как [React Router](https://reactrouter.com/).

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## Именованный экспорт {#named-exports}

`React.lazy` в настоящее время поддерживает только экспорт по умолчанию. Если модуль, который требуется импортировать, использует именованный экспорт, можно создать промежуточный модуль, который повторно экспортирует его как модуль по умолчанию. Это гарантирует работоспособность tree shaking -- механизма устранения неиспользуемого кода.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
