// highlight-next-line
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('старые пропсы:', prevProps);
      console.log('новые пропсы:', this.props);
    }

    render() {
      // highlight-next-line
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}
