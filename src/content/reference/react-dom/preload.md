---
title: preload
---

<Note>

[Фреймворки на основе React](/learn/start-a-new-react-project) часто обрабатывают загрузку ресурсов за вас, поэтому вам может не понадобиться вызывать этот API самостоятельно. Обратитесь к документации вашего фреймворка для получения подробной информации.

</Note>

<Intro>

`preload` позволяет заблаговременно загрузить ресурс, такой как таблица стилей, шрифт или внешний скрипт, который вы ожидаете использовать.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `preload(href, options)` {/*preload*/}

Чтобы предварительно загрузить ресурс, вызовите функцию `preload` из `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[См. больше примеров ниже.](#usage)

Функция `preload` предоставляет браузеру подсказку о том, что он должен начать загрузку указанного ресурса, что может сэкономить время.

#### Параметры {/*parameters*/}

* `href`: строка. URL ресурса, который вы хотите загрузить.
* `options`: объект. Содержит следующие свойства:
  *  `as`: обязательная строка. Тип ресурса. Его [возможные значения](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) включают `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
  *  `crossOrigin`: строка. [Политика CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin), которую следует использовать. Возможные значения: `anonymous` и `use-credentials`. Это обязательное поле, если `as` установлено в `"fetch"`.
  *  `referrerPolicy`: строка. [Заголовок Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy), который будет отправлен при запросе. Возможные значения: `no-referrer-when-downgrade` (по умолчанию), `no-referrer`, `origin`, `origin-when-cross-origin` и `unsafe-url`.
  *  `integrity`: строка. Криптографический хэш ресурса для [проверки его подлинности](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `type`: строка. MIME-тип ресурса.
  *  `nonce`: строка. Криптографический [nonce для разрешения ресурса](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) при использовании строгой политики безопасности контента (Content Security Policy).
  *  `fetchPriority`: строка. Предлагает относительный приоритет для загрузки ресурса. Возможные значения: `auto` (по умолчанию), `high` и `low`.
  *  `imageSrcSet`: строка. Используется только с `as: "image"`. Задает [набор источников изображения](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  *  `imageSizes`: строка. Используется только с `as: "image"`. Задает [размеры изображения](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### Возвращает {/*returns*/}

`preload` ничего не возвращает.

#### Оговорки {/*caveats*/}

* Несколько эквивалентных вызовов `preload` имеют тот же эффект, что и один вызов. Вызовы `preload` считаются эквивалентными согласно следующим правилам:
  * Два вызова эквивалентны, если у них одинаковый `href`, за исключением:
  * Если `as` установлено в `image`, два вызова эквивалентны, если у них одинаковые `href`, `imageSrcSet` и `imageSizes`.
* В браузере вы можете вызывать `preload` в любой ситуации: во время рендеринга компонента, в эффекте, в обработчике событий и так далее.
* При рендеринге на стороне сервера или при рендеринге серверных компонентов `preload` имеет эффект только в том случае, если вы вызываете его во время рендеринга компонента или в асинхронном контексте, возникшем в результате рендеринга компонента. Любые другие вызовы будут проигнорированы.

---

## Использование {/*usage*/}

### Предварительная загрузка во время рендеринга {/*preloading-when-rendering*/}

Вызывайте `preload` при рендеринге компонента, если вы знаете, что он или его дочерние компоненты будут использовать определенный ресурс.

<Recipes titleText="Примеры предварительной загрузки">

#### Предварительная загрузка внешнего скрипта {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Если вы хотите, чтобы браузер немедленно начал выполнение скрипта (а не просто загрузил его), вместо этого используйте [`preinit`](/reference/react-dom/preinit). Если вы хотите загрузить модуль ESM, используйте [`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### Предварительная загрузка таблицы стилей {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

Если вы хотите, чтобы таблица стилей была немедленно вставлена в документ (что означает, что браузер начнет ее парсить немедленно, а не просто загружать), вместо этого используйте [`preinit`](/reference/react-dom/preinit).

<Solution />

#### Предварительная загрузка шрифта {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

Если вы предварительно загружаете таблицу стилей, разумно также предварительно загрузить любые шрифты, на которые ссылается таблица стилей. Таким образом, браузер сможет начать загрузку шрифта до того, как он загрузит и разберет таблицу стилей.

<Solution />

#### Предварительная загрузка изображения {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

При предварительной загрузке изображения опции `imageSrcSet` и `imageSizes` помогают браузеру [загрузить изображение правильного размера для размера экрана](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### Предварительная загрузка в обработчике событий {/*preloading-in-an-event-handler*/}

Вызывайте `preload` в обработчике событий перед переходом на страницу или в состояние, где потребуются внешние ресурсы. Это позволит начать процесс раньше, чем если бы вы вызвали его во время рендеринга новой страницы или состояния.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```