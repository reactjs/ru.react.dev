---
title: Представление UI в виде дерева
---

<Intro>

Ваше приложение React формируется с множеством вложенных друг в друга компонентов. Как же React отслеживает структуру компонентов вашего приложения?

React, как и многие другие библиотеки, моделирует UI в виде дерева. Представив ваше приложение в виде дерева, вы сможете лучше понять взаимосвязь между компонентами, а так же это поможет вам в отладке будущих концепций, таких как: производительность и управление состоянием.

</Intro>

<YouWillLearn>

* Как React «видит» структуру компонентов
* Что такое дерево рендеринга и в чем его польза
* Что такое дерево зависимостей модулей и в чем его польза

</YouWillLearn>

## UI в виде дерева {/*your-ui-as-a-tree*/}

Дерево — это модель отношений между элементами, и UI часто использует эту структуру. Например, браузеры используют тот же подход для построения HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) и CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Мобильные платформы так же используют структуру дерева для своей иерархии.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Схема с тремя горизонтально расположенными секциями. В первом разделе вертикально расположены три прямоугольника: 'Component A', 'Component B', и 'Component C'. Переход к следующей панели — это стрелка с логотипом React сверху и надписью 'React'. Средний раздел содержит дерево компонентов с корнем, обозначенным 'A', и двумя дочерними элементами, обозначенными 'B' и 'C'. Переход к следующему разделу снова осуществляется с помощью стрелки с логотипом React сверху и надписью 'React'. Последний, третий раздел, представляет собой каркас браузера, содержащий дерево из 8 узлов, в котором выделено только подмножество (с указанием поддерева из среднего раздела).">

React создаёт UI-дерево из ваших компонентов. В этом случае дерево UI используется для последующего рендеринга в DOM.
</Diagram>

React, так же как браузеры и мобильные платформы, использует структуру дерева для управления и построения связи между компонентами. Эти деревья являются полезным инструментом и помогут вам понять как данные проходят через приложение React, как оптимизировать рендеринг и размер приложения.

## Дерево рендеринга {/*the-render-tree*/}

