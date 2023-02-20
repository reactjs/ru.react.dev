---
title: "Предупреждение: некорректный проп ARIA"
layout: single
permalink: warnings/invalid-aria-prop.html
---

Предупреждение invalid-aria-prop генерируется, когда вы пытаетесь отрендерить DOM-элемент с пропом aria-*, которого нет в [спецификации](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) WAI-ARIA (Web Accessibility Initiative — Accessible Rich Internet Applications).

1. Если вам кажется, что используется корректный проп, внимательно проверьте правильность его написания. Часто бывают написаны с ошибками `aria-labelledby` и `aria-activedescendant`.

<<<<<<< HEAD
2. React пока не распознаёт определённый вами атрибут. Скорее всего эта проблема будет решена в будущей версии React.
=======
2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
>>>>>>> 63c77695a95902595b6c2cc084a5c3650b15210a
