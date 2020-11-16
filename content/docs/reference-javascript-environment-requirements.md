---
id: javascript-environment-requirements
title: Требования к среде JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 полагается на типы коллекций [Map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map) и [Set](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Set). Во многих старых устройствах и браузерах (например, IE < 11) эти типы коллекций отсутствуют. В других же они имеют несоответствующую реализацию (скажем, IE 11). Если вы поддерживаете эти браузеры, то можете включить глобальный полифил в ваше приложение, такой как [core-js](https://github.com/zloirock/core-js) или [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

Окружение для React 16, использующее core-js для поддержки старых браузеров, может выглядеть следующим образом:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
