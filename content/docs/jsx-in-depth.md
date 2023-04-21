---
id: jsx-in-depth
title: JSX в деталях
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

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.

</div>

JSX — синтаксический сахар для функции `React.createElement(component, props, ...children)`. Этот JSX-код:

```js
<MyButton color="blue" shadowSize={2}>
  Нажми меня
</MyButton>
```

Скомпилируется в:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Нажми меня'
)
```

Вы также можете использовать самозакрывающийся тег, если отсутствуют дочерние элементы. Поэтому код:

```js
<div className="sidebar" />
```

Скомпилируется в:

```js
React.createElement(
  'div',
  {className: 'sidebar'}
)
```

Если вы хотите проверить, как JSX-код компилируется в JavaScript, попробуйте [онлайн-компилятор Babel](babel://jsx-simple-example).

## Указание типа React-элемента {#specifying-the-react-element-type}

Первая часть JSX-тега определяет тип React-элемента.

Типы, написанные с большой буквы, указывают, что JSX-тег ссылается на React-компонент. Эти теги компилируются в прямую ссылку на именованную переменную, поэтому, если вы используете JSX-выражение `<Foo />`, то `Foo` должен быть в области видимости.  

### React должен находиться в области видимости {#react-must-be-in-scope}

Поскольку JSX компилируется в вызов `React.createElement`, библиотека `React` должна всегда быть в области видимости вашего JSX-кода.

К примеру, в данном коде оба импорта являются необходимыми, даже если на `React` и `CustomButton` нет прямых ссылок из JavaScript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Если вы не используете сборщик JavaScript и загружаете React с помощью тега `<script>`, то он уже доступен как `React` в глобальной области видимости.

### Использование записи через точку {#using-dot-notation-for-jsx-type}

Вы также можете ссылаться на React-компонент, используя запись через точку. Это удобно, если у вас есть модуль, который экспортирует много React-компонентов. К примеру, если `MyComponents.DatePicker` является компонентом, то вы можете обратиться к нему напрямую, используя запись через точку:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Представьте, что здесь цвет {props.color} виджета выбора даты.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Названия типов пользовательских компонентов должны начинаться с большой буквы {#user-defined-components-must-be-capitalized}

Если название типа элемента начинается с маленькой буквы, он ссылается на встроенный компонент, к примеру `<div>` или `<span>`, что в результате приведёт к тому, что в `React.createElement` будет передана строка `'div'` или `'span'`. Типы, начинающиеся с заглавной буквы, такие как `<Foo />`, компилируются  в `React.createElement(Foo)` и соответствуют компоненту, который был объявлен или импортирован в вашем JavaScript-файле.  

Мы рекомендуем называть компоненты с заглавной буквы. Если у вас есть компонент, название которого начинается с маленькой буквы, то перед тем как использовать его в JSX, присвойте его в переменную, которая имеет название с заглавной буквы.

К примеру, этот код будет работать не так, как ожидается:

```js{3,4,10,11}
import React from 'react';

// Неправильно! Это компонент и он должен быть записан с заглавной буквы:
function hello(props) {
  // Правильно! Использование <div> разрешено, так как это валидный HTML-тег:
  return <div>Привет, {props.toWhat}</div>;
}

function HelloWorld() {
  // Неправильно! React думает, что <hello /> - это HTML-тег,
  // потому что он записан с маленькой буквы:
  return <hello toWhat="Мир" />;
}
```

Для того, чтобы исправить это, мы переименуем `hello` в `Hello` и станем использовать `<Hello />`, когда будем ссылаться на него:

```js{3,4,10,11}
import React from 'react';

// Правильно! Это компонент и он должен быть записан с заглавной буквы:
function Hello(props) {
  // Правильно! Использование <div> разрешено, так как это валидный HTML-тег:
  return <div>Привет, {props.toWhat}</div>;
}

