---
id: create-a-new-react-app
title: Create a New React App
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Используйте встроенный набор инструментов для лучшего взаимодействия пользователя и разработчика. 

На этой странице описано несколько популярных наборов React инструментов , которые помогают в таких задачах как:

* Пересчёт большого количества файлов и компонентов.
* Использование сторонних библиотек из NPM.
* Раннее обнаружение распространенных ошибок.
* Онлайн редактирование CSS и JS в процессе разработки.
* Оптимизация вывода продукта.

Рекомендованные на этой странице компоненты **не требуют дополнительной настройки для начала работы.**

## Вам не нужен дополнительный набор инструментов {#you-might-not-need-a-toolchain}

Если вы не испытываете проблем описанных выше или пока не чувствуете себя уверенно, используя инструменты JavaScript, рассмотрите возможность [добавления React в виде  простого тега `<script>` на HTML странице](/docs/add-react-to-a-website.html) , [при необходимости с JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

Этот способ является также и **самым простым способом добавления React в существующий веб-сайт**.Вы всегда сможете добавить ещё больший набор инструментов, если посчитаете это нужным.


## Рекомендуемый набор инструментов {#recommended-toolchains}

Команда React в первую очередь рекомендует следующие решения:

- Если вы **изучаете React** или **создаёте новое [одностраничное](/docs/glossary.html#single-page-application) приложение**, используйте [Create React App](#create-react-app).
- Если вы создаете **серверный сайт с Node.js,** попробуйте [Next.js](#nextjs).
- Если вы создаете **статический контент-ориентированный сайт,** попробуйте [Gatsby](#gatsby).
- Если вы создаете **библиотеку компонентов** или **интегрируетесь с существующей кодовой базой**, попробуйте [более гибкие наборы инструментов](#more-flexible-toolchains).

### Create react aap {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app)- удобная среда для **изучения React** и лучший способ начать создание **нового [одностраничного](/docs/glossary.html#single-page-application) приложения** в React.

Она настраивает вашу среду разработки таким образом, чтобы вы могли использовать новейшие функции JavaScript,  предоставляет приятные возможности  для разработчиков и оптимизирует  ваше приложение для работы. У вас должен быть установлен Node  версии не менее 6 и NPM  версии не менн 5.2. Для создания проекта введите:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Примечание
>
>`npx` в первой строке - это не опечатка - это инструмент для запуска пакетов, который устанавливается с npm 5.2+.


Create React App не обрабатывает внутреннюю логику базы данных, он просто создает  сборку вашего внешнего интерфейса, поэтому вы можете использовать его с любым нужным бэкэндом. Внутри он использует [Babel](https://babeljs.io/)  и [WedPack](https://webpack.js.org/) но вам не  нужно ничего знать о них.

Когда вы будете готовы к развертыванию в рабочей среде, запуск `npm run build` создаст оптимизированную сборку вашего приложения в `build` папке. Вы можете узнать больше о Creat React App [из его README](https://github.com/facebookincubator/create-react-app#create-react-app-) и [пользовательского руководства](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents).

### Next.js {#nextjs}


[Next.js](https://nextjs.org/)  это популярная и простая  платформа для **статических и серверных приложений**, созданная с помощью React. Она включает в себя **готовые решения для стилизации и маршрутизации**  и предполагает, что вы используете [Node.js](https://nodejs.org/) в качестве серверной среды.

Узнайте больше информации о Next.js из [его официального руководства](https://nextjs.org/learn/). 

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) - лучший способ  для создания **статических сайтов** с помощью React. Он позволяет использовать компоненты React, но выводит предварительно отрендеренный HTML и CSS, для того, чтобы гарантировать самое быстрое время загрузки.

Узнайте Гэтсби из [его официального руководства](https://www.gatsbyjs.org/docs/) и [галереи стартовых комплектов](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Более гибкие наборы инструментов {#more-flexible-toolchains}                             
Следующие наборы инструментов предлагают больший набор. Мы рекомендуем их более опытным пользователям:


-**[Neutrino](https://neutrinojs.org/)** сочетает в себе мощь [веб-пакета](https://webpack.js.org/) с простотой предустановок и включает в себя предустановку для [приложений React](https://neutrinojs.org/packages/react/) и [компонентов React](https://neutrinojs.org/packages/react-components/) .

-**[nwb](https://github.com/insin/nwb)** особенно хорош для [публикации компонентов React для npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb). Его [также можно использовать](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb) для создания приложений React.

-**[Parcel](https://parceljs.org/)** - быстрый упаковщик веб-приложений с нулевой конфигурацией, [который работает с React](https://parceljs.org/recipes.html#react).


-**[Razzle](https://github.com/jaredpalmer/razzle)** - это инфраструктура рендеринга сервера, которая не требует какой-либо настройки, но предлагает большую гибкость, чем Next.js.


## Создание набора инструментов с нуля {#creating-a-toolchain-from-scratch}

Набор инструментов для сборки JavaScript обычно состоит из:


* **Менеджер пакетов**, такой как [Yarn](https://yarnpkg.com/) или [npm](https://www.npmjs.com/). Он позволяет вам использовать обширную экосистему сторонних пакетов и легко устанавливать или обновлять их.


* **Пакетировщик**, такой как [Webpack](https://webpack.js.org/) или [Parcel](https://parceljs.org/). Это позволяет вам писать модульный код и объединять его в небольшие пакеты, чтобы оптимизировать время загрузки.


* **Компилятор**, такой как [Babel](https://babeljs.io/). Он позволяет вам писать современный код JavaScript, который все еще работает в старых браузерах.

Если вы предпочитаете создать свой собственный набор инструментов JavaScript с нуля, [ознакомьтесь с этим руководством](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658), в котором воссоздаются некоторые функции Create React App.

Не забудьте убедиться, что ваш собственный набор инструментов [правильно настроен для работы](/docs/optimizing-performance.html#use-the-production-build).
