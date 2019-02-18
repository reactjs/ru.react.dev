class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Вместо экспорта FancyButton, мы экспортируем LogProps.
// Рендериться при этом будет FancyButton.
// highlight-next-line
export default logProps(FancyButton);
