---
title: preloadModule
---

<Note>

[Фреймворки на основе React](/learn/start-a-new-react-project) часто обрабатывают загрузку ресурсов за вас, поэтому вам может не понадобиться вызывать этот API самостоятельно. Обратитесь к документации вашего фреймворка для получения подробной информации.

</Note>

<Intro>

`preloadModule` позволяет предварительно загрузить модуль ESM, который вы ожидаете использовать.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

Чтобы предварительно загрузить модуль ESM, вызовите функцию `preloadModule` из `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[См. больше примеров ниже.](#usage)

Функция `preloadModule` предоставляет браузеру подсказку о том, что он должен начать загрузку указанного модуля, что может сэкономить время.

#### Параметры {/*parameters*/}

* `href`: строка. URL модуля, который вы хотите загрузить.
* `options`: объект. Содержит следующие свойства:
  *  `as`: обязательная строка. Должна быть `'script'`.
  *  `crossOrigin`: строка. [Политика CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin), которую следует использовать. Возможные значения: `anonymous` и `use-credentials`.
  *  `integrity`: строка. Криптографический хеш модуля для [проверки его подлинности](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: строка. Криптографический [nonce для разрешения модуля](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) при использовании строгой политики безопасности контента (Content Security Policy).


#### Возвращаемое значение {/*returns*/}

`preloadModule` ничего не возвращает.

#### Ограничения {/*caveats*/}

* Многократные вызовы `preloadModule` с одинаковым `href` имеют тот же эффект, что и один вызов.
* В браузере вы можете вызывать `preloadModule` в любой ситуации: во время рендеринга компонента, в эффекте (Effect), в обработчике событий и т. д.
* При рендеринге на стороне сервера (server-side rendering) или при рендеринге серверных компонентов (Server Components) `preloadModule` имеет эффект только в том случае, если вы вызываете его во время рендеринга компонента или в асинхронном контексте, возникшем в результате рендеринга компонента. Все остальные вызовы будут проигнорированы.

---

## Использование {/*usage*/}

### Предварительная загрузка во время рендеринга {/*preloading-when-rendering*/}

Вызывайте `preloadModule` во время рендеринга компонента, если вы знаете, что он или его дочерние компоненты будут использовать определенный модуль.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Если вы хотите, чтобы браузер немедленно начал выполнение модуля (а не просто загрузил его), используйте вместо этого [`preinitModule`](/reference/react-dom/preinitModule). Если вы хотите загрузить скрипт, который не является модулем ESM, используйте [`preload`](/reference/react-dom/preload).

### Предварительная загрузка в обработчике событий {/*preloading-in-an-event-handler*/}

Вызывайте `preloadModule` в обработчике событий перед переходом на страницу или в состояние, где модуль будет необходим. Это позволит начать процесс раньше, чем если бы вы вызвали его во время рендеринга новой страницы или состояния.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```