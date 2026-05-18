---
title: Reacting to Input with State
---

<Intro>

React предоставляет декларативный способ манипулирования пользовательским интерфейсом. Вместо того чтобы напрямую манипулировать отдельными частями интерфейса, вы описываете различные состояния, в которых может находиться ваш компонент, и переключаетесь между ними в ответ на действия пользователя. Это похоже на то, как дизайнеры думают о пользовательском интерфейсе.

</Intro>

<YouWillLearn>

* Чем декларативное программирование пользовательского интерфейса отличается от императивного
* Как перечислить различные визуальные состояния, в которых может находиться ваш компонент
* Как инициировать изменения между различными визуальными состояниями из кода

</YouWillLearn>

## Сравнение декларативного пользовательского интерфейса с императивным {/*how-declarative-ui-compares-to-imperative*/}

Когда вы проектируете пользовательские взаимодействия, вы, вероятно, думаете о том, как пользовательский интерфейс *изменяется* в ответ на действия пользователя. Рассмотрим форму, которая позволяет пользователю отправить ответ:

* Когда вы что-то вводите в форму, кнопка "Submit" **становится активной.**
* Когда вы нажимаете "Submit", форма и кнопка **становятся неактивными,** и **появляется** индикатор загрузки.
* Если сетевой запрос успешен, форма **скрывается,** и **появляется** сообщение "Thank you".
* Если сетевой запрос завершается ошибкой, **появляется** сообщение об ошибке, и форма **снова становится активной.**

В **императивном программировании** вышеизложенное напрямую соответствует тому, как вы реализуете взаимодействие. Вам нужно написать точные инструкции для манипулирования пользовательским интерфейсом в зависимости от того, что только что произошло. Вот другой способ взглянуть на это: представьте, что вы едете рядом с кем-то в машине и пошагово говорите ему, куда повернуть.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="В машине, управляемой человеком с тревожным выражением лица, представляющим JavaScript, пассажир приказывает водителю выполнить последовательность сложных пошаговых навигаций." />

Он не знает, куда вы хотите поехать, он просто следует вашим командам. (И если вы дадите неверные указания, вы окажетесь не там, где нужно!) Это называется *императивным*, потому что вы должны "командовать" каждым элементом, от индикатора загрузки до кнопки, говоря компьютеру, *как* обновлять пользовательский интерфейс.

В этом примере императивного программирования пользовательского интерфейса форма построена *без* React. Она использует только браузерный [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model):

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Имитируем сетевой запрос.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Манипулирование пользовательским интерфейсом императивно работает достаточно хорошо для изолированных примеров, но становится экспоненциально сложнее управлять в более сложных системах. Представьте себе обновление страницы, полной различных форм, подобных этой. Добавление нового элемента пользовательского интерфейса или нового взаимодействия потребует тщательной проверки всего существующего кода, чтобы убедиться, что вы не внесли ошибку (например, забыли что-то показать или скрыть).

React был создан для решения этой проблемы.

В React вы не манипулируете пользовательским интерфейсом напрямую — то есть вы не включаете, не отключаете, не показываете и не скрываете компоненты напрямую. Вместо этого вы **объявляете, что хотите показать,** а React выясняет, как обновить пользовательский интерфейс. Представьте, что вы садитесь в такси и говорите водителю, куда вы хотите поехать, вместо того чтобы точно указывать ему, где повернуть. Задача водителя — доставить вас туда, и он, возможно, даже знает некоторые короткие пути, которые вы не учли!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="В машине, управляемой React, пассажир просит отвезти его в определенное место на карте. React выясняет, как это сделать." />

## Думаем о пользовательском интерфейсе декларативно {/*thinking-about-ui-declaratively*/}

Вы видели, как реализовать форму императивно выше. Чтобы лучше понять, как думать в React, вы пройдёте по переписыванию этого пользовательского интерфейса в React ниже:

1. **Определите** различные визуальные состояния вашего компонента
2. **Определите**, что вызывает эти изменения состояния
3. **Представьте** состояние в памяти с помощью `useState`
4. **Удалите** все несущественные переменные состояния
5. **Подключите** обработчики событий для установки состояния

### Шаг 1: Определите различные визуальные состояния вашего компонента {/*step-1-identify-your-components-different-visual-states*/}

