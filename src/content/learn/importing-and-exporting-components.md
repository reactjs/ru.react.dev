---
title: Импорт и экспорт компонентов
---

<Intro>

«Магия» компонентов заключается в возможности их повторного использования: можно создавать компоненты, которые состоят из других компонентов. Но по мере увеличения их вложенности зачастую бывает разумным начать раскладывать их по разным файлам. Так навигация по ним останется простой, а компоненты станет легче использовать повторно. 

</Intro>

<YouWillLearn>

* Что такое корневой компонент
* Как импортировать и экспортировать компонент
* Когда использовать дефолтные и именованные импорты и экспорты
* Как импортировать и экспортировать несколько компонентов из одного файла
* Как разделять код компонентов на отдельные файлы

</YouWillLearn>

## Файл корневого компонента {/*the-root-component-file*/}

В разделе [Ваш первый компонент](/learn/your-first-component) вы создали компонент `Profile` и компонент `Gallery`, который рендерит его:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Кэтрин Джонсон"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Восхитительные ученые</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Эти компоненты сейчас находятся внутри **файла корневого компонента,** который в примере называется `App.js`. Однако, в зависимости от конфигурации проекта, корневой компонент может находиться в другом файле. У фреймворка с маршрутизацией на основе файлов, например Next.js, корневой компонент будет разным для каждой страницы.

## Экспорт и импорт компонентов {/*exporting-and-importing-a-component*/}

Что, если вы захотите изменить страницу и отобразить на ней список научных книг? Или переместить все профили ученых? Кажется разумным извлечь компоненты `Gallery` и `Profile` из файла корневого компонента. Это сделает их более модульными и переиспользуемыми. Переместить компонент можно за три шага:

1. **Создайте** новый JS файл для компонентов.
2. **Экспортируйте** функциональный компонент из этого файла (используя или  [экспорт по умолчанию](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) или [именованный](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) экспорт).
3. **Импортируйте** компонент в файл, где вы будете его использовать (используя соответствующую технику для импорта значения [по умолчанию](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) или [именованного](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) экспорта).

В следующем примере `Profile` и `Gallery` были извлечены из `App.js` в новый файл `Gallery.js`. Теперь вы можете изменить `App.js`, добавив в него импорт компонента `Gallery` из файла `Gallery.js`:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Харт"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Восхитительные ученые</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Обратите внимание, что код из примера теперь использует два файла компонентов:

1. `Gallery.js`:
     - Содержит компонент `Profile`, который используется только в этом файле и не экспортируется.
     - Экспортирует компонент `Gallery` **по умолчанию.**
2. `App.js`:
     - Импортирует компонент `Gallery` из `Gallery.js` **по умолчанию.**
     - Экспортирует корневой компонент `App` **по умолчанию.**


<Note>

В некоторых случаях вы можете заметить, что при импорте в именах файлов опускается расширение `.js`, например:

```js 
import Gallery from './Gallery';
```

Оба варианта (`'./Gallery.js'` и `'./Gallery'`) будут работать в React, хотя первый вариант ближе к тому, как работают [нативные ES-модули](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules).

</Note>

<DeepDive>

#### Экспорт по умолчанию и именованный экспорт {/*default-vs-named-exports*/}

Существует два основных способа экспорта значений в JavaScript: экспорт по умолчанию и именованный экспорт. До сих пор в примерах использовался только экспорт по умолчанию. Но вы можете использовать один из этих способов или оба в одном файле. **В файле не может быть больше одного экспорта _по умолчанию_, но сколько угодно _именованных_ экспортов.**

![Именованные экспорты и экспорты по умолчанию](/images/docs/illustrations/i_import-export.svg)

Способ, которым компонент был экспортирован, определяет способ, которым его нужно импортировать. Вы получите ошибку, если попытаетесь импортировать экспортированный по умолчанию компонент так же, как компонент с именованным экспортом! Эта таблица поможет вам разобраться:

| Синтаксис экспорта         | Как экспортировать                           | Как импортировать                          |
| -----------      | -----------                                | -----------                               |
| По умолчанию  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Именованный    | `export function Button() {}`         | `import { Button } from './Button.js';` |

При использовании импорта _по умолчанию_ можно использовать любое имя после слова `import`. Например, можно написать `import Banana from './Button.js'`, и эта запись все еще будет корректно импортировать значение по умолчанию. При использовании именованных импортов, напротив, значения должны совпадать в обоих файлах. Именно поэтому такие импорты называются _именованными_.

