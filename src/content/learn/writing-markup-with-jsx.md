---
title: Написание JSX разметки
---

<Intro>

*JSX* - это синтаксическое расширение для JavaScript, позволяющее писать похожую на HTML разметку внутри JavaScript файлов. Несмотря на то, что существуют и другие способы написания компонентов, большинство React разработчиков предпочитают лаконичность JSX. Поэтому JSX встречается во многих кодовых базах.

</Intro>

<YouWillLearn>

* Почему React смешивает разметку и логику рендеринга
* Чем JSX отличается от HTML
* Как отображать информацию, используя JSX

</YouWillLearn>

## JSX: Встраивание разметки в JavaScript {/*jsx-putting-markup-into-javascript*/}

The Web has been built on HTML, CSS, and JavaScript. For many years, web developers kept content in HTML, design in CSS, and logic in JavaScript—often in separate files! Content was marked up inside HTML while the page's logic lived separately in JavaScript:

Веб-сайты состоят из HTML, CSS и JavaScript. Долгое время разработчики использовали отдельные файлы: HTML для контента, CSS для дизайна и JavaScript для логики.
 
<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML разметка на фиолетовом фоне с тегом div и двумя дочерними тегами: p и form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Три JavaScript обработчика на желтом фоне: onSubmit, onLogin, и onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Со временем веб-сайты становились более интерактивными и логика начала определять содержание. JavaScript начал отвечать за HTML! Именно поэтому **в React логика рендеринга и разметка находятся в одном месте — в компонентах.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React компонент со смешанной HTML разметкой и JavaScript из предыдущих примеров. Функция Sidebar вызывает функцию isLoggedIn, подсвечено желтым. Фиолетовым цветом подсвечен дочерний p тег из предыдущего примера и тег Form, ссылающийся на компонент, показанный в следующем примере.">

React компонент `Sidebar.js`

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React компонент со смешанной HTML разметкой и JavaScript из предыдущих примеров. Функция Form содержит два обработчика onClick и onSubmit на желтом фоне. Далее на фиолетовом фоне HTML разметка. HTML содержит элемент form с дочерними элементами input. Каждый input также имеет свойство onClick.">

React компонент `Form.js`

</Diagram>

</DiagramGroup>

Размещая логику рендера и разметку кнопки вместе обеспечивается их синхронизация при всех дальнейших изменениях. И наоборот, размещая несвязанные детали отдельно, например разметку кнопки и разметку сайдбара, они становятся изолированными друг от друга. Поэтому дальнейшие изменение разметки одного из компонентов будет более безопасным.

Каждый React компонент — это JavaScript функция с разметкой, которую React рендерит в браузер. React компоненты используют синтаксическое расширение JSX чтобы определить файл как компонент с разметкой. JSX очень похож на HTML, но является более строгим и позволяет отображать динамическую информацию. Лучший способ понять, как работает JSX — конвертировать HTML разметку в JSX разметку.

<Note>

JSX и React — это две разные вещи. Они часто используются вместе, но вы *можете* [использовать их отдельно](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform). JSX — это синтаксическое расширение, в то время как React — это JavaScript библиотека. 

</Note>

## Конвертация HTML в JSX {/*converting-html-to-jsx*/}

Предположим, что у вас есть (полностью валидный) HTML:

```html
<h1>Задачи Hedy Lamarr's</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Придумать новые светофоры
    <li>Отрепетировать сцену из фильма
    <li>Улучшить спектральный сенсор
</ul>
```

И вы хотите разместить эту разметку в компоненте:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Если вы просто скопируете и вставите разметку, компонент не будет работать:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Этот код не работает!
    <h1>Задачи Hedy Lamarr's</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Придумать новые светофоры
      <li>Отрепетировать сцену из фильма
      <li>Улучшить спектральный сенсор
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

JSX более строгий и у него есть немного больше правил, чем у HTML! Обратите внимание на сообщение в ошибке выше, оно подскажет вам, как исправить разметку. Или просто следуйте инструкции ниже.

<Note>

В большинстве ситуаций ошибки React на экране подскажут вам, в чем заключается проблема. Ознакамливайтесь с ними, если у вас что-то не получается!

</Note>

## Правила JSX {/*the-rules-of-jsx*/}

### 1. Возвращайте один корневой элемент {/*1-return-a-single-root-element*/}

