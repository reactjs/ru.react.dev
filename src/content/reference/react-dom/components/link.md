---
link: "<link>"
---

<Intro>

Встроенный браузерный компонент [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) позволяет использовать внешние ресурсы, такие как таблицы стилей, или аннотировать документ метаданными ссылок.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<link>` {/*link*/}

Чтобы связать внешние ресурсы, такие как таблицы стилей, шрифты и значки, или аннотировать документ метаданными ссылок, используйте встроенный браузерный компонент [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). Вы можете рендерить `<link>` из любого компонента, и React [в большинстве случаев](#special-rendering-behavior) поместит соответствующий DOM-элемент в `<head>` документа.

```js
<link rel="icon" href="favicon.ico" />
```

[См. примеры ниже.](#usage)

#### Props {/*props*/}

`<link>` поддерживает все [общие props элементов.](/reference/react-dom/components/common#props)

* `rel`: строка, обязательный. Указывает [отношение к ресурсу](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [обрабатывает ссылки с `rel="stylesheet"` иначе](#special-rendering-behavior), чем другие ссылки.

Эти props применяются, когда `rel="stylesheet"`:

* `precedence`: строка. Указывает React, какое место занять DOM-узлу `<link>` относительно других в `<head>` документа, что определяет, какая таблица стилей может переопределить другую. React будет считать, что обнаруженные значения `precedence` сначала имеют "меньший" приоритет, а обнаруженные позже — "больший". Многие системы стилей могут работать нормально, используя одно значение `precedence`, поскольку правила стилей атомарны. Таблицы стилей с одинаковым `precedence` группируются вместе, независимо от того, являются ли они тегами `<link>` или встроенными тегами `<style>`, или загружены с помощью функций [`preinit`](/reference/react-dom/preinit).
* `media`: строка. Ограничивает таблицу стилей определенным [медиа-запросом](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `title`: строка. Указывает имя [альтернативной таблицы стилей](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Эти props применяются, когда `rel="stylesheet"`, но отключают [специальную обработку таблиц стилей](#special-rendering-behavior) React:

* `disabled`: булево. Отключает таблицу стилей.
* `onError`: функция. Вызывается при неудачной загрузке таблицы стилей.
* `onLoad`: функция. Вызывается при завершении загрузки таблицы стилей.

Эти props применяются, когда `rel="preload"` или `rel="modulepreload"`:

* `as`: строка. Тип ресурса. Возможные значения: `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
* `imageSrcSet`: строка. Применимо только когда `as="image"`. Указывает [набор источников изображения](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes`: строка. Применимо только когда `as="image"`. Указывает [размеры изображения](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Эти props применяются, когда `rel="icon"` или `rel="apple-touch-icon"`:

* `sizes`: строка. [Размеры значка](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Эти props применяются во всех случаях:

* `href`: строка. URL связанного ресурса.
*  `crossOrigin`: строка. Используемая [политика CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). Возможные значения: `anonymous` и `use-credentials`. Требуется, когда `as` установлено в `"fetch"`.
*  `referrerPolicy`: строка. [Заголовок Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy), отправляемый при запросе. Возможные значения: `no-referrer-when-downgrade` (по умолчанию), `no-referrer`, `origin`, `origin-when-cross-origin` и `unsafe-url`.
* `fetchPriority`: строка. Предлагает относительный приоритет для получения ресурса. Возможные значения: `auto` (по умолчанию), `high` и `low`.
* `hrefLang`: строка. Язык связанного ресурса.
* `integrity`: строка. Криптографический хэш ресурса для [проверки его подлинности](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: строка. MIME-тип связанного ресурса.

Props, которые **не рекомендуются** для использования с React:

* `blocking`: строка. Если установлено в `"render"`, предписывает браузеру не отображать страницу до загрузки таблицы стилей. React предоставляет более детальный контроль с помощью Suspense.

#### Особое поведение при рендеринге {/*special-rendering-behavior*/}

React всегда будет помещать DOM-элемент, соответствующий компоненту `<link>`, в `<head>` документа, независимо от того, где в дереве React он был отрендерен. `<head>` — единственное допустимое место для `<link>` в DOM, однако удобно и сохраняет композитность, если компонент, представляющий конкретную страницу, может сам рендерить компоненты `<link>`.

Есть несколько исключений:

* Если у `<link>` есть проп `rel="stylesheet"`, то для получения этого особого поведения он также должен иметь проп `precedence`. Это связано с тем, что порядок таблиц стилей в документе имеет значение, поэтому React должен знать, как упорядочить эту таблицу стилей относительно других, что вы указываете с помощью пропса `precedence`. Если проп `precedence` опущен, особого поведения нет.
* Если у `<link>` есть проп [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), особого поведения нет, поскольку в этом случае он не относится к документу, а представляет метаданные о конкретной части страницы.
* Если у `<link>` есть проп `onLoad` или `onError`, поскольку в этом случае вы управляете загрузкой связанного ресурса вручную в вашем React-компоненте.

#### Особое поведение для таблиц стилей {/*special-behavior-for-stylesheets*/}

Кроме того, если `<link>` ссылается на таблицу стилей (то есть имеет `rel="stylesheet"` в своих props), React обрабатывает ее особым образом:

* Компонент, который рендерит `<link>`, будет [приостановлен](/reference/react/Suspense) во время загрузки таблицы стилей.
* Если несколько компонентов рендерят ссылки на одну и ту же таблицу стилей, React дедуплицирует их и поместит только одну ссылку в DOM. Две ссылки считаются одинаковыми, если у них одинаковый проп `href`.

Есть два исключения из этого особого поведения:

* Если у ссылки отсутствует проп `precedence`, особого поведения нет, поскольку порядок таблиц стилей в документе имеет значение, поэтому React должен знать, как упорядочить эту таблицу стилей относительно других, что вы указываете с помощью пропса `precedence`.
* Если вы передаете любой из пропсов `onLoad`, `onError` или `disabled`, особого поведения нет, поскольку эти props указывают, что вы управляете загрузкой таблицы стилей вручную в вашем компоненте.

Это особое обращение имеет два предостережения:

* React будет игнорировать изменения props после того, как ссылка была отрендерена. (React выдаст предупреждение в режиме разработки, если это произойдет.)
* React может оставить ссылку в DOM даже после того, как компонент, который ее отрендерил, был размонтирован.

---

## Использование {/*usage*/}

### Связывание с связанными ресурсами {/*linking-to-related-resources*/}

Вы можете аннотировать документ ссылками на связанные ресурсы, такие как значок, канонический URL или пингбэк. React поместит эти метаданные в `<head>` документа независимо от того, где в дереве React они были отрендерены.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>Мой блог</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Связывание с таблицей стилей {/*linking-to-a-stylesheet*/}

Если компонент зависит от определенной таблицы стилей для правильного отображения, вы можете отрендерить ссылку на эту таблицу стилей внутри компонента. Ваш компонент будет [приостановлен](/reference/react/Suspense) во время загрузки таблицы стилей. Вы должны указать проп `precedence`, который сообщает React, где разместить эту таблицу стилей относительно других — таблицы стилей с более высоким приоритетом могут переопределять те, что с более низким.

<Note>
Когда вы хотите использовать таблицу стилей, может быть полезно вызвать функцию [preinit](/reference/react-dom/preinit). Вызов этой функции может позволить браузеру начать загрузку таблицы стилей раньше, чем если бы вы просто отрендерили компонент `<link>`, например, отправив [ответ HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Управление приоритетом таблиц стилей {/*controlling-stylesheet-precedence*/}

Таблицы стилей могут конфликтовать друг с другом, и когда это происходит, браузер выбирает ту, которая идет позже в документе. React позволяет вам управлять порядком таблиц стилей с помощью пропса `precedence`. В этом примере три компонента рендерят таблицы стилей, и те, что имеют одинаковый приоритет, группируются вместе в `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}

```

</SandpackWithHTMLOutput>

Обратите внимание, что сами значения `precedence` являются произвольными, и их именование зависит от вас. React будет считать, что обнаруженные значения `precedence` сначала имеют "меньший" приоритет, а обнаруженные позже — "больший".

### Дедупликация рендеринга таблиц стилей {/*deduplicated-stylesheet-rendering*/}

Если вы рендерите одну и ту же таблицу стилей из нескольких компонентов, React поместит только одну ссылку `<link>` в `<head>` документа.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### Аннотирование конкретных элементов в документе ссылками {/*annotating-specific-items-within-the-document-with-links*/}

Вы можете использовать компонент `<link>` с пропсом `itemProp` для аннотирования конкретных элементов в документе ссылками на связанные ресурсы. В этом случае React *не* будет помещать эти аннотации в `<head>` документа, а разместит их, как и любой другой React-компонент.

```js
<section itemScope>
  <h3>Аннотирование конкретных элементов</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```