**Разработчики часто используют экспорт по умолчанию, если файл экспортирует только один компонент, и именованный экспорт, если он экспортирует несколько компонентов и значений.** Независимо от того, какой стиль написания кода вы предпочитаете, всегда давайте осмысленные имена вашим функциональным компонентам и файлам, которые их содержат. Не рекомендуется использовать компоненты без имен, такие как `export default () => {}`, поскольку это затрудняет отладку.


</DeepDive>

## Экспорт и импорт нескольких компонентов из одного файла {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Что, если вы хотите показывать только один компонент `Profile` вместо всей галереи? Компонент `Profile` тоже можно экспортировать. Но в файле `Gallery.js` уже есть экспорт *по умолчанию*, а в одном файле не может быть _двух_ экспортов по умолчанию. Вы можете создать новый файл с экспортом по умолчанию или добавить *именованный* экспорт для компонента `Profile`. **В файле может быть только один экспорт по умолчанию, но несколько именованных экспортов!**

<Note>

Чтобы избежать потенциальной путаницы между дефолтными и именованными экспортами, некоторые команды предпочитают придерживаться только одного стиля (экспорт по умолчанию или именованный) или не смешивать их в одном файле. Делайте то, что подходит именно вам!

</Note>

Сначала **экспортируйте** `Profile` из `Gallery.js`, используя именованный экспорт (без использования ключевого слова `default`):

```js
export function Profile() {
  // ...
}
```

Затем **импортируйте** `Profile` из `Gallery.js` в `App.js`, используя именованный импорт (с фигурными скобками):

```js
import { Profile } from './Gallery.js';
```

Теперь вы можете **отрендерить** `<Profile />` из компонента `App`:

```js
export default function App() {
  return <Profile />;
}
```

Теперь `Gallery.js` содержит два экспорта: экспорт по умолчанию `Gallery` и именованный экспорт `Profile`. `App.js` импортирует их оба. Попробуйте изменить `<Profile />` на `<Gallery />` и обратно в этом примере:
<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Харт"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Восхитительные ученые</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Теперь вы используете как именованные экспорты, так и экспорты по умолчанию:

* `Gallery.js`:
  - Экспортирует компонент `Profile` как **именованный экспорт `Profile`.**
  - Экспортирует компонент `Gallery`  **по умолчанию.**
* `App.js`:
  - Импортирует компонент `Profile` как **именованный импорт `Profile`** из файла `Gallery.js`.
  - Импортирует компонент `Gallery` как **экспорт по умолчанию** из файла `Gallery.js`.
  - Экспортирует корневой компонент `App` **по умолчанию.**

<Recap>

В этом разделе вы узнали:

* Что такое корневой компонент
* Как импортировать и экспортировать компонент
* Когда использовать дефолтные и именованные импорты и экспорты
* Как экспортировать несколько компонентов из одного файла

</Recap>



<Challenges>

#### Дальнейшее разделение компонентов {/*split-the-components-further*/}

Сейчас файл `Gallery.js` экспортирует два компонента (`Profile` и `Gallery`), что может немного сбивать с толку.

Переместите компонент `Profile` в отдельный файл `Profile.js`, и затем изменить компонент `App` так, чтобы в нем друг за другом рендерились компоненты `<Profile />` и `<Gallery />`.

Вы можете использовать либо экспорт по умолчанию, либо именованный экспорт для `Profile`, но убедитесь, что вы используете соответствующий синтаксис импорта как в `App.js`, так и в `Gallery.js`! Вы можете свериться с этой таблицей:

| Синтаксис экспорта          | Как экспортировать                           | Как импортировать                          |
| -----------      | -----------                                | -----------                               |
| По умолчанию  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Именованный    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Не забывайте импортировать компоненты там, где они используются. `Gallery` тоже использует `Profile`, не так ли?
</Hint>

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

<<<<<<< HEAD
```js Gallery.js active
// Перемести меня в Profile.js!
=======
```js src/Gallery.js active
// Move me to Profile.js!
>>>>>>> 303ecae3dd4c7b570cf18e0115b94188f6aad5a1
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Харт"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Восхитительные ученые</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

После того, как вы выполните это задание с использованием одного из типов экспорта, выполните его с использованием другого типа. 

<Solution>

Вот решение, использующее именованные экспорты:
<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Восхитительные ученые</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Харт"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Вот решение, использующее экспорты по умолчанию:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Восхитительные ученые</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Алан Л. Харт"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
