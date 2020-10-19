---
id: code-splitting
title: Разделение кода
permalink: docs/code-splitting.html
---

## Бандлинг {#bundling}

<<<<<<< HEAD
Большинство React-приложений «собирают» свои файлы такими инструментами, как
[Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) или [Browserify](http://browserify.org/).
Сборка (или «бандлинг») — это процесс выявления импортированных файлов и объединения их в один «собранный» файл (часто называемый «bundle» или «бандл»).
Этот бандл после подключения на веб-страницу загружает всё приложение за один раз.
=======
Most React apps will have their files "bundled" using tools like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or [Browserify](http://browserify.org/). Bundling is the process of following imported files and merging them into a single file: a "bundle". This bundle can then be included on a webpage to load an entire app at once.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

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

<<<<<<< HEAD
Если вы используете [Create React App](https://create-react-app.dev/), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/) или похожие инструменты, то у вас уже будет настроенный Webpack для бандлинга приложения.

Иначе, вам нужно будет настроить webpack самостоятельно.
Для этого ознакомьтесь со страницами
[Установка](https://webpack.js.org/guides/installation/) и
[Начало работы](https://webpack.js.org/guides/getting-started/) в документации по Webpack.  
=======
If you're using [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your app.

If you aren't, you'll need to setup bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

## Разделение кода {#code-splitting}

<<<<<<< HEAD
Бандлинг это хорошо, но по мере роста вашего приложения, ваш бандл тоже будет расти.
Особенно если вы подключаете крупные сторонние библиотеки.
Вам нужно следить за кодом, который вы подключаете, чтобы случайно не сделать приложение настолько большим,
что его загрузка займёт слишком много времени.

Чтобы предотвратить разрастание бандла, стоит начать «разделять» ваш бандл.
Разделение кода — это возможность, поддерживаемая такими бандлерами
как [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) или Browserify 
(с [factor-bundle](https://github.com/browserify/factor-bundle)), которая может создавать
несколько бандлов и загружать их по мере необходимости.

Хоть вы и не уменьшите общий объём кода вашего приложения, но избежите загрузки кода, который
может никогда не понадобиться пользователю и уменьшите объём кода, необходимый для начальной загрузки.

## `import()` {#import}

Лучший способ внедрить разделение кода в приложение -- использовать синтаксис динамического импорта: `import()`.
=======
Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. You need to keep an eye on the code you are including in your bundle so that you don't accidentally make it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it's good to get ahead of the problem and start "splitting" your bundle. Code-Splitting is a feature
supported by bundlers like [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) and Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) which can create multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you "lazy-load" just the things that are currently needed by the user, which can dramatically improve the performance of your app. While you haven't reduced the overall amount of code in your app, you've avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.

## `import()` {#import}

The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

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

<<<<<<< HEAD
Когда Webpack сталкивается с таким синтаксисом, он автоматически начинает разделять код вашего приложения. Если вы используете Create React App, то всё уже настроено и
вы можете сразу [начать использовать](https://create-react-app.dev/docs/code-splitting/) синтаксис динамического импорта. Он также поддерживается «из коробки» в [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

Если вы настраиваете Webpack самостоятельно, то, вероятно, захотите прочитать [руководство Webpack по разделению кода](https://webpack.js.org/guides/code-splitting/).
Файл конфигурации Webpack должен выглядеть [примерно так](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Если вы используете [Babel](https://babeljs.io/), вам необходимо убедиться, что он понимает синтаксис динамического импорта.
Для этого вам необходимо установить пакет [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).
=======
When Webpack comes across this syntax, it automatically starts code-splitting your app. If you're using Create React App, this is already configured for you and you can [start using it](https://create-react-app.dev/docs/code-splitting/) immediately. It's also supported out of the box in [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](https://babeljs.io/), you'll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

## `React.lazy` {#reactlazy}

> Примечание:
>
> Возможности `React.lazy` и задержки (suspense) пока недоступны для рендеринга на стороне сервера. Если вам нужно разделение кода в серверном приложении, мы рекомендуем [Loadable Components](https://github.com/gregberge/loadable-components). У них есть хорошее [руководство по разделению бандла](https://loadable-components.com/docs/server-side-rendering/) с серверным рендерингом.

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

<<<<<<< HEAD
Часто таким удобным местом оказываются маршруты. Большинство интернет-пользователей привыкли к задержкам во время переходов между страницами. Поэтому и вам может быть выгодно повторно отрендерить всю страницу целиком. Это не позволит пользователям взаимодействовать с другими элементами на странице, пока происходит обновление.

Вот пример того, как организовать разделение кода на основе маршрутов с помощью `React.lazy` и таких библиотек как [React Router](https://reacttraining.com/react-router/).

=======
Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won't disrupt the user experience.

A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reacttraining.com/react-router/) with `React.lazy`.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Загрузка...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
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
