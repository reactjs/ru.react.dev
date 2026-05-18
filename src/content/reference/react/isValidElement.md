---
title: isValidElement
---
<Intro>

`isValidElement` проверяет, является ли значение React-элементом.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Вызовите `isValidElement(value)`, чтобы проверить, является ли `value` React-элементом.

```js
import { isValidElement, createElement } from 'react';

// ✅ React-элементы
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Не React-элементы
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `value`: Значение `value`, которое вы хотите проверить. Это может быть значение любого типа.

#### Возвращаемое значение {/*returns*/}

`isValidElement` возвращает `true`, если `value` является React-элементом. В противном случае возвращает `false`.

#### Ограничения {/*caveats*/}

* **Только [JSX-теги](/learn/writing-markup-with-jsx) и объекты, возвращаемые [`createElement`](/reference/react/createElement), считаются React-элементами.** Например, даже если число `42` является допустимым React-*узлом* (и может быть возвращено из компонента), оно не является допустимым React-элементом. Массивы и порталы, созданные с помощью [`createPortal`](/reference/react-dom/createPortal), также *не* считаются React-элементами.

---

## Использование {/*usage*/}

### Проверка, является ли что-то React-элементом {/*checking-if-something-is-a-react-element*/}

Вызовите `isValidElement`, чтобы проверить, является ли некоторое значение *React-элементом*.

React-элементы:

- Значения, полученные при написании [JSX-тега](/learn/writing-markup-with-jsx)
- Значения, полученные при вызове [`createElement`](/reference/react/createElement)

Для React-элементов `isValidElement` возвращает `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX-теги являются React-элементами
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Значения, возвращаемые createElement, являются React-элементами
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Любые другие значения, такие как строки, числа или произвольные объекты и массивы, не являются React-элементами.

Для них `isValidElement` возвращает `false`:

```js
// ❌ Это *не* React-элементы
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

Очень редко возникает необходимость использовать `isValidElement`. Это в основном полезно, если вы вызываете другой API, который *принимает только* элементы (как [`cloneElement`](/reference/react/cloneElement)), и вы хотите избежать ошибки, когда ваш аргумент не является React-элементом.

Если у вас нет какой-то очень специфической причины добавлять проверку `isValidElement`, скорее всего, она вам не нужна.

<DeepDive>

#### React-элементы против React-узлов {/*react-elements-vs-react-nodes*/}

Когда вы пишете компонент, вы можете вернуть из него любой *React-узел*:

```js
function MyComponent() {
  // ... вы можете вернуть любой React-узел ...
}
```

React-узел может быть:

- React-элементом, созданным как `<div />` или `createElement('div')`
- Порталом, созданным с помощью [`createPortal`](/reference/react-dom/createPortal)
- Строкой
- Числом
- `true`, `false`, `null` или `undefined` (которые не отображаются)
- Массивом других React-узлов

**Обратите внимание, что `isValidElement` проверяет, является ли аргумент *React-элементом*, а не React-узлом.** Например, `42` не является допустимым React-элементом. Однако это совершенно допустимый React-узел:

```js
function MyComponent() {
  return 42; // Можно вернуть число из компонента
}
```

Вот почему вы не должны использовать `isValidElement` для проверки того, можно ли что-то отобразить.

</DeepDive>