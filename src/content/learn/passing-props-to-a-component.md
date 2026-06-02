---
title: Passing Props to a Component
---

<Intro>

Компоненты React используют *пропсы* для взаимодействия друг с другом. Каждый родительский компонент может передавать информацию своим дочерним компонентам, передавая им пропсы. Пропсы могут напомнить вам HTML-атрибуты, но через них можно передавать любые значения JavaScript, включая объекты, массивы и функции.

</Intro>

<YouWillLearn>

* Как передавать пропсы компоненту
* Как читать пропсы из компонента
* Как задавать значения по умолчанию для пропсов
* Как передавать JSX компоненту
* Как пропсы меняются со временем

</YouWillLearn>

## Знакомые пропсы {/*familiar-props*/}

Пропсы — это информация, которую вы передаёте JSX-тегу. Например, `className`, `src`, `alt`, `width` и `height` — это некоторые из пропсов, которые вы можете передать `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Пропсы, которые можно передать тегу `<img>`, предопределены (ReactDOM соответствует [стандарту HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Но вы можете передавать любые пропсы *своим собственным* компонентам, таким как `<Avatar>`, чтобы настроить их. Вот как!

## Передача пропсов компоненту {/*passing-props-to-a-component*/}

В этом коде компонент `Profile` не передаёт никаких пропсов своему дочернему компоненту `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Вы можете передать `Avatar` некоторые пропсы в два шага.

### Шаг 1: Передача пропсов дочернему компоненту {/*step-1-pass-props-to-the-child-component*/}

Сначала передайте некоторые пропсы в `Avatar`. Например, передадим два пропса: `person` (объект) и `size` (число):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Если двойные фигурные скобки после `person=` сбивают вас с толку, вспомните, что [это просто объект](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) внутри фигурных скобок JSX.

</Note>

Теперь вы можете прочитать эти пропсы внутри компонента `Avatar`.

### Шаг 2: Чтение пропсов внутри дочернего компонента {/*step-2-read-props-inside-the-child-component*/}

Вы можете прочитать эти пропсы, перечислив их имена `person, size`, разделённые запятыми, внутри `({` и `})` непосредственно после `function Avatar`. Это позволит вам использовать их внутри кода `Avatar`, как если бы это была переменная.

```js
function Avatar({ person, size }) {
  // person и size доступны здесь
}
```

Добавьте некоторую логику в `Avatar`, которая использует пропсы `person` и `size` для рендеринга, и вы закончите.

Теперь вы можете настроить `Avatar` для рендеринга различными способами с разными пропсами. Попробуйте изменить значения!

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Пропсы позволяют вам независимо думать о родительских и дочерних компонентах. Например, вы можете изменить пропсы `person` или `size` внутри `Profile`, не задумываясь о том, как `Avatar` их использует. Аналогично, вы можете изменить то, как `Avatar` использует эти пропсы, не заглядывая в `Profile`.

Вы можете думать о пропсах как о «ручках», которые вы можете регулировать. Они выполняют ту же роль, что и аргументы для функций — на самом деле, пропсы _являются_ единственным аргументом вашего компонента! Функции компонентов React принимают один аргумент — объект `props`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Обычно вам не нужен весь объект `props`, поэтому вы деструктурируете его на отдельные пропсы.

<Pitfall>

**Не пропустите пару фигурных скобок `{` и `}`** внутри круглых скобок `(` и `)` при объявлении пропсов:

```js
function Avatar({ person, size }) {
  // ...
}
```

Этот синтаксис называется ["деструктуризацией"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) и эквивалентен чтению свойств из параметра функции:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Указание значения по умолчанию для пропса {/*specifying-a-default-value-for-a-prop*/}

Если вы хотите дать пропсу значение по умолчанию, которое будет использоваться, когда значение не указано, вы можете сделать это с помощью деструктуризации, добавив `=` и значение по умолчанию сразу после параметра:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Теперь, если `<Avatar person={...} />` будет отрисован без пропса `size`, `size` будет установлен в `100`.

