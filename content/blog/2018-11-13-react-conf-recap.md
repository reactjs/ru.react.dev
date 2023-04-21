---
title: "Итоги React Conf: хуки, задержка и конкурентный рендеринг"
author: [tomocchino]
---

<div class="scary">

> This blog site has been archived. Go to [react.dev/blog](https://react.dev/blog) to see the recent posts.

</div>

В этом году конференция [React Conf](https://conf.reactjs.org/) проходила в Хендерсоне в штате Невада с 25 по 26 октября. На конференцию пришли более 600 посетителей, чтобы обсудить новшества разработки интерфейсов.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/V-QO-KO90iQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Софи Алперт и Дэн Абрамов открыли первый день конференции главным докладом на тему «React сегодня и React завтра». В своём докладе они впервые представили [хуки](/docs/hooks-intro.html) -- новую разработку, которая позволяет использовать функционал, вроде состояния, без помощи JavaScript-классов. В перспективе хуки должны существенно упростить код React-компонентов и уже доступны в альфа-версии React.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/ByBPyMBTzM0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Утро второго дня Эндрю Кларк и Брайан Вон начали с презентации конкурентного рендеринга в React. Эндрю рассказал о недавно анонсированном API для разделения кода -- [React.Lazy](/blog/2018/10/23/react-v-16-6.html) -- и продемонстрировал новый функционал: конкурентный режим и задержку. А Брайан наглядно показал, как ускорять приложения на базе React при помощи инструментов [нового React Profiler](/blog/2018/09/10/introducing-the-react-profiler.html).

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/UcqRXTriUVI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Во второй половине дня Парашурам Н в подробностях рассказал о новой архитектуре React Native -- долгосрочном проекте, который команда React Native [анонсировала ещё в июне](https://reactnative.dev/blog/2018/06/14/state-of-react-native-2018) и работала над ним весь прошлый год. Проект призван улучшить производительность, упростить интеграцию с другими библиотеками и создать крепкую основу для развития React Native. Мы верим в потенциал проекта и с нетерпением ждём релиза.

Конференция прошла, и записи всех 28 докладов [теперь находятся в открытом доступе](https://www.youtube.com/playlist?list=PLPxbbTqCLbGE5AihOSExAa4wUM-P42EIJ). За два дня набралась уйма интересных выступлений! Мы уже ждём не дождёмся следующего года!
