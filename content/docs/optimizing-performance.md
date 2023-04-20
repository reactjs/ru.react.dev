---
id: optimizing-performance
title: Оптимизация производительности
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React:
>
> - [`memo`: Skipping re-rendering when props are unchanged
](https://react.dev/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

</div>

React использует несколько умных подходов для минимизации количества дорогостоящих DOM-операций, необходимых для обновления пользовательского интерфейса. Для многих приложений, использование React приведёт к быстрому пользовательскому интерфейсу без особых усилий по оптимизации производительности. Тем не менее, существует несколько способов ускорить React-приложение.

## Использование продакшен-сборки {#use-the-production-build}

Если вы испытываете проблемы с производительностью в React-приложении, убедитесь в том, что вы проводите тесты с настройками минифицированной продакшен-сборки.

По умолчанию в React есть много вспомогательных предупреждений, очень полезных при разработке. Тем не менее, они делают React больше и медленнее, поэтому вам обязательно следует использовать продакшен-версию при деплое приложения.

Если вы не уверены в том, что процесс сборки настроен правильно, вы можете проверить это, установив [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Если вы посетите сайт, работающий на React в продакшен-режиме, иконка будет с чёрным фоном:

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

Если вы посетите сайт с React в режиме разработки, у иконки будет красный фон:

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

Как правило, режим разработки используется во время работы над приложением, а продакшен-режим при деплое приложения для пользователей.

Ниже вы можете найти инструкцию по сборке своего приложения для продакшена.

### Create React App {#create-react-app}

Если ваш проект сделан с помощью [Create React App](https://github.com/facebookincubator/create-react-app), выполните:

```
npm run build
```

Эта команда создаст продакшен-сборку вашего приложения в папке `build/` вашего проекта.

Помните, что это необходимо только перед деплоем на продакшен. Для обычной разработки используйте `npm start`.

### Однофайловые сборки {#single-file-builds}

Мы предлагаем готовые для продакшена версии React и React DOM в виде отдельных файлов:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

Помните, что для продакшена подходят только те файлы, которые заканчиваются на `.production.min.js`.

### Brunch {#brunch}

Для наиболее эффективной продакшен-сборки с Brunch, установите плагин [`terser-brunch`](https://github.com/brunch/terser-brunch).

```
# В случае использования npm
npm install --save-dev terser-brunch

# В случае использования Yarn
yarn add --dev terser-brunch
```

Затем, для создания продакшен сборки, добавьте флаг `-p` к команде `build`:

```
brunch build -p
```

Помните, что это нужно делать только для продакшен-сборки. Вам не нужно использовать флаг `-p` или применять этот плагин во время разработки, потому что это скроет вспомогательные предупреждения React и замедлит процесс сборки.

### Browserify {#browserify}

Для наиболее эффективной продакшен-сборки с Browserify, установите несколько плагинов:

```
# В случае использования npm
npm install --save-dev envify terser uglifyify

# В случае использования Yarn
yarn add --dev envify terser uglifyify
```

При создании продакшен-сборки, убедитесь, что вы добавили эти пакеты для преобразования **(порядок имеет значение)**:

* Плагин [`envify`](https://github.com/hughsk/envify) обеспечивает правильную среду для сборки. Сделайте его глобальным (`-g`).
* Плагин [`uglifyify`](https://github.com/hughsk/uglifyify) удаляет импорты, добавленные при разработке. Сделайте его глобальным (`-g`).
* Наконец, полученная сборка отправляется к [`terser`](https://github.com/terser-js/terser) для минификации ([прочитайте, зачем это нужно](https://github.com/hughsk/uglifyify#motivationusage)).

К примеру:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

Помните, что это нужно делать только для продакшен-сборки. Вам не следует использовать эти плагины в процессе разработки, потому что это скроет вспомогательные предупреждения React и замедлит процесс сборки.

### Rollup {#rollup}

Для наиболее эффективной продакшен-сборки с Rollup, установите несколько плагинов:

```bash
# В случае использования npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# В случае использования Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

При создании продакшен-сборки, убедитесь, что вы добавили эти плагины **(порядок имеет значение)**:

* Плагин [`replace`](https://github.com/rollup/rollup-plugin-replace) обеспечивает правильную среду для сборки.
* Плагин [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) обеспечивает поддержку CommonJS в Rollup.
* Плагин [`terser`](https://github.com/TrySound/rollup-plugin-terser) сжимает и оптимизирует финальную сборку.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

Полный пример настройки можно [посмотреть здесь](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

Помните, что это нужно делать только для продакшен-сборки. Вам не следует использовать плагин `terser` или плагин `replace` со значением `'production'` в процессе разработки, потому что это скроет вспомогательные предупреждения React и замедлит процесс сборки.

### webpack {#webpack}

>**Примечание:**
>
>Если вы используете Create React App, пожалуйста, следуйте [инструкциям выше](#create-react-app).<br>
>Этот раздел подойдёт для тех, кто самостоятельно настраивает webpack.

Webpack 4.0 и выше по умолчанию минифицирует код в продакшен-режиме.

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

Вы можете узнать об этом больше в [документации webpack](https://webpack.js.org/guides/production/).

Помните, что это нужно делать только для продакшен-сборки. Вам не стоит использовать `TerserPlugin` в процессе разработки, потому что тогда скроются вспомогательные предупреждения React и замедлится процесс сборки.

## Анализ производительности компонентов с помощью инструмента разработки «Profiler» {#profiling-components-with-the-devtools-profiler}

Пакеты `react-dom` версии 16.5+ и `react-native` версии 0.57+ предоставляют расширенные возможности анализа производительности в режиме разработки с помощью инструментов разработчика React Profiler.
Обзор профайлера можно найти в посте блога ["Введение в React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
Пошаговое видео-руководство также [доступно на YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

Если вы ещё не установили инструменты разработчика React, вы можете найти их здесь:

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

> Примечание
>
> Профилирование продакшен-пакета для `react-dom` также доступно как `react-dom/profiling`.
> Подробнее о том, как использовать этот пакет, читайте на [fb.me/react-profiling](https://fb.me/react-profiling)

> Примечание
>
> До React 17 мы использовали стандартный [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) для профилирования компонентов с помощью вкладки Performance браузера Chrome. 
> Более подробнее об этом способе можно узнать в [статье Бена Шварца (Ben Schwarz)](https://calibreapp.com/blog/react-performance-profiling-optimization).

## Виртуализация длинных списков {#virtualize-long-lists}

Если ваше приложение рендерит длинные списки данных (сотни или тысячи строк), мы рекомендуем использовать метод известный как "оконный доступ". Этот метод рендерит только небольшое подмножество строк в данный момент времени и может значительно сократить время, необходимое для повторного рендера компонентов, а также количество создаваемых DOM-узлов.

[react-window](https://react-window.now.sh/) и [react-virtualized](https://bvaughn.github.io/react-virtualized/) -- это популярные библиотеки для оконного доступа. Они предоставляют несколько повторно используемых компонентов для отображения списков, сеток и табличных данных. Если вы хотите использовать что-то более специфическое для вашего конкретного случая, то вы можете создать собственный компонент с оконным доступом, как это сделано в [Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3).

## Избежание согласования {#avoid-reconciliation}

React создаёт и поддерживает внутреннее представление отображаемого пользовательского интерфейса. Оно также включает React-элементы возвращаемые из ваших компонентов. Это представление позволяет React избегать создания DOM-узлов и не обращаться к текущим без необходимости, поскольку эти операции могут быть медленнее, чем операции с JavaScript-объектами. Иногда его называют "виртуальный DOM", но в React Native это работает точно так же.

Когда изменяются пропсы или состояние компонента, React решает нужно ли обновление DOM, сравнивая возвращённый элемент с ранее отрендеренным. Если они не равны, React обновит DOM.

Несмотря на то, что React обновляет только изменённые DOM-узлы, повторный рендеринг всё же занимает некоторое время. В большинстве случаев это не проблема, но если замедление заметно, то вы можете всё ускорить, переопределив метод жизненного цикла `shouldComponentUpdate`, который вызывается перед началом процесса ререндеринга. Реализация этой функции по умолчанию возвращает `true`, указывая React выполнить обновление:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Если вы знаете ситуации, в которых ваш компонент не нуждается в обновлении, вы можете вернуть `false` из `shouldComponentUpdate`, чтобы пропустить весь процесс рендеринга, включая вызов `render()` и так далее ниже по иерархии.

В большинстве случаев вместо того, чтобы писать `shouldComponentUpdate()` вручную, вы можете наследоваться от [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Это эквивалентно реализации `shouldComponentUpdate()` с поверхностным сравнением текущих и предыдущих пропсов и состояния.

## shouldComponentUpdate в действии {#shouldcomponentupdate-in-action}

Вот поддерево компонентов. Для каждого из них `SCU` указывает что возвратил `shouldComponentUpdate`, а `vDOMEq` указывает эквивалентны ли отрендеренные React-элементы. Наконец, цвет круга указывает требуется ли согласовать компонент или нет.

<figure><img src="../images/docs/should-component-update.png" alt="Дерево компонентов" style="max-width:100%" /></figure>

Поскольку `shouldComponentUpdate` возвратил `false` для поддерева с корнем C2, React не пытался отрендерить C2, следовательно не нужно вызывать `shouldComponentUpdate` на C4 и C5.

Для C1 и C3 `shouldComponentUpdate` возвратил `true`, поэтому React пришлось спуститься к листьям и проверить их. Для C6 `shouldComponentUpdate` вернул `true`, и поскольку отображаемые элементы не были эквивалентны, React должен был обновить DOM.

Последний интересный случай -- C8. React должен был отрисовать этот компонент, но поскольку возвращаемые им React-элементы были равны ранее предоставленным, ему не нужно обновлять DOM.

Обратите внимание, что React должен был делать изменения только для C6. Для C8 этого удалось избежать сравнением отрендеренных React-элементов, а для поддеревьев C2 и C7 даже не пришлось сравнивать элементы, так как нас выручил `shouldComponentUpdate` и `render` не был вызван.

## Примеры {#examples}

Если единственный случай изменения вашего компонента это когда переменная `props.color` или `state.count` изменяются, вы могли бы выполнить проверку в `shouldComponentUpdate` следующим образом:

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Счётчик: {this.state.count}
      </button>
    );
  }
}
```

В этом коде `shouldComponentUpdate` -- это простая проверка на наличие каких-либо изменений в `props.color` или `state.count`. Если эти значения не изменяются, то компонент не обновляется. Если ваш компонент стал более сложным, вы можете использовать аналогичный паттерн "поверхностного сравнения" между всеми полями `props` и `state`, чтобы определить должен ли обновиться компонент. Этот механизм достаточно распространён, поэтому React предоставляет вспомогательную функцию для работы с ним -- просто наследуйтесь от `React.PureComponent`. Поэтому, следующий код -- это более простой способ добиться того же самого эффекта:

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Счётчик: {this.state.count}
      </button>
    );
  }
}
```

В большинстве случаев вы можете использовать `React.PureComponent` вместо написания собственного `shouldComponentUpdate`. Но он делает только поверхностное сравнение, поэтому его нельзя использовать, если пропсы и состояние могут измениться таким образом, который не сможет быть обнаружен при поверхностном сравнении.

Это может стать проблемой для более сложных структур данных. Например, вы хотите, чтобы компонент `ListOfWords` отображал список слов, разделённых через запятую, с родительским компонентом `WordAdder`, который позволяет кликнуть на кнопку, чтобы добавить слово в список. Этот код работает *неправильно*:

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['словцо']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Данная секция содержит плохой код и приводит к багам
    const words = this.state.words;
    words.push('словцо');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

Проблема в том, что `PureComponent` сделает сравнение по ссылке между старыми и новыми значениями `this.props.words`. Поскольку этот код мутирует массив `words` в методе `handleClick` компонента `WordAdder`, старые и новые значения `this.props.words` при сравнении по ссылке будут равны, даже если слова в массиве изменились. `ListOfWords` не будет обновляться, даже если он содержит новые слова, которые должны быть отрендерены.

## Сила иммутабельных данных  {#the-power-of-not-mutating-data}

Лучший способ решения этой проблемы — избегать мутирования значений, которые вы используете как свойства или состояние. К примеру, описанный выше метод `handleClick` можно переписать с помощью `concat` следующим образом:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['словцо'])
  }));
}
```

ES6 поддерживает [синтаксис расширения](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Spread_syntax) для массивов, который поможет сделать это проще. Если вы используете Create React App, то этот синтаксис доступен там по умолчанию.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'словцо'],
  }));
};
```

Таким же образом вы можете переписать код, который мутирует объекты. К примеру, мы имеем объект с именем `colormap` и хотим написать функцию, которая изменяет `colormap.right` на `'blue'`. Мы могли бы написать:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

Чтобы написать это без мутирования исходного объекта, мы можем использовать метод [Object.assign](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/assign):

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

Функция `updateColorMap` теперь возвращает новый объект, вместо того, чтобы мутировать исходный. Метод `Object.assign` входит в ES6 и требует полифила.

[Синтаксис расширения свойств объекта](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Spread_syntax) упрощает обновление объектов без мутаций:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

Этот синтаксис был добавлен в JavaScript в ES2018.

Если вы используете Create React App, то `Object.assign` и синтаксис расширения объектов доступны вам по умолчанию.

При работе с глубоко вложенными объектами, постоянное их обновление может запутать. Если вы столкнулись с такой проблемой, обратите внимание на [Immer](https://github.com/mweststrate/immer) или [immutability-helper](https://github.com/kolodny/immutability-helper). Эти библиотеки позволяют писать хорошо читаемый код, не теряя преимуществ иммутабельности.
