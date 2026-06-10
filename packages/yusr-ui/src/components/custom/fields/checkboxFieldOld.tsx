import { Checkbox } from "../../pure";
import { FormFieldOld } from "./formField";
import { type InputFieldPropsOld } from "./inputField";

interface CheckboxFieldPropsOld extends Omit<InputFieldPropsOld, "value">
{
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function CheckboxFieldOld({ id, checked, onCheckedChange, ...formFieldProps }: CheckboxFieldPropsOld)
{
  return (
    <FormFieldOld { ...formFieldProps }>
      <div
        className="flex items-center gap-3 rounded-lg border p-1.75 cursor-pointer border-border"
        onClick={ () => onCheckedChange(!checked) }
      >
        <Checkbox
          id={ id }
          checked={ checked }
        />
      </div>
    </FormFieldOld>
  );
}
