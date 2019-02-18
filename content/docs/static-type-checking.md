---
id: static-type-checking
title: Статическая типизация
permalink: docs/static-type-checking.html
prev: typechecking-with-prototypes.html
next: refs-and-the-dom.html
---

Инструменты для статической типизации, такие как [Flow](https://flow.org/) или [TypeScript](https://www.typescriptlang.org/), позволяют отлавливать большую часть ошибок еще до исполнения кода. Кроме того, они существенно улучшают процессы разработки, добавляя авдодополнение и другие возможности. Для приложений с большой кодовой базой мы рекомендуем использовать Flow или TypeScript вместо `PropTypes`.

## Flow {#flow}

[Flow](https://flow.org/) — это библиотека для статической типизации JavaScript, разработанная в Facebook и часто применяемая в связке с React. Flow расширяет возможности JavaScript, добавляя аннотации типов для переменных, функций и React компонентов. Ознакомиться с основами Flow можно на странице [официальной документации](https://flow.org/en/docs/getting-started/).

Чтобы начать пользоваться возможностями Флоу необходимо:

* Установить Flow как локальную зависимость проекта.
* Убедиться, что аннотации Flow удаляются из кода при его компиляции.
* Добавить несколько аннотаций типов и запустить Flow для их проверки.

Рассмотрим подробнее каждый из этих шагов.

### Добавление Flow в проект {#adding-flow-to-a-project}

Убедитесь, что вы находитесь в директории вашего проекта, после чего запустите одну из следующих команд:

Если вы используете [Yarn](https://yarnpkg.com/):

```bash
yarn add --dev flow-bin
```

Если вы используете [npm](https://www.npmjs.com/):

```bash
npm install --save-dev flow-bin
```

Эти команды установят последнюю версию Flow в качестве локальной зависимости вашего проекта.

Далее нужно добавить `flow` в раздел `"scripts"` файла `package.json`:

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

Теперь можно запустить скрипт, прописав в терминале:

Если вы используете [Yarn](https://yarnpkg.com/):

```bash
yarn run flow init
```

Если вы используете [npm](https://www.npmjs.com/):

```bash
npm run flow init
```

Эти команды создадут файл с исходной конфигурацией Flow, который обязательно нужно закоммитить. 

### Удаление аннотаций Flow из скомпилированного кода {#stripping-flow-syntax-from-the-compiled-code}

Flow дополняет JavaScript собственным синтаксисом для указания типов, который не поддерживается браузерами. Для того, чтобы код работал, нужно убедиться в том, что аннотации Flow корректно удаляются из скомипилированного JavaScript бандла.

В зависимости от того, какими инструментами для сборки JavaScript вы пользуетесь, для этого есть несколько способов.

#### Create React App {#create-react-app}

Если для изначальной конфигурации проекта вы выбрали [Create React App](https://github.com/facebookincubator/create-react-app), вам ничего не нужно делать! Проект уже настроен должным образом и аннотации Flow должны удаляться при сборке проекта.

#### Babel {#babel}

>Примечание:
>
>Дальнейшие инструкции рассчитаны на тех, кто *не использует* Create React App, т.к. в нем уже есть все необходимые настройки для работы с Flow.

Если для своего проекте вы самостоятельно настраивали Babel, нужно установить специальный пресет для работы с Flow:

```bash
yarn add --dev babel-preset-flow
```

Или через `npm`:

```bash
npm install --save-dev babel-preset-flow
```

Затем добавьте установленный пресет `flow` в свою [конфигурацю Babel](https://babeljs.io/docs/usage/babelrc/). Например так, если вы используете конфигурационный файл `.babelrc`:

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

Этот пресет позволит использовать Flow в вашем коде.

>Примечание:
>
>Для работы с Flow не нужно отдельно устанавливать пресет `react` — Flow уже понимает JSX синтаксис. Тем не менее, часто используют оба пресета одновременно.

#### Другие инструменты сборки {#other-build-setups}

Для удаления аннотаций Flow существует отдельная библиотека: [flow-remove-types](https://github.com/flowtype/flow-remove-types). Она может пригодиться, если вы пользуетесь другими инструментами для сборки проекта.

### Запуск Flow {#running-flow}

Если все было сделано правильно, можно попробовать запустить процесс Flow. 

```bash
yarn flow
```

Или при помощи npm:

```bash
npm run flow
```

Вы должны увидеть примерно такое сообщение в терминале:

```
No errors!
✨  Done in 0.17s.
```

### Добавление аннотаций типов {#adding-flow-type-annotations}

По умолчанию Flow проверяет только файлы, содержащие специальную аннотацию (обычно ее указывают в самом начале файла):

```js
// @flow
```

Попробуйте добавить эту аннотацию в некоторые файлы вашего проекта, а затем запустить скрипт `yarn flow` или `npm run flow` и посмотреть, найдет ли Flow какие-нибудь ошибки.

Кроме того, есть [возможность](https://flow.org/en/docs/config/options/#toc-all-boolean) заставить Flow проверять вообще *все* файлы. Если вы переводите на Flow проект, в котором уже есть наработки кода — может возникнуть множество конфликтов, а вот для старта с нуля такая опция может стать неплохим выбором.

Все должно работать! Советуем ознакомиться с этими ресурсами и познакомиться с Flow подробнее:

* [Flow Documentation: Type Annotations](https://flow.org/en/docs/types/)
* [Flow Documentation: Editors](https://flow.org/en/docs/editors/)
* [Flow Documentation: React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) is a programming language developed by Microsoft. It is a typed superset of JavaScript, and includes its own compiler. Being a typed language, TypeScript can catch errors and bugs at build time, long before your app goes live. You can learn more about using TypeScript with React [here](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

To use TypeScript, you need to:
* Add TypeScript as a dependency to your project
* Configure the TypeScript compiler options
* Use the right file extensions
* Add definitions for libraries you use

Let's go over these in detail.

### Using TypeScript with Create React App {#using-typescript-with-create-react-app}

Create React App supports TypeScript out of the box.

To create a **new project** with TypeScript support, run:

```bash
npx create-react-app my-app --typescript
```

You can also add it to an **existing Create React App project**, [as documented here](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Note:
>
>If you use Create React App, you can **skip the rest of this page**. It describes the manual setup which doesn't apply to Create React App users.


### Adding TypeScript to a Project {#adding-typescript-to-a-project}
It all begins with running one command in your terminal.

If you use [Yarn](https://yarnpkg.com/), run:

```bash
yarn add --dev typescript
```

If you use [npm](https://www.npmjs.com/), run:

```bash
npm install --save-dev typescript
```

Congrats! You've installed the latest version of TypeScript into your project. Installing TypeScript gives us access to the `tsc` command. Before configuration, let's add `tsc` to the "scripts" section in our `package.json`:

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### Configuring the TypeScript Compiler {#configuring-the-typescript-compiler}
The compiler is of no help to us until we tell it what to do. In TypeScript, these rules are defined in a special file called `tsconfig.json`. To generate this file run:

```bash
tsc --init
```

Looking at the now generated `tsconfig.json`, you can see that there are many options you can use to configure the compiler. For a detailed description of all the options, check [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Of the many options, we'll look at `rootDir` and `outDir`. In its true fashion, the compiler will take in typescript files and generate javascript files. However we don't want to get confused with our source files and the generated output.

We'll address this in two steps:
* Firstly, let's arrange our project structure like this. We'll place all our source code in the `src` directory.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Next, we'll tell the compiler where our source code is and where the output should go.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

Great! Now when we run our build script the compiler will output the generated javascript to the `build` folder. The [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) provides a `tsconfig.json` with a good set of rules to get you started.

Generally, you don't want to keep the generated javascript in your source control, so be sure to add the build folder to your `.gitignore`.

### File extensions {#file-extensions}
In React, you most likely write your components in a `.js` file. In TypeScript we have 2 file extensions:

`.ts` is the default file extension while `.tsx` is a special extension used for files which contain `JSX`.

### Running TypeScript {#running-typescript}

If you followed the instructions above, you should be able to run TypeScript for the first time.

```bash
yarn build
```

If you use npm, run:

```bash
npm run build
```

If you see no output, it means that it completed successfully.


### Type Definitions {#type-definitions}
To be able to show errors and hints from other packages, the compiler relies on declaration files. A declaration file provides all the type information about a library. This enables us to use javascript libraries like those on npm in our project. 

There are two main ways to get declarations for a library:

__Bundled__ - The library bundles its own declaration file. This is great for us, since all we need to do is install the library, and we can use it right away. To check if a library has bundled types, look for an `index.d.ts` file in the project. Some libraries will have it specified in their `package.json` under the `typings` or `types` field.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped is a huge repository of declarations for libraries that don't bundle a declaration file. The declarations are crowd-sourced and managed by Microsoft and open source contributors. React for example doesn't bundle its own declaration file. Instead we can get it from DefinitelyTyped. To do so enter this command in your terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Local Declarations__
Sometimes the package that you want to use doesn't bundle declarations nor is it available on DefinitelyTyped. In that case, we can have a local declaration file. To do this, create a `declarations.d.ts` file in the root of your source directory. A simple declaration could look like this:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

You are now ready to code! We recommend to check out the following resources to learn more about TypeScript:

* [TypeScript Documentation: Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript Documentation: Migrating from Javascript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/) — это не новый язык, а новый синтаксис и набор инструментов для проверенного временем языка [OCaml](https://ocaml.org/). Reason предоставляет синтаксис, ориентированный на JavaScript программистов, и использует уже известный всем способ распространения через NPM/Yarn.

Reason был разработан в Facebook и используется в некоторых продуктах этой компании — например, в Messenger. Reason все еще считается довольно экспериментальным инструментом, но уже имеет [библиотеку привязок для React](https://reasonml.github.io/reason-react/), поддерживаемую Facebook, а также [отзывчивое коммьюнити](https://reasonml.github.io/docs/en/community.html)

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) это язык со статической типизацией, разработанный в JetBrains. Он нацелен на платформы работающие на основе JVM, Android, LLVM, и [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html). 

JetBrains разрабатывает и поддерживает несколько библиотек специально для React community: [React bindings](https://github.com/JetBrains/kotlin-wrappers) совместно с [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). Последняя позволит вам начать использовать Kotlin вместе с React в одном проекте без необходимости ручной конфигурации.

## Другие языки {#other-languages}

Помните: есть и другие языки со статической типизацией, которые могут компилироваться в JavaScript, а значит — совместимы с React. Например, [F#/Fable](http://fable.io) вместе с [elmish-react](https://elmish.github.io/react). Для подробной информации - переходите на соответствующие сайты и не стесняйтесь предлагать больше React-совместимых статически типизированных языков в этот раздел!
