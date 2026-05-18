---
title: experimental_taintObjectReference
version: experimental
---
<Experimental>

**Этот API является экспериментальным и пока недоступен в стабильной версии React.**

Вы можете попробовать его, обновив пакеты React до последней экспериментальной версии:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Экспериментальные версии React могут содержать ошибки. Не используйте их в продакшене.

Этот API доступен только внутри React Server Components.

</Experimental>


<Intro>

`taintObjectReference` позволяет предотвратить передачу конкретного экземпляра объекта, такого как объект `user`, в Client Component.

```js
experimental_taintObjectReference(message, object);
```

Чтобы предотвратить передачу ключа, хэша или токена, см. [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Вызовите `taintObjectReference` с объектом, чтобы зарегистрировать его в React как нечто, что не должно быть передано Клиенту в неизменном виде:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Не передавайте ВСЕ переменные окружения клиенту.',
  process.env
);
```

[См. больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `message`: Сообщение, которое вы хотите отобразить, если объект будет передан в Client Component. Это сообщение будет частью ошибки, которая будет выброшена, если объект будет передан в Client Component.

* `object`: Объект для пометки. Функции и экземпляры классов могут быть переданы в `taintObjectReference` в качестве `object`. Функции и классы уже заблокированы для передачи в Client Components, но стандартное сообщение об ошибке React будет заменено тем, что вы определили в `message`. Когда конкретный экземпляр Typed Array передается в `taintObjectReference` как `object`, любые другие копии этого Typed Array не будут помечены.

#### Возвращает {/*returns*/}

`experimental_taintObjectReference` возвращает `undefined`.

#### Ограничения {/*caveats*/}

- Воссоздание или клонирование помеченного объекта создает новый непомеченный объект, который может содержать конфиденциальные данные. Например, если у вас есть помеченный объект `user`, `const userInfo = {name: user.name, ssn: user.ssn}` или `{...user}` создадут новые объекты, которые не помечены. `taintObjectReference` защищает только от простых ошибок при передаче объекта в Client Component без изменений.

<Pitfall>

**Не полагайтесь только на пометку для обеспечения безопасности.** Пометка объекта не предотвращает утечку всех возможных производных значений. Например, клон помеченного объекта создаст новый непомеченный объект. Использование данных из помеченного объекта (например, `{secret: taintedObj.secret}`) создаст новое значение или объект, который не помечен. Пометка — это уровень защиты; безопасное приложение будет иметь несколько уровней защиты, хорошо спроектированные API и паттерны изоляции.

</Pitfall>

---

## Использование {/*usage*/}

### Предотвращение непреднамеренной передачи пользовательских данных клиенту {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Client Component никогда не должен принимать объекты, содержащие конфиденциальные данные. В идеале, функции получения данных не должны раскрывать данные, к которым у текущего пользователя не должно быть доступа. Иногда при рефакторинге случаются ошибки. Чтобы защититься от таких ошибок в будущем, мы можем "пометить" объект пользователя в нашем API данных.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Не передавайте весь объект пользователя клиенту. ' +
      'Вместо этого выбирайте конкретные свойства, которые вам нужны для данного случая использования.',
    user,
  );
  return user;
}
```

Теперь, когда кто-либо попытается передать этот объект в Client Component, будет выброшена ошибка с указанным сообщением.

<DeepDive>

#### Защита от утечек при получении данных {/*protecting-against-leaks-in-data-fetching*/}

Если вы используете среду Server Components, имеющую доступ к конфиденциальным данным, вы должны быть осторожны и не передавать объекты напрямую:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // НЕ ДЕЛАЙТЕ ТАК
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

В идеале, `getUser` не должен раскрывать данные, к которым у текущего пользователя не должно быть доступа. Чтобы предотвратить передачу объекта `user` в Client Component далее по цепочке, мы можем "пометить" объект пользователя:


```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Не передавайте весь объект пользователя клиенту. ' +
      'Вместо этого выбирайте конкретные свойства, которые вам нужны для данного случая использования.',
    user,
  );
  return user;
}
```

Теперь, если кто-либо попытается передать объект `user` в Client Component, будет выброшена ошибка с указанным сообщением.

</DeepDive>