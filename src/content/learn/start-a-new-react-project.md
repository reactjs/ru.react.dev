---
title: Начать новый React-проект
---

<Intro>

<<<<<<< HEAD
Если вы хотите создать новое приложение или веб-сайт с помощью React, мы рекомендуем выбрать один из популярных в сообществе фреймворков на базе React. Фреймворки дают возможности, которые нужны большинству приложений, включая маршрутизацию, загрузку данных и генерацию HTML.
=======
If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

</Intro>


<<<<<<< HEAD
**Вам потребуется установить [Node.js](https://nodejs.org/ru/) для локальной разработки.** Вы можете использовать Node.js и в продакшене, но это необязательно. Многие React-фреймворки экспортируют ваш код в статические HTML/CSS/JS файлы.
=======
You can use React without a framework, however we’ve found that most apps and sites eventually build solutions to common problems such as code-splitting, routing, data fetching, and generating HTML. These problems are common to all UI libraries, not just React.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

By starting with a framework, you can get started with React quickly, and avoid essentially building your own framework later.

<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If your app has unusual constraints not served well by these frameworks, or you prefer to solve these problems yourself, you can roll your own custom setup with React. Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.

</DeepDive>

## Рекомендуемые React-фреймворки {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

<<<<<<< HEAD
**[Next.js](https://nextjs.org/) -- универсальный фулстек-фреймворк.** С его помощью вы можете создавать сайты любого размера от простого статического блога до сложного динамического приложения. Для создания нового Next.js-проекта выполните команду в терминале:
=======
### Next.js {/*nextjs-pages-router*/}

**[Next.js' Pages Router](https://nextjs.org/) is a full-stack React framework.** It's versatile and lets you create React apps of any size--from a mostly static blog to a complex dynamic application. To create a new Next.js project, run in your terminal:
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

<<<<<<< HEAD
Узнайте больше о Next.js из [официальной документации.](https://nextjs.org/learn/foundations/about-nextjs)
=======
If you're new to Next.js, check out the [learn Next.js course.](https://nextjs.org/learn)
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

Команда [Vercel](https://vercel.com/) постоянно улучшает Next.js. Вы можете [развернуть Next.js-приложение](https://nextjs.org/docs/app/building-your-application/deploying) на облачном хостинге с Node.js или бессерверными вычислениями, а также на вашем собственном сервере. Next.js также поддерживает [статический экспорт](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports), который не требует сервера.

### Remix {/*remix*/}

**[Remix](https://remix.run/) -- фулстек-фреймворк с вложенной маршрутизацией.** Он помогает разбить приложение на вложенные части, которые могут загружать данные параллельно и обновлять приложение, реагируя на действия пользователя. Чтобы создать новый Remix-проект, выполните в терминале команду:

<TerminalBlock>
npx create-remix
</TerminalBlock>

Для знакомства с Remix вы можете пройти их руководства по созданию [блога](https://remix.run/docs/ru/main/tutorials/blog) (короткое) и [приложения](https://remix.run/docs/ru/main/tutorials/jokes) (длинное).

Remix поддерживается командой [Shopify](https://www.shopify.com/). Когда вы создаёте проект с помощью Remix, вам необходимо [выбрать шаблон для развёртывания приложения](https://remix.run/docs/ru/main/guides/deployment). Вы можете развернуть Remix-приложение на облачном хостинге с Node.js или бессерверными вычислениями, использовав готовый или написав собственный [адаптер](https://remix.run/docs/ru/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) -- React-фреймворк для создания быстрых веб-сайтов с поддержкой CMS.** Обширная коллекция плагинов и слой данных GraphQL позволяют наполнять веб-сайт содержимым, а также интегрировать различные API и сервисы. Чтобы создать новый Gatsby-проект, выполните в терминале команду:

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Для первого знакомства с Gatsby начните с [введения.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby поддерживается командой [Netlify](https://www.netlify.com/). При помощи Gatsby вы можете [развернуть полностью статический веб-сайт](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) на любом статическом хостинге. Если вы хотите использовать только серверные возможности Gatsby, убедитесь что ваш хостинг их поддерживает.

### Expo (для нативных приложений) {/*expo*/}

**[Expo](https://expo.dev/) -- React-фреймворк, который позволяет создавать универсальные приложения с нативными интерфейсами для Android, iOS и браузеров.** Он идёт вместе с SDK для [React Native](https://reactnative.dev/) и облегчает разработку нативных частей. Чтобы создать новый проект с Expo, запустите в терминале команду:

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Чтобы узнать больше, ознакомьтесь с [руководством по Expo](https://docs.expo.dev/tutorial/introduction/).

Фреймворк поддерживается командой [Expo](https://expo.dev/about). Вы можете бесплатно создавать приложения с помощью Expo и добавлять их в магазины Apple и Google без каких-либо ограничений. Дополнительно Expo предлагает платные облачные сервисы.

<<<<<<< HEAD
<DeepDive>

#### Можно ли использовать React без фреймворка? {/*can-i-use-react-without-a-framework*/}

Конечно! Так, например, вы можете [использовать React только для определённой части страницы.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **Однако, если вы создаёте приложение или веб-сайт с нуля, мы рекомендуем взять один из фреймворков.**

И вот почему.

Даже если поначалу вам не понадобились маршрутизация или загрузка данных, скорее всего, вы захотите добавить библиотеки для их поддержки позже. Ваш JavaScript-бандл будет расти вместе с вашим приложением, и вам придётся задуматься как разделять код для разных маршрутов. Ваше приложение будет загружать всё больше данных, и в итоге вы можете столкнуться с каскадными запросами, которые замедлят ваше приложение. Среди ваших пользователей появятся те, кто пользуется низкоскоростным интернетом или старыми устройствами, и вы захотите генерировать HTML на сервере или во время сборки. Поменять настройки большого проекта так, чтобы запускать код на сервере, может оказаться затруднительным.

**Эти проблемы не являются специфичными для React. У Svelte есть SvelteKit, у Vue -- Nuxt, и т.д.** Чтобы решить эти проблемы, вам придётся интегрировать ваш бандлер с выбранными библиотеками для маршрутизации и загрузки данных. Сделать первичную настройку и заставить всё это работать вместе может оказаться не так сложно, но вам придётся поддерживать производительность приложения по мере его роста и узнать о множестве подводных камней. Вы захотите отправлять как можно меньше кода, и в то же время уменьшить количество взаимодействий между клиентом и сервером, а ещё параллельно загружать необходимые для страницы данные. Вы можете захотеть, чтобы страница была интерактивной ещё до запуска Javascript-кода, и пользователи любых браузеров могли работать с ней одинаково. Или вам потребуется добавить папку статических HTML-файлов для маркетинговых страниц, которые могут работать с отключённым на странице Javascript. Поддержка этих возможностей требует большого труда.

**Рекомендованные React-фреймворки помогают решить эти проблемы из коробки и не требуют от вас дополнительных усилий.** Вы можете начать с малого и добавлять необходимую функциональность по мере необходимости. У каждого фреймворка есть сообщество, которое поможет найти ответы на ваши вопросы и без труда обновляться до новых версий. Кроме того, фреймворки помогают структурировать ваш код и делают его понятным для других разработчиков. Верно и обратное, сделав собственное решение, есть риск застрять на поддержке зависимостей и в результате создать свой собственный фреймворк без сообщества и пути развития (и, скорее всего, он окажется спроектирован хуже чем уже существующие решения от команд, которые посвятили этим проблемам большое количество времени).

Если мы не смогли вас убедить, или при разработке вы столкнулись с необычными ситуациями, для которых эти фреймворки не предлагают решений, мы не вправе вас останавливать - создайте свою конфигурацию! Установите `react` и `react-dom` из npm, настройте свою собственную сборку с бандлерами, такими как [Vite](https://vitejs.dev/) или [Parcel](https://parceljs.org/), и добавьте все необходимые инструменты для маршрутизации, статической генерации кода, серверного рендеринга или любые другие.
</DeepDive>

## Новейшие React-фреймворки {/*bleeding-edge-react-frameworks*/}
=======
## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

По мере того как мы развивали React, мы поняли, что лучшая интеграция с фреймворками (особенно в вопросах маршрутизации, сборки и серверных технологий) принесёт наибольшую пользу нашим пользователям. Команда Next.js согласилась взаимодействовать с нами в поиске, разработке, внедрении и тестировании новейших подходов, которые не зависят от конкретного фреймворка, например [серверные React-компоненты.](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

Мы работаем над тем, чтобы новые возможности стали доступны в продакшене как можно скорее, и договариваемся с разработчиками бандлеров и фреймворков об их интеграции. Мы рассчитываем, что через год-два все перечисленные фреймворки будут полностью поддерживать эти возможности. (Если вы разработчик фреймворка и хотите помочь нам в экспериментах, пожалуйста, дайте нам знать!)

### Next.js (Маршрутизатор приложения) {/*nextjs-app-router*/}

**[Маршрутизатор приложения Next.js (Next.js App Router)](https://nextjs.org/docs/getting-started) -- обновлённый API Next.js, отвечающий тому, как команда React видит архитектуру фулстек-приложений сегодня.** Маршрутизатор позволяет загружать данные в асинхронных компонентах на сервере или во время сборки.

Команда [Vercel](https://vercel.com/) постоянно улучшает Next.js. Вы можете [развернуть Next.js-приложение](https://nextjs.org/docs/app/building-your-application/deploying) на облачном хостинге с Node.js или бессерверными вычислениями, а также на вашем собственном сервере. Next.js также поддерживает [статический экспорт](https://nextjs.org/docs/app/building-your-application/deploying/static-exports), который не требует сервера.

<DeepDive>

#### Что включает архитектурное видение фулстек-приложений командой React? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Бандлер маршрутизатора приложения Next.js полностью реализует официальную [спецификацию серверных React-компонентов](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Это даёт возможность сочетать компоненты, сгенерированные во время сборки, на сервере и на клиенте в одном React-дереве.

Например, вы можете написать серверный компонент как асинхронную функцию и прочитать данные из базы или файла. После этого вы можете передать эти данные ниже по дереву в динамический компонент, который будет запускаться в браузере:

```js
// Этот компонент запускается *только* на сервере (или во время сборки).
async function Talks({ confId }) {
  // 1. Это серверный код, вы можете напрямую обратиться к вашей базе данных без запросов к API.
  const talks = await db.Talks.findAll({ confId });

  // 2. Добавьте любую логику рендеринга. Это не увеличит ваш JavaScript-бандл.
  const videos = talks.map(talk => talk.video);

  // 3. Передайте данные ниже по дереву в компонент, который будет запускаться в браузере.
  return <SearchableVideoList videos={videos} />;
}
```

Маршрутизатор приложения Next.js также поддерживает [загрузку данных с задержкой (Suspense)](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Так вы можете задать вид различных частей вашего приложения при загрузке (например, показать заглушки) прямо в React-дереве:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Серверные компоненты и задержка -- скорее возможности React, чем Next.js. Однако, команда фреймворка должна подписаться на их внедрение и провести нетривиальную работу. В данный момент маршрутизатор приложения Next.js является наиболее полной реализацией этих возможностей. Команда React продолжает совместную работу с разработчиками бандлеров над предоставлением новых возможностей в следующем поколении фреймворков.

</DeepDive>
