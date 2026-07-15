---
title: "'use client'"
titleForTitleTag: "'use client' directive"
---

<RSC>

`'use client'` предназначена для использования с [серверными компонентами React](/reference/rsc/server-components).

</RSC>


<Intro>

`'use client'` позволяет пометить, какой код выполняется на клиенте.

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `'use client'` {/*use-client*/}

Добавьте `'use client'` в начале файла, чтобы пометить модуль и его транзитивные зависимости как клиентский код.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Когда файл, помеченный `'use client'` импортируется из серверного компонента, [совместимые бандлеры](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) будут воспринимать импорт этого модуля как границу между кодом, который выполняется на сервере, и кодом, который выполняется на клиенте.

`formatDate` и `Button`, будучи зависимостями `RichTextEditor` также будут вычислены на клиенте, независимо от того, содержат ли их модули директиву `'use client'`. Обратите внимание, что один и тот же модуль может быть вычислен на сервере, если импортируется из серверного кода, и на клиенте, если импортируется из клиентского кода.

#### Замечания {/*caveats*/}

* `'use client'` должна быть в самом начале файла, выше всех импортов и другого кода (комментарии допускаются). Её нужно записывать в одинарных или двойных кавычках, но не в обратных.
* Когда `'use client'` модуль импортируется из другого модуля, рендерящегося на клиенте, директива не имеет эффекта.
* Когда модуль компонента содержит директиву `'use client'`, любое использование этого компонента гарантированно является клиентским компонентом. Однако компонент может быть вычислен на клиенте, даже если он не содержит директиву `'use client'`.
	* Использование компонента считается клиентским компонентом, если он определён в модуле с директивой `'use client'` или когда он является транзитивной зависимостью модуля, который содержит директиву `'use client'`. Иначе это серверный компонент.
