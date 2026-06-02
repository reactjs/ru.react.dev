---
title: Invalid ARIA Prop Warning
---

Это предупреждение появится, если вы попытаетесь отрендерить DOM-элемент с пропом `aria-*`, которого нет в спецификации [Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA)](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

1. Если вы считаете, что используете допустимый проп, внимательно проверьте написание. `aria-labelledby` и `aria-activedescendant` часто пишут с ошибками.

2. Если вы написали `aria-role`, возможно, вы имели в виду `role`.

3. В противном случае, если вы используете последнюю версию React DOM и убедились, что используете допустимое имя свойства, перечисленное в спецификации ARIA, пожалуйста, [сообщите об ошибке](https://github.com/facebook/react/issues/new/choose).