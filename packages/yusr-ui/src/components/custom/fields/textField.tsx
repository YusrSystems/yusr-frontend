import { InputField, type InputFieldProps } from "./inputField";

export function TextField(props: InputFieldProps)
{
  return <InputField { ...props } type="text" />;
}
