---
title: "React Conf 2024 Recap"
author: Ricky Hanlon
date: 2024/05/22
description: На прошлой неделе мы провели React Conf 2024, двухдневную конференцию в Хендерсоне, Невада, где более 700 участников собрались лично, чтобы обсудить последние достижения в области UI-инженерии. В этом посте мы кратко изложим основные доклады и анонсы с мероприятия.
---

22 мая 2024 г. от [Ricky Hanlon](https://twitter.com/rickhanlonii).

---

<Intro>

На прошлой неделе мы провели React Conf 2024, двухдневную конференцию в Хендерсоне, штат Невада, где более 700 участников собрались лично, чтобы обсудить последние достижения в области UI-инженерии. Это была наша первая очная конференция с 2019 года, и мы были рады возможности снова собрать сообщество вместе.

</Intro>

---

На React Conf 2024 мы анонсировали [React 19 RC](/blog/2024/12/05/react-19), [бета-версию новой архитектуры React Native](https://github.com/reactwg/react-native-new-architecture/discussions/189) и экспериментальный релиз [React Compiler](/learn/react-compiler). Сообщество также представило [React Router v7](https://remix.run/blog/merging-remix-and-react-router), [Universal Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s) в Expo Router, React Server Components в [RedwoodJS](https://redwoodjs.com/blog/rsc-now-in-redwoodjs) и многое другое.

Полные записи [первого дня](https://www.youtube.com/watch?v=T8TZQ6k4SLE) и [второго дня](https://www.youtube.com/watch?v=0ckOUBiuxVY) доступны онлайн. В этом посте мы обобщим доклады и анонсы с мероприятия.

## День 1 {/*day-1*/}

_[Полную запись первого дня смотрите здесь.](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=973s)_

В начале первого дня технический директор Meta [Andrew "Boz" Bosworth](https://www.threads.net/@boztank) выступил с приветственным словом, после чего последовало вступление от [Seth Webster](https://twitter.com/sethwebster), который руководит React Org в Meta, и нашего ведущего [Ashley Narcisse](https://twitter.com/_darkfadr).

В основной доклад первого дня [Joe Savona](https://twitter.com/en_JS) поделился нашими целями и видением React, чтобы каждый мог легко создавать отличные пользовательские интерфейсы. Затем [Lauren Tan](https://twitter.com/potetotes) представила доклад "State of React", где сообщила, что в 2023 году React был загружен более 1 миллиарда раз, а 37% новых разработчиков начинают изучать программирование с React. Наконец, она отметила работу сообщества React по развитию React.

Дополнительно ознакомьтесь с этими докладами от сообщества, представленными позже на конференции:

- [Vanilla React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=5542s) от [Ryan Florence](https://twitter.com/ryanflorence)
- [React Rhythm & Blues](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=12728s) от [Lee Robinson](https://twitter.com/leeerob)
- [RedwoodJS, теперь с React Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=26815s) от [Amy Dutton](https://twitter.com/selfteachme)
- [Introducing Universal React Server Components in Expo Router](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s) от [Evan Bacon](https://twitter.com/Baconbrix)

Далее в основном докладе [Josh Story](https://twitter.com/joshcstory) и [Andrew Clark](https://twitter.com/acdlite) рассказали о новых функциях React 19 и анонсировали React 19 RC, готовый к тестированию в продакшене. Ознакомьтесь со всеми функциями в [посте о релизе React 19](/blog/2024/12/05/react-19) и посмотрите эти доклады для более глубокого изучения новых возможностей:

- [What's new in React 19](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=8880s) от [Lydia Hallie](https://twitter.com/lydiahallie)
- [React Unpacked: A Roadmap to React 19](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=10112s) от [Sam Selikoff](https://twitter.com/samselikoff)
- [React 19 Deep Dive: Coordinating HTML](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24916s) от [Josh Story](https://twitter.com/joshcstory)
- [Enhancing Forms with React Server Components](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=25280s) от [Aurora Walberg Scharff](https://twitter.com/aurorascharff)
- [React for Two Computers](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=18825s) от [Dan Abramov](https://bsky.app/profile/danabra.mov)
- [And Now You Understand React Server Components](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=11256s) от [Kent C. Dodds](https://twitter.com/kentcdodds)

В заключение основного доклада [Joe Savona](https://twitter.com/en_JS), [Sathya Gunasekaran](https://twitter.com/_gsathya) и [Mofei Zhang](https://twitter.com/zmofei) объявили, что React Compiler теперь [Open Source](https://github.com/facebook/react/pull/29061), и представили экспериментальную версию React Compiler для тестирования.

Для получения дополнительной информации об использовании компилятора и его работе ознакомьтесь с [документацией](/learn/react-compiler) и этими докладами:

- [Forget About Memo](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=12020s) от [Lauren Tan](https://twitter.com/potetotes)
- [React Compiler Deep Dive](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=9313s) от [Sathya Gunasekaran](https://twitter.com/_gsathya) и [Mofei Zhang](https://twitter.com/zmofei)

Полный основной доклад первого дня смотрите здесь:

<YouTubeIframe src="https://www.youtube.com/embed/T8TZQ6k4SLE?t=973s" />

## День 2 {/*day-2*/}

_[Полную запись второго дня смотрите здесь.](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=1720s)_

В начале второго дня [Seth Webster](https://twitter.com/sethwebster) выступил с приветственным словом, после чего последовала благодарность от [Eli White](https://x.com/Eli_White) и вступление от нашего Chief Vibes Officer [Ashley Narcisse](https://twitter.com/_darkfadr).

В основном докладе второго дня [Nicola Corti](https://twitter.com/cortinico) представил "State of React Native", сообщив о 78 миллионах загрузок в 2023 году. Он также упомянул приложения, использующие React Native, включая более 2000 экранов внутри Meta; страницу с деталями продукта на Facebook Marketplace, которую ежедневно посещают более 2 миллиардов раз; а также часть меню "Пуск" в Microsoft Windows и некоторые функции почти во всех продуктах Microsoft Office на мобильных и настольных устройствах.

Nicola также отметил всю работу, которую сообщество проделывает для поддержки React Native, включая библиотеки, фреймворки и различные платформы. Дополнительно ознакомьтесь с этими докладами от сообщества:

- [Extending React Native beyond Mobile and Desktop Apps](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=5798s) от [Chris Traganos](https://twitter.com/chris_trag) и [Anisha Malde](https://twitter.com/anisha_malde)
- [Spatial computing with React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=22525s) от [Michał Pierzchała](https://twitter.com/thymikee)

[Riccardo Cipolleschi](https://twitter.com/cipolleschir) продолжил основной доклад второго дня, анонсировав, что новая архитектура React Native теперь находится в бета-версии и готова к использованию в продакшене. Он рассказал о новых функциях и улучшениях в новой архитектуре, а также представил дорожную карту развития React Native. Дополнительно ознакомьтесь:

- [Cross Platform React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=26569s) от [Olga Zinoveva](https://github.com/SlyCaptainFlint) и [Naman Goel](https://twitter.com/naman34)

Далее в основном докладе Nicola объявил, что теперь мы рекомендуем начинать разработку новых приложений React Native с фреймворка, такого как Expo. Вместе с этим изменением он анонсировал новую главную страницу React Native и обновленную документацию по началу работы. Вы можете ознакомиться с новым руководством по началу работы в [документации React Native](https://reactnative.dev/docs/next/environment-setup).

В заключение основного доклада [Kadi Kraman](https://twitter.com/kadikraman) представила последние функции и улучшения в Expo, а также рассказала, как начать разработку с React Native с использованием Expo.

Полный основной доклад второго дня смотрите здесь:

<YouTubeIframe src="https://www.youtube.com/embed/0ckOUBiuxVY?t=1720s" />

## Вопросы и ответы {/*q-and-a*/}

Команды React и React Native также завершали каждый день сессией вопросов и ответов:

- [React Q&A](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=27518s) под руководством [Michael Chan](https://twitter.com/chantastic)
- [React Native Q&A](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=27935s) под руководством [Jamon Holmgren](https://twitter.com/jamonholmgren)

## И многое другое... {/*and-more*/}

Мы также услышали доклады по доступности, отчетности об ошибках, CSS и другим темам:

- [Demystifying accessibility in React apps](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=20655s) от [Kateryna Porshnieva](https://twitter.com/krambertech)
- [Pigment CSS, CSS in the server component age](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=21696s) от [Olivier Tassinari](https://twitter.com/olivtassinari)
- [Real-time React Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24070s) от [Sunil Pai](https://twitter.com/threepointone)
- [Let's break React Rules](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=25862s) от [Charlotte Isambert](https://twitter.com/c_isambert)
- [Solve 100% of your errors](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=19881s) от [Ryan Albrecht](https://github.com/ryan953)

## Спасибо {/*thank-you*/}

Спасибо всем сотрудникам, докладчикам и участникам, которые сделали React Conf 2024 возможной. Их слишком много, чтобы перечислить всех, но мы хотим выразить особую благодарность некоторым.

Спасибо [Barbara Markiewicz](https://twitter.com/barbara_markie), команде [Callstack](https://www.callstack.com/) и нашему Developer Advocate в команде React [Matt Carroll](https://twitter.com/mattcarrollcode) за помощь в планировании всего мероприятия; а также [Sunny Leggett](https://zeroslopeevents.com/about) и всем из [Zero Slope](https://zeroslopeevents.com) за помощь в организации мероприятия.

Спасибо [Ashley Narcisse](https://twitter.com/_darkfadr) за роль ведущего и Chief Vibes Officer; а также [Michael Chan](https://twitter.com/chantastic) и [Jamon Holmgren](https://twitter.com/jamonholmgren) за проведение сессий вопросов и ответов.

Спасибо [Seth Webster](https://twitter.com/sethwebster) и [Eli White](https://x.com/Eli_White) за приветствия каждый день и руководство по структуре и содержанию; а также [Tom Occhino](https://twitter.com/tomocchino) за специальное сообщение во время афтепати.

Спасибо [Ricky Hanlon](https://www.youtube.com/watch?v=FxTZL2U-uKg&t=1263s) за подробные отзывы о докладах, работу над дизайном слайдов и в целом за внимание к деталям.

Спасибо [Callstack](https://www.callstack.com/) за создание веб-сайта конференции; а также [Kadi Kraman](https://twitter.com/kadikraman) и команде [Expo](https://expo.dev/) за создание мобильного приложения конференции.

Спасибо всем спонсорам, которые сделали мероприятие возможным: [Remix](https://remix.run/), [Amazon](https://developer.amazon.com/apps-and-games?cmp=US_2024_05_3P_React-Conf-2024&ch=prtnr&chlast=prtnr&pub=ref&publast=ref&type=org&typelast=org), [MUI](https://mui.com/), [Sentry](https://sentry.io/for/react/?utm_source=sponsored-conf&utm_medium=sponsored-event&utm_campaign=frontend-fy25q2-evergreen&utm_content=logo-reactconf2024-learnmore), [Abbott](https://www.jobs.abbott/software), [Expo](https://expo.dev/), [RedwoodJS](https://redwoodjs.com/) и [Vercel](https://vercel.com).

Спасибо команде AV за визуальные эффекты, сцену и звук; а также отелю Westin за гостеприимство.

Спасибо всем докладчикам, которые поделились своими знаниями и опытом с сообществом.

Наконец, спасибо всем, кто присутствовал лично и онлайн, чтобы показать, что делает React — React. React — это больше, чем библиотека, это сообщество, и было вдохновляюще видеть, как все собрались вместе, чтобы делиться и учиться.

До скорой встречи!