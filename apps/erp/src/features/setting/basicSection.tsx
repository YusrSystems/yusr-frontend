import { useAppDispatch, useAppSelector } from "@/core/state/store";
import { differenceInDays, format } from "date-fns";
import { Camera, Trash2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BranchFilterColumns, BranchSlice, StorageFileStatus } from "yusr-ui";
import { Avatar, AvatarFallback, AvatarImage, Button, FieldGroup, FieldsSection, FormField, Label, SearchableSelect, TextField, useStorageFile } from "yusr-ui";
import type { Setting } from "../../core/data/setting";
import { useSettingContext } from "./settingContext";

export default function BasicSection()
{
  const { t } = useTranslation("erpCommon");
  const {
    formData,
    handleChange,
    isInvalid,
    getError,
    clearError
  } = useSettingContext();

  const { fileInputRef, handleFileChange, handleRemoveFile } = useStorageFile<Partial<Setting>>(handleChange, "logo");
  const branchState = useAppSelector((state) => state.branch);
  const dispatch = useAppDispatch();

  const getDaysLeftText = (daysLeft: number) =>
  {
    if (daysLeft > 0)
    {
      return t("settings.daysLeft", { days: daysLeft });
    }
    return t("settings.expired");
  };

  const getDaysStatusColor = (daysLeft: number) =>
  {
    if (daysLeft > 10) return "text-green-600 dark:text-green-400";
    if (daysLeft > 0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getDaysBgColor = (daysLeft: number) =>
  {
    if (daysLeft > 10) return "bg-green-50 dark:bg-green-950/30";
    if (daysLeft > 0) return "bg-yellow-50 dark:bg-yellow-950/30";
    return "bg-red-50 dark:bg-red-950/30";
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* LOGO SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-3 rounded-xl border bg-muted/10">
        <Avatar className="h-32 w-32 border-4 border-background shadow-md">
          <AvatarImage
            src={ formData.logo?.status !== StorageFileStatus.Delete ? formData.logo?.url || "" : "" }
            className="object-cover bg-white"
          />
          <AvatarFallback className="bg-secondary">
            <Camera className="h-10 w-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-3 text-center md:text-right">
          <h3 className="text-lg font-bold">{t("settings.companyLogo")}</h3>
          <p className="text-sm text-muted-foreground">{t("settings.companyLogoDescription")}</p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
            { (formData.logo?.url == undefined || formData.logo.status === StorageFileStatus.Delete) && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={ () => fileInputRef.current?.click() }
              >
                <Upload className="h-4 w-4 ml-2" /> {t("settings.uploadImage")}
              </Button>
            ) }

            { formData.logo?.url && formData.logo.status !== StorageFileStatus.Delete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={ () => handleRemoveFile(0) }
              >
                <Trash2 className="h-4 w-4 ml-2" /> {t("settings.delete")}
              </Button>
            ) }
          </div>
          <p className="text-xs text-muted-foreground">{t("settings.logoHint")}</p>
          <input
            type="file"
            ref={ fileInputRef }
            className="hidden"
            aria-label={t("settings.uploadCompanyLogo")}
            accept="image/*"
            onChange={ handleFileChange }
          />
        </div>
      </div>

      {/* BASIC INFO */}
      <FieldGroup>
        <FieldsSection title={t("settings.basicData")} columns={ 2 }>
          <TextField
            label={t("settings.companyName")}
            required
            value={ formData.companyName || "" }
            isInvalid={ isInvalid("companyName") }
            error={ getError("companyName") }
            onChange={ (e) =>
            {
              handleChange({ companyName: e.target.value });
              clearError("companyName");
            } }
          />
          <TextField
            label={t("settings.businessActivity")}
            value={ formData.companyBusinessCategory || "" }
            onChange={ (e) => handleChange({ companyBusinessCategory: e.target.value }) }
          />
          <TextField
            label={t("settings.companyPhone")}
            required
            value={ formData.companyPhone || "" }
            isInvalid={ isInvalid("companyPhone") }
            error={ getError("companyPhone") }
            onChange={ (e) =>
            {
              handleChange({ companyPhone: e.target.value });
              clearError("companyPhone");
            } }
          />
          <TextField
            label={t("settings.email")}
            required
            type="email"
            value={ formData.email || "" }
            isInvalid={ isInvalid("email") }
            error={ getError("email") }
            onChange={ (e) =>
            {
              handleChange({ email: e.target.value });
              clearError("email");
            } }
          />
          <FormField label={t("settings.mainBranch")} required>
            <SearchableSelect
              items={ branchState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              value={ formData.branchId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const selected = branchState.entities.data?.find(
                  (s) => s.id.toString() === val
                );
                handleChange({
                  branchId: selected?.id,
                  branch: selected
                });
              } }
              columnsNames={ BranchFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(BranchSlice.entityActions.filter(condition)) }
              isLoading={ branchState.isLoading }
              disabled={ branchState.isLoading }
            />
          </FormField>

          <TextField
            label={t("settings.commercialRegistration")}
            value={ formData.crn || "" }
            onChange={ (e) => handleChange({ crn: e.target.value }) }
          />
          <TextField
            label={t("settings.taxNumber")}
            value={ formData.vatNumber || "" }
            onChange={ (e) => handleChange({ vatNumber: e.target.value }) }
          />
        </FieldsSection>
      </FieldGroup>

      {/* SUBSCRIPTION */}
      <div className="space-y-4 animate-in fade-in">
        <h3 className="text-lg font-semibold">{t("settings.subscriptionDetails")}</h3>
        <div className="grid md:grid-cols-3 gap-4 p-5 rounded-xl border bg-linear-to-br from-muted/40 to-muted/20 shadow-sm">
          <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
            <Label className="text-xs text-muted-foreground">{t("settings.startDate")}</Label>
            <p className="text-lg font-semibold tracking-wide text-primary">
              { formData.startDate ? format(new Date(formData.startDate), "dd/MM/yyyy") : "-" }
            </p>
          </div>

          <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
            <Label className="text-xs text-muted-foreground">{t("settings.endDate")}</Label>
            <p className="text-lg font-semibold tracking-wide text-primary">
              { formData.endDate ? format(new Date(formData.endDate), "dd/MM/yyyy") : "-" }
            </p>
          </div>

          <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
            <Label className="text-xs text-muted-foreground">{t("settings.remainingPeriod")}</Label>
            { formData.endDate
              ? (() =>
              {
                const daysLeft = differenceInDays(new Date(formData.endDate), new Date());
                return (
                  <p
                    className={ `text-lg font-bold px-2 py-1 rounded-md inline-block w-fit ${getDaysStatusColor(daysLeft)} ${getDaysBgColor(daysLeft)}` }
                  >
                    { getDaysLeftText(daysLeft) }
                  </p>
                );
              })()
              : "-" }
          </div>
        </div>
      </div>
    </div>
  );
}