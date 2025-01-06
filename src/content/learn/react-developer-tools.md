---
title: React Developer Tools
---

<Intro>

Используйте React Developer Tools для инспекции [компонентов](/learn/your-first-component) React, редактирования [пропсов](/learn/passing-props-to-a-component) и [состояния](/learn/state-a-components-memory), а также для выявления проблем с производительностью.

</Intro>

<YouWillLearn>

* Как установить React Developer Tools

</YouWillLearn>

## Расширение для браузера {/*browser-extension*/}

Самым простым способом отладки сайтов, созданных с использованием React, является установка браузерного расширения React Developer Tools. Оно доступно для нескольких популярных браузеров.

* [Установить для **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ru)
* [Установить для **Firefox**](https://addons.mozilla.org/ru/firefox/addon/react-devtools/)
* [Установить для **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Если вы откроете сайт, созданный с использованием React, вы увидите панели _Components_ и _Profiler_.

![Расширение React Developer Tools](/images/docs/react-devtools-extension.png)

### Safari и другие браузеры {/*safari-and-other-browsers*/}
Для других браузеров, таких как Safari, необходимо установить npm пакет [`react-devtools`](https://www.npmjs.com/package/react-devtools):

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Затем откройте инструменты разработчика из терминала:
```bash
react-devtools
```

И подключите свой сайт, добавив следующий тег `<script>` в начало секции `<head>` вашего сайта:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Перезагрузите ваш сайт, чтобы просмотреть его в инструментах разработчика.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

<<<<<<< HEAD
## Мобильные устройства (React Native) {/*mobile-react-native*/}
React Developer Tools также можно использовать для отладки приложений, созданных с помощью [React Native](https://reactnative.dev/).
Самый простой способ использования React Developer Tools - установить их глобально:

```bash
# Yarn
yarn global add react-devtools
=======
## Mobile (React Native) {/*mobile-react-native*/}

To inspect apps built with [React Native](https://reactnative.dev/), you can use [React Native DevTools](https://reactnative.dev/docs/react-native-devtools), the built-in debugger that deeply integrates React Developer Tools. All features work identically to the browser extension, including native element highlighting and selection.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc

[Learn more about debugging in React Native.](https://reactnative.dev/docs/debugging)

<<<<<<< HEAD
Откройте инструменты разработчика в терминале.
```bash
react-devtools
```

Он подключится к любому локальному приложению React Native, которое запущено.

> Попробуйте перезагрузить приложение, если инструменты разработчика не подключатся через несколько секунд.

[Узнайте больше о отладке React Native.](https://reactnative.dev/docs/debugging)
=======
> For versions of React Native earlier than 0.76, please use the standalone build of React DevTools by following the [Safari and other browsers](#safari-and-other-browsers) guide above.
>>>>>>> b1a249d597016c6584e4c186daa28b180cc9aafc
