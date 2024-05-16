import React from "react";
import { useField } from "formik";
import { Input, Text } from "../theme/theme";

const CustomInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <Input
        id="label"
        {...field}
        {...props}
        border={meta.error && "2px solid #fc8181"}
      />
      {meta.touched && meta.error && <Text color="darkred">{meta.error}</Text>}
    </>
  );
};

export default CustomInput;