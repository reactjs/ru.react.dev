---
id: add-react-to-a-website
title: Добавляем React на сайт
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

<div class="scary">

>
> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> See [Add React to an Existing Project](https://react.dev/learn/add-react-to-an-existing-project) for the recommended ways to add React.

</div>

Используйте React в том объёме, в котором вам хочется.

Для внедрения React не надо ничего переписывать. **Его можно использовать как для маленькой кнопки, так и для целого приложения.** Возможно, вы захотите немного «оживить» вашу страницу. React-компоненты подходят для этого как нельзя лучше.

Большинство сайтов в Интернете является обычными HTML-страницами. Даже если ваш сайт не относится к одностраничным приложениям, вы можете добавить на него React, написав **всего несколько строк кода без каких-либо инструментов сборки**. В зависимости от целей, можно постепенно перенести на React весь сайт или переписать всего несколько виджетов.

---

- [Добавляем React за одну минуту](#add-react-in-one-minute)
- [Необязательно: Используем React с JSX](#optional-try-react-with-jsx) (без каких-либо бандлеров!)

## Добавляем React за одну минуту {#add-react-in-one-minute}

В этом разделе вы научитесь добавлять React на существующую HTML-страницу. Вы можете практиковаться на своём собственном сайте или создать для этого пустой HTML-файл.

Мы не будем пользоваться сложными инструментами сборки или что-то устанавливать. **Всё, что вам нужно -- это доступ к Интернету и минута свободного времени**.

Необязательно: [скачать готовый пример (архив 2 Кбайт)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/87f0b6f34238595b44308acfb86df6ea43669c08.zip)

### Шаг 1: Добавляем DOM-контейнер в HTML {#step-1-add-a-dom-container-to-the-html}

Для начала, откройте HTML-файл страницы, которую хотите отредактировать. Добавьте пустой тег `<div>` в месте, где вы хотите отобразить что-нибудь с помощью React. Например:

```html{3}
<!-- ... остальной HTML ... -->

<div id="like_button_container"></div>

<!-- ... остальной HTML ... -->
```

Затем назначьте созданному `<div>` уникальный атрибут `id`. Это позволит впоследствии найти тег из JavaScript-кода и отобразить React-компоненты внутри него.

>Совет
>
>«Контейнер» `<div>` можно поместить **где угодно** внутри тега `<body>`. Вы можете создать любое количество независимых DOM-контейнеров на одной странице. Эти контейнеры принято оставлять пустыми, так как React в любом случае заменяет всё их содержимое.

### Шаг 2: Добавляем script-теги {#step-2-add-the-script-tags}

Теперь добавьте три `<script>`-тега перед закрывающим тегом `</body>`:

```html{5,6,9}
  <!-- ... остальной HTML ... -->

  <!-- Загрузим React. -->
  <!-- Примечание: при деплое на продакшен замените «development.js» на «production.min.js». -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

  <!-- Загрузим наш React-компонент. -->
  <script src="like_button.js"></script>

</body>
```

Первые два тега загружают React. Третий тег загружает код вашего собственного компонента.

### Шаг 3: Создаём React-компонент {#step-3-create-a-react-component}

Создайте файл с именем `like_button.js` рядом с вашим HTML-файлом.

Возьмите **[этот стартовый код](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** и вставьте его в созданный ранее файл.

>Совет
>
>В данном коде создаётся React-компонент с именем `LikeButton`. Не беспокойтесь, если что-то кажется вам непонятным -- мы подробно разберём принципы разработки на React позже, в нашем [практическом руководстве](/tutorial/tutorial.html) и во [введении в основные понятия](/docs/hello-world.html). Пока же мы просто посмотрим, как это выглядит на экране.

Добавьте ещё 3 строки в конец файла `like_button.js`, после **[стартового кода](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**:

```js{3,4,5}
// ... стартовый код ...

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));
```

Эти три строки кода ищут элемент `<div>`, который мы добавили в HTML на первом шаге, а затем отображают React-компонент с кнопкой "Нравится" внутри него.

### Готово! {#thats-it}

Вот и всё! **Вы только что добавили свой первый React-компонент на страницу.**

Перейдите к следующим разделам, если хотите узнать о других способах добавить React.

**[Посмотреть финальный код примера](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Скачать код примера (архив 2 Кбайт)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/87f0b6f34238595b44308acfb86df6ea43669c08.zip)**

### Совет: Повторное использование компонентов {#tip-reuse-a-component}

Зачастую, вам может понадобиться отобразить React-компонент в нескольких местах одной и той же HTML-страницы. Вот как можно показать сразу три кнопки «Нравится» с разными данными:

[Посмотреть исходный код примера](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[Скачать код примера (архив 2 Кбайт)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/279839cb9891bd41802ebebc5365e9dec08eeb9f.zip)

>Примечание
>
>Этот способ лучше всего подходит для страниц, содержащих несколько изолированных участков кода, написанных на React. Внутри чистого React-кода проще использовать [композицию компонентов](/docs/components-and-props.html#composing-components).

### Совет: Минификация JavaScript для продакшена {#tip-minify-javascript-for-production}

Публикуя ваш сайт на продакшен, имейте в виду, что несжатый JavaScript значительно замедляет страницу для ваших пользователей.

Если вы уже минифицируете свои скрипты, то не забудьте подготовить к продакшену сам React. Для этого поменяйте окончания ссылок на React на `production.min.js`:

```js
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

Если же вы не настроили минификацию для ваших скриптов, то [вот один из вариантов, как это сделать](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Необязательно: Используем React с JSX {#optional-try-react-with-jsx}

В предыдущих примерах мы не выходили за рамки обычных браузерных возможностей. В частности, мы указываем, что React должен выводить на экран, просто вызывая JavaScript-функцию:

```js
const e = React.createElement;

// Отобразить <button> с текстом «Нравится»
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Нравится'
);
```

Однако, React позволяет использовать специальный синтаксис, называющийся [JSX](/docs/introducing-jsx.html):

```js
// Отобразить <button> с текстом «Нравится»
return (
  <button onClick={() => this.setState({ liked: true })}>
    Нравится
  </button>
);
```

Эти два примера делают одно и то же. Несмотря на то, что **JSX является [совершенно необязательным](/docs/react-without-jsx.html)**, многие разработчики считают его удобным для разработки UI -- как с React, так и с другими библиотеками.

Вы можете попробовать JSX в [этом онлайн-конвертере](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.15.7).

### Быстрый старт с JSX {#quickly-try-jsx}

Чтобы быстро попробовать JSX, добавьте такой `<script>`-тег на страницу:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

Теперь синтаксис JSX доступен внутри каждого `<script>`-тега, у которого есть атрибут `type="text/babel"`. Скачайте [пример HTML-кода с JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html), чтобы поэкспериментировать.

Такой подход удобен для обучения или создания быстрых демо, но следует помнить, что работа сайта при этом сильно замедляется. Поэтому для продакшена JSX лучше добавить по-другому. Если вам интересно попробовать, удалите добавленный ранее `<script>`-тег и все атрибуты `type="text/babel"`. Вместо них мы будем пользоваться препроцессором JSX, который автоматически трансформирует весь код внутри `<script>`-тегов.

### Добавляем JSX в проект {#add-jsx-to-a-project}

JSX можно добавить в существующий проект и без разных сложных инструментов вроде бандлера или сервера для разработки. По сути, **добавление JSX напоминает добавление препроцессора CSS**. Необходимо лишь убедиться, что на вашем компьютере установлен [Node.js](https://nodejs.org/).

С помощью терминала перейдите в директорию вашего проекта и запустите следующие команды:

1. **Шаг 1:** Запустите команду `npm init -y` (если появляются ошибки, попробуйте [этот способ](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **Шаг 2:** Запустите команду `npm install babel-cli@6 babel-preset-react-app@3`

>Совет
>
>**Мы используем npm только для установки препроцессора JSX.** React и код приложения всё ещё остаются в `<script>`-тегах.

Поздравляем! Вы только что добавили в ваш проект **поддержку JSX, готовую к продакшену**.


### Запускаем препроцессор JSX {#run-jsx-preprocessor}

Создайте директорию с названием `src` и наберите в терминале следующую команду:

```console
npx babel --watch src --out-dir . --presets react-app/prod
```

>Примечание
>
>`npx` не является опечаткой. Это [инструмент запуска пакетов, появившийся в npm версии 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>Если у вас появляется сообщение об ошибке, похожее на «You have mistakenly installed the `babel` package», то это означает, что вам нужно пройти [предыдущий шаг](#add-jsx-to-a-project), а затем повторить запуск команды.

Дожидаться завершения работы команды не нужно -- она работает в режиме наблюдения за изменениями в JSX-коде.

Попробуйте создать файл с названием `src/like_button.js` и вставить в него **[этот стартовый JSX-код](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**. Препроцессор автоматически трансформирует новый код в чистый JavaScript, пригодный для выполнения в браузере, и сохранит его в новый файл `like_button.js`. При редактировании JSX-кода в существующих файлах трансформация также происходит автоматически.

Кроме препроцессинга JSX, вы в качестве бонуса получаете синтаксические новинки JavaScript, такие как классы, без головной боли с их браузерной поддержкой. Всё это доступно благодаря использованию инструмента под названием Babel, информацию о котором вы можете узнать из [его документации](https://babeljs.io/docs/en/babel-cli/).

Если вы неплохо разбираетесь в инструментах сборки и хотите создавать приложения на React с их помощью, обратитесь к [следующему разделу](/docs/create-a-new-react-app.html), где описаны некоторые из наиболее популярных способов. Если нет -- не беспокойтесь, уже знакомые нам script-теги ничуть не хуже!
