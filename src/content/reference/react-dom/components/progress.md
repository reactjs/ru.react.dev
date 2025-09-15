---
title: "<progress>"
---

<Intro>

[Встроенный в браузер компонент `<progress>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/progress) отвечает за рендер индикатора прогресса.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Справочник {/*reference*/}

### `<progress>` {/*progress*/}

Для отображения индикатора прогресса отрендерите [встроенный в браузер компонент `<progress>`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[См. больше примеров ниже.](#usage)

#### Пропсы {/*props*/}

<<<<<<< HEAD
`<progress>` поддерживает все [пропсы общих HTML-элементов.](/reference/react-dom/components/common#props)
=======
`<progress>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> a5181c291f01896735b65772f156cfde34df20ee

Кроме того, `<progress>` поддерживает следующие пропсы:

* [`max`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/progress#max): число. Указывает максимальное `value`. По умолчанию `1`.
* [`value`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/progress#value): число между `0` и `max`, или `null` для неопределённого прогресса. Указывает сколько было сделано.

---

## Применение {/*usage*/}

### Управление индикатором прогресса {/*controlling-a-progress-indicator*/}

Для отображения индикатора прогресса отрендерите компонент `<progress>`. Можно передать числовое `value` между `0` и указанным значением `max`. Если не указать `max`, то по умолчанию его значение будет равно `1`.

Если никакая операция не выполняется, передайте `value={null}`, чтобы индикатор прогресса перешёл в неопределённое состояние.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
