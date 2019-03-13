class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-5,8}
  // Компонент Toolbar должен передать проп "theme" ниже,
  // фактически не используя его. Учитывая, что у вас в приложении
  // могут быть десятки компонентов, использующих UI-тему,
  // вам придётся передавать проп "theme" через все компоненты.
  // И в какой-то момент это станет большой проблемой.
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
