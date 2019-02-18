import {ThemeContext} from './theme-context';

function ThemeTogglerButton() {
  // highlight-range{1-2,5}
  // ThemeTogglerButton получает из контекста
  // не только значение UI-темы, но и toggleTheme функцию.
  return (
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button
          onClick={toggleTheme}
          style={{backgroundColor: theme.background}}>
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

export default ThemeTogglerButton;
