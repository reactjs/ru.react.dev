import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// Компонент FancyButton, который мы импортировали — это HOC LogProps.
// Несмотря на то, что рендерят они одно и то же,
// реф в данном случае будет указывать на LogProps, а не на сам FancyButton!
// Это значит, что мы не сможем, например, вызвать ref.current.focus()
// highlight-range{4}
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
