---
id: design-principles
title: Принципы проектирования React
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

Мы написали этот документ, чтобы у вас было лучшее представление о том, как мы решаем, что делает React, а что нет, и какова наша философия разработки. Хоть мы и рады видеть вклад сообщества, мы вряд ли выберем путь, который нарушает один или несколько из этих принципов.

>**Примечание:**
>
>Эта статья подразумевает глубокое понимание React. В ней описаны концепции разработки *самого React*, но не React-компонент или приложений.
>
>Для знакомства с React почитайте [Философия React](/docs/thinking-in-react.html).

### Композиция {#composition}

Ключевая возможность React — это композиция компонентов. Компоненты, написанные разными людьми, должны хорошо работать вместе. Для нас важно, что вы можете добавлять в компонент функционал, не вызывая волну изменений по всему коду.

Например, должна быть возможность вводить некое внутреннее состояние в компонент без изменения использующих его компонентов. Так же, должна быть возможность добавлять при необходимости код инициализации и разрушения в любой компонент.

Нет ничего «плохого» в использовании состояния или методов жизненного цикла в компонентах. Как и любую мощную возможность, их стоит использовать в меру, но мы не собираемся их удалять. Напротив, мы считаем, что они являются неотъемлемой частью того, что делает React полезным. Возможно, мы добавим [больше функциональных шаблонов](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) в будущем, но как внутреннее состояние, так и методы жизненного цикла будут частью этой модели.

