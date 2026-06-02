import { useTranslation } from "react-i18next";
import { PasswordFieldOld, TextFieldOld } from "yusr-ui";
import type Registration from "../../../../core/data/registration";
import { useAppDispatch, useAppSelector } from "../../../../core/state/store";
import { acceptPoliciesToggle, updateField } from "../../logic/registerSlice";

export default function AccountInfo()
{
  const { t } = useTranslation("loginRegister");
  const { formData, errors, acceptPolicies } = useAppSelector((state) => state.register);
  const dispatch = useAppDispatch();

  function onFieldChange(field: Partial<Registration>)
  {
    dispatch(updateField(field));
  }

  return (
    <>
      <TextFieldOld
        label={ t("register.accountInfo.username.label") }
        id="username"
        type="text"
        placeholder={ t("register.accountInfo.username.placeholder") }
        value={ formData.username || "" }
        isInvalid={ !!errors.username }
        error={ errors.username }
        onChange={ (e) => onFieldChange({ username: e.target.value }) }
        required
      />

      <PasswordFieldOld
        label={ t("register.accountInfo.password.label") }
        id="userPassword"
        placeholder={ t("register.accountInfo.password.placeholder") }
        value={ formData.userPassword || "" }
        isInvalid={ !!errors.userPassword }
        error={ errors.userPassword }
        onChange={ (e) => onFieldChange({ userPassword: e.target.value }) }
        required
      />

      <div className="flex items-start space-x-2 rtl:space-x-reverse">
        <input
          type="checkbox"
          id="acceptPolicies"
          checked={ acceptPolicies || false }
          onChange={ () => dispatch(acceptPoliciesToggle()) }
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="acceptPolicies" className="text-sm text-muted-foreground">
          { t("register.accountInfo.acceptPolicies") }{" "}
          <a
            rel="noopener noreferrer"
            href="https://github.com/YusrSystems/Legal-Documents"
            target="_blank"
            className="text-primary hover:underline"
          >
            { t("register.accountInfo.termsAndPrivacy") }
          </a>
        </label>
      </div>
    </>
  );
}
