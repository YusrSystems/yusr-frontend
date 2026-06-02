import { InputFieldOld, type InputFieldPropsOld } from "./inputField";

export function PhoneField(props: InputFieldPropsOld)
{
  return <InputFieldOld { ...props } type="tel" dir="ltr" placeholder="05xxxxxxxx" className="text-right font-mono" />;
}
