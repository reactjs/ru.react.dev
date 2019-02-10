// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Теперь вы можете получить ссылку на элемент DOM:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
