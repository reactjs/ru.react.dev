---
id: cdn-links
title: Ссылки на CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

Как React, так и ReactDOM доступны через CDN.

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

Указанные выше версии предназначены только для разработки приложения и не подходят для использования в продакшен-окружении. Минифицированные и оптимизированные для продакшена версии React перечислены ниже:

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
Для загрузки конкретной версии `react` и `react-dom`, замените `17` на номер нужной версии.
=======
To load a specific version of `react` and `react-dom`, replace `18` with the version number.
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6

### Зачем нужен атрибут `crossorigin`? {#why-the-crossorigin-attribute}

Если вы загружаете React из CDN, мы рекомендуем использовать атрибут [`crossorigin`](https://developer.mozilla.org/ru/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Желательно также проверить, что используемый сервис CDN устанавливает HTTP-заголовок `Access-Control-Allow-Origin: *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Такая практика позволит улучшить [обработку ошибок](/blog/2017/07/26/error-handling-in-react-16.html) в React 16 и более новых версиях.
