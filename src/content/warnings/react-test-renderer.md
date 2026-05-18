---
title: react-test-renderer Deprecation Warnings
---

## Предупреждение ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}

`react-test-renderer` устарел. Предупреждение будет появляться при каждом вызове `ReactTestRenderer.create()` или `ReactShallowRender.render()`. Пакет `react-test-renderer` останется доступным в NPM, но не будет поддерживаться и может перестать работать с новыми функциями React или изменениями во внутренних компонентах React.

Команда React рекомендует перенести ваши тесты на [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) или [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/start/intro) для современного и хорошо поддерживаемого опыта тестирования.


## Предупреждение new ShallowRenderer() {/*new-shallowrenderer-warning*/}

Пакет `react-test-renderer` больше не экспортирует `shallow renderer` по пути `react-test-renderer/shallow`. Это была просто переупаковка ранее извлеченного отдельного пакета: `react-shallow-renderer`. Поэтому вы можете продолжать использовать `shallow renderer` тем же способом, установив его напрямую. См. [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
