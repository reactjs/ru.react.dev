---
title: Component
---

<Pitfall>

Мы рекомендуем определять компоненты как функции, а не классы. [См. как мигрировать.](#alternatives)

</Pitfall>

<Intro>

`Component` — это базовый класс для React-компонентов, определённых как [классы JavaScript.](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes) Классовые компоненты по-прежнему поддерживаются React, но мы не рекомендуем использовать их в новом коде.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `Component` {/*component*/}

Чтобы определить компонент React как класс, расширьте встроенный класс `Component` и определите метод [`render`.](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Обязательным является только метод `render`, остальные методы необязательны.

[См. больше примеров ниже.](#usage)

---

### `context` {/*context*/}

[Контекст](/learn/passing-data-deeply-with-context) классового компонента доступен как `this.context`. Он доступен только в том случае, если вы укажете, какой именно контекст вы хотите получить, используя [`static contextType`](#static-contexttype).

Классовый компонент может читать только один контекст за раз.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Чтение `this.context` в классовых компонентах эквивалентно [`useContext`](/reference/react/useContext) в функциональных компонентах.

[См. как мигрировать.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

Пропсы, переданные классовому компоненту, доступны как `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Чтение `this.props` в классовых компонентах эквивалентно [объявлению пропсов](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) в функциональных компонентах.

[См. как мигрировать.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `state` {/*state*/}

Состояние классового компонента доступно как `this.state`. Поле `state` должно быть объектом. Не изменяйте состояние напрямую. Если вы хотите изменить состояние, вызовите `setState` с новым состоянием.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

Определение `state` в классовых компонентах эквивалентно вызову [`useState`](/reference/react/useState) в функциональных компонентах.

[См. как мигрировать.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[Конструктор](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) выполняется до того, как ваш классовый компонент будет *смонтирован* (добавлен на экран). Обычно конструктор в React используется только для двух целей. Он позволяет объявить состояние и [привязать](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) методы вашего класса к экземпляру класса:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Если вы используете современный синтаксис JavaScript, конструкторы редко нужны. Вместо этого вы можете переписать приведенный выше код, используя [синтаксис публичных полей класса](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields), который поддерживается как современными браузерами, так и инструментами вроде [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Конструктор не должен содержать побочных эффектов или подписок.

#### Параметры {/*constructor-parameters*/}

* `props`: Начальные пропсы компонента.

#### Возвращает {/*constructor-returns*/}

`constructor` ничего не должен возвращать.

#### Особенности {/*constructor-caveats*/}

* Не выполняйте никаких побочных эффектов или подписок в конструкторе. Вместо этого используйте [`componentDidMount`](#componentdidmount) для этого.

* Внутри конструктора вы должны вызвать `super(props)` перед любым другим оператором. Если вы этого не сделаете, `this.props` будет `undefined` во время выполнения конструктора, что может сбить с толку и привести к ошибкам.

* Конструктор — единственное место, где вы можете напрямую присвоить [`this.state`](#state). Во всех остальных методах вместо этого необходимо использовать [`this.setState()`](#setstate). Не вызывайте `setState` в конструкторе.

* При использовании [серверного рендеринга](/reference/react-dom/server) конструктор также будет выполнен на сервере, за ним последует метод [`render`](#render). Однако методы жизненного цикла, такие как `componentDidMount` или `componentWillUnmount`, не будут выполнены на сервере.

* Когда включен [Strict Mode](/reference/react/StrictMode), React будет дважды вызывать `constructor` в режиме разработки, а затем отбросит один из экземпляров. Это поможет вам заметить случайные побочные эффекты, которые необходимо вынести из `constructor`.

<Note>

Точного эквивалента для `constructor` в функциональных компонентах нет. Чтобы объявить состояние в функциональном компоненте, вызовите [`useState`.](/reference/react/useState) Чтобы избежать пересчета начального состояния, [передайте функцию в `useState`.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

Если вы определите `componentDidCatch`, React вызовет его, когда какой-либо дочерний компонент (включая отдаленные дочерние) вызовет ошибку во время рендеринга. Это позволяет вам регистрировать эту ошибку в службе отчетности об ошибках в продакшене.

Обычно он используется вместе с [`static getDerivedStateFromError`](#static-getderivedstatefromerror), который позволяет обновлять состояние в ответ на ошибку и отображать пользователю сообщение об ошибке. Компонент с этими методами называется *предохранителем*.

[См. пример.](#catching-rendering-errors-with-an-error-boundary)

#### Параметры {/*componentdidcatch-parameters*/}

* `error`: Ошибка, которая была вызвана. На практике это обычно будет экземпляр [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), но это не гарантируется, поскольку JavaScript позволяет [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) любое значение, включая строки или даже `null`.

* `info`: Объект, содержащий дополнительную информацию об ошибке. Его поле `componentStack` содержит стек вызовов с компонентом, который вызвал ошибку, а также имена и исходные расположения всех его родительских компонентов. В продакшене имена компонентов будут минифицированы. Если вы настроили отчетность об ошибках в продакшене, вы можете декодировать стек компонентов с помощью sourcemaps так же, как вы бы сделали это для обычных стеков ошибок JavaScript.

#### Возвращает {/*componentdidcatch-returns*/}

`componentDidCatch` ничего не должен возвращать.

#### Особенности {/*componentdidcatch-caveats*/}

* В прошлом было принято вызывать `setState` внутри `componentDidCatch`, чтобы обновить пользовательский интерфейс и отобразить резервное сообщение об ошибке. Это устарело в пользу определения [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* Сборки React для продакшена и разработки немного отличаются в том, как `componentDidCatch` обрабатывает ошибки. В режиме разработки ошибки будут всплывать до `window`, что означает, что любой `window.onerror` или `window.addEventListener('error', callback)` будет перехватывать ошибки, которые были пойманы `componentDidCatch`. В продакшене вместо этого ошибки не будут всплывать, что означает, что любой обработчик ошибок предка получит только ошибки, явно не перехваченные `componentDidCatch`.

<Note>

Прямого эквивалента для `componentDidCatch` в функциональных компонентах пока нет. Если вы хотите избежать создания классовых компонентов, напишите один компонент `ErrorBoundary`, как показано выше, и используйте его во всем приложении. В качестве альтернативы вы можете использовать пакет [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary), который сделает это за вас.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

Если вы определите метод `componentDidMount`, React вызовет его, когда ваш компонент будет добавлен *(смонтирован)* на экран. Это распространенное место для начала получения данных, настройки подписок или манипулирования DOM-узлами.

Если вы реализуете `componentDidMount`, вам обычно нужно реализовать другие методы жизненного цикла, чтобы избежать ошибок. Например, если `componentDidMount` читает некоторое состояние или пропсы, вам также необходимо реализовать [`componentDidUpdate`](#componentdidupdate) для обработки их изменений и [`componentWillUnmount`](#componentwillunmount) для очистки всего, что делал `componentDidMount`.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[См. больше примеров.](#adding-lifecycle-methods-to-a-class-component)

#### Параметры {/*componentdidmount-parameters*/}

`componentDidMount` не принимает никаких параметров.

#### Возвращает {/*componentdidmount-returns*/}

`componentDidMount` ничего не должен возвращать.

#### Особенности {/*componentdidmount-caveats*/}

- Когда включен [Strict Mode](/reference/react/StrictMode), в режиме разработки React вызовет `componentDidMount`, затем немедленно вызовет [`componentWillUnmount`,](#componentwillunmount) а затем снова вызовет `componentDidMount`. Это поможет вам заметить, если вы забыли реализовать `componentWillUnmount`, или если его логика не полностью "отражает" то, что делает `componentDidMount`.

- Хотя вы можете немедленно вызвать [`setState`](#setstate) в `componentDidMount`, лучше избегать этого, когда это возможно. Это вызовет дополнительный рендеринг, но он произойдет до того, как браузер обновит экран. Это гарантирует, что, хотя [`render`](#render) будет вызван дважды в этом случае, пользователь не увидит промежуточное состояние. Используйте этот шаблон с осторожностью, так как он часто вызывает проблемы с производительностью. В большинстве случаев вы можете присвоить начальное состояние в [`constructor`](#constructor) вместо этого. Однако это может быть необходимо в случаях, таких как модальные окна и всплывающие подсказки, когда вам нужно измерить DOM-узел перед рендерингом чего-либо, зависящего от его размера или положения.

<Note>

Для многих сценариев использования определение `componentDidMount`, `componentDidUpdate` и `componentWillUnmount` вместе в классовых компонентах эквивалентно вызову [`useEffect`](/reference/react/useEffect) в функциональных компонентах. В редких случаях, когда важно, чтобы код выполнялся перед отрисовкой браузера, [`useLayoutEffect`](/reference/react/useLayoutEffect) является более близким аналогом.

[См. как мигрировать.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

Если вы определите метод `componentDidUpdate`, React вызовет его сразу после того, как ваш компонент будет повторно отрендерен с обновленными пропсами или состоянием. Этот метод не вызывается для начального рендеринга.

Вы можете использовать его для манипулирования DOM после обновления. Это также распространенное место для выполнения сетевых запросов, при условии, что вы сравниваете текущие пропсы с предыдущими (например, сетевой запрос может быть не нужен, если пропсы не изменились). Обычно вы будете использовать его вместе с [`componentDidMount`](#componentdidmount) и [`componentWillUnmount`:](#componentwillunmount)

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[См. больше примеров.](#adding-lifecycle-methods-to-a-class-component)


#### Параметры {/*componentdidupdate-parameters*/}

* `prevProps`: Пропсы до обновления. Сравните `prevProps` с [`this.props`](#props), чтобы определить, что изменилось.

* `prevState`: Состояние до обновления. Сравните `prevState` с [`this.state`](#state), чтобы определить, что изменилось.

* `snapshot`: Если вы реализовали [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` будет содержать значение, которое вы вернули из этого метода. В противном случае оно будет `undefined`.

#### Возвращает {/*componentdidupdate-returns*/}

`componentDidUpdate` ничего не должен возвращать.

#### Особенности {/*componentdidupdate-caveats*/}

- `componentDidUpdate` не будет вызван, если [`shouldComponentUpdate`](#shouldcomponentupdate) определен и возвращает `false`.

- Логика внутри `componentDidUpdate` обычно должна быть обернута в условия, сравнивающие `this.props` с `prevProps` и `this.state` с `prevState`. В противном случае существует риск создания бесконечных циклов.

- Хотя вы можете немедленно вызвать [`setState`](#setstate) в `componentDidUpdate`, лучше избегать этого, когда это возможно. Это вызовет дополнительный рендеринг, но он произойдет до того, как браузер обновит экран. Это гарантирует, что, хотя [`render`](#render) будет вызван дважды в этом случае, пользователь не увидит промежуточное состояние. Этот шаблон часто вызывает проблемы с производительностью, но он может быть необходим в редких случаях, таких как модальные окна и всплывающие подсказки, когда вам нужно измерить DOM-узел перед рендерингом чего-либо, зависящего от его размера или положения.

<Note>

Для многих сценариев использования определение `componentDidMount`, `componentDidUpdate` и `componentWillUnmount` вместе в классовых компонентах эквивалентно вызову [`useEffect`](/reference/react/useEffect) в функциональных компонентах. В редких случаях, когда важно, чтобы код выполнялся перед отрисовкой браузера, [`useLayoutEffect`](/reference/react/useLayoutEffect) является более близким аналогом.

[См. как мигрировать.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

Этот API был переименован из `componentWillMount` в [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) Старое имя устарело. В будущей основной версии React будет работать только новое имя.

Запустите [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles), чтобы автоматически обновить ваши компоненты.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

Этот API был переименован из `componentWillReceiveProps` в [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) Старое имя устарело. В будущей основной версии React будет работать только новое имя.

Запустите [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles), чтобы автоматически обновить ваши компоненты.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

Этот API был переименован из `componentWillUpdate` в [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) Старое имя устарело. В будущей основной версии React будет работать только новое имя.

Запустите [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles), чтобы автоматически обновить ваши компоненты.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

Если вы определите метод `componentWillUnmount`, React вызовет его перед тем, как ваш компонент будет удален *(размонтирован)* с экрана. Это распространенное место для отмены получения данных или удаления подписок.

Логика внутри `componentWillUnmount` должна "отражать" логику внутри [`componentDidMount`.](#componentdidmount) Например, если `componentDidMount` устанавливает подписку, `componentWillUnmount` должен очистить эту подписку. Если логика очистки в вашем `componentWillUnmount` читает какие-либо пропсы или состояние, вам обычно также потребуется реализовать [`componentDidUpdate`](#componentdidupdate) для очистки ресурсов (таких как подписки), соответствующих старым пропсам и состоянию.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[См. больше примеров.](#adding-lifecycle-methods-to-a-class-component)

#### Параметры {/*componentwillunmount-parameters*/}

`componentWillUnmount` не принимает никаких параметров.

#### Возвращает {/*componentwillunmount-returns*/}

`componentWillUnmount` ничего не должен возвращать.

#### Особенности {/*componentwillunmount-caveats*/}

- Когда включен [Strict Mode](/reference/react/StrictMode), в режиме разработки React вызовет [`componentDidMount`,](#componentdidmount) затем немедленно вызовет `componentWillUnmount`, а затем снова вызовет `componentDidMount`. Это поможет вам заметить, если вы забыли реализовать `componentWillUnmount`, или если его логика не полностью "отражает" то, что делает `componentDidMount`.

<Note>

Для многих сценариев использования определение `componentDidMount`, `componentDidUpdate` и `componentWillUnmount` вместе в классовых компонентах эквивалентно вызову [`useEffect`](/reference/react/useEffect) в функциональных компонентах. В редких случаях, когда важно, чтобы код выполнялся перед отрисовкой браузера, [`useLayoutEffect`](/reference/react/useLayoutEffect) является более близким аналогом.

[См. как мигрировать.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Принудительно перезапускает рендеринг компонента.

Обычно это не требуется. Если метод [`render`](#render) вашего компонента только читает из [`this.props`](#props), [`this.state`](#state) или [`this.context`,](#context) он будет автоматически перезапускаться при вызове [`setState`](#setstate) внутри вашего компонента или одного из его родительских. Однако, если метод `render` вашего компонента читает напрямую из внешнего источника данных, вы должны сообщить React об обновлении пользовательского интерфейса при изменении этого источника данных. Именно это позволяет делать `forceUpdate`.

Постарайтесь избегать всех использований `forceUpdate` и читайте только из `this.props` и `this.state` в `render`.

#### Параметры {/*forceupdate-parameters*/}

* **необязательно** `callback` Если указан, React вызовет предоставленный вами `callback` после применения обновления.

#### Возвращает {/*forceupdate-returns*/}

`forceUpdate` ничего не возвращает.

#### Особенности {/*forceupdate-caveats*/}

- Если вы вызовете `forceUpdate`, React перезапустит рендеринг без вызова [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Чтение внешнего источника данных и принудительный перезапуск рендеринга классовых компонентов в ответ на его изменения с помощью `forceUpdate` было заменено [`useSyncExternalStore`](/reference/react/useSyncExternalStore) в функциональных компонентах.

</Note>

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

Если вы реализуете `getSnapshotBeforeUpdate`, React вызовет его непосредственно перед тем, как React обновит DOM. Это позволяет вашему компоненту захватить некоторую информацию из DOM (например, положение прокрутки) до того, как она может быть изменена. Любое значение, возвращенное этим методом жизненного цикла, будет передано в качестве параметра в [`componentDidUpdate`.](#componentdidupdate)

Например, вы можете использовать его в пользовательском интерфейсе, таком как чат, который должен сохранять положение прокрутки во время обновлений:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Добавляем ли мы новые элементы в список?
    // Захватываем положение прокрутки, чтобы мы могли настроить его позже.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Если у нас есть значение снимка, мы только что добавили новые элементы.
    // Настраиваем прокрутку, чтобы эти новые элементы не выталкивали старые из поля зрения.
    // (snapshot здесь — это значение, возвращенное из getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...содержимое... */}</div>
    );
  }
}
```

В приведенном выше примере важно считывать свойство `scrollHeight` непосредственно в `getSnapshotBeforeUpdate`. Небезопасно считывать его в [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) или [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate), поскольку существует потенциальный временной разрыв между вызовом этих методов и обновлением DOM React.

#### Параметры {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: Пропсы до обновления. Сравните `prevProps` с [`this.props`](#props), чтобы определить, что изменилось.

* `prevState`: Состояние до обновления. Сравните `prevState` с [`this.state`](#state), чтобы определить, что изменилось.

#### Возвращает {/*getsnapshotbeforeupdate-returns*/}

Вы должны вернуть снимок значения любого типа, который вы хотите, или `null`. Возвращенное значение будет передано в качестве третьего аргумента в [`componentDidUpdate`.](#componentdidupdate)

#### Особенности {/*getsnapshotbeforeupdate-caveats*/}

- `getSnapshotBeforeUpdate` не будет вызван, если [`shouldComponentUpdate`](#shouldcomponentupdate) определен и возвращает `false`.

<Note>

В настоящее время нет эквивалента для `getSnapshotBeforeUpdate` для функциональных компонентов. Этот сценарий использования очень редок, но если он вам нужен, пока вам придется написать классовый компонент.

</Note>

---

### `render()` {/*render*/}

Метод `render` является единственным обязательным методом в классовом компоненте.

Метод `render` должен указывать, что вы хотите отобразить на экране, например:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React может вызвать `render` в любой момент, поэтому не следует предполагать, что он выполняется в определенное время. Обычно метод `render` должен возвращать фрагмент [JSX](/learn/writing-markup-with-jsx), но несколько [других типов возвращаемых значений](#render-returns) (например, строки) поддерживаются. Для расчета возвращаемого JSX метод `render` может читать [`this.props`](#props), [`this.state`](#state) и [`this.context`](#context).

Вы должны писать метод `render` как чистую функцию, что означает, что он должен возвращать тот же результат, если пропсы, состояние и контекст одинаковы. Он также не должен содержать побочных эффектов (например, настройки подписок) или взаимодействовать с API браузера. Побочные эффекты должны происходить либо в обработчиках событий, либо в методах, таких как [`componentDidMount`.](#componentdidmount)

#### Параметры {/*render-parameters*/}

`render` не принимает никаких параметров.

#### Возвращает {/*render-returns*/}

`render` может возвращать любой допустимый React-узел. Это включает React-элементы, такие как `<div />`, строки, числа, [порталы](/reference/react-dom/createPortal), пустые узлы (`null`, `undefined`, `true` и `false`), а также массивы React-узлов.

#### Особенности {/*render-caveats*/}

- `render` должен быть написан как чистая функция от пропсов, состояния и контекста. Он не должен иметь побочных эффектов.

- `render` не будет вызван, если [`shouldComponentUpdate`](#shouldcomponentupdate) определен и возвращает `false`.

- Когда включен [Strict Mode](/reference/react/StrictMode), React будет дважды вызывать `render` в режиме разработки, а затем отбросит один из результатов. Это поможет вам заметить случайные побочные эффекты, которые необходимо вынести из метода `render`.

- Нет однозначного соответствия между вызовом `render` и последующим вызовом `componentDidMount` или `componentDidUpdate`. Некоторые результаты вызова `render` могут быть отброшены React, когда это выгодно.

---

### `setState(nextState, callback?)` {/*setstate*/}

Вызовите `setState` для обновления состояния вашего React-компонента.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` ставит в очередь изменения состояния компонента. Он сообщает React, что этот компонент и его дочерние компоненты должны быть повторно отрендерены с новым состоянием. Это основной способ обновления пользовательского интерфейса в ответ на взаимодействия.

<Pitfall>

Вызов `setState` **не** изменяет текущее состояние в уже выполняющемся коде:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Все еще "Taylor"!
}
```

Он влияет только на то, что `this.state` вернет начиная со *следующего* рендеринга.

</Pitfall>

Вы также можете передать функцию в `setState`. Это позволяет обновлять состояние на основе предыдущего состояния:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

Вам не обязательно это делать, но это удобно, если вы хотите обновить состояние несколько раз во время одного события.

#### Параметры {/*setstate-parameters*/}

* `nextState`: Либо объект, либо функция.
  * Если вы передаете объект в качестве `nextState`, он будет поверхностно объединен с `this.state`.
  * Если вы передаете функцию в качестве `nextState`, она будет рассматриваться как _функция обновления_. Она должна быть чистой, принимать ожидаемое состояние и пропсы в качестве аргументов и возвращать объект для поверхностного объединения с `this.state`. React поместит вашу функцию обновления в очередь и перезапустит рендеринг компонента. Во время следующего рендеринга React вычислит следующее состояние, применив все поставленные в очередь обновления к предыдущему состоянию.

* **необязательно** `callback` Если указан, React вызовет предоставленный вами `callback` после применения обновления.

#### Возвращает {/*setstate-returns*/}

`setState` ничего не возвращает.

#### Особенности {/*setstate-caveats*/}

- Считайте `setState` *запросом*, а не немедленной командой на обновление компонента. Когда несколько компонентов обновляют свое состояние в ответ на событие, React группирует их обновления и повторно рендерит их вместе за один проход в конце события. В редких случаях, когда вам нужно принудительно применить определенное обновление состояния синхронно, вы можете обернуть его в [`flushSync`,](/reference/react-dom/flushSync), но это может снизить производительность.

- `setState` не обновляет `this.state` немедленно. Это делает чтение `this.state` сразу после вызова `setState` потенциальной проблемой. Вместо этого используйте [`componentDidUpdate`](#componentdidupdate) или аргумент обратного вызова `setState`, оба из которых гарантированно сработают после применения обновления. Если вам нужно установить состояние на основе предыдущего состояния, вы можете передать функцию в `nextState`, как описано выше.

<Note>

Вызов `setState` в классовых компонентах аналогичен вызову [`set` функции](/reference/react/useState#setstate) в функциональных компонентах.

[См. как мигрировать.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

Если вы определите `shouldComponentUpdate`, React вызовет её, чтобы определить, можно ли пропустить повторный рендеринг.

Если вы уверены, что хотите написать её вручную, вы можете сравнить `this.props` с `nextProps` и `this.state` с `nextState` и вернуть `false`, чтобы сообщить React, что обновление можно пропустить.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Ничего не изменилось, поэтому повторный рендеринг не требуется
      return false;
    }
    return true;
  }

  // ...
}

```

React вызывает `shouldComponentUpdate` перед рендерингом, когда получаются новые пропсы или состояние. По умолчанию возвращает `true`. Этот метод не вызывается при первоначальном рендеринге или при использовании [`forceUpdate`](#forceupdate).

#### Параметры {/*shouldcomponentupdate-parameters*/}

- `nextProps`: Следующие пропсы, с которыми компонент собирается отрендериться. Сравните `nextProps` с [`this.props`](#props), чтобы определить, что изменилось.
- `nextState`: Следующее состояние, с которым компонент собирается отрендериться. Сравните `nextState` с [`this.state`](#props), чтобы определить, что изменилось.
- `nextContext`: Следующий контекст, который компонент собирается получить. Сравните `nextContext` с [`this.context`](#context), чтобы определить, что изменилось. Доступно только если вы указали [`static contextType`](#static-contexttype).

#### Возвращает {/*shouldcomponentupdate-returns*/}

Верните `true`, если вы хотите, чтобы компонент отрендерился повторно. Это поведение по умолчанию.

Верните `false`, чтобы сообщить React, что повторный рендеринг можно пропустить.

#### Предостережения {/*shouldcomponentupdate-caveats*/}

- Этот метод существует *только* как оптимизация производительности. Если ваш компонент ломается без него, сначала исправьте это.

- Вместо ручного написания `shouldComponentUpdate` рассмотрите возможность использования [`PureComponent`](/reference/react/PureComponent). `PureComponent` выполняет поверхностное сравнение пропсов и состояния, уменьшая вероятность пропуска необходимого обновления.

- Мы не рекомендуем выполнять глубокие проверки равенства или использовать `JSON.stringify` в `shouldComponentUpdate`. Это делает производительность непредсказуемой и зависимой от структуры данных каждого пропа и состояния. В лучшем случае вы рискуете ввести многосекундные задержки в ваше приложение, а в худшем — рискуете его сломать.

- Возврат `false` не предотвращает повторный рендеринг дочерних компонентов, когда изменяется *их* состояние.

- Возврат `false` не *гарантирует*, что компонент не будет отрендерен повторно. React будет использовать возвращаемое значение как подсказку, но может все равно выбрать повторный рендеринг вашего компонента, если это имеет смысл по другим причинам.

<Note>

Оптимизация классовых компонентов с помощью `shouldComponentUpdate` аналогична оптимизации функциональных компонентов с помощью [`memo`.](/reference/react/memo) Функциональные компоненты также предлагают более детальную оптимизацию с помощью [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

Если вы определите `UNSAFE_componentWillMount`, React вызовет её сразу после [`constructor`.](#constructor) Она существует только по историческим причинам и не должна использоваться в новом коде. Вместо этого используйте одну из альтернатив:

- Для инициализации состояния объявите [`state`](#state) как поле класса или установите `this.state` внутри [`constructor`.](#constructor)
- Если вам нужно выполнить побочный эффект или настроить подписку, переместите эту логику в [`componentDidMount`](#componentdidmount) вместо этого.

[Примеры миграции с небезопасных жизненных циклов.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Параметры {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` не принимает параметров.

#### Возвращает {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` не должна ничего возвращать.

#### Предостережения {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` не будет вызвана, если компонент реализует [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) или [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Несмотря на своё название, `UNSAFE_componentWillMount` не гарантирует, что компонент *будет* смонтирован, если ваше приложение использует современные возможности React, такие как [`Suspense`.](/reference/react/Suspense) Если попытка рендеринга приостановлена (например, потому что код некоторого дочернего компонента ещё не загружен), React отбросит текущее дерево и попытается сконструировать компонент с нуля во время следующей попытки. Вот почему этот метод является «небезопасным». Код, который зависит от монтирования (например, добавление подписки), должен быть помещён в [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` — единственный метод жизненного цикла, который выполняется во время [рендеринга на стороне сервера.](/reference/react-dom/server) Для всех практических целей он идентичен [`constructor`,](#constructor) поэтому для такого типа логики следует использовать `constructor`.

<Note>

Вызов [`setState`](#setstate) внутри `UNSAFE_componentWillMount` в классовом компоненте для инициализации состояния эквивалентен передаче этого состояния в качестве начального состояния в [`useState`](/reference/react/useState) в функциональном компоненте.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

Если вы определите `UNSAFE_componentWillReceiveProps`, React вызовет её, когда компонент получит новые пропсы. Она существует только по историческим причинам и не должна использоваться в новом коде. Вместо этого используйте одну из альтернатив:

- Если вам нужно **выполнить побочный эффект** (например, получить данные, запустить анимацию или переинициализировать подписку) в ответ на изменения пропсов, переместите эту логику в [`componentDidUpdate`](#componentdidupdate) вместо этого.
- Если вам нужно **избежать повторного вычисления некоторых данных только при изменении пропа,** вместо этого используйте [вспомогательный метод мемоизации](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
- Если вам нужно **«сбросить» некоторое состояние при изменении пропа,** рассмотрите возможность сделать компонент [полностью управляемым](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) или [полностью неуправляемым с ключом](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) вместо этого.
- Если вам нужно **«скорректировать» некоторое состояние при изменении пропа,** проверьте, можете ли вы вычислить всю необходимую информацию только из пропсов во время рендеринга. Если не можете, вместо этого используйте [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops).

[Примеры миграции с небезопасных жизненных циклов.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Параметры {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: Следующие пропсы, которые компонент собирается получить от родительского компонента. Сравните `nextProps` с [`this.props`](#props), чтобы определить, что изменилось.
- `nextContext`: Следующий контекст, который компонент собирается получить от ближайшего провайдера. Сравните `nextContext` с [`this.context`](#context), чтобы определить, что изменилось. Доступно только если вы указали [`static contextType`](#static-contexttype).

#### Возвращает {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` не должна ничего возвращать.

#### Предостережения {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` не будет вызвана, если компонент реализует [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) или [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Несмотря на своё название, `UNSAFE_componentWillReceiveProps` не гарантирует, что компонент *получит* эти пропсы, если ваше приложение использует современные возможности React, такие как [`Suspense`.](/reference/react/Suspense) Если попытка рендеринга приостановлена (например, потому что код некоторого дочернего компонента ещё не загружен), React отбросит текущее дерево и попытается сконструировать компонент с нуля во время следующей попытки. К моменту следующей попытки рендеринга пропсы могут измениться. Вот почему этот метод является «небезопасным». Код, который должен выполняться только для зафиксированных обновлений (например, сброс подписки), должен быть помещён в [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillReceiveProps` не означает, что компонент получил *отличные* от предыдущего раза пропсы. Вам нужно самостоятельно сравнить `nextProps` с [`this.props`], чтобы проверить, изменилось ли что-то.

- React не вызывает `UNSAFE_componentWillReceiveProps` с начальными пропсами во время монтирования. Он вызывает этот метод только в том случае, если некоторые пропсы компонента будут обновлены. Например, вызов [`setState`](#setstate) обычно не запускает `UNSAFE_componentWillReceiveProps` внутри того же компонента.

<Note>

Вызов [`setState`](#setstate) внутри `UNSAFE_componentWillReceiveProps` в классовом компоненте для «корректировки» состояния эквивалентен [вызову функции `set` из `useState` во время рендеринга](/reference/react/useState#storing-information-from-previous-renders) в функциональном компоненте.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


Если вы определите `UNSAFE_componentWillUpdate`, React вызовет её перед рендерингом с новыми пропсами или состоянием. Она существует только по историческим причинам и не должна использоваться в новом коде. Вместо этого используйте одну из альтернатив:

- Если вам нужно выполнить побочный эффект (например, получить данные, запустить анимацию или переинициализировать подписку) в ответ на изменения пропсов или состояния, переместите эту логику в [`componentDidUpdate`](#componentdidupdate) вместо этого.
- Если вам нужно прочитать некоторую информацию из DOM (например, чтобы сохранить текущую позицию прокрутки), чтобы использовать её позже в [`componentDidUpdate`](#componentdidupdate), прочитайте её внутри [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) вместо этого.

[Примеры миграции с небезопасных жизненных циклов.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Параметры {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: Следующие пропсы, с которыми компонент собирается отрендериться. Сравните `nextProps` с [`this.props`](#props), чтобы определить, что изменилось.
- `nextState`: Следующее состояние, с которым компонент собирается отрендериться. Сравните `nextState` с [`this.state`](#state), чтобы определить, что изменилось.

#### Возвращает {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` не должна ничего возвращать.

#### Предостережения {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` не будет вызвана, если определён [`shouldComponentUpdate`](#shouldcomponentupdate) и он возвращает `false`.

- `UNSAFE_componentWillUpdate` не будет вызвана, если компонент реализует [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) или [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Вызов [`setState`](#setstate) (или любого метода, который приводит к вызову `setState`, например, диспетчеризация действия Redux) во время `componentWillUpdate` не поддерживается.

- Несмотря на своё название, `UNSAFE_componentWillUpdate` не гарантирует, что компонент *обновится*, если ваше приложение использует современные возможности React, такие как [`Suspense`.](/reference/react/Suspense) Если попытка рендеринга приостановлена (например, потому что код некоторого дочернего компонента ещё не загружен), React отбросит текущее дерево и попытается сконструировать компонент с нуля во время следующей попытки. К моменту следующей попытки рендеринга пропсы и состояние могут измениться. Вот почему этот метод является «небезопасным». Код, который должен выполняться только для зафиксированных обновлений (например, сброс подписки), должен быть помещён в [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillUpdate` не означает, что компонент получил *отличные* от предыдущего раза пропсы или состояние. Вам нужно самостоятельно сравнить `nextProps` с `this.props` и `nextState` с `this.state`, чтобы проверить, изменилось ли что-то.

- React не вызывает `UNSAFE_componentWillUpdate` с начальными пропсами и состоянием во время монтирования.

<Note>

Прямого эквивалента `UNSAFE_componentWillUpdate` в функциональных компонентах нет.

</Note>

---

### `static contextType` {/*static-contexttype*/}

Если вы хотите читать [`this.context`](#context-instance-field) из вашего классового компонента, вы должны указать, какой контекст ему необходимо читать. Контекст, который вы указываете как `static contextType`, должен быть значением, ранее созданным с помощью [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Чтение `this.context` в классовых компонентах эквивалентно [`useContext`](/reference/react/useContext) в функциональных компонентах.

[См. как мигрировать.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Вы можете определить `static defaultProps`, чтобы установить значения пропсов по умолчанию для класса. Они будут использоваться для `undefined` и отсутствующих пропсов, но не для `null` пропсов.

Например, вот как вы определяете, что проп `color` по умолчанию должен быть `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

Если проп `color` не предоставлен или равен `undefined`, он будет установлен по умолчанию в `'blue'`:

```js
<>
  {/* this.props.color равен "blue" */}
  <Button />

  {/* this.props.color равен "blue" */}
  <Button color={undefined} />

  {/* this.props.color равен null */}
  <Button color={null} />

  {/* this.props.color равен "red" */}
  <Button color="red" />
</>
```

<Note>

Определение `defaultProps` в классовых компонентах аналогично использованию [значений по умолчанию](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) в функциональных компонентах.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

Если вы определите `static getDerivedStateFromError`, React вызовет её, когда дочерний компонент (включая удалённые дочерние) вызовет ошибку во время рендеринга. Это позволяет вам отобразить сообщение об ошибке вместо очистки пользовательского интерфейса.

Обычно он используется вместе с [`componentDidCatch`](#componentdidcatch), который позволяет отправлять отчёт об ошибке в службу аналитики. Компонент с этими методами называется *предохранителем*.

[Пример.](#catching-rendering-errors-with-an-error-boundary)

#### Параметры {/*static-getderivedstatefromerror-parameters*/}

* `error`: Ошибка, которая была вызвана. На практике это обычно будет экземпляр [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), но это не гарантируется, поскольку JavaScript позволяет [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) любое значение, включая строки или даже `null`.

#### Возвращает {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` должен вернуть состояние, которое указывает компоненту отобразить сообщение об ошибке.

#### Предостережения {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` должен быть чистой функцией. Если вы хотите выполнить побочный эффект (например, вызвать службу аналитики), вам также необходимо реализовать [`componentDidCatch`.](#componentdidcatch)

<Note>

Прямого эквивалента для `static getDerivedStateFromError` в функциональных компонентах пока нет. Если вы хотите избежать создания классовых компонентов, напишите один компонент `ErrorBoundary`, как показано выше, и используйте его во всем вашем приложении. В качестве альтернативы используйте пакет [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary), который делает это.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

Если вы определите `static getDerivedStateFromProps`, React вызовет её непосредственно перед вызовом [`render`,](#render) как при первоначальном монтировании, так и при последующих обновлениях. Он должен вернуть объект для обновления состояния или `null`, чтобы ничего не обновлять.

Этот метод существует для [редких случаев использования](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state), когда состояние зависит от изменений пропсов с течением времени. Например, этот компонент `Form` сбрасывает состояние `email` при изменении пропа `userID`:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // В любое время, когда текущий пользователь меняется,
    // сбрасывайте части состояния, связанные с этим пользователем.
    // В этом простом примере это только email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Обратите внимание, что этот шаблон требует сохранения предыдущего значения пропа (например, `userID`) в состоянии (например, `prevUserID`).

<Pitfall>

Вывод состояния приводит к многословному коду и затрудняет понимание компонентов. [Убедитесь, что вы знакомы с более простыми альтернативами:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- Если вам нужно **выполнить побочный эффект** (например, получение данных или анимацию) в ответ на изменение пропсов, вместо этого используйте метод [`componentDidUpdate`](#componentdidupdate).
- Если вы хотите **пересчитать некоторые данные только при изменении пропа,** вместо этого [используйте вспомогательный метод мемоизации.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- Если вы хотите **«сбросить» некоторое состояние при изменении пропа,** рассмотрите возможность сделать компонент [полностью управляемым](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) или [полностью неуправляемым с ключом](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) вместо этого.

</Pitfall>

#### Параметры {/*static-getderivedstatefromprops-parameters*/}

- `props`: Следующие пропсы, с которыми компонент собирается отрендериться.
- `state`: Следующее состояние, с которым компонент собирается отрендериться.

#### Возвращает {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` возвращает объект для обновления состояния или `null`, чтобы ничего не обновлять.

#### Предостережения {/*static-getderivedstatefromprops-caveats*/}

- Этот метод вызывается при *каждом* рендеринге, независимо от причины. Это отличается от [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops), который вызывается только тогда, когда родитель вызывает повторный рендеринг, а не в результате локального `setState`.

- Этот метод не имеет доступа к экземпляру компонента. При желании вы можете повторно использовать некоторый код между `static getDerivedStateFromProps` и другими методами класса, извлекая чистые функции пропсов и состояния компонента за пределами определения класса.

<Note>

Реализация `static getDerivedStateFromProps` в классовом компоненте эквивалентна [вызову функции `set` из `useState` во время рендеринга](/reference/react/useState#storing-information-from-previous-renders) в функциональном компоненте.

</Note>

---

## Использование {/*usage*/}

### Определение классового компонента {/*defining-a-class-component*/}

Чтобы определить компонент React как класс, расширьте встроенный класс `Component` и определите метод [`render`](#render):

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React будет вызывать ваш метод [`render`](#render) всякий раз, когда ему нужно определить, что отобразить на экране. Обычно вы будете возвращать из него [JSX](/learn/writing-markup-with-jsx). Ваш метод `render` должен быть [чистой функцией:](https://en.wikipedia.org/wiki/Pure_function) он должен только вычислять JSX.

Подобно [функциональным компонентам](/learn/your-first-component#defining-a-component), классовый компонент может [получать информацию через пропсы](/learn/your-first-component#defining-a-component) от своего родительского компонента. Однако синтаксис для чтения пропсов отличается. Например, если родительский компонент рендерит `<Greeting name="Taylor" />`, то вы можете прочитать пропс `name` из [`this.props`](#props), например `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Обратите внимание, что хуки (функции, начинающиеся с `use`, например [`useState`](/reference/react/useState)) не поддерживаются внутри классовых компонентов.

<Pitfall>

Мы рекомендуем определять компоненты как функции, а не как классы. [См. как мигрировать.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Добавление состояния в классовый компонент {/*adding-state-to-a-class-component*/}

Чтобы добавить [состояние](/learn/state-a-components-memory) в класс, присвойте объект свойству с именем [`state`](#state). Чтобы обновить состояние, вызовите [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

Мы рекомендуем определять компоненты как функции, а не как классы. [См. как мигрировать.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Добавление методов жизненного цикла в классовый компонент {/*adding-lifecycle-methods-to-a-class-component*/}

Есть несколько специальных методов, которые вы можете определить в своем классе.

Если вы определите метод [`componentDidMount`](#componentdidmount), React вызовет его, когда ваш компонент будет добавлен *(смонтирован)* на экран. React вызовет [`componentDidUpdate`](#componentdidupdate) после того, как ваш компонент повторно отрендерится из-за измененных пропсов или состояния. React вызовет [`componentWillUnmount`](#componentwillunmount) после того, как ваш компонент будет удален *(размонтирован)* с экрана.

Если вы реализуете `componentDidMount`, вам обычно нужно реализовать все три метода жизненного цикла, чтобы избежать ошибок. Например, если `componentDidMount` считывает какое-то состояние или пропсы, вам также нужно реализовать `componentDidUpdate` для обработки их изменений и `componentWillUnmount` для очистки всего, что делал `componentDidMount`.

Например, этот компонент `ChatRoom` синхронизирует подключение к чату с пропсами и состоянием:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Обратите внимание, что в режиме разработки при включенном [Strict Mode](/reference/react/StrictMode) React вызовет `componentDidMount`, сразу же вызовет `componentWillUnmount`, а затем снова вызовет `componentDidMount`. Это поможет вам заметить, если вы забыли реализовать `componentWillUnmount` или если его логика не полностью "отражает" то, что делает `componentDidMount`.

<Pitfall>

Мы рекомендуем определять компоненты как функции, а не как классы. [См. как мигрировать.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Перехват ошибок рендеринга с помощью предохранителя {/*catching-rendering-errors-with-an-error-boundary*/}

По умолчанию, если ваше приложение выдает ошибку во время рендеринга, React удалит его UI с экрана. Чтобы предотвратить это, вы можете обернуть часть вашего UI в *предохранитель*. Предохранитель — это специальный компонент, который позволяет отображать некоторый резервный UI вместо упавшей части — например, сообщение об ошибке.

Чтобы реализовать компонент-предохранитель, вам нужно предоставить [`static getDerivedStateFromError`](#static-getderivedstatefromerror), который позволяет вам обновить состояние в ответ на ошибку и отобразить пользователю сообщение об ошибке. Вы также можете опционально реализовать [`componentDidCatch`](#componentdidcatch) для добавления дополнительной логики, например, для логирования ошибки в службу аналитики.

С помощью [`captureOwnerStack`](/reference/react/captureOwnerStack) вы можете включить стек владельца во время разработки.

```js {9-12,14-27}
import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Затем вы можете обернуть часть вашего дерева компонентов с его помощью:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

Если `Profile` или его дочерний компонент выдаст ошибку, `ErrorBoundary` "поймает" эту ошибку, отобразит резервный UI с предоставленным вами сообщением об ошибке и отправит отчет об ошибке продакшена в вашу службу отчетности об ошибках.

Вам не нужно оборачивать каждый компонент в отдельный предохранитель. Когда вы думаете о [гранулярности предохранителей,](https://www.brandondail.com/posts/fault-tolerance-react) подумайте, где имеет смысл отображать сообщение об ошибке. Например, в приложении для обмена сообщениями имеет смысл разместить предохранитель вокруг списка разговоров. Также имеет смысл разместить его вокруг каждого отдельного сообщения. Однако не имеет смысла размещать предохранитель вокруг каждого аватара.

<Note>

В настоящее время нет способа написать предохранитель как функциональный компонент. Однако вам не нужно писать класс предохранителя самостоятельно. Например, вы можете использовать [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) вместо этого.

</Note>

---

## Альтернативы {/*alternatives*/}

### Миграция простого компонента из класса в функцию {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Как правило, вы будете [определять компоненты как функции](/learn/your-first-component#defining-a-component) вместо этого.

Например, предположим, вы преобразуете этот классовый компонент `Greeting` в функцию:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Определите функцию с именем `Greeting`. Здесь вы переместите тело вашего метода `render`.

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

Вместо `this.props.name` определите пропс `name` [с помощью синтаксиса деструктуризации](/learn/passing-props-to-a-component) и читайте его напрямую:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

Вот полный пример:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Миграция компонента с состоянием из класса в функцию {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Предположим, вы преобразуете этот классовый компонент `Counter` в функцию:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Начните с объявления функции с необходимыми [переменными состояния:](/reference/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Далее преобразуйте обработчики событий:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Наконец, замените все ссылки, начинающиеся с `this`, на переменные и функции, которые вы определили в своем компоненте. Например, замените `this.state.age` на `age`, а `this.handleNameChange` на `handleNameChange`.

Вот полностью преобразованный компонент:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Миграция компонента с методами жизненного цикла из класса в функцию {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Предположим, вы преобразуете этот классовый компонент `ChatRoom` с методами жизненного цикла в функцию:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Сначала убедитесь, что ваш [`componentWillUnmount`](#componentwillunmount) делает противоположное [`componentDidMount`.](#componentdidmount) В приведенном выше примере это так: он отключает соединение, которое устанавливает `componentDidMount`. Если такая логика отсутствует, добавьте ее сначала.

Затем убедитесь, что ваш метод [`componentDidUpdate`](#componentdidupdate) обрабатывает изменения любых пропсов и состояния, которые вы используете в `componentDidMount`. В приведенном выше примере `componentDidMount` вызывает `setupConnection`, который считывает `this.state.serverUrl` и `this.props.roomId`. Вот почему `componentDidUpdate` проверяет, изменились ли `this.state.serverUrl` и `this.props.roomId`, и сбрасывает соединение, если они изменились. Если логика вашего `componentDidUpdate` отсутствует или не обрабатывает изменения всех соответствующих пропсов и состояния, исправьте это сначала.

В приведенном выше примере логика внутри методов жизненного цикла подключает компонент к системе вне React (сервер чата). Чтобы подключить компонент к внешней системе, [опишите эту логику как один эффект:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

Этот вызов [`useEffect`](/reference/react/useEffect) эквивалентен логике в методах жизненного цикла выше. Если ваши методы жизненного цикла выполняют несколько несвязанных действий, [разделите их на несколько независимых эффектов.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Вот полный пример, с которым вы можете поэкспериментировать:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

Если ваш компонент не синхронизируется с какими-либо внешними системами, [вам может не понадобиться эффект.](/learn/you-might-not-need-an-effect)

</Note>

---

### Миграция компонента с контекстом из класса в функцию {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

В этом примере классовые компоненты `Panel` и `Button` считывают [контекст](/learn/passing-data-deeply-with-context) из [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

При преобразовании их в функциональные компоненты замените `this.context` вызовами [`useContext`](/reference/react/useContext):

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
