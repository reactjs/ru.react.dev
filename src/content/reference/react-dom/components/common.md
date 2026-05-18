---
title: "Common components (e.g. <div>)"
---

<Intro>

Все встроенные браузерные компоненты, такие как [`<div>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/div), поддерживают некоторые общие пропсы и события.

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### Общие компоненты (например, `<div>`) {/*common*/}

```js
<div className="wrapper">Какой-то контент</div>
```

[См. больше примеров ниже.](#usage)

#### Props {/*common-props*/}

Эти специальные пропсы React поддерживаются для всех встроенных компонентов:

* `children`: React-узел (элемент, строка, число, [портал](/reference/react-dom/createPortal), пустой узел, такой как `null`, `undefined` и булевы значения, или массив других React-узлов). Определяет содержимое внутри компонента. При использовании JSX вы обычно указываете пропс `children` неявно, вкладывая теги, например `<div><span /></div>`.

* `dangerouslySetInnerHTML`: Объект вида `{ __html: '<p>some html</p>' }` с необработанной строкой HTML внутри. Переопределяет свойство [`innerHTML`](https://developer.mozilla.org/ru/docs/Web/API/Element/innerHTML) DOM-узла и отображает переданный HTML внутри. Следует использовать с крайней осторожностью! Если HTML внутри не является доверенным (например, основан на пользовательских данных), вы рискуете создать уязвимость [XSS](https://ru.wikipedia.org/wiki/%D0%A1%D0%B0%D0%B9%D1%82-%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B8%D0%BD%D0%B3). [Подробнее об использовании `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: Объект `ref` из [`useRef`](/reference/react/useRef) или [`createRef`](/reference/react/createRef), или [`ref`-функция обратного вызова](#ref-callback), или строка для [устаревших `ref`](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs). Ваш `ref` будет заполнен DOM-элементом для этого узла. [Подробнее о манипулировании DOM с помощью `ref`.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Булево значение. Если `true`, подавляет предупреждение, которое React показывает для элементов, имеющих одновременно `children` и `contentEditable={true}` (что обычно не работает вместе). Используйте это, если вы создаете библиотеку текстового ввода, которая вручную управляет содержимым `contentEditable`.

* `suppressHydrationWarning`: Булево значение. При использовании [серверного рендеринга](/reference/react-dom/server) обычно появляется предупреждение, если сервер и клиент отображают разное содержимое. В редких случаях (например, временные метки) очень сложно или невозможно гарантировать точное совпадение. Если установить `suppressHydrationWarning` в `true`, React не будет предупреждать о несоответствиях в атрибутах и содержимом этого элемента. Это работает только на один уровень вглубь и предназначено для использования в качестве крайнего средства. Не злоупотребляйте этим. [Подробнее о подавлении ошибок гидратации.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: Объект со стилями CSS, например `{ fontWeight: 'bold', margin: 20 }`. Аналогично свойству DOM [`style`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/style), имена CSS-свойств должны быть написаны в стиле `camelCase`, например `fontWeight` вместо `font-weight`. В качестве значений можно передавать строки или числа. Если передать число, например `width: 100`, React автоматически добавит `px` ("пиксели") к значению, если это не [безразмерное свойство.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Мы рекомендуем использовать `style` только для динамических стилей, значения которых неизвестны заранее. В других случаях применение обычных CSS-классов с `className` более эффективно. [Подробнее о `className` и `style`.](#applying-css-styles)

Эти стандартные DOM-пропсы также поддерживаются для всех встроенных компонентов:

* [`accessKey`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/accesskey): Строка. Задает сочетание клавиш для элемента. [В целом не рекомендуется.](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/Attributes): Атрибуты ARIA позволяют указать информацию дерева доступности для этого элемента. Полный справочник см. в разделе [ARIA attributes](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/Attributes). В React все имена ARIA-атрибутов точно такие же, как в HTML.
* [`autoCapitalize`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/autocapitalize): Строка. Указывает, следует ли и как следует капитализировать ввод пользователя.
* [`className`](https://developer.mozilla.org/ru/docs/Web/API/Element/className): Строка. Задает имя CSS-класса элемента. [Подробнее о применении стилей CSS.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/contenteditable): Булево значение. Если `true`, браузер позволяет пользователю редактировать отображаемый элемент напрямую. Это используется для реализации библиотек ввода с форматированием, таких как [Lexical.](https://lexical.dev/) React выдает предупреждение, если вы пытаетесь передать дочерние элементы React элементу с `contentEditable={true}`, поскольку React не сможет обновить его содержимое после редактирования пользователем.
* [`data-*`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/data-*): Атрибуты данных позволяют прикрепить к элементу некоторые строковые данные, например `data-fruit="banana"`. В React они обычно не используются, так как вы обычно считываете данные из пропсов или состояния.
* [`dir`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/dir): Либо `'ltr'`, либо `'rtl'`. Задает направление текста элемента.
* [`draggable`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/draggable): Булево значение. Указывает, является ли элемент перетаскиваемым. Часть [HTML Drag and Drop API.](https://developer.mozilla.org/ru/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/enterKeyHint): Строка. Указывает, какое действие представить для клавиши Enter на виртуальных клавиатурах.
* [`htmlFor`](https://developer.mozilla.org/ru/docs/Web/API/HTMLLabelElement/htmlFor): Строка. Для [`<label>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/label) и [`<output>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/output) позволяет [связать метку с некоторым элементом управления.](/reference/react-dom/components/input#providing-a-label-for-an-input) То же, что и HTML-атрибут [`for`](https://developer.mozilla.org/ru/docs/Web/HTML/Attributes/for). React использует стандартные имена свойств DOM (`htmlFor`) вместо имен HTML-атрибутов.
* [`hidden`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/hidden): Булево значение или строка. Указывает, должен ли элемент быть скрыт.
* [`id`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/id): Строка. Задает уникальный идентификатор для этого элемента, который можно использовать для его последующего поиска или связи с другими элементами. Генерируйте его с помощью [`useId`](/reference/react/useId), чтобы избежать конфликтов между несколькими экземплярами одного и того же компонента.
* [`is`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/is): Строка. Если указано, компонент будет вести себя как [пользовательский элемент.](/reference/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/inputmode): Строка. Указывает, какой тип клавиатуры отображать (например, текстовую, числовую или телефонную).
* [`itemProp`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/itemprop): Строка. Указывает, какое свойство представляет элемент для сканеров структурированных данных.
* [`lang`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/lang): Строка. Задает язык элемента.
* [`onAnimationEnd`](https://developer.mozilla.org/ru/docs/Web/API/Element/animationend_event): Функция-обработчик [`AnimationEvent`](#animationevent-handler). Срабатывает по завершении CSS-анимации.
* `onAnimationEndCapture`: Версия `onAnimationEnd`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/ru/docs/Web/API/Element/animationiteration_event): Функция-обработчик [`AnimationEvent`](#animationevent-handler). Срабатывает по завершении итерации CSS-анимации и начале следующей.
* `onAnimationIterationCapture`: Версия `onAnimationIteration`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/ru/docs/Web/API/Element/animationstart_event): Функция-обработчик [`AnimationEvent`](#animationevent-handler). Срабатывает при начале CSS-анимации.
* `onAnimationStartCapture`: `onAnimationStart`, но срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/ru/docs/Web/API/Element/auxclick_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает при нажатии на не основной кнопкой указателя.
* `onAuxClickCapture`: Версия `onAuxClick`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: Функция-обработчик [`InputEvent`](#inputevent-handler). Срабатывает до изменения значения редактируемого элемента. React пока **не** использует нативное событие [`beforeinput`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/beforeinput_event), а пытается эмулировать его с помощью других событий.
* `onBeforeInputCapture`: Версия `onBeforeInput`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: Функция-обработчик [`FocusEvent`](#focusevent-handler). Срабатывает, когда элемент теряет фокус. В отличие от встроенного браузерного события [`blur`](https://developer.mozilla.org/ru/docs/Web/API/Element/blur_event), в React событие `onBlur` всплывает.
* `onBlurCapture`: Версия `onBlur`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/ru/docs/Web/API/Element/click_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает при нажатии основной кнопкой указателя.
* `onClickCapture`: Версия `onClick`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/ru/docs/Web/API/Element/compositionstart_event): Функция-обработчик [`CompositionEvent`](#compositionevent-handler). Срабатывает при начале новой сессии композиции [редактором метода ввода](https://developer.mozilla.org/ru/docs/Glossary/Input_method_editor).
* `onCompositionStartCapture`: Версия `onCompositionStart`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/ru/docs/Web/API/Element/compositionend_event): Функция-обработчик [`CompositionEvent`](#compositionevent-handler). Срабатывает при завершении или отмене сессии композиции [редактором метода ввода](https://developer.mozilla.org/ru/docs/Glossary/Input_method_editor).
* `onCompositionEndCapture`: Версия `onCompositionEnd`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/ru/docs/Web/API/Element/compositionupdate_event): Функция-обработчик [`CompositionEvent`](#compositionevent-handler). Срабатывает при получении [редактором метода ввода](https://developer.mozilla.org/ru/docs/Glossary/Input_method_editor) нового символа.
* `onCompositionUpdateCapture`: Версия `onCompositionUpdate`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/ru/docs/Web/API/Element/contextmenu_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда пользователь пытается открыть контекстное меню.
* `onContextMenuCapture`: Версия `onContextMenu`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/ru/docs/Web/API/Element/copy_event): Функция-обработчик [`ClipboardEvent`](#clipboardevent-handler). Срабатывает, когда пользователь пытается скопировать что-либо в буфер обмена.
* `onCopyCapture`: Версия `onCopy`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/ru/docs/Web/API/Element/cut_event): Функция-обработчик [`ClipboardEvent`](#clipboardevent-handler). Срабатывает, когда пользователь пытается вырезать что-либо в буфер обмена.
* `onCutCapture`: Версия `onCut`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает при двойном щелчке пользователя. Соответствует браузерному событию [`dblclick`](https://developer.mozilla.org/ru/docs/Web/API/Element/dblclick_event).
* `onDoubleClickCapture`: Версия `onDoubleClick`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/drag_event): Функция-обработчик [`DragEvent`](#dragevent-handler). Срабатывает во время перетаскивания пользователем.
* `onDragCapture`: Версия `onDrag`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dragend_event): Функция-обработчик [`DragEvent`](#dragevent-handler). Срабатывает, когда пользователь прекращает перетаскивание.
* `onDragEndCapture`: Версия `onDragEnd`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dragenter_event): Функция-обработчик [`DragEvent`](#dragevent-handler). Срабатывает, когда перетаскиваемое содержимое входит в допустимую область перетаскивания.
* `onDragEnterCapture`: Версия `onDragEnter`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dragover_event): Функция-обработчик [`DragEvent`](#dragevent-handler). Срабатывает в допустимой области перетаскивания, когда перетаскиваемое содержимое перемещается над ней. Здесь необходимо вызвать `e.preventDefault()`, чтобы разрешить перетаскивание.
* `onDragOverCapture`: Версия `onDragOver`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dragstart_event): Функция-обработчик [`DragEvent`](#dragevent-handler). Срабатывает, когда пользователь начинает перетаскивать элемент.
* `onDragStartCapture`: Версия `onDragStart`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/drop_event): Функция-обработчик [`DragEvent`](#dragevent-handler). Срабатывает, когда что-то перетаскивается в допустимую область перетаскивания.
* `onDropCapture`: Версия `onDrop`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: Функция-обработчик [`FocusEvent`](#focusevent-handler). Срабатывает, когда элемент получает фокус. В отличие от встроенного браузерного события [`focus`](https://developer.mozilla.org/ru/docs/Web/API/Element/focus_event), в React событие `onFocus` всплывает.
* `onFocusCapture`: Версия `onFocus`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/ru/docs/Web/API/Element/gotpointercapture_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда элемент программно захватывает указатель.
* `onGotPointerCaptureCapture`: Версия `onGotPointerCapture`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/ru/docs/Web/API/Element/keydown_event): Функция-обработчик [`KeyboardEvent`](#keyboardevent-handler). Срабатывает при нажатии клавиши.
* `onKeyDownCapture`: Версия `onKeyDown`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/ru/docs/Web/API/Element/keypress_event): Функция-обработчик [`KeyboardEvent`](#keyboardevent-handler). Устарело. Используйте `onKeyDown` или `onBeforeInput` вместо этого.
* `onKeyPressCapture`: Версия `onKeyPress`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/ru/docs/Web/API/Element/keyup_event): Функция-обработчик [`KeyboardEvent`](#keyboardevent-handler). Срабатывает при отпускании клавиши.
* `onKeyUpCapture`: Версия `onKeyUp`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/ru/docs/Web/API/Element/lostpointercapture_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда элемент перестает захватывать указатель.
* `onLostPointerCaptureCapture`: Версия `onLostPointerCapture`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает при нажатии указателя.
* `onMouseDownCapture`: Версия `onMouseDown`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseenter_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель перемещается внутрь элемента. Не имеет фазы захвата. Вместо этого `onMouseLeave` и `onMouseEnter` распространяются от покидаемого элемента к входящему.
* [`onMouseLeave`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseleave_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель перемещается за пределы элемента. Не имеет фазы захвата. Вместо этого `onMouseLeave` и `onMouseEnter` распространяются от покидаемого элемента к входящему.
* [`onMouseMove`](https://developer.mozilla.org/ru/docs/Web/API/Element/mousemove_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает при изменении координат указателя.
* `onMouseMoveCapture`: Версия `onMouseMove`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseout_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель перемещается за пределы элемента или во внутрь дочернего элемента.
* `onMouseOutCapture`: Версия `onMouseOut`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseup_event): Функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает при отпускании указателя.
* `onMouseUpCapture`: Версия `onMouseUp`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointercancel_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда браузер отменяет взаимодействие с указателем.
* `onPointerCancelCapture`: Версия `onPointerCancel`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerdown_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает при активации указателя.
* `onPointerDownCapture`: Версия `onPointerDown`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerenter_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель перемещается внутрь элемента. Не имеет фазы захвата. Вместо этого `onPointerLeave` и `onPointerEnter` распространяются от покидаемого элемента к входящему.
* [`onPointerLeave`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerleave_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель перемещается за пределы элемента. Не имеет фазы захвата. Вместо этого `onPointerLeave` и `onPointerEnter` распространяются от покидаемого элемента к входящему.
* [`onPointerMove`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointermove_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает при изменении координат указателя.
* `onPointerMoveCapture`: Версия `onPointerMove`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerout_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель перемещается за пределы элемента, если взаимодействие с указателем отменено, и [по ряду других причин.](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: Версия `onPointerOut`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerup_event): Функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель перестает быть активным.
* `onPointerUpCapture`: Версия `onPointerUp`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/ru/docs/Web/API/Element/paste_event): Функция-обработчик [`ClipboardEvent`](#clipboardevent-handler). Срабатывает, когда пользователь пытается вставить что-либо из буфера обмена.
* `onPasteCapture`: Версия `onPaste`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/ru/docs/Web/API/Element/scroll_event): Функция-обработчик [`Event`](#event-handler). Срабатывает при прокрутке элемента. Это событие не всплывает.
* `onScrollCapture`: Версия `onScroll`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement/select_event): Функция-обработчик [`Event`](#event-handler). Срабатывает после изменения выделения внутри редактируемого элемента, такого как `input`. React расширяет событие `onSelect` для работы с элементами `contentEditable={true}`. Кроме того, React расширяет его для срабатывания при пустом выделении и при редактировании (что может повлиять на выделение).
* `onSelectCapture`: Версия `onSelect`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/ru/docs/Web/API/Element/touchcancel_event): Функция-обработчик [`TouchEvent`](#touchevent-handler). Срабатывает, когда браузер отменяет сенсорное взаимодействие.
* `onTouchCancelCapture`: Версия `onTouchCancel`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/ru/docs/Web/API/Element/touchend_event): Функция-обработчик [`TouchEvent`](#touchevent-handler). Срабатывает при удалении одного или нескольких точек касания.
* `onTouchEndCapture`: Версия `onTouchEnd`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/ru/docs/Web/API/Element/touchmove_event): Функция-обработчик [`TouchEvent`](#touchevent-handler). Срабатывает при перемещении одной или нескольких точек касания.
* `onTouchMoveCapture`: Версия `onTouchMove`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/ru/docs/Web/API/Element/touchstart_event): Функция-обработчик [`TouchEvent`](#touchevent-handler). Срабатывает при размещении одной или нескольких точек касания.
* `onTouchStartCapture`: Версия `onTouchStart`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/ru/docs/Web/API/Element/transitionend_event): Функция-обработчик [`TransitionEvent`](#transitionevent-handler). Срабатывает по завершении CSS-перехода.
* `onTransitionEndCapture`: Версия `onTransitionEnd`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/ru/docs/Web/API/Element/wheel_event): Функция-обработчик [`WheelEvent`](#wheelevent-handler). Срабатывает при вращении колеса мыши пользователем.
* `onWheelCapture`: Версия `onWheel`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/Roles): Строка. Явно задает роль элемента для вспомогательных технологий.
* [`slot`](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/Roles): Строка. Задает имя слота при использовании Shadow DOM. В React эквивалентный шаблон обычно достигается путем передачи JSX в качестве пропсов, например `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/spellcheck): Булево значение или `null`. Если явно установлено в `true` или `false`, включает или отключает проверку орфографии.
* [`tabIndex`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/tabindex): Число. Переопределяет стандартное поведение кнопки Tab. [Избегайте использования значений, отличных от `-1` и `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/title): Строка. Задает текст всплывающей подсказки для элемента.
* [`translate`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/translate): Либо `'yes'`, либо `'no'`. Передача `'no'` исключает содержимое элемента из перевода.

Вы также можете передавать пользовательские атрибуты в качестве пропсов, например `mycustomprop="someValue"`. Это может быть полезно при интеграции со сторонними библиотеками. Имя пользовательского атрибута должно быть в нижнем регистре и не должно начинаться с `on`. Значение будет преобразовано в строку. Если передать `null` или `undefined`, пользовательский атрибут будет удален.

Эти события срабатывают только для элементов [`<form>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form):

* [`onReset`](https://developer.mozilla.org/ru/docs/Web/API/HTMLFormElement/reset_event): Функция-обработчик [`Event`](#event-handler). Срабатывает при сбросе формы.
* `onResetCapture`: Версия `onReset`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onSubmit`](https://developer.mozilla.org/ru/docs/Web/API/HTMLFormElement/submit_event): Функция-обработчик [`Event`](#event-handler). Срабатывает при отправке формы.
* `onSubmitCapture`: Версия `onSubmit`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)

Эти события срабатывают только для элементов [`<dialog>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/dialog). В отличие от браузерных событий, в React они всплывают:

* [`onCancel`](https://developer.mozilla.org/ru/docs/Web/API/HTMLDialogElement/cancel_event): Функция-обработчик [`Event`](#event-handler). Срабатывает, когда пользователь пытается закрыть диалоговое окно.
* `onCancelCapture`: Версия `onCancel`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)
* [`onClose`](https://developer.mozilla.org/ru/docs/Web/API/HTMLDialogElement/close_event): Функция-обработчик [`Event`](#event-handler). Срабатывает после закрытия диалогового окна.
* `onCloseCapture`: Версия `onClose`, которая срабатывает в [фазе захвата.](/learn/responding-to-events#capture-phase-events)

Эти события срабатывают только для элементов [`<details>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/details). В отличие от событий браузера, в React они всплывают:

* [`onToggle`](https://developer.mozilla.org/ru/docs/Web/API/HTMLDetailsElement/toggle_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда пользователь переключает состояние `details`.
* `onToggleCapture`: Версия `onToggle`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).

Эти события срабатывают для элементов [`<img>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/link) и SVG-элемента `<image>` ([SVG `<image>`](https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/SVG_Image_Tag)). В отличие от событий браузера, в React они всплывают:

* `onLoad`: Функция обработчика [`Event`](#event-handler). Срабатывает, когда ресурс был загружен.
* `onLoadCapture`: Версия `onLoad`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onError`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/error_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда ресурс не удалось загрузить.
* `onErrorCapture`: Версия `onError`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).

Эти события срабатывают для ресурсов, таких как [`<audio>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/audio) и [`<video>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/video). В отличие от событий браузера, в React они всплывают:

* [`onAbort`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/abort_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда ресурс не был полностью загружен, но не по причине ошибки.
* `onAbortCapture`: Версия `onAbort`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onCanPlay`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/canplay_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда данных достаточно для начала воспроизведения, но недостаточно для воспроизведения до конца без буферизации.
* `onCanPlayCapture`: Версия `onCanPlay`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onCanPlayThrough`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/canplaythrough_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда данных достаточно для воспроизведения до конца без буферизации.
* `onCanPlayThroughCapture`: Версия `onCanPlayThrough`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onDurationChange`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/durationchange_event): Функция обработчика [`Event`](#event-handler). Срабатывает при обновлении длительности медиа.
* `onDurationChangeCapture`: Версия `onDurationChange`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onEmptied`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/emptied_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда медиа стало пустым.
* `onEmptiedCapture`: Версия `onEmptied`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Функция обработчика [`Event`](#event-handler). Срабатывает, когда браузер встречает зашифрованные медиаданные.
* `onEncryptedCapture`: Версия `onEncrypted`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onEnded`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/ended_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда воспроизведение останавливается, потому что больше нечего воспроизводить.
* `onEndedCapture`: Версия `onEnded`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onError`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/error_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда ресурс не удалось загрузить.
* `onErrorCapture`: Версия `onError`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onLoadedData`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/loadeddata_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда загружен текущий кадр воспроизведения.
* `onLoadedDataCapture`: Версия `onLoadedData`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onLoadedMetadata`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда загружены метаданные.
* `onLoadedMetadataCapture`: Версия `onLoadedMetadata`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onLoadStart`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/loadstart_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда браузер начал загрузку ресурса.
* `onLoadStartCapture`: Версия `onLoadStart`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onPause`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/pause_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда медиа было поставлено на паузу.
* `onPauseCapture`: Версия `onPause`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onPlay`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/play_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда медиа больше не на паузе.
* `onPlayCapture`: Версия `onPlay`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onPlaying`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/playing_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда медиа начинает или возобновляет воспроизведение.
* `onPlayingCapture`: Версия `onPlaying`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onProgress`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/progress_event): Функция обработчика [`Event`](#event-handler). Срабатывает периодически во время загрузки ресурса.
* `onProgressCapture`: Версия `onProgress`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onRateChange`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/ratechange_event): Функция обработчика [`Event`](#event-handler). Срабатывает при изменении скорости воспроизведения.
* `onRateChangeCapture`: Версия `onRateChange`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* `onResize`: Функция обработчика [`Event`](#event-handler). Срабатывает при изменении размера видео.
* `onResizeCapture`: Версия `onResize`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onSeeked`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/seeked_event): Функция обработчика [`Event`](#event-handler). Срабатывает по завершении операции поиска.
* `onSeekedCapture`: Версия `onSeeked`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onSeeking`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/seeking_event): Функция обработчика [`Event`](#event-handler). Срабатывает при начале операции поиска.
* `onSeekingCapture`: Версия `onSeeking`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onStalled`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/stalled_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда браузер ожидает данные, но они продолжают не загружаться.
* `onStalledCapture`: Версия `onStalled`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onSuspend`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/suspend_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда загрузка ресурса была приостановлена.
* `onSuspendCapture`: Версия `onSuspend`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onTimeUpdate`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/timeupdate_event): Функция обработчика [`Event`](#event-handler). Срабатывает при обновлении текущего времени воспроизведения.
* `onTimeUpdateCapture`: Версия `onTimeUpdate`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onVolumeChange`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/volumechange_event): Функция обработчика [`Event`](#event-handler). Срабатывает при изменении громкости.
* `onVolumeChangeCapture`: Версия `onVolumeChange`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).
* [`onWaiting`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/waiting_event): Функция обработчика [`Event`](#event-handler). Срабатывает, когда воспроизведение остановилось из-за временного отсутствия данных.
* `onWaitingCapture`: Версия `onWaiting`, которая срабатывает в [фазе захвата](/learn/responding-to-events#capture-phase-events).

#### Оговорки {/*common-caveats*/}

- Вы не можете передавать одновременно `children` и `dangerouslySetInnerHTML`.
- Некоторые события (например, `onAbort` и `onLoad`) не всплывают в браузере, но всплывают в React.

---

### Функция обратного вызова `ref` {/*ref-callback*/}

Вместо объекта `ref` (например, возвращаемого [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)) вы можете передать функцию в атрибут `ref`.

```js
<div ref={(node) => {
  console.log('Присоединен', node);

  return () => {
    console.log('Очистка', node)
  }
}}>
```

[См. пример использования функции обратного вызова `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Когда DOM-узел `<div>` будет добавлен на экран, React вызовет вашу функцию обратного вызова `ref` с DOM-узлом `node` в качестве аргумента. Когда DOM-узел `<div>` будет удален, React вызовет функцию очистки, возвращенную из обратного вызова.

React также будет вызывать вашу функцию обратного вызова `ref` всякий раз, когда вы передаете *другую* функцию обратного вызова `ref`. В приведенном выше примере `(node) => { ... }` является другой функцией при каждом рендере. Когда ваш компонент повторно рендерится, *предыдущая* функция будет вызвана с `null` в качестве аргумента, а *следующая* функция будет вызвана с DOM-узлом.

#### Параметры {/*ref-callback-parameters*/}

* `node`: DOM-узел. React передаст вам DOM-узел при подключении `ref`. Если вы не передаете одну и ту же ссылку на функцию для обратного вызова `ref` при каждом рендере, обратный вызов будет временно очищен и пересоздан во время каждого повторного рендеринга компонента.

<Note>

#### React 19 добавил функции очистки для обратных вызовов `ref`. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

Для обеспечения обратной совместимости, если функция очистки не возвращается из обратного вызова `ref`, `node` будет вызван с `null` при отсоединении `ref`. Это поведение будет удалено в будущей версии.

</Note>

#### Возвращает {/*returns*/}

* **необязательно** `функция очистки`: Когда `ref` отсоединяется, React вызовет функцию очистки. Если функция не возвращается обратным вызовом `ref`, React вызовет обратный вызов снова с `null` в качестве аргумента при отсоединении `ref`. Это поведение будет удалено в будущей версии.

#### Оговорки {/*caveats*/}

* Когда включен Strict Mode, React **выполнит один дополнительный цикл настройки+очистки только для разработки** перед первой реальной настройкой. Это стресс-тест, который гарантирует, что ваша логика очистки "отражает" вашу логику настройки и что она останавливает или отменяет все, что делает настройка. Если это вызывает проблему, реализуйте функцию очистки.
* Когда вы передаете *другую* функцию обратного вызова `ref`, React вызовет функцию очистки *предыдущего* обратного вызова, если она предоставлена. Если функция очистки не определена, обратный вызов `ref` будет вызван с `null` в качестве аргумента. *Следующая* функция будет вызвана с DOM-узлом.

---

### Объект события React {/*react-event-object*/}

Ваши обработчики событий получат *объект события React*. Его также иногда называют "синтетическим событием".

```js
<button onClick={e => {
  console.log(e); // Объект события React
}} />
```

Он соответствует тому же стандарту, что и базовые события DOM, но исправляет некоторые несоответствия браузеров.

Некоторые события React не сопоставляются напрямую с нативными событиями браузера. Например, в `onMouseLeave` `e.nativeEvent` будет указывать на событие `mouseout`. Конкретное сопоставление не является частью публичного API и может измениться в будущем. Если вам по какой-либо причине нужно базовое событие браузера, прочитайте его из `e.nativeEvent`.

#### Свойства {/*react-event-object-properties*/}

Объекты событий React реализуют некоторые стандартные свойства [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event):

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): Булево значение. Возвращает, происходит ли всплытие события через DOM.
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): Булево значение. Возвращает, можно ли отменить событие.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): DOM-узел. Возвращает узел, к которому прикреплен текущий обработчик в дереве React.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): Булево значение. Возвращает, был ли вызван `preventDefault`.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Число. Возвращает, в какой фазе находится событие.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Булево значение. Возвращает, было ли событие инициировано пользователем.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): DOM-узел. Возвращает узел, на котором произошло событие (который может быть далеким потомком).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Число. Возвращает время, когда произошло событие.

Кроме того, объекты событий React предоставляют следующие свойства:

* `nativeEvent`: DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). Исходный объект события браузера.

#### Методы {/*react-event-object-methods*/}

Объекты событий React реализуют некоторые стандартные методы [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event):

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Предотвращает действие браузера по умолчанию для события.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Останавливает распространение события через дерево React.

Кроме того, объекты событий React предоставляют следующие методы:

* `isDefaultPrevented()`: Возвращает булево значение, указывающее, был ли вызван `preventDefault`.
* `isPropagationStopped()`: Возвращает булево значение, указывающее, был ли вызван `stopPropagation`.
* `persist()`: Не используется с React DOM. С React Native вызовите этот метод для чтения свойств события после события.
* `isPersistent()`: Не используется с React DOM. С React Native возвращает, был ли вызван `persist`.

#### Оговорки {/*react-event-object-caveats*/}

* Значения `currentTarget`, `eventPhase`, `target` и `type` отражают значения, которые ожидает ваш код React. Внутренне React прикрепляет обработчики событий к корневому узлу, но это не отражается в объектах событий React. Например, `e.currentTarget` может не совпадать с базовым `e.nativeEvent.currentTarget`. Для полифильных событий `e.type` (тип события React) может отличаться от `e.nativeEvent.type` (базовый тип).

---

### Функция обработчика `AnimationEvent` {/*animationevent-handler*/}

Тип обработчика событий для событий [CSS-анимации](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Параметры {/*animationevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### Функция обработчика `ClipboardEvent` {/*clipboadevent-handler*/}

Тип обработчика событий для событий [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Параметры {/*clipboadevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### Функция обработчика `CompositionEvent` {/*compositionevent-handler*/}

Тип обработчика событий для событий [редактора метода ввода (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Параметры {/*compositionevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### Функция обработчика `DragEvent` {/*dragevent-handler*/}

Тип обработчика событий для [API перетаскивания HTML](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Источник перетаскивания
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Цель перетаскивания
  </div>
</>
```

#### Параметры {/*dragevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  Он также включает унаследованные свойства [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Функция обработчика `FocusEvent` {/*focusevent-handler*/}

Тип обработчика событий для событий фокуса.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[См. пример.](#handling-focus-events)

#### Параметры {/*focusevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Функция обработчика `Event` {/*event-handler*/}

Тип обработчика событий для общих событий.

#### Параметры {/*event-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) без дополнительных свойств.

---

### Функция обработчика `InputEvent` {/*inputevent-handler*/}

Тип обработчика событий для события `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

####Параметры {/*inputevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### Функция обработчика `KeyboardEvent` {/*keyboardevent-handler*/}

Тип обработчика событий для событий клавиатуры.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[См. пример.](#handling-keyboard-events)

#### Параметры {/*keyboardevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Функция обработчика `MouseEvent` {/*mouseevent-handler*/}

Тип обработчика событий для событий мыши.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[См. пример.](#handling-mouse-events)

#### Параметры {/*mouseevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Функция обработчика `PointerEvent` {/*pointerevent-handler*/}

Тип обработчика событий для [событий указателя.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[См. пример.](#handling-pointer-events)

#### Параметры {/*pointerevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  Он также включает унаследованные свойства [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Функция обработчика `TouchEvent` {/*touchevent-handler*/}

Тип обработчика событий для [событий касания.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

####Параметры {/*touchevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Функция обработчика `TransitionEvent` {/*transitionevent-handler*/}

Тип обработчика событий для событий [CSS-переходов](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions).

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

####Параметры {/*transitionevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### Функция обработчика `UIEvent` {/*uievent-handler*/}

Тип обработчика событий для общих событий пользовательского интерфейса.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

####Параметры {/*uievent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### Функция обработчика `WheelEvent` {/*wheelevent-handler*/}

Тип обработчика событий для события `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

####Параметры {/*wheelevent-handler-parameters*/}

* `e`: [Объект события React](#react-event-object) с дополнительными свойствами [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  Он также включает унаследованные свойства [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent):

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent):

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Использование {/*usage*/}

### Применение CSS-стилей {/*applying-css-styles*/}

В React вы указываете CSS-класс с помощью [`className`.](https://developer.mozilla.org/ru/docs/Web/API/Element/className) Он работает так же, как атрибут `class` в HTML:

```js
<img className="avatar" />
```

Затем вы пишете CSS-правила для него в отдельном CSS-файле:

```css
/* В вашем CSS */
.avatar {
  border-radius: 50%;
}
```

React не предписывает, как добавлять CSS-файлы. В простейшем случае вы добавите тег [`<link>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/link) в ваш HTML. Если вы используете сборщик или фреймворк, обратитесь к его документации, чтобы узнать, как добавить CSS-файл в ваш проект.

Иногда значения стилей зависят от данных. Используйте атрибут `style`, чтобы передавать некоторые стили динамически:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


В приведенном выше примере `style={{}}` — это не специальный синтаксис, а обычный объект `{}` внутри фигурных скобок `style={ }` [JSX.](/learn/javascript-in-jsx-with-curly-braces) Мы рекомендуем использовать атрибут `style` только тогда, когда ваши стили зависят от переменных JavaScript.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Как условно применять несколько CSS-классов? {/*how-to-apply-multiple-css-classes-conditionally*/}

Чтобы условно применять CSS-классы, вам нужно самостоятельно сформировать строку `className` с помощью JavaScript.

Например, `className={'row ' + (isSelected ? 'selected': '')}` создаст либо `className="row"`, либо `className="row selected"` в зависимости от того, равно ли `isSelected` значению `true`.

Чтобы сделать это более читаемым, вы можете использовать небольшую вспомогательную библиотеку, такую как [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

Это особенно удобно, если у вас несколько условных классов:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Манипулирование DOM-узлом с помощью ref {/*manipulating-a-dom-node-with-a-ref*/}

Иногда вам нужно получить браузерный DOM-узел, связанный с тегом в JSX. Например, если вы хотите сфокусироваться на `<input>` при нажатии кнопки, вам нужно вызвать [`focus()`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/focus) для браузерного DOM-узла `<input>`.

Чтобы получить браузерный DOM-узел для тега, [объявите ref](/reference/react/useRef) и передайте его как атрибут `ref` этому тегу:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React поместит DOM-узел в `inputRef.current` после его отображения на экране.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Подробнее о [манипулировании DOM с помощью refs](/learn/manipulating-the-dom-with-refs) и [других примерах.](/reference/react/useRef#examples-dom)

Для более сложных случаев атрибут `ref` также принимает [функцию-колбэк.](#ref-callback)

---

### Опасное задание внутреннего HTML {/*dangerously-setting-the-inner-html*/}

Вы можете передать строку с необработанным HTML элементу следующим образом:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Это опасно. Как и в случае со встроенным свойством DOM [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), вы должны проявлять крайнюю осторожность! Если разметка не поступает из полностью доверенного источника, очень легко создать уязвимость [XSS](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%B6%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2%D0%BE%D0%B5_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5) таким образом.**

Например, если вы используете библиотеку Markdown, которая преобразует Markdown в HTML, вы доверяете тому, что ее парсер не содержит ошибок, и пользователь видит только свой ввод, вы можете отобразить полученный HTML следующим образом:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

Объект `{__html}` следует создавать как можно ближе к месту генерации HTML, как это делается в приведенном выше примере в функции `renderMarkdownToHTML`. Это гарантирует, что весь необработанный HTML, используемый в вашем коде, явно помечен как таковой, и что в `dangerouslySetInnerHTML` передаются только переменные, которые, как вы ожидаете, содержат HTML. Не рекомендуется создавать объект непосредственно, например `<div dangerouslySetInnerHTML={{__html: markup}} />`.

Чтобы увидеть, почему рендеринг произвольного HTML опасен, замените приведенный выше код на этот:

```js {1-4,7,8}
const post = {
  // Imagine this content is stored in the database.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

Код, встроенный в HTML, будет выполнен. Хакер может использовать эту дыру в безопасности для кражи информации пользователя или для выполнения действий от его имени. **Используйте `dangerouslySetInnerHTML` только с доверенными и очищенными данными.**

---

### Обработка событий мыши {/*handling-mouse-events*/}

Этот пример показывает некоторые распространенные [события мыши](#mouseevent-handler) и когда они срабатывают.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Обработка событий указателя {/*handling-pointer-events*/}

Этот пример показывает некоторые распространенные [события указателя](#pointerevent-handler) и когда они срабатывают.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Обработка событий фокуса {/*handling-focus-events*/}

В React [события фокуса](#focusevent-handler) всплывают. Вы можете использовать `currentTarget` и `relatedTarget`, чтобы различать, исходили ли события фокусировки или разфокусировки извне родительского элемента. Пример показывает, как обнаружить фокусировку на дочернем элементе, фокусировку на родительском элементе и как обнаружить вход или выход фокуса из всего поддерева.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Обработка событий клавиатуры {/*handling-keyboard-events*/}

Этот пример показывает некоторые распространенные [события клавиатуры](#keyboardevent-handler) и когда они срабатывают.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
