import { PasswordField, TextField } from "yusr-ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { acceptPoliciesToggle, updateField } from "../../logic/registerSlice";

export default function AccountInfo()
{
  const { formData, errors, acceptPolicies } = useAppSelector((state) => state.register);
  const dispatch = useAppDispatch();
  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }
  return (
    <>
      <TextField
        label="اسم المستخدم"
        id="username"
        type="text"
        placeholder="أدخل اسم المستخدم"
        value={ formData.username || "" }
        isInvalid={ !!errors.username }
        error={ errors.username }
        onChange={ (e) => onFieldChange({ username: e.target.value }) }
        required
      />

      <PasswordField
        label="كلمة مرور المستخدم"
        id="userPassword"
        placeholder="••••••••"
        value={ formData.userPassword || "" }
        isInvalid={ !!errors.userPassword }
        error={ errors.userPassword }
        onChange={ (e) => onFieldChange({ userPassword: e.target.value }) }
        required
      />
      { /* accept out policies , policies link: https://github.com/YusrSystems/Legal-Documents */ }

      <div className="flex items-start space-x-2 rtl:space-x-reverse">
        <input
          type="checkbox"
          id="acceptPolicies"
          checked={ acceptPolicies || false }
          onChange={ () => dispatch(acceptPoliciesToggle()) }
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="acceptPolicies" className="text-sm text-muted-foreground">
          أوافق على{" "}
          <a
            href="https://github.com/YusrSystems/Legal-Documents"
            target="_blank"
            className="text-primary hover:underline"
          >
            شروط الخدمة وسياسة الخصوصية
          </a>
        </label>
      </div>

      {
        /*
      <SelectField
        label="مندوب المبيعات (اختياري)"
        value={ formData.salesDelegateId?.toString() || "none" }
        isInvalid={ !!errors.salesDelegateId }
        error={ errors.salesDelegateId }
        onValueChange={ (val) => onFieldChange({ salesDelegateId: val === "none" ? undefined : Number(val) }) }
        options={ [
          { label: "بدون مندوب", value: "none" },
          ...salesDelegates.map((s) => ({ label: s.name, value: s.id.toString() }))
        ] }
      /> */
      }
    </>
  );
}