В информатике вы можете услышать, что "конечный автомат" находится в одном из нескольких "состояний". Если вы работаете с дизайнером, вы могли видеть макеты для различных "визуальных состояний". React находится на пересечении дизайна и информатики, поэтому обе эти идеи служат источником вдохновения.

Сначала вам нужно визуализировать все различные "состояния" пользовательского интерфейса, которые может увидеть пользователь:

*   **Пустое**: Форма имеет отключенную кнопку "Отправить".
*   **Ввод**: Форма имеет включенную кнопку "Отправить".
*   **Отправка**: Форма полностью отключена. Отображается индикатор загрузки.
*   **Успех**: Вместо формы отображается сообщение "Спасибо".
*   **Ошибка**: То же, что и состояние ввода, но с дополнительным сообщением об ошибке.

Как и дизайнер, вы захотите "создать макет" или "прототипы" для различных состояний, прежде чем добавлять логику. Например, вот макет только визуальной части формы. Этот макет управляется пропсом `status` со значением по умолчанию `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Вы можете назвать этот пропс как угодно, название не имеет значения. Попробуйте изменить `status = 'empty'` на `status = 'success'`, чтобы увидеть сообщение об успехе. Макеты позволяют быстро итерировать пользовательский интерфейс перед подключением какой-либо логики. Вот более проработанный прототип того же компонента, по-прежнему "управляемый" пропсом `status`:

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Отображение множества визуальных состояний одновременно {/*displaying-many-visual-states-at-once*/}

Если у компонента много визуальных состояний, может быть удобно отобразить их все на одной странице:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Такие страницы часто называют "живыми руководствами по стилю" или "storybook".

</DeepDive>

### Шаг 2: Определите, что вызывает эти изменения состояния {/*step-2-determine-what-triggers-those-state-changes*/}

Вы можете вызывать обновления состояния в ответ на два типа входных данных:

*   **Человеческие вводы**, такие как нажатие кнопки, ввод в поле, переход по ссылке.
*   **Компьютерные вводы**, такие как получение сетевого ответа, завершение тайм-аута, загрузка изображения.

<IllustrationBlock>
  <Illustration caption="Человеческие вводы" alt="Палец." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Компьютерные вводы" alt="Единицы и нули." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

В обоих случаях **вы должны устанавливать [переменные состояния](/learn/state-a-components-memory#anatomy-of-usestate) для обновления пользовательского интерфейса.** Для формы, которую вы разрабатываете, вам потребуется изменять состояние в ответ на несколько различных входных данных:

*   **Изменение текстового поля** (человеческий ввод) должно переключать его из состояния *Пустое* в состояние *Ввод* или обратно, в зависимости от того, пуст ли текстовый блок.
*   **Нажатие кнопки "Отправить"** (человеческий ввод) должно переключать его в состояние *Отправка*.
*   **Успешный сетевой ответ** (компьютерный ввод) должен переключать его в состояние *Успех*.
*   **Неудачный сетевой ответ** (компьютерный ввод) должен переключать его в состояние *Ошибка* с соответствующим сообщением об ошибке.

<Note>

Обратите внимание, что человеческие вводы часто требуют [обработчиков событий](/learn/responding-to-events)!

</Note>

Чтобы помочь визуализировать этот поток, попробуйте нарисовать каждое состояние на бумаге в виде помеченного круга, а каждое изменение между двумя состояниями — в виде стрелки. Вы можете набросать множество потоков таким образом и устранить ошибки задолго до реализации.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Блок-схема, движущаяся слева направо, с 5 узлами. Первый узел с меткой 'empty' имеет один край с меткой 'start typing', ведущий к узлу с меткой 'typing'. Этот узел имеет один край с меткой 'press submit', ведущий к узлу с меткой 'submitting', который имеет два края. Левый край помечен как 'network error' и ведет к узлу с меткой 'error'. Правый край помечен как 'network success' и ведет к узлу с меткой 'success'.">

Состояния формы

</Diagram>

</DiagramGroup>

### Шаг 3: Представьте состояние в памяти с помощью `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Далее вам нужно будет представить визуальные состояния вашего компонента в памяти с помощью [`useState`.](/reference/react/useState) Простота — ключ к успеху: каждое состояние — это "движущаяся часть", и **вам нужно как можно меньше "движущихся частей".** Большая сложность ведет к большему количеству ошибок!

