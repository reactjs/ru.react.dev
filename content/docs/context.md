---
id: context
title: Контекст
permalink: docs/context.html
---

<<<<<<< HEAD
Контекст позволяет передавать данные через дерево компонентов без необходимости передавать пропсы на промежуточных уровнях.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Passing Data Deeply with Context](https://beta.reactjs.org/learn/passing-data-deeply-with-context)
> - [`useContext`](https://beta.reactjs.org/reference/react/useContext)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Context provides a way to pass data through the component tree without having to pass props down manually at every level.
>>>>>>> b0ccb47f33e52315b0ec65edb9a49dc4910dd99c

В типичном React-приложении данные передаются сверху вниз (от родителя к дочернему компоненту) с помощью пропсов. Однако, подобный способ использования может быть чересчур громоздким для некоторых типов пропсов (например, выбранный язык, UI-тема), которые необходимо передавать во многие компоненты в приложении. Контекст предоставляет способ делиться такими данными между компонентами без необходимости явно передавать пропсы через каждый уровень дерева.

- [Когда использовать контекст](#when-to-use-context)
- [Перед тем, как вы начнёте использовать контекст](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [Примеры](#examples)
  - [Динамический контекст](#dynamic-context)
  - [Изменение контекста из вложенного компонента](#updating-context-from-a-nested-component)
  - [Использование нескольких контекстов](#consuming-multiple-contexts)
- [Предостережения](#caveats)
- [Устаревший API](#legacy-api)

## Когда использовать контекст {#when-to-use-context}

Контекст разработан для передачи данных, которые можно назвать «глобальными» для всего дерева React-компонентов (например, текущий аутентифицированный пользователь, UI-тема или выбранный язык). В примере ниже мы вручную передаём проп `theme`, чтобы стилизовать компонент Button:

`embed:context/motivation-problem.js`

Контекст позволяет избежать передачи пропсов в промежуточные компоненты:

`embed:context/motivation-solution.js`

## Перед тем, как вы начнёте использовать контекст {#before-you-use-context}

Обычно контекст используется, если необходимо обеспечить доступ данных во *многих* компонентах на разных уровнях вложенности. По возможности не используйте его, так как это усложняет повторное использование компонентов.

**Если вы хотите избавиться от передачи некоторых пропсов на множество уровней вниз, обычно [композиция компонентов](/docs/composition-vs-inheritance.html) является более простым решением, чем контекст.**

Например, давайте рассмотрим компонент `Page`, который передаёт пропсы `user` и `avatarSize` на несколько уровней вниз, чтобы глубоко вложенные компоненты `Link` и `Avatar` смогли их использовать:

```js
<Page user={user} avatarSize={avatarSize} />
// ... который рендерит ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... который рендерит ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... который рендерит ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Передача пропсов `user` и `avatarSize` вниз выглядит избыточной, если в итоге их использует только компонент `Avatar`.  Так же плохо, если компоненту `Avatar`  вдруг потребуется больше пропсов сверху, тогда вам придётся добавить их на все промежуточные уровни.

Один из способов решить эту проблему **без контекста** — [передать вниз сам компонент `Avatar`](/docs/composition-vs-inheritance.html#containment), в случае чего промежуточным компонентам не нужно знать о пропсах `user` и `avatarSize`:

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Теперь, это выглядит так:
<Page user={user} avatarSize={avatarSize}/>
// ... который рендерит ...
<PageLayout userLink={...} />
// ... который рендерит ...
<NavigationBar userLink={...} />
// ... который рендерит ...
{props.userLink}
```

С этими изменениями, только корневой компонент `Page` знает о том, что компоненты `Link` и `Avatar` используют `user` и `avatarSize`.

**Инверсия управления** может сделать ваш код чище во многих случаях, уменьшая количество пропсов, которые вы должны передавать через ваше приложение, и давая больше контроля корневым компонентам. Однако, такое решение не всегда подходит. Перемещая больше сложной логики вверх по дереву, вы перегружаете вышестоящие компоненты.

Вы не ограничены в передаче строго одного компонента. Вы можете передать несколько дочерних компонентов или, даже, создать для них разные «слоты», [как показано здесь](/docs/composition-vs-inheritance.html#containment):

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

Этого паттерна достаточно для большинства случаев, когда вам необходимо отделить дочерний компонент от его промежуточных родителей. Вы можете пойти ещё дальше, используя [рендер-пропсы](/docs/render-props.html), если дочерним компонентам необходимо взаимодействовать с родителем перед рендером.

Однако, иногда одни и те же данные должны быть доступны во многих компонентах на разных уровнях дерева и вложенности. Контекст позволяет распространить эти данные и их изменения на все компоненты ниже по дереву. Управление текущим языком, UI темой или кешем данных — это пример тех случаев, когда реализация с помощью контекста будет проще использования альтернативных подходов.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Создаёт объект `Context`. Когда React рендерит компонент, который подписан на этот объект, React получит текущее значение контекста из ближайшего подходящего `Provider` выше в дереве компонентов.

Аргумент `defaultValue` используется **только** в том случае, если для компонента нет подходящего `Provider` выше в дереве. Значение по умолчанию может быть полезно для тестирования компонентов в изоляции без необходимости оборачивать их. Обратите внимание: если передать `undefined` как значение `Provider`, компоненты, использующие этот контекст, не будут использовать `defaultValue`.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* некоторое значение */}>
```

Каждый объект `Context` используется вместе с `Provider` компонентом, который позволяет дочерним компонентам, использующим этот контекст, подписаться на его изменения.

Компонент `Provider` принимает проп `value`, который будет передан во все компоненты, использующие этот контекст и являющиеся потомками этого компонента `Provider`. Один `Provider` может быть связан с несколькими компонентами, потребляющими контекст. Так же компоненты `Provider` могут быть вложены друг в друга, переопределяя значение контекста глубже в дереве.

Все потребители, которые являются потомками Provider, будут повторно рендериться, как только проп `value` у Provider изменится. Потребитель (включая [`.contextType`](#classcontexttype) и [`useContext`](/docs/hooks-reference.html#usecontext)) перерендерится при изменении контекста, даже если его родитель, не использующий данный контекст, блокирует повторные рендеры с помощью `shouldComponentUpdate`.

Изменения определяются с помощью сравнения нового и старого значения, используя алгоритм, аналогичный [`Object.is`](//developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).

> Примечание
>
> Способ, по которому определяются изменения, может вызвать проблемы при передаче объекта в `value`: смотрите [Предостережения](#caveats).


### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* выполнить побочный эффект на этапе монтирования, используя значение MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* отрендерить что-то, используя значение MyContext */
  }
}
MyClass.contextType = MyContext;
```

В свойство класса `contextType` может быть назначен объект контекста, созданный с помощью [`React.createContext()`](#reactcreatecontext). С помощью этого свойства вы можете использовать ближайшее и актуальное значение указанного контекста при помощи `this.context`. В этом случае вы получаете доступ к контексту, как во всех методах жизненного цикла, так и в рендер-методе.

> Примечание
>
> Вы можете подписаться только на один контекст, используя этот API. В случае, если вам необходимо использовать больше одного, смотрите [Использование нескольких контекстов](#consuming-multiple-contexts).
>
> Если вы используете экспериментальный [синтаксис публичных полей класса](https://babeljs.io/docs/plugins/transform-class-properties/), вы можете использовать **static** поле класса, чтобы инициализировать ваш `contextType`.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* отрендерить что-то, используя значение MyContext */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* отрендерить что-то, используя значение контекста */}
</MyContext.Consumer>
```

`Consumer` — это React-компонент, который подписывается на изменения контекста. В свою очередь, использование этого компонента позволяет вам подписаться на контекст в [функциональном компоненте](/docs/components-and-props.html#function-and-class-components).

`Consumer` принимает [функцию в качестве дочернего компонента](/docs/render-props.html#using-props-other-than-render). Эта функция принимает текущее значение контекста и возвращает React-компонент. Передаваемый аргумент `value` будет равен ближайшему (вверх по дереву) значению этого контекста, а именно пропу `value` компонента `Provider`. Если такого компонента `Provider` не существует, аргумент `value` будет равен значению `defaultValue`, которое было передано в `createContext()`.

> Примечание
>
> Подробнее про паттерн «_функция как дочерний компонент_» можно узнать на странице [Рендер-пропсы](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

Объекту `Context` можно задать строковое свойство `displayName`. React DevTools использует это свойство при отображении контекста.

К примеру, следующий компонент будет отображаться под именем MyDisplayName в DevTools:

```js{2}
const MyContext = React.createContext(/* некоторое значение */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" в DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" в DevTools
```

## Примеры {#examples}

### Динамический контекст {#dynamic-context}

Более сложный пример динамических значений для UI-темы:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### Изменение контекста из вложенного компонента {#updating-context-from-a-nested-component}

Довольно часто необходимо изменить контекст из компонента, который находится где-то глубоко в дереве компонентов. В этом случае вы можете добавить в контекст функцию, которая позволит потребителям изменить значение этого контекста:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Использование нескольких контекстов {#consuming-multiple-contexts}

Чтобы последующие рендеры (связанные с контекстом) были быстрыми, React делает каждого потребителя контекста отдельным компонентом в дереве.

`embed:context/multiple-contexts.js`

Если два или более значений контекста часто используются вместе, возможно, вам стоит рассмотреть создание отдельного компонента, который будет передавать оба значения дочерним компонентам с помощью паттерна «рендер-пропс».

## Предостережения {#caveats}

Контекст использует сравнение по ссылкам, чтобы определить, когда запускать последующий рендер. Из-за этого существуют некоторые подводные камни, например, случайные повторные рендеры потребителей, при перерендере родителя Provider-компонента. В следующем примере будет происходить повторный рендер потребителя каждый повторный рендер Provider-компонента, потому что новый объект, передаваемый в `value`, будет создаваться каждый раз:

`embed:context/reference-caveats-problem.js`

Один из вариантов решения этой проблемы — хранение этого объекта в состоянии родительского компонента:

`embed:context/reference-caveats-solution.js`

## Устаревший API {#legacy-api}

> Примечание
>
> В прошлом React имел только экспериментальный API контекста. Старый API будет поддерживаться во всех 16.x релизах, но использующие его приложения должны перейти на новую версию. Устаревший API будет удалён в будущем крупном релизе React. Вы можете прочитать [документацию устаревшего контекста здесь](/docs/legacy-context.html).

