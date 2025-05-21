---
title: Правила использования крючков
---

Вероятно, вы здесь, потому что получили следующее сообщение об ошибке:

<ConsoleBlock level="error">

Перехватчики могут быть вызваны только внутри тела функционального компонента.

</ConsoleBlock>

Есть три распространенные причины, по которым вы можете это видеть:

1. Возможно, вы **нарушаете правила Хуков**.
2. У вас могут быть **несовпадающие версии** React и React DOM.
3. У вас может быть **более одной копии React** в одном приложении.

Давайте рассмотрим каждый из этих случаев.

## Нарушение правил использования крючков {/*breaking-rules-of-hooks*/}

Вызываются функции, имена которых начинаются с `use`. [*Hooks*](/reference/react) в React.

**Не вызывайте перехватчики внутри циклов, условий или вложенных функций.** Вместо этого всегда используйте перехватчики на верхнем уровне вашей функции React, прежде чем выполнять какие-либо ранние возвраты. Вы можете вызывать перехватчики только в то время, когда React выполняет рендеринг функционального компонента:

* ✅ Вызывайте их на верхнем уровне в теле [function component](/learn/your-first-component).
* ✅ Вызывайте их на верхнем уровне в теле [custom Hook](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

**Не** Поддерживается вызов перехватчиков (функций, начинающихся с `use`) в любых других случаях, например:

* 🔴 Не вызывайте перехватчики внутри условий или циклов.
* 🔴 Не вызывайте перехватчики после условного оператора `return`.
* 🔴 Не вызывайте перехватчики в обработчиках событий.
* 🔴 Не вызывайте перехватчики в компонентах класса.
* 🔴 Не вызывайте перехватчики внутри функций, передаваемых в "use Memory", `use Reduced` или `use Effect`.

Если вы нарушите эти правила, вы можете увидеть эту ошибку.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

Вы можете использовать [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks), чтобы уловить эти ошибки.

<Note>

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *может* вызывать другие перехватчики (в этом вся их цель). Это работает, потому что пользовательские перехватчики также должны вызываться только во время рендеринга функционального компонента.

</Note>

## Несовпадающие версии React и React DOM {/*mismatching-versions-of-react-and-react-dom*/}

Возможно, вы используете версию `react-dom` (< 16.8.0) или `react-native` (< 0.59), которая еще не поддерживает перехватчики. Вы можете запустить `npm ls react-dom` или `npm ls react-native` в папке вашего приложения, чтобы проверить, какую версию вы используете. Если вы обнаружите более одного из них, это также может создать проблемы (подробнее об этом ниже).

    ## Дублирующий React {/*duplicate-react*/}

Чтобы хуки работали, импорт `react` из кода вашего приложения должен быть разрешен в том же модуле, что и импорт `react` из пакета `react-dom`.

Если этот импорт `react` преобразуется в два разных объекта экспорта, вы увидите это предупреждение. Это может произойти, если у вас **случайно окажутся две копии** пакета `react`.

Если вы используете Node для управления пакетами, вы можете запустить эту проверку в папке вашего проекта:

<TerminalBlock>

npm ls react

</TerminalBlock>

Если вы видите более одного React, вам нужно будет выяснить, почему это происходит, и исправить ваше дерево зависимостей. Например, возможно, библиотека, которую вы используете, неправильно определяет `react` как зависимость (а не одноранговую зависимость). Пока эта библиотека не будет исправлена, [разрешения Yarn](https://yarnpkg.com/lang/en/docs/selective-version-resolutions /) - это один из возможных обходных путей.

Вы также можете попытаться устранить эту проблему, добавив несколько журналов и перезапустив свой сервер разработки:

```js
// Добавьте это в node_modules/react-dom/index.js
window.React1 = require('react');

// Добавьте это в свой файл компонента
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Если он выводит "false", то у вас могут быть две реакции, и вам нужно выяснить, почему это произошло. [This issue](https://github.com/facebook/react/issues/13991) включает в себя некоторые распространенные причины, с которыми сталкивается сообщество.

Эта проблема также может возникнуть, когда вы используете "npm link" или что-то подобное. В этом случае ваш пакетировщик может "увидеть" две реакции — одну в папке приложения и одну в папке вашей библиотеки. Предполагая, что `my app` и `mylib` являются родственными папками, одним из возможных исправлений является запуск `npm link ../myapp/node_modules/react` из `mylib`. Это должно заставить библиотеку использовать копию React приложения.

<Note>

В целом, React поддерживает использование нескольких независимых копий на одной странице (например, если приложение и сторонний виджет используют его одновременно). Он прерывается только в том случае, если `require('react')` разрешает по-разному между компонентом и копией `react-dom`, с помощью которой он был отрисован.

</Note>

## Другие причины {/*other-causes*/}

Если ничего из этого не сработало, пожалуйста, прокомментируйте в [this issue](https://github.com/facebook/react/issues/13991) и мы постараемся помочь. Попробуйте создать небольшой воспроизводящий пример — возможно, вы обнаружите проблему в процессе работы.
