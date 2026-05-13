---
title: "Общие компоненты (например, <div>)"
---

<Intro>

Все встроенные компоненты браузера, такие как [`<div>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/div), поддерживают некоторые общие пропсы и события.

</Intro>

<InlineToc />

---

## Ссылка {/*reference*/}


### Общие компоненты (например, `<div>`) {/*common*/}

```js
<div className="wrapper">Некоторый контент</div>
```

[Больше примеров смотрите ниже.](#usage)


#### Пропсы {/*common-props*/}

Эти специальные пропсы React поддерживаются для всех встроенных компонентов:

*   `children`: React-узел (элемент, строка, число, [портал,](/reference/react-dom/createPortal) пустой узел, такой как `null`, `undefined` и булевы значения, или массив других React-узлов). Указывает содержимое внутри компонента. Когда вы используете JSX, вы обычно неявно указываете проп `children`, вкладывая теги, например `<div><span /></div>`.

*   `dangerouslySetInnerHTML`: Объект вида `{ __html: '<p>some html</p>' }` с необработанной HTML-строкой внутри. Переопределяет свойство [`innerHTML`](https://developer.mozilla.org/ru/docs/Web/API/Element/innerHTML) DOM-узла и отображает переданный HTML внутри. Это следует использовать с особой осторожностью! Если HTML внутри не является доверенным (например, если он основан на пользовательских данных), вы рискуете внедрить [XSS](https://ru.wikipedia.org/wiki/Межсайтовый_скриптинг)-уязвимость. [Подробнее об использовании `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

*   `ref`: Объект ref из [`useRef`](/reference/react/useRef) или [`createRef`](/reference/react/createRef), или [функция обратного вызова `ref`](#ref-callback), или строка для [устаревших refs.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Ваш ref будет заполнен DOM-элементом для этого узла. [Подробнее о манипулировании DOM с помощью refs.](#manipulating-a-dom-node-with-a-ref)

*   `suppressContentEditableWarning`: Булево значение. Если `true`, подавляет предупреждение, которое React показывает для элементов, у которых одновременно есть `children` и `contentEditable={true}` (которые обычно не работают вместе). Используйте это, если вы создаете библиотеку ввода текста, которая управляет содержимым `contentEditable` вручную.

*   `suppressHydrationWarning`: Булево значение. Если вы используете [рендеринг на сервере,](/reference/react-dom/server) обычно возникает предупреждение, когда сервер и клиент отображают разное содержимое. В некоторых редких случаях (например, метки времени) очень сложно или невозможно гарантировать точное соответствие. Если вы установите для `suppressHydrationWarning` значение `true`, React не будет предупреждать вас о несоответствиях в атрибутах и содержимом этого элемента. Это работает только на один уровень вглубь и предназначено для использования в качестве лазейки. Не злоупотребляйте этим. [Подробнее о подавлении ошибок гидратации.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

*   `style`: Объект со стилями CSS, например `{ fontWeight: 'bold', margin: 20 }`. Аналогично свойству DOM [`style`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/style), имена свойств CSS должны быть написаны в формате `camelCase`, например `fontWeight` вместо `font-weight`. Вы можете передавать строки или числа в качестве значений. Если вы передаете число, например `width: 100`, React автоматически добавит `px` ("пиксели") к значению, если это не [безунитарное свойство.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) Мы рекомендуем использовать `style` только для динамических стилей, когда вы не знаете значения стилей заранее. В других случаях применение обычных CSS-классов с помощью `className` более эффективно. [Подробнее о `className` и `style`.](#applying-css-styles)

Эти стандартные пропсы DOM также поддерживаются для всех встроенных компонентов:


*   [`accessKey`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/accesskey): Строка. Указывает сочетание клавиш для элемента. [Не рекомендуется к использованию.](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
*   [`aria-*`](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/Attributes): Атрибуты ARIA позволяют указать информацию дерева доступности для этого элемента. См. [Атрибуты ARIA](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/Attributes) для полной справки. В React все имена атрибутов ARIA точно такие же, как и в HTML.
*   [`autoCapitalize`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/autocapitalize): Строка. Указывает, следует ли и как капитализировать ввод пользователя.
*   [`className`](https://developer.mozilla.org/ru/docs/Web/API/Element/className): Строка. Указывает имя CSS-класса элемента. [Подробнее о применении стилей CSS.](#applying-css-styles)
*   [`contentEditable`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/contenteditable): Логическое значение. Если `true`, браузер позволяет пользователю напрямую редактировать отображаемый элемент. Это используется для реализации библиотек ввода форматированного текста, таких как [Lexical.](https://lexical.dev/) React выдаёт предупреждение, если вы пытаетесь передать дочерние элементы React элементу с `contentEditable={true}`, потому что React не сможет обновить его содержимое после редактирования пользователем.
*   [`data-*`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/data-*): Атрибуты данных позволяют прикрепить некоторые строковые данные к элементу, например `data-fruit="banana"`. В React они обычно не используются, потому что вместо этого вы обычно читаете данные из пропсов или состояния.
*   [`dir`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/dir): Либо `'ltr'`, либо `'rtl'`. Указывает направление текста элемента.
*   [`draggable`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/draggable): Логическое значение. Указывает, можно ли перетаскивать элемент. Часть [HTML Drag and Drop API.](https://developer.mozilla.org/ru/docs/Web/API/HTML_Drag_and_Drop_API)
*   [`enterKeyHint`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/enterKeyHint): Строка. Указывает, какое действие отображать для клавиши Enter на виртуальных клавиатурах.
*   [`htmlFor`](https://developer.mozilla.org/ru/docs/Web/API/HTMLLabelElement/htmlFor): Строка. Для [`<label>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/label) и [`<output>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/output) позволяет [связать метку с каким-либо элементом управления.](/reference/react-dom/components/input#providing-a-label-for-an-input) То же самое, что и [атрибут HTML `for`.](https://developer.mozilla.org/ru/docs/Web/HTML/Attributes/for) React использует стандартные имена свойств DOM (`htmlFor`) вместо имен атрибутов HTML.
*   [`hidden`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/hidden): Логическое значение или строка. Указывает, должен ли элемент быть скрыт.
*   [`id`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/id): Строка. Указывает уникальный идентификатор для этого элемента, который можно использовать для его последующего поиска или подключения к другим элементам. Сгенерируйте его с помощью [`useId`](/reference/react/useId), чтобы избежать конфликтов между несколькими экземплярами одного и того же компонента.
*   [`is`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/is): Строка. Если указано, компонент будет вести себя как [пользовательский элемент.](/reference/react-dom/components#custom-html-elements)
*   [`inputMode`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/inputmode): Строка. Указывает, какую клавиатуру отображать (например, текст, число или телефон).
*   [`itemProp`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/itemprop): Строка. Указывает, какое свойство представляет элемент для сканеров структурированных данных.
*   [`lang`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/lang): Строка. Указывает язык элемента.
*   [`onAnimationEnd`](https://developer.mozilla.org/ru/docs/Web/API/Element/animationend_event): Функция [обработчика `AnimationEvent`](#animationevent-handler). Срабатывает, когда завершается анимация CSS.
*   `onAnimationEndCapture`: Версия `onAnimationEnd`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onAnimationIteration`](https://developer.mozilla.org/ru/docs/Web/API/Element/animationiteration_event): Функция [обработчика `AnimationEvent`](#animationevent-handler). Срабатывает, когда заканчивается итерация анимации CSS и начинается другая.
*   `onAnimationIterationCapture`: Версия `onAnimationIteration`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onAnimationStart`](https://developer.mozilla.org/ru/docs/Web/API/Element/animationstart_event): Функция [обработчика `AnimationEvent`](#animationevent-handler). Срабатывает, когда начинается анимация CSS.
*   `onAnimationStartCapture`: `onAnimationStart`, но срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onAuxClick`](https://developer.mozilla.org/ru/docs/Web/API/Element/auxclick_event): Функция [обработчика `MouseEvent`](#mouseevent-handler). Срабатывает при нажатии кнопки указателя, отличной от основной.
*   `onAuxClickCapture`: Версия `onAuxClick`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   `onBeforeInput`: Функция [обработчика `InputEvent`](#inputevent-handler). Срабатывает до изменения значения редактируемого элемента. React *ещё* не использует нативное событие [`beforeinput`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/beforeinput_event), а вместо этого пытается полифилить его, используя другие события.
*   `onBeforeInputCapture`: Версия `onBeforeInput`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   `onBlur`: Функция [обработчика `FocusEvent`](#focusevent-handler). Срабатывает, когда элемент теряет фокус. В отличие от встроенного события браузера [`blur`](https://developer.mozilla.org/ru/docs/Web/API/Element/blur_event), в React событие `onBlur` всплывает.
*   `onBlurCapture`: Версия `onBlur`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onClick`](https://developer.mozilla.org/ru/docs/Web/API/Element/click_event): Функция [обработчика `MouseEvent`](#mouseevent-handler). Срабатывает при нажатии основной кнопки указывающего устройства.
*   `onClickCapture`: Версия `onClick`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onCompositionStart`](https://developer.mozilla.org/ru/docs/Web/API/Element/compositionstart_event): Функция [обработчика `CompositionEvent`](#compositionevent-handler). Срабатывает, когда [редактор метода ввода](https://developer.mozilla.org/ru/docs/Glossary/Input_method_editor) начинает новую сессию композиции.
*   `onCompositionStartCapture`: Версия `onCompositionStart`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onCompositionEnd`](https://developer.mozilla.org/ru/docs/Web/API/Element/compositionend_event): Функция [обработчика `CompositionEvent`](#compositionevent-handler). Срабатывает, когда [редактор метода ввода](https://developer.mozilla.org/ru/docs/Glossary/Input_method_editor) завершает или отменяет сессию композиции.
*   `onCompositionEndCapture`: Версия `onCompositionEnd`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onCompositionUpdate`](https://developer.mozilla.org/ru/docs/Web/API/Element/compositionupdate_event): Функция [обработчика `CompositionEvent`](#compositionevent-handler). Срабатывает, когда [редактор метода ввода](https://developer.mozilla.org/ru/docs/Glossary/Input_method_editor) получает новый символ.
*   `onCompositionUpdateCapture`: Версия `onCompositionUpdate`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onContextMenu`](https://developer.mozilla.org/ru/docs/Web/API/Element/contextmenu_event): Функция [обработчика `MouseEvent`](#mouseevent-handler). Срабатывает, когда пользователь пытается открыть контекстное меню.
*   `onContextMenuCapture`: Версия `onContextMenu`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onCopy`](https://developer.mozilla.org/ru/docs/Web/API/Element/copy_event): Функция [обработчика `ClipboardEvent`](#clipboardevent-handler). Срабатывает, когда пользователь пытается скопировать что-либо в буфер обмена.
*   `onCopyCapture`: Версия `onCopy`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onCut`](https://developer.mozilla.org/ru/docs/Web/API/Element/cut_event): Функция [обработчика `ClipboardEvent`](#clipboardevent-handler). Срабатывает, когда пользователь пытается вырезать что-либо в буфер обмена.
*   `onCutCapture`: Версия `onCut`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   `onDoubleClick`: Функция [обработчика `MouseEvent`](#mouseevent-handler). Срабатывает, когда пользователь дважды щелкает мышью. Соответствует событию браузера [`dblclick`.](https://developer.mozilla.org/ru/docs/Web/API/Element/dblclick_event)
*   `onDoubleClickCapture`: Версия `onDoubleClick`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onDrag`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/drag_event): Функция [обработчика `DragEvent`](#dragevent-handler). Срабатывает, когда пользователь перетаскивает что-либо.
*   `onDragCapture`: Версия `onDrag`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onDragEnd`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dragend_event): Функция [обработчика `DragEvent`](#dragevent-handler). Срабатывает, когда пользователь перестаёт перетаскивать что-либо.
*   `onDragEndCapture`: Версия `onDragEnd`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onDragEnter`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dragenter_event): Функция [обработчика `DragEvent`](#dragevent-handler). Срабатывает, когда перетаскиваемое содержимое входит в допустимую цель для сброса.
*   `onDragEnterCapture`: Версия `onDragEnter`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onDragOver`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dragover_event): Функция [обработчика `DragEvent`](#dragevent-handler). Срабатывает на допустимой цели для сброса, когда перетаскиваемое содержимое перетаскивается над ней. Здесь необходимо вызвать `e.preventDefault()`, чтобы разрешить сброс.
*   `onDragOverCapture`: Версия `onDragOver`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onDragStart`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dragstart_event): Функция [обработчика `DragEvent`](#dragevent-handler). Срабатывает, когда пользователь начинает перетаскивать элемент.
*   `onDragStartCapture`: Версия `onDragStart`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onDrop`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/drop_event): Функция [обработчика `DragEvent`](#dragevent-handler). Срабатывает, когда что-либо сбрасывается на допустимую цель для сброса.
*   `onDropCapture`: Версия `onDrop`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   `onFocus`: Функция [обработчика `FocusEvent`](#focusevent-handler). Срабатывает, когда элемент получает фокус. В отличие от встроенного события браузера [`focus`](https://developer.mozilla.org/ru/docs/Web/API/Element/focus_event), в React событие `onFocus` всплывает.
*   `onFocusCapture`: Версия `onFocus`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onGotPointerCapture`](https://developer.mozilla.org/ru/docs/Web/API/Element/gotpointercapture_event): Функция [обработчика `PointerEvent`](#pointerevent-handler). Срабатывает, когда элемент программно захватывает указатель.
*   `onGotPointerCaptureCapture`: Версия `onGotPointerCapture`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onKeyDown`](https://developer.mozilla.org/ru/docs/Web/API/Element/keydown_event): Функция [обработчика `KeyboardEvent`](#keyboardevent-handler). Срабатывает при нажатии клавиши.
*   `onKeyDownCapture`: Версия `onKeyDown`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onKeyPress`](https://developer.mozilla.org/ru/docs/Web/API/Element/keypress_event): Функция [обработчика `KeyboardEvent`](#keyboardevent-handler). Устаревшее. Используйте вместо него `onKeyDown` или `onBeforeInput`.
*   `onKeyPressCapture`: Версия `onKeyPress`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onKeyUp`](https://developer.mozilla.org/ru/docs/Web/API/Element/keyup_event): Функция [обработчика `KeyboardEvent`](#keyboardevent-handler). Срабатывает при отпускании клавиши.
*   `onKeyUpCapture`: Версия `onKeyUp`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onLostPointerCapture`](https://developer.mozilla.org/ru/docs/Web/API/Element/lostpointercapture_event): Функция [обработчика `PointerEvent`](#pointerevent-handler). Срабатывает, когда элемент перестаёт захватывать указатель.
*   `onLostPointerCaptureCapture`: Версия `onLostPointerCapture`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onMouseDown`](https://developer.mozilla.org/ru/docs/Web/API/Element/mousedown_event): Функция [обработчика `MouseEvent`](#mouseevent-handler). Срабатывает при нажатии указателя.
*   `onMouseDownCapture`: Версия `onMouseDown`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onMouseEnter`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseenter_event): Функция [обработчика `MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель перемещается внутрь элемента. Не имеет фазы перехвата. Вместо этого `onMouseLeave` и `onMouseEnter` распространяются от покидаемого элемента к входящему.
*   [`onMouseLeave`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseleave_event): Функция [обработчика `MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель перемещается за пределы элемента. Не имеет фазы перехвата. Вместо этого `onMouseLeave` и `onMouseEnter` распространяются от покидаемого элемента к входящему.


* `onMouseDownCapture`: версия `onMouseDown`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseenter_event): функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель мыши перемещается внутрь элемента. Не имеет фазы перехвата. Вместо этого `onMouseLeave` и `onMouseEnter` распространяются от покидаемого элемента к входящему.
* [`onMouseLeave`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseleave_event): функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель мыши перемещается за пределы элемента. Не имеет фазы перехвата. Вместо этого `onMouseLeave` и `onMouseEnter` распространяются от покидаемого элемента к входящему.
* [`onMouseMove`](https://developer.mozilla.org/ru/docs/Web/API/Element/mousemove_event): функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда изменяются координаты указателя мыши.
* `onMouseMoveCapture`: версия `onMouseMove`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseout_event): функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель мыши перемещается за пределы элемента или если он перемещается во вложенный элемент.
* `onMouseOutCapture`: версия `onMouseOut`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/ru/docs/Web/API/Element/mouseup_event): функция-обработчик [`MouseEvent`](#mouseevent-handler). Срабатывает, когда указатель мыши отпускается.
* `onMouseUpCapture`: версия `onMouseUp`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointercancel_event): функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда браузер отменяет взаимодействие с указателем.
* `onPointerCancelCapture`: версия `onPointerCancel`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerdown_event): функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель становится активным.
* `onPointerDownCapture`: версия `onPointerDown`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerenter_event): функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель перемещается внутрь элемента. Не имеет фазы перехвата. Вместо этого `onPointerLeave` и `onPointerEnter` распространяются от покидаемого элемента к входящему.
* [`onPointerLeave`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerleave_event): функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель перемещается за пределы элемента. Не имеет фазы перехвата. Вместо этого `onPointerLeave` и `onPointerEnter` распространяются от покидаемого элемента к входящему.
* [`onPointerMove`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointermove_event): функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда изменяются координаты указателя.
* `onPointerMoveCapture`: версия `onPointerMove`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerout_event): функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель перемещается за пределы элемента, если взаимодействие с указателем отменено, и [по нескольким другим причинам.](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: версия `onPointerOut`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/ru/docs/Web/API/Element/pointerup_event): функция-обработчик [`PointerEvent`](#pointerevent-handler). Срабатывает, когда указатель больше не активен.
* `onPointerUpCapture`: версия `onPointerUp`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/ru/docs/Web/API/Element/paste_event): функция-обработчик [`ClipboardEvent`](#clipboardevent-handler). Срабатывает, когда пользователь пытается вставить что-то из буфера обмена.
* `onPasteCapture`: версия `onPaste`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/ru/docs/Web/API/Element/scroll_event): функция-обработчик [`Event`](#event-handler). Срабатывает, когда элемент прокручен. Это событие не всплывает.
* `onScrollCapture`: версия `onScroll`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/ru/docs/Web/API/HTMLInputElement/select_event): функция-обработчик [`Event`](#event-handler). Срабатывает после изменения выделения внутри редактируемого элемента, например, input. React расширяет событие `onSelect`, чтобы оно работало и для элементов `contentEditable={true}`. Кроме того, React расширяет его, чтобы оно срабатывало для пустого выделения и при редактировании (что может повлиять на выделение).
* `onSelectCapture`: версия `onSelect`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/ru/docs/Web/API/Element/touchcancel_event): функция-обработчик [`TouchEvent`](#touchevent-handler). Срабатывает, когда браузер отменяет взаимодействие с касанием.
* `onTouchCancelCapture`: версия `onTouchCancel`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/ru/docs/Web/API/Element/touchend_event): функция-обработчик [`TouchEvent`](#touchevent-handler). Срабатывает, когда удаляется одна или несколько точек касания.
* `onTouchEndCapture`: версия `onTouchEnd`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/ru/docs/Web/API/Element/touchmove_event): функция-обработчик [`TouchEvent`](#touchevent-handler). Срабатывает, когда перемещается одна или несколько точек касания.
* `onTouchMoveCapture`: версия `onTouchMove`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/ru/docs/Web/API/Element/touchstart_event): функция-обработчик [`TouchEvent`](#touchevent-handler). Срабатывает, когда размещается одна или несколько точек касания.
* `onTouchStartCapture`: версия `onTouchStart`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/ru/docs/Web/API/Element/transitionend_event): функция-обработчик [`TransitionEvent`](#transitionevent-handler). Срабатывает, когда завершается CSS-переход.
* `onTransitionEndCapture`: версия `onTransitionEnd`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/ru/docs/Web/API/Element/wheel_event): функция-обработчик [`WheelEvent`](#wheelevent-handler). Срабатывает, когда пользователь вращает кнопку колеса.
* `onWheelCapture`: версия `onWheel`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/Roles): строка. Явно указывает роль элемента для вспомогательных технологий.
* [`slot`](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/Roles): строка. Указывает имя слота при использовании shadow DOM. В React эквивалентный шаблон обычно достигается путем передачи JSX в качестве пропсов, например `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/spellcheck): логическое значение или null. Если явно установлено значение `true` или `false`, включает или отключает проверку орфографии.
* [`tabIndex`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/tabindex): число. Переопределяет поведение кнопки Tab по умолчанию. [Избегайте использования значений, отличных от `-1` и `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/title): строка. Указывает текст всплывающей подсказки для элемента.
* [`translate`](https://developer.mozilla.org/ru/docs/Web/HTML/Global_attributes/translate): либо `'yes'`, либо `'no'`. Передача `'no'` исключает содержимое элемента из перевода.


Вы также можете передавать пользовательские атрибуты как пропсы, например, `mycustomprop="someValue"`. Это может быть полезно при интеграции со сторонними библиотеками. Имя пользовательского атрибута должно быть в нижнем регистре и не должно начинаться с `on`. Значение будет преобразовано в строку. Если вы передадите `null` или `undefined`, пользовательский атрибут будет удалён.

Эти события срабатывают только для элементов [`<form>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/form):

*   [`onReset`](https://developer.mozilla.org/ru/docs/Web/API/HTMLFormElement/reset_event): Функция [`Event` handler](#event-handler). Срабатывает при сбросе формы.
*   `onResetCapture`: Версия `onReset`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onSubmit`](https://developer.mozilla.org/ru/docs/Web/API/HTMLFormElement/submit_event): Функция [`Event` handler](#event-handler). Срабатывает при отправке формы.
*   `onSubmitCapture`: Версия `onSubmit`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)

Эти события срабатывают только для элементов [`<dialog>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/dialog). В отличие от событий браузера, они всплывают в React:

*   [`onCancel`](https://developer.mozilla.org/ru/docs/Web/API/HTMLDialogElement/cancel_event): Функция [`Event` handler](#event-handler). Срабатывает, когда пользователь пытается закрыть диалоговое окно.
*   `onCancelCapture`: Версия `onCancel`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onClose`](https://developer.mozilla.org/ru/docs/Web/API/HTMLDialogElement/close_event): Функция [`Event` handler](#event-handler). Срабатывает, когда диалоговое окно было закрыто.
*   `onCloseCapture`: Версия `onClose`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)

Эти события срабатывают только для элементов [`<details>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/details). В отличие от событий браузера, они всплывают в React:

*   [`onToggle`](https://developer.mozilla.org/ru/docs/Web/API/HTMLDetailsElement/toggle_event): Функция [`Event` handler](#event-handler). Срабатывает, когда пользователь переключает детали.
*   `onToggleCapture`: Версия `onToggle`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)

Эти события срабатывают для элементов [`<img>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/link) и [SVG `<image>`](https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/SVG_Image_Tag). В отличие от событий браузера, они всплывают в React:

*   `onLoad`: Функция [`Event` handler](#event-handler). Срабатывает, когда ресурс загружен.
*   `onLoadCapture`: Версия `onLoad`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onError`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/error_event): Функция [`Event` handler](#event-handler). Срабатывает, когда ресурс не удалось загрузить.
*   `onErrorCapture`: Версия `onError`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)

Эти события срабатывают для таких ресурсов, как [`<audio>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/audio) и [`<video>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/video). В отличие от событий браузера, они всплывают в React:

*   [`onAbort`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/abort_event): Функция [`Event` handler](#event-handler). Срабатывает, когда ресурс не был полностью загружен, но не из-за ошибки.
*   `onAbortCapture`: Версия `onAbort`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onCanPlay`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/canplay_event): Функция [`Event` handler](#event-handler). Срабатывает, когда данных достаточно для начала воспроизведения, но недостаточно для воспроизведения до конца без буферизации.
*   `onCanPlayCapture`: Версия `onCanPlay`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onCanPlayThrough`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/canplaythrough_event): Функция [`Event` handler](#event-handler). Срабатывает, когда данных достаточно, чтобы, вероятно, начать воспроизведение без буферизации до конца.
*   `onCanPlayThroughCapture`: Версия `onCanPlayThrough`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onDurationChange`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/durationchange_event): Функция [`Event` handler](#event-handler). Срабатывает, когда обновилась продолжительность медиафайла.
*   `onDurationChangeCapture`: Версия `onDurationChange`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onEmptied`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/emptied_event): Функция [`Event` handler](#event-handler). Срабатывает, когда медиафайл стал пустым.
*   `onEmptiedCapture`: Версия `onEmptied`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Функция [`Event` handler](#event-handler). Срабатывает, когда браузер обнаруживает зашифрованный медиафайл.
*   `onEncryptedCapture`: Версия `onEncrypted`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onEnded`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/ended_event): Функция [`Event` handler](#event-handler). Срабатывает, когда воспроизведение останавливается, потому что больше нечего воспроизводить.
*   `onEndedCapture`: Версия `onEnded`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onError`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/error_event): Функция [`Event` handler](#event-handler). Срабатывает, когда ресурс не удалось загрузить.
*   `onErrorCapture`: Версия `onError`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onLoadedData`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/loadeddata_event): Функция [`Event` handler](#event-handler). Срабатывает, когда загружен текущий кадр воспроизведения.
*   `onLoadedDataCapture`: Версия `onLoadedData`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onLoadedMetadata`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Функция [`Event` handler](#event-handler). Срабатывает, когда метаданные загружены.
*   `onLoadedMetadataCapture`: Версия `onLoadedMetadata`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onLoadStart`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/loadstart_event): Функция [`Event` handler](#event-handler). Срабатывает, когда браузер начал загрузку ресурса.
*   `onLoadStartCapture`: Версия `onLoadStart`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onPause`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/pause_event): Функция [`Event` handler](#event-handler). Срабатывает, когда медиафайл был приостановлен.
*   `onPauseCapture`: Версия `onPause`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onPlay`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/play_event): Функция [`Event` handler](#event-handler). Срабатывает, когда медиафайл больше не приостановлен.
*   `onPlayCapture`: Версия `onPlay`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onPlaying`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/playing_event): Функция [`Event` handler](#event-handler). Срабатывает, когда медиафайл начинает или перезапускает воспроизведение.
*   `onPlayingCapture`: Версия `onPlaying`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onProgress`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/progress_event): Функция [`Event` handler](#event-handler). Срабатывает периодически во время загрузки ресурса.
*   `onProgressCapture`: Версия `onProgress`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onRateChange`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/ratechange_event): Функция [`Event` handler](#event-handler). Срабатывает при изменении скорости воспроизведения.
*   `onRateChangeCapture`: Версия `onRateChange`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   `onResize`: Функция [`Event` handler](#event-handler). Срабатывает при изменении размера видео.
*   `onResizeCapture`: Версия `onResize`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onSeeked`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/seeked_event): Функция [`Event` handler](#event-handler). Срабатывает, когда операция поиска завершена.
*   `onSeekedCapture`: Версия `onSeeked`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onSeeking`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/seeking_event): Функция [`Event` handler](#event-handler). Срабатывает, когда начинается операция поиска.
*   `onSeekingCapture`: Версия `onSeeking`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onStalled`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/stalled_event): Функция [`Event` handler](#event-handler). Срабатывает, когда браузер ожидает данные, но они не загружаются.
*   `onStalledCapture`: Версия `onStalled`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onSuspend`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/suspend_event): Функция [`Event` handler](#event-handler). Срабатывает, когда загрузка ресурса была приостановлена.
*   `onSuspendCapture`: Версия `onSuspend`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onTimeUpdate`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/timeupdate_event): Функция [`Event` handler](#event-handler). Срабатывает при обновлении текущего времени воспроизведения.
*   `onTimeUpdateCapture`: Версия `onTimeUpdate`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onVolumeChange`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/volumechange_event): Функция [`Event` handler](#event-handler). Срабатывает при изменении громкости.
*   `onVolumeChangeCapture`: Версия `onVolumeChange`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)
*   [`onWaiting`](https://developer.mozilla.org/ru/docs/Web/API/HTMLMediaElement/waiting_event): Функция [`Event` handler](#event-handler). Срабатывает, когда воспроизведение остановилось из-за временной нехватки данных.
*   `onWaitingCapture`: Версия `onWaiting`, которая срабатывает на [фазе перехвата.](/learn/responding-to-events#capture-phase-events)


#### Предостережения {/*common-caveats*/}

- Нельзя одновременно передавать `children` и `dangerouslySetInnerHTML`.
- Некоторые события (например, `onAbort` и `onLoad`) не всплывают в браузере, но всплывают в React.

---


### Функция обратного вызова `ref` {/*ref-callback*/}

Вместо объекта ref (например, того, который возвращается из [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), вы можете передать функцию атрибуту `ref`.

```js
<div ref={(node) => {
  console.log('Attached', node);

  return () => {
    console.log('Clean up', node)
  }
}}>
```

[См. пример использования обратного вызова `ref`.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

Когда DOM-узел `<div>` добавляется на экран, React вызовет ваш обратный вызов `ref` с DOM-узлом `node` в качестве аргумента. Когда этот DOM-узел `<div>` будет удален, React вызовет функцию очистки, возвращенную из обратного вызова.

React также вызовет ваш обратный вызов `ref` всякий раз, когда вы передаете *другой* обратный вызов `ref`. В приведенном выше примере `(node) => { ... }` — это другая функция при каждом рендере. Когда ваш компонент перерендеривается, *предыдущая* функция будет вызвана с `null` в качестве аргумента, а *следующая* функция будет вызвана с DOM-узлом.

#### Параметры {/*ref-callback-parameters*/}

*   `node`: DOM-узел. React передаст вам DOM-узел, когда ref будет прикреплен. Если вы не передаете одну и ту же ссылку на функцию для обратного вызова `ref` при каждом рендере, обратный вызов будет временно очищен и пересоздан во время каждого перерендера компонента.

<Note>

#### React 19 добавил функции очистки для обратных вызовов `ref`. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

Для обеспечения обратной совместимости, если функция очистки не возвращается из обратного вызова `ref`, `node` будет вызван с `null`, когда `ref` будет отсоединен. Это поведение будет удалено в будущей версии.

</Note>

#### Возвращает {/*returns*/}

*   **необязательно** `cleanup function`: Когда `ref` отсоединен, React вызовет функцию очистки. Если функция не возвращается обратным вызовом `ref`, React снова вызовет обратный вызов с `null` в качестве аргумента, когда `ref` будет отсоединен. Это поведение будет удалено в будущей версии.

#### Предостережения {/*caveats*/}

*   Когда включен строгий режим, React **запустит один дополнительный цикл настройки и очистки только для разработки** перед первой реальной настройкой. Это стресс-тест, который гарантирует, что ваша логика очистки «отражает» вашу логику настройки и что она останавливает или отменяет все, что делает настройка. Если это вызывает проблему, реализуйте функцию очистки.
*   Когда вы передаете *другой* обратный вызов `ref`, React вызовет функцию очистки *предыдущего* обратного вызова, если она предоставлена. Если функция очистки не определена, обратный вызов `ref` будет вызван с `null` в качестве аргумента. *Следующая* функция будет вызвана с DOM-узлом.

---

### Объект события React {/*react-event-object*/}

Ваши обработчики событий получат *объект события React*. Он также иногда известен как «синтетическое событие».

```js
<button onClick={e => {
  console.log(e); // Объект события React
}} />
```

Он соответствует тому же стандарту, что и базовые DOM-события, но исправляет некоторые несоответствия в браузерах.

Некоторые события React не отображаются напрямую в собственные события браузера. Например, в `onMouseLeave` `e.nativeEvent` будет указывать на событие `mouseout`. Конкретное отображение не является частью общедоступного API и может измениться в будущем. Если вам по какой-либо причине нужно базовое событие браузера, прочитайте его из `e.nativeEvent`.

#### Свойства {/*react-event-object-properties*/}

Объекты событий React реализуют некоторые стандартные свойства [`Event`](https://developer.mozilla.org/ru/docs/Web/API/Event):

*   [`bubbles`](https://developer.mozilla.org/ru/docs/Web/API/Event/bubbles): логическое значение. Возвращает, всплывает ли событие через DOM.
*   [`cancelable`](https://developer.mozilla.org/ru/docs/Web/API/Event/cancelable): логическое значение. Возвращает, можно ли отменить событие.
*   [`currentTarget`](https://developer.mozilla.org/ru/docs/Web/API/Event/currentTarget): DOM-узел. Возвращает узел, к которому прикреплен текущий обработчик в дереве React.
*   [`defaultPrevented`](https://developer.mozilla.org/ru/docs/Web/API/Event/defaultPrevented): логическое значение. Возвращает, был ли вызван `preventDefault`.
*   [`eventPhase`](https://developer.mozilla.org/ru/docs/Web/API/Event/eventPhase): число. Возвращает, на какой фазе находится событие в данный момент.
*   [`isTrusted`](https://developer.mozilla.org/ru/docs/Web/API/Event/isTrusted): логическое значение. Возвращает, было ли событие инициировано пользователем.
*   [`target`](https://developer.mozilla.org/ru/docs/Web/API/Event/target): DOM-узел. Возвращает узел, на котором произошло событие (которым может быть отдаленный дочерний элемент).
*   [`timeStamp`](https://developer.mozilla.org/ru/docs/Web/API/Event/timeStamp): число. Возвращает время, когда произошло событие.

Кроме того, объекты событий React предоставляют следующие свойства:

*   `nativeEvent`: DOM [`Event`](https://developer.mozilla.org/ru/docs/Web/API/Event). Исходный объект события браузера.

#### Методы {/*react-event-object-methods*/}

Объекты событий React реализуют некоторые стандартные методы [`Event`](https://developer.mozilla.org/ru/docs/Web/API/Event):

*   [`preventDefault()`](https://developer.mozilla.org/ru/docs/Web/API/Event/preventDefault): Предотвращает действие браузера по умолчанию для события.
*   [`stopPropagation()`](https://developer.mozilla.org/ru/docs/Web/API/Event/stopPropagation): Останавливает распространение события по дереву React.

Кроме того, объекты событий React предоставляют следующие методы:

*   `isDefaultPrevented()`: Возвращает логическое значение, указывающее, был ли вызван `preventDefault`.
*   `isPropagationStopped()`: Возвращает логическое значение, указывающее, был ли вызван `stopPropagation`.
*   `persist()`: Не используется с React DOM. С React Native вызовите это, чтобы прочитать свойства события после события.
*   `isPersistent()`: Не используется с React DOM. С React Native возвращает, был ли вызван `persist`.

#### Предостережения {/*react-event-object-caveats*/}

*   Значения `currentTarget`, `eventPhase`, `target` и `type` отражают значения, которые ожидает ваш код React. Под капотом React прикрепляет обработчики событий к корню, но это не отражается в объектах событий React. Например, `e.currentTarget` может отличаться от базового `e.nativeEvent.currentTarget`. Для полифильных событий `e.type` (тип события React) может отличаться от `e.nativeEvent.type` (базовый тип).

---

### Функция обработчика `AnimationEvent` {/*animationevent-handler*/}

Тип обработчика событий для событий [CSS animation](https://developer.mozilla.org/ru/docs/Web/CSS/CSS_Animations/Using_CSS_animations).

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Параметры {/*animationevent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`AnimationEvent`](https://developer.mozilla.org/ru/docs/Web/API/AnimationEvent):
    *   [`animationName`](https://developer.mozilla.org/ru/docs/Web/API/AnimationEvent/animationName)
    *   [`elapsedTime`](https://developer.mozilla.org/ru/docs/Web/API/AnimationEvent/elapsedTime)
    *   [`pseudoElement`](https://developer.mozilla.org/ru/docs/Web/API/AnimationEvent/pseudoElement)

---

### Функция обработчика `ClipboardEvent` {/*clipboadevent-handler*/}

Тип обработчика событий для событий [Clipboard API](https://developer.mozilla.org/ru/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Параметры {/*clipboadevent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`ClipboardEvent`](https://developer.mozilla.org/ru/docs/Web/API/ClipboardEvent):

    *   [`clipboardData`](https://developer.mozilla.org/ru/docs/Web/API/ClipboardEvent/clipboardData)

---

### Функция обработчика `CompositionEvent` {/*compositionevent-handler*/}

Тип обработчика событий для событий [input method editor (IME)](https://developer.mozilla.org/ru/docs/Glossary/Input_method_editor).

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Параметры {/*compositionevent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`CompositionEvent`](https://developer.mozilla.org/ru/docs/Web/API/CompositionEvent):
    *   [`data`](https://developer.mozilla.org/ru/docs/Web/API/CompositionEvent/data)

---

### Функция обработчика `DragEvent` {/*dragevent-handler*/}

Тип обработчика событий для событий [HTML Drag and Drop API](https://developer.mozilla.org/ru/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag source
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop target
  </div>
</>
```

#### Параметры {/*dragevent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`DragEvent`](https://developer.mozilla.org/ru/docs/Web/API/DragEvent):
    *   [`dataTransfer`](https://developer.mozilla.org/ru/docs/Web/API/DragEvent/dataTransfer)

    Он также включает унаследованные свойства [`MouseEvent`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent):

    *   [`altKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/altKey)
    *   [`button`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/button)
    *   [`buttons`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/buttons)
    *   [`ctrlKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/ctrlKey)
    *   [`clientX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/clientX)
    *   [`clientY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/clientY)
    *   [`getModifierState(key)`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/metaKey)
    *   [`movementX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/movementX)
    *   [`movementY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/movementY)
    *   [`pageX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageX)
    *   [`pageY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageY)
    *   [`relatedTarget`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/relatedTarget)
    *   [`screenX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/screenX)
    *   [`screenY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/screenY)
    *   [`shiftKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/shiftKey)

    Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/view)

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

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`FocusEvent`](https://developer.mozilla.org/ru/docs/Web/API/FocusEvent):
    *   [`relatedTarget`](https://developer.mozilla.org/ru/docs/Web/API/FocusEvent/relatedTarget)

    Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/view)

---

### Функция обработчика `Event` {/*event-handler*/}

Тип обработчика событий для общих событий.

#### Параметры {/*event-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) без дополнительных свойств.

---

### Функция обработчика `InputEvent` {/*inputevent-handler*/}

Тип обработчика событий для события `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Параметры {/*inputevent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`InputEvent`](https://developer.mozilla.org/ru/docs/Web/API/InputEvent):
    *   [`data`](https://developer.mozilla.org/ru/docs/Web/API/InputEvent/data)

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

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`KeyboardEvent`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent):
    *   [`altKey`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/altKey)
    *   [`charCode`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/charCode)
    *   [`code`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/code)
    *   [`ctrlKey`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/ctrlKey)
    *   [`getModifierState(key)`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/getModifierState)
    *   [`key`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key)
    *   [`keyCode`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/keyCode)
    *   [`locale`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/locale)
    *   [`metaKey`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/metaKey)
    *   [`location`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/location)
    *   [`repeat`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/repeat)
    *   [`shiftKey`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/shiftKey)
    *   [`which`](https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/which)

    Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/view)

---


### Функция-обработчик `MouseEvent` {/*mouseevent-handler*/}

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

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`MouseEvent`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent):
    *   [`altKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/altKey)
    *   [`button`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/button)
    *   [`buttons`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/buttons)
    *   [`ctrlKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/ctrlKey)
    *   [`clientX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/clientX)
    *   [`clientY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/clientY)
    *   [`getModifierState(key)`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/metaKey)
    *   [`movementX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/movementX)
    *   [`movementY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/movementY)
    *   [`pageX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageX)
    *   [`pageY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageY)
    *   [`relatedTarget`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/relatedTarget)
    *   [`screenX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/screenX)
    *   [`screenY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/screenY)
    *   [`shiftKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/shiftKey)

    Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/view)

---

### Функция-обработчик `PointerEvent` {/*pointerevent-handler*/}

Тип обработчика событий для [событий указателя.](https://developer.mozilla.org/ru/docs/Web/API/Pointer_events)

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

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`PointerEvent`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent):
    *   [`height`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/height)
    *   [`isPrimary`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/isPrimary)
    *   [`pointerId`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/pointerId)
    *   [`pointerType`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/pointerType)
    *   [`pressure`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/pressure)
    *   [`tangentialPressure`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/tangentialPressure)
    *   [`tiltX`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/tiltX)
    *   [`tiltY`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/tiltY)
    *   [`twist`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/twist)
    *   [`width`](https://developer.mozilla.org/ru/docs/Web/API/PointerEvent/width)

    Он также включает унаследованные свойства [`MouseEvent`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent):

    *   [`altKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/altKey)
    *   [`button`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/button)
    *   [`buttons`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/buttons)
    *   [`ctrlKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/ctrlKey)
    *   [`clientX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/clientX)
    *   [`clientY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/clientY)
    *   [`getModifierState(key)`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/metaKey)
    *   [`movementX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/movementX)
    *   [`movementY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/movementY)
    *   [`pageX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageX)
    *   [`pageY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageY)
    *   [`relatedTarget`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/relatedTarget)
    *   [`screenX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/screenX)
    *   [`screenY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/screenY)
    *   [`shiftKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/shiftKey)

    Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/view)

---

### Функция-обработчик `TouchEvent` {/*touchevent-handler*/}

Тип обработчика событий для [сенсорных событий.](https://developer.mozilla.org/ru/docs/Web/API/Touch_events)

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Параметры {/*touchevent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`TouchEvent`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent):
    *   [`altKey`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/altKey)
    *   [`ctrlKey`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/ctrlKey)
    *   [`changedTouches`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/changedTouches)
    *   [`getModifierState(key)`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/metaKey)
    *   [`shiftKey`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/shiftKey)
    *   [`touches`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/touches)
    *   [`targetTouches`](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent/targetTouches)

    Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/view)

---

### Функция-обработчик `TransitionEvent` {/*transitionevent-handler*/}

Тип обработчика событий для событий перехода CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Параметры {/*transitionevent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`TransitionEvent`](https://developer.mozilla.org/ru/docs/Web/API/TransitionEvent):
    *   [`elapsedTime`](https://developer.mozilla.org/ru/docs/Web/API/TransitionEvent/elapsedTime)
    *   [`propertyName`](https://developer.mozilla.org/ru/docs/Web/API/TransitionEvent/propertyName)
    *   [`pseudoElement`](https://developer.mozilla.org/ru/docs/Web/API/TransitionEvent/pseudoElement)

---

### Функция-обработчик `UIEvent` {/*uievent-handler*/}

Тип обработчика событий для общих событий пользовательского интерфейса.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Параметры {/*uievent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`UIEvent`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent):
    *   [`detail`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/view)

---

### Функция-обработчик `WheelEvent` {/*wheelevent-handler*/}

Тип обработчика событий для события `onWheel`.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Параметры {/*wheelevent-handler-parameters*/}

*   `e`: [Объект события React](#react-event-object) с этими дополнительными свойствами [`WheelEvent`](https://developer.mozilla.org/ru/docs/Web/API/WheelEvent):
    *   [`deltaMode`](https://developer.mozilla.org/ru/docs/Web/API/WheelEvent/deltaMode)
    *   [`deltaX`](https://developer.mozilla.org/ru/docs/Web/API/WheelEvent/deltaX)
    *   [`deltaY`](https://developer.mozilla.org/ru/docs/Web/API/WheelEvent/deltaY)
    *   [`deltaZ`](https://developer.mozilla.org/ru/docs/Web/API/WheelEvent/deltaZ)

    Он также включает унаследованные свойства [`MouseEvent`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent):

    *   [`altKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/altKey)
    *   [`button`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/button)
    *   [`buttons`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/buttons)
    *   [`ctrlKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/ctrlKey)
    *   [`clientX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/clientX)
    *   [`clientY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/clientY)
    *   [`getModifierState(key)`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/getModifierState)
    *   [`metaKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/metaKey)
    *   [`movementX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/movementX)
    *   [`movementY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/movementY)
    *   [`pageX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageX)
    *   [`pageY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/pageY)
    *   [`relatedTarget`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/relatedTarget)
    *   [`screenX`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/screenX)
    *   [`screenY`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/screenY)
    *   [`shiftKey`](https://developer.mozilla.org/ru/docs/Web/API/MouseEvent/shiftKey)

    Он также включает унаследованные свойства [`UIEvent`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent):

    *   [`detail`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/detail)
    *   [`view`](https://developer.mozilla.org/ru/docs/Web/API/UIEvent/view)

---


## Использование {/*usage*/}

### Применение CSS-стилей {/*applying-css-styles*/}

В React вы указываете CSS-класс с помощью [`className`.](https://developer.mozilla.org/ru/docs/Web/API/Element/className) Он работает как атрибут `class` в HTML:

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

React не предписывает, как добавлять CSS-файлы. В простейшем случае вы добавите тег [`<link>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/link) в ваш HTML. Если вы используете инструмент сборки или фреймворк, обратитесь к его документации, чтобы узнать, как добавить CSS-файл в ваш проект.

Иногда значения стилей зависят от данных. Используйте атрибут `style`, чтобы динамически передавать некоторые стили:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```

В приведенном выше примере `style={{}}` — это не специальный синтаксис, а обычный объект `{}` внутри [фигурных скобок JSX](/learn/javascript-in-jsx-with-curly-braces) `style={ }`. Мы рекомендуем использовать атрибут `style`, только когда ваши стили зависят от переменных JavaScript.

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

#### Как условно применить несколько CSS-классов? {/*how-to-apply-multiple-css-classes-conditionally*/}

Чтобы условно применить CSS-классы, вам нужно самостоятельно создать строку `className` с помощью JavaScript.

Например, `className={'row ' + (isSelected ? 'selected': '')}` создаст либо `className="row"`, либо `className="row selected"` в зависимости от того, является ли `isSelected` значением `true`.

Чтобы сделать это более читаемым, вы можете использовать небольшую вспомогающую библиотеку, такую как [`classnames`:](https://github.com/JedWatson/classnames)

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

### Манипулирование узлом DOM с помощью ref {/*manipulating-a-dom-node-with-a-ref*/}

Иногда вам потребуется получить узел DOM браузера, связанный с тегом в JSX. Например, если вы хотите, чтобы `<input>` получил фокус при нажатии кнопки, вам нужно вызвать [`focus()`](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/focus) в узле DOM браузера `<input>`.

Чтобы получить узел DOM браузера для тега, [объявите ref](/reference/react/useRef) и передайте его в качестве атрибута `ref` этому тегу:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React поместит узел DOM в `inputRef.current` после того, как он будет отрисован на экране.

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

Узнайте больше о [манипулировании DOM с помощью refs](/learn/manipulating-the-dom-with-refs) и [посмотрите больше примеров.](/reference/react/useRef#examples-dom)

Для более продвинутых случаев использования атрибут `ref` также принимает [функцию обратного вызова.](#ref-callback)

---

### Опасная установка внутреннего HTML {/*dangerously-setting-the-inner-html*/}

Вы можете передать строку необработанного HTML элементу следующим образом:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Это опасно. Как и в случае со свойством DOM [`innerHTML`](https://developer.mozilla.org/ru/docs/Web/API/Element/innerHTML), вы должны проявлять крайнюю осторожность! Если разметка не поступает из полностью надежного источника, очень просто внедрить [XSS](https://ru.wikipedia.org/wiki/Межсайтовый_скриптинг)-уязвимость таким образом.**

Например, если вы используете библиотеку Markdown, которая преобразует Markdown в HTML, вы доверяете, что ее парсер не содержит ошибок, и пользователь видит только свой собственный ввод, вы можете отобразить полученный HTML следующим образом:

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
  // Это БЕЗОПАСНО ТОЛЬКО потому, что выводимый HTML
  // показывается тому же пользователю, и потому, что вы
  // доверяете этому парсеру Markdown, что в нем нет ошибок.
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

Объект `{__html}` следует создавать как можно ближе к месту, где генерируется HTML, как это делает приведенный выше пример в функции `renderMarkdownToHTML`. Это гарантирует, что весь необработанный HTML, используемый в вашем коде, явно помечен как таковой, и что только переменные, которые, как вы ожидаете, будут содержать HTML, передаются в `dangerouslySetInnerHTML`. Не рекомендуется создавать объект в строке, как `<div dangerouslySetInnerHTML={{__html: markup}} />`.

Чтобы увидеть, почему рендеринг произвольного HTML опасен, замените приведенный выше код следующим:

```js {1-4,7,8}
const post = {
  // Представьте, что это содержимое хранится в базе данных.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 ДЫРА В БЕЗОПАСНОСТИ: передача ненадежных входных данных в dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

Код, встроенный в HTML, будет запущен. Хакер может использовать эту дыру в безопасности, чтобы украсть информацию о пользователе или выполнять действия от его имени. **Используйте `dangerouslySetInnerHTML` только с надежными и очищенными данными.**

---

### Обработка событий мыши {/*handling-mouse-events*/}

В этом примере показаны некоторые распространенные [события мыши](#mouseevent-handler) и когда они срабатывают.

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

В этом примере показаны некоторые распространенные [события указателя](#pointerevent-handler) и когда они срабатывают.

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

В React [события фокуса](#focusevent-handler) всплывают. Вы можете использовать `currentTarget` и `relatedTarget`, чтобы различать, исходят ли события фокусировки или размытия из-за пределов родительского элемента. В примере показано, как обнаружить фокусировку дочернего элемента, фокусировку родительского элемента и как обнаружить вход или выход фокуса из всего поддерева.

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
          // Не срабатывает при переключении фокуса между дочерними элементами
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
          // Не срабатывает при переключении фокуса между дочерними элементами
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

В этом примере показаны некоторые распространенные [события клавиатуры](#keyboardevent-handler) и когда они срабатывают.

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