Значение по умолчанию используется только в том случае, если пропс `size` отсутствует или если вы передаёте `size={undefined}`. Но если вы передаёте `size={null}` или `size={0}`, значение по умолчанию *не* будет использовано.

## Передача пропсов с помощью синтаксиса spread JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

Иногда передача пропсов становится очень утомительной:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

В повторяющемся коде нет ничего плохого — он может быть более читаемым. Но иногда вы можете предпочесть краткость. Некоторые компоненты передают все свои пропсы своим дочерним компонентам, как это делает `Profile` с `Avatar`. Поскольку они сами напрямую не используют ни один из своих пропсов, может иметь смысл использовать более краткий синтаксис "spread":

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Это передаёт все пропсы `Profile` в `Avatar` без перечисления каждого из их имён.

**Используйте синтаксис spread сдержанно.** Если вы используете его в каждом втором компоненте, значит, что-то не так. Часто это указывает на то, что вам следует разделить компоненты и передавать детей как JSX. Об этом подробнее далее!

## Передача JSX в качестве детей {/*passing-jsx-as-children*/}

Часто вкладывают встроенные браузерные теги:

```js
<div>
  <img />
</div>
```

Иногда вы захотите вкладывать свои собственные компоненты таким же образом:

```js
<Card>
  <Avatar />
</Card>
```

Когда вы вкладываете контент внутрь JSX-тега, родительский компонент получит этот контент в пропсе под названием `children`. Например, компонент `Card` ниже получит пропс `children`, установленный в `<Avatar />`, и отрисует его во вложенном div:

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

Попробуйте заменить `<Avatar>` внутри `<Card>` на какой-нибудь текст, чтобы увидеть, как компонент `Card` может оборачивать любой вложенный контент. Ему не нужно "знать", что именно отрисовывается внутри. Вы будете часто встречать этот гибкий шаблон.

Вы можете думать о компоненте с пропсом `children` как о "дырке", которая может быть "заполнена" родительскими компонентами произвольным JSX. Вы часто будете использовать пропс `children` для визуальных обёрток: панелей, сеток и т. д.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='Плитка Card, похожая на пазл, с местом для элементов "children", таких как текст и Avatar' />

## Как пропсы меняются со временем {/*how-props-change-over-time*/}

Компонент `Clock` ниже получает два пропа от родительского компонента: `color` и `time`. (Код родительского компонента опущен, так как он использует [состояние](/learn/state-a-components-memory), которое мы пока не будем рассматривать.)

Попробуйте изменить цвет в выпадающем списке ниже:

<Sandpack>

