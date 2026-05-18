---
style: "<style>"
---
<Intro>

[Встроенный компонент `<style>` браузера](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) позволяет добавлять встроенные CSS-таблицы стилей в ваш документ.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<style>` {/*style*/}

Чтобы добавить встроенные стили в ваш документ, используйте [встроенный компонент `<style>` браузера](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style). Вы можете рендерить `<style>` из любого компонента, и React [в определённых случаях](#special-rendering-behavior) поместит соответствующий DOM-элемент в `<head>` документа и будет дедуплицировать идентичные стили.

```js
<style>{` p { color: red; } `}</style>
```

[См. больше примеров ниже.](#usage)

#### Props {/*props*/}

`<style>` поддерживает все [общие атрибуты элемента.](/reference/react-dom/components/common#props)

* `children`: строка, обязательный. Содержимое таблицы стилей.
* `precedence`: строка. Указывает React, какое место занять DOM-узлу `<style>` относительно других в `<head>` документа, что определяет, какая таблица стилей может переопределить другую. React будет выводить, что значения `precedence`, обнаруженные первыми, являются «ниже», а значения `precedence`, обнаруженные позже, — «выше». Многие системы стилей могут нормально работать с одним значением `precedence`, поскольку правила стилей атомарны. Таблицы стилей с одинаковым `precedence` объединяются, независимо от того, являются ли они тегами `<link>`, встроенными тегами `<style>` или загружены с помощью функций [`preinit`](/reference/react-dom/preinit).
* `href`: строка. Позволяет React [дедуплицировать стили](#special-rendering-behavior), имеющие одинаковый `href`.
* `media`: строка. Ограничивает таблицу стилей определённым [медиа-запросом](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `nonce`: строка. Криптографический [nonce для разрешения ресурса](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) при использовании строгой политики безопасности контента (Content Security Policy).
* `title`: строка. Указывает имя [альтернативной таблицы стилей](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Props, которые **не рекомендуются** для использования с React:

* `blocking`: строка. Если установлено значение `"render"`, браузеру предписывается не отображать страницу до загрузки таблицы стилей. React предоставляет более детальный контроль с помощью Suspense.

#### Особое поведение рендеринга {/*special-rendering-behavior*/}

React может перемещать компоненты `<style>` в `<head>` документа, дедуплицировать идентичные таблицы стилей и [приостанавливать рендеринг](/reference/react/Suspense) во время загрузки таблицы стилей.

Чтобы использовать это поведение, предоставьте props `href` и `precedence`. React будет дедуплицировать стили, если они имеют одинаковый `href`. Prop `precedence` указывает React, какое место занять DOM-узлу `<style>` относительно других в `<head>` документа, что определяет, какая таблица стилей может переопределить другую.

Это особое обращение имеет два нюанса:

* React будет игнорировать изменения props после рендеринга стиля. (React выдаст предупреждение в режиме разработки, если это произойдёт.)
* React отбросит все лишние props при использовании prop `precedence` (кроме `href` и `precedence`).
* React может оставить стиль в DOM даже после того, как компонент, который его рендерил, будет размонтирован.

---

## Использование {/*usage*/}

### Рендеринг встроенной CSS-таблицы стилей {/*rendering-an-inline-css-stylesheet*/}

Если компонент зависит от определённых CSS-стилей для корректного отображения, вы можете рендерить встроенную таблицу стилей внутри компонента.

Prop `href` должен однозначно идентифицировать таблицу стилей, поскольку React будет дедуплицировать таблицы стилей с одинаковым `href`.
Если вы укажете prop `precedence`, React переупорядочит встроенные таблицы стилей в соответствии с порядком появления этих значений в дереве компонентов.

Встроенные таблицы стилей не будут вызывать границы Suspense во время загрузки.
Даже если они загружают асинхронные ресурсы, такие как шрифты или изображения.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>