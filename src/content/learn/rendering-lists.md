---
title: Рендер списков
---

<Intro>

Часто возникает необходимость отображения ряда схожих компонентов на основе набора данных. Для этого можно воспользоваться [методами массивов JavaScript](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array) для манипулирования массивом данных. На этой странице вы будете использовать [`filter()`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) и [`map()`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/map) с React для фильтрации и преобразования массива данных в массив компонентов.

</Intro>

<YouWillLearn>

* Как рендерить компоненты из массива, используя `map()`
* Как рендерить только определенные компоненты, используя `filter()`
* Когда и зачем использовать React ключи

</YouWillLearn>

## Рендер данных из массивов {/*rendering-data-from-arrays*/}

Предположим, у вас есть список контента.

```js
<ul>
  <li>Креола Кэтрин Джонсон (Creola Katherine Johnson): математик</li>
  <li>Марио Молина (Mario José Molina-Pasquel Henríquez): химик</li>
  <li>Мухаммад Абдус Салам (Mohammad Abdus Salam): физик</li>
  <li>Перси Джулиан (Percy Lavon Julian): химик</li>
  <li>Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar): астрофизик</li>
</ul>
```

Единственная разница между этими элементами списка - их содержимое, их данные. При построении интерфейсов вам часто нужно показывать несколько экземпляров одного и того же компонента, используя различные данные: от списков комментариев до галерей профилей. В таких ситуациях вы можете хранить эти данные в объектах и массивах JavaScript и использовать методы, такие как [`map()`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/map) и [`filter()`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), чтобы рендерить списки компонентов с данными из них.

Вот короткий пример того, как сгенерировать список элементов из массива:

1. **Переместите** данные в массив:

```js
const people = [
  'Креола Кэтрин Джонсон (Creola Katherine Johnson): математик',
  'Марио Молина (Mario José Molina-Pasquel Henríquez): химик',
  'Мухаммад Абдус Салам (Mohammad Abdus Salam): физик',
  'Перси Джулиан (Percy Lavon Julian): химик',
  'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar): астрофизик'
];
```

2. **Преобразуйте** элементы массива `people` в новый массив JSX-узлов, `listItems`, используя метод `map()`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Верните** `listItems` из вашего компонента, обернув их в тег `<ul>`:

```js
return <ul>{listItems}</ul>;
```

Вот что должно получиться в итоге:

<Sandpack>

```js
const people = [
  'Креола Кэтрин Джонсон (Creola Katherine Johnson): математик',
  'Марио Молина (Mario José Molina-Pasquel Henríquez): химик',
  'Мухаммад Абдус Салам (Mohammad Abdus Salam): физик',
  'Перси Джулиан (Percy Lavon Julian): химик',
  'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar): астрофизик'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Обратите внимание, что в консоли песочницы отображается ошибка:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Вы узнаете о том, как исправить эту ошибку позже на этой странице. Прежде чем перейти к этому, давайте добавим некоторую структуру к данным.

## Фильтрация массивов элементов {/*filtering-arrays-of-items*/}

Структуру этих данных можно улучшить.

```js
const people = [{
  id: 0,
  name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
}, {
  id: 1,
  name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
  profession: 'химик',
}, {
  id: 2,
  name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
  profession: 'физик',
}, {
  name: 'Перси Джулиан (Percy Lavon Julian)',
  profession: 'химик',  
}, {
  name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофизик',
}];
```

Допустим, вам нужен способ отображать только людей, чья профессия `'химик'`. Вы можете использовать метод JavaScript `filter()` чтобы вернуть только этих людей. Этот метод принимает массив элементов, пропускает их через «тест» (функция, которая возвращает `true` или `false`) и возвращает новый массив только из тех элементов, которые прошли тест (вернули `true`).

В нашем случае мы хотим отобразить только те элементы, где `profession` является `'химик'`. «Тест» для этого выглядит так: `(person) => person.profession === 'химик'`. Вот как собрать все воедино:

1. **Создайте** новый массив только из людей с профессией `'chemist'`, вызвав `filter()` на `people` для фильтрации по `person.profession === 'химик'`:

```js
const chemists = people.filter(person =>
  person.profession === 'химик'
);
```

2. Теперь **преобразуйте** элементы массива `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}. 
       Достижение: {person.accomplishment}
     </p>
  </li>
);
```

3. Наконец, **верните** `listItems` из вашего компонента:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'химик'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}. 
        Достижение:  {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'расчёты для космических полетов',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
  profession: 'химик',
  accomplishment: 'обнаружение дыр в озоновом слое',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
  profession: 'физик',
  accomplishment: 'открытие теории электромагнетизма',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Перси Джулиан (Percy Lavon Julian)',
  profession: 'химик',
  accomplishment: 'изобретение препаратов с кортизоном, стероидов и противозачаточных таблеток',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофизик',
  accomplishment: 'расчёт массы белого карлика',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Стрелочные функции неявно возвращают результат выражения сразу после `=>`, поэтому использовать ключевое слово `return` не нужно:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Неявный возврат!
);
```

