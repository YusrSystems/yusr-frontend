import { cn } from "../../../utils/cn";
import { Textarea } from "../../pure/textarea";

export interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>
{
  isInvalid?: boolean;
}

export function TextAreaInput({ isInvalid, className, ...props }: TextAreaInputProps)
{
  return <Textarea
    { ...props }
    className={ cn(className, isInvalid && "border-red-600 focus-visible:ring-red-600") }
  />;
}
