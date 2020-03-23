// highlight-range{1-5}
// Контекст позволяет передавать значение глубоко
// в дерево компонентов без явной передачи пропсов
// на каждом уровне. Создадим контекст для текущей
// UI-темы (со значением "light" по умолчанию).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-4,6}
    // Компонент Provider используется для передачи текущей
    // UI-темы вниз по дереву. Любой компонент может использовать
    // этот контекст и не важно, как глубоко он находится.
    // В этом примере мы передаём "dark" в качестве значения контекста.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
<<<<<<< HEAD
// Компонент, который находится в середине,
// теперь не должен явно передавать UI-тему вниз.
function Toolbar(props) {
=======
// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar() {
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-4,7}
  // Определяем contextType, чтобы получить значение контекста.
  // React найдёт (выше по дереву) ближайший Provider-компонент,
  // предоставляющий этот контекст, и использует его значение.
  // В этом примере значение UI-темы будет "dark".
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
