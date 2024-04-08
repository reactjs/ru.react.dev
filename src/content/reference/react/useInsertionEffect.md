---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` предназначен для авторов библиотек CSS-in-JS. Если вы не работаете над библиотекой CSS-in-JS и вам не нужно место для внедреня стилей, вам вероятно понадобится [`useEffect`](/reference/react/useEffect) или [`useLayoutEffect`](/reference/react/useLayoutEffect).

</Pitfall>

<Intro>

`useInsertionEffect` это версия [`useEffect`](/reference/react/useEffect) которая срабатывает перед любыми изменениями DOM.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Вызовите `useInsertionEffect` чтобы вставить стили перед любыми мутациями DOM:

```js
import { useInsertionEffect } from 'react';

// Внутри вашей бибилиотеки CSS-in-JS
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... вставьте свои теги <style> сюда ...
  });
  return rule;
}
```

[Больше примеров ниже.](#usage)

#### Параметры {/*parameters*/}

* `setup`: Функция с логикой вашего эффекта. Ваша setup функция, опционально, может возвращать функцию *очистки*. Перед тем, как ваш компонент добавится в DOM, реакт запустит вашу setup фнукцию. После каждого повторного рендеринга с измененными зависимостями, реакт запустит функцию очистки (если вы ее предоставили) со старыми заничениями, а затем запустит вашу setup функцию с новыми значениями. Перед тем как ваш компонент удалится из DOM, реакт запустит функцию очистки.
 
* `dependencies`: Список всех реактивных значений, на которые ссылается код функции `setup`. К реактивным значениям относятся реквизиты, состояние, а также все переменные и функции, объявленные непосредственно в теле компонента. Если ваш линтер [настроен для использования с React](/learn/editor-setup#linting), он проверит, что каждое реактивное значение правильно указано как зависимость. Список зависимостей должен иметь постоянное количество элементов и быть написан inline по типу `[dep1, dep2, dep3]`. React будет сравнивать каждую зависимость с предыдущим значением, используя алгоритм сравнения [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Если не указать зависимости вообще, то эффект запустится заново после каждого повторного рендеринга компонента.

#### Возвращаемое значение {/*returns*/}

`useInsertionEffect` возвращает `undefined`.

#### Предостережения {/*caveats*/}

* Эффекты выполняются только на клиенте. Они не выполняются во время серверного рендеринга.
* Вы не можете обновить состояние изнутри `useInsertionEffect`.
* К моменту выполнения `useInsertionEffect` ссылки еще не прикреплены, а DOM еще не обновлен.

---

## Использование {/*usage*/}

### Внедрение динамических стилей из библиотек CSS-in-JS {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Традиционно для стилизации компонентов React используется обычный CSS.

```js
// В вашем JS файле:
<button className="success" />

// В вашем CSS файле:
.success { color: green; }
```
Некоторые команды предпочитают создавать стили непосредственно в коде JavaScript, вместо того чтобы писать файлы CSS. Обычно это требует использования библиотеки или инструмента CSS-in-JS. Существует три распространённых подхода к CSS-in-JS:

1. Статическая экстракция в файлы CSS с помощью компилятора
2. Инлайн стили, например, `<div style={{ opacity: 1 }}>`
3. Внедрение тегов `<style>` во время выполнения.

Если вы используете CSS-in-JS, мы рекомендуем комбинацию первых двух подходов (файлы CSS для статических стилей, инлайн стили для динамических стилей). Мы не рекомендуем внедрение тегов `<style>` во время выполнения по двум причинам:

1. Внедрение во время выполнения заставляет браузер пересчитывать стили гораздо чаще.
2. Внедрение может быть очень медленным, если это происходит в неподходящее время жизненного цикла React.

Первая проблема неразрешима, но `useInsertionEffect` помогает решить вторую проблему.

Вызовите `useInsertionEffect`, чтобы вставить стили до любых мутаций DOM:

```js {4-11}
// Внутри вашей CSS-in-JS библиотеки
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // Как было объяснено ранее, мы не рекомендуем внедрение тегов <style> во время выполнения.
    // Но если вам нужно это сделать, то важно использовать для этого useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

Схожим образом `useEffect`, `useInsertionEffect` не запускается на сервере. Если вам нужно собрать информацию о том, какие CSS правила были использованы на сервере, вы можете сделать это во время рендеринга:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Читайте больше о том, как обновить библиотеки CSS-in-JS с внедрением во время выполнения до использования useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### Чем это лучше, чем внедрение стилей во время рендеринга или использование useLayoutEffect? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

Если вы вставляете стили во время рендеринга, и React обрабатывает [неблокирующее обновление,](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) браузер будет пересчитывать стили на каждом кадре во время рендеринга дерева компонентов, что может быть **чрезвычайно медленным.**

`useInsertionEffect` лучше, чем вставка стилей во время [`useLayoutEffect`](/reference/react/useLayoutEffect) или [`useEffect`](/reference/react/useEffect) потому что это гарантирует, что к тому времени, как другие эффекты запускаются в ваших компонентах, теги `<style>` уже будут вставлены. В противном случае расчеты компоновки в обычных эффектах будут неверными из-за устаревших стилей.

</DeepDive>