Однако, **вы должны явно вызвать `return`, если после `=>` следует фигурная скобка!**


```js
const listItems = chemists.map(person => { // Фигурная скобка
  return <li>...</li>;
});
```

Стрелочные функции, содержащие `=> {` считаются функциями с ["блочной формой".](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/Arrow_functions#%D1%82%D0%B5%D0%BB%D0%BE_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8) Они позволяют писать более одной строки кода, но при этом *необходимо* явно вызвать `return`. Если вы забудете это сделать, функция ничего не вернет!

</Pitfall>

## Сохранение порядка элементов списка с помощью `key` {/*keeping-list-items-in-order-with-key*/}

Заметьте, что все песочницы выше показывают ошибку в консоли:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Чтобы решить эту ошибку необходимо присвоить каждому элементу массива ключ (`key`) -- строку или число, которое уникально отличает данный элемент среди других элементов этого массива:

```js
<li key={person.id}>...</li>
```

<Note>

JSX элементы, созданные внутри `map()` всегда должны иметь ключи!

</Note>

Ключи позволяют React узнать к какому элементу массива соответствует каждый компонент, чтобы позже сопоставить их. Это важно, если элементы массива могут перемещаться (например, из-за сортировки), добавляться или удаляться. Хорошо выбранный ключ помогает React понять, какое именно изменение произошло, и правильно обновить DOM дерево.

Вместо генерации ключей на лету, вы должны включать их в свои данные:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}. 
          Достижение: {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Используется в JSX в качестве ключа
  name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'расчёты для космических полетов',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Используется в JSX в качестве ключа
  name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
  profession: 'химик',
  accomplishment: 'обнаружение дыр в озоновом слое',
  imageId: 'mynHUSa'
}, {
  id: 2, // Используется в JSX в качестве ключа
  name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
  profession: 'физик',
  accomplishment: 'открытие теории электромагнетизма',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Используется в JSX в качестве ключа
  name: 'Перси Джулиан (Percy Lavon Julian)',
  profession: 'химик',
  accomplishment: 'изобретение препаратов с кортизоном, стероидов и противозачаточных таблеток',
  imageId: 'IOjWm71'
}, {
  id: 4, // Используется в JSX в качестве ключа
  name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофизик',
  accomplishment: 'расчёт массы белого карлика',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Отображение нескольких DOM узлов для каждого элемента списка {/*displaying-several-dom-nodes-for-each-list-item*/}

Как поступить, если каждый элемент должен отображать не один, а несколько DOM узлов?

Краткий синтаксис [`<>...</>` фрагмента](/reference/react/Fragment) не позволяет передавать ключ, поэтому вам нужно либо объединить их в один `<div>`, либо использовать чуть более длинный и [более явный `<Fragment>`:](/reference/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Фрагменты исчезают из DOM, поэтому это приведет к плоскому списку элементов `<h1>`, `<p>`, `<h1>`, `<p>`, и т.д.

</DeepDive>

### Откуда взять ключ {/*where-to-get-your-key*/}

Разные источники данных предоставляют разные источники для ключей:

* **Данные из базы данных:** Если ваши данные приходят с базы данных, то вы можете использовать ключи/ID с базы данных, которые по своей природе уникальны.

* **Локальные данные:** Если ваши данные генерируются и хранятся локально (к примеру, заметки в приложении для ведений заметок), используйте инкрементный счетчик, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) или пакет [`uuid`](https://www.npmjs.com/package/uuid) при создании элементов.

### Правила ключей {/*rules-of-keys*/}

* **Ключи должны быть уникальны среди своих соседних элементов.** Однако, можно использовать одинаковые ключи для JSX-узлов в _разных_ массивах.
* **Ключи не должны меняться**, так как это лишает их смысла! Не генерируйте их во время рендеринга.

### Почему React нужны ключи? {/*why-does-react-need-keys*/}

Представьте что у файлов на вашем рабочем столе не было бы имен. Взамен, вы бы ссылались на них по их порядку -- первый файл, второй файл, и т.д. Возможно к этому и можно привыкнуть, но когда вы удалите какой-либо файл, порядок изменится и все станет запутанным. Второй файл станет первым, третий файл станет вторым, и т. д.

Названия файлов в папке и JSX ключи в массиве имеют схожую цель. Они позволяют нам отличать элементы от их других элементов в массиве. А хорошо выбранный ключ предоставляет больше информации, чем позиция в массиве. Даже если _позиция_ изменится из-за смены порядка, `key` позволит React идентифицировать элемент на протяжении всего существования элемента.

<Pitfall>

Возможно вам захочется использовать индекс элемента в массиве в качестве ключа. В действительности, это то, что React будет использовать, если вы не укажете `key`. Но порядок, в котором вы рендерите элементы, может поменяться со временем, если какой-либо элемент будет вставлен, удален или если массив будет переупорядочен. Индекс в качестве ключа часто приводит к коварным и сбивающим с толку ошибкам.

Аналогично, не генерируйте ключи на лету, например, с помощью `key={Math.random()}`. Это приведет к тому, что ключи никогда не будут совпадать между рендерами, что приведет к пересозданию всех ваших компонентов и DOM при каждом рендере. Это не только медленно, но также приведет к потере любых данных введённых пользователем внутри элементов списка. Вместо этого используйте стабильный ID, основанный на данных.

Заметьте, что ваши компоненты не получат `key` в качестве пропа. Он используется только как подсказка для React. Если ваш компонент нуждается в ID, вы должны передать его как отдельный проп: `<Profile key={id} userId={id} />`..

</Pitfall>

<Recap>

На этой странице вы узнали:

* Как перенести данные из компонентов в структуры данных, такие как массивы и объекты.
* Как создавать коллекции схожих компонентов с помощью JavaScript `map()`. 
* Как создавать массивы отфильтрованных элементов с помощью JavaScript `filter()`.
* Зачем и как присваивать ключ каждому компоненту в коллекции, чтобы React мог отслеживать изменения каждого из них.

</Recap>



<Challenges>

#### Разделение списка на два {/*splitting-a-list-in-two*/}

Этот пример показывает список всех людей в `people`.

Поменяйте код так, чтобы он показывал два списка один за другим: **Химики** и **Все остальные**. Как и раньше, вы можете определить, является ли человек химиком, проверив `person.profession === 'химик'`.

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        Достижение: {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Ученые</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'расчёты для космических полетов',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
  profession: 'химик',
  accomplishment: 'обнаружение дыр в озоновом слое',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
  profession: 'физик',
  accomplishment: 'открытие теории электромагнетизма',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Перси Джулиан (Percy Lavon Julian)',
  profession: 'химик',
  accomplishment: 'изобретение препаратов с кортизоном, стероидов и противозачаточных таблеток',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофизик',
  accomplishment: 'расчёт массы белого карлика',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Вы можете использовать `filter()` дважды, создав два отдельных массива, а затем использовать `map()` на обоих:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'химик'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'химик'
  );
  return (
    <article>
      <h1>Ученые</h1>
      <h2>Химики</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}. 
              Достижение: {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Все остальные</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}. 
              Достижение: {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'расчёты для космических полетов',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
  profession: 'химик',
  accomplishment: 'обнаружение дыр в озоновом слое',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
  profession: 'физик',
  accomplishment: 'открытие теории электромагнетизма',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Перси Джулиан (Percy Lavon Julian)',
  profession: 'химик',
  accomplishment: 'изобретение препаратов с кортизоном, стероидов и противозачаточных таблеток',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофизик',
  accomplishment: 'расчёт массы белого карлика',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

В данном решении, вызовы `map` помещены непосредственно в родительские элементы `<ul>`, но вы можете вынести их в отдельные переменные, если cчитаете это более читабельным.

Между отображаемыми списками все еще существует небольшое дублирование. Вы можете пойти дальше и извлечь повторяющиеся части в компонент `<ListSection>`:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}.
              Достижение: {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'химик'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'химик'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Химики"
        people={chemists}
      />
      <ListSection
        title="Все остальные"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'расчёты для космических полетов',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
  profession: 'химик',
  accomplishment: 'обнаружение дыр в озоновом слое',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
  profession: 'физик',
  accomplishment: 'открытие теории электромагнетизма',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Перси Джулиан (Percy Lavon Julian)',
  profession: 'химик',
  accomplishment: 'изобретение препаратов с кортизоном, стероидов и противозачаточных таблеток',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофизик',
  accomplishment: 'расчёт массы белого карлика',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Очень внимательный читатель мог бы заметить, что при двух вызовах `filter` мы дважды проверяем профессию каждого человека. Проверка свойства происходит очень быстро, поэтому в данном примере это нормально. Если бы ваша логика была более затратна, вы могли бы заменить вызовы `filter` на цикл, который вручную создает массивы и проверяет каждого человека один раз.

К тому же, если `people` никогда не меняется, вы можете вынести этот код из вашего компонента. С точки зрения React, единственное что имеет значение, это то, что вы предоставляете массив JSX-узлов в конце. React не важно, как вы создаете этот массив:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'химик') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}. 
              Достижение: {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Химики"
        people={chemists}
      />
      <ListSection
        title="Все остальные"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Креола Кэтрин Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'расчёты для космических полетов',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Марио Молина (Mario José Molina-Pasquel Henríquez)',
  profession: 'химик',
  accomplishment: 'обнаружение дыр в озоновом слое',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Мухаммад Абдус Салам (Mohammad Abdus Salam)',
  profession: 'физик',
  accomplishment: 'открытие теории электромагнетизма',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Перси Джулиан (Percy Lavon Julian)',
  profession: 'химик',
  accomplishment: 'изобретение препаратов с кортизоном, стероидов и противозачаточных таблеток',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субраманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофизик',
  accomplishment: 'расчёт массы белого карлика',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Вложенные списки в одном компоненте {/*nested-lists-in-one-component*/}

Создайте список рецептов из данного массива! Для каждого рецепта в массиве отобразите название внутри `<h2>` и перечислите ингредиенты в `<ul>`.

<Hint>

Для этого потребуется вложение двух разных вызовов `map`.

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Греческий салат',
  ingredients: ['помидоры', 'огурец', 'лук', 'оливки', 'сыр фета']
}, {
  id: 'hawaiian-pizza',
  name: 'Гавайская пицца',
  ingredients: ['тесто для пиццы', 'соус для пиццы', 'моцарелла', 'ветчина', 'ананас']
}, {
  id: 'hummus',
  name: 'Хумус',
  ingredients: ['нут', 'оливковое масло', 'зубчики чеснока', 'лимон', 'тахини']
}];
```

</Sandpack>

<Solution>

Вот один из способов, как вы можете это сделать:

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Рецепты</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Греческий салат',
  ingredients: ['помидоры', 'огурец', 'лук', 'оливки', 'сыр фета']
}, {
  id: 'hawaiian-pizza',
  name: 'Гавайская пицца',
  ingredients: ['тесто для пиццы', 'соус для пиццы', 'моцарелла', 'ветчина', 'ананас']
}, {
  id: 'hummus',
  name: 'Хумус',
  ingredients: ['нут', 'оливковое масло', 'зубчики чеснока', 'лимон', 'тахини']
}];
```

