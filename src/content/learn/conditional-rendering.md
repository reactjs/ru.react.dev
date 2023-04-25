---
title: Условный рендеринг
---

<Intro>

Твоим компонентам нужно будет часто отображать различные вещи в зависимости от различных условий. В React ты можешь реденрить JSX в зависимости от его условий, используя JavaScript операторы. Такие, как `if`, `&&` и `? :`

</Intro>

<YouWillLearn>

- Как вернуть разный JSX, в зависимости от его условия
- Как условно включить или исключить фрагмент JSX
- Общий условный синтаксис, который ты встретишь в кодовой базе React.

</YouWillLearn>

## Условно возвращаемый JSX {/_conditionally-returning-jsx_/}

Допустим, у тебя есть `PackingList` компонент, который рендерит несколько `Item`ов, которые могут быть обозначены, как упакованные или неуправкованные:

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
                  

Заметь, что некоторые `Item` компоненты имеют свой `isPacked` проп, который `true` вместо `false`. Ты хочешь добавить галочку (✔) к упакованным вещам, если if `isPacked={true}`.

Ты можешь писать это как [`if`/`else` условие](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/if...) таким образом:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Если `isPacked` проп - это `true`, то этот код **вернёт другое JSX дерево.** Вместе с этим изменением, то некоторые вещи получат галочку в конце:

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

Обратите внимание, как вы создаете разветвленную логику с помощью операторов JavaScript `if` и `return`. В React поток управления (как и условия) обрабатывается JavaScript.

### Условно возвращаем ничего, с помощью `null` {/_conditionally-returning-nothing-with-null_/}

В некоторых ситуациях вы вообще не захотите ничего рендерить. Например, вы не хотите показывать упакованные предметы. Компонент должен что-то возвращать. В этом случае вы можете вернуть `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Если `isPacked` true, то компонент не вернет ничего, `null`. В противном случае он вернет JSX для рендеринга.

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

На практике возврат `null` из компонента не является обычным делом, поскольку это может удивить разработчика, пытающегося его зарендерить. Чаще всего вы условно включаете или исключаете компонент JSX из родительского компонента. Вот как это сделать!

## Условное включение JSX {/_conditionally-including-jsx_/}

В предыдущем примере вы контролировали, какое JSX дерево будет возвращено компонентом (если вообще будет!). Возможно, вы уже заметили некоторое дублирование в выводе рендера:

```js
<li className="item">{name} ✔</li>
```

очень похоже на

```js
<li className="item">{name}</li>
```

Обе условные ветви возвращают `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Хоть и такое дублирование не вредно, но оно может усложнить поддержание вашего кода. Что если вы захотите изменить `className`? Вам придется делать это в двух местах вашего кода! В такой ситуации вы можете условно включить небольшой JSX, чтобы сделать ваш код более [DRY.](https://ru.wikipedia.org/wiki/Don%E2%80%99t_repeat_yourself).

### Условный (тернанрый) оператор (`? :`) {/_conditional-ternary-operator--_/}

В JavaScript есть компактный синтаксис для написания условного выражения - [условный оператор](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) или "тернарный оператор".

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

Вы можете читать это как _"if `isPacked` это true, тогда (`?`) рендерим `name + ' ✔'`, в противном случае (`:`) рендерю `name`"_.

<DeepDive>

####Являются ли эти два примера полностью эквивалентными? {/_are-these-two-examples-fully-equivalent_/}

Если вы знакомы с объектно-ориентированным программированием, вы можете предположить, что два приведенных выше примера мало чем отличаются друг от друга, поскольку один из них может создавать два разных "экземпляра" `<li>`. Но элементы JSX не являются "экземплярами", потому что они не хранят никакого внутреннего состояния и не являются реальными узлами DOM. Это легкие описания, как чертежи. Так что эти два примера, на самом деле, _совершенно эквивалентны_. В [Сохранение и сброс состояния](/learn/preserving-and-resetting-state) подробно рассказывается о том, как это работает.

</DeepDive>

Теперь предположим, что вы хотите обернуть текст завершенного элемента в другой HTML тег, например <del>, чтобы вычеркнуть его. Вы можете добавить еще больше новых линий и круглых скобок, чтобы было проще вложить больше JSX в каждом из случаев:

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

Этот стиль хорошо работает для простых условий, но используйте его в меру. Если ваши компоненты становятся беспорядочными из-за слишком большого количества вложенной условной разметки, подумайте об извлечении дочерних компонентов, чтобы навести порядок. В React разметка является частью кода, поэтому вы можете использовать такие инструменты, как переменные и функции, чтобы привести в порядок сложные выражения.

### Логичксий И оператор (`&&`) {/_logical-and-operator-_/}

Еще одно часто встречающееся сокращение [JavaScript логический И (`&&`) оператор.](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Logical_AND) Внутри React компонентов, часто случается так, что тебе нужно зарендерить JSX, когда условие true, **или не рендерить ничего.** С `&&`, вы можете исходя из условия зарендерить галочку, if `isPacked` это `true`:

```js
return (
  <li className="item">
    {name} {isPacked && "✔"}
  </li>
);
```

Вы можете читать это как _"if `isPacked`, тогда (`&&`) рендерим галочку, в противном случае, мы не рендерим ничего"_.

Вот это в действии:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && "✔"}
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

[JavaScript && выражение](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Logical_AND) возвращает значение его правой стороны (в нашем случае это галочка) на левой стороне (наше условие) это `true`. Но если наше условие - `false`, тогда всё выражение становится `false`. React думает о `false` как о "дыре" внутри JSX дерева, прямо как о `null` или `undefined`, и React не рендерит ничего на этом месте.


