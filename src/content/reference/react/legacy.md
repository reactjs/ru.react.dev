---
title: "Legacy React APIs"
---

<Intro>

Эти API экспортируются из пакета `react`, но не рекомендуются для использования в новом коде. См. связанные страницы отдельных API для предлагаемых альтернатив.

</Intro>

---

## Устаревшие API {/*legacy-apis*/}

* [`Children`](/reference/react/Children) позволяет манипулировать и трансформировать JSX, полученный как `children` проп. [См. альтернативы.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) позволяет создать React-элемент, используя другой элемент в качестве отправной точки. [См. альтернативы.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) позволяет определить React-компонент как JavaScript-класс. [См. альтернативы.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) позволяет создать React-элемент. Обычно вместо него используется JSX.
* [`createRef`](/reference/react/createRef) создает объект рефа, который может содержать произвольное значение. [См. альтернативы.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) позволяет вашему компоненту предоставить DOM-узел родительскому компоненту с помощью [рефа.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) проверяет, является ли значение React-элементом. Обычно используется с [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) похож на [`Component`,](/reference/react/Component) но пропускает повторные рендеры при одинаковых пропсах. [См. альтернативы.](/reference/react/PureComponent#alternatives)

---

## Удалённые API {/*removed-apis*/}

Эти API были удалены в React 19:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): используйте JSX вместо этого.
* Классовые компоненты: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): используйте [`static contextType`](#static-contexttype) вместо этого.
* Классовые компоненты: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): используйте [`static contextType`](#static-contexttype) вместо этого.
* Классовые компоненты: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): используйте [`Context.Provider`](/reference/react/createContext#provider) вместо этого.
* Классовые компоненты: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): используйте систему типов, такую как [TypeScript](https://www.typescriptlang.org/) вместо этого.
* Классовые компоненты: [`this.refs`](https://18.react.dev//reference/react/Component#refs): используйте [`createRef`](/reference/react/createRef) вместо этого.
