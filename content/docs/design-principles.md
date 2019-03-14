---
id: design-principles
title: Design Principles
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

We wrote this document so that you have a better idea of how we decide what React does and what React doesn't do, and what our development philosophy is like. While we are excited to see community contributions, we are not likely to choose a path that violates one or more of these principles.

>**Note:**
>
>This document assumes a strong understanding of React. It describes the design principles of *React itself*, not React components or applications.
>
>For an introduction to React, check out [Thinking in React](/docs/thinking-in-react.html) instead.

### Composition {#composition}

The key feature of React is composition of components. Components written by different people should work well together. It is important to us that you can add functionality to a component without causing rippling changes throughout the codebase.

For example, it should be possible to introduce some local state into a component without changing any of the components using it. Similarly, it should be possible to add some initialization and teardown code to any component when necessary.

There is nothing "bad" about using state or lifecycle methods in components. Like any powerful feature, they should be used in moderation, but we have no intention to remove them. On the contrary, we think they are integral parts of what makes React useful. We might enable [more functional patterns](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) in the future, but both local state and lifecycle methods will be a part of that model.

Components are often described as "just functions" but in our view they need to be more than that to be useful. In React, components describe any composable behavior, and this includes rendering, lifecycle, and state. Some external libraries like [Relay](https://facebook.github.io/relay/) augment components with other responsibilities such as describing data dependencies. It is possible that those ideas might make it back into React too in some form.

### Common Abstraction {#common-abstraction}

In general we [resist adding features](https://www.youtube.com/watch?v=4anAwXYqLG8) that can be implemented in userland. We don't want to bloat your apps with useless library code. However, there are exceptions to this.

For example, if React didn't provide support for local state or lifecycle methods, people would create custom abstractions for them. When there are multiple abstractions competing, React can't enforce or take advantage of the properties of either of them. It has to work with the lowest common denominator.

This is why sometimes we add features to React itself. If we notice that many components implement a certain feature in incompatible or inefficient ways, we might prefer to bake it into React. We don't do it lightly. When we do it, it's because we are confident that raising the abstraction level benefits the whole ecosystem. State, lifecycle methods, cross-browser event normalization are good examples of this.

We always discuss such improvement proposals with the community. You can find some of those discussions by the ["big picture"](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") label on the React issue tracker.

### Escape Hatches {#escape-hatches}

React is pragmatic. It is driven by the needs of the products written at Facebook. While it is influenced by some paradigms that are not yet fully mainstream such as functional programming, staying accessible to a wide range of developers with different skills and experience levels is an explicit goal of the project.

If we want to deprecate a pattern that we don't like, it is our responsibility to consider all existing use cases for it and [educate the community about the alternatives](/blog/2016/07/13/mixins-considered-harmful.html) before we deprecate it. If some pattern that is useful for building apps is hard to express in a declarative way, we will [provide an imperative API](/docs/more-about-refs.html) for it. If we can't figure out a perfect API for something that we found necessary in many apps, we will [provide a temporary subpar working API](/docs/legacy-context.html) as long as it is possible to get rid of it later and it leaves the door open for future improvements.

### Stability {#stability}

We value API stability. At Facebook, we have more than 50 thousand components using React. Many other companies, including [Twitter](https://twitter.com/) and [Airbnb](https://www.airbnb.com/), are also heavy users of React. This is why we are usually reluctant to change public APIs or behavior.

However we think stability in the sense of "nothing changes" is overrated. It quickly turns into stagnation. Instead, we prefer the stability in the sense of "It is heavily used in production, and when something changes, there is a clear (and preferably automated) migration path."

When we deprecate a pattern, we study its internal usage at Facebook and add deprecation warnings. They let us assess the impact of the change. Sometimes we back out if we see that it is too early, and we need to think more strategically about getting the codebases to the point where they are ready for this change.

If we are confident that the change is not too disruptive and the migration strategy is viable for all use cases, we release the deprecation warning to the open source community. We are closely in touch with many users of React outside of Facebook, and we monitor popular open source projects and guide them in fixing those deprecations.

Given the sheer size of the Facebook React codebase, successful internal migration is often a good indicator that other companies won't have problems either. Nevertheless sometimes people point out additional use cases we haven't thought of, and we add escape hatches for them or rethink our approach.

We don't deprecate anything without a good reason. We recognize that sometimes deprecations warnings cause frustration but we add them because deprecations clean up the road for the improvements and new features that we and many people in the community consider valuable.

For example, we added a [warning about unknown DOM props](/warnings/unknown-prop.html) in React 15.2.0. Many projects were affected by this. However fixing this warning is important so that we can introduce the support for [custom attributes](https://github.com/facebook/react/issues/140) to React. There is a reason like this behind every deprecation that we add.

When we add a deprecation warning, we keep it for the rest of the current major version, and [change the behavior in the next major version](/blog/2016/02/19/new-versioning-scheme.html). If there is a lot of repetitive manual work involved, we release a [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) script that automates most of the change. Codemods enable us to move forward without stagnation in a massive codebase, and we encourage you to use them as well.

You can find the codemods that we released in the [react-codemod](https://github.com/reactjs/react-codemod) repository.

### Interoperability {#interoperability}

We place high value in interoperability with existing systems and gradual adoption. Facebook has a massive non-React codebase. Its website uses a mix of a server-side component system called XHP, internal UI libraries that came before React, and React itself. It is important to us that any product team can [start using React for a small feature](https://www.youtube.com/watch?v=BF58ZJ1ZQxY) rather than rewrite their code to bet on it.

This is why React provides escape hatches to work with mutable models, and tries to work well together with other UI libraries. You can wrap an existing imperative UI into a declarative component, and vice versa. This is crucial for gradual adoption.

### Scheduling {#scheduling}

Even when your components are described as functions, when you use React you don't call them directly. Every component returns a [description of what needs to be rendered](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree), and that description may include both user-written components like `<LikeButton>` and platform-specific components like `<div>`. It is up to React to "unroll" `<LikeButton>` at some point in the future and actually apply changes to the UI tree according to the render results of the components recursively.

This is a subtle distinction but a powerful one. Since you don't call that component function but let React call it, it means React has the power to delay calling it if necessary. In its current implementation React walks the tree recursively and calls render functions of the whole updated tree during a single tick. However in the future it might start [delaying some updates to avoid dropping frames](https://github.com/facebook/react/issues/6170).

This is a common theme in React design. Some popular libraries implement the "push" approach where computations are performed when the new data is available. React, however, sticks to the "pull" approach where computations can be delayed until necessary.

React is not a generic data processing library. It is a library for building user interfaces. We think that it is uniquely positioned in an app to know which computations are relevant right now and which are not.

If something is offscreen, we can delay any logic related to it. If data is arriving faster than the frame rate, we can coalesce and batch updates. We can prioritize work coming from user interactions (such as an animation caused by a button click) over less important background work (such as rendering new content just loaded from the network) to avoid dropping frames.

To be clear, we are not taking advantage of this right now. However the freedom to do something like this is why we prefer to have control over scheduling, and why `setState()` is asynchronous. Conceptually, we think of it as "scheduling an update".

The control over scheduling would be harder for us to gain if we let the user directly compose views with a "push" based paradigm common in some variations of [Functional Reactive Programming](https://en.wikipedia.org/wiki/Functional_reactive_programming). We want to own the "glue" code.

It is a key goal for React that the amount of the user code that executes before yielding back into React is minimal. This ensures that React retains the capability to schedule and split work in chunks according to what it knows about the UI.

There is an internal joke in the team that React should have been called "Schedule" because React does not want to be fully "reactive".

### Удобство разработки {#developer-experience}

Нам важно сделать разработку удобной.

Например, мы поддерживаем [React DevTools](https://github.com/facebook/react-devtools), при помощи которых можно просмотреть дерево React-компонент в Chrome и Firefox. Мы слышали, что это повышает производительность как инженеров Facebook, так и сообщества.

Мы также стараемся сделать всё возможное, чтобы предоставить полезные предупреждения для разработчиков. Например, во время разработки React предупреждает вас, если теги вложены непонятным для браузера образом, или если в API сделана опечатка. Предупреждения и связанные с ними проверки являются основной причиной, почему версия React для разработчиков медленнее чем продакшен версия.

Наблюдение за использованием паттернов внутри Facebook, помогает нам найти наиболее частые ошибки и понять как предотвратить их заранее. Когда мы добавляем новые возможности, мы стараемся предугадать возникновение частых ошибок и предупреждаем о них.

Мы всегда ищем способы сделать разработку удобнее. И рады вашим предложениям и содействию по улучшениям.

### Отладка {#debugging}

Когда что-то идёт не так, важно иметь хлебные крошки, чтобы найти источник ошибки в кодовой базе. В React хлебными крошками являются свойства и состояние.

Если вы видите на экране, что что-то не так, можете открыть React DevTools, найти компонент, отвечающий за рендеринг, а затем проверить правильность пропсов и состояния. Если они в порядке, значит проблема в `render()` функции компонента или в какой-то функции, вызываемой в `render()`. Проблема изолирована.

Если состояние неверно, значит проблему спровоцировал один из вызовов `setState()` в этом файле. Её также относительно просто найти и исправить, так как в одном файле обычно всего несколько вызовов `setState()`.

Если свойства неверны, вы можете пройти в инспекторе вверх по дереву, в поисках первого компонента, который «отравил колодец», передав плохие свойства вниз.

Для React очень важна возможность отследить любой UI до данных, на которых он построен, в виде текущих свойств и состояния. Явная цель проектирования, чтобы состояние не «пропадало» в замыканиях и вычислениях, и было доступно напрямую в React.

Хотя UI динамичен, мы считаем, что синхронные `render()` функции свойств и состояния превращают отладку из гадания в скучный, но конечный процесс. Мы хотели бы сохранить это ограничение в React, хотя это усложняет некоторые варианты использования, такие как сложная анимация.

### Конфигурация {#configuration}

Мы считаем, что возможность глобальной конфигурации во время выполнения, может стать проблемой.

Например, иногда нас просят реализовать такую функцию, как `React.configure(options)` или `React.register(component)`. Но это создаёт множество проблем, и мы не знаем хороших решений для них.

Что если кто-то вызовет такую функцию из сторонней библиотеки компонентов? Что если одно React-приложение встраивает другое React-приложение и нужные им конфигурации несовместимы? Как сторонний компонент может указать, что ему нужна определённая конфигурация? Мы думаем, что глобальная конфигурация плохо работает с композицией. Поскольку композиция для React первостепенна, мы не позволяем менять глобальную конфигурацию в коде.

Однако, мы предоставляем некоторые глобальные настройки на уровне сборки. Например, мы предоставляем отдельные сборки для разработки и продакшена. В будущем мы можем [добавить профилирующую сборку](https://github.com/facebook/react/issues/6627). Мы также открыты для рассмотрения других флагов сборки.

### За пределами DOM {#beyond-the-dom}

Мы видим ценность React в том, что он позволяет писать компоненты, в которых меньше ошибок и которые хорошо сочетаются друг с другом. Исходной целью рендеринга для React является DOM, но [React Native](https://facebook.github.io/react-native/) также важен, как для Facebook, так и для сообщества.

Быть независимым от визуализации — важное ограничение в дизайне React. Это создаёт некоторые накладные расходы во внутренних представлениях. С другой стороны, любые улучшения ядра переносятся между платформами.

Наличие единой модели программирования позволяет нам создавать инженерные команды вокруг продуктов, а не платформ. Пока компромисс того стоил.

### Реализация {#implementation}

Мы стараемся предоставлять изящное API везде где возможно. Но мы гораздо меньше обеспокоены изящностью реализации. Реальный мир далёк от идеала и мы предпочитаем добавлять некрасивый код в библиотеку в разумной степени, если это означает, что пользователю не нужно его писать. Когда мы оцениваем новый код, мы смотрим на правильность реализации, производительность и удобство разработки. Изящность вторична.

Мы предпочитаем скучный код умному. Код одноразовый и часто меняется. Поэтому важно, чтобы он [не привносил новых внутренних абстракций без крайней необходимости](https://youtu.be/4anAwXYqLG8?t=13m9s). Подробный код, который легко перемещать, изменять и удалять, предпочтительнее изящного, преждевременно абстрагированного и трудно изменяемого кода.

### Оптимизирован для инструментов {#optimized-for-tooling}

Некоторые часто используемые API имеют длинные имена. Например, мы [специально](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124) используем `componentDidMount()` вместо `didMount()` или `onMount()`. Цель в том, чтобы сделать точки взаимодействия с библиотекой хорошо заметными.

В такой большой кодовой базе, как у Facebook, очень важно иметь возможность поиска использования определённых API. Мы ценим разные длинные имена, особенно для функционала, который следует использовать редко. Например, `dangerouslySetInnerHTML` трудно пропустить на кодревью.

Оптимизация для поиска также важна, так как мы зависим от [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM)-скриптов для внесения критических изменений. Мы хотим, чтобы было легко и безопасно вносить большие автоматизированные изменения в кодовую базу, а уникальные длинные имена нам в этом помогают. Подобно этому, уникальные имена позволяют легко создавать собственные [правила анализа](https://github.com/yannickcr/eslint-plugin-react) использования React, не беспокоясь о возможных ложных срабатываниях.

Аналогичную роль играет [JSX](/docs/introducing-jsx.html). Хотя он необязателен для работы React, мы широко используем его в Facebook как по эстетическим, так и по практическим соображениям.

В нашей кодовой базе JSX предоставляет однозначные подсказки для инструментов, работающих с деревом React-элементов. Это позволяет добавлять оптимизации во время сборки, такие как [всплытие неизменяющихся элементов](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/), безопасный анализ и использование внутреннего компонента codemod, и добавление в предупреждения [пути до исходников JSX кода](https://github.com/facebook/react/pull/6771).

### Догфудинг {#dogfooding}

Мы стараемся решать проблемы, поднятые сообществом. Однако, скорее всего, мы будем отдавать приоритет тем проблем, с которыми люди *также* сталкиваются внутри Facebook. Возможно нелогично, но мы думаем, что это основная причина, по которой сообщество может полагаться на React.

Интенсивное внутреннее использование даёт нам уверенность в том, что React не исчезнет завтра. React был создан в Facebook для решения своих проблем. Он приносит ощутимую бизнес-ценность компании и используется во многих её продуктах. [Догфудинг](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) — это означает, что наше видение остаётся ясным и мы сфокусированы на движении вперёд.

Это не означает, что мы игнорируем вопросы, поднятые сообществом. Например, мы добавили поддержку [web-компонентов](/docs/webcomponents.html) и [SVG](https://github.com/facebook/react/pull/6243) в React, хотя мы не используем их внутри. Мы активно [следим за вашими проблемами](https://github.com/facebook/react/issues/2686) и [устраняем их](/blog/2016/07/11/introducing-reacts-error-code-system.html) по мере наших возможностей. Сообщество — это то что делает React особенным для нас и мы рады внести свой вклад.

Выпустив много OSS-проектов в Facebook, мы поняли, что попытка сделать всех счастливыми в то же время приводит к созданию слишком общих проектов, которые плохо развиваются. Наоборот, мы обнаружили, что выбор узкой аудитории и фокусировка ней, приносит положительный конечный результат. Именно это мы сделали с React. И до сих пор решение проблем, с которыми сталкиваются продуктовые команды Facebook, хорошо транслировались на OSS-сообщество.

Недостатком этого подхода является то, что иногда мы не уделяем достаточного внимания тем вещам, с которыми командам Facebook не приходится сталкиваться, такими как опыт «начала работы». Мы хорошо знаем об этой проблеме. И думаем над тем как сделать лучше так, чтобы это принесло пользу всем в сообществе, не совершая тех же ошибок, которые мы делали в OSS-проектах до этого.
