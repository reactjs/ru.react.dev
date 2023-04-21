---
title: Rules of Hooks
---

Скорее всего, вы перешли на эту страницу, потому что получили следующее сообщение об ошибке:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>
 
Есть три основные причины, по которым вы могли увидеть это предупреждение:

1. You might be **breaking the Rules of Hooks**.
2. You might have **mismatching versions** of React and React DOM.
3. You might have **more than one copy of React** in the same app.

Разберём каждый из этих случаев.

## Breaking Rules of Hooks {/*breaking-rules-of-hooks*/}

Functions whose names start with `use` are called [*Hooks*](/reference/react) in React.

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:

* ✅ Call them at the top level in the body of a [function component](/learn/your-first-component).
* ✅ Call them at the top level in the body of a [custom Hook](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Хорошо: хук на верхнем уровне функционального компонента
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Хорошо: хук на верхнем уровне пользовательского хука
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

It’s **not** supported to call Hooks (functions starting with `use`) in any other cases, for example:

* 🔴 Do not call Hooks inside conditions or loops.
* 🔴 Do not call Hooks after a conditional `return` statement.
* 🔴 Do not call Hooks in event handlers.
* 🔴 Do not call Hooks in class components.
* 🔴 Do not call Hooks inside functions passed to `useMemo`, `useReducer`, or `useEffect`.

При нарушении перечисленных правил, можно столкнуться с этой ошибкой.

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
    // 🔴 Плохо: внутри обработчика событий (для исправления переместите его на уровень выше!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Плохо: использование внутри useMemo (для исправления переместите его на уровень выше!)
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

You can use the [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to catch these mistakes.

<Note>

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *may* call other Hooks (that's their whole purpose). This works because custom Hooks are also supposed to only be called while a function component is rendering.

</Note>

## Mismatching Versions of React and React DOM {/*mismatching-versions-of-react-and-react-dom*/}

You might be using a version of `react-dom` (< 16.8.0) or `react-native` (< 0.59) that doesn't yet support Hooks. You can run `npm ls react-dom` or `npm ls react-native` in your application folder to check which version you're using. If you find more than one of them, this might also create problems (more on that below).

## Duplicate React {/*duplicate-react*/}

Если эти `react` импорты ссылаются на два разных объекта экспорта, вы увидите такое предупреждение. Это произойдёт, если у вас случайно **оказалось несколько копий** пакета `react`

Если вы используете Node для управления пакетами, можете проверить копии пакета, находясь в папке проекта:

<TerminalBlock>

npm ls react

</TerminalBlock>

If you see more than one React, you'll need to figure out why this happens and fix your dependency tree. For example, maybe a library you're using incorrectly specifies `react` as a dependency (rather than a peer dependency). Until that library is fixed, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) is one possible workaround.

Вы также можете попробовать отладить эту проблему, добавив логирование и перезапустив сервер разработки:

```js
// Добавьте это в файл node_modules/react-dom/index.js
window.React1 = require('react');

// Добавьте это в ваш файл с компонентом
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Если код выше выводит `false`, то у вас может быть две версии React, а значит требуется выяснить, как это произошло. [Данное ишью](https://github.com/facebook/react/issues/13991) содержит некоторые распространённые причины, обнаруженные сообществом.

Эта проблема также может возникнуть при использовании команды `npm link` или ей подобной. В таком случае ваш бандлер может «увидеть» два пакета React -- один в папке приложения, а другой в папке вашей библиотеки. При условии, что `myapp` и `mylib` -- папки, находящиеся на одном уровне, выполнение `npm link ../myapp/node_modules/react` из-под папки `mylib` может помочь вам. Это должно заставить библиотеку использовать React-копию из приложения.

<Note>

In general, React supports using multiple independent copies on one page (for example, if an app and a third-party widget both use it). It only breaks if `require('react')` resolves differently between the component and the `react-dom` copy it was rendered with.

</Note>

## Другие случаи {/*other-causes*/}

Если ни одно из решений не помогло, пожалуйста, оставьте комментарий в [этом ишью](https://github.com/facebook/react/issues/13991), после чего мы постараемся вам помочь. Попробуйте также создать небольшой пример, который воспроизводит вашу проблему.
