---
title: Условный рендеринг
---

<Intro>

Вашим компонентам нужно часто отображать различные вещи в зависимости от различных условий. В React вы можете рендерить JSX в зависимости от его условий, используя JavaScript операторы. Такие, как `if`, `&&` и `? :`

</Intro>

<YouWillLearn>

- Как вернуть разный JSX, в зависимости от условия.
- Как в зависимости от условий добавить или убрать часть JSX.
- Часто встречающиеся сокращения синтаксиса условных выражений, с которыми вы столкнётесь в проектах на React.

</YouWillLearn>

## Условный возврат JSX {/*conditionally-returning-jsx*/}

Допустим, у вас есть компонент `PackingList`, который рендерит несколько компонентов `Item`, который могут быть отмечены как упакованные или нет:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}
export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>
                  

Обратите внимание, что у некоторых компонентов `Item` проп `isPacked` имеет значение `true`, вместо значения `false`. Если `isPacked={true}`, вы хотите добавить галочку(✔) к упакованным вещам.

Можно реализовать это с помощью [управляющей конструкции `if`/`else`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/if...) таким образом:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Если `isPacked` проп равен `true`, то этот код **вернёт другое JSX дерево.** Вместе с этим изменением, некоторые вещи получат галочку в конце:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Попробуйте отредактировать то, что возвращается в обоих случаях, и посмотрите, как изменится результат!

Обратите внимание, как вы создаёте разветвлённую логику с помощью операторов JavaScript `if` и `return`. В React управление потоком выполнения (например, условия) обрабатывает JavaScript.

### Условно возвращаем ничего, с помощью `null` {/*conditionally-returning-nothing-with-null*/}