function HelloWorld() {
  // Правильно! React знает, что <Hello /> это компонент,
  // потому что он написан с заглавной буквы.
  return <Hello toWhat="Мир" />;
}
```

### Выбор типа во время исполнения {#choosing-the-type-at-runtime}

В качестве типа React-элемента нельзя использовать выражение. Если вы хотите использовать выражение, чтобы указать тип элемента, присвойте его в переменную, начинающуюся с заглавной буквы. Это подходит для рендера компонентов в зависимости от ваших пропсов:

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

Существует несколько разных способов передачи пропсов в JSX.

### JavaScript-выражения как пропсы {#javascript-expressions-as-props}

Вы можете передавать любые JavaScript-выражения как пропсы, обернув их в `{}`. К примеру, в этом JSX:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

Для `MyComponent` значение `props.foo` будет равно `10`, потому что выражение `1 + 2 + 3 + 4` будет вычислено.

Оператор `if` и цикл `for` не являются выражениями в JavaScript, поэтому их нельзя непосредственно использовать в JSX. Вместо этого, вы можете окружить ими JSX-код. К примеру:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>чётным</strong>;
  } else {
    description = <i>нечётным</i>;
  }
  return <div>{props.number} является {description} числом</div>;
}
```

Вы можете узнать больше про [условный рендеринг](/docs/conditional-rendering.html) и [циклы](/docs/lists-and-keys.html) в соответствующих разделах.

### Строковые литералы {#string-literals}

Вы можете передать строковый литерал как проп. Эти два выражения эквивалентны:

```js
<MyComponent message="привет, мир" />

<MyComponent message={'привет, мир'} />
```

Когда вы передаёте строковый литерал, все его возможные символы будут преобразованы в соответствующие HTML-сущности. Поэтому эти два JSX-выражения будут эквивалентны:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Обычно такое поведение не должно вас волновать. Оно упомянуто для полноты картины. 

### Установка пропсов по умолчанию в «true» {#props-default-to-true}

Если вы не передаёте значение в проп, то по умолчанию оно будет `true`. Эти два JSX выражения эквивалентны:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

В основном, мы не рекомендуем *не* передавать значение для пропа, потому что это может быть воспринято как [сокращение имён свойств из ES6](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Object_initializer#%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F_%D0%BD%D0%BE%D1%82%D0%B0%D1%86%D0%B8%D1%8F_%D0%B2_ECMAScript_2015). Тогда, например, `{foo}` это короткая запись `{foo: foo}`, но никак не `{foo: true}`. Такое поведение существует для того, чтобы соответствовать поведению HTML.

### Атрибуты расширения {#spread-attributes}

Если у вас уже есть пропсы внутри объекта `props` и вы хотите передать их в JSX, вы можете использовать оператор расширения `...`, чтобы передать весь объект с пропсами. Эти два компонента эквивалентны:

```js{7}
function App1() {
  return <Greeting firstName="Иван" lastName="Иванов" />;
}

function App2() {
  const props = {firstName: 'Иван', lastName: 'Иванов'};
  return <Greeting {...props} />;
}
```

Вы также можете выбрать конкретные пропсы, которые ваш компонент будет использовать, передавая все остальные пропсы с помощью оператора расширения.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("Кнопка нажата!")}>
        Привет, мир!
      </Button>
    </div>
  );
};
```

В приведённом выше примере, проп `kind` используется безопасно и *не* передаётся в элемент `<button>`, находящийся в DOM.
Все остальные пропсы передаются с помощью объекта `...other`, что делает этот компонент очень гибким. Вы можете видеть, что он передаёт пропсы `onClick` и `children`.

Атрибуты расширения могут быть полезны, однако, также они позволяют передать ненужные пропсы в компоненты или невалидные HTML-атрибуты в DOM. Мы рекомендуем использовать этот синтаксис с осторожностью.

## Дочерние компоненты в JSX {#children-in-jsx}

В JSX-выражениях содержимое, которое расположено между открывающими и закрывающими тегами, передаётся с помощью специального пропа: `props.children`. Существует несколько способов передать дочерние компоненты:

### Строковые литералы {#string-literals-1}

Если вы поместите строку между открывающим и закрывающим тегом, то `props.children` будет равно этой строке. Это полезно при создании встроенных HTML-элементов. К примеру:

```js
<MyComponent>Привет, мир!</MyComponent>
```

Это корректный JSX-код, в котором значение `props.children` в `MyComponent` будет строкой `"Привет, мир!"`. HTML не экранируется, поэтому JSX можно писать так же, как HTML:

```html
<div>Это одновременно и валидный HTML и JSX.</div>
```

JSX удаляет пустые строки и пробелы в начале и конце строки. Новые строки, примыкающие к тегу будут удалены. Новые строки между строковых литералов сжимаются в один пробел. Следующие три примера кода рендерят одинаковый результат:

```js
<div>Привет, мир</div>

