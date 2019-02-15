---
id: optimizing-performance
title: Оптимизация производительности
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

React использует несколько умных подходов для минимизации количества дорогостоящих DOM операций, необходимых для обновления пользовательского интерфейса. Для многих приложений, использование React приведёт к быстрому пользовательскому интерфейсу без особых усилий по оптимизации производительности. Тем не менее, существует несколько способов ускорить ваше React приложение.

## Использование продакшен сборки {#use-the-production-build}

Если вы испытываете проблемы с производительностью в вашем React приложении, убедитесь в том, что вы тестируете с настройками минифицированной продакшен сборки.

По умолчанию в React есть много вспомогательных предупреждений, очень полезных при разработке. Тем не менее, они делают React больше и медленнее, поэтому вы обязательно должны использовать продакшен версию при деплое приложения.

Если вы не уверены в том, что процесс сборки настроен правильно, вы можете проверить это установив [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Если вы посетите сайт с React в продакшен режиме, иконка будет с чёрным фоном:

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

Если вы посетите сайт с React в режиме разработки, у иконки будет красный фон:

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

Как правило, режим разработки используется во время работы над приложением, а продакшен режим при деплое приложения для пользователей.

Ниже вы можете найти инструкцию по сборке своего приложения для продакшена.

### Create React App {#create-react-app}

Если ваш проект сделан с помощью [Create React App](https://github.com/facebookincubator/create-react-app), выполните:

```
npm run build
```

Эта команда создаст продакшен сборку вашего приложения в папке `build/` вашего проекта.

Помните, что это необходимо только перед деплоем на продакшен. Для обычной разработки используйте `npm start`.

### Однофайловые сборки {#single-file-builds}

Предлагаются готовые для продакшена версии React и React DOM в виде отдельных файлов:

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Помните, что для продакшена подходят только те файлы, которые заканчиваются на `.production.min.js`.

### Brunch {#brunch}

Для наиболее эффективной продакшен сборки с Brunch, установите плагин [`uglify-js-brunch`](https://github.com/brunch/uglify-js-brunch).

```
# Если вы используете npm
npm install --save-dev uglify-js-brunch

# Если вы используете Yarn
yarn add --dev uglify-js-brunch
```

Затем, для создания продакшен сборки, добавьте флаг `-p` к команде `build`:

```
brunch build -p
```

Помните, что это нужно делать только для продакшен сборки. Вам не нужно использовать флаг `-p` или применять этот плагин во время разработки, потому что это скроет вспомогательные предупреждения React и сделает процесс сборки более медленным.

### Browserify {#browserify}

Для наиболее эффективной продакшен сборки с Browserify, установите несколько плагинов:

```
# Если вы используете npm
npm install --save-dev envify uglify-js uglifyify 

# Если вы используете Yarn
yarn add --dev envify uglify-js uglifyify 
```

При создании продакшен сборки, убедитесь, что вы добавили эти плагины **(порядок имеет значение)**:

* Плагин [`envify`](https://github.com/hughsk/envify) обеспечивает правильную среду для сборки. Сделайте его глобальным (`-g`).
* Плагин [`uglifyify`](https://github.com/hughsk/uglifyify) удаляет импорты, добавленные при разработке. Сделайте его глобальным (`-g`).
* Наконец, полученная сборка отправляется к [`uglify-js`](https://github.com/mishoo/UglifyJS2) для минификации ([читать зачем](https://github.com/hughsk/uglifyify#motivationusage)).

К примеру:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | uglifyjs --compress --mangle > ./bundle.js
```

>**Примечание:**
>
>Имя пакета `uglify-js`, но двоичный файл, который он предоставляет, называется `uglifyjs`.<br>
>Это не опечатка.

Помните, что это нужно делать только для продакшен сборки. Вам не следует использовать эти плагины в процессе разработки, потому что это скроет вспомогательные предупреждения React и сделает процесс сборки более медленным.

### Rollup {#rollup}

Для наиболее эффективной продакшен сборки с Rollup, установите несколько плагинов:

```
# Если вы используете npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 

# Если вы используете Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 
```

При создании продакшен сборки, убедитесь, что вы добавили эти плагины **(порядок имеет значение)**:

* Плагин [`replace`](https://github.com/rollup/rollup-plugin-replace) обеспечивает правильную среду для сборки.
* Плагин [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) обеспечивает поддержку CommonJS в Rollup.
* Плагин [`uglify`](https://github.com/TrySound/rollup-plugin-uglify) сжимает и оптимизирует финальную сборку.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-uglify')(),
  // ...
]
```

Полный пример настройки можно [посмотреть здесь](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

Помните, что это нужно делать только для продакшен сборки. Вам не следует использовать плагин `uglify` или плагин `replace` со значением `'production'` в процессе разработки, потому что это скроет вспомогательные предупреждения React и сделает процесс сборки более медленным.

### webpack {#webpack}

>**Примечание:**
>
>Если вы используете Create React App, пожалуйста следуйте [инструкциям выше](#create-react-app).<br>
>Этот раздел подойдёт для тех, кто самостоятельно настраивает webpack.

Для наиболее эффективной продакшен сборки webpack обязательно включите эти плагины в вашу конфигурацию для продакшен сборки:

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
}),
new webpack.optimize.UglifyJsPlugin()
```

Вы можете узнать об этом больше в [документации webpack](https://webpack.js.org/guides/production-build/).

Помните, что это нужно делать только для продакшен сборки. Вам не стоит использовать `UglifyJsPlugin` или `DefinePlugin` со значением `'production'`  в процессе разработки, потому что это скроет вспомогательные предупреждения React и сделает процесс сборки более медленным.

## Анализ производительности компонентов с помощью вкладки Chrome «Performance» {#profiling-components-with-the-chrome-performance-tab}

В режиме **разработки**, вы можете видеть как компоненты монтируются, обновляются и демонтируются, с помощью инструментов производительности в браузерах, которые это поддерживают. Например:

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="Компоненты React в графике времени Chrome" /></center>

Для того, чтобы сделать это в Chrome:

1. Временно **отключите все расширения Chrome, особенно React DevTools**. Они могут существенно исказить результаты!

2. Убедитесь, что вы запускаете приложение в режиме разработки.

3. Откройте в инструментах разработчика Chrome вкладку **[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)** и нажмите **Record**.

4. Выполните действия, которые вы хотите анализировать на производительность. Не записывайте более 20 секунд, иначе Chrome будет зависать.

5. Остановите запись.

6. События React будут сгруппированы под меткой **User Timing**.

Для более детального ознакомления, посмотрите [эту статью от Ben Schwarz](https://calibreapp.com/blog/2017-11-28-debugging-react/).

Обратите внимание, что **результаты являются относительными и на продакшене отрисовка компонентов будет быстрее**. Всё же, это должно помочь вам понять, когда не имеющий отношения пользовательский компонент обновляется по ошибке, а так же как глубоко и как часто обновляется ваш пользовательский интерфейс.

В настоящее время Chrome, Edge, и IE являются единственными браузерами поддерживающими эту функцию, но мы используем стандарт [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) поэтому ожидайте, что больше браузеров добавят эту поддержку.

## Анализ производительности компонентов с помощью инструментов разработчика Profiler {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ и `react-native` 0.57+ предоставляют расширенные возможности анализа производительности в режиме разработки с помощью инструментов разработчика React Profiler.
Обзор профайлера можно найти в посте блога ["Введение в React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
Пошаговое видео-руководство так же [доступно на YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

Если вы ещё не установили инструменты разработчика React, вы можете найти их здесь:

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

> Примечание
>
> Профилирование продакшен пакета для `react-dom` так же доступно как `react-dom/profiling`.
> Подробнее о том, как использовать этот пакет, читайте на [fb.me/react-profiling](https://fb.me/react-profiling)

## Виртуализация длинных списков {#virtualize-long-lists}

Если ваше приложение рендерит длинные списки данных (сотни или тысячи строк), мы рекомендуем использовать метод известный как "экранирование". Этот метод рендерит только небольшое подмножество строк в данный момент времени и может значительно сократить время, необходимое для повторного рендера компонентов, а также количество создаваемых DOM-узлов.

[react-window](https://react-window.now.sh/) и [react-virtualized](https://bvaughn.github.io/react-virtualized/) - это популярные библиотеки для экранирования. Они предоставляют несколько переиспользуемых компонентов для отображения списков, сеток и табличных данных. Если вы хотите использовать что-то более специфическое для вашего конкретного случая, то вы можете создать собственный экранируемый компонент, как это сделано в [Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3).

## Избежание согласования {#avoid-reconciliation}

React создает и поддерживает внутреннее представление отображаемого пользовательского интерфейса. Оно так же включает React-элементы возвращаемые из ваших компонентов. Это представление позволяет React избегать создания DOM-узлов и не обращаться к текущим без необходимости, поскольку эти операции могут быть медленнее, чем операции с JavaScript объектами. Иногда его называют "виртуальный DOM", но в React Native это работает точно так же.

Когда изменяются пропсы или состояние компонента, React решает нужно ли обновление DOM, сравнивая возвращённый элемент с ранее отрендереным. Если они не равны, React обновит DOM.

Вы можете визуализировать эти перерисовки виртуального DOM с помощью инструментов разработчика React:

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)

В консоли разработчика выберите параметр **Highlight Updates** на вкдадке **React**:

<center><img src="../images/blog/devtools-highlight-updates.png" style="max-width:100%; margin-top:10px;" alt="Как включить подсветку обновлений" /></center>

Взаимодействуя со своей страницей, вы должны увидеть, что вокруг любых компонентов, которые были повторно отрендерены появляются цветные границы. Это позволит вам выявлять ререндеринг, который возник без необходимости. Вы можете узнать больше о возможностях инструментов разработчика React из [этого поста](https://blog.logrocket.com/make-react-fast-again-part-3-highlighting-component-updates-6119e45e6833) в блоге от [Ben Edelstein](https://blog.logrocket.com/@edelstein).

Рассмотрим этот пример:

<center><img src="../images/blog/highlight-updates-example.gif" style="max-width:100%; margin-top:20px;" alt="Пример как инструменты разработчика React подсвечивают обновления" /></center>

Обратите внимание, что когда мы вводим вторую задачу, первая так же мигает на экране при каждом нажатии клавиши. Это означает, что он ререндерится вместе с полем ввода. Иногда это называют "бесполезным" рендерингом. Мы знаем, что в этом нет необходимости, так как контент первой задачи не изменился, но React этого не знает.

Несмотря на то, что React обновляет только измененные DOM-узлы, повторный рендеринг всё же занимает некоторое время. В большинстве случаев это не проблема, но если замедление заметно, то вы можете всё ускорить, переопределив метод жизненного цикла `shouldComponentUpdate`, который вызывается перед началом процесса ререндеринга. Реализация этой функции по умолчанию возвращает `true`, указывая React выполнить обновление:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Если вы знаете ситуации, в которых ваш компонент не нуждается в обновлении, вы можете вернуть `false` из `shouldComponentUpdate`, чтобы пропустить весь процесс рендеринга, включая вызов `render()` и так далее ниже по иерархии.

В большинстве случаев вместо того, чтобы писать `shouldComponentUpdate()` вручную, вы можете наследоваться от [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Это эквивалентно реализации `shouldComponentUpdate()` с поверхностным сравнением текущих и предыдущих пропсов и состояния.

## shouldComponentUpdate в действии {#shouldcomponentupdate-in-action}

Вот поддерево компонентов. Для каждого из них `SCU` указывает что возвратил `shouldComponentUpdate`, и `vDOMEq` указывает эквивалентны ли отрендеренные React элементы. Наконец, цвет круга указывает требуется ли согласованность компонентов или нет.

<figure><img src="../images/docs/should-component-update.png" alt="Дерево компонентов" style="max-width:100%" /></figure>

Поскольку `shouldComponentUpdate` возвратил `false` для поддерева с корнем C2, React не пытался отрендерить C2, следовательно не нужно вызывать `shouldComponentUpdate` на C4 и C5.

Для C1 и C3 `shouldComponentUpdate` возвратил `true`, поэтому React пришлось спуститься к листьям и проверить их. Для C6 `shouldComponentUpdate` вернул `true`, и поскольку отображаемые элементы не были эквивалентны, React должен был обновить DOM.

Последний интересный случай - C8. React должен был отрисовать этот компонент, но поскольку возвращаемые им React-элементы были равны ранее предоставленным, ему не нужно обновлять DOM.

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

В этом коде `shouldComponentUpdate` - это простая проверка на наличие каких-либо изменений в `props.color` или `state.count`. Если эти значения не изменяются, то компонент не обновляется. Если ваш компонент стал более сложным, вы можете использовать аналогичный паттерн "поверхностного сравнения" между всеми полями `props` и `state`, чтобы определить должен ли обновиться компонент. Этот механизм достаточно распространён, поэтому React предоставляет вспомогательную функцию для работы с ним - просто наследуйтесь от `React.PureComponent`. Поэтому, следующий код - это более простой способ добиться того же самого эффекта:

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

В большинстве случаев вы можете использовать `React.PureComponent` вместо написания собственного `shouldComponentUpdate`. Он делает поверхностное сравнение, поэтому вы не можете использовать его, если пропсы и состояние могут быть изменены таким образом, что поверхностное сравнение не даст нужного результата.

Это может стать проблемой для более сложных структур данных. Для примера, вы хотите, чтобы компонент `ListOfWords` отображал список слов, разделённых через запятую, с родительским компонентом `WordAdder`, который позволяет кликнуть на кнопку, чтобы добавить слово в лист. Этот код работает *неправильно*:

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
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Данная секция содержит плохой код и приводит к багам
    const words = this.state.words;
    words.push('marklar');
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

Проблема в том, что `PureComponent` сделает сравнение по ссылке между старыми и новыми значениями `this.props.words`. Поскольку этот код мутирует массив `words` в методе `handleClick` компонента `WordAdder`, старые и новые значения `this.props.words` при сравнении по ссылке будут равны, даже если слова в массиве изменились. `ListOfWords` не будет обновляться, даже если он содержит новые слова, которые должны быть отрисованы.

## Сила иммутабельных данных  {#the-power-of-not-mutating-data}

Лучший способ решения этой проблемы — избегать мутирования значений, которые вы используете как свойства или состояние. Для примера, описанный выше метод `handleClick` можно переписать с помощью `concat` следующим образом:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 поддерживает [spread syntax](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Spread_syntax) для массивов, который поможет сделать это проще. Если вы используете Create React App, то этот синтаксис доступен там по умолчанию.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
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

`updateColorMap` теперь возвращает новый объект, вместо того, чтобы мутировать исходный. `Object.assign` входит в ES6 и требует полифила.

JavaScript предоставляет [object spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread) для добавления свойств объекта, чтобы упростить его обновление без мутаций:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

Если вы используете Create React App, то `Object.assign` и синтаксис расширения объектов доступны вам по умолчанию.

## Использование неизменяемых структур данных {#using-immutable-data-structures}

[Immutable.js](https://github.com/facebook/immutable-js) - это ещё один способ решить эту проблему. Она предоставляет иммутабельные, персистентные коллекции, которые работают с помощью механизма "structural sharing":

* *Иммутабельность*: после создания коллекции она не может быть изменена.
* *Персистентность*: новые коллекции могут быть созданы из предыдущей коллекции и мутированы c помощью set. После создания новой коллекции исходная коллекция останется по-прежнему неизменной.
* *Structural Sharing*: новые коллекции создаются с использованием такой же структуры как у исходной коллекции, что позволяет сократить количество копий до минимума для повышения производительности.

Иммутабельность делает отслеживание изменений дешёвым. Изменение всегда приведет к созданию нового объекта, поэтому нам нужно только проверить, изменилась ли ссылка на объект. Например, в этом обычном JavaScript коде:

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

Несмотря на то, что `y` был изменен, поскольку это ссылка на тот же объект, что и `x`, сравнение вернёт `true`. Вы можете написать аналогичный код с помощью immutable.js:

```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
x === y; // false
x === z; // true
```

В этом случае, поскольку после мутирования `x` возвращается новая ссылка, мы можем использовать строгое сравнение (в данном случае по ссылке) `(x === y)` для того, чтобы убедиться, что новое значение хранящееся в `y` отличается от исходного значения, хранящегося в `x`.

Есть две другие библиотеки, которые могут помочь вам использовать иммутабельные данные: [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) и [immutability-helper](https://github.com/kolodny/immutability-helper).

Иммутабельные структуры данных предоставляют вам дешёвый способ отслеживания изменений в объектах и всё, что вам нужно для реализации `shouldComponentUpdate`. В большинстве случаев это даст вам хороший прирост в производительности.
