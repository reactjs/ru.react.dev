---
title: Добавление React в существующий проект
---
<Intro>

Если вы хотите добавить интерактивность в существующий проект, вам не нужно переписывать его на React. Добавьте React в свой текущий стек и отображайте интерактивные React-компоненты где угодно.

</Intro>

<Note>

**Для локальной разработки вам необходимо установить [Node.js](https://nodejs.org/en/).** Хотя вы можете [попробовать React](/learn/installation#try-react) онлайн или с простой HTML-страницей, на практике большинство инструментов для разработки на JavaScript, которые вы захотите использовать, требуют Node.js.

</Note>

## Использование React для целого подмаршрута существующего веб-сайта {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Предположим, у вас есть существующее веб-приложение по адресу `example.com`, созданное с использованием другой серверной технологии (например, Rails), и вы хотите полностью реализовать все маршруты, начинающиеся с `example.com/some-app/`, с помощью React.

Вот как мы рекомендуем это настроить:

1. **Создайте React-часть вашего приложения**, используя один из [фреймворков на базе React](/learn/start-a-new-react-project).
2. **Укажите `/some-app` в качестве *базового пути*** в конфигурации вашего фреймворка (вот как: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Настройте ваш сервер или прокси-сервер** так, чтобы все запросы по адресу `/some-app/` обрабатывались вашим React-приложением.

Это гарантирует, что React-часть вашего приложения сможет [воспользоваться лучшими практиками](/learn/start-a-new-react-project#can-i-use-react-without-a-framework), заложенными в этих фреймворках.

Многие фреймворки на базе React являются полнофункциональными и позволяют вашему React-приложению использовать сервер. Однако вы можете использовать тот же подход, даже если вы не можете или не хотите запускать JavaScript на сервере. В этом случае вместо этого предоставьте HTML/CSS/JS экспорт ([вывод `next export`](https://nextjs.org/docs/advanced-features/static-html-export) для Next.js, по умолчанию для Gatsby) по адресу `/some-app/`.

## Использование React для части существующей страницы {/*using-react-for-a-part-of-your-existing-page*/}

Предположим, у вас есть существующая страница, созданная с использованием другой технологии (либо серверной, как Rails, либо клиентской, как Backbone), и вы хотите отображать интерактивные React-компоненты где-то на этой странице. Это распространенный способ интеграции React — на самом деле, именно так выглядело большинство использований React в Meta на протяжении многих лет!

Вы можете сделать это в два шага:

1. **Настройте JavaScript-среду**, которая позволит вам использовать [синтаксис JSX](/learn/writing-markup-with-jsx), разбивать код на модули с помощью синтаксиса [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) и использовать пакеты (например, React) из реестра пакетов [npm](https://www.npmjs.com/).
2. **Отобразите ваши React-компоненты** там, где вы хотите их видеть на странице.

Точный подход зависит от вашей существующей конфигурации страницы, поэтому давайте рассмотрим некоторые детали.

### Шаг 1: Настройка модульной JavaScript-среды {/*step-1-set-up-a-modular-javascript-environment*/}

Модульная JavaScript-среда позволяет писать ваши React-компоненты в отдельных файлах, в отличие от написания всего кода в одном файле. Она также позволяет использовать все замечательные пакеты, опубликованные другими разработчиками в реестре [npm](https://www.npmjs.com/) — включая сам React! То, как вы это сделаете, зависит от вашей существующей конфигурации:

* **Если ваше приложение уже разбито на файлы, использующие `import`**, попробуйте использовать уже имеющуюся настройку. Проверьте, вызывает ли написание `<div />` в вашем JS-коде ошибку синтаксиса. Если это вызывает ошибку синтаксиса, вам может потребоваться [трансформировать ваш JavaScript-код с помощью Babel](https://babeljs.io/setup) и включить [Babel React preset](https://babeljs.io/docs/babel-preset-react) для использования JSX.

* **Если у вашего приложения нет существующей настройки для компиляции JavaScript-модулей**, настройте ее с помощью [Vite](https://vite.dev/). Сообщество Vite поддерживает [множество интеграций с бэкенд-фреймворками](https://github.com/vitejs/awesome-vite#integrations-with-backends), включая Rails, Django и Laravel. Если вашего бэкенд-фреймворка нет в списке, [следуйте этому руководству](https://vite.dev/guide/backend-integration.html), чтобы вручную интегрировать сборки Vite с вашим бэкендом.

Чтобы проверить, работает ли ваша настройка, выполните эту команду в папке вашего проекта:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Затем добавьте эти строки кода в начало вашего основного файла JavaScript (он может называться `index.js` или `main.js`):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Ваш существующий контент страницы (в этом примере он заменяется) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Очистить существующий HTML-контент
document.body.innerHTML = '<div id="app"></div>';

// Отобразить ваш React-компонент вместо этого
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Если весь контент вашей страницы был заменен на "Hello, world!", значит, все сработало! Продолжайте читать.

<Note>

Интеграция модульной JavaScript-среды в существующий проект впервые может показаться сложной, но оно того стоит! Если у вас возникнут трудности, обратитесь к нашим [ресурсам сообщества](/community) или в [чат Vite](https://chat.vite.dev/).

</Note>

### Шаг 2: Отображение React-компонентов в любом месте страницы {/*step-2-render-react-components-anywhere-on-the-page*/}

В предыдущем шаге вы поместили этот код в начало вашего основного файла:

```js
import { createRoot } from 'react-dom/client';

// Очистить существующий HTML-контент
document.body.innerHTML = '<div id="app"></div>';

// Отобразить ваш React-компонент вместо этого
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Конечно, вы не хотите очищать существующий HTML-контент!

Удалите этот код.

Вместо этого вы, вероятно, захотите отображать ваши React-компоненты в определенных местах вашего HTML. Откройте вашу HTML-страницу (или серверные шаблоны, которые ее генерируют) и добавьте уникальный атрибут [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) к любому тегу, например:

```html
<!-- ... где-то в вашем html ... -->
<nav id="navigation"></nav>
<!-- ... еще html ... -->
```

Это позволит вам найти этот HTML-элемент с помощью [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) и передать его в [`createRoot`](/reference/react-dom/client/createRoot), чтобы вы могли отобразить свой собственный React-компонент внутри:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>Этот параграф является частью HTML.</p>
    <nav id="navigation"></nav>
    <p>Этот параграф также является частью HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Реально реализовать панель навигации
  return <h1>Привет из React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Обратите внимание, как исходный HTML-контент из `index.html` сохраняется, но ваш собственный React-компонент `NavigationBar` теперь отображается внутри `<nav id="navigation">` из вашего HTML. Прочтите [документацию по использованию `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react), чтобы узнать больше о рендеринге React-компонентов внутри существующей HTML-страницы.

Когда вы внедряете React в существующий проект, обычно начинают с небольших интерактивных компонентов (например, кнопок), а затем постепенно "движутся вверх", пока в конечном итоге вся ваша страница не будет построена с помощью React. Если вы когда-нибудь достигнете этой точки, мы рекомендуем сразу же перейти на [фреймворк React](/learn/start-a-new-react-project), чтобы получить максимальную отдачу от React.

## Использование React Native в существующем нативном мобильном приложении {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) также можно постепенно интегрировать в существующие нативные приложения. Если у вас есть существующее нативное приложение для Android (Java или Kotlin) или iOS (Objective-C или Swift), [следуйте этому руководству](https://reactnative.dev/docs/integration-with-existing-apps), чтобы добавить в него экран React Native.