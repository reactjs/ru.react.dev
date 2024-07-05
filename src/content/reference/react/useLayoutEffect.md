---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` может повредить производительности. По возможности предпочитайте [`useEffect`](/reference/react/useEffect).

</Pitfall>

<Intro>

`useLayoutEffect` – это версия [`useEffect`](/reference/react/useEffect), которая срабатывает перед тем, как браузер перерисует экран.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Вызовите `useLayoutEffect`, чтобы выполнить измерения макета перед тем, как браузер перерисует экран:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `setup`: Функция с логикой вашего эффекта. Ваша setup-функция, опционально, может возвращать функцию очистки. Перед тем, как ваш компонент добавится в DOM, React запустит вашу setup-функцию. После каждого повторного рендера с изменёнными зависимостями, React запустит функцию очистки (если вы её предоставили) со старыми значениями, а затем запустит вашу setup-функцию с новыми значениями. Перед тем как ваш компонент удалится из DOM, React запустит функцию очистки.
 
* `dependencies`: Список всех реактивных значений, на которые ссылается код функции `setup`. К реактивным значениям относятся пропсы, состояние, а также все переменные и функции, объявленные непосредственно в теле компонента. Если ваш линтер [настроен для использования с React](/learn/editor-setup#linting), он проверит, что каждое реактивное значение правильно указано как зависимость. Список зависимостей должен иметь постоянное количество элементов и быть записан примерно так: `[dep1, dep2, dep3]`. React будет сравнивать каждую зависимость с предыдущим значением, используя алгоритм сравнения [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Если не указать зависимости вообще, то эффект будет запускаться заново после каждого повторного рендера компонента.

#### Возвращаемое значение {/*returns*/}

`useLayoutEffect` возвращает `undefined`.

#### Предостережения {/*caveats*/}

* `useLayoutEffect` это хук, поэтому вы можете вызывать его только **на верхнем уровне вашего компонента** или собственных хуков. Вы не можете вызывать его внутри циклов или условий. Если вам это нужно, выделите компонент и перенесите эффект туда.

* Когда включен строгий режим (Strict Mode), React **выполнит один дополнительный цикл инициализации и очистки предназначенный только для разработки**, перед первой реальной инициализаций. Это стресс-тест, который гарантирует, что ваша логика очистки "зеркально отражает" вашу логику инициализации и что она останавливает или отменяет все, что делает инициализация. Если это вызывает проблему, [реализуйте функцию очистки.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Если некоторые из ваших зависимостей являются объектами или функциями, определенными внутри компонента, существует риск, что они будут **вызывать повторное выполнение эффекта чаще, чем необходимо.** Чтобы исправить это, удалите ненужные зависимости от [объектов](/reference/react/useEffect#removing-unnecessary-object-dependencies) и [функций](/reference/react/useEffect#removing-unnecessary-function-dependencies). Вы также можете [вынести обновления состояния](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) и [не реактивную логику](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) за пределы вашего эффекта.

* Эффекты **выполняются только на клиенте.** Они не выполняются во время серверного рендеринга.

* Код внутри `useLayoutEffect` и все обновления состояния, запланированные из него, **блокируют браузер от перерисовки экрана.** При чрезмерном использовании это замедляет работу вашего приложения. По возможности предпочитайте [`useEffect`.](/reference/react/useEffect)

---

## Использование {/*usage*/}

### Измерение макета перед тем, как браузер перерисует экран. {/*measuring-layout-before-the-browser-repaints-the-screen*/}

Большинству компонентов не нужно знать их положение и размер на экране, чтобы решить, что рендерить. Они просто возвращают некоторый JSX. Затем браузер рассчитывает их *макет* (положение и размер) и перерисовывает экран.

Иногда этого недостаточно. Представьте себе всплывающую подсказку, которая появляется рядом с каким-то элементом при наведении. Если достаточно места, подсказка должна появиться над элементом, но если она не помещается, она должна появиться ниже. Чтобы отобразить всплывающую подсказку в правильной конечной позиции, вам нужно знать ее высоту (т.е. помещается ли она сверху).

Чтобы сделать это, нужно выполнить рендеринг в два этапа:

1. Отрендерить всплывающую подсказку в любом месте (даже с неправильной позицией).
2. Измерить ее высоту и решить, где разместить подсказку.
3. Отрендерить всплывающую подсказку снова в правильном месте.

**Все это должно произойти до того, как браузер перерисует экран.** Вы не хотите, чтобы пользователь видел перемещение всплывающей подсказки. Вызовите `useLayoutEffect`, чтобы выполнить измерения макета перед тем, как браузер перерисует экран:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Вы еще не знаете реальную высоту

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Теперь перерендерьте, когда вы знаете реальную высоту.
  }, []);

  // ...используйте tooltipHeight в логике рендеринга ниже...
}
```

Вот как это работает шаг за шагом:

1. `Tooltip` рендерится с начальными значением `tooltipHeight = 0`  (поэтому подсказка может быть неправильно расположена).
2. React помещает её в DOM и выполняет код в `useLayoutEffect`.
3. Ваш `useLayoutEffect` [измеряет высоту](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) содержимого всплывающей подсказки и инициирует немедленный повторный рендеринг.
4. `Tooltip` снова рендерится с реальной `tooltipHeight` (так что подсказка правильно расположена).
5. React обновляет её в DOM, и браузер наконец отображает всплывающую подсказку.

