---
title: Rules of Hooks
---

<Intro>
Хуки определяются с помощью функций JavaScript, но они представляют собой особый тип повторно используемой логики пользовательского интерфейса с ограничениями на то, где они могут быть вызваны.
</Intro>

<InlineToc />

---

## Только вызывайте хуки на верхнем уровне {/*only-call-hooks-at-the-top-level*/}

Функции, имена которых начинаются с `use`, называются [*хуками*](/reference/react) в React.

**Не вызывайте хуки внутри циклов, условий, вложенных функций или блоков `try`/`catch`/`finally`.** Вместо этого всегда используйте хуки на верхнем уровне вашей функции React, перед любыми досрочными возвратами. Вы можете вызывать хуки только во время рендеринга компонента функции React:

* ✅ Вызывайте их на верхнем уровне в теле [компонента функции](/learn/your-first-component).
* ✅ Вызывайте их на верхнем уровне в теле [пользовательского хука](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Хорошо: на верхнем уровне в компоненте функции
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Хорошо: на верхнем уровне в пользовательском хуке
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Вызов хуков (функций, начинающихся с `use`) в других случаях **не** поддерживается, например:

* 🔴 Не вызывайте хуки внутри условий или циклов.
* 🔴 Не вызывайте хуки после условного оператора `return`.
* 🔴 Не вызывайте хуки в обработчиках событий.
* 🔴 Не вызывайте хуки в классовых компонентах.
* 🔴 Не вызывайте хуки внутри функций, передаваемых в `useMemo`, `useReducer` или `useEffect`.
* 🔴 Не вызывайте хуки внутри блоков `try`/`catch`/`finally`.

Если вы нарушите эти правила, вы можете увидеть эту ошибку.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Плохо: внутри условия (чтобы исправить, вынесите его наружу!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Плохо: внутри цикла (чтобы исправить, вынесите его наружу!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Плохо: после условного возврата (чтобы исправить, переместите его перед return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Плохо: внутри обработчика события (чтобы исправить, вынесите его наружу!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Плохо: внутри useMemo (чтобы исправить, вынесите его наружу!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Плохо: внутри классового компонента (чтобы исправить, напишите компонент функции вместо класса!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Плохо: внутри блока try/catch/finally (чтобы исправить, вынесите его наружу!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

Вы можете использовать плагин [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) для отлова этих ошибок.

<Note>

[Пользовательские хуки](/learn/reusing-logic-with-custom-hooks) *могут* вызывать другие хуки (в этом их основное назначение). Это работает, потому что пользовательские хуки также должны вызываться только во время рендеринга компонента функции.

</Note>

---

## Вызывайте хуки только из функций React {/*only-call-hooks-from-react-functions*/}

Не вызывайте хуки из обычных функций JavaScript. Вместо этого вы можете:

✅ Вызывать хуки из компонентов функций React.
✅ Вызывать хуки из [пользовательских хуков](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component).

Следуя этому правилу, вы гарантируете, что вся логика состояния в компоненте будет четко видна из его исходного кода.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Не компонент и не пользовательский хук!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```
