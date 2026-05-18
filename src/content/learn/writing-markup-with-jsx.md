---
title: Writing Markup with JSX
---

<Intro>

*JSX* — это синтаксическое расширение для JavaScript, которое позволяет писать разметку в стиле HTML внутри файла JavaScript. Хотя существуют и другие способы написания компонентов, большинство разработчиков React предпочитают краткость JSX, и большинство кодовых баз его используют.

</Intro>

<YouWillLearn>

* Почему React смешивает разметку с логикой рендеринга
* Чем JSX отличается от HTML
* Как отображать информацию с помощью JSX

</YouWillLearn>

## JSX: Разметка внутри JavaScript {/*jsx-putting-markup-into-javascript*/}

Веб построен на HTML, CSS и JavaScript. Долгие годы веб-разработчики хранили контент в HTML, дизайн — в CSS, а логику — в JavaScript, часто в отдельных файлах! Контент размечался внутри HTML, в то время как логика страницы жила отдельно в JavaScript:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML-разметка с фиолетовым фоном и div с двумя дочерними тегами: p и form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Три обработчика JavaScript с желтым фоном: onSubmit, onLogin и onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Но по мере того, как веб становился более интерактивным, логика всё чаще определяла контент. JavaScript отвечал за HTML! Именно поэтому **в React логика рендеринга и разметка живут вместе в одном месте — компонентах.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React-компонент со смешанным HTML и JavaScript из предыдущих примеров. Имя функции — Sidebar, которая вызывает функцию isLoggedIn, выделенную желтым цветом. Внутри функции, выделенной фиолетовым, находится тег p из предыдущего примера и тег Form, ссылающийся на компонент, показанный на следующем рисунке.">

React-компонент `Sidebar.js`

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React-компонент со смешанным HTML и JavaScript из предыдущих примеров. Имя функции — Form, содержащее два обработчика onClick и onSubmit, выделенных желтым цветом. После обработчиков следует HTML, выделенный фиолетовым. HTML содержит элемент form с вложенным элементом input, каждый из которых имеет пропс onClick.">

React-компонент `Form.js`

</Diagram>

</DiagramGroup>

Совместное хранение логики рендеринга кнопки и её разметки гарантирует, что они будут синхронизированы при каждом изменении. И наоборот, несвязанные детали, такие как разметка кнопки и разметка боковой панели, изолированы друг от друга, что делает их изменение по отдельности более безопасным.

Каждый React-компонент — это функция JavaScript, которая может содержать разметку, которую React отображает в браузере. React-компоненты используют синтаксическое расширение под названием JSX для представления этой разметки. JSX очень похож на HTML, но он немного строже и может отображать динамическую информацию. Лучший способ понять это — преобразовать некоторую HTML-разметку в JSX-разметку.

<Note>

JSX и React — это две разные вещи. Они часто используются вместе, но вы *можете* [использовать их независимо](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) друг от друга. JSX — это синтаксическое расширение, а React — это JavaScript-библиотека.

</Note>

## Преобразование HTML в JSX {/*converting-html-to-jsx*/}

Предположим, у вас есть валидный HTML:

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

И вы хотите поместить его в свой компонент:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Если вы скопируете и вставите его как есть, это не сработает:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Это потому, что JSX строже и имеет несколько больше правил, чем HTML! Если вы прочитаете сообщения об ошибках выше, они помогут вам исправить разметку, или вы можете следовать приведенному ниже руководству.

<Note>

В большинстве случаев сообщения об ошибках React на экране помогут вам найти проблему. Прочитайте их, если застрянете!

</Note>

## Правила JSX {/*the-rules-of-jsx*/}

### 1. Возвращайте один корневой элемент {/*1-return-a-single-root-element*/}

Чтобы вернуть несколько элементов из компонента, **оберните их в один родительский тег.**

Например, вы можете использовать `<div>`:

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
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


Если вы не хотите добавлять лишний `<div>` в свою разметку, вы можете вместо этого использовать `<>` и `</>`:

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
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

Этот пустой тег называется *[Фрагментом.](/reference/react/Fragment)* Фрагменты позволяют группировать элементы, не оставляя следов в DOM-дереве браузера.

<DeepDive>

#### Почему несколько JSX-тегов нужно оборачивать? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX выглядит как HTML, но под капотом он преобразуется в обычные объекты JavaScript. Вы не можете вернуть два объекта из функции, не обернув их в массив. Это объясняет, почему вы также не можете вернуть два JSX-тега без оборачивания их в другой тег или Фрагмент.

</DeepDive>

### 2. Закрывайте все теги {/*2-close-all-the-tags*/}

JSX требует явного закрытия тегов: самозакрывающиеся теги, такие как `<img>`, должны стать `<img />`, а оборачивающие теги, такие как `<li>oranges`, должны быть написаны как `<li>oranges</li>`.

Вот как выглядят закрытые изображение и элементы списка Хеди Ламарр:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. camelCase <s>все</s> большинство вещей! {/*3-camelcase-salls-most-of-the-things*/}

JSX преобразуется в JavaScript, а атрибуты, написанные в JSX, становятся ключами объектов JavaScript. В ваших собственных компонентах вы часто захотите считывать эти атрибуты в переменные. Но JavaScript имеет ограничения на имена переменных. Например, их имена не могут содержать дефисы или быть зарезервированными словами, такими как `class`.

Именно поэтому в React многие атрибуты HTML и SVG пишутся в camelCase. Например, вместо `stroke-width` вы используете `strokeWidth`. Поскольку `class` является зарезервированным словом, в React вместо него используется `className`, названный в честь [соответствующего DOM-свойства](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

Вы можете [найти все эти атрибуты в списке DOM-пропсов компонентов.](/reference/react-dom/components/common) Если вы ошибетесь, не волнуйтесь — React выведет сообщение с возможной коррекцией в [консоль браузера.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

По историческим причинам атрибуты [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) и [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) пишутся как в HTML, с дефисами.

</Pitfall>

### Профессиональный совет: Используйте JSX-конвертер {/*pro-tip-use-a-jsx-converter*/}

Преобразование всех этих атрибутов в существующей разметке может быть утомительным! Мы рекомендуем использовать [конвертер](https://transform.tools/html-to-jsx) для перевода вашего существующего HTML и SVG в JSX. Конвертеры очень полезны на практике, но все же стоит понимать, что происходит, чтобы вы могли уверенно писать JSX самостоятельно.

Вот ваш окончательный результат:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
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

* React-компоненты объединяют логику рендеринга с разметкой, потому что они связаны.
* JSX похож на HTML, с некоторыми отличиями. Вы можете использовать [конвертер](https://transform.tools/html-to-jsx), если вам это нужно.
* Сообщения об ошибках часто указывают правильное направление для исправления вашей разметки.

</Recap>



<Challenges>

#### Преобразуйте HTML в JSX {/*convert-some-html-to-jsx*/}

Этот HTML был вставлен в компонент, но он не является валидным JSX. Исправьте его:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
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

Делать это вручную или с помощью конвертера — решать вам!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
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
