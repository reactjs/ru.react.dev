// Убедитесь, что форма значения по умолчанию,
// передаваемого в createContext, совпадает с формой объекта,
// которую ожидают потребители контекста.
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
