---
title: Передача пропсов в компонент
---

<Intro>

React-компоненты используют *пропсы*, чтобы общаться друг с другом. Каждый родительский компонент через пропсы может передать информацию в дочерние компоненты. Пропсы похожи на HTML-атрибуты, но позволяют вам передавать через них любые JavaScript-значения, включая объекты, массивы и функции.

</Intro>

<YouWillLearn>

* Как передать пропсы в компонент
* Как использовать пропсы в компоненте
* Как определять значения по умолчанию
* Как передать JSX в компонент
* Как значения пропсов изменяются

</YouWillLearn>

## Знакомство с пропсами {/*familiar-props*/}

 Пропсы -- это данные, которые вы передаёте вместе с JSX-тегом. Например, `className`, `src`, `alt`, `width`, и `height` -- это пропсы, которые могут быть использованы с `<img>`:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Линь Ланьинг"
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

Пропсы, которые можно передать с тегом `<img>`, уже определены (ReactDOM следует [HTML-стандартам](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Однако, вы можете указать пропсы для ваших *собственных* компонентов, таких как `<Avatar>`, и таким образом настроить их. Давайте разберёмся как!

## Передача пропсов в компонент {/*passing-props-to-a-component*/}

В следующем примере компонент `Profile` ничего не передаёт в дочерний компонент `Avatar`:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Вы можете определить пропсы для компонента `Avatar` в два шага.

### Шаг 1: передать пропсы в дочерний компонент {/*step-1-pass-props-to-the-child-component*/}

Сначала передадим пропсы в `Avatar`. Например, давайте определим два пропса: `person` (объект) и `size` (число):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Линь Ланьинг', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Если вас смущают двойные фигурные скобки после `person=`, напоминаем, что [они просто обозначают объект](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) внутри фигурных скобок JSX-кода.

</Note>

Теперь вы можете прочитать эти пропсы внутри компонента `Avatar`.

### Шаг 2: прочитать пропсы внутри дочернего компонента {/*step-2-read-props-inside-the-child-component*/}

Вы можете перечислить имена пропсов `person, size` через запятую между `({` и `})` сразу после объявления `function Avatar`. Это позволяет обращаться к значениям пропсов в коде компонента `Avatar` так же, как к переменным.

```js
function Avatar({ person, size }) {
  // теперь person и size доступны здесь
}
```

Добавьте в `Avatar` логику, которая использует `person` и `size` для рендеринга, и всё готово.

Теперь вы можете сконфигурировать `Avatar`, чтобы получать разные результаты рендеринга с разными пропсами. Попробуйте поиграть со значениями пропсов!

<Sandpack>

```js App.js
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
          name: 'Кацуко Сарухаси', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Аклилу Лемма', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Линь Ланьинг',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js utils.js
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

Пропсы позволяют вам думать о родительском и дочернем компонентах как об отдельных сущностях. К примеру, вы можете изменить проп `person` или `size` внутри `Profile` и не думать о том, как `Avatar` их использует. Аналогично, вы можете изменить логику использования этих пропсов внутри `Avatar`, не заглядывая в `Profile`.

Вы можете думать о пропсах как о ручках регулировки прибора, которые служат для настройки вашего компонента. Они выполняют ту же роль, что и аргументы для функций. Фактически, пропсы и _есть_ аргумент для вашего компонента! Функция React-компонента принимает единственный аргумент -- объект с `пропсами`:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Обычно вам не нужен объект `props` сам по себе, поэтому вы будете деструктурировать его в отдельные пропсы.

<Pitfall>

**Не забывайте про пару фигурных скобок `{` и `}`** внутри круглых `(` и `)`, когда объявляете пропсы:

```js
function Avatar({ person, size }) {
  // ...
}
```

Такой синтаксис называется ["деструктурирующим присваиванием" или "деструктуризацией"](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D0%BE%D0%BB%D0%B5%D0%B9_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%B0-%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D0%B0_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8) и равнозначен чтению свойств из параметра функции:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Определение значения по умолчанию для пропа {/*specifying-a-default-value-for-a-prop*/}

Если вы хотите дать пропу значение по умолчанию, когда значение не было определено, вы можете это сделать при помощи деструктуризации, добавив `=` и значение по умолчанию после параметра:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Теперь, если `<Avatar person={...} />` будет использован без пропа `size`, `size` примет значение `100`.

Значение по умолчанию используется, только если проп `size` пропущен или передан `size={undefined}`. Но если вы передаёте `size={null}` или `size={0}`, значение по умолчанию **не** будет использовано.

## Передача пропсов в JSX с оператором расширения {/*forwarding-props-with-the-jsx-spread-syntax*/}

Иногда пропсы передаются сквозь компонент:

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

В этом нет ничего плохого и такое дублирование может быть уместным. Но в то же время хочется писать код лаконичнее. Некоторые компоненты передают все их пропсы дочерним компонентам так, как это делает `Profile` с `Avatar`. Так как непосредственно сам компонент не использует пропсы, имеет смысл использовать более краткую запись и оператор расширения:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Так вы можете передать все пропсы компонента `Profile` в компонент `Avatar` без перечисления их имён.

**Используйте оператор расширения сдержанно.** Если вы используете этот оператор в каждом компоненте, то, скорее всего, что-то пошло не так. Часто это говорит о том, что вам нужно разделить компоненты и передать дочерние через JSX. Давайте посмотрим как!

## Передача JSX через проп children {/*passing-jsx-as-children*/}

Обычная практика вкладывать стандартные элементы браузера друг в друга:

```js
<div>
  <img />
</div>
```

Вы можете сделать то же самое и для ваших компонентов:

```js
<Card>
  <Avatar />
</Card>
```

Когда вы вкладываете что-то внутрь JSX-тега, родительский компонент получит это в специальном пропе `children`. В примере ниже компонент `Card` получает проп `children` и оборачивает его содержимое, то есть компонент `<Avatar />`, в div-элемент:

<Sandpack>

```js App.js
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
          name: 'Кацуко Сарухаси',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js Avatar.js
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

```js utils.js
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

Попробуйте поменять `<Avatar>` внутри `<Card>` на любой текст и посмотреть как компонент `Card` оборачивает содержимое. Ему необязательно "знать" что рендерится внутри него. Вы ещё увидите множество применений этого гибкого паттерна.

Вы можете представить себе компонент с пропом `children` в виде "эклера", в который родительский компонент "добавляет начинку" через JSX. Вы будете часто использовать проп `children` для компонентов-обёрток: панелей, гридов и т.д.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='Карточка (Card) похожа на пазл со слотом для "дочерних" кусочков наподобие текста и аватара (Avatar)' />

## Как пропсы изменяются {/*how-props-change-over-time*/}

Компонент `Clock` ниже принимает два пропса из родительского компонента: `color` и `time`. (Код родительского компонента опущен, потому что он использует [состояние](/learn/state-a-components-memory), на котором мы не хотим сейчас заострять внимание.)

Попробуйте поменять цвет в выпадающем меню ниже:

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
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
        Выберите цвет:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">светло-коралловый</option>
          <option value="midnightblue">полночно-синий</option>
          <option value="rebeccapurple">пурпурный</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Этот пример показывает, что **компонент может получать различные значения пропсов в разные моменты времени.** Пропсы не всегда статические! В этом примере проп `time` меняется каждую секунду, а проп `color` меняется при выборе цвета в меню. Пропсы отражают данные компонента в конкретный момент, а не только в начале его существования.

Однако, пропсы [неизменяемы (immutable)](https://ru.wikipedia.org/wiki/%D0%9D%D0%B5%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D1%8F%D0%B5%D0%BC%D1%8B%D0%B9_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82) —- термин в информатике, обозначающий объект, который не может быть изменён после создания. Когда компоненту нужно поменять его пропсы (например, в результате действий пользователя или обновления данных), он должен "спросить" у родительского компонента _другие пропсы_ -— новый объект! Старые пропсы окажутся ненужными, и в итоге движок JavaScript освободит память, которую они занимали.

**Не пытайтесь "изменить пропсы".** Когда вам нужно реагировать на действия пользователя (например, они меняют цвет), вы должны "установить состояние", о котором вы можете узнать в статье [Состояние: память компонента.](/learn/state-a-components-memory)

<Recap>

* Чтобы передать пропсы, добавьте их в JSX, по аналогии с HTML-атрибутами.
* Чтобы прочитать пропсы, используйте деструктурирующее присваивание `function Avatar({ person, size })`.
* Вы можете определить значение по умолчанию `size = 100`, в случае если проп принимает `undefined` или пропущен.
* Вы можете передать все пропсы в другой компонент `<Avatar {...props} />` с помощью оператора расширения, но не злоупотребляйте этой возможностью!
* Вложенный JSX, например `<Card><Avatar /></Card>`, будет передан в компонент `Card` в специальном пропе с именем `children`.
* Пропсы можно только читать: при каждом рендере компонент получает новую версию пропсов.
* Вы не можете менять пропсы. Используйте состояние компонента, если вам нужно добавить интерактивность.

</Recap>



<Challenges>

#### Выделение компонента {/*extract-a-component*/}

Компонент `Gallery` содержит очень похожую разметку для двух профилей. Выделите компонент `Profile`, чтобы не дублировать код. Вам нужно определить пропсы, которые вы передадите в этот компонент.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Выдающиеся учёные</h1>
      <section className="profile">
        <h2>Мария Склодовская-Кюри</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Мария Склодовская-Кюри"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Профессия: </b> 
            физик и химик
          </li>
          <li>
            <b>Награды: 4 </b> 
            (Нобелевская премия по физике, Нобелевская премия по химии, медаль Дэви, медаль Маттеуччи)
          </li>
          <li>
            <b>Открытия: </b>
            полоний (элемент)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Кацуко Сарухаси</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Кацуко Сарухаси"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Профессия: </b> 
            геохимик
          </li>
          <li>
            <b>Награды: 2 </b> 
            (Премия Мияке по геохимии, Премия Танака)
          </li>
          <li>
            <b>Открытия: </b>
            метод измерения углекислого газа в морской воде
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
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

Начните с выделения разметки для одной из учёных. Затем найдите различия между ними и используйте пропсы, чтобы настроить каждый профиль.

</Hint>

<Solution>

В данном решении компонент `Profile` принимает несколько пропсов: `imageId` (строка), `name` (строка), `profession` (строка), `awards` (массив строк), `discovery` (строка), and `imageSize` (число).

Обратите внимание, что проп `imageSize` имеет значение по умолчанию, поэтому мы не передаём его в компонент.

<Sandpack>

```js App.js
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
        <li><b>Профессия:</b> {profession}</li>
        <li>
          <b>Награды: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Открытия: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Выдающиеся учёные</h1>
      <Profile
        imageId="szV5sdG"
        name="Мария Склодовская-Кюри"
        profession="физик и химик"
        discovery="полоний (элемент)"
        awards={[
          'Нобелевская премия по физике',
          'Нобелевская премия по химии',
          'медаль Дэви',
          'медаль Маттеуччи'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Кацуко Сарухаси'
        profession='геохимик'
        discovery="метод измерения углекислого газа в морской воде"
        awards={[
          'Премия Мияке по геохимии',
          'Премия Танака'
        ]}
      />
    </div>
  );
}
```

```js utils.js
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

Теперь вам не нужен отдельный проп `awardCount`, так как `awards` -- массив. Вы можете обратиться к `awards.length`, чтобы узнать количество наград. Напоминаем, что пропсы могут принимать любые значения, а значит и массивы тоже!

Другое решение, которое больше похоже на примеры на этой странице -- сгруппировать всю информацию об учёной в один объект и передать его одним пропом:

<Sandpack>

```js App.js
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
          <b>Профессия:</b> {person.profession}
        </li>
        <li>
          <b>Награды: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Открытия: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Выдающиеся учёные</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Мария Склодовская-Кюри',
        profession: 'физик и химик',
        discovery: 'полоний (элемент)',
        awards: [
          'Нобелевская премия по физике',
          'Нобелевская премия по химии',
          'медаль Дэви',
          'медаль Маттеуччи'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Кацуко Сарухаси',
        profession: 'геохимик',
        discovery: 'метод измерения углекислого газа в морской воде',
        awards: [
          'Премия Мияке по геохимии',
          'Премия Танака'
        ],
      }} />
    </div>
  );
}
```

```js utils.js
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

Хотя синтаксис немного отличается, так как вы описываете свойства JavaScript-объекта вместо набора атрибутов в JSX, эти решения равнозначны, и вы можете выбрать любое из них.

</Solution>

#### Настроить размер изображения через проп {/*adjust-the-image-size-based-on-a-prop*/}

В данном примере `Avatar` получает число `size` как проп, чтобы задать ширину и высоту элемента `<img>`. Сейчас проп `size` принимает значение `40`. Однако, если вы откроете изображение в новой вкладке, вы увидите, что оно на самом деле больше (`160` пикселей). Настоящий размер изображения определяется размером уменьшенной копии, которую вы запрашиваете.

Поменяйте компонент `Avatar` так, чтобы запрашивать изображения подходящего размера, исходя из значения пропа `size`. А именно, если `size` меньше `90`, передайте `'s'` ("small") вместо `'b'` ("big") в функцию `getImageUrl`. Проверьте, что ваши изменения работают, и попробуйте разные значения пропа `size`: аватары должны отображаться, а реальный размер изображения в отдельной вкладке будет отличаться.

<Sandpack>

```js App.js
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
        name: 'Грегорио И. Зара', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
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

Ниже приведено возможное решение:

<Sandpack>

```js App.js
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
          name: 'Грегорио И. Зара', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Грегорио И. Зара', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
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

Кроме того, вы можете показывать более чёткое изображение для мониторов с высоким DPI и использовать [`window.devicePixelRatio`](https://developer.mozilla.org/ru/docs/Web/API/Window/devicePixelRatio):

<Sandpack>

```js App.js
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
          name: 'Грегорио И. Зара',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Грегорио И. Зара',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Грегорио И. Зара', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
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

Пропсы позволяют поместить всю необходимую логику внутри компонента `Avatar` (и поменять её позже, если потребуется). В результате другие разработчики могут взять компонент `<Avatar>` и не думать о том, как изображения загружаются и меняют размер.

</Solution>

#### Передача JSX через проп `children` {/*passing-jsx-in-a-children-prop*/}

Выделите компонент `Card` из разметки ниже и используйте проп `children`, чтобы передавать в него различный JSX:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Фото</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Аклилу Лемма"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>Описание</h1>
          <p>Аклилу Лемма был выдающимся эфиопским учёным, который обнаружил натуральный способ лечения шистоматоза.</p>
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

Любой JSX, который вы поместите внутри тега компонента, будет передан в этот компонент в пропе `children`.

</Hint>

<Solution>

Вот как вы можете использовать компонент `Card` в обоих местах:

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
        <h1>Фото</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Аклилу Лемма"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>Описание</h1>
        <p>Аклилу Лемма был выдающимся эфиопским учёным, который обнаружил натуральный способ лечения шистоматоза.</p>
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

Вы также можете сделать `title` отдельным пропом, если хотите, чтобы у `Card` всегда был заголовок:

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
      <Card title="Фото">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Аклилу Лемма"
          width={100}
          height={100}
        />
      </Card>
      <Card title="Описание">
        <p>Аклилу Лемма был выдающимся эфиопским учёным, который обнаружил натуральный способ лечения шистоматоза.</p>
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
