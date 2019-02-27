---
id: introducing-jsx
title: Знакомство с JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Рассмотрим объявление переменной:

```js
const element = <h1>Привет, мир!</h1>;
```

Этот странный тег — ни строка, ни фрагмент HTML.

Это JSX — расширение языка JavaScript. Мы рекомендуем использовать его, когда требуется объяснить React, как должен выглядеть UI. JSX напоминает язык шаблонов, наделённый силой JavaScript.

JSX производит «элементы» React. То как элементы рендерятся в DOM, мы изучим в [следующей главе](/docs/rendering-elements.html), а ниже мы рассмотрим основы JSX, которые нужно знать начинающему.

### Что такое JSX? {#why-jsx}

React исходит из принципа, что логика рендеринга неразрывно связана с прочей логикой UI: с тем, как обрабатываются события, как состояние изменяется во времени и как данные готовятся к отображению.

Вместо того, чтобы искусственно разделить *технологии*, помещая разметку и логику в разные файлы, React [разделяет ответственность](https://ru.wikipedia.org/wiki/%D0%A0%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8) с помощью слабо связанных единиц, называемых «компоненты», которые содержат *и* разметку *и* логику. Мы ещё вернёмся к теме компонентов в [следующей главе](/docs/components-and-props.html), но если идея держать разметку в JavaScript коде всё ещё вызывает у вас дискомфорт, [этот доклад](https://www.youtube.com/watch?v=x7cQ3mrcKaY) может переубедить вас.

React [можно использовать и без JSX](/docs/react-without-jsx.html), но большинство людей ценит его за наглядность при работе с UI, живущем в JavaScript-коде. Помимо этого, JSX помогает React делать сообщения об ошибках и предупреждениях понятнее.

С этим разобрались. Поехали дальше!

### Встраивание выражений в JSX {#embedding-expressions-in-jsx}

В следующем примере мы объявляем переменную `name` и затем используем её внутри JSX, обрамляя фигурными скобками:

```js{1,2}
const name = 'Иван-Царевич';
const element = <h1>Здравствуй, {name}!</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

JSX допускает использование любых корректных [JavaScript-выражений](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Expressions_and_Operators) внутри фигурных скобок. Например,  `2 + 2`, `user.firstName` и `formatName(user)` являются допустимыми выражениями.

В примере ниже мы встраиваем результат вызова JavaScript-функции `formatName(user)` в элемент `<h1>`:

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Марья',
  lastName: 'Моревна'
};

const element = (
  <h1>
    Здравствуй, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx)

Чтобы улучшить читаемость, мы разбили JSX на несколько строк. В таких случаях, хотя это и не обязательно, мы советуем заключать всё выражение целиком в круглые скобки, чтобы избежать проблем, связанных с [автоматической вставкой точек с запятой](https://stackoverflow.com/q/2846283).

### JSX это тоже выражение {#jsx-is-an-expression-too}

После компиляции каждое JSX-выражение становится обычным вызовом JavaScript-функции, результат которого — объект JavaScript.

Из этого следует, что JSX можно использовать внутри выражений `if` и циклов `for`, присваивать переменным, передавать функции в качестве аргумента и возвращать из функции.

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Здравствуй, {formatName(user)}!</h1>;
  }
  return <h1>Здравствуй, незнакомец.</h1>;
}
```

### Использование атрибутов JSX {#specifying-attributes-with-jsx}

Чтобы использовать строковый литерал в качестве атрибута, используются кавычки:

```js
const element = <div tabIndex="0"></div>;
```

Если же в атрибут требуется указать JavaScript-выражение, то на помощь приходят фигурные скобки:

```js
const element = <img src={user.avatarUrl}></img>;
```

Не ставьте кавычек вокруг фигурных скобок, когда используете JavaScript-выражение в атрибуте. Следует либо применить кавычки (для строковых литералов), либо фигурные скобки (для выражений), но не то и другое вместе.

>**Предупреждение:**
>
>Поскольку JSX ближе к JavaScript чем к HTML, React DOM использует стиль именования `camelCase` для свойств вместо обычных имён HTML-атрибутов.
>
>Например, `class` становится [`className`](https://developer.mozilla.org/ru/docs/Web/API/Element/className) в JSX, а `tabindex` становится [`tabIndex`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/tabIndex).

### Использование дочерних элементов в JSX {#specifying-children-with-jsx}

Если тег пуст, то его можно сразу же закрыть с помощью `/>` точно так же, как и в XML:

```js
const element = <img src={user.avatarUrl} />;
```

Но JSX-теги могут и содержать дочерние элементы: 

```js
const element = (
  <div>
    <h1>Здравствуйте!</h1>
    <h2>Рады вас видеть.</h2>
  </div>
);
```

### JSX предотвращает атаки, основанные на инъекции кода {#jsx-prevents-injection-attacks}

Данные, введённые пользователем, можно безопасно использовать в JSX:

```js
const title = response.potentiallyMaliciousInput;
// Этот код безопасен:
const element = <h1>{title}</h1>;
```
По умолчанию React DOM [экранирует](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) все значения, включённые в JSX перед тем как отрендерить их. Это гарантирует, что вы никогда не внедрите чего-либо, что не было явно написано в вашем приложении. Всё преобразуется в строчки, перед тем как быть отрендеренным. Это помогает предотвращать атаки [межсайтовым скриптингом (XSS)](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%B6%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2%D1%8B%D0%B9_%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B8%D0%BD%D0%B3).

### JSX представляет собой объекты {#jsx-represents-objects}

Babel компилирует JSX в вызовы `React.createElement()`.

Следующие два примера кода эквивалентны между собой:

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` проводит некоторые проверки с целью выявить баги в коде, но главное — создаёт объект похожий на такой:

```js
// Примечание: этот код несколько упрощён.
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Привет, мир!'
  }
};
```

Эти объекты называются React-элементами. Можно сказать, что они описывают результат, который мы хотим увидеть на экране. React читает эти объекты и использует их, чтобы конструировать и поддерживать DOM. 

В следующей главе мы углубимся в то, как React элементы рендерятся в DOM.

>**Совет:**
>
>Мы рекомендуем настроить ваш любимый редактор кода использовать [Babel](https://babeljs.io/docs/editors) чтобы и ES6, и JSX код были подсвечены должным образом. Настоящий сайт использует совместимую цветовую схему [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/).