</Sandpack>

Каждый из рецептов уже содержит поле `id`, поэтому это и используется внешним циклом в качестве ключа. Нет ID, который можно было бы использовать для перебора ингредиентов. Однако разумно предположить, что один и тот же ингредиент не будет перечислен дважды в одном рецепте, поэтому его имя может служить в качестве ключа. Как вариант, вы можете изменить структуру данных, чтобы добавить ID, или же использовать индекс в качестве ключа (с оговоркой, что вы не можете безопасно изменять порядок ингредиентов).

</Solution>

#### Извлечение компонента элемента списка {/*extracting-a-list-item-component*/}

Компонент `RecipeList` содержит два вложенных вызова map. Чтобы упростить его, извлеките компонент `Recipe`, который будет принимать пропсы `id`, `name` и `ingredients`. Где вы разместите внешний `key` и почему?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Рецепты</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Греческий салат',
  ingredients: ['помидоры', 'огурец', 'лук', 'оливки', 'сыр фета']
}, {
  id: 'hawaiian-pizza',
  name: 'Гавайская пицца',
  ingredients: ['тесто для пиццы', 'соус для пиццы', 'моцарелла', 'ветчина', 'ананас']
}, {
  id: 'hummus',
  name: 'Хумус',
  ingredients: ['нут', 'оливковое масло', 'зубчики чеснока', 'лимон', 'тахини']
}];
```

</Sandpack>

<Solution>


Вы можете скопировать и вставить JSX из внешнего вызова map в новый компонент `Recipe` и вернуть этот JSX. Затем вы можете изменить `recipe.name` на `name`, `recipe.id` на `id` и т.д., и передать их в виде пропсов компоненту `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Рецепты</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Греческий салат',
  ingredients: ['помидоры', 'огурец', 'лук', 'оливки', 'сыр фета']
}, {
  id: 'hawaiian-pizza',
  name: 'Гавайская пицца',
  ingredients: ['тесто для пиццы', 'соус для пиццы', 'моцарелла', 'ветчина', 'ананас']
}, {
  id: 'hummus',
  name: 'Хумус',
  ingredients: ['нут', 'оливковое масло', 'зубчики чеснока', 'лимон', 'тахини']
}];
```

</Sandpack>

Здесь `<Recipe {...recipe} key={recipe.id} />` -- это сокращенный синтаксис, означающий "передайте все свойства объекта `recipe` как пропсы в компонент `Recipe`". Вы также можете явно задать каждый проп: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Обратите внимание, что `key` указывается на самом компоненте `<Recipe>`, а не на корневом `<div>`, возвращаемом из `Recipe`.** Всё потому, что этот `key` необходим непосредственно в контексте окружающего массива. Ранее у вас был массив `<div>`, поэтому каждому из них требовался ключ, но теперь у вас есть массив `<Recipe>`. Другими словами, когда вы извлекаете компонент, не забудьте оставить ключ за пределами JSX, который вы копируете и вставляете.

</Solution>

#### Список с разделителем {/*list-with-a-separator*/}

Данный пример рендерит известное хокку Кацусики Хокусая, каждая строка обернута в тег `<p>`. Ваша задача -- вставить разделитель `<hr />` между каждым параграфом. Ваша структура должна выглядеть так:

```js
<article>
  <p>Я пишу, стираю, переписываю,</p>
  <hr />
  <p>Снова стереть, а затем</p>
  <hr />
  <p>Цветет мак.</p>
