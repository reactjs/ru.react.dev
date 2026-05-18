---
meta: "<meta>"
---
<Intro>

Встроенный компонент браузера `<meta>` позволяет добавлять метаданные в документ.

```js
<meta name="keywords" content="React, JavaScript, семантическая разметка, html" />
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<meta>` {/*meta*/}

Чтобы добавить метаданные документа, используйте встроенный компонент браузера `<meta>`. Вы можете рендерить `<meta>` из любого компонента, и React всегда поместит соответствующий DOM-элемент в `<head>` документа.

```js
<meta name="keywords" content="React, JavaScript, семантическая разметка, html" />
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

`<meta>` поддерживает все [общие пропсы элементов.](/reference/react-dom/components/common#props)

Он должен иметь *ровно один* из следующих пропсов: `name`, `httpEquiv`, `charset`, `itemProp`. Компонент `<meta>` ведет себя по-разному в зависимости от того, какой из этих пропсов указан.

* `name`: строка. Указывает [тип метаданных](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name), которые должны быть присоединены к документу.
* `charset`: строка. Указывает набор символов, используемый документом. Единственное допустимое значение — `"utf-8"`.
* `httpEquiv`: строка. Указывает директиву для обработки документа.
* `itemProp`: строка. Указывает метаданные о конкретном элементе внутри документа, а не о документе в целом.
* `content`: строка. Указывает метаданные, которые должны быть присоединены при использовании с пропсами `name` или `itemProp`, или поведение директивы при использовании с пропсом `httpEquiv`.

#### Особое поведение рендеринга {/*special-rendering-behavior*/}

React всегда будет помещать DOM-элемент, соответствующий компоненту `<meta>`, внутрь `<head>` документа, независимо от того, где в дереве React он был отрендерен. `<head>` — единственное допустимое место для `<meta>` в DOM, однако это удобно и сохраняет композиционность, если компонент, представляющий конкретную страницу, может сам рендерить компоненты `<meta>`.

Есть одно исключение: если у `<meta>` есть пропс [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), специального поведения нет, поскольку в этом случае он представляет метаданные не о документе, а о конкретной части страницы.

---

## Использование {/*usage*/}

### Аннотирование документа метаданными {/*annotating-the-document-with-metadata*/}

Вы можете аннотировать документ метаданными, такими как ключевые слова, краткое описание или имя автора. React поместит эти метаданные в `<head>` документа независимо от того, где в дереве React они были отрендерены.

```html
<meta name="author" content="Иван Иванов" />
<meta name="keywords" content="React, JavaScript, семантическая разметка, html" />
<meta name="description" content="Справочник API для компонента <meta> в React DOM" />
```

Вы можете рендерить компонент `<meta>` из любого компонента. React поместит DOM-узел `<meta>` в `<head>` документа.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="Карта сайта для веб-сайта React" />
      <h1>Карта сайта</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Аннотирование конкретных элементов в документе метаданными {/*annotating-specific-items-within-the-document-with-metadata*/}

Вы можете использовать компонент `<meta>` с пропсом `itemProp` для аннотирования конкретных элементов в документе метаданными. В этом случае React *не* будет помещать эти аннотации в `<head>` документа, а разместит их, как и любой другой компонент React.

```js
<section itemScope>
  <h3>Аннотирование конкретных элементов</h3>
  <meta itemProp="description" content="Справочник API для использования <meta> с itemProp" />
  <p>...</p>
</section>
```