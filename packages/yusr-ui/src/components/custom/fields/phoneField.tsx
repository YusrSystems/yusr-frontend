import { InputField, type InputFieldProps } from "./inputField";

export function PhoneField(props: InputFieldProps)
{
  return <InputField { ...props } type="tel" dir="ltr" placeholder="05xxxxxxxx" className="text-right font-mono" />;
}
