---
title: Недопустимое предупреждение ARIA Prop
---

Это предупреждение сработает, если вы попытаетесь отобразить элемент DOM с опцией `aria-*`, которая не существует в Web Accessibility Initiative (WAI), доступном расширенном интернет-приложении (ARIA) [specification](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Если вы чувствуете, что используете правильный реквизит, внимательно проверьте орфографию. 'aria-labelledby' и 'aria-activedescendant' часто пишутся с ошибками.

2. Если вы написали `aria-role`, возможно, вы имели в виду `role`.

3. В противном случае, если вы используете последнюю версию React DOM и подтвердили, что используете допустимое имя свойства, указанное в спецификации ARIA, пожалуйста, [report a bug](https://github.com/facebook/react/issues/new/choose).