</article>
```

Хокку содержит только три строки, но ваше решение должно работать с любым количеством строк. Обратите внимание, что элементы `<hr />` должны быть *между* элементами `<p>`, а не в начале или в конце!

<Sandpack>

```js
const poem = {
  lines: [
    'Я пишу, стираю, переписываю,',
    'Снова стереть, а затем',
    'Цветет мак.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Это один из редких случаев когда можно использовать индекс в качестве ключа, потому что строки стихотворения никогда не будут переупорядочиваться.)

<Hint>

Вам понадобится либо поменять `map` на обычный цикл, либо использовать фрагмент.

</Hint>

<Solution>

Вы можете использовать обычный цикл, вставляя `<hr />` и `<p>...</p>` в массив для вывода по мере выполнения:

<Sandpack>

```js
const poem = {
  lines: [
    'Я пишу, стираю, переписываю,',
    'Снова стереть, а затем',
    'Цветет мак.'
  ]
};

export default function Poem() {
  let output = [];

  // Заполнение массива для вывода
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Убираем первый <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Использование исходного индекса строки в качестве ключа больше не работает, потому что теперь каждый разделитель и абзац находятся в одном и том же массиве. Однако вы можете присвоить каждому из них уникальный ключ с использованием суффикса, например, `key={i + '-text'}`.

В качестве альтернативы, вы можете отрендерить коллекцию фрагментов, содержащих `<hr />` и `<p>...</p>`. Однако сокращенный синтаксис `<>...</>` не поддерживает передачу ключей, поэтому вам придется явно использовать `<Fragment>`:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'Я пишу, стираю, переписываю,',
    'Снова стереть, а затем',
    'Цветет мак.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Запомните, фрагменты (часто записываемые как `<> </>`) позволяют вам группировать JSX-узлы  без добавления дополнительных `<div>`!

</Solution>

</Challenges>
