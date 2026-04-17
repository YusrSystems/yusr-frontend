import { StorageFileStatus, type StorageFile, type ValidationRule, Validators } from "yusr-core";
import type { CommonChangeDialogProps } from "yusr-ui";
import {
    ChangeDialog,
    FieldGroup,
    NumberField,
    StorageFileField,
    TextField,
    useEntityForm,
} from "yusr-ui";
import { useMemo, useRef } from "react";
import { useAppDispatch } from "@/app/core/state/store";
import type Vehicle from "@/app/core/data/vehicle";

export default function ChangeVehicleDialog({
    entity,
    mode,
    service,
    onSuccess,
}: CommonChangeDialogProps<Vehicle>) {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validationRules: ValidationRule<Partial<Vehicle>>[] = useMemo(
        () => [
            {
                field: "name",
                selector: (d) => d.name,
                validators: [Validators.required("يرجى إدخال اسم المركبة")],
            },
            {
                field: "chairsNumber",
                selector: (d) => d.chairsNumber,
                validators: [
                    Validators.required("يرجى إدخال إجمالي عدد المقاعد"),
                    Validators.min(1, "يجب أن يكون عدد المقاعد أكبر من 0"),
                ],
            },
            {
                field: "chairsNumberPerRow",
                selector: (d) => d.chairsNumberPerRow,
                validators: [
                    Validators.required("يرجى إدخال عدد المقاعد في الصف"),
                    Validators.min(1, "يجب أن يكون عدد المقاعد في الصف أكبر من 0"),
                ],
            },
        ],
        []
    );

    const initialValues = useMemo(
        () => ({
            ...entity,
            name: entity?.name || "",
            make: entity?.make || "",
            model: entity?.model || "",
            chairsNumber: entity?.chairsNumber || 0,
            chairsNumberPerRow: entity?.chairsNumberPerRow || 0,
            files: entity?.files || [],
        }),
        [entity]
    );

    const {
        formData,
        handleChange,
        getError,
        isInvalid,
        validate,
    } = useEntityForm<Vehicle>(initialValues, validationRules);

    // --- دوال معالجة الملفات (Storage Files) ---
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const newFiles: StorageFile[] = [];

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            const reader = new FileReader();
            reader.readAsDataURL(file);

            await new Promise<void>((resolve) => {
                reader.onload = () => {
                    newFiles.push({
                        url: null,
                        base64File: reader.result as string, // يتم حفظ الـ Base64 كاملاً لغرض العرض
                        extension: `.${file.name.split(".").pop()}`,
                        contentType: file.type,
                        status: StorageFileStatus.New,
                    });
                    resolve();
                };
            });
        }
        handleChange({ files: [...(formData.files || []), ...newFiles] });
    };

    const handleRemoveFile = (index: number, file: StorageFile) => {
        const updatedFiles = [...(formData.files || [])];
        if (file.url) {
            // إذا كان الملف موجوداً مسبقاً في السيرفر، نقوم بتغيير حالته للحذف
            updatedFiles[index] = { ...updatedFiles[index], status: StorageFileStatus.Delete };
        } else {
            // إذا كان ملفاً جديداً لم يُرفع بعد، نحذفه من المصفوفة مباشرة
            updatedFiles.splice(index, 1);
        }
        handleChange({ files: updatedFiles });
    };

    const getFileSrc = (f?: StorageFile) => f?.url || f?.base64File || "";
    const showPreview = (f?: StorageFile) => f?.status !== StorageFileStatus.Delete;

    const handleDownload = (e: React.MouseEvent, f?: StorageFile) => {
        e.stopPropagation();
        if (!f) return;
        const link = document.createElement("a");
        link.href = getFileSrc(f);
        link.download = "download";
        link.click();
    };

    return (
        <ChangeDialog<Vehicle>
            title={`${mode === "create" ? "إضافة" : "تعديل"} مركبة`}
            className="sm:max-w-2xl"
            formData={formData}
            dialogMode={mode}
            service={service}
            disable={() => false}
            onSuccess={(data) => onSuccess?.(data, mode)}
            validate={validate}
        >
            <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="اسم المركبة"
                        required
                        value={formData.name || ""}
                        onChange={(e) => handleChange({ name: e.target.value })}
                        isInvalid={isInvalid("name")}
                        error={getError("name")}
                    />

                    <TextField
                        label="الشركة المصنعة (Make)"
                        value={formData.make || ""}
                        onChange={(e) => handleChange({ make: e.target.value })}
                        isInvalid={isInvalid("make")}
                        error={getError("make")}
                    />

                    <TextField
                        label="الموديل (Model)"
                        value={formData.model || ""}
                        onChange={(e) => handleChange({ model: e.target.value })}
                        isInvalid={isInvalid("model")}
                        error={getError("model")}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <NumberField
                        label="إجمالي عدد المقاعد"
                        required
                        value={formData.chairsNumber || ""}
                        onChange={(e) => handleChange({ chairsNumber: Number(e) })}
                        isInvalid={isInvalid("chairsNumber")}
                        error={getError("chairsNumber")}
                    />

                    <NumberField
                        label="عدد المقاعد في الصف الواحد"
                        required
                        value={formData.chairsNumberPerRow || ""}
                        onChange={(e) => handleChange({ chairsNumberPerRow: Number(e) })}
                        isInvalid={isInvalid("chairsNumberPerRow")}
                        error={getError("chairsNumberPerRow")}
                    />
                </div>

                <div className="mt-6">
                    <StorageFileField
                        label="صور وملفات المركبة"
                        file={formData.files}
                        onFileChange={handleFileChange}
                        onRemove={handleRemoveFile}
                        onDownload={handleDownload}
                        getFileSrc={getFileSrc}
                        showPreview={showPreview}
                        fileInputRef={fileInputRef}
                        dir="rtl"
                    />
                </div>
            </FieldGroup>
        </ChangeDialog>
    );
}