---
id: accessibility
title: Доступность контента
permalink: docs/accessibility.html
---

## Что такое доступность контента? {#why-accessibility}

Доступность контента -- это специальные технические и архитектурные решения, которые помогают людям с ограниченными способностями использовать веб-сайты. Применение таких решений необходимо для интерпритации страниц техническими средствами реаблилитации, встроенными в операционные системы и браузеры. Термин **«доступность контента»** также может обозначаться аббривеатурой [**a11y**](https://en.wiktionary.org/wiki/a11y).

React с помощью стандартных возможностей HTML позволяет создавать сайты, обеспечивающие доступность контента.

## Стандарты и руководства {#standards-and-guidelines}

### Руководство по обеспечению доступности контента (WCAG) {#wcag}

[Руководство по обеспечению доступности контента (WCAG)](https://www.w3.org/Translations/WCAG20-ru), разработанное консорциумом W3C, описывает правила создания сайтов с доступным контентом.

Также есть ресурсы с перечнями рекомендаций по реализации требований WCAG, например:

- [рекомендации от Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [рекомендации от WebAIM](https://webaim.org/standards/wcag/checklist)
- [рекомендации от Проекта A11Y](https://a11yproject.com/checklist.html)

### Доступность контента в веб-приложениях (WAI-ARIA) {#wai-aria}

[Свод правил по доступности контента в веб-приложениях (WAI-ARIA)](https://www.w3.org/WAI/intro/aria) -- это документ, который посвящен реализации требований по доступности контента при разработке JavaScript-программ.

Нужно отметить, что все HTML-атрибуты `aria-*` полностью поддерживаются в JSX. При этом хотя большинство DOM-свойств и атрибутов в React оформляются с использованием регистра в стиле camelCased, атрибуты `aria-*` должны быть оформлены с разделением дефисами (hyphen-cased). Ещё такой стиль известен под названиями кебаб (kebab-case) или лисп (lisp-case). Вот как выглядит оформление в чистом HTML без использования JSX:

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

Семантическая вёрстка -- это основа доступности контента в веб-приложениях. Используя различные HTML-элементы  можно улучшить восприимчивость и понятность ваших сайтов. Это позволяет обеспечить доступность контента без усилий.

- [описание всех HTML-элементов на MDN](https://developer.mozilla.org/ru/docs/Web/HTML/Element)

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

Коллекцию объектов можно отобразить в виде массива фрагментов или любых других элементов:

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

Обратите внимание, что не все инструменты поддерживают сокращённую запись. Подробности в [документации на фрагменты](/docs/fragments.html).

## Доступность контента в формах {#accessible-forms}

### Подписи {#labeling}

Каждый элемент управления, например, `<input>` или `<textarea>`, должны иметь подпись, обеспечивающую доступность контента. Подписи нужно выполнять так, чтобы их могли использовать экранные считывающие устройства и другие технические средства реабилитации.

Вот рекомендации о том, как это делать:

- [демонстрация подписи элементов от консорциума W3C](https://www.w3.org/WAI/tutorials/forms/labels/)
- [демонстрация подписи элементов от WebAIM](https://webaim.org/techniques/forms/controls)
- [разъяснения по доступности наименований от Paciello Group](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Эти стандартные для HTML способы могут использоваться в React напрямую, однако не забыватье, что атрибут `for` в JSX записывается как `htmlFor`:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### Сообщения об ошибках {#notifying-the-user-of-errors}

Необходимо, чтобы ошибки и их причины были понятны всем пользователям. Далее приведены ресурсы, которые демонстрируют, как правильно воспроизводить текст сообщений об ошибках с помощью экранных считывающих устройств:

- [примеры сообщений от W3C](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [порядок валидации форм от WebAIM](https://webaim.org/techniques/formvalidation/)

## Управление фокусом {#focus-control}

Приложение с доступным контентом должно быть полностью функционально при работе только с клавиатурой. Убедитесь соответствует ли ваше приложение этому требованию:

- [обсуждение доступности контента при работе с клавиатурой на сайте WebAIM](https://webaim.org/techniques/keyboard/)

### Фокус клавиатуры и контур элемента {#keyboard-focus-and-focus-outline}

Фокус клавиатуры указывает на тот элемент в структуре DOM, который в данный момент готов к вводу. Обычно такой элемент выделяется контуром, как это показано на рисунке:

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

Если вы заменяете стандартную реализацию фокуса своей, удалить контуры элементов можно с помощью CSS, установив `outline: 0`.

### Механизмы для перехода к нужному контенту {#mechanisms-to-skip-to-desired-content}

Также на сайте нужно реализовать механизмы, которые помогают пользователям быстро переходить к нужному контенту с помощью клавиатуры.

Ссылки для быстрого перехода -- это скрытые навигационные ссылки, которые становятся видимыми, когда пользователи взаимодействуют со страницей с помощью клавиатуры. Такие ссылки очень легко сделать используя внутренние якоря страницы и CSS:

- [WebAIM - ссылки для быстрого перехода](https://webaim.org/techniques/skipnav/)

Элементы семантической вёрстки, например, `<main>` или `<aside>`, нужно использовать для секционной разметки, предназначенной для быстрого перехода между логическими частями сайта.

Узнать больше о применении секционной разметки для улучшения доступности контента можно здесь:

- [использование секционной разметки](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Программное управление фокусом {#programmatically-managing-focus}

React-приложения во время своей работы постоянно изменяют структуру DOM. При этом фокус клавиатуры может быть потерян или может перейти на неправильный элемент. Чтобы исправить такую ситуацию, нужно программно перевести фокус клавиатуры на нужный элемент. Например, после закрытия модального окна перевести фокус клавиатуры на кнопку, которая его открыла.

В статье на MDN рассматриваются способы [навигации с клавиатуры в JavaScript](https://developer.mozilla.org/ru/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Чтобы устанавливать фокус в React, можно использовать [рефы на DOM-элементы](/docs/refs-and-the-dom.html).

Используя такой подход мы сначала создаём в классе компонента реф на элемент в JSX:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Создаём реф для сохранения textInput-элемента
    this.textInput = React.createRef();
  }
  render() {
  // Используем вызов рефа для связи DOM-элемента
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

Теперь мы можем устанавливать фокус из любого места компонента когда нам это необходимо:

 ```javascript
 focus() {
   // Устанавливаем фокус на текстовое поле используя вызов низкоуровневого API DOM
   // Внимание: мы обращаемся к свойству "current", чтобы получить DOM-элемент
   this.textInput.current.focus();
 }
 ```

Иногда родительскому компоненту нужно установить фокус на элемент дочернего компонента. Мы можем сделать это с помощью [рефа на родительский компонент](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components), который присваивается специальному свойству дочернего компонента для перевода родительского рефа на дочерний DOM-элемент.

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

// Теперь при необходимости можно устанавливать фокус на поле.
this.inputElement.current.focus();
```

Если для расширения функциональности компонент оборачивается компонентом высшего порядка (Higher-Order Component, HOC), то рекомендуется [перенаправлять рефы](/docs/forwarding-refs.html) обёрнутого компонента с помощью React-функции `forwardRef`. В случае, когда HOC сторонней разработки не поддерживает перенаправление рефов, описанный выше паттерн всё равно можно использовать в качестве запасного варианта.

Отличный пример управления фокусом показан в проекте [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Этот достаточно редкий случай реализации модального окна, с полностью доступным контентом. В нём кроме установки фокуса на кнопку отмены и перемещения фокуса внутри модальной формы сделан возврат на элемент, инициировавший вызов модального окна. Нужно отметить, что первоначальная установка фокуса на кнопку отмены в модальном окне предотвращает случайное нажатие на клавиатуре кнопки подтверждения запрашиваемого действия.

>Обратите внимание:
>
>Правильное управление фокусом -- это важный момент в обеспечении доступности контента, однако стоит применять его с умом.
>Используйте управление фокусом для восстановления нарушенной последовательности действий при работе с клавиатурой.
>Не стоит предугадывать желания пользователя и подталкивать его к каким-либо действиям в приложении.

## Mouse and pointer events {#mouse-and-pointer-events}

Ensure that all functionality exposed through a mouse or pointer event can also be accessed using the keyboard alone. Depending only on the pointer device will lead to many cases where
keyboard users cannot use your application.

To illustrate this, let's look at a prolific example of broken accessibility caused by click events. This is the outside click pattern, where a user can disable an opened popover by clicking outside the element.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

This is typically implemented by attaching a `click` event to the `window` object that closes the popover:

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

This may work fine for users with pointer devices, such as a mouse, but operating this with the keyboard alone leads to broken functionality when tabbing to the next element
as the `window` object never receives a `click` event. This can lead to obscured functionality which blocks users from using your application.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

The same functionality can be achieved by using an appropriate event handlers instead, such as `onBlur` and `onFocus`:

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

  // We close the popover on the next tick by using setTimeout.
  // This is necessary because we need to first check if
  // another child of the element has received focus as
  // the blur event fires prior to the new focus event.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // If a child receives focus, do not close the popover.
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

This code exposes the functionality to both pointer device and keyboard users. Also note the added `aria-*` props to support screen-reader users. For simplicity's sake
the keyboard events to enable `arrow key` interaction of the popover options have not been implemented.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

This is one example of many cases where depending on only pointer and mouse events will break functionality for keyboard users. Always testing with the keyboard will immediately
highlight the problem areas which can then be fixed by using keyboard aware event handlers.

## More Complex Widgets {#more-complex-widgets}

A more complex user experience should not mean a less accessible one. Whereas accessibility is most easily achieved by coding as close to HTML as possible,
even the most complex widget can be coded accessibly.

Here we require knowledge of [ARIA Roles](https://www.w3.org/TR/wai-aria/#roles) as well as [ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties).
These are toolboxes filled with HTML attributes that are fully supported in JSX and enable us to construct fully accessible, highly functional React components.

Each type of widget has a specific design pattern and is expected to function in a certain way by users and user agents alike:

- [WAI-ARIA Authoring Practices - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Examples](https://heydonworks.com/practical_aria_examples/)
- [Inclusive Components](https://inclusive-components.design/)

## Other Points for Consideration {#other-points-for-consideration}

### Setting the language {#setting-the-language}

Indicate the human language of page texts as screen reader software uses this to select the correct voice settings:

- [WebAIM - Document Language](https://webaim.org/techniques/screenreader/#language)

### Setting the document title {#setting-the-document-title}

Set the document `<title>` to correctly describe the current page content as this ensures that the user remains aware of the current page context:

- [WCAG - Understanding the Document Title Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

We can set this in React using the [React Document Title Component](https://github.com/gaearon/react-document-title).

### Color contrast {#color-contrast}

Ensure that all readable text on your website has sufficient color contrast to remain maximally readable by users with low vision:

- [WCAG - Understanding the Color Contrast Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Everything About Color Contrast And Why You Should Rethink It](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - What is Color Contrast](https://a11yproject.com/posts/what-is-color-contrast/)

It can be tedious to manually calculate the proper color combinations for all cases in your website so instead, you can [calculate an entire accessible color palette with Colorable](https://jxnblk.com/colorable/).

Both the aXe and WAVE tools mentioned below also include color contrast tests and will report on contrast errors.

If you want to extend your contrast testing abilities you can use these tools:

- [WebAIM - Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## Development and Testing Tools {#development-and-testing-tools}

There are a number of tools we can use to assist in the creation of accessible web applications.

### The keyboard {#the-keyboard}

By far the easiest and also one of the most important checks is to test if your entire website can be reached and used with the keyboard alone. Do this by:

1. Plugging out your mouse.
1. Using `Tab` and `Shift+Tab` to browse.
1. Using `Enter` to activate elements.
1. Where required, using your keyboard arrow keys to interact with some elements, such as menus and dropdowns.

### Development assistance {#development-assistance}

We can check some accessibility features directly in our JSX code. Often intellisense checks are already provided in JSX aware IDE's for the ARIA roles, states and properties. We also
have access to the following tool:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

The [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin for ESLint provides AST linting feedback regarding accessibility issues in your JSX. Many
IDE's allow you to integrate these findings directly into code analysis and source code windows.

[Create React App](https://github.com/facebookincubator/create-react-app) has this plugin with a subset of rules activated. If you want to enable even more accessibility rules,
you can create an `.eslintrc` file in the root of your project with this content:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Testing accessibility in the browser {#testing-accessibility-in-the-browser}

A number of tools exist that can run accessibility audits on web pages in your browser. Please use them in combination with other accessibility checks mentioned here as they can only
test the technical accessibility of your HTML.

#### aXe, aXe-core and react-axe {#axe-axe-core-and-react-axe}

Deque Systems offers [aXe-core](https://github.com/dequelabs/axe-core) for automated and end-to-end accessibility tests of your applications. This module includes integrations for Selenium.

[The Accessibility Engine](https://www.deque.com/products/axe/) or aXe, is an accessibility inspector browser extension built on `aXe-core`.

You can also use the [react-axe](https://github.com/dylanb/react-axe) module to report these accessibility findings directly to the console while developing and debugging.

#### WebAIM WAVE {#webaim-wave}

The [Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) is another accessibility browser extension.

#### Accessibility inspectors and the Accessibility Tree {#accessibility-inspectors-and-the-accessibility-tree}

[The Accessibility Tree](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) is a subset of the DOM tree that contains accessible objects for every DOM element that should be exposed
to assistive technology, such as screen readers.

In some browsers we can easily view the accessibility information for each element in the accessibility tree:

- [Using the Accessibility Inspector in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Activate the Accessibility Inspector in Chrome](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)
- [Using the Accessibility Inspector in OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Screen readers {#screen-readers}

Testing with a screen reader should form part of your accessibility tests.

Please note that browser / screen reader combinations matter. It is recommended that you test your application in the browser best suited to your screen reader of choice.

### Commonly Used Screen Readers {#commonly-used-screen-readers}

#### NVDA in Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) or NVDA is an open source Windows screen reader that is widely used.

Refer to the following guides on how to best use NVDA:

- [WebAIM - Using NVDA to Evaluate Web Accessibility](https://webaim.org/articles/nvda/)
- [Deque - NVDA Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver in Safari {#voiceover-in-safari}

VoiceOver is an integrated screen reader on Apple devices.

Refer to the following guides on how activate and use VoiceOver:

- [WebAIM - Using VoiceOver to Evaluate Web Accessibility](https://webaim.org/articles/voiceover/)
- [Deque - VoiceOver for OS X Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver for iOS Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS in Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) or JAWS, is a prolifically used screen reader on Windows.

Refer to the following guides on how to best use JAWS:

- [WebAIM - Using JAWS to Evaluate Web Accessibility](https://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Other Screen Readers {#other-screen-readers}

#### ChromeVox in Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) is an integrated screen reader on Chromebooks and is available [as an extension](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) for Google Chrome.

Refer to the following guides on how best to use ChromeVox:

- [Google Chromebook Help - Use the Built-in Screen Reader](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic Keyboard Shortcuts Reference](https://www.chromevox.com/keyboard_shortcuts.html)
