---
id: faq-versioning
title: Политика версионирования
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React следует принципам [семантического версионирования (semver)](https://semver.org/lang/ru/).

Это значит, что для номера версии вида **x.y.z**:

<<<<<<< HEAD
* При выпуске **обратно несовместимых изменений**, мы делаем **мажорный релиз**, изменяя число **x**  (например, с 15.6.2 до 16.0.0).
* При выпуске **новых возможностей**, мы делаем **минорный релиз**, изменяя число **y** (например, с 15.6.2 до 15.7.0).
* При выпуске **исправлений ошибок**, мы делаем **патч-релиз**, изменяя число **z** (например, с 15.6.2 до 15.6.3).
=======
* When releasing **critical bug fixes**, we make a **patch release** by changing the **z** number (ex: 15.6.2 to 15.6.3).
* When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the **y** number (ex: 15.6.2 to 15.7.0).
* When releasing **breaking changes**, we make a **major release** by changing the **x** number (ex: 15.6.2 to 16.0.0).
>>>>>>> 647b639259919f96e9b667bf41ec16621e1b84dc

Мажорные релизы могут содержать новые возможности. Каждый релиз может содержать исправления ошибок.

<<<<<<< HEAD
### Обратно несовместимые изменения {#breaking-changes}
=======
Minor releases are the most common type of release.

### Breaking Changes {#breaking-changes}
>>>>>>> 647b639259919f96e9b667bf41ec16621e1b84dc

Обратно несовместимые изменения неудобны для всех, поэтому мы стараемся минимизировать количество мажорных релизов. Например, React 15 был выпущен в апреле 2016 года, а React 16 — в сентябре 2017 года. React 17 ожидается не раньше 2019 года.

Вместо этого мы выпускаем новые возможности в минорных релизах. Это значит, что минорные релизы зачастую более интересны, чем мажорные, несмотря на порядковый номер версии.

### Ответственное отношение к стабильности {#commitment-to-stability}

Изменяя React, мы стараемся упростить изучение новых возможностей. Кроме этого, мы стараемся сохранить работу старых API, даже если требуется их перенос в отдельный пакет. Например, [мы отказались от примесей несколько лет назад](/blog/2016/07/13/mixins-considered-harmful.html), но они до сих пор поддерживаются [через create-react-class](/docs/react-without-es6.html#mixins) и многие проекты продолжают их использовать в стабильном, устаревшем коде.

Больше миллиона разработчиков React используют, поддерживая миллионы компонентов. Только в кодовой базе Facebook более 50 000 React-компонентов. Всё это обязывает нас делать обновления до новых версий как можно проще. Если мы не предоставим возможности для обновления, люди застрянут на старых версиях. Мы тестируем наши *пути обновления* прямо в Facebook -- если наша команда из 10 человек может обновить более 50 тысяч компонентов, мы думаем, что с этим справятся и другие React-разработчики. Во многих случаях для обновления синтаксиса компонентов мы пишем [скрипты автоматизации](https://github.com/reactjs/react-codemod), которые выкладываем в открытый доступ для всеобщего использования.

### Постепенное обновление через предупреждения {#gradual-upgrades-via-warnings}

Сборки в режиме разработки в React включают множество полезных предупреждений. Когда возможно, мы добавляем предупреждения для будущих обратно несовместимых изменений. Таким образом, если ваше приложение не показывает предупреждений в консоли в последнем релизе, значит оно готово к следующей мажорной версии. Это позволяет вам обновлять приложение компонент за компонентом по одиночке.

Предупреждения в режиме разработки не влияют на то, как исполняется ваше приложение. Таким образом, вы можете быть уверены, что ваше приложение будет вести себя одинаково в режиме разработки и продакшен-режиме. Разница лишь в том, что продакшен-сборка не будет показывать предупреждения в консоли, что, к тому же, более производительно. (Если вы вдруг заметили предупреждение в продакшен-режиме, откройте ишью.)

### Что считается обратно несовместимым изменением? {#what-counts-as-a-breaking-change}

Как правило, мы *не* повышаем мажорную версию для следующих изменений:

* **Предупреждения для разработчиков.** Поскольку они не затрагивают поведение в продакшен-режиме, мы можем добавлять или изменять существующие предупреждения между мажорными версиями. Это позволяет нам заранее предупреждать о новых мажорных изменениях.
* **API с приставкой `unstable_`.** Они добавляют экспериментальные возможности, в API которых мы не уверены до конца. Выпуская такие возможности с приставкой `unstable_`, мы можем их обновлять и переходить к стабильному API быстрее.
* **Альфа и канареечные версии React.** Альфа-версии React позволяют попробовать новые возможности раньше. Мы можем вносить в них изменения на основе обратной связи, полученной в период альфа-тестирования. Если вы используете такие версии, имейте в виду, что API может измениться в стабильной версии.
* **Недокументированные API и внутренние структуры данных.** Мы не гарантируем работоспособность кода в случае использования `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`, `__reactInternalInstance$uk43rzhitjg` или других внутренних переменных.

Наша политика разработана, чтобы быть практичной. Мы не хотим создавать вам головную боль. Если бы мы поднимали мажорную версию слишком часто, то доставили бы множество проблем всему сообществу. И это бы не позволило улучшать React так быстро, как нам хотелось.

<<<<<<< HEAD
Если мы думаем, что изменения могут вызвать проблемы в сообществе, мы постараемся сделать всё возможное, чтобы предоставить плавный переход от старой версии к новой.
=======
That said, if we expect that a change on this list will cause broad problems in the community, we will still do our best to provide a gradual migration path.

### If a Minor Release Includes No New Features, Why Isn't It a Patch? {#minors-versus-patches}

It's possible that a minor release will not include new features. [This is allowed by semver](https://semver.org/#spec-item-7), which states **"[a minor version] MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes."**

However, it does raise the question of why these releases aren't versioned as patches instead.

The answer is that any change to React (or other software) carries some risk of breaking in unexpected ways. Imagine a scenario where a patch release that fixes one bug accidentally introduces a different bug. This would not only be disruptive to developers, but also harm their confidence in future patch releases. It's especially regrettable if the original fix is for a bug that is rarely encountered in practice.

We have a pretty good track record for keeping React releases free of bugs, but patch releases have an even higher bar for reliability because most developers assume they can be adopted without adverse consequences.

For these reasons, we reserve patch releases only for the most critical bugs and security vulnerabilities.

If a release includes non-essential changes — such as internal refactors, changes to implementation details, performance improvements, or minor bugfixes — we will bump the minor version even when there are no new features.
>>>>>>> 647b639259919f96e9b667bf41ec16621e1b84dc
