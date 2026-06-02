import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { InputFieldOld, type InputFieldPropsOld } from "./inputField";

export function PasswordField(props: InputFieldPropsOld)
{
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <InputFieldOld { ...props } type={ show ? "text" : "password" } className="pl-10" />
      <button
        type="button"
        onClick={ () => setShow(!show) }
        className="absolute left-3 top-8.5 text-gray-500 hover:text-gray-700"
      >
        { show ? <EyeOff size={ 16 } /> : <Eye size={ 16 } /> }
      </button>
    </div>
  );
}
