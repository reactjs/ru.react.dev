---
title: Установка
---

<Intro>

React был спроектирован с самого начала с учётом постепенного внедрения. Вы можете начать с малого и использовать только ту функциональность React, которая необходима вам в данный момент. Информация в этом разделе будет полезна как при первом знакомстве с React, так и при создании простой динамической HTML-страницы или проектировании сложного React-приложения.

</Intro>

<<<<<<< HEAD
<YouWillLearn isChapter={true}>

* [Как создать новый React-проект](/learn/start-a-new-react-project)
* [Как добавить React в существующий проект](/learn/add-react-to-an-existing-project)
* [Как настроить редактор кода](/learn/editor-setup)
* [Как установить React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>

## Попробовать React {/*try-react*/}
=======
## Try React {/*try-react*/}
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

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

<<<<<<< HEAD
### Попробовать React локально {/*try-react-locally*/}

Чтобы попробовать React локально на вашем компьютере, [скачайте эту HTML страницу.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Откройте её в своем текстовом редакторе и браузере!

## Начать новый React-проект {/*start-a-new-react-project*/}

Если вы хотите создать приложение или сайт полностью на React — [создайте новый React-проект.](/learn/start-a-new-react-project)
=======
To try React locally on your computer, [download this HTML page.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Open it in your editor and in your browser!

## Creating a React App {/*creating-a-react-app*/}

If you want to start a new React app, you can [create a React app](/learn/creating-a-react-app) using a recommended framework.

## Build a React App from Scratch {/*build-a-react-app-from-scratch*/}

If a framework is not a good fit for your project, you prefer to build your own framework, or you just want to learn the basics of a React app you can [build a React app from scratch](/learn/build-a-react-app-from-scratch).
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

## Добавить React в существующий проект {/*add-react-to-an-existing-project*/}

<<<<<<< HEAD
Если вы хотите попробовать React в существующем приложении или сайте — [добавьте React в существующий проект.](/learn/add-react-to-an-existing-project)
=======
If want to try using React in your existing app or a website, you can [add React to an existing project.](/learn/add-react-to-an-existing-project)


<Note>

#### Should I use Create React App? {/*should-i-use-create-react-app*/}

No. Create React App has been deprecated. For more information, see [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

## Дальнейшие шаги {/*next-steps*/}

Перейдите к [Введению в React](/learn) для ознакомления с самыми важными концепциями, которые вы будете встречать каждый день.

