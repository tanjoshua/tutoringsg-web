import Creatable from "react-select/creatable";

export default function CustomCreatable(props: any) {
  return (
    <Creatable
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
