---
title: experimental_taintUniqueValue
version: experimental
---

<Experimental>

**Этот API является экспериментальным и пока недоступен в стабильной версии React.**

Вы можете попробовать его, обновив пакеты React до последней экспериментальной версии:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Экспериментальные версии React могут содержать ошибки. Не используйте их в продакшене.

Этот API доступен только внутри [React Server Components](/reference/rsc/use-client).

</Experimental>


<Intro>

`taintUniqueValue` позволяет предотвратить передачу уникальных значений, таких как пароли, ключи или токены, в компоненты клиента.

```js
taintUniqueValue(errMessage, lifetime, value)
```

Чтобы предотвратить передачу объекта, содержащего конфиденциальные данные, см. [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Вызовите `taintUniqueValue` с паролем, токеном, ключом или хешем, чтобы зарегистрировать его в React как нечто, что не должно быть передано клиенту в исходном виде:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Не передавайте секретные ключи клиенту.',
  process,
  process.env.SECRET_KEY
);
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `message`: Сообщение, которое вы хотите отобразить, если `value` будет передано в компонент клиента. Это сообщение будет отображено как часть ошибки, которая будет выброшена, если `value` будет передано в компонент клиента.

* `lifetime`: Любой объект, указывающий, как долго `value` будет помечено как "tainted" (скомпрометированное). `value` будет заблокировано от отправки в любой компонент клиента, пока этот объект существует. Например, передача `globalThis` блокирует значение на время жизни приложения. `lifetime` обычно является объектом, свойства которого содержат `value`.

* `value`: Строка, bigint или TypedArray. `value` должно быть уникальной последовательностью символов или байтов с высокой энтропией, такой как криптографический токен, закрытый ключ, хеш или длинный пароль. `value` будет заблокировано от отправки в любой компонент клиента.

#### Возвращает {/*returns*/}

`experimental_taintUniqueValue` возвращает `undefined`.

#### Оговорки {/*caveats*/}

* Получение новых значений из "tainted" значений может скомпрометировать защиту "tainting". Новые значения, созданные путем преобразования "tainted" значений в верхний регистр, объединения "tainted" строковых значений в более крупную строку, преобразования "tainted" значений в base64, извлечения подстроки из "tainted" значений и других подобных преобразований, не будут "tainted", если вы явно не вызовете `taintUniqueValue` для этих вновь созданных значений.
* Не используйте `taintUniqueValue` для защиты значений с низкой энтропией, таких как PIN-коды или номера телефонов. Если любое значение в запросе контролируется злоумышленником, он может вывести, какое значение "tainted", перечисляя все возможные значения секрета.

---

## Использование {/*usage*/}

### Предотвращение передачи токена в компоненты клиента {/*prevent-a-token-from-being-passed-to-client-components*/}

Чтобы гарантировать, что конфиденциальная информация, такая как пароли, токены сеанса или другие уникальные значения, случайно не передается в компоненты клиента, функция `taintUniqueValue` обеспечивает уровень защиты. Когда значение помечено как "tainted", любая попытка передать его в компонент клиента приведет к ошибке.

Аргумент `lifetime` определяет продолжительность, в течение которой значение остается "tainted". Для значений, которые должны оставаться "tainted" бессрочно, в качестве аргумента `lifetime` могут выступать такие объекты, как [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) или `process`. Эти объекты имеют жизненный цикл, охватывающий все время выполнения вашего приложения.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Не передавайте пароль пользователя клиенту.',
  globalThis,
  process.env.SECRET_KEY
);
```

Если жизненный цикл "tainted" значения связан с объектом, `lifetime` должен быть объектом, который инкапсулирует это значение. Это гарантирует, что "tainted" значение останется защищенным в течение всего жизненного цикла инкапсулирующего объекта.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Не передавайте токен сеанса пользователя клиенту.',
    user,
    user.session.token
  );
  return user;
}
```

В этом примере объект `user` выступает в качестве аргумента `lifetime`. Если этот объект будет сохранен в глобальном кеше или будет доступен другому запросу, токен сеанса останется "tainted".

<Pitfall>

**Не полагайтесь исключительно на "tainting" для безопасности.** Пометка значения как "tainted" не блокирует все возможные производные значения. Например, создание нового значения путем преобразования "tainted" строки в верхний регистр не сделает новое значение "tainted".


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Не передавайте пароль клиенту.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` не помечен как "tainted"
```

В этом примере константа `password` помечена как "tainted". Затем `password` используется для создания нового значения `uppercasePassword` путем вызова метода `toUpperCase` для `password`. Вновь созданное значение `uppercasePassword` не помечено как "tainted".

Другие аналогичные способы получения новых значений из "tainted" значений, такие как объединение их в более крупную строку, преобразование в base64 или возврат подстроки, создают не "tainted" значения.

"Tainting" защищает только от простых ошибок, таких как явная передача секретных значений клиенту. Ошибки при вызове `taintUniqueValue`, такие как использование глобального хранилища вне React, без соответствующего объекта жизненного цикла, могут привести к тому, что "tainted" значение станет не "tainted". "Tainting" — это уровень защиты; безопасное приложение будет иметь несколько уровней защиты, хорошо спроектированные API и шаблоны изоляции.

</Pitfall>

<DeepDive>

#### Использование `server-only` и `taintUniqueValue` для предотвращения утечки секретов {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

Если вы используете среду Server Components, имеющую доступ к закрытым ключам или паролям, таким как пароли баз данных, вы должны быть осторожны, чтобы не передавать их в Client Component.

```js
export async function Dashboard(props) {
  // НЕ ДЕЛАЙТЕ ЭТОГО
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

Этот пример приведет к утечке секретного API-токена клиенту. Если этот API-токен может быть использован для доступа к данным, к которым данный пользователь не должен иметь доступа, это может привести к утечке данных.

[comment]: <> (TODO: Добавить ссылку на документацию `server-only`, как только она будет написана)

В идеале, такие секреты должны быть абстрагированы в отдельный вспомогательный файл, который может быть импортирован только доверенными утилитами данных на сервере. Вспомогательный файл может быть даже помечен как [`server-only`](https://www.npmjs.com/package/server-only), чтобы гарантировать, что этот файл не будет импортирован на клиенте.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

Иногда при рефакторинге случаются ошибки, и не все ваши коллеги могут знать об этом.
Чтобы защититься от таких ошибок в будущем, мы можем "пометить" фактический пароль:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Не передавайте пароль API-токена клиенту. ' +
    'Вместо этого выполняйте все запросы на сервере.'
  process,
  process.env.API_PASSWORD
);
```

Теперь, когда кто-либо попытается передать этот пароль в Client Component или отправить пароль в Client Component с помощью Server Function, будет выброшена ошибка с сообщением, которое вы определили при вызове `taintUniqueValue`.

</DeepDive>

---