В некоторых ситуациях вы вообще не захотите ничего рендерить. Например, вы не хотите показывать упакованные предметы. Компонент должен что-то возвращать. В этом случае вы можете вернуть `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Если `isPacked` равен true, то компонент не вернёт ничего, `null`. В противном случае, он вернёт JSX для рендеринга.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

На практике возврат `null` из компонента не является обычным делом, поскольку это может удивить разработчика, пытающегося его рендерить. Чаще всего вы будете условно включать или исключать компонент в JSX родительского компонента. Вот как это сделать!

## Условное включение JSX {/*conditionally-including-jsx*/}

В предыдущем примере вы контролировали, какое JSX дерево будет возвращено компонентом (если вообще будет!). Возможно, вы уже заметили некоторое дублирование в выводе рендера:

```js
<li className="item">{name} ✔</li>
```

очень похоже на

```js
<li className="item">{name}</li>
```

Обе ветки условия возвращают `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Хоть и такое дублирование не вредно, но оно может усложнить поддержку вашего кода. Что если вы захотите изменить `className`? Вам придётся делать это в двух местах вашего кода! В такой ситуации вы можете условно включить небольшой JSX, чтобы сделать ваш код более [DRY.](https://ru.wikipedia.org/wiki/Don%E2%80%99t_repeat_yourself).

### Условный (тернанрый) оператор (`? :`) {/*conditional-ternary-operator--*/}

В JavaScript есть компактный синтаксис для записи условного выражения — [условный оператор](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) или "тернарный оператор".

Вместо этого:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Вы можете написать это:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

Вы можете читать это как *"если `isPacked` равно true, тогда (`?`) рендерим `name + ' ✔'`, в противном случае (`:`) рендерим `name`"*.

<DeepDive>

#### Эти два примера полностью эквивалентны? {/*are-these-two-examples-fully-equivalent*/}

Если вы знакомы с объектно-ориентированным программированием, вы можете предположить, что два приведенных выше примера немного отличаются друг от друга, поскольку один из них может создавать два разных "экземпляра" `<li>`. Но JSX-элементы не являются "экземплярами", потому что они не хранят никакого внутреннего состояния и не являются реальными DOM-узлами. Это лёгкие описания, как чертежи. На самом деле эти два примера *совершенно эквивалентны*. В [Сохранение и сброс состояния](/learn/preserving-and-resetting-state) подробно рассказывается о том, как это работает.

</DeepDive>

Теперь предположим, что вы хотите обернуть текст завершённого элемента в другой HTML-тег, например `<del>`, чтобы вычеркнуть его. Вы можете добавить ещё больше переносов строк и круглых скобок, чтобы было проще вкладывать JSX в каждом из случаев:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Этот стиль хорошо работает для простых условий, но используйте его в меру. Если ваши компоненты становятся запутанными из-за слишком большого количества вложенной условной разметки, подумайте об выделении дочерних компонентов, чтобы навести порядок. В React разметка является частью кода, поэтому вы можете использовать такие инструменты, как переменные и функции, чтобы привести в порядок сложные выражения.

### Логический оператор И(`&&`) {/*logical-and-operator-*/}

Еще одно часто встречающееся сокращение [JavaScript логический оператор И (`&&`).](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Logical_AND) Внутри React-компонентов он часто используется, когда вам нужно отрендерить JSX, когда условие true, **или не рендерить ничего.** С помощью `&&` вы можете условно рендерить галочку, если `isPacked` равно `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Вы можете читать это как *"если `isPacked`, тогда (`&&`) рендерим галочку, в противном случае -- ничего не рендерим"*.

Вот это в действии:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScript выражение &&](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Logical_AND) возвращает значение правой части (в нашем случае это галочка), если левая часть (наше условие) является `true`. Но если наше условие — `false`, тогда всё выражение становится `false`. React рассматривает `false` как "пустое место" в дереве JSX, прямо как `null` или `undefined`, и ничего не рендерит на этом месте.


<Pitfall>

**Не ставь числа по левую сторону `&&`.**

Для проверки условия JavaScript автоматически преобразует левую часть в булевое значение. Однако, если левая часть равна `0`, то всё выражение получает это значение (`0`), и React будет с радостью рендерить `0` вместо ничего.

Например, распространённой ошибкой является написание кода вида `messageCount && <p>Новые сообщения</p>`. Легко предположить, что ничего не отрендерено, когда `messageCount` равно `0`, но на самом деле будет рендериться `0`!

Чтобы исправить это, сделайте левую часть булевым значением: `messageCount > 0 && <p>Новые сообщения</p>`.

</Pitfall>

### Условное присвоение JSX к переменной {/*conditionally-assigning-jsx-to-a-variable*/}

Когда сокращения мешают написанию понятного кода, то попробуйте использовать `if` оператор и переменную. Вы можете переназначать переменные, объявленные с помощью [`let`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/let), поэтому начните с предоставления содержимого по умолчанию, которое вы хотите отобразить, например, name:

```js
let itemContent = name;
```

Используйте `if` оператор, чтобы переназначить JSX-выражение `itemContent`, если `isPacked` равно `true`:

```js
if (isPacked) {
  itemContent = name + ' ✔';
}
```

[Фигурные скобки открывают "окно в мир JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Вставьте переменную с помощью фигурных скобок в возвращаемое дерево JSX, вложив ранее вычисленное выражение внутрь JSX:

```js
<li className="item">
  {itemContent}
</li>
```

Этот стиль самый многословный, но и самый гибкий. Вот он в действии:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + ' ✔';
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Как и раньше, это работает не только для текста, но и для произвольного JSX:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Если вы не знакомы с JavaScript, то такое разнообразие стилей может показаться поначалу ошеломляющим. Однако их изучение поможет вам читать и писать любой JavaScript код, а не только React-компоненты! Выберите тот, который вам больше нравится, и при необходимости обратитесь к этому справочнику, если вы забудете, как работают другие.

<Recap>

- В React вы управляете логикой ветвления с помощью JavaScript.
- Вы можете условно возвращать JSX-выражение с помощью оператора `if`.
- Вы можете условно сохранить JSX в переменную и затем включить её в другой JSX с помощью фигурных скобок.
- В JSX выражение `{cond ? <A /> : <B />}` означает *"если `cond`, то отрендерить `<A />`, иначе `<B />`"*.
- В JSX выражение `{cond && <A />}` означает *"если `cond`, то отрендерить`<A />`, иначе ничего"*.
- Эти сокращения являются общепринятыми, но эти сокращения необязательно использовать, если вы предпочитаете простой `if`.

</Recap>



<Challenges>

#### Показать иконку для неупакованных вещей с `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Используйте тернарный оператор (`cond ? a : b`), чтобы отрендерить❌, если `isPacked` не равен `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Показать важность вещи с помощью `&&` {/*show-the-item-importance-with-*/}

В этом примере каждый `Item` получает числовой проп `importance`. Используйте `&&`, чтобы рендерить "_(Важность: X)_" курсивом только для вещей с ненулевой важностью. Ваш список вещей должен выглядеть следующем образом:

- Космический скафандр _(Важность: 9)_
- Шлем с золотым листом
- Фотография Тэма _(Важность: 6)_

Не забудьте добавить пробел между двумя метками!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Космический скафандр" 
        />
        <Item 
          isPacked={true} 
          name="Шлем с золотым листом" 
        />
        <Item 
          isPacked={false} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Это должно сработать:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Важность: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Список вещей Салли Райд</h1>
      <ul>
        <Item 
          importance={9} 
          name="Космический скафандр" 
        />
        <Item 
          importance={0} 
          name="Шлем с золотым листом" 
        />
        <Item 
          importance={6} 
          name="Фотография Тэма" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Помните, что вы должны писать `importance > 0 && ...` вместо `importance && ...`, чтобы при `importance` равном `0` число `0` не рендерилось в результате!

<<<<<<< HEAD
В этом решении используются два отдельных условия для вставки пробела между именем и меткой важности. Кроме того, можно использовать фрагмент с ведущим пробелом: `importance > 0 && <> <i>...</i></>` или добавить пробел сразу внутри тега `<i>`: `importance > 0 && <i> ...</i>`.
=======
In this solution, two separate conditions are used to insert a space between the name and the importance label. Alternatively, you could use a Fragment with a leading space: `importance > 0 && <> <i>...</i></>` or add a space immediately inside the `<i>`:  `importance > 0 && <i> ...</i>`.
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

</Solution>

#### Перепишите тернарный оператор `? :` на `if` и переменные {/*refactor-a-series-of---to-if-and-variables*/}

Компонент `Drink` использует серию условий `? :` для отображения разной информацию в зависимости от пропа `name` (может быть `"tea"` или `"coffee"`). Проблема заключается в том, что информация о каждом напитке разбросана по нескольким условиям. Перепишите этот код так, используя один `if` вместо трёх условий `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Часть растения</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Содержание кофеина</dt>
        <dd>{name === 'tea' ? '15–70 мг/чашка' : '80–185 мг/чашка'}</dd>
        <dt>Возраст</dt>
        <dd>{name === 'tea' ? '4,000+ лет' : '1,000+ лет'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

После рефакторинга кода с использованием `if`, у вас есть ещё идеи о том, как упростить его?

<Solution>

Есть несколько способов, но вот один из них, с которого можно начать:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 мг/чашка';
    age = '4,000+ лет';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 мг/чашка';
    age = '1,000+ лет';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Часть растения</dt>
        <dd>{part}</dd>
        <dt>Содержание кофеина</dt>
        <dd>{caffeine}</dd>
        <dt>Возраст</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Здесь информация о каждом напитке сгруппирована вместе, а не разбросана по нескольким условиям. Это облегчает добавление новых напитков в будущем.

Другим решением будет удалить условия, переместив информацию в объекты:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 мг/чашка',
    age: '4,000+ лет',
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 мг/чашка',
    age: '1,000+ лет',
  },
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Часть растения</dt>
        <dd>{info.part}</dd>
        <dt>Содержание кофеина</dt>
        <dd>{info.caffeine}</dd>
        <dt>Возраст</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