Основной особенностью компонентов считается возможность составлять одни компоненты из других. Когда мы [вкладываем компоненты](/learn/your-first-component#nesting-and-organizing-components), у нас есть концепция родительских и дочерних компонентов, где каждый родительский компонент сам может быть дочерним по отношению к другому.

Когда мы рендерим React-приложение, мы можем смоделировать эти связи в виде дерева, известного как дерево рендеринга.

Вот пример приложения React, которое отображает вдохновляющие цитаты.

<Sandpack>

```js App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js quotes.js
export default [
  "Не позволяй вчерашнему дню занять слишком много времени сегодня.” — Уилл Роджерс",
  "Амбиции — это поставить лестницу к небу.",
  "Радость, которой делятся, — это радость вдвойне",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

<Diagram name="render_tree" height={250} width={500} alt="График дерева с пятью узлами где каждый узел представляет компонент. Корнем дерева является App, от которого идут две стрелки к 'InspirationGenerator' и 'FancyText'. Стрелки помечены словом 'renders'. Узел 'InspirationGenerator' также имеет две стрелки, указывающие на 'FancyText' и 'Copyright'.">

React создает *дерево рендеринга* и UI-дерево, состоящее из компонентов, прошедших рендеринг.


</Diagram>

Из примера приложения мы можем построить приведенное выше дерево рендеринга.

Дерево состоит из узлов, каждый из них представляет компонент. `App`, `FancyText`, `Copyright` и многие другие — это узлы нашего дерева.

Корневой узел в дереве рендеринга React является [корневым компонентом](/learn/importing-and-exporting-components#the-root-component-file) приложения. В нашем случае корневой компонент предстовлен `App`, и React рендерит его первым. Каждое ответление в дереве идёт от родительского компонента к дочернему.

<DeepDive>

#### Где же находятся HTML-теги в дереве рендеринга? {/*where-are-the-html-elements-in-the-render-tree*/}

Возможно, вы уже заметили, что в приведенном выше дереве рендеринга нет упоминания о HTML-тегах, которые отображает каждый компонент. Это происходит потому, что дерево рендеринга состоит только из [компонентов](learn/your-first-component#components-ui-building-blocks) React.

Как UI-фреймворк, React является платформонезависимым. В документации мы демонстрируем примеры рендеринга в web, где в качестве примитивов UI используется разметка HTML. Но приложение React так же может запускаться на мобильных или десктоп платформах, которые используют другие UI-примитивы, такие как: [UIView](https://developer.apple.com/documentation/uikit/uiview) или [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Но примитивы на этих платформах не являются частью React. Его дерево может давать представление о вашем приложении независимо от того, на какой платформе запускается ваше приложение.

</DeepDive>

Дерево рендеринга представляет собой одиночный рендеринг приложения React. При [условном рендеринге](/learn/conditional-rendering) родительский компонент может рендерить разные дочерние компоненты в зависимости от переданных данных.

Мы можем обновить наше приложение, чтобы оно по условию отоброжало либо вдохновляющую цитату, либо цвет.

<Sandpack>

```js App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js inspirations.js
export default [
  {type: 'quote', value: "Не позволяй вчерашнему дню занять слишком много времени сегодня.” — Уилл Роджерс"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Амбиции — это поставить лестницу к небу."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "Радость, которой делятся, — это радость вдвойне."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="График дерева с шестью узлами. Верхний узел дерева помечен как 'App'. От него ведутся две стрелки к узлам с метками 'InspirationGenerator' и 'FancyText'. Стрелки представляют собой сплошные линии и помечены словом 'renders'. Узел InspirationGenerator имеет три стрелки, две из которых пунктирны и помечены надписью 'renders?'. Они ведут к узлам 'FancyText' и 'Color'. Последняя стрелка указывает на узел с надписью 'Copyright', она сплошная и отмечена надписью 'renders'.">

При условном рендеринге, в разных случаях, дерево рендеринга может строить разные компоненты.

</Diagram>

В данном случае, мы рендерим `<FancyText>` или `<Color>` в зависимости от `inspiration.type`. При каждом рендеринге дерево может быть разным.

Хотя деревья рендеринга могут различаться в зависимости от этапа рендеринга, обычно они полезны для определения того, что представляют собой компоненты верхнего уровня и конечные компоненты в приложении React. Компоненты верхнего уровня — это те, которые находятся ближе к корневому компоненту. Они влияют на производительность рендеринга всех дочерних компонентов, и часто содержат наибольшую сложность. Конечные компоненты находятся в нижней части дерева. Они не имеют дочерних компонентов и часто рендерятся повторно.

Определение того, к какой категории относится компонент поможет вам лучше понять поток данных и улучшнить производительность вашего приложения.

## Дерево зависимостей модулей {/*the-module-dependency-tree*/}

Еще одна связь в приложении React, которую можно смоделировать с помощью дерева, — это зависимости модулей приложения. [Разбивая компоненты](/learn/importing-and-exporting-components#exporting-and-importing-a-component) и логику на отдельные файлы, мы создаем [JS-модули](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), в которые можно экспортировать компоненты, функции или константы.

Каждый узел в дереве зависимостей модулей является модулем, а каждую ветвь представляет `import`.

Если мы возьмем предыдущее приложение с вдохновляющими цитатами, мы сможем построить дерево зависимостей модулей.

<Diagram name="module_dependency_tree" height={250} width={658} alt="График дерева с семью узлами. Каждый узел помечен именем модуля. Верхний узел дерева помечен как 'App.js' и от него идут три стрелки, указывающие на модули 'InspirationGenerator.js', 'FancyText.js' и 'Copyright.js'. Стрелки представляют собой сплошные линии и помечены словом 'import'. Из узла 'InspirationGenerator.js' ведутся ещё три стрелки, которые указывают на три модуля: 'FancyText.js', 'Color.js' и 'Inspirations.js'. Стрелки сплошные и также помечены словом 'import'.">

Дерево зависимостей модулей для приложения с вдохновляющими цитатами.

</Diagram>

Корневым узлом дерева является корневой модуль, он же файл точки входа. Часто это модуль, содержащий корневой компонент.

Сравнив с деревом рендеринга, мы увидим схожие структуры и некоторые заметные различия:

* Узлы, составляющие дерево, представляют собой модули, а не компоненты.
* Модули которые не являются компонентами, такие как `inspirations.js`, также представлены в этом дереве. А дерево рендеринга инкапсулирует только компоненты.
* `Copyright.js` появляется под `App.js`. Но в дереве рендеринга `Copyright` отображается как дочерний элемент `InspirationGenerator`. Это связано с тем, что `Inspiration Generator` принимает JSX в качестве [дочерних пропсов](/learn/passing-props-to-a-component#passing-jsx-as-children), поэтому он отображает `Copyright` как дочерний компонент, но он не импортирует его.

Дерево зависимостей помогает определить какие модули необходимы для запуска вашего React приложения. При создании приложения для продакшена есть этап сборки, на котором весь необходимый JavaScript будет отправлен клиенту. На этом этапе [сборщик пакетов](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem) использует дерево зависимостей для того, чтобы определить какие модули содержит проект.

По мере роста вашего приложения часто увеличивается и размер сборщика. При больших размерах требуется больше затрат для загрузки и запуска клиента, а так же это может задерживать прорисовку вашего UI. Понимание же дерева зависимостей вашего приложения может помочь в отладке и устранении этих проблем.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Деревья — это распространенный способ показать отношения между сущностями. Они очень частно используются для построения UI.
* Деревья рендеринга представляют собой отношения между вложенными компонентами React в рамках одной отрисовки.
* С отрисоквой по условию, дерево рендеринга может меняться при разных запусках. В зависимости от пропсов, компоненты могут отображать разные дочерние компоненты.
* Деревья рендеринга помогают определить, что такое компоненты верхнего уровня и конечные компоненты. Компоненты верхнего уровня влияют на производительность отрисовки всех компонентов, находящихся под ними, а конечные компоненты часто перерисовываются повторно. Их выявление поможет вам для понимания и отладки производительности рендеринга.
* Дерево зависимостей — это зависимость модулей в приложении React.
* Деревья зависимостей пользуются инструментами сборки для объединения необходимого кода для отправки приложения.
* Деревья зависимостей полезны для отладки пакетов больших размеров, которые замедляют прорисовку и предоставляют возможности для оптимизации.

</Recap>

[TODO]: <> (Add challenges)
