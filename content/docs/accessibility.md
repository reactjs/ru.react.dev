---
id: accessibility
title: Доступность контента
permalink: docs/accessibility.html
---

## Что такое доступность контента? {#why-accessibility}

Доступность контента -- это специальные технические и архитектурные решения, которые помогают людям с ограниченными возможностями использовать сайты. Применение таких решений необходимо для интерпретации страниц техническими средствами реабилитации, встроенными в операционные системы и браузеры. Термин **«доступность контента»** также может обозначаться аббревиатурой [**a11y**](https://en.wiktionary.org/wiki/a11y).

React поддерживает создание сайтов c доступным контентом в том числе с помощью стандартных возможностей HTML.

## Стандарты и руководства {#standards-and-guidelines}

### Руководство по обеспечению доступности контента (WCAG) {#wcag}

[Руководство по обеспечению доступности контента (WCAG)](https://www.w3.org/Translations/WCAG20-ru), разработанное консорциумом W3C, описывает рекомендации по созданию сайтов с доступным контентом.

Также есть ресурсы с чек-листами требований WCAG, например:

- [рекомендации от Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [рекомендации от WebAIM](https://webaim.org/standards/wcag/checklist)
- [рекомендации от A11Y Project](https://a11yproject.com/checklist.html)

### Доступность контента в веб-приложениях (WAI-ARIA) {#wai-aria}

[Свод правил по доступности контента в веб-приложениях (WAI-ARIA)](https://www.w3.org/WAI/intro/aria) -- это документ, который посвящён реализации требований доступности контента при разработке JavaScript-программ и компонентов.

Нужно отметить, что все HTML-атрибуты `aria-*` полностью поддерживаются в JSX. Несмотря на то, что большинство DOM-свойств и атрибутов в React пишутся в стиле camelCase, атрибуты `aria-*` должны быть написаны с разделением дефисами. Такой стиль ещё известен как шашлычная нотация (kebab-case) или в стиле языка Лисп (lisp-case). Вот как выглядит такое оформление в чистом HTML без использования JSX:

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## Семантическая вёрстка {#semantic-html}

Семантическая вёрстка -- это основа доступности контента в веб-приложениях. Используя различные HTML-элементы можно улучшить восприимчивость и понятность ваших сайтов. Это позволяет сделать контент доступным без особых усилий.

- [Полный перечень HTML-элементов на MDN](https://developer.mozilla.org/ru/docs/Web/HTML/Element)

Бывают случаи, когда семантическая вёрстка нарушается. Например, при добавлении элемента `<div>` в JSX для обеспечения работоспособности кода на React. Особенно часто это случается при работе со списками (`<ol>`, `<ul>`, `<dl>`) или таблицами (`<table>`). В такой ситуации рекомендуется использовать [фрагменты](/docs/fragments.html), чтобы сгруппировать элементы, как это показано в примере:

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

Коллекцию элементов можно преобразовать в массив фрагментов или любых других элементов:

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // При отображении коллекций фрагменты обязательно должны иметь атрибут `key`
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Если нет необходимости использовать пропсы, то можно применять [сокращённую запись фрагментов](/docs/fragments.html#short-syntax):

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

Обратите внимание, что не все инструменты поддерживают сокращённую запись. Подробности в [документации фрагментов](/docs/fragments.html).

## Доступность контента в формах {#accessible-forms}

### Подписи {#labeling}

Каждый элемент управления, например, `<input>` или `<textarea>`, должен иметь подпись, обеспечивающую доступность контента. Подписи нужно выполнять так, чтобы их могли использовать экранные считывающие устройства и другие технические средства реабилитации.

Вот рекомендации о том, как это делать:

- [демонстрация подписи элементов от консорциума W3C](https://www.w3.org/WAI/tutorials/forms/labels/)
- [демонстрация подписи элементов от WebAIM](https://webaim.org/techniques/forms/controls)
- [разъяснения от Paciello Group по доступности наименований](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Эти стандартные для HTML способы могут использоваться в React напрямую, однако не забывайте, что атрибут `for` в JSX записывается как `htmlFor`:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### Сообщения об ошибках {#notifying-the-user-of-errors}

Необходимо, чтобы ошибки и их причины были понятны всем пользователям. Далее приведены ресурсы, которые демонстрируют, как правильно воспроизводить текст сообщений об ошибках с помощью экранных считывающих устройств:

- [W3C демонстрирует примеры уведомлений пользователя](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM описывает валидацию форм](https://webaim.org/techniques/formvalidation/)

## Управление фокусом {#focus-control}

Приложение с доступным контентом должно функционировать при использовании только клавиатуры. Убедитесь соответствует ли ваше приложение этому требованию:

- [обсуждение доступности контента при работе с клавиатурой на сайте WebAIM](https://webaim.org/techniques/keyboard/)

### Фокус клавиатуры и контур элемента {#keyboard-focus-and-focus-outline}

Фокус клавиатуры указывает на тот элемент в структуре DOM, который в данный момент готов принимать ввод с клавиатуры. Обычно такой элемент выделяется контуром, как это показано на рисунке:

<img src="../images/docs/keyboard-focus.png" alt="Синий контур вокруг выделенного элемента." />

Если вы заменяете стандартную реализацию фокуса своей, удалить контуры элементов можно с помощью CSS, установив `outline: 0`.

### Механизмы быстрого перехода к нужному контенту {#mechanisms-to-skip-to-desired-content}

Также на сайте нужно реализовать механизмы, которые помогают пользователям быстро переходить к нужному контенту с помощью клавиатуры.

<<<<<<< HEAD
Ссылки для быстрого перехода -- это скрытые навигационные ссылки, которые становятся видимыми, когда пользователи взаимодействуют со страницей с помощью клавиатуры. Такие ссылки очень легко сделать, используя внутренние якоря страницы и CSS:
=======
Skiplinks or Skip Navigation Links are hidden navigation links that only become visible when keyboard users interact with the page. They are very easy to implement with internal page anchors and some styling:
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

- [WebAIM – ссылки для быстрого перехода](https://webaim.org/techniques/skipnav/)

Элементы семантической вёрстки, например, `<main>` или `<aside>`, нужно использовать в качестве секционной разметки, предназначенной для быстрого перехода между логическими частями сайта.

Узнать больше о применении секционной разметки для улучшения доступности контента можно здесь:

- [использование секционной разметки](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Программное управление фокусом {#programmatically-managing-focus}

<<<<<<< HEAD
React-приложения во время своей работы постоянно изменяют структуру DOM. Иногда из-за этого фокус клавиатуры может быть потерян или может перейти на неправильный элемент. Чтобы исправить такую ситуацию, нужно запрограммировать перевод фокуса клавиатуры на нужный элемент. Например, после закрытия модального окна перевести фокус клавиатуры на кнопку, которая его открыла.
=======
Our React applications continuously modify the HTML DOM during runtime, sometimes leading to keyboard focus being lost or set to an unexpected element. In order to repair this, we need to programmatically nudge the keyboard focus in the right direction. For example, by resetting keyboard focus to a button that opened a modal window after that modal window is closed.
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

В статье на MDN рассматриваются способы [навигации с клавиатуры в JavaScript](https://developer.mozilla.org/ru/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Чтобы управлять фокусом в React, можно использовать [рефы на DOM-элементы](/docs/refs-and-the-dom.html).

При таком подходе мы сначала создаём в классе компонента реф на элемент в JSX:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Создаём реф для сохранения textInput-элемента
    this.textInput = React.createRef();
  }
  render() {
  // Используем колбэк-реф для связи DOM-элемента
  // с конкретным экземпляром поля.
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Теперь при необходимости можно установить фокус на этот элемент из любого места компонента:

 ```javascript
 focus() {
   // Устанавливаем фокус на текстовое поле, используя вызов низкоуровневого API DOM
   // Внимание: мы обращаемся к свойству «current», чтобы получить DOM-элемент
   this.textInput.current.focus();
 }
 ```

<<<<<<< HEAD
Иногда родительскому компоненту нужно установить фокус на элемент дочернего компонента. Мы можем сделать это с помощью [рефа на родительский компонент](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components), который присваивается специальному свойству дочернего компонента и используется для ссылки из родительского компонента на DOM-элемент дочернего.
=======
Sometimes a parent component needs to set focus to an element in a child component. We can do this by [exposing DOM refs to parent components](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components) through a special prop on the child component that forwards the parent's ref to the child's DOM node.
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Теперь при необходимости можно устанавливать фокус на поле `<input>`.
this.inputElement.current.focus();
```

<<<<<<< HEAD
Если для расширения функциональности компонент оборачивается компонентом высшего порядка, то рекомендуется [перенаправлять рефы](/docs/forwarding-refs.html) обёрнутого компонента с помощью React-функции `forwardRef`. В случае, когда сторонний HOC не поддерживает перенаправление рефов, описанный выше подход всё равно можно использовать в качестве запасного варианта.

Отличный пример управления фокусом показан в проекте [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Этот достаточно редкий случай реализации модального окна с полностью доступным контентом. В нём, кроме установки фокуса на кнопку отмены и перемещения фокуса внутри модальной формы, сделан возврат на элемент, инициировавший вызов модального окна. Нужно отметить, что первоначальная установка фокуса на кнопку отмены в модальном окне предотвращает случайное нажатие на клавиатуре кнопки подтверждения запрашиваемого действия.
=======
When using a HOC to extend components, it is recommended to [forward the ref](/docs/forwarding-refs.html) to the wrapped component using the `forwardRef` function of React. If a third party HOC does not implement ref forwarding, the above pattern can still be used as a fallback.

A great focus management example is the [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). This is a relatively rare example of a fully accessible modal window. Not only does it set initial focus on
the cancel button (preventing the keyboard user from accidentally activating the success action) and trap keyboard focus inside the modal, it also resets focus back to the element that initially triggered the modal.
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

>Примечание:
>
>Правильное управление фокусом -- это важный момент в обеспечении доступности контента, однако стоит применять его с умом.
>Используйте управление фокусом для восстановления нарушенной последовательности действий при работе с клавиатурой.
>Не стоит предугадывать желания пользователя и подталкивать его к каким-либо действиям в приложении.

## Работа с событиями мыши {#mouse-and-pointer-events}

<<<<<<< HEAD
Позаботьтесь, чтобы вся функциональность, связанная с событиями мыши, была доступна при работе только с клавиатурой. Если приложение сильно зависит от действий мыши, многие пользователи, которые используют только клавиатуру, не смогут работать с ним.
=======
Ensure that all functionality exposed through a mouse or pointer event can also be accessed using the keyboard alone. Depending only on the pointer device will lead to many cases where keyboard users cannot use your application.
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

Чтобы продемонстрировать это, рассмотрим подробный пример, когда доступность контента нарушается из-за ориентации только на щелчок мыши. В примере показан паттерн закрытия всплывающего списка при щелчке мышью за пределами этого элемента.

<img src="../images/docs/outerclick-with-mouse.gif" alt="Реализация паттерна закрытия всплывающего списка с помощью щелчка за его пределами." />

Обычно такая функциональность реализуется событием `click` объекта `window`, обработчик которого закрывает выпадающий список:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

<<<<<<< HEAD
Такой подход хорош для тех, кто использует мыши, тачпады или другие координатные устройства, однако для пользователей, работающих только с клавиатурой, он может стать причиной нарушения работы программы при попытке перехода к следующему элементу с помощью клавиши `Tab`. Причиной этого является то, что в данной ситуации объект `window` никогда не получит событие `click`. В итоге мы имеем заблокированную функциональность и невозможность продолжения работы с приложением.
=======
This may work fine for users with pointer devices, such as a mouse, but operating this with the keyboard alone leads to broken functionality when tabbing to the next element as the `window` object never receives a `click` event. This can lead to obscured functionality which blocks users from using your application.
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

<img src="../images/docs/outerclick-with-keyboard.gif" alt="Реализация паттерна закрытия списка с помощью щелчка за его пределами с возможностью выбора следующего элемента на клавиатуре." />

Подобное поведение можно получить используя обработчики сопутствующих событий, например, `onBlur` или `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // Мы закрываем выпадающий список по таймеру setTimeout.
  // Это нужно чтобы для дочерних элементов событие выделения
  // происходило перед событием получения фокуса.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Не закрывать выпадающий список при получении фокуса дочерним элементом.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React assists us by bubbling the blur and
    // focus events to the parent.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

<<<<<<< HEAD
С этой программой можно работать и с помощью клавиатуры, и с помощью координатного устройства. Также в неё добавлены атрибуты `aria-*` для людей, использующих экранные считывающие устройства. Для упрощения примера, в нём не реализовано перемещение по списку с помощью стрелок на клавиатуре.
=======
This code exposes the functionality to both pointer device and keyboard users. Also note the added `aria-*` props to support screen-reader users. For simplicity's sake the keyboard events to enable `arrow key` interaction of the popover options have not been implemented.
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

<img src="../images/docs/blur-popover-close.gif" alt="Теперь выпадающий список корректно работает и с мышью, и с клавиатурой." />

<<<<<<< HEAD
Это один из множества случаев, когда поведение программы зависит только от положения курсора и событий мыши, а для пользователей, работающих с клавиатурой, её функциональность недоступна. Тестирование пользовательского интерфейса с помощью клавиатуры позволяет быстро найти проблемные места, работу которых можно улучшить, используя обработчики событий клавиатуры.
=======
This is one example of many cases where depending on only pointer and mouse events will break functionality for keyboard users. Always testing with the keyboard will immediately highlight the problem areas which can then be fixed by using keyboard aware event handlers.
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

## Сложные компоненты {#more-complex-widgets}

<<<<<<< HEAD
Усложнение пользовательского интерфейса не должно ухудшать доступность контента. Несмотря на то, что лучший результат достигается при максимальном использовании синтаксиса HTML, даже очень сложный компонент можно сделать доступным для всех.
=======
A more complex user experience should not mean a less accessible one. Whereas accessibility is most easily achieved by coding as close to HTML as possible, even the most complex widget can be coded accessibly.
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

В руководстве по доступности контента в веб-приложениях собраны все необходимые сведения о [ролях ARIA](https://www.w3.org/TR/wai-aria/#roles), а также о [состояниях и свойствах ARIA](https://www.w3.org/TR/wai-aria/#states_and_properties). Описанные в руководствах HTML-атрибуты полностью поддерживаются в JSX. Используя их можно создавать функционально нагруженные и при этом полностью доступные React-компоненты.

Каждый тип компонентов имеет специфическую архитектуру и предполагает определённую функциональность, как для пользователей, так и для браузеров:

- [практические рекомендации WAI-ARIA по архитектуре и компонентам](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [примеры из блога Хейдона Пикеринга (Heydon Pickering)](https://heydonworks.com/practical_aria_examples/)
- [инклюзивные компоненты](https://inclusive-components.design/)

## На что ещё нужно обратить внимание {#other-points-for-consideration}

### Определение языка {#setting-the-language}

Обязательно указывайте язык текста на странице. Это необходимо для корректной установки опций экранных считывающих устройств:

- [WebAIM - определение языка страниц](https://webaim.org/techniques/screenreader/#language)

### Заголовок страницы {#setting-the-document-title}

Всегда устанавливайте заголовок `<title>` для правильного описания контента текущей страницы. Это позволит пользователю постоянно быть в курсе контекста страницы:

- [разъяснение требований WCAG к заголовкам](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

Реализовать эти требования в React можно с помощью [компонента `DocumentTitle`](https://github.com/gaearon/react-document-title).

### Цветовая контрастность {#color-contrast}

Убедитесь, что все тексты на вашем сайте имеют правильную цветовую контрастность, чтобы обеспечить максимальное удобство чтения для пользователей с плохим зрением:

- [разъяснение требований WCAG к цветовой контрастности](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [всё о цветовой контрастности и о том, почему вы должны переосмыслить подход к ней](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [статья о цветовой контрастности на сайте A11y Project](https://a11yproject.com/posts/what-is-color-contrast/)

Ручной расчёт правильных цветовых комбинаций для всех вариантов сайта может быть очень утомительным. Вместо этого вы можете рассчитать все необходимые палитры [с помощью Colorable](https://jxnblk.com/colorable/).

Оба инструмента, aXe и WAVE, о которых будет рассказано ниже, включают тесты контрастности. Они помогут выявить ошибки в подборе цветов.

Если вы хотите провести более полное тестирование контрастности, то можете воспользоваться этими программами:

- [WebAIM - Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## Инструменты для разработки и тестирования {#development-and-testing-tools}

Далее перечислены инструменты, которые могут быть полезны при разработке веб-приложений с доступным контентом.

### Тестирование клавиатуры {#the-keyboard}

Самый простой и одновременно наиболее важный вид проверки -- это тестирование клавиатуры. Такая проверка позволяет определить доступность контента на вашем сайте при работе только с клавиатурой. Чтобы протестировать клавиатуру, выполните следующие действия:

1. Отсоедините мышь.
1. Используйте `Tab` и `Shift+Tab` для перемещения по странице.
1. Используйте `Enter` для активации элементов.
1. Там, где необходимо, используйте клавиши со стрелками, например, для работы с меню или выпадающими списками.

### Инструменты разработчика {#development-assistance}

<<<<<<< HEAD
Выполнение некоторых требований по доступности контента можно контролировать непосредственно в JSX. Обычно среда разработки обладает средствами автоматической подстановки, которые могут использоваться при написании JSX для выбора ролей, состояний и свойств ARIA. Кроме этого можно воспользоваться следующими инструментами:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

Плагин [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) для ESLint выполняет проверку абстрактного синтаксического дерева JSX на предмет поиска проблем, связанных с доступностью контента. Многие среды разработки могут интегрироваться с этим инструментом и выводить сообщения линтера в окно анализа кода или прямо в окно исходного кода.

В [Create React App](https://github.com/facebookincubator/create-react-app) этот плагин используется с заранее установленным набором правил. Если необходимо задействовать дополнительные правила, вам нужно создать в корне проекта файл `.eslintrc` со следующим кодом:
=======
We can check some accessibility features directly in our JSX code. Often intellisense checks are already provided in JSX aware IDE's for the ARIA roles, states and properties. We also have access to the following tool:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

The [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin for ESLint provides AST linting feedback regarding accessibility issues in your JSX. Many IDE's allow you to integrate these findings directly into code analysis and source code windows.

[Create React App](https://github.com/facebookincubator/create-react-app) has this plugin with a subset of rules activated. If you want to enable even more accessibility rules, you can create an `.eslintrc` file in the root of your project with this content:
>>>>>>> 04f3dc58db98b6350912a2eff3abe6d20b31df3a

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Тестирование доступности контента в браузере {#testing-accessibility-in-the-browser}

Существуют инструменты для аудита доступности контента веб-страниц в браузере. Используйте их совместно с теми инструментами для проверки HTML, которые были описаны выше.

#### aXe, aXe-core и react-axe {#axe-axe-core-and-react-axe}

Компания Deque Systems предлагает модуль [aXe-core](https://github.com/dequelabs/axe-core) для автоматизированного и сквозного тестирования веб-приложений. Этот модуль имеет интеграцию с Selenium.

На основе `aXe-core` разработан продукт компании Deque Systems под названием [The Accessibility Engine](https://www.deque.com/products/axe/) или aXe. Это расширение для браузеров, предназначенное для комплексного тестирования доступности контента сайтов.

Также вы можете использовать модуль [react-axe](https://github.com/dylanb/react-axe) для вывода сообщений от aXe в консоль в процессе программирования или отладки.

#### WebAIM WAVE {#webaim-wave}

[Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) ещё одно расширение для браузера, которое используется для улучшения доступности контента веб-сайтов.

#### Инспекторы доступности контента и дерево доступности {#accessibility-inspectors-and-the-accessibility-tree}

[Дерево доступности](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) -- это подмножество DOM-дерева. В нём содержатся объекты, которые нужны для работы технологий поддержки доступности контента, например, для экранных считывающих устройств.

В некоторых браузерах можно легко получить информацию обо всех элементах в дереве доступности:

- [использование инспектора доступности в Firefox](https://developer.mozilla.org/ru/docs/Tools/Accessibility_inspector)
- [активация инспектора доступности в Chrome](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)
- [использование инспектора доступности в OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Экранные считывающие устройства {#screen-readers}

Проверка работы экранных считывающих устройств должна быть частью комплексного тестирования доступности контента.

Учтите, что сочетание браузера и экранного считывающего устройства имеет большое значение. Рекомендуется протестировать ваше приложение в том браузере, который лучше всего подходит для избранного вами экранного считывателя.

### Общедоступные экранные считыватели {#commonly-used-screen-readers}

#### NVDA в Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) или NVDA -- это широко распространённый экранный считыватель с открытым исходным кодом для Windows.

Вот несколько руководств по работе с NVDA:

- [WebAIM -- использование NVDA для улучшения доступности контента](https://webaim.org/articles/nvda/)
- [Deque -- сочетания клавиш для NVDA](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver в Safari {#voiceover-in-safari}

VoiceOver -- это экранный считыватель, встроенный в продукты Apple.

Здесь приведены руководства по активации и использованию VoiceOver:

- [WebAIM -- использование VoiceOver для улучшения доступности контента](https://webaim.org/articles/voiceover/)
- [Deque -- сочетания клавиш для VoiceOver в OS X](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque -- комбинации жестов для VoiceOver в iOS](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS в Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) or JAWS -- это экранный считыватель, который чаще всего используется в Windows.

Руководства по JAWS:

- [WebAIM -- использование JAWS для улучшения доступности контента](https://webaim.org/articles/jaws/)
- [Deque -- сочетания клавиш для JAWS](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Прочие экранные считыватели {#other-screen-readers}

#### ChromeVox в Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) -- это встроенный экранный считыватель для ноутбуков Chromebook. Он доступен для Google Chrome [в виде расширения](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=ru).

Ссылки на руководства по ChromeVox:

- [Google Chromebook -- как использовать встроенную программу чтения с экрана](https://support.google.com/chromebook/answer/7031755?hl=ru)
- [сочетания клавиш для ChromeVox](https://www.chromevox.com/keyboard_shortcuts.html)
