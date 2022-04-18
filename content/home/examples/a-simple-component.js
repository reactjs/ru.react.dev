class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
    return (
      <div>
        Привет, {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Саша" />,
  document.getElementById('hello-example')
);
=======
    return <div>Hello {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450
