---
title: Рендер и фиксация
---

<Intro>

Прежде чем ваши компоненты появятся на экране, они должны быть отрисованы React. Понимая этапы этого процесса, вам будет проще судить о том, как исполняется ваш код, и объяснить его поведение

</Intro>

<YouWillLearn>

* Что означает рендеринг в React.
* Когда и почему React рендерит компонент.
* Этапы отображения компонента на экране.
* Почему рендеринг не всегда приводит к обновлению DOM.

</YouWillLearn>

Представьте, что ваши компоненты — это повара на кухне, которые составляют вкусные блюда из ингредиентов. Тогда React — это официант, который передает запросы клиентов, а затем подает им их блюда. Этот процесс запроса и подачи пользовательского интерфейса состоит из трех этапов:

1. **Триггер** рендеринга (передача заказа гостя на кухню)
2. **Рендеринг** компонента (приготовление заказа на кухне)
3. **Фиксация** в DOM (подача блюда на стол)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Часть 1: Триггер рендера {/*step-1-trigger-a-render*/}

Рендер компонента происходит по двум причинам:

1. Это его **начальный рендеринг.**
2. Его **состояние** (или состояние его родителя) **был обновлён.**

### Начальный рендер {/*initial-render*/}

Когда ваше приложение запускается, вам необходимо запустить начальный рендеринг. Фреймворки и песочницы иногда скрывают этот код, но это делается вызовом функции [`createRoot`](/reference/react-dom/client/createRoot) с целевым DOM-узлом, а затем вызовом его метода `render` c вашим компонентом:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

Попробуйте закомментировать вызов `root.render()` и увидите, как компонент исчезнет!

### Ре-рендер, когда состояние обновляется {/*re-renders-when-state-updates*/}

После того как компонент был первоначально отрендерен, вы можете инициировать последующие рендеры, обновляя его состояние с помощью функции [`set`](/reference/react/useState#setstate). Обновление состояние компонента автоматически ставит его в очередь на рендер. (Вы можете представить это как посетитель ресторана, который после первого заказа заказывает чай, десерт и всевозможные вещи, в зависимости от состояния жажды или голода).

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. They patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Часть 2: React рендерит ваш компонент {/*step-2-react-renders-your-components*/}

После запуска рендера React вызывает ваши компоненты, чтобы определить, что отобразить на экране. **«Рендеринг» — это обращение React к вашим компонентам*.

* **На начальном рендере,** React вызовет корневой компонент.
* **Для последующих ре-рендеров** React вызовет функцию компонента, где обновился стейт и выполнит его ре-рендер.

Этот процесс рекурсивен: если обновленный компонент возвращает какой-то другой компонент, React будет рендерить _этот_ компонент следующим, и если этот компонент тоже что-то возвращает, он будет рендерить _этот_ компонент следующим, и так далее. Этот процесс будет продолжаться до тех пор, пока не останется вложенных компонентов и React не будет точно знать, что должно быть отображено на экране.

В следующем примере React вызовет `Gallery()` и  `Image()` несколько раз:

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **На начальном рендере,** React [создаст DOM ноды](https://developer.mozilla.org/docs/Web/API/Document/createElement) для `<section>`, `<h1>`, и трёх `<img>` тегов. 
* **Во время повторного ре-рендеринга,** React вычислит, какие из их свойств, если таковые имеются, изменились с момента предыдущего рендеринга. Он ничего не будет делать с этой информацией до следующего шага, фазы фиксации.

<Pitfall>

Рендеринг всегда должен быть [чистым вычислением.](/learn/keeping-components-pure):

* **Одни и те же входные данные, один и тот же результат.** При одинаковых входящих данных компонент всегда должен возвращать один и тот же JSX. (Когда кто-то заказывает салат с помидорами, то он не должен получить салат с луком!)
* **Занимается только своей задачей.** Не изменять объекты или переменные, существовавшие до рендеринга. (Один заказ не должен влиять на другой заказ).

В противном случае вы можете столкнуться с непонятными ошибками и непредсказуемым поведением по мере роста сложности вашей кодовой базы. При разработке в "строгом режиме" React вызывает функцию каждого компонента дважды, что может помочь выявить ошибки, вызванные нечистыми функциями.

</Pitfall>

<DeepDive>

#### Оптимизируем производительность {/*optimizing-performance*/}

Поведение по умолчанию — рендеринг всех компонентов, вложенных в обновленный компонент, — не является оптимальным с точки зрения производительности, если обновляемый компонент находится очень высоко в дереве. Если вы столкнулись с проблемой производительности, есть несколько способов ее решения, описанных в разделе [Производительность](https://reactjs.org/docs/optimizing-performance.html). **Не оптимизируйте преждевременно!**

</DeepDive>

## Часть 3: React фиксирует изменения в DOM {/*step-3-react-commits-changes-to-the-dom*/}

После рендеринга (вызова) ваших компонентов React модифицирует DOM. 

* **На начальном рендере,** React использует [`appendChild()`](https://developer.mozilla.org/ru/docs/Web/API/Node/appendChild) DOM API, чтобы вставить все DOM ноды, которые он создал на экране. 
* **Для ре-рендеров,** React будет применять минимально необходимые операции (вычисляемые во время рендеринга!), чтобы DOM соответствовал последнему выводу рендеринга.

**React изменяет узлы DOM только если есть разница между рендерами.** Например, вот компонент, который рендерится с разными пропсами, передаваемыми от родителя каждую секунду. Обратите внимание, как вы можете добавить некоторый текст в `<input>`, обновляя его `значение`, но текст не исчезает при повторном рендеринге компонента:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Это работает, потому что в предыдущий раз React обновил значение `<h1>` с новым `time`. Он видит, что `<input>` появляется в том же месте JSX, поэтому React не трогает `<input>`— или его `value`!
## Заключительная часть: Браузерная отрисовка {/*epilogue-browser-paint*/}

После того как рендеринг завершен и React обновил DOM, браузер перерисовывает экран. Хотя этот процесс известен как «браузерный рендеринг», мы будем называть его «рисованием», чтобы избежать путаницы в документации.

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Любое обновление экрана в приложении React происходит в три этапа:
  1. Триггер
  2. Рендеринг
  3. Фиксация
* Вы можете использовать строгий режим для поиска ошибок в ваших компонентах.
* React не трогает DOM, если результат рендеринга такой же, как и в прошлый раз.

</Recap>