Начните с состояния, которое *абсолютно необходимо*. Например, вам нужно будет сохранить `answer` для ввода и `error` (если он есть) для хранения последней ошибки:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Затем вам понадобится переменная состояния, представляющая, какое из визуальных состояний вы хотите отобразить. Обычно существует более одного способа представить это в памяти, поэтому вам нужно будет поэкспериментировать.

Если вам трудно сразу придумать лучший способ, начните с добавления достаточного количества состояний, чтобы вы были *абсолютно уверены*, что все возможные визуальные состояния охвачены:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Ваша первая идея, вероятно, не будет лучшей, но это нормально — рефакторинг состояния является частью процесса!

### Шаг 4: Удалите все несущественные переменные состояния {/*step-4-remove-any-non-essential-state-variables*/}

Вы хотите избежать дублирования содержимого состояния, поэтому отслеживайте только самое необходимое. Небольшое время, потраченное на рефакторинг структуры состояния, сделает ваши компоненты более понятными, уменьшит дублирование и позволит избежать непреднамеченных значений. Ваша цель — **предотвратить случаи, когда состояние в памяти не представляет никакого допустимого пользовательского интерфейса, который вы хотели бы видеть.** (Например, вы никогда не хотите отображать сообщение об ошибке и одновременно отключать ввод, иначе пользователь не сможет исправить ошибку!)

Вот несколько вопросов, которые вы можете задать о своих переменных состояния:

*   **Вызывает ли это состояние парадокс?** Например, `isTyping` и `isSubmitting` не могут быть оба `true`. Парадокс обычно означает, что состояние недостаточно ограничено. Существует четыре возможных комбинации двух булевых значений, но только три соответствуют допустимым состояниям. Чтобы устранить "невозможные" состояния, вы можете объединить их в `status`, который должен быть одним из трех значений: `'typing'`, `'submitting'` или `'success'`.
*   **Существует ли та же информация в другой переменной состояния?** Еще один парадокс: `isEmpty` и `isTyping` не могут быть одновременно `true`. Делая их отдельными переменными состояния, вы рискуете их рассинхронизацией и возникновением ошибок. К счастью, вы можете удалить `isEmpty` и вместо этого проверить `answer.length === 0`.
*   **Можно ли получить ту же информацию из инверсии другой переменной состояния?** `isError` не нужен, потому что вместо этого вы можете проверить `error !== null`.

После этой очистки у вас останется 3 (вместо 7!) *существенных* переменной состояния:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

Вы знаете, что они существенны, потому что не можете удалить ни одну из них, не нарушив функциональность.

<DeepDive>

#### Устранение «невозможных» состояний с помощью редьюсера {/*eliminating-impossible-states-with-a-reducer*/}

Эти три переменные являются достаточным представлением состояния этой формы. Однако все еще существуют некоторые промежуточные состояния, которые не совсем осмысленны. Например, ненулевая `error` не имеет смысла, когда `status` равен `'success'`. Чтобы более точно смоделировать состояние, вы можете [вынести его в редьюсер.](/learn/extracting-state-logic-into-a-reducer) Редьюсеры позволяют объединить несколько переменных состояния в один объект и консолидировать всю связанную логику!

</DeepDive>

### Шаг 5: Подключение обработчиков событий для установки состояния {/*step-5-connect-the-event-handlers-to-set-state*/}

Наконец, создайте обработчики событий, которые обновляют состояние. Ниже представлена финальная форма со всеми подключенными обработчиками событий:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Хотя этот код длиннее исходного императивного примера, он гораздо менее хрупок. Описание всех взаимодействий как изменений состояния позволяет в дальнейшем вводить новые визуальные состояния без нарушения существующих. Это также позволяет изменять то, что должно отображаться в каждом состоянии, не изменяя логику самого взаимодействия.

<Recap>

* Декларативное программирование означает описание пользовательского интерфейса для каждого визуального состояния, а не микроуправление им (императивное).
* При разработке компонента:
  1. Определите все его визуальные состояния.
  2. Определите триггеры (человеческие и компьютерные) для изменения состояния.
  3. Смоделируйте состояние с помощью `useState`.
  4. Удалите несущественное состояние, чтобы избежать ошибок и парадоксов.
  5. Подключите обработчики событий для установки состояния.

