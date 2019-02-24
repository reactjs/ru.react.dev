// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Теперь реф будет указывать непосредственно на DOM-узел button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
