class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-5,8}
  // Компонент Toolbar должен передать "theme" проп ниже,
  // фактически не исользуя его. Учитывая, что у вас в приложении
  // может быть десятки компонентов, использующих UI-тему,
  // вам придётся передавать "theme" проп через все компоненты.
  // И в какой-то момент это станет настоящей проблемой.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
