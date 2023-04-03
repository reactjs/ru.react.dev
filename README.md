<<<<<<< HEAD
# ru.reactjs.org

Этот репозиторий содержит исходный код и содержимое сайта [ru.reactjs.org](https://ru.reactjs.org/).
=======
# react.dev

This repo contains the source code and documentation powering [react.dev](https://react.dev/).
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638

## Начало

### Предварительные требования

1. Git
<<<<<<< HEAD
1. Node: любая версия 12.x, начиная с 12.0.0 или выше
1. Yarn v1: Посмотрите [сайт Yarn с инструкциями по установке](https://yarnpkg.com/lang/en/docs/install/)
1. Сделать форк этого репозитория (для предложения изменений)
1. Копия [репозитория ru.reactjs.org](https://github.com/reactjs/ru.reactjs.org) на вашем компьютере
=======
1. Node: any 12.x version starting with v12.0.0 or greater
1. Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/)
1. A fork of the repo (for any contributions)
1. A clone of the [react.dev repo](https://github.com/reactjs/react.dev) on your local machine
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638

### Установка

<<<<<<< HEAD
1. `cd ru.reactjs.org` для перехода в директорию проекта
1. `yarn` для установки npm-зависимостей проекта
=======
1. `cd react.dev` to go into the project root
3. `yarn` to install the website's npm dependencies
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638

### Запуск проекта локально

<<<<<<< HEAD
1. `yarn dev` для старта сервера в режиме разработки с поддержкой перезагрузки на лету (на основе [Gatsby](https://www.gatsbyjs.org))
1. `open http://localhost:8000` откроет сайт в вашем браузере по умолчанию
=======
1. `yarn dev` to start the development server (powered by [Next.js](https://nextjs.org/))
1. `open http://localhost:3000` to open the site in your favorite browser
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638

## Помощь проекту

### Рекомендации

<<<<<<< HEAD
Документация разделена на несколько частей, с разными характером и целями. Если вы планируете написать больше, чем несколько фраз, вам может быть полезно ознакомиться с [рекомендациями для участия](https://github.com/reactjs/ru.reactjs.org/blob/main/CONTRIBUTING.md#guidelines-for-text) и его конкретными разделами.
=======
The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/react.dev/blob/main/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638

### Создание ветки

<<<<<<< HEAD
1. `git checkout main` из любой папки в вашей локальной копии репозитория `ru.reactjs.org`
1. `git pull origin main`, чтобы убедиться, что у вас самая последняя версия кода
1. `git checkout -b the-name-of-my-branch` (замените `the-name-of-my-branch` на подходящее имя) для создания ветки
=======
1. `git checkout main` from any folder in your local `react.dev` repository
1. `git pull origin main` to ensure you have the latest main code
1. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638

### Внесение изменений

1. Следуйте инструкциям из раздела [«Запуск проекта локально»](#running-locally)
1. Сохраните файлы и проверьте в вашем браузере
  1. Изменения в React-компонентах внутри `src` применяются на лету
  1. Изменения в markdown-файлах внутри `content` применяются на лету
  1. При работе с плагинами может понадобится удаление папки `.cache` и перезапуск сервера

### Проверка изменений

<<<<<<< HEAD
1. По возможности проверьте визуальные изменения во всех последних версиях распространённых браузеров: и настольных, и мобильных.
1. Запустите `yarn check-all` из корня проекта. (Это запустит Prettier, ESLint и Flow.)
=======
1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
2. Run `yarn check-all`. (This will run Prettier, ESLint and validate types.)
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638

### Отправка изменений

1. `git add -A && git commit -m "Сообщение"` (вместо `Сообщение` напишите осмысленное название изменения, например `Исправление логотипа на Android`), чтобы добавить и зафиксировать изменение
1. `git push my-fork-name the-name-of-my-branch`
<<<<<<< HEAD
1. Перейдите на [страницу репозитория ru.reactjs.org](https://github.com/reactjs/ru.reactjs.org) и вы увидите уведомление с вашей веткой.
1. Следуйте инструкциям на GitHub.
1. По возможности добавьте скриншот с сделанными изменениями. Как только вы сделаете PR, автоматически будет создана версия сайта с вашими изменениями на [Netlify](https://www.netlify.com/).
=======
1. Go to the [react.dev repo](https://github.com/reactjs/react.dev) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. If possible, include screenshots of visual changes. A preview build is triggered after your changes are pushed to GitHub.
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638

## Перевод

<<<<<<< HEAD
Если вы заинтересованы в переводе `reactjs.org`, ознакомьтесь с текущим прогрессом перевода на [translations.reactjs.org](https://translations.reactjs.org/).

## Решение проблем

- `yarn reset` для очистки локального кеша

## Лицензия

Контент на [ru.reactjs.org](https://ru.reactjs.org/) распространяется по лицензии CC-BY-4.0, как указано в файле [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md).
=======
If you are interested in translating `react.dev`, please see the current translation efforts [here](https://github.com/reactjs/react.dev/issues/4135).

## License
Content submitted to [react.dev](https://react.dev/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md) file.
>>>>>>> f37ef36b070730ce8abd68860388179ed4284638
