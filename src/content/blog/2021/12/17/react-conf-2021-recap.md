---
title: "React Conf 2021 Recap"
author: Jesslyn Tannady and Rick Hanlon
date: 2021/12/17
description: На прошлой неделе мы провели шестую React Conf. В предыдущие годы мы использовали сцену React Conf для объявления важных для индустрии новостей, таких как React Native и React Hooks. В этом году мы поделились нашим видением React для различных платформ, начиная с выпуска React 18 и постепенного внедрения конкурентных функций.
---

17 декабря 2021 г. от [Jesslyn Tannady](https://twitter.com/jtannady) и [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

На прошлой неделе мы провели 6-ю React Conf. В предыдущие годы мы использовали сцену React Conf для объявления важных для индустрии новостей, таких как [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) и [_React Hooks_](https://reactjs.org/docs/hooks-intro.html). В этом году мы поделились нашим видением React для множества платформ, начиная с выпуска React 18 и постепенного внедрения конкурентных функций.

</Intro>

---

Это была первая React Conf, проведенная онлайн, и она транслировалась бесплатно, с переводом на 8 разных языков. Участники со всего мира присоединились к нашему конференц- Discord и к повторному показу для доступности во всех часовых поясах. Зарегистрировалось более 50 000 человек, было более 60 000 просмотров 19 докладов и 5 000 участников в Discord на обоих мероприятиях.

Все доклады [доступны для просмотра онлайн](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

Вот краткое изложение того, что было представлено на сцене:

## React 18 и конкурентные функции {/*react-18-and-concurrent-features*/}

В основной докладе мы поделились нашим видением будущего React, начиная с React 18.

React 18 добавляет долгожданный конкурентный рендерер и обновления Suspense без каких-либо серьезных нарушений совместимости. Приложения могут обновиться до React 18 и начать постепенно внедрять конкурентные функции с объемом усилий, сопоставимым с любым другим основным выпуском.

**Это означает, что нет конкурентного режима, а есть только конкурентные функции.**

В основной докладе мы также поделились нашим видением Suspense, Server Components, новых рабочих групп React и нашего долгосрочного видения React Native для множества платформ.

Посмотрите полный основной доклад от [Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes) и [Rick Hanlon](https://twitter.com/rickhanlonii) здесь:

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## React 18 для разработчиков приложений {/*react-18-for-application-developers*/}

В основном докладе мы также объявили, что React 18 RC доступен для тестирования. В ожидании дальнейших отзывов, это именно та версия React, которую мы опубликуем в стабильной версии в начале следующего года.

Чтобы попробовать React 18 RC, обновите ваши зависимости:

```bash
npm install react@rc react-dom@rc
```

и переключитесь на новый API `createRoot`:

```js
// до
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// после
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

Демонстрацию обновления до React 18 можно посмотреть в докладе [Shruti Kapoor](https://twitter.com/shrutikapoor08) здесь:

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Потоковая серверная отрисовка с Suspense {/*streaming-server-rendering-with-suspense*/}

React 18 также включает улучшения производительности серверной отрисовки с использованием Suspense.

Потоковая серверная отрисовка позволяет генерировать HTML из React-компонентов на сервере и передавать этот HTML пользователям. В React 18 вы можете использовать `Suspense` для разбиения вашего приложения на меньшие независимые части, которые могут передаваться независимо друг от друга, не блокируя остальную часть приложения. Это означает, что пользователи увидят ваш контент раньше и смогут начать взаимодействовать с ним намного быстрее.

Для более подробного изучения посмотрите доклад [Shaundai Person](https://twitter.com/shaundai) здесь:

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## Первая рабочая группа React {/*the-first-react-working-group*/}

Для React 18 мы создали нашу первую Рабочую группу для сотрудничества с группой экспертов, разработчиков, мейнтейнеров библиотек и преподавателей. Вместе мы работали над созданием нашей стратегии постепенного внедрения и доработкой новых API, таких как `useId`, `useSyncExternalStore` и `useInsertionEffect`.

Обзор этой работы представлен в докладе [Aakansha Doshi](https://twitter.com/aakansha1216):

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## Инструменты разработчика React {/*react-developer-tooling*/}

Для поддержки новых функций в этом выпуске мы также анонсировали недавно сформированную команду React DevTools и новый Timeline Profiler, чтобы помочь разработчикам отлаживать свои React-приложения.

Более подробную информацию и демонстрацию новых функций DevTools можно найти в докладе [Brian Vaughn](https://twitter.com/brian_d_vaughn):

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## React без memo {/*react-without-memo*/}

Заглядывая дальше в будущее, [Xuan Huang (黄玄)](https://twitter.com/Huxpro) поделился обновлением из наших исследований React Labs по поводу автоматически мемоизирующего компилятора. Ознакомьтесь с этим докладом для получения дополнительной информации и демонстрации прототипа компилятора:

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## Основной доклад по документации React {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors) начала секцию докладов об обучении и дизайне с React с основного доклада о наших инвестициях в новую документацию React ([теперь доступна на react.dev](/blog/2023/03/16/introducing-react-dev)):

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## И многое другое... {/*and-more*/}

**Мы также услышали доклады об обучении и дизайне с React:**

* Debbie O'Brien: [Things I learnt from the new React docs](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [Learning in the Browser](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [The ROI of Designing with React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [Interactive playgrounds with React](https://youtu.be/zL8cz2W0z34).

**Доклады от команд Relay, React Native и PyTorch:**

* Robert Balicki: [Re-introducing Relay](https://youtu.be/lhVGdErZuN4).
* Eric Rozell and Steven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [On-device Machine Learning for React Native](https://youtu.be/NLj73vrc2I8)

**И доклады от сообщества по доступности, инструментам и Server Components:**

* Daishi Kato: [React 18 for External Store Libraries](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [Building Accessible Components in React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [Accessible Japanese Form Components with React](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [UI tools for artists](https://youtu.be/b3l4WxipFsE).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

## Спасибо {/*thank-you*/}

Это был наш первый год самостоятельной организации конференции, и нам есть кого поблагодарить.

Прежде всего, спасибо всем нашим спикерам [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0) и [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Спасибо всем, кто помог предоставить отзывы о докладах, включая [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS), [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors) и [Tim Yung](https://twitter.com/yungsters).

Спасибо [Lauren Tan](https://twitter.com/potetotes) за настройку конференц- Discord и за работу в качестве нашего администратора Discord.

Спасибо [Seth Webster](https://twitter.com/sethwebster) за отзывы об общем направлении и за то, что он убедился, что мы сосредоточены на разнообразии и инклюзивности.

Спасибо [Rachel Nabors](https://twitter.com/rachelnabors) за руководство нашей работой по модерации, а [Aisha Blake](https://twitter.com/AishaBlake) за создание нашего руководства по модерации, руководство нашей командой модераторов, обучение переводчиков и модераторов, а также за помощь в модерации обоих мероприятий.

Спасибо нашим модераторам [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li и [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Спасибо [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0) и Vihang Patel из [React India](https://www.reactindia.io/), а также [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15) и [YanLun Li](https://twitter.com/anneincoding) из [React China](https://twitter.com/ReactChina) за помощь в модерации нашего повторного показа и поддержании его активности для сообщества.

Спасибо Vercel за публикацию их [Virtual Event Starter Kit](https://vercel.com/virtual-event-starter-kit), на котором был построен веб-сайт конференции, и [Lee Robinson](https://twitter.com/leeerob) и [Delba de Oliveira](https://twitter.com/delba_oliveira) за то, что поделились своим опытом проведения Next.js Conf.

Спасибо [Leah Silber](https://twitter.com/wifelette) за то, что поделилась своим опытом проведения конференций, уроками из проведения [RustConf](https://rustconf.com/) и своей книгой [Event Driven](https://leanpub.com/eventdriven/) и советами по проведению конференций.

Спасибо [Kevin Lewis](https://twitter.com/_phzn) и [Rachel Nabors](https://twitter.com/rachelnabors) за то, что поделились своим опытом проведения Women of React Conf.

Спасибо [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic) и [Shaundai Person](https://twitter.com/shaundai) за их советы и идеи на протяжении всего планирования.

Спасибо [Dan Lebowitz](https://twitter.com/lebo) за помощь в дизайне и создании веб-сайта конференции и билетов.

Спасибо Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman и другим из команды Facebook Video Productions за запись видео для основного доклада и докладов сотрудников Meta.

Спасибо нашему партнеру HitPlay за помощь в организации конференции, редактировании всех видео в трансляции, переводе всех докладов и модерации Discord на нескольких языках.

Наконец, спасибо всем нашим участникам за то, что сделали эту React Conf такой замечательной!