Компоненты часто описываются как «просто функции», но, по нашему мнению, они должны быть чем-то большим, чтобы быть полезными. Компоненты в React описывают поведение, которое можно композировать. Эта идея распространяется в том числе на рендеринг, жизненный цикл и состояние. Некоторые сторонние библиотеки, вроде [Relay](https://facebook.github.io/relay/), дополняют компоненты другими возможностями, например, описанием зависимостей данных. Вполне возможно, что эти идеи могут попасть в React в той или иной форме.

### Общая абстракция {#common-abstraction}

В целом, мы [против добавления функциональности](https://www.youtube.com/watch?v=4anAwXYqLG8), которая может быть реализована в пользовательских приложениях. Мы не хотим заполнять ваше приложения бесполезным кодом библиотеки. Но, из этого правила есть исключения.

Например, если бы React не предоставлял поддержку внутреннего состояния или методов жизненного цикла, люди бы создавали собственные абстракции для них. Когда есть несколько конкурирующих абстракций, React не может применять или использовать их свойства. Он должен работать с наименьшим общим знаменателем.

Вот почему иногда мы добавляем функционал в сам React. Если мы замечаем, что какой-то функционал реализуется несовместимо или неэффективно во многих компонентах, мы можем захотеть внедрить его в React. Это не происходит просто так. 
Если мы добавляем новый функционал, значит мы уверены, что повышение уровня абстракции принесёт выгоду всей экосистеме. Хорошие примеры для этого — состояние, методы жизненного цикла, кросс-браузерная нормализация событий.

Мы всегда обсуждаем с сообществом такие предложения по улучшению. Некоторые из этих обсуждений можно найти по метке [«big picture»](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") в трекере задач React.

### Лазейки {#escape-hatches}

React прагматичен. Это обусловлено потребностями продуктов, написанных в Facebook. Хоть на него и влияют некоторые не самые популярные парадигмы, такие как функциональное программирование, цель проекта — оставаться доступным для широкого круга разработчиков с разным уровнем опыта и навыками.

Если мы хотим отказаться от паттерна, который нам не нравится, мы должны рассмотреть все существующие варианты его использования и [проинформировать сообщество об альтернативах](/blog/2016/07/13/mixins-considered-harmful.html), прежде чем отказаться от него. Если какой-то полезный для создания приложений паттерн трудно описать декларативно, мы [предоставим для него императивное API](/docs/more-about-refs.html). Если мы не можем найти идеальное API для того, что мы считаем необходимым во многих приложениях, мы [предоставим временное, частично работающее API](/docs/legacy-context.html), позже от него можно будет избавиться. Это оставляет открытую дверь для будущих улучшений.

### Стабильность {#stability}

Мы ценим стабильность API. У нас в Facebook более 50 тысяч компонент, использующих React. Многие другие компании, включая [Twitter](https://twitter.com/) и [Airbnb](https://www.airbnb.com/), также активно используют React. Поэтому мы обычно нехотя меняем публичное API или поведение.

Однако, мы считаем преувеличением думать, что стабильность — это когда «ничего не меняется». Это быстро приводит к застою. Вместо этого, мы предпочитаем воспринимать стабильность в смысле «это много используется в продакшене и когда что-то меняется, существует четкий (и желательно автоматизированный) план миграции».

Когда мы исключаем паттерн, мы изучаем как он используется внутри Facebook и добавляем предупреждения об исключении. Что позволяет нам оценить эффект изменения. Иногда мы отменяем изменения, если видим, что ещё слишком рано и нам нужно продумать стратегию продвижения кодовой базы к точке готовности к изменениям.

Если мы уверены, что изменение не слишком большое и для всех случаев использования возможна миграция, то предупреждение об исключении выпускается в OSS-сообщество. Мы тесно общаемся со многими React-пользователями вне Facebook, следим за популярными OSS-проектами и помогаем им исправлять устаревший код.

Учитывая огромный размер кодовой базы React в Facebook, успешная внутренняя миграция часто является хорошим индикатором того, что в других компаниях также не будет проблем. Тем не менее, люди иногда указывают на неучтенные варианты использования и мы добавляем лазейки или пересматриваем подход.

Ничего не исключается без веской причины. Мы понимаем, что иногда предупреждения об исключениях разочаровывают. Но они добавляются, так как исключения открывают дорогу для улучшений и новых возможностей, которые мы и сообщество считаем важными.

Например, мы добавили [предупреждение о неизвестных DOM-свойствах](/warnings/unknown-prop.html) в React 15.2.0. Этим мы затронули многие проекты. Однако, исправление этого предупреждения важно для добавления в React поддержки [пользовательских атрибутов](https://github.com/facebook/react/issues/140). Подобная причина стоит за каждым исключением, которое мы добавляем.

При добавлении предупреждения об исключении, мы не удаляем его пока текущая мажорная версия не устарела, [изменяя поведение только в следующей мажорной версии](/blog/2016/02/19/new-versioning-scheme.html). Если исключение создаёт много повторяющейся ручной работы, мы публикуем [codemod-скрипт](https://www.youtube.com/watch?v=d0pOgY8__JM), который автоматизирует большую часть изменений. Codemod-скрипты дают нам возможность двигаться вперёд, не закапываясь в куче кода. Рекомендуем вам тоже их использовать.

Вы можете найти уже вышедшие codemod-скрипты в [react-codemod](https://github.com/reactjs/react-codemod) репозитории.

### Совместимость {#interoperability}

Мы придаём большое значение совместимости с существующими системами и возможности постепенного внедрения. В Facebook есть много кода, написанного не на React. Сайт использует смесь из  XHP — системы серверных компонент, внутренних UI-библиотек, которые пришли до React, и самого React. Для нас важно, что любая продуктовая команда может [начать использовать React для небольшого функционала](https://www.youtube.com/watch?v=BF58ZJ1ZQxY), а не делать ставку на переписывание своего кода.

По этой причине React предоставляет лазейки для работы с изменяемыми моделями и пытается хорошо работать вместе с другими UI-библиотеками. Вы можете обернуть существующий императивный UI в декларативный компонент и наоборот. Это очень важно для постепенного внедрения.

### Планирование {#scheduling}

Даже если компоненты описаны как функции, при использовании React они не вызываются напрямую. Каждый компонент возвращает [описание того, что должно быть отрендерено](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree). Описание может включать как пользовательские компоненты, такие как `<LikeButton>`, так и платформо-зависимые компоненты, такие как `<div>`. В дальнейшем в какой-то момент React может «развернуть» `<LikeButton>` и фактически применить изменения к UI-дереву в соответствии с результатами рекурсивного рендеринга компонент.

Это тонкое, но сильное различие. Поскольку вы не вызываете этот функциональный компонент, а позволяете React вызывать его, это означает, что React может отложить вызов при необходимости. В текущей реализации React рекурсивно обходит дерево и вызывает функции рендера всего обновлённого дерева за один проход. Но в будущем он может начать [задерживать некоторые обновления, чтобы избежать потери кадров](https://github.com/facebook/react/issues/6170).

Это частая тема в архитектуре React. Некоторые популярные библиотеки реализуют подход «прослушивание», когда вычисления выполняются при появлении новых данных. React, наоборот, придерживается подхода «опрашивание», когда вычисления могут быть запрошены при необходимости.

React не является универсальной библиотекой обработки данных. Это библиотека для создания пользовательских интерфейсов. Мы считаем, что приложение должно знать какие вычисления сейчас актуальны, а какие нет.

Если что-то находится вне экрана, можно отложить любую связанную с этим логику. Если данные поступают быстрее, чем кадры успевают обновиться, можно объединить их и обновлять пакетами. Мы можем приоритизировать работу, вызванную пользовательским взаимодействием (например, анимация нажатия кнопки), над менее важной фоновой работой (например, рендеринг только что загруженного из сети компонента), чтобы избежать потери кадров.

Чтобы было понятно, мы не пользуемся этим прямо сейчас. Однако, подобная свобода объясняет, почему мы предпочитаем контролировать планирование и почему `setState()` асинхронна. Концептуально мы думаем об этом как о «планировании обновления».

Нам было бы труднее получить контроль над планированием, если бы мы позволили пользователям напрямую создавать представления на основе «push» парадигмы, распространённой в некоторых вариациях [Функционального реактивного программирования](https://en.wikipedia.org/wiki/Functional_reactive_programming). Мы хотим владеть «склеивающим» кодом.

Ключевая задача для React — минимизировать количество пользовательского кода, выполняемого перед возвращением обратно в React. Это гарантирует, что React сохранит возможность планировать и разбивать работу на части в соответствии с тем, что ему известно о UI.

В команде есть внутренняя шутка, что React должен был называться «Schedule», потому что React не хочет быть полностью «реактивным».

### Developer Experience {#developer-experience}

Providing a good developer experience is important to us.

For example, we maintain [React DevTools](https://github.com/facebook/react-devtools) which let you inspect the React component tree in Chrome and Firefox. We have heard that it brings a big productivity boost both to the Facebook engineers and to the community.

We also try to go an extra mile to provide helpful developer warnings. For example, React warns you in development if you nest tags in a way that the browser doesn't understand, or if you make a common typo in the API. Developer warnings and the related checks are the main reason why the development version of React is slower than the production version.

The usage patterns that we see internally at Facebook help us understand what the common mistakes are, and how to prevent them early. When we add new features, we try to anticipate the common mistakes and warn about them.

We are always looking out for ways to improve the developer experience. We love to hear your suggestions and accept your contributions to make it even better.

### Debugging {#debugging}

When something goes wrong, it is important that you have breadcrumbs to trace the mistake to its source in the codebase. In React, props and state are those breadcrumbs.

If you see something wrong on the screen, you can open React DevTools, find the component responsible for rendering, and then see if the props and state are correct. If they are, you know that the problem is in the component’s `render()` function, or some function that is called by `render()`. The problem is isolated.

If the state is wrong, you know that the problem is caused by one of the `setState()` calls in this file. This, too, is relatively simple to locate and fix because usually there are only a few `setState()` calls in a single file.

If the props are wrong, you can traverse the tree up in the inspector, looking for the component that first "poisoned the well" by passing bad props down.

This ability to trace any UI to the data that produced it in the form of current props and state is very important to React. It is an explicit design goal that state is not "trapped" in closures and combinators, and is available to React directly.

While the UI is dynamic, we believe that synchronous `render()` functions of props and state turn debugging from guesswork into a boring but finite procedure. We would like to preserve this constraint in React even though it makes some use cases, like complex animations, harder.

### Configuration {#configuration}

We find global runtime configuration options to be problematic.

For example, it is occasionally requested that we implement a function like `React.configure(options)` or `React.register(component)`. However this poses multiple problems, and we are not aware of good solutions to them.

What if somebody calls such a function from a third-party component library? What if one React app embeds another React app, and their desired configurations are incompatible? How can a third-party component specify that it requires a particular configuration? We think that global configuration doesn't work well with composition. Since composition is central to React, we don't provide global configuration in code.

We do, however, provide some global configuration on the build level. For example, we provide separate development and production builds. We may also [add a profiling build](https://github.com/facebook/react/issues/6627) in the future, and we are open to considering other build flags.

### Beyond the DOM {#beyond-the-dom}

We see the value of React in the way it allows us to write components that have fewer bugs and compose together well. DOM is the original rendering target for React but [React Native](https://facebook.github.io/react-native/) is just as important both to Facebook and the community.

Being renderer-agnostic is an important design constraint of React. It adds some overhead in the internal representations. On the other hand, any improvements to the core translate across platforms.

Having a single programming model lets us form engineering teams around products instead of platforms. So far the tradeoff has been worth it for us.

### Implementation {#implementation}

We try to provide elegant APIs where possible. We are much less concerned with the implementation being elegant. The real world is far from perfect, and to a reasonable extent we prefer to put the ugly code into the library if it means the user does not have to write it. When we evaluate new code, we are looking for an implementation that is correct, performant and affords a good developer experience. Elegance is secondary.

We prefer boring code to clever code. Code is disposable and often changes. So it is important that it [doesn't introduce new internal abstractions unless absolutely necessary](https://youtu.be/4anAwXYqLG8?t=13m9s). Verbose code that is easy to move around, change and remove is preferred to elegant code that is prematurely abstracted and hard to change.

### Optimized for Tooling {#optimized-for-tooling}

Some commonly used APIs have verbose names. For example, we use `componentDidMount()` instead of `didMount()` or `onMount()`. This is [intentional](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). The goal is to make the points of interaction with the library highly visible.

In a massive codebase like Facebook, being able to search for uses of specific APIs is very important. We value distinct verbose names, and especially for the features that should be used sparingly. For example, `dangerouslySetInnerHTML` is hard to miss in a code review.

Optimizing for search is also important because of our reliance on [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) to make breaking changes. We want it to be easy and safe to apply vast automated changes across the codebase, and unique verbose names help us achieve this. Similarly, distinctive names make it easy to write custom [lint rules](https://github.com/yannickcr/eslint-plugin-react) about using React without worrying about potential false positives.

[JSX](/docs/introducing-jsx.html) plays a similar role. While it is not required with React, we use it extensively at Facebook both for aesthetic and pragmatic reasons.

In our codebase, JSX provides an unambiguous hint to the tools that they are dealing with a React element tree. This makes it possible to add build-time optimizations such as [hoisting constant elements](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/), safely lint and codemod internal component usage, and [include JSX source location](https://github.com/facebook/react/pull/6771) into the warnings.

### Dogfooding {#dogfooding}

We try our best to address the problems raised by the community. However we are likely to prioritize the issues that people are *also* experiencing internally at Facebook. Perhaps counter-intuitively, we think this is the main reason why the community can bet on React.

Heavy internal usage gives us the confidence that React won't disappear tomorrow. React was created at Facebook to solve its problems. It brings tangible business value to the company and is used in many of its products. [Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) it means that our vision stays sharp and we have a focused direction going forward.

This doesn't mean that we ignore the issues raised by the community. For example, we added support for [web components](/docs/webcomponents.html) and [SVG](https://github.com/facebook/react/pull/6243) to React even though we don't rely on either of them internally. We are actively [listening to your pain points](https://github.com/facebook/react/issues/2686) and [address them](/blog/2016/07/11/introducing-reacts-error-code-system.html) to the best of our ability. The community is what makes React special to us, and we are honored to contribute back.

After releasing many open source projects at Facebook, we have learned that trying to make everyone happy at the same time produced projects with poor focus that didn't grow well. Instead, we found that picking a small audience and focusing on making them happy brings a positive net effect. That's exactly what we did with React, and so far solving the problems encountered by Facebook product teams has translated well to the open source community.

The downside of this approach is that sometimes we fail to give enough focus to the things that Facebook teams don't have to deal with, such as the "getting started" experience. We are acutely aware of this, and we are thinking of how to improve in a way that would benefit everyone in the community without making the same mistakes we did with open source projects before.
