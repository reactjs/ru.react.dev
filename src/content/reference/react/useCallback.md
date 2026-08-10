---
title: useCallback
---

<Intro>

`useCallback` — это хук в React, который позволяет кешировать функции между повторными рендерингами.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useCallback` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Справочник {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Вызовите `useCallback` на верхнем уровне вашего компонента, чтобы кешировать функцию между повторными рендерами:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `fn`: Значение функции, которую вы хотите кешировать. Она может принимать любые аргументы и возвращать любые значения. React вернёт (но не вызовет!) вашу функцию при первом рендере. При последующих рендерах React даст вам ту же функцию, если `dependencies` не изменились. В противном случае он вернёт функцию, переданную при текущем рендере, и сохранит её для возможного повторного использования. React не вызывает вашу функцию. Он возвращает её вам, чтобы вы могли решить, когда и как её вызывать.

* `dependencies`: Список всех реактивных значений, на которые ссылается код `fn`. К реактивным значениям относятся пропсы, состояние и все переменные и функции, объявленные непосредственно в теле компонента. Если ваш линтер [настроен для использования с React](/learn/editor-setup#linting), он проверит, что каждое реактивное значение правильно указано как зависимость. Список зависимостей должен иметь постоянное количество элементов и быть записан примерно так: `[dep1, dep2, dep3]`. React будет сравнивать каждую зависимость с её предыдущим значением, используя алгоритм сравнения [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Возвращаемое значение {/*returns*/}

При первом рендере `useCallback` возвращает функцию `fn`, которую вы передали.

<<<<<<< HEAD
Во время последующих рендеров он либо возвращает уже сохранённую функцию `fn` с последнего рендера (если зависимости не изменились), либо возвращает функцию `fn`, переданную при текущем рендере.
=======
During subsequent renders, it will either return an already stored `fn` function from the last render (if the dependencies haven't changed), or return the `fn` function you have passed during this render.
>>>>>>> c7d6b700038c63d1aaf2c649af1aefe01ebbacac

#### Предостережения {/*caveats*/}

* `useCallback` -- это хук, поэтому вы можете вызывать его только **на верхнем уровне вашего компонента** или собственных хуков. Вы не можете вызывать его внутри циклов или условий. Если вам это нужно, выделите компонент и перенесите состояние туда.
* React **не выбрасывает кешированную функцию без веской причины.** Например, в режиме разработки React сбрасывает кеш при изменении файла вашего компонента. В разработке и в продакшене кеш сбрасывается, если ваш компонент приостановлен во время начальной загрузки. В будущем React может добавить функции, которые будут использовать сброс кеша -- например, встроенная поддержка виртуализированных списков может потребовать сброса кеша для элементов, которые выходят за пределы области видимости. Это должно соответствовать вашим ожиданиям при использовании `useCallback` для оптимизации производительности. В противном случае, использование [состояния](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) или [рефа](/reference/react/useRef#avoiding-recreating-the-ref-contents) могут быть более подходящими.

---

## Использование {/*usage*/}

### Пропуск повторного рендеринга компонентов {/*skipping-re-rendering-of-components*/}

Когда вы оптимизируете производительность рендеринга, иногда нужно кешировать функции, которые вы передаёте дочерним компонентам. Сначала рассмотрим синтаксис, как это сделать, а затем посмотрим, в каких случаях это полезно.

Чтобы кешировать функцию между рендерами вашего компонента, оберните её в хук `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Вам нужно передать две вещи в `useCallback`:

1. Функцию, которую вы хотите кешировать между повторными рендерами.
2. <CodeStep step={2}>Список зависимостей</CodeStep>, включающий каждое значение внутри вашего компонента, которое используется внутри функции.

При первом рендере <CodeStep step={3}>возвращаемая функция</CodeStep> из `useCallback` будет той функцией, которую вы передали.