Если вам нужно вернуть несколько элементов в компоненте, **оберните их в один родительский тег.**

Например, можно использовать `<div>`:

```js {1,11}
<div>
  <h1>Задачи Hedy Lamarr's</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


Если вы не хотите добавлять дополнительный `<div>` в разметку, можно воспользоваться тегами `<>` и `</>`:

```js {1,11}
<>
  <h1>Задачи Hedy Lamarr's</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Этот пустой тег называется *[Фрагмент.](/reference/react/Fragment)* Фрагменты позволяют группировать элементы разметки не внедряя дополнительные теги и не изменяя древо HTML в браузере.

<DeepDive>

#### Почему несколько JSX тегов нужно объединять? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX выглядит так же как HTML, но внутри конвертируется в обычные JavaScript объекты. Нельзя вернуть два объекта из функции без объединения в один массив. Это также объясняет почему нельзя возвращать два JSX тега без их объединения в один тег или Фрагмент.

</DeepDive>

### 2. Закрывайте все теги {/*2-close-all-the-tags*/}

JSX требует закрывать все теги: самозакрывающиеся теги, такие как `<img>` должны меняться на `<img />`, а объединяющие теги, такие как `<li>oranges` должны изменяться на `<li>oranges</li>`.
Вот так изображение Hedy Lamarr и список выглядят закрытыми:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Придумать новые светофоры
    <li>Отрепетировать сцену из фильма
    <li>Улучшить спектральный сенсор
  </ul>
</>
```

### 3. Используйте camelCase для <s>всех</s> большинства вещей! {/*3-camelcase-salls-most-of-the-things*/}

JSX конвертируется в JavaScript и все атрибуты становятся ключами JavaScript объекта. В компонентах вам часто потребуется считывать эти атрибуты и присваивать переменным. Но в JavaScript есть ограничения для названий переменных. Например, переменные не могут содержать тире или или называться так само, как и зарезервированные слова, например `class`.

Поэтому в React для большинства HTML и SVG атрибутов используется camelCase. Например, вместо `stroke-width` следует использовать `strokeWidth`. Поскольку `class` — зарезервированное слово, вместо него в React следует использовать `className`, название, [соответствующее свойству DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

Вы можете [найти все эти атрибуты в списке свойств DOM компонентов.](/reference/react-dom/components/common) Если вы напишите атрибут неправильно, React покажет сообщение с возможным решением проблемы в [консоли браузера.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

По историческим причинам атрибуты [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) и [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) пишутся с тире, как и в HTML.

</Pitfall>

### Подсказка: Используйте конвертор JSX {/*pro-tip-use-a-jsx-converter*/}

Конвертация всех атрибутов в уже существующей разметке может быть утомительной. Мы рекомендуем использовать [конвертор](https://transform.tools/html-to-jsx) чтобы конвертировать уже существующую HTML разметку в JSX. Конверторы очень полезны на практике, но вам все равно следует понимать правила, чтобы без проблем писать JSX самостоятельно.

Вот финальный результат:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Задачи Hedy Lamarr's</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Придумать новые светофоры
        <li>Отрепетировать сцену из фильма
        <li>Улучшить спектральный сенсор
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Теперь вы знаете, почему существует JSX и как его использовать в компонентах:

* React компоненты объединяют логику рендеринга и разметку, потому что они связаны между собой.
* JSX похож на HTML, но имеет свои отличия. При необходимости вы можете использовать [конвертор](https://transform.tools/html-to-jsx).
* Сообщения с ошибками зачастую направят вас в нужном направлении для решения ошибок разметки.

</Recap>



<Challenges>

#### Конвертируйте HTML в JSX {/*convert-some-html-to-jsx*/}

Эта HTML разметка была перенесена в компонент, но это неправильный JSX. Исправьте его:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Добро пожаловать на мой сайт!</h1>
    </div>
    <p class="summary">
      Здесь я публикую свои мысли.
      <br><br>
      <b>И <i>изображения</b></i> ученых!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Вы можете конвертировать HTML самостоятельно или воспользоваться конвертором.

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Добро пожаловать на мой сайт!</h1>
      </div>
      <p className="summary">
        Здесь я публикую свои мысли.
        <br /><br />
        <b>И <i>изображения</i></b> ученых!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
