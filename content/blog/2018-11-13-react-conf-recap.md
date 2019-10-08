---
title: "Крайткий персказ React Conf: хуки, задержка и асинхронный рендеринг"
author: [tomocchino]
---

В этом году конференция [React Conf](https://conf.reactjs.org/) прошла в Хендерсоне в штате Невада с 25 по 26 октября. На конференцию пришли более 600 посетителей, чтобы обсудить новшества разработки интерфейсов.

<!-- This year’s [React Conf](https://conf.reactjs.org/) took place on October 25 and 26 in Henderson, Nevada, where more than 600 attendees gathered to discuss the latest in UI engineering. -->

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/V-QO-KO90iQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Sophie Alpert и Дэн Абрамов начали первый день конференции с главного доклада на тему «React сегодня и React завтра». В своём докладе они впервые представили [хуки](/docs/hooks-intro.html) -- новая разработка, которая позволяет использовать функционал, вроде состояния, без JavaScript-классов. В перспективе хуки должны существенно упростить код React-компонентов и в сейчас доступны в альфа-версии React.

<!-- Sophie Alpert and Dan Abramov kicked off Day 1 with their keynote, React Today and Tomorrow. In the talk, they introduced [Hooks](/docs/hooks-intro.html), which are a new proposal that adds the ability to access features such as state without writing a JavaScript class. Hooks promise to dramatically simplify the code required for React components and are currently available in a React alpha release. -->

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/ByBPyMBTzM0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Утром второго дня Andrew Clark и Brian Vaughn показали асинхронный рендеринг в React. Эндрю рассказал о недавно анонсированном для разделения кода API -- [React.Lazy](/blog/2018/10/23/react-v-16-6.html), а также новый функционал: асинхронный режим и задержку. Брайан же продемонстрировал, как ускорять приложения на базе React при помощи [нового Profiler](/blog/2018/09/10/introducing-the-react-profiler.html).

<!-- On the morning of Day 2, Andrew Clark and Brian Vaughn presented Concurrent Rendering in React. Andrew covered the recently announced [React.lazy API for code splitting](/blog/2018/10/23/react-v-16-6.html) and previewed two upcoming features: concurrent mode and Suspense. Brian demonstrated how to use [React’s new profiler](/blog/2018/09/10/introducing-the-react-profiler.html) tooling to make apps built in React run faster. -->

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/UcqRXTriUVI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Во второй половине дня Parashuram N в подробностях рассказал о новой архитектуре React Native -- долгострое, который команда React Native [анонсировала ещё в июне](https://facebook.github.io/react-native/blog/2018/06/14/state-of-react-native-2018) и работала над ним весь прошлый год. Проект призван улучшить производительность, упроситить интеграцию с другими библиотеками и создать крепкую основу для развития React Native. Мы верим в потенциал проекта и с нетерпением этого ждём.

<!-- In the afternoon, Parashuram N spoke in detail about React Native’s New Architecture, a long-term project that the React Native team has been working on over the past year and [announced in June](https://facebook.github.io/react-native/blog/2018/06/14/state-of-react-native-2018). We’re really excited about the potential of this project to improve performance, simplify interoperability with other libraries, and set a strong foundation for the future of React Native. -->

Конференция окончена, и записи всех 28 докладов [теперь находятся в открытом доступе](https://www.youtube.com/playlist?list=PLPxbbTqCLbGE5AihOSExAa4wUM-P42EIJ). За два дня набралась уйма интересных выступлений! Мы уже ждём не дождёмся следующего года!

<!-- Now that the conference is over, all 28 conference talks are [available to stream online](https://www.youtube.com/playlist?list=PLPxbbTqCLbGE5AihOSExAa4wUM-P42EIJ). There are tons of great ones from both days. We can’t wait until next year! -->
