---
id: create-a-new-react-app
title: Создаём новое React-приложение
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

<div class="scary">

>
> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> See [Start a New React Project](https://react.dev/learn/start-a-new-react-project) for the recommended ways to create an app.

</div>

Используйте встроенный набор инструментов для лучшего взаимодействия пользователя и разработчика. 

На этой странице описано несколько популярных наборов инструментов React, которые помогают в таких задачах как:

* Масштабирование до большого количества файлов и компонентов.
* Использование сторонних библиотек из npm.
* Раннее обнаружение распространённых ошибок.
* Отражение изменений CSS и JS на лету в процессе разработки.
* Оптимизация кода для продакшена.

Рекомендованные на этой странице инструменты **не требуют дополнительной настройки для начала работы.**

## Возможно, вам не нужен дополнительный набор инструментов {#you-might-not-need-a-toolchain}

Если у вас нет проблем, описанных выше, или пока не чувствуете себя уверенно, используя инструменты JavaScript, рассмотрите возможность [добавления React в виде простого тега `<script>` на HTML-странице](/docs/add-react-to-a-website.html), [при необходимости с JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Также это **самый простой способ добавить React в существующий веб-сайт**. Вы всегда можете расширить набор инструментов, если посчитаете это нужным.

## Рекомендуемый набор инструментов {#recommended-toolchains}

Команда React в первую очередь рекомендует следующие решения:

- Если вы **изучаете React** или **создаёте новое [одностраничное](/docs/glossary.html#single-page-application) приложение**, используйте [Create React App](#create-react-app).
- Если вы создаёте **серверный сайт с Node.js,** попробуйте [Next.js](#nextjs).
- Если вы создаёте **статический контент-ориентированный сайт,** попробуйте [Gatsby](#gatsby).
- Если вы создаёте **библиотеку компонентов** или **интегрируетесь с существующей кодовой базой**, попробуйте [более гибкие наборы инструментов](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) – удобная среда для **изучения React** и лучший способ начать создание **нового [одностраничного](/docs/glossary.html#single-page-application) приложения** на React.

Инструмент настраивает среду для использования новейших возможностей JavaScript, оптимизирует приложение для продакшена и обеспечивает комфорт во время разработки. Вам понадобятся [Node.js не ниже версии 14.0.0 и npm не ниже версии 5.6](https://nodejs.org/ru/) на вашем компьютере. Для создания проекта выполните команды:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Примечание
>
>`npx` в первой строке не является опечаткой. Это [инструмент запуска пакетов, доступный в версиях npm  5.2 и выше](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).


Create React App не обрабатывает бэкенд логику или базы данных, он только предоставляет команды для сборки фронтенда, поэтому вы можете использовать его с любым бэкэндом. «Под капотом» используются [Babel](https://babeljs.io/) и [webpack](https://webpack.js.org/), но вам не нужно ничего знать о них.

Когда ваше приложение готово к развёртыванию в продакшене, запуск команды `npm run build` создаст оптимизированную сборку вашего приложения в папке `build`. Вы можете узнать больше о Create React App [из его README](https://github.com/facebookincubator/create-react-app#create-react-app--) и [его пользовательского руководства](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}


[Next.js](https://nextjs.org/) – это популярный легковесный фреймворк для **статических и серверных приложений**, использующих React. Он включает в себя **готовые решения для стилизации и маршрутизации** и предполагает, что вы используете [Node.js](https://nodejs.org/) в качестве серверной среды.

Узнайте больше о Next.js из [его официального руководства](https://nextjs.org/learn/). 

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) – лучший способ для создания **статических сайтов** с помощью React. Он позволяет использовать React-компоненты, но выводит предварительно отрендеренный HTML и CSS, чтобы гарантировать минимальное время загрузки.

Узнайте больше о Gatsby из [его официального руководства](https://www.gatsbyjs.org/docs/) и [галереи стартовых комплектов](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Более гибкие наборы инструментов {#more-flexible-toolchains}                             
Следующие наборы инструментов предлагают больше гибкости и выбора. Мы рекомендуем их более опытным разработчикам:


- **[Neutrino](https://neutrinojs.org/)** сочетает в себе возможности [webpack](https://webpack.js.org/) и простоту пресетов. Инструмент включает в себя пресеты для [React-приложений](https://neutrinojs.org/packages/react/) и [React-компонентов](https://neutrinojs.org/packages/react-components/).

- **[Nx](https://nx.dev/react)** – набор инструментов для ведения фулстэк разработки в монорепозиториях, который обладает встроенной поддержкой React, Next.js, [Express](https://expressjs.com/) и так далее.

- **[Parcel](https://parceljs.org/)** – быстрый упаковщик веб-приложений с нулевой конфигурацией, [который работает с React](https://parceljs.org/recipes/react/).

- **[Razzle](https://github.com/jaredpalmer/razzle)** – это фреймворк для серверного рендеринга, более гибкий чем Next.js, но не требующий обязательной настройки.

## Создание набора инструментов с нуля {#creating-a-toolchain-from-scratch}

В набор инструментов для сборки JavaScript обычно входят:

* **Менеджер пакетов**, такой как [Yarn](https://yarnpkg.com/) или [npm](https://www.npmjs.com/). Он позволяет вам использовать обширную экосистему сторонних пакетов и легко устанавливать или обновлять их.


* **Сборщик**, такой как [webpack](https://webpack.js.org/) или [Parcel](https://parceljs.org/). Он позволяет писать модульный код и объединять его в небольшие пакеты, чтобы оптимизировать время загрузки.


* **Компилятор**, такой как [Babel](https://babeljs.io/). Он позволяет писать современный код JavaScript, который будет работать даже в старых браузерах.

Если вы предпочтёте создать свой собственный набор JavaScript-инструментов с нуля, [ознакомьтесь с этим руководством](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658), в котором воссоздаются некоторые функции Create React App.

Не забудьте убедиться, что ваш набор инструментов [правильно настроен для продакшена](/docs/optimizing-performance.html#use-the-production-build).
