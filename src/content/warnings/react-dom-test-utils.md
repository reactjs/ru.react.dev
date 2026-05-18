---
title: react-dom/test-utils Deprecation Warnings
---

## Предупреждение ReactDOMTestUtils.act {/*reactdomtestutilsact-warning*/}

`act` из `react-dom/test-utils` устарел и заменён на `act` из `react`.

До:

```js
import {act} from 'react-dom/test-utils';
```

После:

```js
import {act} from 'react';
```

## Остальные API ReactDOMTestUtils {/*rest-of-reactdomtestutils-apis*/}

Все API, кроме `act`, были удалены.

Команда React рекомендует мигрировать ваши тесты на [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) для современного и хорошо поддерживаемого опыта тестирования.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument` можно заменить на `render` из `@testing-library/react`.

До:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

После:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate` можно заменить на `fireEvent` из `@testing-library/react`.

До:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

После:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

Имейте в виду, что `fireEvent` вызывает реальное событие на элементе, а не просто синтетически вызывает обработчик события.

### Список всех удалённых API {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`
