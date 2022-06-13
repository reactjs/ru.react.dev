# ru.reactjs.org

Этот репозиторий содержит исходный код и содержимое сайта [ru.reactjs.org](https://ru.reactjs.org/).

## Начало

### Предварительные требования

1. Git
<<<<<<< HEAD
1. Node: любая версия 12.x, начиная с 12.0.0 или выше
1. Yarn: Посмотрите [сайт Yarn с инструкциями по установке](https://yarnpkg.com/lang/en/docs/install/)
1. Сделать форк этого репозитория (для предложения изменений)
1. Копия [репозитория ru.reactjs.org](https://github.com/reactjs/ru.reactjs.org) на вашем компьютере
=======
1. Node: any 12.x version starting with v12.0.0 or greater
1. Yarn v1: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/)
1. A fork of the repo (for any contributions)
1. A clone of the [reactjs.org repo](https://github.com/reactjs/reactjs.org) on your local machine
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

### Установка

1. `cd ru.reactjs.org` для перехода в директорию проекта
1. `yarn` для установки npm-зависимостей проекта

### Запуск проекта локально

1. `yarn dev` для старта сервера в режиме разработки с поддержкой перезагрузки на лету (на основе [Gatsby](https://www.gatsbyjs.org))
1. `open http://localhost:8000` откроет сайт в вашем браузере по умолчанию

## Помощь проекту

### Рекомендации

Документация разделена на несколько частей, с разными характером и целями. Если вы планируете написать больше, чем несколько фраз, вам может быть полезно ознакомиться с [рекомендациями для участия](https://github.com/reactjs/ru.reactjs.org/blob/main/CONTRIBUTING.md#guidelines-for-text) и его конкретными разделами.

### Создание ветки

1. `git checkout main` из любой папки в вашей локальной копии репозитория `ru.reactjs.org`
1. `git pull origin main`, чтобы убедиться, что у вас самая последняя версия кода
1. `git checkout -b the-name-of-my-branch` (замените `the-name-of-my-branch` на подходящее имя) для создания ветки

### Внесение изменений

1. Следуйте инструкциям из раздела [«Запуск проекта локально»](#running-locally)
1. Сохраните файлы и проверьте в вашем браузере
  1. Изменения в React-компонентах внутри `src` применяются на лету
  1. Изменения в markdown-файлах внутри `content` применяются на лету
  1. При работе с плагинами может понадобится удаление папки `.cache` и перезапуск сервера

### Проверка изменений

1. По возможности проверьте визуальные изменения во всех последних версиях распространённых браузеров: и настольных, и мобильных.
1. Запустите `yarn check-all` из корня проекта. (Это запустит Prettier, ESLint и Flow.)

### Отправка изменений

1. `git add -A && git commit -m "Сообщение"` (вместо `Сообщение` напишите осмысленное название изменения, например `Исправление логотипа на Android`), чтобы добавить и зафиксировать изменение
1. `git push my-fork-name the-name-of-my-branch`
1. Перейдите на [страницу репозитория ru.reactjs.org](https://github.com/reactjs/ru.reactjs.org) и вы увидите уведомление с вашей веткой.
1. Следуйте инструкциям на GitHub.
1. По возможности добавьте скриншот с сделанными изменениями. Как только вы сделаете PR, автоматически будет создана версия сайта с вашими изменениями на [Netlify](https://www.netlify.com/).

## Перевод

Если вы заинтересованы в переводе `reactjs.org`, ознакомьтесь с текущим прогрессом перевода на [translations.reactjs.org](https://translations.reactjs.org/).

## Решение проблем

- `yarn reset` для очистки локального кеша

## Лицензия

Контент на [ru.reactjs.org](https://ru.reactjs.org/) распространяется по лицензии CC-BY-4.0, как указано в файле [LICENSE-DOCS.md](https://github.com/open-source-explorer/reactjs.org/blob/master/LICENSE-DOCS.md).
