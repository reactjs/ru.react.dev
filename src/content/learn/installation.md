---
title: Установка
---

<Intro>

React был спроектирован с самого начала с учётом постепенного внедрения. Вы можете начать с малого и использовать только ту функциональность React, которая необходима вам в данный момент. Информация в этом разделе будет полезна как при первом знакомстве с React, так и при создании простой динамической HTML-страницы или проектировании сложного React-приложения.

</Intro>

<YouWillLearn isChapter={true}>

* [Как создать новый React-проект](/learn/start-a-new-react-project)
* [Как добавить React в существующий проект](/learn/add-react-to-an-existing-project)
* [Как настроить редактор кода](/learn/editor-setup)
* [Как установить React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>

## Попробовать React {/*try-react*/}

Вам не нужно ничего устанавливать, чтобы попробовать React. Поредактируйте код в песочнице!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

Вы можете редактировать прямо здесь или же открыть код в новой вкладке, нажав на кнопку "Форкнуть" в правом верхнем углу.

Такие песочницы есть на большинстве страниц React-документации. За пределами React-документации также есть большое количество песочниц, поддерживающих React. Например: [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react) или [CodePen.](https://codepen.io/pen?template=QWYVwWN)

### Попробовать React локально {/*try-react-locally*/}

Чтобы попробовать React локально на вашем компьютере, [скачайте эту HTML страницу.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Откройте её в своем текстовом редакторе и браузере!

## Начать новый React-проект {/*start-a-new-react-project*/}

Если вы хотите создать приложение или сайт полностью на React — [создайте новый React-проект.](/learn/start-a-new-react-project)

## Добавить React в существующий проект {/*add-react-to-an-existing-project*/}

Если вы хотите попробовать React в существующем приложении или сайте — [добавьте React в существующий проект.](/learn/add-react-to-an-existing-project)

## Дальнейшие шаги {/*next-steps*/}

Перейдите к [Введению в React](/learn) для ознакомления с самыми важными концепциями, которые вы будете встречать каждый день.

