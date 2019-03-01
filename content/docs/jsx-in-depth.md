---
id: jsx-in-depth
title: JSX изнутри
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

В действительности JSX просто предоставляет синтаксический сахар для функции `React.createElement(component, props, ...children)`. Этот JSX код:

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

компилируется в:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

Вы также можете использовать самозакрывающийся тег, если отсутствуют дочерние элементы. Вот так:

```js
<div className="sidebar" />
```

компилируется в:

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

Если вы хотите проверить как какой-нибудь специфический JSX компилируется в JavaScript, вы можете попробовать онлайн [Babel compiler](babel://jsx-simple-example).

## Указание типа React-элемента {#specifying-the-react-element-type}

Первая часть JSX тега определяет тип React-элемента.

Типы пишутся с большой буквы и указывают, что JSX тег ссылается на React-компонент. Эти теги компилируются в прямые ссылки на именованные переменные, поэтому, если вы используете JSX выражение `<Foo />` , `Foo` должен быть в области видимости. 

### React должен находиться в области видимости {#react-must-be-in-scope}

Поскольку JSX компилируется в вызов `React.createElement`, библиотека `React` должна всегда быть в области видимости вашего JSX кода.

К примеру, в данном коде оба импорта являются необходимыми, даже если на `React` и `CustomButton` нет прямых ссылок из JavaScript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Если вы не используете сборщик JavaScript и загружаете React с помощью тега `<script>`, то он уже доступен как `React`, в глобальной области видимости.

### Использование записи через точку {#using-dot-notation-for-jsx-type}

Вы также можете ссылаться на React-компонент, используя запись через точку. Это удобно, если у вас есть модуль, который экспортирует много React компонентов. К примеру, если `MyComponents.DatePicker` является компонентом, то вы можете обратиться к нему напрямую, используя запись через точку:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Названия типов пользовательских компонентов должны начинаться с большой буквы {#user-defined-components-must-be-capitalized}

Если название типа элемента начинается с маленькой буквы, он ссылается на встроенный компонент, к примеру `<div>` или `<span>`, что в результате приведет к тому, что в `React.createElement` будет передана строка `'div'` или `'span'`. Типы, начинающиеся с заглавной буквы, такие как `<Foo />`, компилируются  в `React.createElement(Foo)` и соответствуют компоненту, который был объявлен или импортирован в вашем JavaScript файле.  

Мы рекомендуем называть компоненты с заглавной буквы. Если вы имеете компонент, название которого начинается с маленькой буквы, то перед тем как использовать его в JSX, присвойте его в переменную, которая имеет название с заглавной буквы.

К примеру, этот код будет работать не так как ожидается:

```js{3,4,10,11}
import React from 'react';

// Неправильно! Это компонент и он должен быть записан с заглавной буквы:
function hello(props) {
  // Правильно! Использование <div> разрешено, так как это валидный HTML-тег:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Неправильно! React думает, что <hello /> - это HTML-тег,
  // потому что он записан с маленькой буквы:
  return <hello toWhat="World" />;
}
```

Для того чтобы исправить это, мы переименуем `hello` в `Hello` и станем использовать `<Hello />`, когда будем ссылаться на него:

```js{3,4,10,11}
import React from 'react';

// Правильно! Это компонент и он должен быть записан с заглавной буквы:
function Hello(props) {
  // Правильно! Использование <div> разрешено, так как это валидный HTML-тег:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Правильно! React знает, что <Hello /> это компонент,
  // потому что он написан с заглавной буквы.
  return <Hello toWhat="World" />;
}
```

### Выбор типа в runtime {#choosing-the-type-at-runtime}

Вы не можете использовать выражение как тип React-элемента. Если вы хотите использовать выражение для того, чтобы указать тип элемента, то сперва вам нужно присвоить его в переменную, начинающуюся с заглавной буквы. Часто это подходит, когда вам нужно отрендерить компонент в зависимости от ваших пропсов:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Неправильно! JSX-тип не может являться выражением
  return <components[props.storyType] story={props.story} />;
}
```

Чтобы исправить это, мы присвоим тип в переменную, начинающуюся с заглавной буквы:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Правильно! JSX-тип может являться переменной, названной с заглавной буквы
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## Пропсы в JSX {#props-in-jsx}

Существует несколько разных способов для того, чтобы передать пропсы в JSX.

### JavaScript выражения как пропсы {#javascript-expressions-as-props}

Вы можете передавать любые JavaScript выражения как пропсы, заключая их в `{}`. К примеру, в этом JSX:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

Для `MyComponent`, значение `props.foo` будет `10`, потому что выражение `1 + 2 + 3 + 4` будет вычислено.

Оператор `if` и цикл `for` не являются выражениями в JavaScript, поэтому их нельзя непосредственно использовать в JSX. Вместо этого, вы можете положить их в соседний код. К примеру:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

Вы можете узнать больше о [conditional rendering](/docs/conditional-rendering.html) и [loops](/docs/lists-and-keys.html) в соответствующих разделах.

### Литералы строки {#string-literals}

Вы можете передать литерал строки как проп. Эти два выражения эквивалентны:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Когда вы передаете литерал строки значение будет в HTML будет неэкранированным. Поэтому эти два JSX выражения будут эквивалентны:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Обычно данное поведение не актуально. Это упомянуто для полноты картины. 

### Установка пропсов по умолчанию в "true" {#props-default-to-true}

Если вы не передаете значение в проп, то по умолчанию оно будет `true`. Эти два JSX выражения эквиваленты:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

В основном, мы рекомендуем так не делать, потому что это может быть воспринято как [ES6 object shorthand](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Object_initializer#%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F_%D0%BD%D0%BE%D1%82%D0%B0%D1%86%D0%B8%D1%8F_%D0%B2_ECMAScript_2015) `{foo}`, которое является сокращением для `{foo: foo}`, а не `{foo: true}`. Данное поведение существует для того, чтобы соответствовать поведению HTML.

### Spread аттрибуты {#spread-attributes}

Если у вас уже есть `props` в виде объекта и выхотите передать их в JSX, вы можете использовать `...` "spread operator" для передачи объекта со свойствами целиком. Эти два компонента эквивалентны:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

Вы так же можете выбрать конкретные пропсы, которые ваш компонент будет использовать, передавая все остальные пропсы с помощью spread operator.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

В примеденном выше примере, пропс `kind` используется безопасно и *не* передается в элемент `<button>`, находящийся в DOM.
Все остальные пропсы передаются с помощью объекта `...other`, что делает этот компонент очень гибким. Вы можете видеть, что он передает пропсы `onClick` и `children`.

Spread аттрибуты могут быть полезны, но они так же легко позволяют передавать ненужные пропсы в компоненты или передавать невалидные HTML аттрибуты в DOM. Мы рекомендуем использовать этот синтаксис с осторожностью.

## Дочерние компоненты в JSX {#children-in-jsx}

В JSX выражениях, содержание между открывающими и закрывающими тегами передается с помощью специального пропса: `props.children`. Существует несколько способов передать дочерние компоненты:

### Литералы строки {#string-literals-1}

Если вы поместите строку между открывающим и закрывающим тегом, то `props.children` будет равно этой строке. Это полезно при создании встроенных HTML элементов. К примеру:

```js
<MyComponent>Hello world!</MyComponent>
```

Это валидный JSX, и `props.children` в `MyComponent` будет строкой `"Hello world!"`. HTML не экранирован, поэтому вы можете писать на JSX также, как если бы вы писали на обычном HTML:

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX удаляет пробелы в начале и в конце строки. Он также удаляет пустые строки. Новая строка, примыкающая в тегу будет удалена; новые строки, находящиеся посередине строковых литералов, сжимаются в один пробел. Все это отрендерится в один и тот же вид:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### Дочерние JSX-компоненты {#jsx-children}

Вы можете передать больше дочерних JSX-элементов. Это полезно для отображения вложенных компонентов:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Вы можете смешивать различные типы потомков, поэтому можно использовать литерал строки вместе с JSX-элементами. Это ещё один способ, в котором JSX похож на HTML, и данный код является валидным и для JSX и для HTML:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

Также React-компоненты могут возвращать массив из элементов:

```js
render() {
  // Не нужно оборачивать список элементов в дополнительный элемент!
  return [
    // Не забудьте про keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript-выражения как дочерние компоненты {#javascript-expressions-as-children}

Вы можете передать любое JavaScript-выражение как дочерний компонент, обернув его в `{}`. К примеру, эти выражения эквивалентны:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

Часто это бывает полезно при рендеринге списка JSX-выражений произвольной длины. К примеру, эта запись рендерит HTML-список:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript выражения могут быть использованы вместе с другими типами дочерних компонентов. Часто их удобно использовать вместо шаблонов строки:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Функции как дочерние компоненты {#functions-as-children}

Обычно JavaScript-выражения, вставленные в JSX, будут приведены к строке, React-элементу или списку из этих вещей. Тем не менее, `props.children` работает также как любой другой проп, так как в него можно передавать любые типы данных, а не только те, которые знает как отрендерить React. К примеру, если у вас есть пользовательский компонент, вы могли бы передать функцию обратного вызова в `props.children`:

```js{4,13}
// Вызывает функцию обратного вызова numTimes раз для создания повторяющего компонента
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

Дочерние компоненты, передаваемые пользовательскому компоненту, могут быть чем угодно, до тех пор, пока компонент не преобразует их во что-нибудь, что React сможет понять перед рендерингом. Это не распространенный способ, но это то что нужно, если вы хотите расширить возможности JSX.

### Booleans, null, и undefined игнорируются {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, и `true` -- валидные дочерние компоненты. Просто они не рендерятся. Эти JSX-выражения будут рендерить одно и то же:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Это может быть полезным для рендеринга по условию. Этот JSX рендерит `<Header />`, если `showHeader` является `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Один нюанс заключается в том, что React будет рендерить ["ложные" значения](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), такие как число `0`. К примеру, этот код будет вести себя не так как вы ожидали, так как `0` будет отрисован, если массив `props.messages` будет пуст:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

Чтобы исправить это, убедитесь что выражение перед оператором `&&` всегда является boolean:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

И наоборот, если вы хотите, чтобы такие значения как `false`, `true`, `null`, или `undefined` отрисовались, то сначала вы должны [преобразовать их в строку](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion):

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
