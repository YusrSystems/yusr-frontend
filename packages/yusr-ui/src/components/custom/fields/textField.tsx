import { InputField, InputFieldOld, type InputFieldProps, type InputFieldPropsOld } from "./inputField";

export function TextFieldOld(props: InputFieldPropsOld)
{
  return <InputFieldOld { ...props } type="text" />;
}

export function TextField(props: InputFieldProps)
{
  return <InputField { ...props } type="text" />;
}
