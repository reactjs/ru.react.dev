---
title: "Предупреждение: некорректный проп ARIA"
layout: single
permalink: warnings/invalid-aria-prop.html
---

Предупреждение invalid-aria-prop генерируется, когда вы пытаетесь отрендерить DOM-элемент с пропом aria-*, которого нет в [спецификации](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) WAI-ARIA (Web Accessibility Initiative — Accessible Rich Internet Applications).

1. Если вам кажется, что используется корректный проп, внимательно проверьте правильность его написания. Часто бывают написаны с ошибками `aria-labelledby` и `aria-activedescendant`.

<<<<<<< HEAD
2. React пока не распознаёт определённый вами атрибут. Скорее всего эта проблема будет решена в будущей версии React. На данный момент React удаляет все неизвестные атрибуты, поэтому их присутствие в приложении не приведёт к их рендеру.
=======
2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React.
>>>>>>> 5e9d673c6bc1530c901548c0b51af3ad3f91d594
