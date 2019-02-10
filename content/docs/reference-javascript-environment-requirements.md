---
id: javascript-environment-requirements
title: Требования к окружающей среде JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 полагается на типы коллекций [Map](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map) и [Set](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Set). Если вы поддерживаете старые браузеры и устройства, которые могут не обеспечивать непосредственную поддержку этих типов коллекций (например, IE < 11) или которые имеют несоответствующую реализацию (например, IE 11), вы можете включить глобальный полифилл в ваше приложение, например [core-js](https://github.com/zloirock/core-js) или [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).

Окружающая среда с полифиллом для React 16 использующая core-js для поддержки старых браузеров может выглядеть следующим образом:

```js
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React также полагается на `requestAnimationFrame` (даже в тестовом окружении).
Вы можете использовать пакет [raf](https://www.npmjs.com/package/raf) для создания прослойки `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
