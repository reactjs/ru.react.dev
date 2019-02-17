---
id: dom-elements
title: Элементы DOM
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React реализует независимую от браузера систему DOM для повышения производительности и кроссбраузерной совместимости. Мы воспользовались возможностью избавиться от некоторых шероховатостей в браузерных реализациях DOM.

В React все свойства и атрибуты DOM (включая обработчики событий) должны быть в стиле camelCase. Например, HTML-атрибут `tabindex` соответствует атрибуту `tabIndex` в React. Исключение составляют атрибуты `aria-*` и `data-*`, которые следует писать в нижнем регистре. В частности, вы можете оставить `aria-label` как `aria-label`.


## Различия в атрибутах {#differences-in-attributes}

Есть ряд атрибутов, которые по-разному работают в React и HTML:

### checked {#checked}

Атрибут `checked` поддерживается компонентами `<input>` типа `checkbox` или `radio`. Он нужен для того, чтобы узнать выбран ли компонент. Это полезно для создания контролируемых компонентов. `defaultChecked` — это неконтролируемый эквивалент, который определяет, выбран ли компонент при его первом монтировании.

### className {#classname}

Чтобы указать класс CSS, используйте атрибут `className`. Это относится ко всем обычным элементам DOM и SVG, таким как `<div>`, `<a>` и т.д.

Если вы используете React с веб-компонентами (что встречается редко), используйте вместо этого атрибут `class`.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` — React—эквивалент свойству `innerHTML` в DOM браузера. Как правило, вставка HTML из кода рискованна, так как можно случайно подвергнуть ваших пользователей атаке [межсайтового скриптинга](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%B6%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2%D1%8B%D0%B9_%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B8%D0%BD%D0%B3). Таким образом, вы можете вставить HTML непосредственно из React используя `dangerouslySetInnerHTML` и передать объект с ключом `__html`, чтобы напомнить себе, что это небезопасно. Например:

```js
function createMarkup() {
  return {__html: 'Первый &middot; Второй'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

Поскольку `for` является зарезервированным словом JavaScript, для определения HTML-атрибута `for` в элементах React вместо него используйте `htmlFor`.

### onChange {#onchange}

Событие `onChange` ведет себя ожидаемо: событие срабатывает при изменении поля формы. Мы намеренно не используем существующее поведение браузера, поскольку `onChange` работает неправильно в отношении своего текущего поведения. React использует это событие для обработки ввода в реальном времени.

### selected {#selected}

Атрибут `selected` поддерживается компонентом `<option>`. Используйте его, чтобы определить выбран ли компонент. Это полезно для создания контролируемых компонентов.

### style {#style}

>Примечание
>
>Некоторые примеры в документации используют для удобства `style`, но **использование атрибута `style` для оформления элементов не рекомендуется.** В большинстве случаев для ссылки на классы, определенные во внешнем CSS, следует использовать [`className`](#classname). Атрибут `style` в React чаще всего используется при добавлении динамически вычисляемых стилей во время рендера. Смотрите [FAQ: Стили и CSS](/docs/faq-styling.html).

Атрибут `style` принимает JavaScript-объект со свойствами в camelCase вместо CSS-строк. Такой подход повышает эффективность и защищает от XSS. Например:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Привет, мир!</div>;
}
```

Обратите внимание, что браузерные префиксы не добавляются к стилям автоматически. Для поддержки старых браузеров необходимо добавить соответствующие свойства стиля:

```js
const divStyle = {
  WebkitTransition: 'all', // обратите внимание на заглавную букву W
  msTransition: 'all' // 'ms' - единственный префикс в нижнем регистре
};

function ComponentWithTransition() {
  return <div style={divStyle}>Это будет работать в разных браузерах</div>;
}
```

Ключи стилей записываются в camelCase для обеспечения доступа к аналогичным свойствам DOM из JS (например, `node.style.backgroundImage`). Префиксы браузера [кроме `ms`](http://www.andismith.com/blog/2012/02/modernizr-prefixed/) должны начинаться с заглавной буквы. Вот почему `WebkitTransition` начинается с заглавной "W".

React автоматически добавит суффикс «px» к свойствам стилей с числовым значением. Если вы хотите использовать единицы измерения, отличные от «px», укажите значение в виде строки с желаемой единицей измерения. Например:

```js
// Результат: '10px'
<div style={{ height: 10 }}>
  Привет, мир!
</div>

// Результат: '10%'
<div style={{ height: '10%' }}>
  Привет, мир!
</div>
```

Однако не все свойства стилей преобразуются в пиксельные строки. Некоторые из них остаются без единиц (например, `zoom`, `order`, `flex`). Полный список свойств без единиц измерения можно увидеть [здесь](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Обычно, когда элемент с потомками помечен как `contentEditable`, появляется предупреждение, что он не будет работать. Данный атрибут скрывает это предупреждение. Используйте его, только если вы создаете похожую на [Draft.js](https://facebook.github.io/draft-js/) библиотеку, которая управляет `contentEditable` вручную.

### suppressHydrationWarning {#suppresshydrationwarning}

Если вы используете рендеринг React на стороне сервера, как правило, появляется предупреждение, если сервер и клиент рендерит разный контент. Однако, иногда очень сложно или невозможно гарантировать точное совпадение. Например, временные метки на сервере и клиенте отличаются.

Если для `suppressHydrationWarning` установлено значение `true`, React не будет предупреждать вас о несоответствиях в атрибутах и содержимом этого элемента. Он работает только на один уровень глубины и предназначен для использования в качестве запасного решения. Не злоупотребляйте этим. Вы можете прочитать больше о гидратации на [странице `ReactDOM.hydrate()`](/docs/react-dom.html#hydrate).

### value {#value}

Атрибут `value` поддерживается компонентами `<input>` и `<textarea>`. Он устанавливает значение компонента. Это полезно для создания контролируемых компонентов. defaultValue - это неконтролируемый эквивалент, который устанавливает значение компонента при его первом монтировании.

## Поддержка всех HTML-атрибутов {#all-supported-html-attributes}

Начиная с React 16, полностью поддерживаются любые стандартные или [пользовательские](/blog/2017/09/08/dom-attributes-in-react-16.html) атрибуты DOM.

React всегда предоставлял JavaScript-ориентированный API для DOM. Поскольку компоненты React часто принимают как пользовательские, так и связанные с DOM пропсы, React использует стиль `camelCase` так же, как DOM API:

```js
<div tabIndex="-1" />      // То же, что и node.tabIndex DOM API
<div className="Button" /> // То же, что и node.className DOM API
<input readOnly={true} />  // То же, что и node.readOnly DOM API
```

Эти пропсы работают аналогично соответствующим атрибутам HTML, за исключением особых случаев, описанных выше.

Некоторые из атрибутов DOM, поддерживаемые React:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Кроме того, полностью поддерживаются все SVG-атрибуты:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

Вы также можете использовать пользовательские атрибуты, написанные в нижнем регистре.