* Код, помеченный для вычисления на клиенте, не ограничивается компонентами. Весь код, являющийся частью клиентского поддерева модулей, отправляется клиенту и выполняется им.
* Когда модуль, вычисляемый на сервере, импортирует значения из `'use client'` модуля, эти значения должны быть либо React-компонентом, либо [поддерживаемыми сериализуемыми значениями пропсов](#passing-props-from-server-to-client-components) , передаваемыми клиентскому компоненту. Любой другой случай использования вызовет исключение.

### Как `'use client'` помечает клиентский код {/*how-use-client-marks-client-code*/}

В приложении React компоненты часто разбиваются на отдельные файлы, или [модули](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

Для приложений, использующих серверные компоненты React, приложение по умолчанию рендерится на сервере. `'use client'` вводит границу между сервером и клиентом в [дереве зависимостей модулей](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), фактически создавая поддерево клиентских модулей.

Чтобы лучше это проиллюстрировать, рассмотрим следующее приложение серверные компоненты React.

<Sandpack>

```js src/App.js
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

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

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

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
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

В дереве зависимостей модулей этого примера приложения директива `'use client'` в `InspirationGenerator.js` помечает этот модуль и все его транзитивные зависимости как клиентские модули. Поддерево, начинающееся с `InspirationGenerator.js`, теперь помечено как клиентские модули.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` разделяет дерево зависимостей модулей приложения серверные компоненты React, помечая `InspirationGenerator.js` и все его зависимости как рендерящиеся на клиенте.
</Diagram>

Во время рендеринга фреймворк отрендерит корневой компонент на сервере и продолжит по [дереву рендеринга](/learn/understanding-your-ui-as-a-tree#the-render-tree), отказываясь от вычисления любого кода, импортированного из кода, помеченного как клиентский.

Отрендеренная на сервере часть дерева рендеринга затем отправляется клиенту. Клиент, загрузив свой клиентский код, завершает рендеринг оставшейся части дерева.

<Diagram name="use_client_render_tree" height={250} width={500} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">
Дерево рендеринга для приложения серверные компоненты React. `InspirationGenerator` и его дочерний компонент `FancyText` — это компоненты, экспортированные из кода, помеченного как клиентский, и считающиеся клиентскими компонентами.
</Diagram>

Введём следующие определения:

* **клиентские компоненты** — это компоненты в дереве рендеринга, которые рендерятся на клиенте.
* **серверные компоненты** — это компоненты в дереве рендеринга, которые рендерятся на сервере.

Разбирая пример приложения, `App`, `FancyText` и `Copyright` все рендерятся на сервере и считаются серверными компонентами. Поскольку `InspirationGenerator.js` и его транзитивные зависимости помечены как клиентский код, компонент `InspirationGenerator` и его дочерний компонент `FancyText` являются клиентскими компонентами.

<DeepDive>
#### Как `FancyText` может быть одновременно и серверным, и клиентским компонентом? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

Согласно приведённым выше определениям, компонент `FancyText` является одновременно и серверным, и клиентским компонентом — как такое возможно?

Прежде всего, уточнём, что термин «компонент» не очень точен. Вот всего два способа понимания слова «компонент»:

1. «Компонент» может означать **определение компонента**. В большинстве случаев это будет функция.

```js
// Это определение компонента
function MyComponent() {
  return <p>My Component</p>
}
```

2. «Компонент» также может относиться к **использованию компонента** его определения.
```js
import MyComponent from './MyComponent';

function App() {
  // Это использование компонента
  return <MyComponent />;
}
```

Часто эта неточность не имеет значения при объяснении концепций, но в этом случае она важна.

Когда мы говорим о серверных или клиентских компонентах, мы имеем в виду использования компонентов.

* Если компонент определён в модуле с `'use client'` -директивой, или компонент импортирован и вызван в клиентском компоненте, то использование компонента является клиентским компонентом.
* В противном случае использование компонента является серверным компонентом.


<Diagram name="use_client_render_tree" height={150} width={450} alt="Древовидный граф, где каждый узел представляет компонент, а его дочерние узлы — дочерние компоненты. Узел верхнего уровня обозначен как 'App' и имеет два дочерних компонента: 'InspirationGenerator' и 'FancyText'. У 'InspirationGenerator' есть два дочерних компонента: 'FancyText' и 'Copyright'. И 'InspirationGenerator', и его дочерний компонент 'FancyText' помечены как рендерящиеся на клиенте.">Дерево рендеринга иллюстрирует использования компонентов.</Diagram>

Возвращаясь к вопросу `FancyText`, мы видим, что определение компонента _не_ имеет `'use client'` -директиву, и у него два использования.

Использование `FancyText` в качестве дочернего компонента `App`, отмечает это использование как серверный компонент. Когда `FancyText` импортируется и вызывается внутри `InspirationGenerator`, это использование `FancyText` является клиентским компонентом, так как `InspirationGenerator` содержит `'use client'` директиву.

Это означает, что определение компонента `FancyText` будет вычислено как на сервере, так и загружено клиентом для рендеринга его использования в качестве клиентского компонента.

</DeepDive>

<DeepDive>

#### Почему `Copyright` является серверным компонентом? {/*why-is-copyright-a-server-component*/}

Потому что `Copyright` рендерится как дочерний элемент клиентского компонента `InspirationGenerator`, вас может удивить, что это серверный компонент.

Напомним, что `'use client'` определяет границу между серверным и клиентским кодом на _дереве зависимостей модулей_, а не на дереве рендеринга.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="Древовидный граф с корневым узлом, представляющим модуль 'App.js'. У 'App.js' есть три дочерних узла: 'Copyright.js', 'FancyText.js' и 'InspirationGenerator.js'. У 'InspirationGenerator.js' два дочерних узла: 'FancyText.js' и 'inspirations.js'. Узлы, начиная с 'InspirationGenerator.js' и ниже, имеют жёлтый фон, обозначающий, что это поддерево рендерится на клиенте из-за директивы 'use client' в 'InspirationGenerator.js'.">
`'use client'` определяет границу между серверным и клиентским кодом на дереве зависимостей модулей.
</Diagram>

В дереве зависимостей модулей мы видим, что `App.js` импортирует и вызывает `Copyright` из `Copyright.js` модуля. Так как `Copyright.js` не содержит `'use client'` директиву, использование компонента рендерится на сервере. `App` рендерится на сервере, так как является корневым компонентом.

Клиентские компоненты могут рендерить серверные компоненты, потому что можно передавать JSX в качестве пропсов. В этом случае `InspirationGenerator` получает `Copyright` как [children](/learn/passing-props-to-a-component#passing-jsx-as-children). Однако `InspirationGenerator` модуль никогда напрямую не импортирует `Copyright` модуль и не вызывает компонент, всё это делает `App`. Фактически, `Copyright` компонент полностью выполняется до того, как `InspirationGenerator` начинает рендериться.

Вывод в том, что отношение «родитель-потомок» при рендеринге между компонентами не гарантирует одинаковую среду рендеринга.

</DeepDive>

### Когда использовать `'use client'` {/*when-to-use-use-client*/}

С помощью `'use client'`, можно определять, когда компоненты являются клиентскими. Так как по умолчанию компоненты являются серверными, вот краткий обзор преимуществ и ограничений серверных компонентов, чтобы определить, когда нужно помечать что-либо как рендерящееся на клиенте.

Для простоты мы говорим о серверных компонентах, но те же принципы применяются ко всему коду в вашем приложении, который выполняется на сервере.

#### Преимущества серверных компонентов {/*advantages*/}
* Серверные компоненты позволяют уменьшить объём кода, отправляемого и выполняемого клиентом. Клиент собирает и выполняет только клиентские модули.
* Серверные компоненты выигрывают от выполнения на сервере. Они могут обращаться к локальной файловой системе и получать данные с меньшей задержкой при выполнении запросов к данным и сетевых запросов.

#### Ограничения серверных компонентов {/*limitations*/}
* Серверные компоненты не могут поддерживать взаимодействие, так как обработчики событий должны быть зарегистрированы и вызваны клиентом.
	* Например, обработчики событий, такие как `onClick`, могут быть определены только в клиентских компонентах.
* Серверные компоненты не могут использовать большинство хуков.
	* Когда серверные компоненты рендерятся, их результатом фактически является список компонентов для рендеринга клиентом. Серверные компоненты не сохраняются в памяти после рендеринга и не могут иметь собственное состояние.

### Сериализуемые типы, возвращаемые серверными компонентами {/*serializable-types*/}

Как и в любом приложении React, родительские компоненты передают данные дочерним компонентам. Поскольку они рендерятся в разных средах, передача данных из серверного компонента в клиентский компонент требует дополнительного внимания.

Значения пропсов, передаваемые из серверного компонента в клиентский компонент, должны быть сериализуемыми.

К сериализуемым пропсам относятся:
* Примитивы
	* [string](https://developer.mozilla.org/ru/docs/Glossary/String)
	* [number](https://developer.mozilla.org/ru/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/ru/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/ru/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/ru/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Symbol), только символы, зарегистрированные в глобальном реестре Symbol через [`Symbol.for`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Итерируемые объекты, содержащие сериализуемые значения
	* [String](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) и [ArrayBuffer](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Обычные [объекты](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object): созданные с помощью [инициализаторов объектов](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Object_initializer), с сериализуемыми свойствами
* Функции, которые являются [серверными функциями](/reference/rsc/server-functions)
* Элементы клиентских или серверных компонентов (JSX)
* [Промисы](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Стоит отметить, что не поддерживаются следующие типы:
* [Функции](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function) которые не экспортированы из модулей, помеченных как клиентские, или не помечены [`'use server'`](/reference/rsc/use-server)
* [Классы](https://developer.mozilla.org/ru/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Объекты, являющиеся экземплярами любого класса (кроме упомянутых встроенных) или объекты с [прототипом null](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Символы, не зарегистрированные глобально, напр. `Symbol('my new symbol')`


## Использование {/*usage*/}

### Создание интерактивности и состояния {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

Поскольку `Counter` требует как `useState` хук, так и обработчики событий для увеличения или уменьшения значения, этот компонент должен быть клиентским компонентом и потребует директиву `'use client'` в начале файла.

В отличие от этого, компонент, который рендерит UI без взаимодействия, не должен быть клиентским компонентом.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

Например, `Counter`, родительский компонент `CounterContainer`, не требует `'use client'`, так как он не является интерактивным и не использует состояние. Кроме того, `CounterContainer` должен быть серверным компонентом, так как он считывает данные из локальной файловой системы на сервере, что возможно только в серверном компоненте.

Также существуют компоненты, которые не используют каких-либо серверных или клиентских возможностей и не зависят от того, где они рендерятся. В нашем предыдущем примере `FancyText` — один из таких компонентов.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

В этом случае мы не добавляем `'use client'` директиву, что приводит к тому, что у `FancyText` появляется _вывод_ (а не его исходный код) отправлялся в браузер при обращении к нему из серверного компонента. Как показано в примере с приложением Inspirations выше, `FancyText` используется как серверный, так и как клиентский компонент, в зависимости от того, где он импортируется и используется.

Но если у `FancyText` вывод в HTML был большим по сравнению с исходным кодом (включая зависимости), может быть эффективнее принудительно сделать его всегда клиентским компонентом. Компоненты, которые возвращают длинную строку пути SVG, — один из случаев, когда принудительное превращение компонента в клиентский может быть более эффективным.

### Использование клиентских API {/*using-client-apis*/}

Ваше приложение React может использовать специфичные для клиента API, такие как API браузера для веб-хранилища, обработки аудио и видео, а также аппаратного обеспечения устройства, среди [прочего](https://developer.mozilla.org/ru/docs/Web/API).

В этом примере компонент использует [DOM API](https://developer.mozilla.org/ru/docs/Glossary/DOM) , чтобы управлять элементом [`canvas`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/canvas) . Поскольку эти API доступны только в браузере, компонент должен быть помечен как клиентский.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Использование сторонних библиотек {/*using-third-party-libraries*/}

Часто в приложении React вы будете использовать сторонние библиотеки для обработки распространённых шаблонов UI или логики.

Такие библиотеки могут зависеть от хуков компонентов или клиентских API. Компоненты сторонних библиотек, использующие любой из следующих API React, должны выполняться на клиенте:
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) и [`react-dom`](/reference/react-dom/hooks) хуки, кроме [`use`](/reference/react/use) и [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* Если они используют клиентские API, например вставку DOM или нативные представления платформы

Если эти библиотеки были обновлены для совместимости с серверными компонентами React, они уже будут содержать собственные маркеры `'use client'`, позволяющие использовать их непосредственно из ваших серверных компонентов. Если библиотека не обновлена, или если компоненту нужны пропсы, такие как обработчики событий, которые можно указать только на клиенте, вам может понадобиться добавить собственный файл клиентского компонента между сторонним клиентским компонентом и вашим серверным компонентом, где вы хотите его использовать.

[TODO]: <> (Troubleshooting - need use-cases)
