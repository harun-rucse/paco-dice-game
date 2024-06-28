import { cn } from "../../../../utils";

function Heading({ children }) {
  return (
    <h4 className="text-sm desktop:text-xl font-semibold mb-3">{children}</h4>
  );
}

function Text({ children, className }) {
  return (
    <p
      className={cn(
        "text-sm desktop:text-xl leading-7 text-left font-semibold",
        className
      )}
    >
      {children}
    </p>
  );
}

function TextBox({ children, className }) {
  return <div className={cn("pt-4 space-y-2", className)}>{children}</div>;
}

TextBox.Heading = Heading;
TextBox.Text = Text;

export default TextBox;