<div>
  Привет, мир
</div>

<div>
  Привет,
  мир
</div>

<div>

  Привет, мир
</div>
```

### Дочерние JSX-компоненты {#jsx-children}

Чтобы отобразить вложенные компоненты, можно указать несколько JSX-элементов в качестве дочерних.

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Вы можете смешивать различные типы потомков, скажем, использовать строковый литерал вместе с JSX-элементами. Вот ещё один пример, в котором JSX похож на HTML, причём данный код является валидным и для JSX, и для HTML:

```html
<div>
  Ниже представлен список:
  <ul>
    <li>Элемент 1</li>
    <li>Элемент 2</li>
  </ul>
</div>
```

Также React-компонент может возвращать массив элементов:

```js
render() {
  // Не нужно оборачивать список элементов в дополнительный элемент!
  return [
    // Не забудьте про ключи :)
    <li key="A">Первый элемент</li>,
    <li key="B">Второй элемент</li>,
    <li key="C">Третий элемент</li>,
  ];
}
```

### JavaScript-выражения как дочерние компоненты {#javascript-expressions-as-children}

Вы можете передать любое JavaScript-выражение как дочерний компонент, обернув его в `{}`. К примеру, эти выражения эквивалентны:

```js
<MyComponent>Пример</MyComponent>

<MyComponent>{'Пример'}</MyComponent>
```

Часто это бывает полезно при рендере списка JSX-выражений произвольной длины. Например, эта запись рендерит HTML-список:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['закончить документацию', 'отправить пулреквест', 'снова напомнить Дэну про ревью'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript-выражения могут быть использованы вместе с другими типами дочерних компонентов. Они могут рассматриваться как альтернатива шаблонным строкам:

```js{2}
function Hello(props) {
  return <div>Привет, {props.addressee}!</div>;
}
```

### Функции как дочерние компоненты {#functions-as-children}

Обычно JavaScript-выражения, вставленные в JSX, будут приведены к строке, React-элементу или списку из всего этого. Тем не менее, `props.children` работает так же, как и любой другой проп, поэтому в него можно передавать любые типы данных, а не только те, которые React знает как рендерить. К примеру, если у вас есть пользовательский компонент, можно было бы передать колбэк в `props.children`:

```js{4,13}
// Вызывает колбэк numTimes раз для создания повторяющего компонента
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
      {(index) => <div key={index}>Это элемент списка с ключом {index}</div>}
    </Repeat>
  );
}
```

Дочерние компоненты, передаваемые пользовательскому компоненту, могут быть чем угодно с тем условием, что компонент преобразует их во что-то, что React сможет понять и отрендерить. Следующий пример редко встречается, но им можно воспользоваться, если необходимо расширить возможности JSX.

### Логические значения, null и undefined игнорируются {#booleans-null-and-undefined-are-ignored}

Значения `false`, `null`, `undefined` и `true` -- валидные дочерние компоненты. Просто они не рендерятся. Эти JSX-выражения будут рендерить одно и то же:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Этот подход может быть полезным для рендера по условию. Вот пример, где JSX рендерит `<Header />`, если `showHeader` равняется `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Есть один нюанс в том, что React будет рендерить [«ложные» (falsy) значения](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), такие как число `0`. Код ниже ведёт себя не так, как вы могли ожидать, так как `0` будет отображён, если массив `props.messages` пуст:

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

И наоборот, если вы хотите, чтобы такие значения как `false`, `true`, `null` или `undefined` отрисовались, то сначала вы должны [преобразовать их в строку](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String#Example:_String_conversion):

```js{2}
<div>
  Моя переменная JavaScript - {String(myVariable)}.
</div>
```
