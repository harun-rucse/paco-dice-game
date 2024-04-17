function Heading({ children }) {
  return <h4 className="text-sm lg:text-xl font-semibold mb-3">{children}</h4>;
}

function Text({ children }) {
  return <p className="text-sm lg:text-lg leading-7">{children}</p>;
}

function TextBox({ children }) {
  return <div className="pt-4">{children}</div>;
}

TextBox.Heading = Heading;
TextBox.Text = Text;

export default TextBox;
