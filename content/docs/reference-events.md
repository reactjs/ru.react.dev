---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

В этом справочном руководстве описана обёртка `SyntheticEvent`, которая является частью системы событий React. Смотрите руководство [Обработка событий](/docs/handling-events.html) для детальной информации.

## Обзор {#overview}

Ваши обработчики событий получают экземпляр `SyntheticEvent`, это кроссбраузерная обёртка над нативным экземпляром события. У неё такой же интерфейс, как и у нативного события, включая методы `stopPropagation()` и `preventDefault()`. Эта обёртка помогает событиям работать одинаково во всех браузерах.

Если вам всё-таки нужно получить нативное браузерное событие, обратитесь к атрибуту `nativeEvent`. Синтетические события отличаются от нативных событий браузера и непосредственно не связаны с ними. Например, в синтетическом событии `onMouseLeave` атрибут `event.nativeEvent` будет указывать на `mouseout`. Эта деталь реализации не является частью публичного API, поэтому может измениться со временем. Вот перечень атрибутов объекта `SyntheticEvent`:

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> Примечание:
>
<<<<<<< HEAD
> Начиная с версии 0.14, возврат `false` из обработчика событий больше не останавливает всплытие. Вместо этого нужно вручную вызывать `e.stopPropagation()` или `e.preventDefault()`.

### Пул событий {#event-pooling}

События `SyntheticEvent` содержатся в пуле. Это означает, что объект `SyntheticEvent` будет повторно использован, а все его свойства будут очищены после вызова обработчика события.
Это необходимо из соображений производительности.
Именно поэтому нельзя использовать синтетические события асинхронно.

```javascript
function onClick(event) {
  console.log(event); // => null-объект.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Не сработает, поскольку this.state.clickEvent будет содержать только null-значения.
  this.setState({clickEvent: event});

  // По-прежнему можно экспортировать свойства события.
  this.setState({eventType: event.type});
}
```
=======
> As of v17, `e.persist()` doesn't do anything because the `SyntheticEvent` is no longer [pooled](/docs/legacy-event-pooling.html).
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

> Примечание:
>
<<<<<<< HEAD
> Если вы всё же хотите обратиться к полям события асинхронно, вам нужно вызвать `event.persist()` на событии. Тогда оно будет извлечено из пула, что позволит вашему коду удерживать ссылки на это событие.

## Поддерживаемые события {#supported-events}

React нормализует события так, чтобы они содержали одинаковые свойства во всех браузерах.

Обработчики ниже вызываются на фазе всплытия (bubbling). А чтобы зарегистрировать событие на фазе перехвата (capture), просто добавьте `Capture` к имени события; например, вместо использования `onClick` используйте `onClickCapture`, чтобы обработать событие на фазе перехвата.

- [События буфера обмена](#clipboard-events)
- [Композиционные события](#composition-events)
- [События клавиатуры](#keyboard-events)
- [События фокуса](#focus-events)
- [События формы](#form-events)
- [Общие события](#generic-events)
- [События мыши](#mouse-events)
- [События курсора](#pointer-events)
- [События выбора](#selection-events)
- [Сенсорные события](#touch-events)
- [События UI](#ui-events)
- [События колёсика мыши](#wheel-events)
- [События медиа-элементов](#media-events)
- [События изображений](#image-events)
- [События анимаций](#animation-events)
- [События переходов](#transition-events)
- [Другие события](#other-events)
=======
> As of v0.14, returning `false` from an event handler will no longer stop event propagation. Instead, `e.stopPropagation()` or `e.preventDefault()` should be triggered manually, as appropriate.

## Supported Events {#supported-events}

React normalizes events so that they have consistent properties across different browsers.

The event handlers below are triggered by an event in the bubbling phase. To register an event handler for the capture phase, append `Capture` to the event name; for example, instead of using `onClick`, you would use `onClickCapture` to handle the click event in the capture phase.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Generic Events](#generic-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

* * *

## Справочник {#reference}

### События буфера обмена {#clipboard-events}

Названия событий:

```
onCopy onCut onPaste
```

Свойства:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Композиционные события {#composition-events}

Названия событий:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Свойства:

```javascript
string data
```

* * *

### События клавиатуры {#keyboard-events}

Названия событий:

```
onKeyDown onKeyPress onKeyUp
```

Свойства:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

Свойство `key` может содержать любое из документированных значений в [спецификации событий DOM третьего уровня](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### События фокуса {#focus-events}

Названия событий:

```
onFocus onBlur
```

Эти события фокуса работают не только на элементах формы, но и на всех остальных элементах в React DOM.

Свойства:

```js
DOMEventTarget relatedTarget
```

#### onFocus

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```


* * *

### События формы {#form-events}

Названия событий:

```
onChange onInput onInvalid onReset onSubmit
```

Больше информации о событии onChange тут — [Формы](/docs/forms.html).

* * *

### Общие события {#generic-events}

Названия событий:

```
onError onLoad
```

* * *

### События мыши {#mouse-events}

Названия событий:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

События `onMouseEnter` и `onMouseLeave` всплывают с покинутого элемента к наведённому, вместо обычного процесса всплытия и не имеют фазы перехвата.

Свойства:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### События курсора {#pointer-events}

Названия событий:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

События `onPointerEnter` и `onPointerLeave` всплывают с покинутого элемента к наведённому, вместо обычного процесса всплытия и не имеют фазы перехвата.

Свойства:

По определению из [спецификации W3](https://www.w3.org/TR/pointerevents/), события курсора наследуют [события мыши](#mouse-events) со следующими свойствами:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

На заметку по поводу кроссбраузерности:

События указателя ещё не поддерживаются во всех браузерах (на момент написания этой страницы есть поддержка в Chrome, Firefox, Edge и Internet Explorer). React сознательно не добавляет полифил для поддержки в других браузерах, потому что это значительно бы увеличило размер пакета `react-dom`.

Если вашему приложению нужны события указателя, мы рекомендуем использовать сторонний полифил.

* * *

### События выбора {#selection-events}

Названия событий:

```
onSelect
```

* * *

### Сенсорные события {#touch-events}

Названия событий:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Свойства:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### События UI {#ui-events}

Названия событий:

```
onScroll
```

<<<<<<< HEAD
Свойства:
=======
>Note
>
>Starting with React 17, the `onScroll` event **does not bubble** in React. This matches the browser behavior and prevents the confusion when a nested scrollable element fires events on a distant parent.

Properties:
>>>>>>> 6682068641c16df6547b3fcdb7877e71bb0bebf9

```javascript
number detail
DOMAbstractView view
```

* * *

### События колёсика мыши {#wheel-events}

Названия событий:

```
onWheel
```

Свойства:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### События медиа-элементов {#media-events}

Названия событий:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### События изображений {#image-events}

Названия событий:

```
onLoad onError
```

* * *

### События анимаций {#animation-events}

Названия событий:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Свойства:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### События переходов {#transition-events}

Названия событий:

```
onTransitionEnd
```

Свойства:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Другие события {#other-events}

Названия событий:

```
onToggle
```
