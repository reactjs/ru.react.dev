---
title: Обработка ввода при помощи состояния
---

<Intro>

React предлагает декларативный способ управления интерфейсом. Вместо того, чтобы изменять отдельные элементы UI, вы описываете состояния, в которых ваш компонент может находиться, и переключаетесь между ними в ответ на пользовательский ввод. Это похоже на то, как дизайнеры воспринимают пользовательский интерфейс.

</Intro>

<YouWillLearn>

* Чем декларативное программирование UI отличается от императивного
* Как перечислить различные визуальные состояния, которые ваш компонент может принимать
* Как переключаться между визуальными состояниями из кода

</YouWillLearn>

## Чем декларативное программирование UI отличается от императивного {/*how-declarative-ui-compares-to-imperative*/}

Когда вы проектируете интерфейс приложения, скорее всего, вы думаете о том, как UI *поменяется* в ответ на действия пользователя. Давайте рассмотрим форму, через которую пользователь вводит ответ на вопрос:

* Если вы вводите что-либо в форму, кнопка "Отправить" **становится доступной.**
* Когда вы нажимаете "Отправить", форма и кнопка **становятся недоступны,** и **появляется** спиннер.
* Если запрос на сервер прошёл успешно, форма **скрывается,** и **появляется** сообщение "Верно!".
* Если запрос завершился с ошибкой, **появляется** сообщение с ошибкой и форма становится **доступной** снова.

В **императивном программировании** данные инструкции напрямую отражаются в том, как вы реализуете взаимодействие между элементами. Вы должны написать точные инструкции, чтобы изменить UI в ответ на то, что только что произошло. Вы можете представить себе этот процесс, как если бы вы ехали на пассажирском сидении и давали советы водителю куда повернуть.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="Машину ведёт неуверенный человек, который играет роль JavaScript, а водитель даёт указания как проехать по маршруту." />

Человек, который управляет автомобилем, не знает куда вы хотите проехать и только выполняет ваши команды. (И если вы ошибётесь с одним из поворотов, вы окажетесь не в том месте!) Этот подход называют *императивным*, потому что вы даёте "команды" каждому элементу, от спиннера до кнопки, рассказывая компьютеру *как* обновить UI.

