---
title: preinitModule
---

<Note>

[Фреймворки на основе React](/learn/start-a-new-react-project) часто обрабатывают загрузку ресурсов за вас, поэтому вам может не понадобиться вызывать этот API самостоятельно. Обратитесь к документации вашего фреймворка для получения подробной информации.

</Note>

<Intro>

`preinitModule` позволяет предварительно загрузить и выполнить ESM-модуль.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

Чтобы предварительно загрузить ESM-модуль, вызовите функцию `preinitModule` из `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[См. больше примеров ниже.](#usage)

Функция `preinitModule` даёт браузеру подсказку о том, что он должен начать загрузку и выполнение указанного модуля, что может сэкономить время. Модули, которые вы предварительно загружаете с помощью `preinit`, выполняются по завершении загрузки.

#### Параметры {/*parameters*/}

* `href`: строка. URL модуля, который вы хотите загрузить и выполнить.
* `options`: объект. Содержит следующие свойства:
  *  `as`: обязательная строка. Должна быть `'script'`.
  *  `crossOrigin`: строка. [Политика CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin), которую следует использовать. Возможные значения: `anonymous` и `use-credentials`.
  *  `integrity`: строка. Криптографический хэш модуля для [проверки его подлинности](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: строка. Криптографический [nonce для разрешения модуля](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) при использовании строгой политики безопасности контента (Content Security Policy).

#### Возвращаемое значение {/*returns*/}

`preinitModule` ничего не возвращает.

#### Особенности {/*caveats*/}

* Многократные вызовы `preinitModule` с одинаковым `href` имеют тот же эффект, что и один вызов.
* В браузере вы можете вызывать `preinitModule` в любой ситуации: во время рендеринга компонента, в эффекте, в обработчике событий и т. д.
* При рендеринге на стороне сервера (server-side rendering) или при рендеринге серверных компонентов `preinitModule` имеет эффект только в том случае, если вы вызываете его во время рендеринга компонента или в асинхронном контексте, происходящем из рендеринга компонента. Любые другие вызовы будут проигнорированы.

---

## Использование {/*usage*/}

### Предварительная загрузка во время рендеринга {/*preloading-when-rendering*/}

Вызывайте `preinitModule` во время рендеринга компонента, если вы знаете, что он или его дочерние компоненты будут использовать определённый модуль, и вас устраивает, что модуль будет выполнен и, следовательно, вступит в силу немедленно после загрузки.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Если вы хотите, чтобы браузер загрузил модуль, но не выполнял его сразу, вместо этого используйте [`preloadModule`](/reference/react-dom/preloadModule). Если вы хотите предварительно загрузить скрипт, который не является ESM-модулем, используйте [`preinit`](/reference/react-dom/preinit).

### Предварительная загрузка в обработчике событий {/*preloading-in-an-event-handler*/}

Вызывайте `preinitModule` в обработчике событий перед переходом на страницу или в состояние, где модуль будет необходим. Это позволит начать процесс раньше, чем если бы вы вызвали его во время рендеринга новой страницы или состояния.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```