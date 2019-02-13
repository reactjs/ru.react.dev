---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

В этом справочном руководстве описана обертка `SyntheticEvent`, которая является частью системы событий React-а. Смотрите руководство [Обработка событий](/docs/handling-events.html) для детальной информации.

## Беглый обзор {#overview}

Ваши обработчики событий получают экземпляр `SyntheticEvent`, это кросс-браузерная обертка над нативным экземпляром события. У нeё такой же интерфейс как и у нативного события, включая методы `stopPropagation()` и `preventDefault()`, но такие события работают одинакого во всех браузерах.

Если все-таки вам нужно получить нативное браузерное событие, просто обратитесь к аттрибуту `nativeEvent`. Помимо него каждый объект `SyntheticEvent` содержит следующие аттрибуты:

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
DOMEventTarget target
number timeStamp
string type
```

> На заметку:
>
> Начиная с версии v0.14, возврат `false` из обработчика событий больше не остановаливает всплытие. Вместо этого, `e.stopPropagation()` или `e.preventDefault()` нужно вызывать вручную.

### Делегирование событий {#event-pooling}

`SyntheticEvent` является делегированным. Это означает что объект `SyntheticEvent` будет переиспользован, а все свойства будут обнулены после окончание выполнения обработчика.
Это необходимо из соображений производительности.
Именно поэтому нельзя использовать синтетические события асинхронно.

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Won't work. this.state.clickEvent will only contain null values.
  this.setState({clickEvent: event});

  // You can still export event properties.
  this.setState({eventType: event.type});
}
```

> На заметку:
>
> Если вы все же хотите обратитья к полям события асинхронно, вам нужно вызвать `event.persist()` на событии. Это отключит делегирование этого обьекта и позволит обращаться к нему в дальнейшем.

## Поддерживаемые события {#supported-events}

React нормализует события так, чтобы они содержали одинаковые свойства во всех бразурах.

Обработчики ниже вызываются на фазе всплытия (bubbling). А чтобы зарегистрировать событие на фазе перехвата (capture), просто добавьте `Capture` к имени события; например, вместо использования `onClick` используйте `onClickCapture`, чтобы обработать событие на фазе перехвата.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
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

* * *

## Reference {#reference}

### Clipboard Events {#clipboard-events}

Название событий:

```
onCopy onCut onPaste
```

Свойства:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Composition Events {#composition-events}

Название событий:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Свойства:

```javascript
string data

```

* * *

### Keyboard Events {#keyboard-events}

Название событий:

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

Свойство `key` может содержать любое из документированных в [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values) значений.

* * *

### Focus Events {#focus-events}

Название событий:

```
onFocus onBlur
```

Эти события фокуса работают не только на элементах формы, но и на всех остальных элементах в React DOM.

Свойства:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Form Events {#form-events}

Название собыий:

```
onChange onInput onInvalid onSubmit
```

Больше информации о событии onChange тут — [Forms](/docs/forms.html).

* * *

### Mouse Events {#mouse-events}

Название собыий:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

События `onMouseEnter` и `onMouseLeave` всплывают с покинутого элемента к наведенному, вместо обычного процесса всплытия и не имеют фазы перехвата.

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

### Pointer Events {#pointer-events}

Название собыий:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

События `onPointerEnter` и `onPointerLeave` всплывают с покинутого элемента к наведенному, вместо обычного процесса всплытия и не имеют фазы перехвата.

Свойства:

По определению из [W3 spec](https://www.w3.org/TR/pointerevents/), события курсора наследуют [Mouse Events](#mouse-events) со следующими свойствами:

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

На заметку по поводу кросс-браузерности:

События указателя еще не поддерживаются во всех браузерах (на момент написания этой статьи поддерживают браузеры: Chrome, Firefox, Edge, и Internet Explorer). React сознательно не полифилит поддержку в других браузерах потому что это значительно бы увеличило размер `react-dom`.

Если вашему приложению нужны события указателя, мы рекомендуем использовать сторонний поллифил.

* * *

### Selection Events {#selection-events}

Название собыий:

```
onSelect
```

* * *

### Touch Events {#touch-events}

Название собыий:

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

### UI Events {#ui-events}

Название собыий:

```
onScroll
```

Properties:

```javascript
number detail
DOMAbstractView view
```

* * *

### Wheel Events {#wheel-events}

Event names:

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

### Media Events {#media-events}

Название событий:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Image Events {#image-events}

Название событий:

```
onLoad onError
```

* * *

### Animation Events {#animation-events}

Название событий:

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

### Transition Events {#transition-events}

Название событий:

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

### Other Events {#other-events}

Название событий:

```
onToggle
```
