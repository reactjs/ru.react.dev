---
title: "Обзор React Conf 2024"
author: Ricky Hanlon
date: 2024/05/22
description: На прошлой неделе мы провели React Conf 2024, двухдневную
  конференцию в Хендерсоне, штат Невада, где более 700 участников собрались
  лично, чтобы обсудить последние достижения в области UI-инженерии. В этой
  статье мы подведём итоги выступлений и анонсов с мероприятия.
---
```
May 22, 2024 от [Рики Хэнлона](https://twitter.com/rickhanlonii).

---

<Intro>

На прошлой неделе мы провели React Conf 2024, двухдневную конференцию в Хендерсоне, штат Невада, где более 700 участников собрались лично, чтобы обсудить последние достижения в области разработки пользовательских интерфейсов. Это была наша первая личная конференция с 2019 года, и мы были рады снова собрать сообщество вместе.

</Intro>

---

На React Conf 2024 мы анонсировали [React 19 RC](/blog/2024/12/05/react-19), [React Native New Architecture Beta](https://github.com/reactwg/react-native-new-architecture/discussions/189) и экспериментальный выпуск [React Compiler](/learn/react-compiler). Сообщество также вышло на сцену, чтобы анонсировать [React Router v7](https://remix.run/blog/merging-remix-and-react-router), [Universal Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s) в Expo Router, React Server Components в [RedwoodJS](https://redwoodjs.com/blog/rsc-now-in-redwoodjs) и многое другое.

Полные записи [первого дня](https://www.youtube.com/watch?v=T8TZQ6k4SLE) и [второго дня](https://www.youtube.com/watch?v=0ckOUBiuxVY) доступны онлайн. В этой статье мы подведем итоги выступлений и анонсов с мероприятия.

## День 1 {/*day-1*/}

_[Посмотреть полную трансляцию первого дня можно здесь.](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=973s)_

Чтобы открыть первый день, технический директор Meta [Эндрю «Boz» Босуорт](https://www.threads.net/@boztank) поделился приветственным словом, за которым последовало вступление от [Сета Уэбстера](https://twitter.com/sethwebster), который руководит React Org в Meta, и нашего ведущего [Эшли Нарсисс](https://twitter.com/_darkfadr).

В основном докладе первого дня [Джо Савона](https://twitter.com/en_JS) поделился нашими целями и видением React, чтобы упростить для всех создание отличного пользовательского опыта. [Лорен Тан](https://twitter.com/potetotes) продолжила выступление с докладом «Состояние React», в котором она сообщила, что React был загружен более 1 миллиарда раз в 2023 году и что 37% новых разработчиков изучают программирование с помощью React. Наконец, она отметила работу сообщества React по созданию React, React.

Чтобы узнать больше, посмотрите эти выступления сообщества позже на конференции:

- [Vanilla React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=5542s) от [Райана Флоренса](https://twitter.com/ryanflorence)
- [React Rhythm & Blues](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=12728s) от [Ли Робинсона](https://twitter.com/leeerob)
- [RedwoodJS, теперь с React Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=26815s) от [Эми Даттон](https://twitter.com/selfteachme)
- [Представляем Universal React Server Components в Expo Router](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s) от [Эвана Бэкона](https://twitter.com/Baconbrix)

Далее в основном докладе [Джош Стори](https://twitter.com/joshcstory) и [Эндрю Кларк](https://twitter.com/acdlite) поделились новыми функциями, которые появятся в React 19, и анонсировали React 19 RC, который готов к тестированию в продакшене. Ознакомьтесь со всеми функциями в [публикации о выпуске React 19](/blog/2024/12/05/react-19) и посмотрите эти выступления, чтобы узнать подробности о новых функциях:

- [Что нового в React 19](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=8880s) от [Лидии Халли](https://twitter.com/lydiahallie)
- [React Unpacked: Дорожная карта к React 19](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=10112s) от [Сэма Селикоффа](https://twitter.com/samselikoff)
- [React 19 Deep Dive: Coordinating HTML](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24916s) от [Джоша Стори](https://twitter.com/joshcstory)
- [Улучшение форм с помощью React Server Components](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=25280s) от [Авроры Вальберг Шарфф](https://twitter.com/aurorascharff)
- [React для двух компьютеров](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=18825s) от [Дэна Абрамова](https://bsky.app/profile/danabra.mov)
- [И теперь вы понимаете React Server Components](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=11256s) от [Кента К. Доддса](https://twitter.com/kentcdodds)

Наконец, мы завершили основной доклад тем, что [Джо Савона](https://twitter.com/en_JS), [Сатья Гунасекаран](https://twitter.com/_gsathya) и [Мофей Чжан](https://twitter.com/zmofei) объявили, что React Compiler теперь [Open Source](https://github.com/facebook/react/pull/29061), и поделились экспериментальной версией React Compiler для тестирования.

Для получения дополнительной информации об использовании Compiler и о том, как он работает, ознакомьтесь с [документацией](/learn/react-compiler) и этими выступлениями:

- [Забудьте о Memo](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=12020s) от [Лорен Тан](https://twitter.com/potetotes)
- [React Compiler Deep Dive](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=9313s) от [Сатья Гунасекаран](https://twitter.com/_gsathya) и [Мофея Чжана](https://twitter.com/zmofei)

Посмотреть полный основной доклад первого дня можно здесь:

<YouTubeIframe src="https://www.youtube.com/embed/T8TZQ6k4SLE?t=973s" />

## День 2 {/*day-2*/}

_[Посмотреть полную трансляцию второго дня можно здесь.](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=1720s)_

Чтобы открыть второй день, [Сет Уэбстер](https://twitter.com/sethwebster) поделился приветственным словом, за которым последовало «Спасибо» от [Эли Уайта](https://x.com/Eli_White) и вступление от нашего директора по атмосфере [Эшли Нарсисс](https://twitter.com/_darkfadr).

Во втором основном докладе [Никола Корти](https://twitter.com/cortinico) поделился состоянием React Native, включая 78 миллионов загрузок в 2023 году. Он также выделил приложения, использующие React Native, в том числе более 2000 экранов, используемых в Meta; страницу с подробностями о продукте в Facebook Marketplace, которую посещают более 2 миллиардов раз в день; и часть меню «Пуск» Microsoft Windows, а также некоторые функции почти в каждом продукте Microsoft Office для мобильных устройств и настольных компьютеров.

Никола также выделил всю работу, которую сообщество делает для поддержки React Native, включая библиотеки, фреймворки и несколько платформ. Чтобы узнать больше, посмотрите эти выступления сообщества:

- [Расширение React Native за пределы мобильных и настольных приложений](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=5798s) от [Криса Траганоса](https://twitter.com/chris_trag) и [Аниши Малде](https://twitter.com/anisha_malde)
- [Пространственные вычисления с React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=22525s) от [Михала Перзхалы](https://twitter.com/thymikee)

[Риккардо Чиполлески](https://twitter.com/cipolleschir) продолжил основной доклад второго дня, объявив, что React Native New Architecture теперь находится в бета-версии и готов к внедрению приложениями в продакшене. Он поделился новыми функциями и улучшениями в новой архитектуре, а также поделился дорожной картой будущего React Native. Чтобы узнать больше, посмотрите:

- [Cross Platform React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=26569s) от [Ольги Зиновьевой](https://github.com/SlyCaptainFlint) и [Намана Гоэля](https://twitter.com/naman34)

Далее в основном докладе Никола объявил, что теперь мы рекомендуем начинать с фреймворка, такого как Expo, для всех новых приложений, созданных с помощью React Native. С этим изменением он также анонсировал новую домашнюю страницу React Native и новую документацию «Начало работы». Вы можете просмотреть новое руководство по началу работы в [документации React Native](https://reactnative.dev/docs/next/environment-setup).

Наконец, чтобы завершить основной доклад, [Кади Краман](https://twitter.com/kadikraman) поделилась последними функциями и улучшениями в Expo, а также информацией о том, как начать разработку с помощью React Native, используя Expo.

Посмотреть полный основной доклад второго дня можно здесь:

<YouTubeIframe src="https://www.youtube.com/embed/0ckOUBiuxVY?t=1720s" />

## Вопросы и ответы {/*q-and-a*/}

Команды React и React Native также завершали каждый день сессией вопросов и ответов:

- [React Q&A](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=27518s) под руководством [Майкла Чана](https://twitter.com/chantastic)
- [React Native Q&A](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=27935s) под руководством [Джеймона Холмгрена](https://twitter.com/jamonholmgren)

## И многое другое... {/*and-more*/}

Мы также услышали выступления о доступности, отчетах об ошибках, css и многом другом:

- [Развенчание доступности в React-приложениях](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=20655s) от [Катерины Поршневой](https://twitter.com/krambertech)
- [Pigment CSS, CSS в эпоху серверных компонентов](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=21696s) от [Оливье Тассинари](https://twitter.com/olivtassinari)
- [React Server Components в реальном времени](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24070s) от [Сунила Паи](https://twitter.com/threepointone)
- [Давайте нарушим правила React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=25862s) от [Шарлотты Изамбер](https://twitter.com/c_isambert)
- [Решение 100% ваших ошибок](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=19881s) от [Райана Альбрехта](https://github.com/ryan953)

## Спасибо {/*thank-you*/}

Спасибо всем сотрудникам, докладчикам и участникам, которые сделали React Conf 2024 возможной. Их слишком много, чтобы перечислять, но мы хотим поблагодарить некоторых в частности.

Спасибо [Барбаре Маркевич](https://twitter.com/barbara_markie), команде [Callstack](https://www.callstack.com/) и нашему разработчику-адвокату React Team [Мэтту Кэрроллу](https://twitter.com/mattcarrollcode) за помощь в планировании всего мероприятия; и [Санни Леггетту](https://zeroslopeevents.com/about) и всем из [Zero Slope](https://zeroslopeevents.com) за помощь в организации мероприятия.

Спасибо [Эшли Нарсисс](https://twitter.com/_darkfadr) за то, что она была нашим ведущим и директором по атмосфере; и [Майклу Чану](https://twitter.com/chantastic) и [Джеймону Холмгрену](https://twitter.com/jamonholmgren) за проведение сессий вопросов и ответов.

Спасибо [Сету Уэбстеру](https://twitter.com/sethwebster) и [Эли Уайту](https://x.com/Eli_White) за то, что приветствовали нас каждый день и давали указания по структуре и содержанию; и [Тому Оккино](https://twitter.com/tomocchino) за то, что присоединился к нам со специальным сообщением во время афтер-пати.

Спасибо [Рики Хэнлону](https://www.youtube.com/watch?v=FxTZL2U-uKg&t=1263s) за предоставление подробных отзывов о выступлениях, работу над дизайном слайдов и в целом заполнение пробелов, чтобы проработать детали.

Спасибо [Callstack](https://www.callstack.com/) за создание веб-сайта конференции; и [Кади Краман](https://twitter.com/kadikraman) и команде [Expo](https://expo.dev/) за создание мобильного приложения конференции.

Спасибо всем спонсорам, которые сделали мероприятие возможным: [Remix](https://remix.run/), [Amazon](https://developer.amazon.com/apps-and-games?cmp=US_2024_05_3P_React-Conf-2024&ch=prtnr&chlast=prtnr&pub=ref&publast=ref&type=org&typelast=org), [MUI](https://mui.com/), [Sentry](https://sentry.io/for/react/?utm_source=sponsored-conf&utm_medium=sponsored-event&utm_campaign=frontend-fy25q2-evergreen&utm_content=logo-reactconf2024-learnmore), [Abbott](https://www.jobs.abbott/software), [Expo](https://expo.dev/), [RedwoodJS](https://redwoodjs.com/) и [Vercel](https://vercel.com).

Спасибо команде AV за визуальные эффекты, сцену и звук; и отелю Westin за гостеприимство.

Спасибо всем докладчикам, которые поделились своими знаниями и опытом с сообществом.

Наконец, спасибо всем, кто присутствовал лично и онлайн, чтобы показать, что делает React, React. React — это больше, чем просто библиотека, это сообщество, и было вдохновляюще видеть, как все собираются вместе, чтобы делиться и учиться вместе.

До встречи в следующий раз!
```