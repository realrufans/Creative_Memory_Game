export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-16 sm:h-20 w-1/5 rounded-md m-1 p-2 bg-indigo-300 text-center"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block text-white h-16 sm:h-20 w-1/5 rounded-md m-1 p-2 bg-indigo-500">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block h-16 sm:h-20 w-1/5 rounded-md m-1 p-2  text-indigo-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return <div onClick={flip} className={className}></div>;
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
