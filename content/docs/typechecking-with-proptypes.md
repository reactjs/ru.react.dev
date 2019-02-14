---
id: typechecking-with-proptypes
title: Проверка типов с помощью PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Примечание:
>
> С версии React 15.5 `React.PropTypes` были вынесены в отдельный пакет. Так что используйте [библиотеку `prop-types`](https://www.npmjs.com/package/prop-types).
>
> Вы можете использовать [codemod-скрипт](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes), чтобы провести замену в коде на использование этой библиотеки.

По мере роста вашего приложения вы можете отловить много ошибок с помощью проверки типов. Для этого можно использовать расширения JavaScript вроде [Flow](https://flow.org/) и [TypeScript](https://www.typescriptlang.org/). Но, даже если вы ими не пользуетесь, React предоставляет встроенные возможности для проверки типов. Для запуска этой проверки на пропсах компонента вам нужно использовать специальное свойство `propTypes`:

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Привет, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

`PropTypes` предоставляет ряд валидаторов, которые могут могут использоваться для проверки, что получаемые данные валидны. В примере мы использовали `PropTypes.string`. Когда какое-то свойство имеет некорректное значение, в консоли будет выведено предупреждение. По соображениям производительности `propTypes` проверяются только в режиме разработки.

### PropTypes {#proptypes}

Пример использования возможных валидаторов:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // Можно объявить проп на соответствиее определённому JS-типу.
  // По умолчанию это не обязательно.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Все, что может быть отренедерено:
  // числа, строки, элементы или массивы
  // (или фрагменты) содержащие эти типы
  optionalNode: PropTypes.node,

  // React-элемент
  optionalElement: PropTypes.element,

  // Можно указать, что проп должен быть экземпляром класса
  // Это будет использовать проверку с `instanceof`
  optionalMessage: PropTypes.instanceOf(Message),

  // Вы можете задать ограничение конкретными значениями
  // при помощи перечисления
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // Объект, одного из нескольких типов
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // Массив объектов конкретного типа
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // Объект со свойствами конкретного типа
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // Объект, подходящий под маску
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // Можно добавить`isRequired` к любому из приведённому выше типу,
  // чтобы показывать предупреждение,
  // если свойство не передано
  requiredFunc: PropTypes.func.isRequired,

  // Значене любого типа
  requiredAny: PropTypes.any.isRequired,

  // Можно добавить собственный валидатор.
  // Он должен возращать объект `Error` при ошибке валидации.
  // Не используйте `console.warn` или `throw` 
  // - это не будет работать внутри `oneOfType`
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Проп `' + propName + '` компонента' +
        ' `' + componentName + '` имеет неправильное значение'
      );
    }
  },

  // Можно задать свой валидатор для `arrayOf` и `objectOf`.
  // Он должен возвращать объект Error при ошибке валидации.
  // Валидатор будет вызван для каждого элемента в массиве
  // или для каждого свойства объекта.
  // Первые два параметра валидатора 
  // - это массив или объект и ключ текущего элемента
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Проп `' + propFullName + '` компонента' +
        ' `' + componentName + '` имеет неправильное значение'
      );
    }
  })
};
```

### Ограничение на один дочерний компонент {#requiring-single-child}

С помощью `PropTypes.element` вы можете указать, что в качестве дочернего может быть передан только один элемент.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // Это должен быть ровно один элемент.
    // Иначе вы увидете предупреждение
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Значения свойств по умолчанию {#default-prop-values}

Вы можете задать значения по умолчанию для ваших `props` с помощью специального свойства `defaultProps`:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Привет, {this.props.name}</h1>
    );
  }
}

// Задание значений по умолчанию для пропсов:
Greeting.defaultProps = {
  name: 'Незнакомец'
};

// Отрисует "Привет, Незнакомец":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

Если вы используете один из Babel-плагинов по преобразованию кода, вроде [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/), то можете объявить `defaultProps` как статическое свойство класса (для компонента-наследника от `React.Component`). Этот синтаксис еще не утвержден, так что для его работы в браузере нужна компиляция. Подробнее смотрите в [предложении о полях класса](https://github.com/tc39/proposal-class-fields).

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'незнакомец'
  }

  render() {
    return (
      <div>Привет, {this.props.name}</div>
    )
  }
}
```

Определение `defaultProps` может быть использовано, чтобы гарантировать, что `this.props.name` имеет значение, даже если оно не было задано из родительского компонента. Сначала применяются значения по умолчанию, заданные в `defaultProps`. После этого запускается проверка типов с помощью `propTypes`. Так что валидация типов распространяется и на значения по умолчанию.
