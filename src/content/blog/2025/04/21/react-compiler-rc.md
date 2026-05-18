---
title: "React Compiler RC"
author: Lauren Tan and Mofei Zhang
date: 2025/04/21
description: Сегодня мы выпускаем первый Release Candidate (RC) компилятора.
---

21 апреля 2025 г. от [Lauren Tan](https://x.com/potetotes) и [Mofei Zhang](https://x.com/zmofei).

---

<Intro>

Команда React рада поделиться новыми обновлениями:

</Intro>

1. Сегодня мы публикуем React Compiler RC в рамках подготовки к стабильному выпуску компилятора.
2. Мы объединяем `eslint-plugin-react-compiler` в `eslint-plugin-react-hooks`.
3. Мы добавили поддержку swc и работаем с oxc над поддержкой сборки без Babel.

---

[React Compiler](https://react.dev/learn/react-compiler) — это инструмент сборки, который оптимизирует ваше React-приложение с помощью автоматического мемоизирования. В прошлом году мы опубликовали [первую бета-версию](https://react.dev/blog/2024/10/21/react-compiler-beta-release) React Compiler и получили множество отличных отзывов и предложений. Мы воодушевлены успехами тех, кто уже использует компилятор (см. примеры использования от [Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33) и [Wakelet](https://github.com/reactwg/react-compiler/discussions/52)), и работаем над стабильным выпуском.

Сегодня мы выпускаем первый Release Candidate (RC) компилятора. RC — это стабильная и почти финальная версия компилятора, которую безопасно использовать в продакшене.

## Используйте React Compiler RC сегодня {/*use-react-compiler-rc-today*/}
Чтобы установить RC:

npm
<TerminalBlock>
{`npm install --save-dev --save-exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev --save-exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev --exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

В рамках RC мы упростили добавление React Compiler в ваши проекты и оптимизировали генерацию мемоизации компилятором. React Compiler теперь поддерживает optional chains и индексы массивов в качестве зависимостей. Мы исследуем способы вывода дополнительных зависимостей, таких как проверки на равенство и интерполяция строк. Эти улучшения в конечном итоге приводят к меньшему количеству повторных рендеров и более отзывчивым пользовательским интерфейсам.

Мы также услышали от сообщества, что валидация `ref` в рендере иногда дает ложные срабатывания. Поскольку наша общая философия заключается в том, чтобы вы могли полностью доверять сообщениям об ошибках и подсказкам компилятора, мы временно отключили эту проверку по умолчанию. Мы продолжим работать над улучшением этой валидации и повторно включим ее в следующем выпуске.

Более подробную информацию об использовании компилятора вы можете найти в [нашей документации](https://react.dev/learn/react-compiler).

## Обратная связь {/*feedback*/}
В течение периода RC мы призываем всех пользователей React попробовать компилятор и предоставить обратную связь в репозитории React. Пожалуйста, [откройте issue](https://github.com/facebook/react/issues), если вы столкнетесь с какими-либо ошибками или неожиданным поведением. Если у вас есть общий вопрос или предложение, пожалуйста, опубликуйте их в [React Compiler Working Group](https://github.com/reactwg/react-compiler/discussions).

## Обратная совместимость {/*backwards-compatibility*/}
Как было отмечено в анонсе бета-версии, React Compiler совместим с React 17 и выше. Если вы еще не используете React 19, вы можете использовать React Compiler, указав минимальную целевую версию в конфигурации компилятора и добавив `react-compiler-runtime` в качестве зависимости. Документацию по этому вопросу можно найти [здесь](https://react.dev/learn/react-compiler#using-react-compiler-with-react-17-or-18).

## Миграция с eslint-plugin-react-compiler на eslint-plugin-react-hooks {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}
Если вы уже установили `eslint-plugin-react-compiler`, вы можете удалить его и использовать `eslint-plugin-react-hooks@6.0.0-rc.1`. Большое спасибо [@michaelfaith](https://bsky.app/profile/michael.faith) за вклад в это улучшение!

Для установки:

npm
<TerminalBlock>
{`npm install --save-dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

```js
// eslint.config.js
import * as reactHooks from 'eslint-plugin-react-hooks';

export default [
  // Flat Config (eslint 9+)
  reactHooks.configs.recommended,

  // Legacy Config
  reactHooks.configs['recommended-latest']
];
```

Чтобы включить правило React Compiler, добавьте `'react-hooks/react-compiler': 'error'` в вашу конфигурацию ESLint.

Линтер не требует установки компилятора, поэтому нет риска при обновлении `eslint-plugin-react-hooks`. Мы рекомендуем всем обновиться сегодня.

## Поддержка swc (экспериментальная) {/*swc-support-experimental*/}
React Compiler можно установить с помощью [различных инструментов сборки](/learn/react-compiler#installation), таких как Babel, Vite и Rsbuild.

В дополнение к этим инструментам мы сотрудничали с Kang Dongyoon ([@kdy1dev](https://x.com/kdy1dev)) из команды [swc](https://swc.rs/) над добавлением дополнительной поддержки React Compiler в качестве плагина swc. Хотя эта работа еще не завершена, производительность сборки Next.js должна значительно возрасти при [включении React Compiler в вашем приложении Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler).

Мы рекомендуем использовать Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) или выше для достижения наилучшей производительности сборки.

Пользователи Vite могут продолжать использовать [vite-plugin-react](https://github.com/vitejs/vite-plugin-react) для включения компилятора, добавив его как [плагин Babel](https://react.dev/learn/react-compiler#usage-with-vite). Мы также работаем с командой [oxc](https://oxc.rs/) над [добавлением поддержки компилятора](https://github.com/oxc-project/oxc/issues/10048). Как только [rolldown](https://github.com/rolldown/rolldown) будет официально выпущен и добавлена поддержка oxc для React Compiler, мы обновим документацию информацией о том, как выполнить миграцию.

## Обновление React Compiler {/*upgrading-react-compiler*/}
React Compiler лучше всего работает, когда применяемое авто-мемоизирование строго направлено на повышение производительности. Будущие версии компилятора могут изменить способ применения мемоизации, например, она может стать более гранулярной и точной.

Однако, поскольку код продукта иногда может нарушать [правила React](https://react.dev/reference/rules), которые не всегда статически обнаруживаются в JavaScript, изменение мемоизации может иногда приводить к неожиданным результатам. Например, ранее мемоизированное значение может использоваться как зависимость для `useEffect` где-то в дереве компонентов. Изменение способа мемоизации этого значения или его мемоизации вообще может привести к чрезмерному или недостаточному срабатыванию этого `useEffect`. Хотя мы рекомендуем использовать [useEffect только для синхронизации](https://react.dev/learn/synchronizing-with-effects), в вашем коде могут быть `useEffect`, которые охватывают другие варианты использования, такие как эффекты, которые должны срабатывать только при изменении определенных значений.

Другими словами, изменение мемоизации в редких случаях может привести к неожиданному поведению. По этой причине мы рекомендуем следовать Правилам React и использовать непрерывное сквозное тестирование вашего приложения, чтобы вы могли с уверенностью обновлять компилятор и выявлять любые нарушения правил React, которые могут вызвать проблемы.

Если у вас нет хорошего тестового покрытия, мы рекомендуем закрепить версию компилятора на точной версии (например, `19.1.0`), а не на диапазоне SemVer (например, `^19.1.0`). Вы можете сделать это, передав флаги `--save-exact` (npm/pnpm) или `--exact` (yarn) при обновлении компилятора. Затем вы должны обновлять компилятор вручную, уделяя особое внимание проверке того, что ваше приложение по-прежнему работает должным образом.

## Дорожная карта к стабильному выпуску {/*roadmap-to-stable*/}
*Это не окончательная дорожная карта, и она может быть изменена.*

После периода получения окончательной обратной связи от сообщества по RC мы планируем стабильный выпуск компилятора.

* ✅ Экспериментальный: Выпущен на React Conf 2024, в основном для получения обратной связи от разработчиков приложений.
* ✅ Публичная бета-версия: Доступна сегодня для получения обратной связи от авторов библиотек.
* ✅ Release Candidate (RC): React Compiler работает для большинства приложений и библиотек, следующих правилам, без проблем.
* Общая доступность: После периода получения окончательной обратной связи от сообщества.

После стабильного выпуска мы планируем добавить больше оптимизаций и улучшений компилятора. Это включает как постоянные улучшения автоматического мемоизирования, так и совершенно новые оптимизации, с минимальными или нулевыми изменениями в коде продукта. Каждое обновление будет продолжать повышать производительность и улучшать обработку различных шаблонов JavaScript и React.

---

Спасибо [Joe Savona](https://x.com/en_JS), [Jason Bonta](https://x.com/someextent), [Jimmy Lai](https://x.com/feedthejim) и [Kang Dongyoon](https://x.com/kdy1dev) (@kdy1dev) за рецензирование и редактирование этой публикации.
