---
id: javascript-environment-requirements
title: Требования к среде JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18 поддерживает все современные браузеры (Edge, Firefox, Chrome, Safari и тд.).

Если вы поддерживаете старые устройства и браузеры, например Internet Explorer, которые не поддерживают современные возможности нативно или имеют несоответствующую реализацию, то можете включить глобальный полифил в бандл с вашим приложением.

React 18 использует следующие современные возможности:
- [`Promise`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

Подходящий полифил для этих возможностей зависит от вашего окружения. В большинстве случаев будет достаточно настроить параметры вашего [Browserlist](https://github.com/browserslist/browserslist). В противном случае потребуется непосредственно импортировать полифилы, к примеру, [`core-js`](https://github.com/zloirock/core-js).
