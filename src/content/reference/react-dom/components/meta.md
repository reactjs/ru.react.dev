<Intro>

Встроенный браузерный компонент [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) позволяет добавлять метаданные в документ.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<meta>` {/*meta*/}

Чтобы добавить метаданные документа, отрендерите [встроенный браузерный компонент `<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta). Вы можете рендерить `<meta>` из любого компонента, и React всегда будет помещать соответствующий DOM-элемент в `<head>` документа.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

`<meta>` поддерживает все [общие пропсы элементов.](/reference/react-dom/components/common#props)

Он должен иметь *ровно один* из следующих пропсов: `name`, `httpEquiv`, `charset`, `itemProp`. Компонент `<meta>` ведет себя по-разному в зависимости от того, какой из этих пропсов указан.

* `name`: строка. Указывает [тип метаданных](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name), которые должны быть прикреплены к документу.
* `charset`: строка. Указывает кодировку символов, используемую документом. Единственное допустимое значение — `"utf-8"`.
* `httpEquiv`: строка. Указывает директиву для обработки документа.
* `itemProp`: строка. Указывает метаданные о конкретном элементе внутри документа, а не о документе в целом.
* `content`: строка. Указывает метаданные, которые должны быть прикреплены при использовании с пропсами `name` или `itemProp`, или поведение директивы при использовании с пропсом `httpEquiv`.

#### Особое поведение рендеринга {/*special-rendering-behavior*/}

React всегда будет помещать DOM-элемент, соответствующий компоненту `<meta>`, внутрь `<head>` документа, независимо от того, где в дереве React он был отрендерен. `<head>` — единственное допустимое место для `<meta>` в DOM, однако это удобно и сохраняет композиционность, если компонент, представляющий конкретную страницу, может сам рендерить компоненты `<meta>`.

Есть одно исключение: если у `<meta>` есть пропс [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), специального поведения не будет, поскольку в этом случае он представляет метаданные не о документе, а о конкретной части страницы.

---

## Использование {/*usage*/}

### Аннотирование документа метаданными {/*annotating-the-document-with-metadata*/}

Вы можете аннотировать документ метаданными, такими как ключевые слова, краткое описание или имя автора. React поместит эти метаданные в `<head>` документа независимо от того, где в дереве React они были отрендерены.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

Вы можете рендерить компонент `<meta>` из любого компонента. React поместит DOM-узел `<meta>` в `<head>` документа.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Аннотирование конкретных элементов внутри документа метаданными {/*annotating-specific-items-within-the-document-with-metadata*/}

Вы можете использовать компонент `<meta>` с пропсом `itemProp` для аннотирования конкретных элементов внутри документа метаданными. В этом случае React *не* будет помещать эти аннотации в `<head>` документа, а разместит их, как и любой другой компонент React.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```