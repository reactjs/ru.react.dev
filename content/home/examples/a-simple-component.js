class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Привет, {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Иван" />,
  document.getElementById('hello-example')
);