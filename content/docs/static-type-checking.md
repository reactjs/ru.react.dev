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

Чтобы начать пользоваться возможностями Flow необходимо:

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

```bash
yarn run flow init
```

Или `npm`:

```bash
npm run flow init
```

Эти команды создадут файл с исходной конфигурацией Flow, который обязательно нужно закоммитить. 

### Удаление аннотаций Flow из скомпилированного кода {#stripping-flow-syntax-from-the-compiled-code}

Flow дополняет JavaScript собственным синтаксисом для указания типов, который не поддерживается браузерами. Для того, чтобы код работал, нужно убедиться в том, что аннотации Flow корректно удаляются из скомипилированного JavaScript.

Для этого есть несколько способов — выбирайте в зависимости от того, какими инструментами для сборки проекта вы пользуетесь.

#### Create React App {#create-react-app}

Если для изначальной конфигурации проекта вы выбрали [Create React App](https://github.com/facebookincubator/create-react-app), вам ничего не нужно делать! Проект уже настроен должным образом и аннотации Flow должны удаляться при сборке проекта.

#### Babel {#babel}

>Примечание:
>
>Дальнейшие инструкции рассчитаны на тех, кто *не использует* Create React App, т.к. там уже есть все необходимые настройки для работы с Flow.

Если для своего проекта вы самостоятельно настраивали Babel, нужно установить специальный пресет для работы с Flow:

```bash
yarn add --dev babel-preset-flow
```

Или `npm`:

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

Если все было сделано правильно, можно попробовать запустить процесс Flow:

```bash
yarn flow
```

Или `npm`:

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

[TypeScript](https://www.typescriptlang.org/) — это язык программирования, разработанный в Microsoft. TypeScript является надмножеством JavaScript, имеет статическую систему типов и собственный компилятор. Статическая типизация позволяет отлавливать ошибки и баги во время компиляции, еще до запуска приложения. Подробнее узнать о совместном использовании TypeScript и React можно [здесь](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

Чтобы использовать TypeScript, нужно:
* Установить TypeScript как локальную зависимость проекта.
* Настроить компилятор.
* Использовать правильные расширения файлов.
* Установить файлы определений для используемых библиотек.

Остановимся подробнее на каждом из этих моментов.

### Использование TypeScript вместе с Create React App {#using-typescript-with-create-react-app}

Create React App поддерживает TypeScript по умолчанию.

Чтобы создать **новый проект** с поддержкой TypeScript, используйте следующую команду:

```bash
npx create-react-app my-app --typescript
```

Можно добавить поддержку TypeScript в **уже существующий проект**, [как показано здесь](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Примечание:
>
>Дальше описывается ручная настройка TypeScript. Если вы используете Create React App — можете **пропустить этот раздел**. 

### Добавление TypeScript в проект {#adding-typescript-to-a-project}

Все начинается с одной единственной команды в терминале:

```bash
yarn add --dev typescript
```

Или `npm`:

```bash
npm install --save-dev typescript
```

Ура! Вы установили последнюю версию TypeScript. Теперь в вашем распоряжении новая команда — `tsc`. Но прежде, чем праздновать, давайте добавим соответствующий скрипт в файл `package.json`:

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

### Настройка компилятора TypeScript {#configuring-the-typescript-compiler}

Сам по себе компилятор бесполезен, пока мы не скажем, что именно ему нужно делать. Для этого есть специальный конфигурационный файл `tsconfig.json`. Создадим этот файл:

```bash
tsc --init
```

Сгенерированный файл `tsconfig.json` уже содержит несколько параметров, которые используются компилятором по умолчанию. Кроме того, можно указать множество опциональных параметров. Более детальная информация по каждому параметру находится [здесь](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

Из всех параметров больше всего сейчас нас интересуют `rootDir` и `outDir`. Очевидно, что компилятор берет исходный TypeScript код, и компилирует его в JavaScript. И нам не нужно, чтобы возникла путаница между исходными файлами и сгенерированным кодом.

Эту проблему можно решить в два шага:
* Во-первых, изменим структуру проекта. Все файлы с исходниками переместим в директорию `src`.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Затем, укажем компилятору откуда ему брать исходные файлы и куда сохранять скомпилированный код.

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

Отлично! Теперь, если мы запустим скрипт сборки проекта, компилятор сохранит готовый JavaScript в директорию `build`. В [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) уже есть готовый `tsconfig.json` с неплохим набором параметров для дальнейшей тонкой настройки под себя.

Как правило, скомпилированный JavaScript бандл не следует хранить в системе контроля версий, так что не забудьте добавить папку `build` в файл `.gitignore`.

### Расширения файлов {#file-extensions}

В React мы почти всегда используем `.js` в качестве расширений файлов компонентов. В TypeScript лучше разделать файлы на два типа: 

`.tsx` для файлов, содержащих `JSX` разметку, и `.ts` для всего остального.  

### Запуск TypeScript {#running-typescript}

Если все было сделано правильно, можно попробовать скомпилировать TypeScript:

```bash
yarn build
```

Или `npm`:

```bash
npm run build
```

Если после этой команды в терминале ничего нет — процесс компиляции прошел успешно.

### Определения типов {#type-definitions}

Для анализа ошибок и выдачи всплывающих подсказок компилятор TypeScript использует файлы определений. Они содержат в себе всю информацию о типах, которые используются в конкретной библиотеке. Это, в свою очередь, позволяет нам использовать JavaScript библиотеки в проекте совместно с TypeScript. 

Существует два основных способа получения файлов определений:

__Bundled__ — Библиотека устанавливается вместе с собственным файлом определений. Это прекрасный вариант для нас, так как все, что нам нужно — установить нужный пакет. Чтобы проверить, есть ли у библиотеки файл определений, поищите `index.d.ts` в ее исходных файлах. В некоторых библиотеках этот файл указывается в `package.json` в секциях `typings` или `types`. 

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ — это внушительный репозиторий файлов объявлений для библиотек без собственного файла объявлений. Например, React устанавливается без собственного файла объявления — вместо этого мы устанавливаем его отдельно: 

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Локальные объявления__
Иногда пакет, который вы хотите использовать, не имеет ни собственного файла объявлений, ни соответствующего файла в репозитории DefinitelyTyped. В этом случае, мы можем объявить собственный локальный файл объявлений. Для этого надо создать файл `declarations.d.ts` в корне директории, где лежат исходники вашего проекта. Файл деклараций может выглядеть примерно так: 

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

Вот и все, вы готовы писать код на TypeScript! Чтобы познакомиться с ним поближе, рекомендуем посетить эти ресурсы: 

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
