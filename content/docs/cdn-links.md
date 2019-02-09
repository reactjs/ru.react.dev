---
id: cdn-links
title: Ссылки на CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: hello-world.html
---

Как React, так и ReactDOM доступны через CDN.

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

Указанные выше версии предназначены только при разработке приложения и не подходят для использования в продакшен-окружении. Минифицированные и оптимизированные для продакшена версии React перечислены ниже:

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Для загрузки конкретной версии `react` и `react-dom`, замените `16` на номер нужной версии.

### Зачем нужен атрибут `crossorigin`? {#why-the-crossorigin-attribute}

Если вы загружаете React из CDN, мы рекомендуем использовать атрибут [`crossorigin`](https://developer.mozilla.org/ru/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Желательно также проверить, что используемый сервис CDN устанавливает HTTP-заголовок `Access-Control-Allow-Origin: *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Такая практика позволит улучшить [обработку ошибок](/blog/2017/07/26/error-handling-in-react-16.html) в React 16 и более новых версиях.