```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Этот пример иллюстрирует, что **компонент может получать разные пропсы со временем.** Пропсы не всегда статичны! Здесь проп `time` меняется каждую секунду, а проп `color` меняется при выборе другого цвета. Пропсы отражают данные компонента в любой момент времени, а не только в начале.

Однако пропсы [неизменяемы](https://ru.wikipedia.org/wiki/%D0%9D%D0%B5%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D1%8F%D0%B5%D0%BC%D1%8B%D0%B9_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82) — термин из информатики, означающий «неизменяемый». Когда компоненту нужно изменить свои пропсы (например, в ответ на взаимодействие пользователя или новые данные), ему придется «попросить» родительский компонент передать ему _другие пропсы_ — новый объект! Его старые пропсы будут отброшены, а затем движок JavaScript освободит занимаемую ими память.

**Не пытайтесь «изменить пропсы».** Когда вам нужно отреагировать на ввод пользователя (например, изменение выбранного цвета), вам нужно будет «установить состояние», о чем вы можете узнать в разделе [Состояние: Память компонента.](/learn/state-a-components-memory)

<Recap>

* Чтобы передать пропсы, добавьте их в JSX, как обычные HTML-атрибуты.
* Чтобы прочитать пропсы, используйте синтаксис деструктуризации `function Avatar({ person, size })`.
* Вы можете указать значение по умолчанию, например `size = 100`, которое будет использоваться для отсутствующих и `undefined` пропсов.
* Вы можете передать все пропсы с помощью синтаксиса spread JSX `<Avatar {...props} />`, но не злоупотребляйте им!
* Вложенный JSX, например `<Card><Avatar /></Card>`, появится как проп `children` компонента `Card`.
* Пропсы — это неизменяемые снимки состояния во времени: каждый рендер получает новую версию пропсов.
* Вы не можете изменять пропсы. Когда вам нужна интерактивность, вам нужно будет установить состояние.

</Recap>



<Challenges>

#### Извлечение компонента {/*extract-a-component*/}

Этот компонент `Gallery` содержит очень похожий разметку для двух профилей. Извлеките компонент `Profile` из него, чтобы уменьшить дублирование. Вам нужно будет выбрать, какие пропсы передать ему.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b>
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b>
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (chemical element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b>
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b>
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Начните с извлечения разметки для одного из ученых. Затем найдите части, которые не совпадают во втором примере, и сделайте их настраиваемыми с помощью пропсов.

</Hint>

<Solution>

В этом решении компонент `Profile` принимает несколько пропсов: `imageId` (строка), `name` (строка), `profession` (строка), `awards` (массив строк), `discovery` (строка) и `imageSize` (число).

Обратите внимание, что проп `imageSize` имеет значение по умолчанию, поэтому мы не передаем его компоненту.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Обратите внимание, что вам не нужен отдельный проп `awardCount`, если `awards` — это массив. Тогда вы можете использовать `awards.length` для подсчета количества наград. Помните, что пропсы могут принимать любые значения, включая массивы!

Другое решение, которое больше похоже на предыдущие примеры на этой странице, заключается в группировке всей информации о человеке в один объект и передаче этого объекта как одного пропса:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Хотя синтаксис выглядит немного иначе, поскольку вы описываете свойства объекта JavaScript, а не набор атрибутов JSX, эти примеры в основном эквивалентны, и вы можете выбрать любой подход.

</Solution>

#### Настройка размера изображения на основе пропса {/*adjust-the-image-size-based-on-a-prop*/}

В этом примере `Avatar` получает числовой проп `size`, который определяет ширину и высоту `<img>`. Проп `size` установлен в `40` в этом примере. Однако, если вы откроете изображение в новой вкладке, вы заметите, что само изображение больше (160 пикселей). Реальный размер изображения определяется тем, какой размер миниатюры вы запрашиваете.

Измените компонент `Avatar` так, чтобы он запрашивал ближайший размер изображения на основе пропса `size`. В частности, если `size` меньше `90`, передайте `'s'` («маленький»), а не `'b'` («большой») в функцию `getImageUrl`. Убедитесь, что ваши изменения работают, отображая аватары с разными значениями пропса `size` и открывая изображения в новой вкладке.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{
        name: 'Gregorio Y. Zara',
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Вот как вы можете это сделать:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Вы также можете отображать более четкое изображение для экранов с высоким разрешением, учитывая [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Пропсы позволяют инкапсулировать такую логику внутри компонента `Avatar` (и изменять ее позже при необходимости), чтобы каждый мог использовать компонент `<Avatar>`, не задумываясь о том, как запрашиваются и изменяются размеры изображений.

</Solution>

#### Передача JSX в проп `children` {/*passing-jsx-in-a-children-prop*/}

Извлеките компонент `Card` из разметки ниже и используйте проп `children` для передачи в него разного JSX:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Любой JSX, который вы поместите внутрь тега компонента, будет передан как проп `children` этому компоненту.

</Hint>

<Solution>

Вот как вы можете использовать компонент `Card` в обоих случаях:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Вы также можете сделать `title` отдельным пропом, если хотите, чтобы каждая `Card` всегда имела заголовок:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>