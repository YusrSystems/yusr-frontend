import {DateInput, DateInputOld, type DateInputProps, type DateInputPropsOld} from "../inputs/dateInputOld.tsx";
import {FormField, FormFieldOld} from "./formField";
import type {Signal} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";

interface DateFieldPropsOld extends DateInputPropsOld {
    label: string;
    error?: string;
    required?: boolean;
}

export function DateFieldOld({
                                 label,
                                 error,
                                 isInvalid,
                                 required,
                                 ...props
                             }: DateFieldPropsOld) {
    return (
        <FormFieldOld
            label={label}
            error={error}
            isInvalid={isInvalid}
            required={required}
        >
            <DateInputOld {...props} isInvalid={isInvalid}/>
        </FormFieldOld>
    );
}


interface DateFieldProps extends DateInputProps {
    label: string;
    error?: Signal<string | undefined>;
    required?: boolean;
}

export function DateField({
                              label,
                              error,
                              required,
                              ...props
                          }: DateFieldProps) {
    useSignals();
    return (
        <FormField
            label={label}
            error={error}
            required={required}
        >
            <DateInput {...props} />
        </FormField>
    );
}
