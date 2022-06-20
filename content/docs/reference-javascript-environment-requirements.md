---
id: javascript-environment-requirements
title: Требования к среде JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 полагается на типы коллекций [Map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map) и [Set](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Set). Во многих старых устройствах и браузерах (например, IE < 11) эти типы коллекций отсутствуют. В других же они имеют несоответствующую реализацию (скажем, IE 11). Если вы поддерживаете эти браузеры, то можете включить глобальный полифил в ваше приложение, такой как [core-js](https://github.com/zloirock/core-js).
Окружение для React 16, использующее core-js для поддержки старых браузеров, может выглядеть следующим образом:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Привет, мир!</h1>,
  document.getElementById('root')
);
```

React также полагается на `requestAnimationFrame` (даже в тестовом окружении).
Вы можете использовать пакет [raf](https://www.npmjs.com/package/raf) для создания шима `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
