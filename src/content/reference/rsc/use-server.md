---
title: "'use server'"
titleForTitleTag: "'use server' directive"
---
<RSC>

`'use server'` используется с [использованием React Server Components](/reference/rsc/server-components).

</RSC>


<Intro>

`'use server'` помечает серверные функции, которые можно вызывать из клиентского кода.

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `'use server'` {/*use-server*/}

Добавьте `'use server'` в начало тела асинхронной функции, чтобы пометить её как доступную для вызова клиентом. Мы называем такие функции [_Server Functions_](/reference/rsc/server-functions).

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

При вызове Server Function с клиента будет выполнен сетевой запрос на сервер, включающий сериализованную копию всех переданных аргументов. Если Server Function возвращает значение, это значение будет сериализовано и возвращено клиенту.

Вместо того чтобы помечать функции по отдельности с помощью `'use server'`, вы можете добавить директиву в начало файла, чтобы пометить все экспорты в этом файле как Server Functions, которые можно использовать где угодно, в том числе импортировать в клиентский код.

#### Ограничения {/*caveats*/}
* `'use server'` должна находиться в самом начале функции или модуля; выше любого другого кода, включая импорты (комментарии перед директивами допустимы). Она должна быть написана в одинарных или двойных кавычках, а не в обратных.
* `'use server'` может использоваться только в серверных файлах. Полученные Server Functions могут быть переданы в Client Components через пропсы. См. поддерживаемые [типы для сериализации](#serializable-parameters-and-return-values).
* Для импорта Server Functions из [клиентского кода](/reference/rsc/use-client) директива должна использоваться на уровне модуля.
* Поскольку базовые сетевые вызовы всегда асинхронны, `'use server'` может использоваться только с асинхронными функциями.
* Всегда относитесь к аргументам Server Functions как к недоверенным входным данным и авторизуйте любые мутации. См. [соображения безопасности](#security).
* Server Functions должны вызываться в [Transition](/reference/react/useTransition). Server Functions, переданные в [`<form action>`](/reference/react-dom/components/form#props) или [`formAction`](/reference/react-dom/components/input#props), будут автоматически вызваны в переходе.
* Server Functions предназначены для мутаций, обновляющих серверное состояние; они не рекомендуются для получения данных. Соответственно, фреймворки, реализующие Server Functions, обычно обрабатывают одно действие за раз и не имеют способа кэшировать возвращаемое значение.

### Соображения безопасности {/*security*/}

Аргументы для Server Functions полностью контролируются клиентом. В целях безопасности всегда относитесь к ним как к недоверенным входным данным и убедитесь, что вы валидируете и экранируете аргументы по мере необходимости.

В любой Server Function убедитесь, что вы проверяете, разрешено ли вошедшему в систему пользователю выполнять это действие.

<Wip>

Чтобы предотвратить отправку конфиденциальных данных из Server Function, существуют экспериментальные API для отслеживания (taint), предотвращающие передачу уникальных значений и объектов в клиентский код.

См. [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) и [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Сериализуемые аргументы и возвращаемые значения {/*serializable-parameters-and-return-values*/}

Поскольку клиентский код вызывает Server Function по сети, любые переданные аргументы должны быть сериализуемыми.

Вот поддерживаемые типы аргументов для Server Functions:

* Примитивы
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), только символы, зарегистрированные в глобальном реестре Symbol через [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Итерируемые объекты, содержащие сериализуемые значения
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) и [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Экземпляры [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* Простые [объекты](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): созданные с помощью [инициализаторов объектов](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), с сериализуемыми свойствами
* Функции, которые являются Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Примечательно, что не поддерживаются:
* React-элементы или [JSX](/learn/writing-markup-with-jsx)
* Функции, включая компонентные функции или любые другие функции, не являющиеся Server Functions
* [Классы](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Объекты, являющиеся экземплярами любого класса (кроме упомянутых встроенных) или объекты с [нулевым прототипом](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Символы, не зарегистрированные глобально, например `Symbol('my new symbol')`
* События от обработчиков событий


Поддерживаемые сериализуемые возвращаемые значения такие же, как [сериализуемые пропсы](/reference/rsc/use-client#passing-props-from-server-to-client-components) для граничного Client Component.


## Использование {/*usage*/}

### Server Functions в формах {/*server-functions-in-forms*/}

Наиболее распространенным сценарием использования Server Functions будет вызов функций, изменяющих данные. В браузере элемент [HTML-формы](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) является традиционным подходом для пользователя для отправки мутации. С React Server Components React вводит первоклассную поддержку Server Functions в качестве Actions в [формах](/reference/react-dom/components/form).

Вот форма, которая позволяет пользователю запросить имя пользователя.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

В этом примере `requestUsername` — это Server Function, переданная в `<form>`. Когда пользователь отправляет эту форму, происходит сетевой запрос к серверной функции `requestUsername`. При вызове Server Function в форме React передаст [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) формы в качестве первого аргумента Server Function.

Передавая Server Function в `action` формы, React может [постепенно улучшать](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) форму. Это означает, что формы могут быть отправлены до загрузки JavaScript-бандла.

#### Обработка возвращаемых значений в формах {/*handling-return-values*/}

В форме запроса имени пользователя может возникнуть ситуация, когда имя пользователя недоступно. `requestUsername` должен сообщить нам, удалось ли это или нет.

Чтобы обновить UI на основе результата Server Function, поддерживая при этом постепенное улучшение, используйте [`useActionState`](/reference/react/useActionState).

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

Обратите внимание, что, как и большинство хуков, `useActionState` можно вызывать только в <CodeStep step={1}>[клиентском коде](/reference/rsc/use-client)</CodeStep>.

### Вызов Server Function вне `<form>` {/*calling-a-server-function-outside-of-form*/}

Server Functions — это серверные конечные точки, и их можно вызывать из любого места в клиентском коде.

При использовании Server Function вне [формы](/reference/react-dom/components/form) вызывайте Server Function в [Transition](/reference/react/useTransition), что позволяет отображать индикатор загрузки, показывать [оптимистичные обновления состояния](/reference/react/useOptimistic) и обрабатывать неожиданные ошибки. Формы автоматически оборачивают Server Functions в переходы.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

Чтобы прочитать возвращаемое значение Server Function, вам нужно будет `await` вернуть обещание.