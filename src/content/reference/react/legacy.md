---
title: "Устаревшие API React"
---

<Intro>

Эти API экспортируются из пакета `react`, но не рекомендуются для использования в новом коде. См. связанные отдельные страницы API для предлагаемых альтернатив.

</Intro>

---

## Устаревшие API {/*legacy-apis*/}

* [`Children`](/reference/react/Children) позволяет манипулировать и преобразовывать JSX, полученный в качестве пропса `children`. [См. альтернативы.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) позволяет создавать React-элемент, используя другой элемент в качестве отправной точки. [См. альтернативы.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) позволяет определять React-компонент как JavaScript-класс. [См. альтернативы.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) позволяет создавать React-элемент. Обычно вместо этого вы будете использовать JSX.
* [`createRef`](/reference/react/createRef) создает объект ref, который может содержать произвольное значение. [См. альтернативы.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) позволяет вашему компоненту предоставлять DOM-узел родительскому компоненту с помощью [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) проверяет, является ли значение React-элементом. Обычно используется с [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) похож на [`Component`,](/reference/react/Component) но он пропускает повторные рендеры с теми же пропсами. [См. альтернативы.](/reference/react/PureComponent#alternatives)

---

## Удалённые API {/*removed-apis*/}

Эти API были удалены в React 19:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): используйте JSX вместо этого.
* Классовые компоненты: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): используйте [`static contextType`](#static-contexttype) вместо этого.
* Классовые компоненты: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): используйте [`static contextType`](#static-contexttype) вместо этого.
* Классовые компоненты: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): используйте [`Context.Provider`](/reference/react/createContext#provider) вместо этого.
* Классовые компоненты: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): используйте систему типов, такую как [TypeScript](https://www.typescriptlang.org/), вместо этого.
* Классовые компоненты: [`this.refs`](https://18.react.dev//reference/react/Component#refs): используйте [`createRef`](/reference/react/createRef) вместо этого.