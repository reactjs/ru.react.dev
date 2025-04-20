---
title: Установка
---

<Intro>

React был спроектирован с самого начала с учётом постепенного внедрения. Вы можете начать с малого и использовать только ту функциональность React, которая необходима вам в данный момент. Информация в этом разделе будет полезна как при первом знакомстве с React, так и при создании простой динамической HTML-страницы или проектировании сложного React-приложения.

</Intro>

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

Чтобы попробовать React локально на вашем компьютере, [скачайте эту HTML страницу.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Откройте её в своем текстовом редакторе и браузере!

## Начать новый React-проект {/*creating-a-react-app*/}

Если вы хотите создать приложение или сайт полностью на React — [создайте новый React-проект,](/learn/creating-a-react-app) используя рекомендуемые фреймворки.

## Создать React-приложение с нуля {/*build-a-react-app-from-scratch*/}

Если существующие фреймворки не подходят вашему проекту, вы предпочитаете написать свой собственный или изучить внутренности React-приложения, вы можете создать [React-приложение с нуля](/learn/build-a-react-app-from-scratch).

## Добавить React в существующий проект {/*add-react-to-an-existing-project*/}

Если вы хотите попробовать React в существующем приложении или сайте — [добавьте React в существующий проект.](/learn/add-react-to-an-existing-project)

<Note>

#### Должен ли я использовать Create React App? {/*should-i-use-create-react-app*/}

Нет. Create React App был признан устаревшим. Больше информации в статье об [остановке поддержки Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>

## Дальнейшие шаги {/*next-steps*/}

Перейдите к [Введению в React](/learn) для ознакомления с самыми важными концепциями, которые вы будете встречать каждый день.