</Recap>



<Challenges>

#### Добавление и удаление CSS-класса {/*add-and-remove-a-css-class*/}

Сделайте так, чтобы при нажатии на изображение *удалялся* CSS-класс `background--active` из внешнего `<div>`, но *добавлялся* класс `picture--active` к `<img>`. Повторное нажатие на фон должно восстановить исходные CSS-классы.

Визуально вы должны увидеть, что при нажатии на изображение исчезает фиолетовый фон и выделяется рамка изображения. Повторное нажатие на фон снова выделяет фон, но убирает выделение рамки изображения.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Этот компонент имеет два визуальных состояния: когда изображение активно, и когда оно неактивно:

* Когда изображение активно, CSS-классы: `background` и `picture picture--active`.
* Когда изображение неактивно, CSS-классы: `background background--active` и `picture`.

Одной булевой переменной состояния достаточно, чтобы запомнить, активно ли изображение. Исходная задача заключалась в удалении или добавлении CSS-классов. Однако в React вам нужно *описать*, что вы хотите видеть, а не *манипулировать* элементами UI. Поэтому вам нужно рассчитать оба CSS-класса на основе текущего состояния. Вам также нужно [остановить распространение](/learn/responding-to-events#stopping-propagation), чтобы нажатие на изображение не регистрировалось как нажатие на фон.

Проверьте, работает ли эта версия, нажав на изображение, а затем вне его:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

В качестве альтернативы вы можете вернуть два отдельных блока JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Имейте в виду, что если два разных блока JSX описывают одно и то же дерево, их вложенность (первый `<div>` → первый `<img>`) должна совпадать. В противном случае переключение `isActive` приведет к воссозданию всего дерева ниже и [сбросу его состояния.](/learn/preserving-and-resetting-state) Поэтому, если в обоих случаях возвращается похожее дерево JSX, лучше написать его как единый элемент JSX.

</Solution>

#### Редактор профиля {/*profile-editor*/}

Вот небольшая форма, реализованная с использованием обычного JavaScript и DOM. Поиграйте с ней, чтобы понять ее поведение:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Эта форма переключается между двумя режимами: в режиме редактирования вы видите поля ввода, а в режиме просмотра — только результат. Метка кнопки меняется между «Edit» и «Save» в зависимости от режима. При изменении полей ввода приветственное сообщение внизу обновляется в реальном времени.

Ваша задача — переписать ее в React в песочнице ниже. Для вашего удобства разметка уже преобразована в JSX, но вам нужно будет сделать так, чтобы поля ввода отображались и скрывались, как в оригинале.

Убедитесь, что текст внизу также обновляется!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Вам понадобятся две переменные состояния для хранения значений полей ввода: `firstName` и `lastName`. Вам также понадобится переменная состояния `isEditing`, которая будет хранить информацию о том, отображать ли поля ввода или нет. Вам _не_ понадобится переменная `fullName`, поскольку полное имя всегда можно вычислить из `firstName` и `lastName`.

Наконец, вы должны использовать [условный рендеринг](/learn/conditional-rendering) для отображения или скрытия полей ввода в зависимости от `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Сравните это решение с исходным императивным кодом. Чем они отличаются?

</Solution>

#### Рефакторинг императивного решения без React {/*refactor-the-imperative-solution-without-react*/}

Вот исходная песочница из предыдущего задания, написанная императивно без React:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Представьте, что React не существует. Можете ли вы переписать этот код таким образом, чтобы сделать логику менее хрупкой и более похожей на версию React? Как бы это выглядело, если бы состояние было явным, как в React?

Если вы испытываете трудности с тем, с чего начать, заглушка ниже уже содержит большую часть структуры. Если вы начнете отсюда, заполните недостающую логику в функции `updateDOM`. (При необходимости обратитесь к исходному коду.)

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Отсутствующая логика включала переключение отображения полей ввода и контента, а также обновление меток:

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Функция `updateDOM`, которую вы написали, показывает, что делает React под капотом при установке состояния. (Однако React также избегает взаимодействия с DOM для свойств, которые не изменились с момента их последнего установки.)

</Solution>

</Challenges>