<Pitfall>

**Не ставь числа по левую сторону `&&`.**

Чтобы проверить условие, JavaScript автоматически преобразует левую часть в булевое значение (true/false). Однако если левая часть равна `0`, то все выражение получает это значение (`0`), и React с радостью зарендерит `0`, а не ничего.

Например, распространенной ошибкой является написание кода типа `messageCount && <p>New messages</p>`. Легко предположить, что он ничего не рендерит, когда `messageCount` равно `0`, но на самом деле он зарендерит `0`!

Чтобы исправить это, сделайте левую часть булевым значением (true/false): `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### Условное присвоение JSX к переменной {/_conditionally-assigning-jsx-to-a-variable_/}

Когда сокращения встревают на пути к написанию понятного кода, то попробуйте использовать `if` оператор и переменную. Вы можете изменить переменные, написанные с помощью [`let`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/let), поэтому начните с предоставления содержимого по умолчанию, которое вы хотите отобразить, name:

```js
let itemContent = name;
```

Используй `if` оператор чтобы переназначить JSX выражение `itemContent` если `isPacked` это `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Фигурные скобки открывают "окно в мир JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Вставьте переменную с фигурными скобками в возвращаемое дерево JSX, вложив ранее вычисленное выражение внутрь JSX:

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
    itemContent = name + " ✔";
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

Если вы не знакомы с JavaScript, то такое разнообразие стилей может показаться поначалу ошеломляющим. Однако их изучение поможет вам читать и писать любой код JavaScript - и не только компоненты React! Выберите для начала тот, который вам больше нравится, а затем снова обратитесь к этому справочнику, если вы забудете, как работают другие.

<Recap>

- В React вы управляете логикой ветвления с помощью JavaScript.
- Вы можете возвращать выражение JSX условно с помощью оператора `if`.
- Вы можете условно сохранить логику JSX в переменную, а затем включить её в другие JSX с помощью фигурных скобок.
- В JSX, `{cond ? <A /> : <B />}` означает _"if `cond`, рендери `<A />`, в противном случае `<B />`"_.
- В JSX, `{cond && <A />}` означает _"if `cond`, рендери `<A />`, иначе ничего"_.
- Эти сокращения являются общепринятыми, но вы не обязаны их использовать, если предпочитаете простые выражения. `if`.

</Recap>

<Challenges>

#### Покажи иконку для неупакованных вещей `? :` {/_show-an-icon-for-incomplete-items-with--_/}

Используй тернарный оператор (`cond ? a : b`) чтобы зарендерить ❌ if `isPacked` не равен `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && "✔"}
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
      {name} {isPacked ? "✔" : "❌"}
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

#### Покажи важность вещи с помощью `&&` {/_show-the-item-importance-with-_/}

В этом примере каждый `Item` получает числовой `importance` проп. Используй `&&` чтобы зарендерить "_(Важность: X)_" в italics стиле, но только для вещей важность которых больше 0. Твой конечный резульат должен выглядить вот так вот:

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
      {importance > 0 && " "}
      {importance > 0 && <i>(Важность: {importance})</i>}
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

Помни, что ты должен писать `importance > 0 && ...` а не `importance && ...` поэтому если `importance` это `0`, то `0` не зарендерится как результат!

В этом решении, два раздельных условия были использованы, чтобы вставить пробел между именем и меткой важности. В качестве альтернативы можно использовать фрагмент с ведущим пробелом: `importance > 0 && <> <i>...</i></>` или добавить пробел сразу внутри тега `<i>`: `importance > 0 && <i> ...</i>`.

</Solution>

#### Отрефактори тернарный оператор `? :` на `if` и переменными {/_refactor-a-series-of---to-if-and-variables_/}

Этот `Drink` компонент использует серию `? :` условий, чтобы показать разную информацию, которая зависит от `name` пропа, который `"tea"` или `"coffee"`. Проблема в том, что информация о каждом напитке распределена по нескольким условиям. Отрефактори этот код таким образом, чтобы использовать одно `if` условие вместо трёх `? :` условий.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Часть растения</dt>
        <dd>{name === "tea" ? "leaf" : "bean"}</dd>
        <dt>Содержание кофеина</dt>
        <dd>{name === "tea" ? "15–70 мг/чашка" : "80–185 мг/чашка"}</dd>
        <dt>Возраст</dt>
        <dd>{name === "tea" ? "4,000+ лет" : "1,000+ лет"}</dd>
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

После рефакторинга кода с использованием `if` у вас есть идеи, как его упростить?

<Solution>

Есть несколько способов, но вот один из них, с которого можно начать:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === "tea") {
    part = "leaf";
    caffeine = "15–70 мг/чашка";
    age = "4,000+ лет";
  } else if (name === "coffee") {
    part = "bean";
    caffeine = "80–185 мг/чашка";
    age = "1,000+ лет";
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

Здесь информация о каждом напитке сгруппирована вместе, а не распределена по нескольким условиям. Это облегчает добавление новых напитков в будущем.

Другим решением может быть полное удаление условий путем перемещения информации в объекты:

<Sandpack>

```js
const drinks = {
  tea: {
    part: "leaf",
    caffeine: "15–70 мг/чашка",
    age: "4,000+ лет",
  },
  coffee: {
    part: "bean",
    caffeine: "80–185 мг/чашка",
    age: "1,000+ лет",
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