В следующем примере императивного программирования форма сделана *без* React. Она использует [объектную модель документа (DOM)](https://developer.mozilla.org/ru-RU/docs/Web/API/Document_Object_Model):

<Sandpack>

```js index.js active
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
  // Добавим задержку, как-будто это запрос на сервер.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() == 'стамбул') {
        resolve();
      } else {
        reject(new Error('Хорошая попытка, но это неверный ответ. Попробуйте ещё раз!'));
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
  <h2>Викторина по городам</h2>
  <p>
    Какой город расположен на двух континентах?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Отправить</button>
  <p id="loading" style="display: none">Загрузка...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">Верно!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Управление интерфейсом императивно работает достаточно хорошо для изолированных примеров, но становится экспоненциально более тяжёлым в более сложных системах. Представьте обновление страницы, состоящей из нескольких форм, подобных этой. Чтобы добавить новый элемент или способ взаимодействия, потребуется внимательно просмотреть весь код и убедиться, что вы не привнесли баги. (Например, забыли что-то показать или скрыть).

React был создан, чтобы решить эту проблему.

В React вы не меняете UI напрямую, то есть вы не меняете доступность или видимость непосредственно для компонента. Вместо этого вы **описываете то, что вы хотите отобразить,** и React заботится о том, как обновить UI. Представьте, что вы поймали такси и описываете водителю место, в которое вы хотите приехать, вместо того, чтобы давать указания на каждом повороте. Это работа водителя довезти вас до пункта назначения, и может он(а) даже знает короткие пути неизвестные вам!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="React ведёт машину, а пассажир просит привезти его в опредлённое место на карте. React заботится о маршруте." />

## Мышление в декларативной парадигме {/*thinking-about-ui-declaratively*/}

Выше мы рассмотрели как реализовать форму императивным подходом. Чтобы лучше понять декларативный подход, мы сделаем тот же UI с React:

1. **Установите** визуальные состояния вашего компонента
2. **Определите** что вызывает изменения состояния
3. **Представьте** состояние в памяти с `useState`
4. **Уберите** любые несущественные переменные состояния
5. **Соедините** обработчики событий с установкой состояния

### Шаг 1: Установите визуальные состояния вашего компонента {/*step-1-identify-your-components-different-visual-states*/}

Вы могли слышать термин из информатики, ["конечный автомат"](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D0%B5%D1%87%D0%BD%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82), находящийся в одном из “состояний”. Если вы работаете с дизайнером, вы могли видеть макеты для различных "визуальных состояний". React находится на пересечении дизайна и информатики, и обе эти идеи стали источниками вдохновения.

Сперва, вы должны представить все возможные "состояния" UI, которые пользователь может увидеть:

* **Начало (empty)**: Форма с недоступной кнопкой "Отправить".
* **Ввод (typing)**: Форма с доступной кнопкой "Отправить".
* **Отправка (submitting)**: Форма полностью недоступна. Спиннер на экране.
* **Успех (success)**: Сообщение с текстом "Верно!" показано вместо формы.
* **Ошибка (error)**: Аналогично состоянию "Ввод", но дополнительно показывает сообщение ошибки.

Так же как и дизайнер, вы захотите сделать "макеты" для различных состояний прежде чем добавить логику. Например, вот макет для визуальной части формы. Этот макет управляется пропом `status` со значением по умолчанию `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Верно!</h1>
  }
  return (
    <>
      <h2>Викторина по городам</h2>
      <p>
        В каком городе рекламный щит превращает воздух в питьевую воду?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Отправить
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Вы можете назвать этот проп как вам нравится, наименование не важно. Попробуйте изменить `status = 'empty'` на `status = 'success'`, и вы увидите сообщение о правильном ответе. Создание визуальных макетов позволяет быстро определиться с интерфейсом, прежде чем вы привяжете логику. Далее более конкретный прототип того же компонента, по-прежнему под "управлением" пропа `status`:

<Sandpack>

```js
export default function Form({
  // Попробуйте 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Верно!</h1>
  }
  return (
    <>
      <h2>Викторина по городам</h2>
      <p>
        В каком городе рекламный щит превращает воздух в питьевую воду?
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
          Отправить
        </button>
        {status === 'error' &&
          <p className="Error">
            Хорошая попытка, но это неверный ответ. Попробуйте ещё раз!
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

#### Отображение нескольких визуальных состояний сразу {/*displaying-many-visual-states-at-once*/}

Если компонент имеет много визуальных состояний, может быть удобно показать их все на одной странице:

<Sandpack>

```js App.js active
import Form from './Form.js';

let statusesDict = {
  'empty': 'Начало',
  'typing': 'Ввод',
  'submitting': 'Отправка',
  'success': 'Успех',
  'error': 'Ошибка'
};

let statuses = Object.keys(statusesDict);

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Форма - {statusesDict[status]}:</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>Верно!</h1>
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
        Отправить
      </button>
      {status === 'error' &&
        <p className="Error">
          Хорошая попытка, но это неверный ответ. Попробуйте ещё раз!
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

Подобные страницы часто называют гидами по стилям (living styleguides) или сборниками историй (storybooks).

</DeepDive>

### Шаг 2: Определите что вызывает изменения состояния {/*step-2-determine-what-triggers-those-state-changes*/}

Вы можете обновить состояние в ответ на два вида событий:

* **Пользовательский ввод,** например, клик на кнопку, ввод текста, переход по ссылке.
* **Программный ввод,** например, ответ на сетевой запрос, прошедший таймаут, загрузка изображения.

<IllustrationBlock>
  <Illustration caption="Пользовательский ввод" alt="Палец." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Программный ввод" alt="Единицы и нули." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

В обоих случаях **вы должны установить [переменные состояния](/learn/state-a-components-memory#anatomy-of-usestate), чтобы обновить UI.** Для формы, которую мы разрабатываем, вам нужно изменить состояние в ответ на несколько различных ситуаций:

* **Изменение текста в поле ввода** (пользователь) должно переключить форму из состояния *Начало (Empty)* в состояние *Ввода (Typing)* или обратно, в зависимости от того, пустое поле или нет.
* **Клик на кнопку "Отправить"** (пользователь) должен переключить форму в состояние *Отправка (Submitting)*.
* **Успешный сетевой запрос** (программа) должен изменить состояние на *Успех (Success)*.
* **Неудачный сетевой запрос** (программа) должен изменить состояние на *Ошибка (Error)* с соответствующим сообщением.

<Note>

Обратите внимание, что пользовательский ввод, как правило, требует [обработку событий](/learn/responding-to-events)!

</Note>

Попробуйте визуализировать этот алгоритм, нарисуйте на бумаге кружочки с подписями для каждого состояния и соедините стрелками переходы между состояниями. Такая зарисовка может помочь обнаружить дефекты задолго до реализации.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Блок-схема, состоящая из 5 узлов слева направо. Первый узел подписан как 'начало' и соединён стрелкой с узлом 'ввод', стрелка подписана как 'начало ввода'. Узел 'ввод' соединён стрелкой с узлом 'отправка', стрелка подписана как 'нажать кнопку 'Отправить''. Узел 'отправка' слева подписан как 'сетевая ошибка' и соединён с узлом 'ошибка', а справа подписан как 'успешный запрос' и соединён с узлом 'успех'.">

Состояния формы

</Diagram>

</DiagramGroup>

### Шаг 3: Представьте состояние в памяти с `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Теперь вам нужно представить визуальные состояния вашего компонента в памяти при помощи [`useState`.](/reference/react/useState) Простота -- ключ к успеху: каждый кусочек состояния - "подвижный кусочек", и **вы хотите иметь как можно меньше таких "подвижных кусочков".** Более сложные решения ведут к появлению багов!

Начните с *самых необходимых* переменных состояния. Например, вам необходимо хранить `ответ` для поля ввода, и `ошибку` (если она возникла), чтобы сохранить последнюю ошибку:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Далее, вам нужна переменная состояния, чтобы знать какое из визуальных состояний показать. Обычно существует несколько путей как представить это в памяти, и вы можете поэкспериментировать и выбрать лучший.

Если вы затрудняетесь определить лучший способ, начните с добавления состояния, которое *точно* потребуется чтобы покрыть все ситуации:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Возможно ваша первая идея не будет лучшей, но это абсолютно нормально. Рефакторинг состояния -- неотъемлемая часть процесса!

### Шаг 4: Уберите любые несущественные переменные состояния {/*step-4-remove-any-non-essential-state-variables*/}

Вы хотите избежать дублирования в состоянии и следить только за тем, что необходимо. Небольшая трата времени на рефакторинг структуры вашего состояния сделает ваши компоненты легче для понимания, уменьшит дублирование и поможет избежать недопониманий. Ваша цель **предотвратить случаи, когда состояние в памяти не представляет никакого валидного UI, который ваши пользователи хотят увидеть.** (Например, вам не нужно показывать ошибку и делать поле ввода недоступным одновременно, так что пользователь не сможет исправить ошибку!)

Ниже приведены вопросы, которые вы можете задать себе о ваших переменных состояния:

* **Порождает ли это состояние парадоксы?** Например, `isTyping` и `isSubmitting` не могут быть одновременно `true`. Обычно парадокс говорит о том, что состояние недостаточно ограниченно. Мы имеем четыре возможных комбинаций двух булевых значений, но только три будут валидными состояниями. Чтобы удалить "невозможное" состояние, вы можете объединить текущие в переменную `status`, которая должна принимать одно из значений: `'typing'`, `'submitting'`, или `'success'`.
* **Доступна ли та же информация в других переменных состояния?** Другой парадокс: `isEmpty` и `isTyping` не могут быть `true` в одно и то же время. Сделав их отдельными переменными, вы рискуете получить рассинхронизацию их значений и баги в приложении. К счастью, вы можете удалить `isEmpty` и делать проверку `answer.length === 0`.
* **Можете ли вы получить ту же информацию из инверсии другой переменной состояния?** `isError` не нужна, потому что вы можете проверять `error !== null`.

После этой ревизии у нас осталось 3 (вместо 7!) *необходимых* переменных состояния:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

Вы знаете, что они необходимы, потому что удаление любой из них приведёт к поломке в функциональности.

<DeepDive>

#### Избавляемся от “невозможных” состояний с редюсером {/*eliminating-impossible-states-with-a-reducer*/}

Эти три переменных являются хорошим представлением состояния данной формы. Однако, некоторые промежуточные состояния не имеют особого смысла. Например, `error` со значением, отличным от null, не имеет смысла, когда `status` имеет значение `'success'`. Чтобы более точно смоделировать состояние, вы можете [поместить его в редюсер.](/learn/extracting-state-logic-into-a-reducer) Редюсеры позволяют объединить множество переменных состояния в один объект и консолидировать всю связанную логику!

</DeepDive>

### Шаг 5: Соедините обработчики событий с установкой состояния {/*step-5-connect-the-event-handlers-to-set-state*/}

Наконец, создайте обработчики событий, которые будут обновлять состояние. Ниже финальный код формы, со всеми обработчиками событий, привязанными к соответствующим частям состояния:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>Верно!</h1>
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
      <h2>Викторина по городам</h2>
      <p>
        В каком городе рекламный щит превращает воздух в питьевую воду?
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
          Отправить
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
  // Добавим задержку, как-будто это запрос на сервер.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'лима'
      if (shouldError) {
        reject(new Error('Хорошая попытка, но это неверный ответ. Попробуйте ещё раз!'));
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

Хотя этот код объемнее чем первый императивный пример, он менее хрупок. Выражая все взаимодействия в виде изменений состояния, вы сможете добавлять новые визуальные состояния без конфликтов с существующими. Этот подход также позволит менять внешний вид приложения без изменений логики взаимодействий.

<Recap>

* Декларативное программирование означает описание UI для каждого визуального состояния без управления отдельными элементами на странице (императивное).
* При разработке компонента:
  1. Установите все возможные визуальные состояния.
  2. Определите все пользовательские и программные события, которые могут изменить состояние.
  3. Смоделируйте состояние с `useState`.
  4. Уберите несущественные состояния, чтобы избежать багов и парадоксов.
  5. Соедините обработчики событий с установкой состояния.

</Recap>



<Challenges>

#### Добавление и удаление CSS-класса {/*add-and-remove-a-css-class*/}

Сделайте так, чтобы клик по картинке *удалил* CSS-класс с внешнего `<div>` и *добавил* класс `picture--active` на `<img>`. Клик по фону должен восстановить исходные CSS-классы.

Визуально вы ожидаете, что клик по картинке удаляет фиолетовый фон и подсвечивает рамку вокруг картинки. Клик снаружи картинки подсвечивает фон и удаляет рамку вокруг изображения.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Разноцветная деревня Кампунг Пеланги в Индонезии"
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
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Этот компонент имеет два визуальных состояния: когда картинка активна и когда картинка неактивна.

* Когда изображение активно, установлены CSS-классы `background` и `picture picture--active`.
* Когда изображение неактивно, установлены CSS-классы `background background--active` и `picture`.

Одной булевой переменной состояния достаточно, чтобы запомнить активно ли изображение. Исходная задача была удалить или добавить CSS-классы. Однако, в React вы должны *описать*, что вы хотите увидеть на экране, а не *управлять* UI-элементами. Таким образом вам необходимо вычислить оба CSS-класса из текущего состояния. Также вам потребуется [остановить распространение события](/learn/responding-to-events#stopping-propagation), чтобы клик по изображению не был обработан как клик по фону.

Убедитесь, что приведённое решение работает по клику по изображению и за его пределами:

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
        alt="Разноцветная деревня Кампунг Пеланги в Индонезии"
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

Другой способ -- вернуть два разных фрагмента JSX-кода:

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
          alt="Разноцветная деревня Кампунг Пеланги в Индонезии"
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
        alt="Разноцветная деревня Кампунг Пеланги в Индонезии"
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

Помните, что если два разных фрагмента JSX описывают одно дерево, вложенность элементов в них (первый `<div>` → первый `<img>`) должна соответствовать друг другу. Иначе, переключение `isActive` может пересоздать всё дерево ниже этого компонента и [сбросить его состояние.](/learn/preserving-and-resetting-state) По этой причине, если оба случая возвращают похожие JSX-деревья, лучше описать их одним JSX.

</Solution>

#### Редактор профиля {/*profile-editor*/}

Ниже приведена небольшая форма, которая реализована при помощи чистого JavaScript и DOM. Поиграйте с формой, чтобы понять её поведение:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Редактировать профиль') {
    editButton.textContent = 'Сохранить профиль';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Редактировать профиль';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Привет, ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Привет, ' +
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
    Имя:
    <b id="firstNameText">Джейн</b>
    <input
      id="firstNameInput"
      value="Джейн"
      style="display: none">
  </label>
  <label>
    Фамилия:
    <b id="lastNameText">Джекобс</b>
    <input
      id="lastNameInput"
      value="Джекобс"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Редактировать профиль</button>
  <p><i id="helloText">Привет, Джейн Джекобс!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Эта форма переключается между двумя режимами: при редактировании вы видите поля для ввода, а при просмотре видите только результат. Подпись кнопки меняется с "Редактировать профиль" на "Сохранить профиль" в зависимости от текущего режима. Когда вы меняете значения в полях ввода, приветственное сообщение снизу обновляется в реальном времени.

Ваша задача -- переписать реализацию на React в песочнице ниже. Для вашего удобства разметка уже была сконвертирована в JSX, но вам необходимо сделать показ и скрытие полей ввода так, как это было в оригинальном примере.

Не забудьте проверить, что надпись снизу также обновляется!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        Имя:{' '}
        <b>Джейн</b>
        <input />
      </label>
      <label>
        Фамилия:{' '}
        <b>Джекобс</b>
        <input />
      </label>
      <button type="submit">
        Редактировать профиль
      </button>
      <p><i>Привет, Джейн Джекобс!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Вам потребуется две переменных состояния для значений полей ввода: `firstName` и `lastName`. Вам также понадобится переменная состояния `isEditing`, которая скажет показывать поля ввода или нет. Вам _не_ нужна переменная `fullName`, поскольку полное имя всегда можно рассчитать из `firstName` и `lastName`.

Наконец, вам нужно использовать [условный рендеринг](/learn/conditional-rendering), чтобы показывать или скрывать поля ввода в зависимости от `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Джейн');
  const [lastName, setLastName] = useState('Джекобс');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        Имя:{' '}
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
        Фамилия:{' '}
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
        {isEditing ? 'Сохранить' : 'Редактировать'} профиль
      </button>
      <p><i>Привет, {firstName} {lastName}!</i></p>
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

Ниже песочница с кодом из предыдущего задания, написанная императивно без React:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Редактировать профиль') {
    editButton.textContent = 'Сохранить профиль';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Редактировать профиль';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Привет, ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Привет, ' +
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
    Имя:
    <b id="firstNameText">Джейн</b>
    <input
      id="firstNameInput"
      value="Джейн"
      style="display: none">
  </label>
  <label>
    Фамилия:
    <b id="lastNameText">Джекобс</b>
    <input
      id="lastNameInput"
      value="Джекобс"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Редактировать профиль</button>
  <p><i id="helloText">Привет, Джейн Джекобс!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Представьте, что React не существует. Можете ли вы переписать этот код так, чтобы логика была менее хрупкой и более похожей на React-версию? Как это будет выглядеть, если сделать состояние явным, как в React?

Если вы затрудняетесь с чего начать, заглушка ниже уже содержит большую часть необходимой структуры. Если вы начнёте отсюда, вам нужно будет добавить недостающую логику в функцию `updateDOM`. (Обратитесь к оригинальному коду где необходимо.)

<Sandpack>

```js index.js active
let firstName = 'Джейн';
let lastName = 'Джекобс';
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
    editButton.textContent = 'Сохранить профиль';
    // TODO: показать поля ввода, скрыть содержимое
  } else {
    editButton.textContent = 'Редактировать профиль';
    // TODO: скрыть поля ввода, показать содержимое
  }
  // TODO: обновить текст подписи
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
    Имя:
    <b id="firstNameText">Джейн</b>
    <input
      id="firstNameInput"
      value="Джейн"
      style="display: none">
  </label>
  <label>
    Фамилия:
    <b id="lastNameText">Джекобс</b>
    <input
      id="lastNameInput"
      value="Джекобс"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Редактировать профиль</button>
  <p><i id="helloText">Привет, Джейн Джекобс!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Пропущенная логика включает переключение отображения полей ввода и содержимого, а также надписей:

<Sandpack>

```js index.js active
let firstName = 'Джейн';
let lastName = 'Джекобс';
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
    editButton.textContent = 'Сохранить профиль';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Редактировать профиль';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Привет, ' +
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
    Имя:
    <b id="firstNameText">Джейн</b>
    <input
      id="firstNameInput"
      value="Джейн"
      style="display: none">
  </label>
  <label>
    Фамилия:
    <b id="lastNameText">Джекобс</b>
    <input
      id="lastNameInput"
      value="Джекобс"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Редактировать профиль</button>
  <p><i id="helloText">Привет, Джейн Джекобс!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Функция `updateDOM`, которую вы написали, показывает что React делает под капотом, когда вы устанавливаете состояние. (Однако, React не трогает элементы DOM, свойства которых не менялись с тех пор как были установлены.)

</Solution>

</Challenges>
