---
title: Предупреждение: не вызывайте PropTypes
layout: single
permalink: warnings/dont-call-proptypes.html
---

> Примечание:
>
> С версии React 15.5 `React.PropTypes` были вынесены в отдельный пакет. Так что используйте [библиотеку `prop-types`](https://www.npmjs.com/package/prop-types).
>
> Вы можете использовать [codemod-скрипт](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes), чтобы провести замену в коде на использование этой библиотеки.

В следующем мажорном релизе React, если код использует функции валидации PropType, он будет удалён в продакшене. Как только это случится, любой код, который вызывает эти функции вручную (если он не был удалён в продакшене), будет выдавать ошибку.

### Объявления PropTypes всё ещё работают {#declaring-proptypes-is-still-fine}

Обычное использование PropTypes по-прежнему поддерживается:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

В этом плане ничего не изменилось.

### Не вызвайте PropTypes напрямую {#dont-call-proptypes-directly}

Использование PropTypes вне React-компонентов больше не поддерживается:

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Не поддерживается!
var error = apiShape(json, 'response');
```

Если вы полагаетесь на использование PropTypes, как в показанном выше примере, мы рекомендуем использовать или создать форк PropTypes (по аналогии [этим](https://github.com/aackerman/PropTypes) [двум](https://github.com/developit/proptypes) пакетам).

Если вы не исправите это предупреждение, подобный код нарушит работу приложения при использовании React 16.

### Если вы не вызываете PropTypes напрямую, но по-прежнему получаете предупреждение {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

Посмотрите на стек вызовов, созданный предупреждением. Вы найдёте определение компонента, ответственного за непосредственный вызов PropTypes. Скорее всего, проблема из-за сторонних пакетов, которые используют PropTypes из React, например таким образом:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Вместо текущего пропа используйте `active`'
  )
}
```

В данном случае `ThirdPartyPropTypes.deprecated` -- это обёртка, вызывающая `PropTypes.bool`. В таком паттерне нет ничего плохого, но он приводит к ошибочному появлению предупреждения, поскольку React считает, что PropTypes вызываются напрямую. В следующем разделе показано, как решить такую проблему с библиотекой вроде `ThirdPartyPropTypes`. Если это не ваша библиотека, вы можете создать ишью, чтобы её автор решил проблему с предупреждением.

### Исправление ошибочного срабатывания в сторонних PropTypes {#fixing-the-false-positive-in-third-party-proptypes}

Если вы автор сторонней библиотеки PropTypes и предоставляете пользователям обёртку над встроенными в React PropTypes, они могут увидеть это предупреждение. Это происходит потому, что React не видит последний «секретный» аргумент, который [передаётся](https://github.com/facebook/react/pull/7132), чтобы определять вызовы PropTypes вручную.

А теперь перейдём к тому, как исправить предупреждение. В качестве примера будем использовать `deprecated` из библиотеки [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js). Текущая реализация передаёт только аргументы `props`, `propName` и `componentName`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

Для исправления ошибочного появления предупреждения, убедитесь, что вы передаёте **все** аргументы в обёрнутый PropType. Это легко сделать с помощью ES6-синтаксиса `...rest`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Обратите на ...rest вот тут
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // и вот здесь
  };
}
```

После этого предупреждение больше не будет появляться.
