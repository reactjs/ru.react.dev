---
title: Предупреждение: некорректный проп ARIA
layout: single
permalink: warnings/invalid-aria-prop.html
---

Предупреждение invalid-aria-prop сгенерируется, если вы пытаетесь отрендерить DOM-элемент с пропом aria-*, которого нет в [спецификации](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) WAI-ARIA (Web Accessibility Initiative — Accessible Rich Internet Applications).

1. Если вам кажется, что используется корректный проп, внимательно проверьте правильность его написания. Часто бывают написаны с ошибками `aria-labelledby` и `aria-activedescendant`.

2. React пока что не распознаёт указанный вами атрибут. Скорее всего эта проблема будет исправлена в будущей версии React. А на данный момент React удаляет все неизвестные атрибуты, поэтому их присутствие в приложении не приведёт к рендеру.
