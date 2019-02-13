function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      // highlight-next-line
      const {forwardedRef, ...rest} = this.props;

      // Передаём в качестве рефа проп "forwardedRef"
      // highlight-next-line
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Обратите внимание, что React.forwardRef передает "ref" вторым аргументом.
  // Мы можем передать его дальше как проп, например, "forwardedRef",
  // а потом привязать его к компоненту.
  // highlight-range{1-3}
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
