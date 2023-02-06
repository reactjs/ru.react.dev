---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

<<<<<<< HEAD
В этом справочном руководстве описана обёртка `SyntheticEvent`, которая является частью системы событий React. Смотрите руководство [Обработка событий](/docs/handling-events.html) для детальной информации.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Common components (e.g. `<div>`)](https://beta.reactjs.org/reference/react-dom/components/common)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

This reference guide documents the `SyntheticEvent` wrapper that forms part of React's Event System. See the [Handling Events](/docs/handling-events.html) guide to learn more.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

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
> Начиная с 17 версии, вызов `e.persist()` не имеет смысла, потому что объекты событий `SyntheticEvent` больше не [добавляются в пул](/docs/legacy-event-pooling.html).

> Примечание:
>
> Начиная с версии v0.14, возврат `false` из обработчика события больше не приведёт к прекращению всплытия события. Вместо этого, следует вручную вызывать `e.stopPropagation()` или `e.preventDefault()`, если это требуется.

## Поддерживаемые события {#supported-events}

React нормализует события так, чтобы они содержали одинаковые свойства во всех браузерах.

Обработчики ниже вызываются на фазе всплытия (bubbling). А чтобы зарегистрировать событие на фазе перехвата (capture), просто добавьте `Capture` к имени события; например, вместо `onClick` используйте `onClickCapture`, чтобы обработать событие на фазе перехвата.

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

#### onFocus {#onfocus}

Событие `onFocus` вызывается при перемещении фокуса на элемент (включая дочерние элементы внутри него). Например, это событие запустится, если пользователь кликнет на текстовое поле ввода.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Получен фокус на поле ввода');
      }}
      placeholder="onFocus выполнится при нажатии на это поле ввода."
    />
  )
}
```

#### onBlur {#onblur}

Событие `onBlur` вызывается при пропадании фокуса с элемента (включая дочерние элементы внутри него). Например, это событие запустится, если пользователь кликнет за пределы текстового поля ввода, находящегося в фокусе.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Пропал фокус с поля ввода');
      }}
      placeholder="onBlur выполнится в случае изменения фокуса с этого поля ввода на любой другой элемент."
    />
  )
}
```

#### Отслеживание получения и перемещения фокуса {#detecting-focus-entering-and-leaving}

Можно использовать свойства `currentTarget` и `relatedTarget`, чтобы определить, когда наступили события появления или исчезновения фокуса за _пределами_ родительского элемента. Ниже приводится пример для выполнения в песочнице, который показывает, как можно поймать состояние фокуса на родительском и дочернем элементах, а также отследить фокус на всём поддереве элементов.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('фокус на родительском элементе установлен');
        } else {
          console.log('фокус на дочернем элементе установлен', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Не срабатывает при перемещении фокуса между дочерними элементами
          console.log('фокус находится внутри родительского элемента');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('фокус на родительском элементе снят');
        } else {
          console.log('фокус на дочернем элементе снят', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Не срабатывает при перемещении фокуса между дочерними элементами
          console.log('фокус потерян изнутри родительского элемента');
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

>Примечание
>
>Начиная с React 17, событие `onScroll` **не всплывает** в React. Это согласуется с работой браузера и предотвращает путаницу, когда вложенный прокручиваемый элемент запускает события на родительском элементе.

Свойства:

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