Наведите курсор на кнопки ниже и посмотрите, как всплывающая подсказка изменяет своё положение в зависимости от того, помещается ли она:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка сверху)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Эта всплывающая подсказка помещается над кнопкой.</div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка снизу)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Эта всплывающая подсказка помещается над кнопкой.</div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка снизу)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Измеренная высота всплывающей подсказки: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Она не помещается сверху, поэтому размещаем снизу.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Обратите внимание, что даже несмотря на то, что компонент `Tooltip` должен рендериться в два этапа (сначала с `tooltipHeight`, инициализированным на `0`, а затем с реальной измеренной высотой), вы видите только конечный результат. Вот почему для этого примера вам нужен `useLayoutEffect`, а не [`useEffect`](/reference/react/useEffect). Давайте подробно рассмотрим разницу ниже.

<Recipes titleText="useLayoutEffect против useEffect" titleId="examples">

#### `useLayoutEffect` блокирует браузер от перерисовки. {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React гарантирует, что код внутри `useLayoutEffect` и любые обновления состояния, запланированные внутри него, будут обработаны **до того, как браузер перерисует экран.** Это позволяет вам отрендерить всплывающую подсказку, измерить её и снова отрендерить, не давая пользователю заметить первый лишний рендеринг. Другими словами, `useLayoutEffect` блокирует браузер от перерисовки.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Эта всплывающая подсказка не помещается над кнопкой.
            <br />
            Вот почему она отображается снизу!
          </div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка сверху)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Эта всплывающая подсказка помещается над кнопкой.</div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка снизу)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Эта всплывающая подсказка помещается над кнопкой.</div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка снизу)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Она не помещается сверху, поэтому размещаем снизу.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` не блокирует браузер от перерисовки. {/*useeffect-does-not-block-the-browser*/}

Вот тот же пример, но с использованием [`useEffect`](/reference/react/useEffect) вместо `useLayoutEffect`. . Если вы на более медленном устройстве, вы можете заметить, что иногда всплывающая подсказка "мерцает", и вы на мгновение видите её начальную позицию перед корректировкой.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Чтобы сделать ошибку проще для воспроизведения, эта версия добавляет искусственную задержку во время рендеринга. React позволит браузеру перерисовать экран перед тем, как обработает обновление состояния внутри `useEffect`. В результате всплывающая подсказка мерцает:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Эта всплывающая подсказка не помещается над кнопкой.
            <br />
            Вот почему она отображается снизу!
          </div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка сверху)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Эта всплывающая подсказка помещается над кнопкой.</div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка снизу).
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Эта всплывающая подсказка помещается над кнопкой.</div>
        }
      >
        Наведите курсор на меня (всплывающая подсказка снизу).
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Это искусственно замедляет рендеринг.
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Она не помещается сверху, поэтому размещаем снизу.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Измените этот пример на использование `useLayoutEffect` и наблюдайте, что он блокирует перерисовку, даже если рендеринг замедлен.

<Solution />

</Recipes>

<Note>

Рендеринг в два этапа и блокировка браузера ухудшают производительность. Старайтесь избегать этого, когда возможно.

</Note>

---

## Устранение неполадок {/*troubleshooting*/}

### Я получаю ошибку: "`useLayoutEffect` ничего не делает на сервере" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

Цель `useLayoutEffect` заключается в том, чтобы позволить вашему компоненту [использовать информацию о макете для рендеринга:](#measuring-layout-before-the-browser-repaints-the-screen)

1. Отрендерить начальное содержимое.
2. Измерить макет *перед тем, как браузер перерисует экран.*
3. Отрендерить конечное содержимое, используя считанную информацию о макете.

Когда вы или ваш фреймворк используете [серверный рендеринг](/reference/react-dom/server), ваше React-приложение рендерится в HTML на сервере для начального рендеринга. Это позволяет показать начальный HTML до загрузки JavaScript-кода.

Проблема в том, что на сервере нет информации о макете.

В [предыдущем примере](#measuring-layout-before-the-browser-repaints-the-screen), вызов `useLayoutEffect` в компоненте `Tooltip` позволяет ему правильно позиционироваться (либо выше, либо ниже содержимого) в зависимости от высоты содержимого. Если вы попытаетесь отрендерить `Tooltip` как часть начального HTML на сервере, это будет невозможно определить. На сервере еще нет макета! Поэтому, даже если вы отрендерите его на сервере, его позиция будет "прыгать" на клиенте после загрузки и выполнения JavaScript.

Обычно компоненты, которые зависят от информации о макете, в любом случае не нужно рендерить на сервере. Например, скорее всего нет смысла показывать всплывающую подсказку `Tooltip` во время начального рендеринга. Она активируется взаимодействием с клиентом.

Однако, если вы сталкиваетесь с этой проблемой, у вас есть несколько различных вариантов решения:

- Замените `useLayoutEffect` на [`useEffect`.](/reference/react/useEffect) Это сообщает React, что можно отображать результат начального рендеринга без блокировки перерисовки (потому что исходный HTML станет видимым до выполнения вашего эффекта).

- Или же [отметьте ваш компонент как клиентский.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) Это сообщает React заменить его содержимое до ближайшей границы [`<Suspense>`](/reference/react/Suspense) заглушкой загрузки (например, спиннером или мерцающим эффектом) во время серверного рендеринга.

- Или же можно рендерить компонент с использованием `useLayoutEffect` только после гидрации. Создайте состояние `isMounted` , инициализируемое значением `false`, и установите его в `true` внутри вызова `useEffect`. Ваша логика рендеринга может выглядеть следующим образом: `return isMounted ? <RealContent /> : <FallbackContent />`. На сервере и во время гидрации пользователь увидит `FallbackContent`, который не должен вызывать `useLayoutEffect`. Затем React заменит его на `RealContent` , который выполняется только на клиенте и может включать вызовы `useLayoutEffect`.

- Если ваш компонент синхронизируется с внешним хранилищем данных и используете `useLayoutEffect` не только для измерения макета, рассмотрите вариант использования [`useSyncExternalStore`](/reference/react/useSyncExternalStore). Этот хук [поддерживает серверный рендеринг.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)
