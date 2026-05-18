---
title: Server Components
---

<RSC>

Server Components используются в [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</RSC>

<Intro>

Server Components — это новый тип компонентов, которые рендерятся заранее, до бандлинга, в среде, отдельной от вашего клиентского приложения или SSR-сервера.

</Intro>

Эта отдельная среда — «сервер» в React Server Components. Server Components могут запускаться один раз во время сборки на вашем CI-сервере или для каждого запроса с использованием веб-сервера.

<InlineToc />

<Note>

#### Как реализовать поддержку Server Components? {/*how-do-i-build-support-for-server-components*/}

Хотя React Server Components в React 19 стабильны и не будут ломаться между минорными версиями, базовые API, используемые для реализации бандлера или фреймворка React Server Components, не следуют semver и могут ломаться между минорными версиями в React 19.x.

Для поддержки React Server Components в качестве бандлера или фреймворка мы рекомендуем закрепиться на конкретной версии React или использовать Canary release. Мы продолжим работать с бандлерами и фреймворками над стабилизацией API, используемых для реализации React Server Components, в будущем.

</Note>

### Server Components без сервера {/*server-components-without-a-server*/}
Server Components могут запускаться во время сборки для чтения из файловой системы или получения статического контента, поэтому веб-сервер не требуется. Например, вы можете захотеть прочитать статические данные из системы управления контентом.

Без Server Components часто приходится получать статические данные на клиенте с помощью Effect:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // ПРИМЕЧАНИЕ: загружается *после* первого рендера страницы.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Этот шаблон означает, что пользователям необходимо загрузить и разобрать дополнительные 75K (gzipped) библиотек и дождаться второго запроса для получения данных после загрузки страницы, только чтобы отрисовать статический контент, который не изменится в течение всего времени жизни страницы.

С помощью Server Components вы можете отрисовать эти компоненты один раз во время сборки:

```js
import marked from 'marked'; // Не включено в бандл
import sanitizeHtml from 'sanitize-html'; // Не включено в бандл

async function Page({page}) {
  // ПРИМЕЧАНИЕ: загружается *во время* рендера, когда приложение собирается.
  const content = await file.readFile(`${page}.md`);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Полученный результат затем может быть отрендерен на стороне сервера (SSR) в HTML и загружен на CDN. Когда приложение загружается, клиент не увидит исходный компонент `Page` или ресурсоёмкие библиотеки для рендеринга markdown. Клиент увидит только отрисованный результат:

```js
<div><!-- html для markdown --></div>
```

Это означает, что контент виден во время первой загрузки страницы, а бандл не включает ресурсоёмкие библиотеки, необходимые для рендеринга статического контента.

<Note>

Вы можете заметить, что приведенный выше Server Component является асинхронной функцией:

```js
async function Page({page}) {
  //...
}
```

Async Components — это новая функция Server Components, которая позволяет использовать `await` при рендеринге.

См. [Async components with Server Components](#async-components-with-server-components) ниже.

</Note>

### Server Components с сервером {/*server-components-with-a-server*/}
Server Components также могут запускаться на веб-сервере во время запроса страницы, позволяя вам получить доступ к вашему слою данных без необходимости создавать API. Они рендерятся до того, как ваше приложение будет сбандлено, и могут передавать данные и JSX в качестве пропсов Client Components.

Без Server Components часто приходится получать динамические данные на клиенте в Effect:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // ПРИМЕЧАНИЕ: загружается *после* первого рендера.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);
  
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // ПРИМЕЧАНИЕ: загружается *после* рендера Note.
  // Вызывает дорогостоящий водопад клиент-сервер.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

С помощью Server Components вы можете читать данные и рендерить их в компоненте:

```js
import db from './database';

async function Note({id}) {
  // ПРИМЕЧАНИЕ: загружается *во время* рендера.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // ПРИМЕЧАНИЕ: загружается *после* Note,
  // но быстро, если данные находятся рядом.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

Затем бандлер объединяет данные, отрисованные Server Components и динамические Client Components в бандл. При желании этот бандл может быть отрендерен на стороне сервера (SSR) для создания начального HTML-кода страницы. Когда страница загружается, браузер не видит исходные компоненты `Note` и `Author`; клиенту отправляется только отрисованный результат:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

Server Components могут быть сделаны динамическими путем повторного получения их с сервера, где они могут получить доступ к данным и снова отрисоваться. Эта новая архитектура приложения сочетает простую модель «запрос/ответ» серверно-ориентированных многостраничных приложений с бесшовной интерактивностью клиентско-ориентированных одностраничных приложений, предоставляя вам лучшее из обоих миров.

### Добавление интерактивности в Server Components {/*adding-interactivity-to-server-components*/}

Server Components не отправляются в браузер, поэтому они не могут использовать интерактивные API, такие как `useState`. Чтобы добавить интерактивность в Server Components, вы можете комбинировать их с Client Components, используя директиву `"use client"`.

<Note>

#### Директивы для Server Components не существует. {/*there-is-no-directive-for-server-components*/}

Распространенное заблуждение заключается в том, что Server Components обозначаются как `"use server"`, но директивы для Server Components не существует. Директива `"use server"` используется для Server Functions.

Для получения дополнительной информации см. документацию по [Directives](/reference/rsc/directives).

</Note>


В следующем примере `Notes` Server Component импортирует `Expandable` Client Component, который использует состояние для переключения своего состояния `expanded`:
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

Это работает следующим образом: сначала `Notes` рендерится как Server Component, а затем бандлеру дается указание создать бандл для Client Component `Expandable`. В браузере Client Components увидят результат Server Components, переданный в качестве пропсов:

```js
<head>
  <!-- бандл для Client Components -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div> 
</body>
```

### Async components с Server Components {/*async-components-with-server-components*/}

Server Components представляют новый способ написания компонентов с использованием async/await. Когда вы используете `await` в асинхронном компоненте, React приостанавливает выполнение и ждет разрешения промиса перед возобновлением рендеринга. Это работает на границах сервера/клиента с поддержкой потоковой передачи для Suspense.

Вы можете даже создать промис на сервере и ожидать его на клиенте:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Приостановит выполнение Server Component.
  const note = await db.notes.get(id);
  
  // ПРИМЕЧАНИЕ: не ожидается, начнется здесь и будет ожидаться на клиенте. 
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // ПРИМЕЧАНИЕ: это возобновит промис с сервера.
  // Он будет приостановлен до тех пор, пока данные не станут доступны.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

Контент `note` является важными данными для рендеринга страницы, поэтому мы ожидаем его на сервере. Комментарии находятся ниже основного контента и имеют более низкий приоритет, поэтому мы запускаем промис на сервере и ожидаем его на клиенте с помощью API `use`. Это приведет к приостановке выполнения на клиенте, не блокируя рендеринг контента `note`.

Поскольку асинхронные компоненты не поддерживаются на клиенте, мы ожидаем промис с помощью `use`.
