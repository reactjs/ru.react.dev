---
id: code-splitting
title: Разделение кода
permalink: docs/code-splitting.html
---

## Бандлинг {#bundling}

Большинство React-приложений «собирают» свои файлы такими инструментами, как
[Webpack](https://webpack.js.org/) или [Browserify](http://browserify.org/) и состоят из нескольких "бандл" файлов.
Бандлинг -- это процесс группировки файлов с модулями и их зависимостями в один "бандл" файл.
Этот бандл после подключения на веб-страницу загружает всё приложение за один раз.

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
> Ваши бандлы будут выглядеть иначе, чем это.

Если вы используете [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/) или похожие инструменты, то у вас уже будет настроенный Webpack для бандлинга приложения.

Иначе, вам нужно будет настроить webpack самостоятельно.
Для этого ознакомьтесь со страницами
[Установка](https://webpack.js.org/guides/installation/) и
[Начала работы](https://webpack.js.org/guides/getting-started/) в документации по Webpack.  

## Разделение кода {#code-splitting}

Бандлинг это хорошо, но по мере роста вашего приложения, ваш бандл также будет расти.
Особенно если вы подключаете крупные сторонние библиотеки.
Вам нужно следить за тем что вы подключаете, чтобы случайно не сделать приложение настолько большим,
что его загрузка займёт слишком много времени.

Чтобы предотвратить разрастание бандла, стоит начать «разделять» ваш бандл.
[Разделение кода](https://webpack.js.org/guides/code-splitting/) это возможность которая поддерживается такими бандлерами
как Webpack или Browserify (с [factor-bundle](https://github.com/browserify/factor-bundle)), она может разделить
ваш бандл на несколько кусочков и загружать их по мере необходимости.

Хоть вы и не уменьшите общий объём кода вашего приложения, но вы избежите загрузки кода, который
может никогда не понадобиться пользователю и уменьшите объём кода необходимый для начальной загрузки.

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

> Примечание:
> 
> Синтаксис динамического импорта `import()` -- это ECMAScript (JavaScript)
> [предложение](https://github.com/tc39/proposal-dynamic-import),
> которое в данный момент не входит в стандарт языка. Ожидается, что он будет принят в ближайшем будущем.

Когда Webpack сталкивается с таким синтаксисом, он автоматически запускает разделение кода вашего приложения.
Если вы используете Create React App, то он уже настроен,
вы можете [начать использовать](https://facebook.github.io/create-react-app/docs/code-splitting) этот синтаксис прямо сейчас.
Он также поддерживается из коробки в [Next.js](https://github.com/zeit/next.js/#dynamic-import).

Если вы настраиваете Webpack самостоятельно, то, вероятно, вы захотите прочитать [руководство Webpack по разделению кода](https://webpack.js.org/guides/code-splitting/).
Ваш Webpack конфиг должен выглядеть [примерно так](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Если вы используете [Babel](https://babeljs.io/), вам необходимо убедиться, что он понимает синтаксис динамического импорта.
Для этого вам необходимо установить плагин [@babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import).


## `React.lazy` {#reactlazy}

> Примечание:
>
> `React.lazy` и Suspense пока недоступны для рендеринга на стороне сервера.
> Если вам нужно разделение кода в серверном приложении, мы рекомендуем [Loadable Components](https://github.com/smooth-code/loadable-components).
> У них есть хорошее [руководство по разделению бандла](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md) с серверным рендерингом.


Функция `React.lazy` позволяет рендерить динамический импорт как обычный компонент.

**До:**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**После:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

Она автоматически загрузит бандл содержащий `OtherComponent`, когда этот компонент будет отрендерен.

`React.lazy` принимает функцию, которая должна вызвать динамический `import()`.

### Задержка {#suspense}

Если модуль, содержащий `OtherComponent`, ещё не загружен к моменту рендеринга `MyComponent`, мы должны показать запасное содержимое, пока ожидаем загрузки, например индикатор загрузки. Это можно сделать с помощью компонента `Suspense`.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

Этот `fallback` проп принимает любой React-элемент, который вы хотите показать во время ожидания загрузки компонента. Компонент `Suspense` можно разместить в любом месте над ленивым компонентом. Кроме того, можно обернуть несколько ленивых компонентов одним компонентом `Suspense`.

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
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


Если какой-то модуль не загружается (например, из-за сбоя сети), это вызовет ошибку. Вы можете обрабатывать эти ошибки ради хорошего пользовательского опыта с помощью [Предохранителей](/docs/error-boundaries.html). Создав предохранитель, вы можете использовать его в любом месте над ленивыми компонентами для отображения состояния ошибки.

```js
import MyErrorBoundary from './MyErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
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

Решение о том, где в вашем приложении ввести разделение кода, может быть немного сложным.

Хороший вариант чтобы начать это -- маршруты. Большинство людей в интернете привыкли к переходам страниц, которые занимают некоторое время. Вы также склонны повторно рендерить всю страницу сразу, поэтому ваши пользователи вряд ли будут взаимодействовать с другими элементами на странице одновременно.

Вот пример того, как организовать разделение кода на основе маршрутов в приложении с помощью библиотек, таких как [React Router](https://reacttraining.com/react-router/) с `React.lazy`.


```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Именованный экспорт {#named-exports}

`React.lazy` в настоящее время поддерживает только экспорт по умолчанию. Если модуль, который требуется импортировать, использует именованный экспорт, можно создать промежуточный модуль, который повторно экспортирует его как модуль по умолчанию. Это гарантирует что treeshaking будет работать.

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
