import ReactSelect from "react-select";

export default function Select(props: any) {
  return (
    <ReactSelect
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "indigo",
        },
      })}
      styles={{
        control: (styles) => ({
          ...styles,
          boxShadow: "none !important",
          "*": {
            boxShadow: "none !important",
          },
        }),
      }}
      {...props}
    />
  );
}