При последующих рендерах React сравнит <CodeStep step={2}>зависимости</CodeStep> с теми, которые вы передали при предыдущем рендере. Если ни одна из зависимостей не изменилась (сравнение производится с помощью [`Object.is`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` вернёт ту же функцию, что и раньше. В противном случае, `useCallback` вернёт функцию, переданную при *текущем* рендере.

Другими словами, `useCallback` кеширует функцию между повторными рендерами до тех пор, пока её зависимости не изменятся.

**Давайте рассмотрим пример, чтобы понять, когда это полезно.**

Предположим, вы передаёте функцию `handleSubmit` из компонента `ProductPage` в компонент `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

Вы заметили, что при переключении пропа `theme` приложение на мгновение зависает, но если убрать `<ShippingForm />` из вашего JSX, оно работает быстро. Это говорит о том, что стоит попытаться оптимизировать компонент `ShippingForm`.

**По умолчанию, когда компонент повторно рендерится, React рекурсивно отрендерит снова все его дочерние компоненты.** Поэтому, когда `ProductPage` рендерится с другим `theme`, компонент `ShippingForm` *тоже* повторно рендерится. Это нормально для компонентов, которые не требуют больших вычислений при рендере. Но если повторный рендер медленный, можно сказать `ShippingForm` пропустить повторный рендеринг, если его пропсы такие же, как при последнем рендере, обернув его в [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**С этим изменением `ShippingForm` будет пропускать повторный рендер, если все его пропсы останутся *такими же* , как при последнем рендере.** Вот когда кеширование функции становится важным! Предположим, вы определили `handleSubmit` без `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Каждый раз, когда тема изменяется, это будет другая функция...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... таким образом, пропсы ShippingForm никогда не будут одинаковыми, и он будет повторно рендериться каждый раз. */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**В JavaScript `function () {}` or `() => {}` всегда создаёт _новую_ функцию,** так же как литерал объекта `{}` всегда создаёт новый объект. Обычно это не проблема, но это означает, что пропсы `ShippingForm` никогда не будут одинаковыми, и ваша оптимизация с [`memo`](/reference/react/memo) не сработает. Здесь на помощь приходит `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Сообщите React, чтобы кешировать вашу функцию между повторными рендерами...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // // ...пока эти зависимости не изменятся...

  return (
    <div className={theme}>
      {/* ...ShippingForm будет получать те же пропсы и может пропускать повторный рендер */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Оборачивая `handleSubmit` в `useCallback`, вы гарантируете, что это *одна и та же* функция между повторными рендерами** (пока зависимости не изменятся). Вам *не нужно* оборачивать функцию в `useCallback`, если на это нет конкретной причины. В этом примере причина в том, что вы передаёте её в компонент, обёрнутый в [`memo`,](/reference/react/memo) что позволяет ему пропускать повторные рендеры. Есть и другие причины использовать `useCallback`, которые описаны далее на этой странице.

<Note>

**Вы должны полагаться на `useCallback` только как на оптимизацию производительности.** Если ваш код не работает без него, найдите и устраните основную проблему сначала. Затем вы можете добавить `useCallback` обратно.

</Note>

<DeepDive>

#### Как useCallback связан с useMemo? {/*how-is-usecallback-related-to-usememo*/}

Вы часто увидите [`useMemo`](/reference/react/useMemo) вместе с `useCallback`. Они оба полезны при оптимизации дочернего компонента. Они позволяют вам [мемоизировать](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BC%D0%BE%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F) (или, другими словами, кешировать) что-то, что вы передаёте вниз по иерархии:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // // Вызывает вашу функцию и кеширует её результат
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Кеширует саму вашу функцию
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

Разница заключается в *том*, что они позволяют вам кешировать:

* **[`useMemo`](/reference/react/useMemo) кеширует *результат* вызова вашей функции.** В этом примере он кеширует результат вызова `computeRequirements(product)`, чтобы он не изменялся, если `product` не изменился. Это позволяет передавать объект `requirements` без ненужного повторного рендеринга `ShippingForm`. При необходимости, React вызовет функцию, которую вы передали во время рендера, для вычисления результата.
* **`useCallback` кеширует *саму функцию.*** В отличие от `useMemo`, он не вызывает предоставленную функцию. Вместо этого он кеширует переданную функцию, чтобы `handleSubmit` не изменялся *сам*, если  `productId` или `referrer` не изменились. Это позволяет передавать функцию `handleSubmit` без ненужного повторного рендеринга `ShippingForm`. Ваш код не будет выполняться до тех пор, пока пользователь не отправит форму.

Если вы уже знакомы с [`useMemo`,](/reference/react/useMemo) вам может быть полезно думать о `useCallback` так:

<<<<<<< HEAD
```js
// Упрощённая реализация (внутри React)
=======
```js {expectedErrors: {'react-compiler': [3]}}
// Simplified implementation (inside React)
>>>>>>> c7d6b700038c63d1aaf2c649af1aefe01ebbacac
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Читайте больше о разнице между `useMemo` и `useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### Следует ли добавлять useCallback повсюду? {/*should-you-add-usecallback-everywhere*/}

<<<<<<< HEAD
Если ваше приложение похоже на этот сайт, и большинство взаимодействий грубые (например, замена страницы или целого раздела), мемоизация обычно не нужна. С другой стороны, если ваше приложение похоже на редактор рисунков, и большинство взаимодействий детализированы (например, перемещение фигур), мемоизация может быть очень полезной.

Кеширование функции с помощью `useCallback` полезно в нескольких случаях:
=======
If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.

Caching a function with `useCallback` is only valuable in a few cases:
>>>>>>> c7d6b700038c63d1aaf2c649af1aefe01ebbacac

- Вы передаёте её как проп компоненту, обёрнутому в [`memo`.](/reference/react/memo) Вы хотите пропустить повторный рендер, если значение не изменилось. Мемоизация позволяет вашему компоненту повторно рендериться, только если зависимости изменились.
- Функция, которую вы передаёте, позже используется как зависимость в каком-то хуке. Например, другая функция, обёрнутая в `useCallback`, зависит от неё, или вы зависите от этой функции в [`useEffect.`](/reference/react/useEffect)

Нет смысла оборачивать функцию в `useCallback` в других случаях. Это не принесёт значительного вреда, поэтому некоторые команды решают не думать о конкретных случаях и мемоизируют как можно больше. Недостатком является то, что код становится менее читаемым. Кроме того, не всякая мемоизация эффективна: одно значение, которое «всегда новое», достаточно, чтобы сломать мемоизацию для всего компонента.

Обратите внимание, что `useCallback` не предотвращает *создание* функции. Вы всегда создаёте функцию (и это нормально!), но React игнорирует её и возвращает кешированную функцию, если ничего не изменилось.

**На практике можно сделать большую часть мемоизации ненужной, следуя нескольким принципам:**

<<<<<<< HEAD
1. Когда компонент оборачивает другие компоненты, пусть он [принимает JSX как дочерний.](/learn/passing-props-to-a-component#passing-jsx-as-children) Если обёрточный компонент обновляет своё состояние, React знает, что его дети не нужно повторно рендерить.
1. Предпочитайте локальное состояние и не [поднимайте состояние выше,](/learn/sharing-state-between-components) чем это необходимо. Не держите временное состояние, такое как формы или состояние наведения, на верхнем уровне дерева или в глобальной библиотеке состояния.
1. Держите [логику рендеринга чистой.](/learn/keeping-components-pure) Если повторный рендеринг компонента вызывает проблему или заметные визуальные артефакты, это ошибка в вашем компоненте! Исправьте ошибку вместо добавления мемоизации.
1. Избегайте [ненужных эффектов, которые обновляют состояние.](/learn/you-might-not-need-an-effect) Большинство проблем с производительностью в приложениях React вызвано цепочками обновлений, исходящими от эффектов, которые заставляют ваши компоненты рендериться снова и снова.
1. Попытайтесь [удалить ненужные зависимости из ваших эффектов.](/learn/removing-effect-dependencies) Например, вместо мемоизации часто проще переместить какой-то объект или функцию внутрь эффекта или за пределы компонента.
=======
1. When a component visually wraps other components, let it [accept JSX as children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Then, if the wrapper component updates its own state, React knows that its children don't need to re-render.
2. Prefer local state and don't [lift state up](/learn/sharing-state-between-components) any further than necessary. Don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library.
3. Keep your [rendering logic pure.](/learn/keeping-components-pure) If re-rendering a component causes a problem or produces some noticeable visual artifact, it's a bug in your component! Fix the bug instead of adding memoization.
4. Avoid [unnecessary Effects that update state.](/learn/you-might-not-need-an-effect) Most performance problems in React apps are caused by chains of updates originating from Effects that cause your components to render over and over.
5. Try to [remove unnecessary dependencies from your Effects.](/learn/removing-effect-dependencies) For example, instead of memoization, it's often simpler to move some object or a function inside an Effect or outside the component.
>>>>>>> c7d6b700038c63d1aaf2c649af1aefe01ebbacac

Если конкретное взаимодействие все ещё кажется медленным, [используйте профайлер в React Developer Tools,](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) чтобы определить, какие компоненты больше всего выиграют от мемоизации, и добавьте мемоизацию там, где это необходимо. Эти принципы делают ваши компоненты легче для отладки и понимания, поэтому хорошо следовать им в любом случае. В долгосрочной перспективе мы исследуем [возможность автоматической мемоизации](https://www.youtube.com/watch?v=lGEMwh32soc), чтобы решить эту проблему раз и навсегда.

</DeepDive>

<Recipes titleText="Разница между useCallback и непосредственным объявлением функции" titleId="examples-rerendering">

#### Пропуск повторного рендеринга с помощью `useCallback` и `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

В этом примере компонент `ShippingForm` **искусственно замедлен,** чтобы вы могли увидеть, что происходит, когда React-компонент действительно медленный. Попробуйте увеличить счётчик и переключить тему.

Увеличение счётчика ощущается медленным, потому что это вынуждает замедленный `ShippingForm` повторно рендериться. Это ожидаемо, так как счётчик изменился, и нужно отобразить новый выбор пользователя на экране.

Теперь попробуйте переключить тему. **Благодаря `useCallback` вместе с [`memo`](/reference/react/memo), это происходит быстро, несмотря на искусственное замедление!** `ShippingForm` пропустил повторный рендер, потому что функция `handleSubmit` не изменилась. Функция `handleSubmit` не изменилась, потому что `productId` и `referrer` (зависимости вашего `useCallback`) не изменились с момента последнего рендера.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмный режим
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Представьте, что это отправляет запрос...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ИСКУССТВЕННО ЗАМЕДЛЕНО] Рендеринг <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ничего не делаем в течение 500 мс, чтобы имитировать очень медленный код
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Примечание: <code>ShippingForm</code> искусственно замедлен!</b></p>
      <label>
        Количество предметов:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Улица:
        <input name="street" />
      </label>
      <label>
        Город:
        <input name="city" />
      </label>
      <label>
        Почтовый индекс:
        <input name="zipCode" />
      </label>
      <button type="submit">Отправить</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Всегда повторно рендерящийся компонент {/*always-re-rendering-a-component*/}

В этом примере реализация `ShippingForm` также **искусственно замедлена**, чтобы вы могли увидеть, что происходит, когда некоторый компонент React действительно медленный. Попробуйте увеличить счётчик и переключить тему.

В отличие от предыдущего примера, теперь переключение темы тоже медленное! Это потому, что **в этой версии нет вызова `useCallback`,** поэтому `handleSubmit` всегда новая функция, и замедленный компонент `ShippingForm` не может пропустить повторный рендеринг.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмный режим
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Представьте, что это отправляет запрос...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ИСКУССТВЕННО ЗАМЕДЛЕНО] Рендеринг <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ничего не делаем в течение 500 мс, чтобы имитировать очень медленный код
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Примечание: <code>ShippingForm</code> искусственно замедлен!</b></p>
      <label>
        Количество предметов:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Улица:
        <input name="street" />
      </label>
      <label>
        Город:
        <input name="city" />
      </label>
      <label>
        Почтовый индекс:
        <input name="zipCode" />
      </label>
      <button type="submit">Отправить</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Заметна ли теперь разница из-за отсутствия **с удалённым искусственным замедлением.** Заметна ли теперь разница из-за отсутствия `useCallback`?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Тёмный режим
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Представьте, что это отправляет запрос...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Рендеринг <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Количество предметов:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Улица:
        <input name="street" />
      </label>
      <label>
        Город:
        <input name="city" />
      </label>
      <label>
        Почтовый индекс:
        <input name="zipCode" />
      </label>
      <button type="submit">Отправить</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


Довольно часто код без мемоизации работает нормально. Если ваши взаимодействия достаточно быстрые, мемоизация не нужна.

Имейте в виду, что вам нужно запускать React в режиме продакшн, отключить [React Developer Tools](/learn/react-developer-tools) и использовать устройства, похожие на те, которые используют ваши пользователи, чтобы получить реалистичное представление о том, что действительно замедляет ваше приложение.

<Solution />

</Recipes>

---

### Обновление состояния из мемоизированного колбэка {/*updating-state-from-a-memoized-callback*/}

Иногда может потребоваться обновить состояние на основе предыдущего состояния из мемоизированного колбэка.

Эта функция `handleAddTodo` указывает `todos` как зависимость, потому что она вычисляет новые `todos`:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Обычно вы хотите, чтобы у мемоизированных функций было как можно меньше зависимостей. Когда вы читаете состояние только для вычисления следующего состояния, вы можете удалить эту зависимость, передавая [функцию обновления:](/reference/react/useState#updating-state-based-on-the-previous-state)

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ Нет необходимости в зависимости от todos
  // ...
```

Здесь, вместо того чтобы делать `todos` зависимостью и считывать его внутри, вы передаёте React инструкцию о том, *как* обновить состояние (`todos => [...todos, newTodo]`). [Подробнее о функциях обновления.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Предотвращение слишком частого срабатывания эффекта {/*preventing-an-effect-from-firing-too-often*/}

Иногда может понадобиться вызвать функцию из [эффекта:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Это создаёт проблему. [Каждое реактивное значение должно быть объявлено как зависимость вашего эффекта.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Однако, если вы объявите `createOptions` как зависимость, это приведёт к постоянному повторному подключению эффекта к чат-комнате:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Проблема: Эта зависимость изменяется при каждом рендере
  // ...
```

Чтобы решить эту проблему, вы можете обернуть функцию, которую нужно вызвать из эффекта, в `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Изменяется только при изменении roomId

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Изменяется только при изменении createOptions
  // ...
```

Это гарантирует, что функция `createOptions` остаётся той же между рендерами, если `roomId` не изменился. **Однако, ещё лучше убрать необходимость в зависимости от функции.** Переместите свою функцию *внутрь* эффекта:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ Нет необходимости в useCallback или зависимостях функции!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Изменяется только при изменении roomId
  // ...
```

Теперь ваш код проще и не нуждается в `useCallback`. [ Узнайте больше об удалении зависимостей эффекта.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Оптимизация пользовательского хука {/*optimizing-a-custom-hook*/}

Если вы пишете [пользовательский хук,](/learn/reusing-logic-with-custom-hooks) рекомендуется оборачивать любые функции, которые он возвращает, в `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Это гарантирует, что потребители вашего хука могут оптимизировать свой код при необходимости.

---

## Устранение неполадок {/*troubleshooting*/}

### Каждый раз, когда мой компонент рендерится, `useCallback` возвращает другую функцию {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Убедитесь, что вы указали массив зависимостей в качестве второго аргумента!

Если вы забудете массив зависимостей, `useCallback` будет возвращать новую функцию каждый раз:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Возвращает новую функцию каждый раз: нет массива зависимостей
  // ...
```

Вот исправленная версия с передачей массива зависимостей в качестве второго аргумента:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Не возвращает новую функцию без необходимости
  // ...
```

Если это не помогает, проблема может быть в том, что хотя бы одна из ваших зависимостей отличается от предыдущего рендера. Вы можете отладить эту проблему, вручную выводя зависимости в консоль:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```


Вы можете щёлкнуть правой кнопкой мыши на массивах из разных рендеров в консоли и выбрать "Store as global variable" для обоих. Предположим, первый сохранён как `temp1` , а второй как `temp2`. Затем вы можете использовать консоль браузера, чтобы проверить, являются ли каждая зависимость в обоих массивах одинаковыми:

```js
Object.is(temp1[0], temp2[0]); // Первая зависимость одинаковая в обоих массивах?
Object.is(temp1[1], temp2[1]); // Вторая зависимость одинаковая в обоих массивах?
Object.is(temp1[2], temp2[2]); // ... и так далее для каждой зависимости ...
```

Когда вы найдёте зависимость, нарушающую мемоизацию, либо найдите способ удалить её, либо [мемоизируйте её также.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Мне нужно вызвать `useCallback` для каждого элемента списка в цикле, но это не разрешено {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Предположим, что компонент `Chart` обёрнут в [`memo`](/reference/react/memo). Вы хотите пропустить повторный рендеринг каждого `Chart` в списке, когда компонент `ReportList` рендерится заново. Однако вы не можете вызывать `useCallback` в цикле:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Вы не можете вызывать useCallback в цикле вот так:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Вместо этого выделите компонент для отдельного элемента и поместите `useCallback` там:

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Вызовите useCallback на верхнем уровне:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Альтернативно, вы можете убрать `useCallback` в последнем фрагменте кода и вместо этого обернуть `Report` в [`memo`.](/reference/react/memo) Если проп `item` не изменяется, `Report` пропустит повторный рендеринг, поэтому `Chart` также пропустит повторный рендеринг:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
